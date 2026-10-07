import { hero } from '../../../../../content/molis-story';

export const metadata = {
  title: { absolute: 'Molis Story · 走进另一个世界，然后回来' },
  description: hero.lead,
};

export default function CosmosStoryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
