'use client';
import { useState } from 'react';
import { Check, ChevronDown, FileText, Layers, Sparkles } from 'lucide-react';
import {
  GITHUB_URL,
  INSTALL_URL,
  MAC_DOWNLOAD_URL,
  RELEASES_URL,
  agentLine,
  comparisons,
  differences,
  featureGroups,
  localFirst,
  moreScenarios,
  scenarios,
  type Status as Availability,
} from '../../../../../content/molis-work';
import { folioWork } from '../../../../../content/folio';
import { Actions, Closing, Phrases, ProductHero, SectionHead } from '../kit';
import {
  Footer,
  SiteHeader,
  SOLUTIONS,
  contactHref,
  useFolioMotion,
  type Vars,
} from '../shared';
import { WorkDemo, type WorkMode } from './demos';
import '../folio.css';
import '../kit.css';
import './work.css';

function Phase({ status }: { status: Availability }) {
  return (
    <span className="fw-phase" data-status={status}>
      {folioWork.status[status]}
    </span>
  );
}

function MoreWork() {
  const [active, setActive] = useState(0);
  const scene = moreScenarios[active];
  return (
    <>
      <fieldset className="fd-tabs" aria-label="选择更多 Work 场景">
        {moreScenarios.map((s, i) => (
          <button
            type="button"
            key={s.id}
            aria-pressed={active === i}
            onClick={() => setActive(i)}
          >
            {s.label}
          </button>
        ))}
      </fieldset>
      <div className="fd-editorial">
        <div className="fd-copy">
          <Phase status={scene.status === 'released' ? 'next' : scene.status} />
          <h3 className="fw-secondary-title">
            <Phrases text={scene.title} />
          </h3>
          <p>{scene.problem}</p>
          <ul className="fd-copy-list">
            {scene.points.map((p) => (
              <li key={p.text}>{p.text}</li>
            ))}
          </ul>
        </div>
        <WorkDemo key={scene.id} mode={scene.id as WorkMode} />
      </div>
    </>
  );
}

