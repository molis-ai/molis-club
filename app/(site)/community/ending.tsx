'use client';
import { Pause, Play } from 'lucide-react';
import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { community, communityUi } from '../../../content/site/community';
import media from '../../_site/media.json';
import { useReducedMotion, useVisible } from '../../_site/motion';

// 社区结尾（负责人 2026-10-22 从首页末屏挪过来）：一整屏是美术馆午后那段画室——午后的光里，有人对着画架画静物。
// 入场沿用首页原来的「从纸面开窗」（2026-10-24）：画面从上一屏的纸面里像一扇窗打开，读 --p（data-scene），不劫持滚动；
// 没有 JS、减少动态时直接是开满的画面。
// 那句话「带着好奇来，带点什么走，再带点什么回来。」按逗号一段一段浮上来，底下一行当前进展（第 6 章原句的第一句）。
// 画面中间那扇窗最亮，字压在左下，底下和左边各加一层暗色，换到哪一帧字都看得清。
// 视频静音、不进读屏；靠近视口才载入，离开视口或页面隐藏时暂停；减少动态时停在封面帧；右下角可以暂停。

const clip = media['home-painting'] as {
  src: string;
  poster: string;
  rate: number;
  avg: string;
};

const [progress] = community.progress.match(/[^。]+。/) ?? [community.progress];
const phrases = community.closing.split(/(?<=，)/);

export function Ending() {
  const section = useRef<HTMLElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const near = useVisible(section, 0.01);
  const reduced = useReducedMotion();
  const [paused, setPaused] = useState<boolean | null>(null);
  const stopped = paused === null ? reduced : paused;
  const playing = near && !stopped;
  const ui = communityUi.end;

  useEffect(() => {
    const node = video.current;
    if (!node) return;
    // 第一次靠近才载入视频；之前只有封面帧
    if (near && !node.getAttribute('src')) node.setAttribute('src', clip.src);
    node.defaultPlaybackRate = clip.rate;
    node.playbackRate = clip.rate;
    if (playing) void node.play().catch(() => {});
    else node.pause();
  }, [near, playing]);

  return (
    <section
      ref={section}
      className="m-com-end"
      data-scene
      data-tone="film"
      aria-labelledby="end-title"
      style={{ '--end-ground': clip.avg } as CSSProperties}
    >
      <div className="m-com-end-media" aria-hidden="true">
        <video
          ref={video}
          poster={clip.poster}
          muted
          loop
          playsInline
          preload="none"
          tabIndex={-1}
        />
        <span className="m-com-end-veil" />
      </div>
      <div className="m-com-end-body m-wrap">
        <h2 id="end-title" className="m-com-end-title">
          {phrases.map((phrase, index) => (
            <span
              key={phrase}
              data-reveal
              style={{ '--delay': `${index * 420}ms` } as CSSProperties}
            >
              {phrase}
            </span>
          ))}
        </h2>
        <p
          className="m-com-end-progress"
          data-reveal
          style={{ '--delay': `${phrases.length * 420 + 200}ms` } as CSSProperties}
        >
          <b>{community.progressLabel}</b>
          {progress}
        </p>
      </div>
      <button
        type="button"
        className="m-com-end-toggle"
        aria-pressed={stopped}
        aria-label={stopped ? ui.play : ui.pause}
        onClick={() => setPaused(!stopped)}
      >
        {stopped ? (
          <Play size={11} fill="currentColor" aria-hidden="true" />
        ) : (
          <Pause size={11} fill="currentColor" aria-hidden="true" />
        )}
      </button>
    </section>
  );
}
