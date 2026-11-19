import type { ReactNode } from 'react';
import { Footer, Header } from '../_site/chrome';
import { Console } from '../_site/console';
import '../_site/site.css';

declare const __MOLIS_ENVIRONMENT__: "dev" | "test" | "prod" | null;

// 新站的外壳：顶栏、正文、页尾。顶栏和页尾在换页时不动，正文在 template.tsx 里交叉淡入。
export default function SiteLayout({ children }: { children: ReactNode }) {
  return (
    <div className="m">
      <Header />
      {__MOLIS_ENVIRONMENT__ === 'dev' && <output className="m-env-status">DEV · 本地数据</output>}
      {__MOLIS_ENVIRONMENT__ === 'test' && <output className="m-env-status">TEST · 远程测试数据</output>}
      <main id="main" tabIndex={-1}>
        {children}
      </main>
      <Footer />
      <Console />
    </div>
  );
}
