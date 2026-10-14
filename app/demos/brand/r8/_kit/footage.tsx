'use client';
import { useEffect, useRef, useState, type ReactNode } from 'react';
import { Pause, Play } from 'lucide-react';
import { useReducedMotion, useVisible } from './motion';

// 写实影像：Mixkit 的视频与 Unsplash 的照片（都是免费授权，不需要署名；页尾仍注明来源）。
// 选定的几段已经取回本地（public/images/r8/，原样 720p 与 2200 宽 JPEG），开发预览不再依赖素材站的速度；
// 上线前再压成合适的码率与尺寸。
// 视频只做背景：静音、循环、不进读屏；离开视口或页面隐藏时暂停，减少动态时停在一帧上。

export const mixkit = (id: number) =>
  `https://assets.mixkit.co/videos/${id}/${id}-720.mp4`;

export const unsplash = (id: string, w = 2200) =>
  `https://images.unsplash.com/${id}?w=${w}&q=78&auto=format`;

export type Clip = {
  src: string;
  /** 画面重心，给 object-position */
  focus?: string;
  /** 照片：没有合适的视频时用一张真实的照片，镜头极慢地推近 */
  still?: boolean;
  /** 播放速度：云和树影的素材多是延时或快放，放慢到让人静下来的速度 */
  rate?: number;
  /** 左右镜像：把画面里的人让到右边，给左边的字留位置 */
  flip?: boolean;
  /** 裁掉画面顶部的比例（0…1）：去掉压在字后面的深色屋顶之类 */
  lift?: number;
};

/** 一段铺满容器的视频；playing 由外层决定（统一的暂停键） */
export function Footage({
  clip,
  playing,
  className = '',
}: {
  clip: Clip;
  playing: boolean;
  className?: string;
}) {
  if (clip.still)
    return <Still clip={clip} playing={playing} className={className} />;
  return <Moving clip={clip} playing={playing} className={className} />;
}

/** 图片没取到时隔几秒重取，最多两次（素材站偶尔会空回；服务端渲染的图片可能在水合前就失败了） */
function retry(image: HTMLImageElement, src: string) {
  const tries = Number(image.dataset.tries ?? 0);
  if (tries >= 2) return;
  image.dataset.tries = String(tries + 1);
  window.setTimeout(
    () => {
      image.src = `${src}${src.includes('?') ? '&' : '?'}retry=${tries + 1}`;
    },
    2500 * (tries + 1),
  );
}

function Still({
  clip,
  playing,
  className,
}: {
  clip: Clip;
  playing: boolean;
  className: string;
}) {
  const ref = useRef<HTMLImageElement>(null);
  useEffect(() => {
    const image = ref.current;
    if (!image) return;
    if (image.complete && image.naturalWidth) image.dataset.ready = '';
    else if (image.complete) retry(image, clip.src);
  }, [clip.src]);
  return (
    <img
      ref={ref}
      className={`r8-footage r8-still ${className}`}
      data-playing={playing || undefined}
      data-flip={clip.flip || undefined}
      src={clip.src}
      onLoad={(event) => {
        event.currentTarget.dataset.ready = '';
      }}
      onError={(event) => retry(event.currentTarget, clip.src)}
      alt=""
      aria-hidden="true"
      style={{
        objectPosition: clip.focus,
        ...(clip.lift
          ? { top: `${-clip.lift * 100}%`, height: `${100 + clip.lift * 100}%` }
          : null),
      }}
    />
  );
}

function Moving({
  clip,
  playing,
  className,
}: {
  clip: Clip;
  playing: boolean;
  className: string;
}) {
  const ref = useRef<HTMLVideoElement>(null);
  const visible = useVisible(ref, 0.01);
  const want = playing && visible;
  const play = () => void ref.current?.play().catch(() => {});
  const rate = clip.rate ?? 1;
  useEffect(() => {
    const video = ref.current;
    if (!video) return;
    if (video.readyState >= 2) video.dataset.ready = '';
    if (video.error) {
      video.dataset.tries = '1';
      window.setTimeout(() => video.load(), 2000);
    }
  }, []);
  useEffect(() => {
    const video = ref.current;
    if (!video) return;
    video.defaultPlaybackRate = rate;
    video.playbackRate = rate;
    if (want) void video.play().catch(() => {});
    else video.pause();
  }, [want, rate]);
  return (
    <video
      ref={ref}
      className={`r8-footage ${className}`}
      src={`${clip.src}#t=0.1`}
      muted
      loop
      playsInline
      preload="auto"
      aria-hidden="true"
      tabIndex={-1}
      style={clip.focus ? { objectPosition: clip.focus } : undefined}
      // 文件还没缓冲好时 play() 可能落空，能播了再补一次
      onLoadedData={(event) => {
        event.currentTarget.dataset.ready = '';
      }}
      onCanPlay={(event) => {
        event.currentTarget.dataset.ready = '';
        event.currentTarget.playbackRate = rate;
        if (want) play();
      }}
      // 素材站偶尔会空回一次：隔几秒重新取，最多两次
      onError={(event) => {
        const video = event.currentTarget;
        const tries = Number(video.dataset.tries ?? 0);
        if (tries >= 2) return;
        video.dataset.tries = String(tries + 1);
        window.setTimeout(() => video.load(), 2500 * (tries + 1));
      }}
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
      className="r8-film-toggle"
      aria-pressed={!playing}
      aria-label={playing ? '暂停背景影像' : '播放背景影像'}
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
 * 一卷胶片：一段视频钉在视口里，首屏和那句话从它上面滚过去；读到那句话时画面慢慢溶进第二段。
 * 用 data-scene 拿到 --pin（钉住的这一段读了多少），第二段的不透明度跟着它走。
 */
export function Film({
  first,
  second,
  playing,
  bright = false,
  children,
}: {
  first: Clip;
  second: Clip;
  playing: boolean;
  bright?: boolean;
  children: ReactNode;
}) {
  return (
    <div
      className="r8-film"
      data-scene
      data-tone="dark"
      data-bright={bright || undefined}
    >
      <div className="r8-film-media" aria-hidden="true">
        <Footage clip={first} playing={playing} className="r8-film-a" />
        <Footage clip={second} playing={playing} className="r8-film-b" />
        <span className="r8-film-scrim" />
      </div>
      <div className="r8-film-content">{children}</div>
    </div>
  );
}
