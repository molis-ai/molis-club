'use client';
import Link from 'next/link';
import { Check, MousePointer2 } from 'lucide-react';
import {
  GITHUB_URL,
  INSTALL_URL,
  RELEASES_URL,
  access,
  bounds,
  closing,
  compare,
  compose,
  control,
  desk,
  differences,
  everywhere,
  hero,
  more,
  phaseLabel,
  platform,
  relay,
  scenes,
  scenesIntro,
  type Phase as PhaseId,
  type Scene,
} from '../../../../../content/folio-work';
import { Triptych } from '../home-works';
import {
  Actions,
  Btn,
  Caption,
  Closing,
  Framed,
  More,
  NextRoom,
  Phrases,
  Plate,
  Room,
  Shell,
  Status,
  Tag,
  type Vars,
} from '../kit';
import { HOME, SOLUTIONS, contactHref, lineHref } from '../routes';
import '../art-r7.css';
import './work.css';

// Molis Work · Room 1 的个展。内容与 Folio 的 Work 页同一份、同一个顺序：
// 亮点 → 平台和插件 → 三个场景 → 五点不同 → 更多场景 → 比较 → 边界 → 现在能用什么。
// 展览的做法：首屏是 Room 1 的展厅实景；「到处有 AI」是一面横着走过去的长墙，五个插件挂成一排，
// 上面一行是 AI 在哪一环出手，下面一行是你做的事；平台画成一张建筑剖面；三个场景是三幅装框的示意版画；
// 五点不同放进一间黑盒子放映室；「现在能用什么」是一张展品清单。

/** 阶段签：已发布是真实状态（实心点），开发版、预览、规划中是虚线 */
function Phase({ phase, note }: { phase: PhaseId; note?: string }) {
  return (
    <Tag tone={phase === 'released' ? 'live' : 'plan'}>
      {note ?? phaseLabel[phase]}
    </Tag>
  );
}

/** 首屏：左边是展签式的说明，下面是一张 Room 1 的展厅实景，往下走镜头慢慢推近 */
function Hero() {
  return (
    <section className="g-work-hero" aria-labelledby="g-work-title">
      <div className="g-work-hero-copy">
        <p className="g-work-hero-kicker">
          <span className="g-soft" lang="en" aria-hidden="true">
            Room 1
          </span>
          <span>{hero.kicker}</span>
        </p>
        <h1 id="g-work-title" className="g-work-hero-title">
          <Phrases text={hero.title} />
        </h1>
        <div className="g-work-hero-side">
          <p className="g-lead">{hero.lead}</p>
          <p className="g-work-agents">
            <span>{hero.agentsLabel}</span>
            {hero.agents.map((agent) => (
              <b key={agent} lang="en">
                {agent}
              </b>
            ))}
            <span>{hero.agentsMore}</span>
          </p>
          <Status items={hero.status} />
          <Actions>
            <Btn href="#how">{hero.actions.how}</Btn>
            <More href={GITHUB_URL} external>
              {hero.actions.github}
            </More>
          </Actions>
        </div>
      </div>
      <div className="g-work-view" data-scene="pass">
        <Room>
          <div className="g-group">
            <div className="g-art">
              <Triptych active />
            </div>
          </div>
        </Room>
      </div>
      <Caption title="Installation view, Room 1">{desk.note}</Caption>
    </section>
  );
}

/** 亮点：三个动词写在墙上，下面是一面横着走过去的长墙 */
function Everywhere() {
  return (
    <section
      id="how"
      className="g-work-everywhere"
      aria-labelledby="g-work-everywhere-title"
    >
      <div className="g-wrap">
        <Plate
          id="g-work-everywhere-title"
          index="I"
          kicker={everywhere.kicker}
          title={everywhere.title.map((line) => (
            <span className="g-phrase" key={line}>
              {line}
            </span>
          ))}
          side={
            <>
              <p>{everywhere.lead}</p>
              <p className="g-work-side-tag">
                <Phase phase={everywhere.phase} />
              </p>
            </>
          }
        />
        <ul className="g-work-modes">
          {everywhere.modes.map((mode, index) => (
            <li
              key={mode.verb}
              data-reveal
              style={{ '--delay': `${index * 120}ms` } as Vars}
            >
              <strong>{mode.verb}</strong>
              <p>{mode.text}</p>
            </li>
          ))}
        </ul>
      </div>
      <Walk />
    </section>
  );
}

