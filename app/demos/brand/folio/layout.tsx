import { Noto_Serif_SC } from 'next/font/google';

const serif = Noto_Serif_SC({
  weight: ['500', '900'],
  subsets: ['latin'],
  variable: '--font-fo-serif',
  display: 'swap',
  preload: false,
});

export const metadata = {
  title: { absolute: 'Molis AI · 始终好奇，持续创造' },
  description:
    'Molis AI 是一间产品工作室。我们和 AI 一起，把好奇心做成真正帮到人的作品。',
};

export default function FolioLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className={serif.variable}>{children}</div>;
}
