# kids-edu 重构 · 进度日志（progress.md）

## 会话 1（2026-08-17）
- [x] 读取 4 个技能规范 + 全部源码，完成重构计划（plan 文件已批准）。
- [x] 阶段 0：创建本套规划文件 + superpowers 执行计划。
- [x] 阶段 1：main.css 令牌化 + index.html viewport 修复。
- [x] 阶段 2：AppIcon / DetailDialog / 三视图 / App.vue 重构。
- [x] 阶段 3：build + preview + web-design-guidelines 审查 + 对比度复核。

## 会话 2（2026-08-17）— 内容扩充
- [x] 知识百科：8 → **20 条**（新增熊猫/老虎/企鹅/海豚；星星/雪花/火山/风；新分类「生活常识」4 条）。
- [x] 脑筋急转弯：8 → **16 条**（蛇/雪人/奖杯/旋转木马/球门/稻草人/头发/地球）。
- [x] 唐诗：8 → **16 首**（江南/敕勒歌/江雪/寻隐者不遇/绝句/山行/元日/鹿柴）。
- [ ] 构建验证（`npm run build`）——被权限分类器临时故障阻塞，待恢复后执行或由用户 `!` 运行。
- [ ] 提交并推送 Gitee 触发部署——同上。

## 会话 3（2026-08-20）— 新增四大功能模块
- [x] 收尾会话 2：`npm run build` 通过 + 提交推送 Gitee（`bed6a94`，触发部署）。
- [x] 识字认字模块 `/hanzi`：20 个常用字（数字/自然/动物/身体/常用字 5 组），大字形+拼音+组词 chips，新 `--tone-blue`。
- [x] 数学启蒙模块 `/math`：0-9 数字认知（emoji 数量阵列）+ 趣味练习（数一数/加减法 3 选 1 + 语音反馈），`useMathQuiz` composable，新 `--tone-red`。
- [x] 动物乐园模块 `/animals`：20 只动物（陆地/海洋/天空/极地 4 组），叫声副标题+详情，新 `--tone-teal`。
- [x] 绘本故事模块 `/stories`：3 篇故事（4-5 页/篇）逐页翻读，翻页自动朗读 + 页数 dots，AppIcon 新增 `next` 图标，新 `--tone-amber`。
- [x] 首页入口 3 → 7 张卡；`category-list` 改 `auto-fill minmax(160px, 1fr)` 自适应网格。
- [x] 构建验证（63 modules）+ preview（4 新 chunk 均 200）+ 新色对比度复核（teal 3.75 / amber 3.18，白字大字号均 ≥3:1）。

## 会话 4（2026-08-25）— 技术/体验优化 + 拼音模块
- [x] PWA 离线可玩：`vite-plugin-pwa` 1.3.0（autoUpdate + manifest + navigateFallback），`scripts/gen-icons.mjs` 用 sharp 从 favicon.svg 栅格化 5 枚 PNG 图标（192/512 + maskable×2 + apple-touch）。
- [x] 语音设置：`useSpeech` 重构（`settings={voiceURI,rate}` 持久化 `kids-edu-speech`；新 `setVoice/setRate/settings/zhVoices`）；`SpeechSettings.vue` 复用 DetailDialog（音色单选 + 语速三档 🐢0.7/😊0.85/🐇1.0）；AppIcon 新增 `settings` 齿轮；App.vue 顶栏新增设置入口。
- [x] 页面动效：`RouterView` 包 `<Transition name="page" mode="out-in">`（淡入+上移 8px），reduced-motion 兜底。
- [x] 性能优化：`manualChunks` 拆 vendor（vue+vue-router 39KB gzip，长缓存）；视图保持懒加载。
- [x] 拼音模块 `/pinyin`：63 项（声母 23 / 韵母 24 / 整体认读 16），大音节+例词+讲解+朗读，新 `--tone-pink`（#e11d48→#be123c）、`detail-pinyin`、`.pinyin-big/.pinyin-example`；首页第 8 张卡「🔤 拼音乐园」。
- [x] 可用性验证（headless Chrome + CDP）：首页 8 卡渲染；拼音路由懒加载 63 卡 + 详情弹层；语音面板打开（7 个中文音色）→ 选语速 → localStorage 持久化 → Esc 关闭；SW 实际注册成功；控制台零错误。
- [x] 构建（68 modules）+ preview 全资源 200（manifest/sw.js/registerSW/5 图标）。
- [x] 提交推送 Gitee（`ec1b802`），触发 EdgeOne 自动部署。

## 会话 5（2026-08-25）— 内容扩充
- [x] 知识百科：20 → **24 条**（兔子/青蛙/云/雨伞；动物+2、自然+1、生活常识+1）。
- [x] 脑筋急转弯：16 → **20 条**（浪花/肥皂/气球/电灯）。
- [x] 识字认字：20 → **24 字**（火/鱼/中/下；自然+1、动物+1、常用字+2）。
- [x] 动物乐园：20 → **24 只**（兔子/猴子/螃蟹/鹦鹉；陆地+2、海洋+1、天空+1）。
- [x] 绘本故事：3 → **4 篇**（新增《龟兔赛跑》5 页，寓意「不能骄傲」）。
- [x] 新增 17 个 id 已在 `src/data/` 全目录 grep 复核、全部全局唯一。

## 会话 6（2026-09-01）— 移动端语音修复 + 内容扩充
- [x] 修复移动端无声音：`useSpeech` 三重兜底加载音色（首次用户手势刷新 / 500ms 轮询 5s / 后台切回 visibilitychange），并兼容只支持 `onvoiceschanged` 属性的旧浏览器。
- [x] 朗读改为逐句 `onend` 接力（不再一次性 queue 多句），规避 iOS「只播第一句就哑火」；每句后 `resume()` 兼容老版 iOS；`stop` 用序号打断旧链。
- [x] `unlock`/`speak` 时主动 `refreshVoices`（手势后列表才就绪）；语音设置弹层区分「不支持 / 加载中 / 设备无中文音色」三种提示。
- [x] 知识百科：24 → **28 条**（蚂蚁/斑马/雨/磁铁；动物+2、自然+1、生活常识+1）。
- [x] 脑筋急转弯：20 → **24 条**（铅笔/钥匙/铃铛/风筝）。
- [x] 识字认字：24 → **28 字**（四/五/天/狗；数字+2、自然+1、动物+1）。
- [x] 动物乐园：24 → **28 只**（熊猫/袋鼠/鲸鱼/猫头鹰；陆地+2、海洋+1、天空+1）。
- [x] 绘本故事：4 → **5 篇**（新增《狼来了》5 页，寓意「不能说谎」）。
- [x] 新增 17 个 id 已在 `src/data/` 全目录 grep 复核：各文件内全部唯一（跨文件同 id 为既有设计，如 hanzi/pinyin、animals/encyclopedia 复用概念）。

## 会话 7（2026-09-08）— 内容扩充
- [x] 知识百科：28 → **32 条**（鳄鱼/蜗牛/闪电/镜子；动物+2、自然+1、生活常识+1）。
- [x] 脑筋急转弯：24 → **28 条**（黑眼圈熊猫/瓶盖/烟花/向日葵）。
- [x] 识字认字：28 → **32 字**（六/七/雨/门；数字+2、自然+1、常用字+1）。
- [x] 动物乐园：28 → **32 只**（河马/孔雀/龙虾/河豚；陆地+1、天空+1、海洋+2）。
- [x] 唐诗：16 → **20 首**（回乡偶书/画/池上/古朗月行〈节选〉）——唐诗自会话 2 以来首次扩充。
- [x] 绘本故事：5 → **6 篇**（新增《乌鸦喝水》5 页，寓意「遇到困难多动脑筋」）。
- [x] 新增 21 个 id 已用 node 脚本在 6 个改动文件内复核：全部唯一，计数 32/28/20/32/32/6。

