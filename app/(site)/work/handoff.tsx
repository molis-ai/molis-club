'use client';
import {
  BookOpen,
  Bot,
  Hand,
  MessagesSquare,
  RotateCcw,
  SquareCode,
  Table2,
  User,
  Users,
  type LucideIcon,
} from 'lucide-react';
import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
} from 'react';
import { handoff, type HandoffTarget } from '../../../content/site/work';
import { useReducedMotion } from '../../_site/motion';

// Work 页的标志性交互「把这件工作交给谁」（交互示意）：
// 访客把一张工作卡交给助理 / Codex / 群里的同事 / 自己——点一下，或者把卡拖过去。
// 资料、进展、成果、讨论原样跟过去，接手方从断点继续；需要判断时，卡回到你手里。
// 卡片换位置用 FLIP 动一下；减少动态时直接换位置。

type TargetId = HandoffTarget['id'];

const icons: Record<TargetId, LucideIcon> = {
  assistant: Bot,
  codex: SquareCode,
  colleague: Users,
  me: User,
};
const attachmentIcons: Record<string, LucideIcon> = {
  files: BookOpen,
  progress: Hand,
  results: Table2,
  talk: MessagesSquare,
};

function Card({ holder }: { holder: TargetId | 'start' }) {
  const { card, labels } = handoff;
  return (
    <div className="hf-card" data-holder={holder}>
      <p className="hf-card-name">
        <b>{card.name}</b>
        <span>{card.part}</span>
      </p>
      <p className="hf-card-label">{labels.carry}</p>
      <ul>
        {card.attachments.map((item, index) => {
          const Icon = attachmentIcons[item.key];
          return (
            <li key={item.key} style={{ '--i': index } as React.CSSProperties}>
              <Icon aria-hidden="true" />
              <span>{item.label}</span>
              <small>{item.value}</small>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export function Handoff() {
  const reduced = useReducedMotion();
  const [holder, setHolder] = useState<TargetId | 'start'>('start');
  const [back, setBack] = useState<TargetId | null>(null);
  const card = useRef<HTMLDivElement>(null);
  const before = useRef<DOMRect | null>(null);
  const drag = useRef<{ x: number; y: number; id: number } | null>(null);
  const [dragging, setDragging] = useState(false);

  const target = handoff.targets.find((item) => item.id === holder);
  const asked = handoff.targets.find((item) => item.id === back);

  // 交出去以后，等一会儿：需要判断的事，卡片回到你手里
  useEffect(() => {
    if (!target || target.id === 'me') return;
    const timer = window.setTimeout(
      () => {
        before.current = card.current?.getBoundingClientRect() ?? null;
        setBack(target.id);
        setHolder('start');
      },
      reduced ? 2600 : 3200,
    );
    return () => window.clearTimeout(timer);
  }, [target, reduced]);

  // FLIP：记下换位置之前在哪，换完从那里滑过来
  useLayoutEffect(() => {
    const node = card.current;
    const from = before.current;
    before.current = null;
    if (!node || !from || reduced) return;
    const to = node.getBoundingClientRect();
    const dx = from.left - to.left;
    const dy = from.top - to.top;
    if (Math.abs(dx) + Math.abs(dy) < 2) return;
    node.animate(
      [
        { transform: `translate(${dx}px, ${dy}px)` },
        { transform: 'translate(0, 0)' },
      ],
      { duration: 700, easing: 'cubic-bezier(0.2, 0.7, 0.1, 1)' },
    );
  }, [holder, reduced]);

  const give = (id: TargetId) => {
    before.current = card.current?.getBoundingClientRect() ?? null;
    setBack(null);
    setHolder(id);
  };

  // 拖过去：卡片跟着指针，松手时落在哪个接手人上就交给谁
  const onPointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (event.button !== 0) return;
    drag.current = { x: event.clientX, y: event.clientY, id: event.pointerId };
    event.currentTarget.setPointerCapture(event.pointerId);
  };
  const onPointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    const start = drag.current;
    if (!start || start.id !== event.pointerId) return;
    const dx = event.clientX - start.x;
    const dy = event.clientY - start.y;
    if (!dragging && Math.hypot(dx, dy) < 6) return;
    setDragging(true);
    event.currentTarget.style.transform = `translate(${dx}px, ${dy}px) rotate(${Math.max(-4, Math.min(4, dx / 40))}deg)`;
  };
  const onPointerUp = (event: ReactPointerEvent<HTMLDivElement>) => {
    const start = drag.current;
    drag.current = null;
    if (!start || !dragging) return;
    setDragging(false);
    const node = event.currentTarget;
    const lane = document
      .elementsFromPoint(event.clientX, event.clientY)
      .map((el) => el.closest<HTMLElement>('[data-lane]'))
      .find(Boolean);
    before.current = node.getBoundingClientRect();
    node.style.transform = '';
    const id = lane?.dataset.lane as TargetId | undefined;
    if (id && id !== holder) give(id);
    else {
      // 没落在接手人上：弹回原处
      const from = before.current;
      before.current = null;
      const to = node.getBoundingClientRect();
      if (!reduced && from)
        node.animate(
          [
            { transform: `translate(${from.left - to.left}px, ${from.top - to.top}px)` },
            { transform: 'none' },
          ],
          { duration: 500, easing: 'cubic-bezier(0.2, 0.7, 0.1, 1)' },
        );
    }
  };

  const cardNode = (
    <div
      ref={card}
      className="hf-card-wrap"
      data-dragging={dragging || undefined}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={() => {
        drag.current = null;
        setDragging(false);
        if (card.current) card.current.style.transform = '';
      }}
    >
      <Card holder={holder} />
    </div>
  );

  const { labels } = handoff;
  return (
    <div className="hf">
      <div className="hf-home" data-empty={holder !== 'start' || undefined}>
        <p className="hf-zone">
          <span className="m-dot" />
          {labels.from}
        </p>
        {holder === 'start' ? cardNode : <div className="hf-slot" aria-hidden="true" />}
        <output className="hf-back" aria-live="polite">
          {asked && holder === 'start' ? (
            <>
              <span className="m-chip" data-tone="accent">
                {labels.back}
              </span>
              <span>
                <b>{asked.name}：</b>
                {asked.ask}
              </span>
            </>
          ) : null}
        </output>
      </div>
      <fieldset className="hf-lanes">
        <legend className="sr-only">{handoff.title}</legend>
        {handoff.targets.map((item) => {
          const Icon = icons[item.id];
          const here = holder === item.id;
          return (
            <div key={item.id} className="hf-lane" data-lane={item.id} data-here={here || undefined}>
              <button
                type="button"
                className="hf-pick"
                aria-pressed={here}
                onClick={() => give(item.id)}
              >
                <Icon aria-hidden="true" />
                <span>
                  <b>{item.name}</b>
                  <small>{item.who}</small>
                </span>
                <span className="hf-pick-go">{labels.choose}</span>
              </button>
              {here ? (
                <div className="hf-lane-body">
                  {cardNode}
                  <p className="hf-resume" aria-live="polite">
                    <span>{labels.resume}</span>
                    {item.resume}
                  </p>
                </div>
              ) : null}
            </div>
          );
        })}
      </fieldset>
      {holder !== 'start' || back ? (
        <button
          type="button"
          className="m-link hf-reset"
          onClick={() => {
            before.current = card.current?.getBoundingClientRect() ?? null;
            setBack(null);
            setHolder('start');
          }}
        >
          <RotateCcw size={13} aria-hidden="true" />
          {labels.reset}
        </button>
      ) : null}
    </div>
  );
}
