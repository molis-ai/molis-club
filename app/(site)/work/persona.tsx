'use client';
import { useSyncExternalStore, type ReactNode } from 'react';
import { personas, personaUi, workGo, type Persona } from '../../../content/site/work';
import { contactHref } from '../../_site/routes';
import { Btn } from '../../_site/ui';

// 三条路各看各的：写代码（默认）/ 写文档、做研究 / 管事情、跟进度。
// 选择记在本机（localStorage），链接里的 #dev / #doc / #ops 直接指定；没有 JS 时就是「写代码」那一版。
// 按路变的静态内容三版都在页面里，由外层的 data-persona 用样式藏掉另外两版（不闪、无 JS 也可读）；
// 首屏舞台读这里的状态：还没选过路时轮演三条路各自最要紧的一段，选了路演这条路的八段。

const KEY = 'molis-work-persona';
const HASH = /^#(dev|doc|ops)$/;

/** 页面一开始就跑的一小段：在 React 接手之前把记住的路写到外层，免得先闪出另一版 */
export const personaBoot = `(function(){var m=/^#(dev|doc|ops)$/.exec(location.hash),p=m&&m[1];if(!p){try{p=localStorage.getItem('${KEY}')}catch(e){}}if(p==='doc'||p==='ops'){var s=document.currentScript;if(s&&s.parentElement)s.parentElement.setAttribute('data-persona',p)}})();`;

const listeners = new Set<() => void>();
let memory: Persona | null = null;
const valid = (value: unknown): value is Persona => personas.includes(value as Persona);

/** 选过的路：地址里的 #dev / #doc / #ops 优先，其次这一页里刚选的，再次本机记住的；都没有就是还没选 */
function readChosen(): Persona | null {
  const match = HASH.exec(location.hash);
  if (match && valid(match[1])) return match[1];
  if (memory) return memory;
  try {
    const value = localStorage.getItem(KEY);
    if (valid(value)) return value;
  } catch {
    // 存储被禁用：当作还没选
  }
  return null;
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  window.addEventListener('storage', listener);
  window.addEventListener('hashchange', listener);
  return () => {
    listeners.delete(listener);
    window.removeEventListener('storage', listener);
    window.removeEventListener('hashchange', listener);
  };
}

function choose(next: Persona) {
  memory = next;
  try {
    localStorage.setItem(KEY, next);
  } catch {
    // 存储被禁用：这一页里照样换
  }
  // 链接里没有别的锚点时，把路写进地址，方便直接发给别人
  if (!location.hash || HASH.test(location.hash))
    history.replaceState(history.state, '', `${location.pathname}${location.search}#${next}`);
  listeners.forEach((listener) => listener());
}

/** persona：按哪条路显示（没选过时是写代码）；chosen：访客自己选过没有（舞台用它决定演三句反转还是八段） */
export function usePersona() {
  const chosen = useSyncExternalStore(subscribe, readChosen, () => null);
  return { persona: chosen ?? 'dev', chosen, set: choose };
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
    <div className={className} id={id} data-persona={persona} suppressHydrationWarning>
      {children}
    </div>
  );
}

/** 首屏右边：你主要做什么？三条路，每条下面一行角色，各种人靠这一行认出自己 */
export function RoutePick() {
  const { chosen, set } = usePersona();
  return (
    <fieldset className="wp-pick">
      <legend>{personaUi.ask}</legend>
      {personas.map((id) => (
        <button key={id} type="button" aria-pressed={chosen === id} onClick={() => set(id)}>
          <b>{personaUi.label[id]}</b>
          <small>{personaUi.roles[id]}</small>
        </button>
      ))}
    </fieldset>
  );
}

/** 页内顶栏：钉在全站顶栏下面；产品名、三条路、报名按钮。一共三屏，不再列段落 */
export function WorkNav() {
  const { chosen, set } = usePersona();
  return (
    <nav className="wp-nav" aria-label="这一页">
      <div className="wp-nav-in m-wrap">
        <a className="wp-nav-name" href="#top" lang="en">
          Molis Work
        </a>
        <fieldset className="wp-switch" data-compact="">
          <legend className="sr-only">{personaUi.group}</legend>
          {personas.map((id) => (
            <button key={id} type="button" aria-pressed={chosen === id} onClick={() => set(id)}>
              {personaUi.label[id]}
            </button>
          ))}
        </fieldset>
        <span className="wp-nav-go">
          <Btn href={contactHref('work-trial')}>{workGo.trial}</Btn>
        </span>
      </div>
    </nav>
  );
}
