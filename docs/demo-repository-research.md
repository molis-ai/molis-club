# 三站 Demo 的仓库内容调研

调研日期：2026-09-22。用途：为品牌官网、产品站、社区站 Demo 提供真实内容依据；不是发布清单或产品验收报告。

## 调研范围与证据边界

- 使用已登录的 GitHub CLI，只读查询 `orgs/molis-ai/repos?per_page=100&type=all`。当前账号可访问 **42 个仓库：10 个公开、32 个私有；其中 2 个归档、1 个 fork**。
- 逐仓库阅读了 `/Users/oreal/adeptify-home/repos/<仓库名>/` 对应的 README、PRODUCT 或活动目标文档。下面的成熟度来自仓库自述与状态文档；本轮没有逐个启动产品、跑完整用户旅程，也没有把本地代码当作已公开版本。
- 同时阅读现官网 `content/works.ts`、`PRODUCT.md`。发现该内容表仍有 2026-09-06 的旧状态：GoalBoard 尚未更新为 Molis Work，DropAgent 尚写“开发中”。Demo 应使用本轮查到的新事实。
- GitHub Release 已实时确认：DropAgent `v0.2.0` 有 `DropAgent-v0.2.0-macos-arm64.zip`；Molis Work 最新正式 Release 为 `v0.2.0`，但 `assets=[]`，不能据本地 README 的安装说明宣称已有可下载 DMG。Jelly、牛来 Release 请求因 TLS 超时未重新核实，入口使用公开仓库/安装说明，避免写最新版本号。
- 私有仓库只用于理解团队正在研究的方向。Demo 可以沿用现官网已经展示的简要介绍，但不因读取权限而把内部材料、源码或未批准的产品细节公开。

## 最适合三个入口的内容

### 品牌官网

让合作方理解：Molis AI 是持续做产品、研究真实问题、保留人的判断的团队。不是用 42 个仓库拼成“42 款产品”，也不靠自动化、效率倍数或客户数量的虚构承诺制造规模感。

可以用三个具体方向讲能力：

1. **让 AI 工作持续可靠**：Molis Work 的目标与完成依据、ForkLight 的有界执行、DropAgent 对原文件的保护。
2. **让技术回到人的尺度**：Jelly 的生活记录、牛来的轻量陪伴；现官网已经介绍的 Elsewhere / Seentoo 则明确标注探索阶段。
3. **把创造过程分享出来**：艺术 Skill、可玩实验、午夜造物局的原版与人类参与修改版、观点原文。

页面应给出“一个真实问题 → 我们的产品判断 → 正在做的作品”这样的证据链。服务入口可以讲“与你一起理解场景、做出产品、帮助它进入实际工作”，不能承诺全行业万能交付。

### 产品站

主线选 **Molis Work**，辅线放 **DropAgent、Jelly、牛来**。它们分别回答：长期项目如何不断线、一份零散材料如何交给 Agent、日程与记录如何放在一起、多个 AI 会话如何被人感知。

Molis Work 的推荐叙事：

> 换一个会话，工作也接得上。目标、进展、依据和需要你决定的事，留在同一处。

按真实使用展开四步：说清要得到什么 → 看清正在推进什么 → 保留发现和变化的依据 → 对照约定判断是否完成。演示界面可以用虚构的示例项目，但必须标为“交互演示”，不能冒充真实用户/客户记录。

允许作为当前介绍：本地优先，跨已接入 Runtime 共用项目记录，目标与依赖图、事件记录、可信用户决定、绑定目标的终端，macOS/Web/内嵌浏览器入口。

不应作为当前主卖点：云端多人协作、团队账号与权限、自动接单派发 Agent 团队、Jelly 日程同步、全自动运营、已上线的完整插件市场。`docs/SSOT-MATRIX.md` 将 Server、Exchange、Team 身份、同步、Actions、Automation 等仍列为 absent；Pages/Form/Dataset/PPT 中部分 AI 能力明确是 stub。

### 社区站

重点不应是伪造论坛热闹，而是让访客立刻有真实可做的事：看一个作品、学一个方法、拿走一个 Skill、了解做作品的人、提出一次具体反馈。

