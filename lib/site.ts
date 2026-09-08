import type { Metadata } from 'next';
export const siteUrl = 'https://molis-club.yijunw0212.chatgpt.site';
// Change only as part of an explicitly authorized public launch, with Sites access updated too.
export const publiclyIndexable = false;
export const communityDescription =
  'molis-club 是 Adeptify 团队的 AI 创作者社区，探索情绪体验、Mac 轻量工具与 AI 工程效率，并验证内容增长、软件 Agent 化和数据分析方案。';
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
      siteName: 'molis-club',
      locale: 'zh_CN',
      title: `${title} · molis-club`,
      description,
      url,
      images: [
        { url: `${siteUrl}/images/molis-logo.png`, alt: 'molis-club 标志' },
      ],
    },
    twitter: {
      card: 'summary',
      title: `${title} · molis-club`,
      description,
      images: [`${siteUrl}/images/molis-logo.png`],
    },
  };
}
export const communityIdentity = {
  '@type': 'Organization',
  '@id': `${siteUrl}/#studio`,
  name: 'molis-club',
  url: siteUrl,
  description: communityDescription,
  logo: `${siteUrl}/images/molis-logo.png`,
  sameAs: ['https://github.com/adeptify'],
};
