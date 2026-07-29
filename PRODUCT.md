# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

- **访客 / 早期用户**：想认识真实做东西的人，试用正在长大的作品，而不是翻冷冰冰的产品目录。
- **Member（普通注册用户）**：使用作品、关注、发帖反馈、参加活动，不自动进入创作者目录。
- **Builder（外部创作者）**：注册并完成入驻后，可建 Profile、提交作品、招测试、写更新、在论坛回应反馈。
- **Maker（Adeptify 团队关系）**：由管理员授予；与 Builder 共用公开 Profile 与创作者目录，叙事上代表团队在场的人。
- **开发者**：需要 ForkLight、Relay、Adeptify SDK 等能力与支持入口，并在社区里带上下文提问。
- **Admin / 运营**：审核 Builder 与作品、策展首页、处理举报、维护论坛与内容事实。

## Product Purpose

**烤个梨呀（Roast Pear）** 是由 Adeptify 发起的**创作者、作品与早期用户社区**。

一句话：

> 认识做东西的人，体验正在长大的作品；炉边聊聊，顺手拿开发工具。

它要同时做四件事：

1. **看见人**：通过首页与创作者主页认识 Maker / Builder，而不是只剩 logo 墙。  
2. **用上作品**：发现、下载、使用或申请体验正在长大的应用与工具。  
3. **形成反馈闭环**：围绕具体作品发帖、测试、回应，并把反馈变成公开更新。  
4. **接住开发者**：提供 Adeptify SDK、ForkLight、Relay 等入口与支持路径。

内部机制北极星是「AI 应用的 Steam」能力结构（人、作品、分发、更新、社区、工具），但**不复制** Steam 的商店视觉、排行榜或商业结构，也**不退化**为 AI 产品目录。

成功信号：**Returning Participants**——同一个人会回来，再次参与某位创作者、某件作品或另一件作品。

## Positioning

| 是 | 不是 |
|---|---|
| 人 → 作品 → 反馈 → 更新 → 再回来的社区 | AI 产品导航站 / 纯目录 |
| 受控开放的创作者与作品现场 | 排行榜商店、等级游戏化社区 |
| 拳头产品 + Maker 作品 + 开发者工具同站 | 单一 SaaS 着陆页 |
| 过程可见（Build Log、更新、活动、IP） | 只晒成品截图的宣传册 |

**机制**：人与作品同场；公司拳头产品与外部 Maker 作品**分层不混称**；开发者工具有门但不抢走社区主角；文案少 AI 味，契合「烤梨」——慢火、过程、可分享。

## Operating Context

- 中文为主的公开 Web 社区（桌面 + 移动）
- 发现路径：首页策展 → 创作者 / 作品 / 论坛 / 开发者中心
- 账号：注册登录、邮箱验证、会话；Builder 入驻需基础审核
- 相关实体：
  - **拳头产品**：Cognia、Notebook、Nexus  
  - **Maker 作品（示例）**：马哥的馊主意、Knowledge-Graphify、众生卷、Elsewhere 等  
  - **开发者能力**：ForkLight、Relay、Adeptify SDK  
  - **社区现场**：活动、论坛、团队视频 / 每日搞怪等 IP  

## Capabilities and Constraints

### V1 要做的事（功能范围）

详见仓库内 [ROAST-PEAR.md](./ROAST-PEAR.md) 功能说明；摘要如下：

| 模块 | 要做什么 |
|---|---|
| **首页与发现** | 策展人、拳头产品、Maker 作品、工具入口、活动与论坛摘要、团队 IP |
| **身份与账号** | 注册 / 登录 / 会话；Member；Builder 申请与审核；Maker 管理员授予 |
| **创作者 Profile** | 介绍、作品列表、更新、关联讨论；可选漫画头像生成与选择 |
| **作品与分发** | 创建/编辑作品、成熟度与主动作、审核、版本/下载或外链、Build Log、更新回流 |
| **论坛** | 板块、主题、回复、关联作品、关注与通知、举报与基础治理（无私信/实时聊天室） |
| **活动** | 发布与展示活动（工作室夜、互助局、试用周等），可与论坛联动 |
| **开发者中心** | SDK / ForkLight / Relay 概述、Quick Start、文档与支持帖入口 |
| **Library** | 关注人/作品、使用关系、返回入口（轻量） |
| **Admin** | 审核队列、暂停/纠错、策展、审计 |
| **团队 IP** | 团队视频、每日搞怪、个人与团队 IP 的展示位（内容运营向） |

### 首页必须体现的六块概念

1. 开发者社区气质  
2. 开发者支持：ForkLight、Relay、Adeptify SDK  
3. Maker 与作品：馊主意、Knowledge-Graphify、众生卷、Elsewhere 等  
4. 拳头产品：Cognia、Notebook、Nexus  
5. 活动与论坛  
6. 团队 IP：团队视频、每日搞怪、有趣的个人与团队 IP  

### 作品分层（产品叙事）

- **炉上主菜**：Cognia / Notebook / Nexus（公司押注）  
- **桌上小菜**：Maker / Builder 作品（正在长大的东西）  
- 不在同一货架混称「都是我们的产品」

### V1 明确不做

- 私信、实时聊天室、等级 / 勋章 / 排行榜主叙事  
- 完整支付与交易网络、统一应用商店安装器  
- 英语社区优先、第三方全站 SSO（可后置）  
- 编造下载量、用户数、虚假成熟度  

### 文案与品牌约束

- 避免重 AI 味：赋能、无缝、Next-gen、一站式、智能体口号堆砌  
- 署名：烤个梨呀，由 Adeptify 发起  
- 成熟度用实话：可试用 / 内测 / 招募中 / 原型 / 稳定 等  

### 开放未决

- 正式域名、英文名来历的对外说法  
- 登录是否同时支持 GitHub / Google  
- Builder 人工批准 vs 条件自动公开  
- 头像生成 Provider 与隐私期限  
- Cognia / Notebook / Nexus 对外呈现边界  
- SDK 公共命名、License、成熟度事实源  
- 法务 Owner（隐私、协议、作品声明）  

## Brand Commitments

- 中文名：**烤个梨呀**；工作名 Roast Pear  
- Adeptify = 公司与技术母品牌；烤个梨呀 = 社区  
- 产品拉丁名保留：Cognia、Notebook、Nexus、ForkLight、Relay、Adeptify SDK  
- 不做 AI 紫渐变、玻璃卡片墙、三等分功能推销卡、Steam 排行榜首页作为默认视觉  

## Evidence on Hand

- `2026-07-25-adeptify-ecosystem-business-plan.md` — 战略母文档  
- `2026-07-27-roast-pear-product-design-and-technical-plan.md` — 产品与技术计划  
- `ROAST-PEAR.md` — 功能与范围说明（给人与协作读的摘要）  
- `design/homepage/` — 首页原型与 handoff（当前以仓库初始高保真稿为准）  
- **不得编造**商业与增长数字；示意内容需标注  

## Product Principles

1. **人先于货架**：先看见谁在做，再看见做什么。  
2. **分层不混称**：拳头产品与 Maker 作品同站，叙事层级分开。  
3. **过程可见**：更新、论坛、活动、IP 证明在「烤」，不是静态目录。  
4. **工具有门**：开发者支持清晰可达，但不抢走社区主角。  
5. **诚实标签**：成熟度、来源、演示数据如实；不装热闹。  
6. **受控开放**：可注册；公开创作者与作品仍过基础审核。  

## Accessibility & Inclusion

- 目标 WCAG AA  
- light / dark  
- `prefers-reduced-motion`  
- 键盘可达与可见焦点  
