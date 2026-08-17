<script setup lang="ts">
/**
 * 共享详情弹层：三个视图共用的 dialog 语义封装。
 * - role="dialog" + aria-modal + aria-label（可访问名）
 * - 打开时把焦点移入弹层，关闭/卸载时归还触发元素（focus-management）
 * - Esc 键或点击背板关闭（modal-escape）
 * - tone 属性叠加主题底色（detail-en / detail-bt / detail-tangshi）
 * 内容由父级通过插槽提供（含各自可见标题/朗读控件）。
 */
import { nextTick, onBeforeUnmount, ref, watch } from 'vue'
import AppIcon from './AppIcon.vue'

const props = withDefaults(
  defineProps<{ open: boolean; title: string; tone?: string }>(),
  { tone: '' }
)
const emit = defineEmits<{ (e: 'close'): void }>()

const dialogRef = ref<HTMLElement | null>(null)
let lastFocused: HTMLElement | null = null

function focusDialog() {
  nextTick(() => dialogRef.value?.focus())
}

watch(
  () => props.open,
  (open) => {
    if (open) {
      lastFocused = document.activeElement as HTMLElement | null
      focusDialog()
    } else {
      lastFocused?.focus?.()
      lastFocused = null
    }
  }
)

function onKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape') emit('close')
}

onBeforeUnmount(() => {
  lastFocused?.focus?.()
})
</script>

<template>
  <Teleport to="body">
    <Transition name="pop">
      <div
        v-if="open"
        ref="dialogRef"
        class="detail-overlay"
        role="dialog"
        aria-modal="true"
        :aria-label="title"
        tabindex="-1"
        @click.self="emit('close')"
        @keydown.esc="onKeydown"
      >
        <div class="detail-card" :class="tone">
          <button type="button" class="close-btn" aria-label="关闭" @click="emit('close')">
            <AppIcon name="close" />
          </button>
          <slot />
        </div>
      </div>
    </Transition>
  </Teleport>
</template>
