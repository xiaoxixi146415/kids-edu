---
name: perfect-version
description: Use when the user says "完善一个版本" / "完善版本" / asks to finish or improve a full version of this kids-edu app hands-free — run the whole implement → build → verify → commit → deploy flow without stopping for input.
---

# 完善一个版本(无人值守)

## 概述
把 kids-edu 从当前状态推进到「一个可交付的新版本」:实现改动 → 构建 → 真实浏览器验证 → 更新进度日志 → 提交推送触发 EdgeOne 部署。全程**不得中途停下来问用户**;每步验证通过才进下一步,任何一步失败就停下报告。

## 默认动作(用户未指明具体完善点时)
按顺序做,量力而行、宁缺毋滥:
1. **内容扩充**:在 `src/data/` 可安全追加的模块各加 2~4 条——`encyclopedia.ts`(百科)、`brainteasers.ts`(脑筋急转弯)、`hanzi.ts`(识字,常用字)、`animals.ts`(动物)、`stories.ts`(绘本,1 篇 4~5 页小故事)。
   - `tangshi.ts`(唐诗)、`pinyin.ts`(拼音)、`math.ts`(数学)结构特殊/有数量设计:仅当有把握且用户提及相关方向时才加。
   - 内容必须**真实正确**、符合幼儿认知:唐诗必须是真实经典诗句,百科/动物/故事必须事实正确;不确定就不加,不硬凑。
2. **顺手修复**:实现过程中发现明确、低风险的小问题(错别字、明显样式瑕疵)顺手修;拿不准的列入最终汇报「建议」,不擅自大改。
3. 若用户给定了具体完善点(如"扩充百科和唐诗"、"新增 XX 栏目"),以用户要求为准。

## 完整流程(严格按顺序)

### ① 盘点
- 读 `progress.md`、`README.md`(数据格式)、`git status`、`git log --oneline -5`,了解最近会话进度与当前工作区是否干净。
- 明确本次完善点(用户指明 或 默认动作)。

### ② 实现
- 严格按 README「如何扩充内容」的格式追加;`id` 必须全局唯一(追加前 grep 现有 id)。
- 新增栏目时沿用现有模式:hash 路由 + 懒加载视图 + 首页卡片 + `--tone-*` 令牌 + AppIcon。
- 内容为真、为准确、幼儿可懂。

### ③ 构建(关卡 1)
- 运行 `npm run build`(vue-tsc -b && vite build)。
- **必须通过**;失败则修复并重跑,禁止在构建失败时进入下一步。

### ④ 预览验证(关卡 2)
- 运行 `node scripts/preview-check.mjs` —— 首页冒烟:至少渲染 1 张 `.big-card`、title 非空、SW 已注册、控制台零错误。
- 若新增了路由/栏目,再运行 `node scripts/preview-check.mjs 路由名 "该页必现文案"`(路由名不带 `#/`,如 `node scripts/preview-check.mjs pinyin "声母"`)。
- **任一失败**:停下,修复,重跑;禁止假装通过。

### ⑤ 设计自查(关卡 3)
对照 `web-design-guidelines` 要点检查新增改动:
- 新文字对比度 ≥3:1(大字号)/ 4.5:1(普通字);`*.vue` 无硬编码 hex(用 `--tone-*` 令牌)。
- 无 `<div onClick>`(点击一律用 `<button>`);装饰 emoji `aria-hidden`;动画只动 transform/opacity;`prefers-reduced-motion` 兜底。

### ⑥ 更新 progress.md(关卡 4)
- 追加一段,格式沿用历史会话:
  ```
  ## 会话 N(YYYY-MM-DD)— 标题
  - [x] 改动 1…
  - [x] 改动 2…
  ## 测试结果
  - npm run build 通过 …
  - preview-check …
  ```

### ⑦ 提交推送(关卡 5)
- `git add -A` → `git commit -m "<类型>: <描述>"` → `git push`(推当前分支,触发 EdgeOne 自动部署)。
- 提交信息示例:`内容扩充: 百科+4 脑筋急转弯+4 新增绘本《…》`。
- 只做常规提交推送;**禁止 `git push --force`、`git reset --hard`、`git clean`**。

### ⑧ 汇报
给用户简明报告:
- 本次完善点 + 改了哪些文件
- 构建/验证结果(build 通过、preview-check 各 ✓)
- 提交 hash + 已推送触发部署
- 遗留「建议」(若有未擅自改的项)

## 守则(禁止清单)
- **任何一步失败 → 立即停下报告原因,绝不"假装通过"继续**。
- 不删除/改写现有内容结构(只追加,不改格式)。
- 不擅自改版本号 `package.json`、不改部署配置。
- 不 `--force` 推送、不 `reset --hard`、不 `clean`。
- 不为了"显得做了很多"硬凑内容;内容宁少但必须真实。

## 常见错误
| 错误 | 避免方式 |
| --- | --- |
| id 重复导致渲染异常 | 追加前 grep 现有 id |
| 编造古诗/百科内容 | 不确定就跳过该条 |
| build 失败仍继续 | 关卡 1 强制,过不了就停 |
| 权限不足被拦 | 技能所需命令已配在 `.claude/settings.json`;若仍弹权限,记入汇报让用户补 |
