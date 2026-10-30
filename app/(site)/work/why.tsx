'use client';
import {
  Check,
  ClipboardCheck,
  HardDrive,
  KeyRound,
  Sparkles,
  Target,
  type LucideIcon,
} from 'lucide-react';
import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { workWhy, type WhyId } from '../../../content/site/work';
import { useOnScreen, useStill } from '../../_site/cue';
import { Note, Phrases } from '../../_site/ui';
import { Ring } from './app';

// 为什么是 Molis：页面上托着一块深色的展台。左边四条轮流点亮（鼠标停上去就停在那条），
// 右边每条演一个十秒内的小故事：先是通常会怎样，再是在 Molis 里怎样——
// 接得上：Claude Code 额度用完熄掉，Codex 接上，读到了你定过的事；对得上：Codex 报做完了，收尾没生效，等你验收；
// 长出来：你做的检查台从一个虚线框长出来，Claude Code 也调它；是你的：一圈「你的电脑」，换模型，记录不动。
// 每一拍都写成「终态 + 从哪来的动画」（work.css），减少动态时直接是终态；换到哪条，那条的动画重新开始。

const HOLD = 6400;
const IDS = workWhy.points.map((point) => point.id);

type Tile = {
  id: string;
  name: string;
  mark?: string;
  icon?: LucideIcon;
  x: number;
  y: number;
};

/** 画布 800 × 560：左边外部 AI，右边你、助理、同事；坐标是方块中心（和连线的 SVG 同一套） */
const TILES: Tile[] = [
  { id: 'cc', name: 'Claude Code', mark: 'C', x: 96, y: 150 },
  { id: 'cx', name: 'Codex', mark: 'C', x: 96, y: 280 },
  { id: 'oc', name: 'OpenCode', mark: 'O', x: 96, y: 410 },
  { id: 'me', name: '你', mark: '你', x: 704, y: 150 },
  { id: 'as', name: '助理', icon: Sparkles, x: 704, y: 280 },
  { id: 'ni', name: '阿宁', mark: '宁', x: 704, y: 410 },
];

const LINES: Record<string, string> = {
  cc: 'M124 150 C196 150 196 205 262 205',
  cx: 'M124 280 L262 280',
  oc: 'M124 410 C196 410 196 355 262 355',
  me: 'M676 150 C604 150 604 205 538 205',
  as: 'M676 280 L538 280',
  ni: 'M676 410 C604 410 604 355 538 355',
};

const MODELS = ['Anthropic', '通义千问', 'DeepSeek', 'Kimi'];

const at = (x: number, y: number) =>
  ({ left: `${x / 8}%`, top: `${y / 5.6}%` }) as CSSProperties;

