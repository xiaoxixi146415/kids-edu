<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useSpeech } from '../composables/useSpeech'
import { useProgress } from '../composables/useProgress'
import BigCard from '../components/BigCard.vue'
import AppIcon from '../components/AppIcon.vue'

const router = useRouter()
const { speak, unlock, unlocked, supported } = useSpeech()
const { stars, streak, todayCount, dailyGoal, todayDone, learnedCount } = useProgress()

/** 首页入口卡：module 供学情统计用，total 为各栏目数据量 */
const CATEGORIES = [
  { path: '/encyclopedia', module: 'encyclopedia', total: 36, emoji: '📖', title: '知识百科', subtitle: '认识世界', tone: 'tone-orange' },
  { path: '/brainteasers', module: 'brainteasers', total: 32, emoji: '🤔', title: '脑筋急转弯', subtitle: '动动小脑瓜', tone: 'tone-purple' },
  { path: '/tangshi', module: 'tangshi', total: 24, emoji: '📜', title: '唐诗', subtitle: '跟着念古诗', tone: 'tone-green' },
  { path: '/hanzi', module: 'hanzi', total: 36, emoji: '✏️', title: '识字认字', subtitle: '认一认汉字', tone: 'tone-blue' },
  { path: '/math', module: 'math', total: 10, emoji: '🔢', title: '数学启蒙', subtitle: '数一数算一算', tone: 'tone-red' },
  { path: '/animals', module: 'animals', total: 36, emoji: '🦁', title: '动物乐园', subtitle: '听听动物朋友', tone: 'tone-teal' },
  { path: '/quietbook', module: 'quietbook', total: 9, emoji: '🧸', title: '安静书', subtitle: '点一点 动手玩', tone: 'tone-fuchsia' },
  { path: '/stories', module: 'stories', total: 7, emoji: '📚', title: '绘本故事', subtitle: '翻翻听故事', tone: 'tone-amber' },
  { path: '/pinyin', module: 'pinyin', total: 63, emoji: '🔤', title: '拼音乐园', subtitle: '认声母学韵母', tone: 'tone-pink' },
  { path: '/nursery', module: 'nursery', total: 9, emoji: '🎵', title: '儿童歌谣', subtitle: '听童谣 唱一唱', tone: 'tone-lime' },
] as const

type Category = (typeof CATEGORIES)[number]

/** 某栏目已学 >0 时显示角标 x/N */
function cornerOf(c: Category): string {
  const n = learnedCount(c.module)
  return n > 0 ? `${n}/${c.total}` : ''
}

/** 全站累计学完条目 */
const overallLearned = computed(() => CATEGORIES.reduce((s, c) => s + learnedCount(c.module), 0))
const overallTotal = computed(() => CATEGORIES.reduce((s, c) => s + c.total, 0))

const lastPath = ref('')
try {
  lastPath.value = typeof localStorage !== 'undefined' ? (localStorage.getItem('kids-edu-last') ?? '') : ''
} catch {
  lastPath.value = ''
}

const lastModule = computed(() => CATEGORIES.find((c) => c.path === lastPath.value) ?? null)

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
  speak(cat.title)
  router.push(cat.path)
}

function continueLearn(cat: Category) {
  speak(`我们继续去${cat.title}学习吧`)
  router.push(cat.path)
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

    <!-- 学习激励统计条 -->
    <template v-if="unlocked">
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
    </template>

    <!-- 继续学习 -->
    <BigCard
      v-if="unlocked && lastModule"
      class="continue-card"
      :emoji="lastModule.emoji"
      title="继续学习"
      :subtitle="lastModule.title"
      :tone="lastModule.tone"
      @click="continueLearn(lastModule)"
    />

    <p v-if="unlocked" class="section-title">开始学习</p>

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
  </div>
</template>
