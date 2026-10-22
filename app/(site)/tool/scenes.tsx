import {
  ArrowRight,
  ArrowUpRight,
  CalendarDays,
  Check,
  Command,
  CornerUpLeft,
  Eraser,
  FileAudio,
  FileText,
  ImageIcon,
  Languages,
  ListTodo,
  Puzzle,
  Table2,
} from 'lucide-react';
import { layers, moments, plugins, shift } from '../../../content/site/tool';
import { mediaOf, type Vars } from '../../_site/ui';
import { Mine } from './mine';
import { Hl, Ico, Pointer, Stream } from './parts';
import { Loop, Replay } from './stage';

// Tool 页首屏之后的几段演示。时间轴都在 tool.css 里，这里只摆好「做完了」的样子。

/** 一句格式乱掉的话：片段之间的空格画成小点，清理时收拢 */
function Messy({
  parts,
  className = '',
}: {
  parts: readonly string[];
  className?: string;
}) {
  return (
    <span className={`tl-messy ${className}`}>
      {parts.map((part, index) => (
        <span key={part}>
          {index > 0 ? <i className="tl-gap" /> : null}
          {part}
        </span>
      ))}
      <b className="tl-stop">。</b>
    </span>
  );
}

/** 以前与现在：同一句话，老路绕四站，Molis Tool 一步 */
export function Shift() {
  const { before, after } = shift;
  return (
    <Loop
      className="tl-shift"
      label={shift.label}
      note={shift.note}
      duration={10}
      skip={0.2}
    >
      <div className="tl-lane" data-lane="before">
        <div className="tl-lane-art">
          <p className="tl-lane-paper tl-a-paper">
            <Messy parts={shift.messy} className="tl-a-text" />
          </p>
          {before.steps.map((step, index) => (
            <span key={step} className="tl-app" data-step={index + 1}>
              <i />
              {step}
            </span>
          ))}
          <Pointer className="tl-a-pointer" />
          <span className="tl-count">
            {before.steps.map((step) => (
              <i key={step} />
            ))}
          </span>
        </div>
        <p className="tl-lane-cap">
          <b>{before.label}</b>
          {before.text}
        </p>
      </div>

      <div className="tl-lane" data-lane="after">
        <div className="tl-lane-art">
          <p className="tl-lane-paper tl-b-paper">
            <Hl className="tl-b-hl">
              <Messy parts={shift.messy} className="tl-b-text" />
            </Hl>
            <span className="tl-anchor">
              <span className="tl-bar tl-b-bar">
                <span className="tl-bar-btn" data-first>
                  <Ico icon={Eraser} tone="butter" />
                  {after.action}
                  <Pointer className="tl-b-pointer" />
                </span>
              </span>
            </span>
          </p>
          <p className="tl-done tl-b-done">
            <Check />
            {after.done}
          </p>
        </div>
        <p className="tl-lane-cap">
          <b>{after.label}</b>
          {after.text}
        </p>
      </div>
    </Loop>
  );
}

