import type { Metadata } from 'next';
export const siteUrl = 'https://molis-ai.yijunw0212.chatgpt.site';
// Change only as part of an explicitly authorized public launch, with Sites access updated too.
export const publiclyIndexable = false;
export const studioDescription =
  'Molis AI 是 Adeptify 团队的 AI 创作工作室，探索情绪体验、Mac 轻量工具与 AI 工程效率，并验证内容增长、软件 Agent 化和数据分析方案。';
export function pageMetadata(
  title: string,
  description: string,
  path: string,
): Metadata {
  const url = `${siteUrl}${path}`;
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      type: 'website',
      siteName: 'Molis AI',
      locale: 'zh_CN',
      title: `${title} · Molis AI`,
      description,
      url,
      images: [
        { url: `${siteUrl}/images/molis-logo.png`, alt: 'Molis AI 标志' },
      ],
    },
    twitter: {
      card: 'summary',
      title: `${title} · Molis AI`,
      description,
      images: [`${siteUrl}/images/molis-logo.png`],
    },
  };
}
export const studioIdentity = {
  '@type': 'Organization',
  '@id': `${siteUrl}/#studio`,
  name: 'Molis AI',
  url: siteUrl,
  description: studioDescription,
  logo: `${siteUrl}/images/molis-logo.png`,
  sameAs: ['https://github.com/adeptify'],
};
