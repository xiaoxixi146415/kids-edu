<script setup lang="ts">
/**
 * 电子版「安静书」：一页一机关，纯点选互动。
 *
 * - 顶部：完成进度 + 「书页」选择条（翻到哪页就玩哪页）
 * - 玩法：pick-one 单选点一点；pick-all 把一类全部点进小篮子
 *   （点对收入篮子，点错摇一摇提示再找，无挫败感）
 * - 题目朗读：翻页念引导语、每回合念任务语，右上 🔊 可重听
 * - 整页做完计入学习激励：useProgress.learn('quietbook', 页id)
 *   首次完成 +⭐ 并计入今日任务，App 自动飘星
 */
import { computed, nextTick, onMounted, onUnmounted, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { quietbook } from '../data/quietbook'
import type { QbOption, QbRound } from '../data/quietbook'
import { useSpeech } from '../composables/useSpeech'
import { useProgress } from '../composables/useProgress'

const MODULE = 'quietbook'
const CN = ['一', '二', '三', '四', '五', '六', '七', '八']

const router = useRouter()
const { speak, stop } = useSpeech()
const { learn, isLearned } = useProgress()

const total = quietbook.length
const pageIndex = ref(0)
const roundIndex = ref(0)
/** 当前是否正在玩（false = 整页完成，展示庆祝） */
const playing = ref(true)
/** 本次是否首次完成（有星星） */
const fresh = ref(false)

const picked = ref<number[]>([])
const wrong = ref(-1)
const correctNow = ref(-1)
const busy = ref(false)
const feedback = ref('')
const fbOk = ref(true)
/** 谁不见了：remember=先记一记；play=可以点选了 */
const phase = ref<'remember' | 'play'>('play')

let autoTimer: number | undefined
let wrongTimer: number | undefined
let phaseTimer: number | undefined

const page = computed(() => quietbook[pageIndex.value])
const round = computed<QbRound>(() => page.value.rounds[roundIndex.value])
const pageNo = computed(() => pageIndex.value + 1)
const cnPage = computed(() => CN[pageIndex.value] ?? String(pageNo.value))
const isMany = computed(() => round.value.goal === 'pick-all')
const isSpot = computed(() => round.value.goal === 'spot-diff')
const isShadow = computed(() => round.value.goal === 'shadow')
const isHidden = computed(() => round.value.goal === 'whats-missing')
/** 两个选项是否代表同一个东西（找不同判定用，逐位比较） */
function sameOpt(a: QbOption | undefined, b: QbOption | undefined): boolean {
  if (!a || !b) return false
  return a.emoji === b.emoji && a.color === b.color && a.value === b.value
}
/** 找不同：下排 options 中与上排 reference 不一样的格子 */
const spotDiff = computed<number[]>(() => {
  const r = round.value
  if (r.goal !== 'spot-diff' || !r.reference) return []
  const out: number[] = []
  r.options.forEach((o, i) => {
    if (!sameOpt(o, r.reference?.[i])) out.push(i)
  })
  return out
})
/** 本回合要集齐的总数（多选 / 找不同） */
const targetTotal = computed(() =>
  isSpot.value ? spotDiff.value.length : round.value.answer.length
)
const remaining = computed(() => targetTotal.value - picked.value.length)
/** 当前展示给孩子的题目语（谁不见了：记住阶段用引导语，点选阶段用追问语） */
const askText = computed(() =>
  isHidden.value && phase.value === 'play' && round.value.after ? round.value.after : round.value.ask
)
/** 谁不见了：躲起来之后「回来了」的小伙伴（原班人马里少了那一位） */
const survivorList = computed<QbOption[]>(() => {
  const r = round.value
  if (r.goal !== 'whats-missing') return []
  const gone = r.options[r.answer[0]]
  return (r.memory ?? []).filter((m) => !sameOpt(m, gone))
})
const isDone = computed(() => isLearned(MODULE, page.value.id))
const doneCount = computed(() => quietbook.filter((p) => isLearned(MODULE, p.id)).length)
const pct = computed(() => Math.round((doneCount.value / total) * 100))
/** 本回合选项的显示形态（emoji/color/num），决定布局 */
const kind = computed(() => round.value.options[0]?.kind ?? 'emoji')

function clearTimers() {
  window.clearTimeout(autoTimer)
  window.clearTimeout(wrongTimer)
  window.clearTimeout(phaseTimer)
}

function resetRound() {
  picked.value = []
  wrong.value = -1
  correctNow.value = -1
  feedback.value = ''
  fbOk.value = true
}

/** 打开某页：重置本页状态并走第一回合（引导语与首问合并成一次朗读，避免被取消截断） */
function openPage() {
  clearTimers()
  busy.value = false
  roundIndex.value = 0
  phase.value = 'play'
  resetRound()
  playing.value = true
  fresh.value = false
  const first = page.value.rounds[0]
  nextTick(() => {
    speak(`${page.value.intro}${first?.ask ?? ''}`)
    if (first?.goal === 'whats-missing') {
      // 首回合就是要记住的小家伙：亮出来 → 3 秒后发问
      phase.value = 'remember'
      busy.value = true
      phaseTimer = window.setTimeout(() => {
        phase.value = 'play'
        busy.value = false
        if (first.after) speak(first.after)
      }, 3000)
    }
  })
}

/** 推进到「下一回合」时的流程（谁不见了有「先记一记」阶段） */
function startRoundFlow() {
  const r = round.value
  resetRound()
  phase.value = 'play'
  busy.value = false
  clearTimers()
  if (r.goal === 'whats-missing') {
    phase.value = 'remember'
    busy.value = true
    speak(r.ask)
    phaseTimer = window.setTimeout(() => {
      phase.value = 'play'
      busy.value = false
      if (r.after) speak(r.after)
    }, 3000)
  } else {
    nextTick(sayAsk)
  }
}

function sayAsk() {
  const r = round.value
  if (r.goal === 'whats-missing') {
    speak(phase.value === 'remember' ? r.ask : r.after || r.ask)
  } else {
    speak(r.ask)
  }
}

function advance() {
  if (roundIndex.value < page.value.rounds.length - 1) {
    roundIndex.value += 1
    startRoundFlow()
  } else {
    finishPage()
  }
}

/** 整页完成：记一次学习（首次 +⭐ 计入今日任务） */
function finishPage() {
  clearTimers()
  const first = learn(MODULE, page.value.id)
  fresh.value = first
  playing.value = false
  busy.value = false
  speak(
    first
      ? `第${cnPage.value}页完成啦，你真棒！送你一颗小星星！`
      : `第${cnPage.value}页完成啦，你真棒！`
  )
}

function tap(i: number) {
  if (!playing.value || busy.value) return
  const r = round.value
  if (r.goal === 'whats-missing' && phase.value !== 'play') return

  // 单选族：pick-one / 影子配对 / 谁不见了（点出答案）
  if (r.goal === 'pick-one' || r.goal === 'shadow' || r.goal === 'whats-missing') {
    if (correctNow.value !== -1 || wrong.value === i) return
    if (r.answer.includes(i)) {
      correctNow.value = i
      busy.value = true
      const label = r.options[i]?.label
      if (r.goal === 'shadow') {
        feedback.value = `找到了${label ? label : '它'}的影子，真棒！`
        fbOk.value = true
        speak(`${label ? label : '它'}的影子，找到啦，真棒！`)
      } else if (r.goal === 'whats-missing') {
        feedback.value = `躲起来的是${label ? label : '它'}，你真棒！`
        fbOk.value = true
        speak(`躲起来的是${label ? label : '它'}，你真棒！`)
      } else {
        feedback.value = '答对啦，真棒！'
        fbOk.value = true
        speak('答对啦，真棒！')
      }
      clearTimers()
      autoTimer = window.setTimeout(() => {
        busy.value = false
        advance()
      }, 1100)
    } else {
      wrong.value = i
      feedback.value = '再想一想，点对的那个哦'
      fbOk.value = false
      speak('再想一想，点对的那个。')
      clearTimers()
      wrongTimer = window.setTimeout(() => {
        wrong.value = -1
      }, 520)
    }
    return
  }

  // 收集族：pick-all 点对的进小篮 / spot-diff 把变样的格子都点出来
  if (picked.value.includes(i) || wrong.value === i) return
  const targets = r.goal === 'spot-diff' ? spotDiff.value : r.answer
  if (targets.includes(i)) {
    picked.value = [...picked.value, i]
    const label = r.options[i]?.label
    if (r.goal === 'spot-diff') {
      speak(label ? `${label}，变样啦，对！` : '这个不一样，对！')
    } else {
      speak(label ? `${label}，对！` : '对啦！')
    }
    if (picked.value.length === targets.length) {
      busy.value = true
      feedback.value = '全都找到啦！'
      fbOk.value = true
      speak('全都找到啦，真棒！')
      clearTimers()
      autoTimer = window.setTimeout(() => {
        busy.value = false
        advance()
      }, 1200)
    }
  } else {
    wrong.value = i
    feedback.value = '这个不对哦，再找一找'
    fbOk.value = false
    speak('这个不对，再找一找。')
    clearTimers()
    wrongTimer = window.setTimeout(() => {
      wrong.value = -1
    }, 520)
  }
}

function optClass(i: number): string {
  const r = round.value
  if (r.goal === 'pick-one') {
    if (wrong.value === i && correctNow.value === -1) return 'qb-wrong'
    if (correctNow.value !== -1) return i === r.answer[0] ? 'qb-correct' : 'qb-dim'
    return ''
  }
  const got = picked.value.includes(i)
  if (wrong.value === i && !got) return 'qb-wrong'
  if (got) return 'qb-picked'
  return ''
}

function optName(o: QbOption | undefined): string {
  if (!o) return ''
  if (o.label) return o.label
  if (o.kind === 'num') return `数字${o.value}`
  return o.emoji ?? ''
}

function emojiOf(o: QbOption | undefined): string {
  if (!o) return ''
  if (o.kind === 'emoji') return o.emoji ?? ''
  if (o.kind === 'num') return String(o.value)
  return ''
}

/** 翻页统一入口：重置本页并朗读引导语 */
function goto(i: number) {
  if (i < 0 || i >= total || i === pageIndex.value) return
  pageIndex.value = i
}

watch(pageIndex, () => {
  openPage()
})

function replayPage() {
  openPage()
}

function nextPageFromDone() {
  if (pageNo.value < total) goto(pageNo.value)
  else router.push('/')
}

onMounted(() => {
  // 进页面先念引导语（来自首页点卡的手势，浏览器允许发声），再走首回合
  openPage()
})

onUnmounted(() => {
  clearTimers()
  stop()
})
</script>

<template>
  <div class="quietbook">
    <!-- 完成进度 -->
    <section class="qb-progress" aria-label="安静书完成进度">
      <div class="qb-progress-head">
        <span class="qb-progress-title">🧸 我的安静书</span>
        <span class="qb-progress-num">完成 {{ doneCount }}/{{ total }} 页</span>
      </div>
      <div class="progress-track">
        <div class="progress-fill" :style="{ width: `${pct}%` }"></div>
      </div>
    </section>

    <!-- 书页选择条 -->
    <div class="qb-chips" role="tablist" aria-label="选择安静书的页面">
      <button
        v-for="(p, i) in quietbook"
        :key="p.id"
        type="button"
        class="qb-chip"
        :class="{ active: i === pageIndex, done: isLearned(MODULE, p.id) }"
        :role="'tab'"
        :aria-selected="i === pageIndex"
        :style="
          i === pageIndex ? { borderColor: p.accent, boxShadow: `0 0 0 3px ${p.accent}30` } : {}
        "
        @click="goto(i)"
      >
        <span class="qb-chip-emoji" aria-hidden="true">{{ p.emoji }}</span>
        <span class="qb-chip-name">{{ p.title }}</span>
        <span v-if="isLearned(MODULE, p.id)" class="qb-chip-check" aria-hidden="true">✓</span>
        <span class="sr-only">
          第{{ CN[i] ?? i + 1 }}页{{ p.title }}{{ i === pageIndex ? '，正在玩' : '，点这里去玩' }}{{
            isLearned(MODULE, p.id) ? '，玩过了' : ''
          }}
        </span>
      </button>
    </div>

    <!-- 当前页机关 -->
    <Transition name="qb-page" mode="out-in">
      <section :key="page.id" class="qb-board" :style="{ background: page.bg }">
        <div class="qb-head">
          <span class="qb-pageno" :style="{ background: page.accent }">第 {{ cnPage }} 页</span>
          <span v-if="isDone && playing" class="qb-cleared" aria-label="这页玩过啦">✨ 玩过</span>
          <span class="qb-head-spacer"></span>
          <span v-if="playing" class="qb-dots" aria-hidden="true">
            <i
              v-for="(_, i) in page.rounds"
              :key="i"
              :style="i <= roundIndex ? { background: page.accent } : {}"
              :class="{ now: i === roundIndex }"
            ></i>
          </span>
          <button
            v-if="playing"
            type="button"
            class="qb-listen"
            :aria-label="`再听一遍：${askText}`"
            @click="sayAsk"
          >
            🔊
          </button>
        </div>

        <template v-if="playing">
          <h2 class="qb-pagetitle">
            <span aria-hidden="true">{{ page.emoji }}</span> {{ page.title }}
          </h2>

          <!-- 找不同：上排「原样」对照栏 -->
          <div
            v-if="isSpot && round.reference"
            class="qb-ref"
            role="group"
            :aria-label="`上面是原样：${round.reference.map((ro) => optName(ro)).join('、')}`"
          >
            <span class="qb-ref-tag" aria-hidden="true">👀 上边是原样</span>
            <span v-for="(ro, ri) in round.reference" :key="ri" class="qb-ref-cell">
              <span class="qb-emoji" aria-hidden="true">{{ ro.emoji }}</span>
              <span v-if="ro.label" class="qb-opt-label">{{ ro.label }}</span>
            </span>
          </div>

          <!-- 题目区（数数页/影子主角由 quantity 渲染） -->
          <div
            v-if="round.quantity"
            class="qb-qty"
            :class="{ one: round.quantity.count === 1 }"
            aria-hidden="true"
          >
            <span v-for="n in round.quantity.count" :key="n" class="qb-qty-item">{{ round.quantity.emoji }}</span>
          </div>

          <!-- 谁不见了：先记住这串小家伙 -->
          <div
            v-if="isHidden && phase === 'remember' && round.memory"
            class="qb-memory"
            role="group"
            :aria-label="`要记住的：${round.memory.map((m) => optName(m)).join('、')}`"
          >
            <span v-for="(m, mi) in round.memory" :key="mi" class="qb-memory-item">{{ m.emoji }}</span>
            <span class="qb-memory-tip">👀 小眼睛看仔细，把它们都记住哦！</span>
          </div>

          <!-- 谁不见了：躲猫猫结束，回来的小伙伴站好队，找找少了谁 -->
          <div
            v-if="isHidden && phase === 'play' && survivorList.length > 0"
            class="qb-memory qb-survivors"
            role="group"
            :aria-label="`回来了：${survivorList.map((m) => optName(m)).join('、')}`"
          >
            <span v-for="(m, mi) in survivorList" :key="mi" class="qb-memory-item">{{ m.emoji }}</span>
            <span class="qb-memory-tip">🙈 它们回来啦，下面少了谁呀？</span>
          </div>

          <p class="qb-ask">{{ askText }}</p>

          <!-- pick-all：小篮子 -->
          <div v-if="isMany" class="qb-tray">
            <span class="qb-tray-ico" aria-hidden="true">🧺</span>
            <span v-if="picked.length === 0" class="qb-tray-tip">小篮子还空着，把对的放进来吧</span>
            <span
              v-for="i in picked"
              :key="i"
              class="qb-tray-item"
              :aria-label="`已经放进篮子：${optName(round.options[i])}`"
              >{{ emojiOf(round.options[i]) }}</span
            >
            <span v-if="remaining > 0" class="qb-remain" aria-live="polite">还要找 {{ remaining }} 个</span>
          </div>

          <!-- 找不同：找到进度 -->
          <div v-else-if="isSpot" class="qb-tray">
            <span class="qb-tray-ico" aria-hidden="true">🔍</span>
            <span v-if="picked.length === 0" class="qb-tray-tip">和上排比一比，把悄悄变样的小格子点出来</span>
            <span
              v-for="i in picked"
              :key="i"
              class="qb-tray-item"
              :aria-label="`已经找到：${optName(round.options[i])}`"
              >{{ emojiOf(round.options[i]) }}</span
            >
            <span v-if="remaining > 0" class="qb-remain" aria-live="polite">还差 {{ remaining }} 个不一样</span>
          </div>

          <!-- 点选区：谁不见了的「记住」阶段先不展示选项 -->
          <template v-if="!(isHidden && phase === 'remember')">
            <!-- 选项 -->
            <div
              :key="`${pageIndex}-${roundIndex}`"
              class="qb-options"
              :class="`qb-kind-${kind}`"
              role="group"
              :aria-label="`第 ${roundIndex + 1} 回合，${askText}`"
            >
              <button
                v-for="(opt, i) in round.options"
                :key="i"
                type="button"
                class="qb-opt"
                :class="[optClass(i), isShadow ? 'qb-opt-shadow' : '']"
                :aria-label="isShadow && opt.label ? `${opt.label}的影子` : optName(opt)"
                :disabled="busy"
                @click="tap(i)"
              >
                <span v-if="opt.kind === 'color'" class="qb-dot" aria-hidden="true" :style="{ backgroundColor: opt.color }"></span>
                <span v-else-if="opt.kind === 'num'" class="qb-num" aria-hidden="true">{{ opt.value }}</span>
                <span v-else class="qb-emoji" aria-hidden="true">{{ opt.emoji }}</span>
                <span v-if="opt.kind !== 'num' && opt.label && !isShadow" class="qb-opt-label">{{ opt.label }}</span>
                <span v-if="isShadow" class="qb-shadow-tag">影子</span>
              </button>
            </div>

            <p class="qb-feedback" :class="{ ok: fbOk }" role="status" aria-live="polite">{{ feedback }}</p>
          </template>
        </template>

        <!-- 整页完成庆祝 -->
        <div v-else class="qb-done" role="status">
          <div class="qb-done-stars" aria-hidden="true">
            <span>⭐</span><span>⭐</span><span>⭐</span>
          </div>
          <p class="qb-done-emoji" aria-hidden="true">{{ page.emoji }}</p>
          <p class="qb-done-title">第 {{ cnPage }} 页完成啦！</p>
          <p class="qb-done-sub">{{ fresh ? '你好棒，小星星送给你！' : '玩得真开心，明天再来吧！' }}</p>
          <div class="qb-done-actions">
            <button type="button" class="btn btn-ghost" @click="replayPage">再玩一次</button>
            <button v-if="pageNo < total" type="button" class="btn btn-primary" @click="nextPageFromDone">
              下一页 ›
            </button>
            <button v-else type="button" class="btn btn-primary" @click="router.push('/')">
              回乐园 🏠
            </button>
          </div>
        </div>
      </section>
    </Transition>

    <!-- 底部翻页 -->
    <div class="qb-nav">
      <button
        type="button"
        class="btn btn-ghost"
        :disabled="pageIndex === 0 || !playing"
        @click="goto(pageIndex - 1)"
      >
        ‹ 上一页
      </button>
      <span class="qb-nav-mid" aria-hidden="true">📖 {{ pageNo }} / {{ total }}</span>
      <button
        type="button"
        class="btn btn-primary"
        :disabled="pageIndex >= total - 1 || !playing"
        @click="goto(pageIndex + 1)"
      >
        下一页 ›
      </button>
    </div>
  </div>
</template>

<style scoped>
.quietbook {
  padding-top: 4px;
}

/* —— 顶部进度 —— */
.qb-progress {
  background: rgba(255, 255, 255, 0.62);
  border-radius: var(--radius-lg);
  padding: 12px var(--space-4) var(--space-3);
  box-shadow: var(--shadow-sm);
}
.qb-progress-head {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: var(--space-3);
}
.qb-progress-title {
  font-size: var(--text-label);
  font-weight: 700;
}
.qb-progress-num {
  font-size: 17px;
  font-weight: 800;
  color: #0369a1;
}

/* —— 书页选择条 —— */
.qb-chips {
  display: flex;
  gap: 10px;
  margin: 14px -4px 4px;
  padding: 4px;
  overflow-x: auto;
  scroll-snap-type: x proximity;
  -webkit-overflow-scrolling: touch;
}
.qb-chip {
  position: relative;
  flex: 0 0 92px;
  scroll-snap-align: start;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4px;
  min-height: 86px;
  padding: 8px 6px;
  border: 2px solid transparent;
  border-radius: 20px;
  background: rgba(255, 255, 255, 0.8);
  color: var(--color-on-surface);
  box-shadow: var(--shadow-sm);
  transition:
    transform var(--duration-fast) ease,
    box-shadow var(--duration-fast) ease;
}
.qb-chip:active {
  transform: scale(0.94);
}
.qb-chip-emoji {
  font-size: 30px;
  line-height: 1;
}
.qb-chip-name {
  font-size: 13px;
  font-weight: 800;
  white-space: nowrap;
}
.qb-chip-check {
  position: absolute;
  top: 4px;
  right: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: #16a34a;
  color: #fff;
  font-size: 12px;
  font-weight: 900;
}

/* —— 机关面板 —— */
.qb-board {
  position: relative;
  margin-top: 12px;
  border-radius: 30px;
  padding: 16px 16px 20px;
  box-shadow: var(--shadow-md);
  border: 3px dashed rgba(120, 100, 80, 0.18);
  min-height: 470px;
  display: flex;
  flex-direction: column;
  text-align: center;
}
.qb-head {
  display: flex;
  align-items: center;
  gap: 8px;
}
.qb-pageno {
  padding: 4px 14px;
  border-radius: var(--radius-pill);
  color: #fff;
  font-size: 15px;
  font-weight: 800;
}
.qb-cleared {
  padding: 4px 10px;
  border-radius: var(--radius-pill);
  background: rgba(255, 255, 255, 0.75);
  font-size: 14px;
  font-weight: 800;
  color: #16a34a;
}
.qb-head-spacer {
  flex: 1;
}
.qb-dots {
  display: flex;
  gap: 5px;
}
.qb-dots i {
  display: block;
  width: 9px;
  height: 9px;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.12);
  transition: width var(--duration-mid) ease;
}
.qb-dots i.now {
  width: 20px;
  border-radius: var(--radius-pill);
}
.qb-listen {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  border: none;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.85);
  box-shadow: var(--shadow-sm);
  font-size: 22px;
}
.qb-listen:active {
  transform: scale(0.9);
}

