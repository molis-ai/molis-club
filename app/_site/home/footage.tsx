'use client';
import {
  useEffect,
  useRef,
  useState,
  type ReactNode,
  type Ref,
  type RefObject,
} from 'react';
import { Pause, Play } from 'lucide-react';
import { useReducedMotion } from '../motion';
import media from '../media.json';
import { SeasideBridge } from './seaside-bridge';

// 首页前两屏的一卷胶片（第八轮的画面，负责人 2026-10-15 重新配过）：
// 首屏是第八轮天空版的那片积云，被暖光照着慢慢走；素材后半段云底转暗、乌云压上来，只留前 7.6 秒，
// 慢放节奏已烘焙进 30 fps 插帧文件，以正常速度播放；结尾用另一份从头淡入。
// 二屏保留第一条 0.55 倍慢放素材，只播一遍，末尾缓下来停成照片；完全滚出二屏后才复位。
// 两屏各自在进入视口后播放。减少动态时保留封面；访客可以随时按暂停。

/**
 * 首屏的天空：一进来就是天，不等视频。
 * 最底下是按封面帧取色的天空渐变（样式里），上面是只有十几 KB 的封面帧，页面一出来就在；
 * 视频从封面对应的素材位置开始；两份同一段视频交叉淡入，暂停同时冻结画面与淡入。
 */
function LoopFootage({
  name,
  playing,
  className,
  seam,
  eager = false,
  resetOutside,
  onRestChange,
}: {
  name: 'home-sky' | 'home-seaside';
  playing: boolean;
  className: string;
  seam: number;
  eager?: boolean;
  resetOutside?: RefObject<HTMLElement | null>;
  onRestChange?: (resting: boolean) => void;
}) {
  const clip = media[name] as {
    src: string;
    poster: string;
    rate: number;
    posterTime?: number;
    width: number;
    height: number;
  };
  const [loaded, setLoaded] = useState(eager);
  // 首次进入画面后保持素材已加载；手动暂停与切换标签页不重置位置。
  if (playing && !loaded) setLoaded(true);
  const reel = useRef<HTMLDivElement>(null);
  const a = useRef<HTMLVideoElement>(null);
  const b = useRef<HTMLVideoElement>(null);
  const front = useRef(0);
  const resting = useRef(false);
  const transition = useRef<{
    animation: Animation;
    outgoing: HTMLVideoElement;
  } | null>(null);

  // 水合之前视频就已经能播了：直接显出来
  useEffect(() => {
    if ((a.current?.readyState ?? 0) >= 2 && reel.current)
      reel.current.dataset.on = '';
  }, []);

  useEffect(() => {
    const scene = resetOutside?.current;
    const video = a.current;
    if (!scene || !video) return;
    // 只观察几何位置，不把 document.hidden 或手动暂停当作离开二屏。
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && entry.intersectionRatio > 0) {
          // 从 B 切回 A 会重新挂载视频，同时同步新视频的控制键状态。
          onRestChange?.(resting.current);
          return;
        }
        video.pause();
        video.currentTime = clip.posterTime ?? 0;
        video.playbackRate = clip.rate;
        resting.current = false;
        onRestChange?.(false);
      },
      // 顶部滚到尽头时，二屏恰好贴着视口底边；零面积相交也应算离屏。
      { threshold: Number.EPSILON },
    );
    observer.observe(scene);
    return () => observer.disconnect();
  }, [resetOutside, clip.posterTime, clip.rate, onRestChange]);

  useEffect(() => {
    if (!loaded) return;
    const videos = [a.current, b.current].filter(
      (video): video is HTMLVideoElement => video !== null,
    );
    if (!videos[0]) return;
    for (const video of videos) {
      video.defaultPlaybackRate = clip.rate;
      video.playbackRate = clip.rate;
    }
    const current = () => videos[front.current] as HTMLVideoElement;
    if (!playing || resting.current) {
      for (const video of videos) video?.pause();
      transition.current?.animation.pause();
      return;
    }
    if (resetOutside && current().ended) {
      resting.current = true;
      onRestChange?.(true);
      return;
    }

    // 海边只前进，不叠化或倒放。最后一秒素材逐渐放慢，结束后保留视频的末帧。
    let frame = 0;
    const settle = () => {
      const video = current();
      if (video.ended) {
        resting.current = true;
        onRestChange?.(true);
        return;
      }
      const remaining = video.duration - video.currentTime;
      const progress = Math.min(1, Math.max(0, remaining));
      const eased = progress * progress * (3 - 2 * progress);
      video.playbackRate = Number.isFinite(remaining)
        ? clip.rate * (0.25 + 0.75 * eased)
        : clip.rate;
      frame = requestAnimationFrame(settle);
    };
    if (resetOutside) settle();
    void current()
      .play()
      .catch(() => {});

    // 从暂停恢复时，两份素材与尚未完成的淡入继续在同一位置播放。
    if (transition.current) {
      void transition.current.outgoing.play().catch(() => {});
      transition.current.animation.play();
    }
    const check = () => {
      const now = current();
      if (
        seam === 0 ||
        transition.current ||
        !now.duration ||
        now.currentTime < now.duration - seam * clip.rate
      )
        return;
      const next = videos[1 - front.current] as HTMLVideoElement;
      // 等第二份素材可解码后才转场，不淡入尚未有画面的图层。
      if (next.readyState < 2) return;
      next.currentTime = 0;
      next.playbackRate = clip.rate;
      void next.play().catch(() => {});
      // 新的一份压在上面，从透明慢慢显出来；旧的留在下面放完，不露底色
      next.style.zIndex = '1';
      now.style.zIndex = '0';
      const animation = next.animate([{ opacity: 0 }, { opacity: 1 }], {
        duration: seam * 1000,
        easing: 'ease-in-out',
        fill: 'forwards',
      });
      transition.current = { animation, outgoing: now };
      animation.onfinish = () => {
        now.pause();
        now.style.opacity = '0';
        next.style.opacity = '1';
        animation.cancel();
        transition.current = null;
      };
      front.current = 1 - front.current;
    };
    const timer = seam > 0 ? window.setInterval(check, 250) : undefined;
    return () => {
      cancelAnimationFrame(frame);
      window.clearInterval(timer);
      for (const video of videos) video?.pause();
      transition.current?.animation.pause();
    };
  }, [playing, loaded, clip.rate, seam, resetOutside, onRestChange]);

  useEffect(
    () => () => {
      if (transition.current) {
        transition.current.animation.onfinish = null;
        transition.current.animation.cancel();
      }
    },
    [],
  );

  return (
    <div className={`m-footage m-loop-footage ${className}`} data-ready="">
      <img
        className="m-film-poster"
        src={clip.poster}
        width={clip.width}
        height={clip.height}
        alt=""
        aria-hidden="true"
        loading={eager ? 'eager' : 'lazy'}
        fetchPriority={eager ? 'high' : undefined}
        decoding="async"
      />
      <div ref={reel} className="m-film-reel">
        <video
          ref={a}
          src={loaded ? `${clip.src}#t=${clip.posterTime ?? 0}` : undefined}
          muted
          playsInline
          loop={seam === 0 && !resetOutside}
          preload="auto"
          aria-hidden="true"
          tabIndex={-1}
          onLoadedData={(event) => {
            const holder = event.currentTarget.parentElement;
            if (holder) holder.dataset.on = '';
          }}
          style={{ zIndex: 1 }}
        />
        {seam > 0 ? (
          <video
            ref={b}
            src={loaded ? clip.src : undefined}
            muted
            playsInline
            preload="auto"
            aria-hidden="true"
            tabIndex={-1}
            style={{ opacity: 0 }}
          />
        ) : null}
      </div>
    </div>
  );
}

