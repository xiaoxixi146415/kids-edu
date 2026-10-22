<script setup lang="ts">
import { computed, onUnmounted, ref } from 'vue'
import { hanzi, type HanziItem } from '../data/hanzi'
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

const MODULE = 'hanzi'
const { speak, stop } = useSpeech()
const { learn, isLearned, learnedCount, remember, challengePrefs } = useProgress()
const selected = ref<HanziItem | null>(null)

const filter = ref<LearnFilter>('all')
const age = ref<AgeFilter>('all')
const progress = computed(() => ({ learned: learnedCount(MODULE), total: hanzi.length }))

/** 当前年龄段的内容（挑战也只在当前年龄段里出题） */
const ageItems = computed(() => applyAgeFilter(hanzi, MODULE, age.value, (h) => h.category))

/** 按 category 分组，并应用筛选 */
const categories = computed(() => {
  const visible = applyFilter(ageItems.value, filter.value, MODULE, isLearned)
  return groupBy(visible, 'category')
})

const emptyText = computed(() => {
  if (age.value !== 'all' && ageItems.value.length === 0) return '这个年龄段还没有字，换一个年龄段看看吧'
  if (filter.value === 'todo') return '🎉 太棒了！这里的字你都认识啦'
  if (filter.value === 'done') return '还没有学过的字，点上面的大卡片认一认吧'
  return ''
})

/**
 * 今日小挑战：听读音（直接念汉字，避免拼音被 TTS 念成英文）→ 从 3 个大汉字里选对。
 */
function buildChallenge() {
  const pool = ageItems.value.map((h) => ({ id: h.id, label: h.hanzi, emoji: h.emoji }))
  const prefs = challengePrefs(MODULE, pool.map((u) => u.id))
  return buildPickQuiz(pool, 5, 'chars', prefs)
}

/**
 * 朗读内容。
 * 注意：拼音（如 yī）是拉丁字母，中文语音合成会按英文字母念，所以读音直接念汉字本身。
 */
function read(item: HanziItem) {
  return `${item.hanzi}。组词，${item.words.join('、')}。${item.text}`
}

function open(item: HanziItem) {
  selected.value = item
  remember(MODULE, item.id)
  learn(MODULE, item.id)
  speak(read(item))
}

function close() {
  stop()
  selected.value = null
}

useResume(hanzi, (h) => h.id, open)

onUnmounted(stop)
</script>

<template>
  <div class="list-page">
    <ModuleLearnBar :learned="progress.learned" :total="progress.total" v-model:filter="filter" v-model:age="age" />
    <ChallengeLauncher module="hanzi" label="识字认字" :build="buildChallenge" />

    <template v-if="categories.length">
      <section v-for="[cat, items] in categories" :key="cat" class="group">
        <h2 class="group-title">{{ cat }}</h2>
        <div class="grid">
          <BigCard
            v-for="item in items"
            :key="item.id"
            :emoji="item.emoji"
            :title="item.hanzi"
            :subtitle="item.pinyin"
            tone="tone-blue"
            :done="isLearned(MODULE, item.id)"
            @click="open(item)"
          />
        </div>
      </section>
    </template>
    <p v-else class="list-empty" role="status">{{ emptyText }}</p>

    <DetailDialog
      :open="!!selected"
      :title="selected?.hanzi ?? '识字认字'"
      tone="detail-hanzi"
      @close="close"
    >
      <div v-if="selected">
        <div class="detail-emoji" aria-hidden="true">{{ selected.emoji }}</div>
        <div class="hanzi-big">{{ selected.hanzi }}</div>
        <div class="hanzi-pinyin">{{ selected.pinyin }}</div>
        <div class="hanzi-words">
          <span v-for="w in selected.words" :key="w" class="word-chip">{{ w }}</span>
        </div>
        <p class="detail-text">{{ selected.text }}</p>
        <AudioPlayer :text="read(selected)" />
      </div>
    </DetailDialog>
  </div>
</template>