.qb-pagetitle {
  margin-top: 6px;
  font-size: 24px;
  font-weight: 900;
  color: var(--color-on-surface);
}
.qb-pagetitle span {
  font-size: 26px;
}

/* 数数/场景展示区 */
.qb-qty {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 8px;
  min-height: 54px;
  margin-top: 10px;
  padding: 10px 12px;
  background: rgba(255, 255, 255, 0.72);
  border-radius: 20px;
}
.qb-qty-item {
  font-size: 42px;
  line-height: 1.15;
  animation: qb-pop-in 0.35s var(--ease-pop);
}
.qb-qty.one {
  min-height: 84px;
  align-items: center;
}
.qb-qty.one .qb-qty-item {
  font-size: 72px;
}
@keyframes qb-pop-in {
  from {
    transform: scale(0.4);
    opacity: 0;
  }
  to {
    transform: scale(1);
    opacity: 1;
  }
}

.qb-ask {
  margin-top: 10px;
  font-size: 21px;
  font-weight: 800;
  line-height: 1.55;
  color: var(--color-on-surface);
}

/* —— pick-all 小篮子 —— */
.qb-tray {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 10px;
  padding: 8px 12px;
  min-height: 52px;
  background: rgba(255, 255, 255, 0.72);
  border-radius: 18px;
  flex-wrap: wrap;
}
.qb-tray-ico {
  font-size: 26px;
}
.qb-tray-tip {
  font-size: 15px;
  font-weight: 700;
  color: var(--color-text-secondary);
}
.qb-tray-item {
  font-size: 26px;
  line-height: 1;
  animation: qb-pop-in 0.3s var(--ease-pop);
}
.qb-remain {
  margin-left: auto;
  padding: 3px 12px;
  border-radius: var(--radius-pill);
  background: #ea580c;
  color: #fff;
  font-size: 14px;
  font-weight: 800;
}

