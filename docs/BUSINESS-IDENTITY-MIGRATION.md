# Club 业务身份映射

本阶段交付离线盘点/审核工具、D1 迁移和新留言身份入口；真实存量尚未盘点。AUTH-11 已提供只读工具、切换/回退方案和合成演练；真实密码格式、供应商稳定标识、验证状态及重复账号仍须按 D-09 盘点确认，才能制定实际接续和批量切换。这里不按邮箱自动认领，也不删除旧账号。

## 数据和请求合同

`central_business_identities` 将 `(issuer, auth_user_id)` 唯一映射到原 `user.id`，本地 ID 也只能有一个中央关联。映射行记录证据类型、证据引用、审核人/时间、源摘要和决定摘要；本期不提供替换、删除或网页导入操作。历史用户资料、凭据和 `notes` 不随映射改写。

留言写入仍是 `POST /api/notes`，正文 `id`（UUID）、`work`、`body` 沿用现有合同；作者从在线中央会话读取，再由映射确定本地用户 ID。客户端携带 Club HttpOnly 会话 Cookie、同源 Origin 及 `/api/account/session` 返回的 `X-CSRF-Token`。旧 Cookie 不作为凭据，缓存身份不能授权写入；无映射为 `409`，JSON 包含 `code: BUSINESS_IDENTITY_PENDING` 和可显示的 `error`。其他认证失败沿用中央 BFF 错误封套，成功与留言重试维持 `201`。

## 隔离演练步骤

1. 实际迁移时另行获准取得受控数据库副本和中央身份归属证据；本轮只使用合成数据。只在副本上执行 `node scripts/business-identities.mjs inventory /absolute/path/copy.sqlite`，该命令只读，支持迁移前和迁移后结构。输出账号 ID、邮箱存在/可信标记、提供方类型、密码格式分类、旧会话/留言数量与摘要，不输出邮箱、密码哈希、令牌、提供方 subject 或留言正文。UNKNOWN 类型保持待复核，不猜算法。
2. 在隔离 D1 按迁移日志应用 `0006_light_prism.sql`，由迁移事务保持原子性。它复制用户及 account/session/notes 三张引用表，保留每个字段，并把用户邮箱改为可空。不会关闭外键；发现其他含 REFERENCES 的表、自定义视图/触发器或被重建表的额外索引即拒绝，先审核新增关系。不要在生产逐句手动执行；真实迁移须按 Auth 仓库的账号迁移方案审核备份、回退和切换范围。
3. 审核人员核对原身份与中央主体，生成下面的决定文件。在副本上运行 `node scripts/business-identities.mjs apply-reviewed /absolute/path/copy.sqlite /absolute/path/decision.json`。工具拒绝 `.wrangler` 路径，不连接远程服务。决定文件是可信运维输入，不能接受浏览器提交；`VERIFIED` 是人工审核记录，不表示该工具验证了密码或第三方授权。
4. 复查历史值、外键和唯一约束，再通过隔离中央登录测试留言归属和撤销。实际 D1 导入执行留到真实存量审核后的迁移任务，不能把本地副本上的结果视为已迁移生产。

LINK 决定文件的所有字段必填，多余字段拒绝：

```json
{
  "formatVersion": 1,
  "mode": "LINK",
  "issuer": "http://127.0.0.1:8787",
  "authUserId": "reviewed-central-user-id",
  "localUserId": "original-local-user-id",
  "status": "VERIFIED",
  "evidence": "REVIEWED_OWNER_PROOF",
  "evidenceReference": "review-record-id",
  "reviewedBy": "operator-id",
  "reviewedAt": "2026-11-05T00:00:00.000Z",
  "sourceDigest": "replace-with-64-character-sourceDigest-from-inventory",
  "displayName": null
}
```

LINK 的 evidence 只接受 `VERIFIED_EXISTING_LINK`、`VERIFIED_CREDENTIAL`、`REVIEWED_OWNER_PROOF`，须在引用的受控记录中保留审核依据。摘要覆盖该原账号、凭据、会话和留言；审核后数据变化须重新审查。PENDING / CONFLICT、单凭同邮箱均不导入，原数据保留。

确认为全新身份时用 `mode: NEW`、`evidence: REVIEWED_NEW_IDENTITY`、新的本地 ID 与昵称，`sourceDigest` 使用整份盘点的 `inventoryDigest`；这是另一个受控运维决定，不是中央 `MigrationMapping` 的新枚举。创建用户和映射在同一事务，email 为 NULL、email_verified 为 false。不能为绕过待处理旧身份而选 NEW。本期新账号也需明确建立映射后才能写旧留言业务。

同一决定重复执行返回 `ALREADY_APPLIED`；双向任一关联冲突拒绝，不替换归属。CLI 没有解关联/删除命令；真实迁移的纠错和回退按 Auth 账号迁移方案另行审核。

## 验证

`node --test tests/business-identities.test.mjs` 覆盖逐值保留、失败回滚、双向唯一和并发争用。`MOLIS_AUTH_SOURCE=/absolute/path/auth node scripts/test-business-identities.mjs` 使用真实 Rust Auth、独立 Club workerd/D1 与生产处理器，外部提供方为 mock；只创建临时数据库，无远端副作用。

CLUB-09 已关闭旧 Better Auth 服务端入口，旧 Cookie 不参与认证。联合演练验证重新登录后的新留言仍使用原本地用户 ID，回退保留新旧留言和映射。回退须保留入口关闭及当前数据库结构，不重新启用旧 Cookie 或执行破坏性降级；见[账号切换验收](ACCOUNT-CUTOVER.md)。
