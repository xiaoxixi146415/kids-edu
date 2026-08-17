<script setup lang="ts">
defineProps<{
  emoji: string
  title: string
  subtitle?: string
  tone?: string
}>()

defineEmits<{ (e: 'click'): void }>()
</script>

<template>
  <button class="big-card" :class="tone" @click="$emit('click')">
    <span class="card-emoji">{{ emoji }}</span>
    <span class="card-title">{{ title }}</span>
    <span v-if="subtitle" class="card-subtitle">{{ subtitle }}</span>
  </button>
</template>
