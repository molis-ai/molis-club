import { createTenantAccount } from './tenant-account-client';
import { createPlatformAccount } from './platform-account-client';
import { createBillingAccount } from './billing-account-client';
import type {
  AccountView,
  LoginCapabilities,
  ProductLoginResult,
  LoginVerification,
  MeView,
  ProductTransactionView,
  ProductSubmitResult,
  ProductSubmitRequest,
  ProductTransactionRequest,
  ProductReauthenticationRequest,
  LoginMethodsView,
  ProfileUpdateRequest,
  UserView,
  ProductBindRequest,
  ProductUnlinkRequest,
  ProductPasswordChangeRequest,
  PasswordChangeResult,
} from '../../lib/account/contracts/types';

export class AccountRequestError extends Error {
  constructor(
    readonly code: string,
    readonly retryAfterSeconds = 0,
  ) {
    super(code);
  }
}
export function accountErrorText(error: unknown): string {
  const code = error instanceof AccountRequestError ? error.code : '';
  const messages: Record<string, string> = {
    INVALID_CREDENTIALS: '邮箱、密码或验证码不正确，请重试。',
    CHALLENGE_EXPIRED: '验证码已过期，请重新发送。',
    TRANSACTION_EXPIRED: '验证已过期，请重新开始。',
    PROOF_CONSUMED: '这次验证已使用，请重新开始。',
    RATE_LIMITED: '操作较频繁，请稍后重试。',
    LAST_LOGIN_METHOD: '至少保留一种可用登录方式，请先绑定其他方式。',
    SESSION_EXPIRED: '登录已过期，请重新登录。',
    IDENTITY_IN_USE: '该登录方式已被使用，请登录已有账号。',
    UNIFIED_CONFIGURATION_INVALID: '账号服务尚未配置，请稍后再试。',
    VERSION_CONFLICT: '账号状态已变化，请重新开始。',
    FORBIDDEN: '没有权限完成此操作，请刷新账号状态。',
    TENANT_DISABLED: '租户已停用，请联系平台管理人员。',
    OWNER_TRANSFER_REQUIRED: '请先完成所有权交接，再退出租户。',
    NOT_FOUND: '该记录已不可用，请刷新后重试。',
    CAPACITY_CONFLICT: '席位容量或分配已变化，请重新读取后操作。',
    SUBSCRIPTION_INACTIVE: '该订阅当前未生效，不能分配或换绑席位。',
    AUTH_UNAVAILABLE: '账号服务暂不可用，当前状态无法确认。',
    UPSTREAM_UNAVAILABLE: '验证码或第三方登录服务暂时无法连接，请稍后再试。',
    POLICY_MISMATCH: '登录服务配置暂不一致，请稍后再试。',
    PROVIDER_CANCELLED: '已取消第三方登录。',
  };
  return messages[code] ?? '暂时无法完成，请重试或重新开始。';
}
// The header and login form can mount together before the first session cookie exists.
let pendingSession: Promise<Response> | undefined;
function readSession() {
  if (!pendingSession) {
    const request = fetch('/api/account/session', { credentials: 'same-origin', cache: 'no-store', redirect: 'error' });
    pendingSession = request;
    const clear = () => { if (pendingSession === request) pendingSession = undefined; };
    request.then(clear, clear);
  }
  return pendingSession.then(response => response.clone());
}

