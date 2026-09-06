# Molis AI

> 2026-09-06：当前网站已更名 **Molis AI**，实现位于 [`community/`](./community/README.md)。使用用户指定Logo的冷银白、海军蓝、雾蓝配色与简洁光影；支持作品、文章、邮箱账号及身份留言。Google/GitHub接入待应用凭据。部署与成本见 [`community/DEPLOYMENT.md`](./community/DEPLOYMENT.md)，接入步骤见 [`community/AUTH-SETUP.md`](./community/AUTH-SETUP.md)。以下旧品牌主页与规划为历史记录，不再约束当前网站。

[中文](#中文) · [English](#english)

---

## 中文

### 这是什么

**烤个梨呀（Roast Pear）** 是由 Adeptify 发起的创作者、作品与早期用户社区。

> 认识做东西的人，体验正在长大的作品。

当前仓库以 **产品定义 + 高保真静态原型** 为主（最终主页、首页七向设计档案、漆梨月刊多页稿），完整后端产品仍按技术计划迭代。协作首选产品范围文档：[`ROAST-PEAR.md`](./ROAST-PEAR.md)。

### 主要功能点（产品范围）

1. **社区首页与发现**  
   - 人、拳头产品、Maker 作品、工具、活动、论坛、团队 IP  
   - 分层叙事：炉上主菜（Cognia / Notebook / Nexus）· 桌上小菜（马哥的馊主意、KGF、众生卷、Elsewhere…）· 工具架（ForkLight、Relay、Adeptify SDK）

2. **账号与身份**  
   - Member / Builder / Maker  
   - Builder 入驻与审核  

3. **创作者 Profile 与作品分发**  
   - 展示、试用/下载、更新、Build Log  

4. **论坛与活动**  
   - 围绕作品的反馈闭环  

5. **开发者中心**  
   - ForkLight、Relay、Adeptify SDK 入口与文档导流  

6. **Library + Admin**  
   - 回访关系与社区治理  

### 本仓库当前可运行内容

#### 最终高保真首页与 Gallery

```bash
cd /path/to/roast-pear
python3 -m http.server 8765
# 最终版：http://127.0.0.1:8765/design/homepage/
# Gallery：http://127.0.0.1:8765/homepages/
# 设计档案：http://127.0.0.1:8765/homepages/<direction>/
# 方向例：living-anthology · teletext-service · pixel-maker-city ·
#         riso-release-wall · slow-fire-index · homepage-overdrive · canon
node homepages/verify-homepages.mjs
```

#### 漆梨 × 月刊多页原型

```bash
open design/site/index.html
```

#### 早期单页探索

```bash
open design/homepage/prototype.html
```

### 品牌关系

| 名称 | 角色 |
|------|------|
| Adeptify | 公司与技术母品牌 |
| 烤个梨呀 | 创作者与作品社区 |
| Cognia / Notebook / Nexus | 拳头产品 |
| SDK / ForkLight / Relay | 开发者能力（独立产品身份） |

### 文档索引

| 文件 | 说明 |
|------|------|
| [`ROAST-PEAR.md`](./ROAST-PEAR.md) | **产品是什么、做哪些功能** |
| [`PRODUCT.md`](./PRODUCT.md) | 设计 / Impeccable 产品记录 |
| [`DESIGN.md`](./DESIGN.md) | 最终视觉系统、组件规则与响应式约束 |
| `2026-07-25-adeptify-ecosystem-business-plan.md` | 生态与商业战略 |
| `2026-07-27-roast-pear-product-design-and-technical-plan.md` | 产品设计与技术计划 |

### 开发说明

本仓现阶段 **无统一 npm app 启动脚本**；以静态 HTML/CSS 原型与文档为主。验证首页内容/区分度：`node homepages/verify-homepages.mjs`。

---

## English

### What it is

**Roast Pear (烤个梨呀)** is Adeptify’s community for makers, works-in-progress, and early users: meet people who build things, and try products that are still growing. This repo currently holds **product scope docs and high-fidelity static prototypes**; full backend productization follows the technical plan.

### Feature scope

1. Discovery home: people, flagship products, maker works, tools, events, forum, team IPs.  
2. Identity: Member / Builder / Maker with onboarding review.  
3. Creator profiles and distribution (try/download, updates, build logs).  
4. Forum & events feedback loops.  
5. Developer hub for ForkLight, Relay, Adeptify SDK.  
6. Library + admin governance.

### Run prototypes locally

```bash
python3 -m http.server 8765
# http://127.0.0.1:8765/homepages/<direction>/
open design/site/index.html
node homepages/verify-homepages.mjs
```

### Docs

Start with [`ROAST-PEAR.md`](./ROAST-PEAR.md). Design notes in `PRODUCT.md`; longer plans in the dated markdown files at repo root.
