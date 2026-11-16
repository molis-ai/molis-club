import type { CentralAccountClient, CallInput } from './client.ts';
import type { ClubSessionManager, LoginPermit } from './sessions.ts';
import type {
  CentralOperationId,
  ProductLoginPasswordRequest,
  ProductSendVerificationRequest,
  LoginCodeRequest,
  LoginResult,
  ProductTransactionRequest,
  ProductSubmitRequest,
  ProductTransactionView,
  ProductSubmitResult,
  ProductPasswordResetRequest,
  ProductReauthenticationRequest,
  ProductBindRequest,
  ProductUnlinkRequest,
  ProductPasswordChangeRequest,
} from './contracts/types.ts';
import { validateNamed } from './contracts/validate.ts';
import { AccountFailure, requireAccount } from './errors.ts';
import { digestSessionSecret, randomSessionSecret } from './session-crypto.ts';
import { createAuthCryptography } from './auth-crypto.ts';
import { createAuthStore, type AuthRow } from './auth-store.ts';

interface Pending {
  permit?: LoginPermit;
  identity?: Awaited<
    ReturnType<ClubSessionManager['authenticationBinding']>
  >['identity'];
  operation?: ProductReauthenticationRequest['operation'];
  target?: ProductReauthenticationRequest['target'];
  reauthHandle?: string;
  bindingId?: string;
  operationProof?: string;
  identityProof?: string;
  receipt?: { key: string; digest: string; result: unknown };
  purpose: string;
  method: string;
  state: string;
  proof: string;
  verifier: string;
  view: ProductTransactionView;
  address?: string;
  challenge?: { id: string; handle: string };
  verification?: string;
  reset?: string;
}
/** Validate the complete status/nextStep pair before exposing a product handle. */
function productView(value: unknown): ProductTransactionView {
  requireAccount(
    validateNamed('ProductTransactionView', value),
    503,
    'AUTH_UNAVAILABLE',
  );
  return value as ProductTransactionView;
}
export async function createClubAuthentication(
  db: D1Database,
  client: CentralAccountClient,
  owner: ClubSessionManager,
  encryptionKey: string | undefined,
) {
  const config = client.config,
    context = await digestSessionSecret(JSON.stringify(config));
  const store = createAuthStore(db, context),
    cryptography = createAuthCryptography(encryptionKey, context);
  const seal = (pending: Pending, row: AuthRow) =>
    cryptography.seal(pending, row.id, row.browser_digest);
  async function load(request: Request, row: AuthRow | null, callback = false) {
    requireAccount(
      row && row.box && row.expires_at > Date.now(),
      409,
      'TRANSACTION_EXPIRED',
    );
    const pending = (await cryptography.open(
      row.box,
      row.id,
      row.browser_digest,
    )) as Pending;
    requireAccount(
      pending &&
        validateNamed('ProductTransactionView', pending.view) &&
        pending.view.handle === row.id,
      503,
      'UNIFIED_CONFIGURATION_INVALID',
    );
    requireAccount(
      Date.parse(pending.view.expiresAt) > Date.now(),
      409,
      'TRANSACTION_EXPIRED',
    );
    await authorize(request, pending, callback);
    return { row, pending };
  }
  async function authorize(request: Request, p: Pending, readOnly = false) {
    if (p.identity)
      return (await owner.authenticationBinding(request, p.identity, readOnly))
        .binding;
    requireAccount(p.permit, 403, 'FORBIDDEN');
    await owner.assertLogin(request, p.permit, readOnly);
    return undefined;
  }
  async function operation(
    request: Request,
    handle: string,
    run: (
      p: Pending,
      row: AuthRow,
      call: typeof client.call,
    ) => Promise<unknown>,
    callback = false,
  ) {
    const { row: original, pending } = await load(
      request,
      await store.get(handle),
      callback,
    );
    const row = await store.claim(original);
    let committed = false;
    const assertCurrent = async () => {
      await store.assert(row);
      await authorize(request, pending, callback);
    };
    const binding = await authorize(request, pending, callback);
    const call: typeof client.call = async (id, input, ctx) =>
      client.call(id, input, {
        ...ctx,
        ...(binding ? { session: binding } : {}),
        signal: request.signal,
        assertCurrent: async () => {
          await assertCurrent();
          await ctx?.assertCurrent?.();
        },
      });
    try {
      const result = await run(pending, row, call);
      const ended =
        pending.view.status === 'CANCELLED' ||
        (pending.view.status === 'CONSUMED' &&
          !pending.reset &&
          !pending.operationProof &&
          !pending.identityProof &&
          !pending.receipt);
      await store.save(
        row,
        ended
          ? pending.purpose === 'LOGIN' && ['GOOGLE', 'GITHUB'].includes(pending.method)
            ? await cryptography.seal({
              view: pending.view,
              ...('account' in (result as object)
                ? { loginSessionId: (result as { account: { session: { loginSessionId: string } } }).account.session.loginSessionId }
                : { permit: pending.permit }),
            }, row.id, row.browser_digest)
            : null
          : await seal(pending, row),
        ended ? 'CONSUMED' : 'READY',
      );
      committed = true;
      return result;
    } catch (error) {
      // A lost response must never replay a consumed proof or authorization code.
      if (!committed) {
        const retry =
          error instanceof AccountFailure &&
          [
            'INVALID_CREDENTIALS',
            'RATE_LIMITED',
            'INVALID_REQUEST',
            'IDENTITY_IN_USE',
            'LAST_LOGIN_METHOD',
            'VERSION_CONFLICT',
          ].includes(error.envelope.error.code);
        await store
          .save(
            row,
            retry ? await seal(pending, row) : null,
            retry ? 'READY' : 'EXPIRED',
          )
          .catch(() => {
            /* Concurrent cancellation already fences this transaction. */
          });
      }
      throw error;
    }
  }
  const invoke = async (
    p: Pending,
    row: AuthRow,
    call: typeof client.call,
    id: CentralOperationId,
    body: CallInput['body'],
    challengeId?: string,
  ) =>
    (
      await call(id, {
        path: {
          transactionId: row.central_id,
          ...(challengeId ? { challengeId } : {}),
        },
        initiatorProof: p.proof,
        ...(body === undefined ? {} : { body }),
      })
    ).data;
  async function sync(p: Pending, row: AuthRow, call: typeof client.call) {
    const result = await invoke(p, row, call, 'getTransaction', undefined);
    requireAccount(
      validateNamed('TransactionView', result),
      503,
      'AUTH_UNAVAILABLE',
    );
    const { transactionId: _id, ...rest } = result as {
      transactionId: string;
    } & Omit<ProductTransactionView, 'handle'>;
    p.view = { ...rest, handle: row.id } as ProductTransactionView;
    return p.view;
  }
  async function send(p: Pending, row: AuthRow, call: typeof client.call) {
    requireAccount(p.address && p.view.status === 'PENDING' && !p.verification);
    const result = await call('createChallenge', {
      path: { transactionId: row.central_id },
      initiatorProof: p.proof,
      body: {
        channel: p.method === 'PHONE_OTP' ? 'SMS' : 'EMAIL',
        address: p.address,
      },
    });
    p.challenge = {
      handle: p.challenge?.handle ?? crypto.randomUUID(),
      id: result.data.challengeId,
    };
    p.view = { ...p.view, status: 'PENDING', nextStep: 'VERIFY_CHALLENGE' };
    return {
      challengeHandle: p.challenge.handle,
      expiresAt: result.data.expiresAt,
      retryAfterSeconds: result.data.retryAfterSeconds,
      nextStep: 'VERIFY_CHALLENGE' as const,
    };
  }
  async function complete(
    request: Request,
    p: Pending,
    row: AuthRow,
    call: typeof client.call,
  ): Promise<ProductSubmitResult> {
    const result = await call('completeTransaction', {
      path: { transactionId: row.central_id },
      initiatorProof: p.proof,
      body: {},
    });
    if (p.identity) {
      requireAccount(
        p.purpose === 'REAUTH'
          ? result.data.kind === 'OPERATION_PROOF'
          : result.data.kind === 'NEW_IDENTITY_PROOF',
        503,
        'AUTH_UNAVAILABLE',
      );
      if (result.data.kind === 'OPERATION_PROOF')
        p.operationProof = result.data.operationProof;
      if (result.data.kind === 'NEW_IDENTITY_PROOF')
        p.identityProof = result.data.newIdentityProof;
      p.view = {
        ...p.view,
        status: 'CONSUMED',
        nextStep: 'NONE',
        expiresAt: result.data.expiresAt,
      };
      row.expires_at = Math.min(
        row.expires_at,
        Date.parse(result.data.expiresAt),
      );
      return { operationReady: true };
    }
    if (p.purpose === 'PASSWORD_RESET') {
      requireAccount(
        result.data.kind === 'RESET_PROOF',
        503,
        'AUTH_UNAVAILABLE',
      );
      p.reset = result.data.resetProof;
      p.view = { ...p.view, status: 'CONSUMED', nextStep: 'NONE' };
      return { operationReady: true };
    }
    return acceptLogin(request, p, result.data as LoginResult);
  }
  async function acceptLogin(request: Request, p: Pending, result: LoginResult) {
    requireAccount(
      result.kind === 'LOGIN_CODE' && result.state === p.state,
      403,
      'FORBIDDEN',
    );
    requireAccount(p.permit, 403, 'FORBIDDEN');
    await owner.assertLogin(request, p.permit, true);
    p.view = { ...p.view, status: 'CONSUMED', nextStep: 'NONE' };
    // Use the session owner's late-result revocation even if a cancel wins during exchange.
    const tokens = await client.call('exchangeToken', {
      body: {
        grantType: 'authorization_code',
        clientId: config.client.clientId,
        code: result.code,
        redirectUri: config.redirectUri,
        codeVerifier: p.verifier,
      },
    });
    return {
      account: await owner.completeLogin(request, p.permit, tokens.data),
    };
  }
  async function step(
    request: Request,
    p: Pending,
    row: AuthRow,
    call: typeof client.call,
    input: ProductSubmitRequest,
  ): Promise<ProductSubmitResult> {
    requireAccount(input.step === p.view.nextStep);
    if (input.step === 'REQUEST_CHALLENGE') {
      requireAccount(['PHONE_OTP', 'EMAIL_CODE'].includes(p.method));
      p.address = input.address;
      return send(p, row, call);
    }
    if (input.step === 'VERIFY_CHALLENGE') {
      requireAccount(
        p.challenge && input.challengeHandle === p.challenge.handle,
        403,
        'FORBIDDEN',
      );
      const result = await call('verifyChallenge', {
        path: { transactionId: row.central_id, challengeId: p.challenge.id },
        initiatorProof: p.proof,
        body: { credential: input.credential },
      });
      p.verification = result.data.verificationProof;
      return sync(p, row, call);
    }
    if (input.step === 'PASSWORD_LOGIN')
      await invoke(p, row, call, 'verifyPassword', {
        ...('identifier' in input
          ? { identifier: input.identifier }
          : { email: input.email }),
        password: input.password,
      });
    else if (input.step === 'EMAIL_SIGNUP') {
      requireAccount(
        p.verification &&
          input.email.trim().toLowerCase() === p.address?.trim().toLowerCase(),
        403,
        'FORBIDDEN',
      );
      await invoke(p, row, call, 'signUpEmail', {
        email: input.email,
        password: input.password,
        verificationProof: p.verification,
      });
      delete p.verification;
    } else if (input.step === 'CODE_LOGIN') {
      requireAccount(p.verification, 403, 'FORBIDDEN');
      await invoke(p, row, call, 'signInCode', {
        verificationProof: p.verification,
      });
      delete p.verification;
    } else if (input.step === 'PHONE_LOGIN') {
      requireAccount(p.verification, 403, 'FORBIDDEN');
      await invoke(p, row, call, 'signInPhone', {
        verificationProof: p.verification,
      });
      delete p.verification;
    } else if (input.step === 'COMPLETE')
      return complete(request, p, row, call);
    else if (input.step === 'START_PROVIDER') {
      requireAccount(p.method === 'GOOGLE' || p.method === 'GITHUB');
      const result = await call(
        p.method === 'GOOGLE' ? 'startGoogle' : 'startGitHub',
        {
          path: { transactionId: row.central_id },
          initiatorProof: p.proof,
          body: {},
        },
      );
      const url = new URL(result.data.browserStartUrl);
      requireAccount(
        url.origin === config.client.authOrigin &&
          url.pathname ===
            `/api/v2/auth/external/${p.method.toLowerCase()}/browser-start` &&
          !url.hash &&
          !url.username &&
          !url.password &&
          [...url.searchParams.keys()].join() === 'ticket' &&
          !!url.searchParams.get('ticket'),
        503,
        'AUTH_UNAVAILABLE',
      );
      p.view = { ...p.view, status: 'PENDING', nextStep: 'WAIT_PROVIDER' };
      return result.data;
    } else throw new AccountFailure(400, 'INVALID_REQUEST');
    return sync(p, row, call);
  }
  async function createSensitive(
    request: Request,
    input:
      | ProductReauthenticationRequest
      | Extract<ProductTransactionRequest, { purpose: 'BIND' | 'REPLACE' }>,
  ) {
    const { binding, identity } = await owner.authenticationBinding(request);
    const reauth = !('purpose' in input);
    if (!reauth) {
      const parent = (await load(request, await store.get(input.reauthHandle)))
        .pending;
      requireAccount(
        parent.operationProof && parent.purpose === 'REAUTH',
        409,
        'TRANSACTION_EXPIRED',
      );
      const type =
        input.method === 'EMAIL_CODE'
          ? 'EMAIL'
          : input.method === 'PHONE_OTP'
            ? 'PHONE'
            : input.method;
      requireAccount(
        input.purpose === 'BIND'
          ? parent.operation === 'BIND_METHOD' &&
              parent.target &&
              'method' in parent.target &&
              parent.target.method === type
          : parent.operation === 'REPLACE_METHOD' &&
              parent.target &&
              'bindingId' in parent.target &&
              parent.target.bindingId === input.bindingId,
        403,
        'FORBIDDEN',
      );
    }
    const proof = randomSessionSecret(),
      verifier = randomSessionSecret(),
      state = randomSessionSecret();
    const common = {
      clientId: config.client.clientId,
      redirectUri: config.redirectUri,
      state,
      method: input.method,
      codeChallenge: await digestSessionSecret(verifier),
      codeChallengeMethod: 'S256' as const,
      initiatorChallenge: await digestSessionSecret(proof),
    };
    const result = await client.call(
      reauth ? 'createReauthentication' : 'createTransaction',
      {
        body: (reauth
          ? {
              ...common,
              operation: input.operation,
              target: input.target,
              ...(input.useSession === undefined
                ? {}
                : { useSession: input.useSession }),
            }
          : {
              ...common,
              purpose: input.purpose,
              ...(input.purpose === 'REPLACE'
                ? { bindingId: input.bindingId }
                : {}),
            }) as CallInput<
          'createTransaction' | 'createReauthentication'
        >['body'],
      },
      {
        session: binding,
        signal: request.signal,
        assertCurrent: async () => {
          await owner.authenticationBinding(request, identity);
        },
      },
    );
    const { transactionId, ...view } = result.data,
      id = crypto.randomUUID();
    const pending: Pending = {
      identity,
      proof,
      verifier,
      state,
      purpose: reauth ? 'REAUTH' : input.purpose,
      method: input.method,
      ...(reauth
        ? { operation: input.operation, target: input.target }
        : {
            reauthHandle: input.reauthHandle,
            ...(input.purpose === 'REPLACE'
              ? { bindingId: input.bindingId }
              : {}),
          }),
      view: productView({ ...view, handle: id }),
    };
    const row: AuthRow = {
      id,
      context,
      browser_digest: identity.id,
      central_id: transactionId,
      state: 'READY',
      version: 0,
      expires_at: Date.parse(view.expiresAt),
      lease_until: null,
      box: null,
    };
    row.box = await seal(pending, row);
    await store.create(row);
    return pending.view;
  }
  async function loginStart(request: Request, input: ProductLoginPasswordRequest | ProductSendVerificationRequest) {
    const sending = 'channel' in input;
    requireAccount(validateNamed(sending ? 'ProductSendVerificationRequest' : 'ProductLoginPasswordRequest', input));
    const permit = await owner.beginLogin(request), proof = randomSessionSecret(), verifier = randomSessionSecret(), state = randomSessionSecret();
    const common = { clientId: config.client.clientId, redirectUri: config.redirectUri, state, codeChallenge: await digestSessionSecret(verifier), codeChallengeMethod: 'S256' as const, initiatorChallenge: await digestSessionSecret(proof) };
    const id = crypto.randomUUID();
    const p: Pending = { permit, proof, verifier, state, purpose: 'LOGIN', method: sending ? input.channel === 'SMS' ? 'PHONE_OTP' : 'EMAIL_CODE' : 'ACCOUNT_PASSWORD', view: {handle:id,status:'PENDING',nextStep:'VERIFY_CHALLENGE',expiresAt:new Date(Date.now()+300000).toISOString()} };
    try {
      const context = { signal: request.signal, assertCurrent: () => owner.assertLogin(request, permit) };
      if (!sending) {
        const result = await client.call('loginPassword', {body:{...common,...input},initiatorProof:proof},context);
        return acceptLogin(request,p,result.data);
      }
      const result = await client.call('sendLoginVerification',{body:{...common,...input},initiatorProof:proof},context);
      p.view.expiresAt = result.data.expiresAt;
      const row: AuthRow = {id,context: await digestSessionSecret(JSON.stringify(config)),browser_digest:permit.browserDigest,central_id:result.data.verificationId,state:'READY',version:0,expires_at:Date.parse(result.data.expiresAt),lease_until:null,box:null};
      row.box = await seal(p,row);
      await store.create(row);
      return {...result.data,verificationId:id};
    } catch (error) {
      await owner.cancelLogin(request,permit).catch(() => { /* A newer login owns this browser. */ });
      throw error;
    }
  }
  async function loginCode(request: Request, input: LoginCodeRequest) {
    requireAccount(validateNamed('LoginCodeRequest',input));
    return operation(request,input.verificationId,async (p,row,call) => {
      requireAccount(p.purpose === 'LOGIN' && ['PHONE_OTP','EMAIL_CODE'].includes(p.method) && !p.challenge,403,'FORBIDDEN');
      const result = await call('loginCode',{body:{verificationId:row.central_id,code:input.code},initiatorProof:p.proof});
      return acceptLogin(request,p,result.data);
    });
  }
  async function commit(
    request: Request,
    action: 'bind' | 'replace' | 'unlink' | 'password',
    input:
      | ProductBindRequest
      | ProductUnlinkRequest
      | ProductPasswordChangeRequest,
    bindingId?: string,
  ) {
    const schema =
      action === 'password'
        ? 'ProductPasswordChangeRequest'
        : action === 'unlink'
          ? 'ProductUnlinkRequest'
          : 'ProductBindRequest';
    requireAccount(validateNamed(schema, input));
    const key = request.headers.get('idempotency-key');
    requireAccount(key && key.length >= 16 && key.length <= 128);
    const fingerprint = await digestSessionSecret(
      JSON.stringify({ action, bindingId, input }),
    );
    return operation(
      request,
      input.reauthHandle,
      async (p, reauthRow, call) => {
        if (p.receipt) {
          requireAccount(
            p.receipt.key === key && p.receipt.digest === fingerprint,
            409,
            'VERSION_CONFLICT',
          );
          return p.receipt.result;
        }
        requireAccount(
          p.identity && p.operationProof && p.purpose === 'REAUTH',
          409,
          'TRANSACTION_EXPIRED',
        );
        const operationId = {
          bind: 'BIND_METHOD',
          replace: 'REPLACE_METHOD',
          unlink: 'UNLINK_METHOD',
          password: 'CHANGE_PASSWORD',
        }[action];
        requireAccount(
          p.operation === operationId &&
            (!bindingId ||
              (p.target &&
                'bindingId' in p.target &&
                p.target.bindingId === bindingId)),
          403,
          'FORBIDDEN',
        );
        const write = async (identityProof?: string, invoke = call) => {
          const result = await invoke(
            action === 'password'
              ? 'changePassword'
              : action === 'unlink'
                ? 'unlinkMethod'
                : action === 'bind'
                  ? 'bindMethod'
                  : 'replaceMethod',
            {
              path: bindingId ? { bindingId } : {},
              idempotencyKey: key,
              body: {
                operationProof: p.operationProof!,
                expectedVersion: input.expectedVersion,
                ...(identityProof ? { newIdentityProof: identityProof } : {}),
                ...('newPassword' in input
                  ? { newPassword: input.newPassword }
                  : {}),
              } as CallInput<
                | 'bindMethod'
                | 'replaceMethod'
                | 'unlinkMethod'
                | 'changePassword'
              >['body'],
            },
            {
              assertCurrent: async () => {
                await store.assert(reauthRow);
                await authorize(request, p);
              },
            },
          );
          delete p.operationProof;
          p.receipt = { key, digest: fingerprint, result: result.data };
          return result.data;
        };
        if ('identityHandle' in input)
          return operation(
            request,
            input.identityHandle,
            async (identity, _identityRow, identityCall) => {
              requireAccount(
                identity.identityProof &&
                  identity.reauthHandle === input.reauthHandle &&
                  identity.purpose ===
                    (action === 'bind' ? 'BIND' : 'REPLACE') &&
                  identity.bindingId === bindingId,
                403,
                'FORBIDDEN',
              );
              const result = await write(identity.identityProof, identityCall);
              delete identity.identityProof;
              return result;
            },
          );
        return write();
      },
    );
  }
  return {
    async reauthenticate(
      request: Request,
      input: ProductReauthenticationRequest,
    ) {
      requireAccount(validateNamed('ProductReauthenticationRequest', input));
      return createSensitive(request, input);
    },
    commit,
    loginStart,
    loginCode,
    async create(request: Request, input: ProductTransactionRequest) {
      requireAccount(validateNamed('ProductTransactionRequest', input));
      if (input.purpose === 'BIND' || input.purpose === 'REPLACE')
        return createSensitive(request, input);
      const permit = await owner.beginLogin(request),
        proof = randomSessionSecret(),
        verifier = randomSessionSecret(),
        state = randomSessionSecret();
      try {
        const result = await client.call(
          'createTransaction',
          {
            body: {
              clientId: config.client.clientId,
              redirectUri: config.redirectUri,
              state,
              codeChallenge: await digestSessionSecret(verifier),
              codeChallengeMethod: 'S256',
              initiatorChallenge: await digestSessionSecret(proof),
              purpose: input.purpose,
              method: input.method,
            } as CallInput<'createTransaction'>['body'],
          },
          {
            signal: request.signal,
            assertCurrent: () => owner.assertLogin(request, permit),
          },
        );
        const { transactionId, ...view } = result.data,
          id = crypto.randomUUID();
        const p: Pending = {
          permit,
          proof,
          verifier,
          state,
          purpose: input.purpose,
          method: input.method,
          view: productView({ ...view, handle: id }),
        };
        const row: AuthRow = {
          id,
          context,
          browser_digest: permit.browserDigest,
          central_id: transactionId,
          state: 'READY',
          version: 0,
          expires_at: Date.parse(view.expiresAt),
          lease_until: null,
          box: null,
        };
        row.box = await seal(p, row);
        await store.create(row);
        return p.view;
      } catch (error) {
        await owner.cancelLogin(request, permit).catch(() => {
          /* Newer login/exit may already own this browser. */
        });
        throw error;
      }
    },
    async get(request: Request, handle: string) {
      const row = await store.get(handle);
      if (row?.state === 'CONSUMED' && row.box && row.expires_at > Date.now()) {
        const receipt = await cryptography.open(row.box, row.id, row.browser_digest) as {
          view: ProductTransactionView;
          loginSessionId?: string;
          permit?: LoginPermit;
        };
        const view = productView(receipt.view);
        requireAccount(view.handle === handle && ['CONSUMED', 'CANCELLED'].includes(view.status), 403, 'FORBIDDEN');
        if (receipt.loginSessionId) {
          const { identity } = await owner.authenticationBinding(request, undefined, true);
          requireAccount(identity.loginId === receipt.loginSessionId, 403, 'FORBIDDEN');
        } else {
          requireAccount(receipt.permit, 403, 'FORBIDDEN');
          await owner.assertLogin(request, receipt.permit, true);
        }
        return view;
      }
      return (await load(request, row, true)).pending.view;
    },
    async submit(
      request: Request,
      handle: string,
      input: ProductSubmitRequest,
    ) {
      requireAccount(validateNamed('ProductSubmitRequest', input));
      return operation(request, handle, (p, row, call) =>
        step(request, p, row, call, input),
      );
    },
    async resend(request: Request, handle: string) {
      return operation(request, handle, async (p, row, call) => {
        await send(p, row, call);
        return p.view;
      });
    },
    async cancel(request: Request, handle: string) {
      const { row, pending } = await load(request, await store.get(handle));
      const binding = await authorize(request, pending);
      if (pending.permit) await owner.cancelLogin(request, pending.permit);
      await store.cancel(row);
      await client
        .call(
          'cancelTransaction',
          {
            path: { transactionId: row.central_id },
            initiatorProof: pending.proof,
            body: {},
          },
          { session: binding },
        )
        .catch(() => {
          /* Installation is already fenced locally; upstream expires independently. */
        });
      return { ...pending.view, status: 'CANCELLED', nextStep: 'NONE' };
    },
    async reset(request: Request, input: ProductPasswordResetRequest) {
      requireAccount(validateNamed('ProductPasswordResetRequest', input));
      return operation(request, input.resetHandle, async (p, row, call) => {
        requireAccount(
          p.permit && p.reset && p.purpose === 'PASSWORD_RESET',
          409,
          'TRANSACTION_EXPIRED',
        );
        const resetProof = p.reset;
        delete p.reset;
        const result = await call('resetPassword', {
          body: {
            transactionId: row.central_id,
            resetProof,
            newPassword: input.newPassword,
          },
          initiatorProof: p.proof,
        });
        await owner.cancelLogin(request, p.permit);
        return result.data;
      });
    },
    async callback(request: Request) {
      const url = new URL(request.url),
        params = url.searchParams;
      requireAccount(
        [...params.keys()].sort().join(',') === 'result,state,transactionId',
      );
      requireAccount(
        ['VERIFIED', 'CANCELLED', 'FAILED'].includes(
          params.get('result') ?? '',
        ),
      );
      const { row, pending } = await load(
        request,
        await store.find(params.get('transactionId') ?? ''),
        true,
      );
      requireAccount(
        pending.state === params.get('state') &&
          ['GOOGLE', 'GITHUB'].includes(pending.method) &&
          pending.view.nextStep === 'WAIT_PROVIDER',
        403,
        'FORBIDDEN',
      );
      return operation(
        request,
        row.id,
        async (p, r, call) => {
          await sync(p, r, call);
          if (params.get('result') !== 'VERIFIED') {
            requireAccount(p.view.status === 'CANCELLED', 403, 'FORBIDDEN');
            p.view = { ...p.view, status: 'CANCELLED', nextStep: 'NONE' };
            return {
              status: params.get('result'),
              ...(p.identity ? { verificationHandle: p.view.handle } : {}),
            };
          }
          requireAccount(
            p.view.status === 'VERIFIED',
            409,
            'TRANSACTION_EXPIRED',
          );
          const result = await complete(request, p, r, call);
          return p.identity ? { verificationHandle: p.view.handle } : result;
        },
        true,
      );
    },
  };
}