/** Only same-origin product routes. No tokens or credentials are stored in the browser. */
export function createBrowserAccount() {
  let csrf = '';
  async function call<T>(
    path: string,
    body?: unknown,
    extra?: Record<string, string>,
    method?: 'PATCH',
  ): Promise<T> {
    if (body !== undefined) pendingSession = undefined;
    const response = path === '/session' ? await readSession() : await fetch('/api/account' + path, {
      method: method ?? (body === undefined ? 'GET' : 'POST'),
      credentials: 'same-origin',
      cache: 'no-store',
      redirect: 'error',
      headers: {
        ...(body === undefined
          ? {}
          : { 'Content-Type': 'application/json', 'X-CSRF-Token': csrf }),
        ...extra,
      },
      ...(body === undefined ? {} : { body: JSON.stringify(body) }),
    });
    const next = response.headers.get('x-csrf-token');
    if (next) csrf = next;
    const result = (await response.json()) as {
      data: T;
      error?: { code?: string; retryAfterSeconds?: number };
    };
    if (!response.ok)
      throw new AccountRequestError(
        result.error?.code ?? 'AUTH_UNAVAILABLE',
        result.error?.retryAfterSeconds ?? 0,
      );
    if (
      path === '/logout' ||
      path === '/profile' ||
      (result.data &&
        typeof result.data === 'object' &&
        'account' in result.data)
    ) {
      // Header consumes only a notification; identity is re-read from the session owner.
      window.dispatchEvent(new Event('molis:account-changed'));
    }
    return result.data as T;
  }
  return {
    ...createTenantAccount(call),
    ...createBillingAccount(call),
    ...createPlatformAccount(call),
    loginPassword: (identifier: string, password: string) => call<ProductLoginResult>('/auth/login/password',{identifier,password}),
    sendVerification: (channel: 'EMAIL' | 'SMS', address: string) => call<LoginVerification>('/auth/verification-codes',{purpose:'LOGIN',channel,address}),
    loginCode: (verificationId: string, code: string) => call<ProductLoginResult>('/auth/login/code',{verificationId,code}),
    me: () => call<MeView>('/me'),
    methods: () => call<LoginMethodsView>('/login-methods'),
    profile: (body: ProfileUpdateRequest, key = crypto.randomUUID()) =>
      call<UserView>('/profile', body, { 'Idempotency-Key': key }, 'PATCH'),
    reauthenticate: (body: ProductReauthenticationRequest) =>
      call<ProductTransactionView>('/reauthentications', body),
    transaction: (handle: string) =>
      call<ProductTransactionView>(
        '/auth/transactions/' + encodeURIComponent(handle),
      ),
    bind: (body: ProductBindRequest, key: string) =>
      call<LoginMethodsView>('/login-methods/bind', body, {
        'Idempotency-Key': key,
      }),
    replace: (id: string, body: ProductBindRequest, key: string) =>
      call<LoginMethodsView>(
        '/login-methods/' + encodeURIComponent(id) + '/replace',
        body,
        { 'Idempotency-Key': key },
      ),
    unlink: (id: string, body: ProductUnlinkRequest, key: string) =>
      call<LoginMethodsView>(
        '/login-methods/' + encodeURIComponent(id) + '/unlink',
        body,
        { 'Idempotency-Key': key },
      ),
    password: (body: ProductPasswordChangeRequest, key: string) =>
      call<PasswordChangeResult>('/password/change', body, {
        'Idempotency-Key': key,
      }),
    capabilities: () => call<LoginCapabilities>('/auth/capabilities'),
    session: () => call<AccountView>('/session'),
    activity: () =>
      call('/activity', { eventId: crypto.randomUUID(), kind: 'OPEN' }),
    create: (body: ProductTransactionRequest) =>
      call<ProductTransactionView>('/auth/transactions', body),
    submit: (handle: string, body: ProductSubmitRequest) =>
      call<ProductSubmitResult>(
        '/auth/transactions/' + encodeURIComponent(handle) + '/submit',
        body,
      ),
    resend: (handle: string) =>
      call<ProductTransactionView>(
        '/auth/transactions/' + encodeURIComponent(handle) + '/resend',
        {},
      ),
    cancel: (handle: string) =>
      call<ProductTransactionView>(
        '/auth/transactions/' + encodeURIComponent(handle) + '/cancel',
        {},
      ),
    reset: (handle: string, newPassword: string) =>
      call('/password/reset', { resetHandle: handle, newPassword }),
    logout: (scope: 'CURRENT_LOGIN' | 'ALL_MOLIS_PRODUCTS') =>
      call<{
        localCleared: true;
        remoteRevocation: 'CONFIRMED' | 'UNCONFIRMED';
      }>('/logout', { scope }, { 'Idempotency-Key': crypto.randomUUID() }),
  };
}
