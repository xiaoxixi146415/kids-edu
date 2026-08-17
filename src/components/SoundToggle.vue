<script setup lang="ts">
import { useSpeech } from '../composables/useSpeech'
import AppIcon from './AppIcon.vue'

const { muted, toggleMute } = useSpeech()
</script>

<template>
  <button
    type="button"
    class="sound-toggle"
    :class="{ muted }"
    :aria-label="muted ? '打开声音' : '静音'"
    :aria-pressed="muted"
    @click="toggleMute"
  >
    <AppIcon :name="muted ? 'sound-off' : 'sound-on'" />
  </button>
</template>
