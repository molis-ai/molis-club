# molis-club

Molis AI 的代码仓库（molis-club）。我们的 AI 创作者社区网站：发现作品、理解创作过程，与做东西的人交流。

现行网站直接位于仓库根目录。React + Vinext 提供页面与 API，Cloudflare Workers + D1 承载运行和数据，Better Auth 处理账号。

## 当前可用

- **作品发现**：10 个产品、3 项方案，按真实场景分类，标明当前阶段与可用入口。
- **首页体验**：暖灰流动光影、简短工作室介绍、大字标与一个作品入口，随后是原围桌插画；光影回应鼠标，离开视口暂停，减少动态或图形不可用时显示静态背景。
- **整站体验**：开放排版、减少重复文案，方案细节按需展开；页尾栏目在悬停或键盘聚焦时联动渐变、文字与插画。
- **百科与 Skill**：6 个网页/动效条目支持搜索、实际演示和 Prompt 复制；24 个外部组件资源可检索并带走参考 Prompt；4 个艺术家系列 Skill 可下载到本地使用。
- **社区与观点**：团队/作者介绍与作品、观点互相连接；栏目为社区、百科、产品、解决方案、观点。
- **阅读与反馈**：《落地主义》《人的尺度》原文，登录后可在作品下留下持久化反馈。
- **账号**：邮箱密码注册、登录、退出、会话与改密。
- **联系**：私密合作表单；申请内容不公开展示。

当前是受访问权限保护的私有试用站。Google/GitHub 登录仍待 OAuth 凭据；邮箱验证、密码找回、创作者发布后台与社区治理尚未完成。

## 本地运行

需要 Node.js 22.13+。

```bash
git clone https://github.com/molis-ai/molis-club.git
cd molis-club
npm ci
cp .dev.vars.example .dev.vars
```

在 `.dev.vars` 填入至少 32 字符的随机 `BETTER_AUTH_SECRET`，本地 `BETTER_AUTH_URL` 保持 `http://localhost:3000`。可用 `openssl rand -hex 32` 生成随机值；不要提交真实凭据。

首次启动前，构建本地 Worker 配置并按序初始化本地数据库：

```bash
npm run build
npx wrangler d1 execute DB --local --config dist/server/wrangler.json --file drizzle/0000_jittery_lady_deathstrike.sql
npx wrangler d1 execute DB --local --config dist/server/wrangler.json --file drizzle/0001_nebulous_power_man.sql
npm run dev
```

已有本地数据库时不要重复初始化迁移。打开 [本地网站](http://localhost:3000)。本地数据保存在忽略的 `.wrangler/` 中，与生产数据库分开。

## 验证

```bash
npm run check
npm test
npm run build
# 另一个终端保持 npm run dev 运行
npm run test:http
```

`test:http` 仅用于本地开发服务，会创建本地测试账号并验证真实认证、留言持久化与页面发现路径。

## 代码结构

| 目录 | 职责 |
| --- | --- |
| `app/` | 页面、共享界面和 API 路由 |
| `content/` | 产品、方案、观点、百科与成员内容 |
| `lib/` | 身份认证、元数据和社区写入规则 |
| `db/`、`drizzle/` | 数据结构与迁移 |
| `public/images/` | 当前网站使用的图片 |
| `public/downloads/artists/` | 艺术家 Skill 分发包，更新来源见 docs/ARTIST-SKILL-SOURCES.md |
| `tests/` | 业务与真实 HTTP 验证 |
| `docs/` | 部署、认证和产品说明 |

[产品范围](PRODUCT.md) · [视觉系统](DESIGN.md) · [整站体验与验收](specs/studio-flow/spec.md) · [内页需求与验收](specs/editorial-pages/spec.md) · [部署与成本](docs/DEPLOYMENT.md) · [登录配置](docs/AUTH-SETUP.md) · [产品分类](docs/PRODUCT-LINES.md) · [SEO/GEO](docs/DISCOVERY.md)

旧版原型与废弃方案已从工作树移除，需要回看时使用 Git 历史。
