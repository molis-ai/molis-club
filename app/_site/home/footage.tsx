'use client';
import { useEffect, useRef, useState, type ReactNode, type Ref } from 'react';
import { Pause, Play } from 'lucide-react';
import { useReducedMotion } from '../motion';
import media from '../media.json';

// 首页前两屏的一卷胶片（从第八轮海边版迁来，画面原样保留）：
// 首屏是柔和的晨光里两个人沿海边慢慢走，照片极慢地推近；读到那句话时，画面溶进礁石边的海岸，
// 有人戴着草帽对着大海作画（镜像后人在右边）。照片已压成几档宽度的 WebP（scripts/site-media.mjs）。
// 减少动态时不推近，停在一帧上；访客可以随时按暂停。

type Still = {
  name: 'seaside-hero' | 'seaside-ware';
  focus: string;
  flip?: boolean;
};

const hero: Still = { name: 'seaside-hero', focus: '50% 60%' };
const ware: Still = { name: 'seaside-ware', focus: '50% 55%', flip: true };

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
 * 一卷胶片：首屏的照片钉在视口里，首屏和那句话从它上面滚过去；读到那句话时画面慢慢溶进第二张。
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
        <Photo still={hero} playing={playing} className="m-film-a" eager />
        <Photo still={ware} playing={playing} className="m-film-b" />
        <span className="m-film-scrim" />
      </div>
      <div className="m-film-content">{children}</div>
    </div>
  );
}
