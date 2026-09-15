import Community from './community';
import { StructuredData } from './structured-data';
import { pageMetadata, siteUrl, communityIdentity } from '../lib/site';
export const metadata = pageMetadata(
  'AI 创作工作室 · 让好奇成为作品',
  'Molis AI 是一间与 AI 一起创作的工作室。我们做轻巧的工具、可玩的体验，也分享创作方法、知识与艺术家 Skill。',
  '/',
);
export default function Home() {
  return (
    <>
      <StructuredData
        json={JSON.stringify({
          '@context': 'https://schema.org',
          '@graph': [
            {
              ...communityIdentity,
              description:
                'Molis AI 是一间与 AI 一起创作的工作室，做轻巧的工具、可玩的体验，也分享做它们的方法。',
            },
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
