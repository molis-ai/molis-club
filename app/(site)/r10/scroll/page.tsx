import Link from 'next/link';
import { pageMetadata } from '../../../../lib/site';
import { studio } from '../../../../content/site/studio';
import { homeClosing } from '../../../../content/site/home';
import { WORK_GITHUB } from '../../../../content/site/products';
import { ALONG, ESSAYS } from '../../../_site/routes';
import { HomeTop } from '../../../_site/home/top';
import { Handscroll } from './scroll';
import { Photo } from './roll';
import '../../../_site/home/r8.css';
import '../../../_site/home/home.css';

export const metadata = {
  ...pageMetadata('一卷手卷 · 第十轮视觉稿', studio.short[0], '/r10/scroll'),
  robots: { index: false, follow: false },
};

// 首页（视觉稿 C「一卷手卷」）：海边首屏 → Warmware（已定，调成雾色）→ 一卷长卷（五件产品是五段风景）
// → 卷后一屏「林间有一间工作室」（照片屏）→ 一屏很空的去处（文字屏）→ 页尾。「我们相信」不放首页。
export default function ScrollHome() {
  return (
    <div className="sc-home">
      <HomeTop />
      <Handscroll />
      <section className="sc-after" aria-label="卷后" data-tone="film">
        <Photo
          name="home-a"
          alt="海边的松林里有一间小屋，木门开着，一条小路从草里通到门口。"
          sizes="100vw"
          className="sc-after-photo"
          focus="50% 55%"
        />
      </section>
      <section className="sc-paths" aria-labelledby="sc-paths-title">
        <h2 id="sc-paths-title" className="sr-only">
          去处
        </h2>
        <ul>
          {homeClosing.paths.map((path) => (
            <li key={path.href}>
              <h3>{path.label}</h3>
              <p>{path.text}</p>
              <Link className="sc-line" href={path.href}>
                {path.link}
              </Link>
            </li>
          ))}
        </ul>
        <p className="sc-also">
          <span>{homeClosing.also.label}</span>
          <a
            className="sc-line"
            href={WORK_GITHUB}
            target="_blank"
            rel="noreferrer"
          >
            {homeClosing.also.github}
          </a>
          <Link className="sc-line" href={ESSAYS}>
            {homeClosing.also.essays}
          </Link>
          <Link className="sc-line" href={ALONG}>
            {homeClosing.also.along}
          </Link>
        </p>
      </section>
    </div>
  );
}
