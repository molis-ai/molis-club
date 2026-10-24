'use client';
import { useEffect, useRef, type RefObject } from 'react';
import { scenes } from './scripts';

// 演示里的鼠标编排（specs/site-rebuild/tool-page.md 第 11 节）。光标是带着人看的那样东西：
// 一次只动一样，光标在动时别的都停着；结果出现时，光标停住或让开。每一遍分三拍：之前停一会儿 → 动手 → 之后停久一点。
// 画面的样子都写在 tool.css：舞台上 data-run 表示由这里接管，data-cue 记着已经发生的几拍，
// 被选中、被框住、被收拢的那几样各自带 data-sel / data-tidy / data-clean。
// 没有 data-run 时就是「做完了」的样子：没有 JS、减少动态时停在那里。
// 光标的弧线、按下由这里用 Web Animations 画；时钟能停（离开视口、切到后台、按了暂停），回来接着走。

type Point = { x: number; y: number };
type Target = string | Element | Point;
type Move = {
  /** 落在目标的哪一点：[0, 0] 左上，[1, 1] 右下 */
  at?: readonly [number, number];
  dur?: number;
  /** 弧线鼓出来多少（相对两点距离），0 是直线 */
  bend?: number;
};
type Timer = { left: number; at: number; id: number; fire: () => void };

export type Scene = {
  /** 'done'：先停在做完的样子，过一会儿再演一遍怎么做到（首屏） */
  start?: 'done';
  /** 第一次播之前等多久：等墙和开窗停稳 */
  settle?: number;
  /** 做完以后停多久 */
  rest?: number;
  /** 一遍 */
  play: (c: Cue) => Promise<void>;
  /** 访客亲手按过以后（hold）摆成的样子 */
  acts?: Record<string, (c: Cue) => Promise<void> | void>;
};

/** 光标的快慢：先快后慢，像手在找落点 */
const HAND = 'cubic-bezier(0.4, 0, 0.2, 1)';
/** 收拢：起步干脆，落位很轻 */
const FOLD = 'cubic-bezier(0.3, 0, 0.1, 1)';
/** 选中色从左往右铺开 */
const WASH: Keyframe[] = [
  { backgroundSize: '0% 100%' },
  { backgroundSize: '100% 100%' },
];

/** 弧线的控制点：两点中间往旁边鼓出去 */
function control(from: Point, to: Point, bend: number): Point {
  return {
    x: (from.x + to.x) / 2 - (to.y - from.y) * bend,
    y: (from.y + to.y) / 2 + (to.x - from.x) * bend,
  };
}

/** 两点之间一段二次贝塞尔弧线，取 24 段 */
function arc(from: Point, to: Point, bend: number): Keyframe[] {
  const { x: cx, y: cy } = control(from, to, bend);
  return Array.from({ length: 25 }, (_, index) => {
    const t = index / 24;
    const u = 1 - t;
    const x = u * u * from.x + 2 * u * t * cx + t * t * to.x;
    const y = u * u * from.y + 2 * u * t * cy + t * t * to.y;
    return { transform: `translate(${x.toFixed(1)}px, ${y.toFixed(1)}px)` };
  });
}

export class Cue {
  /** 减少动态：不画过程，直接摆到结果（只有访客亲手按时才会用到） */
  quiet = false;
  private run = 0;
  private live = false;
  private frozen = false;
  private timers = new Set<Timer>();
  private anims = new Set<Animation>();
  private flags: [HTMLElement, string][] = [];
  private spots = new Map<HTMLElement, Point>();
  private hand: HTMLElement | null = null;

  constructor(
    readonly stage: HTMLElement,
    private scene: Scene,
  ) {}

  // ---------- 外壳调用 ----------

  /** 交回「做完了」的样子 */
  finish() {
    this.cancel();
    delete this.stage.dataset.run;
    delete this.stage.dataset.cue;
    this.unflag();
    this.hide();
  }

  /** 准备好从头演：首屏停在结果上，往下的段落摆回空白 */
  ready() {
    if (this.scene.start === 'done') return this.finish();
    this.cancel();
    this.blank();
  }

  play() {
    if (this.live) return this.thaw();
    this.live = true;
    this.loop().catch(() => this.finish());
  }

  pause() {
    if (!this.live || this.frozen) return;
    this.frozen = true;
    const now = performance.now();
    for (const timer of this.timers) {
      window.clearTimeout(timer.id);
      timer.left -= now - timer.at;
    }
    this.anims.forEach((anim) => anim.pause());
  }

