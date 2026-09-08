'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, ArrowUpRight, Pause, Play } from 'lucide-react';
import { productLines } from '../content/lines';
import { works } from '../content/works';

const artwork = {
  experience: {
    src: '/images/line-experience.jpg',
    alt: '手账、信与分岔小路，关于选择和相遇的主题插画',
  },
  tools: {
    src: '/images/line-tools.jpg',
    alt: '小牛、日历与便签组成的轻盈桌面主题插画',
  },
  engineering: {
    src: '/images/line-engineering.jpg',
    alt: '双手连接纸质模块，关于协作与创造的主题插画',
  },
};
const entries = productLines.flatMap((line) =>
  line.projects.map((slug) => ({
    line,
    work: works.find((work) => work.slug === slug)!,
  })),
);

export default function ProductShowcase() {
  const [active, setActive] = useState(0);
  const [playing, setPlaying] = useState(true);
  const [reduced, setReduced] = useState(true);
  const [visible, setVisible] = useState(false);
  const [pageVisible, setPageVisible] = useState(true);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const stage = useRef<HTMLElement>(null);
  const list = useRef<HTMLOListElement>(null);
  const running =
    playing && !reduced && visible && pageVisible && !hovered && !focused;
  const { line, work } = entries[active];

  useEffect(() => {
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
    const syncPreference = () => setReduced(preference.matches);
    const syncVisibility = () => setPageVisible(!document.hidden);
    syncPreference();
    syncVisibility();
    preference.addEventListener('change', syncPreference);
    document.addEventListener('visibilitychange', syncVisibility);
    const observer = new IntersectionObserver(
      ([entry]) => setVisible(entry.isIntersecting),
      { threshold: 0.15 },
    );
    if (stage.current) observer.observe(stage.current);
    return () => {
      preference.removeEventListener('change', syncPreference);
      document.removeEventListener('visibilitychange', syncVisibility);
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    if (!running) return;
    const timer = window.setTimeout(
      () => setActive((index) => (index + 1) % entries.length),
      6000,
    );
    return () => window.clearTimeout(timer);
  }, [active, running]);

  useEffect(() => {
    const container = list.current;
    const selected = container?.children[active] as HTMLElement | undefined;
    if (!container || !selected) return;
    container.scrollTo({
      top:
        selected.offsetTop -
        (container.clientHeight - selected.offsetHeight) / 2,
      behavior: reduced ? 'instant' : 'smooth',
    });
  }, [active, reduced]);

  function select(index: number) {
    setPlaying(false);
    setActive((index + entries.length) % entries.length);
  }

  return (
    // oxlint-disable-next-line jsx-a11y/no-noninteractive-element-interactions -- Pauses playback on hover/focus; all actions use native buttons.
    <section
      className="product-showcase"
      ref={stage}
      aria-label="作品展台"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocusCapture={() => setFocused(true)}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget))
          setFocused(false);
      }}
    >
      <div className="showcase-categories" aria-label="切换产品分类">
        {productLines.map((category) => (
          <button
            type="button"
            key={category.id}
            aria-pressed={category.id === line.id}
            onClick={() =>
              select(
                entries.findIndex((entry) => entry.line.id === category.id),
              )
            }
          >
            {category.name}
          </button>
        ))}
      </div>
      <div className="showcase-spread">
        <div className="showcase-visual">
          <div className="showcase-art">
            {productLines.map((category) => (
              <img
                key={category.id}
                src={artwork[category.id].src}
                alt={category.id === line.id ? artwork[category.id].alt : ''}
                aria-hidden={category.id !== line.id}
                className={category.id === line.id ? 'is-active' : ''}
                width="1536"
                height="1024"
                loading="lazy"
                decoding="async"
              />
            ))}
          </div>
          <div className="showcase-art-caption" key={line.id}>
            <em>{line.english}</em>
            <p>{line.description}</p>
            <span>主题插画 · {line.name}</span>
          </div>
        </div>
        <div className="showcase-index">
          <div
            className="showcase-current"
            aria-live={playing ? 'off' : 'polite'}
            aria-atomic="true"
          >
            <div key={work.slug} className="showcase-current-content">
              <span className="showcase-status">{work.status}</span>
              <h3>{work.name}</h3>
              <p>{work.title}</p>
              <Link className="text-link" href={`/works/${work.slug}`}>
                走近这件作品 <ArrowUpRight size={18} />
              </Link>
            </div>
          </div>
          <ol
            className="showcase-list"
            ref={list}
            aria-label="作品播放列表"
            onWheel={() => setPlaying(false)}
            onTouchStart={() => setPlaying(false)}
          >
            {entries.map((entry, index) => (
              <li key={entry.work.slug}>
                <button
                  type="button"
                  aria-pressed={index === active}
                  aria-label={`展示 ${entry.work.name}`}
                  onClick={() => select(index)}
                  onKeyDown={(event) => {
                    const next =
                      event.key === 'ArrowDown'
                        ? (index + 1) % entries.length
                        : event.key === 'ArrowUp'
                          ? (index - 1 + entries.length) % entries.length
                          : event.key === 'Home'
                            ? 0
                            : event.key === 'End'
                              ? entries.length - 1
                              : null;
                    if (next === null) return;
                    event.preventDefault();
                    select(next);
                    (
                      list.current?.children[next]
                        ?.firstElementChild as HTMLButtonElement
                    )?.focus({ preventScroll: true });
                  }}
                >
                  <span className="showcase-marker" aria-hidden="true">
                    <ArrowRight size={17} />
                  </span>
                  <span>
                    {entry.work.name}
                    <small>{entry.work.category}</small>
                  </span>
                  <span className="showcase-row-status">
                    {entry.work.status}
                  </span>
                </button>
              </li>
            ))}
          </ol>
          <div className="showcase-controls">
            <div className="showcase-arrows">
              <button
                type="button"
                aria-label="上一件作品"
                onClick={() => select(active - 1)}
              >
                <ArrowLeft size={20} />
              </button>
              <span className="showcase-count">
                {String(active + 1).padStart(2, '0')} / {entries.length}
              </span>
              <button
                type="button"
                aria-label="下一件作品"
                onClick={() => select(active + 1)}
              >
                <ArrowRight size={20} />
              </button>
            </div>
            <button
              type="button"
              className="showcase-play"
              disabled={reduced}
              onClick={() => setPlaying(!playing)}
              aria-label={
                reduced
                  ? '已减少动态，自动播放关闭'
                  : playing
                    ? '暂停自动播放'
                    : '开启自动播放'
              }
            >
              {playing && !reduced ? <Pause size={15} /> : <Play size={15} />}
              <span>
                {reduced ? '手动浏览' : playing ? '自动播放' : '播放'}
              </span>
            </button>
          </div>
          <div className="showcase-timer" aria-hidden="true">
            <span
              key={`${active}-${running}`}
              className={running ? 'is-running' : ''}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
