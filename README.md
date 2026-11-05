# molis-club

Molis AI 官网的代码仓库（仓库名 molis-club；对外品牌始终是 Molis AI）。Molis AI 是一间围绕工作、生活与体验研发 AI 产品的工作室，官网介绍五件产品、企业合作、社区与工作室本身。

单一 React + Vinext 应用，源码在仓库根目录。页面与接口跑在 Cloudflare Workers 上，数据在 D1，账号通过 Club BFF 接入中央 Auth。

## 网站有什么

| 页面                                                 | 地址                                                             |
| ---------------------------------------------------- | ---------------------------------------------------------------- |
| 首页                                                 | `/`                                                              |
| 五件产品                                             | `/work`、`/tool`、`/life`、`/story`、`/world`                    |
| 企业合作                                             | `/enterprise`                                                    |
| 社区、方法目录、艺术家 Skill                         | `/community`、`/community/methods`、`/community/methods/artists` |
| 关于（四间展厅）：认识我们、我们相信什么、文章、沿途 | `/team`、`/about`、`/essays`、`/along-the-way`                   |
| 联系、登录、账号、隐私说明                           | `/contact`、`/login`、`/account`、`/privacy`                     |

- 账号入口提供注册登录、个人资料、租户成员、订阅席位、权益及平台管理；另有联系表单（`/api/join`，内容只进团队私密收件箱）和保留的留言接口（`/api/notes`）。
- 短信、邮件、Google / GitHub 使用隔离 mock；真实账号迁移、支付和业务共享尚未实施。旧 Better Auth API 已关闭，旧账号与历史数据保留。
- `/demos/**` 是历轮比稿的评审页，留作参照，不改；正式官网不从里面引用代码。

## 在哪里能看到

- **正式环境**：现有的私有 Sites 项目（`.openai/hosting.json`），受访问权限保护。继续复用，不新建项目或数据库。
- **对外分享的预览**：<https://molis-ai-preview.molis-club.workers.dev>。这是静态快照：没有后端，联系表单和登录在页面上标明不会发出，不让搜索引擎收录。更新方法见下面「更新公开预览」。

## 本地运行

需要 Node.js 22.13+。

```bash
git clone https://github.com/molis-ai/molis-club.git
cd molis-club
npm ci
cp .dev.vars.example .dev.vars
```

在 `.dev.vars` 填入独立的 `MOLIS_CLUB_ACCOUNT_KEY`，并按隔离 Auth 登记设置 `MOLIS_CLUB_ACCOUNT_CONFIG`。格式及生成命令见[登录配置](docs/AUTH-SETUP.md)。不要提交真实凭据。

以下初始化命令只适用于新建的合成数据库；已有数据先核对迁移记录，不直接照抄执行：

```bash
npm run build
npx wrangler d1 execute DB --local --persist-to .wrangler/state --config dist/server/wrangler.json --file drizzle/0000_jittery_lady_deathstrike.sql
npx wrangler d1 execute DB --local --persist-to .wrangler/state --config dist/server/wrangler.json --file drizzle/0001_nebulous_power_man.sql
npx wrangler d1 execute DB --local --persist-to .wrangler/state --config dist/server/wrangler.json --file drizzle/0002_curved_ultron.sql
npx wrangler d1 execute DB --local --persist-to .wrangler/state --config dist/server/wrangler.json --file drizzle/0003_applications_multiple_submissions.sql
npx wrangler d1 execute DB --local --persist-to .wrangler/state --config dist/server/wrangler.json --file drizzle/0004_central_account_sessions.sql
npx wrangler d1 execute DB --local --persist-to .wrangler/state --config dist/server/wrangler.json --file drizzle/0005_central_account_transactions.sql
npx wrangler d1 execute DB --local --persist-to .wrangler/state --config dist/server/wrangler.json --file drizzle/0006_light_prism.sql
npm run dev
```

已有本地数据库时不要重复执行迁移，只执行还没执行过的新文件。本地数据在忽略的 `.wrangler/state` 里，与正式数据库分开；它不是缓存，不要清掉。

## 检查

