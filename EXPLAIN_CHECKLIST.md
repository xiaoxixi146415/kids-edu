# 「我讲不清的模块」清单

> 对应 `CAREER_PLAN.md` 第十节第 3 条 + 风险表触发器 3。
> 建立日期：2026-09-23（第 1 周第 3 天）
> 规模：`src/` 共 43 个文件（写规划时是 37，已增长）

## 这份清单是干什么的

**不是为了"复习一遍"，是为了找出你不能独立负责的部分。**

第 1 周就把两个动手任务做完了（会话 12/13），速度是超前的。但速度来自 AI 协作，而风险表把这条列为**本阶段最大风险**：

> `kids-edu` 看不懂自己的代码 → 无法独立解释某个模块的实现 → 关掉 AI，自己重写一遍那个模块。
> **面试时讲不清的项目等于没有。**

这份清单还是 **W4 的前置条件**：W4 要把 10 个 data 文件的数据结构抽象成 Prisma schema，你得先真的掌握每个 shape 才做得出来。

## 怎么填

**规则：先关掉 Claude Code，再打开文件。** 顺序反过来就是自欺欺人。

对每个文件只回答两件事：

1. **职责**：一句话说清它做什么、为什么存在（不是"它是干什么的"这种废话，是"它替谁解决了什么问题"）。
2. **能否重写**：假设这个文件被删掉、也没有 AI，你能从零把它写回来吗？
   - ✅ 能（说得出接口、说得出为什么这么设计）
   - ⚠️ 大概能（记得住接口，但讲不清为什么）
   - ❌ 不能

第 3 条不需要写理由，写了反而会给自己找台阶。

## 判定与后续

| 结果 | 动作 |
|---|---|
| 全 ✅ | 阶段 1 收口，立刻进 W4（架构设计 + 数据建模）。**不要再补类型体操**（触发器 2：TS 是手段不是目的） |
| 有 ⚠️ | 只补到 ✅ 所需的最小程度，**时间盒 1 天** |
| 有 ❌ | 关掉 AI，自己重写那个模块。这是阶段 1 剩下的真正工作 |

填完把这份文档和 `progress.md` 一起提交，它会成为 W4 的输入。

---

## 建议阅读顺序

从**最近 3 次会话（9-11）新增的文件**开始——记忆最新鲜，也最可能是 AI 主导写出来的。先读这些，比按目录顺序读更容易暴露真问题。

高优先（会话 9-11 新增）：

- [ ] `composables/useChallenge.ts`
- [ ] `composables/useMathQuiz.ts`
- [ ] `components/ChallengeLauncher.vue`
- [ ] `components/QuizDialog.vue`
- [ ] `views/QuietBookView.vue`
- [ ] `data/quietbook.ts`
- [ ] `data/nursery.ts`
- [ ] `views/NurseryRhymesView.vue`

高优先（阶段 1 新抽象，必须能白板讲清）：

- [ ] `utils/filter.ts` — `groupBy` / `applyFilter` 的泛型约束各自表达了什么
- [ ] `types/content.ts` — `ContentItem` 为什么只留 `id` + `emoji`
- [ ] `composables/useProgress.ts`
- [ ] `composables/useSpeech.ts` — 逐句 `onend` 接力是为了绕开什么

---

## 清单

### 根 / 入口

| 文件 | 职责（不看代码能说出来吗） | 关掉 AI 能自己重写吗 |
|---|---|---|
| `App.vue` | | |
| `main.ts` | | |
| `router/index.ts` | | |
| `assets/main.css` | | |

### types/ — 阶段 1 产出

| 文件 | 职责 | 能重写吗 |
|---|---|---|
| `types/content.ts` | | |
| `types/filter.ts` | | |
| `types/index.ts` | | |

### utils/

| 文件 | 职责 | 能重写吗 |
|---|---|---|
| `utils/filter.ts` | 泛型分组 + 筛选：`groupBy<T, K extends keyof T>` / `applyFilter<T extends { id: string }>` | **✅**（口试 Q3 + 复述通过；**但需隔天复验**，见复述轮） |
| `utils/index.ts` | | |

### composables/

| 文件 | 职责 | 能重写吗 |
|---|---|---|
| `composables/useSpeech.ts` | | |
| `composables/useProgress.ts` | 学习激励：星星 / 连续打卡 / 今日任务，localStorage 单例 | ✅（口试 Q1） |
| `composables/useChallenge.ts` | 通用题库生成器：由各视图传入自己的数据 | **✅**（口试 Q2 + 复述通过：「集中引入会导致不需要的视图也加载全量数据」） |
| `composables/useMathQuiz.ts` | | |

### components/

