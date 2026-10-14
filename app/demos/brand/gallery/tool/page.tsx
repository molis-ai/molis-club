'use client';
import Link from 'next/link';
import { ArrowUpRight, RotateCcw } from 'lucide-react';
import {
  useRef,
  useState,
  type KeyboardEvent,
  type MouseEvent,
  type PointerEvent,
} from 'react';
import {
  boardNote,
  closing,
  demo,
  hero,
  layers,
  merged,
  moments,
  notThis,
  plugins,
  promises,
  shift,
} from '../../../../../content/molis-tool';
import { folioTool } from '../../../../../content/folio';
import { Pointer } from '../home-works';
import {
  Actions,
  Btn,
  Caption,
  Closing,
  Framed,
  More,
  NextRoom,
  Phrases,
  Plate,
  Shell,
  Status,
  Tag,
  type Vars,
} from '../kit';
import { COMMUNITY, HOME, WORK, contactHref } from '../routes';
import './tool.css';

// Molis Tool · Room 2 的互动装置。内容与 Folio 的 Tool 页同一份、同一个顺序。
// 首屏整面墙就是装置：访客的光标是墙上的一束光；点一下划线的那句，动作签出现在真实的光标旁，
// 点「翻译」，译文卡贴到墙上（界面示意）。往下：以前与现在的对照是一面被铅笔改过的墙；
// 三层是三只依次亮灯的展柜；一天里的几个时刻挂成一面错落的画墙；四个承诺是墙上的四个词；
// 合进来的工具摆在一层架子上；插件是一张从中心连到四处入口的图；「它不是什么」是被划掉的四句话。

const TRY = `${COMMUNITY}#try`;

type Pop = { x: number; y: number };

/** 首屏：光标是一束光，点一下那句话，三个动作出现在光标旁 */
function CursorWall() {
  const wall = useRef<HTMLDivElement>(null);
  const [pop, setPop] = useState<Pop | null>(null);
  const [pinned, setPinned] = useState(false);

  const light = (event: PointerEvent<HTMLDivElement>) => {
    const node = wall.current;
    if (!node || event.pointerType !== 'mouse') return;
    const rect = node.getBoundingClientRect();
    node.style.setProperty('--sx', `${event.clientX - rect.left}px`);
    node.style.setProperty('--sy', `${event.clientY - rect.top}px`);
    node.dataset.lit = 'true';
  };

  /** 在 (x, y) 处弹出动作；键盘触发时没有鼠标位置，就放在那句话的末尾 */
  const open = (target: HTMLElement, point?: { x: number; y: number }) => {
    const node = wall.current;
    if (!node) return;
    const rect = node.getBoundingClientRect();
    const mark = target.getBoundingClientRect();
    const x = point ? point.x : mark.right;
    const y = point ? point.y : mark.bottom;
    setPop({
      x: Math.max(12, Math.min(x - rect.left, rect.width - 260)),
      y: y - rect.top,
    });
    setPinned(false);
  };

  const select = (event: MouseEvent<HTMLSpanElement>) => {
    open(
      event.currentTarget,
      event.detail ? { x: event.clientX, y: event.clientY } : undefined,
    );
  };

  const press = (event: KeyboardEvent<HTMLSpanElement>) => {
    if (event.key !== 'Enter' && event.key !== ' ') return;
    event.preventDefault();
    open(event.currentTarget);
  };

  const reset = () => {
    setPop(null);
    setPinned(false);
  };

  return (
    <div
      className="g-tool-wall"
      ref={wall}
      onPointerMove={light}
      onPointerLeave={() => {
        if (wall.current) wall.current.dataset.lit = 'false';
      }}
      data-selected={pop ? true : undefined}
    >
      <p className="g-tool-wall-url" aria-hidden="true">
        {demo.url}
      </p>
      <p className="g-tool-wall-en" lang="en">
        {demo.before}
        {/* 按钮元素在一行文字里不能折行，这里用可聚焦的行内文字，回车和空格都能触发 */}
        <span
          className="g-tool-mark"
          // oxlint-disable-next-line jsx-a11y/prefer-tag-over-role
          role="button"
          tabIndex={0}
          aria-label={`选中这句：${demo.selection}`}
          aria-expanded={Boolean(pop)}
          onClick={select}
          onKeyDown={press}
        >
          {demo.selection}
        </span>
        {demo.after}
      </p>
      <p className="g-tool-wall-hint" aria-hidden={Boolean(pop)}>
        <Pointer size={18} />
        <span>点一下划线的句子</span>
      </p>
      {pop ? (
        <div className="g-tool-pop" style={{ left: pop.x, top: pop.y } as Vars}>
          <Pointer className="g-tool-pop-cursor" size={30} />
          <div className="g-tool-chips">
            <button
              type="button"
              aria-pressed={pinned}
              onClick={() => setPinned(true)}
            >
              {demo.actions[0]}
            </button>
            {demo.actions.slice(1).map((action) => (
              <span key={action}>{action}</span>
            ))}
          </div>
        </div>
      ) : null}
      <div
        className="g-tool-card"
        data-on={pinned || undefined}
        aria-live="polite"
      >
        {pinned ? (
          <>
            <i className="g-tool-tape" aria-hidden="true" />
            <small>{demo.result.label}</small>
            <p>{demo.result.text}</p>
            <small>{demo.result.source}</small>
            <button
              type="button"
              className="g-tool-reset"
              aria-label="重新开始这段示意"
              onClick={reset}
            >
              <RotateCcw size={13} aria-hidden="true" />
            </button>
          </>
        ) : null}
      </div>
      <p className="g-tool-wall-note">{demo.note}</p>
    </div>
  );
}

