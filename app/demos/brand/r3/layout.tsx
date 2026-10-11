import { Bricolage_Grotesque, Noto_Serif_SC } from 'next/font/google';
import { folioHomeCopy } from '../../../../content/folio';

// 第三轮三个方向共用的字体：A 的中文衬线，E 的西文展示字。Newsreader 与 Geist 来自根布局。
const serif = Noto_Serif_SC({
  weight: ['400', '600'],
  subsets: ['latin'],
  variable: '--font-r3-serif',
  display: 'swap',
  preload: false,
});

const display = Bricolage_Grotesque({
  weight: ['400', '600', '800'],
  subsets: ['latin'],
  variable: '--font-r3-display',
  display: 'swap',
  preload: false,
});

export const metadata = {
  title: { absolute: 'Molis AI · AI 产品工作室' },
  description: folioHomeCopy.description,
  robots: { index: false, follow: false },
};

export default function R3Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className={`${serif.variable} ${display.variable}`}>{children}</div>
  );
}
