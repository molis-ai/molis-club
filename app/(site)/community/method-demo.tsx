'use client';
/* oxlint-disable jsx-a11y/no-noninteractive-tabindex -- 可以滚动的示例要能用键盘滚动 */
import Link from 'next/link';
import { useEffect, useRef, useState, type ReactNode } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Play,
  Plus,
  RotateCcw,
} from 'lucide-react';
import {
  isResourceEntry,
  knowledgePrompt,
  resourceGroupLabels,
  type KnowledgeEntry,
  type ResourceEntry,
} from '../../../content/knowledge';
import { methodText } from '../../../content/site/community';
import { methodHref } from '../../_site/routes';
import { Phrases, type Vars } from '../../_site/ui';
import { CopyPrompt } from './copy';

// 方法（网页与动效）的现场演示：六种效果就画在一张浅纸上，可以重播、动手滚动或切换；
// 外部组件只给来源卡；详情页的实验台把示例、时长和 Prompt 放在一起。
// 演示的基础样式就是完成的样子：没有 JS、减少动态时直接看到结果。演示里的句子是示例文字（沿用旧方法页）。

/** 第一次进入视口才开始播放（错落入场） */
function useSeen<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [seen, setSeen] = useState(false);
  useEffect(() => {
    const node = ref.current;
    if (!node || seen) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) setSeen(true);
    });
    observer.observe(node);
    return () => observer.disconnect();
  }, [seen]);
  return [ref, seen] as const;
}

