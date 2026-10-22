'use client';
import { useEffect, useRef } from 'react';
import { enterprise, type ViewId } from '../../../content/site/enterprise';
import { TEAM } from '../../_site/routes';
import { More, Phrases, type Vars } from '../../_site/ui';

// 为什么我们可以（负责人 2026-10-20 第五版：不要光标，从企业负责人的视角看——他想五秒内看到这些人的段位，
// 和一段业务从头到尾会不会在交接处断档）。
// 一张覆盖图，像一根绳：四个位置（5.5 导语原词）从左到右四列，顶上是客户会问的一句和 5.5 小标题；
// 九股经历（飞书履历，不写人名）一股一行：黑字是能力，一根线接着从它能顶上的第一个位置拉到最后一个，
// 下面的灰字是背书（在哪里、多久或多大、什么头衔，数字打头）——
// 没有哪股贯穿全程，叠起来就一处不断；线跨过列与列之间的缝时那一截是杏色，交接的地方有经历接着。
// 经历按起点从左往右排成一道台阶，左下空出来的那一角放导语第二句和「不是客户项目」。
// 字分四档（负责人 2026-10-20：要有区分度、更干净、留白更多）：标题 > 问句、结论 > 能力、小标题 > 背书、说明。
// 宽屏分两拍（2026-10-22：一屏放下全部太密，读起来像甘特图）：整节钉住一屏，
// 第一拍只有标题和四个位置——位置名和客户会问的一句，放大、落在屏幕中间；
// 贴住后再往下滚一小截转到第二拍：问句缩回列头、5.5 小标题浮上来，经历一股股从左画到右，两秒内画完就停，
// 左下那一角最后浮上来；往回滚到贴住的地方退回第一拍。
// 停在一列上只亮跨过它的经历，停在一股经历上亮它跨过的列。
// 窄屏（<1000）、减少动态与没有 JS 时不钉住：进屏画一遍就停（减少动态时就是画好的样子）；
// 窄屏不画线：四个位置两两一排，每股经历下面一条四格的小条标出它跨过哪几个位置。

const { why } = enterprise;
const seats = why.views.map((view) => view.id);
const seat = (id: ViewId) => seats.indexOf(id);

/** 左下那一角从哪一行起：前两列最后一股经历的下一行（第一行是位置，经历从第二行起） */
const corner =
  Math.max(
    ...why.strands.map((strand, row) => (seat(strand.from) <= 1 ? row : -1)),
  ) + 3;

/** 钉住时：贴住后滚过这一截（--pin）转到第二拍；往回滚到这一截以内退回第一拍 */
const TURN = 0.22;
const BACK = 0.05;

