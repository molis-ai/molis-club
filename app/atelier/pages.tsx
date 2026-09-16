import Link from '../edition-link';
import { works, type Work } from '../../content/works';
import { members } from '../../content/members';
import { productLines } from '../../content/lines';
import { artistSkills } from '../../content/artists';
import stories from '../../content/stories.json';
import { WorkIdentity } from '../work-presentation';
import { ArtistSeries } from '../artist-series';
import { KnowledgeDirectory } from '../knowledge-lab';
import AtelierMotion, { Photo } from './motion';
import Collections from './collections';
import { CollectionData } from '../editorial';
import { ImageCurtain } from '../image-curtain';

export function RoomHero({
  title,
  text,
  image = 'threshold',
  home = false,
}: {
  title: string;
  text: string;
  image?: string;
  home?: boolean;
}) {
  return (
    <section
      className={`atelier-room-hero${home ? ' home-room' : ''}`}
      data-photo-motion
    >
      <Photo
        src={`/images/atelier/${home ? 'makers-studio' : image}.jpg`}
        alt={home ? '四位创作者在窗边工作室围桌讨论草图与作品' : ''}
        priority
      />
      <div className="atelier-room-copy">
        {home ? <p className="atelier-home-message">{title}</p> : <h1>{title}</h1>}
        <p>{text}</p>
        {home && (
          <Link href="/products" className="atelier-action">
            探索作品
          </Link>
        )}
      </div>
      {home && <h1 className="atelier-home-wordmark">Molis AI</h1>}
    </section>
  );
}
function Statement({ children }: { children: React.ReactNode }) {
  return (
    <section className="atelier-statement">
      <h2>{children}</h2>
    </section>
  );
}
function PhotoLink({
  image,
  title,
  text,
  href,
}: {
  image: string;
  title: string;
  text: string;
  href: string;
}) {
  return (
    <Link href={href} className="atelier-photo-link" data-image-curtain>
      <Photo src={image} />
      <ImageCurtain tone={image.includes('/products/') ? 'paper' : 'ink'} />
      <div>
        <h2>{title}</h2>
        <p>{text}</p>
      </div>
    </Link>
  );
}
function WorkIndex({ items }: { items: Work[] }) {
  return (
    <div className="atelier-work-index">
      {items.map((work) => (
        <Link href={`/works/${work.slug}`} key={work.slug}>
          <WorkIdentity work={work} />
          <h3>{work.title}</h3>
          <span>{work.status}</span>
        </Link>
      ))}
    </div>
  );
}
export function AtelierHome() {
  return (
    <AtelierMotion className="atelier-home">
      <RoomHero
        home
        title="给想法，一个生长的地方。"
        text="一个与 AI 一起创作的工作室。做产品，也分享方法。"
      />
      <Statement>
        留意日常里的感受，
        <br />
        把值得做的事，慢慢做出来。
      </Statement>
      <div className="atelier-photo-triptych">
        <PhotoLink
          image="/images/atelier/studio-desk.jpg"
          title="作品"
          text="从一个具体的小问题开始。"
          href="/products"
        />
        <PhotoLink
          image="/images/atelier/reading-room.jpg"
          title="方法"
          text="把好奇，变成能用的能力。"
          href="/wiki"
        />
        <PhotoLink
          image="/images/atelier/shared-studio.jpg"
          title="同伴"
          text="让不同的想法，在这里相遇。"
          href="/community"
        />
      </div>
      <Collections />
      <section className="atelier-feature-pair">
        <PhotoLink
          image="/images/atelier/threshold.jpg"
          title="把心里的如果走完，然后回来。"
          text="Elsewhere · 一段有归途的互动叙事"
          href="/works/elsewhere"
        />
        <PhotoLink
          image="/images/artists/monet-pond.jpg"
          title="换一种方式，看世界。"
          text="Artist Skill · 从观看到创作"
          href="/wiki/artists"
        />
      </section>
      <section className="atelier-editorial-note">
        <h2>
          技术向前走，
          <br />
          人的尺度，留在心里。
        </h2>
        <div>
          <p>关于 AI、产品与创作，我们还在认真追问。</p>
          <Link href="/perspectives">阅读观点</Link>
        </div>
      </section>
    </AtelierMotion>
  );
}
export function AtelierCommunity() {
  return (
    <AtelierMotion className="atelier-community">
      <RoomHero
        title={'一起做东西，\n也一起认识世界。'}
        text="一个小小的创作者社区。由作品开始，慢慢认识彼此。"
        image="shared-studio"
      />
      <Statement>
        作品让想法可见，
        <br />
        交流让它继续生长。
      </Statement>
      <section className="atelier-people">
        {members.map((member) => (
          <Link href={`/community/${member.slug}`} key={member.slug}>
            <span>{member.role}</span>
            <h2>{member.name}</h2>
            <p>{member.description}</p>
          </Link>
        ))}
      </section>
      <section className="atelier-content-section">
        <header>
          <h2>从这些作品开始</h2>
          <Link href="/products">全部作品</Link>
        </header>
        <WorkIndex
          items={works.filter((w) =>
            ['niulai', 'elsewhere', 'jelly'].includes(w.slug),
          )}
        />
      </section>
      <div className="atelier-banner" data-photo-motion>
        <Photo src="/images/atelier/studio-desk.jpg" />
        <div>
          <h2>
            你正在想的，
            <br />
            也许值得一起做。
          </h2>
          <Link href="/join">聊聊你的想法</Link>
        </div>
      </div>
    </AtelierMotion>
  );
}
export function AtelierProducts({ line }: { line?: string }) {
  const selected = productLines.find((l) => l.id === line);
  const items = works.filter(
    (w) =>
      w.category !== 'Solutions' &&
      (!selected || selected.projects.some((slug) => slug === w.slug)),
  );
  return (
    <AtelierMotion className="atelier-products">
      <CollectionData
        name="Molis AI 产品"
        path="/products"
        items={items.map((w) => ({
          name: w.name,
          path: `/works/${w.slug}`,
          description: w.description,
        }))}
      />
      <RoomHero
        title={'给生活留一点轻盈，\n给创作多一点可能。'}
        text="工具、体验，以及让 AI 真正参与工作的尝试。"
        image="studio-desk"
      />
      {!selected && (
        <section className="atelier-feature-pair product-pair">
          <PhotoLink
            image="/images/atelier/threshold.jpg"
            title="Elsewhere"
            text="把心里的如果走完，然后回来。"
            href="/works/elsewhere"
          />
          <PhotoLink
            image="/images/products/niulai.png"
            title="niul.ai"
            text="Agent 干完了，不会敲你。牛会。"
            href="/works/niulai"
          />
        </section>
      )}
      <section className="atelier-content-section">
        <header>
          <h2>{selected?.name || '所有作品'}</h2>
          <nav aria-label="产品分类">
            <Link
              href="/products"
              aria-current={!selected ? 'page' : undefined}
            >
              全部
            </Link>
            {productLines.map((l) => (
              <Link
                key={l.id}
                href={`/products?line=${l.id}`}
                aria-current={selected?.id === l.id ? 'page' : undefined}
              >
                {l.name}
              </Link>
            ))}
          </nav>
        </header>
        <WorkIndex items={items} />
      </section>
    </AtelierMotion>
  );
}
export function AtelierSolutions() {
  const solutions = works.filter((w) => w.category === 'Solutions');
  return (
    <AtelierMotion className="atelier-solutions">
      <CollectionData
        name="Molis AI 解决方案"
        path="/solutions"
        items={solutions.map((w) => ({
          name: w.name,
          path: `/works/${w.slug}`,
          description: w.description,
        }))}
      />
      <RoomHero
        title={'让 AI 的能力，\n落在具体的工作里。'}
        text="从要解决的问题开始，找到适合人和 AI 的分工。"
        image="shared-studio"
      />
      <section className="atelier-solution-stories">
        {solutions.map((work, i) => (
          <article key={work.slug} id={work.slug}>
            <Link
              href={`/works/${work.slug}`}
              className="atelier-solution-photo"
              aria-label={`了解 ${work.name} 方案`}
              data-photo-motion
              data-image-curtain
            >
              <Photo
                src={`/images/atelier/${['reading-room', 'studio-desk', 'threshold'][i]}.jpg`}
              />
              <ImageCurtain label="了解方案" />
            </Link>
            <div>
              <span>
                {work.name} · {work.status}
              </span>
              <h2>{work.title}</h2>
              <p>{work.description}</p>
              <details>
                <summary>看看现在的进展</summary>
                <p>{work.detail}</p>
              </details>
              <Link href={`/works/${work.slug}`}>了解方案</Link>
            </div>
          </article>
        ))}
      </section>
    </AtelierMotion>
  );
}
export function AtelierWiki() {
  return (
    <AtelierMotion className="atelier-wiki">
      <section className="atelier-wiki-intro">
        <div>
          <h1>
            把喜欢的表达，
            <br />
            变成自己的能力。
          </h1>
          <p>Molis Wikipedia</p>
          <p>
            从艺术家的观看方式，到网页里的一个细节。
            <br />
            看一看，试一试，把方法带走。
          </p>
        </div>
        <Photo src="/images/atelier/reading-room.jpg" priority />
      </section>
      <section className="atelier-content-section">
        <ArtistSeries />
      </section>
      <section className="atelier-content-section" id="entries">
        <header>
          <h2>网页与动效</h2>
          <p>可以体验，也可以带到本地使用。</p>
        </header>
        <KnowledgeDirectory />
      </section>
    </AtelierMotion>
  );
}
export function AtelierPerspectives() {
  return (
    <AtelierMotion className="atelier-perspectives">
      <section className="atelier-page-heading">
        <h1>
          留一点时间，
          <br />
          想一想。
        </h1>
        <p>关于 AI、产品和创作的观点。</p>
      </section>
      <div className="atelier-essay-index">
        {['human-scale', 'idealism'].map((slug, i) => {
          const s = stories.find((s) => s.slug === slug)!;
          return (
            <article key={slug}>
              <Link
                href={`/story/${slug}`}
                className="atelier-essay-photo"
                aria-label={`阅读${s.title}`}
                data-photo-motion
                data-image-curtain
              >
                <Photo
                  priority={i === 0}
                  src={`/images/atelier/${i === 0 ? 'reading-room' : 'studio-desk'}.jpg`}
                />
                <ImageCurtain label="阅读观点" />
              </Link>
              <div>
                <span>一骏 · {Math.ceil(s.body.length / 500)} 分钟阅读</span>
                <h2>
                  <Link href={`/story/${slug}`}>{s.title}</Link>
                </h2>
                <p>
                  {i === 0
                    ? '当机器能够承担更多执行，我们如何决定什么值得做。'
                    : '从落地与实践出发，讨论想法、行动与自我判断。'}
                </p>
              </div>
            </article>
          );
        })}
      </div>
    </AtelierMotion>
  );
}
export function AtelierArtists() {
  return (
    <AtelierMotion className="atelier-artists">
      <section className="atelier-page-heading">
        <h1>
          艺术家的
          <br />
          观看方式。
        </h1>
        <p>把光、形态与场面中的方法，带进下一次创作。</p>
      </section>
      <CollectionData
        name="Artist Skill"
        path="/wiki/artists"
        items={artistSkills.map((s) => ({
          name: s.name,
          path: `/wiki/artists/${s.slug}`,
          description: s.description,
        }))}
      />
      <section className="atelier-content-section">
        <ArtistSeries full />
      </section>
    </AtelierMotion>
  );
}
