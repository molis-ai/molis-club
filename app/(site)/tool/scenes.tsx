import {
  ArrowUpRight,
  CalendarDays,
  Check,
  Copy,
  CornerUpLeft,
  Eraser,
  FileText,
  Languages,
  Minimize2,
  Repeat,
  Search,
  Subtitles,
  Table2,
  type LucideIcon,
} from 'lucide-react';
import type { ReactNode } from 'react';
import { cases, plugins, shift, type Tone } from '../../../content/site/tool';
import { mediaOf, type Vars } from '../../_site/ui';
import { PlugSwitch } from './controls';
import { Dock, FileIcon, Menus, Pin, Screen, Win } from './mac';
import { Mine } from './mine';
import { Cursor, Hl, Ico } from './parts';

// Tool 页首屏之后的五块屏幕（钉在右边，walk.tsx 按滚动换）。这里只摆好「做完了」的样子和光标；
// 怎么一拍一拍演出来写在 scripts.ts，每一拍的样子写在 tool.css。data-c 是脚本找零件用的名字。

/** 选区末端的动作条：几个动作，第一个是光标要去按的（c） */
function Chips({
  c,
  actions,
  icons,
}: {
  c: string;
  actions: { label: string; tone: Tone }[];
  icons: LucideIcon[];
}) {
  return (
    <span className="tl-anchor">
      <span className="tl-bar">
        {actions.map((action, index) => (
          <span
            key={action.label}
            className="tl-bar-btn"
            data-first={index === 0 || undefined}
            data-c={index === 0 ? c : undefined}
          >
            <Ico icon={icons[index]} tone={action.tone} />
            {action.label}
          </span>
        ))}
      </span>
    </span>
  );
}

/** 做完以后留在画面上的一句 */
function Done({ text }: { text: string }) {
  return (
    <span className="tl-done">
      <Check />
      {text}
    </span>
  );
}

// ---------------------------------------------------------------------
// 以前与现在
// ---------------------------------------------------------------------

/** 两台里同一张笔记：三行报价，表格在后面等着换上来；现在那台的最后一行末尾挂着动作条 */
function QuoteNote({ chips = false }: { chips?: boolean }) {
  const { notes, after } = shift;
  const last = notes.lines.length - 1;
  return (
    <Win className="tl-notes-win" title={notes.title}>
      <span className="tl-note" data-c="note">
        <b className="tl-note-title">{notes.title}</b>
        <small className="tl-note-meta">{notes.meta}</small>
        <span className="tl-swap">
          <span className="tl-note-lines">
            {notes.lines.map((line, index) => (
              <span key={line} className="tl-note-line">
                <Hl c={`line-${index}`}>{line}</Hl>
                {chips && index === last ? (
                  <Chips
                    c="after-btn"
                    actions={after.actions}
                    icons={[Table2, Copy]}
                  />
                ) : null}
              </span>
            ))}
          </span>
          <span className="tl-table">
            <span className="tl-tr" data-head="">
              {shift.head.map((cell) => (
                <span key={cell}>{cell}</span>
              ))}
            </span>
            {shift.rows.map((row, index) => (
              <span
                key={row[0]}
                className="tl-tr"
                style={{ '--n': index } as Vars}
              >
                {row.map((cell, cellIndex) => (
                  <span key={cellIndex}>{cell}</span>
                ))}
              </span>
            ))}
          </span>
        </span>
      </span>
    </Win>
  );
}

/** 一台下面的一行：以前 / 现在，走了几步。0 到 steps 叠在一处，tool.css 跟着拍子亮其中一个；做完了的样子亮最后一个 */
function Tally({ label, steps }: { label: string; steps: number }) {
  return (
    <p className="tl-tally">
      <b>{label}</b>
      <span className="tl-count">
        <span className="tl-digits">
          {Array.from({ length: steps + 1 }, (_, n) => (
            <i key={n} data-n={n}>
              {n}
            </i>
          ))}
        </span>
        {shift.unit}
      </span>
    </p>
  );
}

/**
 * 以前与现在（早上）：两台一样的 Mac，同一张笔记，同一刻开演（各有一只光标，scripts.ts 两条线一起走）。
 * 左边老路——光标跑到程序坞开表格、把字搬过去、到菜单栏找「分列」、再带回来，每到一站插一枚带序号的签；
 * 右边原地选中，光标旁一步，做完就停在表上等左边。两台下面各记走了几步
 */
