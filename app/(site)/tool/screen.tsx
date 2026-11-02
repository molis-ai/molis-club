import {
  ArrowUpNarrowWide,
  CalendarDays,
  Check,
  ChevronLeft,
  ChevronRight,
  Copy,
  Eraser,
  FileDown,
  FileStack,
  Languages,
  Lightbulb,
  Lock,
  Minimize2,
  NotebookPen,
  Repeat,
  Search,
  Sheet,
  Subtitles,
  Table2,
  type LucideIcon,
} from 'lucide-react';
import { Fragment, type ReactNode } from 'react';
import { toolDesk, toolPlug, toolWhy, type Wall } from '../../../content/site/tool';
import { mediaOf, type Vars } from '../../_site/ui';
import { Mine } from './mine';
import { Ico, Mark } from './parts';

// Tool 页从头到尾不离场的那块 Mac 屏幕：1200×760 的设计尺寸，大屏由 flow.tsx 整体缩放推拉，窄屏由 stack.tsx 拆开摆。
// 壁纸是莫奈的伦敦（早上、午后、傍晚，负责人 2026-10-24 选），屏幕上过完周五一天：浏览器、笔记、文件、邮件四扇窗按一天里打开的先后出现。
// 上面的 Molis Tool 照它桌面端的真实界面画（molis-tool packages/ui/DESIGN.md）：中性灰的托盘包着白色面板，颜色只给状态；
// 光标旁是一排动作签，身旁是一张小卡，收起的东西进菜单栏那枚四角取景框下面的「接续」。
// 每一拍画面的样子由外层的 data-* 记号决定（stateOf），一拍之内的几步（选中 → 动作签 → 小卡）写在 tool.css 的动画里。
// data-f 是镜头要对准、要照亮的那一处。不带 'use client'：服务端也能出。

export const W = 1200;
export const H = 760;

export type BeatId = 'hero' | 'use' | 'u1' | 'u2' | 'u3' | 'u4' | 'why' | 'c1' | 'c2' | 'c3' | 'coda' | 'end';
export type App = 'browser' | 'notes' | 'finder' | 'mail';

export const ORDER: BeatId[] = ['hero', 'use', 'u1', 'u2', 'u3', 'u4', 'why', 'c1', 'c2', 'c3', 'coda', 'end'];

/** 每一拍：一天里的什么时候（壁纸和菜单栏的时间）、最前面是哪个应用 */
const SCENE: Record<BeatId, { wall: Wall; clock: string; front: App }> = {
  hero: { wall: 'morning', clock: '周五 08:50', front: 'browser' },
  use: { wall: 'morning', clock: '周五 08:51', front: 'browser' },
  u1: { wall: 'morning', clock: '周五 09:12', front: 'notes' },
  u2: { wall: 'noon', clock: '周五 14:30', front: 'finder' },
  u3: { wall: 'dusk', clock: '周五 18:40', front: 'mail' },
  u4: { wall: 'dusk', clock: '周五 19:05', front: 'mail' },
  why: { wall: 'dusk', clock: '周五 19:10', front: 'notes' },
  c1: { wall: 'dusk', clock: '周五 19:10', front: 'notes' },
  c2: { wall: 'dusk', clock: '周五 19:11', front: 'notes' },
  c3: { wall: 'dusk', clock: '周五 19:20', front: 'finder' },
  coda: { wall: 'dusk', clock: '周五 19:30', front: 'finder' },
  end: { wall: 'dusk', clock: '周五 19:30', front: 'finder' },
};

export type Shown = {
  at: BeatId;
  wall: Wall;
  clock: string;
  front: App;
  /** 插件开关（第三屏最后一拍访客能拨） */
  plug: boolean;
};

export function shownAt(at: BeatId, plug = true): Shown {
  return { at, ...SCENE[at], plug };
}

/** 一拍的样子写成 data-* 记号：一路上做完的事留着（清理过、另存过、收进接续、整理成表格、排过序、生成过字幕） */
export function stateOf(s: Shown) {
  const n = ORDER.indexOf(s.at);
  const past = (id: BeatId) => n >= ORDER.indexOf(id) || undefined;
  return {
    'data-at': s.at,
    'data-front': s.front,
    'data-notes': past('u1'),
    'data-finder': past('u2'),
    'data-mail': past('u3'),
    'data-clean': past('u1'),
    'data-copy': past('u2'),
    'data-stowed': past('u3'),
    'data-quote': past('why'),
    'data-table': past('c1'),
    'data-sorted': past('c2'),
    'data-srt': past('c3'),
    'data-plug': s.plug || undefined,
  };
}

const WALLS = {
  morning: mediaOf('wall-morning'),
  noon: mediaOf('wall-noon'),
  dusk: mediaOf('wall-dusk'),
};

const D = toolDesk;

