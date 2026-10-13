'use client';
import {
  ArrowRight,
  Bell,
  CalendarPlus,
  Check,
  FileImage,
  FileText,
  Quote,
  RotateCcw,
} from 'lucide-react';
import { folioTool } from '../../../../../content/folio';
import { moments } from '../../../../../content/molis-tool';
import { pad } from '../routes';
import { type Vars } from '../shell';
import { DemoToggle, useTimeline } from './demo';

// 03 一天里的几个时刻：左边六行是目录，右边一块图版只演当前这一行——眼前的东西 → Molis Tool 动一下 →
// 结果就在原处。自动按顺序轮一遍（当前行下面一条细线走完就换下一行）；点任何一行就停在那一行。
// 画面里的示例内容沿用 Folio 最新版 tool/moments.tsx 的示意（海报一格与 folioTool.layers.beside 相同）。

// 每个时刻三步：0 眼前的东西 → 1 动一下 → 2 结果（停留）
const BEATS = [500, 1000, 3800];
const STEPS = moments.items.flatMap(() => BEATS);
const HOLDS = moments.items.map((_, index) => index * 3 + 2);
const CYCLE = BEATS.reduce((sum, value) => sum + value, 0);

const sample = {
  watch: {
    page: '周末工作坊 · 报名',
    seat: ['剩余名额', '位'],
    count: ['0', '3'],
    tag: '只关注这一块',
    toast: '名额 0 → 3，有新名额了',
  },
  chat: {
    who: '小周',
    them: '发布页周五前改好，我来补文案。',
    me: '好，周五上线。',
    todo: '补齐发布页文案',
    meta: '小周 · 周五前',
    quote: '原话',
  },
  batch: {
    files: ['IMG_2041.jpg', 'IMG_2042.jpg', 'IMG_2043.jpg'],
    renamed: ['展览-01.jpg', '展览-02.jpg', '展览-03.jpg'],
    preview: '先预览',
    done: '已处理 · 可还原',
  },
  agent: {
    app: 'Claude Code',
    busy: '正在做',
    wait: '等你一下',
    mine: '你在写自己的东西',
    ping: '需要你确认这一步',
    go: '去看看',
  },
  research: {
    docs: ['方案 A.pdf', '方案 B.pdf'],
    head: ['维度', 'A', 'B'],
    rows: [
      ['部署', '本机', '托管'],
      ['适合', '个人', '协作'],
    ],
    tag: '每一格都找得到出处',
  },
  confirm: '等你确认',
};

