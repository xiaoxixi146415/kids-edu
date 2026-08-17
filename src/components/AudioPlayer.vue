<script setup lang="ts">
import { useSpeech } from '../composables/useSpeech'
import AppIcon from './AppIcon.vue'

defineProps<{ text: string }>()

const { speak, stop } = useSpeech()
</script>

<template>
  <div class="audio-player">
    <button type="button" class="btn btn-primary" @click="speak(text)">
      <AppIcon name="play" />
      再听一遍
    </button>
    <button type="button" class="btn btn-ghost" @click="stop">
      <AppIcon name="stop" />
      停止
    </button>
  </div>
</template>
