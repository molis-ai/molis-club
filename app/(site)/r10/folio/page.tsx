import Link from 'next/link';
import { Suspense } from 'react';
import type { Metadata } from 'next';
import { ArrowRight } from 'lucide-react';
import { homeClosing } from '../../../../content/site/home';
import { studio } from '../../../../content/site/studio';
import { HomeTop } from '../../../_site/home/top';
import { FolioIndex } from './index-list';
import { picture } from './media';
import { FullPlate, Photo } from './plates';
import { getPulse } from './pulse';
import '../../../_site/home/r8.css';
import '../../../_site/home/home.css';

export const metadata: Metadata = {
  title: '作品集 · 第十轮视觉稿',
  robots: { index: false, follow: false },
};

async function LiveIndex() {
  return <FolioIndex pulse={await getPulse()} />;
}

const cabin = picture('mist-home-a');
const wind = picture('mist-home-b');

// 首页：一屏照片、一屏文字，严格交替。
// 照片：海边首屏「Molis AI」→ 礁石边作画与 We build {Warm}ware（已定，只换成雾的调色）
// 文字：目录，五件作品（左列表、右舞台）
// 照片：林间有一间工作室（品牌概念图），整幅，不配字
// 文字：一句愿景，三个去处
// 照片：风的手稿（品牌概念图），一行「始终好奇，持续创造。」
export default function FolioHome() {
  return (
    <div className="fo-home">
      <div className="fo-top" data-folio="MOLIS" data-tone="film">
        <HomeTop />
      </div>

      <Suspense fallback={<FolioIndex pulse={null} />}>
        <LiveIndex />
      </Suspense>

      <FullPlate
        folio="PLATE"
        plate="Pl. VI"
        caption="林间有一间工作室 · 品牌概念图"
        color={cabin.color}
        label="满幅照片：海边的松林里有一间小木屋，门开着，屋里有一张桌子。"
      >
        <Photo image={cabin} focus="50% 50%" />
      </FullPlate>

      <section
        className="fo-text fo-studio"
        data-folio="STUDIO"
        data-tone="paper"
        aria-labelledby="fo-studio-title"
      >
        <p className="fo-caps" lang="en" data-reveal>
          Studio
        </p>
        <h2 id="fo-studio-title" className="fo-vision" data-reveal>
          {studio.vision}
        </h2>
        <ul className="fo-doors" data-reveal>
          {homeClosing.paths.map((path) => (
            <li key={path.href}>
              <Link href={path.href}>
                <span className="fo-door-name">{path.label}</span>
                <span className="fo-door-text">{path.text}</span>
                <ArrowRight size={15} aria-hidden="true" />
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <FullPlate
        folio="CODA"
        plate="Pl. VII"
        caption={
          <>
            {studio.signature}
            <small className="fo-coda-note">品牌概念图</small>
          </>
        }
        color={wind.color}
        className="fo-coda"
        label="满幅照片：海边的崖上，一台被风推着在纸上作画的木头装置，远处是海。"
      >
        <Photo image={wind} focus="50% 60%" />
      </FullPlate>
    </div>
  );
}
