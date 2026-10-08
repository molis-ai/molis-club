import { folioSolutions } from '../../../../../content/folio';

export const metadata = {
  title: { absolute: 'Molis AI 解决方案 · 把 AI 用进具体业务' },
  description: folioSolutions.lead,
};

export default function SolutionsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
