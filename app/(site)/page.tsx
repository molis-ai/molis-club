import { pageMetadata } from '../../lib/site';
import { studio } from '../../content/site/studio';
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

// 首页四屏（第八轮的画面与结构，负责人 2026-10-15 重新配过）：
// 首屏（天空，Molis AI）→ What we make（海边，We build {Warm}ware）→ 产品（纸页升起，左列表右舞台）
// → 结尾（画室，过渡句与企业合作 / 社区 / 关于我们三张卡片）→ 页尾。
export default function Home() {
  return (
    <div className="m-home">
      <HomeTop />
      <Products />
      <Closing />
    </div>
  );
}
