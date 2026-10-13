import { notFound } from 'next/navigation';
import {
  isResourceEntry,
  knowledge,
} from '../../../../../../../content/knowledge';
import { MethodEntry } from './entry';

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const entry = knowledge.find((item) => item.slug === slug);
  if (!entry) return { title: '条目未找到', robots: { index: false } };
  return {
    title: {
      absolute: `${entry.name} ${entry.english} · ${isResourceEntry(entry) ? '来源与 Prompt' : '演示与 Prompt'} · Molis AI 社区 · 方法`,
    },
    description: entry.description,
  };
}

export default async function Page({ params }: Props) {
  const { slug } = await params;
  if (!knowledge.some((item) => item.slug === slug)) notFound();
  return <MethodEntry slug={slug} />;
}
