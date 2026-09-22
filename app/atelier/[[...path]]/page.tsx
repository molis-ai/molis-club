import { notFound } from 'next/navigation';
import { pageMetadata } from '../../../lib/site';
import {
  AtelierHome,
  AtelierCommunity,
  AtelierProducts,
  AtelierSolutions,
  AtelierWiki,
  AtelierPerspectives,
  AtelierArtists,
} from '../pages';
import WorkPage, {
  generateMetadata as workMetadata,
} from '../../works/[slug]/page';
import MemberPage, {
  generateMetadata as memberMetadata,
} from '../../community/[slug]/page';
import KnowledgePage, {
  generateMetadata as knowledgeMetadata,
} from '../../wiki/[slug]/page';
import ArtistPage, {
  generateMetadata as artistMetadata,
} from '../../wiki/artists/[slug]/page';
import StoryPage, {
  generateMetadata as storyMetadata,
} from '../../story/[slug]/page';
import Login from '../../login/page';
import Join from '../../join/page';
import Account from '../../account/page';
import Privacy from '../../privacy/page';
import { Photo } from '../motion';
import { works } from '../../../content/works';
import '../../editorial.css';
type Props = {
  params: Promise<{ path?: string[] }>;
  searchParams: Promise<{ line?: string }>;
};
export async function generateMetadata({ params }: Props) {
  const { path = [] } = await params;
  const [section, slug, artist] = path;
  const prop = { params: Promise.resolve({ slug: slug || '' }) };
  if (section === 'works' && slug) return workMetadata(prop);
  if (section === 'community' && slug) return memberMetadata(prop);
  if (section === 'wiki' && slug === 'artists' && artist)
    return artistMetadata({ params: Promise.resolve({ slug: artist }) });
  if (section === 'wiki' && slug && slug !== 'artists')
    return knowledgeMetadata(prop);
  if (section === 'story' && slug) return storyMetadata(prop);
  const descriptions: Record<string, string> = {
    '': 'Molis AI 是与 AI 一起创作的工作室。做产品，分享知识与艺术家 Skill，也记录关于人的思考。',
    community:
      '认识 Adeptify 团队与创作者一骏，了解他们的作品、创作想法与体验入口。',
    products:
      'Molis AI 的工具与体验：牛来、Jelly、Elsewhere、GoalBoard，以及正在探索的产品。',
    solutions:
      '了解内容增长、软件 Agent 化与数据分析三个方向的方案、适用场景和当前阶段。',
    wiki: '体验网页与动效，查阅组件来源，复制 Prompt，下载 Artist Skill，将创作方法带到本地使用。',
    perspectives: '一骏关于 AI、产品、理想主义与人的尺度的观点。',
    login: '登录 Molis AI，记录对作品的想法。',
    join: '向 Molis AI 工作室介绍你的想法、作品与合作意向。',
    account: '管理 Molis AI 账号与登录状态。',
    privacy: 'Molis AI 私有试用版的账户资料、反馈与联系信息处理说明。',
  };
  const titles: Record<string, string> = {
    '': '创作工作室',
    community: '社区',
    products: '产品',
    solutions: '解决方案',
    wiki: 'Molis Wikipedia',
    perspectives: '观点',
    login: '登录',
    join: '聊聊你的想法',
    account: '我的账号',
    privacy: '隐私说明',
  };
  return pageMetadata(
    titles[section || ''] || 'Molis AI',
    descriptions[section || ''] || descriptions[''],
    '/' + path.join('/'),
  );
}
export default async function Page({ params, searchParams }: Props) {
  const { path = [] } = await params;
  const [section, slug, artist] = path;
  if (!section) return <AtelierHome />;
  if (section === 'community' && !slug) return <AtelierCommunity />;
  if (section === 'products' && !slug)
    return <AtelierProducts line={(await searchParams).line} />;
  if (section === 'solutions' && !slug) return <AtelierSolutions />;
  if (section === 'wiki' && !slug) return <AtelierWiki />;
  if (section === 'perspectives' && !slug) return <AtelierPerspectives />;
  if (section === 'wiki' && slug === 'artists' && !artist)
    return <AtelierArtists />;
  const prop = { params: Promise.resolve({ slug: slug || '' }) };
  let page: React.ReactNode;
  let type = section;
  let photo = '';
  if (section === 'works' && slug && path.length === 2) {
    page = <WorkPage {...prop} />;
    type =
      works.find((w) => w.slug === slug)?.category === 'Solutions'
        ? 'solution-detail'
        : 'work-detail';
    photo =
      slug === 'elsewhere'
        ? 'threshold'
        : type === 'solution-detail'
          ? 'shared-studio'
          : 'studio-desk';
  } else if (section === 'community' && slug && path.length === 2) {
    page = <MemberPage {...prop} />;
    type = 'member';
    photo = slug === 'yijun' ? 'reading-room' : 'shared-studio';
  } else if (
    section === 'wiki' &&
    slug === 'artists' &&
    artist &&
    path.length === 3
  ) {
    page = <ArtistPage params={Promise.resolve({ slug: artist })} />;
    type = 'artist-detail';
  } else if (section === 'wiki' && slug && path.length === 2) {
    page = <KnowledgePage {...prop} />;
    type = 'knowledge';
  } else if (section === 'story' && slug && path.length === 2) {
    page = <StoryPage {...prop} />;
    type = 'essay';
    photo = 'reading-room';
  } else if (section === 'login' && !slug) page = <Login />;
  else if (section === 'join' && !slug) page = <Join />;
  else if (section === 'account' && !slug) page = <Account />;
  else if (section === 'privacy' && !slug) page = <Privacy />;
  else notFound();
  return (
    <div className={`atelier-legacy atelier-${type}`} data-content={slug}>
      {photo && (
        <div className="atelier-detail-photo">
          <Photo src={`/images/atelier/${photo}.jpg`} priority />
        </div>
      )}
      {page}
    </div>
  );
}
