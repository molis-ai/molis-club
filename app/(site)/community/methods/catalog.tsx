'use client';
import Link from 'next/link';
import { useState } from 'react';
import { ArrowRight, Search } from 'lucide-react';
import { artistSkills, type ArtistSkill } from '../../../../content/artists';
import {
  filterKnowledge,
  isResourceEntry,
  knowledge,
  knowledgePrompt,
  resourceGroupLabels,
  resourceGuide,
  type ResourceEntry,
  type ResourceGroup,
  type TechniqueEntry,
} from '../../../../content/knowledge';
import {
  community,
  methodText,
  skillZipKb,
  works,
} from '../../../../content/site/community';
import {
  artistHref,
  contactHref,
  METHODS,
  methodHref,
} from '../../../_site/routes';
import { More, Note, pad, artistImage } from '../../../_site/ui';
import { CopyAction, SkillDownload } from '../copy';
import { MethodDemo } from '../method-demo';

// 方法目录：分类签 + 搜索，结果按「艺术家 Skill / 网页与动效 / 组件来源」三段排。
// 没有 JS 时它就是一个 GET 表单，服务端按 ?q=&type= 筛好再给出来；有 JS 时就地筛，地址栏跟着改，方便分享。

export type CatalogType = 'all' | 'artists' | 'web' | 'sources';

const groupOrder: ResourceGroup[] = ['micro', 'polish', 'inspiration'];

function matchesArtist(skill: ArtistSkill, needle: string) {
  return `${skill.name} ${skill.english} ${skill.medium} ${skill.description} ${skill.use}`
    .toLowerCase()
    .includes(needle);
}

/** 按搜索词筛出三类；类别筛选在外面做（分类签上的数字要用到全部三类） */
function searchMethods(query: string) {
  const needle = query.trim().toLowerCase();
  const entries = filterKnowledge(knowledge, needle, '全部');
  return {
    artists: artistSkills.filter((skill) => matchesArtist(skill, needle)),
    web: entries.filter(
      (entry): entry is TechniqueEntry => !isResourceEntry(entry),
    ),
    sources: entries.filter(isResourceEntry),
  };
}

function ArtistCard({ skill }: { skill: ArtistSkill }) {
  const t = methodText;
  return (
    <li className="m-mth-card">
      <Link
        href={artistHref(skill.slug)}
        className="m-mth-card-art"
        tabIndex={-1}
        aria-hidden="true"
      >
        {skill.image ? (
          <img
            {...artistImage(
              skill.slug,
              skill,
              '(max-width: 900px) 100vw, 30vw',
            )}
            alt=""
            loading="lazy"
            decoding="async"
          />
        ) : (
          <span className="m-mth-cover">
            <em lang="en">
              {t.artist.noImage.lines.map((line) => (
                <span key={line}>{line}</span>
              ))}
            </em>
            <p>{t.artist.noImage.text}</p>
          </span>
        )}
      </Link>
      <div className="m-mth-card-body">
        <p className="m-tagline">
          <span>{skill.medium}</span>
          <span lang="en">{skill.english}</span>
        </p>
        <h3>
          <Link href={artistHref(skill.slug)}>{skill.name}</Link>
        </h3>
        <p>{skill.description}</p>
        {skill.image ? (
          <p>
            <Note>{works.artist.sampleNote}</Note>
          </p>
        ) : null}
        <div className="m-mth-card-actions">
          <SkillDownload
            slug={skill.slug}
            kb={skillZipKb[skill.slug]}
            label={t.download}
          />
          <More
            href={artistHref(skill.slug)}
            label={`${t.detail}：${skill.name}`}
          />
        </div>
      </div>
    </li>
  );
}

function TechniqueCard({ entry }: { entry: TechniqueEntry }) {
  return (
    <li className="m-mth-card">
      <MethodDemo entry={entry} compact />
      <div className="m-mth-card-body">
        <p className="m-tagline">
          <span>{methodText.kinds[entry.category]}</span>
        </p>
        <h3>
          <Link href={methodHref(entry.slug)}>{entry.name}</Link>
        </h3>
        <p>{entry.description}</p>
        <div className="m-mth-card-actions">
          <CopyAction
            id={`${entry.slug}-prompt`}
            text={knowledgePrompt(entry)}
            label={methodText.copy}
            topic="share-method"
          />
          <More
            href={methodHref(entry.slug)}
            label={`${methodText.detail}：${entry.name}`}
          />
        </div>
      </div>
    </li>
  );
}

