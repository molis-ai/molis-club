'use client';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import type { ReactNode } from 'react';
import type { Vars } from './shared';

// 深空版的产品页部件：首屏、区块标题、读数条、标签、观测框、窗口框、对比表、结尾。样式在 kit.css。

/** 在逗号、顿号、句号后断行，避免中文标题在词中间折开 */
export function Phrases({ text }: { text: string }) {
  return (
    <>
      {text.split(/(?<=[，、。：])/).map((phrase, index) => (
        <span className="cs-phrase" key={index}>
          {phrase}
        </span>
      ))}
    </>
  );
}

export const pad = (index: number) => String(index + 1).padStart(2, '0');

/** 仪表读数一样的状态条，第一项带一颗呼吸的信号灯 */
export function Status({ items }: { items: string[] }) {
  return (
    <ul className="cs-status">
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
    <span className="cs-tag" data-tag={children}>
      {children}
    </span>
  );
}

export type Action = {
  label: string;
  href: string;
  external?: boolean;
  tone?: 'primary' | 'glass';
};

export function Actions({ items }: { items: Action[] }) {
  return (
    <div className="cs-actions">
      {items.map((item) => {
        const className = `cs-button${item.tone === 'primary' ? ' cs-button-primary' : ''}`;
        const external = item.external || /^https?:/.test(item.href);
        return external ? (
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
        ) : item.href.startsWith('#') ? (
          <a key={item.label} className={className} href={item.href}>
            {item.label}
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

/** 观测框：四角准星加一行等宽字图注 */
export function Scope({
  children,
  caption,
  className = '',
}: {
  children: ReactNode;
  caption?: string;
  className?: string;
}) {
  return (
    <figure className={`cs-scope ${className}`}>
      <span className="cs-scope-corners" aria-hidden="true">
        <i />
        <i />
        <i />
        <i />
      </span>
      {children}
      {caption ? <figcaption>{caption}</figcaption> : null}
    </figure>
  );
}

/** 截图或概念稿放进一个深色窗口框 */
export function Shot({
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
    <div className="cs-shot">
      <div className="cs-shot-bar" aria-hidden="true">
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

/** 手机概念稿 */
export function Phone({ src, w, h }: { src: string; w: number; h: number }) {
  return (
    <div className="cs-phone">
      <img src={src} width={w} height={h} alt="" loading="lazy" />
    </div>
  );
}

/** 静态星空：两层错开的星点，慢慢漂 */
export function Stars() {
  return (
    <span className="cs-stars" aria-hidden="true">
      <i />
      <i />
    </span>
  );
}

/** 首屏四角的取景框 */
export function Hud() {
  return (
    <div className="cs-hud" aria-hidden="true">
      <i />
      <i />
      <i />
      <i />
    </div>
  );
}

/** 产品页首屏：左边标题、读数和按钮，右边（或下方）是这条产品线的星体 */
export function ProductHero({
  id,
  kicker,
  title,
  lead,
  status,
  actions,
  visual,
  className = '',
  stars = true,
}: {
  id: string;
  kicker: string;
  title: string;
  lead: string;
  status: string[];
  actions: Action[];
  visual?: ReactNode;
  className?: string;
  stars?: boolean;
}) {
  return (
    <section className={`cs-phero ${className}`} aria-labelledby={id}>
      {stars ? <Stars /> : null}
      <Hud />
      <div className="cs-phero-copy">
        <span className="cs-eyebrow cs-phero-kicker">{kicker}</span>
        <h1 id={id}>
          <Phrases text={title} />
        </h1>
        <p>{lead}</p>
        <Status items={status} />
        <Actions items={actions} />
      </div>
      {visual}
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
    <div className="cs-head cs-reveal" data-align={align}>
      <span className="cs-eyebrow">{kicker}</span>
      <h2 id={id}>
        <Phrases text={title} />
      </h2>
      {lead ? <p>{lead}</p> : null}
    </div>
  );
}

/** 编号的星点卡片：01、02、03… */
export function Cards({
  items,
  cols,
}: {
  items: { title: string; text?: string; quote?: string }[];
  cols?: number;
}) {
  return (
    <ol
      className="cs-cards"
      style={cols ? ({ '--cols': cols } as Vars) : undefined}
    >
      {items.map((item, index) => (
        <li
          key={item.title}
          className="cs-card cs-reveal"
          style={{ '--r': index % (cols ?? 3) } as Vars}
        >
          <span className="cs-index">{pad(index)}</span>
          {item.quote ? <blockquote>{item.quote}</blockquote> : null}
          <h3>{item.title}</h3>
          {item.text ? <p>{item.text}</p> : null}
        </li>
      ))}
    </ol>
  );
}

/** 一列编号的短句：承诺、边界、决定权 */
export function Ledger({
  items,
}: {
  items: { title: string; text?: string }[];
}) {
  return (
    <ol className="cs-ledger">
      {items.map((item, index) => (
        <li
          key={item.title}
          className="cs-reveal"
          style={{ '--r': index } as Vars}
        >
          <span className="cs-index">{pad(index)}</span>
          <strong>{item.title}</strong>
          {item.text ? <p>{item.text}</p> : null}
        </li>
      ))}
    </ol>
  );
}

/** 三列对比：方面 / 以前 / 现在 */
export function Compare({
  labels,
  rows,
}: {
  labels: [string, string, string];
  rows: [string, string, string][];
}) {
  return (
    <table className="cs-compare">
      <thead>
        <tr className="cs-compare-row cs-compare-labels">
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
            className="cs-compare-row cs-reveal"
            key={row[0]}
            style={{ '--r': index } as Vars}
          >
            {row.map((cell, column) =>
              column === 0 ? (
                <th scope="row" key={column}>
                  <span className="cs-index">{pad(index)}</span>
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

/** 页尾前的结尾：一句发光的大字，加几条去处 */
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
    <section className="cs-closing cs-reveal" aria-labelledby={id}>
      <h2 id={id}>
        {Array.isArray(title) ? (
          title.map((line) => (
            <span className="cs-phrase" key={line}>
              {line}
            </span>
          ))
        ) : (
          <Phrases text={title} />
        )}
      </h2>
      {actions ? <Actions items={actions} /> : null}
      {children}
    </section>
  );
}
