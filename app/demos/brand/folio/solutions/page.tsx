'use client';
import Link from 'next/link';
import { ArrowUpRight, Check } from 'lucide-react';
import { folioCooperation as content } from '../../../../../content/folio-cooperation';
import { Actions, Closing, SectionHead, pad } from '../kit';
import {
  ABOUT,
  Footer,
  SiteHeader,
  WORK,
  contactHref,
  useFolioMotion,
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
              <div>
                <span className="fo-kicker">和 Molis 一起做</span>
                <h1 id="fs-title">
                  {content.title.map((line) => (
                    <span className="fo-phrase" key={line}>
                      {line}
                    </span>
                  ))}
                </h1>
                <p className="fs-lead">{content.lead}</p>
                <Actions
                  items={[
                    {
                      label: '聊聊你的业务问题',
                      href: contactHref('enterprise'),
                    },
                    {
                      label: '看看我们怎么做',
                      href: '#directions',
                      tone: 'ghost',
                    },
                  ]}
                />
              </div>
              <div
                className="fs-handoff-art"
                aria-label="合作方式示意：从业务问题到可运行流程，再由团队接手"
              >
                <span className="fo-tape fo-tape-a" aria-hidden="true" />
                <p className="fs-art-caption">一件真实的工作</p>
                <div className="fs-art-question">
                  <small>一起说清楚</small>
                  <strong>
                    要什么？
                    <br />
                    怎样才算做好？
                  </strong>
                </div>
                <div className="fs-art-flow">
                  <span>业务经验</span>
                  <b>＋</b>
                  <span>Agent 执行</span>
                </div>
                <div className="fs-art-receipt">
                  <Check size={22} aria-hidden="true" />
                  <div>
                    <strong>团队亲手跑通、亲自验收</strong>
                    <p>留下流程、材料与使用方法</p>
                  </div>
                </div>
                <p className="fs-art-note">交付之后，还能继续往前。</p>
              </div>
            </header>
          </div>
        </section>
        <section
          id="directions"
          className="fo-section"
          data-bg="white"
          aria-labelledby="fs-directions-title"
        >
          <div className="fs-shell">
            <SectionHead
              id="fs-directions-title"
              kicker="我们能一起做的事"
              title="从业务问题，到团队自己的能力。"
              lead="我们采用贴近业务现场的共建方式（FDE）。和实际使用的人一起，把目标、材料、执行和检查，一步步接起来。"
              layout="split"
            />
            <div className="fs-services">
              {content.services.map((service, index) => (
                <article
                  key={service.id}
                  className={`fs-service fs-service-${service.tone}`}
                  aria-labelledby={`fs-${service.id}-title`}
                >
                  <span className="fo-index" aria-hidden="true">
                    {pad(index)}
                  </span>
                  <div className="fs-service-heading">
                    <h3 id={`fs-${service.id}-title`}>{service.title}</h3>
                    <p>{service.situation}</p>
                  </div>
                  <div className="fs-service-body">
                    <p>{service.action}</p>
                    <div className="fs-service-result">
                      <small>一起做到</small>
                      <p>{service.result}</p>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
        <section
          className="fo-section"
          data-bg="paper"
          aria-labelledby="fs-start-title"
        >
          <div className="fs-shell">
            <SectionHead
              id="fs-start-title"
              kicker="从你手边的一件事开始"
              title="先挑一个结果能检查的问题。"
              lead="可以从这些任务类型开始讨论，再用你们的实际材料确认范围。"
            />
            <div className="fs-starting-points">
              {content.startingPoints.map((item) => (
                <article key={item.title}>
                  <h3>{item.title}</h3>
                  <p>{item.text}</p>
                </article>
              ))}
            </div>
            <aside className="fs-principle">
              <strong>执行交给 Agent，关键判断留给人。</strong>
              <p>
                付款、发布、报价、权限与重要业务决定，由你们确认。我们一起约定可执行的范围、检查的方法，以及出错时谁来接手。
              </p>
            </aside>
            <div className="fs-product-note">
              <p>
                从现有工具和业务流程出发，选择合适的实现方式。我们也在把人与
                Agent 共事的方法做进 Molis Work。
              </p>
              <Link href={WORK}>
                看看我们的工作台 <ArrowUpRight size={18} aria-hidden="true" />
              </Link>
            </div>
          </div>
        </section>
        <section
          className="fo-section fs-begin"
          data-bg="yellow"
          aria-labelledby="fs-begin-title"
        >
          <div className="fs-shell">
            <SectionHead
              id="fs-begin-title"
              kicker="合作如何开始"
              title="合作，从一次具体的交谈开始。"
            />
            <ol className="fs-steps">
              {content.stages.map((stage, index) => (
                <li key={stage.title}>
                  <span className="fo-index" aria-hidden="true">
                    {pad(index)}
                  </span>
                  <h3>{stage.title}</h3>
                  <p>{stage.text}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>
      </main>
      <Footer>
        <Closing
          id="fs-closing-title"
          title={['你们的下一段工作，', '我们一起看看。']}
          actions={[
            { label: '聊聊企业合作', href: contactHref('enterprise') },
            { label: '认识团队', href: ABOUT, tone: 'light' },
          ]}
        >
          <p className="fs-contact-hint">
            带上现在的做法、遇到的困难，或者一份还不够满意的结果。
          </p>
        </Closing>
      </Footer>
    </div>
  );
}
