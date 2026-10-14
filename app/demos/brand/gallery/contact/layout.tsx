import { contact } from '../../../../../content/studio';

export const metadata = {
  title: { absolute: 'Molis AI · 联系我们' },
  description: contact.lede,
  robots: { index: false, follow: false },
};

export default function GalleryContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
