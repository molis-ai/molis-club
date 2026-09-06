'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, ArrowUpRight, MoveDown, Plus } from 'lucide-react';
import { Header, Footer } from './shell';
import { works } from '../content/works';
export default function Community() {
  const [filter, setFilter] = useState('全部');
  useEffect(() => {
    const context = (
      document as Document & {
        modelContext?: {
          registerTool: (
            tool: unknown,
            options: { signal: AbortSignal },
          ) => void | Promise<void>;
        };
      }
    ).modelContext;
    if (!context) return;
    const controller = new AbortController();
    const tool = {
      name: 'filter_community_works',
      title: '筛选社区作品',
      description: '按全部、有趣的作品或开发者工具筛选当前作品现场。',
      inputSchema: {
        type: 'object',
        properties: {
          category: {
            type: 'string',
            enum: ['全部', '有趣的作品', '开发者工具'],
          },
        },
        required: ['category'],
        additionalProperties: false,
      },
      annotations: { readOnlyHint: false, untrustedContentHint: false },
      execute(input: unknown) {
        const category = (input as { category?: unknown })?.category;
        if (
          typeof category !== 'string' ||
          !['全部', '有趣的作品', '开发者工具'].includes(category)
        )
          throw new Error('请选择有效分类');
        setFilter(category);
        return {
          category,
          works: works
            .filter((w) => category === '全部' || w.category === category)
            .map((w) => ({ name: w.name, url: `/works/${w.slug}` })),
        };
      },
    };
    try {
      void Promise.resolve(
        context.registerTool(tool, { signal: controller.signal }),
      ).catch(() => {});
    } catch {}
    return () => controller.abort();
  }, []);
  const visible = works.filter(
    (w) => filter === '全部' || w.category === filter,
  );
  return (
    <>
      <Header />
      <main id="main">
        <section className="hero">
          <div className="hero-copy">
            <h1>
              有些东西，
              <br />
              值得<span>做出来。</span>
            </h1>
            <p>
              一个想法，一群做东西的人，
              <br />
              还有最早相信它的你。
            </p>
            <div className="hero-actions">
              <a className="button primary" href="#works">
                看看正在发生什么 <ArrowRight size={18} />
              </a>
              <Link className="text-link" href="/story/idealism">
                读一份自白 <ArrowUpRight size={16} />
              </Link>
            </div>
          </div>
          <figure className="hero-art">
            <img
              src="/images/worktable.png"
              width="1536"
              height="1024"
              alt="四位创造者围坐在工作桌旁，桌上有笔记本、小牛、树苗、外星生命和梨灯"
            />
            <figcaption>留个位置，给还没被做出来的东西。</figcaption>
          </figure>
          <div className="hero-bottom">
            <span>独自起意，一起见证。</span>
            <a href="#works">
              往下逛逛 <MoveDown size={16} />
            </a>
          </div>
        </section>
        <section id="works" className="works-section">
          <div className="section-heading">
            <div>
              <h2>
                正在长大的东西<span className="heading-dot">.</span>
              </h2>
              <p>有些能带走，有些还在试。每一个，都有它想存在的理由。</p>
            </div>
            <span className="quiet-label">来自我们的真实仓库</span>
          </div>
          <div className="filter-row" role="group" aria-label="作品分类">
            {['全部', '有趣的作品', '开发者工具'].map((f) => (
              <button
                key={f}
                className={filter === f ? 'filter active' : 'filter'}
                onClick={() => setFilter(f)}
                aria-pressed={filter === f}
              >
                {f}
              </button>
            ))}
            <span>{visible.length} 件作品</span>
          </div>
          <div className="works-grid">
            {visible.map((w) => (
              <Link
                className="work-card"
                href={`/works/${w.slug}`}
                key={w.slug}
              >
                <div className={`work-art ${w.tone}`}>
                  <div className="art-top">
                    <span>{w.english}</span>
                    <ArrowUpRight size={20} />
                  </div>
                  <span className="work-symbol">{w.symbol}</span>
                  <span className="art-bottom">{w.name}</span>
                </div>
                <div className="work-info">
                  <div className="work-meta">
                    <span>{w.owner}</span>
                    <span className="status">{w.status}</span>
                  </div>
                  <h3>{w.title}</h3>
                  <p>{w.description}</p>
                  <span className="work-open">
                    认识这个作品 <ArrowRight size={16} />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>
        <section className="belief">
          <p className="belief-intro">
            做东西的门槛越来越低。
            <br />
            被认真看见，依然珍贵。
          </p>
          <div>
            <h2>
              我们想找到的，
              <br />
              是最早的<span>十个相信者。</span>
            </h2>
            <p>
              一个有生命力的作品，需要有人试用、有人挑毛病、有人回来看看。你的一句“这就是我想要的”，可能就是它继续长下去的理由。
            </p>
            <Link className="text-link" href="/story/human-scale">
              为什么要有这样一个地方 <ArrowUpRight size={18} />
            </Link>
          </div>
        </section>
        <section id="people" className="people-section">
          <div className="section-heading">
            <div>
              <h2>作品后面，是人。</h2>
              <p>先认识一下这张桌子旁的人。</p>
            </div>
          </div>
          <div className="people-layout">
            <div className="founder">
              <div className="founder-name">
                <span className="avatar-letter">骏</span>
                <div>
                  <h3>一骏</h3>
                  <p>Adeptify 发起人 · 也在这里做东西</p>
                </div>
              </div>
              <blockquote>
                “做一件事，先问这件事值不值得存在，再问有没有人为它买单。”
              </blockquote>
              <Link className="text-link" href="/story/idealism">
                这是我的自白 <ArrowUpRight size={17} />
              </Link>
            </div>
            <div className="open-seat">
              <Plus size={28} />
              <h3>下一把椅子，留给你。</h3>
              <p>
                会写代码，会画画，会讲故事，或者只是有个一直想做的东西。带着它来。
              </p>
              <Link className="button light" href="/join">
                说说你想做什么 <ArrowUpRight size={17} />
              </Link>
            </div>
          </div>
        </section>
        <section id="tools" className="tools-section">
          <div>
            <h2>
              把执行交给机器，
              <br />
              把判断留给自己。
            </h2>
            <p>我们也在造工具，让一个人能把事情做得更远。</p>
            <a
              className="text-link"
              href="https://github.com/adeptify"
              target="_blank"
              rel="noreferrer"
            >
              到 GitHub 看施工现场 <ArrowUpRight size={17} />
            </a>
          </div>
          <div className="tool-list">
            {works
              .filter((w) => w.category === '开发者工具')
              .map((w) => (
                <Link key={w.slug} href={`/works/${w.slug}`}>
                  <span>
                    <strong>{w.name}</strong>
                    <small>{w.description}</small>
                  </span>
                  <ArrowUpRight size={24} />
                </Link>
              ))}
          </div>
        </section>
        <section className="closing">
          <p>不必先证明它能改变世界。</p>
          <h2>先让它来到世界。</h2>
          <Link className="button primary" href="/join">
            带个想法，来烤个梨 <ArrowUpRight size={18} />
          </Link>
        </section>
      </main>
      <Footer />
    </>
  );
}
