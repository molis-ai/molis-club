'use client';
import { useState } from 'react';
import { authClient } from '../../lib/auth-client';
import { formText } from '../../lib/forms';

// 账号页的两件事：修改密码（同时退出其他设备）和退出登录。旧版账号页与 Folio 账号页共用。
export function useAccountActions(loginPath: string) {
  const [busy, setBusy] = useState(false),
    [message, setMessage] = useState(''),
    [error, setError] = useState('');
  async function change(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const f = new FormData(form);
    setBusy(true);
    setMessage('');
    setError('');
    try {
      const r = await authClient.changePassword({
        currentPassword: formText(f, 'current'),
        newPassword: formText(f, 'new'),
        revokeOtherSessions: true,
      });
      if (r.error)
        setError('密码未能修改，请确认当前密码正确，新密码至少 12 位。');
      else {
        setMessage('密码已更新，其他设备上的登录已退出。');
        form.reset();
      }
    } catch {
      setError('连接失败，请稍后重试。');
    } finally {
      setBusy(false);
    }
  }
  async function logout() {
    setBusy(true);
    setError('');
    try {
      const r = await authClient.signOut();
      if (r.error) throw Error();
      window.location.assign(loginPath);
    } catch {
      setError('退出未完成，请重试。');
      setBusy(false);
    }
  }
  return { busy, message, error, change, logout };
}
