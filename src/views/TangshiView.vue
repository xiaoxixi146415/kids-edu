<script setup lang="ts">
import { onUnmounted, ref } from 'vue'
import { tangshi, type Tangshi } from '../data/tangshi'
import { useSpeech } from '../composables/useSpeech'
import BigCard from '../components/BigCard.vue'
import DetailDialog from '../components/DetailDialog.vue'
import AppIcon from '../components/AppIcon.vue'

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

    <DetailDialog
      :open="!!selected"
      :title="selected?.title ?? '唐诗'"
      tone="detail-tangshi"
      @close="close"
    >
      <div v-if="selected">
        <div class="detail-emoji" aria-hidden="true">{{ selected.emoji }}</div>
        <h2 class="poem-title">{{ selected.title }}</h2>
        <p class="poem-author">{{ selected.dynasty }} · {{ selected.author }}</p>
        <p class="poem-lines">{{ poemText(selected) }}</p>

        <Transition name="flip">
          <div v-if="showMeaning" class="meaning-box" role="status">
            <p class="meaning-text">{{ selected.meaning }}</p>
          </div>
        </Transition>

        <div class="ts-actions">
          <button type="button" class="btn btn-ghost" @click="speak(poemText(selected))">
            <AppIcon name="book" />
            读古诗
          </button>
          <button type="button" class="btn btn-primary" @click="readMeaning">
            <AppIcon name="feather" />
            听译文
          </button>
          <button type="button" class="btn btn-ghost" @click="stop">
            <AppIcon name="stop" />
            停止
          </button>
        </div>
      </div>
    </DetailDialog>
  </div>
</template>
