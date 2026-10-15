'use client';
import Link from 'next/link';
import { useEffect, useLayoutEffect, useState, type ReactNode } from 'react';

// 第十轮「play」的外壳：自己的一条顶栏（全站顶栏在这两页藏起来）和页边的竖排小字。
// 顶栏读压在它下面的是画面还是纸（[data-tone]）；「一天」拨到夜里时那一屏会把 data-tone 改成 film，
// 并发出 pl-tone 事件，顶栏和页边小字跟着换色。右上角的「中 / EN」只做样子：切换机制由另一个 session 做。

export const TONE_EVENT = 'pl-tone';

function useTone(y: number) {
  const [tone, setTone] = useState<'film' | 'paper'>('paper');
  useLayoutEffect(() => {
    let frame = 0;
    const read = () => {
      frame = 0;
      const under = document
        .elementsFromPoint(window.innerWidth / 2, y)
        .map((node) => node.closest('[data-tone]'))
        .find(Boolean);
      setTone(under?.getAttribute('data-tone') === 'film' ? 'film' : 'paper');
    };
    const request = () => {
      if (!frame) frame = requestAnimationFrame(read);
    };
    read();
    const again = window.setTimeout(request, 160);
    window.addEventListener('scroll', request, { passive: true });
    window.addEventListener('resize', request);
    window.addEventListener(TONE_EVENT, request);
    return () => {
      window.clearTimeout(again);
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener('scroll', request);
      window.removeEventListener('resize', request);
      window.removeEventListener(TONE_EVENT, request);
    };
  }, [y]);
  return tone;
}

export function PlayHeader({ current }: { current: 'home' | 'work' }) {
  const tone = useTone(32);
  const [lang, setLang] = useState<'zh' | 'en'>('zh');
  return (
    <header className="pl-head" data-over={tone}>
      <Link href="/r10/play" className="pl-logo" aria-label="Molis AI 首页（第十轮 play 稿）">
        <img
          src="/site/molis-logo-64.png"
          srcSet="/site/molis-logo-64.png 2x, /site/molis-logo-96.png 3x"
          width="26"
          height="26"
          alt=""
        />
        <span lang="en">Molis AI</span>
      </Link>
      <nav className="pl-nav" aria-label="主导航（稿）">
        <Link
          href="/r10/play/work"
          aria-current={current === 'work' ? 'page' : undefined}
          lang="en"
        >
          Work
        </Link>
        <Link href="/r10/play#day">产品</Link>
        <Link href="/enterprise">企业合作</Link>
        <Link href="/community">社区</Link>
        <Link href="/about">关于</Link>
      </nav>
      {/* 中 / EN：只留位置和样子 */}
      <fieldset className="pl-lang">
        <legend className="sr-only">语言（样子，尚未接入切换）</legend>
        <button
          type="button"
          aria-pressed={lang === 'zh'}
          onClick={() => setLang('zh')}
        >
          中
        </button>
        <span aria-hidden="true">/</span>
        <button
          type="button"
          lang="en"
          aria-pressed={lang === 'en'}
          onClick={() => setLang('en')}
        >
          EN
        </button>
      </fieldset>
    </header>
  );
}

/**
 * 页边的竖排小字，像书的书口：左边一直是 MOLIS AI，右边是读到的这一段的名字（读 [data-edge]）。
 * 只在宽屏出现。
 */
export function Edge() {
  const tone = useTone(Math.round(globalThis.innerHeight / 2 || 400));
  const [word, setWord] = useState('');
  useEffect(() => {
    const sections = Array.from(
      document.querySelectorAll<HTMLElement>('[data-edge]'),
    );
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting)
            setWord(entry.target.getAttribute('data-edge') ?? '');
        }
      },
      { rootMargin: '-50% 0px -50% 0px' },
    );
    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);
  return (
    <div className="pl-edge" data-over={tone} aria-hidden="true">
      <span className="pl-edge-l" lang="en">
        Molis AI
      </span>
      <span className="pl-edge-r" lang="en" key={word}>
        {word}
      </span>
    </div>
  );
}

export function PlayShell({
  current,
  children,
}: {
  current: 'home' | 'work';
  children: ReactNode;
}) {
  return (
    <div className="pl" data-page={current}>
      <PlayHeader current={current} />
      <Edge />
      {children}
    </div>
  );
}
