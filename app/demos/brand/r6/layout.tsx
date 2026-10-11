import { Instrument_Sans } from 'next/font/google';
import { folioHomeCopy } from '../../../../content/folio';

// 白盒子美术馆的字体：界面与标题用 Instrument Sans，作品名照惯例用斜体衬线（根布局的 Newsreader）。
const sans = Instrument_Sans({
  weight: ['400', '500', '600'],
  subsets: ['latin'],
  variable: '--font-r6-sans',
  display: 'swap',
  preload: false,
});

export const metadata = {
  title: { absolute: 'Molis AI · AI 产品工作室' },
  description: folioHomeCopy.description,
  robots: { index: false, follow: false },
};

export default function R6Layout({ children }: { children: React.ReactNode }) {
  return <div className={sans.variable}>{children}</div>;
}
