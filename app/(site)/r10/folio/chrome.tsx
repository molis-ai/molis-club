'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useLayoutEffect, useState } from 'react';
import { Ago, TodayZh, WarmDot } from './live';
import { grouped } from './format';
import { FOLIO } from './paths';
import type { Pulse } from './pulse';

// 作品集的顶栏与页边。
// 顶栏：左边字标、中间四个去处、右边「中 / EN」（切换机制由另一处在做，这里只留位置和样子）。压在照片屏上时白字、透明，纸上时墨字。
// 页边：像书的书口。左边竖排着这一屏的名字（I N D E X、P L A T E……），换屏时一个字母一个字母地换；
// 右边竖排着今天的日期，和 Molis Work 仓库真实的状态（取不到时只有日期）。

const links = [
  { href: `${FOLIO}#index`, label: '产品' },
  { href: '/enterprise', label: '企业合作' },
  { href: '/community', label: '社区' },
  { href: '/about', label: '关于' },
];

/** film：照片上（白字）；mist：浅色的雾底上（墨字、顶栏透明）；paper：纸上 */
type Tone = 'film' | 'paper' | 'mist';

const asTone = (value: string | null | undefined): Tone =>
  value === 'film' || value === 'mist' ? value : 'paper';

/** 某个点下面压着的是照片还是纸 */
function toneAt(x: number, y: number): Tone {
  const under = document
    .elementsFromPoint(x, y)
    .map((node) => node.closest('[data-tone]'))
    .find(Boolean);
  return asTone(under?.getAttribute('data-tone'));
}

function useToneAt(y: number, initial: Tone) {
  const path = usePathname();
  const [tone, setTone] = useState<Tone>(initial);
  useLayoutEffect(() => {
    let frame = 0;
    const read = () => {
      frame = 0;
      setTone(toneAt(window.innerWidth / 2, y));
    };
    const request = () => {
      if (!frame) frame = requestAnimationFrame(read);
    };
    read();
    const again = window.setTimeout(request, 150);
    window.addEventListener('scroll', request, { passive: true });
    window.addEventListener('resize', request);
    return () => {
      window.clearTimeout(again);
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener('scroll', request);
      window.removeEventListener('resize', request);
    };
  }, [path, y]);
  return tone;
}

export function LangSwitch() {
  return (
    <fieldset className="fo-lang">
      <legend className="sr-only">语言</legend>
      <button type="button" aria-pressed="true" lang="zh-CN">
        中
      </button>
      <span aria-hidden="true">/</span>
      <button type="button" aria-pressed="false" lang="en" title="English">
        EN
      </button>
    </fieldset>
  );
}

export function FolioHeader() {
  // 两页的第一屏都是照片
  const tone = useToneAt(36, 'film');
  return (
    <header className="fo-header" data-over={tone}>
      <Link href={FOLIO} className="fo-wordmark" aria-label="Molis AI 首页">
        <span lang="en">Molis AI</span>
      </Link>
      <nav className="fo-nav" aria-label="主导航">
        {links.map((link) => (
          <Link key={link.href} href={link.href}>
            {link.label}
          </Link>
        ))}
      </nav>
      <LangSwitch />
      <details className="fo-menu">
        <summary>
          <span lang="en">Menu</span>
        </summary>
        <nav aria-label="主导航">
          {links.map((link) => (
            <Link key={link.href} href={link.href}>
              {link.label}
            </Link>
          ))}
        </nav>
      </details>
    </header>
  );
}

/** 视口中线上是哪一屏：读 [data-folio] 与 [data-tone] */
function useCurrentScreen() {
  const path = usePathname();
  const [screen, setScreen] = useState<{ name: string; tone: Tone }>({
    name: '',
    tone: 'paper',
  });
  useEffect(() => {
    const nodes = Array.from(
      document.querySelectorAll<HTMLElement>('[data-folio]'),
    );
    if (!nodes.length) return;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const node = entry.target as HTMLElement;
          setScreen({
            name: node.dataset.folio ?? '',
            tone: asTone(node.dataset.tone),
          });
        }
      },
      { rootMargin: '-50% 0px -50% 0px' },
    );
    nodes.forEach((node) => observer.observe(node));
    return () => observer.disconnect();
  }, [path]);
  return screen;
}

export function FolioMargins({ pulse }: { pulse: Pulse | null }) {
  const { name, tone } = useCurrentScreen();
  return (
    <div className="fo-margins" data-over={tone} aria-hidden="true">
      <p className="fo-edge fo-edge-left" lang="en">
        {/* 换屏时整组重挂，字母依次浮现 */}
        <span key={name} className="fo-edge-word">
          {Array.from(name).map((letter, index) => (
            <span
              key={index}
              style={{ animationDelay: `${index * 60}ms` }}
            >
              {letter}
            </span>
          ))}
        </span>
      </p>
      <p className="fo-edge fo-edge-right">
        <TodayZh />
        {pulse?.week != null ? (
          <>
            <span className="fo-edge-gap" />
            <span>
              Molis Work 近七天提交 {grouped(pulse.week)} 次
            </span>
          </>
        ) : null}
        {pulse?.last ? (
          <>
            <span className="fo-edge-gap" />
            <span className="fo-edge-last">
              <WarmDot pulse={pulse} />
              最近一次改动 <Ago iso={pulse.last.at} />
            </span>
          </>
        ) : null}
      </p>
    </div>
  );
}
