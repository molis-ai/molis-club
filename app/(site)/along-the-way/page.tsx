import { pageMetadata } from '../../../lib/site';
import { along, alongGroups, alongUi } from '../../../content/site/along';
import { ABOUT, ALONG } from '../../_site/routes';
import { More, Phrases, type Vars } from '../../_site/ui';
import { Fold, Paragraphs } from '../../_site/viz/viz';
import { AlongMap } from './along-map';
import './along.css';

const total = alongGroups.reduce((sum, group) => sum + group.items.length, 0);

export const metadata = pageMetadata(
  `沿途 · ${along.title}`,
  along.intro[1],
  ALONG,
);

// 沿途（visual-storyboard 第 3 节）：一个大数字、一条河、一本索引。
// 首屏：「那些具体的尝试」+ 超大的件数 + 一句（附录 A 第二段第一句），开头两段原文收进「展开看全文」；
// 河：54 件尝试从八个源头流到七个去处；索引：八组、每件一行，可按去处筛选、每行可展开。
export default function AlongPage() {
  return (
    <div className="m-along">
      <header className="m-wrap m-top m-along-top">
        <p className="m-along-meta m-rise">
          <span className="m-no" aria-hidden="true">
            A
          </span>
          <span className="m-kicker">{along.kicker}</span>
        </p>
        <h1
          className="m-along-title m-rise"
          style={{ '--delay': '80ms' } as Vars}
        >
          <Phrases text={along.title} />
        </h1>
        <p
          className="m-along-total m-rise"
          style={{ '--delay': '140ms' } as Vars}
        >
          <span className="num">{total}</span>
          <small>{alongUi.count}</small>
        </p>
        <div
          className="m-along-hook m-rise"
          style={{ '--delay': '200ms' } as Vars}
        >
          <p>
            <Phrases text={along.hook} />
          </p>
          <Fold summary={alongUi.fullIntro}>
            <Paragraphs items={along.intro} />
          </Fold>
        </div>
      </header>

      <AlongMap />

      <div className="m-wrap m-along-outro">
        <div className="m-along-outro-inner" data-reveal>
          <p>{along.outro}</p>
          <More href={ABOUT}>{alongUi.back}</More>
        </div>
      </div>
    </div>
  );
}
