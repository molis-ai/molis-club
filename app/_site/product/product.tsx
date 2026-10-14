import type { ReactNode } from 'react';
import type { Product } from '../../../content/site/products';
import { pad, Phrases, Status, Window, type Vars } from '../ui';

// 产品页共用的骨架。不能变的：顶栏、页尾、字阶、网格边距、标签与诚实标注、按钮链接、缓动；
// 能变的：演示区主色调、画面形状、页面节奏、标志性交互——产品特色只放在演示区和窗里。

type WindowProps = Parameters<typeof Window>[0];

/** 首屏：左边产品名、第 4 章标题、加粗一句、作品标签「名称 · 形态 · 阶段」；右边这件产品的窗 */
export function ProductHero({
  product,
  window,
  visual,
  concept = false,
  aside,
}: {
  product: Product;
  window?: WindowProps;
  /** 右边不是一张图时（例如 Story 的云是一段视频），直接给一个窗 */
  visual?: ReactNode;
  concept?: boolean;
  /** 首屏左下角的一行（例如 World 的「整页都是概念示意」） */
  aside?: ReactNode;
}) {
  return (
    <header className="m-phero m-wrap m-top">
      <div className="m-phero-copy">
        <p className="m-tagline m-rise">
          <b lang="en">{product.name}</b>
          <span>{product.form}</span>
          <Status concept={concept}>{product.stage}</Status>
        </p>
        <h1 className="m-phero-name m-rise" lang="en">
          {product.name}
        </h1>
        <p className="m-phero-title m-rise" style={{ '--delay': '120ms' } as Vars}>
          <Phrases text={product.headline} />
        </p>
        <p className="m-phero-what m-rise" style={{ '--delay': '220ms' } as Vars}>
          {product.what}
        </p>
        {aside ? (
          <div className="m-phero-aside m-rise" style={{ '--delay': '320ms' } as Vars}>
            {aside}
          </div>
        ) : null}
      </div>
      {visual ??
        (window ? (
          <Window
            className="m-phero-window"
            ratio="4 / 5"
            sizes="(max-width: 900px) 100vw, 40vw"
            eager
            {...window}
          />
        ) : null)}
    </header>
  );
}

/** 一段有编号的区块：一道墨线、斜体编号、小标签、标题 */
export function Part({
  no,
  kicker,
  title,
  id,
  children,
  className = '',
}: {
  no: number;
  kicker: string;
  title: ReactNode;
  id?: string;
  children?: ReactNode;
  className?: string;
}) {
  return (
    <section
      className={`m-part m-wrap ${className}`}
      id={id}
      aria-labelledby={id ? `${id}-title` : undefined}
    >
      <header className="m-head" data-size="h2" data-reveal>
        <p className="m-head-meta">
          <span className="m-no" aria-hidden="true">
            {pad(no)}
          </span>
          <span className="m-kicker">{kicker}</span>
        </p>
        <h2 className="m-head-title" id={id ? `${id}-title` : undefined}>
          {title}
        </h2>
      </header>
      {children}
    </section>
  );
}

export type Progress = {
  have: string[];
  notYet: string[];
  now: { text: string[]; links?: ReactNode };
};

/**
 * 固定收尾：适合这样的时刻 → 当前进展（已经有的 / 还没有的 / 现在怎么体验）
 * → 和其他产品的关系（只在有关系的页）→ 去处。
 */
export function ProductEnding({
  product,
  progress,
  relation,
  go,
  start = 1,
  concept = false,
}: {
  product: Product;
  concept?: boolean;
  progress: Progress;
  relation?: { title: string; text: string; tag?: string; formula?: ReactNode };
  go: ReactNode;
  start?: number;
}) {
  let no = start;
  return (
    <div className="m-pend">
      <Part
        no={no++}
        kicker="适合这样的时刻"
        title={<Phrases text={product.fit} />}
        className="m-pend-fit"
      />
      <Part
        no={no++}
        kicker="当前进展"
        title={
          <span className="m-pend-stagehead" data-concept={concept || undefined}>
            {product.stage}
          </span>
        }
      >
        <p className="m-pend-stage" data-reveal>
          {product.stageNote}
        </p>
        <dl className="m-pend-progress">
          <div data-reveal>
            <dt>已经有的</dt>
            <dd>
              {progress.have.map((text) => (
                <p key={text}>{text}</p>
              ))}
            </dd>
          </div>
          <div data-reveal style={{ '--delay': '90ms' } as Vars}>
            <dt>还没有的</dt>
            <dd>
              {progress.notYet.map((text) => (
                <p key={text}>{text}</p>
              ))}
            </dd>
          </div>
          <div data-reveal style={{ '--delay': '180ms' } as Vars}>
            <dt>现在怎么体验</dt>
            <dd>
              {progress.now.text.map((text) => (
                <p key={text}>{text}</p>
              ))}
              {progress.now.links ? (
                <div className="m-actions">{progress.now.links}</div>
              ) : null}
            </dd>
          </div>
        </dl>
      </Part>
      {relation ? (
        <Part no={no++} kicker="和其他产品的关系" title={relation.title}>
          <div className="m-pend-relation" data-reveal>
            {relation.formula ? (
              <p className="m-pend-formula" aria-hidden="true" lang="en">
                {relation.formula}
              </p>
            ) : null}
            <p>{relation.text}</p>
            {relation.tag ? <span className="m-note">{relation.tag}</span> : null}
          </div>
        </Part>
      ) : null}
      <section className="m-pend-go m-wrap" aria-label="去处">
        <div className="m-actions" data-reveal>
          {go}
        </div>
      </section>
    </div>
  );
}
