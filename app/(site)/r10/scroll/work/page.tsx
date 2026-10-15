import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { pageMetadata } from '../../../../../lib/site';
import {
  products,
  relations,
  WORK_BUILD,
  WORK_GITHUB,
} from '../../../../../content/site/products';
import { workGo, workProgress } from '../../../../../content/site/work';
import { contactHref } from '../../../../_site/routes';
import { Photo } from '../roll';
import { WorkScroll } from './screens';

const work = products.work;

export const metadata = {
  ...pageMetadata(
    `${work.name} · 一卷手卷 · 第十轮视觉稿`,
    work.what,
    '/r10/scroll/work',
  ),
  robots: { index: false, follow: false },
};

// Molis Work（视觉稿 C「一卷手卷」）：信息架构照旧（首屏 → 开场 → 各节 → 适合的时刻 → 当前进展 → 关系 → 去处），
// 照片屏和文字屏分开：一屏字（名字、标题、阶段）→ 一屏照片（首页长卷的第一段「接着做下去」）→ 一屏开场的两句
// → 一卷工作台（开发中版本的真实截图，从右往左展开）→ 一屏照片「一毫米的判断」→ 一屏「适合这样的时刻」→ 一屏进展与去处。
// 两张照片是负责人的品牌概念图（雾感版），不当作真实的工作室来讲。
export default function ScrollWork() {
  const [opening] = work.opening;
  const [first, second] = opening.split(/(?<=。)/);
  return (
    <div className="sc-work">
      <section className="sc-w-top" aria-labelledby="sc-w-title">
        <p className="sc-edge" aria-hidden="true" lang="en">
          Work
        </p>
        <p className="sc-w-kicker">
          <span className="sc-label-no">01</span>
          <span lang="en">Molis Work</span>
          <span>{work.form}</span>
        </p>
        <h1 id="sc-w-title" className="sc-w-name" lang="en">
          Molis Work
        </h1>
        <div className="sc-w-side">
          <p className="sc-w-headline">{work.headline}</p>
          <p className="sc-w-what">{work.what}</p>
          <p className="sc-w-stage">
            <span className="m-status">{work.stage}</span>
            <span>{work.stageNote}</span>
          </p>
          <p className="sc-w-go">
            <a
              className="sc-line"
              href={WORK_GITHUB}
              target="_blank"
              rel="noreferrer"
            >
              {workGo.github}
              <ArrowUpRight size={12} aria-hidden="true" />
            </a>
          </p>
        </div>
      </section>

      <section className="sc-w-photo" aria-label="接着做下去" data-tone="film">
        <Photo
          name="work-a"
          alt="窗边的旧木桌上铺满草图和折好的纸样，一台打开的笔记本电脑，窗外是花园。"
          sizes="100vw"
          className="sc-after-photo"
          focus="50% 55%"
        />
        <p className="sc-w-photo-note" aria-hidden="true">
          第一段　接着做下去
        </p>
      </section>

      <section className="sc-w-open" aria-label="开场">
        <p className="sc-w-open-lead">{first}</p>
        <p className="sc-w-open-next">{second}</p>
      </section>

      <WorkScroll />

      <section
        className="sc-w-photo"
        aria-label="一毫米的判断"
        data-tone="film"
      >
        <Photo
          name="work-b"
          alt="一双手扶着木头做的圆规，在纸上画一道弧，桌上落着木屑。"
          sizes="100vw"
          className="sc-after-photo"
          focus="40% 45%"
        />
        <p className="sc-w-photo-note" aria-hidden="true">
          一毫米的判断
        </p>
      </section>

      <section className="sc-w-fit" aria-labelledby="sc-w-fit-title">
        <h2 id="sc-w-fit-title" className="sc-w-small">
          适合这样的时刻
        </h2>
        <p>{work.fit}</p>
      </section>

      <section className="sc-w-end" aria-labelledby="sc-w-now-title">
        <div className="sc-w-col">
          <h2 id="sc-w-now-title" className="sc-w-small">
            已经有的
          </h2>
          <ul>
            {workProgress.have.map((line) => (
              <li key={line}>{line}</li>
            ))}
          </ul>
        </div>
        <div className="sc-w-col">
          <h2 className="sc-w-small">还没有的</h2>
          <ul>
            {workProgress.notYet.map((line) => (
              <li key={line}>{line}</li>
            ))}
          </ul>
        </div>
        <div className="sc-w-col">
          <h2 className="sc-w-small">现在怎么体验</h2>
          <ul>
            {workProgress.now.map((line) => (
              <li key={line}>{line}</li>
            ))}
          </ul>
        </div>
        <div className="sc-w-rel">
          <h2 className="sc-w-small">
            <span lang="en">Tool</span> → <span lang="en">Work</span>
          </h2>
          <p>{relations.workTool}</p>
          <p>
            <span className="m-note">计划中 · 范围与时间未定</span>
          </p>
        </div>
        <p className="sc-w-actions">
          <a
            className="sc-btn"
            href={WORK_GITHUB}
            target="_blank"
            rel="noreferrer"
          >
            {workGo.github}
            <ArrowUpRight size={13} aria-hidden="true" />
          </a>
          <a
            className="sc-line"
            href={WORK_BUILD}
            target="_blank"
            rel="noreferrer"
          >
            {workGo.build}
          </a>
          <Link className="sc-line" href={contactHref('work')}>
            {workGo.follow}
          </Link>
        </p>
      </section>
    </div>
  );
}
