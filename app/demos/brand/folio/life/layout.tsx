import { folioLife } from '../../../../../content/folio-life';

export const metadata = {
  title: { absolute: folioLife.meta.title },
  description: folioLife.meta.description,
};

export default function FolioLifeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
