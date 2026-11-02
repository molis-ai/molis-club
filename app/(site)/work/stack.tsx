'use client';

import { useEffect, useRef, type ReactNode } from 'react';
import { workCases, workEnd, workHand, workHero, workStage, workWhy, type WorkBeatId } from '../../../content/site/work';
import { contactHref } from '../../_site/routes';
import { Btn, mediaOf, Phrases, Status, type Vars } from '../../_site/ui';
import {
  Chat,
  Coding,
  Doc,
  Goal,
  Inbox,
  Kinds,
  LATER,
  NewTool,
  Plugins,
  Rail,
  Ring,
  Shelf,
  START,
  Term,
  W,
  Wait,
  Window,
  type Shown,
} from './desk';
import { Pickup, usePickup, useSel } from './pickup';

// 窄屏、矮屏、没有 JS：和大屏同样几拍，上下排。每一拍一块照片台面，台面上摆窗里亮的那一块（按真实字号排）和你自己的终端，
// 亮处旁边那句话写在台面上方。首屏的字在 flow.tsx（两套共用一份）；首屏和收尾放整扇窗，缩到台面里。

const STAGE = mediaOf('work-stage');
const SRCSET = STAGE.srcset.map(([src, w]) => `${src} ${w}w`).join(', ');

const TALK: Shown = { view: 'inbox', step: 2, side: 'talk' };
const HELP: Shown = { view: 'doc', step: 5, side: 'log', facts: 'typing', over: 'help' };
const LIFT: Shown = { view: 'doc', step: 5, side: 'shelf', facts: 'in', shot: 'lift' };

/** 照片台面：同一张湖面晨雾，每块取景高低不同 */
function Plate({ y, label, eager, children }: { y: string; label?: boolean; eager?: boolean; children: ReactNode }) {
  return (
    <div className="wk-s-plate" style={{ '--y': y } as Vars}>
      <img src={STAGE.src} srcSet={SRCSET} sizes="100vw" alt="" loading={eager ? undefined : 'lazy'} />
      {children}
      {label ? <p className="wk-foot">界面示意 · 示例数据</p> : null}
    </div>
  );
}

/** 整扇窗缩进台面：量台面里能放多宽，算出缩放 */
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
    <figure ref={box} className="wk-fit" aria-label={label}>
      <div className="wk-win" aria-hidden="true">
        <Window s={s} />
      </div>
    </figure>
  );
}

const NOTES: Partial<Record<WorkBeatId, string>> = { ...workCases.notes, ...workHand.notes, ...workWhy.notes };

/** 一拍：台面上方那句话（还没做好的带个小牌子），下面是台面 */
function Beat({ id, children }: { id?: WorkBeatId; children: ReactNode }) {
  const note = id ? NOTES[id] : undefined;
  const stage = id ? workStage[id] : undefined;
  return (
    <figure className="wk-s-beat">
      {note ? (
        <figcaption className="wk-s-note">
          {note}
          {stage ? (
            <span className="wk-note-tag">
              <Status concept={stage === '规划中'}>{stage}</Status>
            </span>
          ) : null}
        </figcaption>
      ) : null}
      {children}
    </figure>
  );
}

/** 窗里的一块单独摆出来；hot 是这一拍亮的那一处 */
function Part({ hot, children }: { hot?: string; children: ReactNode }) {
  return (
    <div className="wk-part" data-hot={hot}>
      {children}
    </div>
  );
}

/** 选的不一样，给的就不一样：发布说明里来回选两处，右边助理给的跟着换 */
function PickBeat() {
  const sel = useSel(true);
  return (
    <Beat id="pick">
      <Plate y="64%">
        <Part hot="pick">
          <Doc s={{ ...LATER, view: 'doc', shot: undefined, sel }} />
        </Part>
      </Plate>
    </Beat>
  );
}

