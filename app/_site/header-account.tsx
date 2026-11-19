'use client';

import { UserRound, LogOut } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import {
  createBrowserAccount,
  accountErrorText,
} from './central-account-client';
import type { AccountView } from '../../lib/account/contracts/types';
import { LoginDialog } from './login-dialog';
import { LOGIN } from './routes';
import './header-account.css';

/** Display only: the existing server session owner remains authoritative. */
export function HeaderAccount({ path }: { path: string }) {
  const [client] = useState(createBrowserAccount);
  const [view, setView] = useState<AccountView | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [failedAvatar, setFailedAvatar] = useState<string | null>(null);
  const [loginPath, setLoginPath] = useState<string | null>(null);
  if (loginPath !== null && loginPath !== path) setLoginPath(null);
  const loginActive = useRef<string | null>(null);
  const refreshRevision = useRef(0);
  const closeLogin = useCallback(() => {
    loginActive.current = null;
    setLoginPath(null);
  }, []);
  const acceptLogin = useCallback((account: AccountView) => {
    setView(account);
    closeLogin();
  }, [closeLogin]);
  useEffect(() => {
    let active = true;
    const refresh = async () => {
      // The dialog reads the shared session and returns the new account to the header.
      if (loginActive.current === path) return;
      const current = ++refreshRevision.current;
      try {
        const next = await client.session();
        if (active && current === refreshRevision.current) setView(next);
      } catch {
        if (active && current === refreshRevision.current) setView(previous => previous ?? { state: 'ANONYMOUS' });
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
      if (loginActive.current === path) loginActive.current = null;
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
    } catch (reason) {
      setError(accountErrorText(reason));
    } finally {
      setBusy(false);
    }
  }
  const user =
    view?.state === 'AUTHENTICATED' || view?.state === 'OFFLINE_CACHED'
      ? view.user
      : null;
  return (
    <div className="m-header-account">
      {user ? (
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
            {view?.state === 'OFFLINE_CACHED' ? <small>当前离线</small> : null}
            {/* oxlint-disable-next-line next/no-html-link-for-pages -- 此接口通过整页跳转交接 Auth 会话，不能预取。 */}
            <a href="/api/account/management" target="_blank" rel="noopener noreferrer">
              <UserRound size={16} strokeWidth={1.5} aria-hidden="true" />
              个人资料
            </a>
            <button type="button" disabled={busy} onClick={logout}>
              <LogOut size={16} strokeWidth={1.5} aria-hidden="true" />
              {busy ? '正在退出…' : '退出登录'}
            </button>
            {error ? <p role="alert">{error}</p> : null}
          </div>
        </details>
      ) : path !== LOGIN && (
        <button type="button" className="m-header-login" aria-haspopup="dialog" onClick={() => {
          loginActive.current = path;
          refreshRevision.current++;
          setLoginPath(path);
        }}>
          登录
        </button>
      )}
      {loginPath === path && <LoginDialog accountClient={client} onClose={closeLogin} onAuthenticated={acceptLogin} />}
    </div>
  );
}
