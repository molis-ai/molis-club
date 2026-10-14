'use client';
import { useState } from 'react';
import Link from 'next/link';
import { ArrowDownToLine, ArrowUpRight, Plus, Search } from 'lucide-react';
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
import { artistHref, contactHref, methodHref } from '../routes';
import { CopyAction, ShareAfter } from './copy';
import { FwDemo } from './methods/demos';
import './methods/methods.css';

// 社区的「方法」段（原百科首页并进来）：分类签加搜索；默认只露六张精选，「查看全部」在原处展开；
// 24 个组件来源默认收起。详情在 /demos/community/methods/…，样式与示例沿用原百科（g-mth-）。

type Filter = (typeof folioCommunity.methods.filters)[number];
const groupOrder: ResourceGroup[] = ['micro', 'polish', 'inspiration'];

function matchesArtist(skill: ArtistSkill, needle: string) {
  return `${skill.name} ${skill.english} ${skill.medium} ${skill.description}`
    .toLowerCase()
    .includes(needle);
}

function ShareEntry({ topic }: { topic: string }) {
  return (
    <Link className="g-com-share-entry" href={contactHref(topic)}>
      <Plus size={14} aria-hidden="true" />
      {folioCommunity.shareEntry}
    </Link>
  );
}

function ArtistCard({ skill }: { skill: ArtistSkill }) {
  const t = folioCommunity.methods.artist;
  const [downloaded, setDownloaded] = useState(false);
  return (
    <li className="g-com-m-card" data-kind="artist">
      <Link
        href={artistHref(skill.slug)}
        className="g-com-m-art"
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
          <span className="g-com-m-builder" lang="en">
            Observe.
            <br />
            Translate.
            <br />
            Create.
          </span>
        )}
      </Link>
      <div className="g-com-m-body">
        <span className="g-com-work-type">
          {t.kind} · {skill.medium}
        </span>
        <h3>
          <Link href={artistHref(skill.slug)}>{skill.name}</Link>
        </h3>
        <p>{skill.description}</p>
        <div className="g-com-m-actions">
          <a
            className="g-com-text-link"
            href={`/downloads/artists/${skill.slug}.zip`}
            download
            onClick={() => setDownloaded(true)}
          >
            <ArrowDownToLine size={16} aria-hidden="true" />
            {t.download}
          </a>
          <Link className="g-com-text-link" href={artistHref(skill.slug)}>
            {t.detail}
            <ArrowUpRight size={16} aria-hidden="true" />
          </Link>
        </div>
        <output className="g-com-copy-status">
          {downloaded ? (
            <ShareAfter
              text={folioCommunity.after.skill}
              topic="share-artist"
            />
          ) : null}
        </output>
        <ShareEntry topic="share-artist" />
      </div>
    </li>
  );
}

function TechniqueCard({ entry }: { entry: TechniqueEntry }) {
  const { technique, techniqueKinds } = folioCommunity.methods;
  return (
    <li className="g-com-m-card" data-kind="technique">
      <FwDemo entry={entry} compact />
      <div className="g-com-m-body">
        <span className="g-com-work-type">
          {techniqueKinds[entry.category]} ·{' '}
          <span lang="en">{entry.english}</span>
        </span>
        <h3>
          <Link href={methodHref(entry.slug)}>{entry.name}</Link>
        </h3>
        <p>{entry.description}</p>
        <div className="g-com-m-actions">
          <CopyAction
            id={`${entry.slug}-prompt`}
            text={knowledgePrompt(entry)}
            label={technique.copy}
            topic="share-method"
          />
          <Link className="g-com-text-link" href={methodHref(entry.slug)}>
            {technique.detail}
            <ArrowUpRight size={16} aria-hidden="true" />
          </Link>
        </div>
        <ShareEntry topic="share-method" />
      </div>
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
          <section key={group} className="g-mth-group">
            <h3>
              {resourceGroupLabels[group].title}
              <span className="g-com-index">{rows.length}</span>
            </h3>
            <ul className="g-mth-rows">
              {rows.map((entry) => (
                <li key={entry.slug}>
                  <Link href={methodHref(entry.slug)} className="g-mth-row">
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
    </>
  );
}

export function MethodsSection({ number }: { number: string }) {
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
      className="g-com-section g-com-methods"
      id="methods"
      aria-labelledby="g-com-methods-title"
    >
      <div className="g-com-section-heading">
        <div>
          <p className="g-com-eyebrow">
            {number} / {t.kicker}
          </p>
          <h2 id="g-com-methods-title">{t.title}</h2>
        </div>
        <p>{t.lead}</p>
      </div>

      <div className="g-mth-tools">
        <fieldset className="g-mth-filters" aria-label={t.filtersLabel}>
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
        <label className="g-mth-search">
          <Search size={18} aria-hidden="true" />
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={t.search}
            aria-label={t.searchLabel}
          />
        </label>
        <output className="g-mth-count" aria-live="polite">
          {total} {t.count}
          {needle ? ` · 搜索「${query.trim()}」` : ''}
        </output>
      </div>

      {cards.length > 0 ? (
        <ul className="g-com-m-grid">
          {cards.map((item) =>
            'medium' in item ? (
              <ArtistCard key={item.slug} skill={item} />
            ) : (
              <TechniqueCard key={item.slug} entry={item} />
            ),
          )}
        </ul>
      ) : null}

      {browsing ? (
        <button
          type="button"
          className="g-com-m-more"
          aria-expanded={all}
          onClick={() => setAll((value) => !value)}
        >
          {all ? t.less : t.more}
        </button>
      ) : null}

      {resources.length > 0 ? (
        browsing ? (
          <details className="g-com-m-resources">
            <summary>
              {resources.length} {t.resources.count}
              <small>{t.resources.note}</small>
              <Plus size={18} aria-hidden="true" />
            </summary>
            <div className="g-mth-resources">
              <ResourceRows items={resources} />
            </div>
          </details>
        ) : (
          <div className="g-mth-resources">
            <ResourceRows items={resources} />
          </div>
        )
      ) : null}

      {artists.length > 0 ? (
        <p className="g-com-m-disclosure">{t.disclosure}</p>
      ) : null}

      {total === 0 ? (
        <div className="g-mth-empty">
          <strong>{t.empty.title}</strong>
          <p>{t.empty.text}</p>
          <button
            type="button"
            className="g-btn"
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
