import { notFound } from 'next/navigation';

// Folio 下没有的地址都交给 Folio 自己的 not-found，免得落到旧站的 404、再被带回旧首页
export default function FolioMissing() {
  notFound();
}
