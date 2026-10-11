import { notFound, redirect } from 'next/navigation';
import { artistSkills } from '../../../../../../../content/artists';

// 原百科的艺术家 Skill 搬到社区「方法」下（A6）；不存在的 Skill 仍然 404。服务端页面，直接写路径。
type Props = { params: Promise<{ slug: string }> };

export default async function FolioWikiArtistRedirect({ params }: Props) {
  const { slug } = await params;
  if (!artistSkills.some((item) => item.slug === slug)) notFound();
  redirect(`/demos/community/methods/artists/${slug}`);
}
