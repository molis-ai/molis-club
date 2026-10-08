'use client';
import {
  ArrowRight,
  Check,
  CheckCheck,
  FileText,
  Layers,
  ShieldCheck,
  UserRound,
} from 'lucide-react';
import { folioSolutions as content } from '../../../../../content/folio';
import { Actions, Closing, ProductHero, SectionHead } from '../kit';
import { DemoPlayer, DemoWindow, Output, Reveal, Source } from '../demo';
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

function SolutionDemo({ index = 0 }: { index?: number }) {
  const direction = content.directions[index];
  const materials = [
    ['研究资料', '品牌表达', '选题依据'],
    ['业务目标', '已有接口', '原有权限'],
    ['指标口径', '数据来源', '业务知识'],
  ][index];
  const titles = [
    '一份可审阅的发布稿',
    '一项可核对的业务操作',
    '一份能追溯的分析草稿',
  ];
  const results = [
    [
      '选题：把开始使用变简单',
      '正文：从具体使用场景讲起',
      '依据：研究资料与产品说明',
    ],
    [
      '请求：核对一笔订单的状态',
      '能力：读取已有系统的订单信息',
      '边界：沿用当前账号的读取权限',
    ],
    [
      '问题：本周变化来自哪里',
      '分析：按既定指标口径对照',
      '依据：每项判断关联数据来源',
    ],
  ];
  return (
    <DemoPlayer
      label={direction.name + '业务流程示意'}
      steps={direction.process}
      tone={['red', 'blue', 'sage'][index]}
      note={`方案示意 · ${direction.status} · 非客户案例`}
    >
      {(step) => (
        <DemoWindow title={`一个具体场景 / ${direction.name}`} badge="流程示意">
          <div className="fs-workflow">
            <div className="fs-materials">
              <small>带入你的现有资料与规则</small>
              <div>
                {materials.map((m, i) => (
                  <span key={m} style={{ '--i': i } as Vars}>
                    <FileText size={15} />
                    {m}
                  </span>
                ))}
              </div>
            </div>
            <div className="fs-flow-rail" aria-hidden="true">
              <span />
              <i data-active={step > 0} />
              <span />
              <i data-active={step > 1} />
              <span />
            </div>
            <Output
              label={step < 3 ? '在 Molis Work 中推进' : '留给人做最后判断'}
            >
              <h4>{titles[index]}</h4>
              <div className="fs-result-lines">
                {results[index].map((line, i) => (
                  <Reveal key={line} show={step >= i}>
                    <p>
                      <Check size={13} />
                      {line}
                    </p>
                  </Reveal>
                ))}
              </div>
              <Source>
                {step === 3
                  ? '来源、操作记录与结果一起留下'
                  : '资料和结果，始终保留来处'}
              </Source>
            </Output>
            <div className="fs-human" data-active={step === 3}>
              <UserRound size={18} />
              <span>
                {step === 3 ? '先审阅，再决定下一步' : '关键判断由人确认'}
              </span>
              <ShieldCheck size={17} />
            </div>
          </div>
        </DemoWindow>
      )}
    </DemoPlayer>
  );
}