- **作品与实验**：牛来、艺术风格 Skill，以及现官网已有的 ASTRALO / Seentoo / Elsewhere，状态各自可见。
- **一起做**：午夜造物局与“一起改”的机制很适合成为共创栏目概念：AI 原版、人参与后的版本、具体改动与试玩判断。仓库当前私有，不能假装已开放公共提交入口或有社区投稿。
- **百科与方法**：当前 6 个网页/动效百科、4 个艺术 Skill 可以直接延续；ForkLight、Complai、Molis Work 的公开仓库构成工程学习入口。
- **人和观点**：沿用 `content/members.ts` 与 `content/stories.json` 的现有资料和原文，不编造团队职务、头像、访谈或评价。

## 完整仓库清单

“公开”只说明代码仓库可访问；不自动代表有安装包、正式产品或可商用承诺。“开发中”是本轮保守的对外呈现建议。

| # | 仓库 | 做什么 / 主要用户 | 本轮查到的阶段与公开性 | 在三个站里的位置建议 | 主要本地依据 |
|---|---|---|---|---|---|
| 1 | [adeptify](https://github.com/molis-ai/adeptify) | 历史 AI 协作平台与 client-core SDK，为独立应用提供模型、会话与本机能力 | **私有、已归档**；含新旧栈，不能当现役旗舰 | 品牌研发历史资料；不列成当前产品 | README.md |
| 2 | [scroll-of-beings](https://github.com/molis-ai/scroll-of-beings) | 众生卷：在同一故事世界中，从不同角色的位置阅读与理解 | 私有；有客户端、后端与故事工坊说明；公开发行及完整玩家验收本轮未证实 | 社区的叙事实验候选，清楚标注开发中 | README.md、docs/project-charter-v1.md 入口 |
| 3 | [dogfood](https://github.com/molis-ai/dogfood) | CookToday 今日厨房：家庭菜谱、每日餐食建议、采购清单 | 私有；Expo 移动端、本地推荐和后端已有，默认 AI Provider 为 Mock；公开发行未证实 | 产品站生活工具候选，非首屏主线 | README.md |
| 4 | [forklight](https://github.com/molis-ai/forklight) | 让开发者把有边界的任务交给持久 Worker，监督、审查和安全集成 | **公开**；CLI/Hub/MCP 与真实执行有实现；活动目标仍保留陌生用户验收边界 | 品牌工程能力、产品工具、社区开源学习 | README.md、PRODUCT.md、goals/forklight-main-led-execution/ |
| 5 | [mage-helper](https://github.com/molis-ai/mage-helper) | 马哥的馊主意：围绕职场中的“一件事”还原事实、人物与行动 | 私有；README 明确产品/交互设计与 Tauri App 骨架，功能列表为设计 | 社区或产品实验候选；不写成成熟职场顾问 | README.md |
| 6 | [relay](https://github.com/molis-ai/relay) | 历史 AI 工作控制面：消息输入、任务委派、批准与结果回流 | **私有、已归档** | 品牌研发背景；不可作为当前在售产品或已接通生态 | README.md、GitHub archived 状态 |
| 7 | [studio-growth](https://github.com/molis-ai/studio-growth) | 团队的增长研究、内容生产、人工运营与学习工作区 | 私有；运营文档、Skills、方法与实现共存，包含旧品牌链接 | 品牌方法论来源，非独立产品卡片 | README.md |
| 8 | [molis-club](https://github.com/molis-ai/molis-club) | 现行 Molis AI 网站：作品、百科、观点、成员、反馈与合作入口 | 私有；React/Vinext 网站，受权限保护的试用；OAuth/邮箱验证/创作者后台等未完成 | 三个 Demo 的现有内容与原品牌资产来源 | README.md、PRODUCT.md、content/ |
| 9 | [elsewhere](https://github.com/molis-ai/elsewhere) | 有限的“未选择人生”旅程：访谈、事实镜、可能人生、归来信 | 私有；已有内部 macOS 发布候选，未开放公共下载 | 人的尺度与情绪体验作品，标签“内部体验” | README.md |
| 10 | [alchemist](https://github.com/molis-ai/alchemist) | 炼金术士：创始人从方向到创意，再比较市场与实现成本 | 私有；Phase 1 本地流程已实现；默认清楚标记的演示运行时，真实研究需配置 | 品牌产品判断与研究能力；产品站开发中方向 | README.md、PRODUCT.md |
| 11 | [complai](https://github.com/molis-ai/complai) | Rust CLI + Agent Skill，把规范、系统材料与证据整理为合规知识库、矩阵和差距报告 | **公开**；工程工具链，有明确来源追踪与写入边界；不是法律结论保证 | 品牌专业能力、解决方案、社区开源 | README.md |
| 12 | [flyleaf](https://github.com/molis-ai/flyleaf) | 本地应用交互 Runtime，让 Projects/Files/Diff/Git/Coding 等插件协作 | 私有；部分真实桌面连续编码有证据，后续完整性/UI仍在推进；无对外分发验收 | 品牌研发或产品“开发中”；不要沿用旧“只是空桌面壳”状态，也不宣称整版完成 | README.md、GOAL.md、docs/slices/requirement-order.md |
| 13 | [prologue](https://github.com/molis-ai/prologue) | 无 UI AI Client / Agent Runtime SDK，消费 App 保留自己的业务与界面 | 私有；SDK 与 Host 已有实现和真实切片，现役队列持续推进；公开稳定发行未证实 | 品牌研发地基，开发者方向；不抢产品首页主叙事 | README.md、GOAL.md |
| 14 | [Jelly](https://github.com/molis-ai/Jelly) | macOS 日历、清单、笔记、灵感收件箱；本地记录与关联 | **公开**；README 有安装包路径，日历与笔记能力已具备；AI 摘要/知识库不能照愿景写成当前；最新 Release 本轮未复核 | 产品副线、社区温暖实用的小工具 | README.md、现官网 works.ts |
| 15 | [cognia](https://github.com/molis-ai/cognia) | 从资料、领域知识、回顾与查询帮助个人认知成长 | 私有；独立桌面迁移与本地验证；发布打包未完成，Master/Domain Compiler/Companion 仍是设计 | 社区/产品探索候选，标明开发中 | README.md |
| 16 | [pick-one](https://github.com/molis-ai/pick-one) | 把 2–4 个纠结选项变成五维度 AI 对决和可分享结果 | 私有；MVP 有 Web、分享 API、图片/视频输出实现；公开服务与真实用户质量未验证 | 社区“有趣实验”；不放正式商用产品主线 | README.md |
| 17 | [molis-work](https://github.com/molis-ai/molis-work) | 让不同 AI Runtime 共用目标、进展、依据和决定的本地工作台 | **公开**；真实本地产品持续迭代；最新正式 Release v0.2.0 无附件；团队云/同步未实现 | 产品旗舰、品牌主要作品、社区开源入口 | README.zh.md、PRODUCT.md、docs/SSOT-MATRIX.md、GitHub Releases API |
| 18 | [niul.ai](https://github.com/molis-ai/niul.ai) | 牛来：把本地 AI 会话状态变成桌宠的状态、提醒与陪伴 | **公开**；桌宠与会话读取功能已实现，README 有 Release 入口；截图注明 Mock；最新安装包未重新核实 | 产品副线；最能表达工程与趣味共存的品牌作品 | README.md、PRODUCT.md |
| 19 | [hearth](https://github.com/molis-ai/hearth) | 把 AI Harness 变成 Godot HD-2D 世界中的旅店、委托、远征与归来 | 私有；可玩核心与美术仍推进，活动目标使用 Mock Runtime；完整游戏未完成 | 社区研发故事候选；不可宣称真实 AI 游戏全链已完成 | AGENTS.md、goals/hearth-playable-core-mock-runtime/progress.md |
| 20 | [lab](https://github.com/molis-ai/lab) | 想法、验证、实验、停放与毕业的创意池 | 私有；收纳工具/Skill/原型与验证，包括 QuoteFold、LocaleProof 等孵化方向 | 社区实验室的组织方法来源，不是一款独立 App | README.md |
| 21 | [astralo](https://github.com/molis-ai/astralo) | 与未知生命通过观察和对话慢慢学会彼此语言 | 私有；**可交互原型**，确定性本地编排，无真实模型/后端/持久化，刷新重来 | 社区实验、品牌好奇心；当前网站已介绍，可沿用边界 | README.md、PRODUCT.md |
| 22 | [footballnia](https://github.com/molis-ai/footballnia) | 足球人生与俱乐部经营：训练、比赛、人物、长期世界变化 | 私有；Godot runtime 与多段玩法有代码/测试；完整可玩赛季和公开发行本轮未验证 | 社区游戏研发候选，不写成可下载成品 | PRODUCT.md、game/README.md、AGENTS.md |
| 23 | [evrik](https://github.com/molis-ai/evrik) | 让已有软件复用业务代码、权限和数据规则，承担 Agent 任务 | 私有；`VALIDATED_VERTICAL_SLICES / INTERNAL_BUILD`，两个固定服务已验证；还不能让用户自主转换任意仓库 | 品牌研究方向、解决方案能力候选；必须写研发中 | README.md |
| 24 | [article](https://github.com/molis-ai/article) | 文章、调研、配图与写作方法的编辑工作区 | 私有；稿件有终稿/待发布差异，内部参考材料不可当公开文章 | 观点内容来源；只用已获准的现官网原文或明确的新摘要 | README.md |
| 25 | [CL4R1T4S](https://github.com/molis-ai/CL4R1T4S) | 第三方 AI 系统提示词资料收集项目 | **公开、fork** | 排除自有产品/成果展示；不因 fork 归属而标为 Molis 作品 | GitHub fork 状态、README.md |
| 26 | [goalboard-casebook](https://github.com/molis-ai/goalboard-casebook) | 内部案例与改进 Backlog，把实际摩擦送入审查、Goal 和回验 | 私有；正走 Molis Work 官方插件方向；真实身份/团队闭环尚未完整接通；案例公开需另行脱敏授权 | 品牌“从使用中改进”的方法依据；不公开内部案例或假装插件已发布 | README.md |
| 27 | [arena](https://github.com/molis-ai/arena) | 真实任务上的 AI 实战比赛和持续积累的问题材料库 | 私有；内部导演/自动选题原型，六席比赛仍为合成验证；非公开真实排行榜 | 社区可讨论的问题与未来节目形式；不使用虚构战绩 | README.md、PRODUCT.md |
| 28 | [seentoo](https://github.com/molis-ai/seentoo) | 见过：围绕同一棵树、路灯或建筑，以照片和一句心情产生轻连接 | 私有；已立项、可点手机原型，尚未验证 | 社区人与日常的作品；现官网已介绍，标手机原型 | README.md、PRODUCT.md |
| 29 | [content-growth-studio](https://github.com/molis-ai/content-growth-studio) | 由人最终决定的研究、选题、内容制作与学习工作流 | 私有；研究/机会判断/内容生成为部分实现，发布证据与策略学习仍有规划项 | 品牌内容研究方法或解决方案方向，不能宣称全自动增长 | README.md 当前状态、PRODUCT.md |
| 30 | [DropAgent](https://github.com/molis-ai/DropAgent) | 菜单栏置物架：放入文件/网页，在副本上交给已安装的 Agent 处理，再拖出结果 | **公开，v0.2.0 安装附件已实时确认**；macOS 14+、Apple Silicon | 产品副线的成熟入口，品牌“保护人的原件与控制权”案例 | README.md、PRODUCT.md、GitHub Releases API |
| 31 | [hearth-v3](https://github.com/molis-ai/hearth-v3) | 炉火之间：等距像素 JRPG 世界中的 AI 工作基地 | 私有；可玩世界切片与本机 Codex 工作链已接通；不是完整 JRPG | 社区实验，可讲人如何在世界中与 AI 协作；别与 hearth 的 Godot 状态混写 | README.md |
| 32 | [office-rave](https://github.com/molis-ai/office-rave) | 班味打碟机：办公声音做节奏，可输出音频、唱片图和短片 | 私有；浏览器可玩，有声音合成、节拍编辑与导出；公开网址/访问权限本轮未核实 | 社区动手玩栏目，创意与轻松感的实际作品 | README.md |
| 33 | [human-verification-bureau](https://github.com/molis-ai/human-verification-bureau) | 人类验证局：六个荒诞互动后生成一张“人类证明” | 私有；可玩 Web 实现，匿名结果统计依赖 Sites D1；公开部署/访问权限本轮未核实 | 社区可玩作品候选；可截取真实交互，别伪造参与人数 | README.md |
| 34 | [pocket-museum](https://github.com/molis-ai/pocket-museum) | 把照片与文字变成可探索、重访的私人展览 | 私有；本地 Web 账户/上传/编辑/漫游/影院/离线纪念册实现；默认本机服务，非已公开网站 | 社区人与创作的作品候选；可讲场景，不能填假展览用户 | README.md |
| 35 | [goal-decomposition-skills](https://github.com/molis-ai/goal-decomposition-skills) | 把模糊目标拆成可独立交付与验收的工作单元及可读看板 | 私有；独立 Skills、方法与示例，无需服务；不是已公开下载的库 | 社区方法分享候选、品牌实践依据；发布前不挂私有下载按钮 | README.md |
| 36 | [midnight-foundry](https://github.com/molis-ai/midnight-foundry) | 午夜造物局：睡前许愿、AI 原版、人类反馈与 Pro 版的持续实验栏目 | 私有；有作品与过程管理；每件作品的试玩、Pro、发布状态不同 | 社区主叙事很合适，强调真实试玩和过程；不编连续产出/用户增长数字 | README.md |
| 37 | [midnight-foundry-remix](https://github.com/molis-ai/midnight-foundry-remix) | 午夜造物局·一起改：原版源码、AI 修改指南和社区改编机制 | 私有；README 有第一件人类验证局挑战与 Pages 链接；公共可访问性未核实 | 社区共创机制的 Demo 候选，必须明确示范状态，无假投稿 | README.md、GitHub private 状态 |
| 38 | [artist-skill](https://github.com/molis-ai/artist-skill) | 韦斯·安德森、达利、莫奈风格 Skill，以及构建新艺术 Skill 的方法 | **公开**；四个独立 Skill、来源研究和作品；作品保存不等于用户已验收 | 社区百科/可带走的工具，也是品牌创造力的实证 | README.md |
| 39 | [auth](https://github.com/molis-ai/auth) | Molis Auth：统一账号、团队和权限基础服务 | **公开**；TS/Vue/Workers/D1 实现与本地部署说明；不等于 Work 已接入多人体系 | 工程基础设施，不当独立消费产品，也不冒充三站已统一登录 | README.md |
| 40 | [kol-daily](https://github.com/molis-ai/kol-daily) | 六平台 AI KOL 日报、跨平台摘要与议题的内部资料库 | 私有；日常内容生产/归档，不是用户 App | 品牌研究习惯与编辑后台来源，原始内部日报不直接公开 | README.md |
| 41 | [jev-workbench](https://github.com/molis-ai/jev-workbench) | 把判断写成版本化函数，试跑、发布并由 HTTP/MCP 调用 | **公开**；本地工作台，TypeSafe 云推理；无 Key 的 demo 明确为模拟 | 开发者产品/社区开源，品牌“把智能做成可复用能力”案例 | README.md、PRODUCT.md |
| 42 | [research-library](https://github.com/molis-ai/research-library) | 可追溯、可修订的共享研究成果，供 CGS 和未来插件消费 | 私有；研究包、来源、目录和历史样本；持续发现/召回率未证明 | 品牌研究方法来源，不是公共知识库或成品 SaaS | README.md |

## Demo 文案的具体用法

| 想表达 | 可以写 | 不应写 |
|---|---|---|
| 团队愿景 | “让好奇成为作品，让技术真正帮到人。” | “我们已重塑所有行业”“全球领先”“服务数千团队” |
| Molis Work | “把目标、进展与依据留在一起，换一个会话也能继续。” | “全自动 AI 团队”“云端团队协作已上线”“一键下载 DMG”（本轮无 release 附件） |
| 产品组合 | “认真做工作，也认真做一点有趣的事。” | “42 款已上线产品” |
| 状态 | “公开源码”“可下载 macOS 版”“内部体验”“交互原型”“研究中”按作品区分 | 所有卡片统一“立即体验” |
| 社区 | “拿走一个方法，试一个作品，告诉我们可以怎样更好。” | 虚构帖子、在线人数、评分、评价、用户头像与活动日期 |
| 服务 | “从具体场景出发，一起判断值得做什么，再把它做出来。” | 缺少案例支撑的交付效率、成本节省和客户收益数字 |

## 来源与后续核对

- GitHub 组织 API：`gh api 'orgs/molis-ai/repos?per_page=100&type=all'`，2026-09-22 成功返回全部 42 项。
- Molis Work Release API：`repos/molis-ai/molis-work/releases/latest`，返回 `v0.2.0`、`published_at=2026-09-11T08:26:09Z`、`assets=[]`。
- DropAgent Release API：`repos/molis-ai/DropAgent/releases/latest`，返回 `v0.2.0`、`published_at=2026-09-12T16:40:42Z`、macOS arm64 zip 与校验文件。
- 本文是 Demo 内容依据，不修改各产品仓库，也不将私有仓库变更为公开。正式发布三站时，仍需逐项复核实际外链、产品阶段、下载与访问权限；无需把内部实现名和验收术语塞进产品用户界面。
