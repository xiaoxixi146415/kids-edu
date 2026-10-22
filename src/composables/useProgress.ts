/**
 * 学习激励系统（参考儿童学习类 App 的「星星 / 打卡 / 连续天数」设计）：
 *
 * - 学过一个条目（module:key）→ 该条目记「已学」，卡片打勾 ✅
 * - 首次学完一个条目 → 奖励 1 颗星 ⭐
 * - 闯关答题（passQuiz）：每个栏目每天首次闯关成功 → 奖励 1 颗星 ⭐ 并计入今日任务
 * - 每天只要学了新条目，就计入连续打卡天数（streak）
 * - 全部持久化到 localStorage（key: kids-edu-progress），App 重开仍在
 * - reset()：家长在设置/报告里重置全部学习记录
 *
 * 另外记录三类「学习闭环」数据（家长报告 + 续学 + 挑战个性化）：
 * - last：最近打开的条目，首页「继续学习」可直达详情
 * - history：按天统计学习条数 / 星星 / 闯关次数，仅保留最近 14 天
 * - wrong：各栏目答错的挑战题，最多 20 条，用于错题回顾与优先复习
 *
 * 共享实现：模块级 ref 单例，任意组件调用同一份状态；
 * rewardTick 供 App.vue 监听，在首次得星时播放飘星动效。
 */
import { computed, readonly, ref } from 'vue'

/** 每天建议学习的条数（今日任务目标） */
export const DAILY_GOAL = 3

/** 每个栏目保留的错题条数上限 */
export const WRONG_LIMIT = 20

/** 按天历史保留上限：家长页看 7 天，多存一周留余量 */
const HISTORY_DAYS = 14

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

/** 最近打开的条目（首页「继续学习」直达） */
export interface LastEntry {
  module: string
  id: string
}

/** 一天的学习统计 */
export interface DayStat {
  /** 当天学过的不同条目数（不含闯关） */
  learned: number
  /** 当天新得星星 */
  stars: number
  /** 当天闯关成功次数 */
  quiz: number
}

export interface RecentDay extends DayStat {
  /** YYYY-MM-DD */
  date: string
}

/** 一道答错的挑战题（只存内容 id 与题干/答案，不采集任何个人信息） */
export interface WrongEntry {
  /** 题目对应的条目 id（唐诗为 `诗id:句下标`） */
  id: string
  /** 答错时间戳，用于「最近答错」排序 */
  at: number
  /** 题干（听音题为空） */
  prompt: string
  /** 正确答案 */
  answer: string
}

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
  /** 今日已闯关成功的栏目（每次只算一天，日期切换即清） */
  quizAwarded: string[]
  /** 累计闯关成功次数（徽章用，不受 14 天历史裁剪影响） */
  quizTotal: number
  /** 最近打开的条目 */
  last?: LastEntry | null
  /** 按天统计（YYYY-MM-DD → DayStat） */
  history?: Record<string, DayStat>
  /** 各栏目错题（module → 最近答错的题） */
  wrong?: Record<string, WrongEntry[]>
  /** 存储结构版本，便于以后迁移 */
  v?: number
}

/* —— 模块级单例状态 —— */
const stars = ref(0)
const learned = ref<string[]>([])
const streak = ref(0)
const todayKeys = ref<string[]>([])
const lastDate = ref('')
const quizAwarded = ref<string[]>([])
const quizTotal = ref(0)
const lastEntry = ref<LastEntry | null>(null)
const history = ref<Record<string, DayStat>>({})
const wrong = ref<Record<string, WrongEntry[]>>({})

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
    quizAwarded: quizAwarded.value,
    quizTotal: quizTotal.value,
    last: lastEntry.value,
    history: history.value,
    wrong: wrong.value,
    v: 4,
  }
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  } catch {
    // 隐私模式 / 存储满：保留内存状态，不影响本次学习与朗读
  }
}

/** 只接受非负有限整数（防 NaN / 负数 / 小数） */
function safeInt(v: unknown, fallback = 0): number {
  return typeof v === 'number' && Number.isFinite(v) && v >= 0 ? Math.floor(v) : fallback
}

