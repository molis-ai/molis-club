import { IBM_Plex_Mono, Unbounded, ZCOOL_QingKe_HuangYou } from 'next/font/google';

const display = ZCOOL_QingKe_HuangYou({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-pf-display',
  display: 'swap',
  preload: false,
});
const wide = Unbounded({
  weight: ['500', '700'],
  subsets: ['latin'],
  variable: '--font-pf-wide',
  display: 'swap',
});
const mono = IBM_Plex_Mono({
  weight: ['400', '500'],
  subsets: ['latin'],
  variable: '--font-pf-mono',
  display: 'swap',
});

export const metadata = {
  title: { absolute: 'Molis AI · 始终好奇，持续创造' },
  description:
    '我们是 Molis AI，一群认真做产品、也认真玩的人。始终好奇，持续创造。',
};

export default function PlayfulLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={`${display.variable} ${wide.variable} ${mono.variable}`}>
      {children}
    </div>
  );
}
