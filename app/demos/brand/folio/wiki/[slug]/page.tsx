import { notFound, redirect } from 'next/navigation';
import { knowledge } from '../../../../../../content/knowledge';

// 原百科条目搬到社区「方法」下（A6）；不存在的条目仍然 404。服务端页面，直接写路径。
type Props = { params: Promise<{ slug: string }> };

export default async function FolioWikiEntryRedirect({ params }: Props) {
  const { slug } = await params;
  if (!knowledge.some((item) => item.slug === slug)) notFound();
  redirect(`/demos/community/methods/${slug}`);
}
