'use client';
import { useCallback, useEffect, useRef, useState } from 'react';
import type { CSSProperties, KeyboardEvent, PointerEvent } from 'react';
import { useReducedMotion } from '../../../../_site/motion';
import { clamp, useFollow } from '../follow';
import media from '../media.json';

// 浅色与深色：两张逐像素对齐的真实截图（项目首页，浅 / 深），一道竖线把它们分开。
// 拖竖线（或在画面上任意处按住拖），线左边是深色、右边是浅色；点正文里的「深色」整张滑过去，再点滑回来。
// 截图只做裁切与遮罩，不改内容。

export function Wipe() {
  const reduced = useReducedMotion();
  const root = useRef<HTMLDivElement>(null);
  const frame = useRef<HTMLDivElement>(null);
  const knob = useRef<HTMLDivElement>(null);
  const drag = useRef<number | null>(null);
  const [dark, setDark] = useState(false);

  const draw = useCallback((w: number) => {
    root.current?.style.setProperty('--w', w.toFixed(4));
    knob.current?.setAttribute('aria-valuenow', String(Math.round(w * 100)));
  }, []);
  const follow = useFollow(0.06, draw, reduced);

  // 进入视口时，深色从左边滑进来一半
  useEffect(() => {
    const node = root.current;
    if (!node) return;
    if (reduced) {
      follow.jump(0.5);
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        observer.disconnect();
        window.setTimeout(() => {
          if (drag.current === null) follow.to(0.5, 700);
        }, 300);
      },
      { threshold: 0.6 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [reduced, follow]);

  const at = (clientX: number) => {
    const rect = frame.current?.getBoundingClientRect();
    if (!rect) return 0.5;
    return clamp((clientX - rect.left) / rect.width, 0, 1);
  };
  const down = (event: PointerEvent<HTMLDivElement>) => {
    if (event.button !== 0) return;
    drag.current = event.pointerId;
    event.currentTarget.setPointerCapture(event.pointerId);
    follow.to(at(event.clientX));
  };
  const move = (event: PointerEvent<HTMLDivElement>) => {
    if (drag.current !== event.pointerId) return;
    follow.to(at(event.clientX));
  };
  const up = (event: PointerEvent<HTMLDivElement>) => {
    if (drag.current !== event.pointerId) return;
    drag.current = null;
    setDark(follow.target() > 0.5);
  };
  const key = (event: KeyboardEvent<HTMLDivElement>) => {
    const step = event.shiftKey ? 0.2 : 0.05;
    const map: Record<string, number> = {
      ArrowRight: follow.target() + step,
      ArrowLeft: follow.target() - step,
      Home: 0,
      End: 1,
    };
    if (!(event.key in map)) return;
    event.preventDefault();
    follow.to(clamp(map[event.key], 0, 1), event.key.length < 5);
  };
  const toggle = () => {
    const next = follow.target() < 0.5;
    setDark(next);
    follow.to(next ? 1 : 0, 900);
  };

  const light = media['home-zh'];
  const night = media['home-dark-zh'];

  return (
    <div className="pl-wipe" ref={root} style={{ '--w': 0.06 } as CSSProperties}>
      <header className="pl-wipe-head">
        <p className="pl-cap" lang="en">
          Light <span aria-hidden="true">·</span> Dark
        </p>
        <h2 className="pl-thread-line" id="pl-wipe-title">
          同一张工作台，
          <button
            type="button"
            className="pl-key"
            data-c="dusk"
            aria-pressed={dark}
            onClick={toggle}
          >
            深色
          </button>
          也一样。
        </h2>
        <p className="pl-thread-sub">深色模式分三层。拖那道线看看。</p>
      </header>
      <div
        className="pl-wipe-frame"
        ref={frame}
        onPointerDown={down}
        onPointerMove={move}
        onPointerUp={up}
        onPointerCancel={up}
      >
        <img
          src={light.src}
          width={light.width}
          height={light.height}
          loading="lazy"
          decoding="async"
          draggable={false}
          alt="Molis Work 项目首页（浅色）：今天的工作、日期条、正在推进的 Goal、当天的事件，右边是随手记。"
        />
        <img
          className="pl-wipe-dark"
          src={night.src}
          width={night.width}
          height={night.height}
          loading="lazy"
          decoding="async"
          draggable={false}
          alt="同一页的深色模式。"
        />
        <div
          ref={knob}
          className="pl-wipe-line"
          // oxlint-disable-next-line jsx-a11y/prefer-tag-over-role -- 自定义拖动的把手，键盘照 slider 的约定操作
          role="slider"
          tabIndex={0}
          aria-label="浅色与深色的分界（百分比）"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={6}
          onKeyDown={key}
        >
          <span className="pl-wipe-knob" aria-hidden="true" />
        </div>
        <span className="pl-wipe-tag pl-wipe-tag-l" aria-hidden="true">
          深色
        </span>
        <span className="pl-wipe-tag pl-wipe-tag-r" aria-hidden="true">
          浅色
        </span>
      </div>
      <p className="pl-honest">
        <span className="pl-tag">开发中版本截图</span>
        两张截图来自同一份演示数据，逐像素对齐。
      </p>
    </div>
  );
}
