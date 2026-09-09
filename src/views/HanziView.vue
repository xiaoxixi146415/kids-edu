<script setup lang="ts">
import { computed, onUnmounted, ref } from 'vue'
import { hanzi, type HanziItem } from '../data/hanzi'
import { useSpeech } from '../composables/useSpeech'
import { useProgress } from '../composables/useProgress'
import BigCard from '../components/BigCard.vue'
import DetailDialog from '../components/DetailDialog.vue'
import AudioPlayer from '../components/AudioPlayer.vue'

const MODULE = 'hanzi'
const { speak, stop } = useSpeech()
const { learn, isLearned } = useProgress()
const selected = ref<HanziItem | null>(null)

/** 按 category 分组 */
const categories = computed(() => {
  const map = new Map<string, HanziItem[]>()
  for (const item of hanzi) {
    const list = map.get(item.category) ?? []
    list.push(item)
    map.set(item.category, list)
  }
  return Array.from(map.entries())
})

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
