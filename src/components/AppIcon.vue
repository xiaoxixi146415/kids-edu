<script setup lang="ts">
/**
 * 内联 SVG 图标集（统一 1.8px 圆角描边，跟随 currentColor）。
 * 结构性控件图标专用；内容卡片的大 emoji 仍作为插画保留在卡片组件里。
 * 图标默认 aria-hidden（带文字按钮由文字提供可访问名；
 * 图标独占的按钮由父级 aria-label 提供）。
 */
withDefaults(defineProps<{ name: string; size?: number }>(), { size: 24 })
</script>

<template>
  <svg
    :width="size"
    :height="size"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="1.8"
    stroke-linecap="round"
    stroke-linejoin="round"
    aria-hidden="true"
  >
    <!-- 返回 -->
    <template v-if="name === 'back'">
      <path d="M15 4l-8 8 8 8" />
      <path d="M7 12h13" />
    </template>
    <!-- 下一页 -->
    <template v-else-if="name === 'next'">
      <path d="M9 5l8 8-8 8" />
      <path d="M17 12H4" />
    </template>
    <!-- 关闭 -->
    <template v-else-if="name === 'close'">
      <path d="M6 6l12 12M18 6L6 18" />
    </template>
    <!-- 声音开 -->
    <template v-else-if="name === 'sound-on'">
      <path d="M4 9v6h4l5 4V5L8 9H4z" />
      <path d="M16 9a4 4 0 010 6" />
    </template>
    <!-- 声音关 -->
    <template v-else-if="name === 'sound-off'">
      <path d="M4 9v6h4l5 4V5L8 9H4z" />
      <path d="M16 9l5 6M21 9l-5 6" />
    </template>
    <!-- 播放 -->
    <template v-else-if="name === 'play'">
      <path d="M7 5v14l12-7L7 5z" />
    </template>
    <!-- 停止 -->
    <template v-else-if="name === 'stop'">
      <rect x="7" y="7" width="10" height="10" rx="2" />
    </template>
    <!-- 灯泡（揭晓答案） -->
    <template v-else-if="name === 'bulb'">
      <path d="M9 18h6M10 21h4M12 3a6 6 0 00-4 10c.7.6 1 1.3 1 2h6c0-.7.3-1.4 1-2a6 6 0 00-4-10z" />
    </template>
    <!-- 书本（读古诗） -->
    <template v-else-if="name === 'book'">
      <path d="M4 5a2 2 0 012-2h13v16H6a2 2 0 00-2 2V5z" />
      <path d="M4 19a2 2 0 012-2h13" />
    </template>
    <!-- 羽毛（听译文） -->
    <template v-else-if="name === 'feather'">
      <path d="M20 4c-6 0-10 4-10 10 0 .7 0 1.5.2 2C4 17 3 20 3 20s3-1 4-7" />
      <path d="M20 4l-9 9" />
    </template>
    <!-- 设置（齿轮） -->
    <template v-else-if="name === 'settings'">
      <circle cx="12" cy="12" r="3" />
      <path
        d="M19.4 15a1.6 1.6 0 00.3 1.8l.1.1a2 2 0 11-2.8 2.8l-.1-.1a1.6 1.6 0 00-1.8-.3 1.6 1.6 0 00-1 1.5V21a2 2 0 11-4 0v-.1a1.6 1.6 0 00-1-1.5 1.6 1.6 0 00-1.8.3l-.1.1a2 2 0 11-2.8-2.8l.1-.1a1.6 1.6 0 00.3-1.8 1.6 1.6 0 00-1.5-1H3a2 2 0 110-4h.1a1.6 1.6 0 001.5-1 1.6 1.6 0 00-.3-1.8l-.1-.1a2 2 0 112.8-2.8l.1.1a1.6 1.6 0 001.8.3 1.6 1.6 0 001-1.5V3a2 2 0 114 0v.1a1.6 1.6 0 001 1.5 1.6 1.6 0 001.8-.3l.1-.1a2 2 0 112.8 2.8l-.1.1a1.6 1.6 0 00-.3 1.8 1.6 1.6 0 001.5 1H21a2 2 0 110 4h-.1a1.6 1.6 0 00-1.5 1z"
      />
    </template>
  </svg>
</template>
