<script setup lang="ts">
import { computed, onUnmounted, ref } from 'vue'
import { encyclopedia, type EncyclopediaItem } from '../data/encyclopedia'
import { useSpeech } from '../composables/useSpeech'
import { useProgress } from '../composables/useProgress'
import { useResume } from '../composables/useResume'
import { buildPickQuiz } from '../composables/useChallenge'
import type { LearnFilter } from '../types'
import BigCard from '../components/BigCard.vue'
import DetailDialog from '../components/DetailDialog.vue'
import AudioPlayer from '../components/AudioPlayer.vue'
import ModuleLearnBar from '../components/ModuleLearnBar.vue'
import ChallengeLauncher from '../components/ChallengeLauncher.vue'
import { applyFilter, groupBy } from '../utils'

const MODULE = 'encyclopedia'
const { speak, stop } = useSpeech()
const { learn, isLearned, learnedCount, remember, challengePrefs } = useProgress()
const selected = ref<EncyclopediaItem | null>(null)

/** 筛选：全部 / 没学过 / 学过 */
const filter = ref<LearnFilter>('all')

/** 栏目学情（已学/总数），随学习实时更新 */
const progress = computed(() => ({ learned: learnedCount(MODULE), total: encyclopedia.length }))

/** 按 category 分组，并应用筛选 */
const categories = computed(() => {
  return groupBy(applyFilter(encyclopedia, filter.value, MODULE, isLearned), 'category')
})

const emptyText = computed(() => {
  if (filter.value === 'todo') return '🎉 太棒了！这个栏目的内容你都学完啦'
  if (filter.value === 'done') return '还没有学过的内容，点上面的大卡片开始吧'
  return ''
})

/** 今日小挑战：听名称 → 从 3 张图/名里选对（优先没学过的，混入最多 2 道错题） */
function buildChallenge() {
  const pool = encyclopedia.map((i) => ({ id: i.id, label: i.title, emoji: i.emoji }))
  const prefs = challengePrefs(MODULE, pool.map((u) => u.id))
  return buildPickQuiz(pool, 5, 'grid', prefs)
}

function read(item: EncyclopediaItem) {
  return `${item.title}。${item.text}`
}

function open(item: EncyclopediaItem) {
  selected.value = item
  remember(MODULE, item.id)
  learn(MODULE, item.id)
  speak(read(item))
}

function close() {
  stop()
  selected.value = null
}

// 首页「继续学习」带 ?open=id 进入时，直接打开对应条目
useResume(encyclopedia, (i) => i.id, open)

onUnmounted(stop)
</script>

<template>
  <div class="list-page">
    <ModuleLearnBar :learned="progress.learned" :total="progress.total" v-model:filter="filter" />
    <ChallengeLauncher module="encyclopedia" label="知识百科" :build="buildChallenge" />

    <template v-if="categories.length">
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
    </template>
    <p v-else class="list-empty" role="status">{{ emptyText }}</p>

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
