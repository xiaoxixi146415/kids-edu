<script setup lang="ts">
/**
 * 「今日小挑战」入口横幅：点击生成一组题目并打开 QuizDialog。
 * - module：闯关得星归属（useProgress.passQuiz 的栏目 key）
 * - build：由各栏目视图用自己数据生成题目的工厂（点击时才执行）
 * - 通关后 speak 结果语；App.vue 的 rewardTick 会自动播飘星动效
 */
import { computed, onUnmounted, ref } from 'vue'
import { useSpeech } from '../composables/useSpeech'
import { useProgress } from '../composables/useProgress'
import { passThreshold, QUIZ_SIZE, type QuizQuestion } from '../composables/useChallenge'
import QuizDialog from './QuizDialog.vue'

const props = withDefaults(
  defineProps<{
    module: string
    build: () => QuizQuestion[]
    /** 展示标题（带栏目名，便于 a11y） */
    label?: string
    /** 题目是否依赖听音（听音认物题在静音/无中文音色时无法作答） */
    needsSound?: boolean
  }>(),
  { label: '学习', needsSound: true }
)

const { speak, stop, muted, canSpeak } = useSpeech()
const { passQuiz, quizPassedToday } = useProgress()

const open = ref(false)
const questions = ref<QuizQuestion[]>([])
const hint = ref('')

const passedToday = computed(() => quizPassedToday(props.module))
const unavailable = computed(() => props.needsSound && !canSpeak.value)

const subText = computed(() => {
  if (unavailable.value) return '打开声音就能玩 🔊'
  if (passedToday.value) return '今天已经得过 ⭐ 啦，再玩一次吧'
  return `答对 ${passThreshold(QUIZ_SIZE)} 题得 ⭐ 小星星`
})

function launch() {
  if (unavailable.value) {
    hint.value = muted.value
      ? '声音关掉了，点右上角小喇叭打开声音，再来挑战吧'
      : '这台设备还没有中文语音，换一台有声音的设备再来挑战吧'
    return
  }
  const qs = props.build()
  if (qs.length === 0) {
    speak('题目不够啦，先去卡片里学一学再来挑战吧')
    return
  }
  hint.value = ''
  questions.value = qs
  open.value = true
}

function onFinish(score: number, total: number) {
  const need = passThreshold(total)
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
  <button
    type="button"
    class="challenge-banner"
    :class="{ 'challenge-off': unavailable }"
    :aria-disabled="unavailable ? 'true' : undefined"
    @click="launch"
  >
    <span class="ch-banner-emoji" aria-hidden="true">🎯</span>
    <span class="ch-banner-titles">
      <span class="ch-banner-title">{{ label }} · 今日小挑战</span>
      <span class="ch-banner-sub">{{ subText }}</span>
    </span>
  </button>
  <p v-if="hint" class="ch-banner-hint" role="status">{{ hint }}</p>

  <QuizDialog
    :open="open"
    :questions="questions"
    :module="module"
    tone="detail-settings"
    @close="open = false"
    @finish="onFinish"
  />
</template>
