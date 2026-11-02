import { pageMetadata } from '../../../lib/site';
import { products } from '../../../content/site/products';
import { workHero } from '../../../content/site/work';
import { productHref } from '../../_site/routes';
import { Flow } from './flow';
import { Stack } from './stack';
import './work.css';

const work = products.work;

export const metadata = pageMetadata(
  `${work.name} · ${workHero.title}`,
  workHero.what,
  productHref.work,
);

// Molis Work（2026-10-24 重做；2026-11-02 第三轮，提案见「Molis Work 页第三轮提案」）。
// 一扇窗从头到尾不离场，四屏按读者的问题排：是什么 → 怎么用（镜头在窗里走三拍）→ 为什么不用我现在的（换个 AI，不用从头讲）→ 怎么开始（一封信）。
// 大屏是 flow.tsx（舞台钉住、镜头推拉）；窄屏、矮屏、没有 JS 是 stack.tsx（同样几拍上下排）。两套都在服务端出好，CSS 只显示一套。
// 窗里的画面在 desk.tsx，照 Molis Work 桌面端的浅色 Soft Workbench 画；名字、时间、数字都是示意。

export default function WorkPage() {
  return (
    <div className="wk">
      <Flow />
      <Stack />
    </div>
  );
}
