'use client';
import Link from 'next/link';
import { ArrowRight, Check, Sparkles } from 'lucide-react';
import { useState } from 'react';
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
  differences,
  everywhere,
  hero,
  more,
  phaseLabel,
  platform,
  relay,
  scenes,
  scenesIntro,
  type Phase,
  type Scene,
} from '../../../../../content/folio-work';
import { HOME, SOLUTIONS, contactHref, pad, productHref } from '../routes';
import {
  Actions,
  E2Page,
  Kicker,
  NextProduct,
  Phrases,
  Plate,
  SectionHead,
  Status,
  useStepper,
  type Vars,
} from '../shell';
import { WorkDesk } from './desk';
import { ComposeDemo, ControlDemo, RelayDemo } from './scenes';
import { PlatformStack } from './stack';
import './work.css';

// E2 的 Molis Work：整站最「产品」的一页。要一眼读到：现在能用、开源、AI 出现在工作流程里需要的那一环，
// 而不是住在聊天框里。顺序照 Folio 最新版：首屏（左边是什么 / 给谁 / 状态 / 行动，右边会自己推进的界面示意）
// → 亮点（泳道图，AI 随滚动在需要的环节出现）→ 组成（分层轴测）→ 三个场景（粘住的图版，跟着要点换画面）
// → 五点不同 → 更多场景 → 比较与边界（规格表）→ 现在能用什么（三栏时间轴）→ 结尾与接着看。

function PhaseTag({ phase, note }: { phase: Phase; note?: string }) {
  return (
    <span className="ew-phase" data-phase={phase}>
      {note ?? phaseLabel[phase]}
    </span>
  );
}

/* ---------- 首屏 ---------- */

function Hero() {
  return (
    <section className="ew-hero" aria-labelledby="ew-title">
      <div className="ew-hero-copy">
        <Kicker>{hero.kicker}</Kicker>
        <h1 id="ew-title">
          <Phrases text={hero.title} />
        </h1>
        <p className="ew-hero-lead">{hero.lead}</p>
        <dl className="ew-hero-spec">
          <div>
            <dt>{hero.agentsLabel}</dt>
            <dd>
              <ul className="ew-agents">
                {hero.agents.map((agent) => (
                  <li key={agent} lang="en">
                    {agent}
                  </li>
                ))}
              </ul>
              <span className="ew-agents-more">{hero.agentsMore}</span>
            </dd>
          </div>
          <div>
            <dt>当前状态</dt>
            <dd>
              <Status items={hero.status} />
            </dd>
          </div>
        </dl>
        <Actions
          items={[
            { label: hero.actions.how, href: '#how' },
            {
              label: hero.actions.github,
              href: GITHUB_URL,
              external: true,
              tone: 'ghost',
            },
          ]}
        />
      </div>
      <WorkDesk />
    </section>
  );
}

/* ---------- 01 亮点 ---------- */

function Everywhere() {
  return (
    <section
      id="how"
      className="ew-section"
      data-bg="white"
      aria-labelledby="ew-how-title"
    >
      <SectionHead
        id="ew-how-title"
        index={0}
        kicker={everywhere.kicker}
        title={everywhere.title.join('')}
        lead={everywhere.lead}
        layout="split"
      >
        <PhaseTag phase={everywhere.phase} />
      </SectionHead>

      <ol className="ew-modes">
        {everywhere.modes.map((mode, index) => (
          <li
            key={mode.verb}
            data-reveal
            style={{ '--d': `${index * 90}ms` } as Vars}
          >
            <i aria-hidden="true">{pad(index)}</i>
            <strong>{mode.verb}</strong>
            <p>{mode.text}</p>
          </li>
        ))}
      </ol>

      <Plate
        className="ew-flow-plate"
        fig="Fig. 02"
        caption={everywhere.flow.map((step) => step.plugin).join(' → ')}
        note="示意"
      >
        <div className="ew-flow" data-scene="enter">
          <span className="ew-flow-lane" data-lane="ai" aria-hidden="true">
            <Sparkles size={13} />
            AI
          </span>
          <span className="ew-flow-lane" data-lane="you" aria-hidden="true">
            {everywhere.youLabel}
          </span>
          <ol className="ew-flow-steps">
            {everywhere.flow.map((step, index) => (
              <li key={step.plugin} style={{ '--i': index } as Vars}>
                <div className="ew-flow-ai">
                  {step.ai ? (
                    <p>
                      <span className="ew-flow-tag" aria-hidden="true">
                        AI
                      </span>
                      <b>{step.ai.verb}</b>
                      {step.ai.text}
                    </p>
                  ) : null}
                </div>
                <div className="ew-flow-tile">
                  <i aria-hidden="true">{pad(index)}</i>
                  <strong>{step.plugin}</strong>
                  <small>{step.task}</small>
                </div>
                <div className="ew-flow-you">
                  {step.you ? (
                    <p>
                      {everywhere.youLabel} · {step.you}
                    </p>
                  ) : null}
                </div>
              </li>
            ))}
          </ol>
        </div>
      </Plate>
      <p className="ew-aside" data-reveal>
        {everywhere.aside}
      </p>
    </section>
  );
}

