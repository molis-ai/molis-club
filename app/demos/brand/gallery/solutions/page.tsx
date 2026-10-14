'use client';
import { Check } from 'lucide-react';
import { folioCooperation as content } from '../../../../../content/folio-cooperation';
import { Btn, More, Phrases, Plate, Shell, type Vars } from '../kit';
import { ABOUT, WORK, contactHref } from '../routes';
import './solutions.css';

// 企业合作：委托项目（Commissions）。安静、清楚，像一份委托书。
// 首屏 → 我们能一起做的事（四步是一面工作墙，滚动时一束射灯从一步移到下一步；窄屏与减少动态时依次排开）→
// 做这件事的人（A8：只用成员个人过去的经历，墙上一列列展签）→ 从手边的一件事开始 → 合作如何开始 → 结尾。
// 没有客户案例、客户 logo 或效果数字。

const pad = (index: number) => String(index + 1).padStart(2, '0');

/** 首屏右边的委托书：从业务问题到可运行流程，再由团队接手（文字与 Folio 首屏示意相同） */
function Brief() {
  return (
    <figure className="g-sol-brief">
      <figcaption className="sr-only">
        合作方式示意：从业务问题到可运行流程，再由团队接手
      </figcaption>
      <div className="g-sol-brief-sheet">
        <p className="g-sol-brief-head">
          <span className="g-soft" lang="en" aria-hidden="true">
            Commission
          </span>
          <span>一件真实的工作</span>
        </p>
        <div
          className="g-sol-brief-row g-sol-brief-question"
          data-reveal
          style={{ '--delay': '200ms' } as Vars}
        >
          <small>一起说清楚</small>
          <strong>
            <span>要什么？</span>
            <span>怎样才算做好？</span>
          </strong>
        </div>
        <div
          className="g-sol-brief-row g-sol-brief-flow"
          data-reveal
          style={{ '--delay': '340ms' } as Vars}
        >
          <span>业务经验</span>
          <b>＋</b>
          <span>Agent 执行</span>
        </div>
        <div
          className="g-sol-brief-row g-sol-brief-receipt"
          data-reveal
          style={{ '--delay': '480ms' } as Vars}
        >
          <i>
            <Check size={18} strokeWidth={2.4} />
          </i>
          <div>
            <strong>团队亲手跑通、亲自验收</strong>
            <p>留下流程、材料与使用方法</p>
          </div>
        </div>
        <p
          className="g-sol-brief-note"
          data-reveal
          style={{ '--delay': '620ms' } as Vars}
        >
          交付之后，还能继续往前。
        </p>
      </div>
    </figure>
  );
}

/** 四步工作墙：宽屏时粘在视口里，射灯随滚动从一步移到下一步；窄屏与减少动态时依次排开、全部亮着 */
function ProcessWall() {
  return (
    <section
      className="g-sol-process"
      data-scene="pin"
      data-steps={content.services.length}
      aria-label="四段服务"
    >
      <div className="g-sol-process-stage">
        <div className="g-sol-wall">
          <span className="g-sol-rail" aria-hidden="true">
            {content.services.map((service) => (
              <i key={service.id} />
            ))}
          </span>
          <span className="g-sol-beam" aria-hidden="true" />
          <ol className="g-sol-panels">
            {content.services.map((service, index) => (
              <li
                key={service.id}
                className="g-sol-panel"
                data-reveal
                aria-labelledby={`g-sol-${service.id}-title`}
              >
                <p className="g-sol-panel-no" aria-hidden="true">
                  <span className="g-soft" lang="en">
                    {pad(index)}
                  </span>
                  <i />
                </p>
                <h3 id={`g-sol-${service.id}-title`}>{service.title}</h3>
                <p className="g-sol-panel-situation">{service.situation}</p>
                <p className="g-sol-panel-action">{service.action}</p>
                <div className="g-sol-panel-result">
                  <small>一起做到</small>
                  <p>{service.result}</p>
                </div>
              </li>
            ))}
          </ol>
          <p className="g-sol-progress" aria-hidden="true">
            <span className="g-sol-progress-bar">
              <i />
            </span>
            {content.services.map((service, index) => (
              <span key={service.id} className="g-soft" lang="en">
                {pad(index)}
              </span>
            ))}
          </p>
        </div>
      </div>
    </section>
  );
}

/** 做这件事的人（A8）：每一步下面挂着相关成员的展签，只写成员个人过去的经历 */
function People() {
  const { people } = content;
  return (
    <section
      id="people"
      className="g-sol-people"
      aria-labelledby="g-sol-people-title"
    >
      <div className="g-wrap">
        <Plate
          id="g-sol-people-title"
          index="People"
          kicker={people.kicker}
          title={<Phrases text={people.title} />}
          side={<p>{people.lead}</p>}
        />
      </div>
      <div className="g-sol-people-wall">
        <ol className="g-sol-people-cols">
          {people.steps.map((step, index) => {
            const service = content.services.find(
              (item) => item.id === step.service,
            )!;
            return (
              <li
                key={step.service}
                className="g-sol-people-col"
                data-reveal
                style={{ '--delay': `${index * 90}ms` } as Vars}
              >
                <p className="g-sol-people-step">
                  <span className="g-soft" lang="en" aria-hidden="true">
                    {pad(index)}
                  </span>
                </p>
                <h3>{service.title}</h3>
                <ul className="g-sol-labels">
                  {step.evidence.map((item) => (
                    <li key={item.name} className="g-sol-label">
                      <strong>{item.name}</strong>
                      <p>{item.quotes.join('，')}。</p>
                    </li>
                  ))}
                </ul>
              </li>
            );
          })}
        </ol>
      </div>
      <div className="g-wrap g-sol-people-more" data-reveal>
        <Btn href={ABOUT} tone="ghost">
          {people.team}
        </Btn>
      </div>
    </section>
  );
}

