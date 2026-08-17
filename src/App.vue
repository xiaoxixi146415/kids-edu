<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import SoundToggle from './components/SoundToggle.vue'

const route = useRoute()
const router = useRouter()

const isHome = computed(() => route.path === '/')
const pageTitle = computed(() => (route.meta.title as string) ?? '宝宝乐园')

function goHome() {
  router.push('/')
}
</script>

<template>
  <div class="app-shell">
    <header class="top-bar">
      <button v-if="!isHome" class="back-btn" aria-label="返回首页" @click="goHome">◀</button>
      <span v-else class="back-btn" aria-hidden="true"></span>
      <h1 class="app-title">{{ pageTitle }}</h1>
      <SoundToggle />
    </header>
    <main class="page-body">
      <router-view />
    </main>
  </div>
</template>
