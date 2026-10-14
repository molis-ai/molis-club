'use client';
import { studio } from '../../../content/site/studio';
import { AiWordCycle } from './ai-words';
import { Film, FootageToggle, useFootagePlaying } from './footage';
import { Ware } from './ware';

// 首页前两屏（r8 海边版已定，原样保留）：
// 第一屏：两人沿海边走，「Molis AI」字标 + A/I 换词 + 关键词；第二屏：礁石边对海作画，We build {Warm}ware / Beyond Software。
// 两屏共用一卷胶片：首屏的照片钉在视口里，读到那句话时溶进第二张。
export function HomeTop() {
  const { playing, toggle } = useFootagePlaying();
  return (
    <Film playing={playing}>
      <section className="m-hero m-real-hero" aria-labelledby="m-title">
        <div className="m-real-copy">
          <h1 id="m-title" className="m-mark" lang="en">
            Molis AI
          </h1>
          <AiWordCycle />
        </div>
        <div className="m-real-foot">
          <FootageToggle playing={playing} toggle={toggle} />
          <p className="m-keys">
            {studio.keywords.map((word) => (
              <span key={word}>{word}</span>
            ))}
          </p>
        </div>
      </section>
      <Ware />
    </Film>
  );
}