/* —— 选项 —— */
.qb-options {
  display: grid;
  gap: 12px;
  margin-top: 14px;
}
.qb-options.qb-kind-emoji {
  grid-template-columns: repeat(auto-fill, minmax(96px, 1fr));
}
.qb-options.qb-kind-num {
  grid-template-columns: repeat(3, minmax(0, 1fr));
  max-width: 340px;
  margin-left: auto;
  margin-right: auto;
}
.qb-options.qb-kind-color {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 10px 12px;
}

.qb-opt {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4px;
  min-height: 96px;
  padding: 10px 6px;
  border: none;
  border-radius: 22px;
  background: rgba(255, 255, 255, 0.92);
  color: var(--color-on-surface);
  box-shadow: var(--shadow-sm);
  transition:
    transform var(--duration-fast) ease,
    background var(--duration-fast) ease,
    opacity var(--duration-fast) ease;
}
.qb-opt:not(:disabled):active {
  transform: scale(0.93);
}
.qb-emoji {
  font-size: 44px;
  line-height: 1.1;
}
.qb-opt-label {
  font-size: 15px;
  font-weight: 800;
  line-height: 1.3;
}

/* 数字选项 */
.qb-options.qb-kind-num .qb-opt {
  min-height: 88px;
  border-radius: 24px;
}
.qb-num {
  font-size: 52px;
  line-height: 1;
  font-weight: 900;
  color: inherit;
}

