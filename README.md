# 🦉 宝宝乐园 · 幼儿教育有声乐园

专为幼儿（不识字的小朋友）设计的有声教育小应用。点一点，就会朗读出来。

包含八大栏目：

| 栏目 | 说明 | 演示 |
| --- | --- | --- |
| 📖 **知识百科** | 动物、自然的趣味小知识，点开自动朗读 | 大象为什么用鼻子喷水？ |
| 🤔 **脑筋急转弯** | 先读题目，点「揭晓答案」再读答案 | 什么东西越洗越脏？ |
| 📜 **唐诗** | 经典唐诗 + 白话译文，读古诗 / 听译文 | 静夜思、春晓、咏鹅…… |
| ✏️ **识字认字** | 大字形 + 拼音 + 组词，认一认汉字 | 一、日、山、水…… |
| 🔢 **数学启蒙** | 数字认知 + 数一数/加减法趣味练习 | 0-9 数字、3 选 1 练习 |
| 🦁 **动物乐园** | 认识动物，听叫声和讲解 | 大象、老虎、海豚…… |
| 📚 **绘本故事** | 逐页翻读的有声小故事 | 3 篇 4-5 页小故事 |
| 🔤 **拼音乐园** | 声母、韵母、整体认读，认音学词 | b、a、zh、yi…… |

语音方案：浏览器内置语音（Web Speech API），**免费、无后端、无 API Key**，慢速朗读方便幼儿跟读。

**PWA**：支持安装到主屏、完全离线可玩，可设置音色与语速（顶栏 ⚙️ 齿轮）。

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
```

> 语音依赖浏览器自带中文语音：电脑 Chrome/Edge 一般自带微软中文音色；手机系统浏览器/微信内置浏览器通常也支持。若听不到声音，先点首页「点我开始」解锁，并检查是否静音了（右上角喇叭图标）。

## 如何扩充内容

所有内容都在 `src/data/` 下，按同样的格式追加即可，无需改代码：

- `encyclopedia.ts` → 知识百科：`{ id, category, emoji, title, text }`
- `brainteasers.ts` → 脑筋急转弯：`{ id, emoji, question, answer }`
- `tangshi.ts` → 唐诗：`{ id, title, author, dynasty, emoji, lines[], meaning }`
- `hanzi.ts` → 识字认字：`{ id, category, emoji, hanzi, pinyin, words[], text }`
- `math.ts` → 数学启蒙：`{ id, emoji, number, cn, count }`
- `animals.ts` → 动物乐园：`{ id, group, emoji, name, sound, text }`
- `stories.ts` → 绘本故事：`{ id, emoji, title, pages[] }`
- `pinyin.ts` → 拼音乐园：`{ id, group, pinyin, example, emoji, text }`

例如在 `brainteasers.ts` 数组末尾加一条：

```ts
{ id: 'feather', emoji: '🪶', question: '什么东西越轻越好？', answer: '是羽毛，羽毛轻飘飘的。' }
```

## 技术栈

- Vue 3（Composition API + `<script setup>`）+ TypeScript + Vite
- vue-router（hash 模式，静态托管无需服务端配置）
- 语音：Web Speech API（`speechSynthesis`）
