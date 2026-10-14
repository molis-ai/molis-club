'use client';
import { RealHome } from '../_kit/home';
import '../_kit/kit.css';
import './afternoon.css';

// 方向一 · 美术馆的午后。天光从顶上洒进白墙展厅，一个人慢慢走过门洞（照片，镜头极慢地推近）；
// 读到那句话时，画面溶进一间洒满阳光的画室，有人在画静物；
// 结尾是暖木长廊的尽头敞开，外面是阳光下的庭园（选图板 美术馆 B3）。纸面是暖白，换词的动作是「对焦」。
// 产品列表先在这一版换成按产品介绍第 3、4 章重写的那一份。
export default function Afternoon() {
  return (
    <RealHome
      direction="afternoon"
      motion="focus"
      bright
      intro
      reel={{
        hero: {
          src: '/images/r8/afternoon-hero.jpg',
          focus: '50% 66%',
          still: true,
        },
        ware: {
          src: '/images/r8/afternoon-ware.mp4',
          rate: 0.8,
        },
        close: {
          src: '/images/r8/afternoon-close.jpg',
          still: true,
        },
      }}
    />
  );
}
