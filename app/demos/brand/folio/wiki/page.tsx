'use client';
import Link from 'next/link';
import { useState } from 'react';
import { ArrowUpRight, Search } from 'lucide-react';
import { artistSkills } from '../../../../../content/artists';
import {
  filterKnowledge,
  isResourceEntry,
  knowledge,
  knowledgeCategoryFilters,
  resourceGroupLabels,
  resourceGuide,
  type KnowledgeEntry,
  type ResourceGroup,
} from '../../../../../content/knowledge';
import { folioWiki } from '../../../../../content/folio';
import { Closing, ProductHero, SectionHead, pad } from '../kit';
import {
  COMMUNITY,
  Footer,
  SiteHeader,
  artistHref,
  contactHref,
  useFolioMotion,
  wikiHref,
  type Vars,
} from '../shared';
import { FwDemo } from './demos';
import '../folio.css';
import '../kit.css';
import './wiki.css';

// Folio 的百科首页：首屏右边是一段可以重播的示例；先看艺术家 Skill，再到可搜索的网页、动效与组件目录。

const techniqueCount = knowledge.filter(
  (entry) => !isResourceEntry(entry),
).length;
const resourceCount = knowledge.length - techniqueCount;
const groupOrder: ResourceGroup[] = ['micro', 'polish', 'inspiration'];

function Artists() {
  const { artists } = folioWiki;
  const gallery = artistSkills.filter((skill) => skill.image);
  const builder = artistSkills.find((skill) => !skill.image);
  return (
    <section
      id="artists"
      className="fo-section"
      data-bg="white"
      aria-labelledby="fw-artists-title"
    >
      <SectionHead
        id="fw-artists-title"
        kicker={artists.kicker}
        title={artists.title}
        lead={artists.lead}
        layout="split"
      />
      <ul className="fw-gallery">
        {gallery.map((skill, index) => (
          <li key={skill.slug} data-reveal style={{ '--i': index } as Vars}>
            <Link href={artistHref(skill.slug)} className="fw-artwork">
              <figure className="fo-frame">
                <span className="fo-tape fo-tape-a" aria-hidden="true" />
                <img
                  src={skill.image}
                  width={skill.width}
                  height={skill.height}
                  alt={skill.imageAlt}
                  loading="lazy"
                />
              </figure>
              <span className="fw-artwork-medium">{skill.medium}</span>
              <strong>{skill.name}</strong>
              <em lang="en">{skill.english}</em>
              <span className="fw-more">
                {artists.more}
                <ArrowUpRight size={17} aria-hidden="true" />
              </span>
            </Link>
          </li>
        ))}
      </ul>
      <p className="fw-disclosure">{artists.disclosure}</p>
      {builder ? (
        <Link href={artistHref(builder.slug)} className="fw-builder">
          <span className="fo-index" aria-hidden="true">
            +
          </span>
          <div>
            <strong>{builder.name}</strong>
            <p>{artists.builder.text}</p>
          </div>
          <span className="fw-more">
            {artists.builder.more}
            <ArrowUpRight size={17} aria-hidden="true" />
          </span>
        </Link>
      ) : null}
    </section>
  );
}

/** 一个网页或动效条目：示例在卡片上直接能试，下面是说明和入口 */
function EntryCard({ entry, index }: { entry: KnowledgeEntry; index: number }) {
  return (
    <li className="fw-entry" data-reveal style={{ '--i': index % 3 } as Vars}>
      <FwDemo entry={entry} compact />
      <Link href={wikiHref(entry.slug)} className="fw-entry-body">
        <span className="fw-entry-meta">{entry.category}</span>
        <strong>{entry.name}</strong>
        <p>{entry.description}</p>
        <span className="fw-more">
          {folioWiki.entries.try}
          <ArrowUpRight size={17} aria-hidden="true" />
        </span>
      </Link>
    </li>
  );
}

