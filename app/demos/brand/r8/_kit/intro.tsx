'use client';
import Link from 'next/link';
import { ArrowRight, ArrowUpRight, Pause, Play } from 'lucide-react';
import { Fragment, useEffect, useRef, useState } from 'react';
import type { CSSProperties, MouseEvent, PointerEvent } from 'react';
import { studio } from './data';
import { access, intro, introProducts, links } from './intro-data';
import { IntroStage } from './intro-stages';
import { Thumb } from './thumbs';
import { useReducedMotion, useVisible } from './motion';
import './intro.css';

// 产品列表（美术馆的午后这一版），照产品介绍第 3、4 章重写。
// 左边一列五件产品（缩略图、名字、当前阶段），鼠标停在哪件，右边就换成哪件：
// 第 4 章的标题与一句话 → 分段演示（一轮不超过 10 秒，小标题是第 4 章的原句）→
// 第 3 章的「适合这样的时刻」「当前阶段」与去处。
// 列表下面是第 3 章的「这些产品怎样联系」和「目前如何了解与体验」。
// 交互同另外几版：鼠标停一下才换；键盘聚焦到哪行选哪行；触屏第一次点是选中，再点进产品页。

const pad = (n: number) => String(n).padStart(2, '0');

const names = Object.fromEntries(
  introProducts.map((product) => [product.id, product.name]),
);

export function ProductsIntro() {
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
    intent.current = window.setTimeout(() => setActive(index), 90);
  };
  const leave = () => window.clearTimeout(intent.current);
  const tap = (index: number) => (event: MouseEvent) => {
    if (index === active) return;
    if (!matchMedia('(hover: hover)').matches) {
      event.preventDefault();
      setActive(index);
    }
  };

  return (
    <section
      ref={ref}
      className="r8-products ix"
      id="products"
      aria-labelledby="r8-products-title"
    >
      <div className="r8-products-sheet">
        <header className="r8-products-head ix-head" data-reveal>
          <h2 id="r8-products-title">
            <span lang="en">{studio.labels.products.en}</span>
            <small>{intro.title}</small>
          </h2>
          <p className="ix-lead">{intro.lead}</p>
        </header>

        <div className="r8-plist" data-reveal>
          {introProducts.map((product, index) => {
            const on = index === active;
            return (
              <Fragment key={product.id}>
                <Link
                  href={product.href}
                  className="r8-prow"
                  data-active={on || undefined}
                  aria-current={on ? 'true' : undefined}
                  style={{ '--row': index + 1 } as CSSProperties}
                  onPointerEnter={enter(index)}
                  onPointerLeave={leave}
                  onFocus={(event) => {
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
                    <small className="ix-row-note">
                      <i data-stage={product.id} />
                      {product.rowNote}
                    </small>
                  </span>
                  <ArrowRight
                    className="r8-prow-arrow"
                    size={18}
                    aria-hidden="true"
                  />
                </Link>
                <article
                  className={`r8-panel ix-panel ix-panel-${product.id}${on ? ' is-on' : ''}`}
                  data-running={on && running}
                  aria-label={product.name}
                  inert={!on}
                  style={{ '--row': index + 1 } as CSSProperties}
                >
                  <div className="r8-panel-copy">
                    <p className="r8-panel-kicker">
                      <span className="r8-panel-no" lang="en">
                        {pad(index + 1)}
                      </span>
                      <span lang="en">{product.name}</span>
                      <span className="ix-stage" data-stage={product.id}>
                        <i />
                        {product.stage}
                      </span>
                    </p>
                    <h3 className="r8-panel-line">{product.headline}</h3>
                    <p className="r8-panel-value">{product.what}</p>
                  </div>
                  <figure
                    className="r8-panel-art ix-art"
                    aria-label={product.sceneLabel}
                  >
                    <IntroStage
                      product={product}
                      names={names}
                      controls={
                        <span className="r8-panel-note">
                          <span className="r8-tag">{product.sceneNote}</span>
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
                      }
                    />
                  </figure>
                  <div className="ix-below">
                    <dl className="ix-facts">
                      <div>
                        <dt>{intro.fitLabel}</dt>
                        <dd>{product.fit}</dd>
                      </div>
                      <div>
                        <dt>{intro.stageLabel}</dt>
                        <dd>
                          <b>{product.stage}。</b>
                          {product.stageNote}
                        </dd>
                      </div>
                    </dl>
                    <span className="ix-go">
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
                  </div>
                </article>
              </Fragment>
            );
          })}
        </div>

        <div className="ix-map" data-reveal>
          <section className="ix-map-links" aria-labelledby="ix-links-title">
            <h3 id="ix-links-title" className="ix-map-h">
              {links.title}
            </h3>
            <div className="ix-pair">
              <p className="ix-formula" aria-hidden="true">
                <span lang="en">{links.work.from}</span>
                <span className="ix-formula-to">
                  <small>{links.work.verb}</small>
                  <ArrowRight size={14} />
                </span>
                <span lang="en">{links.work.to}</span>
              </p>
              <p className="ix-map-text">{links.work.text}</p>
              <span className="r8-tag">{links.work.tag}</span>
            </div>
            <div className="ix-pair">
              <p className="ix-formula" lang="en">
                <span>Life</span>
                <i>+</i>
                <span>Story</span>
                <i>=</i>
                <span>World</span>
              </p>
              <p className="ix-map-text">{links.world.text}</p>
              <span className="r8-tag">{links.world.tag}</span>
            </div>
          </section>
          <section className="ix-map-access" aria-labelledby="ix-access-title">
            <h3 id="ix-access-title" className="ix-map-h">
              {access.title}
            </h3>
            <dl>
              {access.rows.map((row) => (
                <div key={row.who}>
                  <dt lang="en">{row.who}</dt>
                  <dd>
                    {row.text}
                    {row.link ? (
                      <a
                        className="r8-more"
                        href={row.link.href}
                        target="_blank"
                        rel="noreferrer"
                      >
                        {row.link.label}
                        <ArrowUpRight size={12} aria-hidden="true" />
                      </a>
                    ) : null}
                  </dd>
                </div>
              ))}
            </dl>
            <p className="ix-map-note">{access.note}</p>
          </section>
        </div>
      </div>
    </section>
  );
}