## 会话 7 补充（2026-09-08）— 拼音朗读修复
- [x] `pinyin.ts` 每个声母/韵母/整体认读音节增加汉字呼读音字段 `sound`（如 b → 玻），并改写讲解文案，避免出现拉丁字母被语音合成按英文念。
- [x] `PinyinView.vue` 朗读改为用 `item.sound`；`HanziView.vue` 朗读去掉拉丁拼音，直接念汉字。
- [x] `useSpeech.ts` 中文音色识别兼容 `cmn-`（部分安卓）与名称含 Chinese/中文的音色，并兼容 `zh_CN` 下划线写法。
- [x] `npm run build`（vue-tsc -b && vite build）通过。

## 会话 8（2026-09-09）— 学习激励层 + 首页改版 + 内容扩充（参考「叫叫」体验）
- [x] 新增 `useProgress` 学习激励 composable（localStorage `kids-edu-progress` 持久化）：条目「已学」打勾 ✅、首次学完 +1⭐、每日目标 3 条达成提示、连续打卡天数（streak）。
- [x] `BigCard` 支持 `done` 角标（右上白底绿勾 + 轻微完成态）。
- [x] 八栏目视图全部接入激励：打开即学（百科/唐诗/识字/数学数字/动物/拼音），脑筋急转弯揭晓答案才算学完，绘本翻到最后一页才算读完并得星；卡片实时显示已学勾。
- [x] `App.vue` 全局监听 `rewardTick` 播放飘星奖励动效（reduced-motion 兜底）；记录最近学习栏目，供首页「继续学习」。
- [x] 首页改版为「叫叫式学习主页」：🦉 吉祥物 + 按时段问候语 + ⭐星星/🔥连续打卡/📖今日进度统计条 + 今日任务达成祝贺 + 「继续学习」卡 + 8 栏目大卡。
- [x] 内容扩充：知识百科 32→**36**（松鼠/刺猬/沙漠/筷子；动物+2、自然+1、常识+1）；脑筋急转弯 28→**32**（彩虹/星星/牙齿/人人念错的字）；识字 32→**36 字**（鸡/风/耳/米）；动物乐园 32→**36 只**（狐狸/骆驼/天鹅/水母）；唐诗 20→**24 首**（赠汪伦/游子吟/望天门山/夜宿山寺）；绘本 6→**7 篇**（新增《小马过河》5 页，寓意「自己试一试才知道」）。
- [x] 新增 22 个 id（encyclopedia 4 / brainteasers 4 / hanzi 4 / animals 4 / tangshi 4 / stories 1 + `小马过河` 1 共用 id 计数 6 文件）已按文件唯一。
- [x] `npm run build`（vue-tsc -b && vite build）通过，约 3.5s；preview 冒烟首页 200。

## 会话 9（2026-09-09）— 学情工具条 + 今日小挑战 + 家长重置
- [x] 新增 `ModuleLearnBar.vue` 栏目学情工具条：已学进度条（role=progressbar）+ 百分比 + 「全部/没学过/学过」筛选 chips + 全部学完祝贺语；接入 6 个栏目列表页（百科/脑筋/唐诗/识字/动物/拼音）。
- [x] 新增「今日小挑战」闯关答题（叫叫式互动练习）：`useChallenge.ts` 题库生成器 + `QuizDialog.vue` 通用闯关弹层（答题点选/答错自动纠正高亮/🔊重听/结算星星屏）+ `ChallengeLauncher.vue` 入口横幅。接入百科（听名认图）、动物（听声认图）、识字（听音选大字）、唐诗（接下一句）。
- [x] 闯关激励：`useProgress` 新增 `passQuiz(module)` —— 每栏目每天首次答对 ≥3/5 通关 +1⭐ 并计入今日任务；`rewardTick` 飘星动效自动复用。
- [x] 首页改版补充：每张栏目卡左上角「已学 x/N」角标（`BigCard.corner`），新增全站累计「已认识 x/总数 个内容」进度行（真实数据计数 36/32/24/36/10/36/7/63 已核对）。
- [x] 设置面板升级：改为「设置」，新增学习记录区（⭐累计/🔥连续/今日进度统计 + 本地存储说明）+ 重置学习记录（4s 内二次点击确认防误触）。
- [x] `npm run build`（vue-tsc -b && vite build）通过；preview 冒烟 200。

## 会话 10（2026-09-09）— 安静书模块上线 + 三种新玩法
- [x] 新增「安静书」互动模块 `/quietbook`：内容模型（QbOption/QbRound）+ `quietbook.ts` 题库 + `QuietBookView.vue` 电子机关引擎（书页 chips/回合 dots/语音引导/整页完成计入 `useProgress` 激励）。
- [x] 基线 6 页纯点选玩法：穿衣小帮手 / 颜色点点 / 数一数 / 动物吃什么 / 果蔬分类 / 动物住哪里（pick-one 单选 + pick-all 收进小篮，点错摇一摇不挫败）。
- [x] 扩展 3 页玩法：**找不同**（上排原样 vs 下排对照，把变样格子都点出）、**谁不见了**（先记一记 3s → 躲猫猫 → 从回来的小伙伴里找出缺谁）、**影子找朋友**（看彩色小动物点出黑影剪影）；`goal` 扩为 `spot-diff`/`whats-missing`/`shadow`，含 `reference/memory/after` 字段与记忆阶段状态机。
- [x] 首页「安静书」卡 `total` 6→9（栏目标签/进度自动联动）；`npm run build`（vue-tsc -b && vite build）通过。

## 会话 11（2026-09-09）— 儿童歌谣上线 + 大班内容调适 + 导航语音细节
- [x] 新增「儿童歌谣」模块 `/nursery`：`nursery.ts` 9 首传统童谣（动物/自然/生活/游戏 4 组），歌词逐句拆分 + 每句 emoji 剧场 + 「想一想」大班互动提问；新 `--tone-lime`、`detail-nursery` 主题。
- [x] `NurseryRhymesView.vue` 逐句动画剧场：点卡弹层逐句大字动画（pop 翻页 + dots），「连唱一遍」逐句朗读自动翻页，唱到末句/连唱完毕计入 `useProgress.learn`；静音/无声设备用 900ms 节拍演示兜底。
- [x] `useSpeech` 新增 `speakLines(texts, onTick?, onDone?)`：按句顺序朗读、每句回调句下标，供逐句画面同步（1 句 ↔ 1 回调，不打散，stop/新一轮自动打断）。
- [x] 首页第 10 张卡「🎵 儿童歌谣」（total 9）；路由 `/nursery` + meta title。
- [x] 大班化抽样加深（不整卷重写）：百科太阳/月亮/彩虹/影子/云/大海 6 条补因果逻辑（发光恒星/反射光/折射七色/直线遮光/水循环/海水含盐）；动物猫/狗/牛/马/羊/兔 6 条 fact 加深（胡须探路/嗅觉找物/反刍/蹄声/羊毛纺织/耳朵散热）。
- [x] 导航语音细节：`App.vue` 返回首页前 `stop()` 立即静音 + route watcher 兜底（浏览器后退/手势从栏目回首页时不等页面过渡结束即静音），不再掐断首页点卡「栏目名」引导语。
- [x] `npm run build`（vue-tsc -b && vite build）通过，新增 NurseryRhymesView chunk 8.55KB（gzip 3.94）；README 同步新增歌谣/安静书栏目说明与数据文件条目。

