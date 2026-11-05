import { saveNote } from '../community-api.mjs';
import type { CentralAccountClient } from './client.ts';
import type { AccountSessionPort } from './bff.ts';
import { accountFailure, requireAccount } from './errors.ts';

/** Historic notes keep local user IDs. Only reviewed mappings connect central subjects. */
export function createBusinessNotesHandler(
  db: D1Database,
  client: CentralAccountClient,
  sessions: AccountSessionPort,
  slugs: string[],
) {
  return async (request: Request): Promise<Response> => {
    try {
      const origin = client.config.client.productOrigin;
      requireAccount(
        request.method === 'POST' &&
          new URL(request.url).origin === origin &&
          request.headers.get('origin') === origin &&
          !['cross-site', 'same-site'].includes(
            request.headers.get('sec-fetch-site') ?? '',
          ),
        403,
        'FORBIDDEN',
      );
      requireAccount(
        !request.headers.has('authorization') &&
          !request.headers.has('x-auth-initiator-proof'),
      );
      const binding = await sessions.read(request);
      requireAccount(binding, 401, 'SESSION_EXPIRED');
      requireAccount(
        await sessions.verifyCsrf(request, binding),
        403,
        'FORBIDDEN',
      );
      const current = () => sessions.assertCurrent(binding);
      const me = await client.readAccount(binding, request.signal, current);
      const mapped = await db
        .prepare(
          'SELECT local_user_id FROM central_business_identities WHERE issuer=? AND auth_user_id=?',
        )
        .bind(me.user.issuer, me.user.userId)
        .first<{ local_user_id: string }>();
      if (!mapped)
        return Response.json(
          {
            error: '账号与历史资料的关联尚待确认，请联系平台处理。',
            code: 'BUSINESS_IDENTITY_PENDING',
          },
          { status: 409, headers: { 'Cache-Control': 'no-store' } },
        );
      return await saveNote(
        request,
        db,
        slugs,
        { id: mapped.local_user_id, name: me.user.displayName },
        async () => {
          requireAccount(!request.signal.aborted, 400, 'INVALID_REQUEST');
          await client.readAccount(binding, request.signal, current);
          await current();
        },
      );
    } catch (error) {
      const failure = accountFailure(error);
      return Response.json(failure.envelope, {
        status: failure.status,
        headers: { 'Cache-Control': 'no-store' },
      });
    }
  };
}