/**
 * 一面长墙：五个插件按工作的先后挂成一排。上面一行杏色的签是 AI 在这一环理解、判断、动手、接续，
 * 下面一行是你做的事。往下滚，人沿着墙往右走，走到哪一幅，哪一幅亮起来。
 */
function Walk() {
  const steps = everywhere.flow;
  return (
    <div
      className="g-work-walk"
      data-scene="pin"
      style={{ '--n': steps.length } as Vars}
    >
      <div className="g-work-walk-stage">
        <div className="g-work-walk-wall" aria-hidden="true" />
        <ol className="g-work-walk-track">
          <li className="g-work-walk-lanes" aria-hidden="true">
            <span className="g-work-lane-ai">AI</span>
            <span className="g-work-lane-you">{everywhere.youLabel}</span>
          </li>
          {steps.map((step, index) => (
            <li
              key={step.plugin}
              className="g-work-step"
              style={{ '--i': index } as Vars}
            >
              <div className="g-work-step-ai">
                {step.ai ? (
                  <p>
                    <em lang="zh">{step.ai.verb}</em>
                    {step.ai.text}
                  </p>
                ) : null}
              </div>
              <div className="g-work-step-work">
                <span className="g-work-step-no" aria-hidden="true">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <strong lang="en">{step.plugin}</strong>
                <small>{step.task}</small>
              </div>
              <div className="g-work-step-you">
                {step.you ? (
                  <p>
                    {everywhere.youLabel} · {step.you}
                  </p>
                ) : null}
              </div>
            </li>
          ))}
          <li className="g-work-walk-aside">
            <p>{everywhere.aside}</p>
          </li>
        </ol>
      </div>
    </div>
  );
}