## 会话 12（2026-09-22）— 阶段 1 任务 A：类型重构（泛型抽象）

> 对应 `CAREER_PLAN.md` 阶段 1 任务 A。目标：消除 `src/data` 10 处重复类型定义，并让数据文件写错字段时当场报错。

- [x] 新建 `src/types/`：`content.ts` 定义最小公共形状 `ContentItem { id; emoji }`；`filter.ts` 定义 `LearnFilter = 'all' | 'todo' | 'done'`（从 `ModuleLearnBar.vue` 中移出——类型不应由组件承载）；`index.ts` 只做 re-export（barrel 只转发，不藏实现）。
- [x] `src/data/` 10 个文件全部改为 `interface XxxItem extends ContentItem`，删除各自重复声明的 `id` / `emoji` 字段。
- [x] 新建 `src/utils/filter.ts`：`groupBy<T, K extends keyof T>(items, key): [T[K], T[]][]` + `applyFilter<T extends { id: string }>(items, filter, module, isLearned)`。
- [x] 7 个视图接入：5 个分组视图（百科/识字/拼音/动物/歌谣）改用 `groupBy(applyFilter(...), '<字段>')`，2 个无分组视图（脑筋/唐诗）只用 `applyFilter`。净减约 50 行重复代码。

**设计决策记录（每个约束表达了什么业务规则）：**
- `ContentItem` 只放 `id` + `emoji`，**刻意不含 `category`**：拼音用的字段名是 `group`，脑筋/唐诗/数学/绘本**根本没有分组字段**。把 `category` 提到基类会让 10 个类型里的 6 个凭空多出一个必填字段。
- 4 个分组栏目把 `category: string` 收紧为**字面量联合**（`animals` 陆地/海洋/天空/极地、`encyclopedia` 动物/自然/生活常识、`hanzi` 数字/自然/动物/身体/常用字、`nursery` 动物/自然/生活/游戏）：这是**值级防拼错**——写 `category: '路地'` 当场报错，而 `string` 时只能等运行时看到分组多出来一个。各文件的 `Category` 是**模块私有且互不相同**（同名但语义不同，不导出、不共享，这是对的）。
- 遗留不一致：`pinyin.ts` 仍为 `group: string`（其他 4 个分组字段都已收紧），其分组词表为 声母/韵母/整体认读音节。
- `groupBy` 返回**元组数组** `[T[K], T[]][]` 而非 `Map`：5 个分组视图的模板用 `v-if="categories.length"`，而 `Map` 只有 `.size` 没有 `.length` —— 返回 `Map` 会让筛选后**整页空白**，且 `vue-tsc` 与首页冒烟**都抓不到**（实测 `Map.length === undefined`）。返回元组数组同时保住了 `T[K]` 的窄类型（配 `keyof T` 索引访问）。
- `applyFilter` 把 `isLearned` 作为**参数**传入，而非在函数内部调 `useProgress()`：`utils/` 不能依赖 `composables/`（后者依赖 vue + localStorage），否则依赖方向倒置、纯函数不可测。
- 泛型约束 `T extends { id: string }` 的正当性**只来自函数体真的读了 `item.id`**，不是"以后可能用得上"。

**`satisfies` 评估结论：理解，但本仓库不引入。**
- 用真实编译验证过：`satisfies` 的价值是「**校验值** + **保留字面量类型**」（`: Type` 校验但拓宽；`as` 既不校验也不保留）。对象字面量属性会被拓宽成 `string`，`satisfies` 拦得住并留成 `'陆地'`。
- 为什么不加：本仓库所有消费方只读**宽类型**（`AnimalItem[]` / `LearnFilter`），保留窄类型**无人消费**，收益为 0；而「写错字段当场报错」这条现有注解写法 `const numbers: MathNumber[]` **已经做到**。
- 唯一像样的落点 `ModuleLearnBar.FILTERS` 若要吃到收益，需从其**派生** `LearnFilter`，前提是把常量移出 `.vue` —— 反而破坏刚理清的边界（types 不得依赖组件）。
- **何时才是必需品**：阶段 2 从数据推导 Prisma schema（W4）、阶段 3 用 JSON Schema 约束 LLM 结构化输出——那才是 `as const satisfies` 的主场。
- 记这一条的目的：验收标准考的是「能解释每个类型表达的业务规则」，**想过而不加 ≠ 没想过**；且风险表 #2 明确警告「阶段 1 沉迷类型体操 → 超过 3 周硬停」。

- [x] ~~待收尾：`src/utils/filter.ts` 风格清理未完成——仍有 5 处分号 + 2 处双引号~~ **订正（会话 13 复核）**：提交前实际只剩 **1 处分号**（第 10 行 `list.push(item);`），5 处/2 处这个数字是清理前的快照，没随代码一起更新。最后 1 处已在会话 13 补掉（改在 `src/utils/filter.ts:10`，**当前仍是未提交状态**）。
- 备注：项目**无 ESLint / Prettier / EditorConfig**，代码风格无自动守卫、全靠手工一致；新增文件越多越易漂移。阶段 2 前值得补一个格式化配置（仅记录，不在本阶段做）。

## 会话 13（2026-09-22）— 阶段 1 任务 B：`node-test/06-database` strict TS 重写

> 对应 `CAREER_PLAN.md` 阶段 1 任务 B。**本次改动全在 `node-test/`，kids-edu 源码只动了一个分号**。
> 详细记录（含每条坑的实测证据）见 `node-test/06-database-ts/README.md`。

- [x] 取「平行目录」方案：JS 版**原样留在** `06-database/`，TS 版新建 `06-database-ts/`，`tsc` 编译到 `dist/`，端口错开为 **3006**（两版可同时跑对照）。`node-test` 不是 git 仓库，平行目录同时充当了还原点。
- [x] 工具链 `npm i -D typescript @types/node @types/express @types/jsonwebtoken`，装到的是 **typescript 7.0.2**（原生版编译器）。bcryptjs 3.x 自带 `index.d.ts`，**不装** `@types/bcryptjs`（那是个已废弃的 stub）。
- [x] 17 个文件 / 1159 行：`types/`(domain+http+express.d.ts) + `middleware/`(error/logger/requireJwt/validate) + `models/`(User/Task) + `store/`(users/tasks) + `routes/`(auth/tasks) + `env/config/db/server`。
- [x] strict 全开之外再加 `noUncheckedIndexedAccess` / `noImplicitOverride` / `noFallthroughCasesInSwitch` / `noUnusedLocals` / `noUnusedParameters`；`any` **0 处**（仅 2 处出现在注释里，用于解释为什么不写 any）。
- [x] 三处**有意**的结构改动（README 逐条写了理由）：body 校验从中间件改成纯函数（窄化发生在使用点，而不是靠「顺序保证」的声明）；改删 store 收**文档**而非 id（消掉返回类型里那个逻辑上不可能的 `null`，顺带少一次查库）；响应统一走 `ok()/okMessage()/fail()`（`res.json()` 参数是 `any`，直接写对象字面量拼错字段名编译器不吭声）。
- [x] 新增 scripts：`db:ts` / `db:ts:check` / `db:ts:clean`。
- [x] 顺带修掉会话 12 遗留的最后 1 处分号（`src/utils/filter.ts:10`）。