/* ---------- 02 组成 ---------- */

function Platform() {
  const released = new Set(platform.released);
  return (
    <section
      className="ew-section"
      data-bg="paper"
      aria-labelledby="ew-platform-title"
    >
      <div className="ew-platform">
        <div className="ew-platform-copy">
          <SectionHead
            id="ew-platform-title"
            index={1}
            kicker={platform.kicker}
            title={platform.title.join('')}
            lead={platform.lead}
          />
          <ol className="ew-principles">
            {platform.principles.map((item, index) => (
              <li
                key={item.title}
                data-reveal
                style={{ '--d': `${index * 80}ms` } as Vars}
              >
                <i aria-hidden="true">{pad(index)}</i>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </li>
            ))}
          </ol>
        </div>
        <div className="ew-platform-art" data-scene="enter" data-reveal>
          <Plate
            fig="Fig. 03"
            caption="分层轴测"
            note="示意"
            label="Molis Work 的组成：页面、助理、工作流和外部 Agent 从同一个能力目录调用；中间是项目插件和个人插件；下面是平台和本机的 Home。"
          >
            <PlatformStack />
          </Plate>
        </div>
      </div>

      <div className="ew-plugins" data-reveal>
        <div className="ew-plugins-group">
          <h3>{platform.projectLabel}</h3>
          <ul>
            {platform.project.map((name) => (
              <li key={name} data-released={released.has(name) || undefined}>
                {name}
              </li>
            ))}
          </ul>
        </div>
        <div className="ew-plugins-group">
          <h3>{platform.personalLabel}</h3>
          <ul>
            {platform.personal.map((name) => (
              <li key={name} data-released={released.has(name) || undefined}>
                {name}
              </li>
            ))}
            <li className="ew-plugins-yours">+ {platform.yours}</li>
          </ul>
        </div>
        <p className="ew-plugins-count">{platform.count}</p>
      </div>
    </section>
  );
}

/* ---------- 03 三个场景 ---------- */

const sceneDemo: Record<
  Scene['id'],
  {
    Demo: () => React.JSX.Element;
    label: string;
    caption: string;
    note: string;
  }
> = {
  compose: {
    Demo: ComposeDemo,
    label: compose.label,
    caption: compose.picker,
    note: '界面示意 · 示例项目',
  },
  relay: {
    Demo: RelayDemo,
    label: relay.label,
    caption: `Goal · ${relay.goal}`,
    note: '界面示意 · 示例目标',
  },
  control: {
    Demo: ControlDemo,
    label: control.label,
    caption: control.catalog,
    note: '界面示意 · 示例授权',
  },
};

function SceneBlock({ scene, index }: { scene: Scene; index: number }) {
  const ref = useStepper<HTMLElement>('.ew-point');
  const { Demo, label, caption, note } = sceneDemo[scene.id];
  return (
    <article
      ref={ref}
      id={scene.id}
      className="ew-scene"
      data-step="0"
      aria-labelledby={`ew-scene-${scene.id}`}
    >
      <div className="ew-scene-copy">
        <header className="ew-scene-head" data-reveal>
          <span className="ew-scene-meta">
            <i aria-hidden="true">{pad(index)}</i>
            <PhaseTag phase={scene.phase} note={scene.phaseNote} />
          </span>
          <h3 id={`ew-scene-${scene.id}`}>
            {scene.title.map((line) => (
              <span className="e2-phrase" key={line}>
                {line}
              </span>
            ))}
          </h3>
          <blockquote>{scene.pain}</blockquote>
        </header>
        <ol className="ew-points">
          {scene.points.map((point, step) => (
            <li key={point} className="ew-point">
              <i aria-hidden="true">
                {pad(index)}.{step + 1}
              </i>
              <p>{point}</p>
            </li>
          ))}
        </ol>
      </div>
      <div className="ew-scene-stage">
        <Plate
          fig={`Fig. ${pad(index + 3)}`}
          caption={caption}
          note={note}
          label={label}
        >
          <Demo />
        </Plate>
      </div>
    </article>
  );
}

