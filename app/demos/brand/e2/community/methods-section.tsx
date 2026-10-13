'use client';
import { useState } from 'react';
import Link from 'next/link';
import { ArrowDownToLine, ArrowRight, Plus, Search } from 'lucide-react';
import { artistSkills, type ArtistSkill } from '../../../../../content/artists';
import {
  filterKnowledge,
  isResourceEntry,
  knowledge,
  knowledgePrompt,
  resourceGroupLabels,
  type ResourceEntry,
  type ResourceGroup,
  type TechniqueEntry,
} from '../../../../../content/knowledge';
import { folioCommunity } from '../../../../../content/folio-community';
import { artistHref, contactHref, methodHref, pad } from '../routes';
import { SectionHead } from '../shell';
import { CopyAction, ShareAfter } from './copy';
import { MethodDemo, Toggle } from './demos';

// 社区的「方法」段：像一份整理好的目录。分类签加搜索，条目数随时可见；默认只露六张精选，
// 「查看全部」在原处展开；24 个组件来源默认收起，筛选或搜索时直接列出。详情在 community/methods/…

type Filter = (typeof folioCommunity.methods.filters)[number];
const groupOrder: ResourceGroup[] = ['micro', 'polish', 'inspiration'];

function matchesArtist(skill: ArtistSkill, needle: string) {
  return `${skill.name} ${skill.english} ${skill.medium} ${skill.description}`
    .toLowerCase()
    .includes(needle);
}

function ShareEntry({ topic }: { topic: string }) {
  return (
    <Link className="ecm-share-entry" href={contactHref(topic)}>
      <Plus size={13} aria-hidden="true" />
      {folioCommunity.shareEntry}
    </Link>
  );
}

function CardMeta({ index, kind }: { index: number; kind: React.ReactNode }) {
  return (
    <span className="ecm-card-meta">
      <i>{pad(index)}</i>
      <span>{kind}</span>
    </span>
  );
}

function ArtistCard({ skill, index }: { skill: ArtistSkill; index: number }) {
  const t = folioCommunity.methods.artist;
  const [downloaded, setDownloaded] = useState(false);
  return (
    <li className="ecm-card" data-kind="artist">
      <CardMeta index={index} kind={`${t.kind} · ${skill.medium}`} />
      <Link
        href={artistHref(skill.slug)}
        className="ecm-card-art"
        tabIndex={-1}
        aria-hidden="true"
      >
        {skill.image ? (
          <img
            src={skill.image}
            width={skill.width}
            height={skill.height}
            alt=""
            loading="lazy"
          />
        ) : (
          <span className="ecm-builder" lang="en">
            <span>Observe.</span>
            <span>Translate.</span>
            <span>Create.</span>
          </span>
        )}
      </Link>
      <div className="ecm-card-body">
        <h3>
          <Link href={artistHref(skill.slug)}>{skill.name}</Link>
        </h3>
        <p>{skill.description}</p>
        <div className="ecm-card-actions">
          <a
            className="ecm-textbutton"
            href={`/downloads/artists/${skill.slug}.zip`}
            download
            onClick={() => setDownloaded(true)}
          >
            <ArrowDownToLine size={15} aria-hidden="true" />
            {t.download}
          </a>
          <Link className="ecm-textbutton" href={artistHref(skill.slug)}>
            {t.detail}
            <ArrowRight size={14} aria-hidden="true" />
          </Link>
        </div>
        <output className="ecm-status">
          {downloaded ? (
            <ShareAfter
              text={folioCommunity.after.skill}
              topic="share-artist"
            />
          ) : null}
        </output>
      </div>
      <ShareEntry topic="share-artist" />
    </li>
  );
}

function TechniqueCard({
  entry,
  index,
}: {
  entry: TechniqueEntry;
  index: number;
}) {
  const { technique, techniqueKinds } = folioCommunity.methods;
  return (
    <li className="ecm-card" data-kind="technique">
      <CardMeta
        index={index}
        kind={
          <>
            {techniqueKinds[entry.category]} ·{' '}
            <span lang="en">{entry.english}</span>
          </>
        }
      />
      <MethodDemo entry={entry} compact />
      <div className="ecm-card-body">
        <h3>
          <Link href={methodHref(entry.slug)}>{entry.name}</Link>
        </h3>
        <p>{entry.description}</p>
        <div className="ecm-card-actions">
          <CopyAction
            id={`${entry.slug}-prompt`}
            text={knowledgePrompt(entry)}
            label={technique.copy}
            topic="share-method"
          />
          <Link className="ecm-textbutton" href={methodHref(entry.slug)}>
            {technique.detail}
            <ArrowRight size={14} aria-hidden="true" />
          </Link>
        </div>
      </div>
      <ShareEntry topic="share-method" />
    </li>
  );
}

