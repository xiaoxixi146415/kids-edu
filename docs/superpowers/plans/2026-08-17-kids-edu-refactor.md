# kids-edu 重构 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 基于 ui-ux-pro-max / web-design-guidelines / planning-with-files / superpowers 四个技能重构宝宝乐园：样式令牌化、修复对比度/焦点/减少动效/viewport、结构控件 SVG 图标、共享弹层组件与完整可访问性，并构建验证。

**Architecture:** 不改动内容数据、路由与 `useSpeech.ts` 语音核心。全部改动集中在样式令牌层（`main.css`）、通用组件（新增 `AppIcon.vue`、`DetailDialog.vue`）、三个视图与 `App.vue`。语义令牌用 CSS 自定义属性在 `:root` 定义，组件只引用令牌、不写死 hex。

**Tech Stack:** Vue 3（`<script setup>` + TS）、Vite、CSS 自定义属性。无新依赖。

**Spec:** 批准的重构计划见 `C:\Users\Luv21\.claude\plans\typed-strolling-widget.md`；规则来源为 4 个技能的 SKILL.md 与 ui-ux-pro-max `references/quick-reference.md`、`references/pro-rules.md`；研究发现与偏差记录见 `findings.md`。

## Global Constraints

- 不新增 npm 依赖；构建命令保持 `vue-tsc -b && vite build`。
- `src/data/`、`src/router/index.ts`、`src/composables/useSpeech.ts` 一律不改。
- 结构性控件图标用内联 SVG（AppIcon.vue）；内容卡片大 emoji 保留、加 `aria-hidden="true"`。
- 颜色/字号/间距/圆角/阴影/动效必须引用 `main.css` 中 `:root` 的语义令牌，禁止组件内硬编码 hex。
- 每个 `<button>` 必须带 `type="button"`；focus-visible 焦点环保留不删。
- 新增动效必须包 `@media (prefers-reduced-motion: reduce)` 兜底。
- 文本对比度目标 ≥4.5:1（正文）、图标/控件 ≥3:1。

---

### Task 1: 修复 index.html viewport

**Files:**
- Modify: `index.html:7`

- [ ] **Step 1: 去掉禁止缩放的 viewport 属性**

把 `index.html` 中：
```html
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
```
替换为：
```html
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
```

- [ ] **Step 2: 验证**

`npm run build` 通过；浏览器页面可双指缩放。

### Task 2: main.css 设计令牌化

**Files:**
- Modify: `src/assets/main.css`（整体重写）

- [ ] **Step 1: 在 `:root` 定义语义令牌**

```css
:root {
  /* 品牌色 */
  --color-ink: #4a3b2f;
  --color-on-surface: #3a2f28;
  --color-surface: #ffffff;
  --color-primary: #ff6b4a;
  --color-on-primary: #ffffff;
  --color-text-secondary: #3e5f80; /* hint，≥4.5:1 on 浅底 */
  --color-text-author: #3f5a4a;    /* 唐诗作者，≥4.5:1 on 浅绿 */
  --color-detail-text: #5c4a3c;
  --color-sky-top: #bde4ff;
  --color-sky-mid: #e8f7ff;
  --color-sky-bottom: #fff6d8;
  --tone-orange: linear-gradient(135deg, #ffb347, #ff7a4a);
  --tone-purple: linear-gradient(135deg, #b98cff, #8a5cf5);
  --tone-green: linear-gradient(135deg, #4fd1a0, #22b573);
  --tone-start: linear-gradient(135deg, #ffb347, #ff6b4a);

  /* 字体 */
  --font-family: 'PingFang SC', 'Microsoft YaHei', 'Noto Sans SC', system-ui, -apple-system, sans-serif;
  --text-hero: clamp(28px, 6vw, 40px);
  --text-title: 28px;
  --text-body: 20px;
  --text-label: 18px;

  /* 间距 4/8 节奏 */
  --space-1: 4px;
  --space-2: 8px;
  --space-3: 12px;
  --space-4: 16px;
  --space-5: 24px;
  --space-6: 32px;
  --space-7: 48px;

  /* 圆角 */
  --radius-md: 16px;
  --radius-lg: 24px;
  --radius-xl: 30px;
  --radius-pill: 999px;

  /* 阴影 */
  --shadow-sm: 0 3px 8px rgba(0, 0, 0, 0.12);
  --shadow-md: 0 8px 18px rgba(0, 0, 0, 0.14);
  --shadow-lg: 0 20px 50px rgba(0, 0, 0, 0.28);

  /* 动效 */
  --duration-fast: 120ms;
  --duration-mid: 200ms;
  --ease-pop: cubic-bezier(0.2, 0.9, 0.3, 1.3);
}
```

