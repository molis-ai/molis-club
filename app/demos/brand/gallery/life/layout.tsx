import { folioLife } from '../../../../../content/folio-life';

export const metadata = {
  title: { absolute: folioLife.meta.title },
  description: folioLife.meta.description,
  robots: { index: false, follow: false },
};

export default function GalleryLifeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
