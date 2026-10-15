'use client';
import {
  Fragment,
  useId,
  useState,
  type CSSProperties,
  type ReactNode,
} from 'react';
import {
  ArrowRight,
  ArrowUpRight,
  CalendarDays,
  Check,
  Code2,
  FileText,
  FolderOpen,
  ListTodo,
  MessagesSquare,
  MousePointer2,
  NotebookPen,
  Plus,
  Rss,
  Target,
  type LucideIcon,
} from 'lucide-react';
import { demo } from '../../../content/molis-tool';
import {
  lifeScene,
  storyScene,
  toolScene,
  workScene,
  worldScene,
  type Chapter,
  type IntroProduct,
} from './stages-data';

// 首页产品列表的主画面（从第八轮「美术馆的午后」迁来，画面与节奏原样保留）：每件产品按第 4 章的小标题分成三四段，一轮不超过 10 秒。
// 每段只有一个大画面：顶上一行大字是这段的小标题（原句），关键的那个动作在 1.5 秒内出现，再停一会儿让人看清。
// 底下几条细线是进度，走完一段换下一段，点哪条看哪段。
// 元素按 --at（第几秒出现）、--until（第几秒退场）登场，都是一轮 CSS 动画，只在这件产品被选中、
// 这一段正在播的时候跑；暂停、离开视口时停住；减少动态时直接停在这一段的结果上。

const pad = (n: number) => String(n).padStart(2, '0');

/** 这个元素第 start 秒登场，第 until 秒退场 */
const at = (start: number, until?: number) =>
  ({
    '--at': `${start}s`,
    ...(until === undefined ? null : { '--until': `${until}s` }),
  }) as CSSProperties;

function Reel({
  name,
  chapters,
  scenes,
  controls,
}: {
  name: string;
  chapters: Chapter[];
  scenes: ReactNode[];
  controls: ReactNode;
}) {
  const [now, setNow] = useState(0);
  const total = chapters.length;
  return (
    <div className="ix-reel">
      <div className="ix-cap" aria-hidden="true">
        <span className="ix-cap-no" lang="en">
          {pad(now + 1)}
          <i>/</i>
          {pad(total)}
        </span>
        <span className="ix-stack ix-cap-text">
          {chapters.map((chapter, index) => (
            <span key={chapter.title} data-now={index === now || undefined}>
              {chapter.title}
            </span>
          ))}
        </span>
      </div>
      <div className="ix-view" aria-hidden="true">
        {scenes.map((scene, index) => (
          <div
            key={index}
            className="ix-scene"
            data-now={index === now || undefined}
          >
            {scene}
          </div>
        ))}
      </div>
      <div className="ix-bottom">
        <fieldset className="ix-segs">
          <legend className="sr-only">{`${name} 的 ${total} 段演示`}</legend>
          {chapters.map((chapter, index) => (
            <button
              key={chapter.title}
              type="button"
              className="ix-seg"
              aria-pressed={index === now}
              aria-label={`${pad(index + 1)} ${chapter.title}`}
              data-done={index < now || undefined}
              onClick={() => setNow(index)}
            >
              <i>
                <b
                  style={
                    { '--dur': `${chapter.time ?? 3.3}s` } as CSSProperties
                  }
                  onAnimationEnd={(event) => {
                    if (event.target === event.currentTarget)
                      setNow((index + 1) % total);
                  }}
                />
              </i>
            </button>
          ))}
        </fieldset>
        {controls}
      </div>
    </div>
  );
}

/** 一个勾：先是空圈，第 start 秒勾上 */
function Tick({ start }: { start?: number }) {
  return (
    <i className="ix-check">
      {start === undefined ? null : (
        <Check
          className="ix-tick"
          size={10}
          strokeWidth={2.6}
          style={at(start)}
        />
      )}
    </i>
  );
}

/* ---------- Work：工具按项目摆、你和助理写同一份、Goal 核对到完成 ---------- */

