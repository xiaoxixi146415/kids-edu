/**
 * 成长徽章定义（只有元数据，不 import 学情，避免首页与家长页的懒加载边界被打破）。
 *
 * 每枚徽章只绑定一个可量化的指标：
 * - stars    累计小星星
 * - learned  已认识的内容条数（各栏目按总量截断后求和）
 * - streak   连续打卡天数
 * - quiz     累计闯关成功次数
 * - modules  学过至少 1 个内容的栏目数
 *
 * 当前值由 useAchievements 从 useProgress 计算，徽章文案与阈值集中在这里维护。
 */
export type BadgeMetric = 'stars' | 'learned' | 'streak' | 'quiz' | 'modules'

export interface BadgeDef {
  id: string
  emoji: string
  title: string
  /** 给家长看的说明（获得条件） */
  desc: string
  metric: BadgeMetric
  target: number
}

export const BADGES: readonly BadgeDef[] = [
  {
    id: 'first-star',
    emoji: '⭐',
    title: '第一颗星',
    desc: '学完第一个内容，得到第一颗小星星',
    metric: 'stars',
    target: 1,
  },
  {
    id: 'little-reader',
    emoji: '📚',
    title: '小书虫',
    desc: '认识 10 个新内容',
    metric: 'learned',
    target: 10,
  },
  {
    id: 'book-master',
    emoji: '🎓',
    title: '博学小达人',
    desc: '认识 50 个新内容',
    metric: 'learned',
    target: 50,
  },
  {
    id: 'streak-3',
    emoji: '🔥',
    title: '坚持三天',
    desc: '连续打卡 3 天',
    metric: 'streak',
    target: 3,
  },
  {
    id: 'streak-7',
    emoji: '🏅',
    title: '坚持一周',
    desc: '连续打卡 7 天',
    metric: 'streak',
    target: 7,
  },
  {
    id: 'all-rounder',
    emoji: '🌈',
    title: '全能小玩家',
    desc: '十个栏目每个都至少学过 1 个内容',
    metric: 'modules',
    target: 10,
  },
  {
    id: 'quiz-10',
    emoji: '🎯',
    title: '闯关小达人',
    desc: '累计闯关成功 10 次',
    metric: 'quiz',
    target: 10,
  },
]
