import Link from 'next/link';
import { ArrowDown, ArrowUpRight, ArrowRight, Plus } from 'lucide-react';
import { works } from '../content/works';
import { productLines } from '../content/lines';
import { Header, Footer } from './shell';
import { WorkIdentity, SolutionPath } from './work-presentation';
import './inner-pages.css';

const lineImages: Record<string, string> = {
  experience: '/images/line-experience.jpg',
  tools: '/images/line-tools.jpg',
  engineering: '/images/line-engineering.jpg',
};
const solutionLabels: Record<string, string> = {
  'content-growth': '内容与增长',
  evrik: '软件 Agent 化',
  aether: '数据与洞察',
};

export default function Catalog({
  solutions = false,
  line = 'all',
}: {
  solutions?: boolean;
  line?: string;
}) {
  const groups = productLines.filter(
    (group) => line === 'all' || group.id === line,
  );
  const niulai = works.find((work) => work.slug === 'niulai')!;
  const jelly = works.find((work) => work.slug === 'jelly')!;
  return (
    <>
      <Header />
      <main
        id="main"
        className={solutions ? 'inner-solutions' : 'inner-products'}
      >
        {solutions ? (
          <>
            <section className="solution-opening inner-width">
              <div>
                <h1>
                  把 AI，
                  <br />
                  放进你的<span>日常业务。</span>
                </h1>
                <p>
                  内容增长、软件 Agent 化与数据洞察。
                  <br />
                  从具体场景出发，保留人的判断。
                </p>
                <a href="#approaches" className="inner-action">
                  找到你的场景 <ArrowDown size={18} />
                </a>
              </div>
              <div className="solution-opening-note">
                <em>
                  Built around
                  <br />
                  your work.
                </em>
                <p>
                  从一个业务问题开始，
                  <br />
                  一起找到能落地的路径。
                </p>
                <span>Solutions / Molis AI</span>
              </div>
            </section>
            <div className="solution-directory inner-width" id="approaches">
              <div className="inner-section-heading">
                <h2>工作，从哪里卡住？</h2>
                <p>选择一个场景，看看我们正在探索的路径。</p>
              </div>
              {works
                .filter((work) => work.category === 'Solutions')
                .map((work, index) => (
                  <details
                    className="solution-dossier"
                    key={work.slug}
                    open={index === 0}
                  >
                    <summary>
                      <div>
                        <span>{solutionLabels[work.slug]}</span>
                        <h3>{work.name}</h3>
                      </div>
                      <p>{work.title}</p>
                      <Plus size={26} aria-hidden="true" />
                    </summary>
                    <div className="solution-dossier-body">
                      <div className="solution-dossier-intro">
                        <p>{work.audience}</p>
                        <p>{work.why}</p>
                      </div>
                      <SolutionPath slug={work.slug} />
                      <div className="solution-dossier-state">
                        <div>
                          <h4>{work.status}</h4>
                          <p>{work.detail}</p>
                        </div>
                        <Link
                          href={`/works/${work.slug}`}
                          className="inner-action"
                        >
                          了解 {work.name}
                          <ArrowUpRight size={18} />
                        </Link>
                      </div>
                    </div>
                  </details>
                ))}
            </div>
            <section className="inner-invitation inner-width">
              <h2>
                先聊问题，
                <br />
                <em>再找办法。</em>
              </h2>
              <div>
                <p>
                  告诉我们你在为谁解决问题、现在怎样完成这项工作，以及最容易卡在哪里。
                </p>
                <Link className="inner-action" href="/join">
                  聊聊你的场景 <ArrowUpRight size={19} />
                </Link>
              </div>
            </section>
          </>
        ) : (
          <>
            <section className="collection-opening inner-width">
              <div>
                <h1>
                  Products<em>Made for the way we live.</em>
                </h1>
                <p>
                  有的作品关心感受，有的替你省下一步，
                  <br className="desktop-break" />
                  有的让下一次创造更容易。
                </p>
              </div>
              <a className="collection-scroll" href="#collection">
                逛逛作品 <ArrowDown size={19} />
              </a>
            </section>
            {line === 'all' && (
              <section
                className="featured-products inner-width"
                aria-label="可以先用起来的作品"
              >
                <Link className="featured-cow" href="/works/niulai">
                  <div className="featured-cow-copy">
                    <WorkIdentity work={niulai} />
                    <h2>{niulai.title}</h2>
                    <div className="featured-bottom">
                      <span>{niulai.status}</span>
                      <span>
                        认识这头牛 <ArrowUpRight size={18} />
                      </span>
                    </div>
                  </div>
                  <img
                    src="/images/line-tools.jpg"
                    alt="小牛与桌面工具的主题插画"
                    width="1024"
                    height="1024"
                  />
                </Link>
                <Link className="featured-jelly" href="/works/jelly">
                  <WorkIdentity work={jelly} />
                  <div>
                    <h2>{jelly.title}</h2>
                    <p>{jelly.description}</p>
                  </div>
                  <div className="featured-bottom">
                    <span>{jelly.status}</span>
                    <span>
                      认识 Jelly <ArrowUpRight size={18} />
                    </span>
                  </div>
                </Link>
              </section>
            )}
            <div className="collection-body inner-width" id="collection">
              <nav className="collection-navigation" aria-label="产品线筛选">
                <Link
                  href="/products"
                  aria-current={line === 'all' ? 'page' : undefined}
                >
                  全部作品
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
              {groups.map((group) => (
                <section
                  className={`collection-chapter collection-${group.id}`}
                  key={group.id}
                >
                  <div className="collection-chapter-heading">
                    <div>
                      <h2>{group.name}</h2>
                      <em>{group.english}</em>
                    </div>
                    <p>{group.description}</p>
                  </div>
                  <div className="collection-chapter-layout">
                    <figure>
                      <img
                        src={lineImages[group.id]}
                        alt={`${group.name}主题插画`}
                        width="1024"
                        height="1024"
                        loading="lazy"
                      />
                      <figcaption>关于{group.name}的想象 · 主题插画</figcaption>
                    </figure>
                    <div className="collection-works">
                      {group.projects.map((slug) => {
                        const work = works.find((item) => item.slug === slug)!;
                        return (
                          <Link
                            className="collection-work"
                            href={`/works/${slug}`}
                            key={slug}
                          >
                            <WorkIdentity work={work} />
                            <h3>{work.title}</h3>
                            <p>{work.description}</p>
                            <div>
                              <span>{work.status}</span>
                              <ArrowUpRight size={20} aria-hidden="true" />
                            </div>
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                </section>
              ))}
            </div>
            <section className="collection-closing inner-width">
              <p>每件作品，都从一个具体的感受开始。</p>
              <Link href="/story/human-scale">
                读读背后的故事 <ArrowRight size={18} />
              </Link>
            </section>
          </>
        )}
      </main>
      <Footer />
    </>
  );
}
