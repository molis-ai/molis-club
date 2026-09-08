'use client';
import Link from 'next/link';
import { useState } from 'react';
import { authClient } from '../../lib/auth-client';
import { formText } from '../../lib/forms';
import { Header, Footer } from '../shell';
export default function Account() {
  const { data, isPending, error: sessionError } = authClient.useSession();
  const [busy, setBusy] = useState(false),
    [message, setMessage] = useState(''),
    [error, setError] = useState('');
  async function change(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const f = new FormData(form);
    setBusy(true);
    setMessage('');
    setError('');
    try {
      const r = await authClient.changePassword({
        currentPassword: formText(f, 'current'),
        newPassword: formText(f, 'new'),
        revokeOtherSessions: true,
      });
      if (r.error)
        setError('密码未能修改，请确认当前密码正确，新密码至少 12 位。');
      else {
        setMessage('密码已更新，其他设备上的登录已退出。');
        form.reset();
      }
    } catch {
      setError('连接失败，请稍后重试。');
    } finally {
      setBusy(false);
    }
  }
  async function logout() {
    setBusy(true);
    setError('');
    try {
      const r = await authClient.signOut();
      if (r.error) throw Error();
      window.location.assign('/login');
    } catch {
      setError('退出未完成，请重试。');
      setBusy(false);
    }
  }
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
              <Link className="text-link" href="/#works">
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
