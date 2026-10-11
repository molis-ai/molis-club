import Link from 'next/link';
import { R4 } from './routes';
import '../r3/base.css';

// 第四轮入口：A、D、E 各一版，从零开始，内容按 Folio 首页组织。第三轮保留在 /demos/brand/r3。

const directions = [
  {
    id: 'a',
    name: 'A · 暖纸与画框',
    note: '画在浏览器里一笔一笔画出来；产品是一叠带油画报头的刊物。',
  },
  {
    id: 'd',
    name: 'D · 日光与生活',
    note: '页面的光跟着你此刻的时间走；产品是阳光下的几块纸面屏幕。',
  },
  {
    id: 'e',
    name: 'E · 玩心造物',
    note: '一间线描的工作室，四件产品是房间里的物件，也是四张牌。',
  },
];

export default function R4Index() {
  return (
    <main className="r3-index">
      <h1>Molis AI 首页 · 第四轮</h1>
      <ul>
        {directions.map((item) => (
          <li key={item.id}>
            <Link href={`${R4}/${item.id}`}>
              <b>{item.id.toUpperCase()}</b>
              <strong>{item.name}</strong>
              <small>{item.note}</small>
            </Link>
          </li>
        ))}
        <li>
          <Link href="/demos/brand/r5">
            <b>5</b>
            <strong>夜间展馆</strong>
            <small>
              首页是一场展览：前厅、四个展厅、出口，滚动就是往前走。
            </small>
          </Link>
        </li>
        <li>
          <Link href="/demos/brand/r6">
            <b>6</b>
            <strong>白盒子美术馆</strong>
            <small>近白的展墙与展签，镜头随滚动走进一间间白盒子展厅。</small>
          </Link>
        </li>
        <li>
          <Link href="/demos/brand/r3">
            <b>3</b>
            <strong>第三轮</strong>
            <small>上一轮的 A、D、E，原样保留。</small>
          </Link>
        </li>
      </ul>
    </main>
  );
}