/* 颜色选项 */
.qb-options.qb-kind-color .qb-opt {
  width: 78px;
  min-height: 108px;
  border-radius: 24px;
  gap: 6px;
}
.qb-dot {
  width: 62px;
  height: 62px;
  border-radius: 50%;
  box-shadow:
    inset 0 0 0 5px rgba(255, 255, 255, 0.85),
    var(--shadow-sm);
}

/* 回合反馈状态 */
.qb-opt.qb-correct {
  background: #16a34a;
  color: #fff;
  animation: qb-bounce 0.4s var(--ease-pop);
}
.qb-opt.qb-picked {
  background: #16a34a;
  color: #fff;
  box-shadow: inset 0 0 0 3px rgba(255, 255, 255, 0.6);
}
.qb-opt.qb-wrong {
  background: #fff;
  animation: qb-shake 0.4s ease;
}
.qb-opt.qb-wrong .qb-emoji {
  filter: grayscale(0.2);
}
.qb-opt.qb-wrong .qb-opt-label,
.qb-opt.qb-wrong .qb-num {
  color: #dc2626;
}
.qb-opt.qb-dim {
  opacity: 0.4;
}
.qb-opt:disabled {
  cursor: default;
}

@keyframes qb-shake {
  0%,
  100% {
    transform: translateX(0);
  }
  25% {
    transform: translateX(-7px);
  }
  75% {
    transform: translateX(7px);
  }
}
@keyframes qb-bounce {
  0% {
    transform: scale(1);
  }
  45% {
    transform: scale(1.12);
  }
  100% {
    transform: scale(1);
  }
}

