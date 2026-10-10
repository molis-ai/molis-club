'use client';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import type { ReactNode } from 'react';
import { lineNames, type LineId } from '../../../../content/studio';
import { folioStudio } from '../../../../content/folio';
import { Cuts } from './art';
import { lineHref, lineIds, lineLine, type Vars } from './shared';

// 首页和四个产品页共用的部件：首屏、区块标题、状态签、标签、按钮、贴胶带的截图和结尾。
// 都是 Folio 的剪纸杂志样子，样式在 kit.css。

/** 在逗号、顿号、句号后断行，避免中文标题在词中间折开 */
export function Phrases({ text }: { text: string }) {
  return (
    <>
      {text.split(/(?<=[，、。：])/).map((phrase, index) => (
        <span className="fo-phrase" key={index}>
          {phrase}
        </span>
      ))}
    </>
  );
}

export const pad = (index: number) => String(index + 1).padStart(2, '0');

/** 规划中、预览、示例世界这些标签 */
export function Tag({ children }: { children: string }) {
  return (
    <span className="fo-tag" data-tag={children}>
      {children}
    </span>
  );
}

/** 状态签：一排略微歪着贴上去的小纸签，第一枚带红点 */
export function Status({ items }: { items: string[] }) {
  return (
    <ul className="fo-status">
      {items.map((item, index) => (
        <li key={item}>
          {index === 0 ? <i aria-hidden="true" /> : null}
          {item}
        </li>
      ))}
    </ul>
  );
}

export type Action = {
  label: string;
  href: string;
  external?: boolean;
  /** ink：墨色实心；ghost：描边；light：白纸，放在深色或彩色底上 */
  tone?: 'ink' | 'ghost' | 'light';
};

export function Actions({ items }: { items: Action[] }) {
  return (
    <div className="fo-actions">
      {items.map((item) => {
        const className = `fo-btn fo-btn-${item.tone ?? 'ink'}`;
        return item.external ? (
          <a
            key={item.label}
            className={className}
            href={item.href}
            target="_blank"
            rel="noreferrer"
          >
            {item.label}
            <ArrowUpRight size={17} aria-hidden="true" />
          </a>
        ) : (
          <Link key={item.label} className={className} href={item.href}>
            {item.label}
          </Link>
        );
      })}
    </div>
  );
}

/** 区块标题：红色小眉题、宋体大标题，可带一段导语；split 时导语放右边 */
export function SectionHead({
  id,
  kicker,
  title,
  lead,
  layout = 'stack',
  children,
}: {
  id: string;
  kicker: string;
  title: string;
  lead?: string;
  layout?: 'stack' | 'split';
  children?: ReactNode;
}) {
  return (
    <header className="fo-head" data-layout={layout} data-reveal>
      <div>
        <span className="fo-kicker">{kicker}</span>
        <h2 id={id}>
          <Phrases text={title} />
        </h2>
      </div>
      {lead || children ? (
        <div className="fo-head-side">
          {lead ? <p>{lead}</p> : null}
          {children}
        </div>
      ) : null}
    </header>
  );
}

/** 截图或概念稿：白边像一张冲印的照片，两角贴着胶带 */
export function Frame({
  src,
  w,
  h,
  label,
  priority = false,
  tape = true,
}: {
  src: string;
  w: number;
  h: number;
  label?: string;
  priority?: boolean;
  tape?: boolean;
}) {
  return (
    <div className="fo-frame">
      {tape ? (
        <>
          <span className="fo-tape fo-tape-a" aria-hidden="true" />
          <span className="fo-tape fo-tape-b" aria-hidden="true" />
        </>
      ) : null}
      {label ? (
        <div className="fo-frame-bar" aria-hidden="true">
          <i />
          <i />
          <i />
          <span>{label}</span>
        </div>
      ) : null}
      <img
        src={src}
        width={w}
        height={h}
        alt=""
        loading={priority ? undefined : 'lazy'}
        fetchPriority={priority ? 'high' : undefined}
      />
    </div>
  );
}

/** 拼贴：剪纸垫底，截图压在上面，说明贴在角上；随滚动微微转正 */
export function Collage({
  children,
  note,
  label,
  className = '',
}: {
  children: ReactNode;
  note: string;
  label?: string;
  className?: string;
}) {
  return (
    <figure
      className={`fo-collage ${className}`}
      data-scene="enter"
      aria-label={label}
    >
      <Cuts />
      <div className="fo-collage-body">{children}</div>
      <figcaption>{note}</figcaption>
    </figure>
  );
}

/** 产品页首屏：背后一行白色刊头大字，左边标题和行动，右边剪纸或界面动画 */
export function ProductHero({
  id,
  kicker,
  title,
  lead,
  status,
  actions,
  masthead,
  art,
  extra,
  className = '',
}: {
  id: string;
  kicker: string;
  title: string;
  lead: string;
  /** 导语下面的一行补充，例如接入名单 */
  extra?: ReactNode;
  status: string[];
  actions: Action[];
  masthead: string;
  art: ReactNode;
  className?: string;
}) {
  return (
    <section
      className={`fo-hero ${className}`}
      data-scene="leave"
      data-parallax
      aria-labelledby={id}
    >
      <div className="fo-hero-mast" aria-hidden="true" lang="en">
        {Array.from(masthead).map((letter, index) => (
          <span key={index} style={{ '--i': index } as Vars}>
            {letter}
          </span>
        ))}
      </div>
      <div className="fo-hero-copy">
        <span className="fo-kicker">{kicker}</span>
        <h1 id={id}>
          <Phrases text={title} />
        </h1>
        <p>{lead}</p>
        {extra}
        <Status items={status} />
        <Actions items={actions} />
      </div>
      <div className="fo-hero-art">{art}</div>
    </section>
  );
}

/** 封底上方的结尾：一句大字，加几条去处 */
export function Closing({
  id,
  title,
  actions,
  children,
}: {
  id: string;
  title: string | string[];
  actions?: Action[];
  children?: ReactNode;
}) {
  return (
    <section className="fo-closing" aria-labelledby={id}>
      <h2 id={id} data-reveal>
        {Array.isArray(title) ? (
          title.map((line) => (
            <span className="fo-phrase" key={line}>
              {line}
            </span>
          ))
        ) : (
          <Phrases text={title} />
        )}
      </h2>
      {children}
      {actions ? <Actions items={actions} /> : null}
    </section>
  );
}

/** 产品页封底：按首页的顺序 Work → Tool → Life → Story，接着看下一件，最后一件回到第一件 */
export function NextProduct({ current }: { current: LineId }) {
  const next = lineIds[(lineIds.indexOf(current) + 1) % lineIds.length];
  return (
    <Link href={lineHref[next]} className="fo-next">
      <small>{folioStudio.nextProduct}</small>
      <strong>{lineNames[next]}</strong>
      <span>{lineLine[next]}</span>
      <i aria-hidden="true">
        <ArrowUpRight size={26} />
      </i>
    </Link>
  );
}