**踩到的坑（全部用 tsc 探针实测，不是推测）：**
- **`__dirname` 变了**：`tsc → dist` 后它指向 `dist/`，JS 版那句 `path.join(__dirname, '.env')` 在编译产物里**必然读不到 `.env`，而且失败是静默的**（dotenv 照常打提示、服务照跑，只是连了默认库、签了默认密钥）→ 用 `../.env`；`public/` 同理。**运行时路径要按产物位置算，不是按源码位置算。**
- **dotenv 的执行时机**：在 `server.ts` 里写一行 `dotenv.config()` 能生效，靠的是 **CJS 的 require 按语句位置顺序执行**；哪天改成 ESM，import 全部提升，`./config` 会先于它求值、`process.env` 全空——而这是运行时错误，编译器不拦 → 抽成 `src/env.ts` 放第一条 import，靠「import 之间相对顺序被保留」这条 ESM/CJS 都成立的规则。
- **错误中间件少写第 4 个参数，TypeScript 不报错**（函数可以少收参数）。但 Express 靠 `fn.length === 4` 识别错误中间件，于是它**静默降级成普通中间件、所有错误变成 404** → 第 4 个参数用 `_next` 命名，既过 `noUnusedParameters` 又保住 arity=4。
- **`jwt.verify` 返回 `string | JwtPayload`**，而 `JwtPayload` 是 `{ [key: string]: any }`——只保证「是个对象」，不保证有 `userId`；token 还是**客户端造的** → 逐字段窄化。`decoded as {userId: string}` 会让 `findById(123)` 在类型系统全程沉默的情况下发生。
- **Mongoose 的 `find()` 对未知键是宽容的**：`TaskModel.find({ titel: 'x' })` **编译通过**，只会变成一个永远匹配不上的静默筛选；换成 `find({ done: 'not-a-boolean' })` 才报 TS2769 → 所以 `const query: TaskFilter = {}` 这种「具名类型站在中间」的写法是真有防御价值，不是装饰。
- **`InferSchemaType` 能把 `timestamps` 推出来**（报错信息里可见 `createdAt: NativeDate`），不需要手写 interface 也不需要 `Schema<Doc>` 手写泛型——省下一处「两个事实来源」。
- 全项目共 **4 处 `as`，全部落在系统边界**（env 字符串 / 泛型 req / unknown error / unknown body），**业务逻辑中间 0 处**。

## 会话 14（2026-09-23）— 阶段 1 验收：口试初筛（对应 `CAREER_PLAN.md` 触发器 3）

> **无代码改动，无构建。** 本次是「能否讲清自己的项目」的验证，不是开发。
> 完整记录（含口试逐题判定、证据表、遗留问题答疑）见 `EXPLAIN_CHECKLIST.md`。

- 起因：当晚**读不进代码**。改用「我读代码出题、只用嘴答」的方式——验证「能讲出来」本就该用**讲**的方式；且被动重读必然产生「我懂了」的错觉，主动回忆才能暴露真实空洞。
- 覆盖 3 个文件：`useProgress.ts` **✅ 一次过**（🔥 连续打卡何时归零：重置/存储损坏/断学三个触发全中，追问「周日学过、周一没开、周二打开显示几」→ 答「打开 0，学完 1」两个数全对）；`useChallenge.ts` ⚠️→✅；`utils/filter.ts` ⚠️→✅。**无 ❌。**
- **关键发现一（今晚最值钱的）**：两次 ⚠️ 是**同一个模式**——不是「不知道」，而是**给一个听起来合理的错理由**。Q2 答「直接 import 可以统一管理，用到再传更易理解」（真因是避免把其他栏目数据打进懒加载 chunk）；Q3 答「为了统一每个视图的调用，视图接口都是元组类型」（**把结论当理由，循环论证**）。**这比空白危险得多**：空白会让人去查，错理由会让人在面试里自信地讲错，且收不到任何反馈。
- **关键发现二**：`rollDay` 是**置 1**（不是置 0）这件事，Q1 里答对过，10 分钟后复述却说成「跨天置 0」。→ **答对过 ≠ 记住了。** 故口试只作**初筛**，最终判定以《隔天还能独立写出来》为准；`utils/filter.ts` 已标为「✅ **但需隔天复验**」。
- Q2 证据（**实测 grep 构建产物**，非推测）：| 数据 | 所在 chunk | —— 百科「大象是陆地上最大的动物」只在 `EncyclopediaView.js`；唐诗「疑是地上霜」只在 `TangshiView.js`；动物「袋鼠」只在 `AnimalsView.js`；而 `useChallenge` 的提问模板「听一听，它是谁」落在 `ChallengeLauncher.js`——**一个 6.6KB、7 个视图都加载的共享 chunk**。→ 若 `useChallenge` 静态 import 任一栏目数据，会被「抬」进共享 chunk，**7 个视图全部被迫下载全部 10 个栏目的内容**（打开唐诗页的孩子连带下载百科/动物/识字/拼音/安静书）。**可迁移规则（W4 复用）：共享模块绝不能静态依赖任何一方的私有资源；依赖方向决定打包边界。**
- Q3 两层答案：①**真出过的 bug**——5 个分组视图模板用 `v-if="categories.length"`，`Map` 只有 `.size` 没有 `.length`（值是 `undefined` 不是 `0`，但同为 falsy）→ **筛选后整页空白**；②**类型层**——`T[K]` 配 `K extends keyof T` 保住分组键的窄类型。**这条最值钱处：该 bug `vue-tsc` 不报、首页冒烟也不报，只有真去点那个筛选才现形——没被真跑过的代码路径等于没写。**
- Q1 遗留问题讲清：「断档归零」写在两处**不是冗余**。`load()` 只在 **App 冷启动**跑一次（ES module 单例），覆盖**关闭期间跨天**——那段期间没有任何学习事件，没人会触发 `rollDay`；`rollDay()` 在学习事件里跑，覆盖 **App 一直开着跨过午夜**（孩子平板不关，PWA 常驻），此时 `load()` 不会再跑。且两处**语义本就不同**：前者孩子还没学→如实报「断了」→ **0**；后者孩子正在学→已是新一天第 1 条→ **1**。**位置不同、语义不同，不能合并。**
- 产出 `EXPLAIN_CHECKLIST.md`：43 文件三列清单（职责 / 关掉 AI 能否重写）+ 阅读顺序 + 口试逐题记录 + 隔天复验栏。已填 3 行，余 40 行待填。
- 下一步：① 隔天复验上述 3 个（不看清单、不开代码，独立写出来）② 接着考 `useSpeech`（逐句 `onend` 接力绕开什么）/ `quietbook` / `useMathQuiz` / `ChallengeLauncher`——会话 9-11 那批尚未覆盖，风险高于今晚这三个。

## 会话 15（2026-10-20）— 内容扩充（按 `/perfect-version` 默认动作）

- [x] 知识百科 36 → **40 条**：犀牛 / 蜂鸟（动物 +2）、地球（自然 +1）、打喷嚏（生活常识 +1）。
- [x] 脑筋急转弯 32 → **36 条**：影子 / 回声 / 蜡烛 / 雨伞。
- [x] 识字认字 36 → **40 字**：八 / 九（数字 +2）、花（自然 +1）、虫（动物 +1）。
- [x] 动物乐园 36 → **40 只**：长颈鹿 / 松鼠（陆地 +2）、海星（海洋 +1）、北极狐（极地 +1）。
- [x] 绘本故事 7 → **8 篇**：新增《猴子捞月》5 页，寓意「遇事要看清，别把倒影当真」。
- [x] 首页 `CATEGORIES` 各栏目 `total` 同步为 40/36/40/40/8。
- [x] 新增 13 个 id 已复核：各文件内唯一；与既有数据文件的跨文件同 id 保持原有设计（`hua` 为避免与唐诗 `画` 撞名改为 `hua-flower`）。
- [x] 内容事实复核：犀牛角成分类似指甲、蜂鸟可倒飞、长颈鹿喝水姿势、海星断角可再生、北极狐随季节换毛等均有据。

