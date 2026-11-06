'use client';
import { useEffect, useRef, useState, type ReactNode } from 'react';
import {
  accountErrorText,
  type createBrowserAccount,
} from '../../_site/central-account-client';
import { accountItems } from '../../_site/tenant-account-client';
import type {
  Invitation,
  OwnershipTransfer,
  TenantView,
} from '../../../lib/account/contracts/types';
import { TenantMembers } from './tenant-members';
import { AccountBilling } from './account-billing';
export type TenantClient = ReturnType<typeof createBrowserAccount>;
export type TenantMutation = (
  operation: () => Promise<unknown>,
  message: string,
) => Promise<void>;
export const roleName = { OWNER: '所有者', ADMIN: '管理员', MEMBER: '成员' };
export function AccountTenants({
  client,
  userId,
  children,
}: {
  client: TenantClient;
  userId: string;
  children: ReactNode;
}) {
  const [scope, setScope] = useState(''),
    [revision, setRevision] = useState(0),
    [tenants, setTenants] = useState<TenantView[]>([]),
    [invitations, setInvitations] = useState<Invitation[]>([]),
    [transfers, setTransfers] = useState<OwnershipTransfer[]>([]),
    [loading, setLoading] = useState(true),
    [busy, setBusy] = useState(false),
    [error, setError] = useState(''),
    [message, setMessage] = useState('');
  const lock = useRef(false),
    alive = useRef(true);
  useEffect(() => {
    alive.current = true;
    return () => {
      alive.current = false;
    };
  }, []);
  useEffect(() => {
    let active = true;
    Promise.all([
      accountItems(client.tenants),
      accountItems(client.invitations),
      accountItems(client.transfers),
    ])
      .then(([t, i, x]) => {
        if (!active) return;
        setTenants(t);
        setInvitations(i);
        setTransfers(x);
        setScope((old) => (t.some((item) => item.tenantId === old) ? old : ''));
      })
      .catch((e) => {
        if (active) {
          setTenants([]);
          setInvitations([]);
          setTransfers([]);
          setError(accountErrorText(e));
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [client, revision]);
  const mutate: TenantMutation = async (operation, text) => {
    if (lock.current || loading) return;
    lock.current = true;
    setBusy(true);
    setError('');
    setMessage('');
    try {
      await operation();
      if (alive.current) setMessage(text);
    } catch (e) {
      if (alive.current) setError(accountErrorText(e));
    } finally {
      lock.current = false;
      if (alive.current) {
        setLoading(true);
        setBusy(false);
        setRevision((value) => value + 1);
      }
    }
  };
  const selected = tenants.find((t) => t.tenantId === scope),
    disabled = busy || loading;
  return (
    <>
      <section className="m-account-section" aria-label="账号范围">
        <div className="m-account-fields">
          <label className="m-field">
            当前空间
            <select
              aria-label="当前空间"
              value={scope}
              disabled={disabled}
              onChange={(e) => {
                setScope(e.target.value);
                setMessage('');
                setError('');
              }}
            >
              <option value="">个人空间</option>
              {tenants.map((t) => (
                <option key={t.tenantId} value={t.tenantId}>
                  {t.name} ·{' '}
                  {t.status === 'DISABLED' ? '已停用' : roleName[t.myRole]}
                </option>
              ))}
            </select>
          </label>
        </div>
        <button
          className="m-link"
          disabled={disabled}
          onClick={() => {
            setLoading(true);
            setRevision((v) => v + 1);
          }}
        >
          刷新租户状态
        </button>
        <p className="m-auth-error" role="alert">
          {error}
        </p>
        <output className="m-auth-ok">{message}</output>
        {loading ? <output>正在读取租户状态…</output> : null}
      </section>
      {!loading &&
      (invitations.some((i) => i.status === 'PENDING') ||
        transfers.some((t) => t.status === 'PENDING')) ? (
        <section className="m-account-section" aria-label="邀请与交接">
          <h3>邀请与交接</h3>
          <ul className="m-account-methods">
            {invitations
              .filter((i) => i.status === 'PENDING')
              .map((i) => (
                <li key={i.invitationId}>
                  <div>
                    <strong>加入租户</strong>
                    <p>
                      {tenants.find((t) => t.tenantId === i.tenantId)?.name ??
                        i.tenantId}
                    </p>
                    <small>
                      {i.targetSummary} ·{' '}
                      {new Date(i.expiresAt).toLocaleString()} 到期
                    </small>
                  </div>
                  <div className="m-account-actions">
                    <button
                      className="m-link"
                      disabled={disabled}
                      onClick={() =>
                        mutate(
                          () =>
                            client.answerInvitation(i.invitationId, 'accept', {
                              expectedVersion: i.version,
                            }),
                          '已加入租户。',
                        )
                      }
                    >
                      确认加入
                    </button>
                    <button
                      className="m-link"
                      disabled={disabled}
                      onClick={() =>
                        mutate(
                          () =>
                            client.answerInvitation(i.invitationId, 'decline', {
                              expectedVersion: i.version,
                            }),
                          '已拒绝邀请。',
                        )
                      }
                    >
                      拒绝
                    </button>
                  </div>
                </li>
              ))}
            {transfers
              .filter((t) => t.status === 'PENDING')
              .map((t) => {
                const tenant = tenants.find(
                    (item) => item.tenantId === t.tenantId,
                  ),
                  target = tenant?.membershipId === t.toMembershipId;
                return (
                  <li key={t.transferId}>
                    <div>
                      <strong>所有权交接</strong>
                      <p>{tenant?.name ?? t.tenantId}</p>
                      <small>
                        {new Date(t.expiresAt).toLocaleString()} 到期
                      </small>
                    </div>
                    <button
                      className="m-link"
                      disabled={disabled || tenant?.status !== 'ACTIVE'}
                      onClick={() => {
                        if (
                          target &&
                          !window.confirm(
                            '接收后，你将成为租户所有者，原所有者变为普通成员。确认接收？',
                          )
                        )
                          return;
                        void mutate(
                          () =>
                            client.answerTransfer(
                              t.transferId,
                              target ? 'accept' : 'cancel',
                              { expectedVersion: t.version },
                            ),
                          target ? '已完成所有权交接。' : '已取消交接。',
                        );
                      }}
                    >
                      {target ? '确认接收所有权' : '取消交接'}
                    </button>
                  </li>
                );
              })}
          </ul>
        </section>
      ) : null}
      {!scope ? (
        <>
          {children}
          <AccountBilling
            key={'personal:' + revision}
            client={client}
            disabled={disabled}
            mutate={mutate}
            refresh={() => {
              setLoading(true);
              setRevision((v) => v + 1);
            }}
          />
        </>
      ) : !loading && selected ? (
        selected.status === 'DISABLED' ? (
          <section className="m-account-section">
            <h3>{selected.name}</h3>
            <p>租户已停用，请联系平台管理人员。个人空间和其他租户仍可使用。</p>
          </section>
        ) : (
          <>
            <TenantMembers
              key={selected.tenantId + ':' + revision}
              tenant={selected}
              client={client}
              userId={userId}
              disabled={disabled}
              mutate={mutate}
              refresh={() => {
                setLoading(true);
                setRevision((v) => v + 1);
              }}
            />
            <AccountBilling
              key={'billing:' + selected.tenantId + ':' + revision}
              client={client}
              tenantId={selected.tenantId}
              disabled={disabled}
              mutate={mutate}
              refresh={() => {
                setLoading(true);
                setRevision((v) => v + 1);
              }}
            />
          </>
        )
      ) : null}
    </>
  );
}
