import { folioCooperation } from '../../../../../content/folio-cooperation';

export const metadata = {
  title: { absolute: 'Molis AI 企业合作 · 把 AI 用进业务，把能力留在团队' },
  description: folioCooperation.lead,
};

export default function SolutionsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
