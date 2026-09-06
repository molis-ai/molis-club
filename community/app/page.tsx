import Community from './community';
import { StructuredData } from './structured-data';
import {
  pageMetadata,
  siteUrl,
  studioDescription,
  studioIdentity,
} from '../lib/site';
export const metadata = pageMetadata(
  'AI 创作工作室 · 产品与解决方案',
  studioDescription,
  '/',
);
export default function Home() {
  return (
    <>
      <StructuredData
        json={JSON.stringify({
          '@context': 'https://schema.org',
          '@graph': [
            studioIdentity,
            {
              '@type': 'WebSite',
              '@id': `${siteUrl}/#website`,
              name: 'Molis AI',
              url: siteUrl,
              inLanguage: 'zh-CN',
              publisher: { '@id': `${siteUrl}/#studio` },
            },
          ],
        })}
      />
      <Community />
    </>
  );
}
