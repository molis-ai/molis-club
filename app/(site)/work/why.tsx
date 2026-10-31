import { ChevronRight, ClipboardCheck, HardDrive, Target } from 'lucide-react';
import type { ReactNode } from 'react';
import { workWhy } from '../../../content/site/work';
import { Note, Phrases } from '../../_site/ui';
import { Ring } from './app';

// 为什么是 Molis（2026-10-31 重做，负责人：核心要体现场景接续，上下文都在一处）。
// 左边：标题和导语；「接得上」放大做主角，另外三条是辅助；收尾两句。
// 右边一块浅灰台面：上面一条时间线，同一份工作被四个场景依次接手——周一你和 Claude Code 定下要求，
// 周二 Claude Code 额度用完、Codex 接着做，周三同事阿宁接着测，周五你回来。四个场景都连向下面同一份记录（深色的 Molis Work 窗），
// 记录里每一条挂着留下它的人或 AI：方的是 AI，圆的是人，和上面场景里的一样。另外三条差异在记录里各有一处：等你验收、你做的检查台、本机。

type Who = 'me' | 'cc' | 'cx' | 'ni';

const MARK: Record<Who, string> = { me: '你', cc: 'CC', cx: 'Cx', ni: '宁' };

function Who({ who }: { who: Who[] }) {
  return (
    <span className="wk-why-who">
      {who.map((id, index) => (
        <span key={id} className="wk-why-who-one">
          {index > 0 ? <ChevronRight /> : null}
          <i className="wk-why-m" data-w={id}>
            {MARK[id]}
          </i>
        </span>
      ))}
    </span>
  );
}

const SCENES: { day: string; who: Who[]; name: string; tag?: string; did: string }[] = [
  { day: '周一', who: ['me', 'cc'], name: 'Claude Code', did: '定下：划线只存本地，不上云' },
  { day: '周二', who: ['cx'], name: 'Codex', tag: 'Claude Code 额度用完', did: '接着做导出，读到了周一定的事' },
  { day: '周三', who: ['ni'], name: '阿宁', did: '接着测，记下：长划线被截断' },
  { day: '周五', who: ['me'], name: '你', did: '回来一看，做到哪、还差什么都在' },
];

/** 连线：从四张卡底边的中点汇到记录上沿的正中（画布 800 宽，四栏、栏距 20） */
const WIRES = [92.5, 297.5, 502.5, 707.5];

function Stage() {
  return (
    <div className="wk-why-stage" aria-hidden="true">
      <ol className="wk-why-scenes">
        {SCENES.map(({ day, who, name, tag, did }) => (
          <li key={day} className="wk-why-scene">
            <span className="wk-why-day">{day}</span>
            <div className="wk-scene wk-why-card" data-theme="dark">
              <p className="wk-why-by">
                <Who who={who} />
                <b>{name}</b>
              </p>
              {tag ? <p className="wk-why-tag">{tag}</p> : null}
              <p className="wk-why-did">{did}</p>
            </div>
          </li>
        ))}
      </ol>

      <svg className="wk-why-wires" viewBox="0 0 800 64" preserveAspectRatio="none">
        {WIRES.map((x) => (
          <path key={x} d={`M${x} 0 C${x} 38 400 26 400 64`} />
        ))}
      </svg>

      <div className="wk-scene wk-why-rec" data-theme="dark">
        <div className="wk-why-rec-top">
          <Target />
          <p>
            <small>划线卡片</small>
            v1.1：导出到 Anki
          </p>
        </div>
        <div className="wk-why-rows">
          <p className="wk-why-row">
            <span className="wk-why-l">定过的事</span>
            <span className="wk-why-v">划线只存本地，不上云</span>
            <span className="wk-why-st" />
            <Who who={['me']} />
          </p>
          <p className="wk-why-row">
            <span className="wk-why-l">要求</span>
            <span className="wk-why-v">
              <Ring tone="done" />
              导出到 Anki
            </span>
            <span className="wk-why-st wk-state" data-tone="done">
              依据 · 测试 24/24
            </span>
            <Who who={['cc', 'cx']} />
          </p>
          <p className="wk-why-row" data-more="">
            <span className="wk-why-l" />
            <span className="wk-why-v">
              <Ring tone="attention" />
              长划线不再截断
            </span>
            <span className="wk-why-st wk-state" data-tone="attention">
              等你验收
            </span>
            <Who who={['ni', 'cx']} />
          </p>
          <p className="wk-why-row" data-more="">
            <span className="wk-why-l" />
            <span className="wk-why-v">
              <Ring tone="progress" />
              从 Readwise 导入
            </span>
            <span className="wk-why-st wk-state" data-tone="progress">
              在做
            </span>
            <Who who={['cx']} />
          </p>
          <p className="wk-why-row">
            <span className="wk-why-l">工具</span>
            <span className="wk-why-v">
              <ClipboardCheck />
              发布前检查台
            </span>
            <span className="wk-why-st wk-state" data-tone="done">
              4/4 通过
            </span>
            <Who who={['me']} />
          </p>
        </div>
        <p className="wk-why-rec-f">
          <HardDrive />
          本机 · ~/Molis Work/划线卡片
        </p>
      </div>
    </div>
  );
}

export function Why({ head }: { head: ReactNode }) {
  const [carry, ...rest] = workWhy.points;
  return (
    <div className="m-wrap wk-why">
      <div className="wk-why-text">
        {head}
        <div className="wk-why-main">
          <p className="wk-why-claim">{carry.claim}</p>
          <p className="wk-why-here">
            <Phrases text={carry.here} />
          </p>
        </div>
        <ul className="wk-why-also">
          {rest.map((point) => (
            <li key={point.id}>
              <b>{point.claim}</b>
              <span>
                <Phrases text={point.here} />
              </span>
            </li>
          ))}
        </ul>
        <p className="wk-why-coda">
          <span>{workWhy.coda[0]}</span>
          <span>{workWhy.coda[1]}</span>
        </p>
      </div>
      <figure className="wk-why-fig wk-plate">
        <Stage />
        <figcaption className="wk-foot">
          <span className="sr-only">{workWhy.label}</span>
          <Note>界面示意 · 示例数据</Note>
        </figcaption>
      </figure>
    </div>
  );
}
