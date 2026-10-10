'use client';
import Link, { useEditionPath } from '../edition-link';
import { authClient } from '../../lib/auth-client';
import { Header, Footer } from '../shell';
import { useAccountActions } from './use-account';
export default function Account() {
  const editionPath = useEditionPath();
  const { data, isPending, error: sessionError } = authClient.useSession();
  const { busy, message, error, change, logout } = useAccountActions(
    editionPath('/login'),
  );
  return (
    <>
      <Header />
      <main className="account-page" id="main">
        {isPending ? (
          <output>正在读取账号…</output>
        ) : sessionError ? (
          <>
            <h1>暂时无法读取账号。</h1>
            <p>请检查连接后刷新页面重试。</p>
          </>
        ) : !data ? (
          <>
            <h1>先登录，再继续。</h1>
            <Link className="button primary" href="/login">
              登录 / 注册
            </Link>
          </>
        ) : (
          <>
            <h1>你好，{data.user.name}。</h1>
            <p className="account-email">
              {data.user.email}
              <span>
                {data.user.emailVerified ? '邮箱已验证' : '邮箱尚未验证'}
              </span>
            </p>
            {!data.user.emailVerified && (
              <p className="form-caption">
                试用阶段暂未配置验证邮件，账号不会显示为已验证。
              </p>
            )}
            <div className="account-actions">
              <Link className="text-link" href="/products">
                继续看作品
              </Link>
              <button className="text-button" onClick={logout} disabled={busy}>
                退出登录
              </button>
            </div>
            <section className="password-section">
              <h2>修改密码</h2>
              <p>使用邮箱密码注册的账号，可在这里更新密码。</p>
              <form onSubmit={change}>
                <label className="field">
                  <span>当前密码</span>
                  <input
                    type="password"
                    name="current"
                    autoComplete="current-password"
                    required
                    maxLength={128}
                  />
                </label>
                <label className="field">
                  <span>新密码</span>
                  <input
                    type="password"
                    name="new"
                    autoComplete="new-password"
                    required
                    minLength={12}
                    maxLength={128}
                  />
                </label>
                <button className="button primary" disabled={busy}>
                  {busy ? '请稍候…' : '保存新密码'}
                </button>
              </form>
              <output className="feedback success">{message}</output>
            </section>
            <p role="alert" className="feedback error">
              {error}
            </p>
          </>
        )}
      </main>
      <Footer />
    </>
  );
}
