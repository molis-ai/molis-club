// D 的日光：按访客当地的时刻算出天色、云色、太阳或月亮的位置，以及影子的浓淡与倾斜。
// 关键时刻之间线性插值；整页通过 CSS 变量读这些值。

type RGB = [number, number, number];
const hex = (value: string): RGB => {
  const n = parseInt(value.slice(1), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
};
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const mixRGB = (a: RGB, b: RGB, t: number): RGB => [
  lerp(a[0], b[0], t),
  lerp(a[1], b[1], t),
  lerp(a[2], b[2], t),
];
export const css = (c: RGB) => `rgb(${c[0] | 0} ${c[1] | 0} ${c[2] | 0})`;

type Key = {
  h: number;
  top: string;
  mid: string;
  low: string;
  cloud: string;
  shade: string;
};

/** 一天里的几个关键时刻 */
const keys: Key[] = [
  {
    h: 0,
    top: '#091027',
    mid: '#141f44',
    low: '#26355e',
    cloud: '#2a3457',
    shade: '#1a2340',
  },
  {
    h: 4.8,
    top: '#0d1430',
    mid: '#1c2650',
    low: '#36406b',
    cloud: '#323b62',
    shade: '#1d2546',
  },
  {
    h: 6,
    top: '#3b4677',
    mid: '#9a87a8',
    low: '#f3b991',
    cloud: '#f4c6ae',
    shade: '#6c6077',
  },
  {
    h: 7.5,
    top: '#79a2d4',
    mid: '#b9d1e8',
    low: '#fbe6c8',
    cloud: '#fff6ec',
    shade: '#9ba9bd',
  },
  {
    h: 12,
    top: '#4c8ad2',
    mid: '#97c0e8',
    low: '#e1eef8',
    cloud: '#ffffff',
    shade: '#8aa1ba',
  },
  {
    h: 16.3,
    top: '#5b8bca',
    mid: '#a9c4df',
    low: '#f1e4cf',
    cloud: '#fff5e6',
    shade: '#93a2b4',
  },
  {
    h: 18.2,
    top: '#6a83bd',
    mid: '#e3b087',
    low: '#f8d29c',
    cloud: '#fbe0c2',
    shade: '#9a8f97',
  },
  {
    h: 19.3,
    top: '#3c4b84',
    mid: '#c27773',
    low: '#f0a46e',
    cloud: '#e69d8d',
    shade: '#6f6283',
  },
  {
    h: 20.4,
    top: '#1b2550',
    mid: '#474777',
    low: '#9c6479',
    cloud: '#5d5578',
    shade: '#3a3a62',
  },
  {
    h: 21.6,
    top: '#0b1229',
    mid: '#172248',
    low: '#2a385f',
    cloud: '#2b3558',
    shade: '#1b2442',
  },
  {
    h: 24,
    top: '#091027',
    mid: '#141f44',
    low: '#26355e',
    cloud: '#2a3457',
    shade: '#1a2340',
  },
];

export type Light = {
  hour: number;
  top: RGB;
  mid: RGB;
  low: RGB;
  cloud: RGB;
  shadeColor: RGB;
  /** 太阳（或夜里的月亮）在天上的位置，0–1 */
  sunX: number;
  sunY: number;
  /** 太阳高度 0–1；夜里为 0 */
  altitude: number;
  night: boolean;
  /** 天上文字该用深色还是浅色 */
  darkInk: boolean;
  /** 影子的浓淡与倾斜 */
  shadow: number;
  skew: number;
  stars: number;
};

const luminance = (c: RGB) =>
  (0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2]) / 255;

export function lightAt(hourInput: number): Light {
  const hour = ((hourInput % 24) + 24) % 24;
  let i = 0;
  while (i < keys.length - 2 && keys[i + 1].h <= hour) i++;
  const a = keys[i];
  const b = keys[i + 1];
  const t = (hour - a.h) / (b.h - a.h || 1);
  const pick = (key: keyof Omit<Key, 'h'>) =>
    mixRGB(hex(a[key]), hex(b[key]), t);
  const top = pick('top');
  const mid = pick('mid');
  const low = pick('low');
  // 太阳 6 点升起 18:30 落下；夜里换成月亮，走另一段弧
  const day = (hour - 6) / 12.5;
  const isDay = day >= 0 && day <= 1;
  const altitude = isDay ? Math.sin(Math.PI * day) : 0;
  const moonPhase = isDay ? 0 : ((hour + 24 - 18.5) % 24) / 11.5;
  const sunX = isDay ? 0.08 + day * 0.84 : 0.12 + moonPhase * 0.76;
  const sunY = isDay
    ? 0.82 - altitude * 0.62
    : 0.7 - Math.sin(Math.PI * moonPhase) * 0.5;
  const night = !isDay || hour > 20 || hour < 5.5;
  const stars = Math.max(0, Math.min(1, (0.32 - luminance(mid)) / 0.18));
  return {
    hour,
    top,
    mid,
    low,
    cloud: pick('cloud'),
    shadeColor: pick('shade'),
    sunX,
    sunY,
    altitude,
    night,
    darkInk: luminance(mid) > 0.62,
    shadow: isDay ? 0.05 + altitude * 0.12 + (1 - altitude) * 0.04 : 0.025,
    skew: isDay ? (0.5 - (day * 0.84 + 0.08)) * 70 : 0,
    stars,
  };
}

/** 读 ?t=小时，便于预览一天中的任意时刻 */
export function initialHour() {
  if (typeof window !== 'undefined') {
    const t = new URLSearchParams(window.location.search).get('t');
    if (t && !Number.isNaN(Number(t))) return Number(t);
  }
  const now = new Date();
  return now.getHours() + now.getMinutes() / 60;
}

export const clock = (hour: number) => {
  const h = Math.floor(((hour % 24) + 24) % 24);
  const m = Math.floor((hour - Math.floor(hour)) * 60);
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
};