.qb-feedback {
  min-height: 1.6em;
  margin-top: 10px;
  font-size: 20px;
  font-weight: 800;
  color: #dc2626;
}
.qb-feedback.ok {
  color: #15803d;
}

/* —— 整页完成 —— */
.qb-done {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 24px 0 8px;
}
.qb-done-stars {
  display: flex;
  gap: 10px;
  font-size: 34px;
}
.qb-done-stars span {
  animation: qb-star-float 1s var(--ease-pop) both;
}
.qb-done-stars span:nth-child(2) {
  animation-delay: 0.15s;
}
.qb-done-stars span:nth-child(3) {
  animation-delay: 0.3s;
}
@keyframes qb-star-float {
  0% {
    transform: translateY(14px) scale(0.3);
    opacity: 0;
  }
  60% {
    transform: translateY(-6px) scale(1.2);
  }
  100% {
    transform: translateY(0) scale(1);
    opacity: 1;
  }
}
.qb-done-emoji {
  margin-top: 6px;
  font-size: 76px;
  line-height: 1.1;
}
.qb-done-title {
  margin-top: 4px;
  font-size: 34px;
  font-weight: 900;
  color: var(--color-on-surface);
}
.qb-done-sub {
  margin-top: 6px;
  font-size: 19px;
  font-weight: 800;
  color: #15803d;
}
.qb-done-actions {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: var(--space-3);
  margin-top: 20px;
}