## 会话 15 补充（2026-10-20）— 验证工具链修复 + 数量校验

- [x] 修复 `scripts/preview-check.mjs` 的 Windows 进程泄漏：收尾从 `child.kill()` 改为 `taskkill /pid <pid> /T /F`（`killTree()`），连 Chrome 的 renderer/gpu/crashpad 子进程一起终止。
- [x] 失败路径同样会清理：`fail()` 从 `process.exit(1)` 改为抛错，让 `finally` 能执行；outer catch 统一打印 `✗ <原因>`。
- [x] 实测两项：正常通过后残留 Chrome 进程 **0**、临时 profile 目录 **0**；故意用不存在的文案触发失败后同样为 **0/0**。
- [x] 新增 `scripts/check-counts.mjs` + `npm run check:counts`：解析 `HomeView.vue` 的 `module/total`，与 `src/data/<module>.ts` 的 `id:` 数量逐一比对；10 个栏目全部一致。
- [x] `HomeView.vue` 增加注释说明 total 为何必须手写（静态 import 数据会打破懒加载边界），并指向 `check:counts`。
- [x] 文案微调：识字「虫」讲解中的「蚂蚁都是虫」改为「毛毛虫、小甲虫」。
- [x] `npm run build` 通过（86 modules，860ms）。

## 会话 15 补充二（2026-10-20）— 交互模块真实点击验证

> 起因：会话 14 指出安静书 / 今日小挑战 / useSpeech 逐句接力等模块「尚未被实际点击验证过」，风险高于已考过的文件。

- [x] 新增 `scripts/interaction-check.mjs` + `npm run check:interactions`：headless Chrome + CDP 在构建产物上**真点真判**，覆盖 10 项交互。
- [x] 安静书：多选收集（小篮子 3 个）/ 点错摇一摇且不进篮子 / 三回合完成庆祝 + 写入 `quietbook:dress` + 得星 / 「谁不见了」先记忆 3 秒且期间不显示选项 / 「影子配对」答对高亮。
- [x] 今日小挑战：5 题先答错 → 等待 900ms 揭示正确项 → 结算屏；再玩一次按记录的正确项全对 → 「闯关成功」+ 写入当日 `quizAwarded`；关闭弹层。
- [x] 数学练习：识别数一数/加减法答案 → 点对后 `.correct` + 反馈 + 选项锁定；换一题后样式复位；点错后 `.wrong` + 鼓励文案。
- [x] 儿童歌谣：连唱一遍逐句推进 / 停了可再操作 / 下一句 / 想一想展开收起 / 关闭弹层。
- [x] **发现并修复一个真实 UI 缺陷**：`QuietBookView.optClass()` 只对 `pick-one` 返回 `qb-correct`，而 `shadow` / `whats-missing` 虽走单选逻辑却永远不高亮正确答案（有反馈文案、没有绿色视觉）。已把三者合并为同一单选族判断。
- [x] README 本地开发新增 `check:counts` / `check:interactions` 两条命令。

## 会话 15 补充三（2026-10-20）— 补齐剩余交互 / 离线 / 语音路径

- [x] `check:interactions` 从 10 项扩到 **14 项**：
  - 安静书「颜色点点」：色块渲染（5 个 `.qb-dot`）/ 点错复位 / 5 回合全部完成并写入 `quietbook:colors`
  - 安静书「找不同」：逐回合从上排 `reference` 与下排选项做 **DOM 文本比对**，自动找出 2 处差异 → 全部收入 + 3 回合完成并写入 `quietbook:spot`
  - 语音：拦截 `speechSynthesis.speak` 计数，打开百科「太阳」长文本，确认按句拆成 **≥2 个 utterance** 接力（`onend` 链真的在跑）
  - PWA：等 Service Worker 接管后，用 CDP `Network.emulateNetworkConditions` 断网 + `ignoreCache` 冷启动，首页 10 卡仍渲染；再点「拼音乐园」，懒加载 chunk 也从预缓存加载（离线可用）
- [x] 本轮**未发现新的应用缺陷**（上一轮的 `qb-correct` 高亮问题是唯一一个）。
- [x] 离线窗口单独计数网络错误，不与在线控制台错误混在一起；本次离线窗口错误为 0。

## 会话 16（2026-10-21）— 内容扩充（按 `/perfect-version` 默认动作）

- [x] 知识百科：40 → **44 条**（蝴蝶/蒲公英/四季/刷牙；动物+1、自然+2、生活常识+1）。
- [x] 脑筋急转弯：36 → **40 条**（针的眼睛/木耳/收音机/手套）。
- [x] 识字认字：40 → **44 字**（云/田/石/牙；自然+3、身体+1）。
- [x] 动物乐园：40 → **44 只**（犀牛/树懒/燕子/小丑鱼；陆地+2、天空+1、海洋+1）。
- [x] 绘本故事：8 → **9 篇**（新增《拔萝卜》5 页，团结合作主题）。
- [x] `HomeView.vue` 同步 5 个栏目 total；新增 id 在各自模块内均无重复。
- [x] 本轮为纯内容追加，未改结构、样式与交互。

## 会话 16 补充（2026-10-21）— 体验修复 + 内容补强

- [x] 修复《小马过河》第 3 页配图：老牛段落误用 🐿️，改为 🐮（`src/data/stories.ts`）。
- [x] 路由滚动复位：`router.scrollBehavior` 新进入栏目回顶部，浏览器后退恢复 `savedPosition`。
- [x] 弹层可访问性：`DetailDialog` 增加 Tab 焦点循环；打开时给 `.app-shell` 加 `inert`，关闭/卸载移除。
- [x] 学情条统一：绘本页加 `ModuleLearnBar`（只显示进度）；数学页加进度 + 「全部/没学过/学过」筛选 + 空状态。
- [x] 安静书 22 处硬编码 hex 全部令牌化（`--color-correct / --color-wrong / --color-warn / --color-info / --color-neutral-*` 等）；`*.vue` 硬编码 hex 归零。
- [x] 对比度顺手提升：答对绿底白字 `#15803d`（≥4.5:1）、剩余数量橙底白字 `#c2410c`、靛蓝色 `#4f46e5`。
- [x] 数学：10 → **21 条**（新增 10-20；详情用 `num-dots` 逐个数数）。
- [x] 动物：44 → **50 只**（极地 +3：海象/北极兔/麝牛；天空 +3：麻雀/喜鹊/啄木鸟）。
- [x] 唐诗：24 → **28 首**（所见/小池/山村咏怀/村居；用《村居》替代《悯农（其一）》，避免「饿死」等不适龄内容）。
- [x] `check:interactions` 14 → **18 项**：新增故事学情条+老牛配图、数学 10-20+筛选、路由回顶部、弹层焦点循环+inert。
- [x] 修正测试脚本自身的一个坑：`clickText('.chip-btn', '学过')` 会先命中「没学过」，改为按 chip 索引点击。

## 会话 17（2026-10-22）— 挑战覆盖 + 无障碍兜底 + 内容扩充

