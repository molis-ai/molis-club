# Molis AI 登录配置

## 是否需要公司

Google 与 GitHub 的普通网站登录可由个人创建，不以成立公司为前提。Google 公开发布需要符合身份/品牌与域名验证要求；仅请求 openid、email、profile，避免 Gmail 邮件权限等敏感范围。是否要求进一步审核由 Google 控制台最终显示决定。GitHub OAuth App 可以归个人或拥有管理权限的组织。

## 当前已完成

邮箱注册、登录、7天会话、退出、当前密码确认后改密并撤销其他会话；密码由 Better Auth 处理。账号邮箱未验证，暂不发送验证/找回邮件。Google、GitHub 的服务端接入和回调路径已就绪，未配置时界面明确显示“待开放”。不根据未经验证的邮箱自动合并不同登录方式的账号。

当前地址：https://molis-ai.yijunw0212.chatgpt.site
这是仍受 Sites 的 ChatGPT 私有门禁保护的预览。正式面向陌生访客前，必须把访问范围和最终域名一起确定。Google 的品牌验证通常需要你能验证所有权的自有域名；不能假设平台共享域名可由你完成所有权验证。

## Google

1. 使用你的 Google 账号进入 Google Cloud Console，创建项目。
2. Google Auth Platform 中配置 Branding、Audience（External），设置应用名 Molis AI、支持邮箱与开发者联系邮箱。测试阶段添加实际测试用户。
3. Data Access 只保留身份信息所需 openid、email、profile，不加 Gmail 邮件读取权限。
4. 创建 Web application OAuth client。Authorized JavaScript origins 填最终站点 origin。当前预览可用 `https://molis-ai.yijunw0212.chatgpt.site`；Authorized redirect URI 填 `https://molis-ai.yijunw0212.chatgpt.site/api/auth/callback/google`。
5. 将 Client ID 与 Client secret 通过 Sites 的环境变量设置分别保存为 `GOOGLE_CLIENT_ID`、`GOOGLE_CLIENT_SECRET`，Secret 标为秘密。不要贴到聊天、源码或 Git。
6. 正式公开前设置公开首页、隐私政策/服务条款、域名所有权；按控制台提示完成品牌验证/发布。之后部署并在真实浏览器测试授权→回调→账号页→退出。

## GitHub

1. GitHub Settings → Developer settings → OAuth Apps → New OAuth App。可在个人账号下创建；团队长期运营也可归组织。
2. Application name: Molis AI；Homepage URL: `https://molis-ai.yijunw0212.chatgpt.site`。
3. Authorization callback URL: `https://molis-ai.yijunw0212.chatgpt.site/api/auth/callback/github`。
4. 生成 Client secret，保存 `GITHUB_CLIENT_ID` 和秘密 `GITHUB_CLIENT_SECRET` 到 Sites 环境变量。无需 repo 代码仓库权限。
5. 部署后真实完成一次授权往返。正式域名变化时同步改回调、Homepage 和 `BETTER_AUTH_URL`。本地测试宜独立建 OAuth App。

## 额外依赖与费用

创建普通 OAuth 客户端本身不需要购买公司资质，也不意味着要开通付费云套餐。本项目没有购买域名或付费服务。域名注册、托管和邮件发送分别计费；邮件服务尚未选择。不要为了在免费 Workers 上运行而降低密码哈希强度；应实测 CPU 或使用付费计算/托管身份。

公开前另需公开的联系渠道与正式隐私/使用条款、删除账号路径、邮箱验证/找回邮件、滥用治理。当前私有版隐私页已准确描述现有行为，不冒充已经完成这些功能。

依据（2026-09-06）：
- [Google OAuth policies](https://developers.google.com/identity/protocols/oauth2/policies)
- [Google brand verification](https://developers.google.com/identity/protocols/oauth2/production-readiness/brand-verification)
- [GitHub 创建 OAuth App](https://docs.github.com/en/apps/oauth-apps/building-oauth-apps/creating-an-oauth-app)
- [Better Auth Google](https://better-auth.com/docs/authentication/google)
- [Better Auth GitHub](https://better-auth.com/docs/authentication/github)
