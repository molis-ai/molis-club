'use client';
import { Pause, Play, RotateCcw } from 'lucide-react';
import { useEffect, useRef, useState, type KeyboardEvent, type ReactNode } from 'react';
import { workCases, type CaseId, type LoopId, type RoleId } from '../../../content/site/work';
import { useOnScreen, useStill } from '../../_site/cue';
import { Note, Phrases } from '../../_site/ui';
import { createRuntime, fill, type CaseSpec } from './cases/runtime';

// 用起来：两种人，各走两条闭环。左边是角色（分段切换）、闭环（两张卡）和五步（编号），右边一块浅灰台面，上面一扇深色的窗按时间演。
// 画面挂在 shadow root 里（四个 case 的样式和 id 与站点互不影响），只在视口里、页面在前台、没按暂停时演；
// 点某一步从那一步演起；减少动态时直接停在做完的样子。四个 case 各自按需加载。

const NOTE = '界面示意 · 示例数据';
const HOLD = 5000;
const KEY = 'molis-work-role';

const LOAD: Record<CaseId, () => Promise<CaseSpec>> = {
  fix: () => import('./cases/fix').then((m) => m.fix),
  users: () => import('./cases/users').then((m) => m.users),
  hot: () => import('./cases/hot').then((m) => m.hot),
  topics: () => import('./cases/topics').then((m) => m.topics),
};

type Player = { play: (from: number) => void; pause: (value: boolean) => void; stop: () => void };

export function Cases({ head }: { head: ReactNode }) {
  const [role, setRole] = useState<RoleId>('code');
  const [loop, setLoop] = useState<LoopId>('team');
  const [step, setStep] = useState(0);
  const [paused, setPaused] = useState(false);
  const still = useStill();
  const frame = useRef<HTMLDivElement>(null);
  const shown = useOnScreen(frame, 0.35);
  const player = useRef<Player | null>(null);
  const live = useRef(false);
  const loops = useRef<(HTMLButtonElement | null)[]>([]);
  const current = workCases.cases[role][loop];
  const id = current.id;

  // 记住上次选的角色（只存在这台设备的浏览器里，读不到就用默认）
  useEffect(() => {
    let saved: string | null = null;
    try {
      saved = window.localStorage.getItem(KEY);
    } catch {
      // 读不到就用默认
    }
    if (saved === 'code' || saved === 'content') queueMicrotask(() => setRole(saved));
  }, []);

  // 换一个 case：把画面装进 shadow root，从第一步演起（不在视口里就停在开头等着）
  useEffect(() => {
    const host = frame.current;
    if (!host) return;
    let gone = false;
    let cleanup = () => {};
    void LOAD[id]().then((spec) => {
      if (gone) return;
      const root = host.shadowRoot ?? host.attachShadow({ mode: 'open' });
      root.innerHTML = `<style>${spec.css}</style>${spec.html}`;
      fill(root);
      const rt = createRuntime(root, { peer: spec.peer });
      const cast = spec.cast(rt);
      let round = 0;
      const play = async (from: number) => {
        const mine = ++round;
        const done = await rt.run(cast.acts, cast.reset, from, setStep, still);
        if (!done || still || mine !== round) return;
        await rt.sleep(HOLD);
        if (mine === round && !gone) void play(0);
      };
      player.current = {
        play,
        pause: rt.setPaused,
        stop: rt.stop,
      };
      rt.setPaused(!live.current);
      void play(0);
      cleanup = () => rt.stop();
    });
    return () => {
      gone = true;
      cleanup();
      player.current = null;
    };
  }, [id, still]);

  useEffect(() => {
    live.current = shown && !paused;
    player.current?.pause(!live.current);
  }, [shown, paused]);

  const pickRole = (next: RoleId) => {
    setRole(next);
    setStep(0);
    try {
      window.localStorage.setItem(KEY, next);
    } catch {
      // 存不下也没关系，这一页里照样换
    }
  };
  const pickLoop = (next: LoopId) => {
    setLoop(next);
    setStep(0);
  };
  const onLoopKey = (event: KeyboardEvent, index: number) => {
    const count = workCases.loops.length;
    const move = event.key === 'ArrowRight' || event.key === 'ArrowDown' ? 1 : event.key === 'ArrowLeft' || event.key === 'ArrowUp' ? -1 : 0;
    if (!move) return;
    event.preventDefault();
    const to = (index + move + count) % count;
    loops.current[to]?.focus();
    pickLoop(workCases.loops[to].id);
  };

  return (
    <div className="m-wrap wk-cs">
      <div className="wk-cs-text">
        {head}
        <div className="wk-cs-pick">
          <fieldset className="wk-cs-roles">
            <legend className="sr-only">{workCases.roleLabel}</legend>
            {workCases.roles.map((item) => (
              <button key={item.id} type="button" aria-pressed={item.id === role} onClick={() => pickRole(item.id)}>
                {item.name}
              </button>
            ))}
          </fieldset>
          <div className="wk-cs-loops" role="tablist" aria-label={workCases.loopLabel}>
            {workCases.loops.map((item, index) => (
              <button
                key={item.id}
                ref={(node) => {
                  loops.current[index] = node;
                }}
                type="button"
                role="tab"
                id={`wk-cs-tab-${item.id}`}
                aria-selected={item.id === loop}
                aria-controls="wk-cs-stage"
                tabIndex={item.id === loop ? 0 : -1}
                className="wk-cs-loop"
                onClick={() => pickLoop(item.id)}
                onKeyDown={(event) => onLoopKey(event, index)}
              >
                <span className="wk-cs-loop-k">{item.name}</span>
                <span className="wk-cs-loop-t">
                  <Phrases text={workCases.cases[role][item.id].title} />
                </span>
              </button>
            ))}
          </div>
        </div>
        <ol className="wk-cs-steps" aria-label={current.title}>
          {current.steps.map((item, index) => (
            <li key={`${current.id}-${index}`}>
              <button
                type="button"
                className="wk-cs-step"
                aria-current={index === step ? 'step' : undefined}
                data-done={index < step || undefined}
                onClick={() => player.current?.play(index)}
              >
                <span className="wk-cs-name">{item.t}</span>
                <span className="wk-cs-more">
                  <Phrases text={item.s} />
                </span>
              </button>
            </li>
          ))}
        </ol>
      </div>
      <figure className="wk-cs-show wk-plate" id="wk-cs-stage" role="tabpanel" aria-labelledby={`wk-cs-tab-${loop}`}>
        <div ref={frame} className="wk-cs-frame" data-case={current.id} aria-hidden="true" />
        <figcaption className="wk-foot">
          <span className="sr-only">{current.label}</span>
          <Note>{NOTE}</Note>
          {still ? null : (
            <>
              <button type="button" className="wk-cs-again" onClick={() => player.current?.play(0)}>
                <RotateCcw size={13} aria-hidden="true" />
                {workCases.replay}
              </button>
              <button
                type="button"
                className="wk-toggle"
                aria-pressed={paused}
                aria-label={paused ? '继续播放演示' : '暂停演示'}
                onClick={() => setPaused((value) => !value)}
              >
                {paused ? (
                  <Play size={12} fill="currentColor" aria-hidden="true" />
                ) : (
                  <Pause size={12} fill="currentColor" aria-hidden="true" />
                )}
              </button>
            </>
          )}
        </figcaption>
      </figure>
    </div>
  );
}
