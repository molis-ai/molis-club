// 《吉内薇拉·德·班琪》在原图（维基共享资源 10483×11110 的扫描）里的坐标：三层配图各自覆盖的区域，
// 推近的终点（杜松与天空交界、她左肩上方），以及推近到最后框里看得见原图多宽。
// 三层都由 scripts/site-media.mjs 压成 WebP；改了裁切要同时改这里。

export const FULL = { w: 10483, h: 11110 };

export const LAYERS = [
  { name: 'ginevra-whole', x: 0, y: 0, w: 10483, h: 11110 },
  { name: 'ginevra-near', x: 6283, y: 1200, w: 4200, h: 4200 },
  { name: 'ginevra-edge', x: 8350, y: 2500, w: 1600, h: 1600 },
] as const;

export const TARGET = { x: 9150, y: 3300 };

/** 推近的终点：框的宽度里装下原图的 1000 像素 */
export const END_WIDTH = 1000;