/** 只接受字符串数组（旧 schema 或手工篡改可能混入数字等） */
function safeKeys(v: unknown): string[] {
  return Array.isArray(v) ? v.filter((x): x is string => typeof x === 'string') : []
}

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/

/** 校验最近条目：字段都必须是像样的字符串 */
function safeLast(v: unknown): LastEntry | null {
  if (!v || typeof v !== 'object') return null
  const o = v as Record<string, unknown>
  if (typeof o.module !== 'string' || !o.module) return null
  if (typeof o.id !== 'string' || !o.id) return null
  return { module: o.module, id: o.id }
}

/** 校验按天历史：只接受合法日期键与非负整数计数 */
function safeHistory(v: unknown): Record<string, DayStat> {
  const out: Record<string, DayStat> = {}
  if (!v || typeof v !== 'object') return out
  for (const [date, value] of Object.entries(v as Record<string, unknown>)) {
    if (!DATE_RE.test(date) || !value || typeof value !== 'object') continue
    const o = value as Record<string, unknown>
    out[date] = {
      learned: safeInt(o.learned),
      stars: safeInt(o.stars),
      quiz: safeInt(o.quiz),
    }
  }
  return out
}

/** 校验错题：跳过残缺项、按 id 去重、每个栏目最多 WRONG_LIMIT 条 */
function safeWrong(v: unknown): Record<string, WrongEntry[]> {
  const out: Record<string, WrongEntry[]> = {}
  if (!v || typeof v !== 'object') return out
  for (const [module, value] of Object.entries(v as Record<string, unknown>)) {
    if (!module || !Array.isArray(value)) continue
    const list: WrongEntry[] = []
    for (const item of value) {
      if (!item || typeof item !== 'object') continue
      const o = item as Record<string, unknown>
      if (typeof o.id !== 'string' || !o.id) continue
      if (typeof o.answer !== 'string' || !o.answer) continue
      if (list.some((w) => w.id === o.id)) continue
      list.push({
        id: o.id,
        at: safeInt(o.at),
        prompt: typeof o.prompt === 'string' ? o.prompt : '',
        answer: o.answer,
      })
      if (list.length >= WRONG_LIMIT) break
    }
    if (list.length) out[module] = list
  }
  return out
}

function load() {
  if (typeof localStorage === 'undefined') return
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return
    const data = JSON.parse(raw) as Partial<Persisted>
    stars.value = safeInt(data.stars)
    learned.value = safeKeys(data.learned)
    streak.value = safeInt(data.streak)
    lastDate.value = typeof data.lastDate === 'string' ? data.lastDate : ''
    quizTotal.value = safeInt(data.quizTotal)
    lastEntry.value = safeLast(data.last)
    history.value = safeHistory(data.history)
    wrong.value = safeWrong(data.wrong)
    const today = dayKey()
    if (lastDate.value === today) {
      todayKeys.value = safeKeys(data.todayKeys)
      quizAwarded.value = safeKeys(data.quizAwarded)
    } else {
      // 今天还没学：新一天计数清零，连续天数若断档则归零
      todayKeys.value = []
      quizAwarded.value = []
      if (lastDate.value && !isYesterday(lastDate.value, today)) streak.value = 0
    }
    todayCount.value = todayKeys.value.length
    // 旧版本只存了今日任务，没有按天历史：把今天补进历史，报告页今天不至于显示 0。
    // 昨天及更早的星星无法反推，宁可留空也不编造。
    if (!history.value[today] && (todayKeys.value.length || quizAwarded.value.length)) {
      history.value = {
        ...history.value,
        [today]: {
          learned: todayKeys.value.filter((k) => !k.startsWith('quiz:')).length,
          stars: 0,
          quiz: quizAwarded.value.length,
        },
      }
    }
  } catch {
    // 存储损坏时回退默认
    stars.value = 0
    learned.value = []
    streak.value = 0
    todayKeys.value = []
    lastDate.value = ''
    quizAwarded.value = []
    quizTotal.value = 0
    lastEntry.value = null
    history.value = {}
    wrong.value = {}
    todayCount.value = 0
  }
}

