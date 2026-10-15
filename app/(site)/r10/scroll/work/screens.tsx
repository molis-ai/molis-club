'use client';
import type { CSSProperties } from 'react';
import { products } from '../../../../../content/site/products';
import media from '../media.json';
import {
  Inscription,
  Photo,
  Rods,
  Ruler,
  numerals,
  useHandscroll,
  type MediaKey,
} from '../roll';

// Work 页的一卷工作台：Molis Work 开发中版本的真实截图（docs/screenshots/soft-workbench，「现在的工作台」），
// 连成一卷从右往左展开。截图内容不改：只在上面盖一层纸色的薄雾，留出一处「光」（这一段要看的地方），
// 再在题字下面放这一处的局部放大（同一张截图按原尺寸裁出来）。
// 最后一段是插件创作台：还在预览，没有截图，就留一段空白。

const work = products.work;
const [arrange, together, record, grow] = work.sections;

/** 截图原尺寸 1440×1000；light 是这一处在截图里的位置（像素） */
type Shot = {
  image: MediaKey;
  screen: string;
  alt: string;
  columns: string[];
  light: { x: number; y: number; w: number; h: number };
};

const shots: Shot[] = [
  {
    image: 'work-onboarding',
    screen: '首次使用',
    alt: 'Molis Work 首次使用的窗口：问「想带入哪些内容？」，勾选了单独选文件、浏览器内容和聊天记录，右边预览出一个新项目。',
    columns: ['Molis Work', '把这些工作', '放进同一个环境里。'],
    light: { x: 246, y: 344, w: 464, h: 372 },
  },
  {
    image: 'work-home',
    screen: '项目首页',
    alt: 'Molis Work 项目首页：今天的工作、横向日期条、正在推进的目标和当天事件；右边是随手记和「回到手边的内容」。',
    columns: arrange.title.split(/(?<=，)/),
    light: { x: 1040, y: 466, w: 262, h: 300 },
  },
  {
    image: 'work-feed',
    screen: '信息流',
    alt: 'Molis Work 信息流：左边一列消息卡片，右边读一篇文章，底下可以加入 Inbox、保存为资料、升格为 Goal 或忽略。',
    columns: ['可以把资料、', '信息流和文档', '放在一起'],
    light: { x: 544, y: 476, w: 708, h: 60 },
  },
  {
    image: 'work-goals',
    screen: '目标',
    alt: 'Molis Work 目标页：一条 Goal 以文档打开，写着下一步与完成要求「1/1 已满足」，下面是时间线；左边是 Goal 树。',
    columns: record.title.split(/(?<=，)/),
    light: { x: 466, y: 300, w: 788, h: 186 },
  },
  {
    image: 'work-dark',
    screen: '项目首页 · 深色',
    alt: '深色模式下的 Molis Work 项目首页；底栏中间是统一对话：「助理」「让助理做点什么」。',
    columns: together.title.split(/(?<=，)/),
    light: { x: 640, y: 936, w: 416, h: 54 },
  },
];

const W = 1440;
const H = 1000;

/** 局部放大：同一张截图，按原尺寸裁出亮着的那一处 */
function Loupe({ shot }: { shot: Shot }) {
  const { x, y, w, h } = shot.light;
  const image = media[shot.image];
  return (
    <span
      className="sc-loupe"
      aria-hidden="true"
      style={
        {
          '--lw': w,
          '--la': w / h,
          aspectRatio: `${w} / ${h}`,
          backgroundImage: `url(${image.src})`,
          backgroundSize: `${(W / w) * 100}% auto`,
          backgroundPosition: `${(x / (W - w)) * 100}% ${(y / (H - h)) * 100}%`,
        } as CSSProperties
      }
    />
  );
}

