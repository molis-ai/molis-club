'use client';

import { useEffect, useRef, type ReactNode } from 'react';
import { toolDesk, toolEnd, toolHero, toolUse, toolWhy, type Wall } from '../../../content/site/tool';
import { contactHref, productHref } from '../../_site/routes';
import { Btn, mediaOf, More, Phrases, type Vars } from '../../_site/ui';
import { Mark } from './parts';
import { PlugCard, usePlug } from './plug';
import { Before, Command, Finder, Later, Mail, Notes, Screen, shownAt, stateOf, W, type BeatId, type Shown } from './screen';

// 窄屏、矮屏、没有 JS：和大屏同样几拍，上下排。每一拍一块台面，铺着那个时候的壁纸，台面上摆屏幕里亮的那一扇窗（按真实字号排），
// 亮处旁边那句话写在台面上方。首屏的字在 flow.tsx（两套共用一份）；首屏和收尾放整块屏幕，缩到台面里。
// 这里不演一拍之内的几步，直接摆做完的样子（data-still）。

const WALLS = {
  morning: mediaOf('wall-morning'),
  noon: mediaOf('wall-noon'),
  dusk: mediaOf('wall-dusk'),
};

/** 台面：铺着那个时候的壁纸，每块取景高低不同 */
function Plate({
  wall,
  y,
  label,
  eager,
  children,
}: {
  wall: Wall;
  y: string;
  label?: boolean;
  eager?: boolean;
  children: ReactNode;
}) {
  const image = WALLS[wall];
  return (
    <div className="tl-s-plate" style={{ '--y': y } as Vars}>
      <img
        src={image.src}
        srcSet={image.srcset.map(([src, w]) => `${src} ${w}w`).join(', ')}
        sizes="100vw"
        alt=""
        loading={eager ? undefined : 'lazy'}
      />
      {children}
      {label ? <p className="tl-foot">{toolDesk.foot}</p> : null}
    </div>
  );
}

/** 整块屏幕缩进台面：量台面里能放多宽，算出缩放 */
function Fit({ s, label }: { s: Shown; label: string }) {
  const box = useRef<HTMLElement>(null);
  useEffect(() => {
    const node = box.current;
    const room = node?.parentElement;
    if (!node || !room) return;
    const sync = () => {
      const style = getComputedStyle(room);
      const width = room.clientWidth - parseFloat(style.paddingLeft) - parseFloat(style.paddingRight);
      node.style.setProperty('--k', `${Math.min(0.9, width / W)}`);
    };
    const observer = new ResizeObserver(sync);
    observer.observe(room);
    sync();
    return () => observer.disconnect();
  }, []);
  return (
    <figure ref={box} className="tl-fit" aria-label={label} data-still="">
      <div className="tl-scr-box" aria-hidden="true">
        <Screen s={s} />
      </div>
    </figure>
  );
}

function Beat({ note, more, children }: { note?: string; more?: string; children: ReactNode }) {
  return (
    <figure className="tl-s-beat">
      {note ? (
        <figcaption className="tl-s-note">
          {note}
          {more ? <small>{more}</small> : null}
        </figcaption>
      ) : null}
      {children}
    </figure>
  );
}

/** 屏幕里的一扇窗单独摆出来，停在这一拍做完的样子 */
function Part({ at, plug, children }: { at: BeatId; plug?: boolean; children: ReactNode }) {
  return (
    <div className="tl-part" {...stateOf(shownAt(at, plug))} data-still="" aria-hidden="true">
      {children}
    </div>
  );
}

/** 第三屏最后一拍：插件开关是真的，拨一下，上面的动作签和命令条跟着变 */
function PlugBeat() {
  const plug = usePlug();
  return (
    <Beat note={toolWhy.notes.c3}>
      <Plate wall="dusk" y="40%">
        <Part at="c3" plug={plug.on}>
          <Command />
          <Finder />
        </Part>
        <PlugCard on={plug.on} tried={plug.tried} onFlip={plug.flip} />
      </Plate>
    </Beat>
  );
}

export function Stack() {
  return (
    <div className="tl-stack">
      <Plate wall="morning" y="40%" label eager>
        <Fit s={shownAt('hero')} label={toolHero.label} />
      </Plate>

      <section className="tl-s-sec" aria-labelledby="tl-s-use">
        <h2 className="tl-s-h" id="tl-s-use">
          <Phrases text={toolUse.title} />
        </h2>
        <Beat note={toolUse.notes.u1}>
          <Plate wall="morning" y="70%" label>
            <Part at="u1">
              <Notes />
            </Part>
          </Plate>
        </Beat>
        <Beat note={toolUse.notes.u2}>
          <Plate wall="noon" y="30%">
            <Part at="u2">
              <Finder />
            </Part>
          </Plate>
        </Beat>
        <Beat note={toolUse.notes.u3} more={toolUse.wip}>
          <Plate wall="dusk" y="60%">
            <Part at="u3">
              <Mail />
            </Part>
          </Plate>
        </Beat>
        <Beat note={toolUse.notes.u4}>
          <Plate wall="dusk" y="20%">
            <Part at="u4">
              <Later />
            </Part>
          </Plate>
        </Beat>
      </section>

      <section className="tl-s-sec" aria-labelledby="tl-s-why">
        <h2 className="tl-s-h" id="tl-s-why">
          <Phrases text={toolWhy.title} />
        </h2>
        <Beat note={toolWhy.before.text}>
          <Plate wall="dusk" y="50%" label>
            <Before />
          </Plate>
        </Beat>
        <Beat note={toolWhy.notes.c1}>
          <Plate wall="dusk" y="80%">
            <Part at="c1">
              <Notes />
            </Part>
          </Plate>
        </Beat>
        <Beat note={toolWhy.notes.c2}>
          <Plate wall="dusk" y="35%">
            <Part at="c2">
              <Notes />
            </Part>
          </Plate>
        </Beat>
        <PlugBeat />

        <p className="tl-s-coda">
          <Phrases text={toolWhy.coda} />
        </p>
        <Plate wall="dusk" y="45%">
          <Fit s={shownAt('coda')} label={toolHero.label} />
        </Plate>
      </section>

      <section className="tl-s-end" aria-labelledby="tl-s-end">
        <h2 className="tl-end-belief" id="tl-s-end">
          <Phrases text={toolEnd.belief} />
        </h2>
        <p className="tl-end-text">
          <Phrases text={toolEnd.text} />
          <More href={productHref.work}>{toolEnd.work}</More>
        </p>
        <div className="tl-end-ask">
          <p className="tl-end-from">
            <Mark dot />
            {toolEnd.ask.from}
          </p>
          <p className="tl-end-q">{toolEnd.ask.question}</p>
          <Btn href={contactHref('tool')}>{toolHero.go}</Btn>
        </div>
        <p className="tl-end-own">{toolEnd.own}</p>
      </section>
    </div>
  );
}
