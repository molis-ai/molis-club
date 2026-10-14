'use client';
import { Pause, Play } from 'lucide-react';
import { useEffect, useRef, useState, type ReactNode } from 'react';
import media from './media.json';
import { useReducedMotion, useVisible } from './motion';
import type { Vars } from './ui';

// 会动的窗：静音、循环、不进读屏；先铺封面帧，进入视口才载入并播放，离开视口或页面隐藏时暂停；
// 减少动态时停在封面帧上。播放速度按素材放慢（media.json 里的 rate）。旁边一个小小的暂停键。

type VideoKey = 'story-sky' | 'about-painting' | 'about-coast';

export function VideoWindow({
  name,
  ratio = '16 / 9',
  focus,
  caption,
  open = true,
  className = '',
  children,
}: {
  name: VideoKey;
  ratio?: string;
  focus?: string;
  caption?: ReactNode;
  open?: boolean;
  className?: string;
  children?: ReactNode;
}) {
  const clip = media[name] as {
    src: string;
    poster: string;
    avg: string;
    rate: number;
    width: number;
    height: number;
  };
  const frame = useRef<HTMLDivElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const visible = useVisible(frame, 0.05);
  const reduced = useReducedMotion();
  const [paused, setPaused] = useState(false);
  const playing = visible && !reduced && !paused;

  useEffect(() => {
    const node = video.current;
    if (!node) return;
    // 第一次进入视口才载入视频；之前只有封面帧
    if (visible && !node.getAttribute('src')) node.setAttribute('src', clip.src);
    node.defaultPlaybackRate = clip.rate;
    node.playbackRate = clip.rate;
    if (playing) void node.play().catch(() => {});
    else node.pause();
  }, [playing, visible, clip.src, clip.rate]);

  return (
    <figure
      className={`m-window m-video ${className}`}
      data-open={open || undefined}
      style={
        {
          '--ratio': ratio,
          '--avg': clip.avg,
          ...(focus ? { '--focus': focus } : null),
        } as Vars
      }
    >
      <div className="m-window-frame" ref={frame}>
        <video
          ref={video}
          poster={clip.poster}
          width={clip.width}
          height={clip.height}
          muted
          loop
          playsInline
          preload="none"
          aria-hidden="true"
          tabIndex={-1}
          onCanPlay={(event) => {
            event.currentTarget.playbackRate = clip.rate;
            if (playing) void event.currentTarget.play().catch(() => {});
          }}
        />
        {children}
      </div>
      <figcaption>
        <span className="m-caption" lang="en">
          {caption}
        </span>
        {reduced ? null : (
          <button
            type="button"
            className="m-pause"
            aria-pressed={paused}
            aria-label={paused ? '继续播放画面' : '暂停画面'}
            onClick={() => setPaused((value) => !value)}
          >
            {paused ? (
              <Play size={10} fill="currentColor" aria-hidden="true" />
            ) : (
              <Pause size={10} fill="currentColor" aria-hidden="true" />
            )}
          </button>
        )}
      </figcaption>
    </figure>
  );
}
