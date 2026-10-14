'use client';
import { useId, useState, useSyncExternalStore } from 'react';
import { ArrowDownToLine, ArrowUp, Check } from 'lucide-react';
import { works } from '../../../content/site/community';
import { CopyAction, ShareAfter } from './copy';
import {
  COUNT_RANGE,
  FLOWER_DEFAULT,
  FlowerArt,
  flowerColors,
  flowerSvg,
  flowerTitle,
  type Flower,
} from './flower-art';

// 「一朵好奇」：首屏那朵可以直接玩（重复几次、展开多少、线的颜色），不用登录，喜欢就下载 SVG。
// 作品行里的「先玩」「带走」读同一朵花：页首调过，下面的小图和下载跟着变。
// 下载就是一个带 download 的链接，地址是这朵花的 SVG 本身：没有 JS 也能把默认那朵带走。
// 一进来时那朵花一片片转到位（演示）；减少动态与没有 JS 时直接是完整的花。

const t = works.flower;

type State = Flower & { touched: boolean };

let state: State = { ...FLOWER_DEFAULT, touched: false };
const server: State = state;
const listeners = new Set<() => void>();

function update(next: Partial<Flower>) {
  state = { ...state, ...next, touched: true };
  listeners.forEach((listener) => listener());
}
function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}
function useFlower() {
  return useSyncExternalStore(
    subscribe,
    () => state,
    () => server,
  );
}

/** 下载链接：这朵花的 SVG 写进地址；点过之后说一句，花变了这句话自然收回 */
function FlowerDownload({
  flower,
  solid = false,
}: {
  flower: Flower;
  solid?: boolean;
}) {
  const svg = flowerSvg(flower);
  const [last, setLast] = useState('');
  return (
    <div className="m-com-download">
      <a
        className={solid ? 'm-btn' : 'm-link m-com-act'}
        href={`data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`}
        download={t.filename}
        onClick={() => setLast(svg)}
      >
        <ArrowDownToLine size={solid ? 15 : 14} aria-hidden="true" />
        {t.download}
      </a>
      <output className="m-com-status">
        {last === svg ? (
          <ShareAfter text={t.downloaded} topic="share-flower" />
        ) : null}
      </output>
    </div>
  );
}

/** 首屏：一张纸上的花，旁边几样控件 */
export function FlowerPlay() {
  const flower = useFlower();
  const id = useId();
  const [intro, setIntro] = useState(true);
  const set = (next: Partial<Flower>) => {
    setIntro(false);
    update(next);
  };
  return (
    <div className="m-com-play" id="flower">
      <figure className="m-com-sheet" data-intro={intro || undefined}>
        <FlowerArt
          flower={flower}
          live
          label={flowerTitle(flower)}
          className="m-com-flower"
        />
        <figcaption>
          <span className="m-caption" lang="en">
            {t.caption}
          </span>
          <span className="m-caption num" aria-hidden="true">
            {`${flower.count} × ${flower.bloom}%`}
          </span>
        </figcaption>
      </figure>
      <div className="m-com-controls">
        <p className="m-com-controls-name">
          <b>{t.name}</b>
          <span>{t.idle}</span>
        </p>
        <div className="m-com-js m-com-control-set">
          <div className="m-com-range">
            <label htmlFor={`${id}-count`}>{t.controls.count}</label>
            <output htmlFor={`${id}-count`} className="num">
              {flower.count} {t.controls.times}
            </output>
            <input
              id={`${id}-count`}
              type="range"
              className="m-com-slider"
              min={COUNT_RANGE[0]}
              max={COUNT_RANGE[1]}
              value={flower.count}
              onChange={(event) => set({ count: Number(event.target.value) })}
            />
          </div>
          <div className="m-com-range">
            <label htmlFor={`${id}-bloom`}>{t.controls.bloom}</label>
            <output htmlFor={`${id}-bloom`} className="num">
              {flower.bloom}%
            </output>
            <input
              id={`${id}-bloom`}
              type="range"
              className="m-com-slider"
              min="0"
              max="100"
              value={flower.bloom}
              onChange={(event) => set({ bloom: Number(event.target.value) })}
            />
          </div>
          <fieldset className="m-com-swatches">
            <legend>{t.controls.color}</legend>
            {flowerColors.map((color, index) => (
              <button
                key={color.name}
                type="button"
                aria-pressed={flower.color === index}
                aria-label={color.name}
                title={color.name}
                style={{ color: color.value }}
                onClick={() => set({ color: index })}
              >
                {flower.color === index ? (
                  <Check size={12} aria-hidden="true" />
                ) : null}
              </button>
            ))}
          </fieldset>
        </div>
        <p className="m-com-nojs m-com-status">{t.nojs}</p>
        <div className="m-com-save">
          <FlowerDownload flower={flower} solid />
        </div>
      </div>
    </div>
  );
}

/** 作品行「先玩」：页首那朵的小样，跟着页首变 */
export function FlowerMirror() {
  const flower = useFlower();
  const m = t.mirror;
  return (
    <div className="m-com-mirror">
      <a href="#flower" className="m-com-mirror-art" aria-label={m.back}>
        <FlowerArt flower={flower} className="m-com-flower" />
      </a>
      <div className="m-com-mirror-text">
        <p className="m-com-mirror-state m-com-js" aria-live="polite">
          {flower.touched ? m.touched : m.untouched}
        </p>
        <p>{m.hint}</p>
        <a href="#flower" className="m-link" data-dir="down">
          {m.back}
          <ArrowUp size={13} aria-hidden="true" />
        </a>
      </div>
    </div>
  );
}

/** 作品行「带走」：提示词和 SVG */
export function FlowerTake() {
  const flower = useFlower();
  return (
    <div className="m-com-take">
      <CopyAction
        id="flower-prompt"
        text={t.prompt}
        label={t.copy}
        topic="share-flower"
      />
      <FlowerDownload flower={flower} />
    </div>
  );
}
