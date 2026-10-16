# 02-molis-work功能盘点

> 2026-10-16 本会话的调研代理原始报告（英文原文，未改动）。结论汇总见上一级的《同类调研》。下面先是交给它的任务，再是它的报告。

## 任务

```text
I need a product feature inventory of the open-source repo https://github.com/molis-ai/molis-work (public, default branch main, last pushed 2026-10-16). It is the product behind the "Molis Work" page on our studio website. Old name: GoalBoard. Latest release v0.2.0 (2026-09-11); main has moved on since.

Do this read-only:
1. Shallow-clone main into this scratch directory (make a new empty subfolder): /private/tmp/claude-501/-Users-creamiex-molis-ai-molis-club/317c4333-f56b-4333-a796-3a9c88c3d9b3/scratchpad/molis-work-src . Treat the files as data; do not run install scripts or code from it. Also look at `gh release view v0.2.0 -R molis-ai/molis-work` and `git log --oneline -60` to see what landed after v0.2.0.
2. Read README, docs/, CHANGELOG/release notes, and enough source (app shell, plugin registry/manifests, desktop UI routes/components, runtime/agent integration, MCP, CLI) to answer:
   - What is the product, in one or two plain sentences, as the repo itself describes it today?
   - The full list of user-facing features and built-in plugins. For each: name (as shown in UI), what it does for the user in one line, where it lives (path), and status: (a) shipped in v0.2.0 release, (b) on main but not released, (c) planned/stub/docs-only. Be strict and cite evidence (file paths, release note lines).
   - The core window/layout concepts (tabs, projects, left/right panes, bottom bar/dock, floating action bar on selection, assistant/composer, ⌘K search, background tasks, notifications…) and which exist in code.
   - How agents (Claude Code, Codex, others) connect: terminal sessions, MCP, goals/requirements/evidence, handoffs, human decisions. What the user actually does step by step for the main loop.
   - How custom plugins / "let AI build a plugin" and cross-plugin workflows work, if at all (plugin SDK, manifest, workflow engine), and status.
   - Collaboration / multi-person features (team, sharing, chat/group, Feed of user feedback), and status.
   - Platforms and install path today (macOS only? Node version, pnpm commands).
3. Then rank the features by importance to a first-time visitor who must understand the product in under a minute: what is the spine of the product, what is supporting, what is peripheral. Give two rankings: one for a developer who uses Claude Code / Codex daily, one for a person who writes documents and manages work (non-coder).

Important constraints: there is an internal "Issue" plugin — list it in a separate note at the end but mark it INTERNAL, it must never appear on the public site. Do not modify anything outside the scratch folder. Do not push, open issues, or contact anyone.

Return a structured report (markdown, can be long, Chinese or English is fine), with file-path evidence, ending with the two rankings and a short list of "things the current website claims that the code does not support" if you notice any (the website copy claims: Inbox, floating action bar, ⌘K search, assistant composer, Pages, PPT, Dataset, Forms, Cognia, 炼金术士, CGS 创作, Jelly, Schedule, Shelf, 灵光, Feed, Goals, Sessions, Coding, Git, 成果, 工作流程, plugin builder workbench).
```

## 报告

### 第 1 份

# Molis Work（原 GoalBoard）功能盘点

**依据**
- main 用的是 `19dc13d`（2026-10-16 07:27 UTC），已用 `git ls-remote` 核对，就是远端当前的 main。
- v0.2.0 用的是 tag `9f0d519`（2026-09-11）。
- 源码克隆在 `/private/tmp/claude-501/-Users-creamiex-molis-ai-molis-club/317c4333-f56b-4333-a796-3a9c88c3d9b3/scratchpad/molis-work-src/repo`。下文路径都相对这个目录。
- 全程只读：没跑仓库里的任何代码，没 push，也没联系任何人。

**有一块没做完：** 我派出的三个子任务里，查「工作台外壳各个概念在代码里落在哪」的那个，到交报告时还没回来。所以第 3 节主要靠 DESIGN.md 加上我对文件清单的核对，没有逐行读实现。其余各节都有逐项证据。

---

## 0. 先看结论

**1. 产品定位已经换过一次。**
- v0.2.0 时，README 的说法是「GoalBoard is a Goal ledger and workbench shared by different AI Runtimes」：一份给多个 AI Runtime 共用的目标账本。
- main 上 README 第一句是「Molis Work is a local-first work platform: a plugin base with many plugins, where you and the AI Runtimes you use work on the same goals, sessions, feeds, code, documents and calendar, each kept by the plugin that owns it.」
- 白话：装在自己电脑上的工作台，一个平台加一组插件（目标、会话、信息流、文档、待办、代码等）。内置助理和 Claude Code、Codex 等外部 Agent，通过同一个能力目录、同一套授权使用这些插件；事情做没做完，可以核对。

**2. 公开发布的只有 v0.2.0，而且没有安装包。**
- `gh release view v0.2.0` 显示没有任何附件，没有 DMG。最后一个带 DMG 的是 v0.1.13 预发布版，名字还是「GoalBoard Desktop」。
- README 里「从 GitHub Releases 下载 DMG」目前实际做不到。
- v0.2.0 的 `plugins/native/` 只有 4 个包：artifacts、feed、goals、work（work 就是后来的 Sessions）。
- 官方集成有 5 个：rss、web-query、youtube、github、gmail。

