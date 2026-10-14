'use client';
import Link from 'next/link';
import { ArrowRight, ArrowUpRight, Pause, Play } from 'lucide-react';
import { Fragment, useEffect, useRef, useState, type ReactNode } from 'react';
import type { PointerEvent, MouseEvent } from 'react';
import { products, studio } from './data';
import { Thumb } from './thumbs';
import { Stage } from './stages';
import { useReducedMotion, useVisible } from './motion';

// 第二屏：产品列表。一眼看到所有产品线，鼠标移到哪一件，右边主画面就换成哪一件。
// 从左到右三块：缩略图、产品名（下面一行领域与阶段）、主画面（一句话说是什么 + 一句价值 + 一段典型 case 的动画）。
// 结构上每一行后面紧跟它自己的主画面：宽屏时五块主画面叠在右边同一格里，只显示选中的那块；
// 窄屏时选中的那块直接展开在它那一行下面。键盘聚焦到哪一行，也就选中哪一行。
// 触屏上第一次点一行是选中，再点一次才进产品页。

const pad = (n: number) => String(n).padStart(2, '0');

/** backdrop：整段铺一张背景配图（例如 Mix 版的海边），列表放在一层磨砂的纸上 */
export function Products({ backdrop }: { backdrop?: ReactNode } = {}) {
  const ref = useRef<HTMLElement>(null);
  const visible = useVisible(ref, 0.2);
  const reduced = useReducedMotion();
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const intent = useRef(0);
  const running = visible && !reduced && !paused;

  useEffect(() => () => window.clearTimeout(intent.current), []);

  const enter = (index: number) => (event: PointerEvent) => {
    if (event.pointerType !== 'mouse') return;
    window.clearTimeout(intent.current);
    // 鼠标只是路过时不换，停一下才换
    intent.current = window.setTimeout(() => setActive(index), 90);
  };
  const leave = () => window.clearTimeout(intent.current);
  const tap = (index: number) => (event: MouseEvent) => {
    if (index === active) return;
    // 没有悬停的设备上，第一次点是选中
    if (!matchMedia('(hover: hover)').matches) {
      event.preventDefault();
      setActive(index);
    }
  };

  return (
    <section
      ref={ref}
      className="r8-products"
      id="products"
      data-backdrop={backdrop ? true : undefined}
      aria-labelledby="r8-products-title"
    >
      {backdrop ? (
        <div className="r8-products-backdrop" aria-hidden="true">
          {backdrop}
        </div>
      ) : null}
      <div className="r8-products-sheet">
        <header className="r8-products-head" data-reveal>
          <h2 id="r8-products-title">
            <span lang="en">{studio.labels.products.en}</span>
            <small>{studio.labels.products.zh}</small>
          </h2>
          <p>
            <span lang="en">Five lines</span>
            <span>工作 · 生活 · 体验</span>
          </p>
        </header>

        <div className="r8-plist" data-reveal>
          {products.map((product, index) => {
            const on = index === active;
            return (
              <Fragment key={product.id}>
                <Link
                  href={product.href}
                  className="r8-prow"
                  data-active={on || undefined}
                  aria-current={on ? 'true' : undefined}
                  style={{ '--row': index + 1 } as React.CSSProperties}
                  onPointerEnter={enter(index)}
                  onPointerLeave={leave}
                  onFocus={(event) => {
                    // 只认键盘聚焦；点按带来的聚焦交给 onClick 判断
                    if (event.currentTarget.matches(':focus-visible'))
                      setActive(index);
                  }}
                  onClick={tap(index)}
                >
                  <span className="r8-prow-no" aria-hidden="true">
                    {pad(index + 1)}
                  </span>
                  <span
                    className="r8-prow-thumb"
                    data-concept={product.concept || undefined}
                  >
                    <Thumb id={product.id} />
                  </span>
                  <span className="r8-prow-name">
                    <strong lang="en">{product.name}</strong>
                    <small>
                      {product.concept ? (
                        <span className="r8-tag">{product.status}</span>
                      ) : (
                        <>
                          {product.area ? `${product.area} · ` : ''}
                          {product.status}
                        </>
                      )}
                    </small>
                  </span>
                  <ArrowRight
                    className="r8-prow-arrow"
                    size={18}
                    aria-hidden="true"
                  />
                </Link>
                <article
                  className={`r8-panel r8-panel-${product.id}${on ? ' is-on' : ''}`}
                  data-running={on && running}
                  aria-label={product.name}
                  inert={!on}
                  style={{ '--row': index + 1 } as React.CSSProperties}
                >
                  <div className="r8-panel-copy">
                    <p className="r8-panel-kicker">
                      <span className="r8-panel-no" lang="en">
                        {pad(index + 1)}
                      </span>
                      <span lang="en">{product.name}</span>
                    </p>
                    <h3 className="r8-panel-line">{product.line}</h3>
                    <p className="r8-panel-value">{product.value}</p>
                  </div>
                  <figure className="r8-panel-art" aria-label={product.label}>
                    <Stage id={product.id} on={on} />
                  </figure>
                  <footer className="r8-panel-foot">
                    <span className="r8-panel-links">
                      <Link className="r8-btn" href={product.href}>
                        {product.more}
                      </Link>
                      {product.extra ? (
                        <a
                          className="r8-more"
                          href={product.extra.href}
                          target="_blank"
                          rel="noreferrer"
                        >
                          {product.extra.label}
                          <ArrowUpRight size={13} aria-hidden="true" />
                        </a>
                      ) : null}
                    </span>
                    {product.relation ? (
                      <span className="r8-panel-relation">
                        {product.relation.text}
                        <span className="r8-tag">{product.relation.tag}</span>
                      </span>
                    ) : null}
                    <span className="r8-panel-note">
                      <span className="r8-tag">{product.note}</span>
                      <button
                        type="button"
                        className="r8-panel-toggle"
                        aria-pressed={paused}
                        aria-label={paused ? '继续播放演示' : '暂停演示'}
                        onClick={() => setPaused((value) => !value)}
                      >
                        {paused ? (
                          <Play
                            size={10}
                            fill="currentColor"
                            aria-hidden="true"
                          />
                        ) : (
                          <Pause
                            size={10}
                            fill="currentColor"
                            aria-hidden="true"
                          />
                        )}
                      </button>
                    </span>
                  </footer>
                </article>
              </Fragment>
            );
          })}
        </div>
      </div>
    </section>
  );
}
