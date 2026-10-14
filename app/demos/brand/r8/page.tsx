import Link from 'next/link';
import { directions, R8 } from './_kit/directions';
import './index.css';

// 第八轮的入口：三个方向一字排开，各自一句话说清楚「温暖从哪里来」，另附当前的白盒子美术馆作对照。

const notes: Record<string, { warm: string; motion: string; tone: string[] }> =
  {
    afternoon: {
      warm: '天光洒进白墙展厅，一个人走过门洞；往下读，画面溶进一间洒满阳光的画室，有人在画静物；结尾是从玻璃展厅望出去的花园和晴空。',
      motion:
        '首屏是一张真实的照片，镜头极慢地推近，深色字像展览海报。换词是「对焦」。',
      tone: ['#f6f2ec', '#e9e4dc', '#c9b49a', '#23201c', '#ea9260'],
    },
    park: {
      warm: '午后的阳光穿过树林落在草坪上；往下读，阳光斑驳的草地上几个人围着桌子写生；结尾是穿过树梢的太阳和蓝天。',
      motion: '树林放慢到一半的速度。换词是「被风带起」。',
      tone: ['#f4f3ec', '#9fae7c', '#e8d6a8', '#1f231e', '#ea9260'],
    },
    sky: {
      warm: '被暖光照着的积云慢慢走；往下读，开阔的草地上有人在大片天空下写生；结尾是明亮的太阳和高处的薄云。',
      motion:
        '云放慢到原来的三分之一多，最接近 The Light Phone。换词是「升起」。',
      tone: ['#f3f3f1', '#a9bfd8', '#f2c79a', '#1d2638', '#ea9260'],
    },
    mix: {
      warm: '以美术馆为基准：白墙展厅 → 阳光画室；产品列表整段铺着海边的晨光（两个人沿着海边走），结尾换成天空里被暖光照着的积云。',
      motion: '三种场景混在一起，看能不能互相借光。换词是「对焦」。',
      tone: ['#f6f2ec', '#e9e4dc', '#e8d3bd', '#23201c', '#ea9260'],
    },
    seaside: {
      warm: '清早平静的海面，阳光在浪上碎成金色；往下读，礁石边有人戴着草帽对着大海作画；结尾是白沙滩、蓝天和慢慢涌上来的浪。',
      motion: '海浪放慢。换词是「升起」。',
      tone: ['#f5f2eb', '#9ec3d6', '#f0d9b0', '#1c2229', '#ea9260'],
    },
  };

export default function R8Index() {
  return (
    <main className="r8i">
      <header className="r8i-head">
        <p className="r8i-kicker">
          <span lang="en">Round 8</span>
          <span>首页方向 · 2026-10-14</span>
        </p>
        <h1>
          白盒子的底子，
          <br />
          换成真实的光和风景。
        </h1>
        <p className="r8i-lead">
          三个方向用同一份内容、同一套字体（Jost 细体 +
          苹方细体）和同一个页面结构：首屏（Molis AI 与 A/I 打字机）→ We build
          Warmware Beyond Software → 产品列表（悬停换主画面）→
          结尾三张卡。画面全部换成真实拍摄的影像：第一段钉在视口里，首屏和那句话从它上面滚过去，再慢慢溶进第二段；结尾是第三段。影像是
          Mixkit 与 Unsplash
          的免费授权素材，评审阶段直接引用，选定后再取回本地压缩。
        </p>
      </header>
      <ol className="r8i-list">
        {directions.map((direction, index) => {
          const note = notes[direction.id];
          return (
            <li key={direction.id}>
              <Link href={`${R8}/${direction.id}`} className="r8i-card">
                <span className="r8i-no">{index + 1}</span>
                <span className="r8i-swatches" aria-hidden="true">
                  {note.tone.map((color) => (
                    <i key={color} style={{ background: color }} />
                  ))}
                </span>
                <strong>{direction.name}</strong>
                <small lang="en">{direction.en}</small>
                <span className="r8i-warm">{note.warm}</span>
                <span className="r8i-motion">{note.motion}</span>
                <span className="r8i-go">打开看看 →</span>
              </Link>
            </li>
          );
        })}
      </ol>
      <p className="r8i-base">
        <Link href={`${R8}/picks`}>选图板：每个方向三张一组的候选</Link>
        <span aria-hidden="true"> · </span>
        对照：
        <Link href="/demos/brand/gallery">现在的白盒子美术馆</Link>
      </p>
    </main>
  );
}
