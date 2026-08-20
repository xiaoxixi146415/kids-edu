<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import { numbers, type MathNumber } from '../data/math'
import { useSpeech } from '../composables/useSpeech'
import { useMathQuiz } from '../composables/useMathQuiz'
import BigCard from '../components/BigCard.vue'
import DetailDialog from '../components/DetailDialog.vue'
import AudioPlayer from '../components/AudioPlayer.vue'
import AppIcon from '../components/AppIcon.vue'

const { speak, stop } = useSpeech()
const { quiz, picked, correct, next, pick, feedbackText } = useMathQuiz()
const selected = ref<MathNumber | null>(null)
const feedback = ref('')

function read(n: MathNumber) {
  return `${n.chinese}。${n.text}`
}

function open(n: MathNumber) {
  selected.value = n
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

onMounted(() => {
  speak(next().spoken)
})

onUnmounted(stop)
</script>

<template>
  <div class="list-page">
    <section class="group">
      <h2 class="group-title">认识数字</h2>
      <div class="grid">
        <BigCard
          v-for="n in numbers"
          :key="n.id"
          :emoji="n.emoji"
          :title="String(n.num)"
          :subtitle="n.chinese"
          tone="tone-red"
          @click="open(n)"
        />
      </div>
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
