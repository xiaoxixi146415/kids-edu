/**
 * 年龄段元数据：3–4 岁 / 5–6 岁。
 *
 * 只放「条目 → 年龄段」的轻量规则，不 import 任何栏目内容，
 * 避免把内容打进首页共享 chunk（懒加载边界见 EXPLAIN_CHECKLIST Q2）。
 *
 * 标注方式：
 * - 有主题分组的栏目按分组标注（百科 category、识字 category、动物 category、歌谣 category、拼音 group）
 * - 其余栏目用 older 显式列出进阶条目，未列出的默认 3–4 岁
 * - `npm run check:counts` 会校验每个栏目都同时有两个年龄段，且 older 里的 id 都真实存在
 */
export type AgeBand = '3-4' | '5-6'
export type AgeFilter = 'all' | AgeBand

/** 年龄筛选 chips 的统一文案 */
export const AGE_FILTERS: readonly { value: AgeFilter; label: string }[] = [
  { value: 'all', label: '全部年龄' },
  { value: '3-4', label: '3–4 岁' },
  { value: '5-6', label: '5–6 岁' },
]

interface AgeRule {
  /** 按主题/分组标注年龄段 */
  byGroup?: Readonly<Record<string, AgeBand>>
  /** 进阶条目：命中为 5–6 岁，其余默认 3–4 岁 */
  older?: readonly string[]
}

export const AGE_RULES: Readonly<Record<string, AgeRule>> = {
  encyclopedia: {
    byGroup: { 动物: '3-4', 自然: '3-4', 生活常识: '5-6' },
  },
  animals: {
    older: [
      'shark',
      'octopus',
      'lobster',
      'pufferfish',
      'jellyfish',
      'starfish',
      'clownfish',
      'walrus',
      'arctic-hare',
      'musk-ox',
      'snowy-owl',
      'peacock',
      'swallow',
      'magpie',
      'woodpecker',
    ],
  },
  hanzi: {
    byGroup: { 数字: '3-4', 自然: '3-4', 动物: '3-4', 身体: '5-6', 常用字: '5-6' },
  },
  nursery: {
    byGroup: { 自然: '3-4', 动物: '3-4', 游戏: '5-6', 生活: '5-6' },
  },
  pinyin: {
    byGroup: { 声母: '3-4', 声调: '3-4', 韵母: '5-6', 整体认读: '5-6', 易混: '5-6' },
  },
  math: {
    older: [
      'num-10',
      'num-11',
      'num-12',
      'num-13',
      'num-14',
      'num-15',
      'num-16',
      'num-17',
      'num-18',
      'num-19',
      'num-20',
    ],
  },
  stories: {
    older: ['three-pigs', 'wolf-cry', 'crow-drink', 'pony-river', 'monkeys-moon', 'gecko-tail'],
  },
  tangshi: {
    older: [
      'yongliu',
      'wanglushanpubu',
      'jueju',
      'shanxing',
      'yuanri',
      'huixiangou',
      'zengwanglun',
      'wangtianmenshan',
      'xiaochi',
      'cunju',
      'wangdongting',
      'jiuyuejiuri',
      'chunri',
      'zhushi',
      'chilege',
    ],
  },
  brainteasers: {
    older: [
      'breathe',
      'own-name',
      'broken',
      'trophy',
      'goal',
      'earth',
      'wrong-char',
      'echo',
      'needle-eye',
      'wood-ear',
      'glove-house',
      'umbrella-roof',
      'radio-sing',
      'shadow-follow',
    ],
  },
  quietbook: {
    older: ['spot', 'hidden', 'shadows'],
  },
}

/** 取某条内容的年龄段；group 传 category / group 等主题字段 */
export function ageOf(module: string, id: string, group?: string): AgeBand {
  const rule = AGE_RULES[module]
  if (!rule) return '3-4'
  if (group && rule.byGroup?.[group]) return rule.byGroup[group]
  if (rule.older?.includes(id)) return '5-6'
  return '3-4'
}
