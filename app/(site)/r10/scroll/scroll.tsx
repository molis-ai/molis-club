'use client';
import Link from 'next/link';
import type { CSSProperties, ReactNode } from 'react';
import { products, type ProductId } from '../../../../content/site/products';
import { productHref } from '../../../_site/routes';
import {
  Inscription,
  Photo,
  Rods,
  Ruler,
  Seal,
  numerals,
  useHandscroll,
  type MediaKey,
} from './roll';
import { SCROLL_WORK } from './routes';

// 一卷手卷（首页）：前两屏之后，页面变成一卷从右往左展开的长卷。
// 卷首「技术，回到人的尺度。」→ 五段风景（每段一张照片，后面一段竖写的题字：这件产品第 4 章的标题）。
// 五张照片是负责人的品牌概念图（雾感版），名字用负责人起的画名：接着做下去、光的刻度、空出来的午后、下一页另一片海、一座尚未命名的小岛。
// → 卷尾的落款，和一方「始终好奇，持续创造」的印。
// 顶上一把刻度尺，小方框表示走到了哪里；左页边竖排五件产品（目录，点哪件滚到哪段），右页边竖排这一段的名字。

type Scene = {
  id: ProductId;
  /** 这一段风景的名字（右页边竖排） */
  scene: string;
  image: MediaKey;
  size: 'l' | 'm';
  ratio: string;
  focus: string;
  alt: string;
};

const scenes: Scene[] = [
  {
    id: 'work',
    scene: '接着做下去',
    image: 'work-a',
    size: 'l',
    ratio: '2 / 1',
    focus: '50% 58%',
    alt: '窗边的旧木桌上铺满草图和折好的纸样，一台打开的笔记本电脑，窗外是花园。',
  },
  {
    id: 'tool',
    scene: '光的刻度',
    image: 'tool-a',
    size: 'm',
    ratio: '4 / 3',
    focus: '56% 50%',
    alt: '石台上一只小小的棱镜，把一道彩虹投在手边的白纸上。',
  },
  {
    id: 'life',
    scene: '空出来的午后',
    image: 'life-a',
    size: 'l',
    ratio: '16 / 9',
    focus: '60% 50%',
    alt: '白墙的房间里，一个人坐在窗台上看书，窗外远远是海。',
  },
  {
    id: 'story',
    scene: '下一页，另一片海',
    image: 'story-a',
    size: 'm',
    ratio: '1 / 1',
    focus: '36% 52%',
    alt: '摊开的一本书，书页上是蓝色的海岸，一张半透明的纸正翻过去。',
  },
  {
    id: 'world',
    scene: '一座尚未命名的小岛',
    image: 'world-a',
    size: 'l',
    ratio: '2.2 / 1',
    focus: '50% 56%',
    alt: '木桌上一座手做的小岛模型：小山、溪水、木桥和两间白房子。',
  },
];

const hrefOf = (id: ProductId) =>
  id === 'work' ? SCROLL_WORK : productHref[id];

export function Handscroll() {
  const { root, view, strip, active, marks, ended, go } = useHandscroll();
  const current = scenes[active - 1];

  return (
    <section
      ref={root}
      className="sc-roll"
      aria-labelledby="sc-roll-title"
      data-tone="paper"
    >
      <div className="sc-stage">
        <Ruler marks={marks} />
        <nav className="sc-index" aria-label="长卷里的五件产品">
          <ol>
            {scenes.map((scene, index) => (
              <li key={scene.id}>
                <button
                  type="button"
                  aria-current={active === index + 1 ? 'step' : undefined}
                  onClick={() => go(index + 1)}
                  lang="en"
                >
                  {products[scene.id].name.replace('Molis ', '')}
                </button>
              </li>
            ))}
          </ol>
        </nav>
        <p className="sc-margin">
          <span key={active}>
            {current
              ? `第${numerals[active - 1]}段　${current.scene}`
              : active === 0
                ? '卷首'
                : '卷尾'}
          </span>
        </p>
        <div className="sc-window" ref={view}>
          <Rods />
          <ol className="sc-strip" ref={strip}>
            <li className="sc-part sc-head" data-part>
              <h2 id="sc-roll-title" className="sc-title">
                <span className="sc-col">技术，</span>
                <span className="sc-col">回到人的尺度。</span>
              </h2>
              <p className="sc-head-note">
                <span lang="en">Molis AI</span>
                <span>五件作品　一卷</span>
              </p>
              <p className="sc-hint" aria-hidden="true">
                <span className="sc-hint-roll">往下滚，长卷向左展开</span>
                <span className="sc-hint-hang">往下读，长卷向下展开</span>
                <i>←</i>
              </p>
            </li>
            {scenes.map((scene, index) => (
              <Segment
                key={scene.id}
                scene={scene}
                index={index}
                active={active === index + 1}
              />
            ))}
            <li className="sc-part sc-tail" data-part>
              <div className="sc-colophon">
                <p className="sc-col">Molis AI　工作室</p>
                <p className="sc-col sc-date">二〇二六年十月</p>
              </div>
              <Seal sealed={ended} />
            </li>
          </ol>
        </div>
      </div>
    </section>
  );
}

function Segment({
  scene,
  index,
  active,
}: {
  scene: Scene;
  index: number;
  active: boolean;
}) {
  const product = products[scene.id];
  const concept = scene.id === 'world';
  return (
    <li
      className="sc-part sc-seg"
      data-part
      data-size={scene.size}
      data-active={active || undefined}
      aria-labelledby={`sc-${scene.id}`}
    >
      <figure
        className="sc-pic"
        style={{ '--ratio': scene.ratio } as CSSProperties}
      >
        <div className="sc-pic-frame">
          <Photo
            name={scene.image}
            alt={scene.alt}
            focus={scene.focus}
            eager
            sizes={
              scene.size === 'l'
                ? '(min-width: 900px) 64vw, 100vw'
                : '(min-width: 900px) 40vw, 100vw'
            }
          />
        </div>
        <figcaption className="sc-label">
          <span className="sc-label-no">
            {String(index + 1).padStart(2, '0')}
          </span>
          <span className="sc-label-name" lang="en" id={`sc-${scene.id}`}>
            {product.name}
          </span>
          <span className="sc-label-meta">
            {product.form}
            <span className="m-status" data-concept={concept || undefined}>
              {product.stage}
            </span>
          </span>
        </figcaption>
      </figure>
      <div className="sc-ins">
        <p className="sc-ins-text">
          <Inscription text={product.headline} />
        </p>
        <More href={hrefOf(scene.id)}>
          {concept
            ? '看看这个构想'
            : `走进 ${product.name.replace('Molis ', '')}`}
        </More>
      </div>
    </li>
  );
}

export function More({
  href,
  children,
}: {
  href: string;
  children: ReactNode;
}) {
  return (
    <Link className="sc-more" href={href}>
      <span>{children}</span>
      <i aria-hidden="true">←</i>
    </Link>
  );
}
