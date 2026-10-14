import Link from 'next/link';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import { homeClosing } from '../../../content/site/home';
import { WORK_GITHUB } from '../../../content/site/products';
import { ALONG, ESSAYS } from '../routes';
import { mediaOf, Phrases, type Vars } from '../ui';

// 首页第五段：结尾。一句大字「技术，回到人的尺度。」；白展厅的天窗通向花园，画面从一道窄缝开到满幅（读 --p），
// 「始终好奇，持续创造。」像画家落款签在窗的右下角；下面三列纯文字去处，最后一行「也可以」。
export function Closing() {
  const image = mediaOf('home-garden');
  const close = homeClosing;
  return (
    <section className="m-close" aria-labelledby="m-close-title" data-tone="paper">
      <h2 id="m-close-title" className="m-close-lead m-wrap" data-reveal>
        <Phrases text={close.lead} />
      </h2>
      <figure
        className="m-close-window"
        data-scene
        style={{ '--avg': image.avg } as Vars}
      >
        <div className="m-close-frame">
          <img
            src={image.src}
            srcSet={image.srcset.map(([src, w]) => `${src} ${w}w`).join(', ')}
            sizes="100vw"
            width={image.width}
            height={image.height}
            alt={close.alt}
            loading="lazy"
            decoding="async"
          />
          <p className="m-close-sign">{close.signature}</p>
        </div>
        <figcaption className="m-wrap">
          <span className="m-caption" lang="en">
            {close.caption}
          </span>
        </figcaption>
      </figure>
      <div className="m-wrap">
        <ul className="m-close-paths">
          {close.paths.map((path, index) => (
            <li
              key={path.label}
              data-reveal
              style={{ '--delay': `${index * 90}ms` } as Vars}
            >
              <p className="m-kicker">{path.label}</p>
              <p className="m-close-text">
                <Phrases text={path.text} />
              </p>
              <Link className="m-link" href={path.href} data-dir="right">
                {path.link}
                <ArrowRight size={13} aria-hidden="true" />
              </Link>
            </li>
          ))}
        </ul>
        <p className="m-close-also" data-reveal>
          <span>{close.also.label}</span>
          <a className="m-link" href={WORK_GITHUB} target="_blank" rel="noreferrer">
            {close.also.github}
            <ArrowUpRight size={13} aria-hidden="true" />
          </a>
          <Link className="m-link" href={ESSAYS} data-dir="right">
            {close.also.essays}
            <ArrowRight size={13} aria-hidden="true" />
          </Link>
          <Link className="m-link" href={ALONG} data-dir="right">
            {close.also.along}
            <ArrowRight size={13} aria-hidden="true" />
          </Link>
        </p>
      </div>
    </section>
  );
}
