'use client';
import { useRef, useState } from 'react';
import Link from 'next/link';
import { studio } from '../../../content/site/studio';
import { useVisible } from '../motion';
import { AiWordCycle } from './ai-words';
import { Film, FootageToggle, useFootagePlaying } from './footage';
import { Ware } from './ware';

// 首屏天空与二屏海边共用一卷胶片，各自进入视口时播放；两处暂停键控制同一播放状态。
export function HomeTop({
  seasideVariant = 'b',
  compareSeaside = false,
}: {
  seasideVariant?: 'a' | 'b';
  compareSeaside?: boolean;
}) {
  const { playing, toggle } = useFootagePlaying();
  const [seasideResting, setSeasideResting] = useState(false);
  const hero = useRef<HTMLElement>(null);
  const ware = useRef<HTMLElement>(null);
  const skyVisible = useVisible(hero, 0.01);
  const seasideVisible = useVisible(ware, Number.EPSILON);
  return (
    <Film
      skyPlaying={playing && skyVisible}
      seasidePlaying={playing && seasideVisible}
      seasideScene={ware}
      onSeasideRestChange={setSeasideResting}
      seasideVariant={seasideVariant}
    >
      <section
        ref={hero}
        className="m-hero m-real-hero"
        aria-labelledby="m-title"
      >
        <div className="m-real-copy">
          <h1 id="m-title" className="m-mark" lang="en">
            Molis AI
          </h1>
          <AiWordCycle />
        </div>
        <div className="m-real-foot">
          <FootageToggle playing={playing} toggle={toggle} />
          <p className="m-keys">
            {studio.keywords.map((word) => (
              <span key={word}>{word}</span>
            ))}
          </p>
        </div>
      </section>
      <Ware
        sectionRef={ware}
        footer={
          <>
            <FootageToggle
              playing={playing}
              toggle={toggle}
              resting={seasideResting && seasideVariant === 'a'}
            />
            {compareSeaside ? (
              <nav className="m-seaside-compare" aria-label="海边方案对比">
                <Link
                  href="/?seaside=a#m-ware-title"
                  prefetch={false}
                  scroll={false}
                  aria-current={seasideVariant === 'a' ? 'page' : undefined}
                >
                  A · 片尾停留
                </Link>
                <Link
                  href="/?seaside=b#m-ware-title"
                  prefetch={false}
                  scroll={false}
                  aria-current={seasideVariant === 'b' ? 'page' : undefined}
                >
                  B · 海浪衔接
                </Link>
              </nav>
            ) : null}
          </>
        }
      />
    </Film>
  );
}
