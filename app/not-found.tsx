import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { ALONG, CONTACT, HOME } from './_site/routes';
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
          <Link className="m-btn" href={HOME}>
            回到首页
          </Link>
          <Link className="m-link" href={ALONG} data-dir="right">
            去「沿途」看看做过什么
            <ArrowRight size={13} aria-hidden="true" />
          </Link>
          <Link className="m-link" href={CONTACT} data-dir="right">
            告诉我们你在找什么
            <ArrowRight size={13} aria-hidden="true" />
          </Link>
        </p>
    </div>
  );
}
