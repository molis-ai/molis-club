import type { Metadata } from 'next';
import Link from 'next/link';
import {
  products,
  WORK_BUILD,
  WORK_GITHUB,
} from '../../../../../content/site/products';
import { workGo, workProgress } from '../../../../../content/site/work';
import { contactHref } from '../../../../_site/routes';
import { PlayShell } from '../chrome';
import { Plate } from '../plate';
import { Thread } from './thread';
import { Wipe } from './wipe';
import '../play.css';
import './work.css';

// 第十轮视觉稿 · play：Work 产品页。照片屏和文字屏分开：
// 照片（接着做下去）→ 名字 → 主角「三天」（真实截图）→ 照片（一毫米的判断）→ 浅色 / 深色（真实截图）→ 还在路上的 → 进展与去处。
// 信息架构照规格 5.2 的顺序压缩：开场、布置工作台、你和 AI、有记录也有依据落在「三天」的各格里；
// 插件、长出工具、讨论、你不在时还没有可用的真实截图，只写一句并标阶段。评审用，不进导航、不被收录。
export const metadata: Metadata = {
  title: '第十轮 · play · Molis Work',
  robots: { index: false, follow: false },
};

const work = products.work;

// 「还在路上的」四句：前两句取自规格第 4 节 Work 五段（新写，待负责人确认），阶段按规格第 9 节与 Work 仓库现状
const ahead = [
  { text: '助理调用几个插件，把事情接着做完。', tag: '开发中' },
  { text: '工作台也可以长出你自己的工具。', tag: '预览' },
  { text: '一起讨论，上下文和成果都接得上。', tag: '首版已实现 · 未公开部署' },
  { text: '你不在的时候，助理接着干。', tag: '开发中' },
];

export default function PlayWork() {
  return (
    <PlayShell current="work">
      <div className="pl-work">
        <Plate
          photo="work-a"
          edge="Work"
          caption="接着做下去"
          alt="窗边的旧木桌上铺满草图和几只折好的纸模型，一台打开的笔记本电脑，一杯茶，窗外是花园。"
          bleed
        />

        <section className="pl-name" data-tone="paper" data-edge="Work" aria-labelledby="pl-work-title">
          <p className="pl-cap" lang="en" data-reveal>
            01 <span aria-hidden="true">·</span> {work.form}
          </p>
          <h1 id="pl-work-title" className="pl-name-mark" lang="en" data-reveal>
            {work.name}
          </h1>
          <p className="pl-name-head" data-reveal>
            {work.headline}
          </p>
          <p className="pl-name-what" data-reveal>
            {work.what}
          </p>
          <p className="pl-name-tag" data-reveal>
            <span lang="en">{work.name}</span>
            <span aria-hidden="true">·</span>
            <span>{work.form}</span>
            <span aria-hidden="true">·</span>
            <span className="pl-name-stage">{work.stage}</span>
          </p>
        </section>

        <section
          className="pl-three"
          data-tone="paper"
          data-edge="Three days"
          aria-labelledby="pl-thread-title"
        >
          <Thread />
        </section>

        <Plate
          photo="work-b"
          edge="Detail"
          caption="一毫米的判断"
          alt="一双手在木桌上调一件小木头量具，旁边是铅笔和画着圆弧的纸。"
        />

        <section
          className="pl-three pl-three-wipe"
          data-tone="paper"
          data-edge="Light"
          aria-labelledby="pl-wipe-title"
        >
          <Wipe />
        </section>

        <section className="pl-ahead" data-tone="paper" data-edge="Not yet" aria-labelledby="pl-ahead-title">
          <h2 id="pl-ahead-title" className="pl-cap" lang="en">
            Still on the way <span aria-hidden="true">·</span>
            <span lang="zh">还在路上的</span>
          </h2>
          <ul className="pl-ahead-list">
            {ahead.map((line) => (
              <li key={line.text} data-reveal>
                <span>{line.text}</span>
                <span className="pl-tag">{line.tag}</span>
              </li>
            ))}
          </ul>

          <div className="pl-now">
            <div>
              <h3 className="pl-cap">已经有的</h3>
              <ul>
                {workProgress.have.map((line) => (
                  <li key={line}>{line}</li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="pl-cap">还没有的</h3>
              <ul>
                {workProgress.notYet.map((line) => (
                  <li key={line}>{line}</li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="pl-cap">现在怎么看</h3>
              <ul>
                {workProgress.now.map((line) => (
                  <li key={line}>{line}</li>
                ))}
              </ul>
            </div>
          </div>

          <p className="pl-go">
            <a className="pl-btn" href={WORK_GITHUB} target="_blank" rel="noreferrer">
              {workGo.github}
            </a>
            <a className="pl-more" href={WORK_BUILD} target="_blank" rel="noreferrer">
              {workGo.build}
              <span aria-hidden="true"> ↗</span>
            </a>
            <Link className="pl-more" href={contactHref('work')}>
              {workGo.follow}
              <span aria-hidden="true"> →</span>
            </Link>
          </p>
        </section>
      </div>
    </PlayShell>
  );
}