  /** 访客亲手接过：循环停下，光标退场，摆成访客要的样子 */
  hold(name: string) {
    this.cancel();
    this.stage.dataset.run = '';
    this.hide();
    const act = this.scene.acts?.[name];
    if (act) Promise.resolve(act(this)).catch(() => {});
  }

  cancel() {
    this.run += 1;
    this.live = false;
    this.frozen = false;
    this.timers.forEach((timer) => window.clearTimeout(timer.id));
    this.timers.clear();
    this.anims.forEach((anim) => anim.cancel());
    this.anims.clear();
    delete this.stage.dataset.veil;
    delete this.stage.dataset.snap;
  }

  // ---------- 编排用 ----------

  /** 等一会儿（暂停时一起停） */
  wait(ms: number) {
    const run = this.run;
    return new Promise<void>((resolve) => {
      const timer: Timer = {
        left: this.quiet ? 0 : ms,
        at: 0,
        id: 0,
        fire: () => {
          this.timers.delete(timer);
          if (run === this.run) resolve();
        },
      };
      this.timers.add(timer);
      if (!this.frozen) this.tick(timer);
    });
  }

  el(name: string) {
    return this.stage.querySelector<HTMLElement>(`[data-c='${name}']`);
  }

  /** 同一拍里的几样：b-0、b-1……按顺序 */
  all(prefix: string) {
    return Array.from(
      this.stage.querySelectorAll<HTMLElement>(`[data-c^='${prefix}-']`),
    ).filter((node) => /^\d+$/.test(node.dataset.c!.slice(prefix.length + 1)));
  }

  cue(...names: string[]) {
    const set = this.cues();
    names.forEach((name) => set.add(name));
    this.stage.dataset.cue = [...set].join(' ');
  }

  uncue(...names: string[]) {
    const set = this.cues();
    names.forEach((name) => set.delete(name));
    this.stage.dataset.cue = [...set].join(' ');
  }

  /** 一下子摆成这几拍（访客亲手按时用） */
  set(...names: string[]) {
    this.stage.dataset.cue = names.join(' ');
  }

  /** 给某一样做个记号：data-sel（选中）、data-tidy、data-clean…… */
  flag(target: string | HTMLElement, name: string) {
    const node = typeof target === 'string' ? this.el(target) : target;
    if (!node || node.hasAttribute(`data-${name}`)) return;
    node.setAttribute(`data-${name}`, '');
    this.flags.push([node, name]);
  }

  /** 去掉记号；不给名字就全部去掉，给了 target 只动那一样 */
  unflag(name?: string, target?: string | HTMLElement) {
    const only = typeof target === 'string' ? this.el(target) : target;
    this.flags = this.flags.filter(([node, flag]) => {
      if ((name && flag !== name) || (only && node !== only)) return true;
      node.removeAttribute(`data-${flag}`);
      return false;
    });
  }

  /** 不带过渡地摆好（趁看不清时换回起点） */
  snap(change: () => void) {
    this.stage.dataset.snap = '';
    change();
    void this.stage.offsetWidth;
    delete this.stage.dataset.snap;
  }

  /** 接下来用哪只光标（一个舞台里几块屏幕，各有各的） */
  use(name?: string) {
    this.hand = this.stage.querySelector<HTMLElement>(
      name ? `[data-hand='${name}']` : '[data-hand]',
    );
  }

  /** 光标从画框外进来，落到目标上 */
  async enter(
    target: Target,
    {
      from = [1.06, 0.96],
      ...move
    }: Move & { from?: readonly [number, number] } = {},
  ) {
    const hand = this.hand!;
    const box = this.box();
    this.place({ x: box.width * from[0], y: box.height * from[1] });
    void hand.offsetWidth;
    hand.dataset.on = '';
    await this.to(target, { dur: 1150, bend: 0.2, ...move });
  }

  async to(target: Target, { at, dur, bend = 0.16 }: Move = {}) {
    const hand = this.hand!;
    const from = this.spot();
    const to = this.point(target, at);
    const duration = dur ?? this.time(from, to);
    const flight = this.animate(hand, arc(from, to, bend), {
      duration,
      easing: HAND,
      fill: 'forwards',
    });
    this.spots.set(hand, to);
    await flight.done;
    hand.style.transform = `translate(${to.x}px, ${to.y}px)`;
    flight.anim.cancel();
  }

