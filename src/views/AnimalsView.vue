<script setup lang="ts">
import { computed, onUnmounted, ref } from 'vue'
import { animals, type AnimalItem } from '../data/animals'
import { useSpeech } from '../composables/useSpeech'
import { useProgress } from '../composables/useProgress'
import { buildPickQuiz } from '../composables/useChallenge'
import type { LearnFilter } from '../components/ModuleLearnBar.vue'
import BigCard from '../components/BigCard.vue'
import DetailDialog from '../components/DetailDialog.vue'
import AudioPlayer from '../components/AudioPlayer.vue'
import ModuleLearnBar from '../components/ModuleLearnBar.vue'
import ChallengeLauncher from '../components/ChallengeLauncher.vue'

const MODULE = 'animals'
const { speak, stop } = useSpeech()
const { learn, isLearned, learnedCount } = useProgress()
const selected = ref<AnimalItem | null>(null)

const filter = ref<LearnFilter>('all')
const progress = computed(() => ({ learned: learnedCount(MODULE), total: animals.length }))

/** 按 category 分组，并应用筛选 */
const categories = computed(() => {
  const map = new Map<string, AnimalItem[]>()
  for (const item of animals) {
    if (filter.value === 'todo' && isLearned(MODULE, item.id)) continue
    if (filter.value === 'done' && !isLearned(MODULE, item.id)) continue
    const list = map.get(item.category) ?? []
    list.push(item)
    map.set(item.category, list)
  }
  return Array.from(map.entries()).filter(([, list]) => list.length > 0)
})

const emptyText = computed(() => {
  if (filter.value === 'todo') return '🎉 太棒了！动物朋友你都认识啦'
  if (filter.value === 'done') return '还没有学过的动物，点上面的大卡片认识一下吧'
  return ''
})

/** 今日小挑战：听名字 → 从 3 只动物里选对 */
function buildChallenge() {
  return buildPickQuiz(
    animals.map((a) => ({ id: a.id, label: a.name, emoji: a.emoji })),
    5,
    'grid'
  )
}

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
    <ModuleLearnBar :learned="progress.learned" :total="progress.total" v-model:filter="filter" />
    <ChallengeLauncher module="animals" label="动物乐园" :build="buildChallenge" />

    <template v-if="categories.length">
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
    </template>
    <p v-else class="list-empty" role="status">{{ emptyText }}</p>

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
