<script setup lang="ts">
import { useSpeech } from '../composables/useSpeech'

const { muted, toggleMute } = useSpeech()
</script>

<template>
  <button
    class="sound-toggle"
    :class="{ muted }"
    :aria-label="muted ? '打开声音' : '静音'"
    @click="toggleMute"
  >
    <span>{{ muted ? '🔇' : '🔊' }}</span>
  </button>
</template>
