import { folioWork } from '../../../../../content/folio';

export const metadata = {
  title: { absolute: 'Molis Work · 让工作，在人、工具与 Agent 之间继续' },
  description: folioWork.lead,
};

export default function FolioWorkLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
