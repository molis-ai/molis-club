'use client';

import Link from 'next/link';
import { UserRound, LogOut } from 'lucide-react';
import { useEffect, useState } from 'react';
import {
  createBrowserAccount,
  accountErrorText,
} from './central-account-client';
import type { AccountView } from '../../lib/account/contracts/types';
import { ACCOUNT, LOGIN } from './routes';
import './header-account.css';

/** Display only: the existing server session owner remains authoritative. */
export function HeaderAccount({ path }: { path: string }) {
  const [client] = useState(createBrowserAccount);
  const [view, setView] = useState<AccountView | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [failedAvatar, setFailedAvatar] = useState<string | null>(null);
  useEffect(() => {
    let active = true,
      revision = 0;
    const refresh = async () => {
      const current = ++revision;
      try {
        const next = await client.session();
        if (active && current === revision) setView(next);
      } catch {
        if (active && current === revision) setView(previous => previous ?? { state: 'ANONYMOUS' });
      }
    };
    const visible = () => {
      if (document.visibilityState === 'visible') void refresh();
    };
    void refresh();
    window.addEventListener('molis:account-changed', refresh);
    window.addEventListener('focus', refresh);
    document.addEventListener('visibilitychange', visible);
    return () => {
      active = false;
      window.removeEventListener('molis:account-changed', refresh);
      window.removeEventListener('focus', refresh);
      document.removeEventListener('visibilitychange', visible);
    };
  }, [client, path]);
  async function logout() {
    if (busy) return;
    setBusy(true);
    setError('');
    try {
      await client.logout('CURRENT_LOGIN');
      setView({ state: 'ANONYMOUS' });
      window.location.assign(LOGIN);
    } catch (reason) {
      setError(accountErrorText(reason));
      setBusy(false);
    }
  }
  const user =
    view?.state === 'AUTHENTICATED' || view?.state === 'OFFLINE_CACHED'
      ? view.user
      : null;
  return (
    <div className="m-header-account">
      {view === null ? (
        <span
          className="m-header-account-placeholder"
          aria-label="正在确认登录状态"
        />
      ) : user ? (
        <details className="m-header-account-menu">
          <summary aria-label={`账号菜单：${user.displayName || '我的账号'}`}>
            {user.avatarUrl && user.avatarUrl !== failedAvatar ? (
              <img
                src={user.avatarUrl}
                width={32}
                height={32}
                alt=""
                referrerPolicy="no-referrer"
                onError={() => setFailedAvatar(user.avatarUrl)}
              />
            ) : (
              <span className="m-header-account-initial" aria-hidden="true">
                {Array.from(user.displayName.trim())[0] || 'M'}
              </span>
            )}
          </summary>
          <div className="m-drop-panel m-header-account-panel">
            <strong>{user.displayName || 'Molis 用户'}</strong>
            {view?.state === 'OFFLINE_CACHED' ? <small>当前离线</small> : null}
            <a href={ACCOUNT}>
              <UserRound size={16} strokeWidth={1.5} aria-hidden="true" />
              管理 Molis 账号
            </a>
            <button type="button" disabled={busy} onClick={logout}>
              <LogOut size={16} strokeWidth={1.5} aria-hidden="true" />
              {busy ? '正在退出…' : '退出登录'}
            </button>
            {error ? <p role="alert">{error}</p> : null}
          </div>
        </details>
      ) : (
        <Link href={LOGIN}>登录</Link>
      )}
    </div>
  );
}
