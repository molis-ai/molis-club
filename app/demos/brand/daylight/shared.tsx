'use client';
import Link from 'next/link';
import { ChevronDown } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import type {
  CSSProperties,
  PointerEvent as ReactPointerEvent,
  ReactNode,
} from 'react';
import {
  footer,
  lineNames,
  lines,
  navLabels,
  signature,
  workLine,
  type LineId,
} from '../../../../content/studio';

// Daylight 所有页面共用：路由、顶栏（含「产品」菜单）、黄昏页尾、叶影、逐字标题和页面动效。

export type Vars = CSSProperties & Record<`--${string}`, string | number>;

export const HOME = '/demos/brand/daylight';
export const WORK = `${HOME}/work`;
const LIFE = `${HOME}/life`;
const TOOL = `${HOME}/tool`;
const STORY = `${HOME}/story`;
const CONTACT = `${HOME}/contact`;
export const COMMUNITY = '/demos/community';

export const lineHref: Record<LineId, string> = {
  work: WORK,
  life: LIFE,
  tool: TOOL,
  story: STORY,
};
const lineIds: LineId[] = ['work', 'life', 'tool', 'story'];
const lineLine: Record<LineId, string> = {
  work: workLine,
  ...(Object.fromEntries(lines.map((line) => [line.id, line.line])) as Record<
    Exclude<LineId, 'work'>,
    string
  >),
};

/** 联系页；topic 预选「企业合作」或预填关注哪条产品线 */
export const contactHref = (topic?: string) =>
  topic ? `${CONTACT}?topic=${topic}` : CONTACT;

export const pad = (index: number) => String(index + 1).padStart(2, '0');

/** 标题在逗号后换行，拼起来仍是原文 */
export const rows = (text: string) => text.split(/(?<=，)/);

/** 中文逐字、英文按词拆开，标点跟着前一个字，窄屏换行时不会把 Agent 断开或让句号落单 */
export const tokens = (line: string) =>
  (line.match(/(?:[A-Za-z0-9.]+|.)[，。、：；！？]?/gu) ?? []).map((t) =>
    t === ' ' ? '\u00a0' : t,
  );

/** 在逗号、顿号、句号后断行，避免中文标题在词中间折开 */
export function Phrases({ text }: { text: string }) {
  return (
    <>
      {text.split(/(?<=[，、。：])/).map((phrase, index) => (
        <span className="dl-phrase" key={index}>
          {phrase}
        </span>
      ))}
    </>
  );
}

/** 标题按行从遮罩里升起，配合 .dl-reveal 使用 */
export function MaskLines({ lines: items }: { lines: string[] }) {
  return (
    <>
      {items.map((line, index) => (
        <span className="dl-mask" key={line}>
          <span style={{ '--d': index } as Vars}>
            <Phrases text={line} />
          </span>
        </span>
      ))}
    </>
  );
}

/** 首屏大标题：逐字升起，读屏读整句 */
export function RiseTitle({ id, text }: { id: string; text: string }) {
  let order = 0;
  return (
    <h1 id={id} aria-label={text}>
      {rows(text).map((row) => (
        <span className="dl-line" key={row} aria-hidden="true">
          {tokens(row).map((token, index) => (
            <span key={index} style={{ '--d': order++ } as Vars}>
              {token}
            </span>
          ))}
        </span>
      ))}
    </h1>
  );
}

const branches = [
  { x: -40, y: 60, dx: 540, dy: 170, leaves: 10, seed: 3 },
  { x: 40, y: -20, dx: 330, dy: 340, leaves: 8, seed: 11 },
  { x: 220, y: 120, dx: 420, dy: -40, leaves: 7, seed: 23 },
];

function random(seed: number) {
  const value = Math.sin(seed * 9301 + 49297) * 233280;
  return value - Math.floor(value);
}

