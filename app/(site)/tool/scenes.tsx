import {
  ArrowRight,
  ArrowUp,
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
  type LucideIcon,
} from 'lucide-react';
import type { ReactNode } from 'react';
import {
  layers,
  moments,
  plugins,
  shift,
  type Tone,
} from '../../../content/site/tool';
import { mediaOf, Note, type Vars } from '../../_site/ui';
import { CleanButton, PlugSwitch } from './controls';
import { Gallery } from './gallery';
import { Mine } from './mine';
import { Cursor, Hl, Ico, Stream } from './parts';
import { Loop } from './stage';

// Tool 页首屏之后的几段演示。这里只摆好「做完了」的样子和光标；怎么一拍一拍演出来写在 scripts.ts，
// 每一拍的样子写在 tool.css。data-c 是脚本找零件用的名字。

/**
 * 一句格式乱掉的话：从别处贴来的，带着圆点、缩进、粗细不一和换行。编排时先是乱的（tool.css），
 * 清理时每一截从原处滑进干净的一句，句末补上句号。end 挂在最后一截末尾（选区末端的动作条）
 */
function Messy({
  parts,
  c,
  hl = false,
  end,
}: {
  parts: readonly string[];
  c: string;
  /** 会被拖选：每一截各自铺选中色 */
  hl?: boolean;
  end?: ReactNode;
}) {
  return (
    <span className="tl-messy" data-c={c}>
      {parts.map((part, index) => (
        <span
          key={part}
          className={hl ? 'tl-frag tl-hl' : 'tl-frag'}
          data-c={`${c}-${index}`}
        >
          <span aria-hidden="true">{part}</span>
          {index === parts.length - 1 ? end : null}
        </span>
      ))}
      <span className="tl-stop" aria-hidden="true">
        。
      </span>
    </span>
  );
}

/** 选区末端的动作条（演示里只有一个动作，不能按） */
function Bar({
  c,
  icon,
  tone,
  label,
  className = 'tl-anchor',
}: {
  c: string;
  icon: LucideIcon;
  tone: Tone;
  label: string;
  className?: string;
}) {
  return (
    <span className={className}>
      <span className="tl-bar">
        <span className="tl-bar-btn" data-first="" data-c={c}>
          <Ico icon={icon} tone={tone} />
          {label}
        </span>
      </span>
    </span>
  );
}

/** 做完以后留在画面上的一句 */
function Done({ text }: { text: string }) {
  return (
    <p className="tl-done" aria-hidden="true">
      <Check />
      {text}
    </p>
  );
}

/** 以前与现在：同一句话，老路绕四站，Molis Tool 一步；右边的「清理格式」访客可以亲手按 */
export function Shift() {
  const { before, after } = shift;
  return (
    <Loop
      className="tl-shift"
      label={shift.label}
      note={shift.note}
      cue="shift"
      interactive
    >
      <div className="tl-lane" data-lane="before">
        <div className="tl-lane-art" data-open="" aria-hidden="true">
          <p className="tl-lane-paper" data-c="before-paper">
            <Messy parts={shift.messy} c="before" />
          </p>
          {before.steps.map((step, index) => (
            <span
              key={step}
              className="tl-app"
              data-step={index + 1}
              data-c={`app-${index}`}
            >
              <i />
              {step}
            </span>
          ))}
          <span className="tl-count">
            {before.steps.map((step, index) => (
              <i key={step} data-c={`dot-${index}`} />
            ))}
          </span>
          <Cursor name="before" />
        </div>
        <p className="tl-lane-cap">
          <b>{before.label}</b>
          {before.text}
        </p>
      </div>

      <div className="tl-lane" data-lane="after">
        <div className="tl-lane-art" data-open="">
          <p className="tl-lane-paper" data-c="after-paper">
            <Messy
              parts={shift.messy}
              c="after"
              hl
              end={
                <span className="tl-anchor">
                  <span className="tl-bar tl-b-bar">
                    <CleanButton
                      c="after-btn"
                      action={after.action}
                      text={`${shift.messy.join('')}。`}
                    >
                      <Ico icon={Eraser} tone="butter" />
                      {after.action}
                    </CleanButton>
                  </span>
                </span>
              }
            />
          </p>
          <Done text={after.done} />
          <Cursor name="after" />
        </div>
        <p className="tl-lane-cap">
          <b>{after.label}</b>
          {after.text}
        </p>
      </div>
    </Loop>
  );
}