/** 从你手边的一件事开始：三类任务、一条原则、一句关于 Molis Work 的说明 */
function Starting() {
  return (
    <section className="g-sol-start" aria-labelledby="g-sol-start-title">
      <div className="g-wrap">
        <Plate
          id="g-sol-start-title"
          index="Start"
          kicker="从你手边的一件事开始"
          title={<Phrases text="先挑一个结果能检查的问题。" />}
          side={<p>可以从这些任务类型开始讨论，再用你们的实际材料确认范围。</p>}
        />
        <ul className="g-sol-start-list">
          {content.startingPoints.map((item, index) => (
            <li
              key={item.title}
              data-reveal
              style={{ '--delay': `${index * 90}ms` } as Vars}
            >
              <span className="g-sol-start-mark" aria-hidden="true" />
              <h3>{item.title}</h3>
              <p>{item.text}</p>
            </li>
          ))}
        </ul>
        <aside className="g-sol-principle" data-reveal>
          <i aria-hidden="true" />
          <strong>
            <Phrases text="执行交给 Agent，关键判断留给人。" />
          </strong>
          <p>
            付款、发布、报价、权限与重要业务决定，由你们确认。我们一起约定可执行的范围、检查的方法，以及出错时谁来接手。
          </p>
        </aside>
        <div className="g-sol-product" data-reveal>
          <p>
            从现有工具和业务流程出发，选择合适的实现方式。我们也在把人与 Agent
            共事的方法做进{' '}
            <span className="g-sol-name" lang="en">
              Molis Work
            </span>
            。
          </p>
          <More href={WORK}>看看我们的工作台</More>
        </div>
      </div>
    </section>
  );
}

/** 合作如何开始：一条线从左往右画过去，三个站点依次亮起 */
function Stages() {
  return (
    <section className="g-sol-begin" aria-labelledby="g-sol-begin-title">
      <div className="g-wrap">
        <Plate
          id="g-sol-begin-title"
          index="Begin"
          kicker="合作如何开始"
          title={<Phrases text="合作，从一次具体的交谈开始。" />}
        />
        <div className="g-sol-route" data-scene="enter">
          <span className="g-sol-route-line" aria-hidden="true">
            <i />
          </span>
          <ol className="g-sol-stages">
            {content.stages.map((stage, index) => (
              <li
                key={stage.title}
                style={{ '--i': index } as Vars}
                data-reveal
              >
                <span className="g-sol-stop" aria-hidden="true" />
                <span className="g-soft" lang="en" aria-hidden="true">
                  {pad(index)}
                </span>
                <h3>{stage.title}</h3>
                <p>{stage.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}

/** 结尾：一面墙上的两行字，只有一个去处 */
function Ending() {
  return (
    <section className="g-sol-closing" aria-labelledby="g-sol-closing-title">
      <h2 id="g-sol-closing-title" data-reveal>
        <span className="g-phrase">你们的下一段工作，</span>
        <span className="g-phrase">我们一起看看。</span>
      </h2>
      <div className="g-sol-closing-row" data-reveal>
        <p>带上现在的做法、遇到的困难，或者一份还不够满意的结果。</p>
        <Btn href={contactHref('enterprise')}>聊聊企业合作</Btn>
      </div>
    </section>
  );
}

export default function GallerySolutionsPage() {
  return (
    <Shell current="solutions" className="g-sol-page" ending={<Ending />}>
      <section
        id="cooperation"
        className="g-sol-hero"
        aria-labelledby="g-sol-title"
      >
        <div className="g-sol-hero-copy">
          <p className="g-sol-kicker" data-reveal>
            <span className="g-soft" lang="en" aria-hidden="true">
              Commissions
            </span>
            <span>和 Molis 一起做</span>
          </p>
          <h1
            id="g-sol-title"
            className="g-sol-title"
            data-reveal
            style={{ '--delay': '80ms' } as Vars}
          >
            {content.title.map((line) => (
              <span className="g-phrase" key={line}>
                {line}
              </span>
            ))}
          </h1>
          <p
            className="g-sol-lead"
            data-reveal
            style={{ '--delay': '160ms' } as Vars}
          >
            {content.lead}
          </p>
          <div
            className="g-actions g-sol-hero-actions"
            data-reveal
            style={{ '--delay': '240ms' } as Vars}
          >
            <Btn href={contactHref('enterprise')}>聊聊你的业务问题</Btn>
            <Btn href="#directions" tone="ghost">
              看看我们怎么做
            </Btn>
          </div>
        </div>
        <Brief />
      </section>

      <section
        id="directions"
        className="g-sol-directions"
        aria-labelledby="g-sol-directions-title"
      >
        <div className="g-wrap">
          <Plate
            id="g-sol-directions-title"
            index="Services"
            kicker="我们能一起做的事"
            title={<Phrases text="从业务问题，到团队自己的能力。" />}
            side={
              <p>
                我们采用贴近业务现场的共建方式（FDE）。和实际使用的人一起，把目标、材料、执行和检查，一步步接起来。
              </p>
            }
          />
        </div>
        <ProcessWall />
      </section>

      <People />
      <Starting />
      <Stages />
    </Shell>
  );
}
