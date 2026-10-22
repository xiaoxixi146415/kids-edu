/**
 * 成长徽章：把 useProgress 里的星星 / 已学 / 打卡 / 闯关换算成可展示的徽章状态。
 *
 * 徽章只依赖本机学习记录，不新增任何采集；家长页与首页共用同一份计算，
 * 避免两处规则写死后漂移。
 */
import { computed } from 'vue'
import { BADGES, type BadgeDef, type BadgeMetric } from '../data/badges'
import { CATEGORIES } from '../data/categories'
import { useProgress } from './useProgress'

export interface Achievement extends BadgeDef {
  /** 当前进度（未截断，便于显示「59/50」时仍算已获得） */
  current: number
  unlocked: boolean
}

export function useAchievements() {
  const { stars, streak, learnedCount, quizTotal } = useProgress()

  /** 已认识内容：旧 id 可能比总量多，按栏目 total 截断 */
  const overallLearned = computed(() =>
    CATEGORIES.reduce(
      (sum, c) => sum + Math.min(learnedCount(c.module), c.total),
      0
    )
  )

  /** 已接触过的栏目数 */
  const modulesCovered = computed(
    () => CATEGORIES.filter((c) => learnedCount(c.module) > 0).length
  )

  const metrics = computed<Record<BadgeMetric, number>>(() => ({
    stars: stars.value,
    learned: overallLearned.value,
    streak: streak.value,
    quiz: quizTotal.value,
    modules: modulesCovered.value,
  }))

  const achievements = computed<Achievement[]>(() =>
    BADGES.map((def) => {
      const current = metrics.value[def.metric]
      return { ...def, current, unlocked: current >= def.target }
    })
  )

  const unlockedCount = computed(
    () => achievements.value.filter((a) => a.unlocked).length
  )

  return {
    achievements,
    unlockedCount,
    total: BADGES.length,
    overallLearned,
    modulesCovered,
  }
}
