'use client';
import { useEffect, useState } from 'react';
import { communityUi } from '../../../content/site/community';

// 页边竖排的三幕（借 Norm Architects 的页边竖排小字）：带着好奇来 · 带点什么走 · 再带点什么回来。
// 滚到哪一幕亮哪一句；到结尾三句全亮，正好拼成收尾那句话。点一句跳到那一幕。窄屏不显示。

const ids = ['come', 'take', 'back'];

export function Acts() {
  const [on, setOn] = useState(0);
  const [done, setDone] = useState(false);
  useEffect(() => {
    const sections = Array.from(
      document.querySelectorAll<HTMLElement>('[data-act]'),
    );
    const end = document.getElementById('end');
    const sync = () => {
      const middle = window.innerHeight * 0.45;
      let current = 0;
      for (const section of sections)
        if (section.getBoundingClientRect().top < middle)
          current = Number(section.dataset.act);
      setOn(current);
      setDone(!!end && end.getBoundingClientRect().top < middle);
    };
    sync();
    window.addEventListener('scroll', sync, { passive: true });
    window.addEventListener('resize', sync);
    return () => {
      window.removeEventListener('scroll', sync);
      window.removeEventListener('resize', sync);
    };
  }, []);
  return (
    <nav className="m-com-acts" aria-label="这一页的三幕">
      {communityUi.acts.map((act, index) => (
        <a
          key={act}
          href={`#${ids[index]}`}
          aria-current={index === on ? 'true' : undefined}
          data-lit={done || index === on || undefined}
        >
          {act}
        </a>
      ))}
    </nav>
  );
}
