<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useSpeech } from '../composables/useSpeech'
import BigCard from '../components/BigCard.vue'
import AppIcon from '../components/AppIcon.vue'

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
    <div class="mascot" :class="{ wiggle: unlocked }" aria-hidden="true">🦉</div>

    <button v-if="!unlocked" type="button" class="btn-start" @click="start">
      <AppIcon name="sound-on" />
      点我开始
    </button>
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
      <BigCard
        class="card-xl"
        emoji="✏️"
        title="识字认字"
        subtitle="认一认汉字"
        tone="tone-blue"
        @click="open('/hanzi', '识字认字，认一认汉字')"
      />
      <BigCard
        class="card-xl"
        emoji="🔢"
        title="数学启蒙"
        subtitle="数一数算一算"
        tone="tone-red"
        @click="open('/math', '数学启蒙，数一数算一算')"
      />
      <BigCard
        class="card-xl"
        emoji="🦁"
        title="动物乐园"
        subtitle="听听动物朋友"
        tone="tone-teal"
        @click="open('/animals', '动物乐园，听听动物朋友')"
      />
      <BigCard
        class="card-xl"
        emoji="📚"
        title="绘本故事"
        subtitle="翻翻听故事"
        tone="tone-amber"
        @click="open('/stories', '绘本故事，翻翻听故事')"
      />
      <BigCard
        class="card-xl"
        emoji="🔤"
        title="拼音乐园"
        subtitle="认声母学韵母"
        tone="tone-pink"
        @click="open('/pinyin', '拼音乐园，认声母学韵母')"
      />
    </div>
  </div>
</template>