/** 若跨天则滚入新一天：更新连续天数、清空今日去重记录 */
function rollDay(today: string) {
  if (lastDate.value !== today) {
    streak.value = lastDate.value && isYesterday(lastDate.value, today) ? streak.value + 1 : 1
    lastDate.value = today
    todayKeys.value = []
    quizAwarded.value = []
  }
}

/** 记一条「今日学习」并同步 todayCount（供 learn/passQuiz 共用，日期已由 rollDay 处理） */
function touchToday(key: string) {
  if (!todayKeys.value.includes(key)) {
    // 整体重赋值，确保模板中 includes/length 依赖能被触发
    todayKeys.value = [...todayKeys.value, key]
    todayCount.value = todayKeys.value.length
  }
}

/** 累加今天的某项统计，并顺手裁掉 14 天前的历史 */
function addHistory(field: keyof DayStat, n = 1) {
  const today = dayKey()
  const cur = history.value[today] ?? { learned: 0, stars: 0, quiz: 0 }
  history.value = { ...history.value, [today]: { ...cur, [field]: cur[field] + n } }
  const dates = Object.keys(history.value).sort()
  if (dates.length > HISTORY_DAYS) {
    const keep = new Set(dates.slice(-HISTORY_DAYS))
    history.value = Object.fromEntries(
      Object.entries(history.value).filter(([date]) => keep.has(date))
    )
  }
}

/** 记录最近打开的条目（不改变星星/学完状态） */
function remember(module: string, id: string) {
  if (!module || !id) return
  lastEntry.value = { module, id }
  persist()
}

/** 记录一次学习（module 栏目 + 条目 id）。返回是否首次学完（新得星）。 */
function learn(module: string, id: string): boolean {
  const key = keyOf(module, id)
  const first = !learned.value.includes(key)
  const today = dayKey()

  rollDay(today)
  // 先 rollDay 再判断，跨零点时今日去重才准确
  const newToday = !todayKeys.value.includes(key)
  touchToday(key)

  lastEntry.value = { module, id }
  if (newToday) addHistory('learned')

  if (first) {
    learned.value = [...learned.value, key]
    stars.value += 1
    addHistory('stars')
    rewardText.value = '⭐ +1'
    rewardTick.value += 1
  }
  persist()
  return first
}

/**
 * 闯关答题得星：每个栏目每天首次闯关成功计 1 颗星并计入今日任务。
 * 返回是否新得星（今天该栏目已经得过则不再重复给）。
 */
function passQuiz(module: string): boolean {
  const today = dayKey()
  const key = `${module}:${today}`
  const fresh = !quizAwarded.value.includes(key)

  rollDay(today)
  // 与普通学习一样计入今日进度（用独立前缀，避免与条目 key 混淆）
  touchToday(`quiz:${key}`)
  addHistory('quiz')
  // 累计次数用于「闯关小达人」徽章；每天重复通关也计入，但星星仍只给一次
  quizTotal.value += 1

  if (fresh) {
    quizAwarded.value = [...quizAwarded.value, key]
    stars.value += 1
    addHistory('stars')
    rewardText.value = '🎯 闯关成功 ⭐ +1'
    rewardTick.value += 1
  }
  persist()
  return fresh
}

/**
 * 该栏目今天是否已经闯关成功（横幅用来提示「今日已得星」）。
 * quizAwarded 的 key 是 `${module}:${today}`。
 */
