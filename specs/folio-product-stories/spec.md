# Folio：产品介绍、解决方案与社区

状态：已实现并发布团队预览版本 5；实现及验收于 2026-10-08 完成，2026-10-09 整理最终交付说明。本文件描述最终实现，取代中间版本的设计约定。

## 目标与边界

让访客迅速理解 Molis AI 做什么、产品适合哪些事、如何进入社区或开始合作。视觉基线是用户指定的 Claude Folio 原版：`claude/project-thread-tzu07o` 的 `c8c78934c2775569986f9c9708dfd386676334d4`。

用户没有要求修改的部分保留原样。沿用原版纸面、衬线、巨型刊头、彩色剪纸、滚动叠页与成员交互；不以内容优化为由另换视觉方向。内容调整放在 Folio 专属内容或复用权威内容，不改写其他品牌方向的产品事实。

## 各页最终实现

| 页面 | 保留与恢复 | 已完成的调整 |
| --- | --- | --- |
| 首页 | 原刊头、剪纸入场与指针视差、三张彩色叠页、原成员标题与圆形头像、悬停/键盘/点按便笺、荧光划线与封底 | 首屏直接说明 AI 工作台与桌面工具；改进产品简介和对应演示；系统架构成员排第一、AI 数据产品成员排第二；封底保留合作能力概括与入口 |
| Tool | 原首屏组件与全部 CSS 动画；原文案、对照表、承诺、常用工具与结尾；三层和六场景的排列 | 将原截图换为自动展开的纸面示意；插件展示同一能力在光标旁、右键、拖放、命令条四个入口的使用，支持启停 |
| Work | Folio 的版式、字号层级、色纸、衬线与章节节奏 | 按最新产品介绍重做；呈现目标接续、授权、助理及信息、新项目、插件创作台、Coding 四个次级场景；用纸面与便笺展示工作过程 |
| 解决方案 | Folio 的视觉语言 | 独立页面按「合作如何开始 → 三张场景卡片 → 你最想改善哪段工作」排列；突出业务问题、结果和成熟度，无需点播放 |
| Life / Story | 原详情页源码、文案、样式、插画和交互 | 仅沿用已授权的公共导航链接 |
| 联系 | 原页面与表单逻辑 | 静态预览链接原应用，未触发真实提交 |
| 社区 | 侧边栏合入的新版设计与互动 | 接入同站 `/demos/community`，保留 SVG 实验、Skill 下载和导航；最后一轮视觉恢复未改社区产物 |

Work 的内容依据 `molis-work/docs/product-intro/v1-2026-10-05.md` 和 10 月 7 日 PRODUCT 定位：本地优先的多插件工作台，Goals 是内置插件。介绍覆盖主次场景、差异、能力、边界、当前开发阶段与真实获取方式。

首页回答「做什么、有哪些产品、是谁在做」，引导到产品、社区和合作入口。Tool / Work 详情回答「适合我的哪件事、怎样完成、目前能用什么」。解决方案回答「团队怎样从一个业务问题开始合作」，再链接 Work 与企业合作联系页；具体业务流程不在首页重复展开。

## 动效与实现约束

- 原 Tool 首屏的 9 秒 CSS 时间轴保持原样。新增演示自动循环展开，仅保留轻量进度点、选步和暂停控制；离开视口或切到后台停止推进，减少动态偏好下直接显示完整结果。
- 产品演示标明示意及实际阶段，不执行真实插件、文件、Agent 或外部操作。普通滚动不锁定，手机不缩成不可读的桌面截图。
- `folio.css`、`kit.css`、`art.tsx`、`tool/tool.css` 以及 Life、Story、联系详情源码相对基线未改。原版对照在隔离检出中进行，不向源码树加入历史副本。
- 仓库应用仍是 React / Vinext；不修改数据库、认证、真实联系表单或根目录首页。预览页面保留 `noindex, nofollow`。

## 预览与交付入口

