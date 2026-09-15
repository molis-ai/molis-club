# molis-club 项目事实

- 单一 React / Vinext 应用，源码位于仓库根目录；无旧版静态原型目录。
- 网页品牌始终为 Molis AI；仅 npm 包、GitHub 仓库和本地目录为 molis-club，仓库更名不授权修改对外品牌。
- 项目范围见 PRODUCT.md，视觉见 DESIGN.md，整站当前任务规格见 specs/studio-flow/spec.md；目录更名历史见 specs/molis-club/spec.md。
- 命令：npm run dev、npm run check、npm test、npm run build；本地服务运行后 npm run test:http。
- 真实凭据在忽略文件 .dev.vars；勿提交或输出。保留 .wrangler/state 本地数据，勿作为缓存清理。
- .openai/hosting.json 绑定现有私有 Sites 项目；继续复用，不新建项目或数据库，不为部署扩大访问范围。
- db/schema.ts 与 drizzle/ 是数据事实；数据库标识不能仅因品牌重命名而改写。
- 产品事实来自 content/，原文不随品牌调整改写；尚未开放的产品、OAuth 与邮件功能不得伪装可用。
- 旧版设计与方案已在 Git 历史中，不再添加 archive 副本回工作树。

- 图片经过本地压缩，使用声明尺寸的原生 img 和按需 lazy；部署不依赖 Next 图片优化服务，因此仅关闭 nextjs/no-img-element 规则。