export function ShiftScreen() {
  const { notes, sheet, before, after } = shift;
  const sizes = '(max-width: 900px) 100vw, 31vw';
  return (
    <>
      <div className="tl-twin" data-side="was">
        <div className="tl-twin-mac">
          <Screen
            className="tl-s-shift"
            wall={shift.wall}
            sizes={sizes}
            app={
              <>
                <span data-app="notes">{notes.app}</span>
                <span data-app="sheet">{sheet.app}</span>
              </>
            }
            menus={
              <>
                <span className="tl-menus" data-app="notes">
                  <Menus items={notes.menus} />
                </span>
                <span className="tl-menus" data-app="sheet">
                  {sheet.menus.map((menu) =>
                    menu === sheet.menu ? (
                      <span key={menu} className="tl-menu-at" data-c="menu">
                        {menu}
                        <span className="tl-dropdown">
                          {sheet.items.map((item, index) => (
                            <span
                              key={item}
                              data-c={index === sheet.pick ? 'pick' : undefined}
                            >
                              {item}
                            </span>
                          ))}
                        </span>
                      </span>
                    ) : (
                      <span key={menu}>{menu}</span>
                    ),
                  )}
                </span>
              </>
            }
            clock={shift.clock}
          >
            <Win className="tl-sheet-win" title={sheet.title}>
              <span className="tl-grid" data-c="grid">
                <span data-corner="" />
                {['A', 'B', 'C', 'D'].map((col) => (
                  <span key={col} data-col="">
                    {col}
                  </span>
                ))}
                {Array.from({ length: 5 }, (_, index) => {
                  const row = shift.rows[index];
                  return [
                    <span key={`n${index}`} data-num="">
                      {index + 1}
                    </span>,
                    ...Array.from({ length: 4 }, (_, col) => (
                      <span
                        key={`${index}-${col}`}
                        className="tl-cell"
                        data-c={index === 0 && col === 0 ? 'cell' : undefined}
                      >
                        {row && col === 0 ? (
                          <span className="tl-raw">{notes.lines[index]}</span>
                        ) : null}
                        {row && col < 3 ? (
                          <span className="tl-split">{row[col]}</span>
                        ) : null}
                      </span>
                    )),
                  ];
                })}
              </span>
            </Win>
            <Dock apps={shift.dock} />
            {shift.stops.map((stop, index) => (
              <Pin key={stop} k={index} n={index + 1}>
                {stop}
              </Pin>
            ))}
            <QuoteNote />
            <Cursor />
          </Screen>
        </div>
        <Tally label={before.label} steps={shift.stops.length} />
      </div>

      <div className="tl-twin" data-side="now">
        <div className="tl-twin-mac">
          <Screen
            className="tl-s-shift"
            wall={shift.wall}
            sizes={sizes}
            app={notes.app}
            menus={<Menus items={notes.menus} />}
            clock={shift.clock}
          >
            <Dock apps={shift.dock} />
            <Pin k="now">{after.stop}</Pin>
            <QuoteNote chips />
            <Cursor />
          </Screen>
        </div>
        <Tally label={after.label} steps={1} />
      </div>
    </>
  );
}

// ---------------------------------------------------------------------
// 眼前的小事：三件事，三层，一天里的三个时刻
// ---------------------------------------------------------------------

/**
 * 一句格式乱掉的话：从群里转来的，带着粗细不一、缩进和换行。编排时先是乱的（tool.css），
 * 清理时每一截从原处滑进干净的一句，句末补上句号。end 挂在最后一截末尾（选区末端的动作条）
 */
function Messy({
  parts,
  c,
  end,
}: {
  parts: readonly string[];
  c: string;
  end?: ReactNode;
}) {
  return (
    <span className="tl-messy" data-c={c}>
      {parts.map((part, index) => (
        <span key={part} className="tl-frag tl-hl" data-c={`${c}-${index}`}>
          <span>{part}</span>
          {index === parts.length - 1 ? end : null}
        </span>
      ))}
      <span className="tl-stop">。</span>
    </span>
  );
}

/** 光标旁（早上）：笔记里一段从群里转来的通知，格式乱了；选中，点「清理格式」，就在原处收拢 */
export function Near() {
  const near = cases.near;
  return (
    <Screen
      className="tl-s-near"
      wall={near.wall}
      app={near.app}
      menus={<Menus items={near.menus} />}
      clock={near.clock}
    >
      <Win className="tl-c1-win" title={near.title}>
        <span className="tl-notes">
          <span className="tl-notes-list">
            {near.list.map(([title, time], index) => (
              <span key={title} data-on={index === 0 || undefined}>
                <b>{title}</b>
                <small>{time}</small>
              </span>
            ))}
          </span>
          <span className="tl-note">
            <b className="tl-note-title">{near.title}</b>
            <small className="tl-note-meta">{near.meta}</small>
            <span className="tl-note-p">{near.before}</span>
            <span className="tl-note-p tl-note-messy" data-c="paper">
              <Messy
                parts={near.messy}
                c="text"
                end={
                  <Chips
                    c="btn"
                    actions={near.actions}
                    icons={[Eraser, Languages, Copy]}
                  />
                }
              />
              <Done text={near.done} />
            </span>
            <span className="tl-note-p">{near.after}</span>
          </span>
        </span>
      </Win>
      <Cursor />
    </Screen>
  );
}

