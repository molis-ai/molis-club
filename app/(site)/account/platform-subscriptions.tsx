'use client';
import { useEffect, useState } from 'react';
import { accountItems } from '../../_site/tenant-account-client';
import { accountErrorText } from '../../_site/central-account-client';
import type {
  Subscription,
  PlanVersion,
} from '../../../lib/account/contracts/types';
import type { PlatformProps } from './account-platform';
import { subscriptionPlan, subscriptionStatus } from './billing-view';
import {
  PlatformSubscriptionForm,
  subscriptionModeLabels,
  type SubscriptionMode,
} from './platform-subscription-form';
export function PlatformSubscriptions(props: PlatformProps) {
  const { client, capabilities, busy } = props;
  const [data, setData] = useState<{
      plans: PlanVersion[];
      rows: Subscription[];
    } | null>(null),
    [error, setError] = useState(''),
    [edit, setEdit] = useState<{ mode: SubscriptionMode; id?: string } | null>(
      null,
    );
  useEffect(() => {
    let active = true;
    Promise.all([
      accountItems(client.billingPlans),
      capabilities.includes('SUBSCRIPTION_READ')
        ? accountItems(client.platformSubscriptions)
        : [],
    ])
      .then(([plans, rows]) => {
        if (active) setData({ plans, rows });
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
      <h4>订阅管理</h4>
      <p className="m-auth-error" role="alert">
        {error}
      </p>
      {data ? (
        edit ? (
          <PlatformSubscriptionForm
            key={edit.mode + edit.id}
            {...props}
            {...edit}
            plans={data.plans}
            cancel={() => setEdit(null)}
          />
        ) : (
          <>
            {capabilities.includes('SUBSCRIPTION_WRITE') ? (
              <button
                className="m-link"
                disabled={busy || !data.plans.length}
                onClick={() => setEdit({ mode: 'create' })}
              >
                开通订阅
              </button>
            ) : null}
            {!data.plans.length ? (
              <p>暂无已发布套餐，请先在平台配置套餐目录。</p>
            ) : null}
            {capabilities.includes('SUBSCRIPTION_READ') ? (
              <ul className="m-account-methods">
                {!data.rows.length ? (
                  <li>暂无订阅。</li>
                ) : (
                  data.rows.map((s) => (
                    <li
                      key={s.subscriptionId}
                      data-subscription={s.subscriptionId}
                    >
                      <div>
                        <strong>
                          {subscriptionPlan(s, data.plans)?.name ?? s.planId}
                        </strong>
                        <p>
                          {s.owner.kind === 'USER' ? '个人' : '租户'} ·{' '}
                          {s.owner.id}
                        </p>
                        <p>
                          {subscriptionStatus[s.status]} ·{' '}
                          {new Date(s.startsAt).toLocaleString()} —{' '}
                          {new Date(s.endsAt).toLocaleString()}
                        </p>
                        <small>{s.subscriptionId}</small>
                      </div>
                      {capabilities.includes('SUBSCRIPTION_WRITE') ? (
                        <div className="m-account-actions">
                          {(
                            ['change', 'period', 'renew', 'status'] as const
                          ).map((mode) => (
                            <button
                              key={mode}
                              className="m-link"
                              disabled={busy}
                              onClick={() =>
                                setEdit({ mode, id: s.subscriptionId })
                              }
                            >
                              {mode === 'status'
                                ? s.enabled
                                  ? '停用订阅'
                                  : '恢复订阅'
                                : subscriptionModeLabels[mode]}
                            </button>
                          ))}
                        </div>
                      ) : null}
                    </li>
                  ))
                )}
              </ul>
            ) : (
              <p>没有订阅查看权限。</p>
            )}
          </>
        )
      ) : !error ? (
        <p>正在读取订阅…</p>
      ) : null}
    </>
  );
}
