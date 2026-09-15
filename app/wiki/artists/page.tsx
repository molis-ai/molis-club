import { EditorialPage, Trail, Opening, CollectionData } from '../../editorial';
import { ArtistSeries } from '../../artist-series';
import { artistSkills } from '../../../content/artists';
import { pageMetadata } from '../../../lib/site';
export const metadata = pageMetadata(
  '艺术家 Skill 系列 · 莫奈、达利与韦斯风格创作',
  '探索 Artist-skill：从光色、形态到电影场面，浏览真实 AI 创作试样，了解风格方法，下载完整 Skill 并在本地使用。',
  '/wiki/artists',
);
export default function Page() {
  return (
    <EditorialPage className="artists-page">
      <CollectionData
        name="艺术家 Skill 系列"
        path="/wiki/artists"
        items={artistSkills.map((skill) => ({
          name: skill.name,
          path: `/wiki/artists/${skill.slug}`,
          description: skill.description,
        }))}
      />
      <Trail
        items={[
          { name: '百科', href: '/wiki' },
          { name: '艺术家 Skill', href: '/wiki/artists' },
        ]}
      />
      <Opening
        title="艺术家的观看方式"
        english="Ways of seeing. Ways of making."
      >
        <p>
          把光、形态与场面中的方法，
          <br />
          带进下一次创作。
        </p>
      </Opening>
      <ArtistSeries full />
      <section className="wiki-note">
        <h2>一种方法，很多可能。</h2>
        <p>
          Skill 是交给 AI
          工具的一套创作方法，包含风格选择、输入要求和检查方式。你带来题材，它帮助组织画面；风格研究与实际成图，可以继续相互修正。
        </p>
      </section>
    </EditorialPage>
  );
}
