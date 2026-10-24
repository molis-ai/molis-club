'use client';
import {
  Fragment,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from 'react';
import { community, works } from '../../../content/site/community';
import { Phrases, Status } from '../../_site/ui';
import { FlowerStage, FlowerSteps, FlowerTake } from './flower';
import {
  ArtistStage,
  ArtistText,
  DropStage,
  DropText,
  NiulStage,
  NiulText,
  techniques,
  WebStage,
  WebText,
} from './works';

// 改版前的作品画廊，留在 ?works=current 给负责人对照（2026-10-24）；负责人挑定后删掉其中一版。
// 五件作品一个画廊（DESIGN.md「同类内容同一种看法」，负责人 2026-10-22）：在一个位置看完每一件。
// 宽屏、有 JS：左边一扇窗钉住，右边每件一屏，顺着原生滚动走；哪一件走到视口中间，窗里就换成哪一件。
// 窗里是作品本身（花、AI 试样、现场演示、示意演示），右边是名称 · 形态 · 阶段、想解决什么、怎么做、带走。
// 窄屏、没有 JS、打印：每件的窗挂在自己的字上方，一件接一件往下读。
// 字在前、窗在后（DOM 顺序）：键盘从一件的按钮往下走，先进它自己的窗；聚焦到哪一件，窗就先换过去。
// 不劫持滚动，只读位置；减少动态时换窗没有淡入淡出。

type Work = {
  id: keyof typeof works;
  stage: ReactNode;
  text: ReactNode;
};

export function WorksGalleryCurrent() {
  const [active, setActive] = useState(0);
  const [artist, setArtist] = useState(0);
  const [web, setWeb] = useState(techniques[0].slug);
  const [hold, setHold] = useState<number | null>(null);
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const node = root.current;
    if (!node) return;
    const rows = Array.from(
      node.querySelectorAll<HTMLElement>('.m-com-work'),
    );
    // 视口正中一条窄带：哪一件压在带上，就是哪一件
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries)
          if (entry.isIntersecting)
            setActive(rows.indexOf(entry.target as HTMLElement));
      },
      { rootMargin: '-48% 0px -48% 0px' },
    );
    rows.forEach((row) => observer.observe(row));
    return () => observer.disconnect();
  }, []);

  const list: Work[] = [
    {
      id: 'flower',
      stage: <FlowerStage />,
      text: (
        <>
          <p className="m-com-work-lead">{community.try.flower[0]}</p>
          <FlowerSteps />
          <FlowerTake />
        </>
      ),
    },
    {
      id: 'artist',
      stage: <ArtistStage index={artist} onPick={setArtist} />,
      text: <ArtistText index={artist} />,
    },
    {
      id: 'web',
      stage: <WebStage slug={web} onPick={setWeb} />,
      text: <WebText slug={web} />,
    },
    {
      id: 'niul',
      stage: <NiulStage on={active === 3} />,
      text: <NiulText />,
    },
    {
      id: 'drop',
      stage: <DropStage on={active === 4} hold={hold} onHold={setHold} />,
      text: <DropText />,
    },
  ];

  return (
    <div className="m-com-gallery" ref={root}>
      <header className="m-com-gallery-head" data-reveal>
        <h2 id="works-title" className="m-com-h2">
          <Phrases text={community.try.title} />
        </h2>
        <p className="m-com-gallery-lead">{community.try.lead}</p>
      </header>
      {list.map((work, index) => {
        const t = works[work.id];
        const on = index === active;
        const row = { '--row': index + 2 } as CSSProperties;
        return (
          <Fragment key={work.id}>
            <article
              className="m-com-work"
              data-work={work.id}
              data-on={on || undefined}
              aria-labelledby={`work-${work.id}`}
              style={row}
              onFocusCapture={() => setActive(index)}
            >
              <div className="m-com-work-in">
                <header className="m-com-work-head">
                  <h3 id={`work-${work.id}`} className="m-com-work-name">
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
                {work.text}
              </div>
            </article>
            <figure
              className="m-com-still"
              data-work={work.id}
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
  );
}
