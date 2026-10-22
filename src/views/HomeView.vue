<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useSpeech } from '../composables/useSpeech'
import { useProgress } from '../composables/useProgress'
import { useAchievements } from '../composables/useAchievements'
import { CATEGORIES, type Category } from '../data/categories'
import BigCard from '../components/BigCard.vue'
import AppIcon from '../components/AppIcon.vue'
import BadgeShelf from '../components/BadgeShelf.vue'

const router = useRouter()
const { speak, unlock, unlocked, supported } = useSpeech()
const { stars, streak, todayCount, dailyGoal, todayDone, learnedCount, last } = useProgress()
const { achievements } = useAchievements()

/** 某栏目已学数量（内容更新后旧 id 可能残留，展示时按总量截断） */
function learnedOf(c: Category): number {
  return Math.min(learnedCount(c.module), c.total)
}

/** 某栏目已学 >0 时显示角标 x/N */
function cornerOf(c: Category): string {
  const n = learnedOf(c)
  return n > 0 ? `${n}/${c.total}` : ''
}

/** 全站累计学完条目 */
const overallLearned = computed(() => CATEGORIES.reduce((s, c) => s + learnedOf(c), 0))
const overallTotal = computed(() => CATEGORIES.reduce((s, c) => s + c.total, 0))

// 旧版本只存了栏目路径（App.vue 仍会写），保留作兜底；v3 起以 useProgress.last 为准
const legacyPath = ref('')
try {
  legacyPath.value = typeof localStorage !== 'undefined' ? (localStorage.getItem('kids-edu-last') ?? '') : ''
} catch {
  legacyPath.value = ''
}

const lastModule = computed(() => {
  const entry = last.value
  if (entry) {
    const hit = CATEGORIES.find((c) => c.module === entry.module)
    if (hit) return hit
  }
  return CATEGORIES.find((c) => c.path === legacyPath.value) ?? null
})

/** 最近条目：栏目匹配时才能直达详情 */
const lastItemId = computed(() => {
  const entry = last.value
  return entry && lastModule.value?.module === entry.module ? entry.id : ''
})

const greeting = computed(() => {
  const h = new Date().getHours()
  if (h < 6) return '夜深了'
  if (h < 11) return '早上好'
  if (h < 14) return '中午好'
  if (h < 18) return '下午好'
  return '晚上好'
})

function start() {
  unlock()
  speak('小朋友你好，我是乐乐！欢迎来到宝宝乐园。点一点下面的大卡片，我们一起去认识新朋友吧！')
}

function open(cat: Category) {
  // 点卡片本身就是用户手势：顺手解锁语音，避免从深链进入后一直提示「先点我开始」
  unlock()
  speak(cat.title)
  router.push(cat.path)
}

function continueLearn(cat: Category) {
  unlock()
  speak(`我们继续去${cat.title}学习吧`)
  // 有最近条目就直达详情；旧数据只有栏目路径时退回栏目页
  if (lastItemId.value) {
    router.push({ path: cat.path, query: { open: lastItemId.value } })
  } else {
    router.push(cat.path)
  }
}
</script>

<template>
  <div class="home">
    <div class="mascot" :class="{ wiggle: unlocked }" aria-hidden="true">🦉</div>

    <button v-if="!unlocked" type="button" class="btn-start" @click="start">
      <AppIcon name="sound-on" />
      点我开始
    </button>
    <p v-else class="welcome">{{ greeting }}！今天也要加油哦</p>
    <p v-if="supported && !unlocked" class="hint">👆 先点一下「开始」，让声音响起来吧</p>

    <!-- 学习激励统计条：与声音是否解锁无关，深链/返回用户也要能看到 -->
    <div class="stats-row" role="list" aria-label="学习成果">
      <div class="stat-chip" role="listitem">
        <span class="stat-emoji" aria-hidden="true">⭐</span>
        <span class="stat-num">{{ stars }}</span>
        <span class="stat-label">小星星</span>
      </div>
      <div class="stat-chip" role="listitem">
        <span class="stat-emoji" aria-hidden="true">🔥</span>
        <span class="stat-num">{{ streak }}</span>
        <span class="stat-label">连续打卡</span>
      </div>
      <div class="stat-chip" role="listitem">
        <span class="stat-emoji" aria-hidden="true">📖</span>
        <span class="stat-num">{{ todayCount }}/{{ dailyGoal }}</span>
        <span class="stat-label">今日已学</span>
      </div>
    </div>
    <p v-if="todayDone" class="task-done" role="status">🎉 今日任务完成啦，你真棒！明天也要来哦</p>
    <p v-if="overallLearned > 0" class="overall-line" role="status">
      🎓 已认识 <b>{{ overallLearned }}</b> / {{ overallTotal }} 个内容，继续加油！
    </p>

    <BadgeShelf :badges="achievements" variant="home" />

    <!-- 继续学习 -->
    <BigCard
      v-if="lastModule"
      class="continue-card"
      :emoji="lastModule.emoji"
      title="继续学习"
      :subtitle="lastModule.title"
      :tone="lastModule.tone"
      @click="continueLearn(lastModule)"
    />

    <p class="section-title">开始学习</p>

    <div class="category-list">
      <BigCard
        v-for="cat in CATEGORIES"
        :key="cat.path"
        class="card-xl"
        :emoji="cat.emoji"
        :title="cat.title"
        :subtitle="cat.subtitle"
        :tone="cat.tone"
        :corner="cornerOf(cat)"
        @click="open(cat)"
      />
    </div>

    <RouterLink class="parent-link" to="/parent">家长看这里 · 学习报告</RouterLink>
  </div>
</template>
