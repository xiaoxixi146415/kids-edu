<script setup lang="ts">
import { computed, onUnmounted, ref } from 'vue'
import { pinyin, type PinyinItem } from '../data/pinyin'
import { useSpeech } from '../composables/useSpeech'
import { useProgress } from '../composables/useProgress'
import type { LearnFilter } from '../components/ModuleLearnBar.vue'
import BigCard from '../components/BigCard.vue'
import DetailDialog from '../components/DetailDialog.vue'
import AudioPlayer from '../components/AudioPlayer.vue'
import ModuleLearnBar from '../components/ModuleLearnBar.vue'

const MODULE = 'pinyin'
const { speak, stop } = useSpeech()
const { learn, isLearned, learnedCount } = useProgress()
const selected = ref<PinyinItem | null>(null)

const filter = ref<LearnFilter>('all')
const progress = computed(() => ({ learned: learnedCount(MODULE), total: pinyin.length }))

/** 按 group 分组，并应用筛选 */
const categories = computed(() => {
  const map = new Map<string, PinyinItem[]>()
  for (const item of pinyin) {
    if (filter.value === 'todo' && isLearned(MODULE, item.id)) continue
    if (filter.value === 'done' && !isLearned(MODULE, item.id)) continue
    const list = map.get(item.group) ?? []
    list.push(item)
    map.set(item.group, list)
  }
  return Array.from(map.entries()).filter(([, list]) => list.length > 0)
})

const emptyText = computed(() => {
  if (filter.value === 'todo') return '🎉 太棒了！拼音你都学完啦'
  if (filter.value === 'done') return '还没有学过的拼音，点上面的大卡片认一认吧'
  return ''
})

/**
 * 朗读内容。
 * 注意：不能把 item.pinyin（拉丁字母）交给语音合成，中文音色会把 b 念成英文字母「bi」，
 * 这里统一用 item.sound（汉字呼读音，如 b → 玻）来发音。
 */
function read(item: PinyinItem) {
  return `${item.sound}，${item.example}。${item.text}`
}

function open(item: PinyinItem) {
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

    <template v-if="categories.length">
      <section v-for="[cat, items] in categories" :key="cat" class="group">
        <h2 class="group-title">{{ cat }}</h2>
        <div class="grid">
          <BigCard
            v-for="item in items"
            :key="item.id"
            :emoji="item.emoji"
            :title="item.pinyin"
            :subtitle="item.example"
            tone="tone-pink"
            :done="isLearned(MODULE, item.id)"
            @click="open(item)"
          />
        </div>
      </section>
    </template>
    <p v-else class="list-empty" role="status">{{ emptyText }}</p>

    <DetailDialog
      :open="!!selected"
      :title="selected?.pinyin ?? '拼音乐园'"
      tone="detail-pinyin"
      @close="close"
    >
      <div v-if="selected">
        <div class="detail-emoji" aria-hidden="true">{{ selected.emoji }}</div>
        <div class="hanzi-big pinyin-big">{{ selected.pinyin }}</div>
        <div class="pinyin-example">{{ selected.example }}</div>
        <p class="detail-text">{{ selected.text }}</p>
        <AudioPlayer :text="read(selected)" />
      </div>
    </DetailDialog>
  </div>
</template>
