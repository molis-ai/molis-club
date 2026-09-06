import Catalog from '../catalog';
import { CatalogSchema } from '../catalog-schema';
import { pageMetadata } from '../../lib/site';
import { productLines } from '../../content/lines';
export const metadata = pageMetadata(
  'AI 产品 · 情绪体验、Mac 工具与工程效率',
  '浏览 Molis AI 的游戏与情绪体验、Mac 日常工具和 AI 开发工具。每个产品标明当前阶段，公开仓库和安装包均提供真实入口。',
  '/products',
);
export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ line?: string }>;
}) {
  const { line } = await searchParams;
  const selected = productLines.find((l) => l.id === line);
  const slugs = selected
    ? selected.projects
    : productLines.flatMap((l) => [...l.projects]);
  return (
    <>
      <CatalogSchema
        slugs={slugs}
        path={selected ? `/products?line=${selected.id}` : '/products'}
        name={selected ? selected.name : 'Molis AI 产品'}
      />
      <Catalog line={selected?.id ?? 'all'} />
    </>
  );
}
