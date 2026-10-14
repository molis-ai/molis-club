import Link from 'next/link';
import type { CSSProperties, ReactNode } from 'react';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import media from './media.json';

// 全站公共部件：区块开头、按钮、文字链接、状态签、诚实标注、作品标签、配图的窗。
// 都是服务端组件；需要交互的部件在各自的 client 文件里。

export type Vars = CSSProperties & Record<`--${string}`, string | number>;

export const pad = (n: number) => String(n).padStart(2, '0');

/** 中文长句按逗号、句号分组，组内不折行（断行落在标点后面） */
export function Phrases({ text }: { text: string }) {
  const parts = text.match(/[^，。、；！？：]+[，。、；！？：]?/g) ?? [text];
  return (
    <>
      {parts.map((part, index) => (
        <span key={index} className="m-phrase">
          {part}
        </span>
      ))}
    </>
  );
}

/** 区块开头：1px 墨线 + 细斜体编号 + 一行小标签 + 大标题（+ 一段导语） */
export function SectionHead({
  no,
  kicker,
  title,
  lead,
  id,
  as: Tag = 'h2',
  size,
  en,
}: {
  no?: string;
  kicker: ReactNode;
  title: ReactNode;
  lead?: ReactNode;
  id?: string;
  as?: 'h1' | 'h2';
  size?: 'h2';
  /** kicker 是英文：全大写加字距 */
  en?: boolean;
}) {
  return (
    <header className="m-head" data-size={size} data-reveal>
      <p className="m-head-meta">
        {no ? (
          <span className="m-no" aria-hidden="true">
            {no}
          </span>
        ) : null}
        <span className="m-kicker" lang={en ? 'en' : undefined}>
          {kicker}
        </span>
      </p>
      <Tag className="m-head-title" id={id}>
        {title}
      </Tag>
      {lead ? <div className="m-head-lead">{lead}</div> : null}
    </header>
  );
}

/** 墨色实心胶囊：站内链接或外链 */
export function Btn({
  href,
  children,
  line = false,
  external = false,
}: {
  href: string;
  children: ReactNode;
  line?: boolean;
  external?: boolean;
}) {
  const className = `m-btn${line ? ' m-btn-line' : ''}`;
  if (external)
    return (
      <a className={className} href={href} target="_blank" rel="noreferrer">
        {children}
        <ArrowUpRight size={14} aria-hidden="true" />
      </a>
    );
  return (
    <Link className={className} href={href}>
      {children}
    </Link>
  );
}

/** 文字链接：站内带右箭头，外链带斜箭头 */
export function More({
  href,
  children,
  external = false,
}: {
  href: string;
  children: ReactNode;
  external?: boolean;
}) {
  if (external)
    return (
      <a className="m-link" href={href} target="_blank" rel="noreferrer">
        {children}
        <ArrowUpRight size={13} aria-hidden="true" />
      </a>
    );
  return (
    <Link className="m-link" href={href} data-dir="right">
      {children}
      <ArrowRight size={13} aria-hidden="true" />
    </Link>
  );
}

/** 状态签：杏橙圆点；概念阶段是空心圆点 */
export function Status({
  children,
  concept = false,
}: {
  children: ReactNode;
  concept?: boolean;
}) {
  return (
    <span className="m-status" data-concept={concept || undefined}>
      {children}
    </span>
  );
}

/** 诚实标注：虚线胶囊（示意、预览、概念设计、示例数据……） */
export function Note({ children }: { children: ReactNode }) {
  return <span className="m-note">{children}</span>;
}

type MediaKey = keyof typeof media;

/**
 * 配图当窗：有比例的窗，四周留白，文字在窗外；进入视口时从一道窄缝开到完整（open）。
 * 载入前铺这张图的平均色；统一一档轻调色在样式里。
 */
export function Window({
  name,
  alt,
  ratio = '4 / 5',
  focus,
  caption,
  captionNote,
  captionLang = 'en',
  sizes = '(max-width: 900px) 100vw, 50vw',
  eager = false,
  open = true,
  flip = false,
  className = '',
  children,
}: {
  name: MediaKey;
  alt: string;
  ratio?: string;
  focus?: string;
  caption?: ReactNode;
  captionNote?: ReactNode;
  /** 图注默认是一行英文细斜体；中文图注传 'zh' */
  captionLang?: 'en' | 'zh';
  sizes?: string;
  eager?: boolean;
  open?: boolean;
  flip?: boolean;
  className?: string;
  children?: ReactNode;
}) {
  const image = media[name];
  return (
    <figure
      className={`m-window ${className}`}
      data-open={open || undefined}
      data-flip={flip || undefined}
      style={
        {
          '--ratio': ratio,
          '--avg': image.avg,
          ...(focus ? { '--focus': focus } : null),
        } as Vars
      }
    >
      <div className="m-window-frame">
        <img
          src={image.src}
          srcSet={image.srcset.map(([src, w]) => `${src} ${w}w`).join(', ')}
          sizes={sizes}
          width={image.width}
          height={image.height}
          alt={alt}
          loading={eager ? 'eager' : 'lazy'}
          decoding="async"
          fetchPriority={eager ? 'high' : undefined}
        />
        {children}
      </div>
      {caption ? (
        <figcaption>
          <span className="m-caption" lang={captionLang}>
            {caption}
          </span>
          {captionNote ? (
            <span className="m-caption">{captionNote}</span>
          ) : null}
        </figcaption>
      ) : null}
    </figure>
  );
}

export function mediaOf(name: MediaKey) {
  return media[name];
}
