'use client';

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { WorkLicense } from './license';
import { workCases, workEnd, workHand, workHero, workStage, workWhy, type WorkBeatId } from '../../../content/site/work';
import { contactHref } from '../../_site/routes';
import { Btn, mediaOf, Phrases, Status } from '../../_site/ui';
import { Chat, H, Kinds, Ring, Term, W, Window, type Over, type Shown } from './desk';
import { Pickup, usePickup, useSel } from './pickup';

// 大屏：一扇窗从头到尾不离场。舞台钉住，照片一直在一块圆角台面里，离屏幕边一指宽；
// 每屏的标题在台面上方的纸上，镜头只在台面里推拉，一次只亮一处，字贴在亮处旁边。
// 宽不到 1024 或高不到 600、没有 JS 时不演这一套，换成 stack.tsx 的上下排法（两套都在服务端出好，CSS 只显示一套）；首屏的字两套共用一份。
// 减少动态：镜头不推拉，滚到哪一拍就直接停在哪一拍。

export const FLOW_MEDIA = '(min-width: 1024px) and (min-height: 600px)';

const STAGE = mediaOf('work-stage');

type Cam = {
  /** 窗宽占台面宽的比例 */
  w: number;
  /** 窗里对准的那一点（0–1） */
  fx: number;
  fy: number;
  /** 那一点放在台面上的位置（0–1） */
  sx: number;
  sy: number;
  /** 台面上沿（px，由 plateOf 算出） */
  st: number;
  /** 首屏的字、整扇窗压暗、窗的透明度、照片压暗 */
  ho: number;
  dim: number;
  wo: number;
  pd: number;
};

const BASE: Cam = { w: 0.64, fx: 0.5, fy: 0.5, sx: 0.5, sy: 0.5, st: 0, ho: 0, dim: 0, wo: 1, pd: 0 };

type Side = 'r' | 'l' | 'b';
/** 台面上沿让给谁：首屏的字、一行标题、两行标题、只让顶栏 */
type Plate = 'hero' | 'one' | 'two' | 'full';

type Beat = {
  id: 'hero' | 'use' | 'hand' | WorkBeatId | 'why' | 'coda' | 'end';
  /** 这一拍占几屏的滚动 */
  len: number;
  /** 前面这一段镜头停着，后面这段推向下一拍 */
  hold: number;
  cam: Partial<Cam>;
  plate?: Plate;
  /** 窗按台面高放得下的大小，不超过这个比例 */
  fit?: number;
  /** 亮的那一处（窗里的 data-f），镜头也对准它 */
  focus?: string;
  /** 贴在亮处哪一边 */
  side?: Side;
  /** 左右两边的标注落在亮处多高（0 顶、1 底），默认正中；右下角有终端时往上提 */
  ny?: number;
};

const NEAR = { pd: 0.38 };

const BEATS: Beat[] = [
  { id: 'hero', len: 1.1, hold: 0.04, plate: 'hero', fit: 0.58, cam: { ho: 1 } },
  { id: 'use', len: 0.9, hold: 0.45, cam: {} },
  { id: 'u1', len: 1, hold: 0.5, focus: 'goal', side: 'r', cam: { w: 1.02, sx: 0.37, sy: 0.5, ...NEAR } },
  { id: 'feed', len: 1, hold: 0.5, focus: 'inbox', side: 'b', cam: { w: 0.94, sx: 0.46, sy: 0.4, ...NEAR } },
  { id: 'talk', len: 1, hold: 0.5, focus: 'talk', side: 'l', cam: { w: 1.02, sx: 0.66, sy: 0.46, ...NEAR } },
  { id: 'code', len: 1.1, hold: 0.55, focus: 'code', side: 'b', cam: { w: 0.92, sx: 0.48, sy: 0.42, ...NEAR } },
  { id: 'wait', len: 1, hold: 0.5, focus: 'wait', side: 'l', cam: { w: 1, sx: 0.66, sy: 0.52, ...NEAR } },
  { id: 'hand', len: 0.9, hold: 0.45, cam: {} },
  { id: 'help', len: 1, hold: 0.5, focus: 'help', side: 'r', cam: { w: 1, sx: 0.4, sy: 0.5, ...NEAR } },
  { id: 'pick', len: 1.3, hold: 0.62, focus: 'pick', side: 'b', cam: { w: 0.94, sx: 0.48, sy: 0.4, ...NEAR } },
  { id: 'kinds', len: 1.1, hold: 0.5, cam: { w: 0.5, sx: 0.72, sy: 0.52, dim: 1, pd: 0.06 } },
  { id: 'shelf', len: 1, hold: 0.5, focus: 'shelf', side: 'b', cam: { w: 0.9, sx: 0.5, sy: 0.42, ...NEAR } },
  { id: 'mcp', len: 1, hold: 0.5, focus: 'mcp', side: 'r', cam: { w: 1, sx: 0.4, sy: 0.56, ...NEAR } },
  { id: 'grow', len: 1, hold: 0.5, focus: 'grow', side: 'r', cam: { w: 1, sx: 0.3, sy: 0.5, ...NEAR } },
  { id: 'why', len: 1.1, hold: 0.5, cam: { w: 0.5, sx: 0.72, sy: 0.52, dim: 1, pd: 0.06 } },
  { id: 'c1', len: 1.3, hold: 0.62, focus: 'goal', side: 'r', ny: 0.3, cam: { w: 1.02, sx: 0.33, sy: 0.5, ...NEAR } },
  { id: 'c2', len: 1, hold: 0.5, focus: 'fix', side: 'l', cam: { w: 1.02, sx: 0.66, sy: 0.46, ...NEAR } },
  { id: 'c3', len: 1, hold: 0.5, focus: 'head', side: 'r', cam: { w: 0.86, sx: 0.4, sy: 0.42, ...NEAR } },
  { id: 'coda', len: 1, hold: 0.5, plate: 'two', cam: { w: 0.56 } },
  { id: 'end', len: 1.2, hold: 1, plate: 'full', cam: { w: 0.3, wo: 0 } },
];

