import { Suspense } from 'react';
import type { Metadata } from 'next';
import { ArrowUpRight } from 'lucide-react';
import {
  products,
  relations,
  WORK_BUILD,
  WORK_GITHUB,
} from '../../../../../content/site/products';
import {
  handoff,
  workChapters,
  workGo,
  workProgress,
} from '../../../../../content/site/work';
import { contactHref } from '../../../../_site/routes';
import { picture } from '../media';
import { FullPlate, Photo } from '../plates';
import { getPulse } from '../pulse';
import { FolioHandoff } from './handoff';
import { PulseBlock, WorkClass } from './ledger';
import { ShotPlate, ZoomPlate } from './shots';

export const metadata: Metadata = {
  title: 'Molis Work · 作品集 · 第十轮视觉稿',
  robots: { index: false, follow: false },
};

const work = products.work;
const desk = picture('mist-work-a');
const hands = picture('mist-work-b');
const chapter = Object.fromEntries(
  workChapters.map((item) => [item.id, item]),
) as Record<(typeof workChapters)[number]['id'], (typeof workChapters)[number]>;

async function LiveClass() {
  return <WorkClass pulse={await getPulse()} />;
}
async function LivePulse() {
  return <PulseBlock pulse={await getPulse()} />;
}

/** 文字屏上的一章：罗马数字、一句标题、一句话 */
function Note({
  no,
  title,
  text,
  tag,
}: {
  no: string;
  title: string;
  text?: string;
  tag?: string;
}) {
  return (
    <div className="fo-note" data-reveal>
      <p className="fo-note-no" lang="en">
        {no}
      </p>
      <h2 className="fo-note-title">{title}</h2>
      {text ? <p className="fo-note-text">{text}</p> : null}
      {tag ? <p className="fo-tag">{tag}</p> : null}
    </div>
  );
}

