import Link from 'next/link';
import { R3 } from './routes';
import './base.css';

// 第三轮入口：A、D、E 三个方向的首页，内容都是 Folio 首页那一份。

const directions = [
  {
    id: 'a',
    name: 'A · 暖纸与画框',
    note: '一本画册：每件产品一幅画，界面只露最关键的一小块。',
  },
  {
    id: 'd',
    name: 'D · 日光与生活',
    note: '一天的光：从清晨的工作台走到夜里的另一个世界。',
  },
  {
    id: 'e',
    name: 'E · 玩心造物',
    note: '墨线小角色与一种颜色：转一转摇柄，看 Work 怎么干活。',
  },
];

export default function R3Index() {
  return (
    <main className="r3-index">
      <h1>Molis AI 首页 · 第三轮</h1>
      <ul>
        {directions.map((item) => (
          <li key={item.id}>
            <Link href={`${R3}/${item.id}`}>
              <b>{item.id.toUpperCase()}</b>
              <strong>{item.name}</strong>
              <small>{item.note}</small>
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
