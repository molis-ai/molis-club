import { notFound } from 'next/navigation';

// 美术馆官网下没有的地址都交给它自己的 not-found，免得落到旧站的 404
export default function GalleryMissing() {
  notFound();
}
