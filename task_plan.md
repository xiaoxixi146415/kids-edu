# kids-edu 重构 · 任务计划（planning-with-files）

> 目标：基于 4 个新装技能（ui-ux-pro-max / web-design-guidelines / planning-with-files / superpowers）重构宝宝乐园，令牌化样式 + 可访问性 + SVG 图标 + 共享弹层。

## 阶段状态

| 阶段 | 内容 | 状态 |
| --- | --- | --- |
| 0 | 规划文件（本文件 + findings + progress + superpowers 计划） | complete |
| 1 | 设计系统与主题令牌化（main.css / index.html） | complete |
| 2 | 组件/视图与可访问性重构（AppIcon / DetailDialog / 三视图 / App） | complete |
| 3 | 构建验证 + web-design-guidelines 审查 + 对比度复核 | complete |

## 关键决策

- 结构性控件改内联 SVG（AppIcon.vue）；内容卡片大 emoji 保留作插画。
- 保留现有配色气质，抽象为语义令牌；渐变加深以满足白字 ≥3:1（大字号）。
- ui-ux-pro-max 的 search.py 需 Python（本机不可用）→ 直接按其 quick-reference 规则执行，不编造搜索结果。
- 内容数据 `src/data/`、路由、`useSpeech.ts` 不改。
- DetailDialog 的可访问名用 `aria-label`（而非计划初稿的 aria-labelledby），避免与可见标题重复播报——等价可访问结果，已记 findings。

## 错误记录

| 错误 | 尝试 | 解决 |
| --- | --- | --- |
| 后台 npm run preview 报「dist 不存在」 | 检查目录（dist 存在） | 后台任务 cwd 未继承 → Set-Location + npx vite preview |
| `npm run preview -- --port` 参数被吞 | 重试 | `npx vite preview --port 4318` |
| GitHub raw 拉规范超时 / WebFetch 拦截 | curl 重试 | `api.github.com/.../contents/command.md`（Accept: raw） |

## 后续可选项（不在本次范围）
- 若用户希望把本次重构推到 Gitee，触发 EdgeOne 自动部署。
- 可将设计令牌补充进 README「如何扩充内容」旁，作为设计规范文档。
