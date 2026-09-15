import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowUpRight } from 'lucide-react';
import { members } from '../../../content/members';
import { works } from '../../../content/works';
import stories from '../../../content/stories.json';
import { pageMetadata, siteUrl } from '../../../lib/site';
import { EditorialPage, Trail, WorkRow, Invitation } from '../../editorial';
import { StructuredData } from '../../structured-data';
type Props = { params: Promise<{ slug: string }> };
export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const member = members.find((item) => item.slug === slug);
  return member
    ? pageMetadata(
        `${member.name} · ${member.role}`,
        member.description,
        `/community/${slug}`,
      )
    : { title: '成员未找到', robots: { index: false } };
}
export default async function Page({ params }: Props) {
  const { slug } = await params;
  const member = members.find((item) => item.slug === slug);
  if (!member) notFound();
  return (
    <EditorialPage className="member-page">
      <StructuredData
        json={JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'ProfilePage',
          url: `${siteUrl}/community/${slug}`,
          mainEntity: {
            '@type': member.type,
            '@id': `${siteUrl}/community/${slug}#identity`,
            name: member.name,
            description: member.description,
            ...(slug === 'adeptify'
              ? { sameAs: 'https://github.com/adeptify' }
              : {}),
          },
        })}
      />
      <Trail
        items={[
          { name: '社区', href: '/community' },
          { name: member.name, href: `/community/${slug}` },
        ]}
      />
      <header className="member-opening">
        <h1>
          {member.name}
          <em>{member.english}</em>
        </h1>
        <div>
          <span>{member.role}</span>
          <p>{member.description}</p>
          {slug === 'adeptify' && (
            <a
              className="edition-link"
              href="https://github.com/adeptify"
              target="_blank"
              rel="noreferrer"
            >
              公开仓库 <ArrowUpRight size={17} />
            </a>
          )}
        </div>
      </header>
      {member.workSlugs.length > 0 && (
        <section className="edition-section">
          <div className="edition-section-head">
            <h2>正在做的作品</h2>
            <span>Adeptify 的产品集</span>
          </div>
          <div className="community-works">
            {member.workSlugs.map((workSlug) => (
              <WorkRow
                key={workSlug}
                work={works.find((work) => work.slug === workSlug)!}
              />
            ))}
          </div>
        </section>
      )}
      {member.storySlugs.length > 0 && (
        <section className="edition-section">
          <h2>写下的观点</h2>
          <div className="member-stories">
            {member.storySlugs.map((storySlug) => {
              const story = stories.find((item) => item.slug === storySlug)!;
              return (
                <Link href={`/story/${storySlug}`} key={storySlug}>
                  <h3>{story.title}</h3>
                  <span>{story.label}</span>
                  <ArrowUpRight size={22} />
                </Link>
              );
            })}
          </div>
        </section>
      )}
      <Invitation />
    </EditorialPage>
  );
}
