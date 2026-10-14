import { folioStudio } from '../../../../../content/folio';

// 文章目录的标题与描述，与 Folio 的文章页一致；两篇文章页各自用 essayMetadata 覆盖。
export const metadata = {
  title: { absolute: '文章 · Molis AI' },
  description: folioStudio.essays.items
    .map((item) => item.description)
    .join(' '),
  robots: { index: false, follow: false },
};

export default function GalleryEssaysLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
