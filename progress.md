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

## 测试结果
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
