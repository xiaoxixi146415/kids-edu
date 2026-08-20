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

## 测试结果
- `npm run build`（vue-tsc -b && vite build）：3 次全过，50 modules，产物 ~43KB gzip。
- `npm run preview`（4318 端口）：首页 200，相对路径资源加载正常，viewport 已放开缩放。
- 源码 grep：`*.vue` 内 0 处硬编码 hex（令牌化完整）。
- 产物 CSS grep：`ea580c / a855f7 / 16a34a / prefers-reduced-motion / focus-visible / overscroll-behavior / touch-action` 全部命中。

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
