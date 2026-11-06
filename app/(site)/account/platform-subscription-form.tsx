'use client';
import { useEffect, useState } from 'react';
import { accountItems } from '../../_site/tenant-account-client';
import { accountErrorText } from '../../_site/central-account-client';
import type {
  Subscription,
  PlanVersion,
  SeatPool,
  SubscriptionUpdateRequest,
} from '../../../lib/account/contracts/types';
import type { PlatformProps } from './account-platform';
export type SubscriptionMode =
  | 'create'
  | 'change'
  | 'period'
  | 'renew'
  | 'status';
export const subscriptionModeLabels = {
  create: '开通订阅',
  change: '变更套餐与数量',
  period: '调整有效期',
  renew: '续期订阅',
  status: '变更订阅状态',
};
const localDate = (iso: string) => {
  const d = new Date(iso);
  return new Date(d.getTime() - d.getTimezoneOffset() * 60000)
    .toISOString()
    .slice(0, 16);
};
const isoDate = (value: string, original: string) =>
  value === localDate(original) ? original : new Date(value).toISOString();
export function PlatformSubscriptionForm({
  client,
  mode,
  id,
  plans,
  busy,
  mutate,
  cancel,
}: PlatformProps & {
  mode: SubscriptionMode;
  id?: string;
  plans: PlanVersion[];
  cancel: () => void;
}) {
  const [loaded, setLoaded] = useState<{
      subscription?: Subscription;
      pools: SeatPool[];
    } | null>(null),
    [error, setError] = useState('');
  useEffect(() => {
    let active = true;
    (async () => {
      const subscription = id
        ? await client.platformSubscription(id)
        : undefined;
      const pools =
        subscription?.owner.kind === 'TENANT' && mode === 'change'
          ? await accountItems((cursor) =>
              client.platformPools(subscription.subscriptionId, cursor),
            )
          : [];
      if (active) setLoaded({ subscription, pools });
    })().catch((e) => {
      if (active) setError(accountErrorText(e));
    });
    return () => {
      active = false;
    };
  }, [client, id, mode]);
  return (
    <>
      <button className="m-link" disabled={busy} onClick={cancel}>
        取消
      </button>
      <p className="m-auth-error" role="alert">
        {error}
      </p>
      {loaded ? (
        <SubscriptionFields
          client={client}
          mode={mode}
          plans={plans}
          subscription={loaded.subscription}
          pools={loaded.pools}
          busy={busy}
          mutate={mutate}
        />
      ) : !error ? (
        <p>正在读取订阅详情…</p>
      ) : null}
    </>
  );
}
type FieldsProps = Pick<PlatformProps, 'client' | 'busy' | 'mutate'> & {
  mode: SubscriptionMode;
  plans: PlanVersion[];
  subscription?: Subscription;
  pools: SeatPool[];
};
function SubscriptionFields({
  client,
  mode,
  plans,
  subscription: s,
  pools,
  busy,
  mutate,
}: FieldsProps) {
  const [kind, setKind] = useState<'USER' | 'TENANT'>(s?.owner.kind ?? 'USER'),
    [plan, setPlan] = useState(
      s
        ? String(
            plans.findIndex(
              (p) => p.planId === s.planId && p.planVersion === s.planVersion,
            ),
          )
        : '',
    ),
    [error, setError] = useState('');
  const [initial] = useState(() => ({
    start: s?.startsAt ?? new Date().toISOString(),
    end: s?.endsAt ?? new Date(Date.now() + 30 * 86400000).toISOString(),
  }));
  const chosen = plan === '' ? undefined : plans[Number(plan)],
    showPlan = mode === 'create' || mode === 'change';
  return (
    <form
      className="m-auth-form"
      onSubmit={(e) => {
        e.preventDefault();
        const data = new FormData(e.currentTarget),
          reason = formText(data, 'reason').trim();
        setError('');
        const start =
            mode === 'create' || mode === 'period'
              ? isoDate(formText(data, 'startsAt'), initial.start)
              : undefined,
          end = ['create', 'period', 'renew'].includes(mode)
            ? isoDate(formText(data, 'endsAt'), initial.end)
            : undefined;
        if (
          end &&
          ((start && Date.parse(end) <= Date.parse(start)) ||
            (mode === 'renew' && Date.parse(end) <= Date.parse(initial.end)))
        ) {
          setError('到期时间必须晚于开始时间；续期须晚于原到期时间。');
          return;
        }
        if (!window.confirm('确认按当前表单变更订阅？此操作不涉及付款。'))
          return;
        const seatQuantities = Object.fromEntries(
          (chosen?.seatTypes ?? []).map((t) => [
            t.seatTypeId,
            Number(data.get('quantity:' + t.seatTypeId)),
          ]),
        );
        void mutate(() => {
          if (mode === 'create') {
            const base = {
                planId: chosen!.planId,
                planVersion: chosen!.planVersion,
                startsAt: start!,
                endsAt: end!,
                reason,
              },
              ownerId = formText(data, 'ownerId').trim();
            return client.createSubscription(
              kind === 'TENANT'
                ? {
                    ...base,
                    owner: { kind: 'TENANT', id: ownerId },
                    seatQuantities,
                  }
                : { ...base, owner: { kind: 'USER', id: ownerId } },
            );
          }
          if (mode === 'renew')
            return client.renewSubscription(s!.subscriptionId, {
              expectedVersion: s!.version,
              reason,
              endsAt: end!,
            });
          const body: SubscriptionUpdateRequest = {
            expectedVersion: s!.version,
            reason,
            ...(mode === 'change'
              ? {
                  plan: {
                    planId: chosen!.planId,
                    planVersion: chosen!.planVersion,
                  },
                  ...(kind === 'TENANT' ? { seatQuantities } : {}),
                }
              : mode === 'period'
                ? { startsAt: start!, endsAt: end! }
                : { enabled: !s!.enabled }),
          };
          return client.updateSubscription(s!.subscriptionId, body);
        }, '订阅已更新。');
      }}
    >
      <h4>{subscriptionModeLabels[mode]}</h4>
      {s ? (
        <p>
          {kind === 'USER' ? '个人订阅' : '租户订阅'} · {s.owner.id}
        </p>
      ) : (
        <>
          <label className="m-field">
            开通对象
            <select
              name="ownerKind"
              value={kind}
              disabled={busy}
              onChange={(e) => setKind(e.target.value as 'USER' | 'TENANT')}
            >
              <option value="USER">个人</option>
              <option value="TENANT">租户</option>
            </select>
          </label>
          <label className="m-field">
            账号或租户 ID
            <input name="ownerId" maxLength={128} required disabled={busy} />
          </label>
        </>
      )}
      {showPlan ? (
        <label className="m-field">
          套餐版本
          <select
            name="planVersion"
            required
            disabled={busy}
            value={plan}
            onChange={(e) => setPlan(e.target.value)}
          >
            <option value="">选择已发布套餐</option>
            {plans.map((p, i) => (
              <option key={p.planId + ':' + p.planVersion} value={String(i)}>
                {p.name} · {p.planId} v{p.planVersion}
              </option>
            ))}
          </select>
        </label>
      ) : null}
      {showPlan && kind === 'TENANT' ? (
        <div key={plan}>
          <p>减量或移除类型前，先由租户管理者回收相应席位。</p>
          {chosen?.seatTypes.map((t) => (
            <label key={t.seatTypeId} className="m-field">
              {t.name} · {t.seatTypeId}
              <input
                name={'quantity:' + t.seatTypeId}
                type="number"
                min={0}
                max={1000000}
                step={1}
                defaultValue={
                  pools.find((p) => p.seatTypeId === t.seatTypeId)?.quantity ??
                  0
                }
                required
                disabled={busy}
              />
            </label>
          ))}
          {pools.map((p) => (
            <p key={p.seatTypeId}>
              {p.seatTypeId} · 当前数量 {p.quantity} · 已分配 {p.assignedCount}
            </p>
          ))}
        </div>
      ) : null}
      {mode === 'create' || mode === 'period' ? (
        <label className="m-field">
          开始时间
          <input
            name="startsAt"
            type="datetime-local"
            defaultValue={localDate(initial.start)}
            required
            disabled={busy}
          />
        </label>
      ) : null}
      {['create', 'period', 'renew'].includes(mode) ? (
        <label className="m-field">
          到期时间
          <input
            name="endsAt"
            type="datetime-local"
            defaultValue={localDate(initial.end)}
            required
            disabled={busy}
          />
        </label>
      ) : null}
      {mode === 'renew' ? (
        <p>只延长到期时间；原停用状态和当前席位分配保持。</p>
      ) : mode === 'status' ? (
        <p>
          {s!.enabled
            ? '停用后继续计时，席位分配保留，但该订阅不再提供权益。'
            : '恢复后按原有效期判断，不自动续期。'}
        </p>
      ) : null}
      <label className="m-field">
        操作原因
        <input name="reason" required maxLength={500} disabled={busy} />
      </label>
      <p role="alert" className="m-auth-error">
        {error}
      </p>
      <button className="m-btn" disabled={busy}>
        确认订阅操作
      </button>
    </form>
  );
}

function formText(data: FormData, key: string) {
  const value = data.get(key);
  return typeof value === 'string' ? value : '';
}
