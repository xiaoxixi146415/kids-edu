<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useSpeech } from '../composables/useSpeech'
import BigCard from '../components/BigCard.vue'

const router = useRouter()
const { speak, unlock, unlocked, supported } = useSpeech()

function start() {
  unlock()
  speak('小朋友你好，欢迎来到宝宝乐园！点一点下面的大卡片，我们一起去认识新朋友吧！')
}

function open(path: string, label: string) {
  speak(label)
  router.push(path)
}
</script>

<template>
  <div class="home">
    <div class="mascot" :class="{ wiggle: unlocked }">🦉</div>

    <button v-if="!unlocked" class="btn-start" @click="start">🔊 点我开始</button>
    <p v-else class="welcome">小朋友，欢迎来到宝宝乐园！</p>
    <p v-if="supported && !unlocked" class="hint">👆 先点一下「开始」，让声音响起来吧</p>

    <div class="category-list">
      <BigCard
        class="card-xl"
        emoji="📖"
        title="知识百科"
        subtitle="认识世界"
        tone="tone-orange"
        @click="open('/encyclopedia', '知识百科，认识世界')"
      />
      <BigCard
        class="card-xl"
        emoji="🤔"
        title="脑筋急转弯"
        subtitle="动动小脑瓜"
        tone="tone-purple"
        @click="open('/brainteasers', '脑筋急转弯，动动小脑瓜')"
      />
      <BigCard
        class="card-xl"
        emoji="📜"
        title="唐诗"
        subtitle="跟着念古诗"
        tone="tone-green"
        @click="open('/tangshi', '唐诗，跟着念古诗')"
      />
    </div>
  </div>
</template>
