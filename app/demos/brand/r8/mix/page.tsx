'use client';
import { RealHome } from '../_kit/home';
import '../_kit/kit.css';
import './mix.css';

// 方向五 · Mix：以美术馆为基准，借两张别的方向的画面。
// 首屏与第二页同美术馆（天光洒进白墙展厅；阳光照进画室，有人在画静物）；
// 产品列表整段铺海边的首屏（柔和晨光里两个人沿着海边走），列表放在一层半透明的磨砂纸上；
// 结尾换成天空的首屏（被暖光照着的积云，放慢到 0.35 倍）。纸面与调色同美术馆，换词的动作是「对焦」。
export default function Mix() {
  return (
    <RealHome
      direction="mix"
      motion="focus"
      bright
      reel={{
        hero: {
          src: '/images/r8/afternoon-hero.jpg',
          focus: '50% 66%',
          still: true,
        },
        ware: { src: '/images/r8/afternoon-ware.mp4', rate: 0.8 },
        close: { src: '/images/r8/sky-hero.mp4', rate: 0.35 },
      }}
      productsBackdrop={{
        src: '/images/r8/seaside-hero.jpg',
        focus: '50% 60%',
        still: true,
      }}
    />
  );
}
