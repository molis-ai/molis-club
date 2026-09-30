'use client';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { ExternalLink, Monitor, Smartphone } from 'lucide-react';
import {
  directions,
  findDirection,
  pageKinds,
  routeOf,
  shotOf,
  shotSet,
  shotSize,
  type PageKind,
} from '../_review/directions';
import { Palette } from '../_review/palette';

type Device = 'desktop' | 'mobile';
const frames = {
  desktop: { width: 1440, height: 900, label: '桌面' },
  mobile: { width: 390, height: 844, label: '手机' },
} as const;

function smooth() {
  return matchMedia('(prefers-reduced-motion: reduce)').matches
    ? 'auto'
    : 'smooth';
}

export function CompareBoard() {
  const [slug, setSlug] = useState(directions[0].slug);
  const [page, setPage] = useState<PageKind>('home');
  const [device, setDevice] = useState<Device>('desktop');
  const [synced, setSynced] = useState(false);
  const [box, setBox] = useState<{ w: number; h: number } | null>(null);
  const [loaded, setLoaded] = useState('');
  const stageRef = useRef<HTMLDivElement>(null);
  const benchRef = useRef<HTMLElement>(null);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  useEffect(() => {
    const query = new URLSearchParams(location.search);
    const wanted = findDirection(query.get('d'));
    const view = query.get('v');
    queueMicrotask(() => {
      if (wanted) setSlug(wanted.slug);
      if (query.get('p') === 'work') setPage('work');
      if (view === 'desktop' || view === 'mobile') setDevice(view);
      else if (matchMedia('(max-width: 760px)').matches) setDevice('mobile');
      setSynced(true);
    });
  }, []);

  useEffect(() => {
    if (!synced) return;
    const query = new URLSearchParams({ d: slug, p: page, v: device });
    history.replaceState(history.state, '', `${location.pathname}?${query}`);
  }, [synced, slug, page, device]);

  useEffect(() => {
    const el = stageRef.current;
    if (!el) return;
    const observer = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      setBox({ w: width, h: height });
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const direction = findDirection(slug) ?? directions[0];
  const pageLabel = pageKinds.find((p) => p.id === page)!.label;
  const frame = frames[device];
  const src = routeOf(slug, page);
  const key = `${src}|${device}`;
  let scale = 1;
  let frameHeight: number = frame.height;
  if (box && device === 'desktop') {
    scale = box.w / frame.width;
    frameHeight = box.h / scale;
  } else if (box) {
    scale = Math.min(
      1,
      (box.h - 28) / frame.height,
      (box.w - 28) / frame.width,
    );
  }

  function open(next: string, nextPage: PageKind, nextDevice: Device) {
    setSlug(next);
    setPage(nextPage);
    setDevice(nextDevice);
    benchRef.current?.scrollIntoView({ behavior: smooth(), block: 'start' });
  }

  function onTabKey(e: React.KeyboardEvent, index: number) {
    const last = directions.length - 1;
    const target =
      e.key === 'ArrowDown' || e.key === 'ArrowRight'
        ? index === last
          ? 0
          : index + 1
        : e.key === 'ArrowUp' || e.key === 'ArrowLeft'
          ? index === 0
            ? last
            : index - 1
          : e.key === 'Home'
            ? 0
            : e.key === 'End'
              ? last
              : -1;
    if (target < 0) return;
    e.preventDefault();
    setSlug(directions[target].slug);
    tabRefs.current[target]?.focus();
  }

  return (
    <>
      <section
        className="rv-bench"
        ref={benchRef}
        aria-labelledby="rv-title"
        id="stage"
      >
        <div className="rv-rail">
          <div className="rv-intro">
            <h1 id="rv-title">五个方向，放在一起看</h1>
            <p>
              每个方向都有首页和 Molis Work
              产品页。文案与产品事实一致，差别在视觉和动效。预览台里加载的是真实页面，可以直接滚动和点击。
            </p>
          </div>
          <div className="rv-tabs" role="tablist" aria-label="品牌方向">
            {directions.map((d, i) => (
              <button
                key={d.slug}
                ref={(el) => {
                  tabRefs.current[i] = el;
                }}
                type="button"
                role="tab"
                id={`rv-tab-${d.slug}`}
                aria-selected={d.slug === slug}
                aria-controls="rv-stage"
                tabIndex={d.slug === slug ? 0 : -1}
                className="rv-tab"
                onClick={() => setSlug(d.slug)}
                onKeyDown={(e) => onTabKey(e, i)}
              >
                <img
                  src={shotOf(d.slug, 'home', 'small')}
                  width={shotSize.small.width}
                  height={shotSize.small.height}
                  alt=""
                />
                <strong>
                  {d.name}
                  {d.en !== d.name && <span>{d.en}</span>}
                </strong>
                <small>{d.traits.join(' · ')}</small>
              </button>
            ))}
          </div>
          <div className="rv-detail" aria-live="polite">
            <p>{direction.thesis}</p>
            <Palette colors={direction.palette} />
            <div className="rv-detail-actions">
              <Link
                className="rv-button"
                href={`/demos/brand/vote?d=${direction.slug}`}
              >
                投给{direction.name}
              </Link>
              <a href={routeOf(direction.slug, 'home')} target="_blank">
                首页 <ExternalLink size={14} aria-hidden />
              </a>
              <a href={routeOf(direction.slug, 'work')} target="_blank">
                Molis Work <ExternalLink size={14} aria-hidden />
              </a>
            </div>
          </div>
        </div>
        <div className="rv-viewer">
          <div className="rv-bar">
            <fieldset className="rv-seg">
              <legend>页面</legend>
              {pageKinds.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  aria-pressed={page === p.id}
                  onClick={() => setPage(p.id)}
                >
                  {p.label}
                </button>
              ))}
            </fieldset>
            <code className="rv-path">{src}</code>
            <fieldset className="rv-seg">
              <legend>设备</legend>
              <button
                type="button"
                aria-pressed={device === 'desktop'}
                onClick={() => setDevice('desktop')}
              >
                <Monitor size={15} aria-hidden /> 桌面
              </button>
              <button
                type="button"
                aria-pressed={device === 'mobile'}
                onClick={() => setDevice('mobile')}
              >
                <Smartphone size={15} aria-hidden /> 手机
              </button>
            </fieldset>
            <a className="rv-open" href={src} target="_blank">
              新窗口打开 <ExternalLink size={14} aria-hidden />
            </a>
          </div>
          <div
            className="rv-stage"
            data-device={device}
            ref={stageRef}
            role="tabpanel"
            id="rv-stage"
            aria-labelledby={`rv-tab-${slug}`}
          >
            <div
              className="rv-screen"
              data-device={device}
              style={
                {
                  width: box ? frame.width * scale : undefined,
                  height: box ? frameHeight * scale : undefined,
                  '--rv-screen-bg': direction.palette[0],
                } as React.CSSProperties
              }
            >
              <div className="rv-screen-clip">
                <img
                  className="rv-poster"
                  src={shotOf(
                    slug,
                    page,
                    device === 'mobile' ? 'mobile' : 'large',
                  )}
                  width={
                    device === 'mobile'
                      ? shotSize.mobile.width
                      : shotSize.large.width
                  }
                  height={
                    device === 'mobile'
                      ? shotSize.mobile.height
                      : shotSize.large.height
                  }
                  alt=""
                />
                {box && (
                  <iframe
                    key={key}
                    src={src}
                    title={`${direction.name} · ${pageLabel}（${frame.label}预览）`}
                    data-loaded={loaded === key}
                    onLoad={() => setLoaded(key)}
                    style={{
                      width: frame.width,
                      height: frameHeight,
                      transform: `scale(${scale})`,
                    }}
                  />
                )}
              </div>
              {loaded !== key && (
                <span className="rv-loading">正在载入真实页面…</span>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="rv-sheet" aria-labelledby="rv-sheet-title">
        <div className="rv-sheet-head">
          <h2 id="rv-sheet-title">一览</h2>
          <p>十个页面的首屏截图。点任意一张，在上面的预览台打开真实页面。</p>
        </div>
        {directions.map((d) => (
          <article className="rv-row" key={d.slug}>
            <div className="rv-row-meta">
              <h3>
                {d.name}
                {d.en !== d.name && <span>{d.en}</span>}
              </h3>
              <p>{d.thesis}</p>
              <Palette colors={d.palette} small />
              <div className="rv-row-links">
                <a href={routeOf(d.slug, 'home')} target="_blank">
                  首页 <ExternalLink size={13} aria-hidden />
                </a>
                <a href={routeOf(d.slug, 'work')} target="_blank">
                  Molis Work <ExternalLink size={13} aria-hidden />
                </a>
                <Link href={`/demos/brand/vote?d=${d.slug}`}>投给它</Link>
              </div>
            </div>
            {(['desktop', 'mobile'] as const).map((view) =>
              pageKinds.map((p) => (
                <button
                  key={`${view}-${p.id}`}
                  type="button"
                  className="rv-shot"
                  data-device={view}
                  onClick={() => open(d.slug, p.id, view)}
                  aria-label={`在预览台打开${d.name}${p.label}（${frames[view].label}）`}
                >
                  <img
                    src={shotOf(
                      d.slug,
                      p.id,
                      view === 'mobile' ? 'mobile' : 'large',
                    )}
                    srcSet={shotSet(d.slug, p.id, view === 'mobile')}
                    sizes={
                      view === 'desktop'
                        ? '(max-width: 640px) 46vw, (max-width: 1100px) 36vw, 26vw'
                        : '(max-width: 640px) 46vw, 9vw'
                    }
                    width={
                      view === 'mobile'
                        ? shotSize.mobile.width
                        : shotSize.large.width
                    }
                    height={
                      view === 'mobile'
                        ? shotSize.mobile.height
                        : shotSize.large.height
                    }
                    loading="lazy"
                    alt=""
                  />
                  <span>
                    {p.id === 'home' ? '首页' : 'Work'} · {frames[view].label}
                  </span>
                </button>
              )),
            )}
          </article>
        ))}
      </section>

      <section className="rv-close">
        <h2>看完了？说说你更喜欢哪一个。</h2>
        <p>
          投一票，写下打动你的地方。别的方向里值得留下的细节，也可以一起写上。
        </p>
        <Link className="rv-button rv-button-large" href="/demos/brand/vote">
          去投票
        </Link>
      </section>
    </>
  );
}
