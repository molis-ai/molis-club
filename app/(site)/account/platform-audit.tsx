'use client';
import { useEffect, useRef, useState } from 'react';
import { accountErrorText } from '../../_site/central-account-client';
import type { AuditEvent } from '../../../lib/account/contracts/types';
import type { PlatformProps } from './account-platform';
export function PlatformAudit({ client, capabilities }: PlatformProps) {
  const [rows, setRows] = useState<AuditEvent[]>([]),
    [cursor, setCursor] = useState<string | null>(null),
    [busy, setBusy] = useState(true),
    [error, setError] = useState('');
  const alive = useRef(true),
    lock = useRef(false);
  useEffect(() => {
    alive.current = true;
    let active = true;
    if (capabilities.includes('AUDIT_READ'))
      client
        .platformAudit()
        .then((v) => {
          if (active) {
            setRows(v.items);
            setCursor(v.nextCursor);
          }
        })
        .catch((e) => {
          if (active) setError(accountErrorText(e));
        })
        .finally(() => {
          if (active) setBusy(false);
        });

    return () => {
      active = false;
      alive.current = false;
    };
  }, [client, capabilities]);
  async function next() {
    if (lock.current || !cursor) return;
    lock.current = true;
    setBusy(true);
    setError('');
    try {
      const v = await client.platformAudit(cursor);
      if (alive.current) {
        setRows((r) => [...r, ...v.items]);
        setCursor(v.nextCursor);
      }
    } catch (e) {
      if (alive.current) setError(accountErrorText(e));
    } finally {
      lock.current = false;
      if (alive.current) setBusy(false);
    }
  }
  if (!capabilities.includes('AUDIT_READ'))
    return <p>没有操作记录查看权限。</p>;
  return (
    <>
      <h4>订阅与席位操作记录</h4>
      <p role="alert" className="m-auth-error">
        {error}
      </p>
      <ul className="m-account-methods">
        {rows.map((a) => (
          <li key={a.auditEventId}>
            <div>
              <strong>{a.operation}</strong>
              <p>{a.target.id}</p>
              <small>
                {a.actorUserId} · {new Date(a.occurredAt).toLocaleString()} ·{' '}
                {a.result === 'SUCCEEDED' ? '成功' : '已拒绝'}
              </small>

              {a.changes.map((c, i) => (
                <p key={i}>
                  {c.field}: {c.before ?? '—'} → {c.after ?? '—'}
                </p>
              ))}
            </div>
          </li>
        ))}
      </ul>
      {busy ? (
        <p>正在读取操作记录…</p>
      ) : !rows.length && !error ? (
        <p>暂无操作记录。</p>
      ) : null}
      {cursor ? (
        <button className="m-link" disabled={busy} onClick={() => void next()}>
          加载更多
        </button>
      ) : null}
    </>
  );
}
