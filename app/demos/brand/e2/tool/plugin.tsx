'use client';
import { ArrowRight, Command, FileAudio, Puzzle } from 'lucide-react';
import { folioTool } from '../../../../../content/folio';
import { DemoToggle, Pointer, on, useTimeline } from './demo';

// 06 插件就是能力：中间是插件写下的一张说明（接受、产出、在哪里跑），四周是它会出现的四个入口。
// 开关一拨，四处同时出现；做出来的字幕接着交给「翻译」；再拨回去，入口一起收起，做好的字幕还在。
// 开关可以自己拨（role="switch"），自动播放时由示意指针来拨。

// 0 停用 → 1 指针去拨 → 2 启用：四处出现 → 3 生成字幕 → 4 交给翻译（停）→ 5 指针再去拨 → 6 停用：入口收起，结果还在（停）→ 7 收起
const STEPS = [1100, 700, 1700, 1300, 2600, 700, 3200, 500] as const;
const HOLDS = [0, 4, 6] as const;

export function PluginStage() {
  const plugin = folioTool.plugins;
  const { surfaces } = plugin;
  const [ref, t] = useTimeline<HTMLElement>({
    durations: STEPS,
    holds: HOLDS,
    final: 4,
  });
  const s = t.step;
  const enabled = on(s, 2, 5);
  const auto = t.mode === 'auto' && !t.reduce;
  const entry = { 'data-on': enabled };

  return (
    <figure
      ref={ref}
      className="etp"
      data-on={enabled}
      data-auto={auto}
      data-step={s}
      aria-label={plugin.label}
    >
      <div className="e2-plate-body etp-body">
        <div className="etp-map">
          <div className="etp-slip">
            <header>
              <Puzzle size={16} aria-hidden="true" />
              <span className="etp-kind">{plugin.kind}</span>
              <strong>{plugin.name}</strong>
              <span className="etp-switch-wrap">
                <button
                  type="button"
                  role="switch"
                  className="etp-switch"
                  aria-checked={enabled}
                  aria-label={`示意开关：${plugin.name}`}
                  onClick={() => t.go(enabled ? 6 : 2)}
                >
                  <i />
                </button>
                <Pointer className="etp-pointer" />
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
            <p className="etp-state" data-on={enabled} aria-hidden="true">
              {enabled ? plugin.on : ''}
            </p>
          </div>

          <div className="etp-surface" data-surface="near" aria-hidden="true">
            <small>{surfaces.near.label}</small>
            <p className="etp-chips">
              <span className="etp-new" {...entry}>
                {plugin.name}
              </span>
              {surfaces.near.others.map((name) => (
                <span key={name}>{name}</span>
              ))}
            </p>
          </div>
          <div className="etp-surface" data-surface="menu" aria-hidden="true">
            <small>{surfaces.menu.label}</small>
            <ul className="etp-menu">
              {surfaces.menu.others.map((name) => (
                <li key={name}>{name}</li>
              ))}
              <li className="etp-new" {...entry}>
                {plugin.name}
              </li>
            </ul>
          </div>
          <div className="etp-surface" data-surface="drop" aria-hidden="true">
            <small>{surfaces.drop.label}</small>
            <div className="etp-drop">
              <FileAudio size={18} />
              <span>{surfaces.drop.hint}</span>
              <b className="etp-new" {...entry}>
                {plugin.name}
              </b>
            </div>
          </div>
          <div className="etp-surface" data-surface="bar" aria-hidden="true">
            <small>{surfaces.bar.label}</small>
            <p className="etp-query">
              <Command size={13} />
              {surfaces.bar.query}
            </p>
            <p className="etp-new etp-hit" {...entry}>
              {plugin.name}
              <i>本机</i>
            </p>
          </div>
        </div>

        <div className="etp-chain" aria-hidden="true">
          <span className="etp-file" data-on>
            {plugin.chain[0]}
          </span>
          <ArrowRight size={14} />
          <b className="etp-step" data-on={on(s, 3, 5)} data-off={on(s, 6, 7)}>
            {plugin.name}
          </b>
          <ArrowRight size={14} className="etp-arrow" data-on={on(s, 3, 7)} />
          <span className="etp-file" data-on={on(s, 3, 6)}>
            {plugin.chain[1]}
          </span>
          <ArrowRight size={14} className="etp-arrow" data-on={on(s, 4, 7)} />
          <b className="etp-step" data-on={on(s, 4, 6)}>
            {plugin.next}
          </b>
          <ArrowRight size={14} className="etp-arrow" data-on={on(s, 4, 7)} />
          <span className="etp-file" data-on={on(s, 4, 6)}>
            {plugin.chain[2]}
          </span>
        </div>
        <p className="etp-kept" data-on={on(s, 6, 6)}>
          {plugin.kept}
        </p>
        <div className="et-ctls etp-ctls">
          <DemoToggle timeline={t} />
        </div>
      </div>
      <figcaption className="et-figcap">
        <span>
          <b lang="en">Fig. 06</b>一个能力，四个入口 · 开关可以自己拨
        </span>
        <em>{plugin.note}</em>
      </figcaption>
    </figure>
  );
}