| 文件 | 职责 | 能重写吗 |
|---|---|---|
| `components/AppIcon.vue` | | |
| `components/BigCard.vue` | | |
| `components/DetailDialog.vue` | | |
| `components/AudioPlayer.vue` | | |
| `components/SoundToggle.vue` | | |
| `components/SpeechSettings.vue` | | |
| `components/ModuleLearnBar.vue` | | |
| `components/ChallengeLauncher.vue` | | |
| `components/QuizDialog.vue` | | |

### views/（11 个）

| 文件 | 职责 | 能重写吗 |
|---|---|---|
| `views/HomeView.vue` | | |
| `views/EncyclopediaView.vue` | | |
| `views/BrainTeasersView.vue` | | |
| `views/TangshiView.vue` | | |
| `views/HanziView.vue` | | |
| `views/PinyinView.vue` | | |
| `views/AnimalsView.vue` | | |
| `views/MathView.vue` | | |
| `views/StoriesView.vue` | | |
| `views/QuietBookView.vue` | | |
| `views/NurseryRhymesView.vue` | | |

### data/（10 个文件）

> 这一组同时是 **W4 数据建模的输入**：填的时候顺带想一下这个 shape 落到 PostgreSQL 表里长什么样。
> 注意它们**形状相似但语义不同**——`ContentItem` 只收 `id` + `emoji` 就是这个原因。

| 文件 | 职责 / shape 特点 | 能重写吗 |
|---|---|---|
| `data/encyclopedia.ts` | | |
| `data/tangshi.ts` | | |
| `data/brainteasers.ts` | | |
| `data/hanzi.ts` | | |
| `data/pinyin.ts` | | |
| `data/animals.ts` | | |
| `data/math.ts` | | |
| `data/stories.ts` | | |
| `data/quietbook.ts` | | |
| `data/nursery.ts` | | |

---

## 阶段 1 口头验收（顺手一起做，只说不写）

> 这三条验收标准**无法用代码证明**，只能在纸上/白板上讲。讲不出来就是没过。

- [ ] **1. 手写** `DeepPartial<T>` 和至少一个条件类型工具类型 —— 不看文档
- [ ] **2. 解释** `unknown` vs `any`，并说明为什么**第三方库的边界应该用 `unknown`**
- [ ] **3. 讲清** 结构化类型（TS）vs 名义类型（Java），以及**它对 API 设计的影响**

### 已知的记录在案、不需要重复验的

| 项 | 状态 |
|---|---|
| `satisfies` | 会话 12 已实测评估，**有意不加**（消费方只读宽类型，窄类型无人消费）；何时成为必需品已记录（W4 推 Prisma schema、阶段 3 约束 LLM 输出） |
| `unknown` vs `any` | 会话 13 已实测（`jwt.verify` 返回 `{ [key: string]: any }` 的窄化、4 处 `as` 全在系统边界） |
| "写错字段当场报错" | 现有注解写法 `const x: T[] = [...]` **已经做到**（excess property check） |

> 但这三条是**会话 12/13 的日志里写的**，不是你此刻能复述的。上面那个口头验收还是要自己讲一遍。

---

## 口试记录 · 会话 14（2026-09-23）

**换方式的起因**：当晚读不进代码。改用「我读代码出题、你只用嘴答」——验证「能讲出来」本来就更该用讲的方式，且被动重读必然产生「我懂了」的错觉，主动回忆才能暴露空洞。

规则：一次一题、不给提示、不打开文件、答完追问「还有吗」。

| # | 文件 | 问题 | 结果 |
|---|---|---|---|
| Q1 | `useProgress.ts` | 🔥 连续打卡什么时候变 0 | **✅** 三个触发全中（重置 / 存储损坏 / 断学）；追问「周日学过、周一没开、周二打开时几？」→ 答「打开 0，学完 1」两个数全对 |
| Q2 | `useChallenge.ts` | 题目从哪来？为什么不直接 import 各栏目数据？ | **⚠️** 前半对（由视图传入）。后半答「直接 import 可以统一管理，用到再传更易理解」——**这是想当然的理由，不是作者的理由**，真因是「避免把其他栏目数据打进当前懒加载 chunk」 |
| Q3 | `utils/filter.ts` | `groupBy` 为什么返回 `[T[K], T[]][]` 而不是 `Map` | **⚠️** 答「为了统一每个视图的调用，每个视图接口都是元组类型」——**把结论当理由（循环论证）**，说不出 `.length` vs `.size` 那个真 bug |

**两次 ⚠️ 的共同模式（值得警惕）**：不是「不知道」，而是**给一个听起来合理的错理由**。这比空白危险——面试时会自信地讲错，对面写下的是「不懂打包 / 不懂设计取舍」。

