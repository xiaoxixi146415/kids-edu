<script setup lang="ts">
import { computed, onUnmounted, ref } from 'vue'
import { hanzi, type HanziItem } from '../data/hanzi'
import { useSpeech } from '../composables/useSpeech'
import { useProgress } from '../composables/useProgress'
import { buildPickQuiz } from '../composables/useChallenge'
import type { LearnFilter } from '../components/ModuleLearnBar.vue'
import BigCard from '../components/BigCard.vue'
import DetailDialog from '../components/DetailDialog.vue'
import AudioPlayer from '../components/AudioPlayer.vue'
import ModuleLearnBar from '../components/ModuleLearnBar.vue'
import ChallengeLauncher from '../components/ChallengeLauncher.vue'

const MODULE = 'hanzi'
const { speak, stop } = useSpeech()
const { learn, isLearned, learnedCount } = useProgress()
const selected = ref<HanziItem | null>(null)

const filter = ref<LearnFilter>('all')
const progress = computed(() => ({ learned: learnedCount(MODULE), total: hanzi.length }))

/** 按 category 分组，并应用筛选 */
const categories = computed(() => {
  const map = new Map<string, HanziItem[]>()
  for (const item of hanzi) {
    if (filter.value === 'todo' && isLearned(MODULE, item.id)) continue
    if (filter.value === 'done' && !isLearned(MODULE, item.id)) continue
    const list = map.get(item.category) ?? []
    list.push(item)
    map.set(item.category, list)
  }
  return Array.from(map.entries()).filter(([, list]) => list.length > 0)
})

const emptyText = computed(() => {
  if (filter.value === 'todo') return '🎉 太棒了！这里的字你都认识啦'
  if (filter.value === 'done') return '还没有学过的字，点上面的大卡片认一认吧'
  return ''
})

/**
 * 今日小挑战：听读音（直接念汉字，避免拼音被 TTS 念成英文）→ 从 3 个大汉字里选对。
 */
function buildChallenge() {
  return buildPickQuiz(
    hanzi.map((h) => ({ id: h.id, label: h.hanzi, emoji: h.emoji })),
    5,
    'chars'
  )
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
