import { notFound } from 'next/navigation';

// E2 下没有的地址都交给 E2 自己的 not-found，免得落到别的版本的 404
export default function E2Missing() {
  notFound();
}
