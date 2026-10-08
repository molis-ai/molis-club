'use client';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import type { ReactNode } from 'react';
import { HeroLight, TypedWordmark, type Vars } from './shared';

// 四个产品页（Work、Life、Tool、Story）共用的骨架：首屏、区块标题、状态条、对比表、窗口框、结尾。
// 和首页同一套 Edition C 视觉，前缀 ep-，样式在 kit.css。

/** 在逗号、顿号、句号后断行，避免中文标题在词中间折开 */
export function Phrases({ text }: { text: string }) {
  return (
    <>
      {text.split(/(?<=[，、。：])/).map((phrase, index) => (
        <span
          className="ec-phrase"
          key={index}
          style={{ '--i': index } as Vars}
        >
          {phrase}
        </span>
      ))}
    </>
  );
}

export const pad = (index: number) => String(index + 1).padStart(2, '0');

export function Status({
  items,
  tone = 'paper',
}: {
  items: string[];
  tone?: 'paper' | 'glass';
}) {
  return (
    <ul className="ep-status" data-tone={tone}>
      {items.map((item, index) => (
        <li key={item}>
          {index === 0 ? <i aria-hidden="true" /> : null}
          {item}
        </li>
      ))}
    </ul>
  );
}

export function Tag({ children }: { children: string }) {
  return (
    <span className="ep-tag" data-tag={children}>
      {children}
    </span>
  );
}

export type Action = {
  label: string;
  href: string;
  external?: boolean;
  tone?: 'ink' | 'light' | 'glass';
};

export function Actions({ items }: { items: Action[] }) {
  return (
    <div className="ep-actions">
      {items.map((item) => {
        const className = `ec-button ${item.tone === 'light' ? 'ec-button-light' : item.tone === 'glass' ? 'ec-button-glass' : ''}`;
        return item.external ? (
          <a
            key={item.label}
            className={className}
            href={item.href}
            target="_blank"
            rel="noreferrer"
          >
            {item.label}
            <ArrowUpRight size={14} aria-hidden="true" />
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

/** 产品页首屏：满幅画面（照片或自定义画面）、居中标题、状态条、底部大字标 */
export function ProductHero({
  id,
  kicker,
  title,
  lead,
  status,
  actions,
  image,
  visual,
  wordmark,
  note,
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
  wordmark: string;
  note?: string;
  className?: string;
}) {
  return (
    <section
      className={`ec-hero ep-hero ${className}`}
      aria-labelledby={id}
      data-visual={visual ? '' : undefined}
    >
      {image ? (
        <div className="ec-hero-media">
          <img
            className="ec-hero-photo"
            src={image.src}
            width={image.w}
            height={image.h}
            alt=""
            fetchPriority="high"
            style={{ objectPosition: image.position }}
          />
        </div>
      ) : null}
      {image ? <HeroLight /> : null}
      {visual}
      <div className="ec-hero-copy ep-hero-copy">
        <span className="ep-hero-kicker">{kicker}</span>
        <h1 id={id}>
          <Phrases text={title} />
        </h1>
        <p>{lead}</p>
        <Status items={status} tone="glass" />
        <Actions items={actions} />
      </div>
      {note ? <span className="ep-hero-note">{note}</span> : null}
      <TypedWordmark text={wordmark} />
    </section>
  );
}

export function SectionHead({
  id,
  kicker,
  title,
  lead,
  align = 'center',
}: {
  id: string;
  kicker: string;
  title: string;
  lead?: string;
  align?: 'center' | 'start';
}) {
  return (
    <div className="ep-head ec-reveal" data-align={align}>
      <span className="ec-eyebrow">{kicker}</span>
      <h2 id={id}>
        <Phrases text={title} />
      </h2>
      {lead ? <p>{lead}</p> : null}
    </div>
  );
}

/** 三列对比：你现在用 / 它做到哪 / 这个产品 */
export function Compare({
  labels,
  rows,
}: {
  labels: [string, string, string];
  rows: [string, string, string][];
}) {
  return (
    <table className="ep-compare">
      <thead>
        <tr className="ep-compare-row ep-compare-labels">
          {labels.map((label, index) => (
            <th scope="col" key={index}>
              {label}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row, index) => (
          <tr
            className="ep-compare-row ec-reveal"
            key={row[0]}
            style={{ '--r': index } as Vars}
          >
            {row.map((cell, column) =>
              column === 0 ? (
                <th scope="row" key={column} data-label={labels[column]}>
                  {cell}
                </th>
              ) : (
                <td key={column} data-label={labels[column]}>
                  {cell}
                </td>
              ),
            )}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

/** 截图或概念稿放进一个浅色窗口框 */
export function Frame({
  src,
  w,
  h,
  label,
  priority = false,
}: {
  src: string;
  w: number;
  h: number;
  label?: string;
  priority?: boolean;
}) {
  return (
    <div className="ep-frame">
      <div className="ep-frame-bar" aria-hidden="true">
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

/** 页尾前的结尾：一句话加几条去处 */
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
    <section className="ec-invite ep-closing ec-reveal" aria-labelledby={id}>
      <h2 id={id}>
        {Array.isArray(title) ? (
          title.map((line) => (
            <span className="ec-phrase" key={line}>
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
