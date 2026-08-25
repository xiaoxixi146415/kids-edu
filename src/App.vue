<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import SoundToggle from './components/SoundToggle.vue'
import SpeechSettings from './components/SpeechSettings.vue'
import AppIcon from './components/AppIcon.vue'

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

    <SpeechSettings :open="settingsOpen" @close="settingsOpen = false" />
  </div>
</template>
