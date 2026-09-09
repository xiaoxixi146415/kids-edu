<script setup lang="ts">
import { computed, onUnmounted, ref } from 'vue'
import { brainteasers, type BrainTeaser } from '../data/brainteasers'
import { useSpeech } from '../composables/useSpeech'
import { useProgress } from '../composables/useProgress'
import type { LearnFilter } from '../components/ModuleLearnBar.vue'
import BigCard from '../components/BigCard.vue'
import DetailDialog from '../components/DetailDialog.vue'
import AudioPlayer from '../components/AudioPlayer.vue'
import AppIcon from '../components/AppIcon.vue'
import ModuleLearnBar from '../components/ModuleLearnBar.vue'

const MODULE = 'brainteasers'
const { speak, stop } = useSpeech()
const { learn, isLearned, learnedCount } = useProgress()
const selected = ref<BrainTeaser | null>(null)
const showAnswer = ref(false)

const filter = ref<LearnFilter>('all')
const progress = computed(() => ({ learned: learnedCount(MODULE), total: brainteasers.length }))

/** 应用筛选后的列表 */
const items = computed(() =>
  brainteasers.filter((t) => {
    if (filter.value === 'todo' && isLearned(MODULE, t.id)) return false
    if (filter.value === 'done' && !isLearned(MODULE, t.id)) return false
    return true
  })
)

const emptyText = computed(() => {
  if (filter.value === 'todo') return '🎉 太棒了！脑筋急转弯你都猜完啦'
  if (filter.value === 'done') return '还没有猜过的题目，点上面的大卡片开动小脑瓜吧'
  return ''
})

function open(item: BrainTeaser) {
  selected.value = item
  showAnswer.value = false
  speak(item.question)
}

function reveal() {
  if (!selected.value) return
  showAnswer.value = true
  // 猜到答案才计入「学完」：得星 + 卡片打勾
  learn(MODULE, selected.value.id)
  speak(`答案是：${selected.value.answer}`)
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

    <template v-if="items.length">
      <div class="grid">
        <BigCard
          v-for="item in items"
          :key="item.id"
          :emoji="item.emoji"
          :title="item.question"
          tone="tone-purple"
          :done="isLearned(MODULE, item.id)"
          @click="open(item)"
        />
      </div>
    </template>
    <p v-else class="list-empty" role="status">{{ emptyText }}</p>

    <DetailDialog
      :open="!!selected"
      :title="selected?.question ?? '脑筋急转弯'"
      tone="detail-bt"
      @close="close"
    >
      <div v-if="selected">
        <div class="detail-emoji" aria-hidden="true">{{ selected.emoji }}</div>
        <h2 class="detail-question">{{ selected.question }}</h2>

        <Transition name="flip">
          <div v-if="showAnswer" class="answer-box" role="status">
            <p class="answer-text">{{ selected.answer }}</p>
          </div>
        </Transition>

        <div class="bt-actions">
          <button v-if="!showAnswer" type="button" class="btn btn-primary" @click="reveal">
            <AppIcon name="bulb" />
            揭晓答案
          </button>
          <AudioPlayer v-else :text="`答案是：${selected.answer}`" />
        </div>
      </div>
    </DetailDialog>
  </div>
</template>
