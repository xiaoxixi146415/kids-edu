// scripts/check-counts.mjs
//
// 校验两件事：
// 1. 栏目元数据（src/data/categories.ts）里手写的 total 与 src/data/*.ts 的实际条目数一致。
// 2. 年龄段规则（src/data/ages.ts）能为每个栏目分出 3–4 岁 / 5–6 岁两个年龄段，
//    且 older / byGroup 里写的 id、分组都真实存在。
//
// 为什么需要：total 与年龄段都不能从数据 import 推导——那会把各栏目内容打进首页共享 chunk，
// 打破懒加载边界（见 EXPLAIN_CHECKLIST Q2）。所以只能手写，也就需要一道自动校验。
//
// 用法：npm run check:counts
import { readFileSync, existsSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import ts from 'typescript'

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

/** 各数据文件导出的数组名（栏目 key 与文件名不完全一致） */
const EXPORTS = {
  encyclopedia: 'encyclopedia',
  brainteasers: 'brainteasers',
  tangshi: 'tangshi',
  hanzi: 'hanzi',
  math: 'numbers',
  animals: 'animals',
  quietbook: 'quietbook',
  stories: 'stories',
  pinyin: 'pinyin',
  nursery: 'nurseryRhymes',
}

/** 把本地 TS 转成 JS 后 import，避免为了校验把内容打进构建产物 */
const modCache = new Map()
async function loadTs(file) {
  if (modCache.has(file)) return modCache.get(file)
  const src = readFileSync(file, 'utf8')
  const js = ts.transpileModule(src, {
    compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2020 },
  }).outputText
  const mod = await import(`data:text/javascript;base64,${Buffer.from(js).toString('base64')}`)
  modCache.set(file, mod)
  return mod
}

const ages = await loadTs(path.join(ROOT, 'src', 'data', 'ages.ts'))
const { AGE_RULES, ageOf } = ages

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

  const exportName = EXPORTS[module]
  if (!exportName) {
    console.error(`  ✗ ${module}: 未配置数据导出名（scripts/check-counts.mjs）`)
    ok = false
    continue
  }

  const mod = await loadTs(file)
  const items = mod[exportName]
  if (!Array.isArray(items)) {
    console.error(`  ✗ ${module}: 数据文件没有导出数组 ${exportName}`)
    ok = false
    continue
  }

  const rule = AGE_RULES[module]
  if (!rule) {
    console.error(`  ✗ ${module}: src/data/ages.ts 缺少年龄规则`)
    ok = false
    continue
  }

  const ids = new Set(items.map((item) => item.id))
  const groups = new Set(items.map((item) => item.category ?? item.group))
  for (const id of rule.older ?? []) {
    if (!ids.has(id)) {
      console.error(`  ✗ ${module}: 年龄规则里的进阶条目「${id}」不存在`)
      ok = false
    }
  }
  for (const group of Object.keys(rule.byGroup ?? {})) {
    if (!groups.has(group)) {
      console.error(`  ✗ ${module}: 年龄规则里的分组「${group}」在数据中不存在`)
      ok = false
    }
  }

  const bands = { '3-4': 0, '5-6': 0 }
  for (const item of items) {
    bands[ageOf(module, item.id, item.category ?? item.group)]++
  }
  const both = bands['3-4'] > 0 && bands['5-6'] > 0
  if (!both) ok = false
  console.log(`  ${both ? '✓' : '✗'} 年龄标注 3–4 岁 ${bands['3-4']} / 5–6 岁 ${bands['5-6']}`)
}

console.log(ok ? `\n✓ 共 ${entries.length} 个栏目，数量与年龄标注全部通过` : '\n✗ 存在不一致，请同步 src/data/categories.ts / src/data/ages.ts')
process.exit(ok ? 0 : 1)