/** 窗外树枝投在墙上的影子，三根枝条各自轻轻摇 */
export function LeafShadow({ className }: { className: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 640 460"
      preserveAspectRatio="xMinYMin slice"
      aria-hidden="true"
    >
      {branches.map((branch, b) => (
        <g className={`dl-branch dl-branch-${b}`} key={b}>
          <path
            d={`M${branch.x} ${branch.y} q ${branch.dx * 0.5} ${branch.dy * 0.2} ${branch.dx} ${branch.dy}`}
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
          />
          {Array.from({ length: branch.leaves }, (_, i) => {
            const t = (i + 1) / (branch.leaves + 1);
            const r = random(branch.seed + i);
            const x = branch.x + branch.dx * t;
            const y = branch.y + branch.dy * (0.4 * t * (1 - t) + t * t);
            const side = i % 2 === 0 ? 1 : -1;
            const angle =
              (Math.atan2(branch.dy, branch.dx) * 180) / Math.PI +
              side * (38 + r * 30);
            const length = 22 + r * 18;
            return (
              <ellipse
                key={i}
                cx={x + side * 6}
                cy={y + side * 10}
                rx={length}
                ry={length * 0.34}
                transform={`rotate(${angle} ${x} ${y})`}
                fill="currentColor"
              />
            );
          })}
        </g>
      ))}
    </svg>
  );
}

/** 卡片上跟着鼠标走的一小块光 */
export function trackSpotlight(event: ReactPointerEvent<HTMLElement>) {
  const target = event.currentTarget;
  const box = target.getBoundingClientRect();
  target.style.setProperty('--mx', `${event.clientX - box.left}px`);
  target.style.setProperty('--my', `${event.clientY - box.top}px`);
}

/** 「产品」下拉：四条产品线各一句话，当前页高亮 */
function ProductsMenu({ current }: { current?: LineId }) {
  const [open, setOpen] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!open) return;
    const outside = (event: PointerEvent) => {
      if (!root.current?.contains(event.target as Node)) setOpen(false);
    };
    const escape = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return;
      setOpen(false);
      root.current?.querySelector('button')?.focus();
    };
    document.addEventListener('pointerdown', outside);
    document.addEventListener('keydown', escape);
    return () => {
      document.removeEventListener('pointerdown', outside);
      document.removeEventListener('keydown', escape);
    };
  }, [open]);
  return (
    <div className="dl-menu" ref={root} data-open={open}>
      <button
        type="button"
        aria-expanded={open}
        aria-controls="dl-products-menu"
        onClick={() => setOpen((value) => !value)}
      >
        {navLabels.products}
        <ChevronDown size={14} aria-hidden="true" />
      </button>
      <div className="dl-menu-panel" id="dl-products-menu" hidden={!open}>
        {lineIds.map((id, index) => (
          <Link
            key={id}
            href={lineHref[id]}
            aria-current={current === id ? 'page' : undefined}
            onClick={() => setOpen(false)}
          >
            <span aria-hidden="true">{pad(index)}</span>
            <strong>{lineNames[id]}</strong>
            <small>{lineLine[id]}</small>
          </Link>
        ))}
      </div>
    </div>
  );
}

/** 所有 Daylight 页面共用的顶栏：产品 · 解决方案 · 社区 · 关于 · 聊一聊 */
export function SiteHeader({ current }: { current?: LineId }) {
  return (
    <header className="dl-header">
      <Link href={HOME} className="dl-logo" aria-label="Molis AI 首页">
        <img src="/images/molis-logo.png" width="44" height="44" alt="" />
        <span>Molis AI</span>
      </Link>
      <nav className="dl-pill" aria-label="主导航">
        <ProductsMenu current={current} />
        <Link href={`${HOME}#solutions`}>{navLabels.solutions}</Link>
        <Link href={COMMUNITY}>{navLabels.community}</Link>
        <Link href={`${HOME}#about`}>{navLabels.about}</Link>
        <Link href={CONTACT} className="dl-pill-cta">
          {navLabels.contact}
        </Link>
      </nav>
    </header>
  );
}

