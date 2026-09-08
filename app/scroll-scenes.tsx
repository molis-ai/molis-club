'use client';

import { useEffect, useRef, useState, type CSSProperties } from 'react';
import Link from 'next/link';
import { ArrowDown, ArrowRight, ArrowUpRight } from 'lucide-react';
import { works } from '../content/works';
import { WorkIdentity } from './work-presentation';
import './scroll-scenes.css';

/** Native scroll is the clock. With no JS or reduced motion, the ordered scene is ordinary page content. */
function useScrollScene() {
  const ref = useRef<HTMLElement>(null);
  useEffect(() => {
    const section = ref.current;
    if (!section) return;
    const stage = section.querySelector<HTMLElement>('[data-scene-sticky]');
    if (!stage) return;
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
    let frame = 0;
    let visible = true;
    const paint = () => {
      frame = 0;
      if (preference.matches) return;
      const distance = section.offsetHeight - stage.offsetHeight;
      const progress = Math.min(
        1,
        Math.max(
          0,
          -section.getBoundingClientRect().top / Math.max(1, distance),
        ),
      );
      section.style.setProperty('--scene-progress', progress.toFixed(4));
    };
    const requestPaint = () => {
      if (visible && !document.hidden && !frame && !preference.matches)
        frame = requestAnimationFrame(paint);
    };
    const configure = () => {
      if (preference.matches) {
        section.removeAttribute('data-scroll-scene');
        section.style.removeProperty('--scene-progress');
        cancelAnimationFrame(frame);
        frame = 0;
      } else {
        section.setAttribute('data-scroll-scene', '');
        paint();
      }
    };
    configure();
    const visibility = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
        requestPaint();
      },
      { rootMargin: '80px' },
    );
    visibility.observe(section);
    const resize = new ResizeObserver(requestPaint);
    resize.observe(stage);
    window.addEventListener('scroll', requestPaint, { passive: true });
    window.addEventListener('resize', requestPaint);
    document.addEventListener('visibilitychange', requestPaint);
    preference.addEventListener('change', configure);
    return () => {
      cancelAnimationFrame(frame);
      visibility.disconnect();
      resize.disconnect();
      window.removeEventListener('scroll', requestPaint);
      window.removeEventListener('resize', requestPaint);
      document.removeEventListener('visibilitychange', requestPaint);
      preference.removeEventListener('change', configure);
    };
  }, []);
  return ref;
}

const specimens = [
  {
    slug: 'elsewhere',
    group: 0,
    row: 0,
    dx: '-7cqw',
    dy: '4cqh',
    tilt: -8,
    mobileDx: '-2cqw',
    mobileDy: '0cqh',
  },
  {
    slug: 'astralo',
    group: 0,
    row: 1,
    dx: '-3cqw',
    dy: '9cqh',
    tilt: 5,
    mobileDx: '-2cqw',
    mobileDy: '2cqh',
  },
  {
    slug: 'niulai',
    group: 1,
    row: 0,
    dx: '-2cqw',
    dy: '7cqh',
    tilt: -5,
    mobileDx: '-1cqw',
    mobileDy: '0cqh',
  },
  {
    slug: 'jelly',
    group: 1,
    row: 1,
    dx: '5cqw',
    dy: '9cqh',
    tilt: 7,
    mobileDx: '1cqw',
    mobileDy: '1cqh',
  },
  {
    slug: 'goalboard',
    group: 2,
    row: 0,
    dx: '3cqw',
    dy: '-7cqh',
    tilt: -6,
    mobileDx: '0cqw',
    mobileDy: '1cqh',
  },
  {
    slug: 'forklight',
    group: 2,
    row: 1,
    dx: '4cqw',
    dy: '7cqh',
    tilt: 4,
    mobileDx: '1cqw',
    mobileDy: '0cqh',
  },
];

