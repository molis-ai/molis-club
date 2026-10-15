import { Suspense, type ReactNode } from 'react';
import { FolioHeader, FolioMargins } from './chrome';
import { FolioFooter } from './footer';
import { getPulse } from './pulse';
import './folio.css';

// 第十轮视觉稿「作品集」（folio）：最贴近 Norm Architects 的一版，网站像一家设计事务所的作品集。
// 奶油色底纸、页边竖排小字、雾一样调色的照片满屏；照片屏和文字屏严格交替；五件产品是作品集里的五个项目。
// 细节层是参考板的种子 B「活着的状态」：页边和 Work 页写着 Molis Work 公开仓库这周真实的提交与构建，取不到就不显示。
// 新站的顶栏、页尾在这两页藏起来（只在 .fo 在页面上时），换成本目录里的一份。

async function LiveMargins() {
  return <FolioMargins pulse={await getPulse()} />;
}

export default function FolioLayout({ children }: { children: ReactNode }) {
  return (
    <div className="fo">
      <FolioHeader />
      <Suspense fallback={<FolioMargins pulse={null} />}>
        <LiveMargins />
      </Suspense>
      {children}
      <FolioFooter />
    </div>
  );
}
