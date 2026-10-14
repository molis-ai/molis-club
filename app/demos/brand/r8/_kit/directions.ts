// 第八轮的三个方向与入口地址；服务端的入口页和客户端的切换条都读这里。

export type DirectionId = 'afternoon' | 'park' | 'sky' | 'seaside' | 'mix';

export const R8 = '/demos/brand/r8';

export const directions: { id: DirectionId; name: string; en: string }[] = [
  { id: 'afternoon', name: '美术馆的午后', en: 'Gallery in daylight' },
  { id: 'park', name: '日光公园', en: 'Park in daylight' },
  { id: 'sky', name: '天空', en: 'Open sky' },
  { id: 'seaside', name: '海边', en: 'By the sea' },
  { id: 'mix', name: 'Mix', en: 'Gallery, sea and sky' },
];
