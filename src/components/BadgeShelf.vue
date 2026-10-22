<script setup lang="ts">
/**
 * 成长徽章墙：首页展示目标激励，家长页展示获得条件与进度。
 *
 * - 未获得不只用颜色区分：同时显示「已获得 / 3/10」文字，读屏也能听出状态
 * - 装饰 emoji 一律 aria-hidden，标题、状态、获得条件都由可见文字承担可访问名
 */
import { computed } from 'vue'
import type { Achievement } from '../composables/useAchievements'

const props = withDefaults(
  defineProps<{
    badges: readonly Achievement[]
    /** home：紧凑目标墙；parent：带获得条件说明 */
    variant?: 'home' | 'parent'
  }>(),
  { variant: 'home' }
)

const unlocked = computed(() => props.badges.filter((b) => b.unlocked).length)
</script>

<template>
  <section
    class="badge-shelf"
    :class="`badge-shelf-${variant}`"
    aria-labelledby="badge-shelf-title"
  >
    <div class="badge-shelf-head">
      <h2 id="badge-shelf-title" class="badge-shelf-title">我的徽章</h2>
      <span class="badge-shelf-count">{{ unlocked }}/{{ badges.length }}</span>
    </div>
    <p v-if="variant === 'parent'" class="badge-shelf-lead">
      徽章只看本机学习记录，不会因为换设备或清空记录而保留。
    </p>
    <ul class="badge-list" role="list" aria-label="成长徽章">
      <li
        v-for="b in badges"
        :key="b.id"
        class="badge"
        :class="{ 'badge-on': b.unlocked }"
      >
        <span class="badge-emoji" aria-hidden="true">{{ b.emoji }}</span>
        <span class="badge-name">{{ b.title }}</span>
        <span class="badge-state">{{ b.unlocked ? '已获得' : `${b.current}/${b.target}` }}</span>
        <span v-if="variant === 'parent'" class="badge-desc">{{ b.desc }}</span>
      </li>
    </ul>
  </section>
</template>
