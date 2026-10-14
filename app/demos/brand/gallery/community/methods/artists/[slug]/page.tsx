import { notFound } from 'next/navigation';
import { artistSkills } from '../../../../../../../../content/artists';
import { MethodArtist } from './artist';

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const skill = artistSkills.find((item) => item.slug === slug);
  if (!skill) return { title: 'Skill 未找到', robots: { index: false } };
  return {
    title: { absolute: `${skill.name} · 艺术家 Skill · Molis AI 社区 · 方法` },
    description: skill.description,
    robots: { index: false, follow: false },
  };
}

export default async function Page({ params }: Props) {
  const { slug } = await params;
  if (!artistSkills.some((item) => item.slug === slug)) notFound();
  return <MethodArtist slug={slug} />;
}
