'use client';
import { useState, useSyncExternalStore } from 'react';
import type { Pulse } from './pulse';

// 会变的那几样：今天的日期、「几分钟前」、仓库的活跃程度。
// 服务端先按北京时间写出确定的字（避免水合不一致），到了浏览器再换成访客自己的日期和相对时间，每半分钟走一次。

const CST = 8 * 3_600_000;
const zh = ['〇', '一', '二', '三', '四', '五', '六', '七', '八', '九'];

/** 1…31 写成中文：十、十五、二十一 */
function zhNumber(n: number) {
  if (n < 10) return zh[n];
  const tens = Math.floor(n / 10);
  const ones = n % 10;
  return `${tens > 1 ? zh[tens] : ''}十${ones ? zh[ones] : ''}`;
}

/** 北京时间的年月日、时分、星期 */
function cst(ms: number) {
  const d = new Date(ms + CST);
  return {
    y: d.getUTCFullYear(),
    m: d.getUTCMonth() + 1,
    d: d.getUTCDate(),
    h: d.getUTCHours(),
    min: d.getUTCMinutes(),
    w: d.getUTCDay(),
  };
}

function local(ms: number) {
  const d = new Date(ms);
  return {
    y: d.getFullYear(),
    m: d.getMonth() + 1,
    d: d.getDate(),
    h: d.getHours(),
    min: d.getMinutes(),
    w: d.getDay(),
  };
}

const two = (n: number) => String(n).padStart(2, '0');

// 一个按间隔走的钟：同一个间隔共用一个订阅函数，快照取到间隔的整数倍，两次之间不变
const clocks = new Map<number, (onChange: () => void) => () => void>();

function clock(every: number) {
  let subscribe = clocks.get(every);
  if (!subscribe) {
    subscribe = (onChange) => {
      const timer = window.setInterval(onChange, every);
      return () => window.clearInterval(timer);
    };
    clocks.set(every, subscribe);
  }
  return subscribe;
}

const serverNow = () => null;

/** 现在几点（按 every 取整）：服务端与水合时为 null */
export function useNow(every = 30_000) {
  return useSyncExternalStore<number | null>(
    clock(every),
    () => Math.floor(Date.now() / every) * every,
    serverNow,
  );
}

/** 竖排页边上的日期：十月十五日 */
export function TodayZh() {
  // 服务端与水合时先写北京时间的今天
  const [first] = useState(() => Date.now());
  const now = useNow(60_000);
  const t = now === null ? cst(first) : local(now);
  return (
    <time dateTime={`${t.y}-${two(t.m)}-${two(t.d)}`} suppressHydrationWarning>
      {zhNumber(t.m)}月{zhNumber(t.d)}日
    </time>
  );
}

/** 「12 分钟前」；服务端先写北京时间的钟点 */
export function Ago({ iso }: { iso: string }) {
  const now = useNow();
  const at = Date.parse(iso);
  let text: string;
  if (now === null) {
    const t = cst(at);
    text = `${t.m} 月 ${t.d} 日 ${two(t.h)}:${two(t.min)}`;
  } else {
    const minutes = Math.max(0, Math.round((now - at) / 60_000));
    if (minutes < 1) text = '刚刚';
    else if (minutes < 60) text = `${minutes} 分钟前`;
    else if (minutes < 60 * 24) text = `${Math.floor(minutes / 60)} 小时前`;
    else text = `${Math.floor(minutes / 60 / 24)} 天前`;
  }
  return (
    <time dateTime={iso} suppressHydrationWarning>
      {text}
    </time>
  );
}

/**
 * 仓库的温度：一小时内有改动时圆点呼吸；一天内亮着；一周内淡一些；七天里都没有改动时变灰。
 * 到了浏览器才判断（要用访客这一刻的时间）。
 */
export type Warmth = 'breathing' | 'lit' | 'quiet' | 'cold';

export function useWarmth(pulse: Pulse | null): Warmth | undefined {
  const now = useNow();
  if (!pulse?.last || now === null) return undefined;
  const age = now - Date.parse(pulse.last.at);
  if (age < 3_600_000) return 'breathing';
  if (age < 86_400_000) return 'lit';
  if (age < 7 * 86_400_000) return 'quiet';
  return 'cold';
}

export function WarmDot({ pulse }: { pulse: Pulse | null }) {
  const warmth = useWarmth(pulse);
  return <i className="fo-dot" data-warmth={warmth} aria-hidden="true" />;
}
