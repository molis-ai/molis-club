// Work 页「两种人，四条闭环」的演示引擎：四个 case 共用的一拍一拍的编排工具。
// 画面挂在 shadow root 里，$ 只在这一扇窗里找；时间可以暂停（离开视口、按暂停时停在原地），
// instant 时一步跳完（点某一步时先把前面几步瞬间演完，减少动态时直接停在做完的样子）。
// 两种光标：杏橙指针是「你」（另一位同事是他自己的颜色），AI 的指针是方名牌带一颗星。

/* ---------- 图标：取自 Lucide（ISC），Molis Work 用的同一套 ---------- */

const ICONS: Record<string, string> = {
  'arrow-left': "<path d='m12 19-7-7 7-7'/><path d='M19 12H5'/>",
  'arrow-right': "<path d='M5 12h14'/><path d='m12 5 7 7-7 7'/>",
  plus: "<path d='M5 12h14'/><path d='M12 5v14'/>",
  minus: "<path d='M5 12h14'/>",
  'layout-grid': "<rect width='7' height='7' x='3' y='3' rx='1'/><rect width='7' height='7' x='14' y='3' rx='1'/><rect width='7' height='7' x='14' y='14' rx='1'/><rect width='7' height='7' x='3' y='14' rx='1'/>",
  x: "<path d='M18 6 6 18'/><path d='m6 6 12 12'/>",
  sparkles: "<path d='M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z'/>",
  'circle-alert': "<circle cx='12' cy='12' r='10'/><line x1='12' x2='12' y1='8' y2='12'/><line x1='12' x2='12.01' y1='16' y2='16'/>",
  'messages-square': "<path d='M14 9a2 2 0 0 1-2 2H6l-4 4V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2z'/><path d='M18 9h2a2 2 0 0 1 2 2v11l-4-4h-6a2 2 0 0 1-2-2v-1'/>",
  'message-square': "<path d='M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z'/>",
  terminal: "<polyline points='4 17 10 11 4 5'/><line x1='12' x2='20' y1='19' y2='19'/>",
  check: "<path d='M20 6 9 17l-5-5'/>",
  search: "<circle cx='11' cy='11' r='8'/><path d='m21 21-4.3-4.3'/>",
  'search-check': "<path d='m8 11 2 2 4-4'/><circle cx='11' cy='11' r='8'/><path d='m21 21-4.3-4.3'/>",
  send: "<path d='M14.536 21.686a.5.5 0 0 0 .937-.024l6.5-19a.496.496 0 0 0-.635-.635l-19 6.5a.5.5 0 0 0-.024.937l7.93 3.18a2 2 0 0 1 1.112 1.11z'/><path d='m21.854 2.147-10.94 10.939'/>",
  'chevron-up': "<path d='m18 15-6-6-6 6'/>",
  house: "<path d='M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8'/><path d='M3 10a2 2 0 0 1 .709-1.528l7-5.999a2 2 0 0 1 2.582 0l7 5.999A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z'/>",
  'file-text': "<path d='M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z'/><path d='M14 2v4a2 2 0 0 0 2 2h4'/><path d='M10 9H8'/><path d='M16 13H8'/><path d='M16 17H8'/>",
  'file-code': "<path d='M10 12.5 8 15l2 2.5'/><path d='m14 12.5 2 2.5-2 2.5'/><path d='M14 2v4a2 2 0 0 0 2 2h4'/><path d='M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7z'/>",
  blocks: "<rect width='7' height='7' x='14' y='3' rx='1'/><path d='M10 21V8a1 1 0 0 0-1-1H4a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-5a1 1 0 0 0-1-1H3'/>",
  users: "<path d='M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2'/><circle cx='9' cy='7' r='4'/><path d='M22 21v-2a4 4 0 0 0-3-3.87'/><path d='M16 3.13a4 4 0 0 1 0 7.75'/>",
  monitor: "<rect width='20' height='14' x='2' y='3' rx='2'/><line x1='8' x2='16' y1='21' y2='21'/><line x1='12' x2='12' y1='17' y2='21'/>",
  smartphone: "<rect width='14' height='20' x='5' y='2' rx='2' ry='2'/><path d='M12 18h.01'/>",
  'loader-circle': "<path d='M21 12a9 9 0 1 1-6.219-8.56'/>",
  'rotate-cw': "<path d='M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8'/><path d='M21 3v5h-5'/>",
  play: "<polygon points='6 3 20 12 6 21 6 3'/>",
  pause: "<rect x='14' y='4' width='4' height='16' rx='1'/><rect x='6' y='4' width='4' height='16' rx='1'/>",
  cpu: "<rect width='16' height='16' x='4' y='4' rx='2'/><rect width='6' height='6' x='9' y='9' rx='1'/><path d='M15 2v2'/><path d='M15 20v2'/><path d='M2 15h2'/><path d='M2 9h2'/><path d='M20 15h2'/><path d='M20 9h2'/><path d='M9 2v2'/><path d='M9 20v2'/>",
  'mouse-pointer': "<path d='M4.037 4.688a.495.495 0 0 1 .651-.651l16 6.5a.5.5 0 0 1-.063.947l-6.124 1.58a2 2 0 0 0-1.438 1.435l-1.579 6.126a.5.5 0 0 1-.947.063z'/>",
  pencil: "<path d='M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z'/><path d='m15 5 4 4'/>",
  'pen-line': "<path d='M12 20h9'/><path d='M16.376 3.622a1 1 0 0 1 3.002 3.002L7.368 18.635a2 2 0 0 1-.855.506l-2.872.838a.5.5 0 0 1-.62-.62l.838-2.872a2 2 0 0 1 .506-.854z'/>",
  'layout-template': "<rect width='18' height='7' x='3' y='3' rx='1'/><rect width='9' height='7' x='3' y='14' rx='1'/><rect width='5' height='7' x='16' y='14' rx='1'/>",
  plug: "<path d='M12 22v-5'/><path d='M9 8V2'/><path d='M15 8V2'/><path d='M18 8v5a4 4 0 0 1-4 4h-4a4 4 0 0 1-4-4V8Z'/>",
  rss: "<path d='M4 11a9 9 0 0 1 9 9'/><path d='M4 4a16 16 0 0 1 16 16'/><circle cx='5' cy='19' r='1'/>",
  target: "<circle cx='12' cy='12' r='10'/><circle cx='12' cy='12' r='6'/><circle cx='12' cy='12' r='2'/>",
  star: "<path d='M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z'/>",
  mail: "<rect width='20' height='16' x='2' y='4' rx='2'/><path d='m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7'/>",
  github: "<path d='M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4'/><path d='M9 18c-4.51 2-5-2-7-2'/>",
  history: "<path d='M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8'/><path d='M3 3v5h5'/><path d='M12 7v5l4 2'/>",
  inbox: "<polyline points='22 12 16 12 14 15 10 15 8 12 2 12'/><path d='M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z'/>",
  asterisk: "<path d='M12 6v12'/><path d='M17.196 9 6.804 15'/><path d='m6.804 9 10.392 6'/>",
  bookmark: "<path d='m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z'/>",
  'book-open': "<path d='M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z'/><path d='M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z'/>",
  'thumbs-down': "<path d='M17 14V2'/><path d='M9 18.12 10 14H4.17a2 2 0 0 1-1.92-2.56l2.33-8A2 2 0 0 1 6.5 2H20a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-2.76a2 2 0 0 0-1.79 1.11L12 22a3.13 3.13 0 0 1-3-3.88Z'/>",
  link: "<path d='M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71'/><path d='M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71'/>",
  newspaper: "<path d='M15 18h-5'/><path d='M18 14h-8'/><path d='M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-4 0v-9a2 2 0 0 1 2-2h2'/><rect width='8' height='4' x='10' y='6' rx='1'/>",
};

