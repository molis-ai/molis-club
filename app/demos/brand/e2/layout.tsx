import { Chiron_GoRound_TC, DM_Mono, Nunito } from 'next/font/google';
import { folioHomeCopy } from '../../../../content/folio';

// E2 整站的字体都偏圆润：拉丁字母用 Nunito（圆头），中文用 Chiron GoRound TC（圆体黑，200–900 字重，
// 已核对全站文案 1364 个汉字都在字库里），编号、标签与注记用 DM Mono。
const latin = Nunito({
  subsets: ['latin'],
  variable: '--font-e2-latin',
  display: 'swap',
  preload: false,
});
const cjk = Chiron_GoRound_TC({
  weight: ['400', '500', '600', '700'],
  subsets: ['latin'],
  variable: '--font-e2-cjk',
  display: 'swap',
  preload: false,
});
const mono = DM_Mono({
  weight: ['400', '500'],
  subsets: ['latin'],
  variable: '--font-e2-mono',
  display: 'swap',
  preload: false,
});

export const metadata = {
  title: { absolute: 'Molis AI · AI 产品工作室' },
  description: folioHomeCopy.description,
  robots: { index: false, follow: false },
};

export default function E2Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className={`${latin.variable} ${cjk.variable} ${mono.variable}`}>
      {children}
    </div>
  );
}
