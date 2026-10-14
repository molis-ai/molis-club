import { folioTeam } from '../../../../../content/folio-team';

export const metadata = {
  title: { absolute: '团队 · Molis AI' },
  description: folioTeam.intro,
  robots: { index: false, follow: false },
};

export default function GalleryAboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