export const svg = (name: string, cls = '') =>
  `<svg class="i ${cls}" viewBox="0 0 24 24" aria-hidden="true">${ICONS[name] ?? ''}</svg>`;

/** 在哪一块里找：一扇窗、一条消息或 shadow root（只要能 querySelector） */
type Scope = Pick<ParentNode, 'querySelector' | 'querySelectorAll'>;

/** 把 <i data-i="名字"> 换成内联图标 */
export function fill(root: Scope) {
  root.querySelectorAll<HTMLElement>('i[data-i]').forEach((el) => {
    const t = document.createElement('template');
    t.innerHTML = svg(el.dataset.i ?? '');
    const icon = t.content.firstElementChild!;
    if (el.className) icon.classList.add(...el.className.split(' '));
    el.replaceWith(icon);
  });
}

/** 讨论里的一位：人只有名字，AI 名字后面写是谁的 */
export type Who = { name: string; own?: string; av: string };

type Pointer = { id: string; x: number; y: number; c: string };

export type Runtime = ReturnType<typeof createRuntime>;

export type Act = (alive: () => boolean) => Promise<void>;

/** 一个 case：画面、样式和一拍一拍的编排；peer 是另一位同事指针的颜色 */
export type CaseSpec = {
  html: string;
  css: string;
  peer?: string;
  cast: (rt: Runtime) => { reset: () => void; acts: Act[] };
};