/* —— 底部翻页 —— */
.qb-nav {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-3);
  margin-top: 16px;
}
.qb-nav .btn {
  padding: var(--space-3) 22px;
}
.qb-nav-mid {
  font-size: 17px;
  font-weight: 800;
  color: var(--color-text-secondary);
}

/* —— 翻页过渡 —— */
.qb-page-enter-active,
.qb-page-leave-active {
  transition:
    opacity var(--duration-mid) ease,
    transform var(--duration-mid) ease;
}
.qb-page-enter-from {
  opacity: 0;
  transform: translateX(24px);
}
.qb-page-leave-to {
  opacity: 0;
  transform: translateX(-24px);
}

/* —— 找不同：上排对照栏 —— */
.qb-ref {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: flex-end;
  gap: 8px;
  margin-top: 10px;
  padding: 10px 12px;
  background: rgba(255, 255, 255, 0.72);
  border-radius: 20px;
}
.qb-ref-tag {
  width: 100%;
  font-size: 15px;
  font-weight: 800;
  color: var(--color-text-secondary);
}
.qb-ref-cell {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  min-width: 64px;
  padding: 6px 4px;
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.6);
}
.qb-ref-cell .qb-emoji {
  font-size: 36px;
}
.qb-ref-cell .qb-opt-label {
  font-size: 13px;
}