function Stage() {
  return (
    <div className="wk-why-stage" aria-hidden="true">
      <svg className="wk-why-lines" viewBox="0 0 800 560">
        {Object.entries(LINES).map(([id, d]) => (
          <path key={id} data-l={id} d={d} />
        ))}
        {/* 长出来：检查台连到记录，Claude Code 也连过去调它 */}
        <path data-l="tool" d="M400 92 L400 132" />
        <path data-l="use" d="M118 128 C160 66 270 58 366 62" />
        {/* 是你的：一台电脑框住记录 */}
        <path
          data-l="mac"
          pathLength={100}
          d="M256 112 H544 Q562 112 562 130 V436 Q562 454 544 454 H256 Q238 454 238 436 V130 Q238 112 256 112 Z M208 472 H592"
        />
      </svg>

      {TILES.map(({ id, name, mark, icon: Icon, x, y }) => (
        <span key={id} className="wk-why-tile" data-t={id} style={at(x, y)}>
          <i>{Icon ? <Icon /> : mark}</i>
          <b>{name}</b>
        </span>
      ))}

      {/* 接得上：Claude Code 停下，Codex 接着做 */}
      <span className="wk-why-tag" data-s="carry" style={at(96, 214)}>
        额度用完
      </span>
      <span className="wk-why-say" data-s="carry" style={at(192, 236)}>
        <b>Codex 接着做</b>
        读到了你周六定的事
      </span>

      {/* 对得上：Codex 报做完了，轮到你 */}
      <span
        className="wk-why-say"
        data-s="check"
        data-k="done"
        style={at(192, 236)}
      >
        <b>
          <Check />
          做完了
        </b>
        测试 16/16 通过
      </span>
      <span
        className="wk-why-say"
        data-s="check"
        data-k="you"
        style={at(608, 108)}
      >
        <b>轮到你验收</b>
        手机上看一眼
      </span>

      {/* 长出来：一个虚线框长成你做的检查台 */}
      <span className="wk-why-grow" data-s="grow" style={at(400, 62)}>
        <i>
          <ClipboardCheck />
        </i>
        发布前检查台
        <small>你做的</small>
      </span>
      <span className="wk-why-cap" data-s="grow" style={at(214, 50)}>
        Claude Code 也调得到
      </span>

      {/* 是你的：你的电脑，换模型，记录不动 */}
      <span className="wk-why-mac" data-s="own" style={at(254, 112)}>
        <HardDrive />
        你的电脑
      </span>
      <div className="wk-why-models" data-s="own" style={at(400, 512)}>
        <span className="wk-why-key">
          <KeyRound />
          Key 是你的
        </span>
        {MODELS.map((model) => (
          <span key={model} data-m={model}>
            {model}
          </span>
        ))}
      </div>

      {/* 记录：后面叠着两张旧版 */}
      <div className="wk-why-stack">
        <i />
        <i />
        <div className="wk-why-card">
          <p className="wk-why-c-k">
            <Target />
            Goals · 划线卡片
            <span>第 3 版</span>
          </p>
          <p className="wk-why-c-t">v1.1：导出到 Anki</p>
          <p className="wk-why-c-rule">
            <i />
            你周六定过：划线只存本地，不上云
          </p>
          <p className="wk-why-c-bar">
            完成要求 <b>2/3</b>
            <span className="wk-why-c-meter">
              <i />
              <i />
              <i />
            </span>
            <span className="wk-why-c-stop">收尾未生效</span>
          </p>
          <div className="wk-why-c-reqs">
            <p>
              <Ring tone="done" />
              导出到 Anki
              <span>依据 · 测试 24/24</span>
            </p>
            <p>
              <Ring tone="progress" />
              从 Readwise 导入
              <span className="wk-why-c-who">
                <span>Claude Code 在做</span>
                <span>Codex 接着做</span>
              </span>
            </p>
            <p className="wk-why-c-wait">
              <Ring tone="attention" />
              长划线不再截断
              <span>等你验收</span>
            </p>
            <p className="wk-why-c-tool">
              <ClipboardCheck />
              发布前检查台
              <span>4/4 通过 · 你做的</span>
            </p>
          </div>
          <p className="wk-why-c-f">
            <HardDrive />
            本机 · ~/Molis Work/划线卡片
          </p>
        </div>
      </div>
    </div>
  );
}

export function Why() {
  const [on, setOn] = useState<WhyId>('carry');
  const [held, setHeld] = useState(false);
  const still = useStill();
  const ref = useRef<HTMLDivElement>(null);
  const shown = useOnScreen(ref, 0.4);

  // 在视口里、没被鼠标停住时，一条一条往下轮
  useEffect(() => {
    if (still || held || !shown) return;
    const timer = window.setTimeout(
      () => setOn((now) => IDS[(IDS.indexOf(now) + 1) % IDS.length]),
      HOLD,
    );
    return () => window.clearTimeout(timer);
  }, [on, still, held, shown]);

  const pick = (id: WhyId) => {
    setOn(id);
    setHeld(true);
  };

  return (
    <div className="wk-why-panel">
      <div
        ref={ref}
        className="m-wrap wk-why"
        data-on={on}
        data-still={still || undefined}
        data-run={(!still && !held && shown) || undefined}
      >
        <div className="wk-why-text">
          <p className="m-kicker">{workWhy.kicker}</p>
          <h2 className="wk-why-title" id="wk-why-title">
            <Phrases text={workWhy.title} />
          </h2>
          <p className="wk-why-lead">
            <Phrases text={workWhy.lead} />
          </p>
          <ol className="wk-why-list">
            {workWhy.points.map((point) => (
              <li key={point.id} data-active={point.id === on || undefined}>
                <button
                  type="button"
                  className="wk-why-pt"
                  aria-pressed={point.id === on}
                  onClick={() => pick(point.id)}
                  onMouseEnter={() => pick(point.id)}
                  onMouseLeave={() => setHeld(false)}
                  onFocus={() => pick(point.id)}
                  onBlur={() => setHeld(false)}
                >
                  <span className="wk-why-k">{point.key}</span>
                  <span className="wk-why-claim">{point.claim}</span>
                </button>
                <div className="wk-why-more">
                  <p>
                    <Phrases text={point.here} />
                  </p>
                </div>
              </li>
            ))}
          </ol>
          <p className="wk-why-coda">
            <span>{workWhy.coda[0]}</span>
            <span>{workWhy.coda[1]}</span>
          </p>
        </div>
        <figure className="wk-why-fig">
          <Stage />
          <figcaption>
            <span className="sr-only">{workWhy.label}</span>
            <Note>界面示意 · 示例数据</Note>
          </figcaption>
        </figure>
      </div>
    </div>
  );
}
