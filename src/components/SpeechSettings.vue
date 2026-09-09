<script setup lang="ts">
/**
 * 设置弹层：语音设置（中文音色 + 语速三档）+ 学习记录（统计展示 + 家长重置）。
 * - 复用 DetailDialog 弹层语义（焦点/退出/可访问名）
 * - 语音改动即生效并持久化（useSpeech.settings / setVoice / setRate）
 * - 学习统计来自 useProgress；重置需二次确认，防幼儿误触
 */
import { computed, onUnmounted, ref } from 'vue'
import { useSpeech } from '../composables/useSpeech'
import { useProgress } from '../composables/useProgress'
import DetailDialog from './DetailDialog.vue'

withDefaults(defineProps<{ open: boolean }>(), { open: false })
const emit = defineEmits<{ (e: 'close'): void }>()

const { settings, zhVoices, voicesChecked, supported, setVoice, setRate } = useSpeech()
const { stars, streak, todayCount, dailyGoal, reset } = useProgress()

/** 可用中文音色：短名（去 lang 后缀），便于幼儿家长识别 */
const voiceOptions = computed(() =>
  zhVoices.value.map((v) => ({
    uri: v.voiceURI,
    name: v.name.replace(/\s*(zh-CN|zh-[A-Za-z]+)$/i, ''),
  }))
)

/** 无音色时的提示文案：区分「不支持 / 加载中 / 设备没装中文音色」 */
const voiceHint = computed(() => {
  if (!supported) return '当前浏览器不支持语音朗读，换用系统浏览器（如 Safari、Chrome）打开试试'
  if (!voicesChecked.value) return '正在加载可用音色…'
  if (!zhVoices.value.length) return '未检测到可用中文音色，请在手机系统设置里安装/启用中文语音包后重试'
  return ''
})

const RATES = [
  { value: 0.7, label: '🐢 慢一点' },
  { value: 0.85, label: '😊 标准' },
  { value: 1.0, label: '🐇 稍快' },
]

/* —— 重置学习记录（二次确认） —— */
const armReset = ref(false)
const resetMsg = ref('')
let armTimer: number | undefined

function tryReset() {
  if (!armReset.value) {
    armReset.value = true
    resetMsg.value = '再点一次「确认清除」，学习记录就会全部清零（宝宝要重新开始）'
    armTimer = window.setTimeout(() => {
      armReset.value = false
      resetMsg.value = ''
    }, 4000)
    return
  }
  window.clearTimeout(armTimer)
  armReset.value = false
  resetMsg.value = ''
  reset()
}

onUnmounted(() => window.clearTimeout(armTimer))

function close() {
  emit('close')
}
</script>

<template>
  <DetailDialog :open="open" title="设置" tone="detail-settings" @close="close">
    <h2 class="settings-title">设置</h2>

    <!-- 音色 -->
    <fieldset class="settings-field">
      <legend class="settings-label">音色</legend>
      <div class="settings-voice-list" role="radiogroup" aria-label="选择音色">
        <button
          type="button"
          role="radio"
          :aria-checked="settings.voiceURI === null"
          class="voice-chip"
          :class="{ active: settings.voiceURI === null }"
          @click="setVoice(null)"
        >
          自动挑选 ✨
        </button>
        <button
          v-for="v in voiceOptions"
          :key="v.uri"
          type="button"
          role="radio"
          :aria-checked="settings.voiceURI === v.uri"
          class="voice-chip"
          :class="{ active: settings.voiceURI === v.uri }"
          @click="setVoice(v.uri)"
        >
          {{ v.name }}
        </button>
      </div>
      <p v-if="!zhVoices.length" class="settings-hint">{{ voiceHint }}</p>
    </fieldset>

    <!-- 语速 -->
    <fieldset class="settings-field">
      <legend class="settings-label">语速</legend>
      <div class="settings-rate" role="group" aria-label="选择语速">
        <button
          v-for="r in RATES"
          :key="r.value"
          type="button"
          class="rate-btn"
          :class="{ active: settings.rate === r.value }"
          @click="setRate(r.value)"
        >
          {{ r.label }}
        </button>
      </div>
    </fieldset>

    <!-- 学习记录 -->
    <section class="settings-field" aria-label="学习记录">
      <h3 class="settings-label">学习记录</h3>
      <div class="settings-stats">
        <span class="stat-pill"><span class="emoji" aria-hidden="true">⭐</span> <b>{{ stars }}</b> 颗星</span>
        <span class="stat-pill"><span class="emoji" aria-hidden="true">🔥</span> <b>{{ streak }}</b> 天连续</span>
        <span class="stat-pill"><span class="emoji" aria-hidden="true">📖</span> 今日 <b>{{ todayCount }}/{{ dailyGoal }}</b></span>
      </div>
      <p class="settings-hint">这些记录只保存在这台设备的浏览器里，不会上传到网络。</p>

      <button
        type="button"
        class="btn btn-reset"
        :class="{ armed: armReset }"
        @click="tryReset"
      >
        {{ armReset ? '⚠️ 确认清除记录' : '重置学习记录' }}
      </button>
      <p v-if="resetMsg" class="reset-msg" role="status">{{ resetMsg }}</p>
    </section>
  </DetailDialog>
</template>
