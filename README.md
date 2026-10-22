# 🦉 宝宝乐园 · 幼儿教育有声乐园

专为幼儿（不识字的小朋友）设计的有声教育小应用。点一点，就会朗读出来。

包含十大栏目：

| 栏目 | 说明 | 演示 |
| --- | --- | --- |
| 📖 **知识百科** | 动物、自然的趣味小知识，点开自动朗读 | 太阳为什么发光？ |
| 🤔 **脑筋急转弯** | 先读题目，点「揭晓答案」再读答案 | 什么东西越洗越脏？ |
| 📜 **唐诗** | 经典唐诗 + 白话译文，读古诗 / 听译文 | 静夜思、春晓、咏鹅…… |
| ✏️ **识字认字** | 大字形 + 拼音 + 组词，认一认汉字 | 一、日、山、水…… |
| 🔢 **数学启蒙** | 数字认知 + 数一数/20 以内加减法趣味练习 | 0-20 数字、3 选 1 练习 + 分步提示 |
| 🦁 **动物乐园** | 认识动物，听叫声和讲解 | 大象、老虎、海豚…… |
| 📚 **绘本故事** | 逐页翻读的有声小故事 | 小马过河、龟兔赛跑…… |
| 🔤 **拼音乐园** | 声母、韵母、整体认读、声调与易混对比 | b、a、zh、yi、bā bá bǎ bà…… |
| 📖 **安静书** | 电子机关书，点一点玩法合集 | 数一数、找不同、谁不见了…… |
| 🎵 **儿童歌谣** | 逐句动画童谣剧场，连唱一遍自动翻句 | 小星星、两只老虎、拔萝卜…… |

语音方案：浏览器内置语音（Web Speech API），**免费、无后端、无 API Key**，慢速朗读方便幼儿跟读。

**PWA**：支持安装到主屏、完全离线可玩，可设置音色与语速（顶栏 ⚙️ 齿轮）。

## 家长报告

首页底部「家长看这里 · 学习报告」进入 `/parent`，只读本机记录，不上传任何信息：

- 今日任务、累计星星、连续打卡；近 7 天学习 / 得星 / 闯关逐日统计
- 近 7 天趋势图（学习条数 + 得星）与 10 个栏目完成度
- 7 枚成长徽章：第一颗星、小书虫、博学小达人、坚持三天、坚持一周、全能小玩家、闯关小达人
- 最近答错的题，点一下回到对应内容再看一遍
- 「复制本周小结」导出纯文本周报；浏览器不允许剪贴板时自动展开文字版手动复制
- 两步确认清空学习记录（星星、打卡、错题、徽章一并归零）

徽章与周报都只使用本机 `localStorage` 的统计，不引入账号、云同步或任何上报。

## 部署到 GitHub Pages（当前方案）

免费、永久、**免备案免实名**，推送即自动重新部署；手机「添加到主屏幕」装成 PWA 后可完全离线使用。

**访问地址**：`https://xiaoxixi146415.github.io/kids-edu/`

### 日常更新

工作分支是 `master`，部署分支是 `main`：

```bash
git push origin master          # 推 Gitee 留档
git push github master:main     # 推 GitHub → 自动部署
```

推送后 GitHub Actions（`.github/workflows/deploy.yml`）自动执行 `npm ci && npm run build` 并部署到 Pages，无需手动操作；已安装 PWA 的用户下次打开自动更新。

### 首次搭建（新仓库时）

1. 建公开仓库并加远程：`gh repo create kids-edu --public --source=. --remote github`
2. 仓库 **Settings → Pages** → Source 选 **GitHub Actions**
3. 推送：`git push github master:main`

> ⚠️ 不要用 `git push github main`——本地 `main` 分支停在旧版本会推错，务必写 `master:main`。

## 一键部署到 EdgeOne Pages

