'use client';

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { toolDesk, toolEnd, toolHero, toolUse, toolWhy, type ToolBeatId } from '../../../content/site/tool';
import { contactHref, productHref } from '../../_site/routes';
import { Btn, More, Phrases, Status } from '../../_site/ui';
import { Mark } from './parts';
import { PlugCard, usePlug } from './plug';
import { Before, H, Screen, shownAt, W, type BeatId } from './screen';
import { selectNode } from './selection';

// 大屏：一块 Mac 屏幕从头到尾不离场（写法照 Work 页第三轮）。舞台钉住，屏幕放在一块圆角台面里，离屏幕边一指宽；
// 每屏的标题在台面上方的纸上，镜头只在台面里推拉，一次只亮一处，字贴在亮处旁边。
// 宽不到 1024 或高不到 600、没有 JS 时不演这一套，换成 stack.tsx 的上下排法（两套都在服务端出好，CSS 只显示一套）；首屏的字两套共用一份。
// 减少动态：镜头不推拉，滚到哪一拍就直接停在哪一拍。

export const FLOW_MEDIA = '(min-width: 1024px) and (min-height: 600px)';

type Cam = {
  /** 屏幕宽占台面宽的比例 */
  w: number;
  /** 屏幕里对准的那一点（0–1） */
  fx: number;
  fy: number;
  /** 那一点放在台面上的位置（0–1） */
  sx: number;
  sy: number;
  /** 台面上沿（px，由 plateOf 算出） */
  st: number;
  /** 首屏的字、整块屏幕压暗、屏幕的透明度 */
  ho: number;
  dim: number;
  wo: number;
};

const BASE: Cam = { w: 0.62, fx: 0.5, fy: 0.5, sx: 0.5, sy: 0.5, st: 0, ho: 0, dim: 0, wo: 1 };

type Side = 'r' | 'l' | 'b';
/** 台面上沿让给谁：首屏的字、一行标题、只让顶栏 */
type Plate = 'hero' | 'one' | 'full';

type Beat = {
  id: BeatId;
  /** 这一拍占几屏的滚动 */
  len: number;
  /** 前面这一段镜头停着，后面这段推向下一拍 */
  hold: number;
  cam: Partial<Cam>;
  plate?: Plate;
  /** 屏幕按台面高放得下的大小，不超过这个比例 */
  fit?: number;
  /** 亮的那一处（屏幕里的 data-f），镜头也对准它 */
  focus?: string;
  /** 只照亮、镜头不对准的那一处 */
  spot?: string;
  /** 标注贴在亮处哪一边 */
  side?: Side;
  /** 左右两边的标注落在亮处多高（0 顶、1 底），默认正中 */
  ny?: number;
};

const BEATS: Beat[] = [
  { id: 'hero', len: 1.1, hold: 0.04, plate: 'hero', fit: 0.62, cam: { ho: 1 } },
  { id: 'use', len: 0.9, hold: 0.45, cam: {} },
  { id: 'u1', len: 1, hold: 0.5, focus: 'meet', side: 'l', cam: { w: 1.2, sx: 0.6, sy: 0.5 } },
  { id: 'u2', len: 1.1, hold: 0.55, focus: 'pdf', side: 'r', cam: { w: 1.15, sx: 0.4, sy: 0.5 } },
  { id: 'u3', len: 1.1, hold: 0.55, focus: 'date', side: 'l', cam: { w: 1.15, sx: 0.6, sy: 0.5 } },
  { id: 'u4', len: 1, hold: 0.5, focus: 'later', side: 'l', cam: { w: 1.15, sx: 0.62, sy: 0.5 } },
  { id: 'why', len: 1.1, hold: 0.5, cam: { w: 0.5, sx: 0.72, sy: 0.52, dim: 1 } },
  { id: 'c1', len: 1.1, hold: 0.55, focus: 'quote', side: 'l', cam: { w: 1.25, sx: 0.62, sy: 0.5 } },
  { id: 'c2', len: 1, hold: 0.5, focus: 'quote', side: 'l', ny: 0.75, cam: { w: 1.4, sx: 0.62, sy: 0.48 } },
  { id: 'c3', len: 1.3, hold: 0.62, focus: 'plug', side: 'r', ny: 0.3, cam: { w: 1.1, sx: 0.4, sy: 0.5 } },
  { id: 'coda', len: 1, hold: 0.5, spot: 'mark', cam: { w: 0.56 } },
  { id: 'end', len: 1.2, hold: 1, plate: 'full', cam: { w: 0.3, wo: 0 } },
];

