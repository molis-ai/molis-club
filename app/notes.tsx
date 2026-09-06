'use client';
import { useCallback, useEffect, useRef, useState } from 'react';
import { ArrowRight, RotateCcw } from 'lucide-react';
type Note = { id: string; name: string; body: string; createdAt: string };
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
  const [name, setName] = useState(''),
    [body, setBody] = useState('');
  const pending = useRef<{ id: string; name: string; body: string } | null>(
    null,
  );
  const load = useCallback(async () => {
    setLoading(true);
    setLoadError(false);
    try {
      const r = await fetch(`/api/notes?work=${work}`);
      if (!r.ok) throw new Error();
      const d = (await r.json()) as { notes: Note[] };
      setNotes(d.notes);
    } catch {
      setLoadError(true);
    } finally {
      setLoading(false);
    }
  }, [work]);
  useEffect(() => {
    void load();
  }, [load]);
  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (saving) return;
    setSaving(true);
    setMessage('');
    setFailed(false);
    if (
      !pending.current ||
      pending.current.name !== name ||
      pending.current.body !== body
    )
      pending.current = { id: crypto.randomUUID(), name, body };
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
      <form onSubmit={submit}>
        <label className="field">
          <span>怎么称呼你</span>
          <input
            required
            maxLength={40}
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoComplete="nickname"
            placeholder="一个让作者记住的名字"
          />
        </label>
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
          留言会展示在作品下。试用版署名未经身份验证，请不要留下私人信息。
        </p>
        <button className="button primary" disabled={saving}>
          {saving ? '正在保存…' : '留下这句反馈'}
          <ArrowRight size={17} />
        </button>
        <p role="status" className={`feedback ${failed ? 'error' : 'success'}`}>
          {message}
        </p>
      </form>
      <div className="note-list" aria-live="polite">
        {loading ? (
          <p className="empty-notes">正在看看大家说了什么…</p>
        ) : loadError ? (
          <div className="feedback error">
            留言暂时没能加载。
            <button className="button light" onClick={load}>
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
                <small>访客署名 · {n.createdAt.slice(0, 10)}</small>
              </div>
              <p>{n.body}</p>
            </article>
          ))
        )}
      </div>
    </section>
  );
}
