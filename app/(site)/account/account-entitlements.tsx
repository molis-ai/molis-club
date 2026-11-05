'use client';
import { useEffect, useState } from 'react';
import type {
  EntitlementDecision,
  Feature,
  PlanVersion,
  Scope,
  Subscription,
} from '../../../lib/account/contracts/types';
import { accountErrorText } from '../../_site/central-account-client';
import type { TenantClient } from './account-tenants';
import { seatLabel, subscriptionPlan } from './billing-view';
export function AccountEntitlements({
  client,
  tenantId,
  features,
  subscriptions,
  plans,
}: {
  client: TenantClient;
  tenantId?: string;
  features: Feature[];
  subscriptions: Subscription[];
  plans: PlanVersion[];
}) {
  const [decisions, setDecisions] = useState<EntitlementDecision[] | null>(
      null,
    ),
    [error, setError] = useState(''),
    [revision, setRevision] = useState(0),
    [stale, setStale] = useState(false),
    [loading, setLoading] = useState(true);
  useEffect(() => {
    let active = true,
      timer: ReturnType<typeof setTimeout> | undefined,
      expiry = Infinity;
    const markExpiry = () => {
      if (active && Date.now() >= expiry) setStale(true);
    };
    async function read() {
      if (!features.length) return;
      const scope: Scope = tenantId
          ? { kind: 'TENANT', tenantId }
          : { kind: 'PERSONAL' },
        values: EntitlementDecision[] = [];
      for (let start = 0; start < features.length; start += 100) {
        const result = await client.checkEntitlements({
          scope,
          featureIds: features
            .slice(start, start + 100)
            .map((feature) => feature.featureId),
        });
        if (!active) return;
        values.push(...result.decisions);
      }
      if (!active) return;
      expiry = Math.min(...values.map((value) => Date.parse(value.validUntil)));
      setDecisions(values);
      markExpiry();
      if (Number.isFinite(expiry))
        timer = setTimeout(
          markExpiry,
          Math.min(2147483647, Math.max(0, expiry - Date.now())),
        );
    }
    void read()
      .catch((e) => {
        if (active) setError(accountErrorText(e));
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    window.addEventListener('focus', markExpiry);
    document.addEventListener('visibilitychange', markExpiry);
    return () => {
      active = false;
      clearTimeout(timer);
      window.removeEventListener('focus', markExpiry);
      document.removeEventListener('visibilitychange', markExpiry);
    };
  }, [client, tenantId, features, revision]);
  return (
    <section className="m-account-section" aria-label="当前权益">
      <h3>当前权益</h3>
      <button
        className="m-link"
        disabled={loading}
        onClick={() => {
          setDecisions(null);
          setError('');
          setStale(false);
          setLoading(true);
          setRevision((v) => v + 1);
        }}
      >
        刷新权益
      </button>
      {loading ? (
        <output>正在校验权益…</output>
      ) : error ? (
        <p className="m-auth-error" role="alert">
          权益暂不可确认。{error}
        </p>
      ) : !features.length ? (
        <p>尚无本产品功能配置。</p>
      ) : null}
      {stale ? <output>校验结果已过期，请刷新权益。</output> : null}
      <ul className="m-account-methods">
        {decisions?.map((decision) => (
          <li key={decision.featureId}>
            <div>
              <strong>
                {features.find(
                  (feature) => feature.featureId === decision.featureId,
                )?.name ?? decision.featureId}
              </strong>
              <p>
                {stale ? '待重新校验' : decision.allowed ? '已开放' : '未开通'}
              </p>
              {!stale && decision.allowed ? (
                <ul>
                  {decision.sources.map((source) => (
                    <li
                      key={
                        source.kind +
                        ':' +
                        source.subscriptionId +
                        (source.kind === 'TENANT_SEAT'
                          ? ':' + source.assignmentId
                          : '')
                      }
                    >
                      {source.kind === 'TENANT_SEAT'
                        ? '租户席位 · ' +
                          seatLabel(
                            source.subscriptionId,
                            source.seatTypeId,
                            subscriptions,
                            plans,
                          )
                        : '个人订阅 · ' +
                          (() => {
                            const sub = subscriptions.find(
                              (s) => s.subscriptionId === source.subscriptionId,
                            );
                            return (
                              (sub && subscriptionPlan(sub, plans)?.name) ??
                              source.subscriptionId
                            );
                          })()}
                    </li>
                  ))}
                </ul>
              ) : null}
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
