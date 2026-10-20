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

## 测试结果
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
