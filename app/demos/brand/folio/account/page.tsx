'use client';
import Link from 'next/link';
import { authClient } from '../../../../../lib/auth-client';
import { useAccountActions } from '../../../../account/use-account';
import { AuthPage } from '../auth';
import { HOME, LOGIN } from '../shared';

// Folio 的账号页：问候、邮箱、回到首页与退出登录，修改密码收在下面。逻辑与旧版账号页共用。

export default function FolioAccount() {
  const { data, isPending, error: sessionError } = authClient.useSession();
  const { busy, message, error, change, logout } = useAccountActions(LOGIN);
  return (
    <AuthPage account>
      <section className="fa-account">
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
            <div className="fo-actions">
              <Link className="fo-btn fo-btn-ink" href={LOGIN}>
                登录 / 注册
              </Link>
            </div>
          </>
        ) : (
          <>
            <h1>你好，{data.user.name}。</h1>
            <p className="fa-email">
              {data.user.email}
              <span>
                {data.user.emailVerified ? '邮箱已验证' : '邮箱尚未验证'}
              </span>
            </p>
            {!data.user.emailVerified && (
              <p className="fa-note">
                试用阶段暂未配置验证邮件，账号不会显示为已验证。
              </p>
            )}
            <div className="fo-actions">
              <Link className="fo-btn fo-btn-ink" href={HOME}>
                回到首页
              </Link>
              <button
                type="button"
                className="fo-btn fo-btn-ghost"
                onClick={logout}
                disabled={busy}
              >
                退出登录
              </button>
            </div>
            <details className="fa-password">
              <summary>修改密码</summary>
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
                <button className="fo-btn fo-btn-ink" disabled={busy}>
                  {busy ? '请稍候…' : '保存新密码'}
                </button>
              </form>
              <output className="fa-success">{message}</output>
            </details>
            <p role="alert" className="fa-error">
              {error}
            </p>
          </>
        )}
      </section>
    </AuthPage>
  );
}
