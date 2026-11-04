# Molis AI

<!-- impeccable:product-schema 1 -->

## Platform
web

## Product Purpose
Molis AI 是一间围绕工作、生活与体验研发 AI 产品的工作室。官网介绍工作室和五件产品（Molis Work、Tool、Life、Story，以及概念中的 World），也接住企业合作、社区分享与联系。文案事实以 `docs/studio-intro.md` 为准。

## Users
想了解 Molis 在做什么、口味是否相投的访客；想持续推进工作、处理手边材料、照顾生活或进入一段体验的潜在用户；想把 AI 用进业务的企业团队；愿意试作品、带走方法、再带作品回来的创作者与开发者。

## Operating Context
桌面与移动 Web，中文为主。目前为 owner-only 私有 Sites 试用，不公开收录。未开放的产品、OAuth 与邮件功能不冒充可用；下载、安装入口只给真实存在的（Molis Work 源代码与从源码构建说明；社区里 DropAgent 的公开发布）。

## Capabilities and Constraints
信息架构见 `specs/site-rebuild/spec.md` 第 3 节：首页；五个产品页（`/work` `/tool` `/life` `/story` `/world`，每页一个标志性交互，演示一律标示意）；企业合作（`/enterprise`，问题 → 合作路径上的建议起点，末尾表单）；社区（`/community` 与方法目录 `/community/methods`，艺术家 Skill 可下载、网页与动效可复制 Prompt）；关于我们、团队、文章（《人的尺度》《落地主义》）、沿途（附录 A 的具体尝试）；联系（`/contact`，按 `?topic=` 预选来意）；登录 / 注册、账号、隐私、404。
联系表单写进现有 `/api/join` 私密收件箱，不公开展示，目前不会自动回信；邮箱密码账号，未配置验证邮件与找回密码；Google / GitHub 登录只在配置了凭据时出现。账号页预留「关注的产品进展、我的分享、留言记录」，能力上线前不显示。旧版作品页的公开留言不在新站露出，接口与表保留。旧地址全部重定向到新页面（`next.config.ts`）。

## Brand Commitments
网页品牌始终是 Molis AI；只有 GitHub 仓库、npm 包和本地目录使用 molis-club。原图形 Logo 不改像素。视觉为「一间开着窗的白房子」：近白的纸、细字、1px 线、留白，配图当窗；只用 Logo 杏橙一种强调色。详见 `DESIGN.md`。

## Evidence on Hand
`docs/studio-intro.md`（2026-10-15 版）是文案与产品阶段的唯一依据；新站文案在 `content/site/`，`tests/site-copy.test.mjs` 核对原句。旧 `content/folio-*`、`content/molis-*` 等留给 `/demos` 评审页。

## Product Principles
技术，回到人的尺度；判断归人；诚实说明做到了哪里；不伪装可用，不假活跃；把做法随作品一起分享。

## Accessibility & Inclusion
每页一个 h1；键盘可达与可见焦点；原生滚动不劫持；无 JS 内容可读；演示与视频可暂停，减少动态时停在完整结果；移动端可读、可用表单；文章可干净打印。