export function MethodDemo({
  entry,
  duration = 700,
  compact = false,
  lab = false,
}: {
  entry: KnowledgeEntry;
  duration?: number;
  /** 目录卡片里的小尺寸 */
  compact?: boolean;
  /** 在详情页的实验台上（下划线示例链到页内的用法） */
  lab?: boolean;
}) {
  const [replay, setReplay] = useState(0);
  const [single, setSingle] = useState(false);
  const [edge, setEdge] = useState({ start: true, end: false });
  const [stage, seen] = useSeen<HTMLDivElement>();
  const rail = useRef<HTMLElement>(null);
  if (isResourceEntry(entry)) return null;
  const playing = seen || replay > 0;
  const move = (direction: number) => {
    const node = rail.current;
    if (!node) return;
    node.scrollBy({
      left: direction * node.clientWidth * 0.8,
      behavior: matchMedia('(prefers-reduced-motion: reduce)').matches
        ? 'instant'
        : 'smooth',
    });
  };
  const replayButton = (
    <button
      type="button"
      onClick={() => setReplay((value) => value + 1)}
      aria-label={`${methodText.replay}「${entry.name}」`}
    >
      <Play size={11} aria-hidden="true" />
      {methodText.replay}
    </button>
  );
  let controls: ReactNode = null;
  if (entry.slug === 'stagger' || entry.slug === 'underline')
    controls = replayButton;
  if (entry.slug === 'asymmetric-grid')
    controls = (
      <button type="button" onClick={() => setSingle((value) => !value)}>
        <RotateCcw size={11} aria-hidden="true" />
        {single ? '切回分栏' : '试试单列'}
      </button>
    );
  if (entry.slug === 'scroll-snap')
    controls = (
      <span className="m-mth-demo-arrows">
        <button
          type="button"
          aria-label="上一张"
          disabled={edge.start}
          onClick={() => move(-1)}
        >
          <ArrowLeft size={13} aria-hidden="true" />
        </button>
        <button
          type="button"
          aria-label="下一张"
          disabled={edge.end}
          onClick={() => move(1)}
        >
          <ArrowRight size={13} aria-hidden="true" />
        </button>
      </span>
    );

  return (
    <div
      className={`m-mth-demo m-mth-demo-${entry.slug}`}
      data-compact={compact || undefined}
      style={{ '--mth-d': `${duration}ms` } as Vars}
    >
      <div className="m-mth-demo-stage" ref={stage}>
        {entry.slug === 'stagger' && (
          <div
            key={replay}
            className="m-mth-stagger"
            data-playing={playing || undefined}
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
            key={replay}
            className="m-mth-underline"
            data-playing={replay > 0 || undefined}
          >
            <Link href={lab ? '#usage' : methodHref(entry.slug)}>
              留一点好奇心
              <ArrowUpRight size={20} aria-hidden="true" />
            </Link>
            <p>悬停，或用 Tab 键聚焦</p>
          </div>
        )}
        {entry.slug === 'accordion' && (
          <div className="m-mth-accordion">
            <details>
              <summary>
                为什么需要留白？
                <Plus size={16} aria-hidden="true" />
              </summary>
              <p>让内容之间有呼吸的空间，也让重要的信息更容易被看见。</p>
            </details>
            <details>
              <summary>
                动效应该从哪里开始？
                <Plus size={16} aria-hidden="true" />
              </summary>
              <p>
                从需要解释的变化开始。让用户知道发生了什么，再决定怎样表现它。
              </p>
            </details>
          </div>
        )}
        {entry.slug === 'scroll-snap' && (
          <section
            className="m-mth-snap"
            ref={rail}
            tabIndex={0}
            aria-label="横向滚动示例"
            onScroll={(event) => {
              const node = event.currentTarget;
              setEdge({
                start: node.scrollLeft <= 2,
                end: node.scrollLeft + node.clientWidth >= node.scrollWidth - 2,
              });
            }}
          >
            {[
              ['Observe', '观察', '从一个细节开始。'],
              ['Explore', '试探', '给想法留一点空间。'],
              ['Make', '创造', '让它成为可以触碰的东西。'],
            ].map(([english, word, line]) => (
              <div key={word}>
                <span lang="en">{english}</span>
                <strong>{word}</strong>
                <p>{line}</p>
              </div>
            ))}
          </section>
        )}
        {entry.slug === 'sticky' && (
          <section
            className="m-mth-sticky"
            tabIndex={0}
            aria-label="粘性定位滚动示例"
          >
            {(
              [
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
              ] as const
            ).map(([title, lines]) => (
              <section key={title}>
                <strong>{title}</strong>
                <div>
                  {lines.map((line) => (
                    <p key={line}>{line}</p>
                  ))}
                </div>
              </section>
            ))}
          </section>
        )}
        {entry.slug === 'asymmetric-grid' && (
          <div className="m-mth-grid" data-single={single || undefined}>
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
      <div className="m-mth-demo-bar">
        <span className="m-caption" lang="en">
          {entry.english}
        </span>
        <span className="m-com-js">{controls}</span>
      </div>
    </div>
  );
}

/** 外部组件的来源卡：英文名、分组、接入方式和官方链接 */
export function SourceCard({ entry }: { entry: ResourceEntry }) {
  return (
    <div className="m-mth-source">
      <p className="m-tagline">
        <span lang="en">{entry.english}</span>
        <span>{resourceGroupLabels[entry.group].short}</span>
      </p>
      <p>{entry.recipe}</p>
      <a
        className="m-link"
        href={entry.source.url}
        target="_blank"
        rel="noreferrer"
      >
        {methodText.open}
        <ArrowUpRight size={13} aria-hidden="true" />
      </a>
    </div>
  );
}

/** 详情页的实验台：左边示例（动效可以调时长），右边一张写着 Prompt 的纸 */
export function MethodLab({ entry }: { entry: KnowledgeEntry }) {
  const [duration, setDuration] = useState(700);
  const resource = isResourceEntry(entry);
  const motion = entry.category === '动效百科';
  const copy = methodText.prompt[resource ? 'resource' : 'technique'];
  const help = methodText.help;
  return (
    <div className="m-mth-lab">
      <div className="m-mth-lab-demo">
        {resource ? (
          <SourceCard entry={entry} />
        ) : (
          <MethodDemo entry={entry} duration={duration} lab />
        )}
        {motion ? (
          <label className="m-mth-duration m-com-js">
            <span>{methodText.duration}</span>
            <input
              type="range"
              className="m-com-slider"
              min="300"
              max="1200"
              step="100"
              value={duration}
              onChange={(event) => setDuration(Number(event.target.value))}
            />
            <output className="num">{duration} ms</output>
          </label>
        ) : null}
        <p className="m-mth-help">
          {resource ? help.resource : motion ? help.motion : help.layout}
        </p>
      </div>
      <div className="m-mth-prompt">
        <h2 className="m-mth-prompt-title">
          <Phrases text={copy.title} />
        </h2>
        <p>{copy.text}</p>
        <CopyPrompt
          id="m-mth-prompt"
          label={copy.label}
          text={knowledgePrompt(entry, duration)}
          button={methodText.copy}
          topic="share-method"
        />
      </div>
    </div>
  );
}
