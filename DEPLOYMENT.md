# 部署与成本（2026-09-06）

## 当前交付

社区前后端在本目录，部署目标为 Sites 管理的 Cloudflare Workers + D1。该站为 owner-only 私有试用，平台负责访问控制。不是面向公众开放运营的社区。六件作品详情、两篇长文、留言、参与申请真实工作；无需用户提供模型 API Key，不调用付费模型。

Sites 托管的账号、配额与收费由 Sites 当前政策决定，不能用 Cloudflare 自有账号的免费额度承诺 Sites 永久免费。此次没有购买域名或开通付费云服务。

## 自有账号最低运行成本方案

推荐 Cloudflare Workers Static Assets + Workers API + D1。前端静态资源由边缘网络提供，API 负责留言、申请、未来的身份与审核；D1 保存结构化数据。初期图片随版本打包，不需要 R2；将来允许用户上传时才加对象存储。

| 部分 | 官方免费额度 | 何时出现额外费用 |
| --- | --- | --- |
| 静态资源 | 请求免费且不限量，无额外资产存储费 | 自定义域名注册不包含在托管里 |
| Workers | 每日 100,000 次请求，单次 CPU 10 ms | 超过免费限制可能报错；付费档 $5/月起，含每月 1,000 万次请求及 3,000 万 CPU ms，超量另计 |
| D1 | 每日读取 500 万行、写入 10 万行，总存储 5 GB | 超出免费配额不是无限使用；付费档按月额度和超量收费 |
| 登录 | 后续可用 GitHub OAuth，无需自行寄密码邮件 | 必须创建 OAuth App，保存客户端密钥与安全会话；本版未实现 |
| 域名 | 可先用平台赠送子域名 | 自定义域名按注册商报价；已有域名则不新增注册成本 |
| 通知、AI | 当前未使用 | 邮件通知、AI 生成、搜索或文件上传按实际提供商计费 |

**最低托管费可以是 $0/月，条件是符合免费额度；不是所有规模都免费。** 这版使用服务端渲染，HTML 页面访问也会占 Workers 请求和 CPU。不能把全部页面流量当免费静态请求。为正式站进一步省成本，可以把首页/作品/文章预渲染，保留 `/api/*` 动态接口。尚未测量云端单请求 CPU，因此不保证当前 SSR 在免费档 10 ms 内。

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
3. GitHub OAuth、经过验证的作者身份、授权检查、评论审核/举报、滥用限流；当前署名留言只适合受访问控制的试用站。
4. 创作者资料、作品提交/审核、关注与更新回访、团队收件箱后台，组成正式社区功能闭环。本版申请可从 Sites 数据库查看，尚无产品内审核后台。
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

- 生产 API 处理器 + SQLite：7 项定向行为测试通过，包括持久化、按作品隔离、重复与错误路径。
- 构建与 TypeScript：最终依赖状态已通过。生产依赖 npm audit 为 0；开发工具仍有 4 项中等风险（Drizzle 间接 esbuild 开发服务器依赖），未采用审计建议的跨版本降级。迁移工具不作为线上服务运行。
- 真实本地 HTTP：六条页面路线均 200，留言 POST 201、重复后仅一条、GET 读回通过，加入申请 POST 201。
- 浏览器：桌面首页和 390px 移动布局已目视检查；筛选从 6 件变为 2 件，详情跳转和表单真实提交成功，已恢复窗口尺寸。
- WebMCP：提供作品分类工具；浏览器不支持时跳过注册，不影响普通操作。当前浏览器工具未提供可调用的 WebMCP 验证接口，未完成该项工具调用验收；普通界面功能已验证。
- 没有接模型 API、购买域名或开通付费套餐。
