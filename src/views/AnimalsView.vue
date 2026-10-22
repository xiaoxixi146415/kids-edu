<script setup lang="ts">
import { computed, onUnmounted, ref } from 'vue'
import { animals, type AnimalItem } from '../data/animals'
import { useSpeech } from '../composables/useSpeech'
import { useProgress } from '../composables/useProgress'
import { useResume } from '../composables/useResume'
import { buildPickQuiz } from '../composables/useChallenge'
import type { AgeFilter, LearnFilter } from '../types'
import BigCard from '../components/BigCard.vue'
import DetailDialog from '../components/DetailDialog.vue'
import AudioPlayer from '../components/AudioPlayer.vue'
import ModuleLearnBar from '../components/ModuleLearnBar.vue'
import ChallengeLauncher from '../components/ChallengeLauncher.vue'
import { applyAgeFilter, applyFilter, groupBy } from '../utils'

const MODULE = 'animals'
const { speak, stop } = useSpeech()
const { learn, isLearned, learnedCount, remember, challengePrefs } = useProgress()
const selected = ref<AnimalItem | null>(null)

const filter = ref<LearnFilter>('all')
const age = ref<AgeFilter>('all')
const progress = computed(() => ({ learned: learnedCount(MODULE), total: animals.length }))

/** 当前年龄段的内容（挑战也只在当前年龄段里出题） */
const ageItems = computed(() => applyAgeFilter(animals, MODULE, age.value))

/** 按 category 分组，并应用筛选 */
const categories = computed(() => {
  const visible = applyFilter(ageItems.value, filter.value, MODULE, isLearned)
  return groupBy(visible, 'category')
})

const emptyText = computed(() => {
  if (age.value !== 'all' && ageItems.value.length === 0) return '这个年龄段还没有内容，换一个年龄段看看吧'
  if (filter.value === 'todo') return '🎉 太棒了！动物朋友你都认识啦'
  if (filter.value === 'done') return '还没有学过的动物，点上面的大卡片认识一下吧'
  return ''
})

/** 今日小挑战：听名字 → 从 3 只动物里选对（优先没学过的，混入最多 2 道错题） */
function buildChallenge() {
  const pool = ageItems.value.map((a) => ({ id: a.id, label: a.name, emoji: a.emoji }))
  const prefs = challengePrefs(MODULE, pool.map((u) => u.id))
  return buildPickQuiz(pool, 5, 'grid', prefs)
}

function read(item: AnimalItem) {
  return `${item.name}。${item.sound}。${item.fact}`
}

function open(item: AnimalItem) {
  selected.value = item
  remember(MODULE, item.id)
  learn(MODULE, item.id)
  speak(read(item))
}

function close() {
  stop()
  selected.value = null
}

useResume(animals, (a) => a.id, open)

onUnmounted(stop)
</script>

<template>
  <div class="list-page">
    <ModuleLearnBar :learned="progress.learned" :total="progress.total" v-model:filter="filter" v-model:age="age" />
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