const toolIcon: Record<string, LucideIcon> = {
  资料: FolderOpen,
  信息流: Rss,
  文档: FileText,
  目标: Target,
  会话: MessagesSquare,
  代码: Code2,
  日历: CalendarDays,
  笔记: NotebookPen,
  待办: ListTodo,
};

function Tile({
  name,
  start,
  small,
}: {
  name: string;
  start?: number;
  small?: boolean;
}) {
  const Icon = toolIcon[name] ?? Plus;
  return (
    <span
      className={`ix-tile${small ? ' ix-tile-s' : ''}${start === undefined ? '' : ' ix-pop'}`}
      style={start === undefined ? undefined : at(start)}
    >
      <Icon size={small ? 14 : 19} strokeWidth={1.6} aria-hidden="true" />
      <b>{name}</b>
    </span>
  );
}

function WorkBoards() {
  const { boards, personal, personalNote, yours, yoursTag } = workScene;
  const [a, b] = boards;
  return (
    <div className="ix-card ix-board">
      <p className="ix-board-h">
        <span className="ix-board-label">项目</span>
        <span className="ix-stack">
          <span className="ix-gone" style={at(0, 1.5)}>
            {a.project}
          </span>
          <span className="ix-in" style={at(1.55)}>
            {b.project}
          </span>
        </span>
      </p>
      <div className="ix-stack">
        <span className="ix-tiles ix-gone" style={at(0, 1.5)}>
          {a.tools.map((name, index) => (
            <Tile key={name} name={name} start={0.1 + index * 0.12} />
          ))}
        </span>
        <span className="ix-tiles ix-in" style={at(1.55)}>
          {b.tools.map((name, index) => (
            <Tile key={name} name={name} start={1.6 + index * 0.12} />
          ))}
          <span className="ix-tile ix-tile-yours ix-pop" style={at(2.2)}>
            <Plus size={19} strokeWidth={1.6} aria-hidden="true" />
            <b>
              {yours}
              <small>{yoursTag}</small>
            </b>
          </span>
        </span>
      </div>
      <p className="ix-board-sub">{personalNote}</p>
      <span className="ix-tiles">
        {personal.map((name) => (
          <Tile key={name} name={name} small />
        ))}
      </span>
    </div>
  );
}

function WorkWrite() {
  const { desk, you, assistant, agents, agentsNote, changed } = workScene;
  const last = desk.inserted.length - 1;
  return (
    <div className="ix-card ix-doc">
      <p className="ix-kicker">文档</p>
      <p className="ix-doc-h">{desk.heading}</p>
      <p className="ix-doc-line">
        <span className="ix-typew" style={at(0.05)}>
          {desk.typed}
        </span>
        <span className="ix-flag ix-flag-you ix-gone" style={at(0, 1)}>
          <span>{you}</span>
        </span>
      </p>
      <ul className="ix-doc-ai">
        {desk.inserted.map((item, index) => (
          <li key={item} className="ix-in" style={at(1 + index * 0.16)}>
            {item}
            {index === last ? (
              <span className="ix-flag ix-flag-ai">
                <span>{assistant}</span>
              </span>
            ) : null}
            <small>{desk.source}</small>
          </li>
        ))}
      </ul>
      <p className="ix-doc-meta">
        <span className="ix-in" style={at(1.6)}>
          <i />
          {changed}
          <u>{desk.card.undo}</u>
        </span>
        <span className="ix-agents ix-in" style={at(2)}>
          {agents.map((agent) => (
            <b key={agent} lang="en">
              {agent}
            </b>
          ))}
          {agentsNote}
        </span>
      </p>
    </div>
  );
}

