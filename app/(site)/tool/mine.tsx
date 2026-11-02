'use client';
import { useDone } from './memory';

// 屏幕里的「接续」面板：最上面一行是访客自己刚才在这一页做过的事（只在内存里）。
export function Mine({ title, from }: { title: string; from: string }) {
  const [item] = useDone();
  if (!item) return null;
  return (
    <li className="tl-later-row" data-mine="">
      <b>
        {item.action}「{item.text}」
      </b>
      <small>
        {title} · {from}
      </small>
    </li>
  );
}