const NOTES: Partial<Record<BeatId, string>> = { ...toolUse.notes, ...toolWhy.notes };
/** 标注下面再挂一行小字：日程草稿还在打磨 */
const MORE: Partial<Record<ToolBeatId, string>> = { u3: toolUse.wip };

const I = Object.fromEntries(BEATS.map((beat, index) => [beat.id, index])) as Record<BeatId, number>;
const TOTAL = BEATS.reduce((sum, beat) => sum + beat.len, 0);
const KEYS = Object.keys(BASE) as (keyof Cam)[];

type Box = { x: number; y: number; w: number; h: number };

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
  const top = kind === 'hero' ? vh * 0.37 : kind === 'full' ? header + inset : above + line + below;
  return { inset, top, radius: clamp(vw * 0.02, 18, 28) };
}

/** 一处在屏幕里的位置（offset 不算 transform，镜头推到哪都量得准） */
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

/** 首屏右边那句「可以选中」：按钮替你选中「是什么」那一句（给不方便拖选的人） */
export function TryHint() {
  return (
    <p className="tl-hint">
      <span>{toolHero.hint}</span>
      <button
        type="button"
        className="m-link"
        onClick={(event) => selectNode(document.querySelector<HTMLElement>('.tl-what'), event.detail === 0)}
      >
        {toolHero.pick}
      </button>
    </p>
  );
}