function WorkGoal() {
  const { relay, relayLabels } = workScene;
  const hands = relay.log.slice(0, 3);
  return (
    <div className="ix-card ix-goal">
      <p className="ix-kicker">目标</p>
      <p className="ix-doc-h">{relay.goal}</p>
      <p className="ix-relay">
        {hands.map((entry, index) => (
          <Fragment key={entry.day}>
            {index > 0 ? (
              <ArrowRight
                className="ix-in"
                size={12}
                style={at(0.1 + index * 0.18)}
              />
            ) : null}
            <span
              className="ix-in"
              data-tone={entry.tone}
              style={at(0.1 + index * 0.18)}
            >
              <i />
              <b lang="en">{entry.who}</b>
              <small>{entry.day}</small>
            </span>
          </Fragment>
        ))}
      </p>
      <p className="ix-label">{relayLabels.want}</p>
      <ul className="ix-want">
        {relay.require.map((item, index) => (
          <li key={item}>
            <Tick start={0.8 + index * 0.2} />
            {item}
          </li>
        ))}
      </ul>
      <p className="ix-decide ix-in" style={at(1.4)}>
        <small>{relayLabels.decide}</small>
        <span>
          <em lang="en">{relay.proposal.who}</em> · {relay.proposal.text}
        </span>
      </p>
      <span className="ix-stamp ix-pop" style={at(1.85)}>
        <Check size={13} strokeWidth={2.2} aria-hidden="true" />
        {relay.stamp}
      </span>
    </div>
  );
}

/* ---------- Tool：光标旁一步做完 → 结果接着做 → 收起再回来 ---------- */

function ToolNear() {
  return (
    <div className="ix-near">
      <div className="ix-card ix-page">
        <p className="ix-page-url" lang="en">
          {demo.url}
        </p>
        <p className="ix-page-h" lang="en">
          {demo.heading}
        </p>
        <p className="ix-page-p" lang="en">
          {demo.before}
          <mark className="ix-sel" style={at(0.15)}>
            {demo.selection}
          </mark>
          {demo.after}
        </p>
        <span className="ix-acts ix-pop" style={at(0.8)}>
          {demo.actions.map((action, index) => (
            <span
              key={action}
              className={index === 0 ? 'ix-act-on ix-press' : undefined}
              style={index === 0 ? at(1.2) : undefined}
            >
              {action}
            </span>
          ))}
          <MousePointer2
            className="ix-ptr ix-in"
            size={18}
            strokeWidth={1.4}
            style={at(0.95)}
          />
        </span>
      </div>
      <div className="ix-card ix-result ix-in" style={at(1.45)}>
        <small>{demo.result.label}</small>
        <p>{demo.result.text}</p>
        <small className="ix-src">
          <ArrowUpRight size={11} aria-hidden="true" />
          {demo.result.source}
        </small>
      </div>
    </div>
  );
}

function ToolChain() {
  const { chain, copy, saved } = toolScene;
  return (
    <div className="ix-chain">
      <div className="ix-chain-row">
        {chain.map((step, index) => (
          <Fragment key={step.name}>
            {index > 0 ? (
              <ArrowRight
                className="ix-arrow ix-in"
                size={16}
                style={at(index * 0.5)}
              />
            ) : null}
            <div
              className="ix-card ix-file ix-in"
              style={at(0.1 + index * 0.5)}
            >
              <span className={`ix-file-art ix-file-${index}`}>
                {index === 0 ? <b lang="en">{step.kind}</b> : null}
                {index === 2 ? (
                  <span
                    className="ix-grid"
                    style={{ '--cols': 4 } as CSSProperties}
                  >
                    {Array.from({ length: 12 }, (_, cell) => (
                      <span key={cell} />
                    ))}
                  </span>
                ) : null}
              </span>
              <p className="ix-file-name">{step.name}</p>
              <span className="ix-chip">{step.action}</span>
            </div>
          </Fragment>
        ))}
      </div>
      <p className="ix-toast ix-in" style={at(1.5)}>
        {copy} · {saved}
      </p>
    </div>
  );
}

