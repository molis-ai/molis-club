'use client';
import { useEffect, useState, useSyncExternalStore, type ReactNode } from 'react';
import {
  personas,
  personaUi,
  workNav,
  type Persona,
} from '../../../content/site/work';

// 两种读者各看各的例子：「写代码」（默认）与「写文档、管事情」。
// 选择记在本机（localStorage），链接里的 #dev / #doc 直接指定；没有 JS 时就是「写代码」那一版。
// 按身份变的静态内容两版都在页面里，由外层的 data-persona 用样式藏掉一版（不闪、无 JS 也可读）；
// 会动的部分（全景、四幕、干法）读这里的状态，换身份时重新演。

const KEY = 'molis-work-persona';
const HASH = /^#(dev|doc)$/;

/** 页面一开始就跑的一小段：在 React 接手之前把记住的身份写到外层，免得先闪出另一版 */
export const personaBoot = `(function(){var m=/^#(dev|doc)$/.exec(location.hash),p=m&&m[1];if(!p){try{p=localStorage.getItem('${KEY}')}catch(e){}}if(p==='doc'){var s=document.currentScript;if(s&&s.parentElement)s.parentElement.setAttribute('data-persona','doc')}})();`;

/**
 * 一个记在本机的小选择（读者身份、全景配色）：React 用 useSyncExternalStore 读，
 * 服务端与水合时用默认值，之后读本机；存储被禁用时记在这一页的内存里。
 */
function choice<T extends string>(key: string, values: readonly T[], fallback: T, fromHash = false) {
  const listeners = new Set<() => void>();
  let memory: T | null = null;
  const valid = (value: unknown): value is T => values.includes(value as T);
  const read = (): T => {
    if (fromHash) {
      const match = HASH.exec(location.hash);
      if (match && valid(match[1])) return match[1];
    }
    if (memory) return memory;
    try {
      const value = localStorage.getItem(key);
      if (valid(value)) return value;
    } catch {
      // 存储被禁用：用默认
    }
    return fallback;
  };
  const subscribe = (listener: () => void) => {
    listeners.add(listener);
    window.addEventListener('storage', listener);
    if (fromHash) window.addEventListener('hashchange', listener);
    return () => {
      listeners.delete(listener);
      window.removeEventListener('storage', listener);
      if (fromHash) window.removeEventListener('hashchange', listener);
    };
  };
  const write = (next: T) => {
    memory = next;
    try {
      localStorage.setItem(key, next);
    } catch {
      // 存储被禁用：这一页里照样换
    }
    // 链接里没有别的锚点时，把身份写进地址，方便直接发给别人
    if (fromHash && (!location.hash || HASH.test(location.hash)))
      history.replaceState(history.state, '', `${location.pathname}${location.search}#${next}`);
    listeners.forEach((listener) => listener());
  };
  const use = () => useSyncExternalStore(subscribe, read, () => fallback);
  return { use, write };
}

const personaChoice = choice<Persona>(KEY, personas, 'dev', true);
const themeChoice = choice<'light' | 'dark'>('molis-work-tour-theme', ['light', 'dark'], 'light');

export function usePersona() {
  return { persona: personaChoice.use(), set: personaChoice.write };
}

export function useTourTheme() {
  return { theme: themeChoice.use(), set: themeChoice.write };
}

export function PersonaRoot({
  className,
  id,
  children,
}: {
  className: string;
  id?: string;
  children: ReactNode;
}) {
  const { persona } = usePersona();
  return (
    <div
      className={className}
      id={id}
      data-persona={persona}
      suppressHydrationWarning
    >
      {children}
    </div>
  );
}

/** 两个按钮：按你的工作看例子 */
export function PersonaSwitch({ compact = false }: { compact?: boolean }) {
  const { persona, set } = usePersona();
  return (
    <fieldset className="wp-switch" data-compact={compact || undefined}>
      <legend className="sr-only">{personaUi.group}</legend>
      {personas.map((id) => (
        <button
          key={id}
          type="button"
          aria-pressed={persona === id}
          onClick={() => set(id)}
        >
          {personaUi.label[id]}
        </button>
      ))}
    </fieldset>
  );
}

/** 首屏左下：一句问话 + 切换 */
export function PersonaAsk() {
  return (
    <div className="wp-ask">
      <span>{personaUi.ask}</span>
      <PersonaSwitch />
    </div>
  );
}

/** 不在顶栏里的几段：滚到这里时顶栏哪一项都不亮 */
const UNLISTED = ['ways', 'compare', 'ending'];

/** 页内顶栏：钉在全站顶栏下面；去处 + 切换。滚到哪一段，那一项变深 */
export function WorkNav() {
  const [on, setOn] = useState('');
  useEffect(() => {
    const ids = [...workNav.map((item) => item.id), ...UNLISTED];
    let frame = 0;
    // 视口四成高处往上最近的一段，就是正在读的那一段
    const read = () => {
      frame = 0;
      const line = window.innerHeight * 0.4;
      let found = '';
      let top = -Infinity;
      for (const id of ids) {
        const node = document.getElementById(id);
        if (!node) continue;
        const at = node.getBoundingClientRect().top;
        if (at <= line && at > top) {
          top = at;
          found = id;
        }
      }
      setOn(UNLISTED.includes(found) ? '' : found);
    };
    const request = () => {
      if (!frame) frame = requestAnimationFrame(read);
    };
    request();
    window.addEventListener('scroll', request, { passive: true });
    window.addEventListener('resize', request);
    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener('scroll', request);
      window.removeEventListener('resize', request);
    };
  }, []);
  return (
    <nav className="wp-nav" aria-label="这一页">
      <div className="wp-nav-in m-wrap">
        <a className="wp-nav-name" href="#top" lang="en">
          Molis Work
        </a>
        <ul className="wp-nav-links">
          {workNav.map((item) => (
            <li key={item.id}>
              <a
                href={`#${item.id}`}
                aria-current={on === item.id ? 'true' : undefined}
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>
        <PersonaSwitch compact />
      </div>
    </nav>
  );
}
