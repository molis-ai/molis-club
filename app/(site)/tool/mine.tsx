'use client';
import { NotebookPen } from 'lucide-react';
import { useDone } from './memory';
import { Ico } from './parts';

// 三层里「离开以后」的接续面板：最上面一行是访客自己刚才在这一页做过的事（只在内存里）。
export function Mine({ title, from }: { title: string; from: string }) {
  const [item] = useDone();
  if (!item) return null;
  return (
    <li className="tl-mine">
      <Ico icon={NotebookPen} tone="rose" />
      <b>
        {item.action}「{item.text}」
      </b>
      <small>
        {title} · {from}
      </small>
    </li>
  );
}
