import { ArrowRight, ArrowUpRight } from 'lucide-react';
import Link from 'next/link';
import type { ReactNode } from 'react';
import { pageMetadata } from '../../../lib/site';
import { products, WORK_BUILD, WORK_GITHUB } from '../../../content/site/products';
import { workCases, workEnd, workHero, workTour, workWhy } from '../../../content/site/work';
import { contactHref, productHref } from '../../_site/routes';
import { Btn, Phrases, Status, type Vars } from '../../_site/ui';
import { Ring } from './app';
import { Cases } from './cases';
import { Why } from './why';
import { HeroStage, Opening, Tour } from './stages';
import '../../_site/product/product.css';
import './work.css';

const work = products.work;

export const metadata = pageMetadata(
  `${work.name} · ${workHero.title}`,
  workHero.what,
  productHref.work,
);

// Molis Work（2026-10-24 重做，目标、取舍与验收见 specs/work-product-page/spec.md；2026-10-31 按 A 台面升级，见 redesign.md）。
// 一句话：工作，不止于 AI 对话。
// 前四屏每屏一块大圆角台面，窗口放在台面上，字在台面外的纸上；所有产品演示都是深色皮。
// 首屏（上面一行字，下面一块照片台面：湖面晨雾，周一早上的项目首页放在上面，终端压在窗口左边）
// → 全景（往下滚，字退开，那扇窗推近成全景的大窗，照片台面淡成浅灰台面；之后镜头依次推近六处）
// → 用起来（写代码、做内容运营两种人，各走「和团队一起」「长出自己的工具」两条闭环，切换角色只换手上的活）
// → 为什么是 Molis（左边「接得上」做主角、另外三条辅助；右边周一到周五四个场景依次接手，都连到下面同一份记录）
// → 缘起与现在（不再放台面：居中一封信——缘起、信念和它的解释；下面就是 Molis 团队发来的决定请求，三个去处，最后一件事交给读者定）。
// 画面照最新桌面端画；功能按做好的样子演，走到哪一步只在结尾写一次。
// 两种光标：冰蓝的「你」字名牌是你（只在你动手、你定的时候出现），AI 的是插入光标或灰名牌。

/** 区块标题：两色，铺垫是灰、最后一句是墨色；区块的小标签不显示，作读屏名写在 section 上 */
function Head({ id, title, children }: { id: string; title: string; children?: ReactNode }) {
  return (
    <header className="wk-head" data-reveal>
      <h2 className="wk-head-title" id={id}>
        <Phrases text={title} />
      </h2>
      {children}
    </header>
  );
}

const ASK_HREF = { join: contactHref('work'), build: WORK_BUILD, source: WORK_GITHUB };

/**
 * 决定请求里的一个选项：整行是链接，右边一颗圆形箭头（站内右箭头、外链斜箭头）。
 * 第一个是主选项：「你」的名牌停在它的箭头旁（只是画面，读屏不读）；访客的鼠标移上来就变成「你」，画上的那枚先隐去。
 */
function AskOption({ id, title, state, text }: (typeof workEnd.ask.options)[number]) {
  const main = id === 'join';
  const body = (
    <>
      <b className="wk-ask-t">{title}</b>
      <span className="wk-ask-d">
        <Status>{state}</Status>
        {text}
      </span>
      <i className="wk-ask-go" aria-hidden="true">
        {main ? <ArrowRight size={18} /> : <ArrowUpRight size={18} />}
      </i>
      {main ? (
        <span className="wk-ask-hand" aria-hidden="true">
          你
        </span>
      ) : null}
    </>
  );
  if (main)
    return (
      <Link className="wk-ask-opt" data-main="" href={ASK_HREF[id]}>
        {body}
      </Link>
    );
  return (
    <a className="wk-ask-opt" href={ASK_HREF[id]} target="_blank" rel="noreferrer">
      {body}
    </a>
  );
}

export default function WorkPage() {
  return (
    <div className="m-product m-work wk">
      <Opening
        hero={
          <>
            <header className="wk-hero">
              <div className="wk-hero-lead">
                <p className="m-tagline m-rise">
                  <span>{workHero.form}</span>
                  <Status>{workHero.stage}</Status>
                </p>
                <h1 className="m-phero-name m-rise" lang="en">
                  {work.name}
                </h1>
                <p className="wk-hero-title m-rise" style={{ '--delay': '120ms' } as Vars}>
                  <Phrases text={workHero.title} />
                </p>
                <p className="wk-hero-slogan m-rise" lang="en" style={{ '--delay': '180ms' } as Vars}>
                  {workHero.slogan}
                </p>
              </div>
              <div className="wk-hero-side">
                <p className="wk-hero-what m-rise" style={{ '--delay': '240ms' } as Vars}>
                  <Phrases text={workHero.what} />
                </p>
                <p className="wk-hero-go m-rise" style={{ '--delay': '320ms' } as Vars}>
                  <Btn href={contactHref('work')}>{workHero.go}</Btn>
                </p>
              </div>
            </header>
            <HeroStage label={workHero.label} />
          </>
        }
        tour={<Tour head={<Head id="wk-tour-title" title={workTour.title} />} />}
      />

      <section className="wk-cs-sec" aria-label={workCases.kicker}>
        <Cases head={<Head id="wk-cases-title" title={workCases.title} />} />
      </section>

      <section className="wk-why-sec" aria-label={workWhy.kicker}>
        <Why
          head={
            <Head id="wk-why-title" title={workWhy.title}>
              <p className="wk-head-lead">
                <Phrases text={workWhy.lead} />
              </p>
            </Head>
          }
        />
      </section>

      <section className="wk-end" aria-labelledby="wk-end-title">
        <div className="m-wrap wk-end-in">
          <header className="wk-end-head">
            <p className="wk-end-origin" data-reveal>
              {workEnd.origin}
            </p>
            <h2 className="wk-end-belief" id="wk-end-title" data-reveal style={{ '--delay': '120ms' } as Vars}>
              <Phrases text={workEnd.belief} />
            </h2>
            <p className="wk-end-text" data-reveal style={{ '--delay': '240ms' } as Vars}>
              <Phrases text={workEnd.beliefText} />
            </p>
          </header>
          <div className="wk-ask" data-reveal style={{ '--delay': '420ms' } as Vars}>
            <p className="wk-ask-k">
              <Ring tone="attention" />
              {workEnd.ask.from}
              <small>{workEnd.ask.wait}</small>
            </p>
            <p className="wk-ask-q">{workEnd.ask.question}</p>
            <p className="wk-ask-why">{workEnd.ask.why}</p>
            <ul className="wk-ask-opts">
              {workEnd.ask.options.map((option) => (
                <li key={option.id}>
                  <AskOption {...option} />
                </li>
              ))}
            </ul>
            <p className="wk-ask-foot">{workEnd.foot}</p>
          </div>
        </div>
      </section>
    </div>
  );
}
