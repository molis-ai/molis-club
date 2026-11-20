const dayMs = 86_400_000;
const intervals = [60_000, 300_000, 900_000, 3_600_000, 10_800_000, dayMs, 7 * dayMs];
const allowedViews = new Set(['summary', 'contact_trend', 'login_trend', 'topics', 'methods', 'contact_outcomes', 'login_outcomes']);
const knownTopics = ['work', 'tool', 'life', 'story', 'world'];

const rate = (successes, total) => total ? successes / total : null;
const cohort = `
  SELECT started_at, method,
    CASE
      WHEN outcome IS NOT NULL THEN outcome
      WHEN expires_at > ?1 THEN 'in_progress'
      ELSE COALESCE(last_issue, 'expired')
    END AS result
  FROM club_login_flows WHERE started_at >= ?2 AND started_at < ?3
`;

export function metricsWindow(search) {
  const view = search.get('view');
  const from = Number(search.get('from'));
  const to = Number(search.get('to'));
  if (!allowedViews.has(view) || !Number.isSafeInteger(from) || !Number.isSafeInteger(to) ||
      from <= 0 || to <= from || to - from > 366 * dayMs || to > Date.now() + dayMs) return null;
  return { view, from, to };
}

export async function readClubMetrics(db, { view, from, to }, now = Date.now()) {
  const fromIso = new Date(from).toISOString();
  const toIso = new Date(to).toISOString();
  const step = intervals.find(interval => (to - from) / interval <= 120) ?? 7 * dayMs;
  const offset = 8 * 3_600_000;
  const firstBucket = Math.floor((from + offset) / step) * step - offset;

  if (view === 'summary') {
    const [applications, contact, latency, login] = await db.batch([
      db.prepare('SELECT count(*) AS leads FROM applications WHERE created_at >= ? AND created_at < ?').bind(fromIso, toIso),
      db.prepare(`
        SELECT count(*) AS contact_requests, count(CASE WHEN outcome IN ('created','duplicate') THEN 1 END) AS contact_accepted,
               count(CASE WHEN outcome = 'duplicate' THEN 1 END) AS contact_duplicates
        FROM club_contact_requests WHERE occurred_at >= ? AND occurred_at < ?
      `).bind(from, to),
      db.prepare(`
        SELECT duration_ms AS contact_p95_ms FROM (
          SELECT duration_ms, row_number() OVER (ORDER BY duration_ms) AS ordinal, count(*) OVER () AS total
          FROM club_contact_requests WHERE occurred_at >= ? AND occurred_at < ?
        ) WHERE ordinal = (total * 95 + 99) / 100
      `).bind(from, to),
      db.prepare(`
        WITH flows AS (${cohort})
        SELECT count(*) AS login_started, count(CASE WHEN result = 'completed' THEN 1 END) AS login_completed,
               count(CASE WHEN result = 'in_progress' THEN 1 END) AS login_in_progress
        FROM flows
      `).bind(now, from, to),
    ]);
    const form = contact.results[0];
    const flows = login.results[0];
    const loginEnded = flows.login_started - flows.login_in_progress;
    return [{
      ...applications.results[0], ...form, ...flows, login_ended: loginEnded,
      contact_rate: rate(form.contact_accepted, form.contact_requests),
      contact_p95_ms: latency.results[0]?.contact_p95_ms ?? null,
      login_rate: rate(flows.login_completed, loginEnded),
    }];
  }

  if (view === 'topics') {
    const { results } = await db.prepare(`
      SELECT CASE WHEN topic = 'enterprise' THEN '企业合作'
                  WHEN topic IN (${knownTopics.map(() => '?').join(',')}) THEN '产品'
                  WHEN topic IN ('creator','share-flower','share-artist','share-method') THEN '社区'
                  WHEN topic = 'feedback' THEN '反馈'
                  ELSE '其他或未知' END AS topic,
             count(*) AS leads
      FROM applications WHERE created_at >= ? AND created_at < ?
      GROUP BY 1 ORDER BY 2 DESC, 1
    `).bind(...knownTopics, fromIso, toIso).all();
    return results;
  }

  if (view === 'contact_outcomes') {
    const { results } = await db.prepare(`
      SELECT outcome, count(*) AS requests
      FROM club_contact_requests WHERE occurred_at >= ? AND occurred_at < ?
      GROUP BY outcome ORDER BY requests DESC, outcome
    `).bind(from, to).all();
    const labels = { created: '新入库', duplicate: '重复提交', invalid: '服务端校验拒绝', write_failed: 'D1 写入失败' };
    return results.map(row => ({ ...row, outcome: labels[row.outcome] ?? row.outcome }));
  }

  if (view === 'methods' || view === 'login_outcomes') {
    const byMethod = view === 'methods';
    const { results } = await db.prepare(byMethod ? `
      WITH flows AS (${cohort})
      SELECT method, count(*) AS started, count(CASE WHEN result = 'completed' THEN 1 END) AS completed,
             count(CASE WHEN result = 'in_progress' THEN 1 END) AS in_progress
      FROM flows GROUP BY method ORDER BY started DESC, method
    ` : `
      WITH flows AS (${cohort})
      SELECT result, count(*) AS flows FROM flows WHERE result NOT IN ('completed','in_progress')
      GROUP BY result ORDER BY flows DESC, result
    `).bind(now, from, to).all();
    const methods = { ACCOUNT_PASSWORD: '账号密码', PHONE_OTP: '短信验证码', EMAIL_CODE: '邮箱验证码', GOOGLE: 'Google', GITHUB: 'GitHub' };
    const resultsByCause = { cancelled: '主动取消', expired: '到期未完成', credential_or_challenge: '到期 · 凭证或验证码问题', auth_unavailable: '到期 · Auth 请求异常', session_setup_failed: '到期 · Club 会话建立异常' };
    return results.map(row => {
      if (!byMethod) return { ...row, result: resultsByCause[row.result] ?? row.result };
      const ended = row.started - row.in_progress;
      return { ...row, method: methods[row.method] ?? row.method, ended, rate: rate(row.completed, ended) };
    });
  }

  const rows = new Map();
  if (view === 'contact_trend') {
    const [applications, contact] = await db.batch([
      db.prepare(`
        SELECT CAST((unixepoch(created_at) * 1000 + ?4) / ?1 AS INTEGER) * ?1 - ?4 AS time, count(*) AS leads
        FROM applications WHERE created_at >= ?2 AND created_at < ?3 GROUP BY 1
      `).bind(step, fromIso, toIso, offset),
      db.prepare(`
        SELECT CAST((occurred_at + ?4) / ?1 AS INTEGER) * ?1 - ?4 AS time, count(*) AS requests
        FROM club_contact_requests WHERE occurred_at >= ?2 AND occurred_at < ?3 GROUP BY 1
      `).bind(step, from, to, offset),
    ]);
    for (const row of applications.results) rows.set(row.time, row);
    for (const row of contact.results) rows.set(row.time, { ...rows.get(row.time), ...row });
  } else {
    const { results } = await db.prepare(`
      WITH flows AS (${cohort})
      SELECT CAST((started_at + ?5) / ?4 AS INTEGER) * ?4 - ?5 AS time, count(*) AS started,
             count(CASE WHEN result = 'completed' THEN 1 END) AS completed
      FROM flows GROUP BY 1
    `).bind(now, from, to, step, offset).all();
    for (const row of results) rows.set(row.time, row);
  }
  const defaults = view === 'contact_trend' ? { leads: 0, requests: 0 } : { started: 0, completed: 0 };
  const series = [];
  for (let time = firstBucket; time < to; time += step)
    series.push({ ...defaults, ...rows.get(time), time: Math.max(from, time) });
  return series;
}