  /** I 形（选字）与箭头 */
  beam() {
    this.hand!.dataset.shape = 'beam';
  }

  arrow() {
    delete this.hand!.dataset.shape;
  }

  /**
   * 按住拖过去：光标走到目标，同一段时间里那一样被铺上选中色，到了以后记作 data-sel。
   * box：不是铺色，是框选——虚线框从左上角跟着光标拉到右下角
   */
  async drag(
    target: Target,
    pick: string | HTMLElement,
    { box = false, ...move }: Move & { box?: boolean } = {},
  ) {
    const node = typeof pick === 'string' ? this.el(pick) : pick;
    const from = this.spot();
    const at = move.at ?? (box ? [1, 1] : [1, 0.55]);
    const to = this.point(target, at);
    const duration = move.dur ?? this.time(from, to) * 0.8;
    let frames = WASH;
    if (node && box) {
      const { width, height } = node.getBoundingClientRect();
      frames = [
        { width: '0px', height: '0px', opacity: 1 },
        { width: `${width}px`, height: `${height}px`, opacity: 1 },
      ];
    }
    const grow = node
      ? this.animate(node, frames, { duration, easing: HAND, fill: 'forwards' })
      : null;
    // 终点先量好：框选时框从 0 长大，动起来以后再量就量到左上角了
    await this.to(to, { bend: 0.03, ...move, dur: duration });
    await grow?.done;
    if (node) this.flag(node, 'sel');
    grow?.anim.cancel();
  }

  /** 按下：光标缩一下再弹回；按到底的那一刻发生 then（加一拍，或做一件事） */
  async press(then?: string | (() => void)) {
    const tip = this.hand!.firstElementChild!;
    const tap = this.animate(
      tip,
      [
        { transform: 'scale(1)' },
        { transform: 'scale(0.8)', offset: 0.4 },
        { transform: 'scale(1)' },
      ],
      { duration: 260, easing: 'ease-out' },
    );
    await this.wait(105);
    if (typeof then === 'string') this.cue(then);
    else then?.();
    await tap.done;
  }

  /** 让开：往旁边挪一点（单位是光标的大小） */
  async aside(dx = 3, dy = 2.6, dur = 900) {
    const from = this.spot();
    const em = this.em();
    await this.to(
      { x: from.x + dx * em, y: from.y + dy * em },
      { dur, bend: 0.08 },
    );
  }

  /** 光标淡出，顺势往旁边走一点 */
  async leave() {
    delete this.hand!.dataset.on;
    await this.aside(1.4, 1.2, 600);
  }

  /** 收拢：先量好每一段在哪，换成干净的排法，再让每一段从原处滑到新位置（FLIP）；外框的高度一起变 */
  async flip(
    nodes: HTMLElement[],
    change: () => void,
    { box, dur = 780 }: { box?: string; dur?: number } = {},
  ) {
    if (this.quiet) return change();
    const frame = box ? this.el(box) : null;
    const first = nodes.map((node) => node.getBoundingClientRect());
    const high = frame?.getBoundingClientRect().height ?? 0;
    change();
    const moves = nodes.map((node, index) => {
      const a = first[index];
      const b = node.getBoundingClientRect();
      const scale = b.width ? a.width / b.width : 1;
      return this.animate(
        node,
        [
          {
            transform: `translate(${a.left - b.left}px, ${a.top - b.top}px) scale(${scale})`,
          },
          { transform: 'none' },
        ],
        { duration: dur, easing: FOLD },
      ).done;
    });
    const low = frame?.getBoundingClientRect().height ?? 0;
    if (frame && Math.abs(high - low) > 1)
      moves.push(
        this.animate(frame, [{ height: `${high}px` }, { height: `${low}px` }], {
          duration: dur,
          easing: FOLD,
        }).done,
      );
    await Promise.all(moves);
  }

  // ---------- 里面 ----------

  private async loop() {
    const { scene } = this;
    let first = true;
    for (;;) {
      if (first && scene.start === 'done') {
        await this.wait(2600);
        await this.reset();
      } else if (first) await this.wait(scene.settle ?? 900);
      await scene.play(this);
      await this.wait(scene.rest ?? 3400);
      await this.reset();
      first = false;
    }
  }