export function createRuntime(root: ShadowRoot, { peer = '' }: { peer?: string } = {}) {
  const $ = (id: string) => root.getElementById(id) as HTMLElement;
  const q = (from: Scope, sel: string) => from.querySelector(sel) as HTMLElement;
  const scene = $('scene');
  const conv = $('conv');

  let instant = false;
  let paused = false;
  let runId = 0;

  /* ---------- 时间：可以暂停的 sleep ---------- */
  const sleep = (ms: number) =>
    new Promise<void>((resolve) => {
      if (instant) return resolve();
      let left = ms;
      let last = performance.now();
      const tick = () => {
        const now = performance.now();
        if (!paused) left -= now - last;
        last = now;
        if (left <= 0) resolve();
        else setTimeout(tick, Math.min(left, 60));
      };
      setTimeout(tick, Math.min(ms, 60));
    });
  const on = (el: Element | null | undefined, value = true) => el?.toggleAttribute('data-on', value);
  function setInstant(value: boolean) {
    instant = value;
    scene.classList.toggle('jump', value);
  }
  function setPaused(value: boolean) {
    paused = value;
    scene.classList.toggle('held', value);
  }
  function box(el: Element) {
    const s = scene.getBoundingClientRect();
    const r = el.getBoundingClientRect();
    return { x: r.left - s.left, y: r.top - s.top, w: r.width, h: r.height };
  }
  function appear(el: Element) {
    if (instant) el.setAttribute('data-in', '');
    else requestAnimationFrame(() => requestAnimationFrame(() => el.setAttribute('data-in', '')));
  }
  function flash(el: Element | null, cls = 'flash', ms = 900) {
    if (instant || !el) return;
    el.classList.add(cls);
    setTimeout(() => el.classList.remove(cls), ms);
  }

  /* ---------- 人的指针：你，和另一位同事 ---------- */
  const PTR = {
    hand: { id: 'hand', x: 0, y: 0, c: '' } as Pointer,
    peer: { id: 'peer', x: 0, y: 0, c: peer } as Pointer,
  };
  function ptAt(p: Pointer, x: number, y: number, dur: number) {
    const el = $(p.id);
    el.style.transitionDuration = `${instant ? 0 : dur}ms, 300ms`;
    el.style.transform = `translate(${x}px, ${y}px)`;
    p.x = x;
    p.y = y;
  }
  async function moveTo(el: Element, fx = 0.5, fy = 0.6, p = PTR.hand) {
    if (instant) return;
    on($(p.id));
    const r = box(el);
    const x = r.x + r.w * fx;
    const y = r.y + r.h * fy;
    const dur = Math.min(1100, Math.max(520, Math.hypot(x - p.x, y - p.y) * 1.35));
    ptAt(p, x, y, dur);
    await sleep(dur + 80);
  }
  async function click(el: Element, p = PTR.hand) {
    if (instant) return;
    const hand = $(p.id);
    hand.classList.add('down');
    el.classList.add('hit');
    const ripple = document.createElement('span');
    ripple.className = 'ripple';
    ripple.style.left = `${p.x}px`;
    ripple.style.top = `${p.y}px`;
    if (p.c) ripple.style.setProperty('--c', p.c);
    scene.appendChild(ripple);
    setTimeout(() => ripple.remove(), 600);
    await sleep(160);
    hand.classList.remove('down');
    el.classList.remove('hit');
    await sleep(180);
  }
  const away = (p = PTR.hand) => on(root.getElementById(p.id), false);

  /* 一样东西从这里飞到那里：一颗石墨色的小签，划一道弧 */
  function packet(from: Element, to: Element, html: string) {
    if (instant) return Promise.resolve();
    const a = box(from);
    const b = box(to);
    const p = document.createElement('div');
    p.className = 'packet';
    p.innerHTML = html;
    scene.appendChild(p);
    const sx = a.x + a.w / 2 - p.offsetWidth / 2;
    const sy = a.y + a.h / 2 - p.offsetHeight / 2;
    const dx = b.x + b.w / 2 - p.offsetWidth / 2 - sx;
    const dy = b.y + b.h / 2 - p.offsetHeight / 2 - sy;
    const lift = Math.min(60, Math.abs(dx) * 0.12 + 18);
    p.style.left = `${sx}px`;
    p.style.top = `${sy}px`;
    const flight = p.animate(
      [
        { transform: 'translate(0,0) scale(.7)', opacity: 0 },
        { transform: `translate(${dx * 0.08}px, ${dy * 0.08 - lift * 0.4}px) scale(1)`, opacity: 1, offset: 0.14 },
        { transform: `translate(${dx * 0.55}px, ${dy * 0.55 - lift}px) scale(1)`, opacity: 1, offset: 0.6 },
        { transform: `translate(${dx}px, ${dy}px) scale(.8)`, opacity: 0 },
      ],
      { duration: 1300, easing: 'cubic-bezier(.35,.1,.25,1)' },
    );
    return Promise.race([flight.finished, sleep(1500)]).then(
      () => p.remove(),
      () => p.remove(),
    );
  }

  /* ---------- 讨论 ---------- */
  const WHO: Record<string, Who> = {
    zhe: { name: '阿哲', av: '<span class="av zhe">哲</span>' },
    lin: { name: '小林', av: '<span class="av lin">林</span>' },
    ai: { name: '助理', own: '你的', av: `<span class="av sq ai">${svg('sparkles')}</span>` },
    codex: { name: 'Codex', own: '你的', av: `<span class="av sq codex">${svg('terminal')}</span>` },
    cc: { name: 'Claude Code', own: '阿哲的', av: `<span class="av sq cc">${svg('terminal')}</span>` },
    claude: { name: 'Claude', own: '你的', av: `<span class="av sq claude">${svg('asterisk')}</span>` },
    gpt: { name: 'ChatGPT', own: '小林的', av: `<span class="av sq gpt">${svg('message-square')}</span>` },
  };
  function post(key: string, html: string, time: string, { cont = false, card = false } = {}) {
    const w = document.createElement('div');
    w.className = 'mw';
    const p = WHO[key];
    const who = `<b>${p.name}</b>${p.own ? `<span class="own">${p.own}</span>` : ''}<time>${time}</time>`;
    w.innerHTML = card
      ? `<div class="msg ai"><div class="m-head">${p.av}<span class="m-who">${who}</span></div><div class="m-txt">${html}</div></div>`
      : `<div class="msg${p.own ? ' ai flat' : ''}${cont ? ' cont' : ''}">${p.av}<div class="m-body"><div class="m-who">${who}</div><div class="m-txt">${html}</div></div></div>`;
    fill(w);
    conv.appendChild(w);
    appear(w);
    return w;
  }
  function pline(prog: Element, html: string) {
    const d = document.createElement('div');
    d.className = 'pl';
    d.innerHTML = `<span>${html}</span>`;
    prog.appendChild(d);
    appear(d);
    return d;
  }
  async function typeInto(el: HTMLElement, text: string, speed = 80) {
    el.setAttribute('data-typing', '');
    el.textContent = '';
    if (instant) {
      el.textContent = text;
      return;
    }
    for (const ch of text) {
      el.textContent += ch;
      await sleep(speed);
    }
  }
  function blank(el: HTMLElement, text: string) {
    el.removeAttribute('data-typing');
    el.textContent = text;
  }
  /** 你在讨论里说一句：先打字，再发出去；hear 是助理会听到的那半句 */
  async function say(text: string, time: string, hear?: string) {
    await typeInto($('r-ph'), text);
    await sleep(220);
    blank($('r-ph'), '发送消息…');
    const html = hear ? text.replace(hear, `<span class="hear">${hear}</span>`) : text;
    const w = document.createElement('div');
    w.className = 'mw';
    w.innerHTML = `<div class="msg mine"><div><div class="bubble">${html}</div><span class="heard">${svg('sparkles')}</span><time>${time}</time></div></div>`;
    conv.appendChild(w);
    appear(w);
    return w;
  }
  function stepText(el: HTMLElement, text: string) {
    if (instant) {
      el.textContent = text;
      return;
    }
    el.classList.add('out');
    setTimeout(() => {
      el.textContent = text;
      el.classList.remove('out');
    }, 170);
  }

  /* ---------- 一遍一遍地演 ---------- */
  /** 从第 from 步开始演；前面几步瞬间演完。onStep 告诉外壳演到哪一步，演完返回 true */
  async function run(acts: Act[], reset: () => void, from: number, onStep: (step: number) => void, still: boolean) {
    const id = ++runId;
    const alive = () => id === runId;
    reset();
    setInstant(still || from > 0);
    for (let k = 0; k < acts.length; k++) {
      if (k === from && !still) setInstant(false);
      if (!instant) onStep(k);
      await acts[k](alive);
      if (!alive()) return false;
    }
    setInstant(false);
    onStep(acts.length);
    return true;
  }
  const stop = () => {
    runId++;
  };

  return {
    root,
    $,
    q,
    scene,
    conv,
    get instant() {
      return instant;
    },
    setInstant,
    setPaused,
    sleep,
    on,
    box,
    appear,
    flash,
    PTR,
    ptAt,
    moveTo,
    click,
    away,
    packet,
    WHO,
    post,
    pline,
    typeInto,
    blank,
    say,
    stepText,
    run,
    stop,
  };
}

