import { type LearnFilter } from '../types'

export function groupBy<T, K extends keyof T>(
  items: T[],
  key: K,
): [T[K], T[]][] {
  const map = new Map<T[K], T[]>()
  for (const item of items) {
    const list = map.get(item[key]) ?? []
    list.push(item)
    map.set(item[key], list)
  }
  return Array.from(map.entries()).filter(([, list]) => list.length > 0)
}

export function applyFilter<T extends { id: string }>(
  items: T[],
  filter: LearnFilter,
  module: string,
  isLearned: (module: string, id: string) => boolean,
): T[] {
  const out: T[] = []
  for (const item of items) {
    if (filter === 'todo' && isLearned(module, item.id)) continue
    if (filter === 'done' && !isLearned(module, item.id)) continue
    out.push(item)
  }
  return out
}