/** 黄昏页尾：上方放各页的结尾，下面是大字标、落款和栏目 */
export function Footer({
  children,
  wordmark = 'Molis AI',
}: {
  children?: ReactNode;
  wordmark?: string;
}) {
  return (
    <footer className="dl-dusk">
      <div className="dl-dusk-glow" aria-hidden="true" />
      {children}
      <div
        className="dl-wordmark dl-reveal"
        aria-hidden="true"
        style={{ '--chars': wordmark.length } as Vars}
      >
        <span>{wordmark}</span>
      </div>
      <div className="dl-dusk-meta">
        <div className="dl-dusk-lead">
          <Link href={HOME} className="dl-footer-brand">
            <img
              src="/images/molis-logo.png"
              width="28"
              height="28"
              alt=""
              loading="lazy"
            />
            Molis AI
          </Link>
          <p>{signature}</p>
        </div>
        <nav className="dl-dusk-links" aria-label="页尾导航">
          <div>
            <h2>{footer.productsLabel}</h2>
            <ul>
              {lineIds.map((id) => (
                <li key={id}>
                  <Link href={lineHref[id]}>{lineNames[id]}</Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h2>{footer.studioLabel}</h2>
            <ul>
              <li>
                <Link href={`${HOME}#solutions`}>
                  {footer.studio.solutions}
                </Link>
              </li>
              <li>
                <Link href={COMMUNITY}>{footer.studio.community}</Link>
              </li>
              <li>
                <Link href={`${HOME}#about`}>{footer.studio.about}</Link>
              </li>
              <li>
                <Link href={CONTACT}>{footer.studio.contact}</Link>
              </li>
            </ul>
          </div>
          <div>
            <h2>GitHub</h2>
            <ul>
              <li>
                <a href={footer.github} target="_blank" rel="noreferrer">
                  github.com/molis-ai
                </a>
              </li>
            </ul>
          </div>
        </nav>
      </div>
      <div className="dl-dusk-base">
        <span>{footer.copyright}</span>
        <Link href={`${CONTACT}#privacy`}>{footer.privacy}</Link>
      </div>
    </footer>
  );
}

/**
 * 页面动效：元素进入视口时加 is-in；带 data-scene 的区块写入 0–1 的滚动进度 --p
 * （exit：首屏离开；pin：吸顶段落走完；pass：整段穿过视口）；
 * 往下滚时顶栏收起，往回滚时出现；鼠标在首屏移动时，阳光和叶影跟着偏一点。
 */
export function useDaylight() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const site = ref.current;
    if (!site) return;
    const header = site.querySelector<HTMLElement>('.dl-header');
    const hero = site.querySelector<HTMLElement>('.dl-hero');
    const scenes = Array.from(
      site.querySelectorAll<HTMLElement>('[data-scene]'),
    );

    let frame = 0;
    let lastY = window.scrollY;
    const update = () => {
      frame = 0;
      const vh = window.innerHeight;
      for (const scene of scenes) {
        const box = scene.getBoundingClientRect();
        if (box.bottom < -vh * 0.25 || box.top > vh * 1.25) continue;
        const mode = scene.dataset.scene;
        const progress =
          mode === 'pin'
            ? -box.top / Math.max(1, box.height - vh)
            : mode === 'exit'
              ? -box.top / Math.max(1, box.height)
              : (vh - box.top) / (vh + box.height);
        scene.style.setProperty(
          '--p',
          Math.min(1, Math.max(0, progress)).toFixed(4),
        );
      }
      const y = window.scrollY;
      if (header) {
        header.classList.toggle('is-solid', y > vh * 0.6);
        header.classList.toggle('is-hidden', y > vh && y > lastY + 2);
        if (y < lastY - 2) header.classList.remove('is-hidden');
      }
      lastY = y;
    };
    const request = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    const revealer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          entry.target.classList.add('is-in');
          revealer.unobserve(entry.target);
        }
      },
      { rootMargin: '0px 0px -12% 0px' },
    );
    site
      .querySelectorAll('.dl-reveal')
      .forEach((node) => revealer.observe(node));

    const onPointer = (event: PointerEvent) => {
      if (event.pointerType !== 'mouse' || !hero) return;
      const x = event.clientX / window.innerWidth - 0.5;
      const y = event.clientY / window.innerHeight - 0.5;
      hero.style.setProperty('--sun-x', `${(x * 28).toFixed(1)}px`);
      hero.style.setProperty('--sun-y', `${(y * 18).toFixed(1)}px`);
    };

    site.classList.add('is-ready');
    update();
    window.addEventListener('scroll', request, { passive: true });
    window.addEventListener('resize', request);
    hero?.addEventListener('pointermove', onPointer);
    return () => {
      cancelAnimationFrame(frame);
      revealer.disconnect();
      window.removeEventListener('scroll', request);
      window.removeEventListener('resize', request);
      hero?.removeEventListener('pointermove', onPointer);
    };
  }, []);
  return ref;
}
