import { Figtree, Fraunces, Nunito, Outfit } from 'next/font/google';
import { folioHomeCopy } from '../../../../content/folio';

// 白盒子美术馆官网的字体：界面与标题用圆润的无衬线，默认 Figtree，右下角的 Aa 可以切到 Nunito、Outfit；
// 作品名、编号、图注用 Fraunces 的柔边斜体（SOFT 轴拉满），中文是系统黑体。
const figtree = Figtree({
  subsets: ['latin'],
  variable: '--font-g-figtree',
  display: 'swap',
});

const nunito = Nunito({
  subsets: ['latin'],
  variable: '--font-g-nunito',
  display: 'swap',
  preload: false,
});

const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-g-outfit',
  display: 'swap',
  preload: false,
});

const fraunces = Fraunces({
  subsets: ['latin'],
  style: ['normal', 'italic'],
  axes: ['SOFT', 'WONK', 'opsz'],
  variable: '--font-g-serif',
  display: 'swap',
  preload: false,
});

export const metadata = {
  title: { absolute: 'Molis AI · AI 产品工作室' },
  description: folioHomeCopy.description,
  robots: { index: false, follow: false },
};

export default function GalleryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      className={`${figtree.variable} ${nunito.variable} ${outfit.variable} ${fraunces.variable}`}
    >
      {children}
    </div>
  );
}
