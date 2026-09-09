<script setup lang="ts">
withDefaults(
  defineProps<{
    emoji: string
    title: string
    subtitle?: string
    tone?: string
    /** 已学过：右上角显示打勾角标 + 轻微完成态 */
    done?: boolean
  }>(),
  { tone: '', done: false }
)

defineEmits<{ (e: 'click'): void }>()
</script>

<template>
  <button type="button" class="big-card" :class="[tone, { done }]" @click="$emit('click')">
    <span v-if="done" class="done-badge" aria-hidden="true">
      <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="3.4" stroke-linecap="round" stroke-linejoin="round">
        <path d="M4 12.5l5 5L20 6.5" />
      </svg>
    </span>
    <span class="card-emoji" aria-hidden="true">{{ emoji }}</span>
    <span class="card-title">{{ title }}</span>
    <span v-if="subtitle" class="card-subtitle">{{ subtitle }}</span>
    <span class="sr-only">{{ done ? '，已学过' : '' }}</span>
  </button>
</template>
