/**
 * 学习激励系统（参考儿童学习类 App 的「星星 / 打卡 / 连续天数」设计）：
 *
 * - 学过一个条目（module:key）→ 该条目记「已学」，卡片打勾 ✅
 * - 首次学完一个条目 → 奖励 1 颗星 ⭐
 * - 每天学满 DAILY_GOAL 个（不同）条目 → 今日任务达成
 * - 每天只要学了新条目，就计入连续打卡天数（streak）
 * - 全部持久化到 localStorage（key: kids-edu-progress），App 重开仍在
 *
 * 共享实现：模块级 ref 单例，任意组件调用同一份状态；
 * rewardTick 供 App.vue 监听，在首次得星时播放飘星动效。
 */
import { computed, readonly, ref } from 'vue'

/** 每天建议学习的条数（今日任务目标） */
export const DAILY_GOAL = 3

/** 学习记录 key：module 与条目 id 组合，跨栏目天然隔离 */
function keyOf(module: string, id: string) {
  return `${module}:${id}`
}

/** YYYY-MM-DD（本地时区） */
function dayKey(d: Date = new Date()): string {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

function isYesterday(key: string, today: string): boolean {
  const d = new Date(`${today}T00:00:00`)
  d.setDate(d.getDate() - 1)
  return key === dayKey(d)
}

const STORAGE_KEY = 'kids-edu-progress'

interface Persisted {
  /** 累计星星 */
  stars: number
  /** 所有学过的条目 key */
  learned: string[]
  /** 连续打卡天数（截止 lastDate） */
  streak: number
  /** 最近一次学习日期 YYYY-MM-DD */
  lastDate: string
  /** 今日学过的不同条目 key */
  todayKeys: string[]
}

/* —— 模块级单例状态 —— */
const stars = ref(0)
const learned = ref<string[]>([])
const streak = ref(0)
const todayKeys = ref<string[]>([])
const lastDate = ref('')

/** 今日已学（不同条目）数量 */
const todayCount = ref(0)

/** 每次「首次学完 + 得星」自增，供外层监听播放奖励动效 */
const rewardTick = ref(0)
/** 最近一次奖励文案（星星 +1 等） */
const rewardText = ref('⭐ +1')

/* —— 持久化 —— */
function persist() {
  if (typeof localStorage === 'undefined') return
  const data: Persisted = {
    stars: stars.value,
    learned: learned.value,
    streak: streak.value,
    lastDate: lastDate.value,
    todayKeys: todayKeys.value,
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
}

function load() {
  if (typeof localStorage === 'undefined') return
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return
    const data = JSON.parse(raw) as Partial<Persisted>
    stars.value = typeof data.stars === 'number' ? data.stars : 0
    learned.value = Array.isArray(data.learned) ? data.learned : []
    streak.value = typeof data.streak === 'number' ? data.streak : 0
    lastDate.value = typeof data.lastDate === 'string' ? data.lastDate : ''
    const today = dayKey()
    if (lastDate.value === today) {
      todayKeys.value = Array.isArray(data.todayKeys) ? data.todayKeys : []
    } else {
      // 今天还没学：新一天计数清零，连续天数若断档则归零
      todayKeys.value = []
      if (lastDate.value && !isYesterday(lastDate.value, today)) streak.value = 0
    }
    todayCount.value = todayKeys.value.length
  } catch {
    // 存储损坏时回退默认
    stars.value = 0
    learned.value = []
    streak.value = 0
    todayKeys.value = []
    lastDate.value = ''
    todayCount.value = 0
  }
}

/** 记录一次学习（module 栏目 + 条目 id）。返回是否首次学完（新得星）。 */
function learn(module: string, id: string): boolean {
  const key = keyOf(module, id)
  const first = !learned.value.includes(key)

  const today = dayKey()
  if (lastDate.value !== today) {
    // 开启新的一天：更新连续天数
    streak.value = lastDate.value && isYesterday(lastDate.value, today) ? streak.value + 1 : 1
    lastDate.value = today
    todayKeys.value = []
  }

  if (!todayKeys.value.includes(key)) {
    // 整体重赋值，确保模板中 includes/length 依赖能被触发
    todayKeys.value = [...todayKeys.value, key]
    todayCount.value = todayKeys.value.length
  }

  if (first) {
    learned.value = [...learned.value, key]
    stars.value += 1
    rewardText.value = '⭐ +1'
    rewardTick.value += 1
  }
  persist()
  return first
}

/** 该条目是否已学过（用于卡片打勾） */
function isLearned(module: string, id: string): boolean {
  return learned.value.includes(keyOf(module, id))
}

/** 该栏目已学数量（progress 卡片用） */
function learnedCount(module: string): number {
  const prefix = `${module}:`
  return learned.value.filter((k) => k.startsWith(prefix)).length
}

/** 是否达成今日任务 */
const todayDone = computed(() => todayCount.value >= DAILY_GOAL)

load()

// 学习后即时刷新今日达成状态
export function useProgress() {
  return {
    /** 累计星星 */
    stars: readonly(stars),
    /** 连续打卡天数 */
    streak: readonly(streak),
    /** 今日已学条数 */
    todayCount: readonly(todayCount),
    /** 今日任务是否达成 */
    todayDone,
    /** 每日目标 */
    dailyGoal: DAILY_GOAL,
    /** 记录一次学习，返回是否首次（新得星） */
    learn,
    /** 该条目是否已学 */
    isLearned,
    /** 栏目已学数量 */
    learnedCount,
    /** 奖励自增信号 / 文案（App.vue 监听播放动效） */
    rewardTick: readonly(rewardTick),
    rewardText: readonly(rewardText),
  }
}
