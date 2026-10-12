'use client';
import { useRef, useState, useSyncExternalStore } from 'react';
import { contact } from '../../../content/studio';

// 五个方向的联系页共用的表单逻辑：沿用 /api/join，存进团队的私密收件箱；
// 地址栏的 ?topic= 预填方向和内容，并随提交记下从哪里来。各方向只写自己的外观。
// 每次打开表单是一次提交：第一次发送时生成提交 id，失败重试沿用它，服务端不会多存一行；
// 同一邮箱下次再来，是新的一次提交。

/** 不支持 randomUUID 的环境（非安全上下文）不带 id，由服务端生成 */
const newSubmissionId = () =>
  typeof crypto !== 'undefined' && 'randomUUID' in crypto
    ? crypto.randomUUID()
    : undefined;

// 地址栏的 topic 在这一页里不会变；直接读，站内跳转进来的第一帧就是预填好的样子
const noSubscription = () => () => {};
const readTopic = () =>
  new URLSearchParams(window.location.search).get('topic');
const serverTopic = () => null;

export function useContactForm() {
  const topic = useSyncExternalStore(noSubscription, readTopic, serverTopic);
  const preset = topic ? contact.topics[topic] : undefined;
  // 访客自己改过的以访客为准，没改过时用 topic 的预填
  const [pickedRole, setRole] = useState<string | null>(null);
  const [typedIdea, setIdea] = useState<string | null>(null);
  const role = pickedRole ?? preset?.role ?? contact.roles[0];
  const idea = typedIdea ?? preset?.idea ?? '';
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState('');
  const submission = useRef<string | undefined>(undefined);

  async function submit(event: React.SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy) return;
    const data = new FormData(event.currentTarget);
    submission.current ??= newSubmissionId();
    setBusy(true);
    setError('');
    try {
      const response = await fetch('/api/join', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: submission.current,
          name: data.get('name'),
          email: data.get('email'),
          role,
          idea,
          topic: topic ?? undefined,
          consent: data.get('consent') === 'on',
          allowDisplay: data.get('allowDisplay') === 'on',
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

  return { role, setRole, idea, setIdea, topic, busy, done, error, submit };
}
