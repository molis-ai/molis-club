import type { FeatureVisual } from './content';

// 六个功能区块的示意图，全部用代码绘制；目标区块用真实界面截图。

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
    <Scope label="界面截图 · 演示数据">
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
    </Scope>
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
  const plugins = Array.from({ length: 25 }, (_, i) => {
    const a = (i / 25) * Math.PI * 2;
    return { x: 300 + Math.cos(a) * 150, y: 210 + Math.sin(a) * 150 };
  });
  return (
    <Scope label="示意">
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
      </svg>
    </Scope>
  );
}

// 描述 → 方案 → 沙箱 → 检查 → 安装：一颗新行星从尘埃里聚成
function StudioArt() {
  const steps = ['描述', '方案', '沙箱', '检查', '安装'];
  return (
    <Scope label="示意">
      <div className="cw-studio">
        <div className="cw-studio-disc" aria-hidden="true">
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
    </Scope>
  );
}

// 主线分出几个子代理并行，停在断点后继续，写入前先过审查
function CodingArt() {
  return (
    <Scope label="示意">
      <svg viewBox="0 0 600 420" className="cw-art" aria-hidden="true">
        <path className="cw-art-link" d="M40 210 H560" />
        <path className="cw-art-branch" d="M130 210 C170 210 170 120 220 120 H330 C380 120 380 210 420 210" />
        <path className="cw-art-branch" d="M130 210 C170 210 170 300 220 300 H330 C380 300 380 210 420 210" />
        <path className="cw-art-trace" d="M40 210 H560" />
        <path className="cw-art-trace cw-art-trace-2" d="M130 210 C170 210 170 120 220 120 H330 C380 120 380 210 420 210" />
        <path className="cw-art-trace cw-art-trace-3" d="M130 210 C170 210 170 300 220 300 H330 C380 300 380 210 420 210" />
        <g className="cw-art-mark">
          <circle cx="40" cy="210" r="6" />
          <text x="40" y="244">计划</text>
        </g>
        <g className="cw-art-mark">
          <circle cx="275" cy="120" r="5" />
          <text x="275" y="100">子代理</text>
        </g>
        <g className="cw-art-mark">
          <circle cx="275" cy="300" r="5" />
          <text x="275" y="334">子代理</text>
        </g>
        <g className="cw-art-mark cw-art-pause">
          <rect x="262" y="198" width="7" height="24" rx="2" />
          <rect x="276" y="198" width="7" height="24" rx="2" />
          <text x="275" y="244">断点继续</text>
        </g>
        <g className="cw-art-gate">
          <rect x="452" y="182" width="72" height="56" rx="12" />
          <text x="488" y="215">审查</text>
        </g>
        <g className="cw-art-mark">
          <circle cx="560" cy="210" r="6" />
          <text x="560" y="244">PR</text>
        </g>
      </svg>
    </Scope>
  );
}

// 所有 AI 调用穿过同一个运行时，再去往你配置的模型服务
function RuntimeArt() {
  const inputs = ['文字', '图片', '判断', 'Agent'];
  const outputs = ['OpenAI 接口', 'Anthropic 接口', '兼容服务'];
  return (
    <Scope label="示意">
      <svg viewBox="0 0 600 420" className="cw-art" aria-hidden="true">
        {inputs.map((text, i) => {
          const y = 90 + i * 80;
          return (
            <g key={text}>
              <path className="cw-art-link" d={`M112 ${y} C200 ${y} 230 210 300 210`} />
              <path
                className="cw-art-beam"
                d={`M112 ${y} C200 ${y} 230 210 300 210`}
                style={{ '--i': i } as React.CSSProperties}
              />
              <text className="cw-art-side" x="96" y={y + 5} textAnchor="end">
                {text}
              </text>
            </g>
          );
        })}
        {outputs.map((text, i) => {
          const y = 120 + i * 90;
          return (
            <g key={text}>
              <path className="cw-art-link" d={`M300 210 C370 210 400 ${y} 468 ${y}`} />
              <path
                className="cw-art-beam cw-art-beam-out"
                d={`M300 210 C370 210 400 ${y} 468 ${y}`}
                style={{ '--i': i } as React.CSSProperties}
              />
              <text className="cw-art-side" x="480" y={y + 5} textAnchor="start">
                {text}
              </text>
            </g>
          );
        })}
        <ellipse className="cw-art-lens" cx="300" cy="210" rx="30" ry="78" />
        <ellipse className="cw-art-lens-core" cx="300" cy="210" rx="10" ry="60" />
        <text className="cw-art-caption" x="300" y="324">
          Prologue
        </text>
        <g className="cw-art-key">
          <rect x="258" y="42" width="84" height="30" rx="15" />
          <text x="300" y="62">密钥 · 本机</text>
        </g>
      </svg>
    </Scope>
  );
}

// 一台雷达：⌘K 扫过所有插件的内容，只点亮你有权看的
function SearchArt() {
  const blips = [
    { x: 220, y: 130, text: 'Pages' },
    { x: 402, y: 150, text: 'Goals' },
    { x: 370, y: 290, text: 'Dataset' },
    { x: 196, y: 262, text: '灵光' },
    { x: 300, y: 92, text: 'Feed' },
  ];
  return (
    <Scope label="示意">
      <div className="cw-radar">
        <svg viewBox="0 0 600 420" className="cw-art" aria-hidden="true">
          <circle className="cw-art-orbit" cx="300" cy="210" r="60" />
          <circle className="cw-art-orbit" cx="300" cy="210" r="120" />
          <circle className="cw-art-orbit" cx="300" cy="210" r="180" />
          <path className="cw-art-link" d="M120 210 H480 M300 30 V390" />
          {blips.map((b, i) => (
            <g
              key={b.text}
              className="cw-radar-blip"
              style={{ '--i': i } as React.CSSProperties}
            >
              <circle cx={b.x} cy={b.y} r="5" />
              <text x={b.x + 12} y={b.y + 5}>
                {b.text}
              </text>
            </g>
          ))}
        </svg>
        <span className="cw-radar-sweep" aria-hidden="true" />
        <kbd className="cw-radar-key" aria-hidden="true">
          ⌘K
        </kbd>
      </div>
    </Scope>
  );
}

export function FeatureArt({ kind }: { kind: FeatureVisual }) {
  switch (kind) {
    case 'goals':
      return <GoalsShot />;
    case 'capabilities':
      return <CapabilitiesArt />;
    case 'studio':
      return <StudioArt />;
    case 'coding':
      return <CodingArt />;
    case 'runtime':
      return <RuntimeArt />;
    case 'search':
      return <SearchArt />;
  }
}

// 第三张次级卡片没有对应截图：画一组被带进来的 Agent 角色
export function AgentsArt() {
  const sources = ['Codex', 'Claude Code', 'Cursor', 'OpenCode', 'Grok Build'];
  return (
    <div className="cw-agents" aria-hidden="true">
      {sources.map((source, i) => (
        <span key={source} style={{ '--i': i } as React.CSSProperties}>
          {source}
        </span>
      ))}
      <b>角色 · v1</b>
      <em>示意</em>
    </div>
  );
}