/* —— 谁不见了：记住阶段 —— */
.qb-memory {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  gap: 10px 14px;
  margin-top: 10px;
  padding: 12px;
  min-height: 72px;
  background: rgba(255, 255, 255, 0.78);
  border-radius: 22px;
}
.qb-memory-item {
  font-size: 46px;
  line-height: 1.15;
  animation: qb-pop-in 0.35s var(--ease-pop);
}
.qb-memory-tip {
  width: 100%;
  font-size: 16px;
  font-weight: 800;
  color: #6366f1;
}
.qb-survivors .qb-memory-item {
  font-size: 40px;
}
.qb-survivors .qb-memory-tip {
  color: #7c3aed;
}

/* —— 影子配对：把彩色 emoji 压成黑影 —— */
.qb-opt.qb-opt-shadow {
  background: #f1f5f9;
}
.qb-opt-shadow .qb-emoji {
  filter: brightness(0);
  opacity: 0.85;
}
.qb-opt-shadow .qb-shadow-tag {
  padding: 1px 10px;
  border-radius: var(--radius-pill);
  background: rgba(100, 116, 139, 0.18);
  color: #475569;
  font-size: 13px;
  font-weight: 800;
}
.qb-opt.qb-opt-shadow.qb-correct {
  background: #16a34a;
}
.qb-opt.qb-opt-shadow.qb-correct .qb-shadow-tag {
  background: rgba(255, 255, 255, 0.28);
  color: #fff;
}

@media (prefers-reduced-motion: reduce) {
  .qb-qty-item,
  .qb-tray-item,
  .qb-memory-item,
  .qb-opt.qb-correct,
  .qb-done-stars span {
    animation: none;
  }
  .qb-opt.qb-wrong {
    animation: none;
  }
  .qb-page-enter-active,
  .qb-page-leave-active {
    transition: none;
  }
  .qb-page-enter-from,
  .qb-page-leave-to {
    opacity: 1;
    transform: none;
  }
}
</style>
