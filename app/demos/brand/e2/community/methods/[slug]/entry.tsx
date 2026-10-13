'use client';
import { ArrowUpRight } from 'lucide-react';
import {
  isResourceEntry,
  knowledge,
  relatedKnowledge,
  resourceGroupLabels,
} from '../../../../../../../content/knowledge';
import { folioWiki } from '../../../../../../../content/folio';
import { folioCommunity } from '../../../../../../../content/folio-community';
import { methodHref } from '../../../routes';
import { E2Page } from '../../../shell';
import { MethodLab } from '../../demos';
import { DetailOpening, DetailRelated, ReadingBlock } from '../detail';

// 方法条目（阅读模式）：开篇一句定义；图版上是示例，旁边一张白纸写着 Prompt；
// 再讲什么时候用、留意什么、参考来源；页尾接着探索同类条目。顶栏标在「社区」，页内位置是「社区 / 方法」。

export function MethodEntry({ slug }: { slug: string }) {
  const entry = knowledge.find((item) => item.slug === slug)!;
  const resource = isResourceEntry(entry);
  const kind = resource ? 'resource' : 'technique';
  const t = folioWiki.entry;
  const tag = resource
    ? resourceGroupLabels[entry.group].title
    : folioCommunity.methods.techniqueKinds[entry.category];
  return (
    <E2Page
      current="community"
      className="ecd"
      footer={
        <DetailRelated
          title={t.related}
          items={relatedKnowledge(entry).map((item) => ({
            ...item,
            href: methodHref(item.slug),
          }))}
        />
      }
    >
      <DetailOpening
        name={entry.name}
        english={entry.english}
        description={entry.description}
        tags={[tag]}
      />

      <section
        className="ecd-section ecd-lab"
        aria-label={resource ? `${entry.name}的来源` : `${entry.name}的示例`}
      >
        <MethodLab entry={entry} />
      </section>

      <section
        id="usage"
        className="ecd-section ecd-usage"
        aria-label="用法与边界"
      >
        <div className="ecd-reading">
          <ReadingBlock index={0} title={t.use[kind]}>
            <p>{entry.use}</p>
          </ReadingBlock>
          <ReadingBlock index={1} title={t.caution[kind]}>
            <p>{entry.caution}</p>
          </ReadingBlock>
          <aside className="ecd-source" data-reveal>
            <h2>{t.source}</h2>
            <p>{t.editor}</p>
            <a href={entry.source.url} target="_blank" rel="noreferrer">
              {entry.source.name}
              <ArrowUpRight size={14} aria-hidden="true" />
            </a>
            <a
              href="https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/@media/prefers-reduced-motion"
              target="_blank"
              rel="noreferrer"
            >
              {t.reduced}
              <ArrowUpRight size={14} aria-hidden="true" />
            </a>
          </aside>
        </div>
      </section>
    </E2Page>
  );
}
