'use client';
import { Sparkles } from 'lucide-react';
import {
  GITHUB_URL,
  INSTALL_URL,
  RELEASES_URL,
  access,
  bounds,
  closing,
  compare,
  differences,
  everywhere,
  features,
  hero,
  more,
  phaseLabel,
  platform,
  scenes,
  scenesIntro,
  type Phase as PhaseId,
  type Scene,
} from '../../../../../content/folio-work';
import { Actions, Closing, ProductHero, SectionHead, pad } from '../kit';
import {
  Footer,
  HOME,
  SOLUTIONS,
  SiteHeader,
  contactHref,
  useFolioMotion,
  type Vars,
} from '../shared';
import { WorkDesk } from './desk';
import { ComposeDemo, ControlDemo, RelayDemo } from './scenes';
import '../folio.css';
import '../kit.css';
import './work.css';

// 首屏与 Tool 同一规格：左边说清是什么、给谁、解决什么，右边是贴着真实产品的动作。
// 正文顺序照产品介绍 V2 的建议：亮点 → 平台和插件 → 三个主场景 → 五点不同 → 更多场景 → 功能 → 比较与边界。

function Phase({ phase, note }: { phase: PhaseId; note?: string }) {
  return (
    <span className="fw-phase" data-phase={phase}>
      {note ?? phaseLabel[phase]}
    </span>
  );
}

const sceneDemo: Record<Scene['id'], () => React.JSX.Element> = {
  compose: ComposeDemo,
  relay: RelayDemo,
  control: ControlDemo,
};

/** 亮点：AI 出现在工作流程里需要的那一环，而不是一个聊天框 */
function Everywhere() {
  return (
    <section
      id="how"
      className="fo-section fw-everywhere"
      data-bg="white"
      aria-labelledby="fw-everywhere-title"
    >
      <header className="fo-head" data-layout="split" data-reveal>
        <div>
          <span className="fo-kicker">{everywhere.kicker}</span>
          <h2 id="fw-everywhere-title">
            {everywhere.title.map((line) => (
              <span className="fo-phrase" key={line}>
                {line}
              </span>
            ))}
          </h2>
        </div>
        <div className="fo-head-side">
          <p>{everywhere.lead}</p>
          <Phase phase={everywhere.phase} />
        </div>
      </header>

      <ul className="fw-modes">
        {everywhere.modes.map((mode, index) => (
          <li key={mode.verb} data-reveal style={{ '--i': index } as Vars}>
            <strong>{mode.verb}</strong>
            <p>{mode.text}</p>
          </li>
        ))}
      </ul>

      <div className="fw-flow" data-scene="enter">
        <span className="fw-flow-lane" data-lane="ai" aria-hidden="true">
          <Sparkles size={14} />
          AI
        </span>
        <span className="fw-flow-lane" data-lane="you" aria-hidden="true">
          {everywhere.youLabel}
        </span>
        <ol>
          {everywhere.flow.map((step, index) => (
            <li key={step.plugin} style={{ '--i': index } as Vars}>
              {step.ai ? (
                <span className="fw-flow-ai">
                  <b>{step.ai.verb}</b>
                  {step.ai.text}
                </span>
              ) : (
                <span className="fw-flow-gap" aria-hidden="true" />
              )}
              <span className="fw-flow-tile">
                <strong>{step.plugin}</strong>
                <small>{step.task}</small>
              </span>
              {step.you ? (
                <span className="fw-flow-you">
                  {everywhere.youLabel} · {step.you}
                </span>
              ) : (
                <span className="fw-flow-gap" aria-hidden="true" />
              )}
            </li>
          ))}
        </ol>
      </div>
      <p className="fw-aside" data-reveal>
        {everywhere.aside}
      </p>
    </section>
  );
}

