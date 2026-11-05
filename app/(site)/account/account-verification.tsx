'use client';
import { formText } from '../../../lib/forms';
import { useEffect, useRef, useState, type SubmitEvent } from 'react';
import {
  accountErrorText,
  AccountRequestError,
  type createBrowserAccount,
} from '../../_site/central-account-client';
import type { ProductTransactionView } from '../../../lib/account/contracts/types';

type Props = {
  client: ReturnType<typeof createBrowserAccount>;
  transaction: ProductTransactionView;
  method: string;
  onComplete: (handle: string) => void;
};
/** Current and new identities use the same central challenge UI; proofs remain in the BFF. */
export function AccountVerification({
  client,
  transaction,
  method,
  onComplete,
}: Props) {
  const [view, setView] = useState(transaction),
    [challenge, setChallenge] = useState(''),
    [busy, setBusy] = useState(false),
    [error, setError] = useState(''),
    [wait, setWait] = useState(0),
    [provider, setProvider] = useState('');
  const active = useRef(true),
    done = useRef(false),
    popup = useRef<Window | null>(null),
    form = useRef<HTMLFormElement>(null);
  useEffect(() => {
    active.current = true;
    return () => {
      active.current = false;
      popup.current?.close();
    };
  }, []);
  useEffect(() => {
    if (!wait) return;
    const timer = setTimeout(() => setWait((v) => Math.max(v - 1, 0)), 1000);
    return () => clearTimeout(timer);
  }, [wait]);
  useEffect(() => {
    if (view.nextStep !== 'WAIT_PROVIDER') return;
    let stopped = false,
      timer: ReturnType<typeof setTimeout>;
    const poll = async () => {
      try {
        const next = await client.transaction(view.handle);
        if (stopped || done.current) return;
        if (next.status === 'CONSUMED') {
          done.current = true;
          popup.current?.close();
          onComplete(view.handle);
          return;
        }
        if (
          ['CANCELLED', 'EXPIRED'].includes(next.status) ||
          popup.current?.closed
        ) {
          setError('验证未完成，请取消后重新开始。');
          return;
        }
        timer = setTimeout(() => void poll(), 1000);
      } catch (e) {
        if (!stopped) setError(accountErrorText(e));
      }
    };
    timer = setTimeout(() => void poll(), 750);
    return () => {
      stopped = true;
      clearTimeout(timer);
    };
  }, [client, view, onComplete]);
  async function run(task: () => Promise<void>) {
    if (busy) return;
    setBusy(true);
    setError('');
    try {
      await task();
    } catch (e) {
      if (active.current) {
        setError(accountErrorText(e));
        if (e instanceof AccountRequestError) setWait(e.retryAfterSeconds);
      }
    } finally {
      if (active.current) setBusy(false);
    }
  }
  async function advance(next: Awaited<ReturnType<typeof client.submit>>) {
    if (!active.current) return;
    form.current?.reset();
    if ('challengeHandle' in next) {
      setChallenge(next.challengeHandle);
      setWait(next.retryAfterSeconds);
      return;
    }
    if ('browserStartUrl' in next) {
      setProvider(next.browserStartUrl);
      return;
    }
    if ('handle' in next) {
      if (next.nextStep === 'COMPLETE') {
        const completed = await client.submit(next.handle, {
          step: 'COMPLETE',
        });
        if (!('operationReady' in completed))
          throw new AccountRequestError('AUTH_UNAVAILABLE');
        if (active.current) {
          done.current = true;
          onComplete(next.handle);
        }
      } else setView(next);
    }
  }
  function submit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    const values = new FormData(event.currentTarget);
    void run(async () => {
      if (challenge) {
        await advance(
          await client.submit(view.handle, {
            step: 'VERIFY_CHALLENGE',
            challengeHandle: challenge,
            credential: formText(values, 'code'),
          }),
        );
        return;
      }
      if (method === 'EMAIL_PASSWORD')
        await advance(
          await client.submit(view.handle, {
            step: 'PASSWORD_LOGIN',
            email: formText(values, 'address').trim(),
            password: formText(values, 'password'),
          }),
        );
      else
        await advance(
          await client.submit(view.handle, {
            step: 'REQUEST_CHALLENGE',
            address:
              (method === 'PHONE_OTP' ? '+86' : '') +
              formText(values, 'address').trim(),
          }),
        );
    });
  }
  return (
    <div className="m-auth-form">
      <p className="m-auth-error" role="alert">
        {error}
      </p>
      {method === 'GOOGLE' || method === 'GITHUB' ? (
        <>
          {view.nextStep === 'START_PROVIDER' && !provider ? (
            <button
              className="m-btn"
              disabled={busy}
              onClick={() =>
                void run(async () =>
                  advance(
                    await client.submit(view.handle, {
                      step: 'START_PROVIDER',
                    }),
                  ),
                )
              }
            >
              准备 {method === 'GOOGLE' ? 'Google' : 'GitHub'} 验证
            </button>
          ) : null}
          {provider ? (
            <button
              className="m-btn"
              disabled={busy || view.nextStep === 'WAIT_PROVIDER'}
              onClick={() => {
                const opened = window.open(provider, '_blank');
                if (!opened) {
                  setError('请允许打开验证窗口后重试。');
                  return;
                }
                opened.opener = null;
                popup.current = opened;
                setView({
                  ...view,
                  status: 'PENDING',
                  nextStep: 'WAIT_PROVIDER',
                });
              }}
            >
              打开授权窗口
            </button>
          ) : null}
          {view.nextStep === 'WAIT_PROVIDER' ? (
            <output>等待浏览器验证结果…</output>
          ) : null}
        </>
      ) : (
        <form
          ref={form}
          className="m-auth-form"
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
                  maxLength={6}
                  required
                />
              </label>
              <button
                type="button"
                className="m-link"
                disabled={busy || wait > 0}
                onClick={() =>
                  void run(async () => {
                    await client.resend(view.handle);
                    setWait(60);
                  })
                }
              >
                重新发送{wait > 0 ? ` (${wait})` : ''}
              </button>
            </>
          ) : (
            <>
              <label className="m-field">
                <span>
                  {method === 'PHONE_OTP' ? '中国大陆手机号（+86）' : '邮箱'}
                </span>
                <input
                  name="address"
                  type={method === 'PHONE_OTP' ? 'tel' : 'email'}
                  autoComplete={
                    method === 'PHONE_OTP' ? 'tel-national' : 'email'
                  }
                  maxLength={method === 'PHONE_OTP' ? 11 : 254}
                  pattern={
                    method === 'PHONE_OTP' ? '1[3-9][0-9]{9}' : undefined
                  }
                  required
                />
              </label>
              {method === 'EMAIL_PASSWORD' ? (
                <label className="m-field">
                  <span>当前密码</span>
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
          <button className="m-btn" disabled={busy || (!challenge && wait > 0)}>
            {challenge
              ? '验证'
              : method === 'EMAIL_PASSWORD'
                ? '确认身份'
                : '发送验证码'}
          </button>
        </form>
      )}
    </div>
  );
}
