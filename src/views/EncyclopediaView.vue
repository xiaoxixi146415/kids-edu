<script setup lang="ts">
import { computed, onUnmounted, ref } from 'vue'
import { encyclopedia, type EncyclopediaItem } from '../data/encyclopedia'
import { useSpeech } from '../composables/useSpeech'
import { useProgress } from '../composables/useProgress'
import BigCard from '../components/BigCard.vue'
import DetailDialog from '../components/DetailDialog.vue'
import AudioPlayer from '../components/AudioPlayer.vue'

const MODULE = 'encyclopedia'
const { speak, stop } = useSpeech()
const { learn, isLearned } = useProgress()
const selected = ref<EncyclopediaItem | null>(null)

/** 按 category 分组 */
const categories = computed(() => {
  const map = new Map<string, EncyclopediaItem[]>()
  for (const item of encyclopedia) {
    const list = map.get(item.category) ?? []
    list.push(item)
    map.set(item.category, list)
  }
  return Array.from(map.entries())
})

function read(item: EncyclopediaItem) {
  return `${item.title}。${item.text}`
}

function open(item: EncyclopediaItem) {
  selected.value = item
  learn(MODULE, item.id)
  speak(read(item))
}

function close() {
  stop()
  selected.value = null
}

onUnmounted(stop)
</script>

<template>
  <div class="list-page">
    <section v-for="[cat, items] in categories" :key="cat" class="group">
      <h2 class="group-title">{{ cat }}</h2>
      <div class="grid">
        <BigCard
          v-for="item in items"
          :key="item.id"
          :emoji="item.emoji"
          :title="item.title"
          tone="tone-orange"
          :done="isLearned(MODULE, item.id)"
          @click="open(item)"
        />
      </div>
    </section>

    <DetailDialog
      :open="!!selected"
      :title="selected?.title ?? '知识百科'"
      tone="detail-en"
      @close="close"
    >
      <div v-if="selected">
        <div class="detail-emoji" aria-hidden="true">{{ selected.emoji }}</div>
        <h2 class="detail-title">{{ selected.title }}</h2>
        <p class="detail-text">{{ selected.text }}</p>
        <AudioPlayer :text="read(selected)" />
      </div>
    </DetailDialog>
  </div>
</template>