/** 换一家 AI 接着做：点上面的 AI，工作面上它读到的几行跟着亮一下 */
function PickupBeat() {
  const pickup = usePickup();
  return (
    <Beat id="c1">
      <Plate y="70%">
        <Part>
          <Goal s={{ ...LATER, read: pickup.read }} />
        </Part>
        <Pickup ai={pickup.ai} tried={pickup.reads > 0} onPick={pickup.pick} />
      </Plate>
    </Beat>
  );
}

export function Stack() {
  const [say, done] = workWhy.coda;
  return (
    <div className="wk-stack" data-tone="paper">
      <Plate y="34%" label eager>
        <Fit s={START} label={workHero.label} />
      </Plate>

      <section className="wk-s-sec" aria-labelledby="wk-s-use">
        <h2 className="wk-s-h" id="wk-s-use">
          <Phrases text={workCases.title} />
        </h2>
        <Beat id="u1">
          <Plate y="58%" label>
            <Part>
              <Goal s={START} />
            </Part>
            <Term id="u1" />
          </Plate>
        </Beat>
        <Beat id="feed">
          <Plate y="22%">
            <Part hot="inbox">
              <Inbox />
            </Part>
          </Plate>
        </Beat>
        <Beat id="talk">
          <Plate y="44%">
            <Part hot="talk">
              <Rail s={TALK} />
            </Part>
          </Plate>
        </Beat>
        <Beat id="code">
          <Plate y="82%">
            <Part>
              <Coding />
            </Part>
          </Plate>
        </Beat>
        <Beat id="wait">
          <Plate y="30%">
            <Wait />
          </Plate>
        </Beat>
      </section>

      <section className="wk-s-sec" aria-labelledby="wk-s-hand">
        <h2 className="wk-s-h" id="wk-s-hand">
          <Phrases text={workHand.title} />
        </h2>
        <Beat id="help">
          <Plate y="52%" label>
            <Part hot="help">
              <Doc s={HELP} />
            </Part>
          </Plate>
        </Beat>
        <PickBeat />
        <Beat>
          <Plate y="40%">
            <Kinds />
          </Plate>
        </Beat>
        <Beat id="shelf">
          <Plate y="70%">
            <Part hot="shelf">
              <Shelf s={LIFT} />
            </Part>
          </Plate>
        </Beat>
        <Beat id="mcp">
          <Plate y="26%">
            <NewTool />
          </Plate>
        </Beat>
        <Beat id="grow">
          <Plate y="58%">
            <Plugins />
          </Plate>
        </Beat>
      </section>

      <section className="wk-s-sec" aria-labelledby="wk-s-why">
        <h2 className="wk-s-h" id="wk-s-why">
          <Phrases text={workWhy.title} />
        </h2>
        <Beat>
          <Plate y="46%" label>
            <Chat />
          </Plate>
        </Beat>
        <PickupBeat />
        <Beat id="c2">
          <Plate y="30%">
            <Part hot="fix">
              <Rail s={LATER} />
            </Part>
          </Plate>
        </Beat>
        <Beat id="c3">
          <Plate y="52%">
            <Part hot="head">
              <Goal s={LATER} />
            </Part>
          </Plate>
        </Beat>

        <p className="wk-s-coda">
          <span>
            <Phrases text={say} />
          </span>
          <span>
            <Phrases text={done} />
          </span>
        </p>
        <Plate y="40%">
          <Fit s={LATER} label={workHero.label} />
        </Plate>
      </section>

      <section className="wk-s-end" aria-labelledby="wk-s-end">
        <p className="wk-end-origin">
          <Phrases text={workEnd.origin} />
        </p>
        <h2 className="wk-end-belief" id="wk-s-end">
          <Phrases text={workEnd.belief} />
        </h2>
        <p className="wk-end-text">
          <Phrases text={workEnd.beliefText} />
        </p>
        <div className="wk-end-ask">
          <p className="wk-end-from">
            <Ring tone="attention" />
            {workEnd.ask.from}
          </p>
          <p className="wk-end-q">{workEnd.ask.question}</p>
          <Btn href={contactHref('work')}>{workHero.go}</Btn>
        </div>
        <p className="wk-end-own">{workWhy.own}</p>
      </section>
    </div>
  );
}
