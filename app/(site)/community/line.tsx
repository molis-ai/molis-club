'use client';
import Link from 'next/link';
import type { ReactNode } from 'react';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import {
  ARTIST_SKILL_REPO,
  communityUi,
  showcase,
} from '../../../content/site/community';
import { contactHref } from '../../_site/routes';
import { Note, type Vars } from '../../_site/ui';
import { useFlower } from './flower';
import { FlowerArt } from './flower-art';
import { Mascot } from './mascot';

// 「大家做的」是一根晾衣绳（接着上一屏照片里那根挂着染布的绳子）：
// 访客自己在首屏调的那朵花挂在最前面——只在访客自己的浏览器里，标「只在你的屏幕上」，不经分享不会出现在别处；
// 三张签是带回来的几种方式；作者明确同意展示的真实投稿（showcase）挂在花后面；
// 没有投稿时，绳尾是几只空夹子和举着牌子的小家伙。窄屏上整根绳横着滑。

const ui = communityUi.wall;

/** 绳子：二次贝塞尔，x 用百分比，y 用像素（左端、正中最低处、右端；控制点由最低处反推） */
const ROPE = { left: 26, sag: 96, right: 18 };
const CONTROL = ROPE.sag * 2 - (ROPE.left + ROPE.right) / 2;
const ropeY = (x: number) => {
  const t = (x + 1) / 102;
  return (1 - t) ** 2 * ROPE.left + 2 * (1 - t) * t * CONTROL + t ** 2 * ROPE.right;
};

function Pin({ tilt = 0 }: { tilt?: number }) {
  return (
    <svg
      className="m-com-pin"
      viewBox="0 0 16 40"
      style={{ rotate: `${tilt}deg` }}
      aria-hidden="true"
    >
      <rect x="1.5" y="1" width="6" height="37" rx="2.4" />
      <rect x="8.5" y="1" width="6" height="37" rx="2.4" />
      <path d="M1 19 H15" />
    </svg>
  );
}

function Hang({
  x,
  drop = 0,
  tilt = 0,
  className,
  children,
}: {
  x: number;
  drop?: number;
  tilt?: number;
  className: string;
  children: ReactNode;
}) {
  return (
    <li
      className={`m-com-hang ${className}`}
      style={
        {
          left: `${x}%`,
          top: `${ropeY(x).toFixed(1)}px`,
          '--drop': `${drop}px`,
          '--tilt': `${tilt}deg`,
        } as Vars
      }
    >
      {children}
    </li>
  );
}

export function Clothesline() {
  const flower = useFlower();
  const tags = communityUi.tags;
  // 位置：访客那朵在最前，投稿接着挂，然后三张签，最后是空夹子
  const shown = showcase.slice(0, 3);
  const slots = [
    13,
    ...shown.map((_, i) => 30 + i * 14),
  ];
  const after = 30 + shown.length * 14;
  const tagX = [after + 6, after + 24, after + 42].map((x) =>
    Math.min(x, 80),
  );
  const empties = shown.length < 3 ? [86, 92.5].slice(0, 3 - shown.length) : [];
  return (
    <div className="m-com-line-scroll">
      <div className="m-com-line">
        <svg
          className="m-com-rope"
          viewBox="0 0 100 160"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <path
            d={`M-1 ${ROPE.left} Q50 ${CONTROL} 101 ${ROPE.right}`}
          />
        </svg>
        <ul className="m-com-line-items">
          <Hang x={slots[0]} tilt={-2.5} className="m-com-mine">
            <span className="m-com-mine-pins" aria-hidden="true">
              <Pin tilt={-4} />
              <Pin tilt={5} />
            </span>
            <div className="m-com-mine-card">
              <FlowerArt
                flower={flower}
                className="m-com-flower"
                label={ui.mine}
              />
            </div>
            <div className="m-com-mine-cap">
              <span>{flower.touched ? ui.mine : ui.mineDefault}</span>
              <Note>{ui.mineNote}</Note>
              {flower.touched ? (
                <Link className="m-link" href={contactHref('share-flower')}>
                  {ui.mineShare}
                  <ArrowRight size={13} aria-hidden="true" />
                </Link>
              ) : (
                <a className="m-link" href="#flower" data-dir="down">
                  {ui.mineTry}
                  <ArrowRight size={13} aria-hidden="true" />
                </a>
              )}
            </div>
          </Hang>

          {shown.map((item, i) => (
            <Hang
              key={item.href}
              x={slots[i + 1]}
              drop={18 + (i % 2) * 24}
              tilt={i % 2 ? 2 : -2}
              className="m-com-work-card"
            >
              <Pin tilt={i % 2 ? 3 : -3} />
              <span className="m-com-string" aria-hidden="true" />
              <a href={item.href} target="_blank" rel="noreferrer">
                <b>{item.title}</b>
                <span>
                  {item.by}
                  {item.method ? ` · ${item.method}` : ''}
                </span>
                {item.note ? <p>{item.note}</p> : null}
                <ArrowUpRight size={14} aria-hidden="true" />
              </a>
            </Hang>
          ))}

          {tags.map((tag, i) => (
            <Hang
              key={tag.title}
              x={tagX[i]}
              drop={[40, 16, 58][i]}
              tilt={[2.5, -3, -1.5][i]}
              className="m-com-tag"
            >
              <Pin tilt={[1, -2, 0][i]} />
              <span className="m-com-string" aria-hidden="true" />
              <div className="m-com-tag-card">
                <i className="m-com-tag-hole" aria-hidden="true" />
                <b>{tag.title}</b>
                <p>{tag.text}</p>
                {tag.topic ? (
                  <Link
                    className="m-link m-com-tag-link"
                    href={contactHref(tag.topic)}
                  >
                    {tag.link}
                    <ArrowRight size={13} aria-hidden="true" />
                  </Link>
                ) : (
                  <a
                    className="m-link m-com-tag-link"
                    href={ARTIST_SKILL_REPO}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {tag.link}
                    <ArrowUpRight size={13} aria-hidden="true" />
                  </a>
                )}
              </div>
            </Hang>
          ))}

          {empties.map((x, i) => (
            <Hang key={x} x={x} className="m-com-empty">
              <Pin tilt={i ? 4 : -3} />
              <span className="m-com-empty-ghost" aria-hidden="true" />
            </Hang>
          ))}
        </ul>
        {empties.length ? (
          <div className="m-com-line-sign">
            <Mascot pose="sign" sign={ui.sign} />
            <p>
              {ui.empty}
              <br />
              {ui.emptyNow}
            </p>
          </div>
        ) : null}
      </div>
    </div>
  );
}

/** 结尾：小家伙坐在沙滩窗的右下角，手里是访客调的那朵花 */
export function EndMascot() {
  const flower = useFlower();
  return (
    <div className="m-com-end-sit" aria-hidden="true">
      <Mascot
        pose="sit"
        hold={
          <FlowerArt
            flower={{ ...flower, count: Math.min(flower.count, 16) }}
            size={46}
          />
        }
      />
    </div>
  );
}
