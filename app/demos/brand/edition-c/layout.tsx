import { Noto_Serif_SC } from 'next/font/google';
import { positioning, vision } from '../../../../content/studio';

// 中文大标题用细的宋体，其余仍是 Geist 与系统黑体
const serif = Noto_Serif_SC({
  weight: ['300', '500'],
  subsets: ['latin'],
  variable: '--font-ec-serif',
  display: 'swap',
  preload: false,
});

export const metadata = {
  title: { absolute: `Molis AI · ${vision.replace(/。$/, '')}` },
  description: positioning,
};

export default function EditionCLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className={serif.variable}>{children}</div>;
}
