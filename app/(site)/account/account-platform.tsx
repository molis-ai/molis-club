'use client';
import { useEffect, useRef, useState } from 'react';
import { accountErrorText } from '../../_site/central-account-client';
import type { TenantClient, TenantMutation } from './account-tenants';
import { PlatformTenants } from './platform-tenants';
import { PlatformSubscriptions } from './platform-subscriptions';
import { PlatformAudit } from './platform-audit';
export type PlatformProps = {
  client: TenantClient;
  capabilities: readonly string[];
  busy: boolean;
  mutate: TenantMutation;
};
export function AccountPlatform({
  client,
  back,
}: {
  client: TenantClient;
  back: () => void;
}) {
  const [capabilities, setCapabilities] = useState<string[]>([]),
    [view, setView] = useState('tenants'),
    [revision, setRevision] = useState(0),
    [loading, setLoading] = useState(true),
    [busy, setBusy] = useState(false),
    [error, setError] = useState(''),
    [message, setMessage] = useState('');
  const lock = useRef(false),
    alive = useRef(true);
  useEffect(() => {
    alive.current = true;
    return () => {
      alive.current = false;
    };
  }, []);
  useEffect(() => {
    let active = true;
    client
      .session()
      .then((v) => {
        if (active)
          setCapabilities(v.state === 'AUTHENTICATED' ? v.capabilities : []);
      })
      .catch((e) => {
        if (active) {
          setCapabilities([]);
          setError(accountErrorText(e));
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [client, revision]);
  const mutate: TenantMutation = async (operation, text) => {
    if (lock.current) return;
    lock.current = true;
    setBusy(true);
    setError('');
    setMessage('');
    try {
      await operation();
      if (alive.current) setMessage(text);
    } catch (e) {
      if (alive.current) setError(accountErrorText(e));
    } finally {
      lock.current = false;
      if (alive.current) {
        setBusy(false);
        setLoading(true);
        setRevision((v) => v + 1);
      }
    }
  };
  const props = { client, capabilities, busy, mutate };
  return (
    <section className="m-account-section" aria-label="平台管理">
      <h3>平台管理</h3>
      <div className="m-account-actions">
        <button className="m-link" disabled={busy} onClick={back}>
          返回账号
        </button>
        {[
          ['tenants', '租户管理', 'TENANT_'],
          ['subscriptions', '订阅管理', 'SUBSCRIPTION_'],
          ['audit', '订阅与席位操作记录', 'AUDIT_READ'],
        ]
          .filter(([, , prefix]) =>
            capabilities.some((c) => c.startsWith(prefix)),
          )
          .map(([id, label]) => (
            <button
              key={id}
              className="m-link"
              disabled={busy || loading}
              aria-pressed={view === id}
              onClick={() => {
                setView(id);
                setError('');
                setMessage('');
              }}
            >
              {label}
            </button>
          ))}
        <button
          className="m-link"
          disabled={busy || loading}
          onClick={() => {
            setLoading(true);
            setRevision((v) => v + 1);
          }}
        >
          刷新平台状态
        </button>
      </div>
      <p role="alert" className="m-auth-error">
        {error}
      </p>
      <output className="m-auth-ok">{message}</output>
      {loading ? (
        <p>正在读取平台状态…</p>
      ) : view === 'tenants' ? (
        <PlatformTenants key={revision} {...props} />
      ) : view === 'subscriptions' ? (
        <PlatformSubscriptions key={revision} {...props} />
      ) : (
        <PlatformAudit key={revision} {...props} />
      )}
    </section>
  );
}