### Q2 的证据（已实测，不是推测）

| 数据 | 出现在哪个 chunk |
|---|---|
| 「大象是陆地上最大的动物」（百科） | 只有 `EncyclopediaView.js` |
| 「疑是地上霜」（唐诗） | 只有 `TangshiView.js` |
| 「袋鼠」（动物） | 只有 `AnimalsView.js` |
| 「听一听，它是谁」（`useChallenge` 提问模板） | `ChallengeLauncher.js` ← **共享 chunk，6.6KB，7 个视图都加载** |

→ `useChallenge` 若静态 `import` 任一栏目数据，那份数据会被「抬」进共享 chunk，**7 个视图全部被迫下载全部 10 个栏目的内容**。打开唐诗页的孩子会连带下载百科/动物/识字/拼音/安静书。

**可迁移规则（W4 会复用）**：共享模块绝不能静态依赖任何一方的私有资源。**依赖方向决定打包边界。** 作者主动放弃了「统一管理」这个真实好处，因为代价落在孩子手机的流量上，不落在开发者手上——这是取舍，不是审美。

### Q3 的真答案（两层）

1. **真出过的 bug**：5 个分组视图的模板写 `v-if="categories.length"`，而 `Map` 只有 `.size` 没有 `.length`（实测 `Map.length === undefined`）。返回 `Map` 会让**筛选后整页空白**。
2. **类型层**：`T[K]` 配合 `K extends keyof T` 索引访问，保住分组键的窄类型（如 `'陆地' | '海洋'`），不塌回 `string`。

**这条最值钱的地方**：这个 bug **`vue-tsc` 不报、首页冒烟也不报**——只有真去点那个筛选才现形。和规划 W11「收集孩子真实抱怨」是同一件事的缩小版：**没被真跑过的代码路径，等于没写。**

### Q1 遗留问题的答案（口试时说过「最后统一讲」）

**为什么「断档归零」要写在 `load()` 和 `rollDay()` 两个地方？一个不够吗？**

因为两个地方覆盖的是**两种不同的时间流逝方式**：

| 位置 | 何时执行 | 覆盖的场景 | 处理结果 |
|---|---|---|---|
| `load()` | 只在 **App 冷启动**时跑一次（模块 init，ES module 单例） | 上次打开是前天或更早——**关闭期间**跨了天，期间没有任何学习事件，没人会触发 `rollDay` | streak **归 0** |
| `rollDay()` | 每次**学习事件**里跑 | App **一直开着跨过午夜**（孩子平板不关，PWA 常驻），此时 `load()` 不会再跑 | streak **置 1** |

只写一个必然漏掉另一种。而且注意两处的处理**本来就该不同**：`load()` 时孩子还没学，如实报「断了」→ 0；`rollDay()` 时孩子正在学，已经是新 streak 的第 1 天 → 1。**所以它们不只是位置不同，语义也不同，不能合并。**

### 复述轮（当晚第二轮）

| 题 | 复述内容 | 结果 |
|---|---|---|
| Q2 | 「数据集中引入，会导致不需要的视图也加载全量数据」 | **✅ 通过**。要点抓到：集中引入 → 不需要的视图也下载全量。补一句载体让链条完整：`useChallenge` 被 7 个视图共用 → Vite 提成**共享** chunk → 它 import 的数据全被抬进那个共享 chunk → 7 个视图全下载 |
| Q3 | 第一次答成 streak 归零那个遗留问题（**答错题**）；第二次答「视图渲染通过 `.length`，map 只有 `.size`，不会渲染页面，ts 检测也不会报错」 | **✅ 通过**（两轮后）。唯一精度修正：`.length` 的值是 **`undefined` 不是 `0`**——效果一样（falsy → 不渲染），但面试被追问「0 还是 undefined」时要答得出来。类型层（`T[K]` 保住窄类型）未提，属加分项，非必需 |

**复述轮暴露的新问题，比原题更值得记**：

`rollDay` 置 1 这件事，**Q1 里答对过**（原话：「周二打开显示 0，学完变成 1」，两个数全对）。10 分钟后复述时却说成「跨天置 0」。

→ **听懂 ≠ 能复述，答对过 ≠ 记住了。** 这不是理解问题，是**没有固化**。所以这份清单必须**手写填完**，不能只靠口试当场答对——当场答对可能只是短期记忆还在。这也反过来说明：口试只能做初筛，最终判定以「隔天还能自己写出来」为准。

---

## 结论区（填完再写）

- 全 ✅？
- ⚠️ 的文件：
- ❌ 的文件：
- 下一步：
