'use client';
import { useEffect, useState } from 'react';
import { accountItems } from '../../_site/tenant-account-client';
import { accountErrorText } from '../../_site/central-account-client';
import type { PlatformTenantView } from '../../../lib/account/contracts/types';
import type { PlatformProps } from './account-platform';
export function PlatformTenants({
  client,
  capabilities,
  busy,
  mutate,
}: PlatformProps) {
  const [rows, setRows] = useState<PlatformTenantView[] | null>(null),
    [error, setError] = useState(''),
    [editing, setEditing] = useState<PlatformTenantView | 'create' | null>(
      null,
    );
  useEffect(() => {
    let active = true;
    if (capabilities.includes('TENANT_READ'))
      accountItems(client.platformTenants)
        .then((v) => {
          if (active) setRows(v);
        })
        .catch((e) => {
          if (active) setError(accountErrorText(e));
        });
    return () => {
      active = false;
    };
  }, [client, capabilities]);
  return (
    <>
      <h4>租户管理</h4>
      <p role="alert" className="m-auth-error">
        {error}
      </p>
      {editing ? (
        <form
          className="m-auth-form"
          onSubmit={(e) => {
            e.preventDefault();
            const data = new FormData(e.currentTarget),
              reason = formText(data, 'reason').trim();
            if (
              !window.confirm(
                editing === 'create'
                  ? '确认创建租户并分配给该账号？'
                  : '确认变更租户状态？',
              )
            )
              return;
            void mutate(
              () =>
                editing === 'create'
                  ? client.createTenant({
                      name: formText(data, 'name').trim(),
                      ownerUserId: formText(data, 'ownerUserId').trim(),
                      reason,
                    })
                  : client.tenantStatus(
                      editing.tenantId,
                      editing.status === 'ACTIVE' ? 'disable' : 'enable',
                      { expectedVersion: editing.version, reason },
                    ),
              '租户已更新。',
            );
          }}
        >
          <h4>
            {editing === 'create'
              ? '创建并分配租户'
              : editing.status === 'ACTIVE'
                ? '停用租户'
                : '恢复租户'}
          </h4>
          {editing === 'create' ? (
            <>
              <label className="m-field">
                租户名称
                <input name="name" maxLength={100} required disabled={busy} />
              </label>
              <label className="m-field">
                所有者账号 ID
                <input
                  name="ownerUserId"
                  maxLength={128}
                  required
                  disabled={busy}
                />
              </label>
            </>
          ) : (
            <p>{editing.name} · 停用后成员无法访问，记录保留，订阅继续计时。</p>
          )}
          <label className="m-field">
            操作原因
            <input name="reason" maxLength={500} required disabled={busy} />
          </label>
          <div className="m-account-actions">
            <button className="m-btn" disabled={busy}>
              确认租户操作
            </button>
            <button
              className="m-link"
              type="button"
              disabled={busy}
              onClick={() => setEditing(null)}
            >
              取消
            </button>
          </div>
        </form>
      ) : (
        <>
          {capabilities.includes('TENANT_CREATE') ? (
            <button
              className="m-link"
              disabled={busy}
              onClick={() => setEditing('create')}
            >
              创建并分配租户
            </button>
          ) : null}
          {capabilities.includes('TENANT_READ') ? (
            rows ? (
              <ul className="m-account-methods">
                {!rows.length ? (
                  <li>暂无租户。</li>
                ) : (
                  rows.map((t) => (
                    <li key={t.tenantId}>
                      <div>
                        <strong>{t.name}</strong>
                        <p>{t.tenantId}</p>
                        <p>
                          所有者：{t.ownerUserId} ·{' '}
                          {t.status === 'ACTIVE' ? '正常启用' : '已停用'}
                        </p>
                      </div>
                      {capabilities.includes('TENANT_STATUS') ? (
                        <button
                          className="m-link"
                          disabled={busy}
                          onClick={() => setEditing(t)}
                        >
                          {t.status === 'ACTIVE' ? '停用租户' : '恢复租户'}
                        </button>
                      ) : null}
                    </li>
                  ))
                )}
              </ul>
            ) : !error ? (
              <p>正在读取租户…</p>
            ) : null
          ) : (
            <p>没有租户查看权限。</p>
          )}
        </>
      )}
    </>
  );
}

function formText(data: FormData, key: string) {
  const value = data.get(key);
  return typeof value === 'string' ? value : '';
}
