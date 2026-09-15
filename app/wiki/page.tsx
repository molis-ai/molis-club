import Link from 'next/link';
import { ArrowDown, ArrowUpRight } from 'lucide-react';
import { artistSkills } from '../../content/artists';
import { knowledge } from '../../content/knowledge';
import { pageMetadata } from '../../lib/site';
import { EditorialPage, Opening, CollectionData } from '../editorial';
import { ArtistSeries } from '../artist-series';
import { KnowledgeDirectory, KnowledgeDemo } from '../knowledge-lab';
export const metadata = pageMetadata(
  '百科 · 艺术家 Skill、网页词典与动效',
  'Molis Wikipedia 是 Molis AI 的创作知识库。探索艺术家 Skill 系列，体验网页布局与动效，带走可用于本地创作的 Skill 和 Prompt。',
  '/wiki',
);
export default function Page() {
  return (
    <EditorialPage className="wiki-page">
      <CollectionData
        name="Molis Wikipedia"
        path="/wiki"
        items={[
          ...artistSkills.map((skill) => ({
            name: skill.name,
            path: `/wiki/artists/${skill.slug}`,
            description: skill.description,
          })),
          ...knowledge.map((entry) => ({
            name: entry.name,
            path: `/wiki/${entry.slug}`,
            description: entry.description,
          })),
        ]}
      />
      <Opening title="百科" english="A little knowledge. A new possibility.">
        <p>
          看懂一种表达，
          <br />
          把它变成自己的能力。
        </p>
      </Opening>
      <section className="wiki-feature">
        <div className="wiki-feature-copy">
          <h2>
            Molis
            <br />
            <em>Wikipedia.</em>
          </h2>
          <p>
            从艺术风格到网页与动效。
            <br />
            看作品，试一试，把创作方法带走。
            <br />
            让「我想要这种感觉」有一个准确的说法。
          </p>
          <a className="edition-link" href="#entries">
            探索网页与动效 <ArrowDown size={17} />
          </a>
        </div>
        <div className="wiki-feature-demo">
          <KnowledgeDemo entry={knowledge[0]} />
          <Link href="/wiki/stagger">
            错落入场 · 看看它如何实现 <ArrowUpRight size={17} />
          </Link>
        </div>
      </section>
      <ArtistSeries />
      <div className="edition-section-head web-knowledge-heading">
        <h2>网页与动效</h2>
        <p>看懂一种表达，带走实现方法。</p>
      </div>
      <KnowledgeDirectory />
      <section className="wiki-note illustrated-note">
        <img
          src="/images/studio-series/encyclopedia-atelier.jpg"
          width="1200"
          height="800"
          loading="lazy"
          alt="翻开的参考书、知识卡片与整理材料的手的主题插画"
        />
        <div>
          <h2>从看见，到做到。</h2>
          <p>
            这里收录可以亲手尝试的知识与方法。每个条目都有用途、边界和参考资料；Prompt
            是起点，你的内容与判断决定最终的表达。
          </p>
          <Link className="edition-link" href="/join">
            告诉我们你想了解的能力 <ArrowUpRight size={17} />
          </Link>
        </div>
      </section>
    </EditorialPage>
  );
}
