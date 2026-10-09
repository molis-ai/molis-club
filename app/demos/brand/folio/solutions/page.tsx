'use client';
import { Check, CheckCheck, Layers } from 'lucide-react';
import { folioSolutions as content } from '../../../../../content/folio';
import { Actions, Closing, SectionHead, pad } from '../kit';
import {
  Footer,
  SiteHeader,
  WORK,
  contactHref,
  useFolioMotion,
  type Vars,
} from '../shared';
import '../folio.css';
import '../kit.css';
import './solutions.css';

export default function FolioSolutionsPage() {
  const ref = useFolioMotion();
  return (
    <div className="fo-site fs-site" ref={ref}>
      <SiteHeader current="solutions" />
      <main id="main">
        <section
          id="cooperation"
          className="fs-cooperation"
          aria-labelledby="fs-title"
        >
          <div className="fs-shell">
            <header className="fs-intro">
              <div data-reveal>
                <span className="fo-kicker">合作如何开始</span>
                <h1 id="fs-title">
                  把 AI 用进<em>一段具体业务。</em>
                </h1>
              </div>
              <div
                className="fs-intro-side"
                data-reveal
                style={{ '--i': 1 } as Vars}
              >
                <p className="fs-intro-highlight">
                  先把一段工作跑通，再决定下一步。
                </p>
                <p>{content.lead}</p>
                <Actions
                  items={[{ label: '看看可以一起做什么', href: '#directions' }]}
                />
              </div>
            </header>
            <ol className="fs-steps" aria-label="合作的三个步骤">
              {content.stages.map((stage, index) => (
                <li
                  key={stage.title}
                  data-reveal
                  style={{ '--i': index } as Vars}
                >
                  <span className="fs-step-index" aria-hidden="true">
                    {pad(index)}
                  </span>
                  <h2>{stage.title}</h2>
                  <p>{stage.text}</p>
                  <div className="fs-step-result">
                    <CheckCheck size={20} aria-hidden="true" />
                    <strong>{stage.result}</strong>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </section>
        <section
          id="directions"
          className="fo-section fs-scenarios"
          data-bg="white"
          aria-labelledby="fs-directions-title"
        >
          <div className="fs-shell">
            <SectionHead
              id="fs-directions-title"
              kicker="可以一起做什么"
              title="从这三个场景开始。"
              lead="带着真实的资料、现有的工具和一个明确目标，选一段值得改进的工作，一起验证。"
              layout="split"
            />
            <div className="fs-scenario-grid">
              {content.directions.map((direction, index) => (
                <article
                  key={direction.id}
                  className={
                    'fs-direction fs-scenario fs-scenario-' + direction.id
                  }
                  aria-labelledby={'fs-' + direction.id + '-title'}
                  data-reveal
                  style={{ '--i': index } as Vars}
                >
                  <div className="fs-card-heading">
                    <div className="fs-card-label">
                      <span>{direction.name}</span>
                      <span className="fs-card-index" aria-hidden="true">
                        {pad(index)}
                      </span>
                    </div>
                    <h3 id={'fs-' + direction.id + '-title'}>
                      <span>{direction.headline[0]}</span>
                      <em>{direction.headline[1]}</em>
                    </h3>
                    <p className="fs-card-problem">
                      <small>现在卡在</small>
                      {direction.problem}
                    </p>
                  </div>
                  <div className="fs-card-body">
                    <div className="fs-process">
                      <h4>我们一起做</h4>
                      <ol>
                        {direction.process.map((step) => (
                          <li key={step}>{step}</li>
                        ))}
                      </ol>
                    </div>
                    <div className="fs-outcomes">
                      <h4>让这段工作留下</h4>
                      <ul>
                        {direction.outcomes.map((outcome) => (
                          <li key={outcome}>
                            <Check size={18} aria-hidden="true" />
                            <span>{outcome}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="fs-card-boundary">
                      <span className="fs-direction-status">
                        {direction.status}
                      </span>
                      <p>{direction.boundary}</p>
                    </div>
                  </div>
                </article>
              ))}
            </div>
            <aside
              className="fs-work-note"
              aria-labelledby="fs-work-title"
              data-reveal
            >
              <div className="fs-work-heading">
                <Layers size={26} aria-hidden="true" />
                <h3 id="fs-work-title">用 Molis Work 把这段工作接起来。</h3>
              </div>
              <div className="fs-work-content">
                <p className="fs-work-capabilities">
                  组织资料与目标 · 连接已有工具 · 关键判断由人确认
                </p>
                <p>
                  当前首先服务个人与小团队里的牵头人。团队空间、多设备同步仍在规划，具体业务接入范围在验证前共同确认。
                </p>
              </div>
              <Actions
                items={[
                  { label: '了解 Molis Work', href: WORK, tone: 'light' },
                ]}
              />
            </aside>
          </div>
        </section>
      </main>
      <Footer>
        <Closing
          id="fs-closing-title"
          title={['你最想改善的，', '是哪一段工作？']}
          actions={[
            { label: '聊聊企业合作', href: contactHref('enterprise') },
            { label: '先了解 Molis Work', href: WORK, tone: 'light' },
          ]}
        >
          <p className="fs-contact-hint">
            告诉我们现在怎么做、卡在哪里、希望得到什么结果。
            <br />
            一个具体问题，就足够开始。
          </p>
        </Closing>
      </Footer>
    </div>
  );
}
