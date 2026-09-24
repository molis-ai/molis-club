import { Noto_Sans_SC } from 'next/font/google';

const sans = Noto_Sans_SC({
  weight: ['400', '500'],
  subsets: ['latin'],
  variable: '--font-cs-sans',
  display: 'swap',
  preload: false,
});

export const metadata = {
  title: { absolute: 'Molis AI · 始终好奇，持续创造' },
  description:
    'Molis AI 是一间产品工作室。每一件作品，都从一个好奇开始。',
};

export default function CosmosLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className={sans.variable}>{children}</div>;
}
