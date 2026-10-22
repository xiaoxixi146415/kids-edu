<script setup lang="ts">
/**
 * 家长报告（本地只读 + 重置）：
 * - 今天 / 近 7 天：学习条数、得星、闯关次数
 * - 各栏目完成度（与 useProgress 同一份数据，刷新不漂移）
 * - 最近答错的挑战题，点一下回到对应内容再看一遍
 * - 清空学习记录：两步确认，沿用 useProgress.reset()
 *
 * 只读取本机 localStorage，不采集、不上传任何信息。
 */
import { computed, onUnmounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { CATEGORIES } from '../data/categories'
import { useProgress, type WrongEntry } from '../composables/useProgress'
import { useAchievements } from '../composables/useAchievements'
import BadgeShelf from '../components/BadgeShelf.vue'

const router = useRouter()
const { stars, streak, todayCount, dailyGoal, learnedCount, recentDays, wrong, reset } = useProgress()
const { achievements } = useAchievements()

const WEEK = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']

const days = computed(() => recentDays(7))
const weekLearned = computed(() => days.value.reduce((sum, d) => sum + d.learned, 0))
const weekStars = computed(() => days.value.reduce((sum, d) => sum + d.stars, 0))
const weekQuiz = computed(() => days.value.reduce((sum, d) => sum + d.quiz, 0))

function dayLabel(date: string, i: number): string {
  if (i === 0) return '今天'
  if (i === 1) return '昨天'
  const d = new Date(`${date}T00:00:00`)
  return `${d.getMonth() + 1}月${d.getDate()}日 ${WEEK[d.getDay()]}`
}

/** 各栏目完成度：旧 id 可能比总量多，展示时按总量截断 */
const modules = computed(() =>
  CATEGORIES.map((c) => {
    const learned = Math.min(learnedCount(c.module), c.total)
    return { ...c, learned, pct: Math.round((learned / c.total) * 100) }
  })
)
const overallLearned = computed(() => modules.value.reduce((sum, m) => sum + m.learned, 0))
const overallTotal = computed(() => modules.value.reduce((sum, m) => sum + m.total, 0))

interface MistakeGroup {
  module: string
  title: string
  path: string
  emoji: string
  list: readonly WrongEntry[]
}

/** 每个栏目最多展示 5 道，避免报告页被长列表淹没 */
const mistakeGroups = computed<MistakeGroup[]>(() =>
  CATEGORIES.map((c) => ({
    module: c.module,
    title: c.title,
    path: c.path,
    emoji: c.emoji,
    list: (wrong.value[c.module] ?? []).slice(0, 5),
  })).filter((g) => g.list.length > 0)
)
const wrongCount = computed(() =>
  Object.values(wrong.value).reduce((sum, list) => sum + list.length, 0)
)

/** 唐诗错题 id 是 `诗id:句下标`，续学只需要整首诗的 id */
function entryId(module: string, id: string): string {
  return module === 'tangshi' ? id.split(':')[0] : id
}

function openWrong(module: string, path: string, id: string) {
  router.push({ path, query: { open: entryId(module, id) } })
}

/* —— 近 7 天趋势：与下方文字列表同源，图只是更好看，读屏仍能听到完整汇总 —— */
const chartDays = computed(() =>
  [...days.value].reverse().map((d) => {
    const idx = days.value.findIndex((x) => x.date === d.date)
    const dt = new Date(`${d.date}T00:00:00`)
    return {
      ...d,
      label: dayLabel(d.date, idx),
      short: idx === 0 ? '今天' : `${dt.getMonth() + 1}/${dt.getDate()}`,
    }
  })
)
const weekHasData = computed(
  () => weekLearned.value > 0 || weekStars.value > 0 || weekQuiz.value > 0
)
const trendMax = computed(() =>
  Math.max(1, ...days.value.map((d) => Math.max(d.learned, d.stars)))
)
function barHeight(v: number): string {
  return `${Math.round((v / trendMax.value) * 100)}%`
}
const trendSummary = computed(
  () =>
    '近 7 天学习趋势：' +
    chartDays.value.map((d) => `${d.label} 学习 ${d.learned} 条、得星 ${d.stars} 颗`).join('；') +
    '。'
)

/* —— 复制本周小结：只导出本机已有统计，不联网 —— */
function monthDay(date: string): string {
  const d = new Date(`${date}T00:00:00`)
  return `${d.getMonth() + 1}月${d.getDate()}日`
}

const reportText = computed(() => {
  const list = days.value
  const range = `${monthDay(list[list.length - 1].date)}—${monthDay(list[0].date)}`
  const out = [
    `宝宝乐园 · 学习周报（${range}）`,
    '',
    `本周学习 ${weekLearned.value} 条，得星 ${weekStars.value} 颗，闯关 ${weekQuiz.value} 次`,
    `连续打卡 ${streak.value} 天`,
    `已认识 ${overallLearned.value} / ${overallTotal.value} 个内容`,
  ]
  if (weekHasData.value) {
    out.push('', '各栏目进度：')
    for (const m of modules.value) out.push(`${m.title}：${m.learned}/${m.total}`)
  } else {
    out.push('', '这周还没有学习记录，从今天开始一起读一个故事吧。')
  }
  if (wrongCount.value) {
    out.push('', `还有 ${wrongCount.value} 道答错的题，可以在家长报告里回看。`)
  }
  out.push('', '（记录只保存在这台设备上）')
  return out.join('\n')
})

const copyMsg = ref('')
const reportDetails = ref<HTMLDetailsElement | null>(null)
let copyTimer: number | undefined

async function copyReport() {
  window.clearTimeout(copyTimer)
  try {
    await navigator.clipboard.writeText(reportText.value)
    copyMsg.value = '已复制，可以粘贴到微信里发给家人'
  } catch {
    // 没有剪贴板权限 / 非安全上下文：展开文字版，让家长手动选中复制
    if (reportDetails.value) reportDetails.value.open = true
    copyMsg.value = '浏览器没有允许自动复制，请展开下面的文字版手动复制'
  }
  copyTimer = window.setTimeout(() => (copyMsg.value = ''), 8000)
}

/* —— 清空学习记录：两步确认，防幼儿误触 —— */
const armed = ref(false)
const resetMsg = ref('')
let armTimer: number | undefined

function askReset() {
  if (!armed.value) {
    armed.value = true
    resetMsg.value = '再点一次「确认清空」，所有学习记录都会删除，不能恢复'
    armTimer = window.setTimeout(() => {
      armed.value = false
      resetMsg.value = ''
    }, 5000)
    return
  }
  window.clearTimeout(armTimer)
  armed.value = false
  reset()
  resetMsg.value = '学习记录已经清空，可以从头开始啦'
}

onUnmounted(() => {
  window.clearTimeout(armTimer)
  window.clearTimeout(copyTimer)
})
</script>

<template>
  <div class="parent-page">
    <section class="parent-card" aria-labelledby="parent-today-title">
      <h2 id="parent-today-title" class="parent-section-title">今天学得怎么样</h2>
      <p class="parent-lead">记录只保存在这台设备的浏览器里，不会上传到网络。</p>
      <div class="stats-row parent-stats" role="list" aria-label="学习概览">
        <div class="stat-chip" role="listitem">
          <span class="stat-emoji" aria-hidden="true">📖</span>
          <span class="stat-num">{{ todayCount }}/{{ dailyGoal }}</span>
          <span class="stat-label">今日已学</span>
        </div>
        <div class="stat-chip" role="listitem">
          <span class="stat-emoji" aria-hidden="true">⭐</span>
          <span class="stat-num">{{ stars }}</span>
          <span class="stat-label">小星星</span>
        </div>
        <div class="stat-chip" role="listitem">
          <span class="stat-emoji" aria-hidden="true">🔥</span>
          <span class="stat-num">{{ streak }}</span>
          <span class="stat-label">连续打卡</span>
        </div>
      </div>
      <p class="parent-week-summary">
        近 7 天学了 <b>{{ weekLearned }}</b> 条，得 <b>{{ weekStars }}</b> 颗星，闯关
        <b>{{ weekQuiz }}</b> 次
      </p>
      <div class="report-actions">
        <button type="button" class="btn btn-ghost report-copy" @click="copyReport">
          <span aria-hidden="true">📋</span> 复制本周小结
        </button>
      </div>
      <p v-if="copyMsg" class="report-copy-status" role="status">{{ copyMsg }}</p>
      <details ref="reportDetails" class="report-details">
        <summary>查看文字版小结</summary>
        <pre class="report-text">{{ reportText }}</pre>
      </details>
    </section>

    <BadgeShelf :badges="achievements" variant="parent" />

    <section class="parent-card" aria-labelledby="parent-week-title">
      <h2 id="parent-week-title" class="parent-section-title">近 7 天</h2>
      <div v-if="weekHasData" class="trend-chart" role="img" :aria-label="trendSummary">
        <div v-for="d in chartDays" :key="d.date" class="trend-col" aria-hidden="true">
          <div class="trend-bars">
            <span class="trend-bar trend-bar-learn" :style="{ height: barHeight(d.learned) }"></span>
            <span class="trend-bar trend-bar-star" :style="{ height: barHeight(d.stars) }"></span>
          </div>
          <span class="trend-day">{{ d.short }}</span>
        </div>
      </div>
      <p v-else class="parent-empty">这 7 天还没有记录，今天读一个故事就会出现在这里。</p>
      <p v-if="weekHasData" class="trend-legend" aria-hidden="true">
        <span class="trend-key trend-key-learn"></span>学习条数
        <span class="trend-key trend-key-star"></span>得星
      </p>
      <ul class="parent-week">
        <li v-for="(d, i) in days" :key="d.date">
          <span class="parent-week-day">{{ dayLabel(d.date, i) }}</span>
          <span class="parent-week-nums">
            学习 <b>{{ d.learned }}</b> 条 · ⭐ <b>{{ d.stars }}</b> · 闯关 {{ d.quiz }} 次
          </span>
        </li>
      </ul>
    </section>

    <section class="parent-card" aria-labelledby="parent-modules-title">
      <h2 id="parent-modules-title" class="parent-section-title">各栏目完成度</h2>
      <p class="parent-lead">已经认识 {{ overallLearned }} / {{ overallTotal }} 个内容</p>
      <div v-for="m in modules" :key="m.module" class="parent-module">
        <div class="parent-module-head">
          <span class="parent-module-name"><span aria-hidden="true">{{ m.emoji }}</span> {{ m.title }}</span>
          <span class="parent-module-count">{{ m.learned }}/{{ m.total }}</span>
        </div>
        <div class="progress-track" role="img" :aria-label="`${m.title}完成 ${m.pct}%`">
          <div class="progress-fill" :style="{ width: `${m.pct}%` }"></div>
        </div>
      </div>
    </section>

    <section class="parent-card" aria-labelledby="parent-wrong-title">
      <h2 id="parent-wrong-title" class="parent-section-title">最近答错的题</h2>
      <p v-if="!wrongCount" class="parent-empty">还没有答错的题，继续玩小挑战试试吧。</p>
      <template v-else>
        <p class="parent-lead">
          共 {{ wrongCount }} 道，每个栏目显示最近 5 道。点一下可以回到对应内容再看一遍。
        </p>
        <div v-for="g in mistakeGroups" :key="g.module" class="parent-wrong-group">
          <h3 class="parent-mistake-module">
            <span aria-hidden="true">{{ g.emoji }}</span> {{ g.title }}
          </h3>
          <ul class="parent-mistakes">
            <li v-for="w in g.list" :key="w.id">
              <button type="button" class="parent-mistake-btn" @click="openWrong(g.module, g.path, w.id)">
                <span class="parent-mistake-q">{{ w.prompt || '听音题' }}</span>
                <span class="parent-mistake-a">正确答案：{{ w.answer }}</span>
              </button>
            </li>
          </ul>
        </div>
      </template>
    </section>

    <section class="parent-card" aria-labelledby="parent-reset-title">
      <h2 id="parent-reset-title" class="parent-section-title">学习记录</h2>
      <p class="parent-lead">清空后星星、打卡、错题和继续学习入口都会重置，无法恢复。</p>
      <button type="button" class="btn btn-reset parent-reset" :class="{ armed }" @click="askReset">
        {{ armed ? '⚠️ 确认清空记录' : '清空学习记录' }}
      </button>
      <p v-if="resetMsg" class="reset-msg" role="status">{{ resetMsg }}</p>
    </section>
  </div>
</template>
