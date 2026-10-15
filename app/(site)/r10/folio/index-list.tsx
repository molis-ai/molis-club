'use client';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { Fragment, useEffect, useRef, useState } from 'react';
import type { CSSProperties, MouseEvent, PointerEvent } from 'react';
import {
  productIds,
  products,
  WORK_GITHUB,
  type ProductId,
} from '../../../../content/site/products';
import { homeProducts } from '../../../../content/site/home';
import { productHref } from '../../../_site/routes';
import { Ago, WarmDot } from './live';
import { grouped } from './format';
import { picture, type Picture } from './media';
import { FOLIO_WORK } from './paths';
import { Photo } from './plates';
import type { Pulse } from './pulse';

// 首页的目录（已定的「左列表、右舞台」）：左边五个项目像作品集的目录，罗马数字、小号大写的名字、一行分类；
// 右边是选中那件的图版——像 Norm 的项目卡：一张图、一个大写标题、一句话、一行分类。
// Work 的图版是真实界面的截图（开发中版本），别的四件是负责人的雾感品牌概念图；换项目时，旧的一张退进雾里，新的一张从雾里出来。
// 鼠标停一下才换；触屏上第一次点是选中、再点进入；键盘聚焦到哪行选哪行。窄屏上五件依次排开，不用选。

const roman = ['I', 'II', 'III', 'IV', 'V'];

type Cover = {
  image: Picture;
  alt: string;
  focus?: string;
  /** 真实界面的截图：不上雾 */
  real?: boolean;
};

const covers: Record<ProductId, { cover: Cover; caption: string }> = {
  work: {
    cover: {
      image: picture('shot-home'),
      alt: 'Molis Work 的项目首页：今天的工作、一周的日期条、正在推进的目标和当天的事件。',
      focus: '0% 0%',
      real: true,
    },
    caption: '开发中版本截图 · 演示数据',
  },
  tool: {
    cover: {
      image: picture('mist-tool-a'),
      alt: '粗糙的石台上，一只金属与玻璃做的小仪器把光分成一道彩虹，落在一张白纸上。',
      focus: '45% 55%',
    },
    caption: '光的刻度 · 品牌概念图',
  },
  life: {
    cover: {
      image: picture('mist-life-a'),
      alt: '有人坐在窗台上读书，窗外是绿树和远处的海。',
      focus: '62% 50%',
    },
    caption: '空出来的午后 · 品牌概念图',
  },
  story: {
    cover: {
      image: picture('mist-story-a'),
      alt: '窗边的桌上摊开一本书，书页上是蓝色的海岸画，夹着一根金色书签。',
      focus: '50% 50%',
    },
    caption: '下一页，另一片海 · 品牌概念图',
  },
  world: {
    cover: {
      image: picture('mist-world-a'),
      alt: '木桌上一座小岛的模型：白色的小房子、小桥、溪水和一棵树。',
      focus: '50% 50%',
    },
    caption: '一座尚未命名的小岛 · 品牌概念图',
  },
};

const hrefOf = (id: ProductId) => (id === 'work' ? FOLIO_WORK : productHref[id]);

export function FolioIndex({ pulse }: { pulse: Pulse | null }) {
  const [active, setActive] = useState(0);
  const intent = useRef(0);
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
      className="fo-index"
      id="index"
      data-folio="INDEX"
      data-tone="paper"
      aria-labelledby="fo-index-title"
    >
      <header className="fo-index-head" data-reveal>
        <h2 id="fo-index-title" className="fo-caps fo-caps-lg" lang="en">
          Index
        </h2>
        <p className="fo-index-sub">五件作品 · 工作、生活与体验</p>
      </header>

      <div className="fo-index-body">
        {productIds.map((id, index) => {
          const product = products[id];
          const on = index === active;
          const { cover, caption } = covers[id];
          const live = id === 'work' && pulse?.week != null;
          return (
            <Fragment key={id}>
              <Link
                href={hrefOf(id)}
                className="fo-row"
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
                <span className="fo-row-no" lang="en" aria-hidden="true">
                  {roman[index]}
                </span>
                <span className="fo-row-name" lang="en">
                  {product.name}
                </span>
                <span className="fo-row-class">
                  {product.form}
                  <i aria-hidden="true">|</i>
                  {product.stage}
                </span>
              </Link>
              <article
                className="fo-card"
                data-active={on || undefined}
                data-concept={id === 'world' || undefined}
                aria-label={product.name}
                style={{ '--row': index + 1 } as CSSProperties}
              >
                <figure
                  className="fo-card-plate"
                  data-real={cover.real || undefined}
                >
                  <div className="fo-card-frame">
                    <Photo
                      image={cover.image}
                      alt={cover.alt}
                      focus={cover.focus}
                      sizes="(min-width: 960px) 46vw, 92vw"
                    />
                  </div>
                  <figcaption>
                    <span lang="en" className="fo-plate-no">
                      Pl. {roman[index]}
                    </span>
                    <span>{caption}</span>
                  </figcaption>
                </figure>
                <div className="fo-card-copy">
                  <h3 className="fo-card-title" lang="en">
                    {product.name}
                  </h3>
                  <p className="fo-card-what">{product.what}</p>
                  <p className="fo-card-class">
                    <span>{product.form}</span>
                    <i aria-hidden="true">|</i>
                    <span className="fo-stage">
                      {id === 'work' ? <WarmDot pulse={pulse} /> : null}
                      {product.stage}
                    </span>
                    {live ? (
                      <>
                        <i aria-hidden="true">|</i>
                        <span>近七天 {grouped(pulse.week!)} 次提交</span>
                      </>
                    ) : null}
                  </p>
                  {id === 'work' && pulse?.last ? (
                    <p className="fo-card-live">
                      最近一次改动 <Ago iso={pulse.last.at} />
                    </p>
                  ) : null}
                  <p className="fo-card-go">
                    <Link className="fo-link" href={hrefOf(id)}>
                      {homeProducts[id].more}
                    </Link>
                    {id === 'work' ? (
                      <a
                        className="fo-link"
                        href={WORK_GITHUB}
                        target="_blank"
                        rel="noreferrer"
                      >
                        {homeProducts.work.github}
                        <ArrowUpRight size={12} aria-hidden="true" />
                      </a>
                    ) : null}
                  </p>
                </div>
              </article>
            </Fragment>
          );
        })}
      </div>
    </section>
  );
}
