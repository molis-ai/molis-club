'use client';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import stories from '../../../../../content/stories.json';
import { folioEssayAuthor, folioStudio } from '../../../../../content/folio';
import { pad } from '../kit';
import {
  Footer,
  SiteHeader,
  essayHref,
  useFolioMotion,
  type Vars,
} from '../shared';
import '../folio.css';
import '../home.css';

/**
 * 文章：标题在冒号处拆成大字和副题，悬停时一张色纸从左边铺进来。
 * 整行由标题链接铺满（伪元素），作者名单独链到公众号，避免链接套链接。
 */
export default function EssaysPage() {
  const rootRef = useFolioMotion();
  const { essays } = folioStudio;
  return (
    <div className="fo-site" ref={rootRef}>
      <SiteHeader current="essays" />
      <main id="main" className="fo-essays" aria-labelledby="fo-essays-title">
        <header className="fo-label" data-reveal>
          <h1 id="fo-essays-title">
            <span lang="en">{folioStudio.labels.essays.en}</span>
            <small>{folioStudio.labels.essays.zh}</small>
          </h1>
        </header>
        <ol className="fo-essay-list">
          {essays.items.map((item, index) => {
            const story = stories.find((entry) => entry.slug === item.slug)!;
            const [title, subtitle] = story.title.split('：');
            return (
              <li key={item.slug} data-reveal style={{ '--i': index } as Vars}>
                <article className="fo-essay">
                  <span className="fo-essay-number" aria-hidden="true">
                    {pad(index)}
                  </span>
                  <h2>
                    <Link className="fo-essay-link" href={essayHref(item.slug)}>
                      <span className="fo-essay-title">{title}</span>
                      {subtitle ? (
                        <span className="fo-essay-subtitle">{subtitle}</span>
                      ) : null}
                    </Link>
                  </h2>
                  <div className="fo-essay-side">
                    <p>{item.description}</p>
                    <small>
                      <a
                        className="fo-essay-author"
                        href={folioEssayAuthor.href}
                        target="_blank"
                        rel="noreferrer"
                        aria-label={
                          essays.author + folioEssayAuthor.labelSuffix
                        }
                      >
                        {essays.author}
                        <ArrowUpRight size={12} aria-hidden="true" />
                      </a>{' '}
                      · {story.label} · {Math.ceil(story.body.length / 500)}{' '}
                      {essays.read}
                    </small>
                  </div>
                  <span className="fo-essay-go" aria-hidden="true">
                    <ArrowUpRight size={22} />
                  </span>
                </article>
              </li>
            );
          })}
        </ol>
      </main>
      <Footer tone="paper" compact />
    </div>
  );
}
