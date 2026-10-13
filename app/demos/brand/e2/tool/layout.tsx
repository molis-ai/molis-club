import { hero } from '../../../../../content/molis-tool';

export const metadata = {
  title: { absolute: 'Molis Tool · 光标在哪里，软件就在哪里' },
  description: hero.lead,
};

export default function E2ToolLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
