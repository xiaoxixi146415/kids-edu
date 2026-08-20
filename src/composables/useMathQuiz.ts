/**
 * 趣味练习出题逻辑：数一数 + 简单加减法。
 * 状态最小化：当前题目 + 已选选项；判定结果由选项与答案派生。
 */
import { readonly, shallowRef } from 'vue'
import { quizEmojis } from '../data/math'

export interface Quiz {
  type: 'count' | 'add' | 'sub'
  /** 题目展示文本（加减法用，如「2 + 3 = ?」） */
  text: string
  /** 朗读文本（TTS 用，数字转中文） */
  spoken: string
  /** 数一数题型的点数 emoji 阵列；加减法为空 */
  dots: string[]
  options: number[]
  answer: number
}

const CN = ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九', '十', '十一', '十二']
const ENCOURAGE = ['答对啦，真棒！', '太厉害啦！', '答对咯！', '真聪明！', '好棒呀！']
const HINTS = ['再想一想哦', '没关系，再试试', '差一点就对了，加油！']

function toCn(n: number): string {
  return n >= 0 && n < CN.length ? CN[n] : String(n)
}

function randInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

/** 洗牌 */
function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = randInt(0, i)
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

/** 生成 3 个选项（1 正确 + 2 个相邻干扰），范围 0-12 */
function buildOptions(answer: number): number[] {
  const opts = new Set<number>([answer])
  const deltas = [1, -1, 2, -2, 3, -3]
  let guard = 0
  while (opts.size < 3 && guard < 24) {
    const v = answer + deltas[randInt(0, deltas.length - 1)]
    if (v >= 0 && v <= 12) opts.add(v)
    guard++
  }
  for (let i = 0; i <= 12 && opts.size < 3; i++) opts.add(i)
  return shuffle([...opts])
}

function buildQuiz(): Quiz {
  const kind = randInt(0, 1) === 0 ? 'count' : (randInt(0, 1) === 0 ? 'add' : 'sub')

  if (kind === 'count') {
    const n = randInt(1, 10)
    const emoji = quizEmojis[randInt(0, quizEmojis.length - 1)]
    return {
      type: 'count',
      text: '数一数',
      spoken: '数一数，一共有几个？',
      dots: Array.from({ length: n }, () => emoji),
      options: buildOptions(n),
      answer: n,
    }
  }

  if (kind === 'add') {
    const a = randInt(1, 5)
    const b = randInt(1, 10 - a)
    const answer = a + b
    return {
      type: 'add',
      text: `${a} + ${b} = ?`,
      spoken: `${toCn(a)}加${toCn(b)}，等于几？`,
      dots: [],
      options: buildOptions(answer),
      answer,
    }
  }

  const a = randInt(2, 10)
  const b = randInt(1, a - 1)
  const answer = a - b
  return {
    type: 'sub',
    text: `${a} - ${b} = ?`,
    spoken: `${toCn(a)}减${toCn(b)}，等于几？`,
    dots: [],
    options: buildOptions(answer),
    answer,
  }
}

const quiz = shallowRef<Quiz | null>(null)
const picked = shallowRef<number | null>(null)
const correct = shallowRef(false)

/** 抽取下一题，返回题目 */
function next(): Quiz {
  quiz.value = buildQuiz()
  picked.value = null
  correct.value = false
  return quiz.value
}

/** 作答：返回是否答对；已作答时忽略重复点击 */
function pick(n: number): boolean {
  if (!quiz.value || picked.value !== null) return false
  picked.value = n
  correct.value = n === quiz.value.answer
  return correct.value
}

/** 反馈语音文本 */
function feedbackText(): string {
  if (picked.value === null) return ''
  return correct.value
    ? ENCOURAGE[randInt(0, ENCOURAGE.length - 1)]
    : HINTS[randInt(0, HINTS.length - 1)]
}

export function useMathQuiz() {
  return {
    quiz: readonly(quiz),
    picked: readonly(picked),
    correct: readonly(correct),
    next,
    pick,
    feedbackText,
  }
}
