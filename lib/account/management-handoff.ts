import type { CentralAccountClient } from './client.ts';
import type { ClubSessionManager } from './sessions.ts';
import { AccountFailure, requireAccount } from './errors.ts';
import { randomSessionSecret, digestSessionSecret } from './session-crypto.ts';

/** Browser proof stays HttpOnly; the session owner supplies and rechecks the current account. */
export function createManagementHandoffHandler(
  client: CentralAccountClient,
  owner: ClubSessionManager,
) {
  const config = client.config;
  const secure = new URL(config.client.productOrigin).protocol === 'https:';
  const cookieName = `${owner.cookieName}-management`;
  const cookie = (value: string, seconds: number) =>
    `${cookieName}=${value}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${seconds}${secure ? '; Secure' : ''}`;
  return async (request: Request): Promise<Response> => {
    try {
      const url = new URL(request.url);
      requireAccount(
        request.method === 'GET' &&
          url.origin === config.client.productOrigin &&
          !request.headers.has('authorization') &&
          !request.headers.has('x-auth-initiator-proof'),
        403,
        'FORBIDDEN',
      );
      const callback = url.pathname === '/account/callback';
      if (!callback)
        requireAccount(
          !url.search &&
            !['cross-site', 'same-site'].includes(
              request.headers.get('sec-fetch-site') ?? '',
            ) &&
            (!request.headers.has('origin') ||
              request.headers.get('origin') === url.origin),
          403,
          'FORBIDDEN',
        );
      const { binding } = await owner.authenticationBinding(
        request,
        undefined,
        true,
      );
      const context = {
        session: binding,
        assertCurrent: () => owner.sessions.assertCurrent(binding),
      };
      let destination: string;
      let proofCookie: string;
      if (!callback) {
        const proof = randomSessionSecret();
        const result = await client.call(
          'createManagementHandoff',
          {
            body: {
              redirectUri: config.redirectUri,
              initiatorChallenge: await digestSessionSecret(proof),
            },
          },
          context,
        );
        destination = result.data.redirectUrl;
        proofCookie = cookie(`${result.data.handoffId}.${proof}`, 60);
      } else {
        requireAccount(
          url.searchParams.size === 1 && url.searchParams.has('handoff'),
        );
        const values = (request.headers.get('cookie') ?? '')
          .split(';')
          .map((s) => s.trim())
          .filter((s) => s.startsWith(cookieName + '='));
        requireAccount(values.length === 1, 403, 'FORBIDDEN');
        const [id, proof, extra] = values[0]
          .slice(cookieName.length + 1)
          .split('.');
        requireAccount(
          id === url.searchParams.get('handoff') &&
            /^[A-Za-z0-9_-]{43}$/.test(proof ?? '') &&
            extra === undefined,
          403,
          'FORBIDDEN',
        );
        const result = await client.call(
          'approveManagementHandoff',
          { body: { handoffId: id, initiatorProof: proof } },
          context,
        );
        destination = result.data.redirectUrl;
        proofCookie = cookie('', 0);
      }
      await owner.sessions.assertCurrent(binding);
      const redirect = new URL(destination);
      requireAccount(
        redirect.origin === config.client.authOrigin &&
          redirect.pathname ===
            `/account/handoff/${callback ? 'finish' : 'start'}` &&
          !redirect.hash &&
          !redirect.username &&
          !redirect.password,
        502,
        'UPSTREAM_UNAVAILABLE',
      );
      const response = owner.decorate(
        request,
        new Response(null, {
          status: 303,
          headers: {
            Location: redirect.href,
            'Cache-Control': 'no-store',
            'Referrer-Policy': 'no-referrer',
          },
        }),
      );
      response.headers.append('Set-Cookie', proofCookie);
      return response;
    } catch (error) {
      if (
        error instanceof AccountFailure &&
        ['SESSION_EXPIRED', 'SESSION_REVOKED', 'LOGIN_REQUIRED'].includes(
          error.envelope.error.code,
        )
      )
        return new Response(null, {
          status: 303,
          headers: { Location: '/login', 'Cache-Control': 'no-store' },
        });
      return new Response(
        '<!doctype html><html lang="zh-CN"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Molis 账号</title><main><h1>暂时无法打开账号管理</h1><p>请返回原页面，重新点击管理 Molis 账号。</p><a href="/">返回 Molis AI</a></main></html>',
        {
          status: 400,
          headers: {
            'Content-Type': 'text/html; charset=utf-8',
            'Cache-Control': 'no-store',
            'Referrer-Policy': 'no-referrer',
            'Content-Security-Policy':
              "default-src 'none'; frame-ancestors 'none'; base-uri 'none'",
          },
        },
      );
    }
  };
}
