# WORK-09 / CLUB-09 切换与联合验收

状态：2026-11-05，产品旧入口关闭、旧凭据隔离和合成数据联合演练已完成。没有读取真实 Home、数据库或浏览器凭据，没有部署、执行生产迁移或接入真实外部服务。

## 当前行为

Club 顶栏、窄屏菜单和页尾的「我的账号」均进入 `/account`，未登录时由账号页进入 `/login`。两端使用各自产品内表单和同一个中央账号；既有登录状态不自动沿用。

Club 的 `/api/auth` 及其所有子路径返回 `410 AUTH_ENTRY_RETIRED`；`/api/auth-options` 的 GET 同样返回 410，其余未提供的方法由框架拒绝。旧注册、登录、改密、绑定、退出和提供方回调不能继续创建另一套账号。处理器不读取请求凭据、不调用数据库、不重定向凭据正文。中央配置缺失返回配置错误，不能恢复 Better Auth。

旧 user、account、session 和 notes 记录继续保留。旧 Cookie 不作为中央身份；通过审核映射后，新留言仍使用原本地 user ID。未知密码和未经验证的旧邮箱不自动升级为可用凭据，同邮箱不构成归属证明。详见[业务身份映射](BUSINESS-IDENTITY-MIGRATION.md)。

Work 复用现有中央会话独立命名和 Host 验证机制，不新增 personal 凭据读取器。旧 SecretStore 项、native capability 和浏览器 Cookie 不能恢复中央登录，旧回调与重启前事务句柄不能完成登录；新登录加密持久化，重启在线核验，刷新不增加用户活动。普通退出只结束当前登录，全部退出由中央撤销后续受保护访问。

Work 的登录、换号、离线、退出、退租户及切换回退均保留 Home、本地项目、内容和 `LOCAL_PERSON_ACTOR_ID`。没有将本机内容上传或迁入租户共享空间。

## 可复现证据

先分别构建 Auth WASM 和 Work（使用 Work 官方 Node/Swift 工具链），再在此 Club 检出运行：

```sh
MOLIS_AUTH_SOURCE=/absolute/path/to/auth \
MOLIS_WORK_SOURCE=/absolute/path/to/molis-work \
node scripts/test-account-cutover.mjs

MOLIS_AUTH_SOURCE=/absolute/path/to/auth node scripts/test-account-browser.mjs
npm run build
node scripts/test-account-routes.mjs
```

Work 构建及浏览器/联合测试遵守其机器时段规则；不并发启动同类测试批次。路径指向包含当前实现的检出，不能用只有基础提交的旧构建。

| 证据 | 覆盖范围 |
| --- | --- |
| Work `tests/security-invariants-account-host.test.ts` 的 WORK09-01 | 合成旧 personal SecretStore、native 文件、Cookie 均不能发起或复活中央会话；新会话恢复，退出重启仍匿名，旧文件未改写 |
| `tests/account-cutover.test.mjs` 的 CLUB09-01 | 调用实际旧路由的所有导出；读取请求任何属性即失败，确保不消费旧凭据或引入 DB/旧认证运行时 |
| `scripts/test-account-cutover.mjs` | 同一真实 Auth/WASM、Work Host 与 Club BFF，独立临时 D1 和 Home；审核映射、两端同主体/资料一致、刷新/重启、换号/离线/退出/退租户保持本地事实，原 ID 新写留言；Auth 切换回退后新账号、新旧留言与映射保留，其他产品共享 v1 根会话继续有效 |
| `scripts/test-account-browser.mjs` | 实际 React Header/Footer、登录与管理页，旧 Cookie 不登录；桌面入口到匿名账号再到注册、登录后到管理；原 CLUB-03 至 CLUB-07 流程，1440/1024/390 宽度 |
| `scripts/test-account-routes.mjs` | 完整 Vinext 构建输出在 workerd 中实际挂载；旧接口读写请求拒绝，中央页面和导航存在，缺配置拒绝且无回退。空临时 D1，不加载 `.dev.vars`，禁止外部 fetch |

联合演练复用 AUTH-11 的 synthetic seed、受审切换和回退函数；这些工具仅接受合成标记和 LOCAL/MOCK 环境，不是生产迁移执行器。演练中权限、账号与审核证据均为合成，不能据此宣称真实账号已核实。测试结束清理自身进程和临时目录，日志中的预期拒绝不包含凭据。

## 回退约束与未完成项

实际切换顺序以 Auth 仓库 `docs/unified-account/account-migration-plan.md` 为准。产品回退须继续保留旧入口关闭、旧 Cookie 不接受及当前数据库结构；不能直接部署重新开放 Better Auth 的旧版本。新 Client 停用后应维持受影响入口不可用并向前修复，不能将重新启用旧写入口作为恢复手段。

不恢复已撤销 Token，不用旧备份覆盖新事实，不删除审核映射或将邮箱恢复成 NOT NULL。Work 不删除旧 SecretStore 项或 Home；中央回退不得撤销其他产品共享根会话。

真实 D-09 仍待盘点：实际部署/迁移日志、旧密码格式与未验证邮箱接续、真实提供方稳定身份、全部 Web/桌面 Client 和旧 TEAM。正式域名、真实投递/提供方、CI Full、Tauri 安装包及部署后全站 E2E 分开验收。本轮结果只证明上述本地合成场景。AUTH-12 已在 Auth 仓库 `docs/unified-account/` 汇总验收矩阵、版本与交付记录，真实切换仍须独立审核。


AUTH-12 在原联合脚本中补充 `tests/fixtures/cross-product-account.mjs`：同一账号从 Work 创建租户/租户订阅、从 Club 开通个人订阅/分配席位，两端核对历史与 SHARED 权益，回收/停用后的另一端重读反映变化。独立会话的 validUntil 分别验证，不跨登录比较到期时刻相等。本轮联合、77 项单元、类型/lint/合同与构建路由复验通过；没有重跑所有页面或部署流程。
