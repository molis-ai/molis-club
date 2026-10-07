import { IBM_Plex_Mono, Noto_Sans_SC } from 'next/font/google';
import { positioning, vision } from '../../../../content/studio';

const sans = Noto_Sans_SC({
  weight: ['300', '400', '500'],
  subsets: ['latin'],
  variable: '--font-cs-sans',
  display: 'swap',
  preload: false,
});

const mono = IBM_Plex_Mono({
  weight: ['400'],
  subsets: ['latin'],
  variable: '--font-cs-mono',
  display: 'swap',
  preload: false,
});

export const metadata = {
  title: { absolute: `Molis AI · ${vision.replace(/。$/, '')}` },
  description: positioning,
};

export default function CosmosLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className={`${sans.variable} ${mono.variable}`}>{children}</div>;
}
