import { hero } from '../../../../../content/molis-life';

export const metadata = {
  title: { absolute: 'Molis Life · 把琐事交代出去，把时间留给喜欢的生活' },
  description: hero.lead,
};

export default function CosmosLifeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
