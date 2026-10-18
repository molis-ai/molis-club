import {
  ArrowRight,
  CalendarDays,
  Check,
  Copy,
  Eraser,
  FileDown,
  Hash,
  Image as ImageIcon,
  Scale,
  Scissors,
  Table2,
} from 'lucide-react';
import type { ReactNode } from 'react';
import { paper, wall } from '../../../content/site/tool';
import { mediaOf, pad, Phrases, type Vars } from '../../_site/ui';
import { Mine } from './mine';

// 一面白墙：一个下午，五站，一次只看一站。每站左边是时间与一句原句，右边是一件放大了的「样品」：
// 字本身就是材料，选中色像那道光铺过去，动作条按真实的大小出现，结果留在原处。
// 宽屏、有 JS、不减少动态时：这一段钉住，往下滚墙往左走（只读原生滚动写进的 --pin，不劫持）；
// 每站的 --l 从 0 走到 1，样品里的东西按 --t 一件件出现，可以倒回。
// 手机、减少动态、没有 JS：五站竖着排，每站直接是完整的结果。墙上的东西都是界面示意，材料是示例数据。

/** 每一站在 --pin 的哪一段演完（墙在 0.12…0.92 之间走完，五站依次居中在 0.12 / 0.32 / 0.52 / 0.72 / 0.92） */
const stations = [
  { from: 0, len: 0.11 },
  { from: 0.17, len: 0.14 },
  { from: 0.37, len: 0.14 },
  { from: 0.57, len: 0.14 },
  { from: 0.77, len: 0.14 },
];
const times = [
  wall.oldWay.time,
  wall.small.time,
  wall.chain.time,
  wall.later.time,
  '',
];

const t = (value: number, extra?: Vars): Vars => ({ '--t': value, ...extra });

function Station({
  index,
  time,
  title,
  line,
  children,
  className,
  decorative = true,
}: {
  index: number;
  time: string;
  title: string;
  line?: string;
  children: ReactNode;
  className: string;
  /** 墙上的样品只给眼睛看（读屏读左边的字）；墙尾那几句是正文 */
  decorative?: boolean;
}) {
  const { from, len } = stations[index];
  return (
    <li
      className={`tw-st ${className}`}
      style={{ '--from': from, '--len': len } as Vars}
    >
      <div className="tw-st-in">
        <div className="tw-st-copy">
          {time ? (
            <p className="tw-st-time">
              <span className="m-no" aria-hidden="true">
                {pad(index + 1)}
              </span>
              <time className="num">{time}</time>
            </p>
          ) : null}
          <h3 className="tw-st-title">
            <Phrases text={title} />
          </h3>
          {line ? <p className="tw-st-line">{line}</p> : null}
        </div>
        <div className="tw-st-ex" aria-hidden={decorative || undefined}>
          {children}
        </div>
      </div>
    </li>
  );
}

/** 动作条：和整页选中时出现的那一条同一个样子，按真实大小画 */
function Pop({
  items,
  style,
  className = '',
}: {
  items: { icon: typeof Hash; label: string; ai?: boolean; on?: boolean }[];
  style?: Vars;
  className?: string;
}) {
  return (
    <span className={`tw-pop tw-in ${className}`} style={style}>
      {items.map(({ icon: Icon, label, ai, on }) => (
        <span key={label} data-on={on || undefined}>
          <Icon />
          {label}
          <small data-ai={ai || undefined}>{ai ? 'AI' : '本机'}</small>
        </span>
      ))}
    </span>
  );
}

/** 一页纸：一道标题、几行字 */
function Page({
  lines = 6,
  table = false,
}: {
  lines?: number;
  table?: boolean;
}) {
  return (
    <span className="tw-pg">
      <b />
      {Array.from({ length: lines }, (_, index) => (
        <i key={index} />
      ))}
      {table ? <u /> : null}
    </span>
  );
}

