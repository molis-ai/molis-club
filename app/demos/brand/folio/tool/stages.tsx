'use client';
import {
  ArrowRight,
  CalendarPlus,
  Check,
  Command,
  FileAudio,
  Languages,
  MousePointer2,
  Puzzle,
  Search,
} from 'lucide-react';
import { layers } from '../../../../../content/molis-tool';
import { folioTool } from '../../../../../content/folio';
import { Loop } from '../loop';
import { pad } from '../kit';
import type { Vars } from '../shared';
import './stages.css';

// Tool 页首屏之后的两段动态：三层接力处理同一场展览；一个插件登记一次，四个入口同时出现。
// 都是 12 秒一轮的 CSS 时间轴，基础样式就是播完的样子。

function Pointer({ className }: { className: string }) {
  return (
    <span className={`ftx-pointer ${className}`} aria-hidden="true">
      <MousePointer2 size={20} fill="currentColor" strokeWidth={1.4} />
    </span>
  );
}

/** 由近到远的三层：光标旁 → 身旁 → 离开以后，一层接一层亮起，各自给出结果 */
export function LayerRelay() {
  const { near, beside, later } = folioTool.layers;
  return (
    <Loop
      label={folioTool.layers.label}
      note={folioTool.layers.note}
      className="ftl"
    >
      <ol className="ftl-row">
        <li className="ftl-panel" data-layer="near">
          <div className="ftl-paper" aria-hidden="true">
            <small>{near.eyebrow}</small>
            <p className="ftl-text">
              {near.before}
              <mark>{near.mark}</mark>
              {near.after}
            </p>
            <div className="ftl-chips">
              <span>
                <CalendarPlus size={13} />
                {near.chips[0]}
                <Pointer className="ftl-pointer-near" />
              </span>
              <span>
                <Languages size={13} />
                {near.chips[1]}
              </span>
            </div>
            <p className="ftl-near-result">
              <Check size={14} strokeWidth={3} />
              {near.result}
              <u>{near.undo}</u>
            </p>
          </div>
          <LayerCaption index={0} />
        </li>

        <li className="ftl-panel" data-layer="beside">
          <div className="ftl-paper" aria-hidden="true">
            <small>{beside.eyebrow}</small>
            <div className="ftl-beside">
              <div className="ftl-poster">
                <span className="ftl-poster-sun" />
                <b>{beside.day}</b>
                <i>{beside.month}</i>
                <strong>
                  {beside.title[0]}
                  <br />
                  {beside.title[1]}
                </strong>
                <span className="ftl-frame" />
              </div>
              <div className="ftl-card">
                <em>{beside.card}</em>
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
                <p className="ftl-source">{beside.source}</p>
                <p className="ftl-card-actions">
                  <span>{beside.actions[0]}</span>
                  <span>{beside.actions[1]}</span>
                </p>
              </div>
            </div>
          </div>
          <LayerCaption index={1} />
        </li>

        <li className="ftl-panel" data-layer="later">
          <div className="ftl-paper" aria-hidden="true">
            <small>{later.eyebrow}</small>
            <p className="ftl-keys">
              {later.keys.map((key) => (
                <kbd key={key}>{key}</kbd>
              ))}
            </p>
            <div className="ftl-bar">
              <p className="ftl-query">
                <Search size={14} />
                <span>{later.query}</span>
              </p>
              <p className="ftl-hit">
                <CalendarPlus size={15} />
                <strong>{later.row}</strong>
                <small>{later.meta}</small>
              </p>
            </div>
            <p className="ftl-back">
              <Check size={14} strokeWidth={3} />
              {later.back}
            </p>
          </div>
          <LayerCaption index={2} />
        </li>
      </ol>
    </Loop>
  );
}

function LayerCaption({ index }: { index: number }) {
  const layer = layers.items[index];
  return (
    <div className="ftl-caption">
      <span className="fo-index">{pad(index)}</span>
      <h3>{layer.title}</h3>
      <p>{layer.text}</p>
    </div>
  );
}

/** 插件就是能力：声明一次 → 四个入口同时出现 → 结果接着交给下一个能力 → 停用时处处消失 */
export function PluginStage() {
  const plugin = folioTool.plugins;
  const { surfaces } = plugin;
  return (
    <Loop label={plugin.label} note={plugin.note} className="ftp">
      <div className="ftp-slip" aria-hidden="true">
        <span className="fo-tape fo-tape-a" />
        <header>
          <Puzzle size={16} />
          <small>{plugin.kind}</small>
          <strong>{plugin.name}</strong>
          <span className="ftp-toggle">
            <i />
            <Pointer className="ftp-pointer" />
          </span>
        </header>
        <dl>
          {plugin.spec.map(([key, value]) => (
            <div key={key}>
              <dt>{key}</dt>
              <dd>{value}</dd>
            </div>
          ))}
        </dl>
      </div>

      <div className="ftp-surfaces" aria-hidden="true">
        <div className="ftp-surface" data-surface="near">
          <small>{surfaces.near.label}</small>
          <p className="ftp-chips">
            <span className="ftp-new">{plugin.name}</span>
            {surfaces.near.others.map((name) => (
              <span key={name}>{name}</span>
            ))}
          </p>
        </div>
        <div className="ftp-surface" data-surface="menu">
          <small>{surfaces.menu.label}</small>
          <ul className="ftp-menu">
            {surfaces.menu.others.map((name) => (
              <li key={name}>{name}</li>
            ))}
            <li className="ftp-new">{plugin.name}</li>
          </ul>
        </div>
        <div className="ftp-surface" data-surface="drop">
          <small>{surfaces.drop.label}</small>
          <div className="ftp-drop">
            <FileAudio size={18} />
            <span>{surfaces.drop.hint}</span>
            <b className="ftp-new">{plugin.name}</b>
          </div>
        </div>
        <div className="ftp-surface" data-surface="bar">
          <small>{surfaces.bar.label}</small>
          <p className="ftp-bar">
            <Command size={13} />
            {surfaces.bar.query}
          </p>
          <p className="ftp-new ftp-bar-hit">
            {plugin.name}
            <i>本机</i>
          </p>
        </div>
      </div>

      <div className="ftp-chain" aria-hidden="true">
        <span className="ftp-file">{plugin.chain[0]}</span>
        <ArrowRight size={14} />
        <b className="ftp-step ftp-step-a">{plugin.name}</b>
        <span className="ftp-file ftp-out-a">{plugin.chain[1]}</span>
        <ArrowRight size={14} className="ftp-arrow-b" />
        <b className="ftp-step ftp-step-b">{plugin.next}</b>
        <span className="ftp-file ftp-out-b">{plugin.chain[2]}</span>
      </div>
      <p className="ftp-kept">{plugin.kept}</p>
    </Loop>
  );
}
