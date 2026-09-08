import { Header, Footer } from '../shell';
export default function Privacy() {
  return (
    <>
      <Header />
      <main className="reading" id="main">
        <h1>隐私说明</h1>
        <p className="reading-meta">2026 年 9 月 6 日 · 私有试用版</p>
        <article className="prose">
          <h2>账号与作品反馈</h2>
          <p>
            Molis AI 由 Adeptify
            团队运营。邮箱注册会保存你的显示名、邮箱和经过单向加密处理的密码。登录时还会记录会话、IP
            地址和浏览器信息，用于保持登录及限制异常请求。密码不会以明文保存。
          </p>
          <p>
            当 Google 或 GitHub
            登录开放后，我们只请求基本身份信息：账号标识、显示名、头像与邮箱。不申请读取
            Gmail 邮件或代码仓库的权限。当前第三方登录尚未开放。
          </p>
          <h2>哪些内容会被看见</h2>
          <p>
            你在作品下提交的反馈及显示名，会被能够访问本站的人看见。邮箱、密码与会话不会公开。联系表单内容仅供团队了解想法和联系你。
          </p>
          <h2>存储与控制</h2>
          <p>
            资料由本站所用的 Sites / Cloudflare
            基础设施存储和处理，可能位于你所在地区以外。我们不出售账号资料，不使用广告追踪工具。维持登录所需的
            Cookie 会保存在你的浏览器中，退出时对应会话会被撤销。
          </p>
          <p>
            当前没有自动发送验证或密码找回邮件。需要删除账号、留言或申请资料时，请通过邀请你试用的原渠道联系一骏或
            Adeptify 团队。公开发布前会提供独立联系入口和更完整的账户管理。
          </p>
        </article>
      </main>
      <Footer />
    </>
  );
}