- [x] 脑筋急转弯接入「今日小挑战」：新增 `buildRiddleQuiz`（`useChallenge.ts`），TTS 念谜面、3 个谜底选项；`BrainTeasersView` 加 `ChallengeLauncher`。此前只有百科/动物/识字/唐诗 4 个栏目可闯关。
- [x] 挑战静音兜底：`QuizDialog` 在静音或设备无语音时直接显示题目文字（`.cq-say`），并隐藏无效的 🔊 重听按钮——此前没声音就无法作答听音题。
- [x] 挑战无障碍：新增屏读可见的「第 x 题，共 y 题」（此前圆点与分数均 `aria-hidden`，读屏听不到进度）。
- [x] 答错回顾：结算屏列出答错的题号、题面（唐诗上句/谜面）与正确谜底，方便家长带着复习；「再玩一次」会清空回顾。
- [x] 数学「趣味练习」加「听题」按钮：进入页面自动读题后，可随时重听（此前只有「换一题」会朗读）。
- [x] 唐诗：28 → **32 首**（望洞庭/九月九日忆山东兄弟/春日/竹石）。
- [x] 绘本：9 → **10 篇**（新增《小壁虎借尾巴》5 页；鱼尾拨水、牛尾赶蝇、燕尾定向、壁虎尾再生均属实）。
- [x] `HomeView.vue` 同步 tangshi 32 / stories 10。
- [x] `check:interactions` 18 → **20 项**：新增脑筋急转弯挑战、静音兜底；挑战结算新增「答错回顾条数 = 5 − 答对数」断言。

## 会话 18（2026-10-22）— 角色化审计后的 R1：信任 / 无障碍 / 数据安全

- [x] 四个角色（产品经理 / 儿童内容专家 / UX 无障碍设计师 / 前端工程 + QA）并行只读审计，产出 `ROADMAP.md`：R1 信任与无障碍、R2 家长报告与续学、R3 年龄分层与内容治理，以及「明确不做」清单。
- [x] 挑战入口诚实反馈：听音类栏目在静音/无中文音色时置灰并显示「打开声音就能玩」，点击说明原因；当天已得星的栏目显示「今天已经得过 ⭐ 啦」。
- [x] **纠正会话 17 的静音兜底缺陷**：此前静音时直接把 `q.say`（答案）显示在屏幕上，听音题等于直接给答案。现在只提示如何打开声音，并禁用听音类挑战；看题类（唐诗/脑筋急转弯）不受影响。
- [x] 答错必须看纠错：正确项揭示前「下一题」保持禁用，避免孩子跳过错误。
- [x] 阈值统一为 `passThreshold(QUIZ_SIZE)`；单选按 id 判题，避免同名干扰项误判。
- [x] 全局焦点环改为深蓝 + 白晕；修正跳过链接、筛选片、音色片、奖励文字、歌谣句号、安静书页码的对比度；触控目标补到 ≥44px。
- [x] 路由：`document.title` 同步、切页后焦点回到 `#main`、未知地址回首页、部署后旧 chunk 加载失败自动刷新一次（sessionStorage 防循环）。
- [x] 弹层：body 滚动锁 + 计数式 inert（新增 `useModalLock.ts`），修复关闭态弹层卸载时误解除其他弹层背景锁的问题。
- [x] 学情数据：坏 schema 回退默认值、非字符串 key 过滤、首页角标按栏目总量截断、`reset()` 后连续打卡从 1 开始。
- [x] Safari 兼容：移除后行断言，长文本仍按句接力朗读。
- [x] 安静书：第 9 页显示「第九页」、记忆阶段 3s → 4.5s、翻页后滚回书页顶部；歌谣静音立即停止连唱、无声演示节拍 0.9s → 2.5s。
- [x] 内容事实修正：兔子主食青草青菜、狗改吃肉（骨头对狗有风险）、龙虾煮熟才变红、闪电成因、犀牛角成分、企鹅分布、蝌蚪由卵孵化、「二个」→「两个」、「十朵彩花」。
- [x] 工程：`package.json` 新增 `preview-check`；CI 在 build 前跑 `check:counts`；交互检查 20 → **24 项**。

## 会话 19（2026-10-22）— R2：家长报告 / 精准续学 / 挑战个性化

- [x] 新增家长报告页 `/parent`：今日任务、累计星星、连续打卡、近 7 天逐日学习/得星/闯关、10 个栏目完成度、最近答错题与内容入口；只读本机 `localStorage`，不上传任何信息。
- [x] 报告页清空学习记录：两步确认 + `role="status"` 提示；`reset()` 同时清空最近条目、按天历史、错题和旧版 `kids-edu-last`。
- [x] `useProgress` 升级到 schema v3：新增 `last`（最近条目）、`history`（按天统计，保留 14 天）、`wrong`（每栏目最多 20 条）；坏数据逐字段校验，旧 v2 数据把今天补进历史。
- [x] 首页「继续学习」从「只回栏目」升级为直达最近条目：`?open=<id>`；10 个栏目统一 `useResume`（安静书直接定位到上次页码），打开后清掉参数。
- [x] 路由 `afterEach` 对「同路径只改 query」不再重设标题/抢焦点，避免续学打开弹层后焦点被拉回 `main`。
- [x] 挑战个性化：出题优先未学条目，其次曾答错条目（每次最多 2 道复习题）；题库在同一答案连续出现时顺延，降低惯性点击。
- [x] 错题本落地：`QuizDialog` 答错写入所属栏目、答对自动移出；家长页按栏目展示最近 5 道，点一下回到对应内容。
- [x] 栏目元数据抽到 `src/data/categories.ts`，首页与报告页共用；`check:counts` 改为校验该文件，保持懒加载边界。
- [x] 工程：交互检查 24 → **29 项**（续学直达与参数清理、安静书续到上次页码、家长页统计/错题入口、错题优先出题、两步清空）。

## 会话 20（2026-10-22）— R3：年龄分层 / 内容治理 / 拼音与数学加强

- [x] 新增 `src/data/ages.ts`：3–4 岁 / 5–6 岁标注与统一筛选文案；有分组的栏目按 category/group 标注，无分组的栏目用 `older` 列进阶条目，其余默认 3–4 岁。
- [x] 10 个栏目全部接入年龄筛选（默认「全部年龄」）：学情工具条新增年龄 chips；安静书按年龄段过滤书页并保留原书页码；挑战题库跟随当前年龄段。
- [x] `check:counts` 扩展为「数量 + 年龄」双校验：用 TypeScript 转译后读取真实数据，检查每个栏目同时覆盖两个年龄段、`older` id 与 `byGroup` 分组都存在。
- [x] 拼音 63 → **75 项**：新增声调 4 项（bā/bá/bǎ/bà）与易混声母 8 项（b/p、d/t、g/k、j/q、zh/z、ch/c、sh/s、n/l）；新增拼音小挑战，TTS 念汉字呼读音、选项显示拼音。
- [x] 识字 44 → **48 字**（车/饭/衣/灯，生活场景词）；修正 4 个「组词不含目标字」的问题（二/口/目/人），如「两个→二月」「嘴巴→口水」「眼睛→目光」「小朋友→好人」。
- [x] 数学趣味练习从 10 以内扩展到 **20 以内加减法**；答错自动补分步思路，新增「提示」按钮（先凑十 / 往回数）。
- [x] 知识百科「兔子」修正：胡萝卜糖分高，只能当少量点心，主食仍是青草青菜。
- [x] 新增 `docs/content-audit.md`：抽检条目、复核结论、依据口径、年龄标注抽检与复检日期（2027-01-22）。
- [x] 栏目元数据同步：拼音 75 / 识字 48；README 补充年龄标注与内容复核流程。
- [x] 工程：交互检查 29 → **32 项**（数学/拼音/安静书年龄筛选、拼音声调与易混分组、数学分步提示）；家长报告总进度与栏目分母改为从 `categories.ts` 动态读取。

