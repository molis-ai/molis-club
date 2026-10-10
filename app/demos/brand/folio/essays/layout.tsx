import { folioStudio } from '../../../../../content/folio';

export const metadata = {
  title: { absolute: '文章 · Molis AI' },
  description: folioStudio.essays.items
    .map((item) => item.description)
    .join(' '),
};

export default function EssaysLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
