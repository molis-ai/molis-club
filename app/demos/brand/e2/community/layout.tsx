// E2 社区：元数据与 Folio 社区一致；字体沿用 E2 根布局（Geist、系统中文字体、IBM Plex Mono），不再加衬线体。
export const metadata = {
  title: { absolute: 'Molis AI 社区 · 好奇心，值得做出来' },
  description:
    '试试有意思的作品，看看它们怎么做出来。带走一个方法，也留下你的新想法。',
};

export default function E2CommunityLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
