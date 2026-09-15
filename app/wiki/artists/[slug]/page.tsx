import Link from '../../../edition-link';
import { notFound } from 'next/navigation';
import { Download } from 'lucide-react';
import { artistSkills } from '../../../../content/artists';
import { pageMetadata, siteUrl } from '../../../../lib/site';
import { EditorialPage, Trail } from '../../../editorial';
import { StructuredData } from '../../../structured-data';
import { SkillPrompt } from '../../../skill-prompt';
import { ImageCurtain } from '../../../image-curtain';
type Props = { params: Promise<{ slug: string }> };
export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const skill = artistSkills.find((item) => item.slug === slug);
  return skill
    ? pageMetadata(
        `${skill.name} · 艺术家 Skill`,
        skill.description,
        `/wiki/artists/${slug}`,
      )
    : { title: 'Skill 未找到', robots: { index: false } };
}
export default async function Page({ params }: Props) {
  const { slug } = await params;
  const skill = artistSkills.find((item) => item.slug === slug);
  if (!skill) notFound();
  return (
    <EditorialPage className="artist-detail">
      <StructuredData
        json={JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'CreativeWork',
          name: skill.name,
          description: skill.description,
          url: `${siteUrl}/wiki/artists/${slug}`,
          inLanguage: 'zh-CN',
          isPartOf: {
            '@type': 'CollectionPage',
            name: '艺术家 Skill 系列',
            url: `${siteUrl}/wiki/artists`,
          },
          encoding: {
            '@type': 'MediaObject',
            encodingFormat: 'application/zip',
            contentUrl: `${siteUrl}/downloads/artists/${slug}.zip`,
          },
        })}
      />
      <Trail
        items={[
          { name: '百科', href: '/wiki' },
          { name: '艺术家 Skill', href: '/wiki/artists' },
          { name: skill.name, href: `/wiki/artists/${slug}` },
        ]}
      />
      <header className="artist-heading">
        <h1>
          {skill.name}
          <em>{skill.english}</em>
        </h1>
        <p>{skill.description}</p>
      </header>
      <section
        className={`artist-detail-spread${skill.image ? '' : ' artist-no-image'}`}
      >
        {skill.image ? (
          <figure>
            <a
              href={skill.image}
              target="_blank"
              rel="noreferrer"
              aria-label="查看完整创作试样"
              data-image-curtain
            >
              <img
                src={skill.image}
                width={skill.width}
                height={skill.height}
                alt={skill.imageAlt}
              />
              <ImageCurtain label="查看完整图像" tone="paper" />
            </a>
            <figcaption>
              Artist-skill · AI 创作试样，非艺术家原作。点击查看完整图像。
            </figcaption>
          </figure>
        ) : (
          <div className="artist-method-cover">
            <em>
              Observe.
              <br />
              Translate.
              <br />
              Create.
            </em>
            <p>观察，转译，再创造。</p>
          </div>
        )}
        <div className="artist-method">
          <h2>它怎样组织创作</h2>
          {skill.method.map((item) => (
            <section key={item.title}>
              <h3>{item.title}</h3>
              <p>{item.body}</p>
            </section>
          ))}
          <a
            href={`/downloads/artists/${slug}.zip`}
            download
            className="edition-button"
          >
            <Download size={16} />
            下载完整 Skill
          </a>
          <p className="artist-package-note">
            含 Skill 正文与所需参考文件。
            <br />
            来源：Artist-skill · 本地整理版 2026.09.16
          </p>
        </div>
      </section>
      <section className="artist-use">
        <div>
          <h2>把方法带进自己的创作</h2>
          <p>{skill.use}</p>
          <ol>
            <li>下载并解压，保留 Skill 文件夹的完整结构。</li>
            <li>
              将文件夹安装到你的 AI 工具支持的 Skills 目录，确认它已被识别。
            </li>
            <li>
              复制调用示例，换成你的题材与要求。制作图片时，需要工具具备图像生成能力。
            </li>
          </ol>
          <p className="artist-package-note">
            调用示例用于开始新的创作，并非上方试样的原始生成提示。请按所用工具的安装方式操作。
          </p>
        </div>
        <SkillPrompt prompt={skill.prompt} />
      </section>
      <section className="knowledge-related">
        <h2>其他观看方式</h2>
        <div>
          {artistSkills
            .filter((item) => item.slug !== slug)
            .map((item) => (
              <Link href={`/wiki/artists/${item.slug}`} key={item.slug}>
                <span>
                  {item.name}
                  <em>{item.english}</em>
                </span>
              </Link>
            ))}
        </div>
      </section>
    </EditorialPage>
  );
}