export default function FolioWorkPage() {
  const ref = useFolioMotion();
  return (
    <div className="fo-site fw-site" ref={ref}>
      <SiteHeader current="work" />
      <main id="main">
        <ProductHero
          id="fw-title"
          className="fw-hero"
          kicker="Molis Work · 本地优先的 AI 工作台"
          title={folioWork.title}
          lead={folioWork.lead}
          status={['macOS', 'MIT 开源', '新版开发中']}
          masthead="Work"
          art={<WorkDemo compact />}
          actions={[
            { label: '看它如何工作', href: '#scenarios' },
            {
              label: MAC_DOWNLOAD_URL ? '下载 macOS 版' : '查看开源版本',
              href: MAC_DOWNLOAD_URL ?? GITHUB_URL,
              external: true,
              tone: 'ghost',
            },
          ]}
        />
        <section
          className="fo-section fw-platform"
          data-bg="white"
          aria-labelledby="fw-platform-title"
        >
          <SectionHead
            id="fw-platform-title"
            kicker="工作台，而后是每一种可能"
            title={folioWork.platform}
            lead={folioWork.platformLead}
            layout="split"
          />
          <div className="fw-platform-strip" data-reveal>
            {[
              { icon: Layers, title: 'Goals', text: '要做成什么，有据可查' },
              {
                icon: FileText,
                title: '内容与工具',
                text: '资料、文稿、待办、代码',
              },
              {
                icon: Sparkles,
                title: '人与 AI',
                text: '使用同一份内容与能力',
              },
            ].map(({ icon: Icon, title, text }, i) => (
              <div key={title}>
                <span>0{i + 1}</span>
                <Icon size={23} />
                <strong>{title}</strong>
                <p>{text}</p>
              </div>
            ))}
          </div>
          <p className="fw-agent-line">{agentLine}</p>
          <p className="fw-release-note">{folioWork.availability}</p>
        </section>
        <div id="scenarios">
          {scenarios.map((scene, i) => (
            <section
              key={scene.id}
              className="fo-section fw-main-scene"
              data-bg={['paper', 'yellow', 'white'][i]}
              aria-labelledby={`fw-${scene.id}-title`}
            >
              <div className="fd-editorial">
                <div className="fd-copy" data-reveal>
                  <span className="fw-chapter">
                    0{i + 1} / {scene.label}
                  </span>
                  <SectionHead
                    id={`fw-${scene.id}-title`}
                    kicker={
                      ['跨工具接续', '共同的能力与授权', '就在工作旁边'][i]
                    }
                    title={scene.title}
                  />
                  <Phase status={scene.status} />
                  <p className="fw-problem">{scene.problem}</p>
                  <ul className="fd-copy-list">
                    {scene.points.map((p) => (
                      <li key={p.text}>
                        <span>
                          {p.text}
                          {p.status && <Phase status={p.status} />}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
                <WorkDemo mode={scene.id as WorkMode} />
              </div>
            </section>
          ))}
        </div>
        <section
          className="fo-section fw-differences"
          data-bg="navy"
          aria-labelledby="fw-differences-title"
        >
          <SectionHead
            id="fw-differences-title"
            kicker="四件事，守同一套规则"
            title="工具可以长出来，工作不用重来。"
          />
          <div className="fw-difference-grid">
            {differences.map((d, i) => (
              <article
                key={d.title}
                data-reveal
                style={{ '--i': i % 2 } as Vars}
              >
                <span className="fw-difference-number">0{i + 1}</span>
                <Phase status={d.status} />
                <h3>{d.title}</h3>
                <p>{d.body}</p>
                <div className="fw-proof-line">
                  <Check size={14} />
                  {
                    [
                      '按要求核对结果，留下收尾依据',
                      '一处授权，每次调用有记录',
                      '做好的插件，进入你的现有工作',
                      '提示词、角色与记忆可查看和修改',
                    ][i]
                  }
                </div>
              </article>
            ))}
          </div>
        </section>
        <section
          className="fo-section"
          data-bg="paper"
          aria-labelledby="fw-more-title"
        >
          <SectionHead
            id="fw-more-title"
            kicker="再多做一点"
            title="从收到信息，到做出自己的工具。"
          />
          <div className="fw-more">
            <MoreWork />
          </div>
        </section>
        <section
          className="fo-section fw-features"
          data-bg="white"
          id="features"
          aria-labelledby="fw-features-title"
        >
          <SectionHead
            id="fw-features-title"
            kicker="功能全景"
            title="找到你需要的那一种能力。"
            lead="按你要做的事查看。每项能力的阶段都写在旁边。"
            layout="split"
          />
          <div className="fw-feature-groups">
            {featureGroups.map((group, i) => (
              <details key={group.name} open={i === 0}>
                <summary>
                  <span>0{i + 1}</span>
                  <h3>{group.name}</h3>
                  <small>{group.features.length} 项能力</small>
                  <ChevronDown size={20} />
                </summary>
                <ul>
                  {group.features.map((f) => (
                    <li key={f.name}>
                      <strong>{f.name}</strong>
                      <p>{f.line}</p>
                      <Phase status={f.status} />
                    </li>
                  ))}
                </ul>
              </details>
            ))}
          </div>
        </section>
        <section
          className="fo-section fw-comparisons"
          data-bg="paper"
          aria-labelledby="fw-compare-title"
        >
          <SectionHead
            id="fw-compare-title"
            kicker="和你现在的做法放在一起看"
            title="保留顺手的工具，把工作接起来。"
          />
          <div className="fw-compare-list">
            {comparisons.map((c) => (
              <details key={c.now}>
                <summary>
                  <span>{c.now}</span>
                  <ChevronDown size={18} />
                </summary>
                <div>
                  <p>{c.here}</p>
                  <p className="fw-gap">目前的边界：{c.gap}</p>
                </div>
              </details>
            ))}
          </div>
        </section>
        <section
          className="fo-section fw-local"
          data-bg="sage"
          id="local"
          aria-labelledby="fw-local-title"
        >
          <div className="fo-split">
            <SectionHead
              id="fw-local-title"
              kicker={localFirst.kicker}
              title={localFirst.title}
            />
            <ul>
              {localFirst.points.map((p) => (
                <li key={p}>
                  <Check size={17} />
                  <p>{p}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>
        <section
          className="fo-section fw-start"
          data-bg="white"
          id="start"
          aria-labelledby="fw-start-title"
        >
          <SectionHead
            id="fw-start-title"
            kicker="找到合适的开始"
            title="现在使用，或一起等下一版。"
          />
          <div className="fw-start-paths">
            <article>
              <small>当前公开版本 / v0.2.0</small>
              <h3>从开源版本开始</h3>
              <p>
                Goals、Work、Feed
                与基础成果能力。当前需要从源码安装；签名安装包就绪后会提供下载。
              </p>
              <Actions
                items={[
                  { label: '查看安装步骤', href: INSTALL_URL, external: true },
                ]}
              />
            </article>
            <article>
              <small>新版 / 开发中</small>
              <h3>关注完整工作台</h3>
              <p>
                助理、统一能力、插件创作和新版成果库等能力尚未发布。查看更新，或留下你最关心的使用场景。
              </p>
              <Actions
                items={[
                  {
                    label: '查看版本更新',
                    href: RELEASES_URL,
                    external: true,
                    tone: 'ghost',
                  },
                  {
                    label: '关注进展',
                    href: contactHref('work'),
                    tone: 'ghost',
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
          title={['工具可以不断长出来，', '工作不必一次次重来。']}
          actions={[
            { label: '查看开源项目', href: GITHUB_URL, external: true },
            { label: '了解团队解决方案', href: SOLUTIONS, tone: 'light' },
          ]}
        />
        <p className="fw-footer-note">
          当前面向个人与小团队里牵头的人。团队空间与多设备同步仍在规划。
        </p>
      </Footer>
    </div>
  );
}