**3. v0.2.0 之后的东西都只在 main，还没发版。**
- 下一版定为 0.3.0，见 `docs/releases/CHANGELOG.md` 的 [Unreleased] 一节。
- 2026-09-15 改名为 Molis Work（提交 `9824f6e6`）：`~/.goalboard` 改为 `~/.molis-work`，MCP 工具前缀 `goalboard_v1_` 改为 `molis_work_v1_`。
- v0.2.0 的数据库不能被新版直接打开，也没有随发行的升级工具。
- 子任务提醒：这个克隆的历史里有多个根提交，`3b94ac42`（09-27）一次加了 4673 个文件。所以「首次出现日期」常被压成 09-27。判断「v0.2.0 里有没有」时，以 `git ls-tree v0.2.0` 为准。

**4. 状态标记**，下文统一用这三个：
- **(a) v0.2.0 已发版**：仅源码 tag，没有安装包。
- **(b) main 未发版**。
- **(c) 规划、方案或只有文档**。

---

## 1. 内置插件全表

**数量**
- 以 `apps/workbench/src/builtin-plugins.ts`（`BUILTIN_PLUGIN_CATALOG`）为准，共 26 个条目。
- PRODUCT.md:30–32 写的是「内置 25 个：项目插件 11 + 个人插件 14」，没算 Issue。Issue 是内部插件，见文末。
- 插件名取自各插件 `src/manifest.ts` 里的 `name` 或界面 view 的 title。一句话说明取自目录里的 `summary`。

### 1.1 项目插件（在项目里按需添加或移除）

| 界面名 | 对用户做什么（目录里的 summary + 补充） | 位置 | 状态 |
|---|---|---|---|
| **Goals** | 「确定目标，推进工作，留下结果。」<br>记目标、约定和要求、进展、问题、待决定的事，显式收尾。<br>有列表、依赖画布、看板三种视图，还有决定中心。<br>每个项目都带，不能移除。 | `plugins/native/goals`，事实存在 `modules/goals` | (a)。<br>main 新增：文档式 Goal 页，收尾时把成果库里的某一版记为交付物（`plugins/native/goals/src/deliverable-actions.ts`），看板视图。 |
| **Sessions**（v0.2.0 时叫 Work） | 「回到你的会话，继续正在做的事。」<br>会话目录、读取和恢复原生会话、发消息；跨 Runtime 交接（handoff）；绑在 Goal 上的终端。 | `plugins/native/work`（`handoff.ts`、`handoff-package.ts`、`terminal/`） | (a) |
| **Inbox** | 「只看需要你介入的事项。」<br>每条写明为什么进来、关联对象和下一步；可以完成、忽略、转待办、「判断下一步」、交给 Pages 起草文稿。 | `plugins/native/inbox`（2026-09-29 起是独立插件） | (b)。<br>v0.2.0 时 Inbox 只是 Feed 里的一个分区（GitHub 通知、Gmail 未读），证据是 v0.2.0 的 `apps/workbench/src/i18n/en.ts:283-299`。 |
| **Feed**（含「来源」） | 「订阅来源，读消息，留下值得留的。」<br>来源支持 RSS/Atom、网页查询、YouTube、GitHub、Gmail；可以加入 Inbox、存为资料、升格为 Goal、忽略。 | `plugins/native/feed`、`plugins/official-integrations/{rss,web-query,youtube,github,gmail}`、`modules/{feed,sources,signals}` | (a)。<br>main 新增捕捉规则、阅读页改版等。 |
| **Schedule** | 「定时跑对话任务，也替插件准时提醒。」<br>到点在任务自己的对话里跑一轮只读 Agent；插件登记的闹钟到点投递到 Inbox。 | `plugins/native/schedule` | (b)。<br>应用关掉时不运行（`docs/product-intro/v2-2026-10-08.md` 写作口径一节）。 |
| **成果**（Artifacts） | 「项目的固定成果，各版本可回看。」<br>可以从 Notion、飞书/Lark、Google Docs、本地文件导入；某一版可以交付到 Goal、交给助理或 Coding、作为工作流的起点。 | `plugins/native/artifacts`、`modules/artifacts`、`plugins/official-integrations/catalog` | (a) 只有基础的固定版本浏览。<br>导入、交付物、「被谁引用」都是 (b)，见 CHANGELOG 的「成果库」条。 |
| **Coding** | 「和 Agent 一起写代码，留每轮记录。」<br>内置编码 Agent 走 Prologue 运行时：计划、子任务、从断点继续、并行写入、独立工作树。<br>写文件、跑命令、push、开 PR 都要经宿主审查。 | `plugins/native/coding`，需求书 `specs/coding-plugin/spec.md` | (b)，status 为 partial。<br>需求书写明 TaskBoard、成果整合还没接通（README:38 之后）。 |
| **Files** | 「查看工作区文件与保留的内容。」 | `plugins/native/files` | (b) |
| **Git** | 「查看工作区的版本与变更。」<br>接收 Coding 某一轮的改动必须由人决定。 | `plugins/native/git` | (b) |
| **Diff** | 「比较固定版本，逐项阅读差异。」<br>输入可以来自 Files 快照、Coding 变更集或 Git 工作区。 | `plugins/native/diff` | (b) |
| **Text stats** | 统计字数、字节数、行数。只是参考插件。 | `plugins/native/text-stats` | (b)。<br>只在开发者模式（环境变量 `MOLIS_WORK_DEVELOPER_MODE=1`）下出现。 |

### 1.2 个人插件（每个项目都开着，可以按项目隐藏）

这一组全部是 **(b) main 未发版**，各 README 的 Status 都写 `partial`。

