import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { pageMetadata } from '../../../lib/site';
import {
  AUTHOR,
  essayLength,
  essaySections,
  essays,
  essaysPage,
  essayUi,
  excerpts,
  splitTitle,
} from '../../../content/site/essays';
import { ESSAYS, essayHref } from '../../_site/routes';
import { pad, Phrases, type Vars } from '../../_site/ui';
import './essays.css';

export const metadata = pageMetadata(
  essaysPage.kicker,
  essaysPage.lead,
  ESSAYS,
);

// 文章：像一本图录的目录。左边超大的斜体篇号，中间标题与一句摘句（文章自己的问题，当勾子），
// 下面一条「本篇脉络」：这篇的小标题串成一条线，一眼看出它怎么走；右边作者、篇幅与入口；没有配图。
export default function EssaysPage() {
  return (
    <div className="m-essays">
      <header className="m-wrap m-top">
        <div className="m-head">
          <p className="m-head-meta m-rise">
            <span className="m-kicker">{essaysPage.kicker}</span>
          </p>
          <h1
            className="m-head-title m-essays-title m-rise"
            style={{ '--delay': '80ms' } as Vars}
          >
            <Phrases text={essaysPage.title} />
          </h1>
          <p
            className="m-head-lead m-rise"
            style={{ '--delay': '160ms' } as Vars}
          >
            {essaysPage.lead}
          </p>
        </div>
      </header>

      <ol className="m-wrap m-essays-list">
        {essays.map((story, index) => {
          const { main, sub } = splitTitle(story.title);
          const { words, minutes } = essayLength(story.body);
          return (
            <li
              key={story.slug}
              className="m-essays-item"
              data-reveal
              style={{ '--delay': `${index * 90}ms` } as Vars}
            >
              <span className="m-essays-no num" aria-hidden="true">
                {pad(index + 1)}
              </span>
              <div className="m-essays-copy">
                <p className="m-kicker">{story.label}</p>
                <h2 className="m-essays-name">
                  <Link href={essayHref(story.slug)}>
                    <span className="m-essays-main">{main}</span>
                    {sub ? (
                      <>
                        <span className="sr-only">：</span>
                        <span className="m-essays-sub">{sub}</span>
                      </>
                    ) : null}
                  </Link>
                </h2>
                <p className="m-essays-excerpt">{excerpts[story.slug]}</p>
              </div>
              <ol className="m-essays-spine" aria-label={essayUi.toc}>
                {essaySections(story.body).map((title, at) => (
                  <li key={title} style={{ '--i': at } as Vars}>
                    {title}
                  </li>
                ))}
              </ol>
              <p className="m-essays-meta">
                <span>{AUTHOR}</span>
                <span className="num">{essayUi.words(words)}</span>
                <span className="num">{essayUi.minutes(minutes)}</span>
                <span className="m-essays-go" aria-hidden="true">
                  {essayUi.read}
                  <ArrowRight size={13} />
                </span>
              </p>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
