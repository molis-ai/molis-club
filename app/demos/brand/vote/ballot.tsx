'use client';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { Check, ExternalLink, RotateCcw } from 'lucide-react';
import {
  directions,
  findDirection,
  routeOf,
  shotOf,
  shotSet,
  shotSize,
} from '../_review/directions';
const voterKey = 'molis-brand-vote';
type Vote = {
  choice: string;
  name: string;
  reason: string;
  borrow: string;
  updatedAt: string;
};
type Results = {
  total: number;
  tally: Record<string, number>;
  votes: Vote[];
  mine: Vote | null;
};
type Field = 'choice' | 'reason' | 'name';

async function fetchResults(voter: string | null): Promise<Results> {
  const r = await fetch(
    `/api/design-votes${voter ? `?voter=${encodeURIComponent(voter)}` : ''}`,
    { cache: 'no-store' },
  );
  if (!r.ok) throw new Error('load');
  return (await r.json()) as Results;
}

function readVoter() {
  try {
    return localStorage.getItem(voterKey);
  } catch {
    return null;
  }
}

function ago(iso: string) {
  const minutes = Math.round((Date.now() - new Date(iso).getTime()) / 60000);
  if (minutes < 1) return '刚刚';
  if (minutes < 60) return `${minutes} 分钟前`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours} 小时前`;
  const date = new Date(iso);
  return `${date.getMonth() + 1} 月 ${date.getDate()} 日`;
}

export function Ballot() {
  const [choice, setChoice] = useState('');
  const [reason, setReason] = useState('');
  const [borrow, setBorrow] = useState('');
  const [name, setName] = useState('');
  const [voted, setVoted] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [failed, setFailed] = useState(false);
  const [invalid, setInvalid] = useState<Field | null>(null);
  const [results, setResults] = useState<Results | null>(null);
  const [loadError, setLoadError] = useState(false);
  const [revealed, setRevealed] = useState(false);
  const [filter, setFilter] = useState('all');
  const resultsRef = useRef<HTMLElement>(null);
  const reasonRef = useRef<HTMLTextAreaElement>(null);
  const nameRef = useRef<HTMLInputElement>(null);
  const firstOptionRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    let active = true;
    const wanted = findDirection(
      new URLSearchParams(location.search).get('d'),
    )?.slug;
    fetchResults(readVoter()).then(
      (data) => {
        if (!active) return;
        setResults(data);
        if (data.mine) {
          setChoice(data.mine.choice);
          setReason(data.mine.reason);
          setBorrow(data.mine.borrow);
          setName(data.mine.name);
          setVoted(true);
          setRevealed(true);
        }
        if (wanted) setChoice(wanted);
      },
      () => {
        if (!active) return;
        setLoadError(true);
        if (wanted) setChoice(wanted);
      },
    );
    return () => {
      active = false;
    };
  }, []);

  async function reload() {
    setLoadError(false);
    try {
      setResults(await fetchResults(readVoter()));
    } catch {
      setLoadError(true);
    }
  }

  function reject(field: Field, text: string) {
    setInvalid(field);
    setFailed(true);
    setMessage(text);
    (field === 'choice'
      ? firstOptionRef
      : field === 'reason'
        ? reasonRef
        : nameRef
    ).current?.focus();
  }

  async function submit(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    if (saving) return;
    if (!choice) return reject('choice', '先选一个方向。');
    if (reason.trim().length < 5)
      return reject('reason', '理由再多写几个字吧，至少 5 个字。');
    if (!name.trim()) return reject('name', '留个称呼，方便大家接着聊。');
    setInvalid(null);
    setSaving(true);
    setMessage('');
    setFailed(false);
    const id = readVoter() ?? crypto.randomUUID();
    let response: Response;
    try {
      response = await fetch('/api/design-votes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, choice, reason, borrow, name }),
      });
    } catch {
      setSaving(false);
      setFailed(true);
      setMessage('网络好像断了。你写的内容还在，稍后再试。');
      return;
    }
    const data = (await response.json().catch(() => ({}))) as {
      updated?: boolean;
      error?: string;
    };
    setSaving(false);
    if (!response.ok) {
      setFailed(true);
      setMessage(data.error ?? '这一票没能保存，你写的内容还在。请稍后重试。');
      return;
    }
    try {
      localStorage.setItem(voterKey, id);
    } catch {}
    setVoted(true);
    setRevealed(true);
    setMessage(
      data.updated
        ? '已更新你的一票。'
        : '收到你的一票，谢谢！大家的选择在下面。',
    );
    await reload();
    resultsRef.current?.scrollIntoView({
      behavior: matchMedia('(prefers-reduced-motion: reduce)').matches
        ? 'auto'
        : 'smooth',
      block: 'start',
    });
  }

  const total = results?.total ?? 0;
  const lead = results ? Math.max(...Object.values(results.tally)) : 0;
  const shown =
    results?.votes.filter((v) => filter === 'all' || v.choice === filter) ?? [];

  return (
    <>
      <div className="rv-vote-intro">
        <h1>你更喜欢哪一个？</h1>
        <p>
          选一个你最希望 Molis AI
          成为的样子，再说说为什么。还没看完的话，可以先去
          <Link href="/demos/brand/compare">预览台</Link>
          把五个方向并排看一遍。
        </p>
      </div>

      <form className="rv-ballot" onSubmit={submit} noValidate>
        <fieldset
          className="rv-options"
          aria-invalid={invalid === 'choice' || undefined}
        >
          <legend>选一个方向</legend>
          <div className="rv-option-grid">
            {directions.map((d, i) => (
              <div
                className="rv-option"
                key={d.slug}
                data-checked={choice === d.slug}
              >
                <label>
                  <input
                    ref={i === 0 ? firstOptionRef : undefined}
                    type="radio"
                    name="choice"
                    value={d.slug}
                    checked={choice === d.slug}
                    onChange={() => {
                      setChoice(d.slug);
                      if (invalid === 'choice') setInvalid(null);
                    }}
                  />
                  <span className="rv-option-shot">
                    <img
                      src={shotOf(d.slug, 'home', 'small')}
                      srcSet={shotSet(d.slug, 'home', false)}
                      sizes="(max-width: 900px) 120px, 20vw"
                      width={shotSize.small.width}
                      height={shotSize.small.height}
                      alt=""
                    />
                    <span className="rv-option-check" aria-hidden>
                      <Check size={15} strokeWidth={2.5} />
                    </span>
                  </span>
                  <strong>
                    {d.name}
                    {d.en !== d.name && <span>{d.en}</span>}
                  </strong>
                  <small>{d.traits.join(' · ')}</small>
                </label>
                <div className="rv-option-links">
                  <a href={routeOf(d.slug, 'home')} target="_blank">
                    首页 <ExternalLink size={12} aria-hidden />
                  </a>
                  <a href={routeOf(d.slug, 'work')} target="_blank">
                    Molis Work <ExternalLink size={12} aria-hidden />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </fieldset>

        <div className="rv-form-body">
          <div className="rv-form-main">
            <div className="rv-field">
              <label htmlFor="rv-reason">为什么是它？</label>
              <textarea
                id="rv-reason"
                ref={reasonRef}
                rows={5}
                maxLength={1200}
                value={reason}
                aria-invalid={invalid === 'reason' || undefined}
                aria-describedby="rv-reason-count"
                onChange={(e) => {
                  setReason(e.target.value);
                  if (invalid === 'reason') setInvalid(null);
                }}
                placeholder="比如：首屏的光让人想继续往下看；产品页把 Molis Work 讲得最清楚……"
              />
              <span className="rv-count" id="rv-reason-count">
                {reason.trim().length} / 1200
              </span>
            </div>
            <div className="rv-field">
              <label htmlFor="rv-borrow">
                别的方向里，有什么值得留下？<span>可选</span>
              </label>
              <textarea
                id="rv-borrow"
                rows={3}
                maxLength={1200}
                value={borrow}
                onChange={(e) => setBorrow(e.target.value)}
                placeholder="比如：Folio 的拼贴插画、深空的行星切换、Edition C 的打字标题……"
              />
            </div>
          </div>
          <div className="rv-form-side">
            <div className="rv-field">
              <label htmlFor="rv-name">你的称呼</label>
              <input
                id="rv-name"
                ref={nameRef}
                maxLength={40}
                value={name}
                aria-invalid={invalid === 'name' || undefined}
                onChange={(e) => {
                  setName(e.target.value);
                  if (invalid === 'name') setInvalid(null);
                }}
                placeholder="大家怎么称呼你"
              />
            </div>
            <button className="rv-submit" type="submit" disabled={saving}>
              {saving ? '正在提交…' : voted ? '更新我的一票' : '投出这一票'}
            </button>
            <output className="rv-status" data-failed={failed || undefined}>
              {message}
            </output>
            <p className="rv-hint">
              称呼、选择和理由会显示在下方，供大家一起讨论。在这台设备上可以随时改票。
            </p>
          </div>
        </div>
      </form>

      <section
        className="rv-results"
        ref={resultsRef}
        aria-labelledby="rv-results-title"
      >
        <div className="rv-results-head">
          <h2 id="rv-results-title">大家的选择</h2>
          {revealed && results && <p>共 {total} 票</p>}
        </div>
        {!revealed ? (
          <div className="rv-veiled">
            <p>投完再看结果，免得先入为主。</p>
            <button
              type="button"
              className="rv-button-quiet"
              onClick={() => setRevealed(true)}
            >
              先看看结果
            </button>
          </div>
        ) : loadError ? (
          <div className="rv-veiled">
            <p>结果暂时没能加载。</p>
            <button type="button" className="rv-button-quiet" onClick={reload}>
              重新加载 <RotateCcw size={15} aria-hidden />
            </button>
          </div>
        ) : !results ? (
          <p className="rv-empty">正在读取大家的选择…</p>
        ) : (
          <>
            <ol className="rv-tally">
              {directions.map((d) => {
                const n = results.tally[d.slug] ?? 0;
                const pct = total ? Math.round((n / total) * 100) : 0;
                return (
                  <li
                    key={d.slug}
                    data-lead={(n > 0 && n === lead) || undefined}
                  >
                    <span className="rv-tally-name">{d.name}</span>
                    <span className="rv-tally-bar" aria-hidden>
                      <span style={{ transform: `scaleX(${pct / 100})` }} />
                    </span>
                    <span className="rv-tally-n">
                      {n} 票<span>{pct}%</span>
                    </span>
                  </li>
                );
              })}
            </ol>

            <fieldset className="rv-filter">
              <legend>按方向筛选理由</legend>
              <button
                type="button"
                aria-pressed={filter === 'all'}
                onClick={() => setFilter('all')}
              >
                全部 {total}
              </button>
              {directions.map((d) => (
                <button
                  key={d.slug}
                  type="button"
                  aria-pressed={filter === d.slug}
                  onClick={() => setFilter(d.slug)}
                >
                  {d.name} {results.tally[d.slug] ?? 0}
                </button>
              ))}
            </fieldset>

            {shown.length === 0 ? (
              <p className="rv-empty">
                {total === 0
                  ? '还没有人投票，第一票会出现在这里。'
                  : '这个方向还没有人投。'}
              </p>
            ) : (
              <ul className="rv-reasons">
                {shown.map((v, i) => (
                  <li key={`${v.updatedAt}-${i}`}>
                    <p className="rv-reason-meta">
                      <strong>{v.name}</strong>
                      <span>选了 {findDirection(v.choice)?.name}</span>
                      <time dateTime={v.updatedAt}>{ago(v.updatedAt)}</time>
                    </p>
                    <p className="rv-reason-body">{v.reason}</p>
                    {v.borrow && (
                      <p className="rv-reason-borrow">
                        <span>想留下</span>
                        {v.borrow}
                      </p>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </>
        )}
      </section>
    </>
  );
}