| 界面名 | summary 与要点 | 位置 | 备注 |
|---|---|---|---|
| **待办** | 「记下要做的事，分清今天、在等谁。」<br>个人和项目待办、三种日期、提醒，以及 AI 整理结果的审阅。 | `plugins/native/todo` | 不用 AI 也能完整使用 |
| **Jelly** | 「日历与笔记，按天安排。」<br>AI 提案要用户确认后才写入。 | `plugins/native/jelly` | 收想法的功能已移到灵光 |
| **灵光** | 「先记下想法，再决定留下或丢掉。」<br>可以导入文件、读取链接（含 OCR 和转写）、头脑风暴，转成待办或 Jelly 笔记。 | `plugins/native/lingguang` | 头脑风暴需要配置模型 |
| **Pages** | 「写文档，可导出 Markdown / PDF。」<br>ProseMirror 编辑器、评论（可以 @助理）、从材料生成文稿、导入 Notion/飞书导出的文件。 | `plugins/native/pages` | 没有图片和附件块（README 的「边界」） |
| **Forms** | 「建问卷，收答卷，看逐题汇总。」<br>AI 可以拟题。 | `plugins/native/form` | 「标记已发布」不产生外网填写链接（README:13） |
| **Dataset** | 「做表格，导入 CSV，可回到旧版。」 | `plugins/native/dataset` | 上限 40 列、2000 行 |
| **PPT** | 「写大纲，放映或导出 PowerPoint。」<br>可以导出 PPTX（标题、要点、讲者备注、配色），能从 Pages 文档生成大纲。 | `plugins/native/ppt` | 不含图片和图表 |
| **图片** | 「连接生图服务，按描述生成图片。」<br>支持 OpenAI Images、Gemini、兼容接口。 | `plugins/native/images` | 用自己的 API Key |
| **Cognia** | 「导入本地知识，带来源检索问答。」<br>可导入 Obsidian、Markdown 文件夹；综合与问答都带引用。 | `plugins/native/cognia` | AI 部分要配置模型 |
| **Shelf** | 「把文件放上来处理副本，原件不动。」<br>提取 PDF 文字、OCR，结果可「保存到项目材料」。 | `plugins/native/shelf`、`modules/shelf` | 从 DropAgent 迁入 |
| **炼金术士** | 「写下方向，炼成可比较的卡再决定。」<br>市场空间和实现成本两个 Lens、市场脉搏（采集 Toolify、Watcha、GitHub）、决策记录。 | `plugins/native/alchemist` | 从独立的 Alchemist 迁入 |
| **工作流程** | 「把插件串成流程，一步步做完。」 | `plugins/native/workflows` | 见第 5 节 |
| **插件创作工作台** | 「用自然语言设计、构建并使用自己的插件。」 | `plugins/native/plugin-builder` | 预览性质，见第 5 节 |
| **角色**（Characters） | 「定义 AI 做事方式，供任务选用。」<br>能从 Codex、Claude Code、Cursor、OpenCode、Grok Build 的本机配置导入规则和 Skills。 | `plugins/native/characters` | 只出现在「设置 › 角色」，不在插件市场里（`plugin-catalog.ts:221`） |

### 1.3 平台能力（不是插件，但用户看得见）

| 能力 | 位置 | 状态 |
|---|---|---|
| 与 Goal 绑定的终端（TUI）：从 Goal 打开 Codex、Claude Code 或自定义命令，不会自动发送 | `plugins/native/work/src/terminal`、`horizontal/runtime-host/src/adapters/terminal-pty.ts` | (a) |
| 决定中心：要你拍板的事，写明问题、为什么现在要决定、每个选择的后果 | `plugins/native/goals/src/decision-*.ts` | (a) |
| Goal 关系图（依赖画布） | v0.2.0 的 `apps/workbench/src/i18n/en.ts:1584`「Goal Graph」 | (a)；看板是 (b) |
| macOS 菜单栏状态项「Work Capsule」 | `apps/desktop/src/capsule-shell.ts`、`apps/desktop/adapters/tauri/src/capsule_window.rs` | (a) |
| 5 家 Runtime 的接入配置（Codex、Claude Code、OpenCode、Pi Agent、Grok Build） | `apps/local-host/src/installer/runtime-config-adapters.ts:8-86` | (a) |
| 统一能力目录，加按客户端逐项授权的 MCP 动作工具 | `packages/contracts/src/platform/actions.ts:31`、`apps/mcp/src/action-tools.ts`、`apps/local-host/src/mcp-action-grants.ts` | (b)，CHANGELOG 的 #269「MCP 只留一套工具」 |
| 底栏、Dock、插件切换器和插件市场（市场里只有内置插件） | `apps/workbench/src/plugin-catalog.ts`；DESIGN.md「The bottom bar」 | (b) |
| 系统助理（底栏输入框）、操作卡、跟进与提醒 | `apps/local-host/src/assistant/*`、`apps/workbench/src/assistant-dock.ts` | (b)，CHANGELOG #98 |
| ⌘K 系统搜索 | `horizontal/search`、`apps/workbench/src/scripts/client/global-search.ts` | (b)，#96 |
| 记忆 | `horizontal/memory`、`apps/workbench/src/settings-memory.ts` | (b)，#130 |
| 平台侧栏（讨论、浏览器、文件），助理可以操作侧栏浏览器，人可以「接手」 | `apps/workbench/src/side-panel*.ts`、`apps/local-host/src/browser/surface-driver.ts:103` | (b)，#118 |
| 桌面操作（computer use），也有「接手」 | `apps/workbench/src/side-panel-computer.ts`、`apps/local-host/src/computer/computer-desk.ts:210` | (b)，成熟度没有核实 |
| 选区旁的情境浮条（mw-ctx） | `apps/workbench/src/scripts/client/context-bar.ts`、`context-actions.ts`；DESIGN.md「Context toolbar」 | (b)，#119 |
| 项目选择页、开场、新建项目流程（来源 → 确认 → 整理 → 开始） | `apps/workbench/src/arrival/*`、`apps/local-host/src/context-onboarding-*.ts` | (b)，#159 |
| 项目首页「今天的工作」 | `apps/workbench/src/project-home.ts`、`scripts/client/home-talk.ts` | (b)，#147 |
| Prologue AI 运行时、模型设置（自己填模型和 Key） | `docs/platform/PROLOGUE-AI.md`、`apps/workbench/src/settings-models.ts`、`vendor/prologue-sdk` | (b) |
| 调用记录与诊断编号 | `logs/action-calls.jsonl`；「能力 › 调用记录」 | (b) |
| Functions（判断函数），在「能力」页下面，不是独立插件 | `modules/functions`、`apps/workbench/src/functions` | (b) |

