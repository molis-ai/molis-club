import type { Metadata } from 'next';
export const siteUrl = 'https://molis-club.yijunw0212.chatgpt.site';
// Change only as part of an explicitly authorized public launch, with Sites access updated too.
export const publiclyIndexable = false;
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
