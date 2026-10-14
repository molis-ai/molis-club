'use client';
import { Check, Plus } from 'lucide-react';
import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import {
  hereList,
  storyWorlds,
  type StoryWorld,
} from '../../../content/site/story';
import { worldMoments } from '../../_site/scenes/story';
import { useReducedMotion } from '../../_site/motion';

// Story 页：页面本身就是「此处」。
// · Here：页面顶部的「此处」清单（去过哪里 / 未完的旅程 / 带回来的）。
// · Walk：一个世界一扇拱窗。滚进去，窗放大到整屏（走进去），换成这个世界的颜色，演一个瞬间；再滚，画面收回成窗，回到白纸。
// · 标志性交互：每个世界的最后一步可以「带回『此处』」，纪念物真的落进页面顶部的清单（也记在本机浏览器里，下次来还在）。
// 减少动态、没有 JS：窗不放大，整幅画面停在这个瞬间的结果上。

const KEY = 'molis-story-here';

type Here = { brought: string[]; add: (item: string) => void };
const HereContext = createContext<Here>({ brought: [], add: () => {} });

function readSaved(): string[] {
  try {
    const raw = window.localStorage.getItem(KEY);
    const list = raw ? (JSON.parse(raw) as unknown) : [];
    return Array.isArray(list)
      ? list.filter((item) => typeof item === 'string')
      : [];
  } catch {
    return [];
  }
}

export function HereProvider({ children }: { children: ReactNode }) {
  const [brought, setBrought] = useState<string[]>([]);
  // 进页面后读一次本机记下的（读不到就当没有）
  useEffect(() => {
    const saved = readSaved();
    if (saved.length) queueMicrotask(() => setBrought(saved));
  }, []);
  const add = (item: string) =>
    setBrought((list) => {
      if (list.includes(item)) return list;
      const next = [...list, item];
      try {
        window.localStorage.setItem(KEY, JSON.stringify(next));
      } catch {
        // 存不下也没关系，这一页里照样看得见
      }
      return next;
    });
  return (
    <HereContext.Provider value={{ brought, add }}>
      {children}
    </HereContext.Provider>
  );
}

/** 页面顶部的「此处」清单 */
export function HereList() {
  const { brought } = useContext(HereContext);
  const t = hereList;
  const all = [...brought.slice().reverse(), ...t.brought];
  return (
    <div className="st-place-list" id={t.id} tabIndex={-1}>
      <div>
        <h3>{t.columns.visited}</h3>
        <ul>
          {t.visited.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </div>
      <div>
        <h3>{t.columns.unfinished}</h3>
        <ul>
          {t.unfinished.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </div>
      <div>
        <h3>{t.columns.brought}</h3>
        <ul aria-live="polite">
          {all.map((item, index) => (
            <li key={item} data-new={index < brought.length || undefined}>
              {item}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

/** 右下角一枚小签：带回东西时轻轻亮一下，点它回到页面顶部的「此处」 */
export function HereChip() {
  const { brought } = useContext(HereContext);
  const [pulse, setPulse] = useState(0);
  const count = useRef(brought.length);
  useEffect(() => {
    if (brought.length > count.current)
      queueMicrotask(() => setPulse((n) => n + 1));
    count.current = brought.length;
  }, [brought.length]);
  if (!brought.length) return null;
  return (
    <a
      className="st-chip"
      href={`#${hereList.id}`}
      key={pulse}
      data-pulse={pulse || undefined}
    >
      <span className="m-dot" />
      {hereList.chip} · {brought.length + hereList.brought.length}
    </a>
  );
}

const smooth = (t: number) => t * t * (3 - 2 * t);
const clamp = (t: number) => Math.min(1, Math.max(0, t));

/** 一个世界：拱窗放大到整屏，演一个瞬间，再收回 */
export function Walk({ world, index }: { world: StoryWorld; index: number }) {
  const scene = worldMoments[world.id];
  const { brought, add } = useContext(HereContext);
  const reduced = useReducedMotion();
  const ref = useRef<HTMLElement>(null);
  const [step, setStep] = useState(scene.steps - 1);

  useEffect(() => {
    const node = ref.current;
    if (!node || reduced) return;
    let frame = 0;
    const read = () => {
      frame = 0;
      const rect = node.getBoundingClientRect();
      const span = rect.height - window.innerHeight;
      const p = span > 0 ? clamp(-rect.top / span) : 0;
      // 0 → 0.22：走进去；0.22 → 0.78：演这个瞬间；0.78 → 1：收回成窗
      const grow =
        p < 0.5 ? smooth(clamp(p / 0.22)) : smooth(clamp((1 - p) / 0.22));
      node.style.setProperty('--g', grow.toFixed(4));
      const t = clamp((p - 0.24) / 0.5);
      const next =
        p < 0.24 ? 0 : Math.min(scene.steps - 1, Math.floor(t * scene.steps));
      setStep((value) => (value === next ? value : next));
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
  }, [reduced, scene.steps]);

  const shown = reduced ? scene.steps - 1 : step;
  const taken = brought.includes(world.souvenir);
  const last = shown === scene.steps - 1;
  return (
    <section
      ref={ref}
      className={`st-world st-world-${world.id}`}
      data-still={reduced || undefined}
      aria-labelledby={`st-${world.id}-title`}
    >
      <div className="st-world-text">
        <p className="m-ch-meta">
          <span className="m-no" aria-hidden="true">
            {String(index + 1).padStart(2, '0')}
          </span>
          {world.en ? (
            <span className="m-kicker" lang="en">
              {world.en}
            </span>
          ) : null}
        </p>
        <h2 id={`st-${world.id}-title`} className="m-ch-title">
          {world.title}
        </h2>
        <div className="m-ch-prose">
          {world.paragraphs.map((text) => (
            <p key={text}>{text}</p>
          ))}
        </div>
        <p className="sr-only">
          画面（{scene.note}）：{scene.label}
        </p>
      </div>
      <div className="st-world-track">
        <div className="st-world-stage">
          <figure className="st-arch" aria-hidden="true">
            {scene.render({ step: shown })}
            <figcaption className="st-arch-cap">
              <span className="m-note">{scene.note}</span>
              <span>{world.steps[shown]}</span>
            </figcaption>
          </figure>
          <div className="st-take" data-ready={last || undefined}>
            <button
              type="button"
              className="m-btn"
              disabled={taken}
              onClick={() => add(world.souvenir)}
            >
              {taken ? (
                <Check size={14} aria-hidden="true" />
              ) : (
                <Plus size={14} aria-hidden="true" />
              )}
              {taken ? hereList.taken : hereList.take}
            </button>
            <span>{world.souvenir}</span>
          </div>
        </div>
      </div>
    </section>
  );
}

export function Worlds() {
  return (
    <>
      {storyWorlds.map((world, index) => (
        <Walk key={world.id} world={world} index={index} />
      ))}
    </>
  );
}