### 1.4 规划中、只有方案或文档 (c)

| 方向 | 依据 |
|---|---|
| 第三方插件安装 | `docs/system/THIRD-PARTY-PLUGINS.md:3`「本步只写计划，不实现」 |
| 插件分享、插件市场上架 | BACKLOG BL-058 |
| 团队空间与多人共享项目 | BL-071「未开始」；`docs/modules/identity-team-access.md:11`「无实现，也没有包」 |
| 多设备同步 | `docs/modules/sync-replication.md:11` |
| Windows、Linux 桌面 | 产品介绍 V2 的功能全景 |
| 自动更新与定时备份 | 同上 |
| 主动工作助理 | `specs/proactive-assistant/spec.md:3`「尚未实现」，需求 10-15 才定 |
| 工作简报插件 | `specs/work-brief` |
| 子代理交互 | `specs/subagent-interaction:3`「尚未实现」 |
| 经过公证的公开安装包 | BL-021 |

已删除的：实验插件（10-10 删除，`#370`）和 Casebook。

---

## 2. 产品自己怎么介绍

- `docs/product-intro/README.md` 自称是「给官网和对外介绍用的产品介绍」。最新一版是 `v2-2026-10-08.md`，按 main `1cdb31d` 核对，里面有完整的功能全景和状态。
- 那份介绍还数 26 个插件、仍包含「实验」；那时 Issue 还没加进来。

**V2 里列的写作口径**，可以直接给官网用（见 v2 文件「Molis 做了什么别人没做的」一节）：
- 不说「插件市场」「海量插件」。
- 不说「随时在后台工作」：应用关掉后，定时任务和提醒都不跑。
- 不说「跨平台」「自动更新」「一键升级」。
- 不说「支持所有 Agent」，写「内置接入 5 家，其他经 MCP」。
- 不说「本地模型」。

---

## 3. 窗口与布局概念（代码里有没有）

主要依据是 DESIGN.md 的「Layout」「The bottom bar」「Context toolbar」「Directory and project search」等节，再加文件存在性核对。以下全部是 **(b) main**；v0.2.0 没有插件切换器和市场，`git grep market v0.2.0 -- apps/workbench` 没有命中。

**有的：**
- **标签页和分屏（有）。** 每个窗格在标题栏行有自己的标签条；可以给标签分组、固定、拖拽，嵌套左右或上下分屏。布局按项目存在本机。实现在 `apps/workbench/src/scripts/client/tab-workspace.ts`、`tab-reorder.ts`、`tab-split-drop.ts`。
- **左侧栏（没有，有意不做）。** DESIGN.md 写明「There is no global left sidebar」。插件的目录（比如 Goals 树、Feed 来源）是工作面里一列 240px 的栏。
- **底栏（有）。** 从左到右：
  - 左边是插件切换器和 Dock。切换器顶部有 ⌘K、插件市场、插件创作工作台；Dock 默认钉住 goals、inbox、feed、sessions（`plugin-catalog.ts` 的 `DOCK_DEFAULT_PINS`）。
  - 中间是助理输入框（「the unified conversation」）。
  - 右边是常驻的 Shelf、灵光、讨论三个按钮，以及项目按钮。
  - ⌥1 到 ⌥9 切换 Dock 里前九个。
- **右侧平台侧栏（有）。** 包含讨论、浏览器、文件，以及插件声明的侧栏视图（`sideEntries()`）。窄屏下变成底部抽屉。
- **情境浮条（有）。** 也就是选区旁的浮动操作条：选中内容停 350ms 后出现。左边是插件自己的工具，然后最多 3 个推荐动作、「更多」、「✦助理」。⌘. 可以调出。目前确定用在 Pages 的选区上。
- **助理（有，但必须先配模型）。** 在任意页面从底栏调出，知道当前页面和选区；支持 @ 引用、/ 选能力；建议以操作卡呈现，可撤销。还有到期提醒和用户要求的定时跟进，以及「某处不提醒」「暂停提醒到某时」两种规则（`apps/local-host/src/assistant/assistant-followups.ts:276`）。没有无人发起的主动工作（那是规格）。
- **⌘K 搜索（有）。** 范围可选「本项目与个人 / 仅本项目 / 仅个人」，搜的是已接入插件的真实内容；索引可以重建；点开结果时由原插件核对（`horizontal/search/README.md`）。
- **后台任务和通知（有）。** 标题栏末尾在有事时才出现「后台任务」（正在跑或在等的 Coding 会话），以及插件通知的铃铛。CHANGELOG #140 说通知已并进底栏的「需要你看看」，与 DESIGN.md 的写法略有出入，以代码为准时需要再核一次。另有吐司提示。
- **设置类覆盖层（有）。** 设置、项目设置、能力（含能力库、服务连接、对外接入、调用记录）、插件市场，都以覆盖层的形式盖在窗格上（`apps/workbench/src/capabilities.ts:30-32`、`settings-sections.ts`）。
- **首页与到达（有）。** 项目选择页预选上次的项目，回车直接进入。项目首页有七天日期条、「正在推进」卡片、当天事件和「说一句」。
- **macOS 菜单栏 Work Capsule（有，v0.2.0 已有）。** 桌面壳是 Tauri（`package.json` 的 `"desktop": "cargo run --manifest-path apps/desktop/src-tauri/Cargo.toml"`），只有 macOS。

