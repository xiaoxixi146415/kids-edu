<script setup lang="ts">
import { computed, onUnmounted, ref } from 'vue'
import { nurseryRhymes, type NurseryRhyme } from '../data/nursery'
import { useSpeech } from '../composables/useSpeech'
import { useProgress } from '../composables/useProgress'
import type { LearnFilter } from '../components/ModuleLearnBar.vue'
import BigCard from '../components/BigCard.vue'
import DetailDialog from '../components/DetailDialog.vue'
import AppIcon from '../components/AppIcon.vue'
import ModuleLearnBar from '../components/ModuleLearnBar.vue'

const MODULE = 'nursery'
const { speak, speakLines, stop, muted, supported } = useSpeech()
const { learn, isLearned, learnedCount } = useProgress()
const selected = ref<NurseryRhyme | null>(null)
/** 当前正在看/唱的句下标 */
const active = ref(0)
/** 是否正在连唱（自动逐句切画面） */
const playing = ref(false)
const showTip = ref(false)

const filter = ref<LearnFilter>('all')
const progress = computed(() => ({ learned: learnedCount(MODULE), total: nurseryRhymes.length }))

/** 按 category 分组 + 应用筛选 */
const groups = computed(() => {
  const map = new Map<string, NurseryRhyme[]>()
  for (const r of nurseryRhymes) {
    if (filter.value === 'todo' && isLearned(MODULE, r.id)) continue
    if (filter.value === 'done' && !isLearned(MODULE, r.id)) continue
    const list = map.get(r.category) ?? []
    list.push(r)
    map.set(r.category, list)
  }
  return Array.from(map.entries()).filter(([, list]) => list.length > 0)
})

const emptyText = computed(() => {
  if (filter.value === 'todo') return '🎉 太棒了！这些歌你都会唱啦'
  if (filter.value === 'done') return '还没有唱过的歌，点上面的卡片听一听吧'
  return ''
})

const isFirst = computed(() => active.value === 0)
const isLast = computed(() => selected.value === null || active.value >= selected.value.lines.length - 1)

function open(r: NurseryRhyme) {
  selected.value = r
  active.value = 0
  playing.value = false
  showTip.value = false
  speak(r.lines[0].text)
}

function close() {
  stopPlaying()
  selected.value = null
}

/** 切到某句并朗读；抵达末句 = 学完 */
function goTo(i: number) {
  if (!selected.value) return
  const idx = Math.max(0, Math.min(i, selected.value.lines.length - 1))
  stopPlaying()
  active.value = idx
  if (idx >= selected.value.lines.length - 1) learn(MODULE, selected.value.id)
  speak(selected.value.lines[idx].text)
}

function prev() {
  if (!isFirst.value) goTo(active.value - 1)
}

function next() {
  if (!isLast.value) goTo(active.value + 1)
}

function stopPlaying() {
  stop()
  if (silentTimer) {
    window.clearInterval(silentTimer)
    silentTimer = undefined
  }
  playing.value = false
}

/** 无声设备/静音时的逐句演示节拍，让动画仍能播完 */
let silentTimer: number | undefined
const silentStep = () => {
  if (silentTimer) window.clearInterval(silentTimer)
  const r = selected.value
  if (!r) return
  let i = active.value
  silentTimer = window.setInterval(() => {
    if (i >= r.lines.length - 1) {
      window.clearInterval(silentTimer)
      silentTimer = undefined
      playing.value = false
      learn(MODULE, r.id)
      return
    }
    i++
    active.value = i
  }, 900)
}

/** 从第一句开始整首连唱：逐句朗读并自动翻页，唱完得星 */
function singAll() {
  const r = selected.value
  if (!r || playing.value) return
  active.value = 0
  playing.value = true
  if (!supported || muted.value) {
    // 静音/无声：改用节拍演示完整首
    silentStep()
    return
  }
  speakLines(
    r.lines.map((l) => l.text),
    (i) => {
      active.value = i
    },
    () => {
      playing.value = false
      learn(MODULE, r.id)
    }
  )
}

/** 「想一想」提问：展开并朗读 */
function toggleTip() {
  const r = selected.value
  if (!r) return
  if (showTip.value) {
    showTip.value = false
    stopPlaying()
    return
  }
  stopPlaying()
  showTip.value = true
  speak(`想一想：${r.tip}`)
}

onUnmounted(() => {
  if (silentTimer) window.clearInterval(silentTimer)
  stop()
})
</script>

<template>
  <div class="list-page">
    <ModuleLearnBar :learned="progress.learned" :total="progress.total" v-model:filter="filter" />

    <template v-if="groups.length">
      <section v-for="[cat, items] in groups" :key="cat" class="group">
        <h2 class="group-title">{{ cat }}</h2>
        <div class="grid">
          <BigCard
            v-for="r in items"
            :key="r.id"
            :emoji="r.emoji"
            :title="r.title"
            tone="tone-lime"
            :done="isLearned(MODULE, r.id)"
            @click="open(r)"
          />
        </div>
      </section>
    </template>
    <p v-else class="list-empty" role="status">{{ emptyText }}</p>

    <DetailDialog
      :open="!!selected"
      :title="selected?.title ?? '儿童歌谣'"
      tone="detail-nursery"
      @close="close"
    >
      <div v-if="selected" class="rhyme-view">
        <Transition name="pop" mode="out-in">
          <div :key="active" class="rhyme-stage">
            <div class="rhyme-line-emoji" aria-hidden="true">{{ selected.lines[active].emoji }}</div>
            <p class="rhyme-line-text">{{ selected.lines[active].text }}</p>
            <p class="rhyme-line-num">
              第 {{ active + 1 }} / {{ selected.lines.length }} 句
              <span v-if="isLearned(MODULE, selected.id)">· 已会唱 ✅</span>
            </p>
          </div>
        </Transition>

        <div class="rhyme-dots" role="presentation">
          <span
            v-for="(_, i) in selected.lines"
            :key="i"
            class="rhyme-dot"
            :class="{ active: i === active }"
            aria-hidden="true"
          ></span>
        </div>

        <div class="rhyme-nav">
          <button type="button" class="btn btn-ghost" :disabled="isFirst" @click="prev">
            <AppIcon name="back" />
            上一句
          </button>
          <button type="button" class="btn btn-primary" :disabled="playing" @click="singAll">
            <AppIcon name="play" />
            连唱一遍
          </button>
          <button v-if="playing" type="button" class="btn btn-ghost" @click="stopPlaying">
            <AppIcon name="stop" />
            停
          </button>
          <button type="button" class="btn btn-ghost" :disabled="isLast" @click="next">
            下一句
            <AppIcon name="next" />
          </button>
        </div>

        <button type="button" class="tip-toggle" :class="{ open: showTip }" @click="toggleTip">
          <AppIcon name="bulb" />
          {{ showTip ? '收起想一想' : '想一想' }}
        </button>
        <Transition name="flip">
          <p v-if="showTip" class="rhyme-tip" role="status">{{ selected.tip }}</p>
        </Transition>
      </div>
    </DetailDialog>
  </div>
</template>