export function WorkScroll() {
  const { root, view, strip, active, marks, ended } = useHandscroll();
  const current = shots[active - 1];
  return (
    <section
      ref={root}
      className="sc-roll sc-shots"
      aria-labelledby="sc-shots-title"
      data-tone="paper"
      data-ended={ended || undefined}
    >
      <div className="sc-stage">
        <Ruler marks={marks} />
        <p className="sc-margin sc-margin-left" aria-hidden="true">
          <span>开发中版本截图</span>
        </p>
        <p className="sc-margin">
          <span key={active}>
            {current
              ? `第${numerals[active - 1]}段　${current.screen}`
              : active === 0
                ? '卷首'
                : active === shots.length + 1
                  ? '第六段　还在预览'
                  : '卷尾'}
          </span>
        </p>
        <div className="sc-window" ref={view}>
          <Rods />
          <ol className="sc-strip" ref={strip}>
            <li className="sc-part sc-head" data-part>
              <h2 id="sc-shots-title" className="sc-title sc-title-s">
                <span className="sc-col">一卷工作台</span>
              </h2>
              <p className="sc-head-note">
                <span>
                  以下都是 Molis Work 开发中版本的真实截图，界面还会变
                </span>
              </p>
              <p className="sc-hint" aria-hidden="true">
                <span className="sc-hint-roll">往下滚，长卷向左展开</span>
                <span className="sc-hint-hang">往下读，长卷向下展开</span>
                <i>←</i>
              </p>
            </li>
            {shots.map((shot, index) => (
              <li
                key={shot.image}
                className="sc-part sc-seg sc-shot"
                data-part
                data-size="l"
                data-active={active === index + 1 || undefined}
                data-dark={shot.image === 'work-dark' || undefined}
              >
                <figure
                  className="sc-pic"
                  style={{ '--ratio': `${W} / ${H}` } as CSSProperties}
                >
                  <div className="sc-pic-frame sc-screen">
                    <Photo
                      name={shot.image}
                      alt={shot.alt}
                      sizes="(min-width: 900px) 60vw, 100vw"
                      eager
                    />
                    <span
                      className="sc-light"
                      aria-hidden="true"
                      style={
                        {
                          left: `${(shot.light.x / W) * 100}%`,
                          top: `${(shot.light.y / H) * 100}%`,
                          width: `${(shot.light.w / W) * 100}%`,
                          height: `${(shot.light.h / H) * 100}%`,
                        } as CSSProperties
                      }
                    />
                  </div>
                  <figcaption className="sc-label">
                    <span className="sc-label-no">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <span className="sc-label-name">{shot.screen}</span>
                    <span className="sc-label-meta">开发中版本截图</span>
                  </figcaption>
                </figure>
                <div className="sc-ins">
                  <p className="sc-ins-text">
                    <Inscription columns={shot.columns} />
                  </p>
                  <Loupe shot={shot} />
                </div>
              </li>
            ))}
            {/* 插件创作台：还在预览，没有截图，这一段留白 */}
            <li
              className="sc-part sc-seg sc-shot sc-blank"
              data-part
              data-size="l"
            >
              <figure
                className="sc-pic"
                style={{ '--ratio': `${W} / ${H}` } as CSSProperties}
              >
                <div className="sc-pic-frame sc-empty">
                  <p>插件创作台还在预览，这一段先空着。</p>
                </div>
                <figcaption className="sc-label">
                  <span className="sc-label-no">06</span>
                  <span className="sc-label-name">插件创作台</span>
                  <span className="sc-label-meta">
                    <span className="m-note">预览</span>
                  </span>
                </figcaption>
              </figure>
              <div className="sc-ins">
                <p className="sc-ins-text">
                  <Inscription text={grow.title} />
                </p>
              </div>
            </li>
            <li className="sc-part sc-tail sc-tail-s" data-part>
              <p className="sc-title sc-title-s">
                <span className="sc-col">未完，</span>
                <span className="sc-col">待续。</span>
              </p>
              <p className="sc-tail-stage">
                <span className="m-status">{work.stage}</span>
              </p>
            </li>
          </ol>
        </div>
      </div>
    </section>
  );
}