// ---------------------------------------------------------------------
// Molis Tool 的几样界面
// ---------------------------------------------------------------------

/** 取景框：选区四角四个折角 */
function Frame() {
  return (
    <span className="tl-frame" aria-hidden="true">
      <i />
      <i />
      <i />
      <i />
    </span>
  );
}

/** 光标旁的一排动作签：灰托盘，第一个是白底带边的 */
function Chips({ k, f, items, icons }: { k: string; f?: string; items: string[]; icons: LucideIcon[] }) {
  return (
    <span className="tl-chips" data-k={k} data-f={f}>
      {items.map((item, index) => (
        <span key={item} className="tl-chip" data-first={index === 0 || undefined}>
          <Ico icon={icons[index]} />
          {item}
        </span>
      ))}
    </span>
  );
}

/** 身旁的小卡：灰托盘的头，白色的身子，底下一排按钮 */
function Card({
  k,
  f,
  title,
  icon,
  tag,
  foot,
  children,
}: {
  k: string;
  /** 镜头对准的那一处：和选区合成一块 */
  f?: string;
  title: string;
  icon: LucideIcon;
  tag?: string;
  foot?: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="tl-card" data-k={k} data-f={f}>
      <p className="tl-card-h">
        <Ico icon={icon} />
        <b>{title}</b>
        {tag ? <em>{tag}</em> : null}
      </p>
      <div className="tl-card-b">{children}</div>
      {foot ? <div className="tl-card-f">{foot}</div> : null}
    </div>
  );
}

/** 做完留在原处的一枚签 */
function Done({ k, f, text }: { k: string; f?: string; text: string }) {
  return (
    <span className="tl-done" data-k={k} data-f={f}>
      <Check />
      {text}
    </span>
  );
}

function Btn({ main = false, k, children }: { main?: boolean; k?: string; children: ReactNode }) {
  return (
    <span className="tl-btn" data-main={main || undefined} data-k={k}>
      {children}
    </span>
  );
}

// ---------------------------------------------------------------------
// 桌面：壁纸、菜单栏、窗
// ---------------------------------------------------------------------

function Walls({ wall, eager }: { wall: Wall; eager?: boolean }) {
  return (
    <span className="tl-walls" aria-hidden="true">
      {(Object.keys(WALLS) as Wall[]).map((name) => {
        const image = WALLS[name];
        return (
          <img
            key={name}
            src={image.src}
            srcSet={image.srcset.map(([src, w]) => `${src} ${w}w`).join(', ')}
            sizes="(min-width: 1024px) 90vw, 100vw"
            alt=""
            width={image.width}
            height={image.height}
            data-on={name === wall || undefined}
            loading={eager && name === 'morning' ? 'eager' : 'lazy'}
            decoding="async"
          />
        );
      })}
    </span>
  );
}

export function MenuBar({ s }: { s: Shown }) {
  return (
    <div className="tl-menubar">
      <b>{D.apps[s.front]}</b>
      {D.menus[s.front].map((menu) => (
        <span key={menu}>{menu}</span>
      ))}
      <span className="tl-menubar-end">
        <span className="tl-menubar-mark" data-f="mark">
          <Mark dot={ORDER.indexOf(s.at) >= ORDER.indexOf('u3')} />
        </span>
        <span>{s.clock}</span>
      </span>
    </div>
  );
}

/** 一扇窗：标题栏（三个灯、标题），下面是内容；over 是浮在窗上、可以伸出窗外的 Molis Tool 界面 */
function Win({
  app,
  title,
  tools,
  over,
  children,
}: {
  app: App;
  title: ReactNode;
  tools?: ReactNode;
  over?: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="tl-win" data-app={app}>
      <div className="tl-win-in">
        <div className="tl-win-top">
          <span className="tl-lights">
            <i />
            <i />
            <i />
          </span>
          <b>{title}</b>
          {tools}
        </div>
        <div className="tl-win-body">{children}</div>
      </div>
      {over}
    </div>
  );
}

// ---------------------------------------------------------------------
// 四扇窗
// ---------------------------------------------------------------------

/** 浏览器：首屏读一篇英文网页，划出一句 → 翻译 · 解释 · 记下 → 译文和出处出现在旁边 */
export function Browser() {
  const p = D.page;
  return (
    <Win
      app="browser"
      title={
        <span className="tl-url">
          <ChevronLeft />
          <ChevronRight />
          <span>
            <Lock />
            {p.url}
          </span>
        </span>
      }
      over={
        <Card
          k="tr"
          f="tr"
          title={p.card}
          icon={Languages}
          tag="AI"
          foot={
            <>
              <code>{p.source}</code>
              <Btn>{p.copy}</Btn>
            </>
          }
        >
          {p.result}
        </Card>
      }
    >
      <article className="tl-page" lang="en">
        <h4>{p.heading}</h4>
        <p className="tl-page-intro">{p.intro}</p>
        <p>
          <span className="tl-sel" data-k="tr" data-f="tr">
            {p.select}
            <Frame />
            <Chips k="tr" f="tr" items={p.chips} icons={[Languages, Lightbulb, NotebookPen]} />
          </span>
          {p.rest}
        </p>
        <p>{p.more}</p>
        <h5>{p.heading2}</h5>
        <p>{p.text2}</p>
      </article>
    </Win>
  );
}

