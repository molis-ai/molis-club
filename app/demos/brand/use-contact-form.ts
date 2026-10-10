'use client';
import { useEffect, useState } from 'react';
import { contact } from '../../../content/studio';

// 五个方向的联系页共用的表单逻辑：沿用 /api/join，存进团队的私密收件箱；
// 地址栏的 ?topic= 预填方向和内容。各方向只写自己的外观。

export function useContactForm() {
  const [role, setRole] = useState<string>(contact.roles[0]);
  const [idea, setIdea] = useState('');
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const topic = new URLSearchParams(window.location.search).get('topic');
    const preset = topic ? contact.topics[topic] : undefined;
    if (!preset) return;
    queueMicrotask(() => {
      setRole(preset.role);
      setIdea(preset.idea);
    });
  }, []);

  async function submit(event: React.SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy) return;
    const data = new FormData(event.currentTarget);
    setBusy(true);
    setError('');
    try {
      const response = await fetch('/api/join', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: data.get('name'),
          email: data.get('email'),
          role,
          idea,
          consent: data.get('consent') === 'on',
        }),
      });
      const result = (await response.json().catch(() => null)) as {
        error?: string;
        status?: string;
      } | null;
      if (!response.ok || result?.status !== 'received') {
        setError(result?.error || contact.errorFallback);
        return;
      }
      setDone(true);
    } catch {
      setError(contact.errorFallback);
    } finally {
      setBusy(false);
    }
  }

  return { role, setRole, idea, setIdea, busy, done, error, submit };
}
