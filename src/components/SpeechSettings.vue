<script setup lang="ts">
/**
 * 语音设置弹层：选择中文音色 + 语速三档。
 * - 复用 DetailDialog 弹层语义（焦点/退出/可访问名）
 * - 改动即生效并持久化（useSpeech.settings / setVoice / setRate）
 * - 音色列表来自 zhVoices（zh-* 过滤，voiceschanged 时自动刷新）
 */
import { computed } from 'vue'
import { useSpeech } from '../composables/useSpeech'
import DetailDialog from './DetailDialog.vue'

withDefaults(defineProps<{ open: boolean }>(), { open: false })
const emit = defineEmits<{ (e: 'close'): void }>()

const { settings, zhVoices, setVoice, setRate } = useSpeech()

/** 可用中文音色：短名（去 lang 后缀），便于幼儿家长识别 */
const voiceOptions = computed(() =>
  zhVoices.value.map((v) => ({
    uri: v.voiceURI,
    name: v.name.replace(/\s*(zh-CN|zh-[A-Za-z]+)$/i, ''),
  }))
)

const RATES = [
  { value: 0.7, label: '🐢 慢一点' },
  { value: 0.85, label: '😊 标准' },
  { value: 1.0, label: '🐇 稍快' },
]

function close() {
  emit('close')
}
</script>

<template>
  <DetailDialog :open="open" title="语音设置" tone="detail-settings" @close="close">
    <h2 class="settings-title">语音设置</h2>

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
      <p v-if="!zhVoices.length" class="settings-hint">正在加载可用音色…</p>
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
  </DetailDialog>
</template>
