import type { SceneSpec } from './painter';

// 五幅画：首屏的清晨田野，Work 的正午麦田，Tool 的午后湖，Life 的黄昏花园，Story 的夜港。
// 色彩统一在暖金、橄榄、灰蓝里，只有夜港换成深蓝与琥珀灯火。

export const scenes = {
  morning: {
    seed: 11,
    sky: ['#e2b85c', '#f0d48e', '#f8e8c2'],
    horizon: 0.6,
    sun: { u: 0.7, v: 0.38, r: 0.2, color: '#fff3cf', core: '#fffaf0' },
    layers: [
      {
        base: 0.54,
        amp: 0.09,
        freq: 1.3,
        color: '#9b9cae',
        low: '#aaa69c',
        haze: 0.3,
        seed: 3,
      },
      {
        base: 0.62,
        amp: 0.07,
        freq: 2.1,
        color: '#7f8c4f',
        low: '#93954f',
        haze: 0.08,
        seed: 7,
      },
      {
        base: 0.71,
        amp: 0.035,
        freq: 1.6,
        color: '#d4b55c',
        low: '#bf9a40',
        seed: 13,
      },
      {
        base: 0.84,
        amp: 0.04,
        freq: 3.6,
        color: '#748537',
        low: '#4d5a24',
        grass: true,
        seed: 19,
      },
    ],
    trees: [
      { u: 0.11, v: 0.55, r: 0.15, color: '#46512a', light: '#7f8a3f' },
      { u: 0.19, v: 0.66, r: 0.07, color: '#4c5730', light: '#8a9246' },
      { u: 0.86, v: 0.63, r: 0.05, color: '#5a6233', light: '#9a9b4e' },
    ],
    dabs: [
      {
        colors: ['#fff6e2', '#f5c27a', '#ef9a5c'],
        from: 0.86,
        to: 1,
        count: 150,
        size: 7,
      },
    ],
  },
  noon: {
    seed: 23,
    sky: ['#9fbfd2', '#cddfe4', '#f2ecd8'],
    horizon: 0.55,
    sun: { u: 0.22, v: 0.18, r: 0.16, color: '#fff7df' },
    layers: [
      {
        base: 0.48,
        amp: 0.08,
        freq: 1.2,
        color: '#8899a6',
        haze: 0.3,
        seed: 5,
      },
      {
        base: 0.57,
        amp: 0.06,
        freq: 2,
        color: '#7b8c55',
        low: '#90984f',
        haze: 0.08,
        seed: 9,
      },
      {
        base: 0.66,
        amp: 0.02,
        freq: 1.5,
        color: '#dcc06a',
        low: '#cfa94c',
        seed: 15,
      },
      {
        base: 0.86,
        amp: 0.03,
        freq: 3.4,
        color: '#c9a64b',
        low: '#9c7f33',
        grass: true,
        seed: 21,
      },
    ],
    trees: [{ u: 0.8, v: 0.55, r: 0.09, color: '#4a5530', light: '#8a9246' }],
    dabs: [
      { colors: ['#f8efd8', '#e8894f'], from: 0.88, to: 1, count: 60, size: 6 },
    ],
  },
  lake: {
    seed: 31,
    sky: ['#8fb2c9', '#c7d8dd', '#f1e9d3'],
    horizon: 0.52,
    sun: { u: 0.62, v: 0.3, r: 0.14, color: '#fff3d6' },
    layers: [
      {
        base: 0.45,
        amp: 0.09,
        freq: 1.3,
        color: '#7d8fa3',
        haze: 0.25,
        seed: 4,
      },
      {
        base: 0.53,
        amp: 0.04,
        freq: 2.6,
        color: '#5f7357',
        low: '#667553',
        haze: 0.05,
        seed: 8,
      },
      { base: 0.58, amp: 0.004, freq: 1, color: '#9fb6bf', seed: 12 },
      {
        base: 0.88,
        amp: 0.04,
        freq: 6,
        color: '#8a8a48',
        low: '#5d6334',
        grass: true,
        seed: 17,
      },
    ],
    water: { from: 0.58, tint: '#7f9aa6', amount: 0.32 },
    glint: { u: 0.62, width: 0.08, color: '#fbf1d8' },
    dabs: [
      { colors: ['#e4c27c', '#f4e7c8'], from: 0.9, to: 1, count: 40, size: 5 },
    ],
  },
  dusk: {
    seed: 41,
    sky: ['#d9876a', '#efb48a', '#f7dcb5'],
    horizon: 0.58,
    sun: { u: 0.36, v: 0.5, r: 0.2, color: '#ffe0b0', core: '#fff1d8' },
    layers: [
      {
        base: 0.52,
        amp: 0.08,
        freq: 1.4,
        color: '#9c7a86',
        low: '#ab8580',
        haze: 0.25,
        seed: 6,
      },
      {
        base: 0.62,
        amp: 0.06,
        freq: 2.3,
        color: '#6e6a4e',
        low: '#7c6c48',
        haze: 0.06,
        seed: 10,
      },
      {
        base: 0.76,
        amp: 0.035,
        freq: 3.8,
        color: '#5e6a37',
        low: '#3f4a26',
        grass: true,
        seed: 14,
      },
    ],
    trees: [
      { u: 0.83, v: 0.56, r: 0.12, color: '#3f4228', light: '#6d6a3a' },
      { u: 0.93, v: 0.66, r: 0.07, color: '#43462b', light: '#74713f' },
    ],
    dabs: [
      {
        colors: ['#f3a7a0', '#fff1dd', '#f0b25e', '#e7889a'],
        from: 0.78,
        to: 1,
        count: 260,
        size: 7,
      },
    ],
  },
  harbor: {
    seed: 53,
    sky: ['#0d1630', '#1a2a4c', '#3a4c6f'],
    horizon: 0.58,
    sun: { u: 0.72, v: 0.22, r: 0.06, color: '#d9d2b4', core: '#fbf3dc' },
    layers: [
      {
        base: 0.5,
        amp: 0.1,
        freq: 1.4,
        color: '#141e38',
        low: '#18233f',
        seed: 2,
      },
      { base: 0.6, amp: 0.003, freq: 1, color: '#1b2b48', seed: 16 },
    ],
    water: { from: 0.6, tint: '#13203a', amount: 0.55 },
    glint: { u: 0.72, width: 0.05, color: '#e9dcb4' },
    dabs: [
      {
        colors: ['#f1d9a6', '#cfd6e6'],
        from: 0.02,
        to: 0.45,
        count: 70,
        size: 2.6,
      },
      {
        colors: ['#f6b25a', '#ffd38a'],
        from: 0.575,
        to: 0.6,
        count: 38,
        size: 4.5,
      },
    ],
  },
  golden: {
    seed: 61,
    sky: ['#b8743c', '#e0a35a', '#f6d9a0'],
    horizon: 0.64,
    sun: { u: 0.5, v: 0.6, r: 0.22, color: '#ffe2a8', core: '#fff3d4' },
    layers: [
      {
        base: 0.6,
        amp: 0.05,
        freq: 1.5,
        color: '#9b7458',
        low: '#a57d57',
        haze: 0.35,
        seed: 18,
      },
      {
        base: 0.7,
        amp: 0.04,
        freq: 2.2,
        color: '#6a5a38',
        low: '#5b4c2e',
        haze: 0.08,
        seed: 22,
      },
      {
        base: 0.84,
        amp: 0.03,
        freq: 3,
        color: '#4f4a26',
        low: '#35321a',
        grass: true,
        seed: 26,
      },
    ],
    trees: [
      { u: 0.08, v: 0.5, r: 0.17, color: '#2f2c19', light: '#5a4c2a' },
      { u: 0.93, v: 0.56, r: 0.12, color: '#302d1a', light: '#5d4f2b' },
    ],
    dabs: [
      { colors: ['#ffd38a', '#f6b25a'], from: 0.86, to: 1, count: 60, size: 5 },
    ],
  },
} satisfies Record<string, SceneSpec>;

export type SceneName = keyof typeof scenes;

/** 画还没画出来时的底色：同一组颜色的渐变 */
export const fallback: Record<SceneName, string> = {
  morning:
    'linear-gradient(#e2b85c, #f0d48e 34%, #f8e8c2 58%, #a69d55 64%, #cdb25c 72%, #6d7a36)',
  noon: 'linear-gradient(#9fbfd2, #cddfe4 30%, #f2ecd8 54%, #8b9a62 58%, #dcc06a 68%, #b0903f)',
  lake: 'linear-gradient(#8fb2c9, #c7d8dd 30%, #f1e9d3 50%, #6f8064 54%, #9fb6bf 60%, #7f9aa6 86%, #6d6f3e)',
  dusk: 'linear-gradient(#d9876a, #efb48a 32%, #f7dcb5 56%, #7d7258 64%, #4c5830)',
  harbor:
    'linear-gradient(#0d1630, #1a2a4c 34%, #3a4c6f 56%, #1b2744 60%, #13203a)',
  golden:
    'linear-gradient(#b8743c, #e0a35a 34%, #f6d9a0 62%, #6a5a38 70%, #35321a)',
};