/** 平台：一张建筑剖面图，最下面是本机的 Home，往上是平台的几层、插件，最上面是四个调用方 */
function Platform() {
  const released = new Set(platform.released);
  return (
    <section
      className="g-work-platform g-wrap g-section"
      aria-labelledby="g-work-platform-title"
    >
      <Plate
        id="g-work-platform-title"
        index="II"
        kicker={platform.kicker}
        title={platform.title.map((line) => (
          <span className="g-phrase" key={line}>
            {line}
          </span>
        ))}
        side={<p>{platform.lead}</p>}
      />
      <div className="g-work-platform-body">
        <ol className="g-work-principles">
          {platform.principles.map((item, index) => (
            <li
              key={item.title}
              data-reveal
              style={{ '--delay': `${index * 90}ms` } as Vars}
            >
              <span className="g-soft" aria-hidden="true">
                {index + 1}
              </span>
              <strong>{item.title}</strong>
              <p>{item.text}</p>
            </li>
          ))}
        </ol>
        <figure
          className="g-work-section"
          data-reveal
          aria-label="Molis Work 的组成：页面、助理、工作流和外部 Agent 从同一个能力目录调用；中间是项目插件和个人插件；下面是平台和本机的 Home。"
        >
          <div className="g-work-sec-row g-work-sec-callers" aria-hidden="true">
            {platform.callers.map((caller) => (
              <span key={caller}>{caller}</span>
            ))}
            <small>{platform.callersNote}</small>
          </div>
          <div className="g-work-sec-row g-work-sec-catalog" aria-hidden="true">
            {platform.catalog}
          </div>
          <div className="g-work-sec-row g-work-sec-plugins" aria-hidden="true">
            <div>
              <small>{platform.projectLabel}</small>
              <ul>
                {platform.project.map((name) => (
                  <li
                    key={name}
                    data-released={released.has(name) || undefined}
                  >
                    {name}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <small>{platform.personalLabel}</small>
              <ul>
                {platform.personal.map((name) => (
                  <li
                    key={name}
                    data-released={released.has(name) || undefined}
                  >
                    {name}
                  </li>
                ))}
                <li className="g-work-sec-yours">+ {platform.yours}</li>
              </ul>
            </div>
          </div>
          <div className="g-work-sec-row g-work-sec-layers" aria-hidden="true">
            {platform.layers.map((layer) => (
              <span key={layer}>{layer}</span>
            ))}
          </div>
          <div className="g-work-sec-row g-work-sec-base" aria-hidden="true">
            {platform.base}
          </div>
          <figcaption>{platform.count}</figcaption>
        </figure>
      </div>
    </section>
  );
}

/* ---------- 三个场景的示意版画 ---------- */

/** 场景 1：给项目加 Inbox，它依赖的 Feed 一起加上；个人插件在每个项目里都在 */
function ComposePrint() {
  return (
    <div className="g-work-print g-work-compose" aria-hidden="true">
      <div className="g-work-proj g-work-proj-back">
        <header>{compose.other}</header>
        <div className="g-work-dock">
          {compose.otherDock.map((name) => (
            <span key={name}>{name}</span>
          ))}
          <i />
          {compose.personal.map((name) => (
            <span key={name} data-personal>
              {name}
            </span>
          ))}
        </div>
      </div>
      <div className="g-work-proj">
        <header>
          {compose.project}
          <small>项目插件 + 个人插件</small>
        </header>
        <div className="g-work-dock">
          {compose.dock.map((name) => (
            <span key={name}>{name}</span>
          ))}
          <span className="g-work-added">{compose.added}</span>
          <span className="g-work-dep">{compose.dependency}</span>
          <i />
          {compose.personal.map((name) => (
            <span key={name} data-personal>
              {name}
            </span>
          ))}
        </div>
        <div className="g-work-picker">
          <small>{compose.picker}</small>
          {compose.options.map((name) => (
            <span key={name} data-on={name === compose.added || undefined}>
              {name === compose.added ? <Check size={11} /> : null}
              {name}
            </span>
          ))}
          <MousePointer2
            className="g-work-pick"
            size={15}
            fill="currentColor"
          />
        </div>
        <p className="g-work-toast">{compose.toast}</p>
        <p className="g-work-personal-note">{compose.personalNote}</p>
      </div>
    </div>
  );
}

/** 场景 2：同一个 Goal，周一、周三、周四换着 Agent 接着做，周五收尾核对 */
function RelayPrint() {
  return (
    <div className="g-work-print g-work-relay" aria-hidden="true">
      <header>
        <small lang="en">Goal</small>
        <strong>{relay.goal}</strong>
      </header>
      <ul className="g-work-require">
        {relay.require.map((item) => (
          <li key={item}>
            <Check size={11} />
            {item}
          </li>
        ))}
      </ul>
      <ol className="g-work-log">
        {relay.log.map((entry, index) => (
          <li
            key={entry.day}
            data-tone={entry.tone}
            style={{ '--k': index } as Vars}
          >
            <span>{entry.day}</span>
            <b>{entry.who}</b>
            <span>{entry.text}</span>
          </li>
        ))}
      </ol>
      <p className="g-work-proposal">
        <b>{relay.proposal.who}</b>
        {relay.proposal.text}
        <span>{relay.proposal.tag}</span>
      </p>
      <footer>
        <small>{relay.checkLabel}</small>
        {relay.checks.map((item) => (
          <span key={item}>{item}</span>
        ))}
      </footer>
      <span className="g-work-stamp">{relay.stamp}</span>
    </div>
  );
}

/** 场景 3：四个调用方从同一个能力目录按授权调用；撤销、审查、撤权 */
function ControlPrint() {
  const { review } = control.events;
  return (
    <div className="g-work-print g-work-control" aria-hidden="true">
      <table>
        <thead>
          <tr>
            <th>{control.catalog}</th>
            {control.abilities.map((ability) => (
              <th key={ability}>{ability}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {control.callers.map((caller, row) => (
            <tr key={caller}>
              <th>{caller}</th>
              {control.grants[row].map((grant, col) => (
                <td key={col}>
                  <i data-on={grant ? true : undefined} />
                  <span className="sr-only">{grant ? '有' : '无'}</span>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <div className="g-work-events">
        <p className="g-work-event">
          <b>{control.events.undo.who}</b>
          {control.events.undo.text}
          <span>{control.events.undo.action}</span>
        </p>
        <p className="g-work-event g-work-event-review">
          <small>{review.label}</small>
          <b>{review.who}</b>
          {review.text}
          <span>{review.actions[0]}</span>
          <span>{review.actions[1]}</span>
        </p>
        <p className="g-work-event g-work-event-revoke">
          <b>{control.events.revoke.who}</b>
          {control.events.revoke.text}
        </p>
      </div>
    </div>
  );
}

const prints: Record<
  Scene['id'],
  { Print: () => React.JSX.Element; label: string; note: string; tone: string }
> = {
  compose: {
    Print: ComposePrint,
    label: compose.label,
    note: '界面示意 · 示例项目',
    tone: 'sand',
  },
  relay: {
    Print: RelayPrint,
    label: relay.label,
    note: '界面示意 · 示例目标',
    tone: 'mist',
  },
  control: {
    Print: ControlPrint,
    label: control.label,
    note: '界面示意 · 示例授权',
    tone: 'blush',
  },
};

function SceneRoom({ scene, index }: { scene: Scene; index: number }) {
  const { Print, label, note, tone } = prints[scene.id];
  return (
    <article
      id={scene.id}
      className="g-work-scene"
      data-side={index % 2 ? 'right' : 'left'}
      aria-labelledby={`g-work-scene-${scene.id}`}
    >
      <div className="g-work-scene-copy" data-reveal>
        <p className="g-work-scene-top">
          <span className="g-soft" aria-hidden="true">
            {index + 1}
          </span>
          <Phase phase={scene.phase} note={scene.phaseNote} />
        </p>
        <h3 id={`g-work-scene-${scene.id}`}>
          {scene.title.map((line) => (
            <span className="g-phrase" key={line}>
              {line}
            </span>
          ))}
        </h3>
        <blockquote>{scene.pain}</blockquote>
        <ul>
          {scene.points.map((point) => (
            <li key={point}>{point}</li>
          ))}
        </ul>
      </div>
      <figure className="g-work-scene-art" data-reveal aria-label={label}>
        <Framed tone="white" className={`g-work-frame g-work-tone-${tone}`}>
          <Print />
        </Framed>
        <Caption title={`Plate ${index + 1}`}>{note}</Caption>
      </figure>
    </article>
  );
}

function Scenes() {
  return (
    <section
      className="g-work-scenes g-wrap g-section"
      aria-labelledby="g-work-scenes-title"
    >
      <Plate
        id="g-work-scenes-title"
        index="III"
        kicker={scenesIntro.kicker}
        title={scenesIntro.title}
      />
      {scenes.map((scene, index) => (
        <SceneRoom key={scene.id} scene={scene} index={index} />
      ))}
    </section>
  );
}

/** 五点不同：一间黑盒子放映室，五句话像投在墙上的字幕一样依次亮起 */
function Differences() {
  return (
    <section className="g-work-blackbox" aria-labelledby="g-work-diff-title">
      <div className="g-wrap">
        <Plate
          id="g-work-diff-title"
          index="IV"
          kicker={differences.kicker}
          title={differences.title}
          className="g-work-plate-dark"
        />
        <ol className="g-work-diff">
          {differences.items.map((item, index) => (
            <li
              key={item.title}
              data-reveal
              style={{ '--delay': `${index * 80}ms` } as Vars}
            >
              <span className="g-soft" aria-hidden="true">
                {index + 1}
              </span>
              <strong>
                {item.title}
                {item.phase ? <Phase phase={item.phase} /> : null}
              </strong>
              <p>{item.text}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

/** 更多场景：一张图录式的清单，编号接着三个主场景往下数 */
function MoreScenes() {
  return (
    <section
      className="g-work-more g-wrap g-section"
      aria-labelledby="g-work-more-title"
    >
      <Plate
        id="g-work-more-title"
        index="V"
        kicker={more.kicker}
        title={more.title}
        side={<p>{more.lead}</p>}
      />
      <ol className="g-work-more-list">
        {more.items.map((item, index) => (
          <li key={item.title} data-reveal>
            <span className="g-soft" aria-hidden="true">
              {String(index + 4).padStart(2, '0')}
            </span>
            <h3>{item.title}</h3>
            <p className="g-work-more-pain">{item.pain}</p>
            <p>{item.text}</p>
            <div>
              {item.phase === 'next' ? null : (
                <Phase phase={item.phase} note={item.phaseNote} />
              )}
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}

/** 和你现在的做法比：一张对照表；边界写在一块参观须知似的牌子上 */
function CompareAndBounds() {
  return (
    <section className="g-work-compare g-wrap g-section">
      <Plate
        id="g-work-compare-title"
        index="VI"
        kicker={compare.kicker}
        title={compare.title}
      />
      <table className="g-work-table" aria-labelledby="g-work-compare-title">
        <thead>
          <tr>
            <th scope="col">{compare.labels.now}</th>
            <th scope="col">{compare.labels.here}</th>
            <th scope="col">{compare.labels.gap}</th>
          </tr>
        </thead>
        <tbody>
          {compare.rows.map((row) => (
            <tr key={row.now} data-reveal>
              <th scope="row">{row.now}</th>
              <td data-label={compare.labels.here}>{row.here}</td>
              <td data-label={compare.labels.gap}>{row.gap}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="g-work-bounds" aria-labelledby="g-work-bounds-title">
        <div className="g-work-bounds-head" data-reveal>
          <p className="g-kicker">{bounds.kicker}</p>
          <h2 id="g-work-bounds-title">
            <Phrases text={bounds.title} />
          </h2>
        </div>
        <ul className="g-work-bounds-card" data-reveal>
          {bounds.items.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/** 现在能用什么：一张展品清单。展出中、即将展出、筹备中是展览的说法，真实的阶段写在每一栏的小标题里 */
function Access() {
  return (
    <section
      id="get"
      className="g-work-access g-wrap g-section"
      aria-labelledby="g-work-access-title"
    >
      <Plate
        id="g-work-access-title"
        index="VII"
        kicker={access.kicker}
        title={access.title}
      />
      <div className="g-work-checklist">
        <article data-reveal>
          <p className="g-work-check-state" lang="en" aria-hidden="true">
            On view
          </p>
          <small>{access.now.label}</small>
          <h3>{access.now.title}</h3>
          <ul>
            {access.now.items.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          <p className="g-work-check-text">{access.now.text}</p>
          <Actions>
            <Btn href={INSTALL_URL} external>
              {access.now.install}
            </Btn>
            <More href={GITHUB_URL} external>
              {access.now.github}
            </More>
          </Actions>
        </article>
        <article data-reveal style={{ '--delay': '100ms' } as Vars}>
          <p className="g-work-check-state" lang="en" aria-hidden="true">
            Coming next
          </p>
          <small>{access.next.label}</small>
          <h3>{access.next.title}</h3>
          <ul>
            {access.next.items.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          <p className="g-work-check-text">{access.next.text}</p>
          <Actions>
            <Btn href={contactHref('work')} tone="ghost">
              {access.next.follow}
            </Btn>
            <More href={RELEASES_URL} external>
              {access.next.releases}
            </More>
          </Actions>
        </article>
        <article data-reveal style={{ '--delay': '200ms' } as Vars}>
          <p className="g-work-check-state" lang="en" aria-hidden="true">
            In preparation
          </p>
          <small>{access.later.label}</small>
          <h3>{access.later.title}</h3>
          <ul className="g-work-later">
            {access.later.items.map(([item, phase, link]) => (
              <li key={item}>
                {link ? <Link href={lineHref[link]}>{item}</Link> : item}
                <Phase phase={phase} />
              </li>
            ))}
          </ul>
        </article>
      </div>
    </section>
  );
}

function Ending() {
  return (
    <>
      <Closing id="g-work-closing-title" title={closing.title}>
        <Actions>
          <Btn href={GITHUB_URL} external>
            {hero.actions.github}
          </Btn>
          <Btn href={SOLUTIONS} tone="ghost">
            {closing.solutions}
          </Btn>
          <More href={HOME}>{closing.home}</More>
        </Actions>
      </Closing>
      <div className="g-next-wrap">
        <NextRoom current="work" />
      </div>
    </>
  );
}

export default function GalleryWork() {
  return (
    <Shell current="work" rooms className="g-work" ending={<Ending />}>
      <Hero />
      <Everywhere />
      <Platform />
      <Scenes />
      <Differences />
      <MoreScenes />
      <CompareAndBounds />
      <Access />
    </Shell>
  );
}
