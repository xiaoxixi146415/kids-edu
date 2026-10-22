import { ageOf, type AgeFilter } from '../data/ages'

/**
 * 按年龄段过滤列表。
 * categoryOf 用于把条目的主题/分组传给 ageOf（百科 category、拼音 group 等）。
 */
export function applyAgeFilter<T extends { id: string }>(
  items: readonly T[],
  module: string,
  age: AgeFilter,
  categoryOf?: (item: T) => string | undefined,
): T[] {
  if (age === 'all') return [...items]
  return items.filter((item) => ageOf(module, item.id, categoryOf?.(item)) === age)
}
