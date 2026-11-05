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
  ProductTransactionView,
  ProductSubmitResult,
} from '../../../lib/account/contracts/types';
import { ACCOUNT, PRIVACY } from '../../_site/routes';
import { AccountAccessHelp } from '../../_site/account-access-help';

type Mode = 'login' | 'phone' | 'signup' | 'reset';
const labels: Record<Mode, string> = {
  login: '邮箱登录',
  phone: '手机验证码',
  signup: '邮箱注册',
  reset: '找回密码',
};
export function LoginForm() {
  const [client] = useState(createBrowserAccount),
    [mode, setMode] = useState<Mode>('login');
  const [transaction, setTransaction] = useState<ProductTransactionView | null>(
      null,
    ),
    [challenge, setChallenge] = useState<string | null>(null);
  const [ready, setReady] = useState(false),
    [busy, setBusy] = useState(false),
    [error, setError] = useState(''),
    [message, setMessage] = useState('');
  const [account, setAccount] = useState<AccountView | null>(null),
    [resetReady, setResetReady] = useState(false),
    [address, setAddress] = useState('');
  const [wait, setWait] = useState(0);
  const active = useRef<ProductTransactionView | null>(null),
    generation = useRef(0),
    formRef = useRef<HTMLFormElement>(null);
  const search = useSearchParams();
  const keep = (value: ProductTransactionView | null) => {
    active.current = value;
    setTransaction(value);
  };
  useEffect(() => {
    const holder = active;
    const epoch = generation;
    let alive = true;
    client
      .session()
      .then(async (value) => {
        if (alive) {
          setAccount(value);
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
      const pending = holder.current;
      holder.current = null;
      if (pending)
        void client.cancel(pending.handle).catch(() => {
          /* Server expiry also fences abandoned transactions. */
        });
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
      let tx = transaction;
      if (!tx) {
        tx = await client.create(
          mode === 'login'
            ? { purpose: 'LOGIN', method: 'EMAIL_PASSWORD' }
            : mode === 'phone'
              ? { purpose: 'LOGIN', method: 'PHONE_OTP' }
              : {
                  purpose:
                    mode === 'signup' ? 'EMAIL_SIGNUP' : 'PASSWORD_RESET',
                  method: 'EMAIL_CODE',
                },
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
        if (result.nextStep === 'PHONE_LOGIN') {
          await client.submit(tx.handle, { step: 'PHONE_LOGIN' });
          await complete(tx.handle);
        } else if (result.nextStep === 'COMPLETE') await complete(tx.handle);
        return;
      }
      if (tx.nextStep === 'EMAIL_SIGNUP') {
        await client.submit(tx.handle, {
          step: 'EMAIL_SIGNUP',
          email: address,
          password,
        });
        await complete(tx.handle);
        return;
      }
      const target =
        (mode === 'phone' ? '+86' : '') + formText(form, 'address').trim();
      setAddress(target);
      if (mode === 'login') {
        await client.submit(tx.handle, {
          step: 'PASSWORD_LOGIN',
          email: target,
          password,
        });
        await complete(tx.handle);
      } else {
        result = await client.submit(tx.handle, {
          step: 'REQUEST_CHALLENGE',
          address: target,
        });
        if (!('challengeHandle' in result))
          throw new AccountRequestError('AUTH_UNAVAILABLE');
        setChallenge(result.challengeHandle);
        setWait(result.retryAfterSeconds);

        setMessage('验证码请求已受理。隔离测试请从 mock 投递记录获取验证码。');
        formRef.current?.reset();
      }
    });
  }
  async function social(method: 'GOOGLE' | 'GITHUB') {
    await run(async () => {
      if (active.current) await client.cancel(active.current.handle);
      const tx = await client.create({ purpose: 'LOGIN', method });
      keep(tx);
      const result = await client.submit(tx.handle, { step: 'START_PROVIDER' });
      if (!('browserStartUrl' in result))
        throw new AccountRequestError('AUTH_UNAVAILABLE');
      // The BFF validates this exact Auth-origin browser-start URL. No identity or Token is accepted from the page.
      active.current = null;
      window.location.assign(result.browserStartUrl);
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
  const passwordStage = transaction?.nextStep === 'EMAIL_SIGNUP' || resetReady;
  return (
    <>
      <header className="m-auth-head">
        <h1>{resetReady ? '设置新密码' : labels[mode]}</h1>
      </header>
      <div className="m-auth-modes" aria-label="登录与注册方式">
        {(Object.keys(labels) as Mode[]).map((value) => (
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
      <form
        className="m-auth-form"
        ref={formRef}
        onSubmit={submit}
        aria-busy={busy}
      >
        {challenge ? (
          <>
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
                  if (transaction) await client.resend(transaction.handle);
                  setWait(60);

                  setMessage('验证码已重新发送。');
                })
              }
            >
              {wait ? `重新发送（${wait}s）` : '重新发送'}
            </button>
          </>
        ) : passwordStage ? (
          <>
            <label className="m-field">
              <span>新密码（至少 12 位）</span>
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
              <span>再次输入新密码</span>
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
              <span>{mode === 'phone' ? '中国大陆手机号（+86）' : '邮箱'}</span>
              <input
                name="address"
                type={mode === 'phone' ? 'tel' : 'email'}
                autoComplete={mode === 'phone' ? 'tel-national' : 'email'}
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
        {mode === 'phone' ? (
          <p className="m-auth-note">未注册手机号验证后将自动注册。</p>
        ) : null}
        {mode === 'signup' && passwordStage ? (
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
        <button className="m-btn m-auth-submit" disabled={!ready || busy}>
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
      {error ? (
        <button
          type="button"
          className="m-link"
          disabled={busy}
          onClick={() => window.location.reload()}
        >
          重新开始
        </button>
      ) : null}
      <div className="m-auth-social">
        <button
          type="button"
          className="m-btn m-btn-line"
          disabled={busy || !ready}
          onClick={() => social('GOOGLE')}
        >
          使用 Google 登录
        </button>
        <button
          type="button"
          className="m-btn m-btn-line"
          disabled={busy || !ready}
          onClick={() => social('GITHUB')}
        >
          使用 GitHub 登录
        </button>
      </div>
      <AccountAccessHelp />
    </>
  );
}
