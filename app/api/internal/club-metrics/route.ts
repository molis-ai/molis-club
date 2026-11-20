import { env } from 'cloudflare:workers';
import { timingSafeEqual } from 'node:crypto';
import { metricsWindow, readClubMetrics } from '../../../../lib/club-metrics-report.mjs';

const headers = { 'Cache-Control': 'private, no-store', 'X-Content-Type-Options': 'nosniff' };

export async function GET(request: Request) {
  const secret = env.MOLIS_CLUB_METRICS_TOKEN;
  const token = request.headers.get('Authorization')?.match(/^Bearer ([a-zA-Z0-9_-]{43})$/)?.[1];
  if (!secret || !token || secret.length !== token.length ||
      !timingSafeEqual(Buffer.from(secret), Buffer.from(token))) {
    return new Response(null, { status: 404, headers });
  }
  const window = metricsWindow(new URL(request.url).searchParams);
  if (!window) return Response.json({ error: 'invalid_window' }, { status: 400, headers });
  if (!env.DB) return Response.json({ error: 'unavailable' }, { status: 503, headers });
  try {
    return Response.json({ rows: await readClubMetrics(env.DB, window) }, { headers });
  } catch {
    return Response.json({ error: 'unavailable' }, { status: 503, headers });
  }
}