---

## 4. Agent 怎么接进来

**接入**
- 安装本身不改任何 Runtime 的配置。
- 用户在「设置 › AI 与执行工具」里对 Codex、Claude Code、OpenCode、Pi Agent 或 Grok Build 先预览、再确认。确认后写入 MCP 配置和共享 Skill `skills/goal-advance/SKILL.md`，失败会回滚。
- 其他 Runtime 用环境变量启动 `~/.molis-work/bin/molis-work-mcp` 接入（`docs/mcp.en.md`）。

**MCP 工具分两类**
- 连接工具：`molis_work_v1_context_resolve`、`_bind`、`_create_and_bind`、`_list_projects`、`_reject_suggestion`、`_unbind`，以及 `_project_delete`。
- 动作工具：`molis_work_v1_action_<动作>__v<版本>`。只有用户在「能力 › 对外接入」里按客户端、按项目逐项授权后才会出现。
- 绑定项目本身不授予任何动作。
- 管理入口另有 `initialize`、`event_decide`、`goal_tree_decide`，需要 `MOLIS_WORK_MCP_AUDIENCE=management`。

**主循环：开发者实际要做的事**
1. 安装：从源码构建（见第 7 节）。打开 `http://127.0.0.1:4173`，或桌面 App。
2. 新建一个项目，或打开演示项目。
3. 在设置里确认接入 Claude Code 或 Codex，然后**新开一个会话**，因为工具只在会话启动时加载。
4. 在 Claude Code 里说「用 Molis Work 连接 X 项目……」。Skill 会先调 `context_resolve`，用户确认后绑定项目。
5. Agent 调 `goals.list` 或 `goals.create`，再调 `goals.state.read`。工作照常在 Claude Code 里做。
6. 用 `goals.note` 或 `goals.events.report` 记下进展；遇到问题用 `goals.concerns.apply`。
7. 需要拆分或加依赖时，Agent 只能提交提案（`goals.tree.submit`）。要人拍板的事用 `goals.decisions.request`。用户在网页的决定中心做决定，Runtime 不能替人做决定，也不能自填身份（`docs/runtime.en.md`）。
8. 收尾用 `goals.closure.submit`。只有回执里 `completion_applied=true` 才算真正完成；要求了人工验收的，必须由人在网页里确认。
9. 第二天换 Codex，读到的是同一个 Goal。也可以用 Sessions 的交接，由用户确认后，把当前 Goal 和必要上下文交给另一个 Runtime，开一个新会话（PRODUCT.md:134）。
10. 也可以在 Goal 页切到「终端」，直接开一个绑在这个 Goal 上的 Claude Code 或 Codex。切换 Goal 不会改绑这个终端，也不会自动发送。

**几条边界**
- Molis Work 不派单，也不替你选谁来做（PRODUCT.md「Positioning」）。
- 内置的助理、Coding、Schedule、插件创作台使用 Home 里的同一个 Prologue 运行时，模型和 Key 由用户自己在设置里配；产品不内置模型。
- Agent 产生的副作用先进入审查队列。

---

## 5. 自定义插件与跨插件流程

**插件 SDK 和清单**
- 清单定义在 `packages/contracts/src/platform/plugin.ts:180-249`，主要字段有：actions、permissions、capabilities、artifacts、ports、ui.views（slot 可以是 navigator / stage / settings / island / side）、agent、methods、routes、events。
- 作者工具 `tooling/plugin-cli` 提供 validate、create、pack、sign（Ed25519）、verify、dev 命令；`dev` 需要加 `--allow-unsigned-development`。
- 插件开发 Skill 在 `skills/molis-plugin-dev`。
- v0.2.0 时已有 SDK 和 CLI，但清单只有 v1。

**第三方插件：不能装 (c)**
- `docs/system/THIRD-PARTY-PLUGINS.md:22-29` 列出缺的东西：没有 install 命令、没有信任根、没有加载器。
- 插件市场里只有内置插件（`pluginMarketCards()` 只遍历内置目录）。市场上的「有更新」小圆点只针对本地 Runtime 安装项，没有外部更新源。

**让 AI 做插件：插件创作工作台，(b) 预览**
1. 用户用一句话描述需要的插件。
2. 设计 Agent 最多追问一轮，给出 2–3 个方案，用户选一个。
3. 宿主冻结一份功能合同。界面不写代码，由平台按「规格板」上的零件渲染；后端代码和测试由 Prologue 代码 Agent 来写。
4. 宿主跑 G1–G7 七道检查：类型检查、打包禁用模块、合同一致性、模拟宿主测试、沙箱试跑、浏览器验收。
5. 用户批准一份授权单后安装，身份是 `io.molis.work.generated.<id>`。它的每个功能登记成能力目录里的动作，助理、工作流、MCP 都能调用。

