'use client';
import { useCallback, useEffect, useRef, useState } from 'react';
import { enterprise, type StationId } from '../../../content/site/enterprise';
import { Phrases, type Vars } from '../../_site/ui';
import { play } from './keeps';
import { Film } from './films';

// 我们怎样开展合作（负责人 2026-10-19：之前那版「是一个合格的 PPT」——四张卡加十二格，一眼全摊开、每样东西一样重）。
// 改成一次只看一项服务的展开式长卷：
// 四项服务像书架上并排的四本书，书脊上竖排着列名（诊断、共建、评估、培训，5.2 开头那句里的词），各用「关于」的一种墙色。
// 往下滚，整屏钉住，一本一本地打开：打开的那面上头是列名与服务全名，下面整块是一段短片（films.tsx）——
// 一块共享画板上，业务团队和 Molis 两个带名牌的光标按分镜各做各的、再一起做；每一步做完钉一条带序号的评论（5.3 原句）
// （负责人 2026-10-20：用动画演出 Molis 跟业务怎么合作，「假装你在拍视频」）。
// 点一本合着的书，滚到它那一拍；鼠标停在画面上，那段片子重演。
// 宽屏（≥1000 宽、≥600 高）有 JS 时才钉住；手机、矮屏、没有 JS 时四项服务从上到下排开。

const { path } = enterprise;
const stationIds = Object.keys(path.stations) as StationId[];
const LEGS = stationIds.length;

export function Stages() {
  const ref = useRef<HTMLElement>(null);
  const [live, setLive] = useState(false);
  const [active, setActive] = useState(0);

  // 宽屏才钉住；钉住时按滚动走到哪一本
  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    const wide = matchMedia('(min-width: 1000px) and (min-height: 600px)');
    let frame = 0;
    const read = () => {
      frame = 0;
      if (!wide.matches) return;
      const rect = root.getBoundingClientRect();
      const span = rect.height - window.innerHeight;
      const pin = span > 0 ? Math.min(1, Math.max(0, -rect.top / span)) : 0;
      setActive(Math.min(LEGS - 1, Math.floor(pin * LEGS)));
    };
    const request = () => {
      if (!frame) frame = requestAnimationFrame(read);
    };
    const sync = () => {
      setLive(wide.matches);
      request();
    };
    sync();
    wide.addEventListener('change', sync);
    window.addEventListener('scroll', request, { passive: true });
    window.addEventListener('resize', request);
    return () => {
      if (frame) cancelAnimationFrame(frame);
      wide.removeEventListener('change', sync);
      window.removeEventListener('scroll', request);
      window.removeEventListener('resize', request);
    };
  }, []);

  // 动画：先停在第一帧（没有 JS 时看到的是演完的样子）；钉住时打开哪一本演哪一本，不钉住时各自进屏各演一遍
  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const scenes = Array.from(root.querySelectorAll('.m-film'));
    for (const scene of scenes) {
      scene.setAttribute('data-play', '');
      scene.setAttribute('data-hold', '');
    }
    const seen = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const leg = entry.target.closest('.m-ent-leg');
          // 钉住时只放打开的那一本
          if (
            root.hasAttribute('data-live') &&
            !leg?.hasAttribute('data-active')
          )
            continue;
          seen.unobserve(entry.target);
          entry.target.removeAttribute('data-hold');
        }
      },
      { threshold: 0.5 },
    );
    for (const scene of scenes) seen.observe(scene);
    return () => seen.disconnect();
  }, []);

  // 打开一本：那一本的动画从头演
  const first = useRef(true);
  useEffect(() => {
    if (!live) return;
    // 刚钉住时那一本交给上面的进屏观察，不抢着演
    if (first.current) {
      first.current = false;
      return;
    }
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const scene = ref.current?.querySelector(
      `.m-ent-leg[data-index="${active}"] .m-film`,
    );
    if (!scene) return;
    if (scene.hasAttribute('data-hold')) scene.removeAttribute('data-hold');
    else play(scene);
  }, [active, live]);

  /** 点一本合着的书：滚到它那一拍的正中 */
  const go = useCallback((index: number) => {
    const root = ref.current;
    if (!root) return;
    const rect = root.getBoundingClientRect();
    const span = rect.height - window.innerHeight;
    const top = window.scrollY + rect.top + ((index + 0.5) / LEGS) * span;
    const still = matchMedia('(prefers-reduced-motion: reduce)').matches;
    window.scrollTo({ top, behavior: still ? 'auto' : 'smooth' });
  }, []);

  return (
    <section
      ref={ref}
      className="m-ent-flow"
      id="path"
      data-live={live || undefined}
      aria-labelledby="ent-flow-title"
      style={{ '--legs': LEGS } as Vars}
    >
      <div className="m-ent-flow-stick m-wrap">
        <header className="m-ent-flow-head">
          <h2 className="m-ent-flow-title" id="ent-flow-title">
            {path.title}
          </h2>
          <p className="m-ent-flow-lead">
            <Phrases text={path.lead} />
          </p>
        </header>

        <ol className="m-ent-legs">
          {stationIds.map((id, index) => {
            const station = path.stations[id];
            const open = !live || index === active;
            return (
              <li
                key={id}
                id={`station-${id}`}
                className="m-ent-leg"
                data-wall={id}
                data-index={index}
                data-active={open || undefined}
                aria-labelledby={`station-${id}-name`}
              >
                {/* 书脊：合着的时候竖排列名；点一下打开（服务全名在打开的那一面上） */}
                <button
                  type="button"
                  className="m-ent-leg-spine"
                  tabIndex={live && !open ? 0 : -1}
                  aria-hidden={!live || open}
                  aria-label={`${station.word}：${station.name}`}
                  onClick={() => go(index)}
                >
                  <span className="m-ent-leg-spine-word">{station.word}</span>
                </button>

                {/* 打开的那一面：列名在上，下面整块是短片 */}
                <div className="m-ent-leg-body">
                  <header className="m-ent-leg-head">
                    <h3 className="m-ent-leg-word" id={`station-${id}-name`}>
                      {station.word}
                    </h3>
                    <p className="m-ent-leg-name">{station.name}</p>
                  </header>
                  <div
                    className="m-ent-leg-stage"
                    onPointerEnter={(event) => {
                      if (event.pointerType !== 'mouse') return;
                      if (
                        matchMedia('(prefers-reduced-motion: reduce)').matches
                      )
                        return;
                      const film = event.currentTarget.querySelector('.m-film');
                      if (film && !film.hasAttribute('data-hold')) play(film);
                    }}
                  >
                    <Film id={id} />
                  </div>
                </div>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
