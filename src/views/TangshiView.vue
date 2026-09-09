<script setup lang="ts">
import { computed, onUnmounted, ref } from 'vue'
import { tangshi, type Tangshi } from '../data/tangshi'
import { useSpeech } from '../composables/useSpeech'
import { useProgress } from '../composables/useProgress'
import { buildCoupletQuiz, type CoupletUnit } from '../composables/useChallenge'
import type { LearnFilter } from '../components/ModuleLearnBar.vue'
import BigCard from '../components/BigCard.vue'
import DetailDialog from '../components/DetailDialog.vue'
import AppIcon from '../components/AppIcon.vue'
import ModuleLearnBar from '../components/ModuleLearnBar.vue'
import ChallengeLauncher from '../components/ChallengeLauncher.vue'

const MODULE = 'tangshi'
const { speak, stop } = useSpeech()
const { learn, isLearned, learnedCount } = useProgress()
const selected = ref<Tangshi | null>(null)
const showMeaning = ref(false)

const filter = ref<LearnFilter>('all')
const progress = computed(() => ({ learned: learnedCount(MODULE), total: tangshi.length }))

/** 应用筛选后的列表 */
const items = computed(() =>
  tangshi.filter((t) => {
    if (filter.value === 'todo' && isLearned(MODULE, t.id)) return false
    if (filter.value === 'done' && !isLearned(MODULE, t.id)) return false
    return true
  })
)

const emptyText = computed(() => {
  if (filter.value === 'todo') return '🎉 太棒了！这些诗你都会背啦'
  if (filter.value === 'done') return '还没有学过的诗，点上面的大卡片背一背吧'
  return ''
})

/** 把整句诗拆成「上一句 → 下一句」的对子，供接句挑战用 */
const coupletPool = computed<CoupletUnit[]>(() =>
  tangshi.flatMap((t) => {
    const out: CoupletUnit[] = []
    for (let i = 0; i + 1 < t.lines.length; i += 2) {
      out.push({ id: `${t.id}:${i}`, lead: t.lines[i], answer: t.lines[i + 1] })
    }
    return out
  })
)

/** 今日小挑战：展示上一句，选对下一句 */
function buildChallenge() {
  return buildCoupletQuiz(coupletPool.value, 5)
}

function poemText(item: Tangshi) {
  return `${item.lines.join('，')}。`
}

function open(item: Tangshi) {
  selected.value = item
  showMeaning.value = false
  learn(MODULE, item.id)
  speak(poemText(item))
}

function readMeaning() {
  if (!selected.value) return
  showMeaning.value = true
  speak(`这首诗的意思是：${selected.value.meaning}`)
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
    <ChallengeLauncher module="tangshi" label="唐诗" :build="buildChallenge" />

    <template v-if="items.length">
      <div class="grid">
        <BigCard
          v-for="item in items"
          :key="item.id"
          :emoji="item.emoji"
          :title="item.title"
          :subtitle="item.author"
          tone="tone-green"
          :done="isLearned(MODULE, item.id)"
          @click="open(item)"
        />
      </div>
    </template>
    <p v-else class="list-empty" role="status">{{ emptyText }}</p>

    <DetailDialog
      :open="!!selected"
      :title="selected?.title ?? '唐诗'"
      tone="detail-tangshi"
      @close="close"
    >
      <div v-if="selected">
        <div class="detail-emoji" aria-hidden="true">{{ selected.emoji }}</div>
        <h2 class="poem-title">{{ selected.title }}</h2>
        <p class="poem-author">{{ selected.dynasty }} · {{ selected.author }}</p>
        <p class="poem-lines">{{ poemText(selected) }}</p>

        <Transition name="flip">
          <div v-if="showMeaning" class="meaning-box" role="status">
            <p class="meaning-text">{{ selected.meaning }}</p>
          </div>
        </Transition>

        <div class="ts-actions">
          <button type="button" class="btn btn-ghost" @click="speak(poemText(selected))">
            <AppIcon name="book" />
            读古诗
          </button>
          <button type="button" class="btn btn-primary" @click="readMeaning">
            <AppIcon name="feather" />
            听译文
          </button>
          <button type="button" class="btn btn-ghost" @click="stop">
            <AppIcon name="stop" />
            停止
          </button>
        </div>
      </div>
    </DetailDialog>
  </div>
</template>