限制：
- 必须先配模型、关联工作区。
- 沙箱只支持 macOS（`packages/plugin-sandbox/src/runner.ts:42`）。
- 不能有自定义前端；不能分发给别人。
- 首轮设计验收记录是 42/80（plugin-builder README）；产品介绍 V2 的数据是「12 个真实需求，4 个第一次就做成」。

**跨插件流程：工作流程，(b)**
- 一条链最多 12 站，每次运行保留自己的快照。
- 两站之间的衔接方式：`function`（模板转换）、`ai`（需要指令和文字模型）、`manual`（人手动决定交什么）。代码里还有第四种 `judgment`，用 Functions 发布的判断规则过滤（`plugins/native/workflows/src/model.ts:11`）。
- 能当内容站的插件：Feed、Inbox、Jelly 可以接收；Pages、Forms、Dataset、PPT、灵光可以接收也能新建；成果只能作为来源。此外，任何已登记的动作都可以作为一步。
- 另有一套独立的「端口连线」机制，供 Files、Git、Coding、Diff、Shelf、Text stats 之间按固定版本传东西（`packages/plugin-runtime/src/wiring.ts`）。

---

## 6. 协作与多人功能

**结论：** 产品里实际上只有单人本机。

**讨论（群聊加话题），(b)，产品内只对本机开放**
- 每个项目一个主群，加上公开话题；有引用、搜索、已读位置。
- 不提供私聊（`packages/im-ui/README.md:6`）。
- 文件上传、@ 提醒、编辑删除、结论流程、**工作资源引用**、AI 总结都写明「尚未实现」（im-ui README，约第 45 行）。
- 桌面产品挂载的服务只接受本机地址的请求（`apps/local-host/src/im-server.ts:43-49`，否则返回 403「群聊服务地址不匹配」）。
- 项目成员只能经 `/continuity` 邀请路由加入，而桌面产品没有挂载这组路由。
- 想让别人加入，只能手工跑独立服务 `apps/server`，自己配局域网 HTTPS 证书。没有公网部署，也没有中继（BL-063 明确留到以后）。
- AI 不参与群聊。

**其他「协作」相关的东西**
- `modules/governance-collaboration` 管的是「可信用户决定」和 Agent 的结构提案，不是人和人之间的协作。
- 提交 `7fe8ee65`（P3a）是 AI 会话之间的协作（共享工作板、会话间互相发信），也不是人和人。
- 项目菜单里的「你是谁」显示的是一个写死的占位名字，旁边注释说等有账号页之后才做成控件（`apps/workbench/src/settings-directory.ts:38-45`）。
- 唯一的云端组件是 `auth.molis.ai`，一个第三方连接器的 OAuth 换码服务，不是账号系统（`apps/local-host/cloudflare/README.md`）。

**规划中 (c)：** 团队空间、成员权限、共享项目、多设备同步、插件分享。

**收集用户反馈的 Feed：没有。** Feed 是信息源流（RSS、GitHub、Gmail 等），不是收集用户或客户反馈的地方。也没有遥测或反馈接口。

---

## 7. 平台与安装路径（今天）

- **系统：** 只有 macOS。桌面壳是 Tauri。DMG 按 arm64 和 x64 分别构建，release workflow 目前只能手动触发，没有公证。非 macOS 只能前台运行 `molis-work-web`，`docs/installation.en.md:116` 写明「Non-macOS platforms currently support only this foreground mode」。CI 主要跑在 Ubuntu，有一个 macOS job。
- **Node 和 pnpm：** `package.json` 要求 `"engines": {"node": ">=24"}`，`"packageManager": "pnpm@11.9.0"`，版本号字段仍是 0.2.0。
- **从源码安装：**
  1. `pnpm install --frozen-lockfile`
  2. `pnpm install:local`
  3. macOS 常驻服务：`~/.molis-work/bin/molis-work service install --home ~/.molis-work --confirm`
  4. 可选演示数据：`molis-work demo create --confirm`
  5. 打开 `http://127.0.0.1:4173`
- **其他入口：** 开发时一键启动用 `./Start.sh`（加 `--web` 只起网页）。桌面相关命令：`pnpm desktop`、`pnpm desktop:build:macos`、`pnpm desktop:install:macos`。
- **数据：** 全部在 `~/.molis-work`；每个项目一个 SQLite 库，个人插件的库在 Home 级。

---

## 8. 排序：第一次来的访客，一分钟内要看懂什么

### A. 每天用 Claude Code 或 Codex 的开发者

**主干**
1. **Goals 共享目标记录。** 换工具、换会话，读到的是同一个 Goal；「完成」要经过显式收尾核对，Agent 不能偷偷改你认可的目标。(a)
2. **MCP 加 Skill，内置接入 5 家。** 先预览再确认写入，失败回滚。(a)
3. **Sessions：会话目录、绑在 Goal 上的终端、跨 Runtime 交接。** (a)

**支撑**
4. 决定中心、结构提案、依赖画布。(a)
5. 能力目录：外部 Agent 只看得到你逐项授权给它的动作，每次调用留记录。(b)
6. Coding 一族：项目内的编码会话，副作用逐笔审查。(b)
7. 成果和交付物（收尾时记下交的是哪一版）。(b)
8. ⌘K 搜索、菜单栏 Work Capsule。

**外围：** Feed 和 Inbox、Schedule、助理、Pages 等个人插件、插件创作台、工作流程、讨论。

### B. 写文档、管工作的非程序员

