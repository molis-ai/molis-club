'use client';
import { useEffect, useState } from 'react';
import type {
  Assignment,
  Feature,
  Membership,
  PlanVersion,
  SeatPool,
  Subscription,
  TenantView,
} from '../../../lib/account/contracts/types';
import { accountItems } from '../../_site/tenant-account-client';
import { accountErrorText } from '../../_site/central-account-client';
import type { TenantClient, TenantMutation } from './account-tenants';
import { AccountSeats } from './account-seats';
import { AccountEntitlements } from './account-entitlements';
import { subscriptionPlan, subscriptionStatus } from './billing-view';
interface BillingView {
  tenant?: TenantView;
  plans: PlanVersion[];
  features: Feature[];
  personal: Subscription[];
  subscriptions: Subscription[];
  pools: SeatPool[];
  assignments: Assignment[];
  history: Assignment[];
  members: Membership[];
}
export function AccountBilling({
  client,
  tenantId,
  disabled,
  mutate,
  refresh,
}: {
  client: TenantClient;
  tenantId?: string;
  disabled: boolean;
  mutate: TenantMutation;
  refresh: () => void;
}) {
  const [view, setView] = useState<BillingView | null>(null),
    [error, setError] = useState('');
  useEffect(() => {
    let active = true;
    async function read() {
      const tenant = tenantId ? await client.tenant(tenantId) : undefined;
      if (tenant?.status === 'DISABLED') throw Error('Tenant unavailable');
      const manager = tenant && tenant.myRole !== 'MEMBER';
      const [
        plans,
        features,
        personal,
        subscriptions,
        pools,
        assignments,
        history,
        members,
      ] = await Promise.all([
        accountItems(client.billingPlans),
        accountItems(client.billingFeatures),
        accountItems((cursor) =>
          client.billingSubscriptions(undefined, cursor),
        ),
        tenantId
          ? accountItems((cursor) =>
              client.billingSubscriptions(tenantId, cursor),
            )
          : [],
        tenantId && manager
          ? accountItems((cursor) => client.billingPools(tenantId, cursor))
          : [],
        tenantId
          ? accountItems((cursor) =>
              client.billingAssignments(tenantId, 'current', cursor),
            )
          : [],
        tenantId
          ? accountItems((cursor) =>
              client.billingAssignments(tenantId, 'history', cursor),
            )
          : [],
        tenantId && manager
          ? accountItems((cursor) => client.members(tenantId, cursor))
          : [],
      ]);
      if (active)
        setView({
          tenant,
          plans,
          features: features.filter(
            (feature) =>
              feature.product === 'CLUB' || feature.product === 'SHARED',
          ),
          personal,
          subscriptions,
          pools,
          assignments,
          history,
          members,
        });
    }
    void read().catch((e) => {
      if (active) setError(accountErrorText(e));
    });
    return () => {
      active = false;
    };
  }, [client, tenantId]);
  const renderSubscriptions = (
    title: string,
    subscriptions: Subscription[],
  ) => (
    <section className="m-account-section" aria-label={title}>
      <h3>{title}</h3>
      {subscriptions.length ? (
        <ul className="m-account-methods">
          {subscriptions.map((subscription) => (
            <li key={subscription.subscriptionId}>
              <div>
                <strong>
                  {subscriptionPlan(subscription, view!.plans)?.name ??
                    subscription.planId}
                </strong>
                <p>{subscriptionStatus[subscription.status]}</p>
                <p>
                  {new Date(subscription.startsAt).toLocaleString()} —{' '}
                  {new Date(subscription.endsAt).toLocaleString()}
                </p>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p>暂无订阅。</p>
      )}
    </section>
  );
  return (
    <section className="m-account-section" aria-label="订阅与权益">
      <h3>订阅与权益</h3>
      <button className="m-link" disabled={disabled} onClick={refresh}>
        刷新订阅与席位
      </button>
      {error ? (
        <p className="m-auth-error" role="alert">
          订阅、席位及权益暂不可确认。{error}
        </p>
      ) : !view ? (
        <output>正在读取订阅与席位…</output>
      ) : (
        <>
          {renderSubscriptions('个人订阅', view.personal)}
          {view.tenant ? (
            <>
              {renderSubscriptions('租户订阅', view.subscriptions)}
              <AccountSeats
                client={client}
                tenant={view.tenant}
                pools={view.pools}
                assignments={view.assignments}
                history={view.history}
                members={view.members}
                subscriptions={view.subscriptions}
                plans={view.plans}
                disabled={disabled}
                mutate={mutate}
              />
            </>
          ) : null}
          <AccountEntitlements
            client={client}
            tenantId={tenantId}
            features={view.features}
            subscriptions={[...view.personal, ...view.subscriptions]}
            plans={view.plans}
          />
        </>
      )}
    </section>
  );
}
