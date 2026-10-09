import { hero } from '../../../../../content/folio-work';

export const metadata = {
  title: { absolute: 'Molis Work · 让工作，在人、工具与 Agent 之间继续' },
  description: hero.lead,
};

export default function FolioWorkLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
