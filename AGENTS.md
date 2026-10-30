# molis-club 项目事实

- 单一 React / Vinext 应用，源码位于仓库根目录；无旧版静态原型目录。
- 网页品牌始终为 Molis AI；仅 npm 包、GitHub 仓库和本地目录为 molis-club，仓库更名不授权修改对外品牌。
- 项目范围见 PRODUCT.md，视觉见 DESIGN.md（其中「常驻约束」一节是文字、目录、入口与滚动的硬规矩，改页面前先读），整站当前任务规格见 specs/site-rebuild/spec.md；文案事实以 docs/studio-intro.md 为准，原句不改写，「内部编辑备注」不对外。目录更名历史见 specs/molis-club/spec.md。
- 正式官网在 app/(site)，站点公共模块在 app/_site，新站文案在 content/site；/demos/** 是评审页，不动，新站不从 /demos 引用代码。根布局与 app/globals.css 同时服务评审页。
- 命令：npm run dev、npm run check、npm run lint、npm test、npm run build；本地服务运行后 npm run test:http。改了页面后运行 npm run dates 更新「本页最近修改」；换配图后运行 npm run media。
- 真实凭据在忽略文件 .dev.vars；勿提交或输出。保留 .wrangler/state 本地数据，勿作为缓存清理。
- .openai/hosting.json 绑定现有私有 Sites 项目；继续复用，不新建项目或数据库，不为部署扩大访问范围。
- db/schema.ts 与 drizzle/ 是数据事实；数据库标识不能仅因品牌重命名而改写。认证、联系表单（/api/join）、留言接口的后端行为不随页面改。
- 产品事实来自 docs/studio-intro.md 与 content/；尚未开放的产品、OAuth 与邮件功能不得伪装可用；演示一律标「示意」。
- 旧版设计与方案已在 Git 历史中，不再添加 archive 副本回工作树；旧地址在 next.config.ts 里重定向。
- 开发流程：main 是唯一主线。每件事从 main 拉一个短分支，在 .claude/worktrees/ 下的独立副本里做，验收后合回 main，再删掉分支和副本；main 所在的文件夹只用来看最新版、合并、推送，不在里面开发。推送、删除分支或副本、关闭 PR 之前先问负责人。.claude/launch.json 是各自本机的预览配置，不进 Git。

- 图片经过本地压缩（scripts/site-media.mjs 输出 public/site/ 的 WebP 与 app/_site/media.json；视频用 scripts/encode-video.swift），使用声明尺寸的原生 img 和按需 lazy；部署不依赖 Next 图片优化服务，因此仅关闭 nextjs/no-img-element 规则。

- Avoid unnecessary secondary labels and descriptions. Let the layout do the explaining
