import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowRight } from 'lucide-react';
import { pageMetadata } from '../../../../../lib/site';
import {
  isResourceEntry,
  knowledge,
  relatedKnowledge,
  resourceGroupLabels,
} from '../../../../../content/knowledge';
import { methodText } from '../../../../../content/site/community';
import {
  COMMUNITY,
  contactHref,
  METHODS,
  methodHref,
} from '../../../../_site/routes';
import { More, pad, type Vars } from '../../../../_site/ui';
import { MethodLab } from '../../method-demo';
import '../../../../_site/demo/demo.css';
import '../methods.css';

// 方法详情：开篇写清它是什么；实验台上是示例（动效可以调时长）和 Prompt；
// 再讲什么时候用、留意什么、资料来自哪里；最后接着看同类的方法。

type Props = { params: Promise<{ slug: string }> };

const REDUCED_MOTION =
  'https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/@media/prefers-reduced-motion';

const find = (slug: string) => knowledge.find((item) => item.slug === slug);

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const entry = find(slug);
  if (!entry) return { title: methodText.notFound, robots: { index: false } };
  return pageMetadata(
    `${entry.name} ${entry.english} · ${methodText.kicker}`,
    entry.description,
    methodHref(entry.slug),
  );
}

export default async function MethodPage({ params }: Props) {
  const { slug } = await params;
  const entry = find(slug);
  if (!entry) notFound();
  const resource = isResourceEntry(entry);
  const kind = resource ? 'resource' : 'technique';
  const t = methodText;
  return (
    <div className="m-mth m-mth-detail">
      <header className="m-mth-hero m-wrap m-top">
        <nav className="m-mth-trail m-rise" aria-label="位置">
          <Link href={COMMUNITY}>{t.trail.community}</Link>
          <span aria-hidden="true">/</span>
          <Link href={`${METHODS}?type=${resource ? 'sources' : 'web'}`}>
            {t.trail.methods}
          </Link>
          <span aria-hidden="true">/</span>
          <span aria-current="page">{entry.name}</span>
        </nav>
        <div className="m-mth-head">
          <p className="m-tagline m-rise">
            <b>{t.kinds[entry.category]}</b>
            {resource ? (
              <span>{resourceGroupLabels[entry.group].title}</span>
            ) : null}
            <span>{t.editor}</span>
          </p>
          <h1
            className="m-mth-h1 m-rise"
            style={{ '--delay': '100ms' } as Vars}
          >
            {entry.name}
            <i lang="en">{entry.english}</i>
          </h1>
          <p
            className="m-mth-lead m-rise"
            style={{ '--delay': '200ms' } as Vars}
          >
            {entry.description}
          </p>
        </div>
      </header>

      <section
        className="m-wrap"
        aria-label={resource ? `${entry.name}的来源` : `${entry.name}的示例`}
      >
        <MethodLab entry={entry} />
      </section>

      <section
        id="usage"
        className="m-wrap m-mth-block"
        aria-label="用法与边界"
      >
        <div className="m-mth-reading">
          <section data-reveal>
            <h2>{t.use[kind]}</h2>
            <p>{entry.use}</p>
          </section>
          <section data-reveal style={{ '--delay': '90ms' } as Vars}>
            <h2>{t.caution[kind]}</h2>
            <p>{entry.caution}</p>
          </section>
          <section data-reveal style={{ '--delay': '180ms' } as Vars}>
            <h2>{t.source}</h2>
            <aside>
              <p>{t.editor}</p>
              <More href={entry.source.url} external>
                {entry.source.name}
              </More>
              {resource ? null : (
                <More href={REDUCED_MOTION} external>
                  {t.reduced}
                </More>
              )}
            </aside>
          </section>
        </div>
      </section>

      <section
        className="m-wrap m-mth-block m-mth-related"
        aria-labelledby="related-title"
      >
        <h2 id="related-title">{t.related}</h2>
        <ul>
          {relatedKnowledge(entry).map((item, index) => (
            <li key={item.slug}>
              <Link href={methodHref(item.slug)}>
                <span className="m-no" aria-hidden="true">
                  {pad(index + 1)}
                </span>
                <b>{item.name}</b>
                <i lang="en">{item.english}</i>
                <ArrowRight size={15} aria-hidden="true" />
              </Link>
            </li>
          ))}
        </ul>
        <p className="m-mth-share">
          {t.shareMethod}
          <Link className="m-inline" href={contactHref('share-method')}>
            {t.shareLink}
          </Link>
        </p>
        <p className="m-mth-back">
          <More href={METHODS}>{t.backToMethods}</More>
        </p>
      </section>
    </div>
  );
}
