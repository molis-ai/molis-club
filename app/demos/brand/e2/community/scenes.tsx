'use client';
import { useEffect, useRef, useState } from 'react';
import {
  ArrowDown,
  ArrowRight,
  Check,
  FileText,
  Pause,
  Play,
} from 'lucide-react';
import { artistSkills } from '../../../../../content/artists';

// 「试一试」三张卡里的小画面：niul.ai 的状态由访客切换；DropAgent 的流程自动推进（离开视口、
// 切到后台或按暂停就停，减少动态时直接停在结果上）；Artist Skill 三种风格切换。都不连接真实服务。

export const artistStyles = artistSkills
  .filter((skill) => skill.image)
  .slice(0, 3);
const styleNames = ['光与色', '梦的形状', '画面秩序'];

/** 状态示意由访客切换；不连接真实 Agent 会话。 */
export function CowScene() {
  const [waiting, setWaiting] = useState(true);
  return (
    <div className="ecm-scene ecm-cow" data-waiting={waiting}>
      <div className="ecm-window">
        <div className="ecm-window-bar">
          <i />
          <i />
          <i />
          <span>正在进行的工作</span>
        </div>
        <div className="ecm-session">
          <span className="ecm-session-dot" />
          <div>
            <strong>整理调研资料</strong>
            <p>{waiting ? '正在核对来源…' : '已完成，等你检查结果'}</p>
          </div>
          {!waiting && <Check size={16} aria-hidden="true" />}
        </div>
        <div className="ecm-session">
          <span className="ecm-session-dot" />
          <div>
            <strong>准备下周的简报</strong>
            <p>正在整理初稿…</p>
          </div>
        </div>
      </div>
      <div className="ecm-cow-stage">
        <p className="ecm-cow-note" key={String(waiting)}>
          {waiting ? '我帮你看着呢。' : '干完啦，到你了。'}
        </p>
        <img
          src="/images/products/niulai.png"
          width="192"
          height="192"
          alt="niul.ai 黄色桌面小牛"
          loading="lazy"
        />
      </div>
      <button
        type="button"
        className="ecm-switch"
        aria-pressed={!waiting}
        onClick={() => setWaiting((value) => !value)}
      >
        <span className="ecm-switch-dot" aria-hidden="true" />
        {waiting ? '看看 Agent 完成时' : '再看看工作中'}
        <ArrowRight size={14} aria-hidden="true" />
      </button>
    </div>
  );
}

/** 进入视口才播放，离开、切到后台或按暂停就停 */
function useLoop<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [inView, setInView] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [paused, setPaused] = useState(false);
  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { threshold: 0.25 },
    );
    const sync = () => setHidden(document.hidden);
    observer.observe(node);
    document.addEventListener('visibilitychange', sync);
    return () => {
      observer.disconnect();
      document.removeEventListener('visibilitychange', sync);
    };
  }, []);
  return {
    ref,
    running: inView && !hidden && !paused,
    paused,
    toggle: () => setPaused((value) => !value),
  };
}

/** 原文件 → 交给本地 Agent 在副本上整理 → 带回要点。箭头标明方向，原文件始终留在原处 */
export function DropScene() {
  const { ref, running, paused, toggle } = useLoop<HTMLDivElement>();
  return (
    <div ref={ref} className="ecm-scene ecm-drop" data-running={running}>
      <div className="ecm-drop-row">
        <div className="ecm-file">
          <FileText size={22} strokeWidth={1.5} aria-hidden="true" />
          <strong>访谈记录.md</strong>
          <span>原始材料</span>
          <i />
          <i />
          <i />
        </div>
        <span className="ecm-file-ghost" aria-hidden="true" />
      </div>
      <div className="ecm-dock">
        <ArrowDown size={18} strokeWidth={1.5} aria-hidden="true" />
        <strong>整理成三条要点</strong>
        <span>交给本地 Agent，在副本上工作</span>
        <div className="ecm-progress">
          <i />
        </div>
      </div>
      <div className="ecm-result">
        <div>
          <Check size={15} aria-hidden="true" />
          <strong>访谈要点.md</strong>
        </div>
        <p>想解决什么问题</p>
        <p>哪些地方最费力</p>
        <p>下一步需要确认什么</p>
      </div>
      <button
        type="button"
        className="ecm-loop-toggle"
        aria-pressed={paused}
        aria-label={paused ? '继续播放演示' : '暂停演示'}
        onClick={toggle}
      >
        {paused ? (
          <Play size={12} fill="currentColor" aria-hidden="true" />
        ) : (
          <Pause size={12} fill="currentColor" aria-hidden="true" />
        )}
      </button>
    </div>
  );
}

/** Artist Skill 的小图：三种风格切换，看一种方法怎样换一种观看 */
export function ArtistScene({
  index,
  onPick,
}: {
  index: number;
  onPick: (index: number) => void;
}) {
  const artist = artistStyles[index];
  return (
    <div className="ecm-scene ecm-artist">
      <div className="ecm-print" key={artist.slug}>
        <img
          src={artist.image}
          width={artist.width}
          height={artist.height}
          alt={artist.imageAlt}
          loading="lazy"
        />
        <p>{artist.name}</p>
      </div>
      <div className="ecm-artist-method">
        <span>从这里观察</span>
        <strong>{artist.method[0].title}</strong>
      </div>
      <fieldset className="ecm-picker" aria-label="选择艺术风格">
        {artistStyles.map((item, i) => (
          <button
            key={item.slug}
            type="button"
            aria-pressed={i === index}
            onClick={() => onPick(i)}
          >
            {styleNames[i]}
          </button>
        ))}
      </fieldset>
    </div>
  );
}
