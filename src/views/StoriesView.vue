<script setup lang="ts">
import { computed, onUnmounted, ref } from 'vue'
import { stories, type Story } from '../data/stories'
import { useSpeech } from '../composables/useSpeech'
import { useProgress } from '../composables/useProgress'
import BigCard from '../components/BigCard.vue'
import DetailDialog from '../components/DetailDialog.vue'
import AppIcon from '../components/AppIcon.vue'

const MODULE = 'stories'
const { speak, stop } = useSpeech()
const { learn, isLearned } = useProgress()
const current = ref<Story | null>(null)
const page = ref(0)

const isFirst = computed(() => page.value === 0)
const isLast = computed(
  () => current.value === null || page.value >= current.value.pages.length - 1
)

function open(s: Story) {
  current.value = s
  page.value = 0
  // 单页绘本打开即读完；多页需翻到最后一页才计入
  if (s.pages.length <= 1) learn(MODULE, s.id)
  speak(s.pages[0].text)
}

function close() {
  stop()
  current.value = null
}

function prev() {
  if (isFirst.value) return
  page.value--
  speak(current.value!.pages[page.value].text)
}

function next() {
  if (isLast.value) return
  page.value++
  speak(current.value!.pages[page.value].text)
  // 翻到最后一页 = 整本绘本读完，得星 + 卡片打勾
  if (isLast.value && current.value) learn(MODULE, current.value.id)
}

function readCurrent() {
  if (!current.value) return
  speak(current.value.pages[page.value].text)
}

onUnmounted(stop)
</script>

<template>
  <div class="list-page">
    <div class="grid">
      <BigCard
        v-for="s in stories"
        :key="s.id"
        :emoji="s.emoji"
        :title="s.title"
        tone="tone-amber"
        :done="isLearned(MODULE, s.id)"
        @click="open(s)"
      />
    </div>

    <DetailDialog
      :open="!!current"
      :title="current?.title ?? '绘本故事'"
      tone="detail-story"
      @close="close"
    >
      <div v-if="current" class="story-view">
        <div class="story-emoji" aria-hidden="true">{{ current.pages[page].emoji }}</div>
        <p class="story-text">{{ current.pages[page].text }}</p>

        <div class="story-dots" role="presentation">
          <span
            v-for="(_, i) in current.pages"
            :key="i"
            class="story-dot"
            :class="{ active: i === page }"
            aria-hidden="true"
          ></span>
        </div>
        <p class="story-page-num">第 {{ page + 1 }} / {{ current.pages.length }} 页</p>

        <div class="story-nav">
          <button type="button" class="btn btn-ghost" :disabled="isFirst" @click="prev">
            <AppIcon name="back" />
            上一页
          </button>
          <button type="button" class="btn btn-ghost" @click="readCurrent">
            <AppIcon name="play" />
            再读一遍
          </button>
          <button type="button" class="btn btn-primary" :disabled="isLast" @click="next">
            下一页
            <AppIcon name="next" />
          </button>
        </div>
      </div>
    </DetailDialog>
  </div>
</template>
