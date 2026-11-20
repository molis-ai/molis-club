const loginMethods = new Set(['ACCOUNT_PASSWORD', 'PHONE_OTP', 'EMAIL_CODE', 'GOOGLE', 'GITHUB']);
const flowLifetimeMs = 30 * 60 * 1000;
const flowIdPattern = /^[a-f0-9]{8}-[a-f0-9]{4}-4[a-f0-9]{3}-[89ab][a-f0-9]{3}-[a-f0-9]{12}$/u;
const environmentTag = 'molis-club';

function record(event, fields) {
  console.log({ service: environmentTag, event, ...fields });
}

export async function recordContact(db, request, startedAt, outcome) {
  const durationMs = Math.max(0, Date.now() - startedAt);
  const referrer = URL.parse(request.headers.get('referer') ?? '');
  const origin = new URL(request.url).origin;
  const path = referrer?.origin === origin ? referrer.pathname : '';
  const entry = path === '/enterprise' ? 'enterprise' : path === '/contact' ? 'contact' : 'unknown';
  record('club.contact.request', { outcome, entry, duration_ms: durationMs });
  try {
    await db.prepare(
      'INSERT INTO club_contact_requests (occurred_at, entry, outcome, duration_ms) VALUES (?, ?, ?, ?)',
    ).bind(startedAt, entry, outcome, durationMs).run();
  } catch {
    record('club.metrics.write_failed', { metric: 'contact' });
  }
}

export async function openLoginFlow(db, request, method) {
  const id = request.headers.get('x-molis-login-flow');
  if (!id || !flowIdPattern.test(id) || !loginMethods.has(method)) return undefined;
  const now = Date.now();
  try {
    const result = await db.prepare(
      'INSERT INTO club_login_flows (id, method, started_at, expires_at) VALUES (?, ?, ?, ?) ON CONFLICT(id) DO NOTHING',
    ).bind(id, method, now, now + flowLifetimeMs).run();
    if (result.meta.changes) record('club.login.started', { method });
    return { id, method };
  } catch {
    record('club.metrics.write_failed', { metric: 'login_start' });
    return undefined;
  }
}

export function loginFailureReason(code) {
  if (['INVALID_CREDENTIALS', 'INVALID_REQUEST', 'CHALLENGE_EXPIRED', 'RATE_LIMITED'].includes(code))
    return 'credential_or_challenge';
  if (['AUTH_UNAVAILABLE', 'UPSTREAM_UNAVAILABLE', 'POLICY_MISMATCH'].includes(code))
    return 'auth_unavailable';
  return null;
}

export async function updateLoginFlow(db, flow, result) {
  if (!flow) return;
  const now = Date.now();
  const ended = result === 'completed' || result === 'cancelled';
  try {
    const update = await db.prepare(
      `UPDATE club_login_flows
       SET outcome = ?, ended_at = ?, last_issue = ?
       WHERE id = ? AND method = ? AND ended_at IS NULL AND expires_at > ?`,
    ).bind(ended ? result : null, ended ? now : null, ended ? null : result, flow.id, flow.method, now).run();
    if (result && update.meta.changes)
      record(ended ? 'club.login.ended' : 'club.login.issue', { method: flow.method, outcome: result });
  } catch {
    record('club.metrics.write_failed', { metric: 'login_update' });
  }
}