function Scene({ index, phase }: { index: number; phase: number }) {
  const acting = phase >= 1;
  const done = phase >= 2;
  if (index === 0) {
    const poster = folioTool.layers.beside;
    return (
      <div className="etm-scene etm-poster-scene">
        <div className="etl-poster">
          <span className="etl-sun" />
          <b lang="en">{poster.day}</b>
          <i lang="en">{poster.month}</i>
          <strong>
            {poster.title[0]}
            <br />
            {poster.title[1]}
          </strong>
          <span className="etl-marquee" data-on={acting}>
            <i />
            <i />
            <i />
            <i />
          </span>
        </div>
        <div className="etm-draft" data-on={done}>
          <em>
            <CalendarPlus size={13} />
            {poster.card}
          </em>
          {poster.fields.map(([key, value], n) => (
            <p key={key}>
              <span
                data-on={done}
                style={{ transitionDelay: `${200 + n * 320}ms` }}
              >
                {value}
              </span>
            </p>
          ))}
          <span className="etm-flag" data-on={done}>
            {sample.confirm}
          </span>
        </div>
      </div>
    );
  }
  if (index === 1) {
    const { watch } = sample;
    return (
      <div className="etm-scene etm-watch">
        <div className="etm-sheet">
          <small>{watch.page}</small>
          <div className="etm-seat" data-on={acting}>
            {watch.seat[0]}
            <span className="etm-count" data-on={done}>
              <b>{watch.count[0]}</b>
              <b>{watch.count[1]}</b>
            </span>
            {watch.seat[1]}
            <span className="etm-region" />
            <span className="etm-flag etm-flag-region">{watch.tag}</span>
          </div>
          <i className="etm-line" />
          <i className="etm-line etm-line-short" />
        </div>
        <p className="etm-toast" data-on={done}>
          <Bell size={14} />
          {watch.toast}
        </p>
      </div>
    );
  }
  if (index === 2) {
    const { chat } = sample;
    return (
      <div className="etm-scene etm-chat">
        <div className="etm-thread" data-on={acting}>
          <p className="etm-bubble">
            <small>{chat.who}</small>
            {chat.them}
          </p>
          <p className="etm-bubble etm-bubble-me">{chat.me}</p>
        </div>
        <div className="etm-todo" data-on={done}>
          <Check size={15} strokeWidth={2.5} />
          <div>
            <strong>{chat.todo}</strong>
            <small>{chat.meta}</small>
          </div>
          <span>
            <Quote size={11} />
            {chat.quote}
          </span>
        </div>
      </div>
    );
  }
  if (index === 3) {
    const { batch } = sample;
    return (
      <div className="etm-scene etm-batch">
        <ul>
          {batch.files.map((name, n) => (
            <li
              key={name}
              data-acting={acting}
              data-on={done}
              style={{ transitionDelay: `${n * 140}ms` }}
            >
              <FileImage size={14} />
              <span className="etm-old">{name}</span>
              <ArrowRight size={12} className="etm-arrow" />
              <span className="etm-new">{batch.renamed[n]}</span>
            </li>
          ))}
        </ul>
        <p className="etm-batch-foot">
          <span className="etm-preview" data-on={acting && !done}>
            {batch.preview}
          </span>
          <span className="etm-flag etm-flag-done" data-on={done}>
            <Check size={13} strokeWidth={2.5} />
            {batch.done}
            <RotateCcw size={12} />
          </span>
        </p>
      </div>
    );
  }
  if (index === 4) {
    const { agent } = sample;
    return (
      <div className="etm-scene etm-agent">
        <p className="etm-menubar">
          <span className="etm-dot" data-on={acting} />
          <span lang="en">{agent.app}</span>
          <small data-on={acting}>
            <span>{agent.busy}</span>
            <span>{agent.wait}</span>
          </small>
        </p>
        <div className="etm-sheet etm-mine">
          <small>{agent.mine}</small>
          <i className="etm-line" />
          <i className="etm-line" />
          <i className="etm-line etm-line-short" />
          <span className="etm-caret" />
        </div>
        <p className="etm-toast" data-on={done}>
          <Bell size={14} />
          {agent.ping}
          <u>{agent.go}</u>
        </p>
      </div>
    );
  }
  const { research } = sample;
  return (
    <div className="etm-scene etm-research">
      <p className="etm-docs">
        {research.docs.map((doc) => (
          <span key={doc}>
            <FileText size={13} />
            {doc}
          </span>
        ))}
      </p>
      <div className="etm-table" data-on={acting}>
        {research.head.map((cell) => (
          <span key={cell} className="etm-th">
            {cell}
          </span>
        ))}
        {research.rows.map((row, n) =>
          row.map((cell, c) => (
            <span
              key={`${n}-${c}`}
              className={c === 0 ? 'etm-th' : 'etm-td'}
              data-on={done}
              style={{ transitionDelay: `${n * 260 + c * 90}ms` }}
            >
              {cell}
            </span>
          )),
        )}
      </div>
      <span className="etm-flag" data-on={done}>
        {research.tag}
      </span>
    </div>
  );
}

export function Moments() {
  const [ref, t] = useTimeline<HTMLDivElement>({
    durations: STEPS,
    holds: HOLDS,
    final: 2,
  });
  const active = Math.floor(t.step / 3);
  const phase = t.step % 3;
  return (
    <div
      ref={ref}
      className="etm"
      data-running={t.running}
      data-mode={t.mode}
      style={{ '--cycle': `${CYCLE}ms` } as Vars}
    >
      <ol className="etm-list">
        {moments.items.map((moment, index) => (
          <li key={moment.title}>
            <button
              type="button"
              className="etm-item"
              aria-pressed={index === active}
              onClick={() => t.go(index * 3)}
            >
              <i aria-hidden="true">{pad(index)}</i>
              <strong>{moment.title}</strong>
              <span>{moment.text}</span>
              {index === active ? (
                <b
                  className="etm-progress"
                  key={t.step - phase}
                  aria-hidden="true"
                />
              ) : null}
            </button>
          </li>
        ))}
      </ol>
      <figure className="e2-plate etm-plate">
        <div className="e2-plate-body etm-stage">
          <div className="etm-frames" aria-hidden="true">
            {moments.items.map((moment, index) => (
              <div
                key={moment.title}
                className="etm-frame"
                data-active={index === active}
              >
                <Scene index={index} phase={index === active ? phase : 0} />
              </div>
            ))}
          </div>
          <div className="et-ctls etm-ctls">
            <DemoToggle timeline={t} />
          </div>
        </div>
        <figcaption>
          <span>
            <b lang="en">Fig. 04</b>
            {pad(active)} {moments.items[active].title}
          </span>
          <em>界面示意 · 示例内容</em>
        </figcaption>
      </figure>
    </div>
  );
}
