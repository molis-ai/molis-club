'use client';
import { useEffect, useRef, useState } from 'react';
import Link from './edition-link';
import { authClient } from '../lib/auth-client';
import { ArrowRight, RotateCcw } from 'lucide-react';
type Note = {
  id: string;
  name: string;
  body: string;
  createdAt: string;
  registered: number;
};
async function fetchNotes(work: string): Promise<Note[]> {
  const response = await fetch(`/api/notes?work=${work}`);
  if (!response.ok) throw new Error('留言暂时没能加载。');
  const data = (await response.json()) as { notes: Note[] };
  return data.notes;
}
export default function Notes({
  work,
  question,
}: {
  work: string;
  question: string;
}) {
  const [notes, setNotes] = useState<Note[]>([]),
    [loading, setLoading] = useState(true),
    [loadError, setLoadError] = useState(false),
    [saving, setSaving] = useState(false),
    [message, setMessage] = useState(''),
    [failed, setFailed] = useState(false);
  const { data: session, isPending: sessionPending } = authClient.useSession();
  const [body, setBody] = useState('');
  const pending = useRef<{ id: string; body: string } | null>(null);
  useEffect(() => {
    let active = true;
    fetchNotes(work).then(
      (items) => {
        if (!active) return;
        setNotes(items);
        setLoading(false);
      },
      () => {
        if (!active) return;
        setLoadError(true);
        setLoading(false);
      },
    );
    return () => {
      active = false;
    };
  }, [work]);
  async function retry() {
    setLoading(true);
    setLoadError(false);
    try {
      setNotes(await fetchNotes(work));
    } catch {
      setLoadError(true);
    } finally {
      setLoading(false);
    }
  }
  async function submit(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    if (saving) return;
    setSaving(true);
    setMessage('');
    setFailed(false);
    if (!pending.current || pending.current.body !== body)
      pending.current = { id: crypto.randomUUID(), body };
    try {
      const r = await fetch('/api/notes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...pending.current, work }),
      });
      const d = (await r.json()) as { note: Note; error?: string };
      if (!r.ok) throw new Error(d.error);
      setNotes((old) => [d.note, ...old.filter((n) => n.id !== d.note.id)]);
      setBody('');
      pending.current = null;
      setMessage('已留下你的想法。谢谢你认真看见它。');
    } catch (e) {
      setFailed(true);
      setMessage(e instanceof Error ? e.message : '这次没能保存，请稍后重试。');
    } finally {
      setSaving(false);
    }
  }
  return (
    <section className="notes">
      <h2>一起把它往前推一点。</h2>
      <p>{question}</p>
      {sessionPending ? (
        <p>正在读取登录状态…</p>
      ) : !session ? (
        <Link href="/login" className="text-link">
          登录后留下想法 <ArrowRight size={17} />
        </Link>
      ) : (
        <form onSubmit={submit}>
          <p className="form-caption">以 {session.user.name} 的身份留言。</p>
          <label className="field">
            <span>你的具体想法</span>
            <textarea
              required
              minLength={5}
              maxLength={1200}
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder="说说你想用它做什么、哪里没看懂，或一个可以变好的地方。"
            />
          </label>
          <p className="form-caption">
            留言与显示名会展示在作品下，请不要留下私人信息。
          </p>
          <button className="button primary" disabled={saving}>
            {saving ? '正在保存…' : '留下这句反馈'}
            <ArrowRight size={17} />
          </button>
          <output className={`feedback ${failed ? 'error' : 'success'}`}>
            {message}
          </output>
        </form>
      )}
      <div className="note-list" aria-live="polite">
        {loading ? (
          <p className="empty-notes">正在看看大家说了什么…</p>
        ) : loadError ? (
          <div className="feedback error">
            留言暂时没能加载。
            <button className="button light" onClick={retry}>
              重试 <RotateCcw size={16} />
            </button>
          </div>
        ) : notes.length === 0 ? (
          <p className="empty-notes">这里还没有留言。第一句，可以从你开始。</p>
        ) : (
          notes.map((n) => (
            <article className="note" key={n.id}>
              <div>
                <strong>{n.name}</strong>
                <small>
                  {n.registered ? '注册用户' : '历史访客署名'} ·{' '}
                  {n.createdAt.slice(0, 10)}
                </small>
              </div>
              <p>{n.body}</p>
            </article>
          ))
        )}
      </div>
    </section>
  );
}
