'use client';
import { RealHome } from '../_kit/home';
import '../_kit/kit.css';
import './seaside.css';

// 方向四 · 海边（选图板定稿）：
// 首屏是柔和的晨光里，两个人沿着海边慢慢走（海边 A3，照片极慢推近）；
// 读到那句话时，画面溶进礁石边的海岸，有人戴着草帽对着大海作画（海边 第二页-2，镜像后人在右边）；
// 结尾是日出时的海岸线，镜头沿着沙滩慢慢往前飞（海边 C3，视频放慢到 0.6 倍）。纸面是被晒过的沙色，换词的动作是「升起」。
export default function Seaside() {
  return (
    <RealHome
      direction="seaside"
      motion="rise"
      reel={{
        hero: {
          src: '/images/r8/seaside-hero.jpg',
          focus: '50% 60%',
          still: true,
        },
        ware: {
          src: '/images/r8/seaside-ware.jpg',
          focus: '50% 55%',
          still: true,
          flip: true,
        },
        close: { src: '/images/r8/seaside-close.mp4', rate: 0.6 },
      }}
    />
  );
}
