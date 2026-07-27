# 烤个梨呀首页 · Taste Design Brief

版本：v0.1  
日期：2026-07-27  
状态：方向探索稿（`NOT_IMPLEMENTATION_REFERENCE` 可演进为 handoff）  
上游：`2026-07-27-roast-pear-product-design-and-technical-plan.md` · `2026-07-25-adeptify-ecosystem-business-plan.md`  
Skill：`design-taste-frontend` + 产品视觉约束

---

## Design Read

Reading this as: **greenfield creator-community homepage** for Chinese Makers / Builders / early users, with a **comic-portrait + indie-magazine + open-studio** language, leaning toward **custom token CSS + asymmetric editorial layout** (not SaaS landing, not AI purple, not product-catalog Steam clone).

## Taste Scenario

- 主场景：Brand / Marketing / Public Website（社区首页）
- 辅助场景：Visual Companion（真实图 + 漫画头像系统）
- 本轮读取：taste-skill §0-9、§14；产品计划 §5.1 / §8；场景库 Brand 段
- 不适用：工作台 density 规则、ops console、Serene Companion 全套槽位
- 产品旋钮（计划已给定，覆盖 taste 默认 8/6/4）：

| 旋钮 | 值 | 理由 |
|---|---|---|
| `DESIGN_VARIANCE` | **8** | 杂志式非对称，人物与作品可重叠关联 |
| `MOTION_INTENSITY` | **5** | 进入、hover 关联、状态反馈；无滚动劫持 |
| `VISUAL_DENSITY` | **5** | 策展感留白，但信息足够扫描 |

## Brand Spine

| 项 | 决策 |
|---|---|
| 品类 | AI 创作者与作品社区（不是目录、不是 Steam 克隆） |
| 受众 | Maker / Builder / 想体验真实 AI 作品的用户 / 开发者 |
| 承诺 | 认识做东西的人，体验正在长大的作品 |
| 文化位置 | 开放工作室 + 独立杂志 + 漫画人物识别 |
| 隐喻 | 烤梨：慢火、过程、热气、可分享；不是速成清单 |
| 避免 | AI 紫渐变、玻璃卡片墙、三等分功能卡、排行榜叙事、假截图 |

## Palette Lock（梨黄锁定）

| Token | Light | Dark | 用途 |
|---|---|---|---|
| `--paper` | `#F2F3F0` | `#141612` | 页面底（冷中性，避开 craft-beige 默认） |
| `--surface` | `#FFFFFF` | `#1C1F1A` | 卡片 / 抬升 |
| `--ink` | `#171A15` | `#EDEEEA` | 正文 |
| `--ink-soft` | `#4A4F48` | `#A8ADA4` | 次级 |
| `--muted` | `#7A8078` | `#7C827A` | 辅助 |
| `--line` | `rgba(23,26,21,.09)` | `rgba(237,238,234,.10)` | 分隔 |
| `--accent` | `#D4A12A` | `#E0B03A` | **唯一品牌强调：梨黄** |
| `--accent-ink` | `#171A15` | `#141612` | 梨黄按钮上的字 |
| `--leaf` | `#5F7D3B` | `#8FB05C` | 仅语义状态（可体验 / 成功），非整站第二强调 |

**Shape lock：** 卡片 14px · 按钮 10px · 头像圆角方 16px · 不胶囊整站。

**Type lock：**

- 中文显示 / 正文：系统 `PingFang SC` / `Noto Sans SC` / `system-ui`（清楚有人味）
- 拉丁标题强调：`Outfit`（几何无衬线，非 Inter）
- 数字 / meta / 代码：`IBM Plex Mono`

## Signature Element（页内唯一强记忆点）

**漫画工作台 Hero：** 左文案 + 右工作室静物与可交互漫画肖像叠层；hover 人物时点亮关联作品浮签。整页其他 section 保持克制，不与 Hero 抢戏。

## Section Rhythm（布局家族不重复）

| # | Section | 布局家族 | 任务 |
|---|---|---|---|
| 1 | Nav | sticky single-line | 定位与登录 |
| 2 | Hero | asymmetric split + floating portraits | hook |
| 3 | Cognia | full-bleed editorial feature | proof / flagship |
| 4 | 正在烤 | horizontal magazine strip | educate / live |
| 5 | 创作者 | large portrait rail（非等分三列） | people |
| 6 | 作品 | irregular bento | convert use |
| 7 | 讨论 | dense community list | social proof of real talk |
| 8 | 工具架 | tool shelf row | developer path |
| 9 | 加入 | solid accent band | convert join |
| 10 | Footer | sparse columns | utility |

Eyebrow 配额：10 section → max 4；本稿实际使用 **2**（Hero 无 eyebrow；「正在烤」「工具架」各 1）。

## CTA Intent Map（一 intent 一 label）

| Intent | Label |
|---|---|
| 逛作品 | 逛逛作品 |
| 看人 | 看看谁在做 |
| 体验 Cognia | 开始体验 |
| 注册 | 注册参与 |
| Builder 入驻 | 申请成为 Builder |
| 登录 | 登录 |

## Copy Rules

- 产品文案优先用计划书原句，不编造 Maker 职位与人格标签
- 成熟度词用真实词：Recruiting / Testable / Public Beta / Stable…
- 禁止 em-dash；禁止 Elevate / Seamless / Next-gen
- Mock 内容以 `data-mock="true"` 标注

## Anti-Slop Checklist（本稿自检）

- [x] 无 AI 紫 / mesh / 玻璃墙
- [x] 无三等分功能卡
- [x] 无 section 编号 eyebrow
- [x] 无 scroll cue / weather strip / version footer
- [x] 无 div 假截图（真实生成图 + 漫画头像参考）
- [x] 无 em-dash
- [x] 主题整页锁定（light 默认，支持 dark tokens + 切换）
- [x] reduced-motion 可降级
- [x] Hero 首屏可见 CTA

## Deliverables

| 文件 | 说明 |
|---|---|
| `prototype.html` | 可交互高保真首页 |
| `assets/*` | Hero / Cognia / 作品封面 / 漫画头像参考 |
| `design-brief.md` | 本文 |
| `design-handoff.md` | 工程 handoff 摘要 |

## Open Questions

1. 品牌强调最终锁梨黄还是梨绿？（本稿先锁梨黄）
2. 五位 Maker 正式头像与一句话介绍上线前需真实素材替换
3. Cognia / 作品截图应用产品真实 UI 替换生成静物
4. 是否在 V1 首页保留「工具架」完整三件，或只露出入口
