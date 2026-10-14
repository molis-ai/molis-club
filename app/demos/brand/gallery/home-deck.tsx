'use client';
import type { PointerEvent } from 'react';
import type { FolioProductId } from '../../../../content/folio';
import { Tag, type Vars } from './kit';

// 首页的展厅导览：五间展厅是一副卡牌（牌角有点数，右下角倒过来，里面一圈细框）。滚到这里时，五张牌从中间叠着的一摞依次发开；
// 鼠标移到牌上，牌微微抬起、朝鼠标那边倾斜，表面一道光跟着走；点一下走到那间展厅。
// 每张牌的画心是那间展厅作品的缩影，悬停时缩影会动一下。World 还在筹备，牌面是虚线。

export type DeckRoom = {
  id: FolioProductId;
  number: number;
  name: string;
  line: string;
  meta: string;
  medium: string;
  future?: boolean;
};

/** 牌面上的作品缩影：都用 CSS 画，悬停时动一下 */
function Mini({ id }: { id: FolioProductId }) {
  return (
    <span className={`g-h-mini g-h-mini-${id}`} aria-hidden="true">
      <i />
      <i />
      <i />
      <i />
    </span>
  );
}

/** 牌角的点数：上面一行小字 Room，下面一个柔边斜体的数字；右下角那个倒过来，像扑克牌 */
function Index({ number, flip = false }: { number: number; flip?: boolean }) {
  return (
    <span
      className={`g-h-card-index${flip ? ' g-h-card-index-flip' : ''}`}
      lang="en"
      aria-hidden={flip || undefined}
    >
      <small>Room</small>
      <b>{number}</b>
    </span>
  );
}

/** 鼠标在牌上的位置写进 --rx、--ry（倾斜）和 --gx、--gy（表面那道光） */
function tilt(event: PointerEvent<HTMLAnchorElement>) {
  if (event.pointerType !== 'mouse') return;
  const card = event.currentTarget;
  const rect = card.getBoundingClientRect();
  const x = (event.clientX - rect.left) / rect.width;
  const y = (event.clientY - rect.top) / rect.height;
  card.style.setProperty('--ry', `${((x - 0.5) * 10).toFixed(2)}deg`);
  card.style.setProperty('--rx', `${((0.5 - y) * 8).toFixed(2)}deg`);
  card.style.setProperty('--gx', `${(x * 100).toFixed(1)}%`);
  card.style.setProperty('--gy', `${(y * 100).toFixed(1)}%`);
}

function settle(event: PointerEvent<HTMLAnchorElement>) {
  const card = event.currentTarget;
  card.style.removeProperty('--rx');
  card.style.removeProperty('--ry');
}

export function Deck({ rooms }: { rooms: DeckRoom[] }) {
  return (
    <ol
      className="g-h-deck"
      data-reveal
      style={{ '--n': rooms.length } as Vars}
    >
      {rooms.map((room, index) => (
        <li key={room.id} style={{ '--i': index } as Vars}>
          <a
            href={`#${room.id}`}
            className="g-h-card"
            data-future={room.future || undefined}
            onPointerMove={tilt}
            onPointerLeave={settle}
          >
            <span className="g-h-card-top">
              <Index number={room.number} />
              {room.future ? (
                <Tag>{room.meta}</Tag>
              ) : (
                <small>{room.meta}</small>
              )}
            </span>
            <span className="g-h-card-art">
              <Mini id={room.id} />
            </span>
            <strong lang="en">{room.name}</strong>
            <span className="g-h-card-line">{room.line}</span>
            <span className="g-h-card-foot">
              <span>{room.medium}</span>
              <Index number={room.number} flip />
            </span>
            <span className="g-h-card-sheen" aria-hidden="true" />
          </a>
        </li>
      ))}
    </ol>
  );
}