const NOTES: Partial<Record<Beat['id'], string>> = { ...workCases.notes, ...workHand.notes, ...workWhy.notes };

const I = Object.fromEntries(BEATS.map((beat, index) => [beat.id, index])) as Record<Beat['id'], number>;
const TOTAL = BEATS.reduce((sum, beat) => sum + beat.len, 0);
const KEYS = Object.keys(BASE) as (keyof Cam)[];

type Box = { x: number; y: number; w: number; h: number };

/** 这几拍窗上浮着一张卡 */
const OVER: Partial<Record<Beat['id'], Over>> = { wait: 'wait', help: 'help', mcp: 'mcp', grow: 'dock' };

/** 每一拍窗里的样子：工作面开哪一页、事情走到哪、右栏开哪一栏、浮着哪张卡 */
function shownAt(at: number, sel: 'a' | 'b', read?: 'a' | 'b'): Shown {
  const id = BEATS[at].id;
  const step = at >= I.hand ? 5 : at >= I.wait ? 4 : at >= I.code ? 3 : at >= I.talk ? 2 : at >= I.feed ? 1 : 0;
  return {
    view: id === 'feed' || id === 'talk' ? 'inbox' : id === 'code' ? 'code' : at >= I.hand && at <= I.grow ? 'doc' : 'goal',
    step,
    side: id === 'talk' ? 'talk' : id === 'shelf' ? 'shelf' : 'log',
    over: OVER[id],
    facts: at > I.help ? 'in' : 'typing',
    sel: id === 'pick' ? sel : undefined,
    shot: at > I.shelf ? 'in' : id === 'shelf' ? 'lift' : undefined,
    read: id === 'c1' ? read : undefined,
  };
}

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));
const ease = (k: number) => (k < 0.5 ? 4 * k * k * k : 1 - Math.pow(-2 * k + 2, 3) / 2);

function mix(a: Cam, b: Cam, k: number): Cam {
  const out = { ...a };
  for (const key of KEYS) out[key] = a[key] + (b[key] - a[key]) * k;
  return out;
}

/** 台面：离屏幕边一指宽、大圆角 */
function plateOf(kind: Plate, vw: number, vh: number, header: number) {
  const inset = clamp(vw * 0.014, 10, 20);
  const line = clamp(vw * 0.03, 28, 44) * 1.3;
  const above = header + clamp(vh * 0.032, 20, 32);
  const below = clamp(vh * 0.026, 16, 28);
  const top =
    kind === 'hero'
      ? vh * 0.37
      : kind === 'full'
        ? header + inset
        : above + (kind === 'two' ? 2 : 1) * line + below;
  return { inset, top, radius: clamp(vw * 0.02, 18, 28) };
}

