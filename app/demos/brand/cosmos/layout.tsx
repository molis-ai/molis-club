import { IBM_Plex_Mono, Noto_Sans_SC } from 'next/font/google';

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
  title: { absolute: 'Molis AI · 始终好奇，持续创造' },
  description:
    'Molis AI 是一间产品工作室。我们和 AI 一起，把好奇心做成真正帮到人的作品。',
};

export default function CosmosLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className={`${sans.variable} ${mono.variable}`}>{children}</div>;
}
