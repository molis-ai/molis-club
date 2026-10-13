import { Geist_Mono, Instrument_Serif, Noto_Serif_SC } from 'next/font/google';
import { folioHomeCopy } from '../../../../../content/folio';

// 零点的字体：中文大字用细的宋体，英文用 Instrument Serif，编号与注记用等宽。正文是根布局的 Geist。
const serif = Noto_Serif_SC({
  weight: ['300', '500'],
  subsets: ['latin'],
  variable: '--font-og-serif',
  display: 'swap',
  preload: false,
});

const latin = Instrument_Serif({
  weight: '400',
  style: ['normal', 'italic'],
  subsets: ['latin'],
  variable: '--font-og-latin',
  display: 'swap',
});

const mono = Geist_Mono({
  weight: ['400', '500'],
  subsets: ['latin'],
  variable: '--font-og-mono',
  display: 'swap',
});

export const metadata = {
  title: { absolute: 'Molis AI · AI 产品工作室' },
  description: folioHomeCopy.description,
  robots: { index: false, follow: false },
};

export default function OriginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={`${serif.variable} ${latin.variable} ${mono.variable}`}>
      {children}
    </div>
  );
}
