'use client';
import { Actions, Btn, Room, Shell } from './kit';
import { HOME } from './routes';
import './missing.css';

// 美术馆的 404（不存在的地址都落到这里）：一间空着的白盒子，门口拉着一道围绳，墙上只有一块小牌。文案沿用 Folio 的 404。
export default function GalleryNotFound() {
  return (
    <Shell rooms compact mainClassName="g-missing">
      <div className="g-missing-room" aria-hidden="true">
        <Room>
          <div className="g-missing-sign">
            <span lang="en">404</span>
            <small>本展厅暂未开放</small>
          </div>
        </Room>
        <span className="g-missing-rope">
          <i />
          <b />
          <i />
        </span>
      </div>
      <div className="g-missing-copy">
        <h1>这里还没长出东西。</h1>
        <p>这个页面不存在，或者已经换了地方。</p>
        <Actions>
          <Btn href={HOME}>回到首页</Btn>
          <Btn href={`${HOME}#products`} tone="ghost">
            看看我们的产品
          </Btn>
        </Actions>
      </div>
    </Shell>
  );
}
