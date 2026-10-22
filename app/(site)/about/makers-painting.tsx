'use client';
import { useEffect, useRef, useState } from 'react';
import media from '../../_site/media.json';
import { aboutNext, painters } from '../../../content/site/about';
import { useReducedMotion, useVisible } from '../../_site/motion';
import { Phrases, type Vars } from '../../_site/ui';
import { FULL, LAYERS } from './painters-plan';

// 《黑客与画家》左边：书里写到的那幅画，下面是典故。
// 还没看到时，画是赭红的底稿色，和右边四张手稿同一种调子；第一次整幅进入视口，颜色慢慢回来（底稿 → 成画），
// 再慢慢推近到她身后杜松与天空交界的地方（1991 年在那一带发现了指纹），看一会儿拉回整幅；
// 推近时图注下面浮出指纹那句，之后一直留着。点画可以自己推近、拉回。
// 没有 JS、减少动态：直接是原色整幅，不自己推近，指纹那句直接在。

type Mode = 'waiting' | 'color' | 'near' | 'resting';

/** 进入视口后等多久上色、上色后多久推近、推近后看多久（毫秒） */
const WAIT = 500;
const BLOOM = 3400;
const LOOK = 6200;

export function MakersPainting() {
  const reduced = useReducedMotion();
  const box = useRef<HTMLButtonElement>(null);
  const visible = useVisible(box, 0.6);
  const [mode, setMode] = useState<Mode>('waiting');
  const [near, setNear] = useState(false);

  // 第一次看到整幅：上色，推近，看一会儿，拉回
  useEffect(() => {
    if (mode !== 'waiting' || !visible || reduced) return;
    const timer = window.setTimeout(() => setMode('color'), WAIT);
    return () => window.clearTimeout(timer);
  }, [mode, visible, reduced]);

  useEffect(() => {
    if (mode !== 'color') return;
    const timer = window.setTimeout(() => {
      setNear(true);
      setMode('near');
    }, BLOOM);
    return () => window.clearTimeout(timer);
  }, [mode]);

  useEffect(() => {
    if (mode !== 'near') return;
    const timer = window.setTimeout(() => {
      setNear(false);
      setMode('resting');
    }, LOOK);
    return () => window.clearTimeout(timer);
  }, [mode]);

  const toggle = () => {
    setNear(!near);
    setMode('resting');
  };

  return (
    <figure
      className="mk-art"
      data-mode={mode}
      data-near={near || undefined}
      data-found={mode === 'near' || mode === 'resting' || undefined}
    >
      <button
        ref={box}
        type="button"
        className="mk-paint"
        aria-pressed={near}
        aria-label={aboutNext.makers.near}
        onClick={toggle}
      >
        <span className="mk-canvas">
          {LAYERS.map((layer, index) => {
            const image = media[layer.name];
            return (
              <img
                key={layer.name}
                className={index ? 'mk-layer' : 'mk-layer mk-whole'}
                src={image.src}
                width={image.width}
                height={image.height}
                alt={index ? '' : painters.painting.alt}
                aria-hidden={index ? true : undefined}
                loading="lazy"
                decoding="async"
                style={
                  {
                    '--avg': image.avg,
                    left: `${(layer.x / FULL.w) * 100}%`,
                    top: `${(layer.y / FULL.h) * 100}%`,
                    width: `${(layer.w / FULL.w) * 100}%`,
                    height: `${(layer.h / FULL.h) * 100}%`,
                  } as Vars
                }
              />
            );
          })}
        </span>
      </button>
      <figcaption className="mk-art-text">
        <span className="mk-art-name">
          {/* 「达·芬奇《吉内薇拉·德·班琪》，」「约 1474–1478」各自不断开，美术馆另起一行 */}
          {painters.painting.name.split('，').map((part, index, all) => (
            <span key={part} className="mk-art-bit">
              {part}
              {index < all.length - 1 ? '，' : ''}
            </span>
          ))}
          <span className="mk-art-where">{painters.painting.where}</span>
        </span>
        <span className="mk-story">
          <Phrases text={aboutNext.makers.allusion} />
        </span>
        <span className="mk-found">
          <Phrases text={painters.painting.found} />
        </span>
      </figcaption>
    </figure>
  );
}
