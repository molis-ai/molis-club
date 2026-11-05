# 统一账号接入与持久会话

状态：CLUB-01 至 CLUB-09 已实现并完成对应合成数据隔离验证；分阶段记录见文末。真实存量盘点/迁移仍依赖 D-09，AUTH-12 已汇总交付，完整矩阵及剩余事项在 Auth 仓库 `docs/unified-account/delivery.md`。

后续执行按 Auth 仓库 `docs/unified-account/implementation-plan.md` 第 11 节，T-01 至 T-07 状态以其交付台账为准。本仓库仍遵守 [AGENTS.md](../../AGENTS.md)和[账号切换说明](../../docs/ACCOUNT-CUTOVER.md)；当前先做集成收尾，继续使用外部 mock 与合成数据，真实存量接续需先完成 D-09 盘点和方案确认。

T-01 本地整理阶段已集成主线 `8bb5824`；被验源码基准为 `eb467ea7a4b2dbd3bfab3d48bc840cb1ff648a9d`，后续文档提交不改变其源码摘要。构建、类型、lint、77/77 单元测试、固定合同、完整构建路由、真实 BFF/Auth 的浏览器账号管理及三端合成切换/回退复验通过。

2026-11-06 已按授权推送并建立 [Club #27](https://github.com/molis-ai/molis-club/pull/27)，本轮再次通过浏览器账号管理及三端合成切换/回退。仓库当前没有 GitHub Actions 工作流，本地证据不称为远端 CI。Work 最终集成验证仍在进行，三仓库结果、已知问题和源码摘要由 Auth 交付记录汇总；未合入 main、部署或读取真实账号数据。

本阶段建立 Club 服务端到中央 Auth 的调用、持久会话和合同边界，注册登录与个人账号管理页面已接入中央服务。旧 Better Auth API 已关闭，旧账号、凭据、会话行和留言数据保留；留言写入使用中央身份与已审核映射，真实存量账号尚未切换。

## 结构

- `lib/account/contracts/` 保存 Auth 1.1.0 的固定合同快照。schemas、OpenAPI、policy、校验器、校验器支持集与 580 个正反夹具逐字节保留，来源和 SHA-256 记录在 `snapshot.json`。原始来源为 AUTH-01 至 AUTH-10 工作树，因此以文件摘要标识准确版本，不把基础 Git 提交当作全部内容的来源。
- `scripts/account-contracts.mjs` 核对原始文件摘要，从 JSON Schema 生成 `types.ts`。运行时仍执行原始 Schema 校验，不以 TypeScript 类型替代约束；产品不另维护登录方式、状态或错误业务枚举。
- `config.ts` 读取可信部署绑定。`client.ts` 只接受固定中央 operationId，按原合同校验参数、请求和响应；服务器决定 Origin、中央地址和会话材料。浏览器不能指定任意 URL、请求头、主体或客户端。
- `bff.ts` 将产品固定操作映射到中央操作，处理公开响应和错误。Scope、expectedVersion、幂等键按请求转交，成员和商业授权仍由 Auth 判定。活动、退出和安全会话视图交由会话 owner；注册登录事务由 `authentication.ts` 与 `auth-http.ts` 的固定窄入口编排，不以通用转发替代。
- `runtime.ts` 是 Cloudflare 服务端装配点。会话、资料、注册登录、再次验证、登录方式、改密、租户成员及所有权交接均挂载明确的固定路由；订阅读取、席位管理和权益查询也挂载固定路由；平台租户与订阅开通/变更入口已按 CLUB-07 接入，没有公开的 catch-all 代理。

## 服务端会话端口

`sessions.ts` 实现 `AccountSessionPort`，`session-store.ts` 用 D1 条件更新持有会话事实，`session-crypto.ts` 处理 Token 加密与 CSRF。浏览器提交的 Bearer 和发起方证明在 BFF 拒绝，不作为账号身份。

Cookie 是 32 字节随机值，D1 只存 SHA-256 摘要；HTTPS 使用 `__Host-`、Secure、HttpOnly、Path=/、SameSite=Lax，不带 Domain，本地 HTTP 使用独立名称。成功登录原子轮换 Cookie 摘要并增加 epoch，Cookie 固定截止于中央的 90 天绝对期限，中央 30 天闲置期限仍逐次校验。现有会话的 GET、刷新、activity 和 logout 不更新 Cookie，避免迟到响应覆盖或删除新登录的 Cookie；退出后旧 Cookie 只能查询非敏感退出回执，不能恢复凭据。

TokenSet 使用独立运行时密钥经 HKDF 派生的 AES-GCM 加密，密文绑定环境、Cookie 摘要、epoch、用户与中央 session。每次请求创建新 owner 可从 D1 恢复，Worker 内存不作为跨实例锁。刷新前 CAS 将记录置为 REFRESHING 并清除旧密文，执行者仅在内存保留旧 refresh proof；其他实例等待新版本。租约超时、响应丢失或结果写入失败后终止该本地会话，不接管重放旧 refresh。中央提前拒绝 access token 时，只读身份查询可经一次 CAS 刷新重读；管理写请求不自动重试。会话固定锚点（认证时间、绝对期限、应用、客户端和 session id）必须与原加密 TokenSet 一致。

`beginLogin`、`completeLogin` 和 `cancelLogin` 是供 CLUB-03 可信服务端认证编排使用的内部接口，没有浏览器 Token 安装路由。匿名许可由 CSRF、随机 nonce 摘要、浏览器摘要和 epoch 绑定，过期、跨浏览器、伪造、取消和重放拒绝；完成时先复核中央身份，再原子轮换 Cookie。中央 session 在同一部署只可安装一次；许可取消后才返回的新 Token 会立即尝试撤销，已安装结果的重复提交不会撤销有效登录。当前已登录时需先退出才能重新登录；退出进行中拒绝新许可。

普通与全产品退出先持久增加 epoch、清空 Token 和许可，再用内存中的 refresh proof 请求中央撤销；持久清理失败不能声称 localCleared，网络失败明确 UNCONFIRMED。同一个退出幂等键从 D1 返回结果；退出执行持有 20 秒租约，若进程中断或最终回执写失败，租约到期后新实例转为 EXPIRED/UNCONFIRMED，允许再次登录且不重发已清除的 proof。全局退出不按用户批量清理本地其他会话，其他会话由下一次中央复核判断，避免迟到响应误退后来新建的登录。刷新或认证的迟到响应不能复活旧登录。明确的 OPEN/INTERACT 才发送 activity，读、刷新、恢复和后台任务不续活。D1 中 lastActiveAt 和 idleExpiresAt 按活动时间原子保留最新值，不假设 activity 增加 sessionRevision；活动延长的闲置期限不受旧 TokenSet 缓存影响。离线时只有 session GET 可提供 OFFLINE_CACHED 用户提示，受保护操作继续拒绝；缺失或错误加密密钥直接返回配置错误。

生产装配不读取 Better Auth Cookie；注册登录与个人账号页面使用中央接口，留言写入通过已审核业务身份映射。尚未实施真实中央账号迁移。配置、密钥或 D1 不完整时返回 503，不选择隐含开发环境。

中央 opaque token 只用于服务器请求，不解析为 JWT。每次受保护操作先读取当前中央账号，核对 issuer、applicationId、clientId、userId 和 loginSessionId；原 session 的有效期、用户/客户端状态和撤销由中央复核。请求不带浏览器 Cookie，不跟随重定向，不盲目重试。请求超时 15 秒；请求/响应 JSON 上限 2 MiB，超限明确失败。无效响应、网络异常和上游非合同错误不回显原始内容；合法错误保留 HTTP 状态、code、retryAfterSeconds，字段明细和上游 requestId 不向浏览器透传。

## 环境

部署绑定 `MOLIS_CLUB_ACCOUNT_CONFIG` 是下列对象的 JSON 字符串，仅在服务器侧读取；没有公开 `NEXT_PUBLIC_` 对应项。构建时提供该环境变量会验证并写入 Worker 的普通配置绑定，开发环境也可通过自己的忽略配置提供。不要把真实凭据放进此结构。

```json
{
  "applicationId": "molis-club-unified-local-app",
  "redirectUri": "http://127.0.0.1:3000/account/callback",
  "client": {
    "environmentId": "unified-local",
    "environmentKind": "LOCAL",
    "authOrigin": "http://127.0.0.1:8787",
    "productOrigin": "http://127.0.0.1:3000",
    "clientId": "molis-club-unified-local",
    "policyProfile": "unified-account-v2",
    "redirectAllowlist": ["http://127.0.0.1:3000/account/callback"],
    "deliveryMode": "MOCK",
    "providerMode": "MOCK"
  }
}
```

LOCAL 的两端来源须为明确回环地址；TEST/PRODUCTION 须 HTTPS，PRODUCTION 不允许回环或 MOCK。回调须属于本产品来源、精确为 `/account/callback`，不能带预占查询参数、片段或通配符；认证回调页面已在 CLUB-03 接入。中央需已应用截至 0011 的迁移，并显式登记匹配客户端/应用/环境及 CLUB 产品。外部短信、邮件和提供方继续由 Auth 的隔离 mock 承接，Club 不发送万能验证码或伪造用户。

`MOLIS_CLUB_ACCOUNT_KEY` 是额外的服务端运行时 secret，值为随机 32 字节的无填充 base64url 编码。由部署 secret 绑定或本机忽略配置提供；不放入 `MOLIS_CLUB_ACCOUNT_CONFIG`、Vite 普通变量、浏览器构建或仓库。所有 Worker 实例和重启须使用同一密钥，换密钥会使已有密文无法恢复，密钥轮换迁移另行安排。新增 D1 迁移 `drizzle/0004_central_account_sessions.sql` 仅创建独立中央会话表及索引，保留 Better Auth 表和旧数据；本次仅在临时数据库执行，未改真实 D1。

## 验收

| 编号       | 验收条件                                                                          | 证据                                             |
| ---------- | --------------------------------------------------------------------------------- | ------------------------------------------------ |
| CLUB-01-01 | 共用合同快照、生成类型及全部正反夹具一致                                          | `tests/account-foundation.test.mjs` 的 UAS-01/26 |
| CLUB-01-02 | 非法来源/回调、正式 mock、未知配置及客户端冒充拒绝                                | 同文件 UAS-11/28                                 |
| CLUB-01-03 | 固定操作保留 Scope、版本、幂等键，拒绝任意 URL、未知字段/参数、路径穿越与未知操作 | 同文件 UAS-01/11/26                              |
| CLUB-01-04 | 错误 issuer/application/client/user/session 在写入前拒绝                          | 同文件 UAS-11/26                                 |
| CLUB-01-05 | 浏览器不获得 token/proof，跨站及 CSRF 失败拒绝；上游错误不回显内容                | 同文件 UAS-26 与 BFF 用例                        |
| CLUB-01-06 | 用真实 Auth、临时 D1 和 mock 短信取得身份，经 BFF 读写并验证撤销                  | `scripts/test-central-account.mjs`               |
| CLUB-02-01 | Cookie 摘要、加密 Token、CSRF、匿名许可、Cookie 轮换与固定会话锚点                | `tests/account-sessions.test.mjs` UAS-11/26/38   |
| CLUB-02-02 | 跨实例单飞、重启恢复、中央 401、租约超时及响应/持久化失败不可重放或复活           | 同文件 UAS-26/38                                 |
| CLUB-02-03 | 当前/全部退出、其他浏览器隔离、离线 UNCONFIRMED、迟到结果及新登录竞态             | 同文件 UAS-09/10/11                              |
| CLUB-02-04 | 30/90 期限，只有明确活动续活，离线缓存不能授权                                    | 同文件 UAS-38                                    |
| CLUB-02-05 | 临时 D1 与真实 Auth mock 登录，两个 manager 刷新、重启及跨产品撤销                | `scripts/test-account-sessions.mjs`              |

验证命令：

```sh
node scripts/account-contracts.mjs --check
npm run check
npm run lint
npm test
# 显式指定本地 Auth 源码；须先在 Auth 仓库构建 Rust/WASM。
MOLIS_AUTH_SOURCE=/absolute/path/to/auth node scripts/test-central-account.mjs
MOLIS_AUTH_SOURCE=/absolute/path/to/auth node scripts/test-account-sessions.mjs
npm run build
```

本地安装使用锁定依赖 `npm ci --offline --ignore-scripts`。校验器快照的 lint 仅对该文件保留三个明确例外：`no-control-regex` 对应拒绝控制字符，`no-misused-spread` 对应合同按 Unicode 码点计长，`no-base-to-string` 对应编译阶段已检查的 Schema 字段；未改快照以适应产品 lint，摘要与全部原始夹具继续校验。格式化排除该固定快照及生成类型目录，避免重排上游字节使摘要失效。

2026-11-04 验证：`npm run check`、`npm run lint`、`npm test`（42 项，无失败/跳过）及完整 Vinext 构建通过。真实 Auth 隔离联调通过 mock 短信验证注册登录、中央令牌换取与身份核对、BFF 公开视图、资料修改及同键重试、租户列表与退出后的拒绝。只读审查发现的畸形 URL 编码已修复为 400，并补充 `%FF`/`%ZZ` 用例；回调登记同时拒绝可归一化的路径。最终代码再次通过类型检查、lint、全部 42 项测试、真实 Auth 隔离联调与完整构建。

2026-11-04 CLUB-02 验证：类型检查、全仓 lint、合同摘要检查和完整 Vinext 构建通过；`npm test` 全仓 65 项全部通过（账号相关 30 项，其中持久会话新增 23 项），无失败或跳过。两项真实 Auth / 临时 D1 集成均通过，外部短信、邮件和 OAuth 仍为 mock。新增故障证据覆盖刷新结果丢失、过期租约拒绝接管、数据库清理失败、登录提交结果丢失、同 revision 活动乱序、旧闲置期限之后持续活动的刷新、退出执行中断恢复、全局撤销迟到响应和许可取消后的新 Token 撤销。联调只回拨合成手机号的单个重发冷却计时与合成 access-token 的到期时间，不改变生产校验或全局限流规则。

测试与 mock 均为合成数据，不连接真实账号或数据库；没有迁移、支付、共享内容或真实外部服务接入的完成声明。

本次实现位于独立分支 `codex/club-01-account-foundation`，尚未提交、推送或合入主线。

## CLUB-03 页面与认证事务

`/login` 在产品内完成邮箱验证注册、密码登录、+86 验证码自动注册/登录、重发与找回。Google/GitHub 使用 BFF 发起、Auth mock 授权页及 `/account/callback` 完整回跳，回到 `/login` 的成功/取消/失败状态。`/account` 接入安全账号视图和两种退出，完整资料/绑定管理仍为 CLUB-04。

认证窄入口只接受 Product 合同。浏览器提交原始密码/码后不保存；BFF 按浏览器 Cookie、环境和登录许可绑定短时事务，加密保存 PKCE、发起/验证/重设证明。D1 版本 CAS 防止跨 Worker 重复操作，取消先撤销许可；丢失响应、过期租约及加密数据损坏不能重放认证。专用回调验证 state、提供方、原浏览器、事务状态与精确入口；不接受浏览器提交身份或 Token。

| 验收编号 | 行为与证据 |
| --- | --- |
| CLUB-03-01 | 四种认证、密码找回与中央会话采用真实 Auth，只有投递和外部提供方 mock；`scripts/test-account-authentication.mjs`。 |
| CLUB-03-02 | 跨站、错误 CSRF、字段注入、错误 state/浏览器、重复回调与取消后完成拒绝；上述集成及 `tests/account-authentication.test.mjs`。 |
| CLUB-03-03 | 跨 Worker 并发、取消竞争、过期事务/租约及损坏密文拒绝，完成/取消清空秘密；`tests/account-authentication.test.mjs`。 |
| CLUB-03-04 | Chrome 实际操作生产 LoginForm 的邮箱注册、账号退出、Google/GitHub 模拟授权，1440/1024/390 宽度无横向溢出；`scripts/test-account-browser.mjs`。 |

额外验证命令：

```sh
MOLIS_AUTH_SOURCE=/absolute/path/to/auth node scripts/test-account-authentication.mjs
MOLIS_AUTH_SOURCE=/absolute/path/to/auth MOLIS_WORK_SOURCE=/absolute/path/to/work node scripts/test-account-browser.mjs
```

浏览器脚本复用 Work 的 ChromeHarness；打包的是生产 LoginForm/CentralAccount 和真实 BFF/Auth，仅替代 Next 导航包装，路由挂载另由完整 Vinext 构建验证。截图写 `/private/tmp/club03-ui-evidence/`。它不是部署后的 Vinext 全站端到端测试。

本轮新增 `0005_central_account_transactions`，只在临时 D1 应用；旧用户、凭据、留言与 Better Auth API 保留，没有执行正式切换或真实数据库迁移。

2026-11-05 CLUB-03 验证：合同摘要、TypeScript、lint 和完整 Vinext 构建通过；全仓单元测试 68/68 通过，无失败或跳过。真实 Auth + 临时 D1 集成覆盖邮箱注册验证、密码登录/找回、手机自动注册、Google/GitHub 完整 mock 往返、取消、错误 state、错误浏览器与重复回调。真实 Chrome 通过邮箱注册、账号退出、两种第三方授权及 1440/1024/390 宽度检查；可见账号页的 OPEN 活动已接入，后台不轮询续活。所有外部服务仍为 mock，未进行真实数据库迁移或部署。

## CLUB-04 个人资料与登录方式管理

`/account` 新增昵称、PNG 头像上传/移除、已绑定方式与可登录状态、绑定/换绑/解绑、设置或修改密码。敏感操作先选择当前可用方式再次验证；当前密码不是唯一选择。新增身份另行验证，两个证明由 BFF 加密保存，页面只有事务句柄。第三方验证在独立窗口完成，原表单读取结果后确认提交。页面取消和离开会请求销毁待用事务，服务端期限与中央身份版本继续兜底。

所有敏感事务绑定原浏览器、产品登录、用户与环境；跨 Worker 保留 CAS 与不可接管的过期租约。成功写入清除操作证明，短时保存无秘密的幂等回执。重放其他键、交换目标、跨浏览器或已退出登录均拒绝。资料与绑定提交使用中央版本，不覆盖并发变更；唯一身份冲突不合并账号，解绑保护最后一种可用方式。改密由中央服务保留当前登录、撤销其他全部产品和设备，原到期时间不延长。

- **CLUB-04-01** 昵称和头像只经中央资料接口保存，版本冲突不覆盖。证明：`scripts/test-account-authentication.mjs`、`scripts/test-account-browser.mjs`。
- **CLUB-04-02** 四种当前方式均可再次验证，新增身份绑定/换绑/解绑与最后方式保护生效，冲突保留原绑定。证明：`scripts/test-account-authentication.mjs`。
- **CLUB-04-03** 原浏览器/登录绑定在 Worker 重启及 Token 刷新后保持，另一登录、缺少 CSRF、匿名和退出后拒绝；证明、密码和验证码不返回浏览器、不明文落库。证明：`tests/account-management.test.mjs`、既有事务边界测试与上述真实 Auth 联调。
- **CLUB-04-04** 使用手机和第三方再次验证可改密；当前登录保留，其他登录撤销，期限保持。证明：真实 Auth 联调；Chrome 用例实际以手机验证改密。
- **CLUB-04-05** 浏览器实际操作昵称修改、手机号及 Google 绑定、提供方回跳和改密，1440/1024/390 无横向溢出。证明：`scripts/test-account-browser.mjs`。沿用 CLUB-03 的 React/BFF/Auth 测试边界，不宣称部署后的 Vinext 全站 E2E。

本轮没有新增数据库迁移，复用会话和加密事务表；保留旧账号和业务数据，留言身份映射仍按 CLUB-08/09。短信、邮件、Google/GitHub 均继续 mock。

2026-11-05 CLUB-04 验证：类型检查、lint、合同摘要、69 项单元测试及完整 Vinext 构建通过，无失败或跳过。真实 Auth/WASM + 临时 D1 联调覆盖四种再次验证、绑定/换绑/解绑、冲突保留、最后方式保护、幂等回执与改密撤销范围；在绑定的两份证明均已取得租约后，分别取消任一证明，均拒绝向 Auth 发送写请求并清除待用证明。Chrome 实际通过昵称与 PNG 头像上传/移除、手机和 Google 绑定、授权窗口回跳、手机验证改密，以及原注册登录用例；1440/1024/390 无横向溢出。测试使用独立 Chrome 配置，不读用户浏览器资料。

资料保存期间版本读取尚未结束时触发绑定，中央会拒绝旧版本；页面现会重新读取账号状态并要求重新验证，不覆盖并发更新。初始化活动记录完成前退出按钮保持禁用，避免初始化与退出竞争。未运行部署后的 Vinext 全站 E2E，未提交、推送、部署或操作真实数据库。

## CLUB-05：租户、成员与所有权交接

状态：实现与验证已完成，外部服务继续 mock。

- **CLUB05-01** 账号页在个人空间与所属租户之间切换；分页按中央游标读取完整列表，切换卸载旧范围请求结果；停用租户仅显示最小状态，个人及其他租户可继续使用。证明：`scripts/test-account-tenants.mjs`、`tests/fixtures/account-tenants-browser.mjs`（由 `scripts/test-account-browser.mjs` 执行）。
- **CLUB05-02** 所有者、管理员可修改资料并按邮箱、+86 手机号或账号 ID 定向邀请，受邀者登录后接受或拒绝；管理者可撤销未完成邀请。邀请不提前加入、不抢占身份，未注册手机号在注册后可读取原邀请。证明：上述接口与双浏览器上下文测试。
- **CLUB05-03** 所有者任命管理员；管理员仅管理普通成员；成员/管理员退出、管理者移除按中央版本及权限检查，并由中央原子释放席位。证明：`scripts/test-account-tenants.mjs`。
- **CLUB05-04** 所有者向现有成员发起交接，对方确认后原所有者变为成员，席位保留；交接前不能退出，可撤销待接收交接。证明：接口测试及双登录 Chrome 操作。
- **CLUB05-05** 所有写入携带当前版本与幂等键；BFF 拒绝来源、CSRF、未知字段及跨租户访问；页面按角色显示操作，错误后重新读取状态；1440/1024/390 宽度无横向溢出。证明：上述接口、浏览器测试与 BFF 回归。

本批挂载固定中央合同路由；不提供平台创建/停用入口，不接支付、共享业务内容或旧账号迁移。平台操作仅用于临时数据库测试准备，真实产品平台页面仍归 CLUB-07。成员合同仅含用户 ID，当前页面据实显示 ID 和角色，未编造跨账号资料读取接口。

2026-11-05 CLUB-05 验证：类型、lint、合同摘要、69 项单元测试和完整 Vinext 构建通过。`scripts/test-account-tenants.mjs` 通过真实 Auth/BFF/临时 D1 的租户、邀请、角色、交接与席位释放联调；`scripts/test-account-browser.mjs` 通过原注册登录、资料安全及新增双账号租户流程，1440/1024/390 无横向溢出。没有新增数据库迁移，未提交、推送、部署或操作真实数据。浏览器覆盖范围同 CLUB-03/04，不包含部署后的 Vinext 全站 E2E。


## CLUB-06：订阅、席位与权益

状态：实现与验证已完成，外部服务继续 mock。

- **CLUB06-01** 个人/当前租户订阅显示套餐、有效期与中央生效状态；完整读取游标分页，普通成员仅看到自己的分配，所有者/管理员查看类型库存。证明：`scripts/test-account-billing.mjs`、`tests/fixtures/account-billing-browser.mjs`。
- **CLUB06-02** 分配使用池版本，回收/换绑使用分配版本；并发容量变化拒绝旧表单，重新读取后由用户重试，不自动替换分配。类型与容量的变更必须先回收受影响分配。证明：上述 BFF/Chrome 联调，中央 409 / CAPACITY_CONFLICT 明确断言。
- **CLUB06-03** 当前分配与结束历史分开展示；到期保留分配与占用，不能新分配/换绑，允许回收；原订阅续期沿用当前分配，已结束的不恢复。证明：`scripts/test-account-billing.mjs`（到期/续期/释放），浏览器验证到期保留与回收后的减量。
- **CLUB06-04** 权益只展示中央实际决定及个人订阅/租户席位来源，按本产品和共享功能过滤；个人来源与当前租户来源取并集，租户席位不跨范围。切换卸载旧结果，过期及服务不可用不显示已开放，刷新重新校验；不增加业务收费拦截。证明：上述接口和浏览器测试；1440/1024/390 无横向溢出。

实现挂在原账号页个人/租户范围下，使用现有 BFF、中央合同与会话/CSRF；没有新增数据库迁移、支付或共享内容。套餐目录由中央接口发布；订阅开通/变更/续期仍由 CLUB-07 的平台入口交付，本期测试通过真实中央平台 API 准备数据。仅在隔离数据库授予测试账号平台能力，商业状态由真实 API 生成。

权益的 `validUntil` 到期或页面重新获得焦点后超过期限即显示待重新校验；刷新开始清除旧决定，失败显示不可确认。超过 100 个本产品功能按合同分批查询，不拼接或比较不同请求范围的 revision，也不把界面展示当作后续业务授权凭据。


2026-11-05 CLUB-06 最终验证：TypeScript、lint、69/69 单元测试、合同摘要、页面日期、完整 Vinext 构建与 diff 检查通过。新增 BFF/Auth 联调同时覆盖先回收再减量/更换类型、成员退出后重新加入不恢复旧分配；严格断言中央 409 / CAPACITY_CONFLICT。Chrome 联调通过 CLUB-03/04/05 原流程及新增订阅、席位与权益操作，另用隔离浏览器时钟/测试传输故障验证已过期结果、上游 503 不再显示已开放，并可刷新恢复。外部服务保持 mock，未新增迁移或操作真实数据；浏览器测试边界沿用 CLUB-03 的生产 React/BFF/Auth 与导航包装替代，不表示部署后的 Vinext 全站 E2E。


## CLUB-07：平台管理入口（2026-11-05）

- **CLUB07-01** 账号页按当前平台能力展示入口；平台创建租户时指定已有账号为所有者，可停用/恢复。普通注册用户不得创建租户，平台管理不隐式加入租户或取得成员权限。证明：`scripts/test-account-platform.mjs`、`tests/fixtures/account-platform-browser.mjs`（由 `scripts/test-account-browser.mjs` 运行）。
- **CLUB07-02** 选择已发布套餐开通个人/租户订阅，管理期限、续期、数量、套餐与停用恢复；表单重读当前版本及库存，完整提交目标类型数量，保留分配限制减量，用户确认并记录原因，不接支付。证明：上述真实 BFF/Auth 与 Chrome 流程，覆盖非成员平台库存、保留期、容量冲突与回收后减量；中央原有席位回归覆盖类型删除前回收。
- **CLUB07-03** 平台订阅与席位操作记录按权限分页显示。BFF 只开放冻结路由，检查 CSRF/Origin/幂等和结构，Auth 复核实时权限；撤权后即使页面旧入口仍在也拒绝接口。证明：上述平台 API 与浏览器测试。租户身份操作日志未包含在此商业审计接口，页面不声称完整展示全部平台日志。

合同快照同步 Auth 1.1.0，新增 `GET /api/account/platform/subscriptions/{subscriptionId}/seat-pools`，对非租户成员的平台人员提供只读库存。其余平台写接口复用既有合同与中央实现。表单在 `/account` 内使用现有样式和会话，页面由同源 BFF 接入，浏览器不持有中央令牌。外部服务 mock，无数据库迁移或支付接入。

最终验证：类型、lint、69/69 单元测试、合同摘要、页面日期、完整 Vinext 构建通过。真实 BFF/Auth/D1 平台测试及 CLUB-03 至 CLUB-07 的 Chrome 流程通过；补充验证个人开通、占用席位时拒绝减量及回收后减量、非成员/停用租户库存与实时撤权。一次浏览器复验在冲突后列表尚未加载时过早点击，补充等待真实列表可操作的条件后通过，未改动产品逻辑或弱化断言。1440/1024/390 截图无横向溢出。外部服务继续 mock，未运行部署后的全站 E2E，未提交、推送或部署。

## CLUB-08：旧业务身份映射验收（2026-11-05）

状态：隔离实现与迁移演练已完成；真实存量盘点、凭据接续及切换仍依赖 AUTH-11 / D-09 / CLUB-09。

- **CLUB08-01** 迁移 `0006_light_prism.sql` 将本地用户邮箱改为可空，保留用户 ID、历史邮箱及验证状态、账号凭据、会话、留言内容与作者。全程启用外键，以 D1 事务整体重建用户及三个引用表；出现额外外键表、自定义视图/触发器或被重建表的额外索引则拒绝迁移并要求复核。证明：`tests/business-identities.test.mjs` 的逐值对照、外键、失败回滚，`scripts/test-business-identities.mjs` 的真实 workerd/D1 批事务演练。
- **CLUB08-02** `central_business_identities` 对 `(issuer, auth_user_id)` 和 `local_user_id` 双向唯一。受控离线工具先只读盘点，再接受审核记录；已有归属不改写，重复执行返回同一结果，陈旧摘要、冲突和缺少归属证据拒绝。邮箱相同不是归属证明；无邮箱新身份需单独审核，创建 NULL 邮箱用户，旧未验证邮箱不升级。证明：上述测试含两个独立数据库连接的并发争用、幂等、失败回滚和历史数据保留。
- **CLUB08-03** 留言 POST 从中央会话在线确认主体，校验同源/CSRF，再通过映射使用原 `user.id`；提交者不能指定作者或本地身份。缺少映射返回 `409 BUSINESS_IDENTITY_PENDING`，不创建替代旧身份；旧 Cookie、中央撤销、断网均不能继续写入。历史 `notes.user_id`、署名和匿名留言保留。证明：单元与真实 Rust Auth/BFF/D1 联调，新留言和重试沿用原 ID。

工具与审核文件格式见 `docs/BUSINESS-IDENTITY-MIGRATION.md`。工具只操作显式离线 SQLite 副本，没有网页认领或远程导入入口。当前站点没有展示旧留言表单，本期保留公开读取接口并更新受保护的写入接口，不新增留言页面。旧 Better Auth 其他入口仍保留到 CLUB-09；真实数据库未迁移，真实账号尚未建立映射。


最终验证：TypeScript、lint、76/76 测试、冻结合同摘要、日期检查、完整 Vinext 构建和 diff 通过。真实 Rust Auth + 独立 Club workerd/D1 迁移及留言身份专项通过；未关闭外键、未丢失旧账号/凭据/会话/留言，独立并发写入最多一个关联成功。没有生产数据库操作或部署；不表示 AUTH-11 的真实凭据接续和 CLUB-09 的旧入口切换已完成。


## CLUB-09：旧入口关闭、导航与联合验收（2026-11-05）

- **CLUB09-01** `/api/auth` 及所有子路径不再装配 Better Auth；已提供的方法统一返回 `410 AUTH_ENTRY_RETIRED`、no-store、不发 Cookie 或重定向、不读取旧凭据/DB。`/api/auth-options` GET 同样关闭。中央配置缺失不能回退旧登录，历史用户、凭据、会话行和留言保留。证明：`tests/account-cutover.test.mjs`（实际导出与拒绝读取请求），`scripts/test-account-routes.mjs`（完整构建路由），联合脚本（旧 Cookie 和历史逐值对照）。
- **CLUB09-02** 顶栏、窄屏菜单与页尾均进入中央 `/account`；匿名引导到 `/login`，登录后显示中央管理页面。页面不再调用旧账号接口；旧 Cookie 不能呈现已登录。证明：`scripts/test-account-browser.mjs` 使用实际 Header/Footer 与中央 React 页面，`scripts/test-account-routes.mjs` 验证 Vinext 挂载。
- **CLUB09-03** 与 Work 使用同一真实 Auth，重新登录保留中央 ID 和审核后的原 Club ID，更新资料互见、当前退出独立、全局撤销生效；跨产品邀请和退租户一致。中央切换/回退不复活旧会话，不删除切换后新账号、映射、留言，其他产品共享根会话仍可用。证明：`scripts/test-account-cutover.mjs`，真实 Rust/WASM/两份临时 D1/Work Home。

旧 Better Auth 服务端工厂已移除，浏览器依赖因历史评审页保留；`/demos/**` 未改。Cloudflare 构建改为要求中央配置，不再要求或输出旧认证地址。示例环境、产品说明、登录/部署与[切换验收](../../docs/ACCOUNT-CUTOVER.md)同步；不新增数据迁移、不执行远程操作。

本轮 TypeScript、lint、77/77 单元测试、冻结合同和完整构建通过。联合脚本通过上述跨端流程；Chrome 复验原 CLUB-03 至 CLUB-07 的完整账号操作及新导航，1440/1024/390 截图和横向溢出检查通过。完整 Vinext 输出在隔离 workerd 中验证旧入口读写拒绝、中央页面挂载及缺配置拒绝。

演练初期 Wrangler 流式开发代理对部分带正文请求报 Network connection lost，改用显式枚举构建模块的直接 Miniflare 请求验证，保留全部拒绝断言。退租户扩展夹具给只读查询误带幂等键，被 Work 按合同拒绝；修正测试请求后通过，未放宽产品校验。界面测试依旧不等同部署后的全站 E2E；真实 D-09、真实提供方和生产切换均未执行。后续由 AUTH-12 汇总交付矩阵。

CLUB-09 配置复验：Cloudflare 构建使用明确合成 D1 标识与中央 LOCAL/MOCK 配置，在不提供旧 Better Auth 变量时通过；没有部署。移除未被路由或评审页引用的旧账号组件，隐私说明同步当前账号数据与模拟环境事实。修改文件格式及 diff 检查通过。


## AUTH-12 联合验收与交付记录（2026-11-05）

新增 `tests/fixtures/cross-product-account.mjs`，由 `scripts/test-account-cutover.mjs` 调用，验证同一 Auth 下两端交替进行平台开通、租户读取、席位分配/回收/历史与 SHARED 权益判定，双方结果一致且 Work 本地事实保留。其 AUTH12-03 追踪编号归 Auth 交付矩阵；字段、来源及有效期仍按合同校验，不比较不同登录的时间戳相等。

本轮联合测试、77/77 单元、类型、lint、合同摘要及已有完整构建的路由挂载复验通过。没有修改 Club 产品代码/数据库迁移或界面；文档补充 v1 SDK 与 v2 Host/BFF 区别、版本与未完成项。UAS-08 帮助动线和 UAS-15 资源夹具尚需收尾；真实 D-09、正式提供方、部署及多设备验收未执行。


## K-03 登录方式丢失帮助（2026-11-05）

- **K03-02** 登录页及“登录方式与密码”区域共用“无法使用登录方式？”折叠帮助，指引仍可用方式验证换绑、邮箱找回、全部丢失找回原方式；明确无人工恢复及新账号不继承原内容。展开/收起保留表单，可继续既有注册和账号管理。证明：`scripts/test-account-browser.mjs` 中 K03-02 / UAS-08（真实 Auth/BFF、临时 D1、Chrome）。

帮助组件为 `app/_site/account-access-help.tsx`；未新增账号恢复 API，未修改历史业务身份和数据。外部提供方继续 mock。共享资源的 VIEW/DOWNLOAD 合同由 Auth `worker/rust-tests/shared-resource-fixture.ts` 与真实 Auth 场景验证，未增加 Club 共享产品路由。阶段结果由 Auth 交付记录汇总。
