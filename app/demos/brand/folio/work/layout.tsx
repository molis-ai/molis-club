import { short } from '../../../../../content/molis-work';

export const metadata = {
  title: { absolute: 'Molis Work · 换一个 AI，工作也接得上' },
  description: short.hero.lead,
};

export default function FolioWorkLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
