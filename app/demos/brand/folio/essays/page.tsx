'use client';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import stories from '../../../../../content/stories.json';
import { folioStudio } from '../../../../../content/folio';
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

/** 文章：标题在冒号处拆成大字和副题，悬停时一张色纸从左边铺进来 */
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
                <Link className="fo-essay" href={essayHref(item.slug)}>
                  <span className="fo-essay-number" aria-hidden="true">
                    {pad(index)}
                  </span>
                  <h2>
                    <span className="fo-essay-title">{title}</span>
                    {subtitle ? (
                      <span className="fo-essay-subtitle">{subtitle}</span>
                    ) : null}
                  </h2>
                  <div className="fo-essay-side">
                    <p>{item.description}</p>
                    <small>
                      {essays.author} · {story.label} ·{' '}
                      {Math.ceil(story.body.length / 500)} {essays.read}
                    </small>
                  </div>
                  <span className="fo-essay-go" aria-hidden="true">
                    <ArrowUpRight size={22} />
                  </span>
                </Link>
              </li>
            );
          })}
        </ol>
      </main>
      <Footer tone="paper" compact />
    </div>
  );
}
