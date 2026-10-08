import { Noto_Serif_SC } from 'next/font/google';

const serif = Noto_Serif_SC({
  weight: ['500', '900'],
  subsets: ['latin'],
  variable: '--font-fo-serif',
  display: 'swap',
  preload: false,
});

export const metadata = {
  title: { absolute: 'Molis AI 社区 · 好奇心，值得做出来' },
  description:
    '试试有意思的作品，看看它们怎么做出来。带走一个方法，也留下你的新想法。',
};
export default function CommunityLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className={serif.variable}>{children}</div>;
}
