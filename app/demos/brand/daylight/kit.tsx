'use client';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import type { ReactNode } from 'react';
import { LeafShadow, MaskLines, RiseTitle, rows } from './shared';

// 四个产品页（Work、Life、Tool、Story）共用的骨架：首屏、区块标题、状态条、标签、按钮、窗口框、
// 晒着太阳的展台和黄昏里的结尾。和首页同一套 Daylight 视觉，样式在 kit.css。

const tagKind: Record<string, string> = {
  预览: 'preview',
  规划中: 'planned',
  示例世界: 'sample',
};

export function Tag({ children }: { children: string }) {
  return (
    <span className={`dl-tag dl-tag-${tagKind[children] ?? 'next'}`}>
      {children}
    </span>
  );
}

export function Status({
  items,
  tone = 'paper',
}: {
  items: string[];
  tone?: 'paper' | 'glass';
}) {
  return (
    <ul className="dl-status-row" data-tone={tone}>
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
  /** light：照片上的纸色；glass：照片上的描边；ink：纸面上的深色；line：纸面上的描边 */
  tone?: 'light' | 'glass' | 'ink' | 'line';
};

export function Actions({ items }: { items: Action[] }) {
  return (
    <div className="dl-actions">
      {items.map((item) => {
        const className = `dl-button dl-button-${item.tone ?? 'ink'}`;
        return item.external ? (
          <a
            key={item.label}
            className={className}
            href={item.href}
            target="_blank"
            rel="noreferrer"
          >
            {item.label}
            <ArrowUpRight size={16} aria-hidden="true" />
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

/** 截图或概念稿放进一个浅色窗口框 */
export function Window({
  src,
  w,
  h,
  label,
  priority = false,
  className = '',
}: {
  src: string;
  w: number;
  h: number;
  label?: string;
  priority?: boolean;
  className?: string;
}) {
  return (
    <div className={`dl-window ${className}`}>
      <div className="dl-window-bar" aria-hidden="true">
        <i />
        <i />
        <i />
        {label ? <span>{label}</span> : null}
      </div>
      <img
        src={src}
        width={w}
        height={h}
        alt=""
        loading={priority ? 'eager' : 'lazy'}
      />
    </div>
  );
}

/** 手机外壳里的一张概念稿 */
export function Phone({ src, w, h }: { src: string; w: number; h: number }) {
  return (
    <div className="dl-phone">
      <img src={src} width={w} height={h} alt="" loading="lazy" />
    </div>
  );
}

/** 产品页首屏：圆角画框里的清晨照片（或自定义画面）、逐字升起的标题、状态条和按钮 */
export function ProductHero({
  id,
  kicker,
  title,
  lead,
  status,
  actions,
  image,
  visual,
  className = '',
}: {
  id: string;
  kicker: string;
  title: string;
  lead: string;
  status: string[];
  actions: Action[];
  image?: { src: string; w: number; h: number; position?: string };
  visual?: ReactNode;
  className?: string;
}) {
  return (
    <section
      className={`dl-hero dl-hero-product ${className}`}
      data-scene="exit"
      data-visual={visual ? '' : undefined}
      aria-labelledby={id}
    >
      <div className="dl-hero-frame">
        <div className="dl-hero-open">
          {image ? (
            <div className="dl-hero-media">
              <img
                className="dl-hero-photo"
                src={image.src}
                width={image.w}
                height={image.h}
                alt=""
                fetchPriority="high"
                style={{ objectPosition: image.position }}
              />
            </div>
          ) : null}
          <div className="dl-hero-shade" />
          <div className="dl-hero-glow" />
          <LeafShadow className="dl-leaves dl-hero-leaves" />
          <div className="dl-hero-body">
            <div className="dl-hero-copy">
              <span className="dl-kicker">{kicker}</span>
              <RiseTitle id={id} text={title} />
              <div className="dl-hero-lower">
                <p>{lead}</p>
                <Status items={status} tone="glass" />
                <Actions items={actions} />
              </div>
            </div>
            {visual}
          </div>
        </div>
      </div>
    </section>
  );
}

export function SectionHead({
  id,
  kicker,
  title,
  lead,
  align = 'split',
  children,
}: {
  id: string;
  kicker: string;
  title: string;
  lead?: string;
  /** split：标题在左、说明在右；center：居中；stack：靠左叠放 */
  align?: 'split' | 'center' | 'stack';
  children?: ReactNode;
}) {
  return (
    <div className="dl-head dl-reveal" data-align={align}>
      <div className="dl-head-title">
        <span className="dl-eyebrow">{kicker}</span>
        <h2 id={id}>
          <MaskLines lines={rows(title)} />
        </h2>
      </div>
      {lead || children ? (
        <div className="dl-head-lead">
          {lead ? <p>{lead}</p> : null}
          {children}
        </div>
      ) : null}
    </div>
  );
}

/** 晒着太阳的展台：暖色渐变、叶影和一团光，里面的窗口随滚动放平 */
export function Stage({
  label,
  caption,
  children,
  className = '',
}: {
  label: string;
  caption: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section className={`dl-stage ${className}`} aria-label={label}>
      <figure className="dl-stage-figure" data-scene="pass">
        <div className="dl-stage-sun" aria-hidden="true" />
        <LeafShadow className="dl-leaves dl-stage-leaves" />
        <div className="dl-stage-tilt">{children}</div>
        <figcaption>{caption}</figcaption>
      </figure>
    </section>
  );
}

/** 页尾里的结尾：一句话加几个去处 */
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
    <section className="dl-closing" aria-labelledby={id}>
      <div className="dl-dusk-invite dl-reveal">
        <h2 id={id}>
          <MaskLines lines={Array.isArray(title) ? title : rows(title)} />
        </h2>
        {actions ? <Actions items={actions} /> : null}
      </div>
      {children}
    </section>
  );
}
