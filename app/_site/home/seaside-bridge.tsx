'use client';
import { useEffect, useRef, useState, type RefObject } from 'react';
import media from '../media.json';

// B 方案使用第一条原片的低压缩慢放导出：全景 → 左侧无人海面 → 全景开头。
// 空镜与全景保持同一地平线，保留天空；只用 CSS 裁切，不调用视频生成。
// 从 0 开始，兼容本地服务只提供从头播放、无法可靠定位中间帧的情况。
const WAVE_START = 0;
const WAVE_RATE = 0.8;
const FADE = 3;
const WAVE_HOLD = 2;
type Phase = 'main' | 'into-waves' | 'waves' | 'out-of-waves';
const ease = (value: number) => {
  const t = Math.min(1, Math.max(0, value));
  return t * t * (3 - 2 * t);
};

export function SeasideBridge({
  playing,
  scene,
}: {
  playing: boolean;
  scene: RefObject<HTMLElement | null>;
}) {
  const clip = media['home-seaside-detail'];
  const [loaded, setLoaded] = useState(false);
  if (playing && !loaded) setLoaded(true);
  const reel = useRef<HTMLDivElement>(null);
  const main = useRef<HTMLVideoElement>(null);
  const waves = useRef<HTMLVideoElement>(null);
  const phase = useRef<Phase>('main');

  useEffect(() => {
    const node = scene.current;
    const full = main.current;
    const cutaway = waves.current;
    if (!node || !full || !cutaway) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && entry.intersectionRatio > 0) return;
        full.pause();
        cutaway.pause();
        full.currentTime = 0;
        cutaway.currentTime = WAVE_START;
        cutaway.style.opacity = '0';
        phase.current = 'main';
        if (reel.current) reel.current.dataset.phase = 'main';
      },
      { threshold: Number.EPSILON },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [scene]);

  useEffect(() => {
    const full = main.current;
    const cutaway = waves.current;
    if (!loaded || !full || !cutaway) return;
    if (!playing) {
      full.pause();
      cutaway.pause();
      return;
    }
    let frame = 0;
    const play = (video: HTMLVideoElement) => {
      // 全景先播完时保持末帧，不能让 play() 自动把已结束的视频从头放。
      if (!video.ended) void video.play().catch(() => {});
    };
    const changePhase = (next: Phase) => {
      phase.current = next;
      if (reel.current) reel.current.dataset.phase = next;
    };
    cutaway.playbackRate = WAVE_RATE;
    if (phase.current !== 'waves') play(full);
    if (phase.current !== 'main') play(cutaway);

    // 转场跟着视频时间推进；暂停、缓冲和页面隐藏都会同时冻结转场。
    const step = () => {
      switch (phase.current) {
        case 'main':
          if (
            full.duration > 0 &&
            full.currentTime >= full.duration - FADE - 0.1 &&
            cutaway.readyState >= 2 &&
            !cutaway.seeking
          ) {
            changePhase('into-waves');
            play(cutaway);
          }
          break;
        case 'into-waves': {
          const progress = (cutaway.currentTime - WAVE_START) / (FADE * WAVE_RATE);
          cutaway.style.opacity = String(ease(progress));
          if (progress >= 1) {
            // 只有空镜已经完全不透明时才复位人物，始末人物永不相互叠化。
            full.pause();
            full.currentTime = 0;
            changePhase('waves');
          }
          break;
        }
        case 'waves':
          if (
            cutaway.currentTime >= WAVE_START + (FADE + WAVE_HOLD) * WAVE_RATE &&
            full.readyState >= 2 &&
            !full.seeking
          ) {
            changePhase('out-of-waves');
            play(full);
          }
          break;
        case 'out-of-waves': {
          const progress = full.currentTime / FADE;
          cutaway.style.opacity = String(1 - ease(progress));
          if (progress >= 1) {
            cutaway.pause();
            cutaway.currentTime = WAVE_START;
            changePhase('main');
          }
          break;
        }
      }
      frame = requestAnimationFrame(step);
    };
    frame = requestAnimationFrame(step);
    return () => {
      cancelAnimationFrame(frame);
      full.pause();
      cutaway.pause();
    };
  }, [loaded, playing]);

  return (
    <div
      className="m-footage m-loop-footage m-seaside m-seaside-bridge m-film-b"
      data-ready=""
    >
      <img
        className="m-film-poster"
        src={clip.poster}
        width={clip.width}
        height={clip.height}
        alt=""
        aria-hidden="true"
        loading="lazy"
        decoding="async"
      />
      <div ref={reel} className="m-film-reel" data-phase="main">
        <video
          ref={main}
          src={loaded ? `${clip.src}#t=0` : undefined}
          muted
          playsInline
          preload="auto"
          aria-hidden="true"
          tabIndex={-1}
          onLoadedData={() => {
            if (reel.current) reel.current.dataset.on = '';
          }}
        />
        <video
          ref={waves}
          className="m-bridge-waves"
          src={loaded ? `${clip.src}#t=${WAVE_START}` : undefined}
          muted
          playsInline
          preload="auto"
          aria-hidden="true"
          tabIndex={-1}
          style={{ opacity: 0 }}
        />
      </div>
    </div>
  );
}