export function ProductScene() {
  const ref = useScrollScene();
  return (
    <section
      className="product-scroll-scene"
      ref={ref}
      aria-label="产品签随滚动归位的作品桌"
    >
      <div className="product-scene-stage" data-scene-sticky>
        <div className="product-scene-frame">
          <div className="product-scene-title">
            <h1>
              Products<em>好奇，总有去处。</em>
            </h1>
            <p>
              一些照顾感受，一些留出时间。
              <br />
              还有一些，让下一次创造更容易。
            </p>
          </div>
          <div className="product-scene-groups" aria-hidden="true">
            <span>情绪与体验</span>
            <span>轻量工具</span>
            <span>AI 与工程效率</span>
          </div>
          <ul className="product-specimens" aria-label="六件作品">
            {specimens.map((specimen) => {
              const work = works.find((item) => item.slug === specimen.slug)!;
              const style = {
                '--column': specimen.group,
                '--row': specimen.row,
                '--dx': specimen.dx,
                '--dy': specimen.dy,
                '--tilt': `${specimen.tilt}deg`,
                '--mobile-dx': specimen.mobileDx,
                '--mobile-dy': specimen.mobileDy,
              } as CSSProperties;
              return (
                <li
                  key={work.slug}
                  style={style}
                  className={`specimen-group-${specimen.group}`}
                >
                  <Link
                    href={`/works/${work.slug}`}
                    className="product-specimen"
                  >
                    <WorkIdentity work={work} />
                    <div>
                      <span>{work.status}</span>
                      <ArrowUpRight size={17} aria-hidden="true" />
                    </div>
                  </Link>
                </li>
              );
            })}
          </ul>
          <div className="product-scene-bottom">
            <span className="scene-scroll-instruction">
              向下滚动，让想法找到位置 <ArrowDown size={16} />
            </span>
            <a href="#collection">
              直接浏览全部作品 <ArrowDown size={16} />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

const solutionNarratives = [
  {
    slug: 'content-growth',
    label: '内容与增长',
    steps: ['研究与判断', '内容创作', '反馈与复盘'],
    descriptions: [
      '研究资产与机会判断',
      '多平台内容基础包',
      '评价与策略迭代仍在规划',
    ],
  },
  {
    slug: 'evrik',
    label: '软件 Agent 化',
    steps: ['业务能力', '目标与授权', '执行与检查'],
    descriptions: [
      '保留现有业务规则',
      '接受目标，明确授权',
      '运行保护与结果检查',
    ],
  },
  {
    slug: 'aether',
    label: '数据与洞察',
    steps: ['指标与知识', '分析与解释', '可编辑报告'],
    descriptions: ['指标接入与知识引用', '自然语言分析', '可编辑报告与推送'],
  },
];

export function SolutionScene() {
  const ref = useScrollScene();
  const [selected, setSelected] = useState(0);
  const narrative = solutionNarratives[selected];
  const work = works.find((item) => item.slug === narrative.slug)!;
  return (
    <section
      className="solution-scroll-scene"
      ref={ref}
      aria-label="滚动连接业务环节"
    >
      <div className="solution-scene-stage" data-scene-sticky>
        <div className="solution-scene-frame">
          <div className="solution-scene-title">
            <h1>
              让工作，<em>慢慢连起来。</em>
            </h1>
            <p>
              从一个具体问题开始，
              <br />把 AI 放进真实的业务。
            </p>
          </div>
          <div
            className="solution-scene-controls"
            aria-label="选择要查看的方案"
          >
            {solutionNarratives.map((item, index) => (
              <button
                type="button"
                key={item.slug}
                aria-pressed={selected === index}
                onClick={() => setSelected(index)}
              >
                {item.label}
              </button>
            ))}
          </div>
          <a className="solution-scene-skip" href="#approaches">
            直接看方案详情 <ArrowDown size={16} />
          </a>
          <div
            className="workflow-assembly"
            aria-label={`${work.name}示意路径`}
          >
            <div className="workflow-thread" aria-hidden="true">
              <span />
              <ArrowRight size={20} />
            </div>
            <ol>
              {narrative.steps.map((step, index) => (
                <li
                  key={`${narrative.slug}-${step}`}
                  style={{ '--step': index } as CSSProperties}
                >
                  <span className="workflow-step-name">{step}</span>
                  <p>{narrative.descriptions[index]}</p>
                  <span className="workflow-step-dot" aria-hidden="true" />
                </li>
              ))}
            </ol>
          </div>
          <div className="solution-scene-caption">
            <p>方案示意 · 实际能力以当前阶段为准</p>
            <span className="scene-scroll-instruction">
              向下滚动，连接工作环节 <ArrowDown size={16} />
            </span>
          </div>
          <div className="solution-scene-fact">
            <div>
              <strong>{work.name}</strong>
              <span>{work.status}</span>
            </div>
            <p>{work.detail}</p>
            <Link href={`/works/${work.slug}`}>
              了解方案 <ArrowUpRight size={18} />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