function Directory() {
  const { entries } = folioWiki;
  const [query, setQuery] = useState('');
  const [category, setCategory] =
    useState<(typeof knowledgeCategoryFilters)[number]>('全部');
  const matches = filterKnowledge(knowledge, query, category);
  const techniques = matches.filter((entry) => !isResourceEntry(entry));
  const resources = matches.filter(isResourceEntry);
  return (
    <section
      id="entries"
      className="fo-section"
      data-bg="paper"
      aria-labelledby="fw-entries-title"
    >
      <SectionHead
        id="fw-entries-title"
        kicker={entries.kicker}
        title={entries.title}
        lead={entries.lead}
        layout="split"
      />
      <div className="fw-tools">
        <fieldset className="fw-filters" aria-label="百科分类">
          {knowledgeCategoryFilters.map((item) => (
            <button
              type="button"
              key={item}
              aria-pressed={category === item}
              onClick={() => setCategory(item)}
            >
              {item}
            </button>
          ))}
        </fieldset>
        <label className="fw-search">
          <Search size={18} aria-hidden="true" />
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={entries.search}
            aria-label={entries.searchLabel}
          />
        </label>
        <output className="fw-count" aria-live="polite">
          {matches.length} {entries.count}
          {query.trim() ? ` · 搜索「${query.trim()}」` : ''}
        </output>
      </div>

      {techniques.length > 0 ? (
        <ul className="fw-entries">
          {techniques.map((entry, index) => (
            <EntryCard key={entry.slug} entry={entry} index={index} />
          ))}
        </ul>
      ) : null}

      {resources.length > 0 ? (
        <div className="fw-resources">
          {query.trim() ? null : (
            <div className="fw-guide">
              <p>{resourceGuide.playful}</p>
              <p>{resourceGuide.quiet}</p>
              <p>{resourceGuide.caveat}</p>
            </div>
          )}
          {groupOrder.map((group) => {
            const items = resources.filter((entry) => entry.group === group);
            if (items.length === 0) return null;
            return (
              <section key={group} className="fw-group">
                <h3>
                  {resourceGroupLabels[group].title}
                  <span className="fo-index">{items.length}</span>
                </h3>
                <ul className="fw-rows">
                  {items.map((entry) => (
                    <li key={entry.slug}>
                      <Link href={wikiHref(entry.slug)} className="fw-row">
                        <strong>{entry.name}</strong>
                        <em lang="en">{entry.english}</em>
                        <p>{entry.description}</p>
                        <ArrowUpRight size={20} aria-hidden="true" />
                      </Link>
                    </li>
                  ))}
                </ul>
              </section>
            );
          })}
        </div>
      ) : null}

      {matches.length === 0 ? (
        <div className="fw-empty">
          <strong>{entries.empty.title}</strong>
          <p>{entries.empty.text}</p>
          <button
            type="button"
            className="fo-btn fo-btn-ink"
            onClick={() => {
              setQuery('');
              setCategory('全部');
            }}
          >
            {entries.empty.reset}
          </button>
        </div>
      ) : null}
    </section>
  );
}

export default function FolioWiki() {
  const rootRef = useFolioMotion();
  const { counts, closing } = folioWiki;
  return (
    <div className="fo-site" ref={rootRef}>
      <SiteHeader />
      <main id="main">
        <div className="fw-community-context">
          <Link href={COMMUNITY}>社区</Link>
          <span aria-hidden="true">/</span>
          <span>百科 · 把试出来的方法留下来</span>
        </div>
        <ProductHero
          id="fw-title"
          kicker={folioWiki.kicker}
          title={folioWiki.title}
          lead={folioWiki.lead}
          status={[
            `${artistSkills.length} ${counts.artists}`,
            `${techniqueCount} ${counts.techniques}`,
            `${resourceCount} ${counts.resources}`,
          ]}
          actions={[
            { label: folioWiki.actions.artists, href: '#artists' },
            {
              label: folioWiki.actions.entries,
              href: '#entries',
              tone: 'ghost',
            },
          ]}
          masthead="Wiki"
          art={
            <div className="fw-hero-demo">
              <span className="fo-tape fo-tape-a" aria-hidden="true" />
              <FwDemo entry={knowledge[0]} />
              <Link href={wikiHref(knowledge[0].slug)} className="fw-more">
                {pad(0)} · {knowledge[0].name}
                <ArrowUpRight size={17} aria-hidden="true" />
              </Link>
            </div>
          }
        />
        <Artists />
        <Directory />
      </main>
      <Footer tone="yellow">
        <Closing
          id="fw-closing-title"
          title={closing.title}
          actions={[
            { label: closing.ask, href: contactHref() },
            { label: closing.community, href: COMMUNITY, tone: 'light' },
          ]}
        >
          <p className="fw-closing-text">{closing.text}</p>
        </Closing>
      </Footer>
    </div>
  );
}