/** 一处在窗里的位置（offset 不算 transform，镜头推到哪都量得准） */
function boxIn(node: HTMLElement, root: HTMLElement): Box {
  let x = 0;
  let y = 0;
  let at: HTMLElement | null = node;
  while (at && at !== root) {
    x += at.offsetLeft;
    y += at.offsetTop;
    at = at.offsetParent as HTMLElement | null;
  }
  return { x, y, w: node.offsetWidth, h: node.offsetHeight };
}

function union(a: Box, b: Box): Box {
  const x = Math.min(a.x, b.x);
  const y = Math.min(a.y, b.y);
  return { x, y, w: Math.max(a.x + a.w, b.x + b.w) - x, h: Math.max(a.y + a.h, b.y + b.h) - y };
}

export function Flow() {
  const track = useRef<HTMLDivElement>(null);
  const pin = useRef<HTMLDivElement>(null);
  const plate = useRef<HTMLDivElement>(null);
  const bg = useRef<HTMLDivElement>(null);
  const shade = useRef<HTMLElement>(null);
  const hero = useRef<HTMLDivElement>(null);
  const cam = useRef<HTMLElement>(null);
  const win = useRef<HTMLDivElement>(null);
  const wdim = useRef<HTMLElement>(null);
  const note = useRef<HTMLDivElement>(null);

  const [at, setAt] = useState(0);
  const [boxes, setBoxes] = useState<Record<string, Box>>({});
  const [fonts, setFonts] = useState(0);
  const pickup = usePickup();
  const atRef = useRef(0);
  const boxesRef = useRef(boxes);
  const kick = useRef(() => {});

  const beat = BEATS[at];
  const sel = useSel(at === I.pick);
  const shown = shownAt(at, sel, pickup.read);
  const focus = beat.focus;

  // 往回滚到四屏之前，换过的 AI 也还原
  const { reset } = pickup;
  const before = at < I.c1;
  useEffect(() => {
    if (before) reset();
  }, [before, reset]);

  // 量窗里每一处（设计尺寸里的坐标）；同名的几处合成一块
  const measure = useCallback(() => {
    const root = win.current;
    if (!root || !root.offsetWidth) return;
    const next: Record<string, Box> = {};
    root.querySelectorAll<HTMLElement>('[data-f]').forEach((node) => {
      const key = node.dataset.f!;
      const box = boxIn(node, root);
      next[key] = next[key] ? union(next[key], box) : box;
    });
    if (JSON.stringify(boxesRef.current) !== JSON.stringify(next)) {
      boxesRef.current = next;
      setBoxes(next);
    }
    kick.current();
  }, []);
  useLayoutEffect(() => measure(), [measure, at, fonts]);

  useEffect(() => {
    void document.fonts?.ready.then(() => setFonts((n) => n + 1));
  }, []);

  useEffect(() => {
    const root = track.current;
    const stage = pin.current;
    if (!root || !stage) return;
    const media = matchMedia(FLOW_MEDIA);
    const calm = matchMedia('(prefers-reduced-motion: reduce)');

    const start = () => {
      const words = hero.current;
      let frame = 0;
      let now: Cam | null = null;
      const header = parseFloat(getComputedStyle(stage).getPropertyValue('--header')) || 64;

      const camOf = (index: number): Cam => {
        const b = BEATS[index];
        const vw = stage.clientWidth;
        const vh = stage.clientHeight;
        const p = plateOf(b.plate ?? 'one', vw, vh, header);
        const next: Cam = { ...BASE, ...b.cam, st: p.top };
        // 首屏的字在矮一点的屏上会比 37vh 高：台面让到字的下面
        if (b.plate === 'hero' && hero.current) next.st = Math.max(p.top, header + hero.current.offsetHeight);
        if (b.fit) {
          p.top = next.st;
          const pw = vw - 2 * p.inset;
          const ph = vh - p.inset - p.top;
          next.w = Math.min(b.fit, (ph * 0.84 * W) / H / pw);
        }
        const box = b.focus ? boxesRef.current[b.focus] : undefined;
        if (box) {
          next.fx = (box.x + box.w / 2) / W;
          next.fy = (box.y + box.h / 2) / H;
        }
        return next;
      };

      const target = () => {
        const vh = stage.clientHeight || window.innerHeight;
        const t = clamp(-root.getBoundingClientRect().top / vh, 0, TOTAL - 1e-4);
        let index = 0;
        let begin = 0;
        while (index < BEATS.length - 1 && t >= begin + BEATS[index].len) {
          begin += BEATS[index].len;
          index += 1;
        }
        const b = BEATS[index];
        const u = (t - begin) / b.len;
        if (index === BEATS.length - 1 || u <= b.hold) return { cam: camOf(index), at: index, t };
        const k = (u - b.hold) / (1 - b.hold);
        const next = k < 0.5 ? index : index + 1;
        if (calm.matches) return { cam: camOf(next), at: next, t };
        return { cam: mix(camOf(index), camOf(index + 1), ease(k)), at: next, t };
      };

      const apply = (c: Cam, t: number) => {
        const vw = stage.clientWidth;
        const vh = stage.clientHeight;
        const { inset, radius } = plateOf('one', vw, vh, header);
        const pw = vw - 2 * inset;
        const ph = vh - inset - c.st;
        stage.style.setProperty('--pt', `${c.st}px`);
        stage.style.setProperty('--pi', `${inset}px`);
        if (plate.current) plate.current.style.clipPath = `inset(${c.st}px ${inset}px ${inset}px ${inset}px round ${radius}px)`;
        if (bg.current) bg.current.style.setProperty('--kb', calm.matches ? '1.05' : `${1.1 - 0.1 * (t / TOTAL)}`);
        if (shade.current) shade.current.style.opacity = `${c.pd}`;
        if (hero.current) {
          hero.current.style.opacity = `${c.ho}`;
          hero.current.style.transform = `translateY(${(c.ho - 1) * 48}px)`;
        }
        const s = (c.w * pw) / W;
        const left = inset + c.sx * pw - c.fx * W * s;
        const top = c.st + c.sy * ph - c.fy * H * s;
        if (cam.current) {
          cam.current.style.transform = `translate(${left}px, ${top}px) scale(${s})`;
          cam.current.style.opacity = `${c.wo}`;
        }
        if (wdim.current) wdim.current.style.opacity = `${c.dim * 0.6}`;

        // 标注跟着亮处走：设计坐标换成屏上坐标
        const b = BEATS[atRef.current];
        const fb = b.focus ? boxesRef.current[b.focus] : undefined;
        if (fb && b.side && note.current) {
          const pad = 14;
          const x0 = left + (fb.x - pad) * s;
          const x1 = left + (fb.x + fb.w + pad) * s;
          const y0 = top + (fb.y - pad) * s;
          const y1 = top + (fb.y + fb.h + pad) * s;
          const ax = b.side === 'r' ? x1 : b.side === 'l' ? x0 : x0 + 32;
          const ay = b.side === 'b' ? y1 : y0 + (y1 - y0) * (b.ny ?? 0.5);
          note.current.style.transform = `translate(${ax}px, ${ay}px)`;
        }
      };

      const tick = () => {
        frame = 0;
        const goal = target();
        if (goal.at !== atRef.current) {
          atRef.current = goal.at;
          setAt(goal.at);
        }
        const next = now && !calm.matches ? mix(now, goal.cam, 0.16) : goal.cam;
        let gap = 0;
        for (const key of KEYS) gap = Math.max(gap, Math.abs(next[key] - goal.cam[key]) / (key === 'st' ? 1000 : 1));
        now = gap < 4e-4 ? goal.cam : next;
        apply(now, goal.t);
        if (now !== goal.cam) frame = requestAnimationFrame(tick);
      };
      const request = () => {
        if (!frame) frame = requestAnimationFrame(tick);
      };
      kick.current = request;
      measure();
      request();
      window.addEventListener('scroll', request, { passive: true });
      window.addEventListener('resize', request);
      return () => {
        cancelAnimationFrame(frame);
        kick.current = () => {};
        words?.removeAttribute('style');
        window.removeEventListener('scroll', request);
        window.removeEventListener('resize', request);
      };
    };

    // 只在大屏演；窗口拉宽拉窄时跟着接上或停下
    let stop = () => {};
    const sync = () => {
      stop();
      stop = media.matches ? start() : () => {};
    };
    sync();
    media.addEventListener('change', sync);
    return () => {
      media.removeEventListener('change', sync);
      stop();
    };
  }, [measure]);

  // 亮处和标注：没有亮处的那几拍停在上一处，原地淡出
  const spot = focus ? boxes[focus] : undefined;
  const lastFocus = BEATS.slice(0, at + 1).findLast((b) => b.focus)?.focus;
  const lastSpot = lastFocus ? boxes[lastFocus] : undefined;
  const text = NOTES[beat.id];
  const lastNoted = BEATS.slice(0, at + 1).findLast((b) => NOTES[b.id] && b.side);
  const shownNote = lastNoted
    ? { text: NOTES[lastNoted.id]!, side: lastNoted.side!, stage: workStage[lastNoted.id as WorkBeatId] }
    : undefined;
  const [say, done] = workWhy.coda;
  const screen2 = at >= I.use && at <= I.wait;
  const screen3 = at >= I.hand && at <= I.grow;
  const screen4 = at >= I.why && at <= I.c3;

  return (
    <>
      {/* 首屏的字只有一份：大屏钉在舞台上方，随镜头淡出；窄屏就是页面开头 */}
      <header className="wk-hero" data-at={beat.id}>
        <div ref={hero} className="wk-hero-in">
          <div>
            <p className="m-tagline">
              <span>{workHero.form}</span>
              <Status>{workHero.stage}</Status>
            </p>
            <h1 className="wk-name" lang="en">
              Molis Work
            </h1>
            <p className="wk-lead">
              <Phrases text={workHero.title} />
            </p>
            <p className="wk-slogan" lang="en">
              {workHero.slogan}
            </p>
          </div>
          <div className="wk-hero-side" inert={at > I.hero}>
            <p className="wk-what">
              <Phrases text={workHero.what} />
            </p>
            <Btn href={contactHref('work')}>{workHero.go}</Btn>
          </div>
        </div>
      </header>

      <div className="wk-flow" data-at={beat.id}>
      <div ref={track} className="wk-track" style={{ height: `${(TOTAL + 1) * 100}vh` }}>
        <div ref={pin} className="wk-pin" data-tone="paper">

          <h2 className="wk-h" data-on={screen2 || undefined}>
            {workCases.title}
          </h2>
          <h2 className="wk-h" data-on={screen3 || undefined}>
            {workHand.title}
          </h2>
          <h2 className="wk-h" data-on={screen4 || undefined}>
            {workWhy.title}
          </h2>
          <p className="wk-h wk-coda" data-on={at === I.coda || undefined}>
            <span>{say}</span>
            <span>{done}</span>
          </p>

          <div ref={plate} className="wk-plate">
            <div ref={bg} className="wk-bg" aria-hidden="true">
              <img src={STAGE.src} srcSet={STAGE.srcset.map(([src, w]) => `${src} ${w}w`).join(', ')} sizes="100vw" alt="" />
              <i ref={shade} className="wk-shade" />
            </div>

            <figure ref={cam} className="wk-cam" aria-label={workHero.label}>
              <div ref={win} className="wk-win" aria-hidden="true">
                <Window s={shown} />
                <i ref={wdim} className="wk-wdim" />
                <i
                  className="wk-spot"
                  data-on={spot ? '' : undefined}
                  style={
                    lastSpot
                      ? { left: lastSpot.x - 14, top: lastSpot.y - 14, width: lastSpot.w + 28, height: lastSpot.h + 28 }
                      : undefined
                  }
                />
              </div>
            </figure>

            <Term id="u1" on={at === I.u1} />
            <Kinds on={at === I.kinds} />
            <Pickup on={at === I.c1} ai={pickup.ai} tried={pickup.reads > 0} onPick={pickup.pick} />
            <Chat on={at === I.why} />

            <div className="wk-end" data-on={at === I.end || undefined} inert={at !== I.end}>
              <p className="wk-end-origin">{workEnd.origin}</p>
              <h2 className="wk-end-belief">{workEnd.belief}</h2>
              <p className="wk-end-text">
                <Phrases text={workEnd.beliefText} />
              </p>
              <div className="wk-end-ask">
                <p className="wk-end-from">
                  <Ring tone="attention" />
                  {workEnd.ask.from}
                </p>
                <p className="wk-end-q">{workEnd.ask.question}</p>
                <Btn href={contactHref('work')}>{workHero.go}</Btn>
              </div>
              <p className="wk-end-own">{workWhy.own}</p>
              <WorkLicense />
            </div>

            <p className="wk-foot" data-on={at < I.end || undefined}>
              界面示意 · 示例数据
            </p>
          </div>

          <div
            ref={note}
            className="wk-note"
            data-side={shownNote?.side ?? 'r'}
            data-on={text && spot ? '' : undefined}
            aria-live="polite"
          >
            <i className="wk-note-line" />
            <p key={shownNote?.text} className="wk-note-card">
              {shownNote?.text}
              {shownNote?.stage ? (
                <span className="wk-note-tag">
                  <Status concept={shownNote.stage === '规划中'}>{shownNote.stage}</Status>
                </span>
              ) : null}
            </p>
          </div>
        </div>
      </div>
      </div>
    </>
  );
}
