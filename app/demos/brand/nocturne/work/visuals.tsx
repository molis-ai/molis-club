// Code-drawn illustrations for the feature chapters. Each is a sketch, not a
// product screenshot, so every one carries a 示意 label.

function Note() {
  return <em className="nw-note">示意</em>;
}

export function CapabilityVisual() {
  const callers = ['页面', '助理', '工作流', 'Claude Code', 'Codex'];
  const grants = [
    { who: 'Claude Code', on: true },
    { who: 'Codex', on: true },
    { who: '工作流', on: true },
    { who: '外部 Agent', on: false },
  ];
  return (
    <div className="nw-vis nw-vis-cap" aria-hidden="true">
      <div className="nw-cap-callers">
        {callers.map((c, i) => (
          <span key={c} style={{ '--i': i } as React.CSSProperties}>
            {c}
          </span>
        ))}
      </div>
      <div className="nw-cap-panel">
        <small>能力目录</small>
        <ul>
          {grants.map((g) => (
            <li key={g.who} data-on={g.on || undefined}>
              {g.who}
              <i />
            </li>
          ))}
        </ul>
        <div className="nw-cap-log">
          <span />
          <span />
          <span className="is-void" />
        </div>
      </div>
      <Note />
    </div>
  );
}

export function StudioVisual() {
  const steps = ['描述', '方案', '沙箱', '检查', '验收', '安装'];
  return (
    <div className="nw-vis nw-vis-studio" aria-hidden="true">
      <div className="nw-studio-prompt">
        <span>缺一个工具……</span>
        <i />
      </div>
      <ol className="nw-studio-track">
        {steps.map((s, i) => (
          <li key={s} style={{ '--i': i } as React.CSSProperties}>
            <b>{String(i + 1).padStart(2, '0')}</b>
            {s}
          </li>
        ))}
      </ol>
      <div className="nw-studio-plugin">
        <span />
        <span />
        <span />
      </div>
      <Note />
    </div>
  );
}

export function CodingVisual() {
  const tasks = [
    { state: 'done', w: 68 },
    { state: 'done', w: 52 },
    { state: 'run', w: 74 },
    { state: 'run', w: 44 },
    { state: 'wait', w: 60 },
  ];
  return (
    <div className="nw-vis nw-vis-coding" aria-hidden="true">
      <div className="nw-term">
        <div className="nw-term-bar">
          <i />
          <i />
          <i />
        </div>
        <ul>
          {tasks.map((t, i) => (
            <li
              key={i}
              data-state={t.state}
              style={{ '--w': `${t.w}%` } as React.CSSProperties}
            >
              <span />
            </li>
          ))}
        </ul>
        <div className="nw-term-review">
          <span>等你审查</span>
          <b>push</b>
        </div>
      </div>
      <Note />
    </div>
  );
}

export function RuntimeVisual() {
  const inputs = ['文字', '图片', '判断', 'Agent'];
  return (
    <div className="nw-vis nw-vis-runtime" aria-hidden="true">
      <div className="nw-rt-inputs">
        {inputs.map((x, i) => (
          <span key={x} style={{ '--i': i } as React.CSSProperties}>
            {x}
          </span>
        ))}
      </div>
      <svg viewBox="0 0 400 240" preserveAspectRatio="none">
        {[30, 90, 150, 210].map((y, i) => (
          <g key={y}>
            <path
              d={`M0 ${y} C 140 ${y}, 160 120, 260 120`}
              className="nw-wire"
            />
            <path
              d={`M0 ${y} C 140 ${y}, 160 120, 260 120`}
              className="nw-wire-flow"
              style={{ '--i': i } as React.CSSProperties}
            />
          </g>
        ))}
        <path d="M260 120 L400 120" className="nw-wire nw-wire-out" />
      </svg>
      <div className="nw-rt-core">
        <b>Prologue</b>
      </div>
      <div className="nw-rt-key">
        <span>密钥 · 本机加密</span>
      </div>
      <Note />
    </div>
  );
}

export function SearchVisual() {
  const results = [
    { from: 'Pages', w: 72 },
    { from: 'Goals', w: 58 },
    { from: 'Feed', w: 66 },
    { from: 'Dataset', w: 48 },
  ];
  return (
    <div className="nw-vis nw-vis-search" aria-hidden="true">
      <div className="nw-palette">
        <div className="nw-palette-input">
          <kbd>⌘K</kbd>
          <span className="nw-typed">Q4</span>
          <i />
        </div>
        <ul>
          {results.map((r, i) => (
            <li
              key={r.from}
              style={{ '--w': `${r.w}%`, '--i': i } as React.CSSProperties}
            >
              <small>{r.from}</small>
              <span>
                <mark>Q4</mark>
                <i />
              </span>
            </li>
          ))}
        </ul>
      </div>
      <Note />
    </div>
  );
}

export function AgentImportVisual() {
  const tools = ['Codex', 'Claude Code', 'Cursor', 'OpenCode', 'Grok Build'];
  return (
    <div className="nw-card-art nw-art-import" aria-hidden="true">
      <div className="nw-import-tools">
        {tools.map((t, i) => (
          <span key={t} style={{ '--i': i } as React.CSSProperties}>
            {t}
          </span>
        ))}
      </div>
      <div className="nw-import-role">
        <b>角色</b>
        <small>v1</small>
      </div>
      <Note />
    </div>
  );
}
