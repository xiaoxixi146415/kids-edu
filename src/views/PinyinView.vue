<script setup lang="ts">
import { computed, onUnmounted, ref } from 'vue'
import { pinyin, type PinyinItem } from '../data/pinyin'
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

const MODULE = 'pinyin'
const { speak, stop } = useSpeech()
const { learn, isLearned, learnedCount, remember, challengePrefs } = useProgress()
const selected = ref<PinyinItem | null>(null)

const filter = ref<LearnFilter>('all')
const age = ref<AgeFilter>('all')
const progress = computed(() => ({ learned: learnedCount(MODULE), total: pinyin.length }))

/** 当前年龄段的内容（挑战也只在当前年龄段里出题） */
const ageItems = computed(() => applyAgeFilter(pinyin, MODULE, age.value, (p) => p.group))

/** 按 group 分组，并应用筛选 */
const categories = computed(() => {
  const visible = applyFilter(ageItems.value, filter.value, MODULE, isLearned)
  return groupBy(visible, 'group')
})

const emptyText = computed(() => {
  if (age.value !== 'all' && ageItems.value.length === 0) return '这个年龄段还没有拼音，换一个年龄段看看吧'
  if (filter.value === 'todo') return '🎉 太棒了！拼音你都学完啦'
  if (filter.value === 'done') return '还没有学过的拼音，点上面的大卡片认一认吧'
  return ''
})

/**
 * 今日小挑战：TTS 念汉字呼读音，选项显示拼音。
 * 注意：say 用 sound（如 b → 玻），不能把拉丁字母交给中文语音合成。
 */
function buildChallenge() {
  const pool = ageItems.value.map((p) => ({
    id: p.id,
    label: p.pinyin,
    emoji: p.emoji,
    say: p.sound,
  }))
  const prefs = challengePrefs(MODULE, pool.map((u) => u.id))
  return buildPickQuiz(pool, 5, 'grid', prefs, '听一听，选出正确的拼音')
}

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
  remember(MODULE, item.id)
  learn(MODULE, item.id)
  speak(read(item))
}

function close() {
  stop()
  selected.value = null
}

useResume(pinyin, (p) => p.id, open)

onUnmounted(stop)
</script>

<template>
  <div class="list-page">
    <ModuleLearnBar :learned="progress.learned" :total="progress.total" v-model:filter="filter" v-model:age="age" />
    <ChallengeLauncher module="pinyin" label="拼音乐园" :build="buildChallenge" />

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
