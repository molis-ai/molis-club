import type { Metadata } from 'next';
import { Geist, Bricolage_Grotesque } from 'next/font/google';
import './globals.css';
import { siteUrl, publiclyIndexable } from '../lib/site';
const studioType = Bricolage_Grotesque({
  variable: '--font-studio',
  subsets: ['latin'],
});
const geist = Geist({ variable: '--font-geist', subsets: ['latin'] });
export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'Molis AI · A human touch',
    template: '%s · Molis AI',
  },
  icons: { icon: '/images/molis-logo.png' },
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
      <body className={`${geist.variable} ${studioType.variable}`}>
        <template
          dangerouslySetInnerHTML={{
            __html:
              '<!-- THESIS: A shared studio table for useful and curious AI work; original logo remains unchanged. OWN-WORLD: near-white, charcoal, user-provided hand-drawn maker scene recolored in moss green; open typography. STORY: identify the studio, browse by purpose, inspect real status. FIRST VIEWPORT: Bricolage headline upper left, clear intro and actions upper right, complete maker illustration below. FORM: user-pinned illustrated studio overrides candidate 3, seed 569a6424; single scene reveal with reduced-motion fallback. FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance -->',
          }}
        />
        <a className="skip-link" href="#main">
          跳到主要内容
        </a>
        {children}
      </body>
    </html>
  );
}
