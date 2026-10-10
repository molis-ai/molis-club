import { team } from '../../../../../content/studio';

export const metadata = {
  title: { absolute: '关于我们 · Molis AI' },
  description: team.text,
};

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
