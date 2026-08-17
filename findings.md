# kids-edu 重构 · 研究发现（findings.md）

## 来自 4 个技能的关键规则（已提炼）

### ui-ux-pro-max（quick-reference.md / pro-rules.md）
- Accessibility CRITICAL：文本 ≥4.5:1（大字号文本 3:1）；`focus-visible` 2-4px 环；键盘可达；aria 可访问名；Esc/取消出口；focus 不被遮挡。
- Touch CRITICAL：触达 ≥44×44px、间距 ≥8px、`touch-action: manipulation` 消 300ms 延迟。
- Style HIGH：结构性图标用 SVG 不用 emoji（`no-emoji-icons`）；语义色令牌（`color-semantic`）。
- Layout HIGH：viewport 不禁止缩放（反模式：`user-scalable=no`）。
- Typography/Color MEDIUM：4/8px 间距节奏；一致圆角/阴影层级；动效令牌统一。
- Animation MEDIUM：`prefers-reduced-motion` 下停用动画；动效只做 transform/opacity。

### web-design-guidelines（Vercel，2026-08-17 经 api.github.com 拉取）
- icon-only 按钮需 aria-label；装饰图标 aria-hidden；`<button>` 而非 `<div onClick>`；heading 层级 + skip link；`:focus-visible` 不删 focus；`transition: all` 禁止；overscroll-behavior contain（模态）；hover 态；theme-color 匹配背景；反模式清单（user-scalable=no / outline-none 无替代 / 无维度图片等）。

### planning-with-files / superpowers
- 项目根维护 task_plan/findings/progress；superpowers 计划落盘 docs/superpowers/plans/。

## 对比度审计（WCAG AA）
- `.hint #5a7fa0` on `#e8f7ff` ≈ **3.9:1** → `--color-text-secondary:#3e5f80` ≈ 6.1:1 ✓
- `.poem-author #6b7a6f` on `#eafff4` ≈ 4.2:1 → `--color-text-author:#3f5a4a` ✓
- **白字 on 三个 tone 渐变浅端 ≈ 1.8-2.5:1（原设计，不达标）** → 加深为 Tailwind 600/700：
  - tone-orange `#ea580c→#c2410c`（浅端白字 ≈ 3.5:1）
  - tone-purple `#a855f7→#7e22ce`（浅端 ≈ 3.9:1）
  - tone-green `#16a34a→#15803d`（浅端 ≈ 3.3:1）
  - tone-start `#ea580c→#c2410c`
  - 卡片标题 28px bold、按钮 20px bold = WCAG「大字号文本」→ 3:1 达标；subtitle 提升为 19px bold 使白字只需 3:1。
- `--ink #4a3b2f` on 白 ≈ 11:1 ✓；`.detail-text #5c4a3c` on 浅橙 ✓（保持）。

## web-design-guidelines 审查发现（全部已修复，见 progress.md）
- skip-link `href="#main"` 与 hash 路由冲突 → @click.prevent + 程序化 focus
- `.detail-card:focus{outline:none}`（反模式）→ 删除
- `.detail-card` 缺 overscroll-behavior:contain → 加
- 按钮/卡片缺 hover 态 → 加 brightness/上移
- theme-color 不匹配 → #bde4ff
- 三个 tone 白字对比不足 → 加深（见上）

## 偏差记录
- **no-emoji-icons 例外**：内容卡片/详情的大 emoji（🐘📜🦉…）是本应用面向不识字幼儿的**内容插画**，保留；仅结构性控件图标改 SVG —— 符合用户确认。
- **search.py 不可用**：本机 Python 为商店占位符（exit 49），无法运行 ui-ux-pro-max 搜索；改用其静态规则文档，非编造结果。
- **aria-labelledby → aria-label**：DetailDialog 用 aria-label 提供可访问名，避免与父级可见标题（h2）重复播报；等价的可访问名结果。

## 当前代码审计要点（重构前已确认，均已解决）
- 三处详情弹层裸 div → 抽 DetailDialog.vue（role=dialog / aria-modal / Esc / 焦点归还）。
- 所有 `<button>` 缺 type="button" → 已补。
- viewport user-scalable=no → 已放开。
- 无全局 focus-visible → 已加。
- 动画无 reduced-motion 兜底 → 已加。
- 硬编码 hex/字号/间距/圆角/阴影 → 已令牌化（src/*.vue 0 处 hex）。