export function Wall() {
  const { oldWay, small, chain, later, end } = wall;
  const photo = mediaOf('tool-light');
  const photoSrc = String(photo.srcset[0][0]);
  return (
    <section className="tw" data-scene aria-labelledby="tw-title">
      <div className="tw-pin">
        <div className="m-wrap">
          <div className="tw-top">
            <div className="tw-top-head">
              <span className="m-no" aria-hidden="true">
                01
              </span>
              <h2 className="m-kicker" id="tw-title">
                {wall.title}
              </h2>
            </div>
            <ol className="tw-rail" aria-hidden="true">
              {times.map((time, index) => (
                <li key={index} style={{ '--i': index } as Vars}>
                  <span className="num">{time.replace('下午 ', '')}</span>
                </li>
              ))}
              <i className="tw-sun" />
            </ol>
            <span className="m-note">{wall.note}</span>
          </div>
        </div>

        <ol className="tw-track">
          {/* 2:10 老路四步，Tool 一步：多出来的空格当场收拢 */}
          <Station
            index={0}
            className="tw-old"
            time={oldWay.time}
            title={oldWay.title}
            line={oldWay.line}
          >
            <ol className="tw-steps" aria-label={oldWay.stepsLabel}>
              <li className="tw-steps-label tw-in" style={t(0.02)}>
                {oldWay.stepsLabel}
              </li>
              {oldWay.steps.map((step, index) => (
                <li key={step} className="tw-in" style={t(0.06 + index * 0.1)}>
                  {index ? <ArrowRight /> : null}
                  {step}
                </li>
              ))}
            </ol>
            <p className="tw-messy">
              <span className="tw-light" style={t(0.55)}>
                {oldWay.messy.map((word, index) => (
                  <span key={word}>
                    {index ? <span className="tw-gap" /> : null}
                    {word}
                  </span>
                ))}
                <span className="tw-stop">。</span>
              </span>
            </p>
            <Pop
              className="tw-old-pop"
              style={t(0.66)}
              items={[
                { icon: Eraser, label: oldWay.action, on: true },
                { icon: Hash, label: '数一数' },
                { icon: Copy, label: '复制纯文本' },
              ]}
            />
            <p className="tw-result tw-in" style={t(0.9)}>
              <Check />
              {oldWay.done}
              <span className="tw-where">本机</span>
            </p>
          </Station>

          {/* 2:40 眼前的小事：PDF 取几页（本机，副本处理），照片写一句说明（AI） */}
          <Station
            index={1}
            className="tw-small"
            time={small.time}
            title={small.title}
            line={small.line}
          >
            <div className="tw-pdf">
              <p className="tw-file">
                {small.pdf.name}
                <span className="tw-kept tw-in" style={t(0.52)}>
                  <Check />
                  {small.pdf.kept}
                </span>
              </p>
              <div className="tw-pgs">
                {Array.from({ length: small.pdf.pages }, (_, index) => {
                  const picked = index >= 1 && index <= 3;
                  return (
                    <span
                      key={index}
                      className="tw-pg-at"
                      data-picked={picked || undefined}
                      style={t(0.08 + (index - 1) * 0.05)}
                    >
                      <Page lines={index % 2 ? 7 : 5} table={index === 2} />
                      <small className="num">{index + 1}</small>
                    </span>
                  );
                })}
              </div>
              <Pop
                className="tw-pdf-pop"
                style={t(0.26)}
                items={[{ icon: Scissors, label: small.pdf.action, on: true }]}
              />
              <span className="tw-copy tw-in" style={t(0.4)}>
                <span className="tw-fan">
                  <Page lines={5} />
                  <Page lines={6} table />
                  <Page lines={7} />
                </span>
                <span>
                  <b>{small.pdf.copy}</b>
                  <small>副本</small>
                </span>
              </span>
            </div>
            <div className="tw-photo">
              <span className="tw-photo-frame tw-ring" style={t(0.62)}>
                <img
                  src={photoSrc}
                  width={photo.width}
                  height={photo.height}
                  alt=""
                  loading="lazy"
                  decoding="async"
                />
              </span>
              <Pop
                className="tw-photo-pop"
                style={t(0.7)}
                items={[
                  {
                    icon: ImageIcon,
                    label: small.photo.action,
                    ai: true,
                    on: true,
                  },
                ]}
              />
              <p className="tw-caption tw-in" style={t(0.84)}>
                {small.photo.caption}
              </p>
            </div>
          </Station>

          {/* 3:15 结果还能成为下一步的材料：取出的字 → 表格 → 比较或导出 */}
          <Station
            index={2}
            className="tw-chain"
            time={chain.time}
            title={chain.title}
            line={chain.line}
          >
            <div className="tw-flow">
              <div className="tw-note-card tw-in" style={t(0.02)}>
                <small>{chain.from}</small>
                {chain.text.map((row) => (
                  <p key={row}>{row}</p>
                ))}
              </div>
              <span className="tw-flow-arrow tw-in" style={t(0.3)}>
                <ArrowRight />
                <small>{chain.toTable} · 本机</small>
              </span>
              <div className="tw-sheet-card tw-in" style={t(0.38)}>
                <table className="tw-table">
                  <thead>
                    <tr>
                      {chain.table.head.map((cell, index) => (
                        <th key={index}>{cell}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {chain.table.rows.map((row, r) => (
                      <tr
                        key={row[0]}
                        className="tw-in"
                        style={t(0.44 + r * 0.06)}
                      >
                        {row.map((cell, index) =>
                          index === 0 ? (
                            <th key={index}>{cell}</th>
                          ) : (
                            <td key={index} className="num">
                              {cell}
                            </td>
                          ),
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
                <Pop
                  className="tw-chain-pop"
                  style={t(0.72)}
                  items={[
                    { icon: Scale, label: chain.out[0], on: true },
                    { icon: FileDown, label: chain.out[1] },
                  ]}
                />
              </div>
            </div>
            <p className="tw-more tw-in" style={t(0.86)}>
              {chain.more}
            </p>
          </Station>

          {/* 4:30 收起以后：墙上的东西收进菜单栏，接续从图标下落下 */}
          <Station
            index={3}
            className="tw-later"
            time={later.time}
            title={later.title}
            line={later.line}
          >
            <div className="tw-desk">
              <p className="tw-menubar">
                <span className="tw-menubar-icon tw-ring" style={t(0.46)}>
                  <img
                    src="/site/molis-logo-64.png"
                    width="64"
                    height="64"
                    alt=""
                  />
                </span>
                <time className="num">{later.clock}</time>
              </p>
              <span
                className="tw-away"
                style={
                  { '--x0': '2%', '--y0': '96px', '--dx': '80cqw' } as Vars
                }
              >
                <Table2 />
                三家报价
              </span>
              <span
                className="tw-away"
                style={
                  { '--x0': '8%', '--y0': '200px', '--dx': '72cqw' } as Vars
                }
              >
                <CalendarDays />
                {paper.title}
              </span>
              <span
                className="tw-away tw-away-photo"
                style={
                  { '--x0': '30%', '--y0': '130px', '--dx': '56cqw' } as Vars
                }
              >
                <img
                  src={photoSrc}
                  width={photo.width}
                  height={photo.height}
                  alt=""
                  loading="lazy"
                />
              </span>
              <div className="tw-panel tw-in" style={t(0.56)}>
                <p className="tw-panel-head">{later.panel}</p>
                <Mine title={later.mine} from={later.mineFrom} />
                <ul>
                  {later.items.map((item, index) => (
                    <li
                      key={item.name}
                      className="tw-in"
                      style={t(0.64 + index * 0.08)}
                    >
                      <span className="tw-kind">{item.kind}</span>
                      <b>{item.name}</b>
                      <small>{item.from}</small>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </Station>

          {/* 墙尾：工具出现多久，由你当下的需要决定 */}
          <Station
            index={4}
            className="tw-end"
            time=""
            title={end.title}
            decorative={false}
          >
            <div className="tw-not">
              <p className="tw-not-head tw-in" style={t(0.05)}>
                {end.kicker}
              </p>
              <ul>
                {end.not.map((item, index) => (
                  <li
                    key={item}
                    className="tw-in"
                    style={t(0.2 + index * 0.16)}
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </Station>
        </ol>
      </div>
    </section>
  );
}