function quizPassedToday(module: string): boolean {
  return quizAwarded.value.includes(`${module}:${dayKey()}`)
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

/** 记录一道答错的挑战题（同一题只留最新一次，最多 20 条） */
function recordWrong(module: string, entry: { id: string; prompt?: string; answer: string }) {
  if (!module || !entry.id || !entry.answer) return
  const list = wrong.value[module] ?? []
  const next = [
    {
      id: entry.id,
      at: Date.now(),
      prompt: entry.prompt ?? '',
      answer: entry.answer,
    },
    ...list.filter((w) => w.id !== entry.id),
  ].slice(0, WRONG_LIMIT)
  wrong.value = { ...wrong.value, [module]: next }
  persist()
}

/** 某题后来答对了：从错题本移出，避免旧错题一直占着复习位 */
function clearWrong(module: string, id: string) {
  const list = wrong.value[module]
  if (!module || !id || !list?.some((w) => w.id === id)) return
  const next = list.filter((w) => w.id !== id)
  const all = { ...wrong.value }
  if (next.length) all[module] = next
  else delete all[module]
  wrong.value = all
  persist()
}

/** 某栏目的错题（最近答错的在前） */
function wrongOf(module: string): readonly WrongEntry[] {
  return wrong.value[module] ?? []
}

/**
 * 挑战出题偏好：没学过的条目进 freshIds；学过但答错的进 retryIds。
 * learnedIdOf 用于「一道题对应一条内容」以外的栏目（唐诗按诗句出题，学情记在整首上）。
 */
function challengePrefs(
  module: string,
  ids: readonly string[],
  learnedIdOf: (id: string) => string = (id) => id
): { freshIds: string[]; retryIds: string[] } {
  const wrongIds = new Set((wrong.value[module] ?? []).map((w) => w.id))
  const freshIds: string[] = []
  const retryIds: string[] = []
  for (const id of ids) {
    if (!isLearned(module, learnedIdOf(id))) freshIds.push(id)
    else if (wrongIds.has(id)) retryIds.push(id)
  }
  return { freshIds, retryIds }
}

/** 最近 n 天（今天在前）的每日统计，缺失日期补 0 */
function recentDays(n = 7): RecentDay[] {
  const out: RecentDay[] = []
  const now = new Date()
  for (let i = 0; i < n; i++) {
    const d = new Date(now.getFullYear(), now.getMonth(), now.getDate() - i)
    const date = dayKey(d)
    const stat = history.value[date]
    out.push({
      date,
      learned: stat?.learned ?? 0,
      stars: stat?.stars ?? 0,
      quiz: stat?.quiz ?? 0,
    })
  }
  return out
}

/** 是否达成今日任务 */
const todayDone = computed(() => todayCount.value >= DAILY_GOAL)

/** 家长重置全部学习记录 */
function reset() {
  stars.value = 0
  learned.value = []
  streak.value = 0
  todayKeys.value = []
  quizAwarded.value = []
  quizTotal.value = 0
  // 置空而不是置为今天：下一次学习时 rollDay 会从 1 天连续开始
  lastDate.value = ''
  todayCount.value = 0
  lastEntry.value = null
  history.value = {}
  wrong.value = {}
  persist()
  // 旧版「继续学习」只记了栏目路径，重置时一并清掉，避免首页还显示上次栏目
  try {
    localStorage.removeItem('kids-edu-last')
  } catch {
    /* 隐私模式下忽略 */
  }
}

load()

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
    /** 最近打开的条目 */
    last: readonly(lastEntry),
    /** 按天统计（只读） */
    history: readonly(history),
    /** 各栏目错题（只读） */
    wrong: readonly(wrong),
    /** 累计闯关成功次数 */
    quizTotal: readonly(quizTotal),
    /** 记录一次学习，返回是否首次（新得星） */
    learn,
    /** 记住最近打开的条目（未学完也能续上） */
    remember,
    /** 闯关答题得星，返回是否新得星 */
    passQuiz,
    /** 该栏目今天是否已闯关成功 */
    quizPassedToday,
    /** 该条目是否已学 */
    isLearned,
    /** 栏目已学数量 */
    learnedCount,
    /** 记录一道错题 */
    recordWrong,
    /** 答对后移除错题 */
    clearWrong,
    /** 某栏目错题 */
    wrongOf,
    /** 挑战出题偏好（未学优先 / 错题复习） */
    challengePrefs,
    /** 最近 n 天统计（今天在前） */
    recentDays,
    /** 重置全部学习记录 */
    reset,
    /** 奖励自增信号 / 文案（App.vue 监听播放动效） */
    rewardTick: readonly(rewardTick),
    rewardText: readonly(rewardText),
  }
}