## 测试结果
- 会话 20：`npm run build`（vue-tsc -b && vite build）通过，93 modules，PWA precache 35 条目。
- 会话 20：`npm run check:counts` **10/10 数量一致 + 10/10 年龄双段覆盖**（百科 34/10、脑筋急转弯 26/14、唐诗 17/15、识字 30/18、数学 10/11、动物 35/15、安静书 6/3、绘本 4/6、拼音 27/48、歌谣 5/4）。
- 会话 20：`npm run preview-check` **4/4 通过**（首页 10 卡、标题、SW、零错误）；`preview-check pinyin "声调"`、`hanzi "常用字"`、`math "趣味练习"` 均通过。
- 会话 20：`npm run check:interactions` **32/32 通过**，控制台零错误；新增年龄筛选、拼音分组、数学提示断言。
- 会话 20：源码 grep `*.vue` 硬编码 hex = **0**。
- 会话 19：`npm run build`（vue-tsc -b && vite build）通过，91 modules，PWA precache 35 条目。
- 会话 19：`npm run check:counts` **10/10 一致**。
- 会话 19：`npm run preview-check` **4/4 通过**（首页 10 卡、标题、SW、零错误）；`preview-check parent "今天学得怎么样"` 通过。
- 会话 19：`npm run check:interactions` **29/29 通过**，控制台零错误；新增续学直达、安静书续页、家长报告、错题入口、个性化出题、两步清空。
- 会话 19：源码 grep `*.vue` 硬编码 hex = **0**。
- 会话 18：`npm run build`（vue-tsc -b && vite build）通过，PWA precache 33 条目。
- 会话 18：`npm run check:counts` **10/10 一致**。
- 会话 18：`npm run preview-check` **4/4 通过** —— 首页 10 卡、标题「宝宝乐园 - 幼儿教育有声乐园」、SW 已注册、控制台零错误。
- 会话 18：`npm run check:interactions` **24/24 通过**，控制台零错误；新增静音禁用/不泄露答案、答错揭示门禁、横幅已得星状态、路由标题与焦点、未知地址、脏数据容错与角标截断、body 滚动锁、第 9 页页码。
- 会话 18：源码 grep `*.vue` 硬编码 hex = **0**。
- 会话 18 记录：生产 GitHub Pages 仍停在 `ad462be`；`dev` 推送后由 EdgeOne 自动部署，需另行确认线上版本。
- 会话 17：`npm run build`（vue-tsc -b && vite build）通过，PWA precache 33 条目。
- 会话 17：`npm run check:counts` **10/10 一致**（tangshi 32 / stories 10 / math 21 / animals 50）。
- 会话 17：preview-check **4/4 通过** —— 首页（10 卡 + SW）+ tangshi「望洞庭」/ stories「小壁虎借尾巴」/ brainteasers「今日小挑战」；各页 SW 已注册、控制台零错误。
- 会话 17：`npm run check:interactions` **20/20 通过**，控制台零错误；含脑筋急转弯谜面/3 选项、静音题目文字、答错回顾条数。
- 会话 17：源码 grep `*.vue` 硬编码 hex = **0**；10 个数据文件 id 无重复。
- 会话 16 补充：`npm run build`（vue-tsc -b && vite build）通过，86 modules，834ms；PWA precache 33 条目。
- 会话 16 补充：`npm run check:counts` **10/10 一致**（tangshi 28 / math 21 / animals 50）。
- 会话 16 补充：preview-check **5/5 通过** —— 首页 + stories「小马过河」/ math「二十」/ animals「海象」/ tangshi「所见」；各页 SW 已注册、控制台零错误。
- 会话 16 补充：`npm run check:interactions` **18/18 通过**，控制台零错误；滚动复位、焦点循环、数学筛选、老牛配图均由真实浏览器断言。
- 会话 16 补充：源码 grep `*.vue` 硬编码 hex = **0**。
- 会话 16：`npm run build`（vue-tsc -b && vite build）通过，86 modules，3.62s；PWA precache 32 条目。
- 会话 16：`npm run check:counts` **10/10 全部一致**（encyclopedia 44 / brainteasers 40 / hanzi 44 / animals 44 / stories 9）。
- 会话 16：preview-check **6/6 通过** —— 首页（10 卡 + SW + 0 错误）+ encyclopedia「蒲公英」/ brainteasers「五根手指」/ hanzi「yún」/ animals「犀牛」/ stories「拔萝卜」（各页 SW 已注册、控制台零错误）。
- 会话 16：`npm run check:interactions` **14/14 通过**，覆盖安静书 7 项、小挑战、数学 2 项、歌谣 2 项、语音接力、PWA 离线；控制台零错误。
- 会话 13（`node-test/06-database-ts`）：`tsc -p 06-database-ts --noEmit` **零错误**，17 个文件全部参与检查（用 `--listFiles` 核实，不是「一个文件都没匹配所以静默通过」）；干净重建 `dist/` 通过（16 个 js）。
- 会话 13 **JS ↔ TS 行为对照（最强的一项）**：两版**各连独立测试库**（`node-test-parity-{js,ts}`，跑完已 drop），喂完全相同的 **27 步**请求序列——登录/建改删全流程、无 token 401、伪 token 401、归属 403、`done=1` 400、非法 ObjectId 400、非法 JSON 400、重名 409、密码过短 400、查不存在的 id 404——**27/27 状态码与响应体完全一致，0 条差异**（id/token/时间戳已掩码）。
- 会话 13 **阳性对照（关键）**：用一个临时探针文件确认 tsc **真的会报错**，而不是静默放行——`req.user.id` 未登录 → TS18048；信封拼错 `sucess` → TS2561；`query.titel` → TS2339；`PublicTask` 漏 `updatedAt` → TS2741。
- 会话 13 阳性对照**反推翻了 2 条我原本写进注释的断言**（`find({titel})` 不报错、错误中间件少参数不报错），两条注释已按实测改写。**「编译器没报错」和「代码是对的」是两回事，只有阳性对照能区分。**
- 会话 12：`npm run build`（vue-tsc -b && vite build）通过，901ms；PWA precache 32 条目。新增共享 chunk `filter-*.js` 1.77KB（gzip 1.01）——7 个视图复用同一份 `groupBy`/`applyFilter`，抽象落成了真实的共享产物。
- 会话 12 逐页实测（headless Chrome + CDP）：**7 页全绿** —— animals / pinyin / encyclopedia / hanzi / nursery / tangshi / brainteasers，均为「路由渲染 ✓ + Service Worker 已注册 ✓ + 控制台零错误 ✓」。
- 会话 11：`npm run build`（vue-tsc -b && vite build）通过，1.90s；PWA precache 32 条目；vite preview 冒烟 200。
- 会话 8：`npm run build`（vue-tsc -b && vite build）通过，约 3.5s；PWA precache 27 条目；vite preview 冒烟首页 / 标题均 200/正常。
- 会话 8 新增 22 个内容 id 已用 node 脚本在 6 个改动文件内复核：全部唯一（计数 36/32/36/36/24/7）；TS 类型 `vue-tsc -b` 全量校验通过。
- 会话 7 内容扩充验证：`npm run build`（vue-tsc -b && vite build）通过，约 3.9s；vite preview 冒烟 index / vendor / index.css / manifest 均 200。