/** 由近到远的三层：同一场秋日市集，一层接一层地处理 */
export function Relay() {
  const { near, beside, later } = layers;
  return (
    <Loop
      className="tl-relay"
      label={layers.label}
      note={layers.note}
      duration={14}
      skip={0.1}
    >
      <ol className="tl-relay-row">
        <li className="tl-layer" data-layer="near">
          <div className="tl-layer-paper">
            <small className="tl-eyebrow">{near.eyebrow}</small>
            <p className="tl-near-text">
              {near.before}
              <span className="tl-anchor">
                <Hl className="tl-near-hl">{near.mark}</Hl>
                <span className="tl-bar tl-near-bar">
                  {near.chips.map((chip, index) => (
                    <span
                      key={chip.label}
                      className="tl-bar-btn"
                      data-first={index === 0 || undefined}
                    >
                      <Ico
                        icon={index === 0 ? CalendarDays : Languages}
                        tone={chip.tone}
                      />
                      {chip.label}
                      {index === 0 ? (
                        <Pointer className="tl-near-pointer" />
                      ) : null}
                    </span>
                  ))}
                </span>
              </span>
              {near.after}
              <br />
              {near.line}
            </p>
            <p className="tl-near-done">
              <Check />
              <span>{near.result}</span>
              <u>{near.undo}</u>
            </p>
          </div>
          <div className="tl-layer-cap">
            <h3>{near.name}</h3>
            <p>{near.text}</p>
          </div>
        </li>

        <li className="tl-layer" data-layer="beside">
          <div className="tl-layer-paper">
            <small className="tl-eyebrow">{beside.eyebrow}</small>
            <div className="tl-beside">
              <div className="tl-poster">
                <span className="tl-poster-sun" />
                <b>{beside.poster.day}</b>
                <i lang="en">{beside.poster.month}</i>
                <strong>
                  {beside.poster.title[0]}
                  <br />
                  {beside.poster.title[1]}
                </strong>
                <span className="tl-frame" />
              </div>
              <div className="tl-card tl-draft">
                <p className="tl-card-head">
                  <Ico icon={CalendarDays} tone="apricot" />
                  {beside.card}
                </p>
                <dl>
                  {beside.fields.map(([key, value], index) => (
                    <div key={key} style={{ '--n': index } as Vars}>
                      <dt>{key}</dt>
                      <dd>
                        <span>{value}</span>
                      </dd>
                    </div>
                  ))}
                </dl>
                <p className="tl-source">
                  <ArrowUpRight />
                  {beside.source}
                </p>
                <p className="tl-draft-go">
                  <span data-solid="">{beside.actions[0]}</span>
                  <span>{beside.actions[1]}</span>
                </p>
              </div>
            </div>
          </div>
          <div className="tl-layer-cap">
            <h3>{beside.name}</h3>
            <p>{beside.text}</p>
          </div>
        </li>

        <li className="tl-layer" data-layer="later">
          <div className="tl-layer-paper">
            <small className="tl-eyebrow">{later.eyebrow}</small>
            <p className="tl-menubar">
              <i />
              <i />
              <i />
              <span className="tl-menubar-icon">
                <img
                  src="/site/molis-logo-64.png"
                  width="64"
                  height="64"
                  alt=""
                />
              </span>
              <time>{later.clock}</time>
            </p>
            <div className="tl-panel">
              <p className="tl-panel-head">{later.panel}</p>
              <ul>
                <Mine title={later.mine} from={later.mineFrom} />
                {later.rows.map((row, index) => (
                  <li key={row.name} style={{ '--n': index } as Vars}>
                    <Ico
                      icon={index === 0 ? CalendarDays : Check}
                      tone={index === 0 ? 'apricot' : 'sage'}
                    />
                    <b>{row.name}</b>
                    <small>{row.meta}</small>
                  </li>
                ))}
              </ul>
              <p className="tl-panel-back">
                <CornerUpLeft />
                {later.back}
              </p>
            </div>
          </div>
          <div className="tl-layer-cap">
            <h3>{later.name}</h3>
            <p>{later.text}</p>
          </div>
        </li>
      </ol>
    </Loop>
  );
}

const tagOf = (kind: 'local' | 'ai' | 'wip') => moments.tags[kind];