```bash
npm run check   # 类型检查
npm run lint
npm test
npm run build
node scripts/test-account-routes.mjs # 临时 Worker/D1，验证构建产物旧入口关闭
```

中央账号测试与联合演练见[登录配置](docs/AUTH-SETUP.md)及[切换验收](docs/ACCOUNT-CUTOVER.md)。`tests/auth-http.mjs` 现在是只读旧入口检查，需显式 `MOLIS_CLUB_TEST_ORIGIN=http://127.0.0.1:3000`；现有 `test:http` 还包含向开发服务写入表单的历史站点/社区检查，不属于隔离迁移演练，不对保留真实数据的环境运行。

## 日常维护

- 改了页面：`npm run dates`，更新页尾的「本页最近修改」。
- 换了配图：原图放进 `public/` 下的图库目录，在 `scripts/site-media.mjs` 里登记（写清来源和谁定的），再 `npm run media`，输出 `public/site/` 的 WebP 与 `app/_site/media.json`。
- 更新公开预览：`npm run build:site-preview` 导出到 `outputs/site-preview/`，再进 `deploy/site-preview/` 按里面的说明上传。wrangler 只在那个目录里跑，每次显式写 `--config`，先 `--dry-run`；不要在仓库根目录跑 `wrangler deploy` 或任何 `wrangler pages` 命令。

## 开发流程

- main 是唯一主线，GitHub 上的 main 就是最新的官网代码。
- 每件事从 main 拉一个短分支，在单独的副本里做：`git worktree add .claude/worktrees/<名字> -b <分支名> main`。验收后合回 main，再删掉分支和副本。
- main 所在的文件夹只用来看最新版、合并和推送，不在里面开发。
- 本地预览的端口配置 `.claude/launch.json` 是各自本机的，不进 Git。

## 代码结构

| 目录                            | 放什么                                                      |
| ------------------------------- | ----------------------------------------------------------- |
| `app/(site)/`                   | 正式官网的各页                                              |
| `app/_site/`                    | 官网公共模块：顶栏页尾、动效、展厅部件、联系表单、图片清单  |
| `app/api/`                      | 账号、联系表单、留言等接口                                  |
| `app/demos/`                    | 历轮比稿的评审页（不改）                                    |
| `content/site/`                 | 官网文案；产品事实以 `docs/studio-intro.md` 为准            |
| `content/`                      | 方法目录、艺术家 Skill 与几页沿用的产品内容；其余给评审页用 |
| `lib/`、`db/`、`drizzle/`       | 认证与写入规则、数据结构与迁移                              |
| `public/site/`                  | 网站实际加载的压缩图                                        |
| `public/images/`、`public/r8-*` | 原图与图库                                                  |
| `public/downloads/artists/`     | 艺术家 Skill 分发包                                         |
| `scripts/`                      | 配图压缩、页面日期、预览导出                                |
| `deploy/site-preview/`          | 公开预览的上传配置                                          |
| `tests/`                        | 单元测试与本地 HTTP 检查                                    |

## 文档

- [项目事实与约定](AGENTS.md) · [产品范围](PRODUCT.md) · [视觉系统](DESIGN.md)
- [新站规格](specs/site-rebuild/spec.md) · [Work 产品页规格](specs/work-product-page/spec.md) · [官网优化清单](docs/site-optimization-2026-10-16.md)
- [官网优化接手 prompt](docs/site-optimization-handoff-prompt-2026-10-18.md) · [样张与验收记录](docs/site-style-studies-2026-10-16.md)（仓库交付与仅本地样张范围见主清单）
- [工作室介绍（文案事实来源）](docs/studio-intro.md) · [官方图库说明](docs/IMAGE-LIBRARY-BRIEF.md) · [图库原图与雾感版](docs/r8-materials-assets.md)
- [部署与成本](docs/DEPLOYMENT.md) · [Cloudflare 自有账号部署](docs/CLOUDFLARE-DEPLOYMENT.md) · [登录配置](docs/AUTH-SETUP.md) · [艺术家 Skill 来源](docs/ARTIST-SKILL-SOURCES.md)

旧版原型、历轮方案和已废弃的文档已从工作区移出，需要回看时用 Git 历史。