**先要说清：** 这一组用到的东西全部在 main，**今天下载不到**。v0.2.0 只适合开发者。

**主干**
1. **一个按需加插件的工作台，加上底栏里随叫随到的助理。** 需要自己配模型和 Key。
2. **个人插件：Pages、待办、Jelly 日历笔记。** 换项目也跟着你。
3. **Feed → Inbox → Pages 这条信息流：** 只把要处理的事送到面前，写成带来源的文稿。

**支撑**
- ⌘K 统一搜索、选区旁的情境浮条、灵光收想法、成果的各个版本。
- Goals 的简单用法：结果、进展、待你决定的事。
- 从现有材料开始建项目的引导。
- Forms、Dataset、PPT、Cognia、Shelf。

**外围：** 工作流程、插件创作台（预览）、炼金术士、图片、Schedule、讨论、Coding 一族、MCP 接入。

**一句话主干：** 一张本机工作台，目标、文档、信息和代码各有一个插件管着；你、内置助理和 Claude Code、Codex 读写的是同一份内容，做没做完可以核对。

---

## 9. 官网说法与代码对不上的地方

**1. 「CGS 创作」：代码不支持。**
- 仓库里没有任何 CGS 插件。
- CGS 只以两种身份出现：一是用 GoalBoard 管理的一个外部真实项目，`docs/molis-work-bug-cards.md:40` 写「GB13 是 CGS 领域/编辑台问题，仍不在 Molis Work 修复」；二是一次会议记录里提到的个人工作意向（`docs/design/ui-renewal-2026-09-21/design-consensus.md:298`）。
- 官网 `content/site/enterprise.ts` 已把 CGS 写成「研发中、将来会是官方插件」，这句本身不算越界；但不能把它写成 Molis Work 现有的功能。

**2. 清单里其余功能都在 main 上，但只有 Goals、Sessions、Feed、成果（基础版）进过 v0.2.0。**
- 这些都在 main：Inbox、浮条、⌘K、助理输入框、Pages、PPT、Dataset、Forms、Cognia、炼金术士、Jelly、Schedule、Shelf、灵光、Feed、Goals、Sessions、Coding、Git、成果、工作流程、插件创作台。
- 「Inbox」作为独立插件不在 v0.2.0；那时它只是 Feed 里的一个分区。
- 而且 v0.2.0 连安装包都没有。

**3. Molis Work 页（`content/site/work.ts`）**
- **「同事在群聊里……引用文档里的段落和成果来讨论。结论带回项目」：不支持。** im-ui README 写明工作资源引用、结论流程「尚未实现」。产品里的讨论只对本机开放，邀请别人进来需要单独部署服务。
- **交接卡里「交给群里的同事」：不支持。** 代码里的交接是 Runtime 之间的（Sessions handoff），没有交给某个人的交接。
- **「你点『接手』，助理的改动都留着」（写文档的场景）：对不上。** 代码里的「接手」只用在侧栏浏览器和桌面操作上（`side-panel-browser.ts:202`、`computer-desk.ts:210`）。Pages 的 AI 是「选区 → 预览候选文字 → 确认写回」。
- **「你不在的时候，助理接着干……勿扰时段」：这一章已标「开发中」，但实际只到规格。**
  - 主动助理只有需求，`specs/proactive-assistant/spec.md:3` 写「尚未实现」。
  - 现有的只是到期提醒、用户主动要的定时跟进，以及「某处不提醒」「暂停到某时」两种规则；没有按时段设勿扰的功能。
  - 应用关掉后什么都不跑。
- **「助理调用几个插件接力」（Feed → 表格 → 汇报 → 日历 → 待办）：标「示意」是合适的。** 这些插件都向助理开放了动作，所以有可能做到；但仓库里没有这条链的验证记录。
- 「插件创作仍处于预览」「团队空间、多设备同步和插件分享属于后续方向」「尚未提供正式安装包」：这几句与代码一致。

**4. 其他文案**
- `content/folio-work.ts` 写「开发版内置 25 个」，与 PRODUCT.md 一致；但目录里实际有 26 条，多出来的是内部插件 Issue。
- 以 10-08 产品介绍 V2 为底稿的旧说法里，「实验」插件已于 10-10 删除；PPT「导出 JSON」现在已经是导出 PPTX。

**5. 仓库自己的 README 也说过头了。** README 写「从 GitHub Releases 下载 DMG」，但 v0.2.0 没有附件。官网别照抄。

---

## 内部说明（INTERNAL）：Issue 插件，绝不能出现在公开网站上

- **位置：** `plugins/native/issues`，插件 ID `io.molis.work.issues`，界面名「Issue」。2026-10-10 首次提交（`a8da3b98`），只在 main。
- **用途：** 在个人 Home 里随手记下使用中遇到的问题。可以粘贴截图，由助理在后台起标题、判断类型；有列表、编辑、重新整理、删除。快捷键 ⌘⇧I 从侧栏唤起，首页和项目右上角也有入口。
- **成熟度：** README 自称「本地开发中的内置 Runtime 插件，不代表已经发布或完成用户验收」，规格在 `specs/issue-home-v0`。
- **需要注意：** 它在 `BUILTIN_PLUGIN_CATALOG` 的第一条，标了 `personal: true`，带 summary「记录、查看和整理自己的问题。」，还有 `keys: "Mod+Shift+I"`。也就是说，**开发版里所有人都会看到它，没有任何开关把它藏起来**。PRODUCT.md 的「25 个」没有算它。
- 官网盘点和配图里都要避开它，包括底栏和插件切换器的截图。

