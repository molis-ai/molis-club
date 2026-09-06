# 烤个梨呀 · 创造者社区

> 有些东西，值得做出来。

2026-09-06 重建。基于一骏《落地主义》《人的尺度》与 Adeptify 当前仓库，呈现作品、创作理由和参与路径。

React + Vinext + Cloudflare Workers + D1。`npm ci && npm run dev` 启动；`npm run build` 生成可部署 Worker；测试 `node --test tests/*.test.mjs`。

- `/`：作品现场、筛选、创作者与工具。
- `/works/:slug`：真实作品、成熟度、来源与持久化留言。
- `/story/idealism`、`/story/human-scale`：两篇文章正文。
- `/join`：私密参与申请。
- `db/schema.ts` / `drizzle/`：数据结构及迁移。
- [部署与成本](./DEPLOYMENT.md)：最低成本方案、限制、公开运营前缺口。

这是私有试用站（功能可用等级），尚不是具备完整账号、审核与运营的公开社区。只展示真实内容，不填充假活跃数据。旧设计不参与当前实现或部署。
