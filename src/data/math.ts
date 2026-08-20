export interface MathNumber {
  id: string
  num: number
  chinese: string
  pinyin: string
  /** 数量展示用 emoji（num 个重复排列） */
  emoji: string
  /** 幼儿向一句话讲解 */
  text: string
}

export const numbers: MathNumber[] = [
  {
    id: 'num-0',
    num: 0,
    chinese: '零',
    pinyin: 'líng',
    emoji: '⭕',
    text: '零就是什么都没有，一个也没有。圆圈就像数字零。',
  },
  {
    id: 'num-1',
    num: 1,
    chinese: '一',
    pinyin: 'yī',
    emoji: '🍎',
    text: '一个苹果。数字一，像一根小木棍。',
  },
  {
    id: 'num-2',
    num: 2,
    chinese: '二',
    pinyin: 'èr',
    emoji: '🍓',
    text: '两个草莓。数字二，像一只小鸭子。',
  },
  {
    id: 'num-3',
    num: 3,
    chinese: '三',
    pinyin: 'sān',
    emoji: '🍌',
    text: '三根香蕉。数字三，像一顶小帽子。',
  },
  {
    id: 'num-4',
    num: 4,
    chinese: '四',
    pinyin: 'sì',
    emoji: '🚗',
    text: '四辆小车。数字四，像一面小旗子。',
  },
  {
    id: 'num-5',
    num: 5,
    chinese: '五',
    pinyin: 'wǔ',
    emoji: '🖐️',
    text: '五根手指。数字五，像一把小钩子。',
  },
  {
    id: 'num-6',
    num: 6,
    chinese: '六',
    pinyin: 'liù',
    emoji: '🐌',
    text: '六只蜗牛。数字六，像一只小哨子。',
  },
  {
    id: 'num-7',
    num: 7,
    chinese: '七',
    pinyin: 'qī',
    emoji: '🌈',
    text: '七道彩虹。数字七，像一把小镰刀。',
  },
  {
    id: 'num-8',
    num: 8,
    chinese: '八',
    pinyin: 'bā',
    emoji: '🐙',
    text: '八爪章鱼。数字八，像两个叠起来的小圈。',
  },
  {
    id: 'num-9',
    num: 9,
    chinese: '九',
    pinyin: 'jiǔ',
    emoji: '🎈',
    text: '九只气球。数字九，像一只小蝌蚪。',
  },
]

/** 数一数题型的点数 emoji 池 */
export const quizEmojis = [
  '🍎',
  '⭐',
  '🐤',
  '🌼',
  '🐟',
  '🍓',
  '⚽',
  '🚗',
  '🍬',
  '🌈',
]
