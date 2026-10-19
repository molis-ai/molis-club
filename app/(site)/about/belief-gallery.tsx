'use client';
import { useEffect, useRef, useState, type ReactNode } from 'react';
import { Phrases } from '../../_site/ui';

// 六条信念的画廊（一页式「关于」样张，C1 / C2）：在一个位置看完每一幅，图随滚动更换，文字跟着变。
// 桌面：左边一扇窗钉住，右边六条原句顺着原生滚动走；哪一条走到视口中间，窗里就换成那一条的图。
// 窄屏、没有 JS、打印：每条上方挂自己那张图，一条接一条往下读（窗不出现）。
// 减少动态：换图没有淡入淡出。不劫持滚动，只读位置。

export function BeliefGallery({
  items,
}: {
  items: Array<{
    title: string;
    text: string;
    /** 跟着这一条走的图（窄屏、没有 JS 时出现） */
    figure: ReactNode;
    /** 钉住的窗里的同一张图 */
    still: ReactNode;
  }>;
}) {
  const [active, setActive] = useState(0);
  const list = useRef<HTMLOListElement>(null);

  useEffect(() => {
    const root = list.current;
    if (!root) return;
    const rows = Array.from(root.children) as HTMLElement[];
    // 视口正中一条窄带：哪一条压在带上，就是哪一条
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          setActive(rows.indexOf(entry.target as HTMLElement));
        }
      },
      { rootMargin: '-48% 0px -48% 0px' },
    );
    rows.forEach((row) => observer.observe(row));
    return () => observer.disconnect();
  }, []);

  return (
    <div className="ao-bg">
      <div className="ao-bg-stage" aria-hidden="true">
        {items.map((item, index) => (
          <div
            key={item.title}
            className="ao-bg-still"
            data-on={index === active || undefined}
          >
            {item.still}
          </div>
        ))}
      </div>
      <ol className="ao-bg-list" ref={list}>
        {items.map((item, index) => (
          <li
            key={item.title}
            className="ao-bg-item"
            data-on={index === active || undefined}
          >
            <div className="ao-bg-figure">{item.figure}</div>
            <div className="ao-bg-words" data-reveal>
              <h3 className="ao-bg-title">
                <Phrases text={item.title} />
              </h3>
              <p className="ao-bg-text">{item.text}</p>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}
