import type {
  TenantCreateRequest,
  PlatformTenantView,
  PlatformTenantViewPage,
  PlatformVersionRequest,
  Subscription,
  SubscriptionPage,
  SubscriptionCreateRequest,
  SubscriptionUpdateRequest,
  SubscriptionRenewRequest,
  SeatPoolPage,
  AuditEventPage,
} from '../../lib/account/contracts/types';
type Call = <T>(
  path: string,
  body?: unknown,
  headers?: Record<string, string>,
  method?: 'PATCH',
) => Promise<T>;
const part = encodeURIComponent;
const page = (cursor?: string | null) =>
  '?limit=100' + (cursor ? '&cursor=' + part(cursor) : '');
export function createPlatformAccount(call: Call) {
  const tenant = (id: string) => '/platform/tenants/' + part(id),
    sub = (id: string) => '/platform/subscriptions/' + part(id);
  const write = <T>(path: string, body: unknown, patch?: 'PATCH') =>
    call<T>(path, body, { 'Idempotency-Key': crypto.randomUUID() }, patch);
  return {
    platformTenants: (cursor?: string | null) =>
      call<PlatformTenantViewPage>('/platform/tenants' + page(cursor)),
    platformTenant: (id: string) => call<PlatformTenantView>(tenant(id)),
    createTenant: (body: TenantCreateRequest) =>
      write<PlatformTenantView>('/platform/tenants', body),
    tenantStatus: (
      id: string,
      action: 'disable' | 'enable',
      body: PlatformVersionRequest,
    ) => write<PlatformTenantView>(tenant(id) + '/' + action, body),
    platformSubscriptions: (cursor?: string | null) =>
      call<SubscriptionPage>('/platform/subscriptions' + page(cursor)),
    platformSubscription: (id: string) => call<Subscription>(sub(id)),
    platformPools: (id: string, cursor?: string | null) =>
      call<SeatPoolPage>(sub(id) + '/seat-pools' + page(cursor)),
    createSubscription: (body: SubscriptionCreateRequest) =>
      write<Subscription>('/platform/subscriptions', body),
    updateSubscription: (id: string, body: SubscriptionUpdateRequest) =>
      write<Subscription>(sub(id), body, 'PATCH'),
    renewSubscription: (id: string, body: SubscriptionRenewRequest) =>
      write<Subscription>(sub(id) + '/renew', body),
    platformAudit: (cursor?: string | null) =>
      call<AuditEventPage>('/platform/audit-events' + page(cursor)),
  };
}
