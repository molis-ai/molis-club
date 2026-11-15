# molis-club 登录配置

统一账号的 CLUB-01 至 CLUB-09 已实现并完成合成数据隔离验证。`/login` 提供邮箱注册验证、密码登录、+86 验证码与 Google/GitHub mock 授权；`/account` 提供个人资料、登录方式、改密、退出、租户成员、订阅席位及平台管理。导航统一进入 `/account`，未登录时从该页进入登录或注册。

当前没有执行真实数据切换，也没有接入真实短信、邮件、Google/GitHub 或支付。合同、环境与分阶段验收见[统一账号规范](../specs/unified-account/spec.md)，存量归属见[业务身份映射](BUSINESS-IDENTITY-MIGRATION.md)，切换与回退见[账号切换验收](ACCOUNT-CUTOVER.md)。

## 2026-11-15 当前登录行为

合同固定为 Auth 当前工作树 1.2.0，实际文件摘要见 `lib/account/contracts/snapshot.json`。
密码登录与邮箱/手机验证码登录使用已登记的三个产品登录入口，再由 BFF 调中央同名 V2 操作。
Google/GitHub 在点击时打开授权窗口，原页面显示等待并轮询事务。
回调完成后返回提示页，原页面读到 CONSUMED 后再核验当前会话，并关闭窗口、完成登录。
关闭窗口、取消、过期及请求失败都会结束等待；页面卸载隔离迟到结果。
本节替代下文历史版本中的“整页跳转回 /login”描述。真实外部提供方的验收范围仍以下方证据为准。

## 2026-11-13：接入已合并的 LIVE Auth

本节更新下方历史 MOCK 验收范围。合同固定到 Auth `3cef81ac6433da41b7e7a80f3a6c512f77454418`（PR #7），文件摘要在 `lib/account/contracts/snapshot.json`，包括当前 UserView.email、第三方资料与事务状态。仍走 `/api/v2`，不使用旧主目录的 `/api/v1` Browser SDK。

页面沿用 Club 的邮箱登录、手机验证码、邮箱注册、找回密码，以及 Google/GitHub 顶层跳转；不引入 Work 弹窗、不改变 CSS、布局或表单顺序。验证码提示沿用既有 output 区域；第三方成功/取消返回 `/login`，由原页面读取会话。Club 不实现阿里云投递或提供方令牌兑换；密钥只留在 Auth。

### LIVE 配置

`MOLIS_CLUB_ACCOUNT_CONFIG.client.deliveryMode` 和 `providerMode` 均改为 `LIVE`；`authOrigin` 必须是实际运行这份 V2 代码的服务地址（本轮 Auth 本地配置是 `http://127.0.0.1:8788`，不是模板默认的 8787）。其他字段与 Auth 客户端登记一致。Club 本地仍为 `http://127.0.0.1:3000`，回调精确为 `http://127.0.0.1:3000/account/callback`。Google/GitHub 控制台登记的是 Auth 的 `/api/v2/auth/external/{google|github}/callback`，不是 Club 回调。

Auth 需要：

- 已应用截至 `0016` 的连续迁移，环境登记和 `UNIFIED_ACCOUNT_CONFIG` 同为 LIVE。
- `molis-club-unified-local` WEB 客户端、应用 `molis-club-unified-local-app`、`unified-local` 环境、CLUB 产品映射，以及上面的 Club 来源/回调已登记。
- 阿里云短信与邮件、Google/GitHub 凭据在 Auth 侧配置完成；非生产短信测试号码遵循 Auth 的 allowlist。Club 不复制 AK、签名或第三方 Secret。

`MOLIS_CLUB_ACCOUNT_KEY` 是 Club 自己的独立加密密钥，保存在忽略的 `.dev.vars` 或部署 Secret，不使用示例占位值。不要把既有 MOCK 的浏览器会话升级为 LIVE，配置变更后重新登录。已有数据库和真实账号不在本次切换范围，不能重复执行初始化或覆盖旧客户端登记。

### 联调证据与边界

```bash
MOLIS_AUTH_SOURCE=/absolute/path/to/current-auth node scripts/test-account-live-login.mjs
```

脚本调用真实 Auth WASM、临时 D1 和 Club BFF，使用 LIVE 适配，仅在外网边界拦截阿里云、Google 和 GitHub 响应。覆盖注册、密码、短信错误/正确验证码、邮件重置、第三方资料、重复登录、取消、回调重放拒绝及 LIVE 发送失败不回退 MOCK。不会发送真实消息或使用真实第三方账号；不把这些测试当作已完成线上部署/真实授权验收。

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

### 个人信息唯一来源

Club 的会话资料、个人资料页和登录方式均读取 Auth `GET /api/v2/users/me`。产品的 `/api/account/login-methods` 仅投影同一份 `loginMethods` 与 `user.version`；不会调用第二个中央资料接口，也不重新计算 `maskedLabel`。头像、昵称、邮箱和登录方式标签以 Auth 为准。首次设置密码同样使用该快照的密码状态和版本。离线缓存只供展示，不授权敏感操作。

### 统一账号管理入口

Club 顶栏「管理 Molis 账号」及 `/account` 旧地址由服务端重定向到当前配置的 Auth 首页。目标仅来自校验后的 `MOLIS_CLUB_ACCOUNT_CONFIG.client.authOrigin`，忽略浏览器传入的跳转参数，不携带用户资料或令牌。未配置或配置无效时显示服务不可用；`/account/callback` 继续供 Club 登录回调使用。Club 不再挂载自己的账号管理页，现有登录界面保留。

Club 已登录时，`/account` 经 `/api/account/management` 发起 Auth 一次性跳转：Auth 绑定 HttpOnly 浏览器凭证，再通过已登记的 `/account/callback?handoff=...` 回到 Club 确认原会话，最后进入 Auth 管理页。凭证 60 秒有效且只能消费一次；API bearer token 与刷新凭证不进入 URL 或浏览器脚本。原会话失效、账号切换、浏览器不匹配、过期与重放都会拒绝。Auth 会话沿用原认证时间与绝对期限，不把跳转提升为重新验证身份。未登录 Club 时转到 `/login`。

Auth 部署需先应用 `0018_management_handoff.sql`，并保持 `AUTH_WEB_CLIENT_ID`、`AUTH_WEB_SESSION_KEY` 与已登记客户端配置正确；不增加共享 Cookie、共享产品密钥或额外回调白名单。浏览器回调沿用当前客户端已登记的 `redirectUri`。

合同更新统一从 Auth 的 `contracts/unified-account/sync-products.mjs` 执行，
传入 `--work` 与 `--club` 两个项目路径。`--write` 同步原始合同并生成类型；
省略时直接对照 Auth 检查三端一致性。消费端本地摘要检查仍保留，
跨项目验收须同时运行 Auth 的源头对照检查。不得在产品端独立修改 Auth 合同。