function Scenes() {
  return (
    <section
      className="ew-section ew-scenes"
      data-bg="white"
      aria-labelledby="ew-scenes-title"
    >
      <SectionHead
        id="ew-scenes-title"
        index={2}
        kicker={scenesIntro.kicker}
        title={scenesIntro.title}
      />
      {scenes.map((scene, index) => (
        <SceneBlock key={scene.id} scene={scene} index={index} />
      ))}
    </section>
  );
}

/* ---------- 04 五点不同 ---------- */

function Differences() {
  return (
    <section
      className="ew-section"
      data-bg="paper"
      aria-labelledby="ew-diff-title"
    >
      <div className="ew-sheet">
        <div className="ew-sheet-head">
          <SectionHead
            id="ew-diff-title"
            index={3}
            kicker={differences.kicker}
            title={differences.title}
          />
        </div>
        <ol className="ew-diff">
          {differences.items.map((item, index) => (
            <li key={item.title} data-reveal>
              <i aria-hidden="true">{pad(index)}</i>
              <div className="ew-diff-title">
                <h3>{item.title}</h3>
                {item.phase ? <PhaseTag phase={item.phase} /> : null}
              </div>
              <p>{item.text}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

/* ---------- 05 更多场景 ---------- */

/** 05 更多场景：底下的状态图例可以点——点「已发布」就只看现在能用的，再点一次回到全部 */
function More() {
  const [only, setOnly] = useState<Phase | null>(null);
  return (
    <section
      className="ew-section"
      data-bg="white"
      aria-labelledby="ew-more-title"
    >
      <SectionHead
        id="ew-more-title"
        index={4}
        kicker={more.kicker}
        title={more.title}
        lead={more.lead}
        layout="split"
      />
      <ul className="ew-more" data-only={only ?? undefined}>
        {more.items.map((item, index) => (
          <li
            key={item.title}
            data-phase={item.phase}
            data-dim={(only && only !== item.phase) || undefined}
            data-reveal
            style={{ '--d': `${(index % 3) * 80}ms` } as Vars}
          >
            <i aria-hidden="true">{pad(index + 3)}</i>
            <h3>{item.title}</h3>
            <p className="ew-more-pain">{item.pain}</p>
            <p>{item.text}</p>
            {item.phase === 'next' ? null : (
              <PhaseTag phase={item.phase} note={item.phaseNote} />
            )}
          </li>
        ))}
        <li className="ew-more-key" data-reveal>
          <small>按状态看</small>
          <ul aria-label="按状态筛选">
            {(Object.keys(phaseLabel) as Phase[]).map((phase) => (
              <li key={phase}>
                <button
                  type="button"
                  aria-pressed={only === phase}
                  onClick={() =>
                    setOnly((value) => (value === phase ? null : phase))
                  }
                >
                  <PhaseTag phase={phase} />
                  <span className="ew-more-count">
                    {more.items.filter((item) => item.phase === phase).length}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </li>
      </ul>
    </section>
  );
}

/* ---------- 06 比较 ---------- */

function Compare() {
  return (
    <section
      className="ew-section"
      data-bg="paper"
      aria-labelledby="ew-compare-title"
    >
      <SectionHead
        id="ew-compare-title"
        index={5}
        kicker={compare.kicker}
        title={compare.title}
      />
      <table className="ew-compare">
        <thead>
          <tr>
            <th scope="col">{compare.labels.now}</th>
            <th scope="col">{compare.labels.here}</th>
            <th scope="col">{compare.labels.gap}</th>
          </tr>
        </thead>
        <tbody>
          {compare.rows.map((row, index) => (
            <tr key={row.now} data-reveal data-flow>
              <th scope="row">
                <i aria-hidden="true">{pad(index)}</i>
                {row.now}
              </th>
              <td data-label={compare.labels.here}>{row.here}</td>
              <td data-label={compare.labels.gap}>{row.gap}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}

/* ---------- 07 边界 ---------- */

function Bounds() {
  return (
    <section
      className="ew-section"
      data-bg="white"
      aria-labelledby="ew-bounds-title"
    >
      <div className="ew-sheet">
        <div className="ew-sheet-head">
          <SectionHead
            id="ew-bounds-title"
            index={6}
            kicker={bounds.kicker}
            title={bounds.title}
          />
        </div>
        <ol className="ew-bounds">
          {bounds.items.map((item, index) => (
            <li key={item} data-reveal>
              <i aria-hidden="true">{pad(index)}</i>
              <p>{item}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

/* ---------- 08 现在能用什么 ---------- */

function Access() {
  return (
    <section
      id="get"
      className="ew-section"
      data-bg="paper"
      aria-labelledby="ew-access-title"
    >
      <SectionHead
        id="ew-access-title"
        index={7}
        kicker={access.kicker}
        title={access.title}
      />
      <div className="ew-access">
        <article className="ew-access-col" data-when="now" data-reveal>
          <small>{access.now.label}</small>
          <h3>{access.now.title}</h3>
          <ul className="ew-access-list">
            {access.now.items.map((item) => (
              <li key={item}>
                <Check size={14} strokeWidth={2.4} aria-hidden="true" />
                {item}
              </li>
            ))}
          </ul>
          <p>{access.now.text}</p>
          <Actions
            items={[
              {
                label: access.now.install,
                href: INSTALL_URL,
                external: true,
              },
              {
                label: access.now.github,
                href: GITHUB_URL,
                external: true,
                tone: 'ghost',
              },
            ]}
          />
        </article>
        <article
          className="ew-access-col"
          data-when="next"
          data-reveal
          style={{ '--d': '90ms' } as Vars}
        >
          <small>{access.next.label}</small>
          <h3>{access.next.title}</h3>
          <ul className="ew-access-list">
            {access.next.items.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          <p>{access.next.text}</p>
          <Actions
            items={[
              {
                label: access.next.follow,
                href: contactHref('work'),
                tone: 'ghost',
              },
              {
                label: access.next.releases,
                href: RELEASES_URL,
                external: true,
                tone: 'text',
              },
            ]}
          />
        </article>
        <article
          className="ew-access-col"
          data-when="later"
          data-reveal
          style={{ '--d': '180ms' } as Vars}
        >
          <small>{access.later.label}</small>
          <h3>{access.later.title}</h3>
          <ul className="ew-access-list ew-access-later">
            {access.later.items.map(([item, phase, link]) => (
              <li key={item}>
                {link ? (
                  <Link className="ew-access-link" href={productHref[link]}>
                    {item}
                    <ArrowRight size={13} aria-hidden="true" />
                  </Link>
                ) : (
                  <span>{item}</span>
                )}
                <PhaseTag phase={phase} />
              </li>
            ))}
          </ul>
        </article>
      </div>
    </section>
  );
}

/* ---------- 结尾 ---------- */

function Closing() {
  return (
    <section className="ew-closing" aria-labelledby="ew-closing-title">
      <h2 id="ew-closing-title" data-reveal>
        {closing.title.map((line) => (
          <span className="e2-phrase" key={line}>
            {line}
          </span>
        ))}
      </h2>
      <Actions
        items={[
          { label: hero.actions.github, href: GITHUB_URL, external: true },
          { label: closing.solutions, href: SOLUTIONS, tone: 'ghost' },
          { label: closing.home, href: HOME, tone: 'text' },
        ]}
      />
    </section>
  );
}

export default function E2WorkPage() {
  return (
    <E2Page
      current="work"
      className="ew"
      footer={
        <>
          <Closing />
          <NextProduct current="work" />
        </>
      }
    >
      <Hero />
      <Everywhere />
      <Platform />
      <Scenes />
      <Differences />
      <More />
      <Compare />
      <Bounds />
      <Access />
    </E2Page>
  );
}
