# Auth / Club 隔离 mock 预览

状态：隔离 mock 预览已部署，七组线上检查通过。已有 Cloudflare 账号成员可访问 [Club 登录页](https://molis-club-preview.sparkling-silence-0a49.workers.dev/login)，选择 Google 或 GitHub 模拟登录体验。

本配置用于 2026-11-06 获准建立的合成数据预览。环境配置文件存在不表示已经发布；实际资源、部署版本和在线登录结果由执行记录确认。

| 项目 | 配置 |
| --- | --- |
| Club Worker | `molis-club-preview` |
| Club 地址 | `https://molis-club-preview.sparkling-silence-0a49.workers.dev` |
| Auth 地址 | `https://molis-auth-preview.sparkling-silence-0a49.workers.dev` |
| Club 专用 D1 | `molis-club-mock-preview-20261106`，UUID `585cf168-cb0e-44c5-b49e-9b2ec2684340` |
| 环境 | `unified-mock-preview-20261106`，`TEST` / `MOCK` / `MOCK` |
| 应用 / 客户端 | `molis-club-unified-mock-preview-app` / `molis-club-unified-mock-preview` |
| 精确回调 | `https://molis-club-preview.sparkling-silence-0a49.workers.dev/account/callback` |

## 配置与发布

非密钥账号 JSON 位于 [deploy/mock-preview/account-config.json](../deploy/mock-preview/account-config.json)。它须与 Auth 的环境、应用、客户端、产品 `CLUB`、允许来源及回调登记一致。Auth 另使用专用数据库 `molis-auth-mock-preview-20261106`，迁移至 `0011`，按其 `worker/deploy/mock-preview/seed.sql` 登记；不执行旧 Console seed。

Cloudflare 构建配置如下：

| 构建变量 | 值 |
| --- | --- |
| `CLOUDFLARE_D1_DATABASE_NAME` | `molis-club-mock-preview-20261106` |
| `CLOUDFLARE_D1_DATABASE_ID` | 该新数据库创建结果中的 UUID；不得复用旧预览、Sites 或生产数据库 UUID |
| `MOLIS_CLUB_ACCOUNT_CONFIG` | 上述 JSON 文件的完整内容 |
| `MOLIS_CLUB_AUTH_SERVICE` | `molis-auth-preview`，只在本次预览构建设置，生成 `MOLIS_CLUB_AUTH` 服务绑定 |

使用现有 `npm run build:cloudflare` 构建；部署目标明确为 `molis-club-preview`。构建后的 `dist/server/wrangler.json` 须核对新 D1 绑定与账号 JSON，再部署。缺少配置仍由现有构建校验拒绝，不使用本机 `LOCAL` / `127.0.0.1` 模板充当云端配置，也不恢复旧 `BETTER_AUTH_*` 登录。

Club 的运行时 Secret `MOLIS_CLUB_ACCOUNT_KEY` 使用独立随机 32 字节、无填充 base64url；不得放入本 JSON、普通构建变量、日志或 Git。它与 Auth 的 `PROVIDER_STATE_KEY` 分别生成，实例重启保持各自相同值。构建变量不能替代运行时 Secret。

仅对本次新建的 Club 专用空库，按 `drizzle/meta/_journal.json` 顺序应用 `0000` 至 `0006` 的七份迁移。不得从现有数据库复制用户、会话、留言等真实记录，也不得把此初始化命令指向已有数据的库。现有 Sites、生产及旧预览数据库保持原状；预览 Worker 的 DB 绑定切换到上述新库。

Club 继续由 Cloudflare Access 限定账号成员访问。Club BFF 通过服务绑定请求预览 Auth，沿用固定来源、接口合同和重定向拒绝校验。浏览器使用公开的 mock 授权地址和登记的 Club 回跳地址。更多边界见[Cloudflare 部署说明](CLOUDFLARE-DEPLOYMENT.md)和[账号配置](AUTH-SETUP.md)。

## 体验和验证

体验入口为 Club `/login`；登录后进入 `/account`。Google/GitHub 按钮会进入标明隔离测试的模拟授权页，使用 Auth seed 中的“Google 合成预览测试账号”或“GitHub 合成预览测试账号（无邮箱）”，确认后回到 Club。用户可通过这两种方式自助体验；它们不使用真实 Google/GitHub 账号，也不代表真实提供方已接入。

邮箱、短信均无真实投递。验证码只保存在本次专用 Auth D1 的 `auth_mock_delivery` 中，验证者仅按本轮合成邮箱或手机号读取最新未过期记录完成表单；无公开收件箱、万能验证码或普通接口回显。合成邮箱使用保留测试域名，例如 `preview-user@example.test`。

2026-11-08 本轮验证：

1. Cloudflare 构建与部署成功。Club 版本 `93a2c6d7-c44e-48c0-9aec-87e30935f0d0`，Auth 版本 `8ab8bade-ec91-4bc5-82a8-79294680b592`，均绑定各自的专用 D1。
2. Google/GitHub 模拟授权成功与取消、精确回跳及个人资料页面。
3. 合成邮箱注册验证、正确/错误密码登录及 +86 验证码注册登录。
4. 页面重载保持登录、退出后受保护页面重新要求登录，旧 `/api/auth` 入口仍关闭，Auth 令牌轮换和撤销通过。
5. 确认没有真实短信、邮件或第三方授权请求，并记录本轮合成数据范围。

Club 线上版本由本地修复分支构建。修复处理了 Vinext 路由上下文传参和 Workers 的重定向选项，需纳入主线后，后续 Git 构建才包含该修复。版本和证据见[验收记录](MOCK-PREVIEW-VALIDATION.json)。
