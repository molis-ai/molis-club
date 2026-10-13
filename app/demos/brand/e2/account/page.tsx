'use client';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { folioAccount, folioStudio } from '../../../../../content/folio';
import { authClient } from '../../../../../lib/auth-client';
import { useAccountActions } from '../../../../account/use-account';
import { AuthPage } from '../auth';
import { HOME, LOGIN } from '../routes';
import { Tag } from '../shell';

// E2 账号页：读取中、读取失败、未登录、已登录四种状态，文案与逻辑同 Folio 账号页（逻辑与旧版共用）。
// 已登录：问候、邮箱与验证状态、一句现在登录能做什么、回到首页与退出登录，修改密码收在下面。

export default function E2Account() {
  const { data, isPending, error: sessionError } = authClient.useSession();
  const { busy, message, error, change, logout } = useAccountActions(LOGIN);
  return (
    <AuthPage>
      <section className="eu-account">
        {isPending ? (
          <>
            <h1 className="sr-only">{folioStudio.nav.account}</h1>
            <output className="eu-loading">正在读取账号…</output>
          </>
        ) : sessionError ? (
          <>
            <h1>暂时无法读取账号。</h1>
            <p className="eu-lead">请检查连接后刷新页面重试。</p>
          </>
        ) : !data ? (
          <>
            <h1>先登录，再继续。</h1>
            <div className="e2-actions">
              <Link className="e2-button e2-button-ink" href={LOGIN}>
                登录 / 注册
                <ArrowRight size={15} aria-hidden="true" />
              </Link>
            </div>
          </>
        ) : (
          <>
            <h1>你好，{data.user.name}。</h1>
            <p className="eu-email">
              <span>{data.user.email}</span>
              <Tag>
                {data.user.emailVerified ? '邮箱已验证' : '邮箱尚未验证'}
              </Tag>
            </p>
            {!data.user.emailVerified && (
              <p className="eu-note-small">
                试用阶段暂未配置验证邮件，账号不会显示为已验证。
              </p>
            )}
            <p className="eu-purpose">{folioAccount.purpose}</p>
            <div className="e2-actions">
              <Link className="e2-button e2-button-ink" href={HOME}>
                回到首页
                <ArrowRight size={15} aria-hidden="true" />
              </Link>
              <button
                type="button"
                className="e2-button e2-button-ghost"
                onClick={logout}
                disabled={busy}
              >
                退出登录
              </button>
            </div>
            <details className="eu-password">
              <summary>修改密码</summary>
              <p>使用邮箱密码注册的账号，可在这里更新密码。</p>
              <form onSubmit={change}>
                <label className="e2-field">
                  <span>当前密码</span>
                  <input
                    type="password"
                    name="current"
                    autoComplete="current-password"
                    required
                    maxLength={128}
                  />
                </label>
                <label className="e2-field">
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
                <button className="e2-button e2-button-ink" disabled={busy}>
                  {busy ? '请稍候…' : '保存新密码'}
                </button>
              </form>
              <output className="eu-success">{message}</output>
            </details>
            <p role="alert" className="eu-error">
              {error}
            </p>
          </>
        )}
      </section>
    </AuthPage>
  );
}