- [ ] **Step 2: 全局基础与焦点态**

`*{box-sizing:border-box;margin:0;padding:0}`；`body` 用 `--font-family`/`--color-ink`；新增全局焦点环：
```css
:focus-visible {
  outline: 3px solid rgba(255, 107, 74, 0.6);
  outline-offset: 2px;
  border-radius: var(--radius-md);
}
button { touch-action: manipulation; }
```

- [ ] **Step 3: 将全部规则内的硬编码值替换为令牌**

替换 背景渐变、top-bar 底色、`.hint`（→`--color-text-secondary`）、`.btn-start`、三个 tone 渐变、`.big-card` 阴影、`.group-title`、`.detail-card` 圆角/阴影、`.detail-text`、`.detail-en/-bt/-tangshi` 渐变、`.poem-author`（→`--color-text-author`）、`.btn`/`.audio-player` 等。**必须保留**：`float/wiggle/pulse` 关键帧、`pop/flip` 过渡名（组件里仍引用）。

- [ ] **Step 4: 减少动效兜底**

```css
@media (prefers-reduced-motion: reduce) {
  .mascot, .mascot.wiggle, .btn-start { animation: none; }
  .pop-enter-active, .pop-leave-active,
  .flip-enter-active, .flip-leave-active { transition: none; }
}
```

- [ ] **Step 5: 验证**

`npm run build` 通过；样式无回归（三栏目/详情/弹层正常）。

### Task 3: 新增 AppIcon.vue 图标集

**Files:**
- Create: `src/components/AppIcon.vue`

- [ ] **Step 1: 写图标组件**

```vue
<script setup lang="ts">
const props = withDefaults(
  defineProps<{ name: string; size?: number }>(),
  { size: 24 }
)
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
    <template v-if="name === 'back'"><path d="M15 4l-8 8 8 8" /><path d="M7 12h13" /></template>
    <template v-else-if="name === 'close'"><path d="M6 6l12 12M18 6L6 18" /></template>
    <template v-else-if="name === 'sound-on'"><path d="M4 9v6h4l5 4V5L8 9H4z" /><path d="M16 9a4 4 0 010 6" /></template>
    <template v-else-if="name === 'sound-off'"><path d="M4 9v6h4l5 4V5L8 9H4z" /><path d="M16 9l5 6M21 9l-5 6" /></template>
    <template v-else-if="name === 'play'"><path d="M7 5v14l12-7L7 5z" /></template>
    <template v-else-if="name === 'stop'"><rect x="7" y="7" width="10" height="10" rx="2" /></template>
    <template v-else-if="name === 'bulb'"><path d="M9 18h6M10 21h4M12 3a6 6 0 00-4 10c.7.6 1 1.3 1 2h6c0-.7.3-1.4 1-2a6 6 0 00-4-10z" /></template>
    <template v-else-if="name === 'book'"><path d="M4 5a2 2 0 012-2h13v16H6a2 2 0 00-2 2V5z" /><path d="M4 19a2 2 0 012-2h13" /></template>
    <template v-else-if="name === 'feather'"><path d="M20 4c-6 0-10 4-10 10 0 .7 0 1.5.2 2C4 17 3 20 3 20s3-1 4-7" /><path d="M20 4l-9 9" /></template>
  </svg>
</template>
```

- [ ] **Step 2: 验证**

组件无 TS 报错；`npm run build` 通过。

### Task 4: 新增 DetailDialog.vue 共享弹层

**Files:**
- Create: `src/components/DetailDialog.vue`

- [ ] **Step 1: 写弹层组件（dialog 语义 + Esc + 焦点归还）**

```vue
<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'

const props = withDefaults(defineProps<{ open: boolean; title: string }>(), {})
const emit = defineEmits<{ (e: 'close'): void }>()

const titleId = `dlg-${Math.random().toString(36).slice(2, 8)}`
let lastFocused: HTMLElement | null = null
const dialogRef = ref<HTMLElement | null>(null)

function onKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape') emit('close')
}
function onMountedFocus() {
  if (props.open) {
    lastFocused = document.activeElement as HTMLElement | null
    dialogRef.value?.focus()
  }
}
watch(
  () => props.open,
  (open) => {
    if (open) {
      lastFocused = document.activeElement as HTMLElement | null
      nextTick(() => dialogRef.value?.focus())
    } else {
      lastFocused?.focus?.()
    }
  }
)
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
        :aria-labelledby="titleId"
        tabindex="-1"
        @click.self="emit('close')"
        @keydown.esc="onKeydown"
      >
        <div class="detail-card">
          <button type="button" class="close-btn" aria-label="关闭" @click="emit('close')">
            <AppIcon name="close" />
          </button>
          <h2 :id="titleId" class="sr-only">{{ title }}</h2>
          <slot />
        </div>
      </div>
    </Transition>
  </Teleport>
</template>
```

