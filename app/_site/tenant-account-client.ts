import type {
  MyTenantsPage,
  TenantView,
  MembershipPage,
  Membership,
  TenantUpdateRequest,
  InvitationPage,
  Invitation,
  InvitationCreateRequest,
  InvitationAcceptResult,
  OwnershipTransferPage,
  OwnershipTransfer,
  TransferAcceptResult,
  TransferCreateRequest,
  ExpectedVersionRequest,
  RoleUpdateRequest,
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
export function createTenantAccount(call: Call) {
  const tenant = (id: string) => '/tenants/' + part(id);
  const write = <T>(path: string, body: unknown, patch = false) =>
    call<T>(
      path,
      body,
      { 'Idempotency-Key': crypto.randomUUID() },
      patch ? 'PATCH' : undefined,
    );
  return {
    tenants: (cursor?: string | null) =>
      call<MyTenantsPage>('/tenants' + page(cursor)),
    tenant: (id: string) => call<TenantView>(tenant(id)),
    updateTenant: (id: string, body: TenantUpdateRequest) =>
      write<TenantView>(tenant(id), body, true),
    members: (id: string, cursor?: string | null) =>
      call<MembershipPage>(tenant(id) + '/members' + page(cursor)),
    role: (id: string, member: string, body: RoleUpdateRequest) =>
      write<Membership>(
        tenant(id) + '/members/' + part(member) + '/role',
        body,
        true,
      ),
    removeMember: (id: string, member: string, body: ExpectedVersionRequest) =>
      write<Membership>(
        tenant(id) + '/members/' + part(member) + '/remove',
        body,
      ),
    leaveTenant: (id: string, body: ExpectedVersionRequest) =>
      write<Membership>(tenant(id) + '/leave', body),
    tenantInvitations: (id: string, cursor?: string | null) =>
      call<InvitationPage>(tenant(id) + '/invitations' + page(cursor)),
    invite: (id: string, body: InvitationCreateRequest) =>
      write<Invitation>(tenant(id) + '/invitations', body),
    revokeInvitation: (
      id: string,
      invitation: string,
      body: ExpectedVersionRequest,
    ) =>
      write<Invitation>(
        tenant(id) + '/invitations/' + part(invitation) + '/revoke',
        body,
      ),
    invitations: (cursor?: string | null) =>
      call<InvitationPage>('/invitations' + page(cursor)),
    answerInvitation: (
      id: string,
      answer: 'accept' | 'decline',
      body: ExpectedVersionRequest,
    ) =>
      write<Invitation | InvitationAcceptResult>(
        '/invitations/' + part(id) + '/' + answer,
        body,
      ),
    transfers: (cursor?: string | null) =>
      call<OwnershipTransferPage>('/ownership-transfers' + page(cursor)),
    transfer: (id: string, body: TransferCreateRequest) =>
      write<OwnershipTransfer>(tenant(id) + '/ownership-transfers', body),
    answerTransfer: (
      id: string,
      answer: 'accept' | 'cancel',
      body: ExpectedVersionRequest,
    ) =>
      write<OwnershipTransfer | TransferAcceptResult>(
        '/ownership-transfers/' + part(id) + '/' + answer,
        body,
      ),
  };
}
/** Follow the contract cursor; never infer completeness from the first page. */
export async function accountItems<T>(
  read: (
    cursor?: string | null,
  ) => Promise<{ items: T[]; nextCursor: string | null }>,
): Promise<T[]> {
  const items: T[] = [],
    seen = new Set<string>();
  let cursor: string | null = null;
  do {
    const result = await read(cursor);
    items.push(...result.items);
    cursor = result.nextCursor;
    if (cursor && seen.has(cursor)) throw new Error('Repeated account cursor');
    if (cursor) seen.add(cursor);
  } while (cursor);
  return items;
}
