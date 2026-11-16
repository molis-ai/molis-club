# 登录一致性 P1

状态：本地测试与构建通过，GitHub CI 验证中；尚未部署。

## Task list

- [x] 使用 Auth `docs/unified-account/login-p1.md` 的统一登录行为规范；产品独立持有会话。
- [x] 真实 Auth WASM/D1 与 Club BFF 联调：密码、邮箱、手机号、Google/GitHub、错误凭据、取消、重放及迟到操作保持安全边界。
- [x] Club 已有的绑定回调完成、事务 GET 只读语义保留，Auth 对齐。
- [x] 能力接口绑定服务端客户端配置，登录页面仅渲染可用入口；能力读取失败显示错误，不能启用登录。
- [x] GitHub Actions 固定 Auth 提交并核对六份合同、版本、来源、摘要与生成类型，随后执行类型检查、lint、测试、Cloudflare 构建及真实 Auth 联调。

## 证据与边界

本地 `npm run check`、`npm run lint`、79 项测试、`npm run build:cloudflare` 及 `scripts/test-account-live-login.mjs` 通过。CI 实际结果记录于 PR；联调拦截外部邮件、短信和 OAuth，不发送真实消息，不等于生产提供方验收。

Auth 先发布 1.3.0 的能力接口，消费者随后发布。来源固定于 `lib/account/contracts/snapshot.json`，不追随移动的 main；新消费者连接旧 Auth 时明确失败。共享 SDK、弹窗事件通知及 SSO 扩展不属于本次 P1。
