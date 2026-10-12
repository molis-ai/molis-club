import { Cormorant_Garamond, Noto_Serif_SC } from 'next/font/google';
import { folioHomeCopy } from '../../../../../content/folio';

// 第五轮「夜间展馆」的字体：展名与标题用 Cormorant Garamond，中文用细一点的思源宋体。
const display = Cormorant_Garamond({
  weight: ['300', '400', '500'],
  style: ['normal', 'italic'],
  subsets: ['latin'],
  variable: '--font-r5-display',
  display: 'swap',
  preload: false,
});
const songti = Noto_Serif_SC({
  weight: ['300', '500'],
  subsets: ['latin'],
  variable: '--font-r5-cjk',
  display: 'swap',
  preload: false,
});

export const metadata = {
  title: { absolute: 'Molis AI · AI 产品工作室' },
  description: folioHomeCopy.description,
  robots: { index: false, follow: false },
};

export default function R5Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className={`${display.variable} ${songti.variable}`}>{children}</div>
  );
}
