'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { works } from '../content/works';
import { productLines } from '../content/lines';
import { Header, Footer } from './shell';
export default function Catalog({
  solutions = false,
}: {
  solutions?: boolean;
}) {
  const [line, setLine] = useState('all');
  useEffect(() => {
    const value = new URLSearchParams(window.location.search).get('line');
    if (productLines.some((l) => l.id === value)) setLine(value!);
  }, []);
  function select(id: string) {
    setLine(id);
    const u = new URL(window.location.href);
    if (id === 'all') u.searchParams.delete('line');
    else u.searchParams.set('line', id);
    window.history.replaceState(null, '', u);
  }
  const groups = solutions
    ? [
        {
          id: 'solutions',
          name: '解决方案',
          description: '从一个业务问题开始，一起找到能落地的路径。',
          projects: works
            .filter((w) => w.category === 'Solutions')
            .map((w) => w.slug),
        },
      ]
    : productLines.filter((l) => line === 'all' || l.id === line);
  return (
    <>
      <Header />
      <main className="catalog-page section-wrap" id="main">
        <div className="catalog-heading">
          <h1>
            {solutions ? 'Solutions' : 'Products'}
            <em>
              {solutions
                ? 'Built around your work.'
                : 'Made for the way we live.'}
            </em>
          </h1>
          <p>
            {solutions
              ? '内容增长、软件 Agent 化与数据洞察。从具体场景出发，保留人的判断。'
              : '有的作品关心感受，有的替你省下一步，有的让下一次创造更容易。'}
          </p>
        </div>
        {!solutions && (
          <div className="filters catalog-filters" aria-label="产品线筛选">
            <button onClick={() => select('all')} aria-pressed={line === 'all'}>
              全部产品
            </button>
            {productLines.map((l) => (
              <button
                key={l.id}
                onClick={() => select(l.id)}
                aria-pressed={line === l.id}
              >
                {l.name}
              </button>
            ))}
          </div>
        )}
        {groups.map((g) => (
          <section className="catalog-group" key={g.id}>
            <div className="catalog-group-intro">
              <h2>{g.name}</h2>
              <p>{g.description}</p>
            </div>
            <div>
              {g.projects.map((slug) => {
                const w = works.find((w) => w.slug === slug)!;
                return (
                  <Link
                    className="catalog-row"
                    href={`/works/${slug}`}
                    key={slug}
                  >
                    <div>
                      <h3>{w.name}</h3>
                      <span className="catalog-status">{w.status}</span>
                    </div>
                    <p>{w.description}</p>
                    <ArrowUpRight size={22} />
                  </Link>
                );
              })}
            </div>
          </section>
        ))}
        {solutions && (
          <div className="catalog-contact">
            <p>有一个正在面对的问题？</p>
            <Link className="text-link" href="/join">
              聊聊你的场景 <ArrowUpRight size={18} />
            </Link>
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}
