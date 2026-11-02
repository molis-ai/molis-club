import { pageMetadata } from '../../../lib/site';
import { products } from '../../../content/site/products';
import { productHref } from '../../_site/routes';
import { Flow } from './flow';
import { SelectionBar } from './selection';
import { Stack } from './stack';
import './tool.css';

const tool = products.tool;

export const metadata = pageMetadata(
  `${tool.name} · ${tool.headline}`,
  tool.what + tool.opening[2],
  productHref.tool,
);

// Molis Tool（2026-11-02 改成 Work 页第三轮的形态）。
// 一块 Mac 屏幕从头到尾不离场，屏幕上过完周五一天；四屏按读者的问题排：是什么（首屏翻译一句）→ 怎么用（镜头在屏幕里走四拍：
// 清理一句、从 PDF 取几页、整理成日程收进「接续」、回来接着做）→ 为什么不用我现在的（以前那四步，现在从内容开始：表格、排序、插件）→ 怎么开始（一封信）。
// 大屏是 flow.tsx（舞台钉住、镜头推拉）；窄屏、矮屏、没有 JS 是 stack.tsx（同样几拍上下排）。两套都在服务端出好，CSS 只显示一套。
// 屏幕里的画面在 screen.tsx，照 Molis Tool 桌面端的真实界面画；名字、时间、数字都是示意。
// 这一页本身就是 Tool：任意选中一段字，光标旁出现动作条（selection.tsx）；第三屏的插件开关访客可以亲手拨（plug.tsx）。

export default function ToolPage() {
  return (
    <SelectionBar>
      <div className="tl">
        <Flow />
        <Stack />
      </div>
    </SelectionBar>
  );
}
