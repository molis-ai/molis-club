import { notFound } from 'next/navigation';
import {
  CHome,
  CCommunity,
  CProducts,
  CSolutions,
  CWiki,
  CPerspectives,
  CArtists,
} from '../pages';
import WorkPage from '../../works/[slug]/page';
import MemberPage from '../../community/[slug]/page';
import KnowledgePage from '../../wiki/[slug]/page';
import ArtistPage from '../../wiki/artists/[slug]/page';
import StoryPage from '../../story/[slug]/page';
import Login from '../../login/page';
import Join from '../../join/page';
import Account from '../../account/page';
import Privacy from '../../privacy/page';
import { CPhoto } from '../pages';
import { works } from '../../../content/works';
import '../../editorial.css';
type Props = {
  params: Promise<{ path?: string[] }>;
  searchParams: Promise<{ line?: string }>;
};
export { generateMetadata } from '../../atelier/[[...path]]/page';
export default async function Page({ params, searchParams }: Props) {
  const { path = [] } = await params;
  const [section, slug, artist] = path;
  if (!section) return <CHome />;
  if (section === 'community' && !slug) return <CCommunity />;
  if (section === 'products' && !slug)
    return <CProducts line={(await searchParams).line} />;
  if (section === 'solutions' && !slug) return <CSolutions />;
  if (section === 'wiki' && !slug) return <CWiki />;
  if (section === 'perspectives' && !slug) return <CPerspectives />;
  if (section === 'wiki' && slug === 'artists' && !artist) return <CArtists />;
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
    <div className={`c-detail c-${type}`} data-content={slug}>
      {photo && (
        <div className="c-detail-photo">
          <CPhoto src={`/images/atelier/${photo}.jpg`} priority />
        </div>
      )}
      {page}
    </div>
  );
}
