# Molis AI

一个保持好奇的 AI 创作工作室。当前网站保留10 个产品、3 项方案和一骏《落地主义》《人的尺度》，以冷银白底、海军蓝文字与雾蓝银灰光影呈现。

React / Vinext + Cloudflare Workers + D1 + Better Auth。功能可用的私有试用版本；第三方 OAuth 等待外部凭据。

- `/`：工作室、三条产品线、Solutions、文字入口。
- `/products`：10 个产品，可按情绪与体验、轻量工具、AI 与工程效率筛选。
- `/solutions`：Content Growth、Evrik、Aether 三项业务方案。
- `/works/:slug`：作品事实、当前成熟度、登录后的持久化反馈。
- `/story/idealism`、`/story/human-scale`：原文。
- `/login`、`/account`：邮箱注册/登录、会话、退出、修改密码。
- `/join`：私密联系表单；`/privacy`：当前数据使用说明。
- `/api/auth/*`：Better Auth；未配置提供商时按钮禁用。

本地先运行 `npm ci`，在忽略文件 `.dev.vars` 配置 `BETTER_AUTH_SECRET`（至少32字符随机值）与 `BETTER_AUTH_URL=http://localhost:3000`，再应用 `drizzle/` 中按序的迁移到本地 D1。`npm run dev` 启动，`npm run build` 构建。

验证：`npx tsc --noEmit`、`node --test tests/*.test.mjs`；本地服务运行后 `node tests/auth-http.mjs` 验证真实认证与D1持久化，使用仅本地测试账号。

[部署、费用与限制](./DEPLOYMENT.md) · [Google/GitHub配置步骤](./AUTH-SETUP.md)

[产品线分类与依据](./PRODUCT-LINES.md)

网站的浏览路径、SEO / GEO 准备和公开后流量验证见 [DISCOVERY.md](./DISCOVERY.md)。目前保留私有 noindex，尚未提交搜索收录。
