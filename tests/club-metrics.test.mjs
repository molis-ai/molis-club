import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { DatabaseSync } from 'node:sqlite';
import { test } from 'node:test';
import { readClubMetrics } from '../lib/club-metrics-report.mjs';

function dbFixture() {
  const sql = new DatabaseSync(':memory:');
  sql.exec('CREATE TABLE applications (id TEXT PRIMARY KEY, topic TEXT, created_at TEXT)');
  sql.exec(readFileSync(new URL('../drizzle/0007_club_business_metrics.sql', import.meta.url), 'utf8'));
  return {
    sql,
    prepare(statement) {
      return { bind(...values) {
        const positions = [];
        const positional = statement.replace(/\?(\d+)/gu, (_, number) => {
          positions.push(values[Number(number) - 1]);
          return '?';
        });
        return { all: () => ({ results: sql.prepare(positional).all(...(positions.length ? positions : values)) }) };
      } };
    },
    batch: statements => Promise.all(statements.map(stmt => stmt.all())),
  };
}

void test('Club dashboard counts committed leads, request retries, and login cohorts independently', async () => {
  const { sql, ...db } = dbFixture();
  const from = Date.parse('2026-11-19T00:00:00+08:00');
  const to = Date.parse('2026-11-20T00:00:00+08:00');
  const insertLead = sql.prepare('INSERT INTO applications VALUES (?, ?, ?)');
  insertLead.run('one', 'enterprise', new Date(from).toISOString());
  insertLead.run('outside', 'work', new Date(to).toISOString());
  const insertContact = sql.prepare('INSERT INTO club_contact_requests (occurred_at, entry, outcome, duration_ms) VALUES (?, ?, ?, ?)');
  for (const [outcome, ms] of [['created', 100], ['duplicate', 80], ['write_failed', 235], ['invalid', 25]])
    insertContact.run(from + ms, 'contact', outcome, ms);
  const insertLogin = sql.prepare('INSERT INTO club_login_flows VALUES (?, ?, ?, ?, ?, ?, ?)');
  insertLogin.run('cross-midnight', 'EMAIL_CODE', to - 10_000, to + 1_800_000, to + 10_000, 'completed', null);
  insertLogin.run('still-open', 'EMAIL_CODE', to - 1, to + 1_800_000, null, null, null);
  insertLogin.run('expired', 'PHONE_OTP', from + 1, from + 1_800_000, null, null, null);
  insertLogin.run('cancelled', 'GOOGLE', from + 2, from + 1_800_000, from + 5000, 'cancelled', null);

  const now = to + 30_000;
  const [summary] = await readClubMetrics(db, { from, to, view: 'summary' }, now);
  assert.deepEqual(summary, {
    leads: 1, contact_requests: 4, contact_accepted: 2, contact_duplicates: 1,
    contact_rate: .5, contact_p95_ms: 235, login_started: 4, login_completed: 1,
    login_in_progress: 1, login_ended: 3, login_rate: 1 / 3,
  });
  const trend = await readClubMetrics(db, { from, to, view: 'login_trend' }, now);
  assert.equal(trend.reduce((sum, row) => sum + row.completed, 0), 1);
  assert.equal(trend.at(-1).completed, 1);
  const outcomes = await readClubMetrics(db, { from, to, view: 'login_outcomes' }, now);
  assert.deepEqual(outcomes.map(row => row.result).sort(), ['主动取消', '到期未完成'].sort());
  const [empty] = await readClubMetrics(db, { from: to + 1, to: to + 2, view: 'summary' }, now);
  assert.equal(empty.login_rate, null);
  assert.equal(empty.contact_rate, null);
  assert.equal(empty.contact_p95_ms, null);
});
