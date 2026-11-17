'use client';
import Link from 'next/link';
import { formText } from '../../../lib/forms';
import { useEffect, useRef, useState, type SubmitEvent } from 'react';
import { useSearchParams } from 'next/navigation';
import {
  createBrowserAccount,
  accountErrorText,
  AccountRequestError,
} from '../../_site/central-account-client';
import type {
  AccountView,
  LoginCapabilities,
  ProductTransactionView,
  ProductSubmitResult,
} from '../../../lib/account/contracts/types';
import { ACCOUNT, PRIVACY } from '../../_site/routes';

type Mode = 'login' | 'phone' | 'email' | 'reset';
const labels: Record<Mode, string> = {
  login: '账号密码',
  phone: '手机验证',
  email: '邮箱验证',
  reset: '找回密码',
};
export function LoginForm() {
  const [client] = useState(createBrowserAccount),
    [mode, setMode] = useState<Mode>('login');
  const [transaction, setTransaction] = useState<ProductTransactionView | null>(
      null,
    ),
    [challenge, setChallenge] = useState<string | null>(null);
  const [methods, setMethods] = useState<LoginCapabilities['methods']>([]);
  const [ready, setReady] = useState(false),
    [busy, setBusy] = useState(false),
    [error, setError] = useState(''),
    [message, setMessage] = useState('');
  const [account, setAccount] = useState<AccountView | null>(null),
    [resetReady, setResetReady] = useState(false),
    [address, setAddress] = useState('');
  const [wait, setWait] = useState(0);
  const [terminal, setTerminal] = useState<'expired' | 'existing' | null>(null);
  const active = useRef<ProductTransactionView | null>(null),
    generation = useRef(0),
    formRef = useRef<HTMLFormElement>(null);
  const search = useSearchParams();
  const providerWindow = useRef<Window | null>(null);
  const keep = (value: ProductTransactionView | null) => {
    active.current = value;
    setTransaction(value);
  };
  useEffect(() => {
    const epoch = generation;
    let alive = true;
    client
      .session()
      .then(async (value) => {
        if (alive) {
          setAccount(value);
          if (value.state !== 'AUTHENTICATED') {
            const capabilities = await client.capabilities();
            if (!alive) return;
            setMethods(capabilities.methods);
          }
          setReady(true);
          if (
            value.state === 'AUTHENTICATED' &&
            document.visibilityState === 'visible'
          )
            await client.activity();
        }
      })
      .catch((reason) => {
        if (alive) setError(accountErrorText(reason));
      });
    return () => {
      alive = false;
      epoch.current++;
      providerWindow.current?.close();
      providerWindow.current = null;
      // Effect cleanup also runs during Fast Refresh and Strict Mode replay.
      // Fence late results above; only explicit flow changes cancel transactions.
      // Abandoned transactions remain bounded by Auth's server-side expiry.
    };
  }, [client]);
  useEffect(() => {
    if (!wait) return;
    const timer = setTimeout(
      () => setWait((value) => Math.max(0, value - 1)),
      1000,
    );
    return () => clearTimeout(timer);
  }, [wait]);
  function handleFailure(reason: unknown) {
    if (reason instanceof AccountRequestError) {
      if (reason.code === 'IDENTITY_IN_USE') {
        setTerminal('existing');
        setError('该账号已注册，请重新登录或找回密码。');
        return;
      }
      if (['TRANSACTION_EXPIRED', 'PROOF_CONSUMED'].includes(reason.code)) setTerminal('expired');
    }
    setError(accountErrorText(reason));
    if (reason instanceof AccountRequestError && reason.retryAfterSeconds)
      setWait(reason.retryAfterSeconds);
  }
  async function run(task: () => Promise<void>) {
    if (busy) return;
    setBusy(true);
    setError('');
    setMessage('');
    try {
      await task();
    } catch (reason) {
      handleFailure(reason);
    } finally {
      setBusy(false);
    }
  }
  async function switchMode(next: Mode) {
    await run(async () => {
      generation.current++;
      if (active.current)
        await client.cancel(active.current.handle).catch((reason) => {
          if (
            !(reason instanceof AccountRequestError) ||
            ![
              'TRANSACTION_EXPIRED',
              'PROOF_CONSUMED',
              'VERSION_CONFLICT',
            ].includes(reason.code)
          )
            throw reason;
        });
      keep(null);
      setChallenge(null);
      setResetReady(false);
      setAddress('');
      setWait(0);
      setMode(next);
      setTerminal(null);
      formRef.current?.reset();
    });
  }
  async function complete(handle: string) {
    const result = await client.submit(handle, { step: 'COMPLETE' });
    if ('account' in result) {
      keep(null);
      setAccount(result.account);
      formRef.current?.reset();
    } else if ('operationReady' in result) {
      setResetReady(true);
      setChallenge(null);
      formRef.current?.reset();
    } else throw new AccountRequestError('AUTH_UNAVAILABLE');
  }
  async function submit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    if (terminal) return;
    const form = new FormData(event.currentTarget),
      epoch = generation.current;
    await run(async () => {
      const password = formText(form, 'password');
      if (form.has('confirm') && password !== form.get('confirm')) {
        setError('两次输入的密码不一致。');
        return;
      }
      if (resetReady && transaction) {
        await client.reset(transaction.handle, password);
        keep(null);
        setResetReady(false);
        setMode('login');
        formRef.current?.reset();
        setMessage('密码已重设，请重新登录。');
        return;
      }
      if (mode !== 'reset') {
        if (challenge) {
          const result = await client.loginCode(challenge, formText(form, 'code'));
          setAccount(result.account);
          setChallenge(null);
        } else {
          const raw = formText(form, 'address').trim();
          const target = mode === 'phone' || (mode === 'login' && /^1[3-9][0-9]{9}$/.test(raw)) ? '+86' + raw : raw;
          if (mode === 'login') {
            const result = await client.loginPassword(target, password);
            setAccount(result.account);
          } else {
            const result = await client.sendVerification(mode === 'phone' ? 'SMS' : 'EMAIL', target);
            setAddress(target);
            setChallenge(result.verificationId);
            setWait(result.retryAfterSeconds);
          }
        }
        formRef.current?.reset();
        return;
      }
      let tx = transaction;
      if (!tx) {
        tx = await client.create(
          { purpose: 'PASSWORD_RESET', method: 'EMAIL_CODE' },
        );
        if (epoch !== generation.current) {
          await client.cancel(tx.handle);
          return;
        }
        keep(tx);
      }
      let result: ProductSubmitResult;
      if (challenge) {
        result = await client.submit(tx.handle, {
          step: 'VERIFY_CHALLENGE',
          challengeHandle: challenge,
          credential: formText(form, 'code'),
        });
        if (!('handle' in result))
          throw new AccountRequestError('AUTH_UNAVAILABLE');
        keep(result);
        setChallenge(null);
        formRef.current?.reset();
        if (result.nextStep === 'COMPLETE') await complete(tx.handle);
        return;
      }
      if (tx.nextStep === 'COMPLETE') {
        await complete(tx.handle);
        return;
      }
      const target = formText(form, 'address').trim();
      setAddress(target);
      {
        result = await client.submit(tx.handle, {
          step: 'REQUEST_CHALLENGE',
          address: target,
        });
        if (!('challengeHandle' in result))
          throw new AccountRequestError('AUTH_UNAVAILABLE');
        setChallenge(result.challengeHandle);
        setWait(result.retryAfterSeconds);

        formRef.current?.reset();
      }
    });
  }
  async function social(method: 'GOOGLE' | 'GITHUB') {
    if (busy || providerWindow.current) return;
    const popup = window.open('about:blank', '_blank');
    if (!popup) {
      setError('请允许打开授权窗口，然后重试。');
      return;
    }
    popup.opener = null;
    providerWindow.current = popup;
    const epoch = ++generation.current;
    let handle: string | undefined;
    let succeeded = false;
    await run(async () => {
      try {
        if (active.current) await client.cancel(active.current.handle);
        const tx = await client.create({ purpose: 'LOGIN', method });
        handle = tx.handle;
        if (epoch !== generation.current) return;
        keep(tx);
        const result = await client.submit(tx.handle, { step: 'START_PROVIDER' });
        if (epoch !== generation.current) return;
        if (!('browserStartUrl' in result))
          throw new AccountRequestError('AUTH_UNAVAILABLE');
        popup.location.replace(result.browserStartUrl);
        setMessage('正在等待授权…');
        while (epoch === generation.current) {
          const status = await client.transaction(tx.handle);
          if (epoch !== generation.current) return;
          if (status.status === 'CONSUMED') {
            const session = await client.session();
            if (epoch !== generation.current) return;
            if (session.state !== 'AUTHENTICATED')
              throw new AccountRequestError('SESSION_EXPIRED');
            succeeded = true;
            keep(null);
            setAccount(session);
            return;
          }
          if (['CANCELLED', 'EXPIRED'].includes(status.status) || popup.closed) {
            setError('第三方登录未完成，请重新发起。');
            return;
          }
          await new Promise((resolve) => setTimeout(resolve, 1000));
        }
      } catch (reason) {
        if (epoch === generation.current) throw reason;
      } finally {
        popup.close();
        if (providerWindow.current === popup) providerWindow.current = null;
        if (handle && !succeeded) await client.cancel(handle).catch(() => undefined);
        if (epoch === generation.current) {
          keep(null);
          setMessage('');
        }
      }
    });
  }
  if (account?.state === 'AUTHENTICATED' || account?.state === 'OFFLINE_CACHED')
    return (
      <div className="m-auth-done">
        <h1>{account.user.displayName}</h1>
        <p>
          {account.state === 'AUTHENTICATED'
            ? '已登录 Molis 账号'
            : '当前离线，账号状态暂不可确认。'}
        </p>
        <Link className="m-btn" href={ACCOUNT}>
          我的账号
        </Link>
      </div>
    );
  const passwordStage = resetReady;
  return (
    <>
      <header className="m-auth-head">
        <h1>欢迎回来</h1>
      </header>
      <div className="m-auth-modes" aria-label="登录与注册方式">
        {(['login', 'email', 'phone'] as const).filter(value => methods.includes(({login:'ACCOUNT_PASSWORD',email:'EMAIL_CODE',phone:'PHONE_OTP'} as const)[value])).map((value) => (
          <button
            key={value}
            type="button"
            className="m-link"
            aria-pressed={mode === value}
            disabled={busy || !ready}
            onClick={() => switchMode(value)}
          >
            {labels[value]}
          </button>
        ))}
      </div>
      <div className="m-auth-stage">
        <form
          className="m-auth-form"
          ref={formRef}
          onSubmit={submit}
          aria-busy={busy}
        >
          {challenge ? (
            <>
              <output
                className="m-auth-note m-auth-recipient"
                aria-live="polite"
              >
                {mode === 'phone'
                  ? `验证码已发送至 ${address.replace(/^(\+86)(\d{3})\d{4}(\d{4})$/, '$1 $2****$3')}`
                  : mode === 'reset'
                    ? `若该邮箱已注册，验证邮件将发送至 ${address}`
                    : `已将验证邮件发送至 ${address}`}
              </output>
              <label className="m-field">
                <span>六位验证码</span>
                <input
                  name="code"
                  autoComplete="one-time-code"
                  inputMode="numeric"
                  pattern="[0-9]{6}"
                  minLength={6}
                  maxLength={6}
                  required
                />
              </label>
              <button
                type="button"
                className="m-link"
                disabled={busy || wait > 0}
                onClick={() =>
                  run(async () => {
                    if (mode !== 'reset') {
                      const result = await client.sendVerification(mode === 'phone' ? 'SMS' : 'EMAIL',address);
                      setChallenge(result.verificationId);
                      setWait(result.retryAfterSeconds);
                    } else if (transaction) {
                      await client.resend(transaction.handle);
                      setWait(60);
                    }

                    setMessage('');
                  })
                }
              >
                {wait ? `重新发送（${wait}s）` : '重新发送'}
              </button>
            </>
          ) : passwordStage ? (
            <>
              <label className="m-field">
                <span>{mode === 'reset' ? '输入新密码（至少 12 位）' : '输入密码（至少 12 位）'}</span>
                <input
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  minLength={12}
                  maxLength={128}
                  required
                />
              </label>
              <label className="m-field">
                <span>{mode === 'reset' ? '再次输入新密码' : '再次输入密码'}</span>
                <input
                  name="confirm"
                  type="password"
                  autoComplete="new-password"
                  minLength={12}
                  maxLength={128}
                  required
                />
              </label>
            </>
          ) : (
            <>
              <label className="m-field">
                <span>
                  {mode === 'phone'
                    ? '中国大陆手机号（+86）'
                    : mode === 'login'
                      ? '邮箱或手机号'
                      : '邮箱'}
                </span>
                <input
                  name="address"
                  type={
                    mode === 'phone'
                      ? 'tel'
                      : mode === 'login'
                        ? 'text'
                        : 'email'
                  }
                  autoComplete={
                    mode === 'phone'
                      ? 'tel-national'
                      : mode === 'login'
                        ? 'username'
                        : 'email'
                  }
                  pattern={mode === 'phone' ? '1[3-9][0-9]{9}' : undefined}
                  maxLength={mode === 'phone' ? 11 : 254}
                  required
                />
              </label>
              {mode === 'login' ? (
                <label className="m-field">
                  <span>密码</span>
                  <input
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    maxLength={128}
                    required
                  />
                </label>
              ) : null}
            </>
          )}
          {mode === 'login' || mode === 'reset' ? (
            <div className="m-auth-account-links">
              {mode === 'reset' ? <button type="button" className="m-link" disabled={busy || !ready} onClick={() => switchMode('login')}>返回登录</button> : null}
              {mode === 'login' && methods.includes('EMAIL_CODE') && !challenge && !passwordStage ? (
                <button
                  type="button"
                  className="m-link m-auth-forgot"
                  disabled={busy || !ready}
                  onClick={() => switchMode('reset')}
                >
                  找回密码
                </button>
              ) : null}
            </div>
          ) : null}
          {(mode === 'phone' || mode === 'email') && !passwordStage && !challenge ? (
            <p className="m-auth-note">未注册账号验证后将自动注册并登录。</p>
          ) : null}
          {(mode === 'email' || mode === 'phone') && !challenge ? (
            <label className="m-check">
              <input type="checkbox" required />
              <span>
                我已阅读并同意
                <Link className="m-inline" href={PRIVACY}>
                  隐私政策
                </Link>
                。
              </span>
            </label>
          ) : null}
          <button className="m-btn m-auth-submit" disabled={!ready || busy || !!terminal}>
            {busy
              ? '请稍候…'
              : challenge
                ? '验证并继续'
                : resetReady
                  ? '重设密码'
                  : passwordStage
                    ? '完成注册'
                    : mode === 'login'
                      ? '登录'
                      : '发送验证码'}
          </button>
        </form>
        <p className="m-auth-error" role="alert">
          {error ||
            (!search.has('auth')
              ? ''
              : search.get('auth') === 'cancelled'
                ? '已取消第三方登录。'
                : search.get('auth') === 'failed'
                  ? '第三方登录未完成，请重新发起。'
                  : '')}
        </p>
        <output className="m-auth-ok" aria-live="polite">
          {message}
        </output>
        {terminal ? (
          <button
            type="button"
            className="m-link"
            disabled={busy}
            onClick={() => switchMode(terminal === 'existing' ? 'login' : mode)}
          >
            {terminal === 'existing' ? '去登录' : '重新开始'}
          </button>
        ) : null}
      </div>
      <div className="m-auth-social">
        {methods.includes('GOOGLE') && <button
          type="button"
          className="m-btn m-btn-line"
          disabled={busy || !ready}
          onClick={() => social('GOOGLE')}
        >
          使用 Google 登录
        </button>}
        {methods.includes('GITHUB') && <button
          type="button"
          className="m-btn m-btn-line"
          disabled={busy || !ready}
          onClick={() => social('GITHUB')}
        >
          使用 GitHub 登录
        </button>}
      </div>
    </>
  );
}
