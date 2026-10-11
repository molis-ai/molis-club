# Cloudflare 自有账号部署

本文记录 `molis-club` 从现有私有 Sites 预览迁移到自有 Cloudflare 账号时的资源和安全边界。现有 Sites 构建保持默认行为；Cloudflare 构建必须显式使用 `npm run build:cloudflare`。

## 首次预览资源

| 资源 | 名称 | 要求 |
| --- | --- | --- |
| Worker | `molis-club-preview` | 首次验证只使用 `workers.dev`，不绑定正式域名。 |
| D1 | `molis-club-preview` | 只保存预览数据；不得与 Production 共用。 |
| GitHub | `molis-ai/molis-club` / `main` | Cloudflare GitHub App 只授权此仓库。 |
| Access | Cloudflare account only / all traffic | Secret 和认证验证完成前保持私有。 |
| 分支构建 | 关闭 | 未建立独立 Preview 数据库策略前，非生产分支不得自动部署。 |

首次预览不创建 R2、KV、Queue、Durable Object、Vectorize 或额外数据库。

## 构建配置

- Build command：`npm run build:cloudflare`
- Deploy command：`npm run deploy:cloudflare`
- Production branch：`main`
- Root path：`/`

构建环境必须提供以下非 Secret 变量：

| 变量 | 用途 |
| --- | --- |
| `CLOUDFLARE_D1_DATABASE_NAME` | 预览 D1 名称，首次为 `molis-club-preview`。 |
| `CLOUDFLARE_D1_DATABASE_ID` | Cloudflare 创建 D1 后返回的数据库 ID。 |
| `BETTER_AUTH_URL` | 完整的 HTTPS `workers.dev` origin，不含路径。 |

`BETTER_AUTH_SECRET` 必须作为 Worker 的加密 Secret 注入，不能保存为普通构建变量、仓库变量或文档内容。Google/GitHub OAuth 和邮件变量在首次验证中不启用。

## 数据库初始化

创建空的预览 D1 后，按顺序且每个文件仅执行一次：

```sh
npx wrangler d1 execute molis-club-preview --remote --file drizzle/0000_jittery_lady_deathstrike.sql
npx wrangler d1 execute molis-club-preview --remote --file drizzle/0001_nebulous_power_man.sql
npx wrangler d1 execute molis-club-preview --remote --file drizzle/0002_curved_ultron.sql
npx wrangler d1 execute molis-club-preview --remote --file drizzle/0003_applications_multiple_submissions.sql
```

`0003` 去掉 `applications.email` 的唯一索引，新增 `topic`、`allow_display` 两列，不重建表、不删行。联系接口从这一版起写入这两列：已有数据库要先执行 `0003`，再部署新代码，否则提交会返回 503。

初始化前确认目标名称为 `molis-club-preview`；不得对 Production 或现有 Sites 数据库运行。执行后检查 `user`、`account`、`session`、`verification`、`rate_limit`、`applications` 和 `notes` 表存在，但不读取或输出用户数据。

## 安全检查

1. 部署令牌仅授权 Workers Scripts、D1 和本项目构建所需账户权限；不得使用 Global API Key。
2. Worker 在首次公开请求前启用 Cloudflare Access，策略只允许当前 Cloudflare 账号成员。
3. `BETTER_AUTH_SECRET` 使用 32 字节以上随机值，只在 Cloudflare Secret 存储中保留。
4. 部署日志不得打印 Secret、会话令牌、OAuth Token、用户邮箱、IP 或表单内容。
5. 预览通过后再建立独立 Production D1、独立 Secret 和正式域名；不得把预览数据库直接晋升为 Production。
6. `adeptify.me` 的 Nameserver 和自定义域名绑定属于后续独立变更，首次预览不得修改。

## 回滚

- Worker 回滚到上一个已验证版本，不回滚或覆盖 D1。
- 数据库迁移执行前保留导出或 Time Travel 恢复点；结构变更必须另行审查。
- 若首次部署失败，删除失败的预览 Worker 和空预览 D1，GitHub 与域名控制权不受影响。
