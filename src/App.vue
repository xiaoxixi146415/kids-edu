<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import SoundToggle from './components/SoundToggle.vue'
import AppIcon from './components/AppIcon.vue'

const route = useRoute()
const router = useRouter()

const isHome = computed(() => route.path === '/')
const pageTitle = computed(() => (route.meta.title as string) ?? '宝宝乐园')

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
      <SoundToggle />
    </header>
    <main id="main" class="page-body" tabindex="-1">
      <router-view />
    </main>
  </div>
</template>
