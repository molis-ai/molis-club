import Link from '../edition-link';
import { works, type Work } from '../../content/works';
import { members } from '../../content/members';
import { productLines } from '../../content/lines';
import { artistSkills } from '../../content/artists';
import stories from '../../content/stories.json';
import { WorkIdentity } from '../work-presentation';
import { ArtistSeries } from '../artist-series';
import { KnowledgeDirectory } from '../knowledge-lab';
import { CollectionData } from '../editorial';
import { ImageCurtain } from '../image-curtain';
import { CMain, CScenes } from './motion';

export function CPhoto({
  src,
  priority = false,
  alt = '',
}: {
  src: string;
  priority?: boolean;
  alt?: string;
}) {
  return (
    <img
      className="c-photo"
      src={src}
      alt={alt}
      width={
        src.endsWith('studio-light.jpg')
          ? 1672
          : src.endsWith('making-study.jpg')
            ? 1536
            : 1440
      }
      height={
        src.endsWith('studio-light.jpg')
          ? 941
          : src.endsWith('making-study.jpg')
            ? 1024
            : src.endsWith('threshold.jpg')
              ? 900
              : 960
      }
      loading={priority ? 'eager' : 'lazy'}
      fetchPriority={priority ? 'high' : undefined}
    />
  );
}
function Hero({
  title,
  image,
  href,
  action,
  home = false,
}: {
  title: string;
  image: string;
  href: string;
  action: string;
  home?: boolean;
}) {
  return (
    <section className={`c-hero${home ? ' c-home-hero' : ''}`}>
      <CPhoto src={image} priority />
      <div className="c-hero-copy">
        <h1>{title}</h1>
        <Link className="c-button c-button-glass" href={href}>
          {action}
        </Link>
      </div>
    </section>
  );
}
function Statement({
  children,
  action,
  href,
}: {
  children: React.ReactNode;
  action: string;
  href: string;
}) {
  return (
    <section className="c-statement">
      <h2>{children}</h2>
      <Link className="c-button" href={href}>
        {action}
      </Link>
    </section>
  );
}
function Tile({
  image,
  title,
  text,
  href,
  priority = false,
}: {
  image: string;
  title: string;
  text: string;
  href: string;
  priority?: boolean;
}) {
  return (
    <Link href={href} className="c-tile" data-image-curtain>
      <CPhoto src={image} priority={priority} />
      <ImageCurtain />
      <div>
        <h2>{title}</h2>
        <p>{text}</p>
      </div>
    </Link>
  );
}
function WorkIndex({ items }: { items: Work[] }) {
  return (
    <div className="c-work-grid">
      {items.map((w) => (
        <Link href={`/works/${w.slug}`} key={w.slug} className="c-work">
          <WorkIdentity work={w} />
          <h3>{w.title}</h3>
          <span>{w.status}</span>
        </Link>
      ))}
    </div>
  );
}
function Title({ title, text }: { title: string; text: string }) {
  return (
    <header className="c-page-title">
      <h1>{title}</h1>
      <p>{text}</p>
    </header>
  );
}
export function CHome() {
  return (
    <CMain>
      <Hero
        home
        title={'为新的想法，\n做一些新的东西。'}
        image="/images/edition-c/studio-light.jpg"
        href="/products"
        action="探索作品"
      />
      <Statement href="/join" action="聊聊你的想法">
        Molis AI 是一个与 AI 一起创作的工作室。
        <br />
        我们做产品，分享方法，
        <br />
        也认真看待每一个人的感受。
      </Statement>
      <section className="c-grid c-three">
        <Tile
          image="/images/atelier/studio-desk.jpg"
          title="产品"
          text={'从日常的小问题，\n开始做一点改变。'}
          href="/products"
        />
        <Tile
          image="/images/edition-c/making-study.jpg"
          title="百科"
          text={'好的表达，\n也有可以学会的方法。'}
          href="/wiki"
        />
        <Tile
          image="/images/atelier/shared-studio.jpg"
          title="社区"
          text={'认识作品，\n也认识创作的人。'}
          href="/community"
        />
      </section>
      <CScenes />
      <section className="c-grid c-two">
        <Tile
          image="/images/atelier/threshold.jpg"
          title="Elsewhere"
          text={'把心里的如果走完，\n然后回来。'}
          href="/works/elsewhere"
        />
        <Tile
          image="/images/artists/monet-pond.jpg"
          title="Artist Skill"
          text={'换一种方式，\n观看与创作。'}
          href="/wiki/artists"
        />
      </section>
      <section className="c-feature">
        <CPhoto src="/images/atelier/reading-room.jpg" />
        <div>
          <h2>
            技术向前，
            <br />
            人的尺度留在心里。
          </h2>
          <p>关于 AI、产品和创作，我们还在认真追问。</p>
          <Link className="c-button" href="/perspectives">
            阅读观点
          </Link>
        </div>
      </section>
    </CMain>
  );
}
export function CCommunity() {
  return (
    <CMain>
      <Hero
        title={'一起做东西，\n一起认识世界。'}
        image="/images/atelier/shared-studio.jpg"
        href="#people"
        action="认识同伴"
      />
      <Statement href="/join" action="带着想法来">
        作品让想法可见，
        <br />
        交流让它继续生长。
      </Statement>
      <section className="c-people" id="people">
        {members.map((m) => (
          <Link href={`/community/${m.slug}`} key={m.slug}>
            <span>{m.role}</span>
            <h2>{m.name}</h2>
            <p>{m.description}</p>
          </Link>
        ))}
      </section>
      <section className="c-content">
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
    </CMain>
  );
}
export function CProducts({ line }: { line?: string }) {
  const selected = productLines.find((l) => l.id === line);
  const items = works.filter(
    (w) =>
      w.category !== 'Solutions' &&
      (!selected || selected.projects.some((s) => s === w.slug)),
  );
  return (
    <CMain>
      <CollectionData
        name="Molis AI 产品"
        path="/products"
        items={items.map((w) => ({
          name: w.name,
          path: `/works/${w.slug}`,
          description: w.description,
        }))}
      />
      <Hero
        title={'给生活一点轻盈，\n给创作更多可能。'}
        image="/images/atelier/studio-desk.jpg"
        href="#products"
        action="浏览产品"
      />
      {!selected && (
        <section className="c-grid c-two">
          <Tile
            image="/images/atelier/threshold.jpg"
            title="Elsewhere"
            text="一段有结束、有归来的互动叙事。"
            href="/works/elsewhere"
          />
          <Link href="/works/niulai" className="c-product-feature">
            <img
              src="/images/products/niulai.png"
              alt=""
              width="192"
              height="192"
            />
            <div>
              <h2>niul.ai</h2>
              <p>Agent 干完了，不会敲你。牛会。</p>
              <span>公开仓库</span>
            </div>
          </Link>
        </section>
      )}
      <section className="c-content" id="products">
        <header>
          <h2>{selected?.name || '所有作品'}</h2>
          <nav aria-label="产品分类">
            <Link
              href="/products#products"
              aria-current={!selected ? 'page' : undefined}
            >
              全部
            </Link>
            {productLines.map((l) => (
              <Link
                key={l.id}
                href={`/products?line=${l.id}#products`}
                aria-current={selected?.id === l.id ? 'page' : undefined}
              >
                {l.name}
              </Link>
            ))}
          </nav>
        </header>
        <WorkIndex items={items} />
      </section>
    </CMain>
  );
}
export function CSolutions() {
  const items = works.filter((w) => w.category === 'Solutions');
  return (
    <CMain>
      <CollectionData
        name="Molis AI 解决方案"
        path="/solutions"
        items={items.map((w) => ({
          name: w.name,
          path: `/works/${w.slug}`,
          description: w.description,
        }))}
      />
      <Hero
        title={'让 AI 的能力，\n落在具体的工作里。'}
        image="/images/edition-c/studio-light.jpg"
        href="#solutions"
        action="了解方案"
      />
      <section className="c-solutions" id="solutions">
        {items.map((w, i) => (
          <article className="c-feature" id={w.slug} key={w.slug}>
            <Link
              href={`/works/${w.slug}`}
              className="c-feature-image"
              data-image-curtain
              aria-label={`了解 ${w.name} 方案`}
            >
              <CPhoto
                src={
                  [
                    '/images/edition-c/making-study.jpg',
                    '/images/atelier/studio-desk.jpg',
                    '/images/atelier/threshold.jpg',
                  ][i]
                }
              />
              <ImageCurtain label="了解方案" />
            </Link>
            <div>
              <p className="c-meta">
                {w.name} · {w.status}
              </p>
              <h2>{w.title}</h2>
              <p>{w.description}</p>
              <details>
                <summary>现在的进展</summary>
                <p>{w.detail}</p>
              </details>
              <Link className="c-button" href={`/works/${w.slug}`}>
                了解方案
              </Link>
            </div>
          </article>
        ))}
      </section>
    </CMain>
  );
}
export function CWiki() {
  return (
    <CMain>
      <Hero
        title={'把喜欢的表达，\n变成自己的能力。'}
        image="/images/edition-c/making-study.jpg"
        href="#entries"
        action="打开百科"
      />
      <Statement href="/wiki/artists" action="探索 Artist Skill">
        从艺术家的观看方式，
        <br />
        到网页里的细微动效。
        <br />
        试一试，把方法带走。
      </Statement>
      <section className="c-content">
        <ArtistSeries />
      </section>
      <section className="c-content c-knowledge" id="entries">
        <header>
          <h2>网页与动效</h2>
          <p>体验、选择、复制，在本地继续创作。</p>
        </header>
        <KnowledgeDirectory />
      </section>
    </CMain>
  );
}
export function CArtists() {
  return (
    <CMain>
      <Title
        title={'艺术家的\n观看方式。'}
        text="把光、形态与场面中的方法，带进下一次创作。"
      />
      <CollectionData
        name="Artist Skill"
        path="/wiki/artists"
        items={artistSkills.map((s) => ({
          name: s.name,
          path: `/wiki/artists/${s.slug}`,
          description: s.description,
        }))}
      />
      <section className="c-content">
        <ArtistSeries full />
      </section>
    </CMain>
  );
}
export function CPerspectives() {
  return (
    <CMain>
      <Title
        title={'留一点时间，\n想一想。'}
        text="关于 AI、产品与创作的观点。"
      />
      <section className="c-stories">
        {['human-scale', 'idealism'].map((slug, i) => {
          const s = stories.find((s) => s.slug === slug)!;
          return (
            <article className="c-feature" key={slug}>
              <Link
                href={`/story/${slug}`}
                className="c-feature-image"
                aria-label={`阅读${s.title}`}
                data-image-curtain
              >
                <CPhoto
                  src={
                    i === 0
                      ? '/images/atelier/reading-room.jpg'
                      : '/images/edition-c/making-study.jpg'
                  }
                  priority={i === 0}
                />
                <ImageCurtain label="阅读观点" />
              </Link>
              <div>
                <p className="c-meta">
                  一骏 · {Math.ceil(s.body.length / 500)} 分钟阅读
                </p>
                <h2>
                  <Link href={`/story/${slug}`}>{s.title}</Link>
                </h2>
                <p>
                  {i === 0
                    ? '当机器能够承担更多执行，我们如何决定什么值得做。'
                    : '从落地与实践出发，讨论想法、行动与自我判断。'}
                </p>
                <Link className="c-button" href={`/story/${slug}`}>
                  阅读观点
                </Link>
              </div>
            </article>
          );
        })}
      </section>
    </CMain>
  );
}
