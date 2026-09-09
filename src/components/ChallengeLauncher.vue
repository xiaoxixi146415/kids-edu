<script setup lang="ts">
/**
 * 「今日小挑战」入口横幅：点击生成一组题目并打开 QuizDialog。
 * - module：闯关得星归属（useProgress.passQuiz 的栏目 key）
 * - build：由各栏目视图用自己数据生成题目的工厂（点击时才执行）
 * - 通关后 speak 结果语；App.vue 的 rewardTick 会自动播飘星动效
 */
import { onUnmounted, ref } from 'vue'
import { useSpeech } from '../composables/useSpeech'
import { useProgress } from '../composables/useProgress'
import type { QuizQuestion } from '../composables/useChallenge'
import QuizDialog from './QuizDialog.vue'

const props = withDefaults(
  defineProps<{
    module: string
    build: () => QuizQuestion[]
    /** 展示标题（带栏目名，便于 a11y） */
    label?: string
  }>(),
  { label: '学习' }
)

const { speak, stop } = useSpeech()
const { passQuiz } = useProgress()

const open = ref(false)
const questions = ref<QuizQuestion[]>([])

function launch() {
  const qs = props.build()
  if (qs.length === 0) {
    speak('题目不够啦，先去卡片里学一学再来挑战吧')
    return
  }
  questions.value = qs
  open.value = true
}

function onFinish(score: number, total: number) {
  const need = Math.ceil(total / 2)
  if (score >= need) {
    const fresh = passQuiz(props.module)
    speak(fresh ? '闯关成功，送你一颗小星星！明天再来，还能得星星哦' : '闯关成功！明天再来挑战，还能得星星哦')
  } else {
    speak('没关系，先学一学，下次一定能闯关成功')
  }
}

onUnmounted(stop)
</script>

<template>
  <button type="button" class="challenge-banner" @click="launch">
    <span class="ch-banner-emoji" aria-hidden="true">🎯</span>
    <span class="ch-banner-titles">
      <span class="ch-banner-title">{{ label }} · 今日小挑战</span>
      <span class="ch-banner-sub">答对 3 题得 ⭐ 小星星</span>
    </span>
  </button>

  <QuizDialog
    :open="open"
    :questions="questions"
    tone="detail-settings"
    @close="open = false"
    @finish="onFinish"
  />
</template>
