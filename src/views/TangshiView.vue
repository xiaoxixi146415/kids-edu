<script setup lang="ts">
import { onUnmounted, ref } from 'vue'
import { tangshi, type Tangshi } from '../data/tangshi'
import { useSpeech } from '../composables/useSpeech'
import BigCard from '../components/BigCard.vue'

const { speak, stop } = useSpeech()
const selected = ref<Tangshi | null>(null)
const showMeaning = ref(false)

function poemText(item: Tangshi) {
  return `${item.lines.join('，')}。`
}

function open(item: Tangshi) {
  selected.value = item
  showMeaning.value = false
  speak(poemText(item))
}

function readMeaning() {
  if (!selected.value) return
  showMeaning.value = true
  speak(`这首诗的意思是：${selected.value.meaning}`)
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
        v-for="item in tangshi"
        :key="item.id"
        :emoji="item.emoji"
        :title="item.title"
        :subtitle="item.author"
        tone="tone-green"
        @click="open(item)"
      />
    </div>

    <Transition name="pop">
      <div v-if="selected" class="detail-overlay" @click.self="close">
        <div class="detail-card detail-tangshi">
          <button class="close-btn" aria-label="关闭" @click="close">✕</button>
          <div class="detail-emoji">{{ selected.emoji }}</div>
          <h2 class="poem-title">{{ selected.title }}</h2>
          <p class="poem-author">{{ selected.dynasty }} · {{ selected.author }}</p>
          <p class="poem-lines">{{ poemText(selected) }}</p>

          <Transition name="flip">
            <div v-if="showMeaning" class="meaning-box">
              <p class="meaning-text">💡 {{ selected.meaning }}</p>
            </div>
          </Transition>

          <div class="ts-actions">
            <button class="btn btn-ghost" @click="speak(poemText(selected))">📜 读古诗</button>
            <button class="btn btn-primary" @click="readMeaning">📖 听译文</button>
            <button class="btn btn-ghost" @click="stop">⏹ 停止</button>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>