function ResourceRows({ items }: { items: ResourceEntry[] }) {
  return (
    <>
      {groupOrder.map((group) => {
        const rows = items.filter((entry) => entry.group === group);
        if (rows.length === 0) return null;
        return (
          <section key={group} className="ecm-group">
            <h3>
              {resourceGroupLabels[group].title}
              <span>{String(rows.length).padStart(2, '0')}</span>
            </h3>
            <ul className="ecm-rows">
              {rows.map((entry) => (
                <li key={entry.slug}>
                  <Link href={methodHref(entry.slug)} className="ecm-row">
                    <strong>{entry.name}</strong>
                    <em lang="en">{entry.english}</em>
                    <p>{entry.description}</p>
                    <ArrowRight size={18} aria-hidden="true" />
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        );
      })}
    </>
  );
}

export function MethodsSection({ index }: { index: number }) {
  const t = folioCommunity.methods;
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<Filter>('全部');
  const [all, setAll] = useState(false);
  const needle = query.trim().toLowerCase();
  const browsing = filter === '全部' && !needle;
  const showPicks = browsing && !all;
  const picked = (slug: string) => !showPicks || t.picks.includes(slug);

  const entries = filterKnowledge(knowledge, needle, '全部');
  const artists =
    filter === '全部' || filter === '艺术家 Skill'
      ? artistSkills.filter((skill) => matchesArtist(skill, needle))
      : [];
  const techniques =
    filter === '全部' || filter === '网页与动效'
      ? entries.filter(
          (entry): entry is TechniqueEntry => !isResourceEntry(entry),
        )
      : [];
  const resources =
    filter === '全部' || filter === '组件来源'
      ? entries.filter(isResourceEntry)
      : [];
  const cards = [
    ...artists.filter((skill) => picked(skill.slug)),
    ...techniques.filter((entry) => picked(entry.slug)),
  ];
  const total = artists.length + techniques.length + resources.length;

  return (
    <section
      className="ecm-section ecm-methods"
      id="methods"
      aria-labelledby="ecm-methods-title"
    >
      <SectionHead
        id="ecm-methods-title"
        index={index}
        kicker={t.kicker}
        title={t.title}
        lead={t.lead}
        layout="split"
      />

      <div className="ecm-tools">
        <fieldset className="ecm-filters" aria-label={t.filtersLabel}>
          {t.filters.map((item) => (
            <button
              type="button"
              key={item}
              aria-pressed={filter === item}
              onClick={() => setFilter(item)}
            >
              {item}
            </button>
          ))}
        </fieldset>
        <label className="ecm-search">
          <Search size={16} aria-hidden="true" />
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={t.search}
            aria-label={t.searchLabel}
          />
        </label>
        <output className="ecm-count" aria-live="polite">
          <b>{total}</b> {t.count}
          {needle ? ` · 搜索「${query.trim()}」` : ''}
        </output>
      </div>

      {cards.length > 0 ? (
        <ul className="ecm-cards">
          {cards.map((item, i) =>
            'medium' in item ? (
              <ArtistCard key={item.slug} skill={item} index={i} />
            ) : (
              <TechniqueCard key={item.slug} entry={item} index={i} />
            ),
          )}
        </ul>
      ) : null}

      {browsing ? (
        <button
          type="button"
          className="e2-button e2-button-ghost ecm-more"
          aria-expanded={all}
          onClick={() => setAll((value) => !value)}
        >
          {all ? t.less : t.more}
          <Toggle />
        </button>
      ) : null}

      {resources.length > 0 ? (
        browsing ? (
          <details className="ecm-resources">
            <summary>
              <span className="ecm-resources-count">
                <b>{resources.length}</b> {t.resources.count}
              </span>
              <small>{t.resources.note}</small>
              <Toggle />
            </summary>
            <div className="ecm-resources-body">
              <ResourceRows items={resources} />
            </div>
          </details>
        ) : (
          <div className="ecm-resources-body">
            <ResourceRows items={resources} />
          </div>
        )
      ) : null}

      {artists.length > 0 ? (
        <p className="ecm-disclosure">{t.disclosure}</p>
      ) : null}

      {total === 0 ? (
        <div className="ecm-empty">
          <strong>{t.empty.title}</strong>
          <p>{t.empty.text}</p>
          <button
            type="button"
            className="e2-button e2-button-ink"
            onClick={() => {
              setQuery('');
              setFilter('全部');
            }}
          >
            {t.empty.reset}
          </button>
        </div>
      ) : null}
    </section>
  );
}
