import { folioCooperation } from '../../../../../content/folio-cooperation';

export const metadata = {
  title: { absolute: 'Molis AI 企业合作 · 把 AI 用进业务，把能力留在团队' },
  description: folioCooperation.lead,
  robots: { index: false, follow: false },
};

export default function GallerySolutionsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
