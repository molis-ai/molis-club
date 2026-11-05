# molis-club 登录配置

统一账号的 CLUB-01 至 CLUB-09 已实现并完成合成数据隔离验证。`/login` 提供邮箱注册验证、密码登录、+86 验证码与 Google/GitHub mock 授权；`/account` 提供个人资料、登录方式、改密、退出、租户成员、订阅席位及平台管理。导航统一进入 `/account`，未登录时从该页进入登录或注册。

当前没有执行真实数据切换，也没有接入真实短信、邮件、Google/GitHub 或支付。合同、环境与分阶段验收见[统一账号规范](../specs/unified-account/spec.md)，存量归属见[业务身份映射](BUSINESS-IDENTITY-MIGRATION.md)，切换与回退见[账号切换验收](ACCOUNT-CUTOVER.md)。

## 本地配置

使用独立本地或隔离测试环境。`.dev.vars.example` 给出 LOCAL + MOCK 配置模板，复制到自己的忽略配置后按实际登记修改，不读取或复制生产密钥。

- `MOLIS_CLUB_ACCOUNT_CONFIG`：服务端 JSON，包含 Auth/Club 来源、应用、客户端、环境及精确 `/account/callback`。模板使用 `127.0.0.1:8787` 和 `127.0.0.1:3000`，须与 Auth 的隔离客户端登记一致，不能将 localhost 与数字地址混用。
- `MOLIS_CLUB_ACCOUNT_KEY`：独立随机 32 字节、无填充 base64url 的运行时 secret。可用 `node -e "process.stdout.write(require('node:crypto').randomBytes(32).toString('base64url'))"` 生成。重启及同一环境各实例保持相同密钥；不得进入普通构建变量或浏览器。
- 在新建合成 D1 上按迁移日志顺序应用 `0000` 至 `0006`。已有数据库不得重复执行；真实数据库需另行审核，不能把本地初始化当成迁移批准。

Auth 需应用自身截至 `0011` 的迁移并登记匹配客户端。短信/邮件投递及第三方提供方由 Auth mock 承接；验证码从合成 Auth 的 mock 投递记录取得。第三方经过标为模拟的授权页和精确回调，不使用万能验证码或浏览器伪造身份。

配置、密钥或存储缺失时账号接口明确失败，不回退旧登录；PRODUCTION 不允许 MOCK。正式域名、真实服务商和提供方应用仍待准备。

## 已关闭的旧入口

`/api/auth`、`/api/auth/*` 和 `/api/auth-options` 已返回 `410 AUTH_ENTRY_RETIRED`。旧注册、登录、改密、绑定、退出、第三方回调均不再调用 Better Auth 服务端，也不读取提交的凭据或访问数据库。它们不通过重定向转发密码正文。

原 `BETTER_AUTH_*`、Club 侧 `GOOGLE_*` / `GITHUB_*` 配置不再启用这些入口。旧第三方回调地址不能复用为中央回调。仓库内 Better Auth 浏览器依赖仍供未改动的历史评审页引用，不代表旧服务端继续可用。

旧 user、account、session、notes 及审核映射保留；旧 Cookie 不会升级为中央会话，用户须重新登录。留言写入还须有已审核业务映射；未解决归属保持待处理，不按同邮箱认领。真实旧密码与外部身份的接续覆盖尚未确认。

## 验证

先构建 Auth WASM；账号脚本通过 `MOLIS_AUTH_SOURCE=/absolute/path/to/auth` 指定该检出，全部使用临时数据库及外部 mock。

- 注册登录/安全：`node scripts/test-account-authentication.mjs`。
- 租户、订阅、平台：分别运行 `scripts/test-account-tenants.mjs`、`scripts/test-account-billing.mjs`、`scripts/test-account-platform.mjs`。
- React 浏览器流程及实际顶栏/页尾导航：`node scripts/test-account-browser.mjs`，包括注册、资料、绑定、密码、双账号租户及商业管理。
- 完整构建后的旧路由关闭及中央页面挂载：`npm run build` 后运行 `node scripts/test-account-routes.mjs`。该脚本不加载 `.dev.vars`，使用空的临时 D1，并断言缺少中央配置时不回退。
- Work/Club 同一 Auth 的切换与 Home 保留：见[联合演练命令](ACCOUNT-CUTOVER.md)。

上述验证没有部署到真实环境，不替代部署后的全站 E2E 或真实提供方授权验证。


AUTH-12 已在 Auth 仓库 `docs/unified-account/acceptance-matrix.md`、`delivery.md` 和 `integration-guide.md` 汇总跨仓库验收、版本与管理说明。当前源码尚未提交或发布；全部方式丢失的帮助动线、共享资源夹具、真实账号接续和正式外部服务等仍分别列为待办。中央 v2 接入不使用 Auth 保留的 v1 浏览器 SDK/托管确认示例。
