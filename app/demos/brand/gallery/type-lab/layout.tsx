import {
  Bricolage_Grotesque,
  Instrument_Serif,
  Jost,
  LXGW_WenKai_TC,
  Noto_Serif_SC,
} from 'next/font/google';

// 字体方向对比页另外要的字体；Figtree、Fraunces 来自白盒子美术馆的布局。
// 思源宋体、Instrument Serif 与第四轮同一组参数，构建时共用已经下载的字体文件。
const instrument = Instrument_Serif({
  weight: '400',
  style: ['normal', 'italic'],
  subsets: ['latin'],
  variable: '--font-tl-instrument',
  display: 'swap',
  preload: false,
});

const song = Noto_Serif_SC({
  weight: ['300', '500'],
  subsets: ['latin'],
  variable: '--font-tl-song',
  display: 'swap',
  preload: false,
});

const kai = LXGW_WenKai_TC({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-tl-kai',
  display: 'swap',
  preload: false,
});

const jost = Jost({
  weight: ['300', '400', '500'],
  style: ['normal', 'italic'],
  subsets: ['latin'],
  variable: '--font-tl-jost',
  display: 'swap',
  preload: false,
});

const bricolage = Bricolage_Grotesque({
  subsets: ['latin'],
  axes: ['opsz', 'wdth'],
  variable: '--font-tl-bricolage',
  display: 'swap',
  preload: false,
});

export const metadata = {
  title: { absolute: '字体方向 · 方案对比 · Molis AI' },
  robots: { index: false, follow: false },
};

export default function TypeLabLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      className={`${instrument.variable} ${song.variable} ${kai.variable} ${jost.variable} ${bricolage.variable}`}
    >
      {children}
    </div>
  );
}
