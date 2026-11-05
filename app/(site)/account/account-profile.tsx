'use client';
import { formText } from '../../../lib/forms';
import { useState, type SubmitEvent } from 'react';
import {
  accountErrorText,
  type createBrowserAccount,
} from '../../_site/central-account-client';
import type { UserView } from '../../../lib/account/contracts/types';

export function AccountProfile({
  user,
  client,
  onSaved,
}: {
  user: UserView;
  client: ReturnType<typeof createBrowserAccount>;
  onSaved: () => Promise<void>;
}) {
  const [busy, setBusy] = useState(false),
    [error, setError] = useState(''),
    [message, setMessage] = useState('');
  async function save(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy) return;
    const form = event.currentTarget,
      data = new FormData(form),
      file = data.get('avatar');
    setBusy(true);
    setError('');
    setMessage('');
    try {
      let avatar: string | null | undefined;
      if (data.get('remove')) avatar = null;
      else if (file instanceof File && file.size) {
        if (file.type !== 'image/png' || file.size > 135 * 1024)
          throw new Error('avatar');
        avatar = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () =>
            typeof reader.result === 'string'
              ? resolve(reader.result)
              : reject(new Error('avatar'));
          reader.onerror = reject;
          reader.readAsDataURL(file);
        });
      }
      await client.profile({
        displayName: formText(data, 'name').trim(),
        expectedVersion: user.version,
        ...(avatar !== undefined ? { avatarDataUrl: avatar } : {}),
      });
      form.reset();
      await onSaved();
      setMessage('资料已保存。');
    } catch (e) {
      setError(
        e instanceof Error && e.message === 'avatar'
          ? '请选择不超过 135 KB 的 PNG 图片。'
          : accountErrorText(e),
      );
    } finally {
      setBusy(false);
    }
  }
  return (
    <section className="m-account-section" aria-labelledby="profile-title">
      <h2 id="profile-title">个人资料</h2>
      {user.avatarUrl ? (
        <img
          src={user.avatarUrl}
          width={72}
          height={72}
          alt="当前头像"
          referrerPolicy="no-referrer"
          className="m-account-avatar"
        />
      ) : null}
      <form className="m-auth-form" onSubmit={save} aria-busy={busy}>
        <label className="m-field">
          <span>昵称</span>
          <input
            name="name"
            defaultValue={user.displayName}
            key={user.version}
            maxLength={80}
            required
            autoComplete="name"
          />
        </label>
        <label className="m-field">
          <span>头像（PNG，最多 135 KB）</span>
          <input name="avatar" type="file" accept="image/png" />
        </label>
        {user.avatarUrl ? (
          <label className="m-check">
            <input name="remove" type="checkbox" />
            移除头像
          </label>
        ) : null}
        <p className="m-auth-error" role="alert">
          {error}
        </p>
        <output className="m-auth-ok">{message}</output>
        <button className="m-btn" disabled={busy}>
          保存资料
        </button>
      </form>
    </section>
  );
}