export function Why() {
  const section = useRef<HTMLElement>(null);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = section.current;
    const board = ref.current;
    if (!root || !board) return;
    const wide = matchMedia('(min-width: 1000px) and (min-height: 600px)');
    const still = matchMedia('(prefers-reduced-motion: reduce)');
    let seen: IntersectionObserver | undefined;
    let frame = 0;
    let beat = 0;

    const turn = (next: 1 | 2) => {
      if (next === beat) return;
      beat = next;
      board.toggleAttribute('data-wait', next === 1);
      board.toggleAttribute('data-draw', next === 2);
      root.dataset.beat = String(next);
    };
    const step = () => {
      frame = 0;
      const rect = root.getBoundingClientRect();
      const span = rect.height - window.innerHeight;
      const pin = span > 0 ? -rect.top / span : 0;
      if (pin >= TURN) turn(2);
      else if (pin <= BACK) turn(1);
    };
    const request = () => {
      if (!frame) frame = requestAnimationFrame(step);
    };
    // 第一拍：四个位置往下落到板子中间偏上，问句放大到最长那句正好撑满一列（只用 translate、scale，不动排版）
    const measure = () => {
      const seats = Array.from(
        board.querySelectorAll<HTMLElement>('.m-why-seat'),
      );
      const asks = Array.from(
        board.querySelectorAll<HTMLElement>('.m-why-seat-ask'),
      );
      const tall = Math.max(0, ...seats.map((seat) => seat.offsetHeight));
      const drop = Math.max(0, (board.offsetHeight - tall) * 0.4);
      const column = seats[0]?.offsetWidth ?? 0;
      const longest = Math.max(1, ...asks.map((ask) => ask.offsetWidth));
      const grow = Math.min(1.6, Math.max(1, (column * 0.94) / longest));
      board.style.setProperty('--drop', `${Math.round(drop)}px`);
      board.style.setProperty('--grow', grow.toFixed(3));
    };

    // 宽窄或减少动态变了，重新安排：宽屏钉住分两拍；其余进屏画一遍；减少动态时就是画好的样子
    const arrange = () => {
      seen?.disconnect();
      seen = undefined;
      window.removeEventListener('scroll', request);
      beat = 0;
      board.removeAttribute('data-wait');
      board.removeAttribute('data-draw');
      delete root.dataset.beat;
      const pinned = wide.matches && !still.matches;
      root.toggleAttribute('data-live', pinned);
      if (still.matches) return;
      if (pinned) {
        measure();
        window.addEventListener('scroll', request, { passive: true });
        request();
        return;
      }
      board.setAttribute('data-wait', '');
      seen = new IntersectionObserver(
        (entries) => {
          if (!entries.some((entry) => entry.isIntersecting)) return;
          seen?.disconnect();
          board.removeAttribute('data-wait');
          board.setAttribute('data-draw', '');
        },
        { threshold: 0.35 },
      );
      seen.observe(board);
    };

    arrange();
    const resized = new ResizeObserver(() => {
      if (root.hasAttribute('data-live')) measure();
      request();
    });
    resized.observe(board);
    wide.addEventListener('change', arrange);
    still.addEventListener('change', arrange);
    return () => {
      if (frame) cancelAnimationFrame(frame);
      seen?.disconnect();
      resized.disconnect();
      wide.removeEventListener('change', arrange);
      still.removeEventListener('change', arrange);
      window.removeEventListener('scroll', request);
    };
  }, []);

  return (
    <section
      ref={section}
      className="m-why m-wrap"
      id="people"
      aria-labelledby="why-title"
    >
      <div className="m-why-stick">
        <header className="m-ent-flow-head">
          <h2 className="m-ent-flow-title" id="why-title">
            {why.title}
          </h2>
          <p className="m-ent-flow-lead">
            <Phrases text={why.need} />
          </p>
        </header>

        <div
          ref={ref}
          className="m-why-board"
          style={{ '--rows': why.strands.length, '--corner': corner } as Vars}
        >
          {/* 四列的底：平时看不见，停在上面时染一点杏色；前两列停在左下那一角上面，不把收尾染进去 */}
          {seats.map((id, index) => (
            <i
              key={id}
              className="m-why-lane"
              data-lane={index}
              style={
                {
                  '--col': index + 1,
                  '--end': index <= 1 ? corner : -1,
                } as Vars
              }
              aria-hidden="true"
            />
          ))}

          <ol className="m-why-seats">
            {why.views.map((view, index) => (
              <li
                key={view.id}
                className="m-why-seat"
                data-lane={index}
                style={{ '--i': index, '--col': index + 1 } as Vars}
              >
                <h3 className="m-why-seat-label">{view.label}</h3>
                <p className="m-why-seat-ask">{view.ask}</p>
                <p className="m-why-seat-title">{view.title}</p>
              </li>
            ))}
          </ol>

          {/* 窄屏：四格小条上面的位置名 */}
          <p className="m-why-axis" aria-hidden="true">
            {why.views.map((view) => (
              <span key={view.id}>{view.label}</span>
            ))}
          </p>

          <ul className="m-why-strands">
            {why.strands.map((strand, row) => {
              const from = seat(strand.from);
              const to = seat(strand.to);
              const span = to - from + 1;
              const covers = seats.slice(from, to + 1).map(seat);
              return (
                <li
                  key={strand.id}
                  className="m-why-strand"
                  data-covers={covers.join(' ')}
                  style={
                    {
                      '--a': from + 1,
                      '--b': to + 2,
                      '--r': row + 2,
                      '--span': span,
                      '--row': row,
                    } as Vars
                  }
                >
                  {/* 黑字是能力，线接着拉到最后一列；灰字是背书，数字打头 */}
                  <p className="m-why-strand-head">
                    <span className="m-why-strand-title">{strand.title}</span>
                    <span className="m-why-line" aria-hidden="true" />
                  </p>
                  <p className="m-why-strand-detail">
                    {strand.figure ? (
                      <b className="m-why-figure">{strand.figure}</b>
                    ) : null}
                    {strand.proof}
                    <span className="sr-only">
                      （
                      {covers.map((index) => why.views[index].label).join('、')}
                      ）
                    </span>
                  </p>
                  {/* 跨过列与列之间的缝的那几截 */}
                  <span className="m-why-knots" aria-hidden="true">
                    {Array.from({ length: span - 1 }, (_, k) => (
                      <i key={k} style={{ '--k': k + 1 } as Vars} />
                    ))}
                  </span>
                  {/* 窄屏：四格小条 */}
                  <span className="m-why-cells" aria-hidden="true">
                    {seats.map((id, index) => (
                      <i
                        key={id}
                        data-on={(index >= from && index <= to) || undefined}
                      />
                    ))}
                  </span>
                </li>
              );
            })}
          </ul>

          {/* 左下那一角：导语第二句、说明与「认识我们」 */}
          <footer className="m-why-end">
            <p className="m-why-close">
              <Phrases text={why.close} />
            </p>
            <p className="m-why-note">
              <Phrases text={why.note} />
            </p>
            <More href={TEAM}>{why.link}</More>
          </footer>
        </div>
      </div>
    </section>
  );
}
