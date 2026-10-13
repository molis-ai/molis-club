'use client';
import { useEffect } from 'react';

export type Mark = { id: string; index: string; label: string };

/** 右侧的竖向刻度：一根指针随阅读前进，章节落在各自的位置上。 */
export function SideScale({ marks }: { marks: Mark[] }) {
  return (
    <nav className="og-scale" aria-label="章节刻度">
      <span className="og-scale-track" aria-hidden="true" />
      <span className="og-scale-needle" aria-hidden="true" />
      <ol>
        {marks.map((mark) => (
          <li key={mark.id} data-mark={mark.id}>
            <a href={`#${mark.id}`}>
              <span>{mark.index}</span>
              <em>{mark.label}</em>
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}

const clamp = (v: number) => Math.min(1, Math.max(0, v));

/**
 * 整页的滚动驱动：进入视口的揭示、[data-progress] 的 --p（pass 整段穿过视口，sticky 高于一屏的粘性舞台）、
 * 章节刻度的指针，以及深色段落里顶栏和刻度的反色。
 * 减少动态时 --p 直接为 1，样式表再取消粘性编排。
 */
export function Motion() {
  useEffect(() => {
    const root = document.querySelector<HTMLElement>('.og');
    if (!root) return;
    root.classList.add('is-ready');
    const reduce = matchMedia('(prefers-reduced-motion: reduce)');

    const reveal = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          entry.target.classList.add('is-in');
          reveal.unobserve(entry.target);
        }
      },
      { rootMargin: '0px 0px -10% 0px', threshold: 0.01 },
    );
    root.querySelectorAll('[data-reveal]').forEach((el) => reveal.observe(el));

    const tracked = [...root.querySelectorAll<HTMLElement>('[data-progress]')];
    const sections = [...root.querySelectorAll<HTMLElement>('[data-section]')];
    const needle = root.querySelector<HTMLElement>('.og-scale-needle');
    const items = [...root.querySelectorAll<HTMLElement>('[data-mark]')];

    const measure = () => {
      const max = document.documentElement.scrollHeight - innerHeight;
      items.forEach((item, i) => {
        const section = sections[i];
        const at = section
          ? clamp(
              (section.getBoundingClientRect().top + scrollY) /
                Math.max(1, max),
            )
          : 0;
        item.style.setProperty('--at', String(at));
      });
    };

    const toned = [...root.querySelectorAll<HTMLElement>('[data-tone]')];
    const toneAt = (x: number, y: number) => {
      for (const el of toned) {
        const r = el.getBoundingClientRect();
        if (r.top > y || r.bottom <= y || r.left > x || r.right <= x) continue;
        return el.dataset.tone ?? 'light';
      }
      return 'light';
    };

    let frame = 0;
    const update = () => {
      frame = 0;
      const vh = innerHeight;
      for (const el of tracked) {
        const r = el.getBoundingClientRect();
        if (r.bottom < -vh * 0.5 || r.top > vh * 1.5) continue;
        const p = reduce.matches
          ? 1
          : el.dataset.progress === 'sticky'
            ? -r.top / Math.max(1, r.height - vh)
            : (vh - r.top) / (r.height + vh);
        el.style.setProperty('--p', clamp(p).toFixed(4));
      }

      const max = document.documentElement.scrollHeight - vh;
      const progress = clamp(scrollY / Math.max(1, max));
      needle?.style.setProperty('--at', progress.toFixed(4));
      let active = 0;
      sections.forEach((section, i) => {
        if (section.getBoundingClientRect().top <= vh * 0.45) active = i;
      });
      items.forEach((item, i) =>
        item.classList.toggle('is-active', i === active),
      );

      // 顶栏只跟随通栏的深色段落；右侧刻度看它自己所在的那一列
      root.dataset.head = toneAt(2, 34);
      root.dataset.side = toneAt(innerWidth - 30, vh / 2);
      root.classList.toggle('is-scrolled', scrollY > 24);
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    const onResize = () => {
      measure();
      schedule();
    };

    measure();
    update();
    void document.fonts?.ready.then(onResize);
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', onResize);
    reduce.addEventListener('change', schedule);
    const ro = new ResizeObserver(onResize);
    ro.observe(document.body);

    return () => {
      cancelAnimationFrame(frame);
      reveal.disconnect();
      ro.disconnect();
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', onResize);
      reduce.removeEventListener('change', schedule);
    };
  }, []);

  return null;
}
