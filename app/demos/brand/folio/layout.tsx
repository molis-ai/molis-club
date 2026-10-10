import { Noto_Serif_SC } from 'next/font/google';
import { folioHomeCopy } from '../../../../content/folio';

const serif = Noto_Serif_SC({
  weight: ['500', '900'],
  subsets: ['latin'],
  variable: '--font-fo-serif',
  display: 'swap',
  preload: false,
});

export const metadata = {
  title: { absolute: 'Molis AI · AI 产品工作室' },
  description: folioHomeCopy.description,
};

export default function FolioLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className={serif.variable}>{children}</div>;
}
