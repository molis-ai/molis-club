'use client';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import type { ReactNode } from 'react';
import type { Vars } from './shared';

// 夜曲产品页的零件：首屏、区块标题、状态条、标签、按钮、发光屏幕、结尾。样式在 kit.css。

/** 在逗号、顿号、句号后断行，避免中文标题在词中间折开 */
export function Phrases({ text }: { text: string }) {
  return (
    <>
      {text.split(/(?<=[，、。：；])/).map((phrase, index) => (
        <span className="nc-phrase" key={index}>
          {phrase}
        </span>
      ))}
    </>
  );
}

/** 标题拆成两行：第一个逗号之前一行，之后一行（后一行染上琥珀光） */
export function splitTitle(text: string) {
  const at = text.indexOf('，') + 1;
  return at > 0 ? [text.slice(0, at), text.slice(at)] : [text];
}

export const pad = (index: number) => String(index + 1).padStart(2, '0');

export function Status({ items }: { items: string[] }) {
  return (
    <ul className="nc-status">
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
    <span className="nc-tag" data-tag={children}>
      {children}
    </span>
  );
}

export type Action = {
  label: string;
  href: string;
  external?: boolean;
  tone?: 'primary' | 'ghost';
};

export function Actions({ items }: { items: Action[] }) {
  return (
    <div className="nc-actions">
      {items.map((item) => {
        const className = `nc-btn nc-btn-${item.tone ?? 'ghost'}`;
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

/**
 * 产品页首屏：暗场里一束光。split 时文字在左、画面在右；
 * center 时文字居中、画面在下方。
 */
export function ProductHero({
  id,
  kicker,
  title,
  lead,
  status,
  actions,
  visual,
  layout = 'split',
  className = '',
}: {
  id: string;
  kicker: string;
  title: string;
  lead: string;
  status: string[];
  actions: Action[];
  visual?: ReactNode;
  layout?: 'split' | 'center';
  className?: string;
}) {
  return (
    <section
      className={`nc-phero ${className}`}
      data-layout={layout}
      data-scene="exit"
      aria-labelledby={id}
    >
      <div className="nc-beam" aria-hidden="true" />
      <div className="nc-phero-copy">
        <span className="nc-kicker nc-rise">{kicker}</span>
        <h1 id={id}>
          {splitTitle(title).map((line, index) => (
            <span
              className="nc-rise"
              key={line}
              style={{ '--d': index + 1 } as Vars}
            >
              <Phrases text={line} />
            </span>
          ))}
        </h1>
        <p className="nc-rise" style={{ '--d': 3 } as Vars}>
          {lead}
        </p>
        <div className="nc-rise" style={{ '--d': 4 } as Vars}>
          <Status items={status} />
          <Actions items={actions} />
        </div>
      </div>
      {visual ? (
        <div className="nc-phero-visual nc-rise" style={{ '--d': 3 } as Vars}>
          {visual}
        </div>
      ) : null}
    </section>
  );
}

export function SectionHead({
  id,
  kicker,
  title,
  lead,
  align = 'center',
  children,
}: {
  id: string;
  kicker: string;
  title: string;
  lead?: string;
  align?: 'center' | 'start';
  children?: ReactNode;
}) {
  return (
    <div className="nc-head" data-align={align} data-reveal>
      <span className="nc-kicker">{kicker}</span>
      <h2 id={id}>
        <Phrases text={title} />
      </h2>
      {lead ? <p>{lead}</p> : null}
      {children}
    </div>
  );
}

/** 截图或概念稿放进一块微微发光的屏幕 */
export function Frame({
  src,
  w,
  h,
  label,
}: {
  src: string;
  w: number;
  h: number;
  label?: string;
}) {
  return (
    <div className="nc-frame">
      <div className="nc-frame-bar" aria-hidden="true">
        <i />
        <i />
        <i />
        {label ? <span>{label}</span> : null}
      </div>
      <img src={src} width={w} height={h} alt="" loading="lazy" />
    </div>
  );
}

/** 手机竖屏，叠在屏幕一角 */
export function Phone({ src, w, h }: { src: string; w: number; h: number }) {
  return (
    <div className="nc-phone">
      <img src={src} width={w} height={h} alt="" loading="lazy" />
    </div>
  );
}

/** 暗房里亮起的一块屏：随滚动从倾斜立起，脚下一片琥珀色的光 */
export function Screen({
  children,
  note,
  className = '',
}: {
  children: ReactNode;
  note: string;
  className?: string;
}) {
  return (
    <figure className={`nc-screen ${className}`} data-scene="enter">
      <div className="nc-screen-stage">{children}</div>
      <span className="nc-screen-floor" aria-hidden="true" />
      <figcaption>{note}</figcaption>
    </figure>
  );
}

/** 页尾前的结尾：一句话，加几条去处 */
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
    <section className="nc-closing" aria-labelledby={id}>
      <div className="nc-closing-head" data-reveal>
        <h2 id={id}>
          {Array.isArray(title) ? (
            title.map((line) => (
              <span className="nc-line" key={line}>
                {line}
              </span>
            ))
          ) : (
            <Phrases text={title} />
          )}
        </h2>
        {actions ? <Actions items={actions} /> : null}
      </div>
      {children}
    </section>
  );
}