function Hero() {
  return (
    <section className="g-tool-hero" aria-labelledby="g-tool-title">
      <div className="g-tool-hero-copy">
        <p className="g-tool-kicker">
          <span className="g-soft" lang="en" aria-hidden="true">
            Room 2
          </span>
          <span>{hero.kicker}</span>
        </p>
        <h1 id="g-tool-title" className="g-tool-title">
          <Phrases text={hero.title} />
        </h1>
        <p className="g-lead">{hero.lead}</p>
        <Status items={hero.status} />
        <Actions>
          <Btn href={contactHref('tool')}>{hero.actions.follow}</Btn>
          <More href={TRY}>{folioTool.community.try}</More>
        </Actions>
      </div>
      <CursorWall />
    </section>
  );
}

/** 以前与现在：一面被铅笔改过的墙，「以前」那一栏被划掉，现在的写在旁边 */
function Shift() {
  return (
    <section className="g-tool-shift g-wrap g-section">
      <Plate
        id="g-tool-shift-title"
        index="I"
        kicker={shift.kicker}
        title={shift.title}
      />
      <table className="g-tool-compare" aria-labelledby="g-tool-shift-title">
        <thead>
          <tr>
            <td aria-hidden="true" />
            <th scope="col">{shift.labels.before}</th>
            <th scope="col">{shift.labels.after}</th>
          </tr>
        </thead>
        <tbody>
          {shift.rows.map((row, index) => (
            <tr
              key={row.aspect}
              data-reveal
              style={{ '--delay': `${index * 120}ms` } as Vars}
            >
              <th scope="row">{row.aspect}</th>
              <td data-label={shift.labels.before}>
                <s>{row.before}</s>
              </td>
              <td data-label={shift.labels.after}>{row.after}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}

/** 三层：三只展柜按离光标的远近排开，往下滚，灯一只只亮过去 */
function Layers() {
  const { near, beside, later, note, label } = folioTool.layers;
  return (
    <section
      className="g-tool-layers"
      data-scene="pin"
      data-steps="3"
      aria-labelledby="g-tool-layers-title"
    >
      <div className="g-tool-layers-stage">
        <div className="g-wrap">
          <Plate
            id="g-tool-layers-title"
            index="II"
            kicker={layers.kicker}
            title={layers.title}
          />
          <figure className="g-tool-vitrines" aria-label={label}>
            <div className="g-tool-vitrine" data-layer="0">
              <div className="g-tool-case" aria-hidden="true">
                <p className="g-tool-eyebrow">{near.eyebrow}</p>
                <p className="g-tool-near">
                  {near.before}
                  <mark>{near.mark}</mark>
                  {near.after}
                </p>
                <p className="g-tool-near-chips">
                  {near.chips.map((chip) => (
                    <span key={chip}>{chip}</span>
                  ))}
                </p>
                <p className="g-tool-near-done">
                  {near.result} <span>{near.undo}</span>
                </p>
              </div>
              <p className="g-tool-vitrine-label">
                <span className="g-soft">1</span>
                <strong>{layers.items[0].title}</strong>
                <span>{layers.items[0].text}</span>
              </p>
            </div>
            <div className="g-tool-vitrine" data-layer="1">
              <div className="g-tool-case" aria-hidden="true">
                <p className="g-tool-eyebrow">{beside.eyebrow}</p>
                <div className="g-tool-beside">
                  <div className="g-tool-poster">
                    <b>{beside.day}</b>
                    <small lang="en">{beside.month}</small>
                    {beside.title.map((line) => (
                      <span key={line}>{line}</span>
                    ))}
                  </div>
                  <div className="g-tool-draft">
                    <small>{beside.card}</small>
                    {beside.fields.map(([key, value]) => (
                      <p key={key}>
                        <span>{key}</span>
                        {value}
                      </p>
                    ))}
                    <em>{beside.source}</em>
                    <p className="g-tool-draft-actions">
                      {beside.actions.map((action) => (
                        <span key={action}>{action}</span>
                      ))}
                    </p>
                  </div>
                </div>
              </div>
              <p className="g-tool-vitrine-label">
                <span className="g-soft">2</span>
                <strong>{layers.items[1].title}</strong>
                <span>{layers.items[1].text}</span>
              </p>
            </div>
            <div className="g-tool-vitrine" data-layer="2">
              <div className="g-tool-case" aria-hidden="true">
                <p className="g-tool-eyebrow">{later.eyebrow}</p>
                <div className="g-tool-bar">
                  <p className="g-tool-bar-input">
                    {later.keys.map((key) => (
                      <kbd key={key}>{key}</kbd>
                    ))}
                    <span>{later.query}</span>
                  </p>
                  <p className="g-tool-bar-row">
                    <strong>{later.row}</strong>
                    <small>{later.meta}</small>
                  </p>
                  <p className="g-tool-bar-back">{later.back}</p>
                </div>
              </div>
              <p className="g-tool-vitrine-label">
                <span className="g-soft">3</span>
                <strong>{layers.items[2].title}</strong>
                <span>{layers.items[2].text}</span>
              </p>
            </div>
            <figcaption className="g-tool-vitrines-note">{note}</figcaption>
          </figure>
        </div>
      </div>
    </section>
  );
}

/** 一天里的几个时刻：六张概念图挂成一面错落的画墙 */
function Moments() {
  return (
    <section
      className="g-tool-moments g-wrap g-section"
      aria-labelledby="g-tool-moments-title"
    >
      <Plate
        id="g-tool-moments-title"
        index="III"
        kicker={moments.kicker}
        title={moments.title}
        side={<p className="g-tool-board">{boardNote}</p>}
      />
      <ul className="g-tool-salon">
        {moments.items.map((item, index) => (
          <li
            key={item.title}
            data-reveal
            style={{ '--delay': `${(index % 3) * 110}ms` } as Vars}
          >
            <Framed tone={index % 2 ? 'oak' : 'white'}>
              <img
                src={item.image.src}
                width={item.image.w}
                height={item.image.h}
                alt=""
                loading="lazy"
              />
            </Framed>
            <Caption title={String(index + 1).padStart(2, '0')}>
              <b>{item.title}</b> {item.text}
            </Caption>
          </li>
        ))}
      </ul>
    </section>
  );
}

/** 四个承诺：墙上的四个词 */
function Promises() {
  return (
    <section
      className="g-tool-promises g-wrap g-section"
      aria-labelledby="g-tool-promises-title"
    >
      <Plate
        id="g-tool-promises-title"
        index="IV"
        kicker={promises.kicker}
        title={promises.title}
      />
      <ol className="g-tool-promise-list">
        {promises.items.map((item, index) => (
          <li
            key={item.title}
            data-reveal
            style={{ '--delay': `${index * 100}ms` } as Vars}
          >
            <strong>{item.title}</strong>
            <p>{item.text}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}

/** 合进来的工具：一层木架子，六件小工具各配一块展签 */
function Merged() {
  return (
    <section
      className="g-tool-merged g-wrap g-section"
      aria-labelledby="g-tool-merged-title"
    >
      <Plate
        id="g-tool-merged-title"
        index="V"
        kicker={merged.kicker}
        title={merged.title}
      />
      <ul className="g-tool-shelf">
        {merged.items.map((item, index) => (
          <li
            key={item.title}
            data-reveal
            style={{ '--delay': `${(index % 3) * 90}ms` } as Vars}
          >
            <span className="g-tool-object" aria-hidden="true" data-k={index} />
            <strong>{item.title}</strong>
            {item.from ? <small>{item.from}</small> : null}
            <p>{item.text}</p>
          </li>
        ))}
      </ul>
      <p className="g-tool-available" data-reveal>
        <span>{merged.available.label}</span>
        {merged.available.links.map((link) => (
          <a key={link.name} href={link.href} target="_blank" rel="noreferrer">
            {link.name}
            <ArrowUpRight size={13} aria-hidden="true" />
          </a>
        ))}
        <Link href={TRY}>
          {folioTool.community.available}
          <ArrowUpRight size={13} aria-hidden="true" />
        </Link>
      </p>
    </section>
  );
}

/** 插件就是能力：中间一张插件卡，连到光标旁、右键、拖放、命令条四处入口；下面是一条结果接力 */
function Plugins() {
  const stage = folioTool.plugins;
  const { surfaces } = stage;
  return (
    <section
      className="g-tool-plugins g-wrap g-section"
      aria-labelledby="g-tool-plugins-title"
    >
      <Plate
        id="g-tool-plugins-title"
        index="VI"
        kicker={plugins.kicker}
        title={plugins.title}
      />
      <div className="g-tool-plugins-body">
        <ol className="g-tool-facts">
          {stage.facts.map((fact, index) => (
            <li
              key={fact.title}
              data-reveal
              style={{ '--delay': `${index * 90}ms` } as Vars}
            >
              <span className="g-soft" aria-hidden="true">
                {index + 1}
              </span>
              <strong>{fact.title}</strong>
              <p>{fact.text}</p>
            </li>
          ))}
        </ol>
        <figure className="g-tool-map" data-reveal aria-label={stage.label}>
          <div className="g-tool-map-grid" aria-hidden="true">
            <div className="g-tool-surface" data-at="near">
              <small>{surfaces.near.label}</small>
              <p>
                <b>{stage.name}</b>
                {surfaces.near.others.map((other) => (
                  <span key={other}>{other}</span>
                ))}
              </p>
            </div>
            <div className="g-tool-surface" data-at="menu">
              <small>{surfaces.menu.label}</small>
              <p className="g-tool-menu">
                <b>{stage.name}</b>
                {surfaces.menu.others.map((other) => (
                  <span key={other}>{other}</span>
                ))}
              </p>
            </div>
            <div className="g-tool-plugin">
              <p>
                <small>{stage.kind}</small>
                <span>{stage.on}</span>
              </p>
              <strong>{stage.name}</strong>
              <dl>
                {stage.spec.map(([key, value]) => (
                  <div key={key}>
                    <dt>{key}</dt>
                    <dd>{value}</dd>
                  </div>
                ))}
              </dl>
            </div>
            <div className="g-tool-surface" data-at="drop">
              <small>{surfaces.drop.label}</small>
              <p className="g-tool-drop">
                <b>{stage.name}</b>
                <span>{surfaces.drop.hint}</span>
              </p>
            </div>
            <div className="g-tool-surface" data-at="bar">
              <small>{surfaces.bar.label}</small>
              <p>
                <kbd>⌘K</kbd>
                <span>{surfaces.bar.query}</span>
                <b>{stage.name}</b>
              </p>
            </div>
          </div>
          <p className="g-tool-chain" aria-hidden="true">
            {stage.chain.map((file, index) => (
              <span key={file}>
                {file}
                {index === 1 ? <em>{stage.next}</em> : null}
              </span>
            ))}
          </p>
          <figcaption>
            <span>{stage.kept}</span>
            <span>{stage.note}</span>
          </figcaption>
        </figure>
      </div>
    </section>
  );
}

/** 它不是什么：四句话写在墙上，又被一笔一笔划掉 */
function NotThis() {
  return (
    <section
      className="g-tool-not g-wrap g-section"
      aria-labelledby="g-tool-not-title"
    >
      <h2 id="g-tool-not-title" className="g-tool-not-title">
        {notThis.kicker}
      </h2>
      <ul>
        {notThis.items.map((item, index) => (
          <li
            key={item}
            data-reveal
            style={{ '--delay': `${index * 140}ms` } as Vars}
          >
            <span>
              <Phrases text={item} />
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}

/** 和 Molis Work 的关系：一块展签 */
function Relation() {
  const { relation } = folioTool;
  return (
    <section
      className="g-tool-relation g-wrap"
      aria-labelledby="g-tool-relation-title"
    >
      <div className="g-tool-relation-card" data-reveal>
        <h2 id="g-tool-relation-title" className="g-kicker">
          {relation.kicker}
        </h2>
        <p>
          <span className="g-phrase">{relation.now}</span>
          <span className="g-phrase">
            {relation.later}
            <Tag>{relation.phase}</Tag>
          </span>
        </p>
        <More href={WORK}>{relation.work}</More>
      </div>
    </section>
  );
}

function Ending() {
  return (
    <>
      <Closing id="g-tool-closing-title" title={closing.title}>
        <Actions>
          <Btn href={contactHref('tool')}>{closing.follow}</Btn>
          <Btn href={TRY} tone="ghost">
            {folioTool.community.try}
          </Btn>
          <More href={HOME}>{closing.home}</More>
        </Actions>
      </Closing>
      <div className="g-next-wrap">
        <NextRoom current="tool" />
      </div>
    </>
  );
}

export default function GalleryTool() {
  return (
    <Shell current="tool" rooms className="g-tool" ending={<Ending />}>
      <Hero />
      <Shift />
      <Layers />
      <Moments />
      <Promises />
      <Merged />
      <Plugins />
      <NotThis />
      <Relation />
    </Shell>
  );
}
