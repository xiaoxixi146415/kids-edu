/**
 * 「今日小挑战」通用题库生成器。
 *
 * 不直接 import 各栏目数据（避免把其他栏目的数据打进当前懒加载 chunk），
 * 而是由各视图用自己已有的数据数组映射成通用题型后再生成：
 * - buildPickQuiz   听音认物：TTS 念名称，从 3 个大选项里点出对应项
 *                    （百科/动物 展示 emoji+名字；识字 只展示大汉字 → variant='chars'）
 * - buildCoupletQuiz 接下一句：展示上一句，从 3 句里选下一句（唐诗）
 * - buildRiddleQuiz 猜谜语：TTS 念谜面，从 3 个谜底里选出正确的一个（脑筋急转弯）
 */
export interface QuizOption {
  /** 可空：识字等纯文字题没有 emoji */
  emoji?: string
  label: string
}

export type QuizVariant = 'grid' | 'chars' | 'list'

/** 挑战默认题量：横幅文案与结算阈值都从这里来，避免两处写死后漂移 */
export const QUIZ_SIZE = 5

/** 通关阈值：答对一半即算过关 */
export function passThreshold(total: number): number {
  return Math.ceil(total / 2)
}

export interface QuizQuestion {
  /** 顶部的引导语 */
  ask: string
  /** 交给语音合成的文本（不含拉丁字母拼音） */
  say: string
  /** 可选的大号展示区文字（如唐诗「上一句」） */
  show?: string
  /** 选项排版：grid 大按钮（emoji+名） / chars 超大字 / list 长句单列 */
  variant: QuizVariant
  options: QuizOption[]
  /** 正确选项下标 */
  answer: number
}

/** 听音认物题的条目单元 */
export interface PickUnit {
  id: string
  label: string
  emoji: string
}

/** 接诗句题的条目单元 */
export interface CoupletUnit {
  id: string
  lead: string
  answer: string
}

/** 猜谜题的条目单元 */
export interface RiddleUnit {
  id: string
  question: string
  answer: string
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

/** 挑 n 个不重复下标 */
function takeIndexes(len: number, n: number): number[] {
  return shuffle(Array.from({ length: len }, (_, i) => i)).slice(0, Math.min(n, len))
}

function pickDistractors<T extends { id: string; label: string }>(
  pool: T[],
  excludeId: string,
  excludeLabel: string,
  count: number
): T[] {
  const rest = shuffle(pool.filter((u) => u.id !== excludeId && u.label !== excludeLabel))
  const picked: T[] = []
  for (const u of rest) {
    if (picked.length >= count) break
    // 避免选项文案重复
    if (!picked.some((p) => p.label === u.label)) {
      picked.push(u)
    }
  }
  return picked
}

/**
 * 听音认物题：TTS 念目标名称，选项为 3 个 item。
 * variant='grid'（emoji+名字）或 'chars'（识字：只显示大汉字）。
 */
export function buildPickQuiz(pool: PickUnit[], size = QUIZ_SIZE, variant: QuizVariant = 'grid'): QuizQuestion[] {
  const questions: QuizQuestion[] = []
  for (const i of takeIndexes(pool.length, size)) {
    const target = pool[i]
    const distractors = pickDistractors(pool, target.id, target.label, 2)
    if (distractors.length < 2) continue
    // 先洗牌再映射：答案用 id 定位，避免「同名干扰项」被误判
    const picks = shuffle([target, ...distractors])
    const options = picks.map((u) => ({
      emoji: variant === 'grid' ? u.emoji : undefined,
      label: u.label,
    }))
    questions.push({
      ask: variant === 'chars' ? '听一听，它是哪个字？' : '听一听，它是谁？',
      say: `${target.label}。`,
      variant,
      options,
      answer: picks.findIndex((u) => u.id === target.id),
    })
  }
  return questions
}

/**
 * 接诗句题：展示上一句 lead，选项为 3 个「下一句」候选（唐诗）。
 * 从其他诗句里挑干扰项，并保证选项文案两两不同。
 */
export function buildCoupletQuiz(pool: CoupletUnit[], size = QUIZ_SIZE): QuizQuestion[] {
  const questions: QuizQuestion[] = []
  for (const i of takeIndexes(pool.length, size)) {
    const target = pool[i]
    const distractors: string[] = []
    for (const other of shuffle(pool)) {
      if (distractors.length >= 2) break
      if (other.id === target.id) continue
      if (other.answer === target.answer || distractors.includes(other.answer)) continue
      distractors.push(other.answer)
    }
    if (distractors.length < 2) continue
    const options = shuffle([target.answer, ...distractors]).map((t) => ({ label: t }))
    questions.push({
      ask: '哪一句是下一句？',
      say: `${target.lead}。`,
      show: target.lead,
      variant: 'list',
      options,
      answer: options.findIndex((o) => o.label === target.answer),
    })
  }
  return questions
}

/**
 * 猜谜题：TTS 念谜面，选项为 3 个「谜底」候选（其他谜语的答案）。
 * variant='list'：谜底是完整句子，单列排布更好读。
 */
export function buildRiddleQuiz(pool: RiddleUnit[], size = QUIZ_SIZE): QuizQuestion[] {
  const questions: QuizQuestion[] = []
  for (const i of takeIndexes(pool.length, size)) {
    const target = pool[i]
    const distractors: string[] = []
    for (const other of shuffle(pool)) {
      if (distractors.length >= 2) break
      if (other.id === target.id) continue
      if (other.answer === target.answer || distractors.includes(other.answer)) continue
      distractors.push(other.answer)
    }
    if (distractors.length < 2) continue
    const options = shuffle([target.answer, ...distractors]).map((label) => ({ label }))
    questions.push({
      ask: '听一听谜面，猜猜答案是什么？',
      say: target.question,
      show: target.question,
      variant: 'list',
      options,
      answer: options.findIndex((o) => o.label === target.answer),
    })
  }
  return questions
}