/** 身旁（午后）：下载文件夹里一份报价.pdf；选中，点「取出几页」，旁边展开一张小卡挑页，另存一份，原件不动 */
export function Beside() {
  const beside = cases.beside;
  const cover = String(mediaOf('tool-light').srcset[0][0]);
  return (
    <Screen
      className="tl-s-beside"
      wall={beside.wall}
      app={beside.app}
      menus={<Menus items={beside.menus} />}
      clock={beside.clock}
    >
      <Win className="tl-c2-win" title={beside.folder}>
        <span className="tl-icons">
          {beside.files.map((file, index) => (
            <span
              key={file.name}
              className="tl-icon"
              data-c={index === 0 ? 'pdf' : undefined}
            >
              <FileIcon kind={file.kind} thumb={cover} />
              <small>{file.name}</small>
              {index === 0 ? (
                <Chips
                  c="btn"
                  actions={beside.actions}
                  icons={[FileText, Minimize2]}
                />
              ) : null}
            </span>
          ))}
          <span className="tl-icon" data-c="copy">
            <FileIcon kind="pdf" />
            <small>{beside.copy}</small>
          </span>
        </span>
      </Win>

      <span className="tl-card tl-c2-card" data-c="card">
        <span className="tl-card-head">
          <Ico icon={FileText} tone={beside.tone} />
          {beside.card}
          <small>{beside.files[0].name}</small>
        </span>
        <span className="tl-pages">
          {beside.pages.map(([title, ...lines], index) => (
            <span
              key={title}
              className="tl-pg"
              data-c={`pg-${index}`}
              data-pick={beside.picked.includes(index) || undefined}
            >
              <span className="tl-pg-paper">
                <b>{title}</b>
                {lines.map((line) => (
                  <i key={line}>{line}</i>
                ))}
              </span>
              <small>{index + 1}</small>
            </span>
          ))}
        </span>
        <span className="tl-card-foot">
          <span className="tl-pages-range">{beside.range}</span>
          <span className="tl-card-go">
            <span>{beside.cancel}</span>
            <span data-solid="" data-c="save">
              {beside.save}
            </span>
          </span>
        </span>
        <Done text={beside.done} />
      </span>
      <Cursor />
    </Screen>
  );
}

/**
 * 离开以后（傍晚）：一封活动邮件；选中日期，点「整理成日程」，草稿收进「接续」；去做别的，
 * 过一会儿从菜单栏打开接续，草稿等你确认——早上清理的那句、午后另存的那份也都在
 */
export function Later() {
  const later = cases.later;
  return (
    <Screen
      className="tl-s-later"
      wall={later.wall}
      app={later.app}
      menus={<Menus items={later.menus} />}
      clock={
        <>
          <span data-t="now">{later.clock}</span>
          <span data-t="later">{later.clockLater}</span>
        </>
      }
    >
      <Win className="tl-c3-win" title={later.subject}>
        <span className="tl-mail">
          <span className="tl-mail-from">
            <i>{later.from.slice(0, 1)}</i>
            <b>{later.from}</b>
            <small>{later.to}</small>
          </span>
          <b className="tl-mail-subject">{later.subject}</b>
          <span className="tl-mail-p">{later.hello}</span>
          <span className="tl-mail-p">
            <span className="tl-row">
              <Hl c="when">{later.select}</Hl>
              <Chips
                c="btn"
                actions={later.actions}
                icons={[CalendarDays, Languages]}
              />
            </span>
            {later.rest}
          </span>
          <span className="tl-mail-p">{later.tail}</span>
        </span>
      </Win>

      <span className="tl-card tl-c3-draft" data-c="draft">
        <span className="tl-card-head">
          <Ico icon={CalendarDays} tone={later.tone} />
          {later.card}
        </span>
        {later.fields.map(([key, value], index) => (
          <span key={key} className="tl-field" style={{ '--n': index } as Vars}>
            <small>{key}</small>
            {value}
          </span>
        ))}
        <span className="tl-stow">
          <ArrowUpRight />
          {later.stowed}
        </span>
      </span>

      <span className="tl-panel">
        <span className="tl-panel-head">{later.panel}</span>
        <ul className="tl-panel-rows">
          <Mine title={later.mine} from={later.mineFrom} />
          {later.rows.map((row, index) => (
            <li
              key={row.name}
              className="tl-panel-row"
              data-c={index === 0 ? 'row' : undefined}
              style={{ '--n': index } as Vars}
            >
              <Ico
                icon={[CalendarDays, Eraser, FileText][index]}
                tone={row.tone}
              />
              <span>
                <b>{row.name}</b>
                <small>{row.meta}</small>
              </span>
              {index === 0 ? (
                <span className="tl-panel-go">
                  <span>{later.edit}</span>
                  <span data-solid="">{later.confirm}</span>
                </span>
              ) : null}
            </li>
          ))}
        </ul>
        <span className="tl-panel-back">
          <CornerUpLeft />
          {later.back}
        </span>
      </span>
      <Cursor />
    </Screen>
  );
}

