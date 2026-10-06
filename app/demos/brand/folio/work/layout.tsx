import { hero } from '../../../../../content/molis-work';

export const metadata = {
  title: { absolute: 'Molis Work · 本地优先的 AI 工作台' },
  description: hero.lead,
};

export default function FolioWorkLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
