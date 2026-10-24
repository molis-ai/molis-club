import { CircleSlash, HardDrive, KeyRound, ShieldCheck } from 'lucide-react';
import type { ReactNode } from 'react';
import { pageMetadata } from '../../../lib/site';
import { products, WORK_BUILD, WORK_GITHUB } from '../../../content/site/products';
import { workEnd, workHero, workKeep, workTour, workWeekend } from '../../../content/site/work';
import { contactHref, productHref } from '../../_site/routes';
import { Btn, More, Phrases, Status, type Vars } from '../../_site/ui';
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
// 首屏（做完以后的周一早上）→ 全景（一扇窗，七处依次点亮）→ 一个周末（六个时刻，钉住的画廊）
// → 留在你这儿 → 缘起与现在。画面照最新桌面端画；功能按做好的样子演，走到哪一步只在结尾写一次。
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
  /** screen：和画面同一屏的小一号标题（全景、一个周末） */
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
            {workHero.what}
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
                  <p className="wk-keep-text">{row.text}</p>
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
          <div className="wk-end-why" data-reveal>
            <h2 className="wk-end-origin" id="wk-end-title">
              {workEnd.origin.map((line) => (
                <span key={line}>{line}</span>
              ))}
            </h2>
            <p className="wk-end-belief">{workEnd.belief}</p>
            <p className="wk-end-text">{workEnd.beliefText}</p>
          </div>
          <div className="wk-end-now">
            <div className="wk-now" data-reveal>
              <p className="wk-now-k">
                <Status>{workEnd.dev.label}</Status>
              </p>
              <p className="wk-now-text">{workEnd.dev.text}</p>
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
              <p className="wk-now-text">{workEnd.released.text}</p>
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
