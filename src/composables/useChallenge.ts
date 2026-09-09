/**
 * 「今日小挑战」通用题库生成器。
 *
 * 不直接 import 各栏目数据（避免把其他栏目的数据打进当前懒加载 chunk），
 * 而是由各视图用自己已有的数据数组映射成通用题型后再生成：
 * - buildPickQuiz   听音认物：TTS 念名称，从 3 个大选项里点出对应项
 *                    （百科/动物 展示 emoji+名字；识字 只展示大汉字 → variant='chars'）
 * - buildCoupletQuiz 接下一句：展示上一句，从 3 句里选下一句（唐诗）
 */
export interface QuizOption {
  /** 可空：识字等纯文字题没有 emoji */
  emoji?: string
  label: string
}

export type QuizVariant = 'grid' | 'chars' | 'list'

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

function pickDistractors<T extends { id: string }>(pool: T[], excludeId: string, target: string, count: number): T[] {
  const rest = shuffle(pool.filter((u) => u.id !== excludeId && u.id !== target))
  const picked: T[] = []
  for (const u of rest) {
    if (picked.length >= count) break
    // 避免选项文案重复
    if (!picked.some((p) => ('label' in p ? p.label === (u as unknown as { label: string }).label : true))) {
      picked.push(u)
    }
  }
  return picked
}

/**
 * 听音认物题：TTS 念目标名称，选项为 3 个 item。
 * variant='grid'（emoji+名字）或 'chars'（识字：只显示大汉字）。
 */
export function buildPickQuiz(pool: PickUnit[], size = 5, variant: QuizVariant = 'grid'): QuizQuestion[] {
  const questions: QuizQuestion[] = []
  for (const i of takeIndexes(pool.length, size)) {
    const target = pool[i]
    const distractors = pickDistractors(pool, target.id, '', 2)
    if (distractors.length < 2) continue
    const options = shuffle([target, ...distractors]).map((u) => ({
      emoji: variant === 'grid' ? u.emoji : undefined,
      label: u.label,
    }))
    questions.push({
      ask: variant === 'chars' ? '听一听，它是哪个字？' : '听一听，它是谁？',
      say: `${target.label}。`,
      variant,
      options,
      answer: options.findIndex((o) => o.label === target.label),
    })
  }
  return questions
}

/**
 * 接诗句题：展示上一句 lead，选项为 3 个「下一句」候选（唐诗）。
 * 从其他诗句里挑干扰项，并保证选项文案两两不同。
 */
export function buildCoupletQuiz(pool: CoupletUnit[], size = 5): QuizQuestion[] {
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
