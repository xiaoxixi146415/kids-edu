<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import SoundToggle from './components/SoundToggle.vue'
import SpeechSettings from './components/SpeechSettings.vue'
import AppIcon from './components/AppIcon.vue'
import { useProgress } from './composables/useProgress'

const route = useRoute()
const router = useRouter()

const isHome = computed(() => route.path === '/')
const pageTitle = computed(() => (route.meta.title as string) ?? '宝宝乐园')
const settingsOpen = ref(false)

function goHome() {
  router.push('/')
}

/** 跳转到主内容：SPA 里 #main 会与 hash 路由冲突，改为程序化聚焦 */
function skipToMain() {
  const main = document.getElementById('main')
  main?.focus()
  main?.scrollIntoView()
}

/* —— 记录最近学习的栏目（首页「继续学习」入口） —— */
watch(
  () => route.path,
  (path) => {
    if (path !== '/') {
      try {
        localStorage.setItem('kids-edu-last', path)
      } catch {
        /* 隐私模式下忽略 */
      }
    }
  },
  { immediate: true }
)

/* —— 星星奖励动效：useProgress.rewardTick 自增时弹一次 —— */
const { rewardTick, rewardText } = useProgress()
const rewardKey = ref(0)
const showReward = ref(false)
let rewardTimer: number | undefined

watch(rewardTick, (n, prev) => {
  if (n <= (prev ?? 0)) return
  rewardKey.value += 1
  showReward.value = true
  window.clearTimeout(rewardTimer)
  rewardTimer = window.setTimeout(() => {
    showReward.value = false
  }, 1600)
})
</script>

<template>
  <div class="app-shell">
    <a class="skip-link" href="#main" @click.prevent="skipToMain">跳到主要内容</a>
    <header class="top-bar">
      <button v-if="!isHome" type="button" class="back-btn" aria-label="返回首页" @click="goHome">
        <AppIcon name="back" />
      </button>
      <span v-else class="back-btn" aria-hidden="true"></span>
      <h1 class="app-title">{{ pageTitle }}</h1>
      <div class="top-actions">
        <SoundToggle />
        <button
          type="button"
          class="sound-toggle"
          aria-label="语音设置"
          :aria-haspopup="true"
          :aria-expanded="settingsOpen"
          @click="settingsOpen = true"
        >
          <AppIcon name="settings" />
        </button>
      </div>
    </header>
    <main id="main" class="page-body" tabindex="-1">
      <RouterView v-slot="{ Component }">
        <Transition name="page" mode="out-in">
          <component :is="Component" />
        </Transition>
      </RouterView>
    </main>

    <!-- 得星飘动奖励 -->
    <Teleport to="body">
      <Transition name="reward">
        <div v-if="showReward" :key="rewardKey" class="reward-toast" role="status" aria-live="polite">
          <span class="reward-stars" aria-hidden="true">⭐✨⭐</span>
          <span class="reward-text">{{ rewardText }} 好棒！</span>
        </div>
      </Transition>
    </Teleport>

    <SpeechSettings :open="settingsOpen" @close="settingsOpen = false" />
  </div>
</template>
