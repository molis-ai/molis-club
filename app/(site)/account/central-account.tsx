'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import {
  createBrowserAccount,
  accountErrorText,
} from '../../_site/central-account-client';
import { AccountProfile } from './account-profile';
import { AccountMethods } from './account-methods';
import { AccountPlatform } from './account-platform';
import { AccountTenants } from './account-tenants';
import type {
  AccountView,
  LoginMethodsView,
} from '../../../lib/account/contracts/types';
export function CentralAccount() {
  const [client] = useState(createBrowserAccount),
    [platform, setPlatform] = useState(false),
    [view, setView] = useState<AccountView | null>(null),
    [methods, setMethods] = useState<LoginMethodsView | null>(null),
    [error, setError] = useState(''),
    [message, setMessage] = useState(''),
    [busy, setBusy] = useState(true);
  useEffect(() => {
    let active = true;
    client
      .session()
      .then(async (v) => {
        if (active) {
          setView(v);
          if (v.state === 'AUTHENTICATED') {
            const m = await client.methods();
            if (active) setMethods(m);
          }
          if (
            v.state === 'AUTHENTICATED' &&
            document.visibilityState === 'visible'
          )
            await client.activity();
        }
      })
      .catch((e) => {
        if (active) setError(accountErrorText(e));
      })
      .finally(() => {
        if (active) setBusy(false);
      });
    return () => {
      active = false;
    };
  }, [client]);
  async function reload() {
    const v = await client.session();
    setView(v);
    setMethods(v.state === 'AUTHENTICATED' ? await client.methods() : null);
  }
  async function logout(scope: 'CURRENT_LOGIN' | 'ALL_MOLIS_PRODUCTS') {
    if (busy) return;
    setBusy(true);
    setError('');
    try {
      const result = await client.logout(scope);
      setMethods(null);
      setView({ state: 'ANONYMOUS' });
      setMessage(
        result.remoteRevocation === 'CONFIRMED'
          ? '已退出登录。'
          : '本次登录已在本地清除，远端撤销尚未确认。',
      );
    } catch (e) {
      setError(accountErrorText(e));
    } finally {
      setBusy(false);
    }
  }
  return (
    <>
      <header className="m-auth-head">
        <h2>
          {view &&
          (view.state === 'AUTHENTICATED' || view.state === 'OFFLINE_CACHED')
            ? view.user.displayName
            : view
              ? '尚未登录'
              : '正在读取账号…'}
        </h2>
        {view?.state === 'OFFLINE_CACHED' ? (
          <p>当前离线，账号状态暂不可确认。</p>
        ) : null}
      </header>
      <p className="m-auth-error" role="alert">
        {error}
      </p>
      <output className="m-auth-ok">{message}</output>
      {view?.state === 'AUTHENTICATED' ? (
        <>
          {platform ? (
            <AccountPlatform client={client} back={() => setPlatform(false)} />
          ) : (
            <>
              {view.capabilities.some(
                (c) =>
                  c.startsWith('TENANT_') ||
                  c.startsWith('SUBSCRIPTION_') ||
                  c === 'AUDIT_READ',
              ) ? (
                <button className="m-link" onClick={() => setPlatform(true)}>
                  平台管理
                </button>
              ) : null}
              <AccountTenants client={client} userId={view.user.userId}>
                <AccountProfile
                  user={view.user}
                  client={client}
                  onSaved={reload}
                />
                {methods ? (
                  <AccountMethods
                    methods={methods}
                    client={client}
                    onSaved={reload}
                  />
                ) : null}
              </AccountTenants>
            </>
          )}
        </>
      ) : null}
      {view &&
      (view.state === 'AUTHENTICATED' || view.state === 'OFFLINE_CACHED') ? (
        <div className="m-account-out">
          <button
            className="m-link"
            disabled={busy}
            onClick={() => logout('CURRENT_LOGIN')}
          >
            退出登录
          </button>
          <button
            className="m-link"
            disabled={busy}
            onClick={() => logout('ALL_MOLIS_PRODUCTS')}
          >
            退出所有产品和设备
          </button>
        </div>
      ) : view ? (
        <Link className="m-btn" href="/login">
          登录 / 注册
        </Link>
      ) : null}
    </>
  );
}
