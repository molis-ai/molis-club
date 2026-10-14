'use client';
import { RealHome } from '../_kit/home';
import '../_kit/kit.css';
import './sky.css';

// 方向三 · 天空（选图板定稿）：
// 首屏是被暖光照着的积云慢慢走（天空 A1，延时素材放慢到 0.35 倍）；
// 读到那句话时，画面溶进夕阳下的草地，有人对着画架写生，天空很大（天空 第二页-1，镜像后人在右边）；
// 结尾是淡蓝天上一缕缕粉橙色的云（天空 结尾-1）。纸面偏一点天光的灰，换词的动作是「升起」。
export default function SkyHome() {
  return (
    <RealHome
      direction="sky"
      motion="rise"
      reel={{
        hero: { src: '/images/r8/sky-hero.mp4', rate: 0.35 },
        ware: {
          src: '/images/r8/sky-ware.jpg',
          focus: '50% 60%',
          still: true,
          flip: true,
        },
        close: {
          src: '/images/r8/sky-close.jpg',
          focus: '50% 50%',
          still: true,
        },
      }}
    />
  );
}
