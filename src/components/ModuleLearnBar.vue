<script lang="ts">
/** 列表筛选：全部 / 没学过 / 学过 */
export type LearnFilter = 'all' | 'todo' | 'done'
</script>

<script setup lang="ts">
/**
 * 栏目学情工具条：已学进度条 + 完成度 + 「全部 / 没学过 / 学过」筛选。
 * - 进度条为 role="progressbar"，数值随学习实时更新
 * - 全部学完时显示祝贺语
 */
import { computed } from 'vue'

const props = withDefaults(
  defineProps<{
    /** 已学数量 */
    learned: number
    /** 总数 */
    total: number
    /** 当前筛选 */
    filter: LearnFilter
    /** 是否显示筛选 chips（绘本等特殊列表可只显示进度） */
    showFilter?: boolean
  }>(),
  { showFilter: true }
)

const emit = defineEmits<{ (e: 'update:filter', v: LearnFilter): void }>()

const pct = computed(() => (props.total === 0 ? 0 : Math.round((props.learned / props.total) * 100)))
const allDone = computed(() => props.total > 0 && props.learned >= props.total)

const FILTERS: { value: LearnFilter; label: string }[] = [
  { value: 'all', label: '全部' },
  { value: 'todo', label: '没学过' },
  { value: 'done', label: '学过' },
]
</script>

<template>
  <div class="module-bar">
    <div class="module-bar-info">
      <span class="mb-text">
        已学 <b>{{ learned }}</b> / {{ total }}
      </span>
      <span class="mb-pct">{{ pct }}%</span>
    </div>
    <div
      class="progress-track"
      role="progressbar"
      :aria-label="`本栏目学习进度`"
      :aria-valuemin="0"
      :aria-valuemax="total"
      :aria-valuenow="learned"
    >
      <div class="progress-fill" :style="{ width: pct + '%' }"></div>
    </div>
    <p v-if="allDone" class="mb-celebrate" role="status">🎉 太棒了！本栏目全部学完啦</p>

    <div v-if="showFilter" class="filter-chips" role="group" aria-label="筛选卡片">
      <button
        v-for="f in FILTERS"
        :key="f.value"
        type="button"
        class="chip-btn"
        :class="{ active: filter === f.value }"
        :aria-pressed="filter === f.value"
        @click="emit('update:filter', f.value)"
      >
        {{ f.label }}
      </button>
    </div>
  </div>
</template>
