import {
  IBM_Plex_Mono,
  Instrument_Serif,
  Jost,
  Noto_Serif_SC,
  Unbounded,
} from 'next/font/google';
import { folioHomeCopy } from '../../../../../content/folio';

// 第四轮三个方向各自的字体：A 的展示衬线，D 的几何细体，E 的宽体与等宽。Geist、Newsreader 来自根布局。
const instrument = Instrument_Serif({
  weight: '400',
  style: ['normal', 'italic'],
  subsets: ['latin'],
  variable: '--font-r4-instrument',
  display: 'swap',
  preload: false,
});
const songti = Noto_Serif_SC({
  weight: ['400', '600'],
  subsets: ['latin'],
  variable: '--font-r4-cjk-serif',
  display: 'swap',
  preload: false,
});
const jost = Jost({
  weight: ['300', '400', '500'],
  subsets: ['latin'],
  variable: '--font-r4-jost',
  display: 'swap',
  preload: false,
});
const unbounded = Unbounded({
  weight: ['500', '800'],
  subsets: ['latin'],
  variable: '--font-r4-wide',
  display: 'swap',
  preload: false,
});
const plex = IBM_Plex_Mono({
  weight: ['400', '500'],
  subsets: ['latin'],
  variable: '--font-r4-mono',
  display: 'swap',
  preload: false,
});

export const metadata = {
  title: { absolute: 'Molis AI · AI 产品工作室' },
  description: folioHomeCopy.description,
  robots: { index: false, follow: false },
};

export default function R4Layout({ children }: { children: React.ReactNode }) {
  return (
    <div
      className={`${instrument.variable} ${songti.variable} ${jost.variable} ${unbounded.variable} ${plex.variable}`}
    >
      {children}
    </div>
  );
}