function ToolShelf() {
  const { shelf, working, workingNote, items, back, tail } = toolScene;
  return (
    <div className="ix-mac">
      <p className="ix-menubar">
        <span className="ix-menubar-left" />
        <span className="ix-menubar-icon">
          <i className="ix-in" style={at(0.9)} />
        </span>
      </p>
      <div className="ix-card ix-float ix-shrink" style={at(0, 0.6)}>
        <p className="ix-float-h">{working}</p>
        <span className="ix-meter" />
        <small>{workingNote}</small>
      </div>
      <div className="ix-card ix-drop ix-in" style={at(1)}>
        <p className="ix-drop-h">{shelf}</p>
        <ul>
          {items.map((item, index) => (
            <li
              key={item.title}
              className="ix-in"
              data-on={index === 0 || undefined}
              style={at(1.1 + index * 0.15)}
            >
              <b>{item.title}</b>
              <small>{item.from}</small>
              <em>{item.state}</em>
            </li>
          ))}
        </ul>
        <p className="ix-back ix-in" style={at(1.7)}>
          <ArrowUpRight size={12} aria-hidden="true" />
          {back}
        </p>
      </div>
      <p className="ix-tail ix-in" style={at(2)}>
        {tail}
      </p>
    </div>
  );
}

/* ---------- Life：琐事有下文、心愿等机会、好奇心有位置 ---------- */

/** 一张小小的海边照片（画的，不是实拍）：Life「想陪妈妈去看海」那一段用 */
function SeaPicture({ className = '' }: { className?: string }) {
  return (
    <div className={`ix-sl-picture ${className}`}>
      <span className="ix-sl-sky" />
      <span className="ix-sl-sun" />
      <span className="ix-sl-clouds">
        <i />
        <i />
        <i />
      </span>
      <span className="ix-sl-sea" />
      <span className="ix-sl-sand" />
      <svg className="ix-sl-people" viewBox="0 0 40 30">
        <circle cx="13" cy="7" r="3.2" />
        <path d="M8.6 12.4q4.4-2.6 8.8 0l1.6 16.6H7z" />
        <circle cx="25" cy="12.4" r="2.5" />
        <path d="M21.6 16.6q3.4-2 6.8 0l1 12.4h-8.8z" />
      </svg>
    </div>
  );
}

function LifeCard({ children }: { children: ReactNode }) {
  return (
    <div className="ix-card ix-life">
      <p className="ix-life-bar" lang="en">
        Molis Life
      </p>
      <div className="ix-life-body">{children}</div>
    </div>
  );
}

function LifeTrivia() {
  const { trivia } = lifeScene;
  return (
    <LifeCard>
      <p className="ix-say ix-in" style={at(0.05)}>
        {trivia.quote}
      </p>
      <div className="ix-matter ix-in" style={at(0.3)}>
        <p className="ix-matter-h">{trivia.title}</p>
        <ol className="ix-states">
          {trivia.states.map((state, index) => (
            <li
              key={state.text}
              className="ix-in"
              data-done={state.done || undefined}
              style={at(0.5 + index * 0.3)}
            >
              <Tick start={state.done ? 0.65 + index * 0.3 : undefined} />
              <span>{state.text}</span>
              {state.wait ? <em className="ix-tag">{state.wait}</em> : null}
            </li>
          ))}
        </ol>
        <p className="ix-note ix-in" style={at(1.6)}>
          {trivia.note}
        </p>
      </div>
    </LifeCard>
  );
}

function LifeWish() {
  const { wish } = lifeScene;
  return (
    <LifeCard>
      <div className="ix-wish">
        <div className="ix-wish-kept ix-in" style={at(0.05)}>
          <SeaPicture className="ix-sea" />
          <p>
            {wish.quote}
            <span className="ix-tag">{wish.kept}</span>
          </p>
        </div>
        <div className="ix-wish-now">
          <p className="ix-why ix-in" style={at(0.5)}>
            <i />
            {wish.why}
          </p>
          {wish.plans.map((plan, index) => (
            <p
              key={plan.time}
              className="ix-plan ix-in"
              style={at(0.8 + index * 0.2)}
            >
              <b>{plan.time}</b>
              <span>{plan.text}</span>
            </p>
          ))}
          <p className="ix-actions ix-in" style={at(1.4)}>
            <span className="ix-btn">{wish.actions[0]}</span>
            <span className="ix-btn ix-ghost">{wish.actions[1]}</span>
          </p>
        </div>
      </div>
    </LifeCard>
  );
}

