import { contact } from '../../../../../content/studio';

export const metadata = {
  title: { absolute: 'Molis AI · 联系我们' },
  description: contact.lede,
};

export default function EditionCContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
