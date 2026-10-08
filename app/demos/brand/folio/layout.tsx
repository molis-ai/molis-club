import { Noto_Serif_SC } from 'next/font/google';
import { folioStudio } from '../../../../content/folio';

const serif = Noto_Serif_SC({
  weight: ['500', '900'],
  subsets: ['latin'],
  variable: '--font-fo-serif',
  display: 'swap',
  preload: false,
});

export const metadata = {
  title: { absolute: 'Molis AI · AI 工作台、桌面工具与互动世界' },
  description: folioStudio.lead,
};

export default function FolioLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className={serif.variable}>{children}</div>;
}
