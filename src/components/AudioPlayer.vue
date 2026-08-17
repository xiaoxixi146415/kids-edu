<script setup lang="ts">
import { useSpeech } from '../composables/useSpeech'

defineProps<{ text: string }>()

const { speak, stop } = useSpeech()
</script>

<template>
  <div class="audio-player">
    <button class="btn btn-primary" @click="speak(text)">🔊 再听一遍</button>
    <button class="btn btn-ghost" @click="stop">⏹ 停止</button>
  </div>
</template>
