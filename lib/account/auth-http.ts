import { boundedJson, type CentralAccountClient } from './client.ts';
import type { ClubSessionManager } from './sessions.ts';
import { createClubAuthentication } from './authentication.ts';
import { AccountFailure, accountFailure, requireAccount } from './errors.ts';
import { validateNamed } from './contracts/validate.ts';
import type {
  ProductTransactionRequest,
  ProductSubmitRequest,
  ProductPasswordResetRequest,
  ProductReauthenticationRequest,
  ProductBindRequest,
  ProductUnlinkRequest,
  ProductPasswordChangeRequest,
} from './contracts/types.ts';

/** Only explicitly mounted credential routes, never a general upstream proxy. */
export function createAuthenticationHandler(
  db: D1Database,
  client: CentralAccountClient,
  owner: ClubSessionManager,
  key: string | undefined,
) {
  return async (request: Request, redirect = false): Promise<Response> => {
    const url = new URL(request.url),
      callback = ['/account/callback', '/api/account/auth/callback'].includes(
        url.pathname,
      );
    try {
      requireAccount(
        url.origin === client.config.client.productOrigin,
        403,
        'FORBIDDEN',
      );
      requireAccount(
        !request.headers.has('authorization') &&
          !request.headers.has('x-auth-initiator-proof'),
      );
      if (!callback) {
        requireAccount(!url.search);
        requireAccount(
          (!request.headers.has('origin') ||
            request.headers.get('origin') === url.origin) &&
            !['same-site', 'cross-site'].includes(
              request.headers.get('sec-fetch-site') ?? '',
            ),
          403,
          'FORBIDDEN',
        );
      }
      const auth = await createClubAuthentication(db, client, owner, key);
      const match =
        /^\/api\/account\/auth\/transactions\/([A-Za-z0-9_-]+)(?:\/(submit|resend|cancel))?$/.exec(
          url.pathname,
        );
      let result: unknown;
      if (callback) {
        requireAccount(request.method === 'GET');
        result = await auth.callback(request);
      } else if (request.method === 'POST') {
        const body = await boundedJson(request);
        if (url.pathname === '/api/account/auth/transactions')
          result = await auth.create(
            request,
            body as ProductTransactionRequest,
          );
        else if (url.pathname === '/api/account/reauthentications')
          result = await auth.reauthenticate(
            request,
            body as ProductReauthenticationRequest,
          );
        else if (url.pathname === '/api/account/password/change')
          result = await auth.commit(
            request,
            'password',
            body as ProductPasswordChangeRequest,
          );
        else if (url.pathname === '/api/account/login-methods/bind')
          result = await auth.commit(
            request,
            'bind',
            body as ProductBindRequest,
          );
        else if (
          /^\/api\/account\/login-methods\/[^/]+\/(replace|unlink)$/.test(
            url.pathname,
          )
        ) {
          const parts = url.pathname.split('/');
          let bindingId: string;
          try {
            bindingId = decodeURIComponent(parts[4]);
          } catch {
            throw new AccountFailure(400, 'INVALID_REQUEST');
          }
          result = await auth.commit(
            request,
            parts[5] as 'replace' | 'unlink',
            body as ProductBindRequest | ProductUnlinkRequest,
            bindingId,
          );
        } else if (url.pathname === '/api/account/password/reset')
          result = await auth.reset(
            request,
            body as ProductPasswordResetRequest,
          );
        else if (match?.[2] === 'submit')
          result = await auth.submit(
            request,
            match[1],
            body as ProductSubmitRequest,
          );
        else {
          requireAccount(validateNamed('Empty', body));
          if (match?.[2] === 'resend')
            result = await auth.resend(request, match[1]);
          else if (match?.[2] === 'cancel')
            result = await auth.cancel(request, match[1]);
          else throw new AccountFailure(404, 'NOT_FOUND');
        }
      } else if (request.method === 'GET' && match && !match[2])
        result = await auth.get(request, match[1]);
      else throw new AccountFailure(404, 'NOT_FOUND');
      const response =
        redirect &&
        callback &&
        result &&
        typeof result === 'object' &&
        'verificationHandle' in result
          ? new Response(
              '<!doctype html><html lang="zh-CN"><meta charset="utf-8"><meta name="viewport" content="width=device-width"><title>Molis AI</title><h1>验证流程已结束</h1><p>请回到账号页面查看结果，可关闭此窗口。</p></html>',
              {
                headers: {
                  'Content-Type': 'text/html; charset=utf-8',
                  'Content-Security-Policy':
                    "default-src 'none'; frame-ancestors 'none'; base-uri 'none'",
                },
              },
            )
          : redirect && callback
            ? new Response(null, {
                status: 303,
                headers: {
                  Location:
                    '/login?auth=' +
                    ((result as { status?: string }).status?.toLowerCase() ??
                      'complete'),
                },
              })
            : Response.json({ data: result, requestId: crypto.randomUUID() });
      response.headers.set('Referrer-Policy', 'no-referrer');
      response.headers.set('X-Content-Type-Options', 'nosniff');
      return owner.decorate(request, response);
    } catch (error) {
      const failure = accountFailure(error);
      return owner.decorate(
        request,
        redirect && callback
          ? new Response(null, {
              status: 303,
              headers: {
                Location: '/login?auth=failed',
                'Referrer-Policy': 'no-referrer',
              },
            })
          : Response.json(failure.envelope, { status: failure.status }),
      );
    }
  };
}