// Molis Work 作为作品集里的第一个项目：一屏照片、一屏文字，严格交替。
// 头尾两张是负责人的雾感品牌图（接着做下去、一毫米的判断），中间的图版全是真实界面的截图（开发中版本，演示数据）。
// 章节按规格第 5.2 节的顺序收成四屏文字；每屏只留标题与一句原文（取自 docs/studio-intro.md 4.1 与 content/site/work.ts）。
// 最后一屏是「活着的状态」：仓库这周真实的提交和构建，后面是当前进展与去处。
export default function FolioWork() {
  return (
    <div className="fo-work">
      <FullPlate
        folio="WORK"
        plate="Project I"
        caption="接着做下去 · 品牌概念图"
        color={desk.color}
        className="fo-cover"
        label="满幅照片：窗边的木桌上铺满草图，一台笔记本电脑开着。"
      >
        <Photo image={desk} focus="50% 50%" eager />
      </FullPlate>

      <section
        className="fo-text fo-work-title"
        data-folio="WORK"
        data-tone="paper"
        aria-labelledby="fo-work-name"
      >
        <p className="fo-caps" lang="en">
          Project I
        </p>
        <h1 id="fo-work-name" className="fo-work-name">
          <span lang="en">{work.name}</span>
          <span className="fo-work-headline">{work.headline}</span>
        </h1>
        <Suspense fallback={<WorkClass pulse={null} />}>
          <LiveClass />
        </Suspense>
        <p className="fo-work-what">{work.what}</p>
      </section>

      <ShotPlate
        plate="Pl. 1"
        caption="项目首页 · 开发中版本截图"
        shots={[
          {
            image: picture('shot-home'),
            alt: 'Molis Work 的项目首页：今天的工作、一周的日期条、正在推进的目标和当天的事件，右边是随手记和手边的内容。',
            only: 'wide',
          },
          {
            image: picture('shot-phone'),
            alt: '手机宽度下的 Molis Work 项目首页与两行底栏。',
            only: 'narrow',
            kind: 'phone',
          },
        ]}
      />

      <section className="fo-text fo-notes" data-folio="NOTES" data-tone="paper">
        <Note
          no="I"
          title={chapter.scatter.title}
          text={work.opening[1].split('。')[0] + '。'}
        />
        <Note
          no="II"
          title={chapter.arrange.title}
          text={chapter.arrange.paragraphs[1].split('。')[1] + '。'}
        />
      </section>

      <ShotPlate
        plate="Pl. 2 — 3"
        caption="首次使用：想带入哪些内容 · 信息流 · 开发中版本截图"
        layout="pair"
        shots={[
          {
            image: picture('shot-onboarding'),
            alt: '首次使用：一个窗口，左边问想带入哪些内容（文件夹、单独选文件、浏览器内容、聊天记录），右边是实时预览。',
          },
          {
            image: picture('shot-feed'),
            alt: '信息流：左边一列来自 GitHub、Gmail 和订阅源的消息，右边是阅读页，可以加入 Inbox、保存为资料或升格为 Goal。',
          },
        ]}
      />

      <section
        className="fo-text fo-notes fo-notes-hf"
        data-folio="NOTES"
        data-tone="paper"
      >
        <Note
          no="III"
          title={chapter.together.title}
          text={chapter.together.paragraphs[1].split('：')[1]}
        />
        <div className="fo-hf-wrap" data-reveal>
          <p className="fo-hf-title">
            <span>{handoff.title}</span>
            <span className="fo-tag">{handoff.note}</span>
          </p>
          <FolioHandoff />
        </div>
      </section>

      <ZoomPlate
        plate="Pl. 4"
        caption="Goal 以文档打开 · 开发中版本截图"
        detail="局部：下一步与完成要求 · 开发中版本截图"
        shot={{
          image: picture('shot-goals'),
          alt: '目标：Goal 以文档打开，左边是 Goal 树；正文写着下一步、完成要求「1/1 已满足」和一条时间线。',
        }}
        focus={{ x: 0.55, y: 0.43, scale: 1.75 }}
      />

      <section className="fo-text fo-notes" data-folio="NOTES" data-tone="paper">
        <Note
          no="IV"
          title={chapter.goal.title}
          text={chapter.goal.paragraphs[1]}
        />
        <div className="fo-ahead" data-reveal>
          <p className="fo-caps" lang="en">
            Also in the works
          </p>
          <ul>
            {(['relay', 'grow', 'talk', 'away'] as const).map((id) => (
              <li key={id}>
                <span>{chapter[id].title}</span>
                {chapter[id].tag ? (
                  <span className="fo-tag">{chapter[id].tag}</span>
                ) : null}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <ShotPlate
        plate="Pl. 5 — 6"
        caption="深色模式下的项目首页 · 手机宽度 · 开发中版本截图"
        layout="night"
        shots={[
          {
            image: picture('shot-dark'),
            alt: '深色模式下的 Molis Work 项目首页。',
          },
          {
            image: picture('shot-phone'),
            alt: '手机宽度下的 Molis Work 项目首页与两行底栏。',
            kind: 'phone',
            only: 'wide',
          },
        ]}
      />

      <section
        className="fo-text fo-ledger"
        data-folio="LEDGER"
        data-tone="paper"
        aria-labelledby="fo-ledger-title"
      >
        <p className="fo-caps" lang="en">
          Open source
        </p>
        <h2 id="fo-ledger-title" className="fo-note-title">
          {work.stage}
        </h2>
        <Suspense fallback={null}>
          <LivePulse />
        </Suspense>
        <dl className="fo-facts">
          <div>
            <dt>形态</dt>
            <dd>{work.form}</dd>
          </div>
          <div>
            <dt>已经有的</dt>
            <dd>
              {workProgress.have.map((line) => (
                <span key={line}>{line}</span>
              ))}
            </dd>
          </div>
          <div>
            <dt>还没有的</dt>
            <dd>
              {workProgress.notYet.map((line) => (
                <span key={line}>{line}</span>
              ))}
            </dd>
          </div>
          <div>
            <dt>现在</dt>
            <dd>{workProgress.now[0]}</dd>
          </div>
          <div>
            <dt lang="en">Work · Tool</dt>
            <dd>
              {relations.workTool}
              <span className="fo-tag">计划中 · 范围与时间未定</span>
            </dd>
          </div>
        </dl>
        <p className="fo-go">
          <a
            className="fo-btn"
            href={WORK_GITHUB}
            target="_blank"
            rel="noreferrer"
          >
            {workGo.github}
            <ArrowUpRight size={13} aria-hidden="true" />
          </a>
          <a
            className="fo-link"
            href={WORK_BUILD}
            target="_blank"
            rel="noreferrer"
          >
            {workGo.build}
            <ArrowUpRight size={12} aria-hidden="true" />
          </a>
          <a className="fo-link" href={contactHref('work')}>
            {workGo.follow}
          </a>
        </p>
      </section>

      <FullPlate
        folio="CODA"
        plate="Pl. 7"
        caption="一毫米的判断 · 品牌概念图"
        color={hands.color}
        label="满幅照片：一双手在木桌上用一把木尺量着一个小零件，旁边是画了线的纸。"
      >
        <Photo image={hands} focus="50% 40%" />
      </FullPlate>
    </div>
  );
}
