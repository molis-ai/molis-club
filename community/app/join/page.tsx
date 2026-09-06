'use client';
import { useState } from 'react';
import Link from 'next/link';
import { ArrowUpRight, ArrowLeft, Check } from 'lucide-react';
import { Header, Footer } from '../shell';
export default function Join() {
  const [busy, setBusy] = useState(false),
    [done, setDone] = useState(false),
    [error, setError] = useState('');
  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (busy) return;
    const data = new FormData(e.currentTarget);
    setBusy(true);
    setError('');
    try {
      const r = await fetch('/api/join', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: data.get('name'),
          email: data.get('email'),
          role: data.get('role'),
          idea: data.get('idea'),
          consent: data.get('consent') === 'on',
        }),
      });
      const result = (await r.json()) as { error?: string };
      if (!r.ok) throw new Error(result.error);
      setDone(true);
    } catch (e) {
      setError(e instanceof Error ? e.message : '这次没能提交，请稍后重试。');
    } finally {
      setBusy(false);
    }
  }
  return (
    <>
      <Header />
      <main className="join-page" id="main">
        <div className="join-intro">
          <Link href="/" className="back-link">
            <ArrowLeft size={16} /> 先回去逛逛
          </Link>
          <h1>
            有个想法？
            <br />
            聊聊看。
          </h1>
          <p>
            你不必已经有一个成熟的作品。
            <br />
            说说你想做什么，或者想陪什么东西长大。
          </p>
          <img
            src="/images/molis-makers-studio.png"
            alt="灰蓝与杏橙点缀的围桌创作插画"
            width="1536"
            height="1024"
          />
        </div>
        <div className="join-form">
          {done ? (
            <div className="join-success" role="status">
              <Check size={38} />
              <h2>想法已收下。</h2>
              <p>
                申请已保存到团队的私密收件箱。我们会从这里开始认识你；目前不会自动发送邮件。如果这个邮箱已申请，我们保留的是先前那一份。
              </p>
              <Link href="/#works" className="button primary">
                再认识几个作品 <ArrowUpRight size={17} />
              </Link>
            </div>
          ) : (
            <form onSubmit={submit}>
              <h2>先打个招呼</h2>
              <div className="form-grid">
                <label className="field">
                  <span>怎么称呼你</span>
                  <input
                    name="name"
                    required
                    maxLength={40}
                    autoComplete="name"
                    placeholder="你的名字"
                  />
                </label>
                <label className="field">
                  <span>你想怎样参与</span>
                  <select name="role">
                    <option>创造者</option>
                    <option>早期体验者</option>
                    <option>开发者</option>
                  </select>
                </label>
              </div>
              <label className="field">
                <span>联系邮箱</span>
                <input
                  name="email"
                  type="email"
                  required
                  maxLength={254}
                  autoComplete="email"
                  placeholder="you@example.com"
                />
              </label>
              <label className="field">
                <span>你想做什么，或者想看见什么</span>
                <textarea
                  name="idea"
                  required
                  minLength={5}
                  maxLength={1200}
                  placeholder="一个没想完的念头、一件正在做的小东西，都可以。"
                />
              </label>
              <label
                className="form-caption"
                style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}
              >
                <input
                  type="checkbox"
                  name="consent"
                  required
                  style={{ marginTop: 5 }}
                />
                <span>
                  同意将资料交给 Adeptify
                  团队，用于了解申请和联系我。邮箱与申请内容不会公开展示。
                </span>
              </label>
              <button className="button primary" disabled={busy}>
                {busy ? '正在递给我们…' : '把想法递过来'}
                <ArrowUpRight size={17} />
              </button>
              <p role="alert" className="feedback error">
                {error}
              </p>
              <p className="form-caption">
                这是私有试用阶段的参与申请，不会自动开通账号。需要修改或删除资料时，请在邀请你的原渠道联系团队。
              </p>
            </form>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
