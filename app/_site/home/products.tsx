'use client';
import Link from 'next/link';
import { ArrowRight, ArrowUpRight, Pause, Play } from 'lucide-react';
import { Fragment, useEffect, useRef, useState } from 'react';
import type { CSSProperties, MouseEvent, PointerEvent } from 'react';
import { useReducedMotion, useVisible } from '../motion';
import { access, intro, introProducts } from './stages-data';
import { IntroStage } from './stages';
import { Thumb } from './thumbs';
import './stages.css';

// 首页第三段：产品（第八轮「美术馆的午后」那一版，负责人 2026-10-15 定为首页用，原样保留）。
// 左边一列五件产品（缩略图、名字、当前阶段），鼠标停在哪件，右边就换成哪件：
// 第 4 章的标题与一句话 → 分段演示（一轮不超过 10 秒，小标题是第 4 章的原句）→
// 第 3 章的「适合这样的时刻」「当前阶段」与去处。列表下面是第 3 章的「目前如何了解与体验」；
// 「这些产品怎样联系」按负责人的意见不放首页，留给各产品页。
// 交互：鼠标停一下才换；键盘聚焦到哪行选哪行；触屏第一次点是选中，再点进产品页。

const pad = (n: number) => String(n).padStart(2, '0');

const names = Object.fromEntries(
  introProducts.map((product) => [product.id, product.name]),
);

export function Products() {
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
    if (!matchMedia('(hover: hover)').matches) {
      event.preventDefault();
      setActive(index);
    }
  };

  return (
    <section
      ref={ref}
      className="m-products ix"
      id="products"
      data-tone="paper"
      aria-labelledby="m-products-title"
    >
      <div className="m-products-sheet">
        <header className="m-products-head ix-head" data-reveal>
          <h2 id="m-products-title">
            <span lang="en">Products</span>
            <small>{intro.title}</small>
          </h2>
          <p className="ix-lead">{intro.lead}</p>
        </header>

        <div className="m-plist" data-reveal>
          {introProducts.map((product, index) => {
            const on = index === active;
            return (
              <Fragment key={product.id}>
                <Link
                  href={product.href}
                  className="m-prow"
                  data-active={on || undefined}
                  aria-current={on ? 'true' : undefined}
                  style={{ '--row': index + 1 } as CSSProperties}
                  onPointerEnter={enter(index)}
                  onPointerLeave={leave}
                  onFocus={(event) => {
                    // 只认键盘聚焦；点按带来的聚焦交给 onClick 判断
                    if (event.currentTarget.matches(':focus-visible'))
                      setActive(index);
                  }}
                  onClick={tap(index)}
                >
                  <span className="m-prow-no" aria-hidden="true">
                    {pad(index + 1)}
                  </span>
                  <span
                    className="m-prow-thumb"
                    data-concept={product.concept || undefined}
                  >
                    <Thumb id={product.id} />
                  </span>
                  <span className="m-prow-name">
                    <strong lang="en">{product.name}</strong>
                    <small className="ix-row-note">
                      <i data-stage={product.id} />
                      {product.rowNote}
                    </small>
                  </span>
                  <ArrowRight
                    className="m-prow-arrow"
                    size={18}
                    aria-hidden="true"
                  />
                </Link>
                <article
                  className={`m-panel ix-panel ix-panel-${product.id}${on ? ' is-on' : ''}`}
                  data-running={on && running}
                  aria-label={product.name}
                  inert={!on}
                  style={{ '--row': index + 1 } as CSSProperties}
                >
                  <div className="m-panel-copy">
                    <p className="m-panel-kicker">
                      <span className="m-panel-no" lang="en">
                        {pad(index + 1)}
                      </span>
                      <span lang="en">{product.name}</span>
                      <span className="ix-stage" data-stage={product.id}>
                        <i />
                        {product.stage}
                      </span>
                    </p>
                    <h3 className="m-panel-line">{product.headline}</h3>
                    <p className="m-panel-value">{product.what}</p>
                  </div>
                  <figure
                    className="m-panel-art ix-art"
                    aria-label={product.sceneLabel}
                  >
                    <IntroStage
                      product={product}
                      names={names}
                      controls={
                        <span className="m-panel-note">
                          <span className="ix-tag">{product.sceneNote}</span>
                          <button
                            type="button"
                            className="m-panel-toggle"
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
                      <Link className="m-btn" href={product.href}>
                        {product.more}
                      </Link>
                      {product.extra ? (
                        <a
                          className="m-link"
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
                        className="m-link"
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
