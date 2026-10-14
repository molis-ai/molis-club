import { folioWorld } from '../../../../../content/folio-world';

export const metadata = {
  title: { absolute: 'Molis World · 现实和故事，都住进你慢慢长大的世界' },
  description: folioWorld.description,
  robots: { index: false, follow: false },
};

export default function GalleryWorldLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
