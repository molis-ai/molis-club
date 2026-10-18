import type { Metadata } from 'next';
import { ALONG, CONTACT, HOME } from './_site/routes';
import { Btn, More } from './_site/ui';
import './_site/site.css';

export const metadata: Metadata = {
  title: '这一页还在沿途上',
  robots: { index: false, follow: false },
};

// 404：纯文字，一句干幽默，再给几条回去的路。找不到的地址落在站点外壳里（顶栏、页尾由 app/(site)/layout.tsx 给）。
export default function NotFound() {
  return (
    <div className="m-404 m-wrap m-top">
      <p className="m-kicker" lang="en">
        404
      </p>
      <h1>这一页还在沿途上。</h1>
      <p className="m-404-lead">
        可能是地址拼错了，也可能它还没被做出来。我们一般先做能用的，再做好看的，这一页两样都还没轮到。
      </p>
      <p className="m-actions">
        <Btn href={HOME}>回到首页</Btn>
        <More href={ALONG}>沿途</More>
        <More href={CONTACT}>联系我们</More>
      </p>
    </div>
  );
}
