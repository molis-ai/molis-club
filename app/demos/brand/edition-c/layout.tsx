import { positioning, vision } from '../../../../content/studio';

export const metadata = {
  title: { absolute: `Molis AI · ${vision.replace(/。$/, '')}` },
  description: positioning,
};

export default function EditionCLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
