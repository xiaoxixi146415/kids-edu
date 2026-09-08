<script setup lang="ts">
import { computed, onUnmounted, ref } from 'vue'
import { pinyin, type PinyinItem } from '../data/pinyin'
import { useSpeech } from '../composables/useSpeech'
import BigCard from '../components/BigCard.vue'
import DetailDialog from '../components/DetailDialog.vue'
import AudioPlayer from '../components/AudioPlayer.vue'

const { speak, stop } = useSpeech()
const selected = ref<PinyinItem | null>(null)

/** 按 group 分组 */
const categories = computed(() => {
  const map = new Map<string, PinyinItem[]>()
  for (const item of pinyin) {
    const list = map.get(item.group) ?? []
    list.push(item)
    map.set(item.group, list)
  }
  return Array.from(map.entries())
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
          :title="item.pinyin"
          :subtitle="item.example"
          tone="tone-pink"
          @click="open(item)"
        />
      </div>
    </section>

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
