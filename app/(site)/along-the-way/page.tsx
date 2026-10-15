import { pageMetadata } from '../../../lib/site';
import { along, alongGroups, alongUi } from '../../../content/site/along';
import { ABOUT, ALONG } from '../../_site/routes';
import { More, Phrases, type Vars } from '../../_site/ui';
import { AlongIndex } from './index-list';
import './along.css';

const total = alongGroups.reduce((sum, group) => sum + group.items.length, 0);

export const metadata = pageMetadata(
  `沿途 · ${along.title}`,
  along.intro[1],
  ALONG,
);

// 沿途：像一本图录的索引页，没有配图。附录 A 的开头两段 → 八组、每件一行（名字、它关心的问题、现在在哪）→ 结尾一段。
// 大胆的一处：首屏右边一个超大的件数，像图录封底印的「共收录」。
export default function AlongPage() {
  return (
    <div className="m-along">
      <header className="m-wrap m-top">
        <div className="m-head m-along-head">
          <p className="m-head-meta m-rise">
            <span className="m-no" aria-hidden="true">
              A
            </span>
            <span className="m-kicker">{along.kicker}</span>
          </p>
          <h1
            className="m-head-title m-rise"
            style={{ '--delay': '80ms' } as Vars}
          >
            <Phrases text={along.title} />
          </h1>
          <div
            className="m-head-lead m-along-intro m-rise"
            style={{ '--delay': '160ms' } as Vars}
          >
            {along.intro.map((text) => (
              <p key={text}>{text}</p>
            ))}
          </div>
          <p
            className="m-along-total m-rise"
            style={{ '--delay': '240ms' } as Vars}
          >
            <span className="num">{total}</span>
            <small>{alongUi.count}</small>
          </p>
        </div>
      </header>

      <AlongIndex />

      <div className="m-wrap m-along-outro">
        <div className="m-along-outro-inner" data-reveal>
          <p>{along.outro}</p>
          <More href={ABOUT}>{alongUi.back}</More>
        </div>
      </div>
    </div>
  );
}
