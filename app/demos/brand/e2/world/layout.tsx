import { folioWorld } from '../../../../../content/folio-world';

export const metadata = {
  title: { absolute: 'Molis World · 现实和故事，都住进你慢慢长大的世界' },
  description: folioWorld.description,
};

export default function E2WorldLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
