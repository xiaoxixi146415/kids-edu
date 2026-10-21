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

/** 弹层打开时让背景不可交互，避免 Tab / 读屏跑到弹层后面 */
function setBackgroundInert(on: boolean) {
  const shell = document.querySelector<HTMLElement>('.app-shell')
  if (!shell) return
  if (on) shell.setAttribute('inert', '')
  else shell.removeAttribute('inert')
}

function focusDialog() {
  nextTick(() => dialogRef.value?.focus())
}

/** 可聚焦元素（排除 disabled / tabindex=-1） */
const FOCUSABLE =
  'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'

watch(
  () => props.open,
  (open) => {
    if (open) {
      lastFocused = document.activeElement as HTMLElement | null
      setBackgroundInert(true)
      focusDialog()
    } else {
      setBackgroundInert(false)
      lastFocused?.focus?.()
      lastFocused = null
    }
  },
  { immediate: true }
)

function onKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape') {
    emit('close')
    return
  }
  if (e.key !== 'Tab' || !dialogRef.value) return

  const items = [...dialogRef.value.querySelectorAll<HTMLElement>(FOCUSABLE)]
  if (!items.length) {
    e.preventDefault()
    return
  }
  const first = items[0]
  const last = items[items.length - 1]
  const active = document.activeElement

  // 焦点意外落到弹层外：拉回第一个可聚焦元素
  if (!dialogRef.value.contains(active)) {
    e.preventDefault()
    first.focus()
    return
  }
  if (e.shiftKey && (active === first || active === dialogRef.value)) {
    e.preventDefault()
    last.focus()
  } else if (!e.shiftKey && active === last) {
    e.preventDefault()
    first.focus()
  }
}

onBeforeUnmount(() => {
  setBackgroundInert(false)
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
        @keydown="onKeydown"
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
