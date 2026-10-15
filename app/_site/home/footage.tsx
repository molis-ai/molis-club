'use client';
import { useEffect, useRef, useState, type ReactNode, type Ref } from 'react';
import { Pause, Play } from 'lucide-react';
import { useReducedMotion } from '../motion';
import media from '../media.json';

// 首页前两屏的一卷胶片（第八轮的画面，负责人 2026-10-15 重新配过）：
// 首屏是第八轮天空版的那片积云，被暖光照着慢慢走；素材后半段云底转暗、乌云压上来，只留前 7.6 秒，
// 播得比第八轮再慢一档。到结尾不跳回开头：另一份从头放起，在上面慢慢淡进来，看不出接缝。
// 读到那句话时，画面溶进第八轮海边版的首屏：柔和的晨光里，两个人沿海边慢慢走，照片极慢地推近。
// 照片已压成几档宽度的 WebP（scripts/site-media.mjs）。减少动态时停在一帧上；访客可以随时按暂停。

type Still = {
  name: 'seaside-hero';
  focus: string;
  flip?: boolean;
};

const ware: Still = { name: 'seaside-hero', focus: '50% 60%' };

/** 循环接缝：离结尾还有这么多「素材秒」时，另一份从头放起并淡入（实际时长要除以播放速度） */
const SEAM = 1.1;

/**
 * 首屏的天空：一进来就是天，不等视频。
 * 最底下是按封面帧取色的天空渐变（样式里），上面是只有十几 KB 的封面帧，页面一出来就在；
 * 视频能播了，再从封面帧上淡进来（封面帧取自第 0.5 秒，第一份也从第 0.5 秒放起，接得上）。
 * 两份同一段视频轮流放，结尾处交叉淡入，循环没有跳帧。
 */
function Sky({ playing, className }: { playing: boolean; className: string }) {
  const clip = media['home-sky'] as {
    src: string;
    poster: string;
    rate: number;
    width: number;
    height: number;
  };
  const reel = useRef<HTMLDivElement>(null);
  const a = useRef<HTMLVideoElement>(null);
  const b = useRef<HTMLVideoElement>(null);
  const front = useRef(0);

  // 水合之前视频就已经能播了：直接显出来
  useEffect(() => {
    if ((a.current?.readyState ?? 0) >= 2 && reel.current)
      reel.current.dataset.on = '';
  }, []);

  useEffect(() => {
    const videos = [a.current, b.current];
    if (!videos[0] || !videos[1]) return;
    for (const video of videos as HTMLVideoElement[]) {
      video.defaultPlaybackRate = clip.rate;
      video.playbackRate = clip.rate;
    }
    const current = () => videos[front.current] as HTMLVideoElement;
    if (!playing) {
      for (const video of videos) video?.pause();
      return;
    }
    void current()
      .play()
      .catch(() => {});

    let fading = false;
    const check = () => {
      const now = current();
      if (fading || !now.duration || now.currentTime < now.duration - SEAM)
        return;
      fading = true;
      const next = videos[1 - front.current] as HTMLVideoElement;
      next.currentTime = 0;
      next.playbackRate = clip.rate;
      void next.play().catch(() => {});
      // 新的一份压在上面，从透明慢慢显出来；旧的留在下面放完，不露底色
      next.style.zIndex = '1';
      now.style.zIndex = '0';
      const fade = (SEAM / clip.rate) * 1000;
      next.animate([{ opacity: 0 }, { opacity: 1 }], {
        duration: fade,
        easing: 'ease-in-out',
        fill: 'forwards',
      }).onfinish = () => {
        now.pause();
        fading = false;
      };
      front.current = 1 - front.current;
    };
    const timer = window.setInterval(check, 250);
    return () => {
      window.clearInterval(timer);
      for (const video of videos) video?.pause();
    };
  }, [playing, clip.rate]);

  return (
    <div className={`m-footage m-sky ${className}`}>
      <img
        className="m-sky-poster"
        src={clip.poster}
        width={clip.width}
        height={clip.height}
        alt=""
        aria-hidden="true"
        loading="eager"
        fetchPriority="high"
        decoding="async"
      />
      <div ref={reel} className="m-sky-reel">
        <video
          ref={a}
          src={`${clip.src}#t=0.5`}
          muted
          playsInline
          preload="auto"
          aria-hidden="true"
          tabIndex={-1}
          onLoadedData={(event) => {
            const holder = event.currentTarget.parentElement;
            if (holder) holder.dataset.on = '';
          }}
          style={{ zIndex: 1 }}
        />
        <video
          ref={b}
          src={clip.src}
          muted
          playsInline
          preload="metadata"
          aria-hidden="true"
          tabIndex={-1}
          style={{ opacity: 0 }}
        />
      </div>
    </div>
  );
}

function Photo({
  still,
  playing,
  className,
  eager = false,
}: {
  still: Still;
  playing: boolean;
  className: string;
  eager?: boolean;
}) {
  const ref = useRef<HTMLImageElement>(null);
  const image = media[still.name];
  useEffect(() => {
    const node = ref.current;
    if (node?.complete && node.naturalWidth) node.dataset.ready = '';
  }, []);
  return (
    <img
      ref={ref}
      className={`m-footage m-still ${className}`}
      data-playing={playing || undefined}
      data-flip={still.flip || undefined}
      src={image.src}
      srcSet={image.srcset.map(([src, w]) => `${src} ${w}w`).join(', ')}
      sizes="100vw"
      width={image.width}
      height={image.height}
      loading={eager ? 'eager' : 'lazy'}
      fetchPriority={eager ? 'high' : undefined}
      decoding="async"
      onLoad={(event) => {
        event.currentTarget.dataset.ready = '';
      }}
      alt=""
      aria-hidden="true"
      style={{ objectPosition: still.focus }}
    />
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
}: {
  playing: boolean;
  toggle: () => void;
}) {
  return (
    <button
      type="button"
      className="m-film-toggle"
      aria-pressed={!playing}
      aria-label={playing ? '暂停背景画面' : '继续背景画面'}
      onClick={toggle}
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
  playing,
  children,
  ref,
}: {
  playing: boolean;
  children: ReactNode;
  ref?: Ref<HTMLDivElement>;
}) {
  return (
    <div className="m-film" data-scene data-tone="film" ref={ref}>
      <div className="m-film-media" aria-hidden="true">
        <Sky playing={playing} className="m-film-a" />
        <Photo still={ware} playing={playing} className="m-film-b" />
        <span className="m-film-scrim" />
      </div>
      <div className="m-film-content">{children}</div>
    </div>
  );
}