/** 眼前的小事：六张小样品，进入视口各播一遍，指过去重播 */
export function Moments() {
  const { clean, pages, table, caption, poster, todo } = moments;
  const photo = mediaOf('tool-light');
  const cards = [
    {
      item: clean,
      art: (
        <div className="tl-m-clean">
          <p className="tl-m-paper">
            <Messy parts={clean.messy} />
          </p>
          <span className="tl-bar tl-m-chip">
            <span className="tl-bar-btn" data-first>
              <Ico icon={Eraser} tone="butter" />
              {clean.title}
            </span>
          </span>
        </div>
      ),
    },
    {
      item: pages,
      art: (
        <div className="tl-m-pages">
          <p className="tl-m-file">
            <FileText />
            {pages.file}
          </p>
          <span className="tl-m-pgs">
            {Array.from({ length: 6 }, (_, index) => (
              <i key={index} data-pick={(index > 0 && index < 4) || undefined}>
                {index + 1}
              </i>
            ))}
          </span>
          <span className="tl-m-copy">
            <i />
            <i />
            <i />
            <b>{pages.copy}</b>
          </span>
          <span className="tl-m-kept">
            <Check />
            {pages.kept}
          </span>
        </div>
      ),
    },
    {
      item: table,
      art: (
        <div className="tl-m-table">
          <p className="tl-m-lines">
            {table.text.map((line) => (
              <span key={line}>{line}</span>
            ))}
          </p>
          <table>
            <thead>
              <tr>
                {table.head.map((cell, index) => (
                  <th key={index}>{cell}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {table.rows.map((row, index) => (
                <tr
                  key={row[0]}
                  data-best={index === 1 || undefined}
                  style={{ '--n': index } as Vars}
                >
                  {row.map((cell, cellIndex) => (
                    <td key={cellIndex}>{cell}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
          <span className="tl-bar tl-m-chip">
            <span className="tl-bar-btn" data-first>
              <Ico icon={Table2} tone="sage" />
              整理成表格
            </span>
          </span>
        </div>
      ),
    },
    {
      item: caption,
      art: (
        <div className="tl-m-caption">
          <span className="tl-m-photo">
            <img
              src={photo.src}
              srcSet={photo.srcset.map(([src, w]) => `${src} ${w}w`).join(', ')}
              sizes="240px"
              width={photo.width}
              height={photo.height}
              alt=""
              loading="lazy"
              decoding="async"
            />
          </span>
          <p className="tl-m-says">
            <Ico icon={ImageIcon} tone="rose" />
            <Stream text={caption.text} />
          </p>
        </div>
      ),
    },
    {
      item: poster,
      art: (
        <div className="tl-m-poster">
          <span className="tl-m-flyer">
            <b>SAT</b>
            <strong>
              工作坊
              <br />
              开放日
            </strong>
          </span>
          <span className="tl-card tl-m-draft">
            <span className="tl-card-head">
              <Ico icon={CalendarDays} tone="apricot" />
              日程草稿
            </span>
            {poster.fields.map(([key, value], index) => (
              <span
                key={key}
                className="tl-m-field"
                style={{ '--n': index } as Vars}
              >
                <small>{key}</small>
                {value}
              </span>
            ))}
          </span>
        </div>
      ),
    },
    {
      item: todo,
      art: (
        <div className="tl-m-todo">
          <span className="tl-m-chat">
            <span>{todo.chat[0]}</span>
            <span data-me="">{todo.chat[1]}</span>
          </span>
          <span className="tl-card tl-m-list">
            <span className="tl-card-head">
              <Ico icon={ListTodo} tone="lilac" />
              待办
            </span>
            {todo.items.map((item, index) => (
              <span
                key={item}
                className="tl-m-check"
                style={{ '--n': index } as Vars}
              >
                <i />
                {item}
              </span>
            ))}
          </span>
        </div>
      ),
    },
  ];

  return (
    <ul className="tl-moments">
      {cards.map(({ item, art }, index) => (
        <li key={item.title} className="tl-moment" data-tone={item.tone}>
          <Replay index={index} className="tl-moment-art">
            {art}
          </Replay>
          <h3>{item.title}</h3>
          <p className="tl-tags">
            <span data-kind={item.kind}>{tagOf(item.kind)}</span>
          </p>
        </li>
      ))}
    </ul>
  );
}

/** 插件就是能力：登记一次 → 四个入口同时出现 → 结果接着交给下一个能力 → 停用时处处收起 */
export function Plugins() {
  const { surfaces } = plugins;
  return (
    <Loop
      className="tl-plug"
      label={plugins.label}
      note={plugins.note}
      duration={13}
      skip={0.08}
    >
      <div className="tl-card tl-slip">
        <p className="tl-slip-head">
          <Ico icon={Puzzle} tone="butter" />
          <span>
            <small>{plugins.kind}</small>
            <b>{plugins.name}</b>
          </span>
          <span className="tl-toggle">
            <i />
            <Pointer className="tl-plug-pointer" />
          </span>
        </p>
        <dl>
          {plugins.spec.map(([key, value]) => (
            <div key={key}>
              <dt>{key}</dt>
              <dd>{value}</dd>
            </div>
          ))}
        </dl>
      </div>

      <div className="tl-surfaces">
        <div className="tl-surface" style={{ '--n': 0 } as Vars}>
          <small>{surfaces.near.label}</small>
          <p className="tl-s-chips">
            <span className="tl-new">{plugins.name}</span>
            {surfaces.near.others.map((name) => (
              <span key={name}>{name}</span>
            ))}
          </p>
        </div>
        <div className="tl-surface" style={{ '--n': 1 } as Vars}>
          <small>{surfaces.menu.label}</small>
          <ul className="tl-s-menu">
            {surfaces.menu.others.map((name) => (
              <li key={name}>{name}</li>
            ))}
            <li className="tl-new">{plugins.name}</li>
          </ul>
        </div>
        <div className="tl-surface" style={{ '--n': 2 } as Vars}>
          <small>{surfaces.drop.label}</small>
          <p className="tl-s-drop">
            <FileAudio />
            <span>{surfaces.drop.hint}</span>
            <b className="tl-new">{plugins.name}</b>
          </p>
        </div>
        <div className="tl-surface" style={{ '--n': 3 } as Vars}>
          <small>{surfaces.bar.label}</small>
          <p className="tl-s-query">
            <Command />
            {surfaces.bar.query}
          </p>
          <p className="tl-s-hit tl-new">
            {plugins.name}
            <i>{surfaces.bar.where}</i>
          </p>
        </div>
      </div>

      <p className="tl-chain">
        <span className="tl-file">{plugins.chain[0]}</span>
        <ArrowRight className="tl-chain-a" />
        <b className="tl-step" data-tone="butter">
          {plugins.name}
        </b>
        <span className="tl-file tl-chain-b">{plugins.chain[1]}</span>
        <ArrowRight className="tl-chain-c" />
        <b className="tl-step tl-chain-d" data-tone="sky">
          {plugins.next}
        </b>
        <span className="tl-file tl-chain-e">{plugins.chain[2]}</span>
      </p>
      <p className="tl-kept">{plugins.kept}</p>
    </Loop>
  );
}
