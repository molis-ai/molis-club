'use client';
import { formText } from '../../../lib/forms';
import { useEffect, useRef, useState, type SubmitEvent } from 'react';
import {
  accountErrorText,
  AccountRequestError,
  type createBrowserAccount,
} from '../../_site/central-account-client';
import type {
  LoginMethodsView,
  LoginMethodType,
  ProductReauthenticationRequest,
  ProductTransactionView,
} from '../../../lib/account/contracts/types';
import { AccountVerification } from './account-verification';
import { AccountAccessHelp } from '../../_site/account-access-help';

const names: Record<LoginMethodType, string> = {
  EMAIL: '邮箱',
  PHONE: '手机',
  GOOGLE: 'Google',
  GITHUB: 'GitHub',
};
const verificationMethod = (type: LoginMethodType, current = false) =>
  type === 'EMAIL'
    ? current
      ? 'EMAIL_PASSWORD'
      : 'EMAIL_CODE'
    : type === 'PHONE'
      ? 'PHONE_OTP'
      : type;
type Action = {
  kind: 'bind' | 'replace' | 'unlink' | 'password';
  type?: LoginMethodType;
  id?: string;
  label?: string;
};
type Flow = {
  action: Action;
  phase: 'choose' | 'reauth' | 'identity' | 'confirm';
  tx?: ProductTransactionView;
  method?: string;
  reauth?: string;
  identity?: string;
  version: number;
  key: string;
};
export function AccountMethods({
  client,
  methods,
  onSaved,
}: {
  client: ReturnType<typeof createBrowserAccount>;
  methods: LoginMethodsView;
  onSaved: () => Promise<void>;
}) {
  const [flow, setFlow] = useState<Flow | null>(null),
    [busy, setBusy] = useState(false),
    [error, setError] = useState(''),
    [message, setMessage] = useState('');
  const handles = useRef(new Set<string>()),
    alive = useRef(true),
    epoch = useRef(0);
  const discard = () => {
    epoch.current++;
    for (const handle of handles.current)
      void client.cancel(handle).catch(() => {
        /* Expiry or a completed mutation may already fence it. */
      });
    handles.current.clear();
  };
  useEffect(() => {
    alive.current = true;
    const pending = handles.current,
      generation = epoch;
    return () => {
      alive.current = false;
      generation.current++;
      for (const h of pending)
        void client.cancel(h).catch(() => {
          /* Server expiry also fences abandoned proofs. */
        });
      pending.clear();
    };
  }, [client]);
  async function run(task: (generation: number) => Promise<void>) {
    if (busy) return;
    const generation = epoch.current;
    setBusy(true);
    setError('');
    setMessage('');
    try {
      await task(generation);
    } catch (e) {
      if (alive.current && generation === epoch.current) {
        if (e instanceof AccountRequestError && e.code === 'VERSION_CONFLICT') {
          discard();
          setFlow(null);
          await onSaved().catch(() => {
            /* Keep the original conflict visible; reload may be temporarily unavailable. */
          });
        }
        setError(accountErrorText(e));
      }
    } finally {
      if (alive.current) setBusy(false);
    }
  }
  async function keep(tx: ProductTransactionView, generation: number) {
    if (!alive.current || generation !== epoch.current) {
      await client.cancel(tx.handle);
      return false;
    }
    handles.current.add(tx.handle);
    return true;
  }
  function choose(action: Action) {
    discard();
    setError('');
    setMessage('');
    setFlow({
      action,
      phase: 'choose',
      version: methods.version,
      key: crypto.randomUUID(),
    });
  }
  function reauthenticate(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    const method = formText(
      new FormData(event.currentTarget),
      'method',
    ) as ProductReauthenticationRequest['method'];
    const selected = flow!;
    void run(async (generation) => {
      const action = selected.action;
      const operation =
        action.kind === 'bind'
          ? 'BIND_METHOD'
          : action.kind === 'replace'
            ? 'REPLACE_METHOD'
            : action.kind === 'unlink'
              ? 'UNLINK_METHOD'
              : 'CHANGE_PASSWORD';
      const target =
        action.kind === 'bind'
          ? { method: action.type! }
          : action.kind === 'password'
            ? { kind: 'PASSWORD' as const }
            : { bindingId: action.id! };
      const tx = await client.reauthenticate({
        method,
        operation,
        target,
      } as ProductReauthenticationRequest);
      if (await keep(tx, generation))
        setFlow({ ...selected, phase: 'reauth', method, tx });
    });
  }
  function verified(handle: string) {
    const selected = flow!;
    if (selected.phase === 'identity') {
      setFlow({
        ...selected,
        phase: 'confirm',
        identity: handle,
        tx: undefined,
      });
      return;
    }
    if (
      selected.action.kind === 'password' ||
      selected.action.kind === 'unlink'
    ) {
      setFlow({ ...selected, phase: 'confirm', reauth: handle, tx: undefined });
      return;
    }
    void run(async (generation) => {
      const method = verificationMethod(selected.action.type!) as
        | 'EMAIL_CODE'
        | 'PHONE_OTP'
        | 'GOOGLE'
        | 'GITHUB';
      const input =
        selected.action.kind === 'bind'
          ? { purpose: 'BIND' as const, method, reauthHandle: handle }
          : {
              purpose: 'REPLACE' as const,
              method,
              reauthHandle: handle,
              bindingId: selected.action.id!,
            };
      const tx = await client.create(input);
      if (await keep(tx, generation))
        setFlow({ ...selected, phase: 'identity', reauth: handle, tx, method });
    });
  }
  function commit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget,
      values = new FormData(form),
      selected = flow!;
    const newPassword = formText(values, 'password');
    if (
      selected.action.kind === 'password' &&
      newPassword !== values.get('confirm')
    ) {
      setError('两次输入的密码不一致。');
      return;
    }
    void run(async (generation) => {
      const input = {
          reauthHandle: selected.reauth!,
          expectedVersion: selected.version,
        },
        action = selected.action;
      if (action.kind === 'password')
        await client.password({ ...input, newPassword }, selected.key);
      else if (action.kind === 'unlink')
        await client.unlink(action.id!, input, selected.key);
      else if (action.kind === 'bind')
        await client.bind(
          { ...input, identityHandle: selected.identity! },
          selected.key,
        );
      else
        await client.replace(
          action.id!,
          { ...input, identityHandle: selected.identity! },
          selected.key,
        );
      form.reset();
      if (!alive.current || generation !== epoch.current) return;
      handles.current.clear();
      setFlow(null);
      await onSaved();
      setMessage(
        action.kind === 'password'
          ? '密码已更新；当前登录保留，其他产品和设备已退出。'
          : '登录方式已更新。',
      );
    });
  }
  const available = [
    ...new Set(
      methods.loginMethods
        .filter((m) => m.usableForLogin)
        .map((m) => verificationMethod(m.type, true)),
    ),
  ];
  const actionName = flow
    ? {
        bind: '绑定',
        replace: '换绑',
        unlink: '解绑',
        password: '设置或修改密码',
      }[flow.action.kind]
    : '';
  return (
    <section className="m-account-section" aria-labelledby="methods-title">
      <h2 id="methods-title">登录方式与密码</h2>
      <p className="m-auth-error" role="alert">
        {error}
      </p>
      <output className="m-auth-ok">{message}</output>
      {flow ? (
        <div className="m-auth-form" aria-busy={busy}>
          <h3>
            {actionName}
            {flow.action.type ? names[flow.action.type] : ''}
          </h3>
          {flow.phase === 'choose' ? (
            <form className="m-auth-form" onSubmit={reauthenticate}>
              <label className="m-field">
                <span>验证当前账号</span>
                <select name="method" required>
                  {available.map((method) => (
                    <option key={method} value={method}>
                      {method === 'EMAIL_PASSWORD'
                        ? '邮箱密码'
                        : method === 'PHONE_OTP'
                          ? '手机验证码'
                          : method === 'GOOGLE'
                            ? 'Google'
                            : 'GitHub'}
                    </option>
                  ))}
                </select>
              </label>
              <button className="m-btn" disabled={busy || !available.length}>
                开始验证
              </button>
            </form>
          ) : flow.tx ? (
            <>
              <p>
                {flow.phase === 'reauth'
                  ? '请验证当前账号的一种登录方式。'
                  : '请验证新的登录方式。'}
              </p>
              <AccountVerification
                key={flow.tx.handle}
                client={client}
                transaction={flow.tx}
                method={flow.method!}
                onComplete={verified}
              />
            </>
          ) : (
            <form className="m-auth-form" onSubmit={commit}>
              {flow.action.kind === 'password' ? (
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
                  <p className="m-auth-note">
                    修改后保留当前登录，退出其他所有产品和设备。
                  </p>
                </>
              ) : (
                <p>
                  {flow.action.kind === 'unlink'
                    ? `确认解绑 ${flow.action.label}？至少需保留一种可用登录方式。`
                    : '验证已完成，确认更新登录方式。'}
                </p>
              )}
              <button className="m-btn" disabled={busy}>
                确认{actionName}
              </button>
            </form>
          )}
          <button
            type="button"
            className="m-link"
            disabled={busy}
            onClick={() => {
              discard();
              setFlow(null);
              setError('');
            }}
          >
            取消
          </button>
        </div>
      ) : (
        <>
          <ul className="m-account-methods">
            {methods.loginMethods.map((method) => (
              <li key={method.bindingId}>
                <div>
                  <strong>{names[method.type]}</strong>
                  <p>{method.maskedLabel}</p>
                  <span className="m-auth-note">
                    {method.usableForLogin
                      ? '可用于登录'
                      : method.verified
                        ? '已验证，暂不可用于登录'
                        : '尚未验证'}
                  </span>
                </div>
                <div className="m-account-out">
                  <button
                    className="m-link"
                    onClick={() =>
                      choose({
                        kind: 'replace',
                        type: method.type,
                        id: method.bindingId,
                        label: method.maskedLabel,
                      })
                    }
                  >
                    换绑
                  </button>
                  <button
                    className="m-link"
                    onClick={() =>
                      choose({
                        kind: 'unlink',
                        type: method.type,
                        id: method.bindingId,
                        label: method.maskedLabel,
                      })
                    }
                  >
                    解绑
                  </button>
                </div>
              </li>
            ))}
          </ul>
          <div className="m-account-out">
            {(['EMAIL', 'PHONE', 'GOOGLE', 'GITHUB'] as const).map((type) => (
              <button
                key={type}
                className="m-link"
                onClick={() => choose({ kind: 'bind', type })}
              >
                绑定{names[type]}
              </button>
            ))}
          </div>
          <button
            className="m-btn m-btn-line"
            onClick={() => choose({ kind: 'password' })}
          >
            设置或修改密码
          </button>
        </>
      )}
      <AccountAccessHelp />
    </section>
  );
}
