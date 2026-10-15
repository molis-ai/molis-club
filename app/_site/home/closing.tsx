'use client';
import Link from 'next/link';
import { ArrowRight, Pause, Play } from 'lucide-react';
import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { homeClosing } from '../../../content/site/home';
import media from '../media.json';
import { useReducedMotion, useVisible } from '../motion';
import { ABOUT, COMMUNITY, ENTERPRISE } from '../routes';

// 首页第四屏：结尾（第八轮的结尾，负责人 2026-10-15 重新配过）。
// 一整屏是第八轮美术馆午后那段画室：午后的光里，有人对着画架画静物；画面从产品列表的纸面里像一扇窗慢慢打开（读 --p）。
// 过渡句「让口味相近的人认出彼此。」和三张磨砂玻璃卡片都在这一块画面里，整段不超过一屏：
// 企业合作、社区、关于我们。整张卡片都是链接；鼠标停上去，卡片浮起、玻璃亮一档、一道光扫过，其余两张退后一点。
// 视频静音、不进读屏；进入视口才载入，离开视口或页面隐藏时暂停；减少动态时停在封面帧；右下角可以暂停。

const href = { enterprise: ENTERPRISE, community: COMMUNITY, about: ABOUT };

const clip = media['home-painting'] as {
  src: string;
  poster: string;
  rate: number;
  avg: string;
};

export function Closing() {
  const close = homeClosing;
  const section = useRef<HTMLElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const near = useVisible(section, 0.01);
  const reduced = useReducedMotion();
  const [paused, setPaused] = useState<boolean | null>(null);
  const stopped = paused === null ? reduced : paused;
  const playing = near && !stopped;

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
      className="m-close"
      data-scene
      data-tone="film"
      aria-labelledby="m-close-title"
      style={{ '--close-ground': clip.avg } as CSSProperties}
    >
      <div className="m-close-media" aria-hidden="true">
        <video
          ref={video}
          className="m-close-footage"
          poster={clip.poster}
          muted
          loop
          playsInline
          preload="none"
          tabIndex={-1}
        />
        <span className="m-close-veil" />
      </div>

      <div className="m-close-body">
        <h2 id="m-close-title" className="m-close-lead" data-reveal>
          {close.lead.map((line) => (
            <span key={line}>{line}</span>
          ))}
        </h2>
        <ul className="m-close-cards">
          {close.paths.map((path, index) => (
            <li
              key={path.id}
              data-reveal
              style={{ '--delay': `${index * 90}ms` } as CSSProperties}
            >
              <Link className="m-card" href={href[path.id]}>
                <span className="m-card-head">
                  <b lang="en">{String(index + 1).padStart(2, '0')}</b>
                  <span>
                    {path.label}
                    <i lang="en"> · {path.en}</i>
                  </span>
                </span>
                <span className="m-card-title">
                  {path.title.map((line) => (
                    <span key={line}>{line}</span>
                  ))}
                </span>
                <span className="m-card-go">
                  <span>{path.link}</span>
                  <ArrowRight size={15} aria-hidden="true" />
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>

      <button
        type="button"
        className="m-film-toggle m-close-toggle"
        aria-pressed={stopped}
        aria-label={stopped ? close.play : close.pause}
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