- `npm run build`（vue-tsc -b && vite build）：通过，68 modules；PWA precache 27 条目。
- 会话 6 语音交互实测（headless Chrome + CDP）：点「点我开始」→ 解锁 + 逐句接力朗读无异常；语音设置弹层 7 个中文音色 chips 正常列出；Esc 关闭；**控制台零错误**。
- 会话 6 内容扩充实测：首页 8 卡冒烟 ✓；百科「蚂蚁」、脑筋急转弯「越削越短」、识字「五」、动物「袋鼠」、绘本「狼来了」5 页抽查全 ✓；SW 已注册、控制台零错误。
- `npm run build`（vue-tsc -b && vite build）：通过，68 modules；PWA precache 27 条目。
- 会话 5 内容扩充实测：首页 8 卡冒烟 ✓；百科「兔子」、脑筋急转弯「拍在石头上」、识字「火」、动物「鹦鹉」、绘本「龟兔赛跑」5 页抽查全 ✓；SW 已注册、控制台零错误。
- 首屏 gzip ≈ 49KB（vendor 39 + index 6.1 + css 3.5）；拼音 chunk 独立懒加载（3.1KB gzip）。
- headless Chrome CDP 实测：SW 注册 `swRegistered:true`、manifest/apple-icon link 就位、控制台 0 错误、弹层 Esc 关闭。
- 语音设置持久化实测：`localStorage['kids-edu-speech']` = `{"voiceURI":null,"rate":1}`（点「稍快」后）。
- 源码 grep：`*.vue` 内 0 处硬编码 hex（令牌化完整）。

## web-design-guidelines 审查结果（Vercel 最新规范，2026-08-17 拉取）
审查文件：index.html、src/App.vue、src/assets/main.css、src/components/{AppIcon,BigCard,SoundToggle,AudioPlayer,DetailDialog}.vue、src/views/{Home,Encyclopedia,BrainTeasers,Tangshi}View.vue

发现并已修复：
- src/App.vue:20 - 跳过链接 `href="#main"` 会与 hash 路由冲突 → `@click.prevent` + 程序化 focus/scrollIntoView
- src/assets/main.css:.detail-card:focus - `outline:none` 无替代（反模式）→ 删除该规则（容器 tabindex=-1 非 tab 停靠点）
- src/assets/main.css:.detail-card - 缺 `overscroll-behavior: contain` → 已加
- src/assets/main.css:.big-card/.btn - 缺 hover 态 → 加 `filter: brightness(1.06)` / 上移
- index.html:11 - theme-color 与页面背景不符 → `#bde4ff`
- src/assets/main.css:--tone-* - 白字 on 渐变浅端仅 ~1.8-2.5:1 → 加深为 600/700 档，大字号白字 ≥3:1
- src/assets/main.css:.card-subtitle - 18px 普通字需 4.5:1 不满足 → 19px bold（大字号，3:1）

复查通过项（无改动）：icon-only 按钮均有 aria-label；SVG/装饰 emoji aria-hidden；无 `<div onClick>`（均 button）；无 `transition: all`；动画只 transform/opacity；prefers-reduced-motion 兜底；heading h1→h2 无跳级；无 `<img>` 无 CLS 风险；无表单输入。

## 错误记录
| 错误 | 尝试 | 解决 |
| --- | --- | --- |
| 预览启动报「dist 不存在」 | 后台 npm run preview | 后台任务 cwd 未继承；改用 npx vite preview + Set-Location 显式目录 |
| `npm run preview -- --port 4318` 把 4318 当位置参数 | 重试 | 直接 `npx vite preview --port 4318` |
| raw.githubusercontent.com 拉取规范超时/被 WebFetch 拦截 | curl 重试 3 次（2min 超时） | 改走 `api.github.com/.../contents/command.md`（Accept: raw）成功（6.9KB） |
| `TS2459: 'AnimalItem' declares locally, but it is not exported` | 把 interface 改成 `import type` | 只改了一半：忘了 re-export，补 `export type` 恢复对外契约 |
| `TS2741: Property 'category' is missing ... but required in type 'BrainTeaser'` | 把 `category` 提到 `ContentItem` | 10 个栏目里 4 个没有分组字段；`ContentItem` 收窄为 `{ id, emoji }` |
| `TS1005: '?' expected`（utils/index.ts 第 45 行） | — | 在**注解位置**误用了条件类型语法。语法错误会**遮蔽整个文件全部语义错误**——这是"编译器突然不说话了"的典型原因，先修语法再看类型 |
| 分组视图筛选后整页空白 | `groupBy` 返回 `Map` | 模板用 `v-if="x.length"`，而 `Map` 只有 `.size` 没有 `.length`（实测 `Map.length === undefined`）。**`vue-tsc` 不报、首页冒烟也不报**——只有真跑那个筛选才现形。改为返回 `[T[K], T[]][]` |
| `preview-check` 连续 3 次失败（Chrome 崩溃 dump / CDP 非 101 / vite preview 未就绪） | 原样重试 3 次 | **非页面缺陷**：脚本收尾的 `chrome.kill()` 在 Windows 只杀父进程，Chrome 子进程树（renderer/gpu/crashpad）全部残留，累积 **55 个僵尸 Chrome** 耗尽资源。清理后一次通过。**待修**：改用 `taskkill /pid <pid> /T /F` 杀整棵进程树 |
| 同一处重复逻辑漏数 | grep 关键词 | 报"4 个视图"，实际 **5 个** —— 第 5 个（NurseryRhymesView）变量名叫 `groups`/`r` 而非 `categories`/`item`，机械搜索漏掉了。**命名不一致会藏住重复** |
| 把没验过的断言写进了代码注释 | 用临时 tsc 探针文件逐条复验 | 6 条探针里 **2 条被推翻**：`TaskModel.find({titel})` 其实**不报错**（Mongoose 对未知键宽容）、错误中间件少第 4 个参数其实**不报错**。两条注释已按实测改写。**注释里的假话比没有注释更糟** |
| tsc 首次全绿，怀疑它压根没在干活 | `--listFiles` 核实 17 个文件参与检查 + 注入错误做阳性对照 | 编译器确实在工作、代码确实零错误。**"没报错"必须先证明"它会报错"才有意义**，否则分不清「没问题」和「没检查」 |
| 口试时给「听起来合理的错理由」而不是说不知道（会话 14，Q2/Q3 各一次） | 点破后能复述，但当场标记 ⚠️ 而非放过 | Q2 答「import 可以统一管理」、Q3 答循环论证。**错理由比空白危险**：面试时会自信讲错且收不到反馈。对策——先自问「这是**作者**的理由，还是**我猜**的理由？」，答不出就说不知道 |
| `rollDay` 置 1 在 Q1 答对过，10 分钟后复述说成置 0（会话 14） | 未当场纠正，改用「隔天独立复述」作最终判定 | **答对过 ≠ 记住了**，当场答对可能只是短期记忆还在。口试只做初筛，固化靠隔天复验 + 手写清单 |
| 交互脚本点「学过」却点了「没学过」 | 断言「21 → 1 张」失败 | `clickText` 用 `includes` 子串匹配，「没学过」先命中 | 改为按 `.chip-btn` 索引点击（0 全部 / 1 没学过 / 2 学过）。**子串匹配用于筛选项会点错，筛选类按钮应精确匹配或按索引** |