注：`.detail-card` 的具体主题底色（en/bt/tangshi）由父级以 `class="detail-card detail-en"` 的 CSS 方式叠加，故 DetailDialog 内部不放样式渐变。

- [ ] **Step 2: 验证**

TS 通过；无 `nextTick` 未导入、`Math.random` 在 SSR 报错问题（纯浏览器 SPA，安全）。

### Task 5: 改造 BigCard / SoundToggle / AudioPlayer

**Files:**
- Modify: `src/components/BigCard.vue`
- Modify: `src/components/SoundToggle.vue`
- Modify: `src/components/AudioPlayer.vue`

- [ ] **Step 1: BigCard — 补 `type="button"`、emoji `aria-hidden`**

`<button type="button" class="big-card">`；`<span class="card-emoji" aria-hidden="true">`；subtitle 保留。

- [ ] **Step 2: SoundToggle — SVG 图标 + aria-pressed**

```vue
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
```

- [ ] **Step 3: AudioPlayer — SVG 图标**

`🔊 再听一遍` → `<AppIcon name="play" /> 再听一遍`；`⏹ 停止` → `<AppIcon name="stop" /> 停止`；两按钮补 `type="button"`。

- [ ] **Step 4: 验证**

`npm run build` 通过；按钮图标显示正常。

### Task 6: 三视图改用 DetailDialog 并补 aria

**Files:**
- Modify: `src/views/EncyclopediaView.vue`
- Modify: `src/views/BrainTeasersView.vue`
- Modify: `src/views/TangshiView.vue`

- [ ] **Step 1: 百科视图**

把 `selected &&` 裸 overlay 块替换为：
```vue
<DetailDialog :open="!!selected" :title="selected?.title ?? ''" @close="close">
  <div class="detail-en">
    <div class="detail-emoji" aria-hidden="true">{{ selected.emoji }}</div>
    <p class="detail-title">{{ selected.title }}</p>
    <p class="detail-text">{{ selected.text }}</p>
    <AudioPlayer :text="selected ? read(selected) : ''" />
  </div>
</DetailDialog>
```
`selected` 为 null 时内层不渲染（`v-if="selected"`）。视图内 import DetailDialog + AppIcon（如用到）。

- [ ] **Step 2: 脑筋急转弯视图**

`🌟 揭晓答案` → `<AppIcon name="bulb" /> 揭晓答案`；答案区 `<div class="answer-box" role="status">`；其余同上。

- [ ] **Step 3: 唐诗视图**

`📜 读古诗`→`<AppIcon name="book" /> 读古诗`、`📖 听译文`→`<AppIcon name="feather" /> 听译文`、`⏹ 停止`→`<AppIcon name="stop" /> 停止`；译文区 `<div class="meaning-box" role="status">`。

- [ ] **Step 4: 验证**

`npm run build` 通过；三视图详情/朗读/关闭行为不变。

### Task 7: App.vue 加跳过链接与 main 目标

**Files:**
- Modify: `src/App.vue`

- [ ] **Step 1: 加 skip link + `<main id="main">`**

在 `app-shell` 内、top-bar 前插入：
```vue
<a class="skip-link" href="#main">跳到主要内容</a>
```
`<main id="main" class="page-body" tabindex="-1">`；CSS：`.skip-link` 默认视觉隐藏、`:focus` 时显示在左上角。

- [ ] **Step 2: 验证**

Tab 首次聚焦出现「跳到主要内容」；回车跳到 `<main>`。

### Task 8: 构建与基础验证

- [ ] `npm run build`（vue-tsc -b && vite build）成功。
- [ ] `npm run preview` 本地打开，三栏目导航、朗读、弹层、静音、返回全部正常。
- [ ] 375px 与 landscape 无横向滚动；触达区 ≥44px。

### Task 9: web-design-guidelines 审查

- [ ] WebFetch 拉取最新规范（`https://raw.githubusercontent.com/vercel-labs/web-interface-guidelines/main/command.md`）。
- [ ] 对重构后文件逐条出 `file:line` 审查清单，修复命中项，复查。
- [ ] 用对比度工具复核 hint/author/detail-text/白字 on 渐变。
- [ ] 更新 `task_plan.md`（全 complete）与 `progress.md`（测试结果、错误）。
