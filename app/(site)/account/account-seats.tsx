'use client';
import { useState } from 'react';
import type {
  Assignment,
  Membership,
  PlanVersion,
  SeatPool,
  Subscription,
  TenantView,
} from '../../../lib/account/contracts/types';
import type { TenantClient, TenantMutation } from './account-tenants';
import { assignmentEndReason, canAssign, seatLabel } from './billing-view';
export function AccountSeats({
  client,
  tenant,
  pools,
  assignments,
  history,
  members,
  subscriptions,
  plans,
  disabled,
  mutate,
}: {
  client: TenantClient;
  tenant: TenantView;
  pools: SeatPool[];
  assignments: Assignment[];
  history: Assignment[];
  members: Membership[];
  subscriptions: Subscription[];
  plans: PlanVersion[];
  disabled: boolean;
  mutate: TenantMutation;
}) {
  const [showHistory, setShowHistory] = useState(false),
    [operation, setOperation] = useState<
      'assign' | 'release' | 'reassign' | null
    >(null),
    [poolIndex, setPoolIndex] = useState(''),
    [assignment, setAssignment] = useState<Assignment | null>(null),
    [target, setTarget] = useState(''),
    [reason, setReason] = useState('');
  const manager = tenant.myRole !== 'MEMBER',
    pool = pools[Number(poolIndex)],
    selectedSubscription = assignment?.subscriptionId ?? pool?.subscriptionId,
    selectedType = assignment?.seatTypeId ?? pool?.seatTypeId;
  const eligible = members.filter(
    (member) =>
      member.status === 'ACTIVE' &&
      !assignments.some(
        (a) =>
          a.subscriptionId === selectedSubscription &&
          a.seatTypeId === selectedType &&
          a.membershipId === member.membershipId,
      ),
  );
  const open = (
    kind: 'assign' | 'release' | 'reassign',
    value: Assignment | null = null,
  ) => {
    setOperation(kind);
    setAssignment(value);
    setPoolIndex('');
    setTarget('');
    setReason('');
  };
  return (
    <section className="m-account-section" aria-label="席位管理">
      <h3>{manager ? '席位管理' : '我的租户席位'}</h3>
      {manager ? (
        <>
          <h4>席位库存</h4>
          {!pools.length ? (
            <p>暂无席位库存。</p>
          ) : (
            <ul className="m-account-methods">
              {pools.map((p) => (
                <li key={p.subscriptionId + ':' + p.seatTypeId}>
                  <div>
                    <strong>
                      {seatLabel(
                        p.subscriptionId,
                        p.seatTypeId,
                        subscriptions,
                        plans,
                      )}
                    </strong>
                    <p>
                      总数 {p.quantity} · 已分配 {p.assignedCount} · 可用{' '}
                      {p.availableCount}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          )}
          <button
            className="m-btn m-btn-line"
            disabled={disabled}
            onClick={() => open('assign')}
          >
            分配席位
          </button>
        </>
      ) : null}
      <p>到期或停用订阅保留当前分配，但不提供权益；回收后可供后续分配。</p>
      <button
        className="m-link"
        disabled={disabled}
        onClick={() => {
          setShowHistory((v) => !v);
          setOperation(null);
        }}
      >
        {showHistory ? '查看当前分配' : '查看分配历史'}
      </button>
      {!(showHistory ? history : assignments).length ? (
        <p>{showHistory ? '暂无分配历史。' : '暂无当前分配。'}</p>
      ) : (
        <ul className="m-account-methods">
          {(showHistory ? history : assignments).map((a) => (
            <li key={a.assignmentId}>
              <div>
                <strong>
                  {seatLabel(
                    a.subscriptionId,
                    a.seatTypeId,
                    subscriptions,
                    plans,
                  )}
                </strong>
                <p>{a.userId}</p>
                <p>
                  {a.status === 'ENDED'
                    ? assignmentEndReason[a.endReason]
                    : '保留分配'}{' '}
                  ·{' '}
                  {new Date(
                    a.status === 'ENDED' ? a.endedAt : a.assignedAt,
                  ).toLocaleString()}
                </p>
              </div>
              {manager && a.status === 'ASSIGNED' ? (
                <div className="m-account-actions">
                  <button
                    className="m-link"
                    disabled={disabled}
                    onClick={() => open('release', a)}
                  >
                    回收席位
                  </button>
                  <button
                    className="m-link"
                    disabled={
                      disabled || !canAssign(a.subscriptionId, subscriptions)
                    }
                    onClick={() => open('reassign', a)}
                  >
                    换绑席位
                  </button>
                </div>
              ) : null}
            </li>
          ))}
        </ul>
      )}
      {operation && manager ? (
        <form
          className="m-auth-form"
          aria-label="席位操作"
          onSubmit={(e) => {
            e.preventDefault();
            if (
              operation === 'assign' &&
              (poolIndex === '' ||
                !pool ||
                !canAssign(pool.subscriptionId, subscriptions))
            )
              return;
            if (
              !window.confirm(
                operation === 'release'
                  ? '确认回收此席位？该来源的权益将结束。'
                  : operation === 'reassign'
                    ? '确认换绑？原分配结束，席位转给所选成员。'
                    : '确认将席位分配给所选成员？',
              )
            )
              return;
            void mutate(
              () =>
                operation === 'assign'
                  ? client.assignSeat(tenant.tenantId, {
                      subscriptionId: pool!.subscriptionId,
                      seatTypeId: pool!.seatTypeId,
                      membershipId: target,
                      expectedVersion: pool!.version,
                    })
                  : operation === 'release'
                    ? client.releaseSeat(
                        tenant.tenantId,
                        assignment!.assignmentId,
                        {
                          expectedVersion: assignment!.version,
                          ...(reason.trim() ? { reason: reason.trim() } : {}),
                        },
                      )
                    : client.reassignSeat(
                        tenant.tenantId,
                        assignment!.assignmentId,
                        {
                          targetMembershipId: target,
                          expectedVersion: assignment!.version,
                          ...(reason.trim() ? { reason: reason.trim() } : {}),
                        },
                      ),
              '席位已更新。',
            );
          }}
        >
          <fieldset className="m-account-fields" disabled={disabled}>
            <legend>
              {operation === 'assign'
                ? '分配席位'
                : operation === 'release'
                  ? '回收席位'
                  : '换绑席位'}
            </legend>
            {operation === 'assign' ? (
              <label className="m-field">
                席位类型
                <select
                  name="seatPool"
                  required
                  value={poolIndex}
                  onChange={(e) => {
                    setPoolIndex(e.target.value);
                    setTarget('');
                  }}
                >
                  <option value="">选择可用席位</option>
                  {pools.map((p, index) =>
                    p.availableCount > 0 &&
                    canAssign(p.subscriptionId, subscriptions) ? (
                      <option
                        key={p.subscriptionId + ':' + p.seatTypeId}
                        value={String(index)}
                      >
                        {seatLabel(
                          p.subscriptionId,
                          p.seatTypeId,
                          subscriptions,
                          plans,
                        )}{' '}
                        · 可用 {p.availableCount}
                      </option>
                    ) : null,
                  )}
                </select>
              </label>
            ) : (
              <p>
                {assignment &&
                  seatLabel(
                    assignment.subscriptionId,
                    assignment.seatTypeId,
                    subscriptions,
                    plans,
                  )}
              </p>
            )}
            {operation !== 'release' ? (
              <label className="m-field">
                分配给
                <select
                  name="seatMember"
                  required
                  value={target}
                  onChange={(e) => setTarget(e.target.value)}
                >
                  <option value="">选择有效成员</option>
                  {eligible.map((member) => (
                    <option
                      key={member.membershipId}
                      value={member.membershipId}
                    >
                      {member.userId}
                    </option>
                  ))}
                </select>
              </label>
            ) : null}
            {operation !== 'assign' ? (
              <label className="m-field">
                原因（可选）
                <input
                  name="seatReason"
                  value={reason}
                  maxLength={500}
                  onChange={(e) => setReason(e.target.value)}
                />
              </label>
            ) : null}
            <button className="m-btn" type="submit">
              确认席位操作
            </button>
            <button
              className="m-link"
              type="button"
              onClick={() => setOperation(null)}
            >
              取消
            </button>
          </fieldset>
        </form>
      ) : null}
    </section>
  );
}
