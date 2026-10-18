'use client';
import { useDone } from './memory';

// 墙上下午 4:30 的「接续」里，最上面是访客自己刚才在这一页做过的事（只在内存里）。
export function Mine({ title, from }: { title: string; from: string }) {
  const done = useDone();
  if (!done.length) return null;
  return (
    <ul className="tw-mine">
      {done.map((item) => (
        <li key={item.text}>
          <span className="tw-kind">{title}</span>
          <b>
            {item.action}「{item.text}」
          </b>
          <small>{from}</small>
        </li>
      ))}
    </ul>
  );
}