/** 平台在下，插件在上，四个入口从同一个目录调用 */
function Platform() {
  const released = new Set(platform.released);
  return (
    <section
      className="fo-section fw-platform"
      data-bg="paper"
      aria-labelledby="fw-platform-title"
    >
      <div className="fo-split">
        <div className="fw-platform-copy">
          <header className="fo-head" data-reveal>
            <div>
              <span className="fo-kicker">{platform.kicker}</span>
              <h2 id="fw-platform-title">
                {platform.title.map((line) => (
                  <span className="fo-phrase" key={line}>
                    {line}
                  </span>
                ))}
              </h2>
            </div>
            <div className="fo-head-side">
              <p>{platform.lead}</p>
            </div>
          </header>
          <ol className="fo-list fw-principles">
            {platform.principles.map((item, index) => (
              <li key={item.title} data-reveal style={{ '--i': index } as Vars}>
                <span className="fo-index">{pad(index)}</span>
                <strong>{item.title}</strong>
                <p>{item.text}</p>
              </li>
            ))}
          </ol>
        </div>

        <figure
          className="fw-arch"
          data-reveal
          aria-label="Molis Work 的组成：页面、助理、工作流和外部 Agent 从同一个能力目录调用；中间是项目插件和个人插件；下面是平台和本机的 Home。"
        >
          <div className="fw-arch-callers">
            {platform.callers.map((caller, index) => (
              <span key={caller} style={{ '--i': index } as Vars}>
                {caller}
              </span>
            ))}
            <small>{platform.callersNote}</small>
          </div>
          <div className="fw-arch-catalog">{platform.catalog}</div>
          <div className="fw-arch-plugins">
            <div>
              <small>{platform.projectLabel}</small>
              <ul>
                {platform.project.map((name, index) => (
                  <li
                    key={name}
                    data-released={released.has(name) || undefined}
                    style={{ '--i': index } as Vars}
                  >
                    {name}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <small>{platform.personalLabel}</small>
              <ul>
                {platform.personal.map((name, index) => (
                  <li
                    key={name}
                    data-released={released.has(name) || undefined}
                    style={{ '--i': index + 11 } as Vars}
                  >
                    {name}
                  </li>
                ))}
                <li className="fw-arch-yours" style={{ '--i': 26 } as Vars}>
                  + {platform.yours}
                </li>
              </ul>
            </div>
          </div>
          <div className="fw-arch-layers">
            {platform.layers.map((layer) => (
              <span key={layer}>{layer}</span>
            ))}
          </div>
          <div className="fw-arch-base">{platform.base}</div>
          <figcaption>{platform.count}</figcaption>
        </figure>
      </div>
    </section>
  );
}

function SceneBlock({ scene, index }: { scene: Scene; index: number }) {
  const Demo = sceneDemo[scene.id];
  return (
    <article
      id={scene.id}
      className="fw-scene"
      data-side={index % 2 ? 'right' : 'left'}
      aria-labelledby={`fw-scene-${scene.id}`}
    >
      <div className="fw-scene-copy" data-reveal>
        <span className="fw-scene-number" aria-hidden="true">
          {pad(index)}
        </span>
        <Phase phase={scene.phase} note={scene.phaseNote} />
        <h3 id={`fw-scene-${scene.id}`}>
          {scene.title.map((line) => (
            <span className="fo-phrase" key={line}>
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
      <Demo />
    </article>
  );
}

export default function FolioWorkPage() {
  const rootRef = useFolioMotion();
  return (
    <div className="fo-site fw-site" ref={rootRef}>
      <SiteHeader current="work" />

      <main id="main">
        <ProductHero
          id="fw-title"
          className="fw-hero"
          kicker={hero.kicker}
          title={hero.title}
          lead={hero.lead}
          extra={
            <p className="fw-agents">
              <span>{hero.agentsLabel}</span>
              {hero.agents.map((agent) => (
                <b key={agent}>{agent}</b>
              ))}
              <span>{hero.agentsMore}</span>
            </p>
          }
          status={hero.status}
          actions={[
            { label: hero.actions.how, href: '#how' },
            {
              label: hero.actions.github,
              href: GITHUB_URL,
              external: true,
              tone: 'ghost',
            },
          ]}
          masthead="Work"
          art={<WorkDesk />}
        />

        <Everywhere />
        <Platform />

        <section
          className="fo-section fw-scenes"
          data-bg="white"
          aria-labelledby="fw-scenes-title"
        >
          <SectionHead
            id="fw-scenes-title"
            kicker={scenesIntro.kicker}
            title={scenesIntro.title}
          />
          {scenes.map((scene, index) => (
            <SceneBlock key={scene.id} scene={scene} index={index} />
          ))}
        </section>

        <section
          className="fo-section"
          data-bg="navy"
          aria-labelledby="fw-diff-title"
        >
          <div className="fo-split">
            <SectionHead
              id="fw-diff-title"
              kicker={differences.kicker}
              title={differences.title}
            />
            <ol className="fo-list fw-diff">
              {differences.items.map((item, index) => (
                <li
                  key={item.title}
                  data-reveal
                  style={{ '--i': index } as Vars}
                >
                  <span className="fo-index">{pad(index)}</span>
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

        <section
          className="fo-section fw-more"
          data-bg="paper"
          aria-labelledby="fw-more-title"
        >
          <SectionHead
            id="fw-more-title"
            kicker={more.kicker}
            title={more.title}
          />
          <ul className="fw-more-cards">
            {more.items.map((item, index) => (
              <li
                key={item.title}
                data-reveal
                style={{ '--i': index % 3 } as Vars}
              >
                <span className="fo-index">{pad(index + 3)}</span>
                <h3>{item.title}</h3>
                <p className="fw-more-pain">{item.pain}</p>
                <p>{item.text}</p>
                <Phase phase={item.phase} note={item.phaseNote} />
              </li>
            ))}
          </ul>
        </section>

        <section
          className="fo-section fw-features"
          data-bg="white"
          aria-labelledby="fw-features-title"
        >
          <SectionHead
            id="fw-features-title"
            kicker={features.kicker}
            title={features.title}
            lead={features.lead}
            layout="split"
          >
            <ul className="fw-legend" aria-label="状态说明">
              {(['released', 'next', 'preview', 'planned'] as const).map(
                (phase) => (
                  <li key={phase} data-phase={phase}>
                    {phaseLabel[phase]}
                  </li>
                ),
              )}
            </ul>
          </SectionHead>
          <div className="fw-feature-groups">
            {features.groups.map((group) => (
              <section key={group.name} aria-label={group.name}>
                <h3>
                  {group.name}
                  <small>{group.items.length}</small>
                </h3>
                <ul>
                  {group.items.map(([name, line, phase]) => (
                    <li key={name} data-phase={phase}>
                      <strong>{name}</strong>
                      <span>{line}</span>
                    </li>
                  ))}
                </ul>
              </section>
            ))}
          </div>
        </section>

        <section
          className="fo-section fw-compare"
          data-bg="paper"
          aria-labelledby="fw-compare-title"
        >
          <SectionHead
            id="fw-compare-title"
            kicker={compare.kicker}
            title={compare.title}
          />
          <table className="fw-compare-table">
            <thead>
              <tr>
                <th scope="col">{compare.labels.now}</th>
                <th scope="col">{compare.labels.here}</th>
                <th scope="col">{compare.labels.gap}</th>
              </tr>
            </thead>
            <tbody>
              {compare.rows.map((row, index) => (
                <tr key={row.now} data-reveal style={{ '--i': index } as Vars}>
                  <th scope="row">{row.now}</th>
                  <td data-label={compare.labels.here}>{row.here}</td>
                  <td data-label={compare.labels.gap}>{row.gap}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        <section
          className="fo-section fw-bounds"
          data-bg="sage"
          aria-labelledby="fw-bounds-title"
        >
          <div className="fo-split">
            <SectionHead
              id="fw-bounds-title"
              kicker={bounds.kicker}
              title={bounds.title}
            />
            <ul className="fw-bounds-list">
              {bounds.items.map((item, index) => (
                <li key={item} data-reveal style={{ '--i': index } as Vars}>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section
          id="get"
          className="fo-section fw-access"
          data-bg="white"
          aria-labelledby="fw-access-title"
        >
          <SectionHead
            id="fw-access-title"
            kicker={access.kicker}
            title={access.title}
          />
          <div className="fw-access-cards">
            <article data-reveal>
              <small>{access.now.label}</small>
              <h3>{access.now.title}</h3>
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
            <article data-reveal style={{ '--i': 1 } as Vars}>
              <small>{access.next.label}</small>
              <h3>{access.next.title}</h3>
              <p>{access.next.text}</p>
              <Actions
                items={[
                  {
                    label: access.next.follow,
                    href: contactHref('work'),
                    tone: 'light',
                  },
                  {
                    label: access.next.releases,
                    href: RELEASES_URL,
                    external: true,
                    tone: 'light',
                  },
                ]}
              />
            </article>
          </div>
        </section>
      </main>

      <Footer>
        <Closing
          id="fw-closing-title"
          title={closing.title}
          actions={[
            { label: hero.actions.github, href: GITHUB_URL, external: true },
            { label: closing.solutions, href: SOLUTIONS, tone: 'light' },
            { label: closing.home, href: HOME, tone: 'light' },
          ]}
        />
      </Footer>
    </div>
  );
}