function SourceRows({ items }: { items: ResourceEntry[] }) {
  return (
    <>
      {groupOrder.map((group) => {
        const rows = items.filter((entry) => entry.group === group);
        if (rows.length === 0) return null;
        return (
          <section key={group} className="m-mth-source-group">
            <h3>
              {resourceGroupLabels[group].title}
              <span className="num">{rows.length}</span>
            </h3>
            <ul className="m-mth-rows">
              {rows.map((entry) => (
                <li key={entry.slug}>
                  <Link href={methodHref(entry.slug)}>
                    <b>{entry.name}</b>
                    <i lang="en">{entry.english}</i>
                    <p>{entry.description}</p>
                    <ArrowRight size={15} aria-hidden="true" />
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

function GroupHead({
  no,
  id,
  title,
  note,
}: {
  no: number;
  id: string;
  title: string;
  note?: string;
}) {
  return (
    <div className="m-mth-group-head">
      <h2 id={id}>
        <span className="m-no" aria-hidden="true">
          {pad(no)}
        </span>
        {title}
      </h2>
      {note ? <p>{note}</p> : null}
    </div>
  );
}

export function Catalog({
  initialQuery,
  initialType,
}: {
  initialQuery: string;
  initialType: CatalogType;
}) {
  const t = methodText;
  const [query, setQuery] = useState(initialQuery);
  const [type, setType] = useState<CatalogType>(initialType);
  const found = searchMethods(query);
  const counts: Record<CatalogType, number> = {
    all: found.artists.length + found.web.length + found.sources.length,
    artists: found.artists.length,
    web: found.web.length,
    sources: found.sources.length,
  };
  const show = (kind: Exclude<CatalogType, 'all'>) =>
    (type === 'all' || type === kind) && found[kind].length > 0;
  const total = counts[type];
  const searching = query.trim();

  /** 地址栏跟着改（不重新载入），复制下来的链接打开就是同一份结果 */
  const sync = (nextQuery: string, nextType: CatalogType) => {
    const params = new URLSearchParams();
    if (nextQuery.trim()) params.set('q', nextQuery.trim());
    if (nextType !== 'all') params.set('type', nextType);
    const search = params.toString();
    window.history.replaceState(
      window.history.state,
      '',
      search ? `${METHODS}?${search}` : METHODS,
    );
  };
  const choose = (next: CatalogType) => {
    setType(next);
    sync(query, next);
  };
  const reset = () => {
    setQuery('');
    setType('all');
    sync('', 'all');
  };

  return (
    <>
      <form
        className="m-mth-tools"
        method="get"
        action={METHODS}
        aria-label={t.searchLabel}
        onSubmit={(event) => event.preventDefault()}
      >
        {/* 没有 JS 时：回车提交搜索词并保留当前类别；点分类签提交那一类（取最后一个 type） */}
        <input type="hidden" name="type" value={type} />
        <label className="m-mth-search">
          <Search size={15} aria-hidden="true" />
          <span className="sr-only">{t.searchLabel}</span>
          <input
            type="search"
            name="q"
            value={query}
            placeholder={t.search}
            autoComplete="off"
            onChange={(event) => {
              setQuery(event.target.value);
              sync(event.target.value, type);
            }}
          />
          <button type="submit" className="m-link">
            {t.searchButton}
          </button>
        </label>
        <fieldset className="m-mth-filters">
          <legend className="sr-only">{t.filtersLabel}</legend>
          {t.filters.map((filter) => {
            const id = filter.id as CatalogType;
            return (
              <button
                key={id}
                type="submit"
                name="type"
                value={id}
                aria-pressed={type === id}
                onClick={(event) => {
                  event.preventDefault();
                  choose(id);
                }}
              >
                {filter.label}
                <small className="num">{counts[id]}</small>
              </button>
            );
          })}
        </fieldset>
        <output className="m-mth-count" aria-live="polite">
          {total} {t.count}
          {searching ? ` · ${t.searching}「${searching}」` : ''}
        </output>
      </form>

      {show('artists') ? (
        <section className="m-mth-group" aria-labelledby="mth-artists">
          <GroupHead
            no={1}
            id="mth-artists"
            title={t.groups.artists}
            note={`${community.methods.tools}${community.methods.disclosure}`}
          />
          <ul className="m-mth-cards">
            {found.artists.map((skill) => (
              <ArtistCard key={skill.slug} skill={skill} />
            ))}
          </ul>
          <p className="m-mth-share">
            {t.shareArtist}
            <Link className="m-inline" href={contactHref('share-artist')}>
              {t.shareLink}
            </Link>
          </p>
        </section>
      ) : null}

      {show('web') ? (
        <section className="m-mth-group" aria-labelledby="mth-web">
          <GroupHead
            no={2}
            id="mth-web"
            title={t.groups.web}
            note={community.methods.web}
          />
          <ul className="m-mth-cards">
            {found.web.map((entry) => (
              <TechniqueCard key={entry.slug} entry={entry} />
            ))}
          </ul>
          <p className="m-mth-share">
            {t.shareMethod}
            <Link className="m-inline" href={contactHref('share-method')}>
              {t.shareLink}
            </Link>
          </p>
        </section>
      ) : null}

      {show('sources') ? (
        <section className="m-mth-group" aria-labelledby="mth-sources">
          <GroupHead
            no={3}
            id="mth-sources"
            title={t.groups.sources}
            note={community.methods.resources}
          />
          {searching ? null : (
            <div className="m-mth-guide">
              <p>{resourceGuide.playful}</p>
              <p>{resourceGuide.quiet}</p>
              <p className="m-mth-caveat">{resourceGuide.caveat}</p>
            </div>
          )}
          <SourceRows items={found.sources} />
        </section>
      ) : null}

      {total === 0 ? (
        <div className="m-mth-empty">
          <strong>{t.empty.title}</strong>
          <p>{t.empty.text}</p>
          <a
            className="m-btn"
            href={METHODS}
            onClick={(event) => {
              event.preventDefault();
              reset();
            }}
          >
            {t.empty.reset}
          </a>
        </div>
      ) : null}
    </>
  );
}
