'use client';
import { RealHome } from '../_kit/home';
import '../_kit/kit.css';
import './park.css';

// 方向二 · 日光公园（选图板定稿）：
// 首屏是清早的公园，雾气从草地升起，阳光一道道照进来，有人在雾里散步（公园 A3，照片极慢推近）；
// 读到那句话时，画面溶进阳光斑驳的草地，几个人围着桌子写生，脚边趴着一只狗；
// 结尾抬头看，太阳穿过树梢，蓝天（公园 结尾-2，视频放慢到 0.5 倍）。纸面带一点草地的暖，换词的动作是「被风带起」。
export default function Park() {
  return (
    <RealHome
      direction="park"
      motion="breeze"
      reel={{
        hero: {
          src: '/images/r8/park-hero.jpg',
          focus: '50% 55%',
          still: true,
        },
        ware: {
          src: '/images/r8/park-ware.jpg',
          focus: '50% 50%',
          still: true,
        },
        close: { src: '/images/r8/park-close.mp4', rate: 0.5 },
      }}
    />
  );
}
