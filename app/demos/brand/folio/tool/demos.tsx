'use client';
import { useState } from 'react';
import {
  ArrowDown,
  ArrowUpRight,
  Bell,
  CalendarDays,
  Check,
  CheckCheck,
  Clipboard,
  Command,
  FileText,
  Folder,
  Languages,
  Lightbulb,
  MousePointer2,
  NotebookPen,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import {
  demo,
  layers,
  merged,
  moments,
  plugins,
} from '../../../../../content/molis-tool';
import { Cuts } from '../art';
import { DemoPlayer, DemoWindow, Output, Reveal, Source } from '../demo';
import './demos.css';

const actionIcons = [Languages, Lightbulb, NotebookPen];

export function CursorDemo() {
  return (
    <DemoPlayer
      label={demo.label}
      steps={['选中内容', '选择动作', '结果回到身旁']}
      note="界面示意 · Molis Tool 开发中"
      tone="pink"
      className="ft-cursor-player"
      duration={3000}
    >
      {(step) => (
        <div className="ft-demo" data-step={step}>
          <Cuts />
          <div className="ft-browser">
            <span className="fo-tape fo-tape-a" aria-hidden="true" />
            <div className="ft-browser-bar">
              <i />
              <i />
              <i />
              <span>{demo.url}</span>
            </div>
            <div className="ft-page">
              <h3 lang="en">{demo.heading}</h3>
              <p lang="en">
                {demo.before}
                <mark>
                  {demo.selection}
                  <MousePointer2
                    className="ft-live-cursor"
                    size={23}
                    fill="currentColor"
                  />
                </mark>
                {demo.after}
              </p>
              <div className="ft-pop">
                <div className="ft-chips" data-visible={step >= 1}>
                  {demo.actions.map((action, i) => {
                    const Icon = actionIcons[i];
                    return (
                      <span
                        className="ft-chip"
                        key={action}
                        data-first={i === 0 || undefined}
                      >
                        <Icon size={14} />
                        {action}
                      </span>
                    );
                  })}
                </div>
                <div className="ft-card" data-visible={step >= 2}>
                  <small>{demo.result.label}</small>
                  <p>{demo.result.text}</p>
                  <span>
                    <ArrowUpRight size={12} />
                    {demo.result.source}
                  </span>
                </div>
              </div>
              <span className="ft-line" />
              <span className="ft-line" />
              <span className="ft-line ft-line-short" />
            </div>
          </div>
        </div>
      )}
    </DemoPlayer>
  );
}

function Poster() {
  return (
    <div className="ft-poster">
      <small>WEEKEND NOTES / 04</small>
      <div className="ft-poster-orbit" aria-hidden="true">
        <i />
        <i />
      </div>
      <h4>
        把周末，
        <br />
        留给一场展。
      </h4>
      <p>
        城市设计展
        <br />
        周六 14:00 — 17:00
        <br />
        河岸艺术中心
      </p>
      <span>DESIGN IN EVERYDAY LIFE</span>
    </div>
  );
}

function CalendarDraft({ complete = false }: { complete?: boolean }) {
  return (
    <Output label={complete ? '从上次的草稿继续' : '日程草稿 · 等你核对'}>
      <div className="ft-event">
        <CalendarDays size={27} />
        <strong>城市设计展</strong>
      </div>
      <dl className="ft-fields">
        <div>
          <dt>时间</dt>
          <dd>周六 · 14:00 — 17:00</dd>
        </div>
        <div>
          <dt>地点</dt>
          <dd>河岸艺术中心</dd>
        </div>
        <div>
          <dt>提醒</dt>
          <dd>提前 30 分钟</dd>
        </div>
      </dl>
      <Source>活动海报 · 你框选的区域</Source>
      <span className="ft-demo-action">
        核对后添加到日历 <ArrowUpRight size={13} />
      </span>
    </Output>
  );
}

export function LayerStory() {
  return (
    <div className="fd-editorial ft-layer-story">
      <ol className="ft-layer-copy">
        {layers.items.map((item, i) => (
          <li key={item.title}>
            <span>0{i + 1}</span>
            <div>
              <h3>{item.title}</h3>
              <p>{item.text}</p>
            </div>
          </li>
        ))}
        <li className="ft-layer-footnote">
          可以在原处做完，也可以收起，稍后再回来。
        </li>
      </ol>
      <DemoPlayer
        label="同一张海报，从光标旁到日程草稿，再从接续回来"
        steps={['光标旁', '身旁', '收起后再回来']}
        tone="pink"
        note="交互示意 · 由你决定展开多少"
      >
        {(step) => (
          <DemoWindow
            title={step === 2 ? 'Molis Tool / 接续' : '正在看一张活动海报'}
          >
            <div className="ft-layer-canvas" data-phase={step}>
              <div className="ft-layer-poster">
                <Poster />
              </div>
              <Reveal show={step === 0} className="ft-layer-chip">
                <span>
                  <CalendarDays size={14} />
                  整理成日程
                </span>
                <MousePointer2 size={23} fill="currentColor" />
              </Reveal>
              <Reveal show={step === 1} className="ft-layer-draft">
                <CalendarDraft />
              </Reveal>
              <Reveal show={step === 2} className="ft-layer-resume">
                <div className="ft-resume-head">
                  <Command size={18} />
                  <span>接续</span>
                  <small>1 份草稿</small>
                </div>
                <CalendarDraft complete />
              </Reveal>
            </div>
          </DemoWindow>
        )}
      </DemoPlayer>
    </div>
  );
}

const momentSteps = [
  ['框住海报', '整理字段', '等待你核对'],
  ['选择网页区域', '设定关注条件', '变化时再出现'],
  ['选中一段讨论', '提取决定', '待办带着原话'],
  ['放入文件', '预览改动', '处理后可还原'],
  ['Agent 正在做', '继续自己的事', '需要你时提醒'],
  ['选择材料', '按维度对齐', '结论带着出处'],
];

function MomentScene({ kind, step }: { kind: number; step: number }) {
  if (kind === 0)
    return (
      <div className="ft-moment-poster">
        <Poster />
        <div>
          <span className="fd-label">从图片里提取</span>
          <Reveal show={step >= 1}>
            <CalendarDraft />
          </Reveal>
          {step === 0 && (
            <p className="ft-wait-copy">
              框住你关心的那一块。
              <br />
              其余内容留在原处。
            </p>
          )}
        </div>
      </div>
    );
  if (kind === 1)
    return (
      <div className="ft-watch">
        <div className="ft-ticket">
          <small>周末工作坊 · 剩余名额</small>
          <strong>
            {step === 2 ? '3' : '0'}
            <span> 位</span>
          </strong>
          <div className="ft-ticket-bars" aria-hidden="true">
            {[24, 38, 27, 52, 44, 69, 56, 79, 62, 87, 65, 94].map((h, i) => (
              <i key={i} style={{ height: h }} />
            ))}
          </div>
        </div>
        <Reveal show={step >= 1}>
          <Output label={step === 2 ? '你关注的内容有变化' : '关注这块区域'}>
            <p>
              {step === 2
                ? '名额从 0 位变成了 3 位。'
                : '当有新名额时，告诉我。'}
            </p>
            <Source>workshop.example.com · 报名区域</Source>
            <span className="fd-stamp">
              {step === 2 ? '0 位 → 3 位 · 查看前后对比' : '只在条件命中时提醒'}
            </span>
          </Output>
        </Reveal>
      </div>
    );
  if (kind === 2)
    return (
      <div className="ft-chat-scene">
        <div className="ft-messages">
          <small>项目讨论 · 选中 3 条</small>
          <p>
            <b>小周</b>发布页周五前改好，我来补文案。
          </p>
          <p>
            <b>阿林</b>我负责检查手机上的排版。
          </p>
          <p>
            <b>小周</b>确认后再发出去。
          </p>
        </div>
        <Reveal show={step >= 1}>
          <Output
            label={step === 1 ? '整理决定与下一步' : '每一条，都找得到原话'}
          >
            <ul className="ft-checklist">
              <li>
                <Check size={15} />
                补齐发布页文案 <small>小周 · 周五前</small>
              </li>
              <li>
                <Check size={15} />
                检查手机排版 <small>阿林</small>
              </li>
            </ul>
            <Source>项目讨论 · 选中的 3 条消息</Source>
          </Output>
        </Reveal>
      </div>
    );
  if (kind === 3)
    return (
      <div className="ft-files-scene">
        <div className="ft-file-row">
          {['IMG_1024.jpg', 'IMG_1025.jpg', 'IMG_1026.jpg'].map((f, i) => (
            <div key={f}>
              <FileText size={30} />
              <span>{step === 2 ? `设计展-0${i + 1}.jpg` : f}</span>
            </div>
          ))}
        </div>
        <Reveal show={step >= 1}>
          <Output
            label={step === 2 ? '已处理副本 · 原件未改动' : '先看改名预览'}
          >
            <div className="ft-file-preview">
              <span>IMG_1024.jpg</span>
              <ArrowDown size={16} />
              <strong>设计展-01.jpg</strong>
            </div>
            <span className="fd-stamp">
              {step === 2 ? '3 个文件 · 可还原' : '确认后处理这 3 个文件'}
            </span>
          </Output>
        </Reveal>
      </div>
    );
  if (kind === 4)
    return (
      <div className="ft-agent-scene">
        <div className="ft-agent-status">
          <span className="ft-status-dot" />
          <strong>Codex</strong>
          <small>{step === 2 ? '需要你' : '正在检查改动'}</small>
        </div>
        <div className="ft-focus">
          <small>此刻，你在做自己的事</small>
          <h4>
            把注意力留在
            <br />
            手边这一页。
          </h4>
          <span className="fd-inkline" />
          <span className="fd-inkline" />
        </div>
        <Reveal show={step === 2}>
          <Output label="有一件事需要你决定">
            <p>改动已准备好，等待审查。</p>
            <Source>已授权的 Agent 会话 · 返回查看</Source>
          </Output>
        </Reveal>
      </div>
    );
  return (
    <div className="ft-research">
      <div className="ft-materials">
        <span>
          <FileText size={14} />
          研究笔记.pdf
        </span>
        <span>
          <FileText size={14} />
          产品说明.md
        </span>
      </div>
      <table>
        <thead>
          <tr>
            <th>比较维度</th>
            <th>方案 A</th>
            <th>方案 B</th>
          </tr>
        </thead>
        <tbody>
          {[
            ['部署方式', '本机', '托管'],
            ['资料来源', '可追溯 ↗', '可追溯 ↗'],
            ['适用范围', '个人工作', '在线协作'],
          ].map((row, i) => (
            <tr key={row[0]} data-visible={step > 0 || i === 0}>
              {row.map((cell) => (
                <td key={cell}>{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <Reveal show={step === 2}>
        <Source>「本机」来自研究笔记.pdf，第 4 页 · 可回到原文</Source>
      </Reveal>
      <small className="fd-muted">演示材料与比较内容均为示例</small>
    </div>
  );
}

export function ToolMoments() {
  const [active, setActive] = useState(0);
  return (
    <div className="ft-moment-live">
      <fieldset className="fd-tabs" aria-label="选择 Tool 使用场景">
        {moments.items.map((m, i) => (
          <button
            type="button"
            key={m.title}
            aria-pressed={active === i}
            onClick={() => setActive(i)}
          >
            <span>0{i + 1}</span>
            {m.title}
          </button>
        ))}
      </fieldset>
      <div className="fd-editorial">
        <div className="ft-moment-intro">
          <span className="ft-big-index" aria-hidden="true">
            0{active + 1}
          </span>
          <h3>{moments.items[active].title}</h3>
          <p>{moments.items[active].text}</p>
          <span>一个动作，接住眼前这件事。</span>
        </div>
        <DemoPlayer
          key={active}
          label={moments.items[active].title}
          steps={momentSteps[active]}
          tone="pink"
          note="场景示意 · 开发中的能力"
        >
          {(step) => (
            <DemoWindow title={moments.items[active].title}>
              <MomentScene kind={active} step={step} />
            </DemoWindow>
          )}
        </DemoPlayer>
      </div>
    </div>
  );
}

export function PluginDemo() {
  const [enabled, setEnabled] = useState(true);
  const [surface, setSurface] = useState(0);
  return (
    <div className="ft-plugin-live">
      <div className="ft-plugin-setting">
        <span className="ft-plugin-icon">
          <Sparkles size={22} />
        </span>
        <div>
          <strong>文字工具</strong>
          <small>清理 · 格式化 · 统计</small>
        </div>
        <button
          type="button"
          role="switch"
          aria-checked={enabled}
          aria-label="在演示中启用文字工具"
          onClick={() => setEnabled((v) => !v)}
        >
          <span />
        </button>
      </div>
      <fieldset className="ft-plugin-ports" aria-label="切换能力入口">
        {plugins.surfaces.map((p, i) => (
          <button
            type="button"
            key={p}
            aria-pressed={surface === i}
            onClick={() => setSurface(i)}
            data-enabled={enabled}
          >
            {p}
            <span>{enabled ? <Check size={12} /> : '—'}</span>
          </button>
        ))}
      </fieldset>
      <DemoPlayer
        key={`${enabled}-${surface}`}
        label={`文字清理在${plugins.surfaces[surface]}的演示`}
        steps={['同一份内容', '同一个能力', '统一的结果']}
        tone="yellow"
        note="插件交互示意 · 可切换入口、启用或停用"
      >
        {(step) => (
          <DemoWindow
            title={plugins.surfaces[surface]}
            badge={enabled ? '文字工具已启用' : '文字工具已停用'}
          >
            <div className="ft-plugin-canvas" data-enabled={enabled}>
              <div className={`ft-plugin-input ft-input-${surface}`}>
                <small>
                  {
                    [
                      '选中的文字',
                      '选区右键菜单',
                      '拖入一段文字',
                      '命令条 · 当前选区',
                    ][surface]
                  }
                </small>
                <p>
                  把好奇心，　　做成作品。
                  <br />
                  <br />
                  从一个　具体问题开始。
                </p>
                {surface === 2 && <ArrowDown size={22} />}
                {surface === 3 && (
                  <div className="ft-command">
                    <Command size={15} />
                    清理文字
                  </div>
                )}
              </div>
              <Reveal show={enabled && step >= 1} className="ft-plugin-action">
                <span>
                  <Sparkles size={13} />
                  清理文字 <small>文字工具</small>
                </span>
              </Reveal>
              <div className="ft-plugin-result">
                <Output
                  label={
                    !enabled
                      ? '上次的结果仍然保留'
                      : step === 2
                        ? '已清理 · 本机处理'
                        : '结果预览'
                  }
                >
                  <p className={enabled && step < 2 ? 'ft-result-pending' : ''}>
                    把好奇心，做成作品。
                    <br />
                    从一个具体问题开始。
                  </p>
                  <Source>来自选中的文字 · 原文保留</Source>
                </Output>
              </div>
            </div>
          </DemoWindow>
        )}
      </DemoPlayer>
      <p className="ft-plugin-explain" aria-live="polite">
        {enabled
          ? '只在对象适用时出现。换一个入口，还是同一项能力。'
          : '各入口已撤下这项能力。停用插件，不删除已经留下的结果。'}
      </p>
    </div>
  );
}

export function QuietDemo() {
  return (
    <DemoPlayer
      label="安静、确认、有出处和本机处理"
      steps={['等待你的信号', '先给草稿', '结果有出处', '本机也能做']}
      tone="sage"
      note="行为示意 · 你决定下一步"
    >
      {(step) => (
        <DemoWindow title="你的桌面">
          <div className="ft-quiet">
            <div className="ft-focus">
              <small>一页正在写的笔记</small>
              <h4>
                让工具轻一点，
                <br />
                让注意力完整一点。
              </h4>
              <span className="fd-inkline" />
              <span className="fd-inkline" />
              <span className="fd-inkline" />
            </div>
            <div className="ft-quiet-result" key={step}>
              {step === 0 ? (
                <span className="fd-stamp">
                  <Bell size={13} />
                  没有触发，安静等待
                </span>
              ) : (
                <Output
                  label={
                    ['', '等待你的确认', '可返回原文', '本机文字统计'][step]
                  }
                >
                  <p>
                    {
                      [
                        '',
                        '日程草稿已准备好，由你决定是否添加。',
                        '每份结果，都保留来时的路。',
                        '248 字 · 3 段 · 无需调用模型',
                      ][step]
                    }
                  </p>
                  <Source>
                    {step === 3
                      ? '仅处理这段文字 · 数据在 Mac 上'
                      : '选中的笔记 · 第 2 段'}
                  </Source>
                </Output>
              )}
            </div>
          </div>
        </DemoWindow>
      )}
    </DemoPlayer>
  );
}

export function ShelfDemo() {
  const [tool, setTool] = useState(0);
  const samples = [
    ['资料副本', '研究笔记.pdf', '设计展海报.png', '原件保留在原处'],
    [
      'Agent 动态',
      'Codex · 正在进行',
      'Claude Code · 等待确认',
      '逐来源授权后显示',
    ],
    ['剪贴板', '把好奇心，做成作品。', '单次收取', '历史记录由你选择开启'],
    ['随手记', '周六去看城市设计展', '提醒 · 周五 18:00', '记下、改期，或收好'],
    ['文字工具', '多余空格已清理', '248 字 · 3 段', '本机处理，无需模型'],
    ['行情', '关注的指数', '到达设定阈值时提醒', '联网默认关闭，由你开启'],
  ];
  return (
    <div className="ft-shelf">
      <fieldset className="ft-shelf-menu" aria-label="选择菜单栏工具">
        {merged.items.map((m, i) => (
          <button
            type="button"
            key={m.title}
            aria-pressed={tool === i}
            onClick={() => setTool(i)}
          >
            {
              [
                <Folder size={16} key="0" />,
                <Sparkles size={16} key="1" />,
                <Clipboard size={16} key="2" />,
                <NotebookPen size={16} key="3" />,
                <FileText size={16} key="4" />,
                <Bell size={16} key="5" />,
              ][i]
            }
            {m.title}
          </button>
        ))}
      </fieldset>
      <div className="ft-shelf-detail" key={tool}>
        <small>同一个菜单栏 / {samples[tool][0]}</small>
        <div className="ft-shelf-item">
          <CheckCheck size={22} />
          <strong>{samples[tool][1]}</strong>
        </div>
        <div className="ft-shelf-item">
          <ShieldCheck size={22} />
          <strong>{samples[tool][2]}</strong>
        </div>
        <p>{samples[tool][3]}</p>
        <span className="fo-note">界面示意 · 示例数据</span>
      </div>
    </div>
  );
}

export function ShiftDemo() {
  return (
    <DemoPlayer
      label="同一段内容，用两种方式处理"
      steps={['一段选中的文字', '找到处理方式', '拿到结果']}
      tone="blue"
      className="ft-shift-demo"
    >
      {(step) => (
        <div className="ft-shift-paths">
          <div>
            <small>以前</small>
            <div className="ft-path-nodes">
              <span>原页面</span>
              <span data-active={step >= 1}>复制到应用</span>
              <span data-active={step >= 2}>取回结果</span>
            </div>
            <p>内容跟着人，在窗口之间移动。</p>
          </div>
          <div>
            <small>Molis Tool</small>
            <div className="ft-inplace">
              <p>
                <mark>把好奇心，做成作品。</mark>
              </p>
              <Reveal show={step >= 1}>
                <span className="fd-stamp">
                  <Sparkles size={12} />
                  在旁边整理
                </span>
              </Reveal>
              <Reveal show={step >= 2}>
                <Source>结果就在这里 · 原文也在</Source>
              </Reveal>
            </div>
          </div>
        </div>
      )}
    </DemoPlayer>
  );
}
