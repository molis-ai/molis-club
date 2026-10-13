import { folioTeam } from '../../../../../content/folio-team';

export const metadata = {
  title: { absolute: '团队 · Molis AI' },
  description: folioTeam.intro,
};

export default function E2AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
