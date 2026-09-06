import type { Metadata } from 'next';
import { Geist } from 'next/font/google';
import './globals.css';
const geist = Geist({ variable: '--font-geist', subsets: ['latin'] });
export const metadata: Metadata = {
  title: {
    default: '烤个梨呀 · 有些东西，值得做出来',
    template: '%s · 烤个梨呀',
  },
  icons: { icon: '/favicon.svg' },
  description:
    '认识做东西的人，体验正在长大的作品。由 Adeptify 发起的创造者社区，让有生命力的作品找到最早相信它的人。',
  robots: { index: false, follow: false },
};
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN">
      <body className={geist.variable}>
        <a className="skip-link" href="#main">
          跳到主要内容
        </a>
        {children}
      </body>
    </html>
  );
}
