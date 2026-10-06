// 场景区块和卡片的示意图，全部用代码绘制；目标场景用真实界面截图。

export type SceneVisual = 'relay' | 'control' | 'assistant' | 'studio' | 'coding';

function Scope({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <figure className="cw-scope">
      <span className="cw-scope-corners" aria-hidden="true">
        <i />
        <i />
        <i />
        <i />
      </span>
      {children}
      <figcaption>{label}</figcaption>
    </figure>
  );
}

function GoalsShot() {
  return (
    <div className="cw-shot">
      <img
        src="/images/cosmos/work/goals-zh.jpg"
        width="1440"
        height="1000"
        alt="Molis Work 的 Goals 页面：左侧是目标树，右侧是当前目标的完成要求和时间线"
        loading="lazy"
      />
      <span className="cw-shot-scan" aria-hidden="true" />
    </div>
  );
}

// 一个能力目录，四个入口从同一处取用能力；外圈是登记进来的插件
function CapabilitiesArt() {
  const callers = [
    { x: 120, y: 90, text: '页面' },
    { x: 480, y: 90, text: '助理' },
    { x: 120, y: 330, text: '工作流' },
    { x: 480, y: 330, text: '外部 Agent' },
  ];
  const plugins = Array.from({ length: 26 }, (_, i) => {
    const a = (i / 26) * Math.PI * 2;
    return { x: 300 + Math.cos(a) * 150, y: 210 + Math.sin(a) * 150 };
  });
  return (
    <svg viewBox="0 0 600 420" className="cw-art" aria-hidden="true">
      <circle className="cw-art-orbit" cx="300" cy="210" r="150" />
      <g className="cw-art-plugins">
        {plugins.map((p, i) => (
          <circle
            key={i}
            cx={p.x.toFixed(1)}
            cy={p.y.toFixed(1)}
            r="3.2"
            style={{ '--i': i } as React.CSSProperties}
          />
        ))}
      </g>
      {callers.map((c, i) => (
        <g key={c.text}>
          <line className="cw-art-link" x1={c.x} y1={c.y} x2="300" y2="210" />
          <line
            className="cw-art-signal"
            x1="300"
            y1="210"
            x2={c.x}
            y2={c.y}
            style={{ '--i': i } as React.CSSProperties}
          />
        </g>
      ))}
      <circle className="cw-art-halo" cx="300" cy="210" r="62" />
      <circle className="cw-art-core" cx="300" cy="210" r="40" />
      <text className="cw-art-core-text" x="300" y="206">
        能力
      </text>
      <text className="cw-art-core-text" x="300" y="226">
        目录
      </text>
      {callers.map((c) => (
        <g key={c.text} className="cw-art-node">
          <rect x={c.x - 58} y={c.y - 20} width="116" height="40" rx="20" />
          <text x={c.x} y={c.y + 5}>
            {c.text}
          </text>
        </g>
      ))}
      <g className="cw-art-gate">
        <rect x="236" y="374" width="128" height="32" rx="16" />
        <text x="300" y="395">
          审查 · 可撤销
        </text>
      </g>
    </svg>
  );
}

// 页面里选中一段，底栏叫出助理，弹出一张点一下就执行的操作卡
function AssistantArt() {
  return (
    <div className="cw-assist" aria-hidden="true">
      <div className="cw-assist-page">
        <span className="cw-assist-head">Pages · 周报</span>
        <i />
        <i className="is-picked" />
        <i className="is-picked is-short" />
        <i />
        <i />
        <i className="is-short" />
        <i />
        <i className="is-short" />
      </div>
      <div className="cw-assist-card">
        <small>操作卡</small>
        <strong>建两个待办</strong>
        <span className="cw-assist-buttons">
          <b>执行</b>
          <em>撤销</em>
        </span>
      </div>
      <div className="cw-assist-bar">
        <span className="cw-assist-star" />
        <span className="cw-assist-chip">@ Inbox</span>
        <span className="cw-assist-chip">/ 建待办</span>
        <span className="cw-assist-caret" />
      </div>
    </div>
  );
}

// 描述 → 方案 → 沙箱 → 检查 → 安装：一颗新行星从尘埃里聚成
function StudioArt() {
  const steps = ['描述', '方案', '沙箱', '检查', '安装'];
  return (
    <div className="cw-studio" aria-hidden="true">
      <div className="cw-studio-disc">
        <span className="cw-studio-dust" />
        <span className="cw-studio-dust cw-studio-dust-2" />
        <span className="cw-studio-core" />
      </div>
      <ol className="cw-studio-steps">
        {steps.map((step, i) => (
          <li key={step} style={{ '--i': i } as React.CSSProperties}>
            <i />
            {step}
          </li>
        ))}
      </ol>
    </div>
  );
}

// 主线分出几个子任务并行，停在断点后继续，写入前先过审查
function CodingArt() {
  return (
    <svg viewBox="0 0 600 420" className="cw-art" aria-hidden="true">
      <path className="cw-art-link" d="M40 210 H560" />
      <path
        className="cw-art-branch"
        d="M130 210 C170 210 170 120 220 120 H330 C380 120 380 210 420 210"
      />
      <path
        className="cw-art-branch"
        d="M130 210 C170 210 170 300 220 300 H330 C380 300 380 210 420 210"
      />
      <path className="cw-art-trace" d="M40 210 H560" />
      <path
        className="cw-art-trace cw-art-trace-2"
        d="M130 210 C170 210 170 120 220 120 H330 C380 120 380 210 420 210"
      />
      <path
        className="cw-art-trace cw-art-trace-3"
        d="M130 210 C170 210 170 300 220 300 H330 C380 300 380 210 420 210"
      />
      <g className="cw-art-mark">
        <circle cx="40" cy="210" r="6" />
        <text x="40" y="244">
          计划
        </text>
      </g>
      <g className="cw-art-mark">
        <circle cx="275" cy="120" r="5" />
        <text x="275" y="100">
          子任务
        </text>
      </g>
      <g className="cw-art-mark">
        <circle cx="275" cy="300" r="5" />
        <text x="275" y="334">
          子任务
        </text>
      </g>
      <g className="cw-art-mark cw-art-pause">
        <rect x="262" y="198" width="7" height="24" rx="2" />
        <rect x="276" y="198" width="7" height="24" rx="2" />
        <text x="275" y="244">
          断点继续
        </text>
      </g>
      <g className="cw-art-gate">
        <rect x="452" y="182" width="72" height="56" rx="12" />
        <text x="488" y="215">
          审查
        </text>
      </g>
      <g className="cw-art-mark">
        <circle cx="560" cy="210" r="6" />
        <text x="560" y="244">
          PR
        </text>
      </g>
    </svg>
  );
}

function Art({ kind }: { kind: SceneVisual }) {
  switch (kind) {
    case 'relay':
      return <GoalsShot />;
    case 'control':
      return <CapabilitiesArt />;
    case 'assistant':
      return <AssistantArt />;
    case 'studio':
      return <StudioArt />;
    case 'coding':
      return <CodingArt />;
  }
}

/** 场景区块里带观测框和图注的画面 */
export function SceneArt({ kind }: { kind: SceneVisual }) {
  return (
    <Scope label={kind === 'relay' ? '界面截图 · 演示数据' : '示意'}>
      <Art kind={kind} />
    </Scope>
  );
}

/** 卡片里不带观测框的画面 */
export function CardArt({ kind }: { kind: SceneVisual }) {
  return (
    <>
      <Art kind={kind} />
      <em className="cw-card-note">示意</em>
    </>
  );
}
