import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { works } from '../../content/works';
import { members } from '../../content/members';
import { pageMetadata } from '../../lib/site';
import {
  EditorialPage,
  Opening,
  WorkRow,
  Invitation,
  CollectionData,
} from '../editorial';
export const metadata = pageMetadata(
  '社区 · 发现创作者与他们的作品',
  '在 Molis AI 社区认识 Adeptify 与一骏，发现 AI 工具、互动体验和创作观点，前往作品的真实使用入口。',
  '/community',
);
export default function Page() {
  const featured = ['jelly', 'niulai', 'elsewhere', 'goalboard'].map((slug) =>
    works.find((work) => work.slug === slug)!,
  );
  return (
    <EditorialPage className="community-page">
      <CollectionData
        name="Molis AI 社区"
        path="/community"
        items={members.map((member) => ({
          name: member.name,
          path: `/community/${member.slug}`,
          description: member.description,
        }))}
      />
      <Opening title="社区" english="Good things begin with people.">
        <p>
          认识有趣的人，
          <br />
          也认识他们正在创造的世界。
        </p>
      </Opening>
      <section className="community-scene">
        <figure>
          <img
            src="/images/molis-makers-studio.png"
            width="1536"
            height="1024"
            alt="围桌创作的手绘场景"
          />
          <figcaption>围桌创作 · 社群主题插画</figcaption>
        </figure>
        <div>
          <h2>
            因为一件作品，
            <br />
            开始认识彼此。
          </h2>
          <p>
            一个想法、一点尝试，慢慢变成可以触碰的东西。这里连接创作者、作品，和愿意停下来体验的人。
          </p>
          <a className="edition-link" href="#community-works">
            发现作品 <ArrowUpRight size={18} />
          </a>
        </div>
      </section>
      <section className="edition-section" id="community-works">
        <div className="edition-section-head">
          <h2>从这些作品开始</h2>
          <Link className="edition-link" href="/products">
            更多产品 <ArrowUpRight size={17} />
          </Link>
        </div>
        <div className="community-works">
          {featured.map((work) => (
            <WorkRow key={work.slug} work={work} author />
          ))}
        </div>
      </section>
      <section className="edition-section" id="people">
        <div className="edition-section-head">
          <h2>作品背后的人</h2>
          <p>从我们认识的创作者开始。</p>
        </div>
        <div className="member-index">
          {members.map((member) => (
            <Link
              className="member-entry"
              href={`/community/${member.slug}`}
              key={member.slug}
            >
              <div className={`member-signature signature-${member.slug}`}>
                {member.slug === 'adeptify' ? (
                  <em>Adeptify</em>
                ) : (
                  <span>一骏</span>
                )}
              </div>
              <div>
                <h3>
                  {member.name}
                  <span>{member.role}</span>
                </h3>
                <p>{member.description}</p>
                <span className="edition-link">
                  认识{member.slug === 'adeptify' ? '团队' : '作者'}{' '}
                  <ArrowUpRight size={17} />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>
      <Invitation text="正在做一个有意思的东西？把作品或创作过程告诉我们。当前由我们协助整理成员与作品内容。" />
    </EditorialPage>
  );
}
