// Code-drawn illustrations for the scenario chapters and cards. Each is a
// sketch, not a product screenshot, so every one carries a 示意 label.

function Note() {
  return <em className="nw-note">示意</em>;
}

export function CapabilityVisual() {
  const callers = ['页面', '助理', '工作流', '外部 Agent'];
  const grants = [
    { who: 'Claude Code', on: true },
    { who: 'Codex', on: true },
    { who: 'OpenCode', on: false },
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
        <div className="nw-cap-review">
          <span>审查队列</span>
          <b>撤销</b>
        </div>
      </div>
      <Note />
    </div>
  );
}

// A page with a selected passage, the assistant bar called up from the bottom
// with an @ reference and a / capability, and the action card it proposes.
export function AssistantVisual() {
  const lines = [
    { w: 90 },
    { w: 50, sel: true },
    { w: 38, sel: true },
    { w: 84 },
    { w: 72 },
    { w: 56 },
  ];
  return (
    <div className="nw-vis nw-vis-assist" aria-hidden="true">
      <div className="nw-as-page">
        <div className="nw-as-head">
          <span />
          <span />
        </div>
        <div className="nw-as-lines">
          {lines.map((line, i) => (
            <span
              key={i}
              className={line.sel ? 'is-sel' : undefined}
              style={{ '--w': `${line.w}%` } as React.CSSProperties}
            />
          ))}
        </div>
      </div>
      <div className="nw-as-card">
        <small>操作卡</small>
        <b>建两个待办</b>
        <ul>
          <li>
            <i />
            <span style={{ '--w': '78%' } as React.CSSProperties} />
          </li>
          <li>
            <i />
            <span style={{ '--w': '56%' } as React.CSSProperties} />
          </li>
        </ul>
        <div className="nw-as-actions">
          <span className="is-go">执行</span>
          <span>撤销</span>
        </div>
      </div>
      <div className="nw-as-bar">
        <span className="nw-as-chip">@ 选区</span>
        <span className="nw-as-chip is-cap">/ 待办</span>
        <i />
        <b />
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
