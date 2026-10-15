import Link from 'next/link';
import type { ReactNode } from 'react';
import { ArrowRight } from 'lucide-react';
import {
  exUi,
  pieces,
  rooms,
  type PieceKey,
  type RoomId,
} from '../../../content/site/exhibit';
import { ALONG, ABOUT, ESSAYS, TEAM } from '../routes';
import { mediaOf, pad, type Vars } from '../ui';
import './exhibit.css';

// 「关于」四间展厅共用的部件（content/site/exhibit.ts）：展厅名牌与平面图、带展签的展品、去下一个展厅。
// 都是服务端组件；展品沿用全站「窗」的开窗动效（.m-window[data-open]），载入前铺平均色。

export const roomHref: Record<RoomId, string> = {
  people: TEAM,
  light: ABOUT,
  read: ESSAYS,
  road: ALONG,
};

/** 封面：下一个展厅的入口上露出那间的开场展品 */
const cover: Record<RoomId, PieceKey & Parameters<typeof mediaOf>[0]> = {
  people: 'team-table',
  light: 'about-window',
  read: 'ex-library-window',
  road: 'ex-dawn-field',
};

export const roomOf = (id: RoomId) => rooms.find((room) => room.id === id)!;

/** 展厅平面图：四间屋子连成一排，门洞相通；当前这间铺一层杏色，点一下去别的展厅 */
export function Plan({ current }: { current: RoomId }) {
  return (
    <nav className="ex-plan" aria-label={exUi.plan}>
      <ol>
        {rooms.map((room) => {
          const here = room.id === current;
          return (
            <li key={room.id} data-here={here || undefined}>
              <Link
                href={roomHref[room.id]}
                aria-current={here ? 'page' : undefined}
              >
                <span className="ex-plan-no num">{room.no}</span>
                <span className="ex-plan-name">{room.name}</span>
                {here ? (
                  <span className="ex-plan-here">
                    <span className="ex-dot" aria-hidden="true" />
                    {exUi.here}
                  </span>
                ) : null}
              </Link>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

/** 展厅名牌：第几间、主题，右边是平面图 */
export function RoomMeta({ room }: { room: RoomId }) {
  const info = roomOf(room);
  return (
    <div className="ex-meta m-rise">
      <p className="ex-meta-line">
        <span>{exUi.show}</span>
        <span>
          {exUi.room} <span className="num">{info.no}</span>
          <span className="ex-meta-of"> / {pad(rooms.length)}</span>
        </span>
        <span>
          {exUi.theme} · {info.theme}{' '}
          <span className="ex-meta-en" lang="en">
            {info.en}
          </span>
        </span>
      </p>
      <Plan current={room} />
    </div>
  );
}

/** 开场的几项展览信息：一行一个数，像展签下面的小表 */
export function Facts({
  items,
}: {
  items: Array<{ label: string; value: number | string }>;
}) {
  return (
    <dl className="ex-facts">
      {items.map((item) => (
        <div key={item.label}>
          <dt>{item.label}</dt>
          <dd className="num">{item.value}</dd>
        </div>
      ))}
    </dl>
  );
}

/** 展签：编号、标题、媒介 · 摄影者（AI 生成影像写 Molis 图库），下面可以跟一句「诉说」（底稿原句） */
export function Label({
  piece,
  no,
  note,
  children,
}: {
  piece: PieceKey;
  no: string;
  /** 标题后面的小注（例如「概念示意」） */
  note?: ReactNode;
  children?: ReactNode;
}) {
  const info: { title: string; medium: keyof typeof exUi.medium; by?: string } =
    pieces[piece];
  // 照片只写摄影者的名字（负责人 2026-10-15 定：展签上不写 Unsplash，来源写在全站页尾）
  const source =
    info.medium === 'photo'
      ? info.by
      : info.medium === 'ai'
        ? exUi.source.ai
        : null;
  return (
    <>
      <span className="ex-label-head">
        <span className="ex-no num">{no}</span>
        <span className="ex-title">{info.title}</span>
        {note}
      </span>
      <span className="ex-medium">
        {exUi.medium[info.medium]}
        {source ? ` · ${source}` : null}
      </span>
      {children ? <span className="ex-tell">{children}</span> : null}
    </>
  );
}

/**
 * 一件展品：有比例的框（视口矮的时候按 maxH 截住高度，图按 focus 裁），框下是展签。
 * maxH 用 svh 写，保证一屏放得下。
 */
export function Work({
  name,
  no,
  ratio = '3 / 2',
  focus,
  maxH,
  sizes = '(max-width: 900px) 100vw, 50vw',
  eager = false,
  fill = false,
  note,
  className = '',
  style,
  children,
}: {
  name: PieceKey & Parameters<typeof mediaOf>[0];
  no: string;
  ratio?: string;
  focus?: string;
  maxH?: string;
  sizes?: string;
  eager?: boolean;
  /** 框铺满整栏宽，视口矮时裁掉上下（默认是保持比例、按高度收窄） */
  fill?: boolean;
  note?: ReactNode;
  className?: string;
  style?: Vars;
  children?: ReactNode;
}) {
  const image = mediaOf(name);
  const info: { alt?: string } = pieces[name];
  return (
    <figure
      className={`ex-work m-window ${className}`}
      data-open
      data-fill={fill || undefined}
      style={
        {
          '--ratio': ratio,
          '--avg': image.avg,
          ...(focus ? { '--focus': focus } : null),
          ...(maxH ? { '--max-h': maxH } : null),
          ...style,
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
          alt={info.alt ?? ''}
          loading={eager ? 'eager' : 'lazy'}
          decoding="async"
          fetchPriority={eager ? 'high' : undefined}
        />
      </div>
      <figcaption className="ex-label">
        <Label piece={name} no={no} note={note}>
          {children}
        </Label>
      </figcaption>
    </figure>
  );
}

/** 展厅尽头：去下一个展厅（最后一间回到第一间）。来源与「画面里的人不是团队成员」写在全站页尾 */
export function NextRoom({ from }: { from: RoomId }) {
  const order = rooms.map((room) => room.id);
  const next = order[(order.indexOf(from) + 1) % order.length];
  const info = roomOf(next);
  const image = mediaOf(cover[next]);
  const last = next === order[0];
  return (
    <nav className="ex-next m-wrap" aria-label={exUi.next}>
      <Link className="ex-next-link" href={roomHref[next]} data-reveal>
        <span className="ex-next-thumb" style={{ '--avg': image.avg } as Vars}>
          <img
            src={image.src}
            srcSet={image.srcset.map(([src, w]) => `${src} ${w}w`).join(', ')}
            sizes="(max-width: 760px) 96px, 220px"
            width={image.width}
            height={image.height}
            alt=""
            loading="lazy"
            decoding="async"
          />
        </span>
        <span className="ex-next-text">
          <span className="ex-next-kicker">
            {last ? exUi.first : exUi.next}
          </span>
          <span className="ex-next-name">
            <span className="num">{info.no}</span>
            {info.name}
          </span>
          <span className="ex-next-theme">
            {exUi.theme} · {info.theme} <span lang="en">{info.en}</span>
          </span>
        </span>
        <ArrowRight className="ex-next-arrow" size={20} aria-hidden="true" />
      </Link>
    </nav>
  );
}