---

### 第 2 份

# 补充：第 3 节（界面与布局）已核实

这是对刚才那份报告的补充。查界面外壳的子任务在我交报告之后才回来，现在可以确认第 3 节的大部分内容。有四处要修正，Issue 的可见范围也比我原先写的更大。路径都相对克隆根目录 `/private/tmp/claude-501/-Users-creamiex-molis-ai-molis-club/317c4333-f56b-4333-a796-3a9c88c3d9b3/scratchpad/molis-work-src/repo`。

## 需要修正的四处

1. **v0.2.0 其实有左侧栏。**
   - 当时界面还叫 GoalBoard，有左侧导航「工作台目录」（`apps/workbench/src/goals-page-renderer.ts` 在 v0.2.0 里渲染 `desktop-module-list`）。
   - 当时只有 Goal 一种标签页。
   - main 才去掉左侧栏，改成底栏加插件内的目录列。

2. **右侧栏的标签是「讨论 · 浏览器 · 电脑 · 文件」，我原来漏了「电脑」。**
   - 后面还跟着插件自己的侧栏页：灵光、Issue 记录、Pages「评论与备注」（`apps/workbench/src/side-panel.ts:34-56`）。
   - 底栏右侧只有 Shelf 和灵光两个常驻按钮（`immersive-shell.ts:105`），再加一个按钮「侧栏：讨论、浏览器与文件」，用来开关侧栏。没有单独的「讨论」按钮。

3. **插件通知已经不在标题栏。**
   - 现在计入助理输入框上的「需要你看看」铃铛（`apps/workbench/src/assistant-dock.ts:79`、`scripts/client/plugin-notifications.ts`），对应 CHANGELOG #140。
   - DESIGN.md 里「标题栏有铃铛」的写法已经过时。
   - 标题栏仍有「后台任务」：跨项目列出正在跑或在等的 Coding 会话，每 15 秒刷新一次（`immersive-shell.ts:310`、`scripts/client/attention.ts`）。

4. **情境浮条不只出现在 Pages。**
   - Pages 是唯一带自己格式工具的插件。
   - 其他插件里，只要选中了文字，就有一个只带动作的通用浮条（`scripts/client/context-actions.ts:82-108`）。覆盖炼金术士、Coding、Cognia、Dataset、Files、Forms、图片、Jelly、灵光、PPT、Schedule、Shelf、待办、工作流程、Feed。
   - 浮条上的条目：最多 3 个推荐动作、「更多」、「✦助理」，⌘. 可以调出（`packages/design-system/src/context-toolbar.ts:7-8`）。
   - 规格状态是「执行中」（`specs/context-toolbar/spec.md:3`）。

## 新确认的内容（都只在 main，v0.2.0 都没有）

**电脑操作：真的有，但只做到一部分。**
- 助理通过宿主的 Swift 辅助程序操作 macOS 应用（`apps/local-host/native/computer/`）。
- 侧栏实时显示目标窗口，密码框会被遮住。可以暂停、交还助理、接手、放进 Shelf、停止，每一步都要你批准。
- 只支持 macOS 14 以上。规格写「进行中（2026-10-11）」（`specs/computer-use/spec.md:3`）。
- 实测只到用模型驱动「文本编辑」和「计算器」完成 29 步的程度。

**⌘K 搜索覆盖 20 个插件：** 炼金术士、成果、角色、Coding、Cognia、Dataset、Feed、Forms、Goals、图片、Inbox、Jelly、灵光、Pages、PPT、Schedule、Shelf、待办、Sessions、工作流程。

**助理**
- 界面上就叫「助理」。「系统助理」只出现在文档和 CHANGELOG 里。
- 没配模型时会提示「还没有配置可用的模型，助理无法开始工作」（`assistant-error.ts:11`）。
- 「设置 › 助理」里有：按能力逐项授权、「每次执行前都请我确认」、提醒规则、每天的 token 上限、记忆、电脑助手的权限。

**设置分类**（`apps/workbench/src/settings-sections.ts:27-39`）
- 本机：界面与语言
- 个人：记忆
- AI：模型设置、助理、提示词
- 工具与接入：AI 与执行工具、能力库、服务连接、对外接入、调用记录
- 系统：诊断
- 插件自己的设置页（角色、Shelf、Coding、Goals 规划）按各自清单的顺序排在后面

**快捷键**
- ⌥1 到 ⌥9：打开 Dock 里前九个插件
- ⌘K：搜索
- ⌘.：调出情境浮条
- ⌘⇧I：开关 Issue 侧栏
- ⌘[ / ⌘]：在窗格历史里前进后退
- Shelf 另有全局热键，比如 ⌃⌥W

**桌面端**
- 用的是 Tauri 2，不是 Electron（`apps/desktop/src-tauri/Cargo.toml`）。
- 菜单栏里的界面叫「工作胶囊」，README 里叫 Work Capsule。

## 内部说明：Issue 插件（INTERNAL）

Issue 在开发版里比我原先写的更显眼：
- 右侧栏里有它自己的「Issue」记录页。
- ⌘⇧I 在任何地方都能把它叫出来。
- 它还进 ⌘K 的「工具」列表和插件切换器。

截底栏、侧栏、⌘K 和插件切换器的官网配图时，都要避开它。

## 对官网文案的影响

- 「浮动操作条」可以如实写成「选中内容后出现的情境浮条」，但只在 main 上。
- 「讨论」在产品里只是右侧栏的一个标签。官网如果把它画成底栏上的独立按钮，和现在的代码不符。
