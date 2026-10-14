'use client';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { folioEssayAuthor, folioStudio } from '../../../../../content/folio';
import { Phrases, Shell, type Vars } from '../kit';
import { essayHref } from '../routes';
import { essayEntry, pad } from './meta';
import './essays.css';

// 文章目录：美术馆的阅览室，目录排成一本展览图录。每条是一行精确的排印：编号、标题与副题、摘要、
// 作者 · 栏目 · 篇幅。整行由标题链接用伪元素铺满，作者名浮在上面单独去公众号，避免链接套链接（Folio A10）。
// 悬停或键盘聚焦时，这一行像被墙上的灯照亮：一块浅墙色的面板亮起来，标题往右挪一点，箭头转向。

export default function GalleryEssays() {
  const { essays, labels } = folioStudio;
  const entries = essays.items.map((item) => essayEntry(item.slug));
  return (
    <Shell current="essays" mainClassName="g-essay-index">
      <header className="g-essay-head">
        <p className="g-essay-head-top" aria-hidden="true">
          <span className="g-soft" lang="en">
            Reading Room
          </span>
          <span lang="en">
            Nos. {pad(0)}–{pad(entries.length - 1)}
          </span>
        </p>
        <h1 id="g-essay-index-title" className="g-essay-head-title">
          <span lang="en">{labels.essays.en}</span>
          <small>{labels.essays.zh}</small>
        </h1>
      </header>

      <ol className="g-essay-list">
        {entries.map((entry) => (
          <li
            key={entry.slug}
            data-reveal
            style={{ '--delay': `${entry.index * 120}ms` } as Vars}
          >
            <article className="g-essay-entry">
              <span className="g-essay-entry-no g-soft" aria-hidden="true">
                {entry.number}
              </span>
              <h2 className="g-essay-entry-title">
                <Link
                  className="g-essay-entry-link"
                  href={essayHref(entry.slug)}
                >
                  <span className="g-essay-entry-main">{entry.title}</span>
                  {entry.subtitle ? (
                    <span className="g-essay-entry-sub">{entry.subtitle}</span>
                  ) : null}
                </Link>
              </h2>
              <div className="g-essay-entry-side">
                <p className="g-essay-entry-text">
                  <Phrases text={entry.item.description} />
                </p>
                <p className="g-essay-entry-meta">
                  <a
                    className="g-essay-author"
                    href={folioEssayAuthor.href}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={essays.author + folioEssayAuthor.labelSuffix}
                  >
                    {essays.author}
                    <ArrowUpRight size={12} aria-hidden="true" />
                  </a>
                  <span>{entry.story.label}</span>
                  <span>
                    {entry.minutes} {essays.read}
                  </span>
                </p>
              </div>
              <span className="g-essay-entry-go" aria-hidden="true">
                <ArrowUpRight size={20} />
              </span>
            </article>
          </li>
        ))}
      </ol>
    </Shell>
  );
}
