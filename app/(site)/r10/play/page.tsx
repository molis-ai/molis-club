import type { Metadata } from 'next';
import Link from 'next/link';
import { studio } from '../../../../content/site/studio';
import { homeClosing } from '../../../../content/site/home';
import { HomeTop } from '../../../_site/home/top';
import { PlayShell } from './chrome';
import { Day } from './day';
import { Plate } from './plate';
import '../../../_site/home/r8.css';
import '../../../_site/home/home.css';
import './play.css';

// 第十轮视觉稿 · 种子 E「可以亲手玩的说明书」（代号 play）：首页。
// 前两屏照旧（海边首屏、Warmware），只把照片调成雾调；之后的产品区就是这一页的主角「拨一天」；
// 再往后一屏照片、一屏字，照片屏和文字屏分开。评审用，不进导航、不被收录。
export const metadata: Metadata = {
  title: '第十轮 · play · 首页',
  robots: { index: false, follow: false },
};

export default function PlayHome() {
  return (
    <PlayShell current="home">
      <div className="m-home pl-home">
        <HomeTop />
        <Day />
        <Plate
          photo="home-b"
          edge="Make"
          caption="风的手稿"
          alt="海边崖上的石台，一台被风推着的木头装置，用一支笔在纸上慢慢画线；远处是海和一块礁石。"
          bleed
        />
        <section
          className="pl-close"
          data-tone="paper"
          data-edge="Human scale"
          aria-labelledby="pl-close-title"
        >
          <h2 id="pl-close-title" className="pl-close-line" data-reveal>
            {studio.vision}
          </h2>
          <p className="pl-close-sign" data-reveal>
            {studio.signature}
          </p>
          <ul className="pl-close-paths" data-reveal>
            {homeClosing.paths.map((path) => (
              <li key={path.href}>
                <span className="pl-cap">{path.label}</span>
                <Link className="pl-more" href={path.href}>
                  {path.link}
                  <span aria-hidden="true"> →</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </PlayShell>
  );
}
