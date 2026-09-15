'use client';
/* oxlint-disable jsx-a11y/no-noninteractive-tabindex -- Scrollable specimens must accept keyboard scrolling. */
import { useRef, useState, type CSSProperties } from 'react';
import Link from './edition-link';
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Copy,
  Play,
  Search,
  RotateCcw,
  Plus,
} from 'lucide-react';
import {
  knowledge,
  knowledgePrompt,
  type KnowledgeEntry,
} from '../content/knowledge';

export function KnowledgeDemo({
  entry,
  duration = 700,
  compact = false,
}: {
  entry: KnowledgeEntry;
  duration?: number;
  compact?: boolean;
}) {
  const [replay, setReplay] = useState(0);
  const [single, setSingle] = useState(false);
  const [scrollEdge, setScrollEdge] = useState({ start: true, end: false });
  const rail = useRef<HTMLDivElement>(null);
  const motion = entry.category === '动效百科';
  function moveRail(direction: number) {
    const el = rail.current;
    if (el)
      el.scrollBy({
        left: direction * el.clientWidth * 0.78,
        behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches
          ? 'instant'
          : 'smooth',
      });
  }
  return (
    <div
      className={`knowledge-demo demo-${entry.slug}${compact ? ' demo-compact' : ''}`}
      style={{ '--demo-duration': `${duration}ms` } as CSSProperties}
    >
      <div className="demo-topline">
        <span>{entry.english}</span>
        {motion && entry.slug !== 'accordion' && (
          <button
            type="button"
            onClick={() => setReplay(replay + 1)}
            aria-label={`重播${entry.name}`}
          >
            <Play size={13} /> 重播
          </button>
        )}
        {entry.slug === 'accordion' && <span>点击问题试试</span>}
        {entry.slug === 'sticky' && <span>在下方滚动</span>}
        {entry.slug === 'asymmetric-grid' && (
          <button type="button" onClick={() => setSingle(!single)}>
            <RotateCcw size={13} /> {single ? '切回分栏' : '试试单列'}
          </button>
        )}
        {entry.slug === 'scroll-snap' && (
          <div className="demo-arrows">
            <button
              type="button"
              aria-label="上一个示例"
              disabled={scrollEdge.start}
              onClick={() => moveRail(-1)}
            >
              <ArrowLeft size={15} />
            </button>
            <button
              type="button"
              aria-label="下一个示例"
              disabled={scrollEdge.end}
              onClick={() => moveRail(1)}
            >
              <ArrowRight size={15} />
            </button>
          </div>
        )}
      </div>
      {entry.slug === 'stagger' && (
        <div
          key={replay}
          className={`demo-stagger-content${replay ? ' is-playing' : ''}`}
          aria-label="慢一点，看见更多。"
        >
          <span>慢一点，</span>
          <span>
            看见<em>更多。</em>
          </span>
          <p>让重要的事，依次出现。</p>
        </div>
      )}
      {entry.slug === 'underline' && (
        <div
          className={`demo-underline-content${replay ? ' is-playing' : ''}`}
          key={replay}
        >
          <Link href={compact ? `/wiki/${entry.slug}` : '#usage'}>
            留一点好奇心
            <ArrowUpRight size={22} />
          </Link>
          <p>悬停，或用 Tab 键聚焦</p>
        </div>
      )}
      {entry.slug === 'accordion' && (
        <div className="demo-accordion-content">
          <details>
            <summary>
              为什么需要留白？
              <Plus size={17} />
            </summary>
            <p>让内容之间有呼吸的空间，也让重要的信息更容易被看见。</p>
          </details>
          <details>
            <summary>
              动效应该从哪里开始？
              <Plus size={17} />
            </summary>
            <p>
              从需要解释的变化开始。让用户知道发生了什么，再决定怎样表现它。
            </p>
          </details>
        </div>
      )}
      {entry.slug === 'scroll-snap' && (
        <section
          className="demo-snap-content"
          ref={rail}
          tabIndex={0}
          aria-label="横向滚动示例"
          onScroll={(event) => {
            const el = event.currentTarget;
            setScrollEdge({
              start: el.scrollLeft <= 2,
              end: el.scrollLeft + el.clientWidth >= el.scrollWidth - 2,
            });
          }}
        >
          {['观察', '试探', '创造'].map((word, i) => (
            <div key={word}>
              <span>{['Observe', 'Explore', 'Make'][i]}</span>
              <strong>{word}</strong>
              <p>
                {
                  [
                    '从一个细节开始。',
                    '给想法留一点空间。',
                    '让它成为可以触碰的东西。',
                  ][i]
                }
              </p>
            </div>
          ))}
        </section>
      )}
      {entry.slug === 'sticky' && (
        <section
          className="demo-sticky-content"
          tabIndex={0}
          aria-label="粘性定位滚动示例"
        >
          <div className="demo-sticky-chapter">
            <strong>观察</strong>
            <div>
              <p>慢慢往下滚动。</p>
              <p>标题暂时停在上方，正文继续向前。</p>
              <p>走到这一段的末尾，标题也会一起离开。</p>
            </div>
          </div>
          <div className="demo-sticky-chapter">
            <strong>创造</strong>
            <div>
              <p>下一段到来。</p>
              <p>新的标题接住阅读的位置。</p>
              <p>页面仍然由你控制。</p>
            </div>
          </div>
        </section>
      )}
      {entry.slug === 'asymmetric-grid' && (
        <div className={`demo-grid-content${single ? ' is-single' : ''}`}>
          <div>
            <em>The main story.</em>
            <strong>把空间留给主角。</strong>
            <p>这是一段主要内容。</p>
          </div>
          <aside>
            <span>旁注</span>
            <p>补充信息，放在恰好的位置。</p>
          </aside>
        </div>
      )}
    </div>
  );
}
export function KnowledgeDirectory() {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('全部');
  const matches = knowledge.filter(
    (entry) =>
      (category === '全部' || entry.category === category) &&
      `${entry.name} ${entry.english} ${entry.description} ${entry.searchTerms}`
        .toLowerCase()
        .includes(query.trim().toLowerCase()),
  );
  return (
    <section id="entries" className="knowledge-directory">
      <div className="knowledge-tools">
        <div className="edition-filters" aria-label="百科分类">
          {['全部', '动效百科', '网页词典'].map((item) => (
            <button
              type="button"
              aria-pressed={category === item}
              key={item}
              onClick={() => setCategory(item)}
            >
              {item}
            </button>
          ))}
        </div>
        <label className="knowledge-search">
          <Search size={18} />
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="试试「逐段浮现」或「布局」"
            aria-label="搜索网页与动效条目"
          />
        </label>
      </div>
      <output className="knowledge-count" aria-live="polite">
        {matches.length} 个条目{query && ` · 搜索「${query}」`}
      </output>
      <div className="knowledge-grid">
        {matches.map((entry) => (
          <article className="knowledge-entry" key={entry.slug}>
            <KnowledgeDemo entry={entry} compact />
            <Link href={`/wiki/${entry.slug}`}>
              <div>
                <h2>{entry.name}</h2>
                <span>{entry.category}</span>
              </div>
              <p>{entry.description}</p>
              <span className="edition-link">
                试一试，带走 Prompt <ArrowUpRight size={16} />
              </span>
            </Link>
          </article>
        ))}
      </div>
      {matches.length === 0 && (
        <div className="knowledge-empty">
          <h2>还没找到这个条目。</h2>
          <p>换个说法，或看看已有的动效与布局。</p>
          <button
            className="edition-button"
            type="button"
            onClick={() => {
              setQuery('');
              setCategory('全部');
            }}
          >
            查看全部条目
          </button>
        </div>
      )}
    </section>
  );
}
export function KnowledgeLab({ entry }: { entry: KnowledgeEntry }) {
  const [duration, setDuration] = useState(700);
  const [copyState, setCopyState] = useState<'idle' | 'copied' | 'failed'>(
    'idle',
  );
  const textarea = useRef<HTMLTextAreaElement>(null);
  const prompt = knowledgePrompt(entry, duration);
  async function copy() {
    try {
      await navigator.clipboard.writeText(prompt);
      setCopyState('copied');
    } catch {
      setCopyState('failed');
      textarea.current?.focus();
      textarea.current?.select();
    }
  }
  return (
    <section className="knowledge-lab" aria-label={`${entry.name}交互实验`}>
      <div>
        <KnowledgeDemo entry={entry} duration={duration} />
        {entry.category === '动效百科' && (
          <label className="demo-duration">
            动效时长{' '}
            <input
              type="range"
              min="300"
              max="1200"
              step="100"
              value={duration}
              onChange={(event) => {
                setDuration(Number(event.target.value));
                setCopyState('idle');
              }}
            />
            <output>{duration} ms</output>
          </label>
        )}
        <p className="demo-help">
          {entry.category === '动效百科'
            ? '调整后重播或展开示例。系统开启减少动态时，直接展示最终状态。'
            : '用上方控件或在示例内滚动，观察布局如何变化。'}
        </p>
      </div>
      <div className="prompt-sheet">
        <h2>把这个效果，带回你的项目。</h2>
        <p>复制后补充页面位置与实际内容，交给你本地的 AI 编程工具。</p>
        <label htmlFor="knowledge-prompt">实现 Prompt</label>
        <textarea
          ref={textarea}
          id="knowledge-prompt"
          readOnly
          value={prompt}
        />
        <div className="prompt-actions">
          <button type="button" className="edition-button" onClick={copy}>
            <Copy size={16} />
            {copyState === 'copied' ? '已复制 Prompt' : '复制 Prompt'}
          </button>
          <output aria-live="polite">
            {copyState === 'failed'
              ? '复制未成功，文本已选中。请按 ⌘C / Ctrl+C 复制。'
              : copyState === 'copied'
                ? '可以粘贴到本地工具了。'
                : '无需登录'}
          </output>
        </div>
      </div>
    </section>
  );
}
