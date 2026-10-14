import { pageMetadata } from '../../lib/site';
import { studio } from '../../content/site/studio';
import { Beliefs } from '../_site/home/beliefs';
import { Closing } from '../_site/home/closing';
import { Products } from '../_site/home/products';
import { HomeTop } from '../_site/home/top';
import '../_site/home/r8.css';
import '../_site/home/home.css';

export const metadata = pageMetadata(
  '技术，回到人的尺度',
  studio.short.join(''),
  '/',
);

// 首页：首屏（海边）→ Warmware → 产品（纸页升起，左列表右舞台）→ 我们相信 → 结尾 → 页尾。
export default function Home() {
  return (
    <div className="m-home">
      <HomeTop />
      <Products />
      <Beliefs />
      <Closing />
    </div>
  );
}
