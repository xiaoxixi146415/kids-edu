/**
 * 栏目元数据（首页与家长报告共用）。
 *
 * 只放标题、路径、总量等轻量信息，不 import 任何栏目内容：
 * 否则所有内容都会被打进首页共享 chunk，懒加载边界会被打破（见 EXPLAIN_CHECKLIST Q2）。
 *
 * total 必须手写，`npm run check:counts` 会校验它与 `src/data/<module>.ts` 的实际条数一致。
 */
export const CATEGORIES = [
  { path: '/encyclopedia', module: 'encyclopedia', total: 44, emoji: '📖', title: '知识百科', subtitle: '认识世界', tone: 'tone-orange' },
  { path: '/brainteasers', module: 'brainteasers', total: 40, emoji: '🤔', title: '脑筋急转弯', subtitle: '动动小脑瓜', tone: 'tone-purple' },
  { path: '/tangshi', module: 'tangshi', total: 32, emoji: '📜', title: '唐诗', subtitle: '跟着念古诗', tone: 'tone-green' },
  { path: '/hanzi', module: 'hanzi', total: 48, emoji: '✏️', title: '识字认字', subtitle: '认一认汉字', tone: 'tone-blue' },
  { path: '/math', module: 'math', total: 21, emoji: '🔢', title: '数学启蒙', subtitle: '数一数算一算', tone: 'tone-red' },
  { path: '/animals', module: 'animals', total: 50, emoji: '🦁', title: '动物乐园', subtitle: '听听动物朋友', tone: 'tone-teal' },
  { path: '/quietbook', module: 'quietbook', total: 9, emoji: '🧸', title: '安静书', subtitle: '点一点 动手玩', tone: 'tone-fuchsia' },
  { path: '/stories', module: 'stories', total: 10, emoji: '📚', title: '绘本故事', subtitle: '翻翻听故事', tone: 'tone-amber' },
  { path: '/pinyin', module: 'pinyin', total: 75, emoji: '🔤', title: '拼音乐园', subtitle: '认声母学韵母', tone: 'tone-pink' },
  { path: '/nursery', module: 'nursery', total: 9, emoji: '🎵', title: '儿童歌谣', subtitle: '听童谣 唱一唱', tone: 'tone-lime' },
] as const

export type Category = (typeof CATEGORIES)[number]
