import type {
  AssignmentPage,
  FeaturePage,
  PlanVersionPage,
  SeatPoolPage,
  SubscriptionPage,
  SeatAssignRequest,
  SeatReleaseRequest,
  SeatReassignRequest,
  SeatMutationResult,
  SeatReassignResult,
  EntitlementCheckRequest,
  EntitlementCheckResult,
} from '../../lib/account/contracts/types';
type Call = <T>(
  path: string,
  body?: unknown,
  headers?: Record<string, string>,
) => Promise<T>;
const part = encodeURIComponent;
const page = (cursor?: string | null) =>
  '?limit=100' + (cursor ? '&cursor=' + part(cursor) : '');
export function createBillingAccount(call: Call) {
  const tenant = (id: string) => '/tenants/' + part(id);
  const write = <T>(path: string, body: unknown) =>
    call<T>(path, body, { 'Idempotency-Key': crypto.randomUUID() });
  return {
    billingPlans: (cursor?: string | null) =>
      call<PlanVersionPage>('/catalog/plans' + page(cursor)),
    billingFeatures: (cursor?: string | null) =>
      call<FeaturePage>('/catalog/features' + page(cursor)),
    billingSubscriptions: (id?: string, cursor?: string | null) =>
      call<SubscriptionPage>(
        (id ? tenant(id) : '') + '/subscriptions' + page(cursor),
      ),
    billingPools: (id: string, cursor?: string | null) =>
      call<SeatPoolPage>(tenant(id) + '/seat-pools' + page(cursor)),
    billingAssignments: (
      id: string,
      state: 'current' | 'history',
      cursor?: string | null,
    ) =>
      call<AssignmentPage>(
        tenant(id) + '/seat-assignments' + page(cursor) + '&state=' + state,
      ),
    assignSeat: (id: string, body: SeatAssignRequest) =>
      write<SeatMutationResult>(tenant(id) + '/seat-assignments', body),
    releaseSeat: (id: string, assignment: string, body: SeatReleaseRequest) =>
      write<SeatMutationResult>(
        tenant(id) + '/seat-assignments/' + part(assignment) + '/release',
        body,
      ),
    reassignSeat: (id: string, assignment: string, body: SeatReassignRequest) =>
      write<SeatReassignResult>(
        tenant(id) + '/seat-assignments/' + part(assignment) + '/reassign',
        body,
      ),
    checkEntitlements: (body: EntitlementCheckRequest) =>
      call<EntitlementCheckResult>('/entitlements/check', body),
  };
}
