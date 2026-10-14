'use client';
import { useEffect, useRef } from 'react';

// 顶栏下面一条细细的阅读进度线：正文开头贴到顶栏时是 0，正文末尾露到视口底边时是 1。
// 直接跟着滚动走，不加缓动（减少动态时也一样，它本来就不会自己动）；
// 顺手把左边目录里「正在读的这一节」标上 aria-current。没有 JS 时这条线不出现。

export function ReadingProgress({
  target,
  toc,
}: {
  /** 正文元素的 id */
  target: string;
  /** 目录元素的 id */
  toc?: string;
}) {
  const bar = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const article = document.getElementById(target);
    const line = bar.current;
    if (!article || !line) return;
    const headings = Array.from(
      article.querySelectorAll<HTMLElement>('h2[id]'),
    );
    const links = toc
      ? Array.from(
          document.querySelectorAll<HTMLAnchorElement>(`#${toc} a[href^="#"]`),
        )
      : [];
    let frame = 0;
    let current = '';

    const read = () => {
      frame = 0;
      const header =
        Number.parseFloat(
          getComputedStyle(article).getPropertyValue('--header'),
        ) || 64;
      const view = window.innerHeight;
      const rect = article.getBoundingClientRect();
      const span = rect.height - (view - header);
      const p =
        span > 0
          ? Math.min(1, Math.max(0, (header - rect.top) / span))
          : rect.bottom <= view
            ? 1
            : 0;
      line.style.transform = `scaleX(${p.toFixed(4)})`;

      if (!links.length) return;
      // 正在读的一节：最后一个已经越过视口上方三分之一的小标题
      const edge = header + (view - header) / 3;
      let id = '';
      for (const heading of headings)
        if (heading.getBoundingClientRect().top <= edge) id = heading.id;
      if (id === current) return;
      current = id;
      for (const link of links) {
        if (link.getAttribute('href') === `#${id}`)
          link.setAttribute('aria-current', 'location');
        else link.removeAttribute('aria-current');
      }
    };
    const request = () => {
      if (!frame) frame = requestAnimationFrame(read);
    };
    read();
    window.addEventListener('scroll', request, { passive: true });
    window.addEventListener('resize', request);
    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener('scroll', request);
      window.removeEventListener('resize', request);
    };
  }, [target, toc]);

  return (
    <div className="m-essay-progress" aria-hidden="true">
      <span ref={bar} />
    </div>
  );
}
