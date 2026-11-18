import { env } from 'cloudflare:workers';

export async function GET(): Promise<Response> {
  if (!env.MOLIS_LOCAL_GENERATION) return new Response(null, { status: 404 });
  try {
    await env.DB.batch([
      env.DB.prepare('SELECT token_box, pending_nonce, context FROM central_account_sessions LIMIT 0'),
      env.DB.prepare('SELECT box, browser_digest, context FROM central_account_transactions LIMIT 0'),
      env.DB.prepare('SELECT * FROM central_business_identities LIMIT 0'),
      env.DB.prepare('SELECT * FROM applications LIMIT 0'),
      env.DB.prepare('SELECT * FROM notes LIMIT 0'),
    ]);
    return new Response(null, { status: 204 });
  } catch {
    return new Response(null, { status: 503 });
  }
}
