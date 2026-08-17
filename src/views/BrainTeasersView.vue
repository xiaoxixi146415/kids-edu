<script setup lang="ts">
import { onUnmounted, ref } from 'vue'
import { brainteasers, type BrainTeaser } from '../data/brainteasers'
import { useSpeech } from '../composables/useSpeech'
import BigCard from '../components/BigCard.vue'
import AudioPlayer from '../components/AudioPlayer.vue'

const { speak, stop } = useSpeech()
const selected = ref<BrainTeaser | null>(null)
const showAnswer = ref(false)

function open(item: BrainTeaser) {
  selected.value = item
  showAnswer.value = false
  speak(item.question)
}

function reveal() {
  if (!selected.value) return
  showAnswer.value = true
  speak(`答案是：${selected.value.answer}`)
}

function close() {
  stop()
  selected.value = null
}

onUnmounted(stop)
</script>

<template>
  <div class="list-page">
    <div class="grid">
      <BigCard
        v-for="item in brainteasers"
        :key="item.id"
        :emoji="item.emoji"
        :title="item.question"
        tone="tone-purple"
        @click="open(item)"
      />
    </div>

    <Transition name="pop">
      <div v-if="selected" class="detail-overlay" @click.self="close">
        <div class="detail-card detail-bt">
          <button class="close-btn" aria-label="关闭" @click="close">✕</button>
          <div class="detail-emoji">{{ selected.emoji }}</div>
          <h2 class="detail-question">🤔 {{ selected.question }}</h2>

          <Transition name="flip">
            <div v-if="showAnswer" class="answer-box">
              <p class="answer-text">💡 {{ selected.answer }}</p>
            </div>
          </Transition>

          <div class="bt-actions">
            <button v-if="!showAnswer" class="btn btn-primary" @click="reveal">
              🌟 揭晓答案
            </button>
            <AudioPlayer v-else :text="`答案是：${selected.answer}`" />
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>
