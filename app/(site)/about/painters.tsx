import css from '../../_site/site.css?raw';
import media from '../../_site/media.json';
import { painters } from '../../../content/site/about';
import { studio } from '../../../content/site/studio';
import { Phrases, type Vars } from '../../_site/ui';
import { PaintersFit } from './painters-fit';
import { FULL, LAYERS } from './painters-plan';
import './painters.css';

// 《黑客与画家》（负责人 2026-10-18 定）：左边画家，右边黑客，同一次滚动一起推近。
// 标题下是底稿 1.3 那句原话，当从序到这一章的过渡（负责人 2026-10-19：「不然好突兀」）。
// 宽屏时标题、那句话和一对框一起钉住；手机上标题和那句话先正常滚过去，只钉一对框，不然一屏放不下。
// 左边是达·芬奇的《吉内薇拉·德·班琪》，从整幅推进她身后的杜松，停在杜松与天空交界的地方；
// 右边是本站真实的样式表（构建时原样读进来），从整张推到全站那条缓动曲线和它的注释。
// 滚动进度来自全站的 [data-scene]（--pin，motion.ts 写入并做跟随缓动）；推近的算式在 painters.css，
// 这里只放画面，painters-fit 量好框的尺寸写进 CSS 变量。
// 减少动态：不钉住，直接是推近后的样子，两行图注都在。没有 JS：整幅画与那几行代码，两行图注都在。

const lines = css.replace(/\n$/, '').split('\n');
/** 缓动曲线那一行（从 0 数），上一行是它的注释 */
const ease = lines.findIndex((line) => /^\s*--ease:/.test(line));
const NEAR = 8;
/** 注释那一行与缓动曲线那一行，按编辑器里的行号（从 1 数） */
const from = ease;
const to = ease + 1;
/** 整张样式表切成几块（每块是连续的几行，原样保留空行）：那两行各一块，前后各 NEAR 行一块（没有 JS 时只露这些） */
const sheet = [
  { text: lines.slice(0, from - 1 - NEAR), near: false, target: false },
  { text: lines.slice(from - 1 - NEAR, from - 1), near: true, target: false },
  { text: [lines[from - 1]], near: true, target: true },
  { text: [lines[from]], near: true, target: true },
  { text: lines.slice(from + 1, from + 1 + NEAR), near: true, target: false },
  { text: lines.slice(from + 1 + NEAR), near: false, target: false },
].map((block) => {
  // 块末尾是空行时，多补一个换行，不然这一行会被吃掉
  const text = block.text.join('\n');
  return { ...block, text: text.endsWith('\n') ? `${text}\n` : text };
});

export function Painters() {
  return (
    <PaintersFit>
      <div className="hp-stage">
        <div className="hp-head">
          <h2 className="ao-ch-title hp-title" id="makers-title">
            {painters.title}
          </h2>
          <p className="hp-lead">
            <Phrases text={studio.standard.makers} />
          </p>
        </div>
        <div className="hp-body">
          <div className="hp-pair">
            <figure className="hp-fig">
              <p className="hp-medium">{painters.painter}</p>
              <div className="hp-frame hp-frame-paint">
                <div className="hp-paint">
                  {LAYERS.map((layer, index) => {
                    const image = media[layer.name];
                    return (
                      <img
                        key={layer.name}
                        className={index ? 'hp-layer' : 'hp-layer hp-whole'}
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
                </div>
              </div>
              <figcaption className="hp-cap">
                <span className="hp-cap-start">
                  <span className="m-phrase">{painters.painting.name} ·</span>{' '}
                  <span className="m-phrase">{painters.painting.where}</span>
                </span>
                <span className="hp-cap-end">
                  <Phrases text={painters.painting.found} />
                </span>
              </figcaption>
            </figure>

            <figure className="hp-fig">
              <p className="hp-medium">{painters.hacker}</p>
              <div className="hp-frame hp-frame-code">
                <div
                  className="hp-sheet"
                  aria-hidden="true"
                  style={{ '--rows': Math.ceil(lines.length / 5) } as Vars}
                >
                  {sheet.map((block, index) => (
                    <div
                      key={index}
                      className="hp-ln"
                      data-target={block.target || undefined}
                      data-near={block.near || undefined}
                    >
                      {block.text}
                    </div>
                  ))}
                </div>
                <p className="sr-only">
                  {lines[from - 1].trim()} {lines[from].trim()}
                </p>
              </div>
              <figcaption className="hp-cap">
                <span className="hp-cap-start">
                  {painters.code.sheet(lines.length)}
                </span>
                <span className="hp-cap-end">
                  <span className="m-phrase">
                    {painters.code.lines(from, to)} · {painters.code.date} ·
                  </span>{' '}
                  <span className="m-phrase">{painters.code.commit}</span>
                </span>
              </figcaption>
            </figure>
          </div>
          <p className="hp-line">
            <Phrases text={painters.line} />
          </p>
        </div>
      </div>
    </PaintersFit>
  );
}