function LifeCurious() {
  const { curious } = lifeScene;
  return (
    <LifeCard>
      <div className="ix-keeps">
        {curious.items.map((item, index) => (
          <figure
            key={item.kind}
            className={`ix-keep ix-keep-${item.kind} ix-in`}
            style={at(0.05 + index * 0.15)}
          >
            <span className="ix-keep-art">
              <i />
              <i />
              <i />
            </span>
            <figcaption>{item.text}</figcaption>
          </figure>
        ))}
      </div>
      <p className="ix-intents ix-in" style={at(0.8)}>
        {curious.intents.map((intent, index) => (
          <span
            key={intent}
            className={index === curious.pick ? 'ix-opt ix-pick' : 'ix-opt'}
            style={index === curious.pick ? at(1.2) : undefined}
          >
            {intent}
          </span>
        ))}
      </p>
      <p className="ix-note ix-in" style={at(1.6)}>
        {curious.note}
      </p>
    </LifeCard>
  );
}

/* ---------- Story：从此处推开一扇窗，再带一样东西回来 ---------- */

function StoryWorld({ index }: { index: number }) {
  const { here, hereLine, worlds } = storyScene;
  const world = worlds[index];
  return (
    <div className="ix-story">
      <div className="ix-window">
        <img
          className="ix-window-img"
          src={world.image.src}
          width={world.image.w}
          height={world.image.h}
          alt=""
          loading="lazy"
          decoding="async"
          style={{ objectPosition: world.image.position }}
        />
        <div className="ix-window-copy ix-in" style={at(0.2)}>
          <p className="ix-window-name">{world.name}</p>
          <p className="ix-window-line">{world.line}</p>
        </div>
      </div>
      <aside className="ix-card ix-here">
        <p className="ix-here-h">
          <b>{here}</b>
          <span>{hereLine}</span>
        </p>
        <ol className="ix-doors">
          {worlds.map((item, door) => (
            <li
              key={item.id}
              data-on={door === index || undefined}
              data-been={door < index || undefined}
            >
              <i />
              {item.name}
            </li>
          ))}
        </ol>
        <p className="ix-keepsake ix-pop" style={at(1.1)}>
          <small>带回</small>
          {world.souvenir}
        </p>
      </aside>
    </div>
  );
}

/* ---------- World：一座慢慢长大的小岛 ---------- */

