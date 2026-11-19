import { createManagementHandoffHandler } from './management-handoff.ts';
import { createBusinessNotesHandler } from './business-notes.ts';
import { env } from 'cloudflare:workers';
import { readClubAccountConfig } from './config.ts';
import { createCentralAccountClient } from './client.ts';
import { createAuthenticationHandler } from './auth-http.ts';
import { createAccountBff } from './bff.ts';
import { createClubSessionManager } from './sessions.ts';
import { AccountFailure, accountFailure } from './errors.ts';

/** The D1 owner persists sessions across requests, Worker instances, and restarts. */
async function handleRequest(
  request: Request,
  businessSlugs?: string[],
): Promise<Response> {
  try {
    const config = readClubAccountConfig(env.MOLIS_CLUB_ACCOUNT_CONFIG, env.MOLIS_LOCAL_GENERATION);
    if (!config || !env.DB)
      throw new AccountFailure(503, 'UNIFIED_CONFIGURATION_INVALID');
    if (new URL(request.url).origin !== config.client.productOrigin)
      throw new AccountFailure(403, 'FORBIDDEN');
    const client = createCentralAccountClient(config);
    const owner = await createClubSessionManager({
      db: env.DB,
      client,
      encryptionKey: env.MOLIS_CLUB_ACCOUNT_KEY,
    });
    if (businessSlugs)
      return owner.decorate(
        request,
        await createBusinessNotesHandler(
          env.DB,
          client,
          owner.sessions,
          businessSlugs,
        )(request),
      );
    const path = new URL(request.url).pathname;
    if (
      path === '/api/account/management' ||
      (path === '/account/callback' &&
        new URL(request.url).searchParams.has('handoff'))
    )
      return createManagementHandoffHandler(client, owner)(request);
    if (
      path.startsWith('/api/account/auth/') ||
      path === '/api/account/password/reset' ||
      path === '/api/account/password/change' ||
      path === '/api/account/reauthentications' ||
      /^\/api\/account\/login-methods\/[^/]+(?:\/(replace|unlink))?$/.test(
        path,
      ) ||
      path === '/account/callback'
    )
      return createAuthenticationHandler(
        env.DB,
        client,
        owner,
        env.MOLIS_CLUB_ACCOUNT_KEY,
      )(request, path === '/account/callback');
    return owner.decorate(
      request,
      await createAccountBff(client, owner.sessions)(request),
    );
  } catch (error) {
    const failure = accountFailure(error);
    return Response.json(failure.envelope, {
      status: failure.status,
      headers: { 'Cache-Control': 'no-store' },
    });
  }
}

export function handleAccountRequest(request: Request): Promise<Response> {
  return handleRequest(request);
}

export function handleAccountNoteRequest(
  request: Request,
  slugs: string[],
): Promise<Response> {
  return handleRequest(request, slugs);
}