/** 由近到远的三层：同一场秋日市集，一层接一层地处理；每层一只光标，轮到哪层哪层动 */
export function Relay() {
  const { near, beside, later } = layers;
  return (
    <Loop
      className="tl-relay"
      label={layers.label}
      note={layers.note}
      cue="relay"
    >
      <ol className="tl-relay-row">
        <li className="tl-layer" data-layer="near">
          <div className="tl-layer-paper">
            <small className="tl-eyebrow">{near.eyebrow}</small>
            <p className="tl-near-text">
              {near.before}
              <span className="tl-anchor">
                <Hl c="near-hl">{near.mark}</Hl>
                <span className="tl-bar tl-near-bar">
                  {near.chips.map((chip, index) => (
                    <span
                      key={chip.label}
                      className="tl-bar-btn"
                      data-first={index === 0 || undefined}
                      data-c={index === 0 ? 'near-btn' : undefined}
                    >
                      <Ico
                        icon={index === 0 ? CalendarDays : Languages}
                        tone={chip.tone}
                      />
                      {chip.label}
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
            <Cursor name="near" />
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
                <span className="tl-frame" data-c="beside-frame" />
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
            <Cursor name="beside" />
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
              <span className="tl-menubar-icon" data-c="later-icon">
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
              <p className="tl-panel-back" data-c="later-back">
                <CornerUpLeft />
                {later.back}
              </p>
            </div>
            <Cursor name="later" />
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

/** 眼前的小事：六件小样品挂在同一面墙上，滚到哪件演哪件（gallery.tsx）；编排在 scripts.ts 的 m-* */
export function Moments({ head }: { head: ReactNode }) {
  const { clean, pages, table, caption, poster, todo } = moments;
  const photo = mediaOf('tool-light');
  const cards = [
    {
      key: 'clean',
      item: clean,
      icon: Eraser,
      art: (
        <div className="tl-m tl-m-clean">
          <p className="tl-m-paper" data-c="paper">
            <Messy
              parts={clean.messy}
              c="text"
              hl
              end={
                <Bar
                  c="btn"
                  icon={Eraser}
                  tone={clean.tone}
                  label={clean.action}
                />
              }
            />
          </p>
          <Done text={clean.done} />
          <Cursor />
        </div>
      ),
    },
    {
      key: 'pages',
      item: pages,
      icon: FileText,
      art: (
        <div className="tl-m tl-m-pages">
          <p className="tl-m-file">
            <FileText />
            {pages.file}
          </p>
          <span className="tl-m-pgs">
            {Array.from({ length: 6 }, (_, index) => (
              <i key={index} data-c={`pg-${index}`}>
                {index + 1}
              </i>
            ))}
            <Bar
              c="btn"
              icon={FileText}
              tone={pages.tone}
              label={pages.action}
              className="tl-anchor tl-m-pgs-bar"
            />
          </span>
          <span className="tl-m-copy">
            <i />
            <i />
            <i />
            <b>{pages.copy}</b>
          </span>
          <Done text={pages.done} />
          <Cursor />
        </div>
      ),
    },
    {
      key: 'table',
      item: table,
      icon: Table2,
      art: (
        <div className="tl-m tl-m-table">
          <div className="tl-m-swap">
            <p className="tl-m-lines">
              {table.text.map((line, index) => (
                <span key={line}>
                  <Hl c={`line-${index}`}>{line}</Hl>
                  {index === table.text.length - 1 ? (
                    <Bar
                      c="btn"
                      icon={Table2}
                      tone={table.tone}
                      label={table.action}
                    />
                  ) : null}
                </span>
              ))}
            </p>
            <div className="tl-m-tab" data-c="table">
              <p className="tl-m-row" data-head="">
                {table.head.map((cell, index) => (
                  <span key={index} data-c={index === 1 ? 'price' : undefined}>
                    {cell}
                    {index === 1 ? <ArrowUp className="tl-m-sort" /> : null}
                  </span>
                ))}
              </p>
              {table.rows.map((row, index) => (
                <p
                  key={row[0]}
                  className="tl-m-row"
                  data-c={`row-${index}`}
                  style={{ '--n': index } as Vars}
                >
                  {row.map((cell, cellIndex) => (
                    <span key={cellIndex}>{cell}</span>
                  ))}
                </p>
              ))}
            </div>
          </div>
          <Done text={table.done} />
          <Cursor />
        </div>
      ),
    },
    {
      key: 'caption',
      item: caption,
      icon: ImageIcon,
      art: (
        <div className="tl-m tl-m-caption">
          <span className="tl-m-shot">
            <span className="tl-m-photo" data-c="photo">
              <img
                src={photo.src}
                srcSet={photo.srcset
                  .map(([src, w]) => `${src} ${w}w`)
                  .join(', ')}
                sizes="240px"
                width={photo.width}
                height={photo.height}
                alt=""
                loading="lazy"
                decoding="async"
              />
            </span>
            <Bar
              c="btn"
              icon={ImageIcon}
              tone={caption.tone}
              label={caption.action}
              className="tl-anchor tl-m-shot-bar"
            />
          </span>
          <p className="tl-card tl-m-says">
            <Ico icon={ImageIcon} tone={caption.tone} />
            <span data-c="says">
              <Stream text={caption.text} />
            </span>
          </p>
          <Done text={caption.done} />
          <Cursor />
        </div>
      ),
    },
    {
      key: 'poster',
      item: poster,
      icon: CalendarDays,
      art: (
        <div className="tl-m tl-m-poster">
          <span className="tl-m-flyer">
            <b>{poster.flyer.day}</b>
            <strong>
              {poster.flyer.title[0]}
              <br />
              {poster.flyer.title[1]}
            </strong>
            <span className="tl-frame" data-c="frame" />
            <Bar
              c="btn"
              icon={CalendarDays}
              tone={poster.tone}
              label={poster.action}
              className="tl-anchor tl-m-flyer-bar"
            />
          </span>
          <span className="tl-card tl-m-draft">
            <span className="tl-card-head">
              <Ico icon={CalendarDays} tone={poster.tone} />
              {poster.card}
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
          <Done text={poster.done} />
          <Cursor />
        </div>
      ),
    },
    {
      key: 'todo',
      item: todo,
      icon: ListTodo,
      art: (
        <div className="tl-m tl-m-todo">
          <span className="tl-m-chat">
            <span>
              <Hl c="msg-0">{todo.chat[0]}</Hl>
            </span>
            <span data-me="">
              <Hl c="msg-1">{todo.chat[1]}</Hl>
              <Bar
                c="btn"
                icon={ListTodo}
                tone={todo.tone}
                label={todo.action}
              />
            </span>
          </span>
          <span className="tl-card tl-m-list">
            <span className="tl-card-head">
              <Ico icon={ListTodo} tone={todo.tone} />
              {todo.card}
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
          <Done text={todo.done} />
          <Cursor />
        </div>
      ),
    },
  ];

  return (
    <Gallery
      label={moments.kicker}
      head={head}
      foot={
        <>
          <p>{moments.wip}</p>
          <Note>{moments.note}</Note>
        </>
      }
      pieces={cards.map(({ key, item, icon, art }) => ({
        title: item.title,
        tone: item.tone,
        kind: item.kind,
        tag: tagOf(item.kind),
        icon: <Ico icon={icon} tone={item.tone} />,
        cue: `m-${key}`,
        art,
      }))}
    />
  );
}

/** 插件就是能力：登记一次 → 四个入口同时出现 → 结果接着交给下一个能力 → 停用时处处收起；开关访客可以亲手拨 */
export function Plugins() {
  const { surfaces } = plugins;
  return (
    <Loop
      className="tl-plug"
      label={plugins.label}
      note={plugins.note}
      cue="plug"
      interactive
    >
      <div className="tl-card tl-slip">
        <p className="tl-slip-head">
          <Ico icon={Puzzle} tone="butter" />
          <span id="tl-plug-name">
            <small>{plugins.kind}</small>
            <b>{plugins.name}</b>
          </span>
          <PlugSwitch c="plug-toggle" labelledBy="tl-plug-name" />
        </p>
        <dl>
          {plugins.spec.map(([key, value]) => (
            <div key={key}>
              <dt>{key}</dt>
              <dd>{value}</dd>
            </div>
          ))}
        </dl>
        <Cursor />
      </div>

      <div className="tl-surfaces" aria-hidden="true">
        <div className="tl-surface" data-s="1">
          <small>{surfaces.near.label}</small>
          <p className="tl-s-chips">
            <span className="tl-new">{plugins.name}</span>
            {surfaces.near.others.map((name) => (
              <span key={name}>{name}</span>
            ))}
          </p>
        </div>
        <div className="tl-surface" data-s="2">
          <small>{surfaces.menu.label}</small>
          <ul className="tl-s-menu">
            {surfaces.menu.others.map((name) => (
              <li key={name}>{name}</li>
            ))}
            <li className="tl-new">{plugins.name}</li>
          </ul>
        </div>
        <div className="tl-surface" data-s="3">
          <small>{surfaces.drop.label}</small>
          <p className="tl-s-drop">
            <FileAudio />
            <span>{surfaces.drop.hint}</span>
            <b className="tl-new">{plugins.name}</b>
          </p>
        </div>
        <div className="tl-surface" data-s="4">
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

      <p className="tl-chain" aria-hidden="true">
        <span className="tl-file" data-k="1">
          {plugins.chain[0]}
        </span>
        <ArrowRight data-k="2" />
        <b className="tl-step" data-tone="butter" data-k="2">
          {plugins.name}
        </b>
        <span className="tl-file" data-k="3">
          {plugins.chain[1]}
        </span>
        <ArrowRight data-k="4" />
        <b className="tl-step" data-tone="sky" data-k="4">
          {plugins.next}
        </b>
        <span className="tl-file" data-k="5">
          {plugins.chain[2]}
        </span>
      </p>
      <p className="tl-kept">{plugins.kept}</p>
    </Loop>
  );
}