function Island({ route, children }: { route?: number; children: ReactNode }) {
  const id = useId().replace(/:/g, '');
  return (
    <div className="ix-island">
      <svg viewBox="0 0 400 240">
        <defs>
          <linearGradient id={`${id}-top`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#eef1e2" />
            <stop offset="1" stopColor="#d9e1c6" />
          </linearGradient>
          <linearGradient id={`${id}-side`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#d9c9ae" />
            <stop offset="1" stopColor="#c2ad8c" />
          </linearGradient>
        </defs>
        <ellipse
          className="ix-island-shade"
          cx="200"
          cy="228"
          rx="118"
          ry="7"
        />
        <path
          d="M32 112c4 52 76 88 168 92s164-40 168-92z"
          fill={`url(#${id}-side)`}
        />
        <ellipse cx="200" cy="112" rx="168" ry="70" fill={`url(#${id}-top)`} />
        <ellipse
          cx="200"
          cy="104"
          rx="140"
          ry="50"
          fill="#fff"
          opacity="0.28"
        />
        {route === undefined ? null : (
          <path
            className="ix-route"
            d="M118 128C150 96 232 70 282 88"
            style={at(route)}
          />
        )}
      </svg>
      {children}
    </div>
  );
}

function WorldStart() {
  const { place, steps } = worldScene;
  return (
    <div className="ix-world">
      <Island>
        <span
          className="ix-spot ix-pop"
          style={{ left: '48%', top: '50%', ...at(0.15) }}
        >
          <i />
          <b>{place.name}</b>
          <small>{place.kind}</small>
        </span>
        <span
          className="ix-sprout ix-pop"
          style={{ left: '30%', top: '44%', ...at(1.5) }}
        />
        <span
          className="ix-sprout ix-pop"
          style={{ left: '66%', top: '62%', ...at(1.65) }}
        />
      </Island>
      <ol className="ix-steps">
        {steps.map((step, index) => (
          <li key={step} className="ix-in" style={at(0.6 + index * 0.3)}>
            <Tick start={0.75 + index * 0.3} />
            {step}
          </li>
        ))}
      </ol>
    </div>
  );
}

function WorldLinks() {
  const { place, door, souvenir, thought, handoff } = worldScene;
  return (
    <div className="ix-world">
      <Island route={0.4}>
        <span className="ix-spot" style={{ left: '30%', top: '54%' }}>
          <i />
          <b>{place.name}</b>
        </span>
        <span
          className="ix-spot ix-spot-story ix-pop"
          style={{ left: '70%', top: '36%', ...at(0.15) }}
        >
          <i />
          <b>{door}</b>
        </span>
        <span
          className="ix-spot ix-spot-keep ix-pop"
          style={{ left: '46%', top: '72%', ...at(0.9) }}
        >
          <i />
          <b>{souvenir}</b>
        </span>
      </Island>
      <div className="ix-world-side">
        <p className="ix-thought ix-in" style={at(1.35)}>
          {thought}
        </p>
        <p className="ix-handoff ix-in" style={at(1.8)}>
          {handoff}
          <ArrowRight size={13} aria-hidden="true" />
        </p>
      </div>
    </div>
  );
}

function WorldFamily({ names }: { names: Record<string, string> }) {
  const { family, familyNote } = worldScene;
  return (
    <div className="ix-family">
      <div className="ix-family-row">
        {family.map((item, index) => (
          <Fragment key={item.id}>
            {index > 0 ? (
              <span className="ix-op ix-pop" style={at(0.2 + index * 0.35)}>
                {index === 1 ? '+' : '='}
              </span>
            ) : null}
            <div
              className={`ix-card ix-member ix-member-${item.id} ix-in`}
              style={at(0.05 + index * 0.35)}
            >
              <small>{item.role}</small>
              <b lang="en">{names[item.id]}</b>
              <p>{item.text}</p>
              <span className="ix-tag">{item.status}</span>
            </div>
          </Fragment>
        ))}
      </div>
      <p className="ix-note ix-in" style={at(1.4)}>
        {familyNote}
      </p>
    </div>
  );
}

export function IntroStage({
  product,
  names,
  controls,
}: {
  product: IntroProduct;
  names: Record<string, string>;
  controls: ReactNode;
}) {
  const scenes: Record<IntroProduct['id'], ReactNode[]> = {
    work: [
      <WorkBoards key="boards" />,
      <WorkWrite key="write" />,
      <WorkGoal key="goal" />,
    ],
    tool: [
      <ToolNear key="near" />,
      <ToolChain key="chain" />,
      <ToolShelf key="shelf" />,
    ],
    life: [
      <LifeTrivia key="trivia" />,
      <LifeWish key="wish" />,
      <LifeCurious key="curious" />,
    ],
    story: storyScene.worlds.map((world, index) => (
      <StoryWorld key={world.id} index={index} />
    )),
    world: [
      <WorldStart key="start" />,
      <WorldLinks key="links" />,
      <WorldFamily key="family" names={names} />,
    ],
  };
  return (
    <Reel
      name={product.name}
      chapters={product.chapters}
      scenes={scenes[product.id]}
      controls={controls}
    />
  );
}
