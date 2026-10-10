'use client';
import type { ReactNode } from 'react';
import { folioStudio } from '../../../../content/folio';
import { CoverArt } from './art';
import { Footer, SiteHeader, useFolioMotion } from './shared';
import './folio.css';
import './kit.css';
import './auth.css';

// 登录与账号页共用：左边一页封面剪纸和一句话，右边一张贴上去的白纸，和联系页同一种排法。前缀 fa-

export function AuthPage({
  children,
  account = false,
}: {
  children: ReactNode;
  /** 账号页与登录页：顶栏右上角那一项标为当前 */
  account?: boolean;
}) {
  const rootRef = useFolioMotion();
  const [line, emphasis] = folioStudio.auth.line;
  return (
    <div className="fo-site" ref={rootRef}>
      <SiteHeader current={account ? 'account' : undefined} />
      <main id="main" className="fa-auth">
        <div className="fa-scene" data-parallax>
          <div className="fa-art">
            <CoverArt />
          </div>
          <p lang="en">
            {line} <em>{emphasis}</em>
          </p>
          <span>{folioStudio.auth.note}</span>
        </div>
        <div className="fa-panel">{children}</div>
      </main>
      <Footer tone="paper" compact />
    </div>
  );
}
