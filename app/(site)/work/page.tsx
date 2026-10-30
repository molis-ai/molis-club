import { ArrowRight, ArrowUpRight, CircleSlash, HardDrive, KeyRound, ShieldCheck } from 'lucide-react';
import Link from 'next/link';
import type { ReactNode } from 'react';
import { pageMetadata } from '../../../lib/site';
import { products, WORK_BUILD, WORK_GITHUB } from '../../../content/site/products';
import { workEnd, workHero, workKeep, workTour, workWeekend } from '../../../content/site/work';
import { contactHref, productHref } from '../../_site/routes';
import { Btn, Phrases, Status, Window, type Vars } from '../../_site/ui';
import { HeroStage, Tour, Weekend } from './stages';
import '../../_site/product/product.css';
import './work.css';

const work = products.work;

export const metadata = pageMetadata(
  `${work.name} · ${workHero.title}`,
  workHero.what,
  productHref.work,
);

// Molis Work（2026-10-24 重做，目标、取舍与验收见 specs/work-product-page/spec.md）。
// 一句话：工具和 AI 围着你转，你还是你。整页只有一个例子：一个周末，把一个想法做上线。
// 首屏（做完以后的周一早上：上面是字，下面一整块舞台，窗口落在一面有叶影的墙前）→ 全景（一扇窗，七处依次点亮）→ 一个周末（六个时刻，钉住的画廊）
// → 留在你这儿 → 缘起与现在（信念在上；下面一扇窗，墙上浮着一张「决定请求」，三个去处就是三个选项，最后一件事交给读者定）。画面照最新桌面端画；功能按做好的样子演，走到哪一步只在结尾写一次。
// 两种光标：杏橙指针是「你」（只在你动手、你定的时候出现），插入光标加灰名牌是 AI（它在写）。

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
  /** screen：和画面同一屏的标题，眉题挨紧一点（全景、一个周末） */
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

const KEEP_ICON = { local: HardDrive, models: KeyRound, grants: ShieldCheck };

const ASK_HREF = { join: contactHref('work'), build: WORK_BUILD, source: WORK_GITHUB };

/**
 * 决定请求里的一个选项：整行是链接，右边一颗圆形箭头（站内右箭头、外链斜箭头）。
 * 第一个是主选项：铺一层杏色，「你」的指针停在上面（只是画面，读屏不读）。
 */
function AskOption({ id, title, state, text }: (typeof workEnd.ask.options)[number]) {
  const main = id === 'join';
  const body = (
    <>
      <b className="wk-invite-t">{title}</b>
      <span className="wk-invite-d">
        <Status>{state}</Status>
        {text}
      </span>
      <i className="wk-invite-go" aria-hidden="true">
        {main ? <ArrowRight size={16} /> : <ArrowUpRight size={16} />}
      </i>
      {main ? (
        <span className="wk-invite-hand" aria-hidden="true">
          <svg viewBox="0 0 18 24">
            <path d="M1.5 1.5v17l4.5-4 3 7 2.6-1.1-3-6.9h6.4z" />
          </svg>
          <span>你</span>
        </span>
      ) : null}
    </>
  );
  if (main)
    return (
      <Link className="wk-invite-opt" data-main="" href={ASK_HREF[id]}>
        {body}
      </Link>
    );
  return (
    <a className="wk-invite-opt" href={ASK_HREF[id]} target="_blank" rel="noreferrer">
      {body}
    </a>
  );
}

export default function WorkPage() {
  return (
    <div className="m-product m-work wk">
      <header className="wk-hero m-wrap m-top">
        <div className="wk-hero-copy">
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
        </div>
        <HeroStage label={workHero.label} />
      </header>

      <section className="wk-sec wk-tour-sec" aria-labelledby="wk-tour-title">
        <div className="m-wrap">
          <Tour head={<Head id="wk-tour-title" kicker={workTour.kicker} title={workTour.title} size="screen" />} />
        </div>
      </section>

      <section className="wk-gal-sec" aria-labelledby="wk-weekend-title">
        <Weekend
          head={<Head id="wk-weekend-title" kicker={workWeekend.kicker} title={workWeekend.title} size="screen" />}
        />
      </section>

      <section className="wk-sec wk-keep-sec" aria-labelledby="wk-keep-title">
        <div className="m-wrap wk-keep">
          <Head id="wk-keep-title" kicker={workKeep.kicker} title={workKeep.title} />
          <div className="wk-keep-rows">
            {workKeep.rows.map((row, index) => {
              const Icon = KEEP_ICON[row.id as keyof typeof KEEP_ICON];
              return (
                <div key={row.id} className="wk-keep-row" data-reveal style={{ '--delay': `${index * 120}ms` } as Vars}>
                  <p className="wk-keep-ic" aria-hidden="true">
                    <Icon />
                  </p>
                  <h3>{row.title}</h3>
                  <p className="wk-keep-text">
                    <Phrases text={row.text} />
                  </p>
                  {row.id === 'local' ? (
                    <p className="wk-keep-vis wk-keep-path" aria-hidden="true">
                      <span>~/Molis Work/划线卡片</span>
                      <small>本机 · SQLite</small>
                    </p>
                  ) : null}
                  {row.id === 'models' ? (
                    <p className="wk-keep-vis wk-keep-models">
                      {workKeep.models.map((model) => (
                        <span key={model} data-picked={model === workKeep.picked || undefined}>
                          {model}
                        </span>
                      ))}
                    </p>
                  ) : null}
                  {row.id === 'grants' ? (
                    <dl className="wk-keep-vis wk-keep-grants">
                      {workKeep.grants.map(([who, rule, kind]) => (
                        <div key={who} data-kind={kind}>
                          <dt>{who}</dt>
                          <dd>
                            {kind === 'no' ? <CircleSlash aria-hidden="true" /> : null}
                            {rule}
                          </dd>
                        </div>
                      ))}
                    </dl>
                  ) : null}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="wk-sec wk-end" aria-labelledby="wk-end-title">
        <div className="m-wrap">
          <header className="wk-end-head">
            <div className="wk-end-lead">
              <p className="wk-end-origin" data-reveal>
                {workEnd.origin}
              </p>
              <h2 className="wk-end-belief" id="wk-end-title" data-reveal style={{ '--delay': '120ms' } as Vars}>
                <Phrases text={workEnd.belief} />
              </h2>
            </div>
            <p className="wk-end-text" data-reveal style={{ '--delay': '260ms' } as Vars}>
              <Phrases text={workEnd.beliefText} />
            </p>
          </header>
          <div className="wk-close">
            <Window
              name="work-close"
              alt={workEnd.photoAlt}
              ratio="2 / 1"
              focus="58% 30%"
              sizes="(max-width: 900px) 100vw, min(92vw, 1328px)"
              className="wk-close-photo"
            />
            <div className="wk-invite" data-reveal style={{ '--delay': '900ms' } as Vars}>
              <p className="wk-invite-k">
                <svg viewBox="0 0 16 16" aria-hidden="true">
                  <circle cx="8" cy="8" r="6.2" />
                </svg>
                {workEnd.ask.from}
                <small>{workEnd.ask.wait}</small>
              </p>
              <p className="wk-invite-q">{workEnd.ask.question}</p>
              <p className="wk-invite-why">{workEnd.ask.why}</p>
              <ul className="wk-invite-opts">
                {workEnd.ask.options.map((option) => (
                  <li key={option.id}>
                    <AskOption {...option} />
                  </li>
                ))}
              </ul>
              <p className="wk-invite-foot">{workEnd.foot}</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
