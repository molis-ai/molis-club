'use client';
import {
  BookOpen,
  CalendarDays,
  ClipboardList,
  Code,
  Database,
  FileText,
  GitBranch,
  Image,
  Inbox,
  Library,
  Lightbulb,
  ListChecks,
  Package,
  PenTool,
  Plus,
  Presentation,
  Receipt,
  Rss,
  Target,
  Terminal,
  Timer,
  Workflow,
  Zap,
  type LucideIcon,
} from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { workWays, type Persona } from '../../../content/site/work';
import { useReducedMotion, useVisible } from '../../_site/motion';
import { usePersona } from './persona';

// 想怎么干：官方插件先整整齐齐排开，再一种一种拼成干法——一件事沿着线走过几站。
// 干法只是举例，按读者排序；最后一种是「你自己的」：缺的那一站让 AI 做一个。
// 插件与拼法整体都还在开发中（v0.2.0 只有 Goals、Sessions、Feed 等），所以整段标「开发中」，不逐个标。
// 画面由下面的脚本摆位（不进 React 渲染），只在视口里时轮播；减少动态时停在每种干法的结果。

type Plugin = { id: string; name: string; icon: LucideIcon; yours?: boolean };

const PLUGINS: Plugin[] = [
  { id: 'feed', name: 'Feed', icon: Rss },
  { id: 'inbox', name: 'Inbox', icon: Inbox },
  { id: 'shelf', name: 'Shelf', icon: Library },
  { id: 'lingguang', name: '灵光', icon: Lightbulb },
  { id: 'cognia', name: 'Cognia', icon: BookOpen },
  { id: 'alchemist', name: '炼金术士', icon: Zap },
  { id: 'pages', name: 'Pages', icon: FileText },
  { id: 'cgs', name: 'CGS 创作', icon: PenTool },
  { id: 'ppt', name: 'PPT', icon: Presentation },
  { id: 'form', name: 'Forms', icon: ClipboardList },
  { id: 'dataset', name: 'Dataset', icon: Database },
  { id: 'images', name: '图片', icon: Image },
  { id: 'todo', name: '待办', icon: ListChecks },
  { id: 'jelly', name: 'Jelly', icon: CalendarDays },
  { id: 'schedule', name: 'Schedule', icon: Timer },
  { id: 'goals', name: 'Goals', icon: Target },
  { id: 'sessions', name: 'Sessions', icon: Terminal },
  { id: 'coding', name: 'Coding', icon: Code },
  { id: 'git', name: 'Git', icon: GitBranch },
  { id: 'artifacts', name: '成果', icon: Package },
  { id: 'workflows', name: '工作流程', icon: Workflow },
  { id: 'yours', name: '你做的插件', icon: Plus, yours: true },
];

type Recipe = {
  name: string;
  token: string;
  steps: { id: string; chip: string; morph?: boolean }[];
};

const RECIPES: Record<string, Recipe> = {
  indie: {
    name: '独立开发',
    token: '一条用户反馈',
    steps: [
      { id: 'feed', chip: 'App Store 新评论' },
      { id: 'inbox', chip: '判断：要处理' },
      { id: 'goals', chip: '提成目标' },
      { id: 'sessions', chip: '交给 Codex' },
      { id: 'git', chip: '提交先给你看' },
      { id: 'artifacts', chip: '固定这一版' },
    ],
  },
  oss: {
    name: '开源维护',
    token: '一个新 issue',
    steps: [
      { id: 'feed', chip: '新 issue' },
      { id: 'cognia', chip: '查以前的讨论' },
      { id: 'goals', chip: '挂到下个版本' },
      { id: 'coding', chip: '和 Claude Code 修' },
      { id: 'git', chip: '开 PR 先给你看' },
      { id: 'pages', chip: '写进更新日志' },
    ],
  },
  techwrite: {
    name: '技术写作',
    token: '一次技术分享',
    steps: [
      { id: 'lingguang', chip: '录音记成灵光' },
      { id: 'cognia', chip: '查自己的笔记' },
      { id: 'pages', chip: '写成长文' },
      { id: 'images', chip: '配示意图' },
      { id: 'cgs', chip: '改成各平台版本' },
      { id: 'schedule', chip: '到点提醒你发' },
    ],
  },
  media: {
    name: '自媒体运营',
    token: '一条同行视频',
    steps: [
      { id: 'feed', chip: '订阅的频道更新' },
      { id: 'lingguang', chip: '读字幕，记选题' },
      { id: 'cgs', chip: '写成小红书' },
      { id: 'images', chip: '配三张图' },
      { id: 'jelly', chip: '排进周四 20:00' },
    ],
  },
  startup: {
    name: '创业项目分析',
    token: '一个市场机会',
    steps: [
      { id: 'alchemist', chip: '炼成三个方向' },
      { id: 'cognia', chip: '查行业资料' },
      { id: 'form', chip: '做访谈问卷' },
      { id: 'dataset', chip: '汇总 24 份答卷' },
      { id: 'ppt', chip: '做成路演稿' },
      { id: 'goals', chip: '拆成 MVP' },
    ],
  },
  research: {
    name: '写研究',
    token: '一个研究问题',
    steps: [
      { id: 'feed', chip: '订阅报告和论文' },
      { id: 'shelf', chip: '放进 PDF' },
      { id: 'cognia', chip: '按资料回答' },
      { id: 'dataset', chip: '整理成数据表' },
      { id: 'pages', chip: '写成报告' },
      { id: 'artifacts', chip: '固定这一版' },
    ],
  },
  yours: {
    name: workWays.yours,
    token: '一封账单邮件',
    steps: [
      { id: 'inbox', chip: '收到账单' },
      { id: 'yours', chip: '让 AI 做个账单提醒', morph: true },
      { id: 'todo', chip: '记成待办' },
      { id: 'schedule', chip: '到期前提醒' },
    ],
  },
};