export default function FolioSolutionsPage() {
  const ref = useFolioMotion();
  return (
    <div className="fo-site fs-site" ref={ref}>
      <SiteHeader current="solutions" />
      <main id="main">
        <ProductHero
          id="fs-title"
          className="fs-hero"
          kicker="Molis AI · 和团队一起"
          title={content.title}
          lead={content.lead}
          masthead="Together"
          status={['从具体场景开始', '小范围验证', '结果可核对']}
          art={<SolutionDemo />}
          actions={[
            { label: '看看方案方向', href: '#directions' },
            {
              label: '带一个问题来聊',
              href: contactHref('enterprise'),
              tone: 'ghost',
            },
          ]}
        />
        <section
          className="fo-section fs-problems"
          data-bg="white"
          aria-labelledby="fs-problems-title"
        >
          <SectionHead
            id="fs-problems-title"
            kicker="从你正在经历的事开始"
            title="工具越来越多，工作里的断点还在。"
          />
          <div className="fs-problem-grid">
            {[
              {
                title: '资料散在各处',
                text: '找资料、复制上下文、解释背景，反复消耗人的注意力。',
              },
              {
                title: '产出接不进流程',
                text: 'AI 给出建议，后面的整理、确认和录入仍然要重新做。',
              },
              {
                title: '做完了，却难核对',
                text: '发生了什么、用了哪些依据、还要谁确认，缺少共同记录。',
              },
            ].map((p, i) => (
              <article key={p.title} data-reveal style={{ '--i': i } as Vars}>
                <span>0{i + 1}</span>
                <h3>{p.title}</h3>
                <p>{p.text}</p>
              </article>
            ))}
          </div>
        </section>
        <div id="directions">
          {content.directions.map((d, i) => (
            <section
              key={d.id}
              className="fo-section fs-direction"
              data-bg={['paper', 'yellow', 'sage'][i]}
              aria-labelledby={`fs-${d.id}-title`}
            >
              <div className="fd-editorial">
                <div className="fd-copy" data-reveal>
                  <span className="fs-direction-status">{d.status}</span>
                  <SectionHead
                    id={`fs-${d.id}-title`}
                    kicker={d.name}
                    title={d.title}
                  />
                  <p>{d.problem}</p>
                  <div className="fs-deliverable">
                    <small>希望留下什么</small>
                    <p>{d.output}</p>
                  </div>
                  <p className="fs-boundary">{d.boundary}</p>
                </div>
                <SolutionDemo index={i} />
              </div>
            </section>
          ))}
        </div>
        <section
          className="fo-section fs-platform"
          data-bg="navy"
          aria-labelledby="fs-platform-title"
        >
          <div className="fo-split">
            <SectionHead
              id="fs-platform-title"
              kicker="Molis Work 在其中做什么"
              title="让内容、能力和执行，留在同一份工作里。"
            />
            <div>
              <ul>
                {[
                  {
                    Icon: Layers,
                    title: '组织内容与目标',
                    text: '资料、文稿、待办与工作目标各有归处。决定和交付结果能够回查。',
                  },
                  {
                    Icon: ArrowRight,
                    title: '连接现有工具',
                    text: '通过适合当前场景的插件、能力和连接，接入已有资料或系统。',
                  },
                  {
                    Icon: ShieldCheck,
                    title: '保留人的判断',
                    text: '按调用方授权，关键操作先确认，需要时随时接手。',
                  },
                ].map(({ Icon, title, text }) => (
                  <li key={title}>
                    <Icon size={22} />
                    <div>
                      <h3>{title}</h3>
                      <p>{text}</p>
                    </div>
                  </li>
                ))}
              </ul>
              <Actions
                items={[
                  { label: '了解 Molis Work', href: WORK, tone: 'light' },
                ]}
              />
              <p className="fs-platform-note">
                Work
                当前首先服务个人与小团队里的牵头人。团队空间、多设备同步仍在规划，具体业务接入范围在验证前共同确认。
              </p>
            </div>
          </div>
        </section>
        <section
          className="fo-section fs-process"
          data-bg="white"
          aria-labelledby="fs-process-title"
        >
          <SectionHead
            id="fs-process-title"
            kicker="合作如何开始"
            title="先把一段工作跑通。"
            lead="不需要先有一份完整的 AI 规划。从你最想改善的一段流程开始。"
            layout="split"
          />
          <ol>
            {content.stages.map((s, i) => (
              <li key={s.title} data-reveal style={{ '--i': i } as Vars}>
                <span className="fs-step-index">0{i + 1}</span>
                <h3>{s.title}</h3>
                <p>{s.text}</p>
                <div>
                  <CheckCheck size={16} />
                  {s.result}
                </div>
              </li>
            ))}
          </ol>
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
