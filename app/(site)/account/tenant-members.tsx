'use client';
import { useEffect, useState } from 'react';
import { accountErrorText } from '../../_site/central-account-client';
import { accountItems } from '../../_site/tenant-account-client';
import type {
  Invitation,
  InvitationTarget,
  Membership,
  TenantView,
} from '../../../lib/account/contracts/types';
import {
  roleName,
  type TenantClient,
  type TenantMutation,
} from './account-tenants';
export function TenantMembers({
  tenant,
  client,
  userId,
  disabled,
  mutate,
  refresh,
}: {
  tenant: TenantView;
  client: TenantClient;
  userId: string;
  disabled: boolean;
  mutate: TenantMutation;
  refresh: () => void;
}) {
  const [view, setView] = useState<TenantView | null>(null),
    [members, setMembers] = useState<Membership[]>([]),
    [invitations, setInvitations] = useState<Invitation[]>([]),
    [error, setError] = useState(''),
    [name, setName] = useState(tenant.name),
    [targetKind, setTargetKind] = useState<InvitationTarget['kind']>('EMAIL'),
    [target, setTarget] = useState(''),
    [nextOwner, setNextOwner] = useState('');
  useEffect(() => {
    let active = true;
    async function read() {
      const current = await client.tenant(tenant.tenantId);
      const [m, i] = await Promise.all([
        accountItems((cursor) => client.members(tenant.tenantId, cursor)),
        current.myRole === 'MEMBER'
          ? []
          : accountItems((cursor) =>
              client.tenantInvitations(tenant.tenantId, cursor),
            ),
      ]);
      if (active) {
        setView(current);
        setName(current.name);
        setMembers(m);
        setInvitations(i);
      }
    }
    read().catch((e) => {
      if (active) setError(accountErrorText(e));
    });
    return () => {
      active = false;
    };
  }, [client, tenant.tenantId]);
  if (!view)
    return (
      <section className="m-account-section">
        {error ? (
          <>
            <p className="m-auth-error" role="alert">
              {error}
            </p>
            <button className="m-link" onClick={refresh}>
              刷新租户状态
            </button>
          </>
        ) : (
          <output>正在读取成员…</output>
        )}
      </section>
    );
  const owner = view.myRole === 'OWNER',
    manager = view.myRole !== 'MEMBER',
    current = members.find((m) => m.userId === userId && m.status === 'ACTIVE');
  return (
    <section className="m-account-section" aria-label="租户管理">
      <h3>{view.name}</h3>
      <p>{roleName[view.myRole]}</p>
      {manager ? (
        <form
          className="m-auth-form"
          onSubmit={(e) => {
            e.preventDefault();
            void mutate(
              () =>
                client.updateTenant(view.tenantId, {
                  name: name.trim(),
                  expectedVersion: view.version,
                }),
              '租户资料已保存。',
            );
          }}
        >
          <fieldset className="m-account-fields" disabled={disabled}>
            <label className="m-field">
              租户名称
              <input
                required
                name="tenantName"
                maxLength={80}
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </label>
            <button className="m-btn m-btn-line" type="submit">
              保存租户资料
            </button>
          </fieldset>
        </form>
      ) : null}
      <section className="m-account-section">
        <h3>成员</h3>
        <ul className="m-account-methods">
          {members
            .filter((m) => m.status === 'ACTIVE')
            .map((m) => (
              <li key={m.membershipId}>
                <div>
                  <strong>{m.userId === userId ? '我' : m.userId}</strong>
                  <p>{roleName[m.role]}</p>
                </div>
                <div className="m-account-actions">
                  {owner && m.role !== 'OWNER' ? (
                    <button
                      className="m-link"
                      disabled={disabled}
                      onClick={() =>
                        mutate(
                          () =>
                            client.role(view.tenantId, m.membershipId, {
                              role: m.role === 'ADMIN' ? 'MEMBER' : 'ADMIN',
                              expectedVersion: m.version,
                            }),
                          '成员角色已更新。',
                        )
                      }
                    >
                      {m.role === 'ADMIN' ? '设为成员' : '设为管理员'}
                    </button>
                  ) : null}
                  {manager &&
                  m.userId !== userId &&
                  m.role !== 'OWNER' &&
                  (owner || m.role === 'MEMBER') ? (
                    <button
                      className="m-link"
                      disabled={disabled}
                      onClick={() => {
                        if (
                          window.confirm(
                            '确认移除此成员？其在本租户的席位会同时释放。',
                          )
                        )
                          void mutate(
                            () =>
                              client.removeMember(
                                view.tenantId,
                                m.membershipId,
                                { expectedVersion: m.version },
                              ),
                            '已移除成员并释放其租户席位。',
                          );
                      }}
                    >
                      移除成员
                    </button>
                  ) : null}
                </div>
              </li>
            ))}
        </ul>
      </section>
      {manager ? (
        <section className="m-account-section">
          <h3>邀请成员</h3>
          <form
            className="m-auth-form"
            onSubmit={(e) => {
              e.preventDefault();
              void mutate(
                () =>
                  client.invite(view.tenantId, {
                    target: { kind: targetKind, value: target.trim() },
                  }),
                '邀请已创建，受邀者登录后可确认加入。',
              );
            }}
          >
            <fieldset className="m-account-fields" disabled={disabled}>
              <label className="m-field">
                邀请方式
                <select
                  name="inviteKind"
                  value={targetKind}
                  onChange={(e) => {
                    setTargetKind(e.target.value as InvitationTarget['kind']);
                    setTarget('');
                  }}
                >
                  <option value="EMAIL">邮箱</option>
                  <option value="PHONE">手机号</option>
                  <option value="USER">Molis 账号 ID</option>
                </select>
              </label>
              <label className="m-field">
                {targetKind === 'EMAIL'
                  ? '受邀邮箱'
                  : targetKind === 'PHONE'
                    ? '受邀手机号（+86）'
                    : '受邀账号 ID'}
                <input
                  required
                  type={targetKind === 'EMAIL' ? 'email' : 'text'}
                  maxLength={254}
                  pattern={
                    targetKind === 'PHONE' ? '\\+861[3-9][0-9]{9}' : undefined
                  }
                  name="inviteTarget"
                  value={target}
                  onChange={(e) => setTarget(e.target.value)}
                />
              </label>
              <button className="m-btn" type="submit">
                发送邀请
              </button>
            </fieldset>
          </form>
          <ul className="m-account-methods">
            {invitations
              .filter((i) => i.status === 'PENDING')
              .map((i) => (
                <li key={i.invitationId}>
                  <div>
                    <strong>{i.targetSummary}</strong>
                    <p>
                      等待确认 · {new Date(i.expiresAt).toLocaleString()} 到期
                    </p>
                  </div>
                  <button
                    className="m-link"
                    disabled={disabled}
                    onClick={() =>
                      mutate(
                        () =>
                          client.revokeInvitation(
                            view.tenantId,
                            i.invitationId,
                            { expectedVersion: i.version },
                          ),
                        '邀请已撤销。',
                      )
                    }
                  >
                    撤销邀请
                  </button>
                </li>
              ))}
          </ul>
        </section>
      ) : null}
      {owner ? (
        <section className="m-account-section">
          <h3>所有权交接</h3>
          <form
            className="m-auth-form"
            onSubmit={(e) => {
              e.preventDefault();
              if (
                window.confirm(
                  '确认发起交接？对方接收后，你将变为普通成员，已有席位保留。',
                )
              )
                void mutate(
                  () =>
                    client.transfer(view.tenantId, {
                      targetMembershipId: nextOwner,
                      expectedVersion: view.version,
                    }),
                  '交接已发起，等待对方确认。',
                );
            }}
          >
            <fieldset className="m-account-fields" disabled={disabled}>
              <label className="m-field">
                新所有者
                <select
                  required
                  name="nextOwner"
                  value={nextOwner}
                  onChange={(e) => setNextOwner(e.target.value)}
                >
                  <option value="">选择现有成员</option>
                  {members
                    .filter((m) => m.status === 'ACTIVE' && m.role !== 'OWNER')
                    .map((m) => (
                      <option key={m.membershipId} value={m.membershipId}>
                        {m.userId}
                      </option>
                    ))}
                </select>
              </label>
              <button className="m-btn m-btn-line" type="submit">
                发起交接
              </button>
            </fieldset>
          </form>
          <p>交接完成后才可退出租户。</p>
        </section>
      ) : current ? (
        <button
          className="m-link"
          disabled={disabled}
          onClick={() => {
            if (window.confirm('确认退出租户？你在本租户的席位会同时释放。'))
              void mutate(
                () =>
                  client.leaveTenant(view.tenantId, {
                    expectedVersion: current.version,
                  }),
                '已退出租户并释放租户席位。',
              );
          }}
        >
          退出租户
        </button>
      ) : null}
    </section>
  );
}