[![Deploy with EdgeOne Makers](https://cdnstatic.tencentcs.com/edgeone/pages/deploy.svg)](https://edgeone.ai/pages/new?repository-url=https://github.com/your-name/kids-edu)

> ⚠️ 点击前请先把上面链接里的 `your-name/kids-edu` 换成你自己的 GitHub 仓库地址。

### 方式 A：从 GitHub 一键部署（推荐）

1. 把本项目推到 GitHub：
   ```bash
   git init
   git add .
   git commit -m "init"
   git remote add origin https://github.com/你的账号/kids-edu.git
   git push -u origin main
   ```
2. 点击上方**部署按钮**（或打开腾讯云 EdgeOne 控制台 → **Pages** → **创建项目** → 导入 Git 仓库）。
3. EdgeOne 自动识别 Vite 构建（构建命令 `npm run build`，输出目录 `dist`），点击「立即创建」即部署完成。
4. 以后每次 `git push`，都会自动重新部署。

### 方式 B：从 Gitee 部署（无需 GitHub）

EdgeOne Pages 同样支持 Gitee：

1. 把本项目推到 Gitee 仓库：
   ```bash
   git init
   git add .
   git commit -m "init"
   git remote add origin https://gitee.com/你的账号/kids-edu.git
   git push -u origin main
   ```
2. 打开腾讯云 EdgeOne 控制台 → **Pages** → **创建项目** → **导入 Git 仓库**。
3. 点击 **Gitee**，完成账号授权（建议选择「授权所有仓库」）。
4. 选择刚才的仓库，配置：
   - 项目名称：如 `kids-edu`
   - 加速区域：**全球可用区**
   - 构建命令：`npm run build`，输出目录：`dist`
5. 点击「开始部署」，约 1-3 分钟部署完成，会自动生成 `xxx.edgeone.app` 域名（含 HTTPS）。
6. 以后每次 `git push` 到 main 分支，都会自动重新部署。

### 方式 C：用 EdgeOne CLI 直接部署（无需代码仓库）

```bash
npm install -g edgeone
edgeone pages init      # 登录腾讯云账号、选择项目
edgeone pages deploy    # 构建并部署
```

### 部署小贴士

- 公测期免费（含每月 10GB CDN 流量 + 边缘函数调用）。
- 预览域名约 **3 小时**有效；长期使用请在项目设置中绑定自定义域名（需完成备案）。
- 项目已设置相对路径资源（`base: './'`），部署到子路径也能正常加载。

## 本地开发

```bash
npm install
npm run dev        # 本地预览：http://localhost:5173
npm run build      # 产物输出到 dist/
npm run preview    # 本地预览生产包
npm run gen-icons  # 重新生成 PWA 图标（改过 favicon.svg 后运行）
npm run check:counts        # 校验各栏目 total + 每个栏目都有 3–4 岁 / 5–6 岁标注
npm run check:interactions  # headless Chrome 真实点击验证交互（需先 npm run build）
```

> 语音依赖浏览器自带中文语音：电脑 Chrome/Edge 一般自带微软中文音色；手机系统浏览器/微信内置浏览器通常也支持。若听不到声音，先点首页「点我开始」解锁，并检查是否静音了（右上角喇叭图标）。

## 如何扩充内容

所有内容都在 `src/data/` 下，按同样的格式追加即可，无需改代码：

- `encyclopedia.ts` → 知识百科：`{ id, category, emoji, title, text }`
- `brainteasers.ts` → 脑筋急转弯：`{ id, emoji, question, answer }`
- `tangshi.ts` → 唐诗：`{ id, title, author, dynasty, emoji, lines[], meaning }`
- `hanzi.ts` → 识字认字：`{ id, category, emoji, hanzi, pinyin, words[], text }`
- `math.ts` → 数学启蒙：`{ id, emoji, number, cn, count }`
- `animals.ts` → 动物乐园：`{ id, category, emoji, name, sound, fact }`
- `stories.ts` → 绘本故事：`{ id, emoji, title, pages[] }`
- `pinyin.ts` → 拼音乐园：`{ id, group, pinyin, example, emoji, text }`
- `quietbook.ts` → 安静书：`{ id, title, emoji, bg, accent, rounds[] }`（goal 支持 pick-one/pick-all/spot-diff/whats-missing/shadow）
- `nursery.ts` → 儿童歌谣：`{ id, category, emoji, title, lines[]{emoji,text}, tip }`

**年龄段**：各栏目的 3–4 岁 / 5–6 岁标注集中在 `src/data/ages.ts`，不在内容文件里重复写。
有主题分组的栏目按分组标注；没有分组的栏目用 `older` 列出进阶条目，其余默认 3–4 岁。
新增内容后运行 `npm run check:counts`，会检查 id / 分组是否写错、每个栏目是否同时覆盖两个年龄段。

**内容复核**：新增或修改事实性内容后，同步更新 `docs/content-audit.md` 的抽检记录与复检日期。

例如在 `brainteasers.ts` 数组末尾加一条：

```ts
{ id: 'feather', emoji: '🪶', question: '什么东西越轻越好？', answer: '是羽毛，羽毛轻飘飘的。' }
```

## 技术栈

- Vue 3（Composition API + `<script setup>`）+ TypeScript + Vite
- vue-router（hash 模式，静态托管无需服务端配置）
- 语音：Web Speech API（`speechSynthesis`）