- [Folio 团队预览](https://molis-folio-team-preview.guodawang33.chatgpt.site/demos/brand/folio/)：使用 ChatGPT Sites，按用户要求公开，拿到链接的人可以访问。
- [社区](https://molis-folio-team-preview.guodawang33.chatgpt.site/demos/community/)：与 Folio 在同一站点。
- [原五套品牌方向预览台](https://claude-project-thread-tzu07o-molis-club-production.sparkling-silence-0a49.workers.dev/demos/brand/compare)与[投票页](https://claude-project-thread-tzu07o-molis-club-production.sparkling-silence-0a49.workers.dev/demos/brand/vote)：属于原应用，未迁入静态团队预览；本次找回了入口，当前环境无法核验旧站在线状态。
- [PR #16](https://github.com/molis-ai/molis-club/pull/16)：源分支 `codex/folio-content-motion`，目标分支 `claude/project-thread-tzu07o`，保持草稿，未合并。

团队预览版本 5 对应应用代码提交 `f36d281e24f571aaa9c63ede23bbbb6872ff411a`。通过 `npm run build:folio-preview` 构建并导出到忽略目录 `outputs/folio-deploy/`：包含首页、Tool、Work、解决方案、Life、Story、社区七页，另将站点 `/` 映射为 Folio 首页。保留原路径、图片及下载资源；联系、知识和其他依赖服务端的页面链接原应用，包内不含数据库、用户数据或凭据。

仓库 `.openai/hosting.json` 属于原私有项目；团队公开预览使用独立 Sites 项目 `appgprj_6ac78c16aad481919af139185825dbef`，两者绑定不可混用。本次文档整理不改变已发布页面。

## 验收记录与复现

最终应用提交 `f36d281` 已完成以下检查；文档整理不重跑未受影响的构建与浏览器验收：

- `npm run check`、`npm run build:folio-preview`、修改范围的 `oxlint`、`git diff --check` 通过。
- `tests/folio-browser.mjs` 通过：成员便笺的悬停、点按、键盘与 Esc；原封面及 Tool 动画；三个叠页；新演示循环、暂停、选步与离屏停止；减少动态；插件入口与键盘开关；Work 场景切换和功能展开；解决方案卡片与顺序。
- 六个 Folio 展示页在 1440 / 1024 / 768 / 390 / 360 px 下自动检查，无横向溢出、缺失图片或页面运行错误；社区另做同站路由及手机布局复核。逐页查看桌面与手机画面，并逐段复核首页叠页、Tool 三层/六场景/插件、Work 四个次级场景。
- 在相同尺寸、字体和减少动态设置下，Tool 首屏、Life / Story 的首屏与长页、联系页长页的桌面/手机 PNG 与基线字节相同。社区独立 JS/CSS 产物与版本 4 相同。
- 最后的播放控制语义调整另做桌面/手机布局、暂停与选步复核。此前功能开发阶段的 `npm test`（18 项）和 `npm run test:http` 已通过；HTTP 验收仅使用本地 D1 和忽略的认证配置。

截图证据保存在本地忽略目录 `outputs/folio-review/restoration/`，不随源码提交。浏览器验收使用已有 Playwright / Chromium，不增加应用运行依赖。在启动本地服务后执行：

```bash
PLAYWRIGHT_MODULE=/absolute/path/to/playwright/index.mjs \
CHROMIUM_PATH=/absolute/path/to/chromium \
TEST_ORIGIN=http://localhost:3000 \
node tests/folio-browser.mjs
```

静态导出也可通过本地 HTTP 服务运行，再将 `TEST_ORIGIN` 指向该服务地址。

## 已提交的工作

| 提交 | 内容 |
| --- | --- |
| `d26c807` | Folio 首页、Tool、Work 产品叙事与动态演示初版 |
| `f3accd4` | 前两位团队成员换位 |
| `1b0c507` | 解决方案改为场景卡片，并调整内容顺序 |
| `7e6a4dd` | 合入新版社区并接通同站导航与静态导出 |
| `f36d281` | 按 Claude 原版恢复设计与交互，重新打磨自动演示并完成逐页复核 |

最终界面以本文件和最后一项提交为准。中间版本的平铺履历卡、首页产品选择器和整套桌面模拟界面已移除，不应重新带回。
