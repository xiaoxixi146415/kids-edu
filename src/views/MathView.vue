<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { numbers, type MathNumber } from '../data/math'
import { useSpeech } from '../composables/useSpeech'
import { useProgress } from '../composables/useProgress'
import { useResume } from '../composables/useResume'
import { useMathQuiz } from '../composables/useMathQuiz'
import type { LearnFilter } from '../types'
import BigCard from '../components/BigCard.vue'
import DetailDialog from '../components/DetailDialog.vue'
import AudioPlayer from '../components/AudioPlayer.vue'
import ModuleLearnBar from '../components/ModuleLearnBar.vue'
import AppIcon from '../components/AppIcon.vue'
import { applyFilter } from '../utils'

const MODULE = 'math'
const { speak, stop } = useSpeech()
const { learn, isLearned, learnedCount, remember } = useProgress()
const { quiz, picked, correct, next, pick, feedbackText } = useMathQuiz()
const selected = ref<MathNumber | null>(null)
const feedback = ref('')
const filter = ref<LearnFilter>('all')

/** 栏目学情：数字卡片支持「全部 / 没学过 / 学过」筛选 */
const progress = computed(() => ({ learned: learnedCount(MODULE), total: numbers.length }))
const visibleNumbers = computed(() => applyFilter(numbers, filter.value, MODULE, isLearned))
const emptyText = computed(() => {
  if (filter.value === 'todo') return '🎉 太棒了！数字你都学完啦'
  if (filter.value === 'done') return '还没有学过的数字，点上面的卡片开始吧'
  return ''
})

function read(n: MathNumber) {
  return `${n.chinese}。${n.text}`
}

function open(n: MathNumber) {
  selected.value = n
  remember(MODULE, n.id)
  learn(MODULE, n.id)
  speak(read(n))
}

function close() {
  stop()
  selected.value = null
}

function onPick(n: number) {
  pick(n)
  feedback.value = feedbackText()
  speak(feedback.value)
}

function nextQuiz() {
  const q = next()
  feedback.value = ''
  speak(q.spoken)
}

// 续学直达数字卡片；此时不再自动念「趣味练习」的第一题，避免两段语音互相打断
const { resumed } = useResume(numbers, (n) => n.id, open)

onMounted(() => {
  if (!resumed) speak(next().spoken)
})

onUnmounted(stop)
</script>

<template>
  <div class="list-page">
    <ModuleLearnBar :learned="progress.learned" :total="progress.total" v-model:filter="filter" />

    <section class="group">
      <h2 class="group-title">认识数字</h2>
      <div v-if="visibleNumbers.length" class="grid">
        <BigCard
          v-for="n in visibleNumbers"
          :key="n.id"
          :emoji="n.emoji"
          :title="String(n.num)"
          :subtitle="n.chinese"
          tone="tone-red"
          :done="isLearned(MODULE, n.id)"
          @click="open(n)"
        />
      </div>
      <p v-else class="list-empty" role="status">{{ emptyText }}</p>
    </section>

    <section class="group">
      <h2 class="group-title">趣味练习</h2>
      <div v-if="quiz" class="quiz-panel">
        <span class="sr-only">{{ quiz.spoken }}</span>
        <div v-if="quiz.dots.length" class="quiz-dots" aria-hidden="true">
          <span v-for="(e, i) in quiz.dots" :key="i">{{ e }}</span>
        </div>
        <div v-else class="quiz-math" aria-hidden="true">{{ quiz.text }}</div>

        <p v-if="feedback" class="quiz-feedback" role="status">{{ feedback }}</p>

        <div class="quiz-options">
          <button
            v-for="opt in quiz.options"
            :key="opt"
            type="button"
            class="quiz-opt"
            :class="{
              correct: picked === opt && correct,
              wrong: picked === opt && !correct,
              dimmed: picked !== null && picked !== opt,
            }"
            :disabled="picked !== null"
            @click="onPick(opt)"
          >
            {{ opt }}
          </button>
        </div>

        <div class="quiz-actions">
          <button type="button" class="btn btn-ghost" @click="speak(quiz.spoken)">
            <AppIcon name="play" />
            听题
          </button>
          <button type="button" class="btn btn-primary" @click="nextQuiz">
            <AppIcon name="book" />
            换一题
          </button>
        </div>
      </div>
    </section>

    <DetailDialog
      :open="!!selected"
      :title="selected?.chinese ?? '数学启蒙'"
      tone="detail-math"
      @close="close"
    >
      <div v-if="selected">
        <div class="detail-emoji" aria-hidden="true">{{ selected.emoji }}</div>
        <div class="num-big">{{ selected.num }}</div>
        <div class="num-cn">{{ selected.chinese }} · {{ selected.pinyin }}</div>
        <div v-if="selected.num > 0" class="num-dots" aria-hidden="true">
          <span v-for="i in selected.num" :key="i">{{ selected.emoji }}</span>
        </div>
        <p class="detail-text">{{ selected.text }}</p>
        <AudioPlayer :text="read(selected)" />
      </div>
    </DetailDialog>
  </div>
</template>