  /** 一遍演完：光标退场，画面淡下去，趁看不见摆回空白，再亮起来（veil='up'） */
  private async reset() {
    this.hide();
    this.stage.dataset.veil = '';
    await this.wait(560);
    this.snap(() => this.blank());
    this.stage.dataset.veil = 'up';
    await this.wait(480);
    delete this.stage.dataset.veil;
    await this.wait(300);
  }

  private blank() {
    this.stage.dataset.run = '';
    this.stage.dataset.cue = '';
    this.unflag();
    this.hide();
  }

  private hide() {
    this.stage.querySelectorAll<HTMLElement>('[data-hand]').forEach((hand) => {
      delete hand.dataset.on;
      delete hand.dataset.shape;
    });
  }

  private cues() {
    return new Set((this.stage.dataset.cue ?? '').split(' ').filter(Boolean));
  }

  private tick(timer: Timer) {
    timer.at = performance.now();
    timer.id = window.setTimeout(timer.fire, Math.max(0, timer.left));
  }

  private thaw() {
    if (!this.frozen) return;
    this.frozen = false;
    this.timers.forEach((timer) => this.tick(timer));
    this.anims.forEach((anim) => anim.play());
  }

  private animate(
    node: Element,
    frames: Keyframe[],
    options: KeyframeAnimationOptions,
  ) {
    const run = this.run;
    const anim = node.animate(frames, options);
    this.anims.add(anim);
    if (this.frozen) anim.pause();
    const done = new Promise<void>((resolve) => {
      anim.finished.then(
        () => {
          this.anims.delete(anim);
          if (run === this.run) resolve();
        },
        () => this.anims.delete(anim),
      );
    });
    return { anim, done };
  }

  /** 光标所在的那块画面 */
  private box() {
    const hand = this.hand!;
    return (hand.offsetParent ?? this.stage).getBoundingClientRect();
  }

  private spot() {
    return this.spots.get(this.hand!) ?? { x: 0, y: 0 };
  }

  private place(point: Point) {
    const hand = this.hand!;
    this.spots.set(hand, point);
    hand.style.transform = `translate(${point.x}px, ${point.y}px)`;
  }

  private point(target: Target, at: readonly [number, number] = [0.5, 0.5]) {
    if (typeof target !== 'string' && !(target instanceof Element))
      return target;
    const node = typeof target === 'string' ? this.el(target) : target;
    if (!node) return this.spot();
    const box = this.box();
    const rect = node.getBoundingClientRect();
    return {
      x: rect.left - box.left + rect.width * at[0],
      y: rect.top - box.top + rect.height * at[1],
    };
  }

  private em() {
    return parseFloat(getComputedStyle(this.hand!).fontSize) || 16;
  }

  /** 走多久按走多远（以光标大小计），短的不慢、长的不拖 */
  private time(from: Point, to: Point) {
    const far = Math.hypot(to.x - from.x, to.y - from.y) / this.em();
    return Math.min(1150, Math.max(360, 300 + far * 34));
  }
}

/**
 * 把一个舞台交给编排：live 时播（进入视口、页面在前台、没按暂停），否则停在原处；
 * active 为假时只停不重摆（钉住的屏幕换走的那一块，淡出时保持原样），再轮到它时从空白开始；
 * hold 是访客亲手按出来的样子；still（减少动态）时停在做完的样子。
 */
export function useCue(
  ref: RefObject<HTMLElement | null>,
  name: string,
  {
    live,
    still,
    hold = null,
    active = true,
    round = 0,
  }: {
    live: boolean;
    still: boolean;
    hold?: string | null;
    active?: boolean;
    round?: number;
  },
) {
  const cue = useRef<Cue | null>(null);

  useEffect(() => {
    const node = ref.current;
    const scene = scenes[name];
    if (!node || !scene) return;
    const director = new Cue(node, scene);
    cue.current = director;
    return () => {
      director.finish();
      cue.current = null;
    };
  }, [ref, name]);

  // 换了一段编排（name）也从头摆一遍
  useEffect(() => {
    const director = cue.current;
    if (!director) return;
    director.quiet = still;
    if (hold) director.hold(hold);
    else if (still) director.finish();
    else if (active) director.ready();
    else director.pause();
  }, [name, hold, still, active, round]);

  useEffect(() => {
    const director = cue.current;
    if (!director) return;
    if (live && active && !hold && !still) director.play();
    else director.pause();
  }, [name, live, active, hold, still, round]);
}
