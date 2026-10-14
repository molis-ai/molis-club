'use client';
import Link from 'next/link';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import { Fragment, useEffect, useRef, useState } from 'react';
import type { CSSProperties, MouseEvent, PointerEvent } from 'react';
import {
  productIds,
  products,
  WORK_GITHUB,
  type ProductId,
} from '../../../content/site/products';
import { homeProducts } from '../../../content/site/home';
import { Reel, type Segment } from '../demo/reel';
import { useReducedMotion, useVisible } from '../motion';
import { productHref } from '../routes';
import { posterCase } from '../scenes/tool';
import { seaCase } from '../scenes/life';
import { elsewhereCase } from '../scenes/story';
import { noodleCase } from '../scenes/world';
import { workHomeSegments } from '../scenes/work';
import { Phrases } from '../ui';
import { Thumb } from './thumbs';
import '../demo/demo.css';

// 首页第三段：产品。结构沿用第八轮海边版：左边一列五件产品（缩略图、名字、阶段圆点），
// 鼠标停在哪件右边换哪件；触屏上第一次点是选中，再点才进产品页；键盘聚焦到哪行就选中哪行。
// 右侧舞台按 spec 第 4 节重做：名字与阶段 → 第 4 章标题 → 一句「它是什么」→ 演示 → 去处。
// 演示只在选中、在视口里、没暂停时播；减少动态时停在每段结果上，点底部细线换段。

const pad = (n: number) => String(n).padStart(2, '0');

const reels: Record<ProductId, Segment[]> = {
  work: workHomeSegments,
  tool: [{ title: homeProducts.tool.caseTitle, scene: posterCase }],
  life: [{ title: homeProducts.life.caseTitle, scene: seaCase }],
  story: [{ title: homeProducts.story.caseTitle, scene: elsewhereCase }],
  world: [{ title: homeProducts.world.caseTitle, scene: noodleCase }],
};

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
      className="m-products"
      id="products"
      data-tone="paper"
      aria-labelledby="m-products-title"
    >
      <div className="m-products-sheet">
        <header className="m-products-head" data-reveal>
          <h2 id="m-products-title">
            <span lang="en">Products</span>
            <small>产品</small>
          </h2>
          <p>
            <span lang="en">Five lines</span>
            <span>工作 · 生活 · 体验</span>
          </p>
        </header>

        <div className="m-plist" data-reveal>
          {productIds.map((id, index) => {
            const product = products[id];
            const home = homeProducts[id];
            const on = index === active;
            return (
              <Fragment key={id}>
                <Link
                  href={productHref[id]}
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
                    data-concept={id === 'world' || undefined}
                  >
                    <Thumb id={id} />
                  </span>
                  <span className="m-prow-name">
                    <strong lang="en">{product.name}</strong>
                    <small
                      className="m-status"
                      data-concept={id === 'world' || undefined}
                    >
                      {product.stage}
                    </small>
                  </span>
                  <ArrowRight
                    className="m-prow-arrow"
                    size={18}
                    aria-hidden="true"
                  />
                </Link>
                <article
                  className={`m-panel m-panel-${id}${on ? ' is-on' : ''}`}
                  aria-label={product.name}
                  inert={!on}
                  style={{ '--row': index + 1 } as CSSProperties}
                >
                  <div className="m-panel-copy">
                    <p className="m-panel-kicker">
                      <span className="m-no" lang="en">
                        {pad(index + 1)}
                      </span>
                      <span lang="en">{product.name}</span>
                      <span
                        className="m-status"
                        data-concept={id === 'world' || undefined}
                      >
                        {product.stage}
                      </span>
                    </p>
                    <h3 className="m-panel-title">
                      <Phrases text={product.headline} />
                    </h3>
                    <p className="m-panel-what">{product.what}</p>
                  </div>
                  <Reel
                    name={product.name}
                    segments={reels[id]}
                    running={on && running}
                    reduced={reduced}
                    paused={paused}
                    onPause={() => setPaused((value) => !value)}
                    view={home.view}
                  />
                  <footer className="m-panel-go">
                    <Link className="m-btn" href={productHref[id]}>
                      {home.more}
                    </Link>
                    {id === 'work' ? (
                      <a
                        className="m-link"
                        href={WORK_GITHUB}
                        target="_blank"
                        rel="noreferrer"
                      >
                        {homeProducts.work.github}
                        <ArrowUpRight size={13} aria-hidden="true" />
                      </a>
                    ) : null}
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
