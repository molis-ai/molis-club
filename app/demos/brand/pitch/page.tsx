import Link from 'next/link';
import { ArrowDown, ArrowRight } from 'lucide-react';
import { pitchGroups, pitches } from './routes';
import './pitch.css';

// 工作室首页视觉方向比稿：说明这次比什么、怎么看，再把十版按方向排开。
// 不做投票；看完在团队群里说选哪一版、为什么。

export const metadata = {
  title: { absolute: 'Molis AI · 工作室首页视觉方向比稿' },
  description:
    'Molis AI 工作室首页的十版视觉方案：Folio 原版，A 暖纸与画框、D 日光与生活、E 玩心造物各两稿，两版展览式首页，以及零点。',
  robots: { index: false, follow: false },
};

const steps = [
  {
    title: '在电脑上全屏看完',
    text: '每一版都是完整的首页。请从头滚到尾，动效和滚动的节奏也是方案的一部分；有空再用手机看一眼。',
  },
  {
    title: '只比方向，不比字句',
    text: '九版用的是同一份内容，文案和产品事实不在这次比较里。界面演示是示意和示例数据；顶栏点进去的内页还是 Folio 现有页面。',
  },
  {
    title: '在群里说说你的选择',
    text: '报编号就行：最想要哪一版、为什么，别的版本里有什么值得留下。方向定了，再一起打磨内容和细节。',
  },
];

const shot = (id: string, size?: number) =>
  `/images/demos/home-pitch/${id}${size ? `-${size}` : ''}.jpg`;

export default function PitchPage() {
  return (
    <div className="pt">
      <header className="pt-bar">
        <Link href="#top" className="pt-brand">
          <img src="/images/molis-logo.png" width="26" height="26" alt="" />
          <span>Molis AI</span>
          <small>首页视觉方向比稿</small>
        </Link>
        <nav aria-label="比稿页">
          <a href="#how">怎么看</a>
          <a href="#versions">十版方案</a>
        </nav>
      </header>

      <main id="main">
        <section className="pt-hero" id="top" aria-labelledby="pt-title">
          <p className="pt-kicker">比稿 · 2026 年 10 月</p>
          <h1 id="pt-title">
            工作室首页，
            <br />
            选一个视觉方向。
          </h1>
          <p className="pt-lead">
            Molis AI 官网首页的十版视觉方案都在这里：Folio 原版，A 暖纸与画框、D
            日光与生活、E
            玩心造物各两稿，两版展览式的首页，再加一版「零点」。请每一版都点开看完，再告诉大家你选哪一版。
          </p>
          <dl className="pt-facts">
            <div>
              <dt>方案</dt>
              <dd>10 版</dd>
            </div>
            <div>
              <dt>方向</dt>
              <dd>6 个</dd>
            </div>
            <div>
              <dt>内容</dt>
              <dd>同一份</dd>
            </div>
          </dl>
          <div className="pt-actions">
            <Link className="pt-button" href={pitches[0].href}>
              从 01 开始看
              <ArrowRight size={16} aria-hidden="true" />
            </Link>
            <a className="pt-link" href="#versions">
              先看十版一览
              <ArrowDown size={15} aria-hidden="true" />
            </a>
          </div>
        </section>

        <section className="pt-how" id="how" aria-labelledby="pt-how-title">
          <h2 id="pt-how-title">怎么看</h2>
          <ol>
            {steps.map((step, index) => (
              <li key={step.title}>
                <span className="pt-step-no" aria-hidden="true">
                  {index + 1}
                </span>
                <h3>{step.title}</h3>
                <p>{step.text}</p>
              </li>
            ))}
          </ol>
        </section>

        <section
          className="pt-versions"
          id="versions"
          aria-labelledby="pt-versions-title"
        >
          <header className="pt-versions-head">
            <h2 id="pt-versions-title">十版方案</h2>
            <p>
              点开就是完整的首页。每一版右下角有一条比稿条，可以回到这里，或者直接切到上一版、下一版。
            </p>
          </header>

          {pitchGroups.map((group) => {
            const items = pitches.filter((pitch) => pitch.group === group.id);
            return (
              <section
                key={group.id}
                className={`pt-group pt-group-${group.id}`}
                aria-labelledby={`pt-group-${group.id}`}
              >
                <div className="pt-group-copy">
                  <h3 id={`pt-group-${group.id}`}>{group.name}</h3>
                  <p>{group.text}</p>
                  {group.refs ? <small>{group.refs}</small> : null}
                </div>
                <ul className="pt-cards">
                  {items.map((pitch) => (
                    <li key={pitch.id}>
                      <Link className="pt-card" href={pitch.href}>
                        <span className="pt-shot">
                          <img
                            src={shot(pitch.id)}
                            srcSet={`${shot(pitch.id, 480)} 480w, ${shot(pitch.id)} 960w`}
                            sizes="(max-width: 760px) 92vw, (max-width: 1200px) 45vw, 520px"
                            width="960"
                            height="600"
                            alt={`${pitch.no} ${pitch.name}的首屏`}
                            loading="lazy"
                          />
                        </span>
                        <span className="pt-card-head">
                          <b>{pitch.no}</b>
                          <strong>{pitch.name}</strong>
                        </span>
                        <span className="pt-card-text">{pitch.summary}</span>
                        <span className="pt-traits">
                          {pitch.traits.map((trait) => (
                            <span key={trait}>{trait}</span>
                          ))}
                        </span>
                        <span className="pt-open">
                          打开这一版
                          <ArrowRight size={15} aria-hidden="true" />
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </section>
            );
          })}
        </section>
      </main>

      <footer className="pt-footer">
        <p>
          所有方案都是探索稿，不代表最终设计。界面演示是示意与示例数据；画面由代码绘制，或是氛围图、概念图。
        </p>
        <p>Molis AI · 工作室首页视觉方向比稿</p>
      </footer>
    </div>
  );
}
