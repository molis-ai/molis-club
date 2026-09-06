# 部署与成本（2026-09-06）

## 当前交付

Molis AI 工作室前后端在本目录，部署目标为 Sites 管理的 Cloudflare Workers + D1。该站为 owner-only 私有试用，平台负责访问控制。不是面向公众开放运营的社区。产品与方案详情、两篇长文、邮箱密码账号、登录身份留言、联系表单真实工作；无需用户提供模型 API Key，不调用付费模型。

Sites 托管的账号、配额与收费由 Sites 当前政策决定，不能用 Cloudflare 自有账号的免费额度承诺 Sites 永久免费。此次没有购买域名或开通付费云服务。

## 自有账号最低运行成本方案

推荐 Cloudflare Workers Static Assets + Workers API + D1。前端静态资源由边缘网络提供，API 负责留言、申请、身份与未来审核；D1 保存结构化数据。初期图片随版本打包，不需要 R2；将来允许用户上传时才加对象存储。

| 部分 | 官方免费额度 | 何时出现额外费用 |
| --- | --- | --- |
| 静态资源 | 请求免费且不限量，无额外资产存储费 | 自定义域名注册不包含在托管里 |
| Workers | 每日 100,000 次请求，单次 CPU 10 ms | 超过免费限制可能报错；付费档 $5/月起，含每月 1,000 万次请求及 3,000 万 CPU ms，超量另计 |
| D1 | 每日读取 500 万行、写入 10 万行，总存储 5 GB | 超出免费配额不是无限使用；付费档按月额度和超量收费 |
| 登录 | 已用 Better Auth + D1；Google/GitHub待凭据 | 邮箱密码哈希需要 CPU；验证/找回邮件需另接邮件服务 |
| 域名 | 可先用平台赠送子域名 | 自定义域名按注册商报价；已有域名则不新增注册成本 |
| 通知、AI | 当前未使用 | 邮件通知、AI 生成、搜索或文件上传按实际提供商计费 |

**理论最低托管费可为 $0/月，但当前包含密码登录，不能承诺免费档足够。** Better Auth 的安全密码哈希可能超过免费 Worker 的10ms CPU上限，SSR也消耗CPU。务实预算从Workers付费档 $5/月起（域名、邮件另计），部署后按实际CPU调整；不要降低密码安全强度以迁就免费档。 这版使用服务端渲染，HTML 页面访问也会占 Workers 请求和 CPU。不能把全部页面流量当免费静态请求。为正式站进一步省成本，可以把首页/作品/文章预渲染，保留 `/api/*` 动态接口。尚未测量云端单请求 CPU，因此不保证当前 SSR 在免费档 10 ms 内。

例：每日 1,000 名访客，每人 5 次页面/API 请求，约 5,000 次 Workers 请求；每次留言列表最多 50 行，结合实际访问率通常远低于 D1 免费读额度。这是容量估算，不是真实使用数据，也不含站外服务费用。

官方依据：
- [Workers 价格](https://developers.cloudflare.com/workers/platform/pricing/)
- [静态资源价格](https://developers.cloudflare.com/workers/static-assets/billing-and-limitations/)
- [D1 价格](https://developers.cloudflare.com/d1/platform/pricing/)
- [Workers 限制](https://developers.cloudflare.com/workers/platform/limits/)

## 另两种路线

- Cloudflare 前端 + Supabase：适合希望快速获得完整身份、Postgres、对象存储和管理界面的版本。免费档可试用，但低活跃项目可能在一周后暂停；Pro $25/月起及超量。对现在的两张表，拆两个平台没有成本优势。[价格](https://supabase.com/pricing) · [暂停规则](https://supabase.com/docs/guides/platform/free-project-pausing)
- Vercel + 托管数据库：Next.js 生态成熟，但 Vercel Hobby 限个人非商业使用，这个团队品牌社区不能直接假定适用。若走商业部署需另算 Vercel 与数据库费用。[Hobby 使用边界](https://vercel.com/docs/plans/hobby)

## 从试用到公开运行需要什么

1. 确认域名与主要用户地区；用目标地区真实网络测试加载速度，国内访问质量不从国际 CDN 名称推断。
2. 自有 Cloudflare 账号与 D1 数据库；或继续用 Sites 并明确公开访问与托管额度。
3. Google/GitHub OAuth凭据、邮箱验证与找回、评论审核/举报与公开站滥用治理。现有留言已绑定真实应用账户；认证端点使用数据库限流，但不是公开运营的完整治理。
4. 为工作室合作联系建立明确的处理流程。本版申请可从 Sites 数据库查看，尚无产品内收件箱后台。
5. 隐私说明、数据删除入口、运营负责人；明确哪些未公开作品可以公开展示。当前只部署私有试用，私有仓库地址不出现在页面。
6. 迁移时移除 Sites 平台专属访问控制与插件依赖，接自己的身份层，绑定真实 D1，应用已提交迁移；测试后再切 DNS。当前代码可迁移，但没有声称一条命令就完成跨平台迁移。

## 本地开发与验证

```bash
npm ci
npm run dev
npm run db:generate       # 仅 schema 变更时
node --test tests/*.test.mjs
npx tsc --noEmit
npm run build
```

本地 D1 与线上 D1 分开；上线由 Sites 应用 `drizzle/` 迁移。不要在运行时自动建表。`applications` 是私密资料表，不增加公开读取接口。留言仅显示最近 50 条；完整分页属于后续社区产品化。

## 当前验证记录

- 生产 API 处理器 + SQLite：8 项定向行为测试通过，包括持久化、按作品隔离、重复与错误路径。
- 构建与 TypeScript：最终依赖状态已通过。生产依赖 npm audit 为 0；开发工具仍有 4 项中等风险（Drizzle 间接 esbuild 开发服务器依赖），未采用审计建议的跨版本降级。迁移工具不作为线上服务运行。
- 真实本地 HTTP：六条页面路线均 200，留言 POST 201、重复后仅一条、GET 读回通过，加入申请 POST 201。
- 浏览器：最新苔绿手绘版的桌面/390px首页、手机产品索引与登录首屏、桌面方案区已目视检查；独立审查的唯一占位文字对比度问题已修复；此前 390px 账号流程真实完成注册与退出。新增内容的完整手机长页尚未全面目视验收。
- 可发现性：服务端工程分类 4 项、工具分类 3 项、无效分类回全部 10 项；规范地址、真实方案阶段及私有 noindex/robots/sitemap 边界通过 HTTP 检查。详见 [DISCOVERY.md](./DISCOVERY.md)。
- 认证HTTP+D1：注册、重复邮箱/错误密码拒绝、HttpOnly Cookie、刷新会话、改密及其他会话撤销、退出再登录、作者不能冒名、跨站请求拒绝均通过。
- 没有接模型 API、购买域名或开通付费套餐。

## Molis AI 品牌版

站点已改名，URL标签为 molis-ai，仍为同一私有Site与同一D1。生产认证只配置 `BETTER_AUTH_SECRET`（secret）和 `BETTER_AUTH_URL`；Google/GitHub尚无外部凭据。追加迁移 `0001_nebulous_power_man.sql` 保留历史留言和申请。账号接入详见 [AUTH-SETUP.md](./AUTH-SETUP.md)。