/** 整页影像的播放状态：减少动态时默认停住；访客可以随时按暂停 */
export function useFootagePlaying() {
  const reduced = useReducedMotion();
  const [paused, setPaused] = useState<boolean | null>(null);
  const playing = paused === null ? !reduced : !paused;
  return { playing, toggle: () => setPaused(playing) };
}

export function FootageToggle({
  playing,
  toggle,
  resting = false,
}: {
  playing: boolean;
  toggle: () => void;
  resting?: boolean;
}) {
  return (
    <button
      type="button"
      className="m-film-toggle"
      aria-pressed={!playing}
      aria-label={playing ? '暂停背景画面' : '继续背景画面'}
      onClick={toggle}
      disabled={resting}
      style={resting ? { visibility: 'hidden' } : undefined}
    >
      {playing ? (
        <Pause size={11} fill="currentColor" aria-hidden="true" />
      ) : (
        <Play size={11} fill="currentColor" aria-hidden="true" />
      )}
    </button>
  );
}

/**
 * 一卷胶片：首屏的天空钉在视口里，首屏和那句话从它上面滚过去；读到那句话时画面慢慢溶进海边那张。
 * 用 data-scene 拿到 --pin（钉住的这一段读了多少），第二张的不透明度跟着它走。
 */
export function Film({
  skyPlaying,
  seasidePlaying,
  seasideScene,
  onSeasideRestChange,
  seasideVariant,
  children,
  ref,
}: {
  skyPlaying: boolean;
  seasidePlaying: boolean;
  seasideScene: RefObject<HTMLElement | null>;
  onSeasideRestChange: (resting: boolean) => void;
  seasideVariant: 'a' | 'b';
  children: ReactNode;
  ref?: Ref<HTMLDivElement>;
}) {
  return (
    <div
      className="m-film"
      data-scene
      data-tone="film"
      data-seaside={seasideVariant}
      ref={ref}
    >
      <div className="m-film-media" aria-hidden="true">
        <LoopFootage
          name="home-sky"
          playing={skyPlaying}
          className="m-sky m-film-a"
          seam={4.6}
          eager
        />
        {seasideVariant === 'b' ? (
          <SeasideBridge playing={seasidePlaying} scene={seasideScene} />
        ) : (
          <LoopFootage
            name="home-seaside"
            playing={seasidePlaying}
            className="m-seaside m-film-b"
            seam={0}
            resetOutside={seasideScene}
            onRestChange={onSeasideRestChange}
          />
        )}
        <span className="m-film-scrim" />
      </div>
      <div className="m-film-content">{children}</div>
    </div>
  );
}