/* ---------- 插件创作台：界面一块块放，功能一根根接 ---------- */

export type Studio = ReturnType<typeof createStudio>;

export function createStudio(
  rt: Runtime,
  { sockets, align }: { sockets: Record<string, string>; align: () => void },
) {
  const { $, box, on, flash, sleep, scene } = rt;
  const wires: { from: Element; to: Element; fy: number }[] = [];
  let conn = 0;
  let total = 3;

  function botAt(k: 'ui' | 'fn', x: number, y: number, dur: number) {
    const b = $(`bot-${k}`);
    b.style.transitionDuration = `${rt.instant ? 0 : dur}ms, 300ms`;
    b.style.transform = `translate(${x}px, ${y}px)`;
  }
  async function botTo(k: 'ui' | 'fn', el: Element, label: string, fx = 0.06, fy = 0.3) {
    const b = $(`bot-${k}`);
    on(b);
    rt.q(b, 'em').textContent = label;
    const r = box(el);
    botAt(k, r.x + r.w * fx, r.y + r.h * fy, 650);
    await sleep(720);
  }
  function botsAway() {
    on($('bot-ui'), false);
    on($('bot-fn'), false);
  }
  function log(kind: 'ui' | 'fn' | 'you' | 'note' | 'okl', html: string) {
    const d = document.createElement('div');
    d.className = `lg ${kind}`;
    const lead =
      kind === 'ui'
        ? `<span class="rl ui">${svg('layout-template')}</span>`
        : kind === 'fn'
          ? `<span class="rl fn">${svg('plug')}</span>`
          : kind === 'okl'
            ? svg('check')
            : kind === 'note'
              ? svg('pause')
              : '';
    d.innerHTML = `<div>${lead}<span${kind === 'you' ? ' class="bub"' : ''}>${html}</span></div>`;
    $('log').appendChild(d);
    rt.appear(d);
  }
  let selTimer = 0;
  function select(el: Element, ms = 1000) {
    const s = $('sel');
    const r = box(el);
    const pad = parseFloat(getComputedStyle(scene).fontSize) * 0.32;
    Object.assign(s.style, {
      left: `${r.x - pad}px`,
      top: `${r.y - pad}px`,
      width: `${r.w + pad * 2}px`,
      height: `${r.h + pad * 2}px`,
    });
    clearTimeout(selTimer);
    on(s, !rt.instant);
    if (!rt.instant) selTimer = window.setTimeout(() => on(s, false), ms);
  }
  /** 功能接上能力：从零件右沿拉一根线到右边那一列 */
  function drawWires(anim = -1) {
    const g = $('wires');
    g.innerHTML = wires
      .map((w, k) => {
        const a = box(w.from);
        const b = box(w.to);
        const x1 = a.x + a.w;
        const y1 = a.y + a.h * w.fy;
        const x2 = b.x;
        const y2 = b.y + b.h / 2;
        const dx = Math.max(18, (x2 - x1) * 0.55);
        return `<path data-k="${k}" d="M${x1},${y1} C${x1 + dx},${y1} ${x2 - dx},${y2} ${x2},${y2}"/><circle cx="${x1}" cy="${y1}" r="2.6"/>`;
      })
      .join('');
    if (anim < 0 || rt.instant) return;
    const path = g.querySelector<SVGPathElement>(`path[data-k="${anim}"]`);
    if (!path) return;
    const len = path.getTotalLength();
    path.style.strokeDasharray = `${len}`;
    path.style.strokeDashoffset = `${len}`;
    path.getBoundingClientRect();
    path.style.transition = 'stroke-dashoffset 0.6s cubic-bezier(0.2, 0.7, 0.1, 1)';
    path.style.strokeDashoffset = '0';
  }
  /** 布局在动的时候，能力和线跟着走 */
  function follow(ms: number) {
    align();
    drawWires();
    if (rt.instant) return;
    const end = performance.now() + ms;
    const tick = () => {
      align();
      drawWires();
      if (performance.now() < end) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }
  function setProg() {
    $('cv-n').textContent = `${conn}/${total}`;
    const d = $('cv-dots');
    while (d.children.length < total) {
      const i = document.createElement('i');
      if (d.children.length >= 3 && !rt.instant) i.setAttribute('data-new', '');
      d.appendChild(i);
    }
    while (d.children.length > total) d.lastChild?.remove();
    [...d.children].forEach((i, k) => on(i, k < conn));
  }
  function resetStudio() {
    wires.length = 0;
    conn = 0;
    total = 3;
    $('cv-dots').innerHTML = '';
    setProg();
    Object.keys(sockets).forEach((k) => on($(`sk-${k}`), false));
    drawWires();
  }
  function grow(to: number) {
    total = to;
    setProg();
  }
  async function place(part: string, label: string) {
    const el = rt.q($('board'), `[data-part="${part}"]`);
    el.dataset.st = 'placing';
    await botTo('ui', el, label);
    log('ui', `<b>界面</b> ${label}`);
    await sleep(620);
    el.dataset.st = 'placed';
    select(el);
    await sleep(480);
  }
  async function connect(from: Element, sock: string, label: string, fy = 0.5) {
    await botTo('fn', from, label, 0.9, fy);
    log('fn', `<b>功能</b> ${label} <em>接上 ${sockets[sock]}</em>`);
    flash(from, 'wired');
    wires.push({ from, to: $(`sk-${sock}`), fy });
    align();
    drawWires(wires.length - 1);
    await sleep(620);
    on($(`sk-${sock}`));
    flash($(`sk-${sock}`), 'hit');
    conn++;
    setProg();
    await sleep(420);
  }

  return { botAt, botTo, botsAway, log, select, drawWires, follow, resetStudio, grow, place, connect };
}
