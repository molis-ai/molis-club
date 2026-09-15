'use client';
import Link from './edition-link';
import { useState, type CSSProperties, type PointerEvent } from 'react';
import './studio-directory.css';

const rooms = [
  {
    href: '/community',
    name: '社区',
    note: '创作者与他们的世界',
    image: '/images/molis-makers-studio.png',
    color: '#dce3de',
  },
  {
    href: '/wiki',
    name: '百科',
    note: '把喜欢的表达，变成能力',
    image: '/images/studio-series/encyclopedia-atelier.jpg',
    color: '#e6dbc9',
  },
  {
    href: '/products',
    name: '产品',
    note: '一些正在生长的作品',
    image: '/images/line-tools.jpg',
    color: '#dce4cf',
  },
  {
    href: '/solutions',
    name: '解决方案',
    note: '让想法走进具体的工作',
    image: '/images/studio-series/solutions-atelier.jpg',
    color: '#dadfe7',
  },
  {
    href: '/perspectives',
    name: '观点',
    note: '留一点时间，想一想',
    image: '/images/studio-series/perspectives-atelier.jpg',
    color: '#e6dbe2',
  },
];
export default function StudioDirectory() {
  const [active, setActive] = useState<number | null>(null);
  function move(event: PointerEvent<HTMLAnchorElement>) {
    if (event.pointerType === 'touch') return;
    const rect = event.currentTarget.getBoundingClientRect();
    event.currentTarget.style.setProperty(
      '--wash-x',
      `${((event.clientX - rect.left) / rect.width) * 100}%`,
    );
  }
  return (
    <div
      className="studio-directory"
      onMouseLeave={(event) => {
        if (!event.currentTarget.contains(document.activeElement))
          setActive(null);
      }}
    >
      <nav aria-label="继续探索">
        {rooms.map((room, index) => (
          <Link
            key={room.href}
            href={room.href}
            className="directory-link"
            style={{ '--room-color': room.color } as CSSProperties}
            onPointerEnter={(event) => {
              if (event.pointerType !== 'touch') setActive(index);
            }}
            onPointerMove={move}
            onFocus={() => setActive(index)}
            onBlur={() => setActive(null)}
          >
            <span className="directory-name">{room.name}</span>
            <span className="directory-note">{room.note}</span>
          </Link>
        ))}
      </nav>
      <div className="directory-art" aria-hidden="true">
        {rooms.map((room, index) => (
          <img
            key={room.href}
            src={room.image}
            alt=""
            width="1200"
            height="800"
            loading="lazy"
            className={active === index ? 'is-visible' : ''}
          />
        ))}
      </div>
    </div>
  );
}
