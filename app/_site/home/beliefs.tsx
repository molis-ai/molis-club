import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { studio } from '../../../content/site/studio';
import { homeBeliefs } from '../../../content/site/home';
import { ABOUT } from '../routes';
import { pad, Phrases, type Vars } from '../ui';

// 首页第四段：我们相信。纯白，六条信念只放加粗的那一句，大字；
// 每一句滚到视口中间时从浅灰变成墨色（各自一个 data-scene，读 --p）。没有 JS、减少动态时直接是墨色。
export function Beliefs() {
  return (
    <section className="m-beliefs" aria-labelledby="m-beliefs-title" data-tone="paper">
      <div className="m-wrap">
        <header className="m-beliefs-head" data-reveal>
          <p className="m-kicker" lang="en">
            {homeBeliefs.kicker}
          </p>
          <h2 id="m-beliefs-title">{homeBeliefs.title}</h2>
        </header>
        <ol className="m-beliefs-list">
          {studio.beliefs.map((belief, index) => (
            <li key={belief.title} data-scene style={{ '--i': index } as Vars}>
              <span className="m-no" aria-hidden="true">
                {pad(index + 1)}
              </span>
              <p>
                <Phrases text={belief.title} />
              </p>
            </li>
          ))}
        </ol>
        <p className="m-beliefs-more" data-reveal>
          <Link className="m-link" href={`${ABOUT}#beliefs`} data-dir="right">
            {homeBeliefs.more}
            <ArrowRight size={13} aria-hidden="true" />
          </Link>
        </p>
      </div>
    </section>
  );
}