type Pos = { x: number; y: number; s: number };

/** 走一段的时长（毫秒） */
const SEGMENT = 760;

/** 和全站一样的缓动 --ease：cubic-bezier(0.2, 0.7, 0.1, 1) */
function ease(x: number) {
  const curve = (t: number, a: number, b: number) =>
    3 * (1 - t) ** 2 * t * a + 3 * (1 - t) * t ** 2 * b + t ** 3;
  let lo = 0;
  let hi = 1;
  for (let i = 0; i < 20; i += 1) {
    const mid = (lo + hi) / 2;
    if (curve(mid, 0.2, 0.1) < x) lo = mid;
    else hi = mid;
  }
  return curve((lo + hi) / 2, 0.7, 1);
}

/** 换了读者就整段重来：从整整齐齐的插件开始 */
export function Ways() {
  const { persona } = usePersona();
  return <WaysInner key={persona} persona={persona} />;
}

function WaysInner({ persona }: { persona: Persona }) {
  const reduced = useReducedMotion();
  const stage = useRef<HTMLElement>(null);
  const visible = useVisible(stage, 0.3);
  const [current, setCurrent] = useState('grid');
  const [auto, setAuto] = useState(true);
  const [run, setRun] = useState(0);

  useEffect(() => {
    const root = stage.current;
    if (!root) return;
    let alive = true;
    let timer = 0;
    let frame = 0;
    const instant = reduced || !visible;
    const sleep = (ms: number) =>
      new Promise<void>((done) => {
        timer = window.setTimeout(done, instant ? 0 : ms);
      });
    const tiles = new Map<string, HTMLElement>();
    root.querySelectorAll<HTMLElement>('.ww-tile').forEach((node) => tiles.set(node.dataset.id!, node));
    const path = root.querySelector<SVGPathElement>('.ww-path')!;
    const rail = root.querySelector<SVGPathElement>('.ww-rail')!;
    root.querySelectorAll('.ww-chip, .ww-token').forEach((n) => n.remove());
    root.toggleAttribute('data-jump', instant);

    const width = root.clientWidth;
    if (width < 40) return;
    const mobile = width < 640;
    const height = mobile ? 520 : 460;
    root.style.height = `${height}px`;
    const T = mobile ? 40 : 52;
    root.style.setProperty('--t', `${T}px`);

    const pos = new Map<string, Pos>();
    const put = (id: string, x: number, y: number, s = 1) => {
      const el = tiles.get(id)!;
      el.style.transform = `translate(${x - (T * (1 - s)) / 2}px, ${y - (T * (1 - s)) / 2}px) scale(${s})`;
      pos.set(id, { x, y, s });
    };

    const yours = tiles.get('yours')!;
    const setYours = (made: boolean) => {
      yours.toggleAttribute('data-made', made);
    };
    tiles.forEach((el) => el.removeAttribute('data-lit'));
    tiles.forEach((el) => el.removeAttribute('data-dim'));
    tiles.forEach((el) => el.removeAttribute('data-mini'));
    path.setAttribute('d', '');
    rail.setAttribute('d', '');

    // 整整齐齐排开：每行几个，空着一格留给你自己做的
    const grid = () => {
      const per = mobile ? 5 : 8;
      const pitchX = Math.min(mobile ? 66 : 112, (width - 40) / per);
      const pitchY = T + (mobile ? 36 : 44);
      const rows = Math.ceil(PLUGINS.length / per);
      const top = (height - rows * pitchY) / 2 + 6;
      PLUGINS.forEach((p, index) => {
        const r = Math.floor(index / per);
        const inRow = Math.min(per, PLUGINS.length - r * per);
        const left = (width - inRow * pitchX) / 2 + (pitchX - T) / 2;
        put(p.id, left + (index % per) * pitchX, top + r * pitchY);
      });
    };

    const recipe = (key: string) => {
      const r = RECIPES[key];
      const chosen = r.steps.map((s) => s.id);
      const rest = PLUGINS.map((p) => p.id).filter((id) => !chosen.includes(id));
      // 没用上的缩小排在上方一行
      const s = 0.5;
      const size = T * s;
      const gap = mobile ? 6 : 10;
      const perRow = Math.max(6, Math.floor((width - 32) / (size + gap)));
      rest.forEach((id, index) => {
        const row = Math.floor(index / perRow);
        const inRow = Math.min(perRow, rest.length - row * perRow);
        const left = (width - inRow * (size + gap) + gap) / 2;
        put(id, left + (index % perRow) * (size + gap) - (T - size) / 2, 18 + row * (size + 10) - (T - size) / 2, s);
        const el = tiles.get(id)!;
        el.setAttribute('data-mini', '');
        el.setAttribute('data-dim', '');
      });
      const trayBottom = 18 + Math.ceil(rest.length / perRow) * (size + 10);
      // 用上的沿一条线排开
      const n = chosen.length;
      const regionTop = trayBottom + (mobile ? 40 : 56);
      const regionBottom = height - (mobile ? 70 : 84);
      const points: { x: number; y: number }[] = [];
      chosen.forEach((id, i) => {
        let x: number;
        let y: number;
        if (!mobile) {
          const pad = Math.max(70, width * 0.09);
          x = n === 1 ? width / 2 : pad + (i * (width - 2 * pad)) / (n - 1);
          const mid = (regionTop + regionBottom) / 2 - 12;
          y = mid + (i % 2 ? 46 : -46);
        } else {
          const per = 2;
          const row = Math.floor(i / per);
          let col = i % per;
          if (row % 2 === 1) col = per - 1 - col;
          x = width * (col === 0 ? 0.28 : 0.72);
          y = regionTop + 30 + row * Math.min(130, (regionBottom - regionTop) / Math.ceil(n / per));
        }
        put(id, x - T / 2, y - T / 2);
        points.push({ x, y });
      });
      let d = `M${points[0].x},${points[0].y}`;
      for (let i = 0; i < points.length - 1; i += 1) {
        const p0 = points[i - 1] ?? points[i];
        const p1 = points[i];
        const p2 = points[i + 1];
        const p3 = points[i + 2] ?? p2;
        d += ` C${p1.x + (p2.x - p0.x) / 6},${p1.y + (p2.y - p0.y) / 6} ${p2.x - (p3.x - p1.x) / 6},${p2.y - (p3.y - p1.y) / 6} ${p2.x},${p2.y}`;
      }
      rail.setAttribute('d', d);
      path.setAttribute('d', d);
      const chips = r.steps.map((step, i) => {
        const chip = document.createElement('span');
        chip.className = 'ww-chip';
        if (i === r.steps.length - 1) chip.dataset.last = '';
        chip.textContent = step.chip;
        chip.style.left = `${points[i].x}px`;
        chip.style.top = `${points[i].y + T / 2 + (mobile ? 18 : 22)}px`;
        root.appendChild(chip);
        return chip;
      });
      return { r, points, chips };
    };

    const visit = (r: Recipe, chips: HTMLElement[], i: number) => {
      const step = r.steps[i];
      const el = tiles.get(step.id)!;
      if (step.morph) setYours(true);
      el.setAttribute('data-lit', '');
      chips[i].setAttribute('data-on', '');
    };

    void (async () => {
      setYours(false);
      if (current === 'grid') {
        grid();
        root.dataset.mode = 'grid';
        await sleep(4200);
      } else {
        root.dataset.mode = 'recipe';
        const { r, points, chips } = recipe(current);
        if (instant) {
          path.style.transition = 'none';
          path.style.strokeDashoffset = '0';
          r.steps.forEach((_, i) => visit(r, chips, i));
          await sleep(4600);
        } else {
          const length = path.getTotalLength();
          path.style.transition = 'none';
          path.style.strokeDasharray = `${length}`;
          path.style.strokeDashoffset = `${length}`;
          await sleep(1000);
          if (!alive) return;
          path.getBoundingClientRect();
          path.style.transition = 'stroke-dashoffset 1.1s var(--ease)';
          path.style.strokeDashoffset = '0';
          await sleep(1100);
          if (!alive) return;
          // 一件事沿着线走过每一站
          const marks = points.map((p) => {
            let best = 0;
            let bestD = Infinity;
            for (let k = 0; k <= 200; k += 1) {
              const q = path.getPointAtLength((k / 200) * length);
              const dd = (q.x - p.x) ** 2 + (q.y - p.y) ** 2;
              if (dd < bestD) {
                bestD = dd;
                best = (k / 200) * length;
              }
            }
            return best;
          });
          const token = document.createElement('span');
          token.className = 'ww-token';
          token.textContent = r.token;
          root.appendChild(token);
          const tw = token.offsetWidth;
          const th = token.offsetHeight;
          const go = (len: number) => {
            const q = path.getPointAtLength(len);
            token.style.transform = `translate(${q.x - tw / 2}px, ${q.y - th - T / 2 - 12}px)`;
          };
          go(0);
          token.setAttribute('data-on', '');
          visit(r, chips, 0);
          await sleep(700);
          if (!alive) return;
          // 一站一站走：每段用全站同一条缓动，到站时轻轻落定
          for (let i = 1; i < marks.length; i += 1) {
            const from = marks[i - 1];
            const to = marks[i];
            const start = performance.now();
            await new Promise<void>((done) => {
              const tick = (now: number) => {
                if (!alive) return done();
                const t = Math.min(1, (now - start) / SEGMENT);
                go(from + (to - from) * ease(t));
                if (t < 1) frame = requestAnimationFrame(tick);
                else done();
              };
              frame = requestAnimationFrame(tick);
            });
            if (!alive) return;
            visit(r, chips, i);
            await sleep(220);
            if (!alive) return;
          }
          await sleep(500);
          token.removeAttribute('data-on');
          await sleep(3000);
        }
      }
      if (!alive || instant || !auto) return;
      const order = ['grid', ...workWays.order[persona]];
      setCurrent(order[(order.indexOf(current) + 1) % order.length]);
    })();

    return () => {
      alive = false;
      window.clearTimeout(timer);
      cancelAnimationFrame(frame);
    };
  }, [current, persona, visible, auto, reduced, run]);

  const recipeKey = current === 'grid' ? null : current;
  return (
    <div className="ww">
      <div className="ww-bar">
        <fieldset className="ww-tabs">
          <legend className="sr-only">{workWays.label}</legend>
          <button
            type="button"
            aria-pressed={current === 'grid'}
            onClick={() => {
              setCurrent('grid');
              setRun((v) => v + 1);
            }}
          >
            {workWays.all}
          </button>
          {workWays.order[persona].map((key) => (
            <button
              key={key}
              type="button"
              aria-pressed={current === key}
              onClick={() => {
                setCurrent(key);
                setRun((v) => v + 1);
              }}
            >
              {RECIPES[key].name}
            </button>
          ))}
        </fieldset>
        {reduced ? null : (
          <button
            type="button"
            className="wt-auto"
            aria-pressed={auto}
            onClick={() => {
              setAuto((v) => !v);
              setRun((v) => v + 1);
            }}
          >
            <i aria-hidden="true" />
            {auto ? '自动播放' : '已暂停'}
          </button>
        )}
      </div>
      <figure
        className="ww-stage"
        ref={stage}
        aria-label={
          recipeKey
            ? `示意：${RECIPES[recipeKey].name}，${RECIPES[recipeKey].steps.map((s) => s.chip).join('，')}。`
            : '示意：Molis Work 的官方插件排开，还空着一格留给你自己做的插件。'
        }
      >
        <svg className="ww-lines" aria-hidden="true">
          <path className="ww-rail" />
          <path className="ww-path" />
        </svg>
        {PLUGINS.map((p) => (
          <span
            key={p.id}
            className="ww-tile"
            data-id={p.id}
            data-yours={p.yours || undefined}
            aria-hidden="true"
          >
            <span className="ww-ico">
              {p.yours ? (
                <>
                  <Plus className="ww-plus" aria-hidden="true" />
                  <Receipt className="ww-made" aria-hidden="true" />
                </>
              ) : (
                <p.icon aria-hidden="true" />
              )}
            </span>
            <span className="ww-name">
              {p.yours ? (
                <>
                  <span className="ww-plus">{p.name}</span>
                  <span className="ww-made">账单提醒</span>
                </>
              ) : (
                p.name
              )}
            </span>
          </span>
        ))}
      </figure>
      <p className="ww-cap" aria-live="polite">
        <span className="m-note">{workWays.note}</span>
        <span className="m-note">{workWays.status}</span>
        {recipeKey ? (
          <>
            <b>{RECIPES[recipeKey].name}</b>
            {recipeKey === 'yours' ? <span>缺的那一站，让 AI 做一个。</span> : null}
          </>
        ) : (
          <>
            <b>{workWays.all}</b>
            <span>{workWays.allNote}</span>
          </>
        )}
      </p>
    </div>
  );
}
