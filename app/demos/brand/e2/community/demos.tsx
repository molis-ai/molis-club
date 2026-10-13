'use client';
/* oxlint-disable jsx-a11y/no-noninteractive-tabindex -- 可滚动的示例需要能用键盘滚动 */
import Link from 'next/link';
import { useEffect, useRef, useState, type ReactNode } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Columns2,
  Play,
  Rows2,
} from 'lucide-react';
import {
  isResourceEntry,
  knowledgePrompt,
  resourceGroupLabels,
  type KnowledgeEntry,
  type ResourceEntry,
} from '../../../../../content/knowledge';
import { folioWiki } from '../../../../../content/folio';
import { methodHref } from '../routes';
import { Phrases, type Vars } from '../shell';
import { CopyPrompt } from './copy';
import './kit.css';

// 社区「方法」的演示：六种网页与动效示例放在同一种图版里（浅灰底、细框、等宽小字），可以重播或动手；
// 外部组件只给来源卡；详情页的实验台把示例、时长和 Prompt 放在一起。功能与 Folio 社区一致。

/** 第一次进入视口才开始播放，重播时换 key 重新挂载 */
function useSeen<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [seen, setSeen] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el || seen) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) setSeen(true);
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, [seen]);
  return [ref, seen] as const;
}

/** 开合图标：一横一竖，展开时竖线收起变成减号（不旋转） */
export function Toggle() {
  return <span className="ecm-toggle" aria-hidden="true" />;
}

