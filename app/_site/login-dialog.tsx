'use client';

import { X } from 'lucide-react';
import { useLayoutEffect, useRef } from 'react';
import { LoginForm } from '../(site)/login/login-form';
import type { AccountView } from '../../lib/account/contracts/types';
import type { createBrowserAccount } from './central-account-client';
import './auth.css';

export function LoginDialog({ accountClient, onClose, onAuthenticated }: {
  accountClient: ReturnType<typeof createBrowserAccount>;
  onClose: () => void;
  onAuthenticated: (account: AccountView) => void;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  useLayoutEffect(() => {
    const dialog = ref.current!;
    dialog.showModal();
    return () => dialog.close();
  }, []);
  return (
    <dialog ref={ref} className="m-auth-login m-auth-dialog" aria-label="Molis 账号登录"
      onCancel={(event) => {
        event.preventDefault();
        onClose();
      }}>
      <div className="m-auth-card">
        <p className="m-kicker" lang="en">Molis AI</p>
        <button type="button" className="m-auth-close" aria-label="关闭登录" onClick={onClose}>
          <X size={20} strokeWidth={1.5} aria-hidden="true" />
        </button>
        <LoginForm accountClient={accountClient} onAuthenticated={onAuthenticated} />
      </div>
    </dialog>
  );
}
