'use client';
import { useId, useState, type ReactNode } from 'react';
import { artistSkills } from '../../../content/artists';
import { communityUi, works } from '../../../content/site/community';
import { artistImage } from '../../_site/ui';
import { ArtistStage, DropStage, NiulStage, WebStage } from './works';

// 工作台（沿用首页产品列表的做法）：左边四件作品，鼠标停在哪件右边换哪件；触屏第一次点是选中；键盘聚焦即选中。
// 右边一张摊开的纸：先玩 / 看怎么做 / 带走。没有 JS 时四张纸依次排开，都能读、能下载。

const monet = artistSkills.find((skill) => skill.image);

function Thumb({ id }: { id: string }) {
  if (id === 'artist' && monet)
    return (
      <img
        {...artistImage(monet.slug, monet, '64px')}
        alt=""
        loading="lazy"
        decoding="async"
      />
    );
  if (id === 'web')
    return (
      <svg viewBox="0 0 48 48" aria-hidden="true">
        <rect x="9" y="12" width="22" height="5" rx="2.5" />
        <rect x="9" y="21.5" width="30" height="5" rx="2.5" />
        <rect x="9" y="31" width="16" height="5" rx="2.5" />
      </svg>
    );
  if (id === 'niul')
    return (
      <svg viewBox="0 0 48 48" aria-hidden="true">
        <path d="M17 15c-2.6-1.9-3.7-5.2-2.6-8.6M31 15c2.6-1.9 3.7-5.2 2.6-8.6" />
        <rect x="13" y="13" width="22" height="23" rx="11" />
        <ellipse cx="24" cy="32" rx="8.5" ry="5.5" />
        <path d="M19.5 23h.01M28.5 23h.01" strokeWidth="3" />
      </svg>
    );
  return (
    <svg viewBox="0 0 48 48" aria-hidden="true">
      <path d="M8 25h9l2.6 4.4h8.8L31 25h9M8 25l4.6-11h22.8L40 25v10H8z" />
    </svg>
  );
}

const items: {
  id: string;
  name: string;
  alias?: string;
  form: string;
  stage: string;
  lead: string;
  body: ReactNode;
}[] = [
  { id: 'artist', ...works.artist, body: <ArtistStage /> },
  { id: 'web', ...works.web, body: <WebStage /> },
  { id: 'niul', ...works.niul, body: <NiulStage /> },
  { id: 'drop', ...works.drop, body: <DropStage /> },
];

export function Bench() {
  const [on, setOn] = useState(0);
  const base = useId();
  const ui = communityUi.bench;
  return (
    <div className="m-com-bench-grid">
      <div className="m-com-bench-list" role="tablist" aria-label={ui.pick}>
        {items.map((item, index) => (
          <button
            key={item.id}
            type="button"
            role="tab"
            id={`${base}-tab-${item.id}`}
            aria-selected={index === on}
            aria-controls={`${base}-panel-${item.id}`}
            className="m-com-bench-item"
            data-work={item.id}
            onMouseEnter={() => setOn(index)}
            onFocus={() => setOn(index)}
            onClick={() => setOn(index)}
          >
            <span className="m-com-bench-thumb">
              <Thumb id={item.id} />
            </span>
            <span className="m-com-bench-text">
              <span className="m-com-bench-name">
                <span lang="en">{item.name}</span>
                {item.alias ? <small>{item.alias}</small> : null}
              </span>
              <span className="m-com-bench-tag">
                {item.form}
                <i>{item.stage}</i>
              </span>
              <span className="m-com-bench-lead">{item.lead}</span>
            </span>
          </button>
        ))}
      </div>
      <div className="m-com-bench-stage">
        {items.map((item, index) => (
          <section
            key={item.id}
            className="m-com-stage"
            role="tabpanel"
            id={`${base}-panel-${item.id}`}
            aria-labelledby={`${base}-tab-${item.id}`}
            data-work={item.id}
            hidden={index !== on}
          >
            <header className="m-com-stage-head">
              <h3>
                <span lang="en">{item.name}</span>
                {item.alias ? <small>{item.alias}</small> : null}
              </h3>
              <span className="m-com-stamp">{item.stage}</span>
            </header>
            {item.body}
          </section>
        ))}
      </div>
    </div>
  );
}
