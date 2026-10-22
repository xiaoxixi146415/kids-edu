// scripts/check-counts.mjs
//
// 校验栏目元数据（src/data/categories.ts）里手写的 total 与 src/data/*.ts 的实际条目数一致。
//
// 为什么需要：total 不能从数据 import 推导——那会把各栏目内容打进首页共享 chunk，
// 打破懒加载边界（见 EXPLAIN_CHECKLIST Q2）。所以只能手写，也就需要一道自动校验。
//
// 用法：npm run check:counts
import { readFileSync, existsSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const CATEGORIES = path.join(ROOT, 'src', 'data', 'categories.ts')

const source = readFileSync(CATEGORIES, 'utf8')
// 匹配 CATEGORIES 里的 { path, module, total }（每条写在一行内）
const entries = [...source.matchAll(/module:\s*'([^']+)',\s*total:\s*(\d+)/g)].map((m) => ({
  module: m[1],
  total: Number(m[2]),
}))

if (entries.length === 0) {
  console.error('✗ 未能在 src/data/categories.ts 中解析到 CATEGORIES')
  process.exit(1)
}

let ok = true
for (const { module, total } of entries) {
  const file = path.join(ROOT, 'src', 'data', `${module}.ts`)
  if (!existsSync(file)) {
    console.error(`✗ ${module}: 找不到数据文件 src/data/${module}.ts`)
    ok = false
    continue
  }
  const actual = (readFileSync(file, 'utf8').match(/\bid:\s*['"]/g) ?? []).length
  const pass = actual === total
  if (!pass) ok = false
  console.log(`${pass ? '✓' : '✗'} ${module.padEnd(14)} 栏目 total ${String(total).padStart(3)} / 实际 ${String(actual).padStart(3)}`)
}

console.log(ok ? `\n✓ 共 ${entries.length} 个栏目，数量全部一致` : '\n✗ 存在不一致，请同步 src/data/categories.ts 的 total')
process.exit(ok ? 0 : 1)
