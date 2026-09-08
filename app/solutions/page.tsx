import Catalog from '../catalog';
import { CatalogSchema } from '../catalog-schema';
import { works } from '../../content/works';
import { pageMetadata } from '../../lib/site';
export const metadata = pageMetadata(
  'AI 解决方案 · 内容增长、软件 Agent 化与数据洞察',
  '了解 Content Growth、Evrik 与 Aether 面向的业务场景、当前验证进度和能力边界，与 molis-club 讨论你的具体工作流。',
  '/solutions',
);
export default function Page() {
  return (
    <>
      <CatalogSchema
        slugs={works
          .filter((w) => w.category === 'Solutions')
          .map((w) => w.slug)}
        path="/solutions"
        name="molis-club 解决方案"
      />
      <Catalog solutions />
    </>
  );
}
