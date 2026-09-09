<script setup lang="ts">
import { computed, onUnmounted, ref } from 'vue'
import { animals, type AnimalItem } from '../data/animals'
import { useSpeech } from '../composables/useSpeech'
import { useProgress } from '../composables/useProgress'
import BigCard from '../components/BigCard.vue'
import DetailDialog from '../components/DetailDialog.vue'
import AudioPlayer from '../components/AudioPlayer.vue'

const MODULE = 'animals'
const { speak, stop } = useSpeech()
const { learn, isLearned } = useProgress()
const selected = ref<AnimalItem | null>(null)

/** 按 category 分组 */
const categories = computed(() => {
  const map = new Map<string, AnimalItem[]>()
  for (const item of animals) {
    const list = map.get(item.category) ?? []
    list.push(item)
    map.set(item.category, list)
  }
  return Array.from(map.entries())
})

function read(item: AnimalItem) {
  return `${item.name}。${item.sound}。${item.fact}`
}

function open(item: AnimalItem) {
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
          :title="item.name"
          :subtitle="item.sound"
          tone="tone-teal"
          :done="isLearned(MODULE, item.id)"
          @click="open(item)"
        />
      </div>
    </section>

    <DetailDialog
      :open="!!selected"
      :title="selected?.name ?? '动物乐园'"
      tone="detail-animal"
      @close="close"
    >
      <div v-if="selected">
        <div class="detail-emoji" aria-hidden="true">{{ selected.emoji }}</div>
        <h2 class="detail-title">{{ selected.name }}</h2>
        <div class="animal-sound">{{ selected.sound }}</div>
        <p class="detail-text">{{ selected.fact }}</p>
        <AudioPlayer :text="read(selected)" />
      </div>
    </DetailDialog>
  </div>
</template>
