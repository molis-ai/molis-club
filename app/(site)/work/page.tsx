import type { ReactNode } from 'react';
import { pageMetadata } from '../../../lib/site';
import { products, WORK_BUILD, WORK_GITHUB } from '../../../content/site/products';
import { workCases, workEnd, workHero, workTour } from '../../../content/site/work';
import { contactHref, productHref } from '../../_site/routes';
import { Btn, More, Phrases, Status, type Vars } from '../../_site/ui';
import { Cases } from './cases';
import { Why } from './why';
import { HeroStage, Tour } from './stages';
import '../../_site/product/product.css';
import './work.css';

const work = products.work;

export const metadata = pageMetadata(
  `${work.name} · ${workHero.title}`,
  workHero.what,
  productHref.work,
);

// Molis Work（2026-10-24 重做，目标、取舍与验收见 specs/work-product-page/spec.md）。
// 一句话：工作，不止于 AI 对话。
// 首屏（周一早上的项目首页）→ 全景（一扇窗，镜头依次推近六处）→ 用起来（写代码、做内容运营两种人，
// 各走「和团队一起」「长出自己的工具」两条闭环，切换角色只换手上的活）→ 为什么是 Molis（深色一屏：四条差异和一张连着的图）→ 缘起与现在。
// 画面照最新桌面端画；功能按做好的样子演，走到哪一步只在结尾写一次。
// 两种光标：杏橙指针是「你」（只在你动手、你定的时候出现），AI 的是插入光标或方名牌。

function Head({
  id,
  kicker,
  title,
  size,
  children,
}: {
  id: string;
  kicker: string;
  title: string;
  /** screen：和画面同一屏的标题，眉题挨紧一点（全景、用起来） */
  size?: 'screen';
  children?: ReactNode;
}) {
  return (
    <header className="wk-head" data-size={size} data-reveal>
      <p className="m-kicker">{kicker}</p>
      <h2 className="wk-head-title" id={id}>
        <Phrases text={title} />
      </h2>
      {children}
    </header>
  );
}

export default function WorkPage() {
  return (
    <div className="m-product m-work wk">
      <header className="wk-hero m-wrap m-top">
        <div className="wk-hero-copy">
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
          <p className="wk-hero-what m-rise" style={{ '--delay': '240ms' } as Vars}>
            <Phrases text={workHero.what} />
          </p>
          <p className="wk-hero-go m-rise" style={{ '--delay': '320ms' } as Vars}>
            <Btn href={contactHref('work')}>{workHero.go}</Btn>
          </p>
        </div>
        <HeroStage label={workHero.label} />
      </header>

      <section className="wk-sec wk-tour-sec" aria-labelledby="wk-tour-title">
        <div className="m-wrap">
          <Tour head={<Head id="wk-tour-title" kicker={workTour.kicker} title={workTour.title} size="screen" />} />
        </div>
      </section>

      <section className="wk-cs-sec" aria-labelledby="wk-cases-title">
        <Cases head={<Head id="wk-cases-title" kicker={workCases.kicker} title={workCases.title} size="screen" />} />
      </section>

      <section className="wk-why-sec" aria-labelledby="wk-why-title">
        <Why />
      </section>

      <section className="wk-sec wk-end" aria-labelledby="wk-end-title">
        <div className="m-wrap">
          <div className="wk-end-why" data-reveal>
            <h2 className="wk-end-origin" id="wk-end-title">
              {workEnd.origin.map((line) => (
                <span key={line}>{line}</span>
              ))}
            </h2>
            <p className="wk-end-belief">{workEnd.belief}</p>
            <p className="wk-end-text">
              <Phrases text={workEnd.beliefText} />
            </p>
          </div>
          <div className="wk-end-now">
            <div className="wk-now" data-reveal>
              <p className="wk-now-k">
                <Status>{workEnd.dev.label}</Status>
              </p>
              <p className="wk-now-text">
                <Phrases text={workEnd.dev.text} />
              </p>
              <p className="m-actions">
                <Btn href={contactHref('work')}>{workEnd.dev.go}</Btn>
                <More href={WORK_BUILD} external>
                  {workEnd.dev.build}
                </More>
              </p>
            </div>
            <div className="wk-now" data-reveal style={{ '--delay': '120ms' } as Vars}>
              <p className="wk-now-k">
                <Status>{workEnd.released.label}</Status>
              </p>
              <p className="wk-now-text">
                <Phrases text={workEnd.released.text} />
              </p>
              <p className="m-actions">
                <More href={WORK_GITHUB} external>
                  {workEnd.released.go}
                </More>
              </p>
            </div>
          </div>
          <p className="wk-end-foot">{workEnd.foot}</p>
        </div>
      </section>
    </div>
  );
}
