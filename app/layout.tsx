import type { Metadata } from 'next';
import { Geist, Newsreader } from 'next/font/google';
import './globals.css';
import { siteUrl, publiclyIndexable } from '../lib/site';
const newsreader = Newsreader({
  variable: '--font-editorial',
  subsets: ['latin'],
  style: ['normal', 'italic'],
});
const geist = Geist({ variable: '--font-geist', subsets: ['latin'] });
export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'Molis AI · A human touch',
    template: '%s · Molis AI',
  },
  icons: { icon: '/images/molis-logo-cool.png' },
  description:
    'Molis AI，一个保持好奇的 AI 创作工作室。从真实的感受出发，用设计与代码，把有意思的想法做成作品。',
  robots: { index: publiclyIndexable, follow: publiclyIndexable },
};
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN">
      <body className={`${geist.variable} ${newsreader.variable}`}>
        <a className="skip-link" href="#main">
          跳到主要内容
        </a>
        {children}
      </body>
    </html>
  );
}
