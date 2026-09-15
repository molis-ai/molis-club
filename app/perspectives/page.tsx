import Link from '../edition-link';
import stories from '../../content/stories.json';
import { pageMetadata } from '../../lib/site';
import { EditorialPage, Opening, CollectionData } from '../editorial';
import { ImageCurtain } from '../image-curtain';
const essays = [
  {
    slug: 'human-scale',
    description: '当机器能够承担更多执行，我们如何决定什么值得做。',
    image: '/images/studio-series/perspectives-atelier.jpg',
  },
  {
    slug: 'idealism',
    description: '从落地与实践出发，讨论想法、行动与自我判断。',
    image: '/images/line-experience.jpg',
  },
];
export const metadata = pageMetadata(
  '观点 · 关于 AI、产品与创作的思考',
  '阅读一骏的《人的尺度》《落地主义》。关于 AI 时代的人的判断、想法如何落地，以及我们为什么创作。',
  '/perspectives',
);
export default function Page() {
  return (
    <EditorialPage className="perspectives-page">
      <CollectionData
        name="Molis AI 观点"
        path="/perspectives"
        items={essays.map((essay) => ({
          name: stories.find((story) => story.slug === essay.slug)!.title,
          path: `/story/${essay.slug}`,
          description: essay.description,
        }))}
      />
      <Opening title="观点" english="Room for a point of view.">
        <p>
          关于 AI、产品与创造。
          <br />
          我们看见的、相信的，也还在追问的。
        </p>
      </Opening>
      <div className="perspectives-index">
        {essays.map((essay) => {
          const story = stories.find((item) => item.slug === essay.slug)!;
          return (
            <article className="perspective-entry" key={essay.slug}>
              <Link
                className="perspective-cover"
                href={`/story/${essay.slug}`}
                aria-label={`阅读${story.title}`}
                data-image-curtain
              >
                <img
                  src={essay.image}
                  width="1000"
                  height="1000"
                  alt={`${story.title}主题插画`}
                  loading="lazy"
                />
                <ImageCurtain label="阅读观点" tone="paper" />
              </Link>
              <div className="perspective-copy">
                <h2>
                  <Link href={`/story/${essay.slug}`}>{story.title}</Link>
                </h2>
                <p>{essay.description}</p>
                <div className="perspective-meta">
                  <Link href="/community/yijun">一骏</Link>
                  <span>{Math.ceil(story.body.length / 500)} 分钟阅读</span>
                </div>
              </div>
            </article>
          );
        })}
      </div>
      <section className="perspectives-close">
        <p>
          想法会改变。
          <br />
          <em>判断，值得认真留下。</em>
        </p>
        <Link className="edition-link" href="/community">
          看看这些想法长成了什么
        </Link>
      </section>
    </EditorialPage>
  );
}