// ---------------------------------------------------------------------
// 插件就是能力
// ---------------------------------------------------------------------

/**
 * 插件就是能力（傍晚）：设置里拨开「生成字幕」→ 光标旁、右键、拖放、命令条四处同时出现 → 点一下，生成访谈.srt →
 * 再拨一下，四处一起收起，字幕还在。开关访客可以亲手拨
 */
export function PlugScreen() {
  const name = plugins.name;
  const cover = String(mediaOf('tool-light').srcset[0][0]);
  const kinds = ['audio', 'image', 'video'] as const;
  return (
    <Screen
      className="tl-s-plug"
      wall={plugins.wall}
      app={plugins.app}
      menus={<Menus items={plugins.menus} />}
      clock={plugins.clock}
      sizes="(max-width: 900px) 100vw, 62vw"
    >
      <Win className="tl-set-win" title={plugins.settings}>
        <span className="tl-set-list">
          {plugins.list.map((item, index) => (
            <span key={item.name} className="tl-set-row">
              <Ico
                icon={[Subtitles, Languages, Eraser][index]}
                tone={item.tone}
              />
              <span id={index === 0 ? 'tl-plug-name' : undefined}>
                <b>{item.name}</b>
                <small>{item.spec}</small>
              </span>
              {index === 0 ? (
                <PlugSwitch c="plug-toggle" labelledBy="tl-plug-name" />
              ) : (
                <i className="tl-switch" aria-hidden="true" />
              )}
            </span>
          ))}
        </span>
      </Win>

      <div aria-hidden="true">
        <span className="tl-cmd">
          <span className="tl-cmd-field">
            <Search />
            {plugins.query}
          </span>
          <span className="tl-cmd-hit tl-new" data-s="4">
            <Ico icon={Subtitles} tone={plugins.tone} />
            {name}
            <small>{plugins.where}</small>
          </span>
        </span>

        <Win className="tl-fin-win" title={plugins.folder}>
          <span className="tl-rows">
            <span className="tl-rows-head">
              {plugins.columns.map((column) => (
                <span key={column}>{column}</span>
              ))}
            </span>
            {plugins.files.map(([file, size], index) => (
              <span
                key={file}
                className="tl-file-row"
                data-sel={index === 0 || undefined}
              >
                <FileIcon kind={kinds[index]} thumb={cover} />
                <span>{file}</span>
                {index === 0 ? (
                  <span className="tl-anchor">
                    <span className="tl-bar">
                      <span
                        className="tl-bar-btn tl-new"
                        data-first=""
                        data-s="1"
                        data-c="gen"
                      >
                        <Ico icon={Subtitles} tone={plugins.tone} />
                        {name}
                      </span>
                      {plugins.near.map((other) => (
                        <span key={other} className="tl-bar-btn">
                          <Ico icon={Repeat} tone="sage" />
                          {other}
                        </span>
                      ))}
                    </span>
                  </span>
                ) : null}
                <small>{size}</small>
                {index === 2 ? (
                  <span className="tl-context">
                    {plugins.menu.map((item) => (
                      <span key={item}>{item}</span>
                    ))}
                    <span className="tl-new" data-s="2">
                      <Subtitles />
                      {name}
                    </span>
                  </span>
                ) : null}
              </span>
            ))}
            <span className="tl-file-row tl-made">
              <FileIcon kind="doc" />
              <span>{plugins.made[0]}</span>
              <small>{plugins.made[1]}</small>
            </span>
          </span>
        </Win>

        <span className="tl-drop">
          <FileIcon kind="audio" />
          <span>{plugins.drop}</span>
          <b className="tl-new" data-s="3">
            <Subtitles />
            {name}
          </b>
        </span>

        {plugins.surfaces.map((surface, index) => (
          <Pin key={surface} k={index + 1}>
            {surface}
          </Pin>
        ))}
      </div>
      <Cursor />
    </Screen>
  );
}
