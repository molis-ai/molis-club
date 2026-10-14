import { Figtree, Fraunces, Nunito, Outfit } from 'next/font/google';
import { folioHomeCopy } from '../../../../content/folio';

// 白盒子美术馆 · 精修版的字体：界面与标题换成更圆润的无衬线，默认 Figtree，页面右下角可以切到 Nunito、Outfit 对比；
// 作品名、编号用 Fraunces 的柔边斜体（SOFT 轴拉满），中文仍用系统黑体。
const figtree = Figtree({
  subsets: ['latin'],
  variable: '--font-r7-figtree',
  display: 'swap',
  preload: false,
});

const nunito = Nunito({
  subsets: ['latin'],
  variable: '--font-r7-nunito',
  display: 'swap',
  preload: false,
});

const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-r7-outfit',
  display: 'swap',
  preload: false,
});

const fraunces = Fraunces({
  subsets: ['latin'],
  style: ['normal', 'italic'],
  axes: ['SOFT', 'WONK', 'opsz'],
  variable: '--font-r7-serif',
  display: 'swap',
  preload: false,
});

export const metadata = {
  title: { absolute: 'Molis AI · AI 产品工作室' },
  description: folioHomeCopy.description,
  robots: { index: false, follow: false },
};

export default function R7Layout({ children }: { children: React.ReactNode }) {
  return (
    <div
      className={`${figtree.variable} ${nunito.variable} ${outfit.variable} ${fraunces.variable}`}
    >
      {children}
    </div>
  );
}
