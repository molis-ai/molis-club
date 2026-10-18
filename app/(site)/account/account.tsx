'use client';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { authClient } from '../../../lib/auth-client';
import { accountCopy } from '../../../content/site/auth';
import { useAccountActions } from '../../account/use-account';
import { HOME, LOGIN } from '../../_site/routes';

// 账号页（新站视觉）：读会话、修改密码（同时退出其他设备）、退出登录——行为沿用 app/account/use-account.ts。
// 预留的「关注的产品进展、我的分享、留言记录」在能力上线前不显示（content/site/auth.ts 的 ready）。

export function Account() {
  const t = accountCopy;
  const { data, isPending, error: sessionError } = authClient.useSession();
  const { busy, message, error, change, logout } = useAccountActions(LOGIN);
  if (isPending) return <output className="m-auth-wait">{t.loading}</output>;
  if (sessionError)
    return (
      <header className="m-auth-head">
        <h2>{t.error.title}</h2>
        <p>{t.error.text}</p>
      </header>
    );
  if (!data)
    return (
      <header className="m-auth-head">
        <h2>{t.guest.title}</h2>
        <p>
          <Link className="m-btn" href={LOGIN} data-dir="right">
            {t.guest.go}
            <ArrowRight size={14} aria-hidden="true" />
          </Link>
        </p>
      </header>
    );
  const ready = t.sections.filter((section) => section.ready);
  return (
    <>
      <header className="m-auth-head">
        <h2>{t.hello(data.user.name)}</h2>
        <p className="m-account-email">
          <span>{data.user.email}</span>
          <span className="m-note">
            {data.user.emailVerified ? t.verified : t.unverified}
          </span>
        </p>
        {!data.user.emailVerified ? (
          <p className="m-auth-note">{t.unverifiedNote}</p>
        ) : null}
      </header>
      {ready.map((section) => (
        <section
          key={section.id}
          className="m-account-part"
          aria-label={section.title}
        >
          <h2>{section.title}</h2>
        </section>
      ))}
      <section className="m-account-part" aria-labelledby="m-account-password">
        <h2 id="m-account-password">{t.password.title}</h2>
        <p className="m-auth-note">{t.password.lead}</p>
        <form className="m-auth-form" onSubmit={change}>
          <label className="m-field">
            <span>{t.password.current}</span>
            <input
              type="password"
              name="current"
              autoComplete="current-password"
              required
              maxLength={128}
            />
          </label>
          <label className="m-field">
            <span>{t.password.next}</span>
            <input
              type="password"
              name="new"
              autoComplete="new-password"
              required
              minLength={12}
              maxLength={128}
            />
          </label>
          <button className="m-btn m-auth-submit" disabled={busy}>
            {busy ? '请稍候…' : t.password.submit}
          </button>
          <output className="m-auth-ok">{message}</output>
        </form>
      </section>
      <p className="m-auth-error" role="alert">
        {error}
      </p>
      <p className="m-account-out">
        <button
          type="button"
          className="m-link"
          onClick={logout}
          disabled={busy}
        >
          {t.logout}
        </button>
        <Link className="m-link" href={HOME} data-dir="right">
          {t.back}
          <ArrowRight size={13} aria-hidden="true" />
        </Link>
      </p>
    </>
  );
}
