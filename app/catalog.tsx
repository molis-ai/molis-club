import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { works } from '../content/works';
import { productLines } from '../content/lines';
import { WorkIdentity } from './work-presentation';
import { EditorialPage, Opening, WorkRow, Invitation } from './editorial';

const approaches: Record<
  string,
  { title: string; input: string; ai: string; human: string; output: string }
> = {
  'content-growth': {
    title: '有很多想说的，\n怎样成为值得看的内容？',
    input: '品牌背景、受众、已有材料与内容目标',
    ai: '整理研究材料，辅助机会判断，按平台组织内容草稿。',
    human: '选择值得表达的角度，校对事实，决定发布什么。',
    output: '可审阅的内容基础包与平台草稿',
  },
  evrik: {
    title: '已有的软件，\n能否自己推进一段工作？',
    input: '现有业务能力、任务目标与授权范围',
    ai: '在已接通的能力与权限内执行步骤，呈现运行过程。',
    human: '划定授权边界，检查执行结果，决定是否接纳。',
    output: '有边界的任务执行与可检查的结果',
  },
  aether: {
    title: '数据散在各处，\n怎样形成有出处的判断？',
    input: '业务指标、数据来源、领域知识与分析问题',
    ai: '规划连接指标、引用知识、辅助分析并组织报告。',
    human: '确认指标口径，核查推断，编辑最终结论。',
    output: '带有依据、可以编辑的分析报告（规划）',
  },
};
export default function Catalog({
  solutions = false,
  line = 'all',
}: {
  solutions?: boolean;
  line?: string;
}) {
  if (solutions)
    return (
      <EditorialPage className="solutions-page">
        <Opening title="解决方案" english="Thoughtfully put to work.">
          <p>
            从一段具体的工作开始，
            <br />让 AI 的能力，有合适的位置。
          </p>
          <img
            className="solution-opening-illustration"
            src="/images/studio-series/solutions-atelier.jpg"
            width="1200"
            height="800"
            loading="lazy"
            alt="两个创作者在桌边一起搭建纸模型的主题插画"
          />
        </Opening>
        <div className="solution-map">
          <p>选择你正在面对的问题</p>
          <nav aria-label="方案场景">
            {works
              .filter((work) => work.category === 'Solutions')
              .map((work) => (
                <a key={work.slug} href={`#${work.slug}`}>
                  {work.name}
                  <ArrowRight size={17} />
                </a>
              ))}
          </nav>
        </div>
        {works
          .filter((work) => work.category === 'Solutions')
          .map((work) => {
            const approach = approaches[work.slug];
            return (
              <section className="approach" id={work.slug} key={work.slug}>
                <header>
                  <h2>
                    <Link href={`/works/${work.slug}`}>{approach.title}</Link>
                  </h2>
                  <div>
                    <span>
                      {work.name} · {work.status}
                    </span>
                    <p>{work.description}</p>
                  </div>
                </header>
                <details className="approach-status">
                  <summary>方案如何工作</summary>
                  <div className="approach-layout">
                    <div className="approach-path">
                      <p className="approach-caption">
                        方案示意 · 实际能力以当前阶段为准
                      </p>
                      <div>
                        <span>带来什么</span>
                        <h3>{approach.input}</h3>
                      </div>
                      <ArrowRight className="path-arrow" size={22} />
                      <div>
                        <span>希望得到</span>
                        <h3>{approach.output}</h3>
                      </div>
                    </div>
                    <div className="approach-roles">
                      <div>
                        <h3>AI 承担的工作</h3>
                        <p>{approach.ai}</p>
                      </div>
                      <div>
                        <h3>人保留的判断</h3>
                        <p>{approach.human}</p>
                      </div>
                    </div>
                  </div>
                  <p>{work.detail}</p>
                </details>
              </section>
            );
          })}
        <Invitation
          title="从你的工作谈起。"
          text="告诉我们你在为谁解决问题、现在怎样完成这项工作，以及最容易卡在哪里。"
        />
      </EditorialPage>
    );
  const selected = productLines.filter(
    (group) => line === 'all' || group.id === line,
  );
  const jelly = works.find((work) => work.slug === 'jelly')!;
  const niulai = works.find((work) => work.slug === 'niulai')!;
  return (
    <EditorialPage className="products-page">
      <Opening title="产品" english="Small ideas. Real things.">
        <p>
          给日常一点轻盈，
          <br />
          给创造多一点可能。
        </p>
      </Opening>
      {line === 'all' && (
        <section className="product-exhibition" aria-label="精选产品">
          <div className="product-exhibition-main">
            <WorkIdentity work={niulai} />
            <h2>{niulai.title}</h2>
            <p>{niulai.description}</p>
            <div>
              <Link className="edition-link" href="/works/niulai">
                认识这头牛
              </Link>
              <span>{niulai.status}</span>
            </div>
            <figure>
              <img
                src="/images/line-tools.jpg"
                width="1024"
                height="1024"
                alt="小牛与桌面工具的手绘主题插画"
              />
              <figcaption>日常里的小帮手 · 主题插画</figcaption>
            </figure>
          </div>
          <Link className="product-exhibition-side" href="/works/jelly">
            <WorkIdentity work={jelly} />
            <div>
              <h2>
                让日程、笔记和灵感，
                <br />
                待在一起。
              </h2>
            </div>
            <span>{jelly.status}</span>
          </Link>
        </section>
      )}
      <section className="product-collection" id="collection">
        <nav className="edition-filters" aria-label="产品线筛选">
          <Link
            href="/products"
            aria-current={line === 'all' ? 'page' : undefined}
          >
            全部产品
          </Link>
          {productLines.map((group) => (
            <Link
              key={group.id}
              href={`/products?line=${group.id}`}
              aria-current={line === group.id ? 'page' : undefined}
            >
              {group.name}
            </Link>
          ))}
        </nav>
        {selected.map((group) => (
          <section className="product-chapter" key={group.id}>
            <header>
              <h2>{group.name}</h2>
              <em>{group.english}</em>
              <p>{group.description}</p>
            </header>
            <div>
              {group.projects.map((slug) => (
                <WorkRow
                  key={slug}
                  work={works.find((work) => work.slug === slug)!}
                />
              ))}
            </div>
          </section>
        ))}
      </section>
      <section className="edition-closing">
        <p>每件作品，都从一个具体的感受开始。</p>
        <Link className="edition-link" href="/community/adeptify">
          认识创作团队
        </Link>
      </section>
    </EditorialPage>
  );
}