/** 笔记：早上清理一句从群里转来的通知；傍晚把三行报价整理成表格，再排个序 */
export function Notes() {
  const { meet, quote, list } = D.notes;
  return (
    <Win app="notes" title={D.apps.notes}>
      <div className="tl-notes">
        <ul className="tl-notes-list">
          {list.map(([name, time]) => (
            <li key={name} data-k={name === meet.title ? 'meet' : name === quote.title ? 'quote' : undefined}>
              <b>{name}</b>
              <small>{time}</small>
            </li>
          ))}
        </ul>
        <div className="tl-notes-panes">
          <div className="tl-memo" data-k="meet">
            <h4>{meet.title}</h4>
            <small>{meet.meta}</small>
            <p>{meet.before}</p>
            <p data-f="meet">
              <span className="tl-sel" data-k="meet">
                {meet.messy.map((part, index) => (
                  <Fragment key={part}>
                    {index ? <i className="tl-gap" style={{ '--g': `${index % 2 ? 1.6 : 0.9}em` } as Vars} /> : null}
                    {part}
                  </Fragment>
                ))}
                <Frame />
                <Chips k="meet" f="meet" items={meet.chips} icons={[Eraser, Languages, Copy]} />
                <Done k="meet" f="meet" text={meet.done} />
              </span>
            </p>
            <p>{meet.after}</p>
          </div>
          <div className="tl-memo" data-k="quote">
            <h4>{quote.title}</h4>
            <small>{quote.meta}</small>
            <div className="tl-quote" data-f="quote">
              <div className="tl-sel tl-lines" data-k="lines">
                {quote.lines.map((line) => (
                  <p key={line}>{line}</p>
                ))}
                <Frame />
                <Chips k="lines" f="quote" items={quote.chips} icons={[Table2, Copy]} />
              </div>
              <div className="tl-table">
                <table>
                  <thead>
                    <tr>
                      {quote.head.map((cell) => (
                        <th key={cell}>{cell}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {quote.rows.map((row, index) => (
                      <tr key={row[0]} style={{ '--m': quote.moves[index] } as Vars}>
                        {row.map((cell, i) => (
                          <td key={i}>{cell}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
                <Chips k="table" f="quote" items={quote.next} icons={[ArrowUpNarrowWide, FileDown]} />
                <Done k="table" f="quote" text={quote.done} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </Win>
  );
}

function File({ name, kind, k }: { name: string; kind: string; k?: string }) {
  return (
    <span className="tl-file" data-k={k}>
      <i data-kind={kind}>
        <b>{kind}</b>
      </i>
      <span>{name}</span>
    </span>
  );
}

/** 文件：午后从一份 PDF 里取出几页另存一份；傍晚装上「生成字幕」插件，给一段访谈录音配字幕 */
export function Finder() {
  const { files, pdf, srt, audioChips } = D.finder;
  return (
    <Win
      app="finder"
      title={D.finder.folder}
      over={
        <Card
          k="pdf"
          f="pdf"
          title={pdf.card}
          icon={FileStack}
          foot={
            <>
              <small>{pdf.range}</small>
              <Btn k="cancel">{pdf.cancel}</Btn>
              <Btn main k="save">
                {pdf.save}
              </Btn>
              <Done k="pdf" text={pdf.done} />
            </>
          }
        >
          <span className="tl-pages">
            {pdf.pages.map((page, index) => (
              <span
                key={page}
                className="tl-page-thumb"
                data-pick={pdf.picked.includes(index) || undefined}
                style={{ '--i': pdf.picked.indexOf(index) } as Vars}
              >
                <b>{page}</b>
                <i />
                <i />
                <i />
                <small>{index + 1}</small>
              </span>
            ))}
          </span>
        </Card>
      }
    >
      <div className="tl-files">
        {files.map((file) => (
          <span
            key={file.name}
            className="tl-file-slot"
            data-k={file.kind === 'PDF' ? 'pdf' : file.kind === 'M4A' ? 'audio' : undefined}
            data-f={file.kind === 'PDF' ? 'pdf' : file.kind === 'M4A' ? 'plug' : undefined}
          >
            <File name={file.name} kind={file.kind} />
            {file.kind === 'PDF' ? <Chips k="pdf" f="pdf" items={pdf.chips} icons={[FileStack, Minimize2]} /> : null}
            {file.kind === 'M4A' ? (
              <span className="tl-chips" data-k="audio" data-f="plug">
                <span className="tl-chip" data-first="" data-plug="">
                  <Ico icon={Subtitles} />
                  {toolPlug.name}
                </span>
                {audioChips.map((item) => (
                  <span key={item} className="tl-chip">
                    <Ico icon={Repeat} />
                    {item}
                  </span>
                ))}
              </span>
            ) : null}
          </span>
        ))}
        <span className="tl-file-slot" data-k="copy" data-f="pdf">
          <File name={pdf.copy} kind="PDF" />
        </span>
        <span className="tl-file-slot" data-k="srt" data-f="plug">
          <File name={srt} kind="SRT" />
        </span>
      </div>
    </Win>
  );
}

/** 邮件：傍晚收到市集的通知，划出时间 → 日程草稿 → 收进接续 */
export function Mail() {
  const m = D.mail;
  return (
    <Win
      app="mail"
      title={m.subject}
      over={
        <Card
          k="draft"
          f="date"
          title={m.card}
          icon={CalendarDays}
          foot={
            <>
              <Btn>{m.cancel}</Btn>
              <Btn main k="stow">
                {m.stow}
              </Btn>
            </>
          }
        >
          <dl className="tl-fields">
            {m.fields.map(([term, value]) => (
              <Fragment key={term}>
                <dt>{term}</dt>
                <dd>{value}</dd>
              </Fragment>
            ))}
          </dl>
        </Card>
      }
    >
      <div className="tl-mail">
        <p className="tl-mail-from">
          <i>{m.from.slice(0, 1)}</i>
          <span>
            <b>{m.from}</b>
            <small>{m.to}</small>
          </span>
        </p>
        <h4>{m.subject}</h4>
        <p>{m.hello}</p>
        <p data-f="date">
          <span className="tl-sel" data-k="date">
            {m.select}
            <Frame />
            <Chips k="date" f="date" items={m.chips} icons={[CalendarDays, Languages]} />
          </span>
          {m.rest}
        </p>
        <p>{m.tail}</p>
      </div>
    </Win>
  );
}

/** 接续：菜单栏那枚取景框下面落下来的面板，收起的东西都在这里；最上面一行是访客自己刚才在这一页做过的事 */
export function Later() {
  const l = D.later;
  return (
    <div className="tl-later" data-f="later">
      <p className="tl-later-h">
        <Mark />
        <b>{l.title}</b>
      </p>
      <p className="tl-later-tabs">
        {l.tabs.map((tab, index) => (
          <span key={tab} data-on={index === 0 || undefined}>
            {tab}
          </span>
        ))}
      </p>
      <ul>
        <Mine title={l.mine} from={l.mineFrom} />
        {l.rows.map((row, index) => (
          <li key={row.name} className="tl-later-row" data-need={index === 0 || undefined}>
            <b>{row.name}</b>
            <small>{row.meta}</small>
            <em>{row.state}</em>
            {index === 0 ? (
              <span className="tl-later-go">
                <Btn main>{l.confirm}</Btn>
                <Btn>{l.edit}</Btn>
              </span>
            ) : null}
          </li>
        ))}
      </ul>
    </div>
  );
}

/** 命令条：⌥⌘空格 叫出来，插件登记的能力也在这里 */
export function Command() {
  const c = D.command;
  return (
    <div className="tl-cmd" data-f="plug">
      <p className="tl-cmd-in">
        <Search />
        <b>{c.query}</b>
        <kbd>{c.keys}</kbd>
      </p>
      <p className="tl-cmd-hit">
        <Ico icon={Subtitles} />
        <b>{toolPlug.name}</b>
        <span>{c.hit}</span>
        <em>{c.where}</em>
      </p>
    </div>
  );
}

/** 整块屏幕 */
export function Screen({ s, eager }: { s: Shown; eager?: boolean }) {
  return (
    <div className="tl-scr" {...stateOf(s)}>
      <Walls wall={s.wall} eager={eager} />
      <MenuBar s={s} />
      <Browser />
      <Notes />
      <Finder />
      <Mail />
      <Later />
      <Command />
    </div>
  );
}

// ---------------------------------------------------------------------
// 屏幕外：以前那条路
// ---------------------------------------------------------------------

const STEP_ICON = { sheet: Sheet, notes: NotebookPen } as const;

/** 以前：把三行报价变成表格，要在两个应用之间走四步 */
export function Before() {
  const b = toolWhy.before;
  return (
    <div className="tl-before-card">
      <p className="tl-before-h">{b.label}</p>
      <ol>
        {b.steps.map((step) => (
          <li key={step.text}>
            <Ico icon={STEP_ICON[step.app]} />
            {step.text}
          </li>
        ))}
      </ol>
    </div>
  );
}
