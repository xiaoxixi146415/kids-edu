<script setup lang="ts">
/**
 * 「今日小挑战」闯关弹层：一次 5 题，听题/看题点选。
 * - 选中即判：答对加分并播报；答错先提醒，随后高亮正确项再放行下一题（无挫败感纠错学习）
 * - 每题有 🔊 重听按钮（题目文案全部为中文，交给 TTS 念）
 * - 静音/不支持语音时给出打开声音的提示（听音题不显示答案）
 * - 答错后需等正确项揭示才能进入下一题，保证纠错被看见
 * - 结算屏按答对题数显示星星，≥3 题算闯关成功并 emit finish
 * - 结算屏列出答错的题与正确谜底，方便家长带着回顾
 * - 复用 DetailDialog 弹层语义（焦点圈定 / Esc / 可访问名）
 */
import { computed, nextTick, onUnmounted, ref, watch } from 'vue'
import { useSpeech } from '../composables/useSpeech'
import { useProgress } from '../composables/useProgress'
import { passThreshold, type QuizQuestion } from '../composables/useChallenge'
import DetailDialog from './DetailDialog.vue'

const props = withDefaults(
  defineProps<{
    open: boolean
    questions: QuizQuestion[]
    tone?: string
    /** 所属栏目：答错的题写进该栏目错题本 */
    module?: string
  }>(),
  { tone: 'detail-settings', module: '' }
)

const emit = defineEmits<{ (e: 'close'): void; (e: 'finish', score: number, total: number): void }>()

const { speak, stop, muted, canSpeak } = useSpeech()
const { recordWrong, clearWrong } = useProgress()

const index = ref(0)
const score = ref(0)
const chosen = ref<number | null>(null)
const reveal = ref(false)
const done = ref(false)
const feedback = ref('')
const fbOk = ref(true)
/** 答错的题：结算屏给家长/孩子回顾用 */
interface Missed {
  n: number
  prompt: string
  answer: string
}
const missed = ref<Missed[]>([])
let revealTimer: number | undefined
let finishFired = false

const q = computed(() => props.questions[index.value])
const total = computed(() => props.questions.length)
const isLast = computed(() => index.value >= total.value - 1)
const passed = computed(() => score.value >= passThreshold(total.value))
/** 能否靠听答题：静音或不支持语音时给出提示，不再把题目文字当答案显示 */
const canHear = computed(() => canSpeak.value)
const noSoundText = computed(() =>
  muted.value
    ? '声音关掉了，点右上角的小喇叭打开声音，再听一遍吧'
    : '这台设备没有中文语音，先去列表里看卡片吧'
)
/** 答错后要等正确项揭示出来才能进入下一题，避免孩子错过纠错 */
const canGoNext = computed(() => {
  if (chosen.value === null) return false
  if (q.value && chosen.value !== q.value.answer && !reveal.value) return false
  return true
})

function speakQ() {
  if (!props.open || done.value) return
  if (q.value) speak(q.value.say)
}

function resetQuestion() {
  chosen.value = null
  reveal.value = false
  feedback.value = ''
  fbOk.value = true
  window.clearTimeout(revealTimer)
}

function restart() {
  index.value = 0
  score.value = 0
  done.value = false
  finishFired = false
  missed.value = []
  resetQuestion()
  nextTick(speakQ)
}

function onOpen() {
  index.value = 0
  score.value = 0
  done.value = false
  finishFired = false
  missed.value = []
  resetQuestion()
  nextTick(speakQ)
}

function onClose() {
  window.clearTimeout(revealTimer)
  stop()
  emit('close')
}

watch(
  () => props.open,
  (o) => (o ? onOpen() : onClose())
)

onUnmounted(() => {
  window.clearTimeout(revealTimer)
  stop()
})

function choose(i: number) {
  if (chosen.value !== null || done.value || !q.value) return
  chosen.value = i
  const right = i === q.value.answer
  if (right) {
    score.value += 1
    feedback.value = '答对啦，真棒！'
    fbOk.value = true
    speak('答对啦，真棒！')
    // 以前答错过的题这次答对了：从错题本移出
    if (props.module && q.value.refId) clearWrong(props.module, q.value.refId)
  } else {
    feedback.value = '再想一想～'
    fbOk.value = false
    speak('再想一想，听一听。')
    const answer = q.value.options[q.value.answer]?.label ?? ''
    // 写进栏目错题本：家长报告能看到「哪里卡住」，下次挑战也优先复习
    if (props.module && q.value.refId) {
      recordWrong(props.module, {
        id: q.value.refId,
        prompt: q.value.show ?? '',
        answer,
      })
    }
    missed.value = [
      ...missed.value,
      {
        n: index.value + 1,
        prompt: q.value.show ?? '',
        answer,
      },
    ]
    revealTimer = window.setTimeout(() => {
      reveal.value = true
      if (q.value) {
        feedback.value = `正确答案是「${q.value.options[q.value.answer]?.label ?? ''}」`
        speak(`正确答案是${q.value.options[q.value.answer]?.label ?? ''}`)
      }
    }, 900)
  }
}