export function MethodDemo({
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
  const [edge, setEdge] = useState({ start: true, end: false });
  const [stage, seen] = useSeen<HTMLDivElement>();
  const rail = useRef<HTMLElement>(null);
  if (isResourceEntry(entry)) return null;
  const playing = seen || replay > 0;
  const move = (direction: number) => {
    const el = rail.current;
    if (!el) return;
    el.scrollBy({
      left: direction * el.clientWidth * 0.8,
      behavior: matchMedia('(prefers-reduced-motion: reduce)').matches
        ? 'instant'
        : 'smooth',
    });
  };
  const replayButton = (
    <button
      type="button"
      onClick={() => setReplay((value) => value + 1)}
      aria-label={`重播${entry.name}`}
    >
      <Play size={12} aria-hidden="true" /> 重播
    </button>
  );
  let controls: ReactNode = null;
  if (entry.slug === 'stagger' || entry.slug === 'underline')
    controls = replayButton;
  if (entry.slug === 'asymmetric-grid')
    controls = (
      <button type="button" onClick={() => setSingle((value) => !value)}>
        {single ? (
          <Columns2 size={12} aria-hidden="true" />
        ) : (
          <Rows2 size={12} aria-hidden="true" />
        )}
        {single ? '切回分栏' : '试试单列'}
      </button>
    );
  if (entry.slug === 'scroll-snap')
    controls = (
      <span className="ecm-demo-arrows">
        <button
          type="button"
          aria-label="上一个示例"
          disabled={edge.start}
          onClick={() => move(-1)}
        >
          <ArrowLeft size={14} aria-hidden="true" />
        </button>
        <button
          type="button"
          aria-label="下一个示例"
          disabled={edge.end}
          onClick={() => move(1)}
        >
          <ArrowRight size={14} aria-hidden="true" />
        </button>
      </span>
    );

  return (
    <div
      className={`ecm-demo ecm-demo-${entry.slug}`}
      data-compact={compact}
      style={{ '--ecm-d': `${duration}ms` } as Vars}
    >
      <div className="ecm-demo-bar">
        <span lang="en">{entry.english}</span>
        {controls}
      </div>
      <div className="ecm-demo-stage" ref={stage}>
        {entry.slug === 'stagger' && (
          <div
            key={replay}
            className="ecm-stagger"
            data-playing={playing}
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
          <div key={replay} className="ecm-underline" data-playing={replay > 0}>
            <Link href={compact ? methodHref(entry.slug) : '#usage'}>
              留一点好奇心
              <ArrowUpRight size={20} aria-hidden="true" />
            </Link>
            <p>悬停，或用 Tab 键聚焦</p>
          </div>
        )}
        {entry.slug === 'accordion' && (
          <div className="ecm-accordion">
            <details>
              <summary>
                为什么需要留白？
                <Toggle />
              </summary>
              <p>让内容之间有呼吸的空间，也让重要的信息更容易被看见。</p>
            </details>
            <details>
              <summary>
                动效应该从哪里开始？
                <Toggle />
              </summary>
              <p>
                从需要解释的变化开始。让用户知道发生了什么，再决定怎样表现它。
              </p>
            </details>
          </div>
        )}
        {entry.slug === 'scroll-snap' && (
          <section
            className="ecm-snap"
            ref={rail}
            tabIndex={0}
            aria-label="横向滚动示例"
            onScroll={(event) => {
              const el = event.currentTarget;
              setEdge({
                start: el.scrollLeft <= 2,
                end: el.scrollLeft + el.clientWidth >= el.scrollWidth - 2,
              });
            }}
          >
            {[
              ['Observe', '观察', '从一个细节开始。'],
              ['Explore', '试探', '给想法留一点空间。'],
              ['Make', '创造', '让它成为可以触碰的东西。'],
            ].map(([english, word, line], index) => (
              <div key={word}>
                <span lang="en">
                  {String(index + 1).padStart(2, '0')} {english}
                </span>
                <strong>{word}</strong>
                <p>{line}</p>
              </div>
            ))}
          </section>
        )}
        {entry.slug === 'sticky' && (
          <section
            className="ecm-sticky"
            tabIndex={0}
            aria-label="粘性定位滚动示例"
          >
            {[
              [
                '观察',
                [
                  '慢慢往下滚动。',
                  '标题暂时停在上方，正文继续向前。',
                  '走到这一段的末尾，标题也会一起离开。',
                ],
              ],
              [
                '创造',
                [
                  '下一段到来。',
                  '新的标题接住阅读的位置。',
                  '页面仍然由你控制。',
                ],
              ],
            ].map(([title, lines]) => (
              <section key={title as string}>
                <strong>{title}</strong>
                <div>
                  {(lines as string[]).map((line) => (
                    <p key={line}>{line}</p>
                  ))}
                </div>
              </section>
            ))}
          </section>
        )}
        {entry.slug === 'asymmetric-grid' && (
          <div className="ecm-grid" data-single={single}>
            <div>
              <em lang="en">The main story.</em>
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
    </div>
  );
}

/** 外部组件的来源卡：英文名、分组、接入方式和官方链接 */
export function ResourceCard({ entry }: { entry: ResourceEntry }) {
  return (
    <div className="ecm-resource" data-group={entry.group}>
      <div className="ecm-resource-head">
        <span lang="en">{entry.english}</span>
        <small>{resourceGroupLabels[entry.group].short}</small>
      </div>
      <p>{entry.recipe}</p>
      <a href={entry.source.url} target="_blank" rel="noreferrer">
        {folioWiki.entry.open}
        <ArrowUpRight size={15} aria-hidden="true" />
      </a>
    </div>
  );
}

/** 条目页的实验台：左边图版上是示例（动效可调时长），右边一张写着 Prompt 的白纸 */
export function MethodLab({ entry }: { entry: KnowledgeEntry }) {
  const [duration, setDuration] = useState(700);
  const resource = isResourceEntry(entry);
  const motion = entry.category === '动效百科';
  const copy = folioWiki.entry.prompt[resource ? 'resource' : 'technique'];
  const help = folioWiki.entry.help;
  return (
    <div className="ecm-lab">
      <div className="ecm-lab-demo">
        {resource ? (
          <ResourceCard entry={entry} />
        ) : (
          <MethodDemo entry={entry} duration={duration} />
        )}
        {motion ? (
          <label className="ecm-duration">
            <span>{folioWiki.entry.duration}</span>
            <input
              type="range"
              min="300"
              max="1200"
              step="100"
              value={duration}
              style={{ '--v': `${(duration - 300) / 9}%` } as Vars}
              onChange={(event) => setDuration(Number(event.target.value))}
            />
            <output>{duration} ms</output>
          </label>
        ) : null}
        <p className="ecm-help">
          {resource ? help.resource : motion ? help.motion : help.layout}
        </p>
      </div>
      <div className="ecm-sheet">
        <h2>
          <Phrases text={copy.title} />
        </h2>
        <p>{copy.text}</p>
        <CopyPrompt
          id="ecm-prompt"
          label={copy.label}
          text={knowledgePrompt(entry, duration)}
          button={folioWiki.copy.button}
        />
      </div>
    </div>
  );
}