export function Flow() {
  const track = useRef<HTMLDivElement>(null);
  const pin = useRef<HTMLDivElement>(null);
  const plate = useRef<HTMLDivElement>(null);
  const hero = useRef<HTMLDivElement>(null);
  const cam = useRef<HTMLElement>(null);
  const scr = useRef<HTMLDivElement>(null);
  const dim = useRef<HTMLElement>(null);
  const note = useRef<HTMLDivElement>(null);

  const [at, setAt] = useState(0);
  const [boxes, setBoxes] = useState<Record<string, Box>>({});
  const [fonts, setFonts] = useState(0);
  const plug = usePlug();
  const atRef = useRef(0);
  const boxesRef = useRef(boxes);
  const kick = useRef(() => {});

  const beat = BEATS[at];
  const shown = shownAt(beat.id, plug.on);

  // 量屏幕里每一处（设计尺寸里的坐标）；同名的几处合成一块
  const measure = useCallback(() => {
    const root = scr.current;
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
          next.w = Math.min(b.fit, (ph * 0.86 * W) / H / pw);
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
        if (index === BEATS.length - 1 || u <= b.hold) return { cam: camOf(index), at: index };
        const k = (u - b.hold) / (1 - b.hold);
        const next = k < 0.5 ? index : index + 1;
        if (calm.matches) return { cam: camOf(next), at: next };
        return { cam: mix(camOf(index), camOf(index + 1), ease(k)), at: next };
      };

      const apply = (c: Cam) => {
        const vw = stage.clientWidth;
        const vh = stage.clientHeight;
        const { inset, radius } = plateOf('one', vw, vh, header);
        const pw = vw - 2 * inset;
        const ph = vh - inset - c.st;
        stage.style.setProperty('--pt', `${c.st}px`);
        stage.style.setProperty('--pi', `${inset}px`);
        if (plate.current) plate.current.style.clipPath = `inset(${c.st}px ${inset}px ${inset}px ${inset}px round ${radius}px)`;
        if (hero.current) {
          hero.current.style.opacity = `${c.ho}`;
          hero.current.style.transform = `translateY(${(c.ho - 1) * 48}px)`;
        }
        const s = (c.w * pw) / W;
        let left = inset + c.sx * pw - c.fx * W * s;
        let top = c.st + c.sy * ph - c.fy * H * s;
        // 推得比台面大的时候，屏幕的边不露进台面
        if (W * s > pw) left = clamp(left, inset + pw - W * s, inset);
        if (H * s > ph) top = clamp(top, c.st + ph - H * s, c.st);
        if (cam.current) {
          cam.current.style.transform = `translate(${left}px, ${top}px) scale(${s})`;
          cam.current.style.opacity = `${c.wo}`;
        }
        if (dim.current) dim.current.style.opacity = `${c.dim * 0.62}`;

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
        apply(now);
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
  const spotKey = beat.focus ?? beat.spot;
  const spot = spotKey ? boxes[spotKey] : undefined;
  const lastKey = BEATS.slice(0, at + 1).findLast((b) => b.focus ?? b.spot);
  const lastSpot = lastKey ? boxes[(lastKey.focus ?? lastKey.spot)!] : undefined;
  const text = NOTES[beat.id];
  const lastNoted = BEATS.slice(0, at + 1).findLast((b) => NOTES[b.id] && b.side);
  const shownNote = lastNoted
    ? { text: NOTES[lastNoted.id]!, more: MORE[lastNoted.id as ToolBeatId], side: lastNoted.side! }
    : undefined;
  const screen2 = at >= I.use && at <= I.u4;
  const screen3 = at >= I.why && at <= I.c3;

  return (
    <>
      {/* 首屏的字只有一份：大屏钉在舞台上方，随镜头淡出；窄屏就是页面开头 */}
      <header className="tl-hero" data-at={beat.id}>
        <div ref={hero} className="tl-hero-in">
          <div>
            <p className="m-tagline">
              <span>{toolHero.form}</span>
              <Status>{toolHero.stage}</Status>
            </p>
            <h1 className="tl-name" lang="en">
              Molis Tool
            </h1>
            <p className="tl-lead">
              <Phrases text={toolHero.title} />
            </p>
          </div>
          <div className="tl-hero-side" inert={at > I.hero}>
            <p className="tl-what">
              <Phrases text={toolHero.what} />
            </p>
            <Btn href={contactHref('tool')}>{toolHero.go}</Btn>
            <TryHint />
          </div>
        </div>
      </header>

      <div className="tl-flow" data-at={beat.id}>
        <div ref={track} className="tl-track" style={{ height: `${(TOTAL + 1) * 100}vh` }}>
          <div ref={pin} className="tl-pin">
            <h2 className="tl-h" data-on={screen2 || undefined}>
              {toolUse.title}
            </h2>
            <h2 className="tl-h" data-on={screen3 || undefined}>
              {toolWhy.title}
            </h2>
            <p className="tl-h" data-on={at === I.coda || undefined}>
              {toolWhy.coda}
            </p>

            <div ref={plate} className="tl-plate">
              <figure ref={cam} className="tl-cam" aria-label={toolHero.label}>
                <div ref={scr} className="tl-scr-box" aria-hidden="true">
                  <Screen s={shown} eager />
                  <i ref={dim} className="tl-dim" />
                  <i
                    className="tl-spot"
                    data-on={spot ? '' : undefined}
                    data-small={spotKey === 'mark' || undefined}
                    style={
                      lastSpot
                        ? { left: lastSpot.x - 14, top: lastSpot.y - 14, width: lastSpot.w + 28, height: lastSpot.h + 28 }
                        : undefined
                    }
                  />
                </div>
              </figure>

              <div className="tl-before" data-on={at === I.why || undefined}>
                <Before />
                <p className="tl-before-note">{toolWhy.before.text}</p>
              </div>
              <PlugCard shown={at === I.c3} on={plug.on} tried={plug.tried} onFlip={plug.flip} />

              <div className="tl-end" data-on={at === I.end || undefined} inert={at !== I.end}>
                <h2 className="tl-end-belief">
                  <Phrases text={toolEnd.belief} />
                </h2>
                <p className="tl-end-text">
                  <Phrases text={toolEnd.text} />
                  <More href={productHref.work}>{toolEnd.work}</More>
                </p>
                <div className="tl-end-ask">
                  <p className="tl-end-from">
                    <Mark dot />
                    {toolEnd.ask.from}
                  </p>
                  <p className="tl-end-q">{toolEnd.ask.question}</p>
                  <Btn href={contactHref('tool')}>{toolHero.go}</Btn>
                </div>
                <p className="tl-end-own">{toolEnd.own}</p>
              </div>

              <p className="tl-foot" data-on={at < I.end || undefined}>
                {toolDesk.foot}
              </p>
            </div>

            <div
              ref={note}
              className="tl-note"
              data-side={shownNote?.side ?? 'r'}
              data-on={text && spot ? '' : undefined}
              aria-live="polite"
            >
              <i className="tl-note-line" />
              <div key={shownNote?.text} className="tl-note-card">
                <p>{shownNote?.text}</p>
                {shownNote?.more ? <p className="tl-note-more">{shownNote.more}</p> : null}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
