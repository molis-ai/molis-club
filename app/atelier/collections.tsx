'use client';
import { useState, useRef } from 'react';
import Link from '../edition-link';
import { Photo } from './motion';
const scenes = [
  {
    name: '做一些作品',
    title: '小小的工具，\n真实的感受。',
    body: '从桌面上的一头牛，到一段关于人生选择的旅程。',
    image: 'studio-desk',
    href: '/products',
    action: '发现产品',
  },
  {
    name: '留下一些方法',
    title: '喜欢的表达，\n可以学会。',
    body: '看看一段动效如何发生，把一种创作方法带回本地。',
    image: 'reading-room',
    href: '/wiki',
    action: '翻开百科',
  },
  {
    name: '认识一些人',
    title: '围坐下来，\n让想法发生。',
    body: '作品背后，是具体的人，也有还在生长的想法。',
    image: 'shared-studio',
    href: '/community',
    action: '走进社区',
  },
];
export default function Collections() {
  const [active, setActive] = useState(0);
  const buttons = useRef<(HTMLButtonElement | null)[]>([]);
  const scene = scenes[active];
  return (
    <section className="atelier-collections">
      <div className="atelier-tabs" role="tablist" aria-label="工作室里的创作">
        {scenes.map((s, i) => (
          <button
            key={s.name}
            ref={(node) => {
              buttons.current[i] = node;
            }}
            id={`scene-tab-${i}`}
            role="tab"
            aria-selected={i === active}
            tabIndex={i === active ? 0 : -1}
            aria-controls="studio-scene-panel"
            onClick={() => setActive(i)}
            onKeyDown={(e) => {
              let n = active;
              if (e.key === 'ArrowRight') n = (active + 1) % scenes.length;
              else if (e.key === 'ArrowLeft')
                n = (active + scenes.length - 1) % scenes.length;
              else if (e.key === 'Home') n = 0;
              else if (e.key === 'End') n = scenes.length - 1;
              else return;
              e.preventDefault();
              setActive(n);
              buttons.current[n]?.focus();
            }}
          >
            {s.name}
          </button>
        ))}
      </div>
      <div
        className="atelier-collection-scene"
        id="studio-scene-panel"
        role="tabpanel"
        aria-labelledby={`scene-tab-${active}`}
      >
        <Photo key={scene.image} src={`/images/atelier/${scene.image}.jpg`} />
        <div>
          <h2>{scene.title}</h2>
          <p>{scene.body}</p>
          <Link href={scene.href}>{scene.action}</Link>
        </div>
      </div>
    </section>
  );
}
