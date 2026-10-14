'use client';
import { useRef } from 'react';
import { studio } from '../../../content/site/studio';
import { useVisible } from '../motion';
import { AiWordCycle } from './ai-words';
import { Film, FootageToggle, useFootagePlaying } from './footage';
import { Ware } from './ware';

// 首页前两屏（r8 海边版已定，原样保留）：
// 第一屏：两人沿海边走，「Molis AI」字标 + A/I 换词 + 关键词；第二屏：礁石边对海作画，We build {Warm}ware / Beyond Software。
// 两屏共用一卷胶片：首屏的照片钉在视口里，读到那句话时溶进第二张。
export function HomeTop() {
  const { playing, toggle } = useFootagePlaying();
  // 照片的「呼吸」是循环动画：离开视口、页面隐藏时停
  const film = useRef<HTMLDivElement>(null);
  const visible = useVisible(film, 0.01);
  return (
    <Film playing={playing && visible} ref={film}>
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
