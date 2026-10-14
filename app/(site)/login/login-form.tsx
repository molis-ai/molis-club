'use client';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState, type SubmitEvent } from 'react';
import { authClient } from '../../../lib/auth-client';
import { formText } from '../../../lib/forms';
import { authCopy } from '../../../content/site/auth';
import { ACCOUNT, LOGIN, PRIVACY } from '../../_site/routes';

// 登录 / 注册（新站视觉）：认证行为与旧版一致——better-auth 邮箱密码登录与注册，至少 12 位密码；
// Google / GitHub 只有服务端配置了才出现（/api/auth-options），没配置时不摆出不能用的按钮。

type Providers = { google: boolean; github: boolean };

export function LoginForm() {
  const t = authCopy;
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [providers, setProviders] = useState<Providers | null>(null);
  const [providersFailed, setProvidersFailed] = useState(false);
  const searchParams = useSearchParams();
  const { data: session } = authClient.useSession();

  useEffect(() => {
    let alive = true;
    fetch('/api/auth-options')
      .then((response) => {
        if (!response.ok) throw Error();
        return response.json() as Promise<Providers>;
      })
      .then((value) => {
        if (alive) setProviders(value);
      })
      .catch(() => {
        if (alive) setProvidersFailed(true);
      });
    return () => {
      alive = false;
    };
  }, []);

  async function submit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy) return;
    setBusy(true);
    setError('');
    const form = new FormData(event.currentTarget);
    try {
      const values = {
        email: formText(form, 'email').trim(),
        password: formText(form, 'password'),
      };
      const result =
        mode === 'signup'
          ? await authClient.signUp.email({
              ...values,
              name: formText(form, 'name').trim(),
            })
          : await authClient.signIn.email(values);
      if (result.error) {
        setError(
          result.error.status === 429
            ? t.errors.rate
            : result.error.status >= 500 || result.error.status === 0
              ? t.errors.service
              : mode === 'login'
                ? t.errors.login
                : t.errors.signup,
        );
        return;
      }
      window.location.assign(ACCOUNT);
    } catch {
      setError(t.errors.service);
    } finally {
      setBusy(false);
    }
  }

  async function social(provider: 'google' | 'github') {
    setBusy(true);
    setError('');
    try {
      const result = await authClient.signIn.social({
        provider,
        callbackURL: ACCOUNT,
        errorCallbackURL: `${LOGIN}?error=oauth`,
      });
      if (result.error) setError(t.errors.social);
    } catch {
      setError(t.errors.service);
    } finally {
      setBusy(false);
    }
  }

  if (session)
    return (
      <div className="m-auth-done">
        <h1>{t.signedIn.title}</h1>
        <p>{t.signedIn.hello(session.user.name)}</p>
        <Link className="m-btn" href={ACCOUNT}>
          {t.signedIn.go}
        </Link>
      </div>
    );

  const copy = mode === 'login' ? t.login : t.signup;
  const anyProvider = Boolean(providers?.google || providers?.github);
  return (
    <>
      <header className="m-auth-head">
        <h1>{copy.title}</h1>
        <p>{copy.lead}</p>
      </header>
      {anyProvider ? (
        <div className="m-auth-social">
          {providers?.google ? (
            <button
              type="button"
              className="m-btn m-btn-line"
              disabled={busy}
              onClick={() => social('google')}
            >
              {t.providers.google}
            </button>
          ) : null}
          {providers?.github ? (
            <button
              type="button"
              className="m-btn m-btn-line"
              disabled={busy}
              onClick={() => social('github')}
            >
              {t.providers.github}
            </button>
          ) : null}
          <p className="m-auth-or">{t.providers.or}</p>
        </div>
      ) : (
        <p className="m-auth-note">
          {providersFailed ? t.providers.unknown : t.providers.note}
        </p>
      )}
      <form className="m-auth-form" onSubmit={submit}>
        {mode === 'signup' ? (
          <label className="m-field">
            <span>{t.fields.name}</span>
            <input
              name="name"
              autoComplete="name"
              required
              maxLength={40}
              placeholder={t.fields.namePlaceholder}
            />
          </label>
        ) : null}
        <label className="m-field">
          <span>{t.fields.email}</span>
          <input
            type="email"
            name="email"
            required
            autoComplete="email"
            maxLength={254}
            placeholder="you@example.com"
          />
        </label>
        <label className="m-field">
          <span>{t.fields.password}</span>
          <input
            type="password"
            name="password"
            required
            minLength={12}
            maxLength={128}
            autoComplete={
              mode === 'login' ? 'current-password' : 'new-password'
            }
            placeholder={t.fields.passwordPlaceholder}
          />
        </label>
        {mode === 'signup' ? (
          <label className="m-check">
            <input type="checkbox" required />
            <span>
              {t.signup.consent[0]}
              <Link className="m-inline" href={PRIVACY}>
                {t.signup.consent[1]}
              </Link>
              {t.signup.consent[2]}
            </span>
          </label>
        ) : null}
        <button className="m-btn m-auth-submit" disabled={busy}>
          {busy ? t.busy : copy.submit}
        </button>
        <p className="m-auth-error" role="alert">
          {error || (searchParams.has('error') ? t.errors.oauth : '')}
        </p>
      </form>
      <p className="m-auth-switch">
        {copy.switchText}
        <button
          type="button"
          className="m-link"
          onClick={() => {
            setMode(mode === 'login' ? 'signup' : 'login');
            setError('');
          }}
        >
          {copy.switchAction}
        </button>
      </p>
      <p className="m-auth-foot">{t.footnote}</p>
    </>
  );
}