function next() {
  if (chosen.value === null) return
  if (isLast.value) {
    done.value = true
    if (!finishFired) {
      finishFired = true
      emit('finish', score.value, total.value)
    }
    if (passed.value) speak('闯关成功，太棒了！')
    return
  }
  index.value += 1
  resetQuestion()
  nextTick(speakQ)
}

/** 选项配色：答对 / 答错 / 答错后揭示正确项 / 其余淡化 */
function optClass(i: number): string {
  if (chosen.value === null) return ''
  if (i === q.value?.answer && (chosen.value === i || reveal.value)) return 'cq-opt-correct'
  if (i === chosen.value) return 'cq-opt-wrong'
  return 'cq-opt-dim'
}
</script>

<template>
  <DetailDialog :open="open" title="今日小挑战" :tone="tone" @close="onClose">
    <!-- 闯关中 -->
    <template v-if="open && !done && q">
      <div class="cq-head">
        <div class="cq-dots" aria-hidden="true">
          <span
            v-for="(_, i) in total"
            :key="i"
            class="cq-dot"
            :class="{ done: i < index, now: i === index }"
          ></span>
        </div>
        <span class="cq-score" aria-hidden="true">⭐ {{ score }}</span>
        <p class="sr-only">第 {{ index + 1 }} 题，共 {{ total }} 题</p>
      </div>

      <div class="cq-question">
        <p class="sr-only">{{ q.ask }}</p>
        <button
          v-if="canHear"
          type="button"
          class="cq-replay"
          aria-label="再听一遍题目"
          @click="speakQ"
        >
          🔊
        </button>
        <p class="cq-ask">{{ q.ask }}</p>
        <p v-if="q.show" class="cq-prompt">{{ q.show }}</p>
        <!-- 静音 / 设备无语音：只提示怎么办，不显示听音题的答案 -->
        <p v-else-if="!canHear" class="cq-say">{{ noSoundText }}</p>
      </div>

      <div
        class="cq-options"
        :class="q.variant === 'list' ? 'cq-list' : q.variant === 'chars' ? 'cq-chars' : 'cq-grid'"
        role="group"
        :aria-label="`第 ${index + 1} 题的选项`"
      >
        <button
          v-for="(opt, i) in q.options"
          :key="`${i}-${opt.label}`"
          type="button"
          class="cq-opt"
          :class="optClass(i)"
          :disabled="chosen !== null"
          @click="choose(i)"
        >
          <span v-if="opt.emoji" class="cq-opt-emoji" aria-hidden="true">{{ opt.emoji }}</span>
          <span class="cq-opt-label">{{ opt.label }}</span>
        </button>
      </div>

      <p v-if="feedback" class="cq-feedback" :class="{ ok: fbOk }" role="status">{{ feedback }}</p>

      <div class="cq-actions">
        <button type="button" class="btn btn-primary" :disabled="!canGoNext" @click="next">
          {{ isLast ? '看结果 🎁' : '下一题 →' }}
        </button>
      </div>
    </template>

    <!-- 结算屏 -->
    <template v-else-if="open && done">
      <div class="cq-result">
        <div class="cq-result-emoji" aria-hidden="true">{{ passed ? '🏆' : '💪' }}</div>
        <p class="cq-result-title">{{ passed ? '闯关成功！' : '差一点点哦' }}</p>
        <div class="cq-result-stars" aria-hidden="true">
          <span v-for="i in total" :key="i" class="cq-star" :class="{ on: i <= score }">⭐</span>
        </div>
        <p class="cq-result-msg" role="status">答对了 {{ score }} / {{ total }} 题</p>
        <p v-if="passed" class="cq-result-hint">今天这颗小星星送给你，明天再来挑战哦</p>
        <p v-else class="cq-result-hint">回列表再听一听，答对 {{ passThreshold(total) }} 题就能得星星啦</p>

        <!-- 答错回顾：把正确的谜底留在屏幕上，家长可以带着再读一遍 -->
        <section v-if="missed.length" class="cq-review" aria-label="再看看答错的题">
          <p class="cq-review-title">再看看这几题 👀</p>
          <ul class="cq-review-list">
            <li v-for="m in missed" :key="m.n">
              <span class="cq-review-q">
                第 {{ m.n }} 题<template v-if="m.prompt">：{{ m.prompt }}</template>
              </span>
              <span class="cq-review-a">✅ {{ m.answer }}</span>
            </li>
          </ul>
        </section>

        <div class="cq-result-actions">
          <button type="button" class="btn btn-ghost" @click="restart">再玩一次</button>
          <button type="button" class="btn btn-primary" @click="onClose">完成</button>
        </div>
      </div>
    </template>
  </DetailDialog>
</template>
