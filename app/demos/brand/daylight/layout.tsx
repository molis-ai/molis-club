import { Noto_Serif_SC } from 'next/font/google';
import { positioning, vision } from '../../../../content/studio';

const serif = Noto_Serif_SC({
  weight: ['300', '500'],
  subsets: ['latin'],
  variable: '--font-dl-serif',
  display: 'swap',
  preload: false,
});

export const metadata = {
  title: { absolute: `Molis AI · ${vision.replace(/。$/, '')}` },
  description: positioning,
};

export default function DaylightLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className={serif.variable}>{children}</div>;
}
