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

- [ ] 待收尾：`src/utils/filter.ts` 风格清理未完成——仍有 **5 处分号**（第 1/10/22/24/25 行）+ **2 处双引号**（第 24/25 行的 `"todo"` / `"done"`）。项目风格为无分号 + 单引号。其余 4 个新增文件（`types/content.ts`、`types/filter.ts`、`types/index.ts`、`utils/index.ts`）已复核干净。
- 备注：项目**无 ESLint / Prettier / EditorConfig**，代码风格无自动守卫、全靠手工一致；新增文件越多越易漂移。阶段 2 前值得补一个格式化配置（仅记录，不在本阶段做）。

## 测试结果
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
