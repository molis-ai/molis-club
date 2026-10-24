'use client';
import {
  Fragment,
  useCallback,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from 'react';
import {
  appendixTools,
  community,
  communityUi,
  works,
} from '../../../content/site/community';
import { Status } from '../../_site/ui';
import { FlowerTake } from './flower';
import {
  ArtistWindow,
  DropWindow,
  FlowerWindow,
  NiulWindow,
  WebWindow,
} from './stages';
import {
  ArtistTake,
  DropTake,
  NiulTake,
  techniques,
  WebTake,
} from './works';

// 五件作品一个画廊（负责人 2026-10-24 定新版，D2）。
// 题目「从一个可以亲手试的作品开始」单独一屏开场。之后宽屏、有 JS：左边一扇大窗钉住（约六成宽、接近一屏高），
// 窗上一行五件作品的名字当位置提示（当前那件亮，点了跳过去；不编号，不是第二套目录）；
// 右边每件一屏，只留名称、形态 · 阶段、一句原句和按钮，「怎么做」挪进窗里演示（stages.tsx）。
// 作品名、屏标题、正文三档字号拉开。窄屏、没有 JS、打印：每件的窗挂在自己的字上方，一件接一件往下读。
// 字在前、窗在后（DOM 顺序）：键盘从一件的按钮往下走，先进它自己的窗；聚焦到哪一件，窗就先换过去。
// 不劫持滚动，只读位置；减少动态时换窗没有淡入淡出，点名字直接跳到那一件。

type Work = {
  id: keyof typeof works;
  /** 右边那一句原句 */
  lead: string;
  stage: ReactNode;
  take: ReactNode;
};

const WIDE = '(min-width: 901px)';

export function WorksGallery() {
  const [active, setActive] = useState(0);
  const [artist, setArtist] = useState(0);
  const [web, setWeb] = useState(techniques[0].slug);
  const [hold, setHold] = useState<number | null>(null);
  const root = useRef<HTMLDivElement>(null);
  const pickArtist = useCallback((index: number) => setArtist(index), []);

  useEffect(() => {
    const node = root.current;
    if (!node) return;
    const media = matchMedia(WIDE);
    let observer: IntersectionObserver | null = null;
    // 视口正中一条窄带：哪一件压在带上，就是哪一件。宽屏只看右边的字（窗都钉在同一处）；
    // 窄屏窗挂在字上方，窗先到正中也算轮到它
    const watch = () => {
      observer?.disconnect();
      const rows = Array.from(
        node.querySelectorAll<HTMLElement>(
          media.matches ? '.m-com-show' : '.m-com-show, .m-com-show-win',
        ),
      );
      observer = new IntersectionObserver(
        (entries) => {
          for (const entry of entries)
            if (entry.isIntersecting)
              setActive(
                Number((entry.target as HTMLElement).dataset.index ?? 0),
              );
        },
        { rootMargin: '-48% 0px -48% 0px' },
      );
      rows.forEach((row) => observer?.observe(row));
    };
    watch();
    media.addEventListener('change', watch);
    return () => {
      observer?.disconnect();
      media.removeEventListener('change', watch);
    };
  }, []);

  const list: Work[] = [
    {
      id: 'flower',
      lead: community.try.flower[0],
      stage: <FlowerWindow on={active === 0} />,
      take: <FlowerTake />,
    },
    {
      id: 'artist',
      lead: community.methods.artist[0],
      stage: (
        <ArtistWindow index={artist} onPick={pickArtist} on={active === 1} />
      ),
      take: <ArtistTake index={artist} />,
    },
    {
      id: 'web',
      lead: community.methods.web,
      stage: <WebWindow slug={web} onPick={setWeb} />,
      take: <WebTake slug={web} />,
    },
    {
      id: 'niul',
      lead: appendixTools.niul[0],
      stage: <NiulWindow on={active === 3} />,
      take: <NiulTake />,
    },
    {
      id: 'drop',
      lead: appendixTools.drop[0],
      stage: <DropWindow on={active === 4} hold={hold} onHold={setHold} />,
      take: (
        <>
          <DropTake />
          <p className="m-com-fine">{appendixTools.both}</p>
        </>
      ),
    },
  ];

  // 点名字：跳到那一件（它的字滚到视口里，窗跟着换）
  const go = (index: number) => {
    const row = root.current?.querySelectorAll<HTMLElement>('.m-com-show')[
      index
    ];
    if (!row) return;
    setActive(index);
    row.scrollIntoView({
      behavior: matchMedia('(prefers-reduced-motion: reduce)').matches
        ? 'instant'
        : 'smooth',
      block: 'start',
    });
    row.querySelector<HTMLElement>('h3')?.focus({ preventScroll: true });
  };

  return (
    <>
      <header className="m-com-shows-head" data-reveal>
        <h2 id="works-title" className="m-com-shows-title">
          {community.try.title.split(/(?<=可以)/).map((part) => (
            <span key={part}>{part}</span>
          ))}
        </h2>
        <p className="m-com-shows-lead">{community.try.lead}</p>
      </header>
      <div className="m-com-shows-body" ref={root}>
        <ul className="m-com-rail m-com-js" aria-label={communityUi.rail}>
          {list.map((work, index) => (
            <li key={work.id}>
              <button
                type="button"
                aria-current={index === active || undefined}
                lang={work.id === 'flower' ? undefined : 'en'}
                onClick={() => go(index)}
              >
                {works[work.id].name}
              </button>
            </li>
          ))}
        </ul>
        {list.map((work, index) => {
          const t = works[work.id];
          const on = index === active;
          const row = { '--row': index + 1 } as CSSProperties;
          return (
            <Fragment key={work.id}>
              <article
                className="m-com-show"
                data-work={work.id}
                data-index={index}
                data-on={on || undefined}
                aria-labelledby={`work-${work.id}`}
                style={row}
                onFocusCapture={() => setActive(index)}
              >
                <div className="m-com-show-in">
                  <header className="m-com-show-head">
                    <h3
                      id={`work-${work.id}`}
                      className="m-com-show-name"
                      tabIndex={-1}
                    >
                      <span lang={work.id === 'flower' ? undefined : 'en'}>
                        {t.name}
                      </span>
                      {'alias' in t ? <small>{t.alias}</small> : null}
                    </h3>
                    <p className="m-tagline">
                      <span>{t.form}</span>
                      <Status>{t.stage}</Status>
                    </p>
                  </header>
                  <p className="m-com-show-lead">{work.lead}</p>
                  {work.take}
                </div>
              </article>
              <figure
                className="m-com-show-win"
                data-work={work.id}
                data-index={index}
                data-on={on || undefined}
                aria-label={t.name}
                style={row}
              >
                {work.stage}
              </figure>
            </Fragment>
          );
        })}
      </div>
    </>
  );
}
