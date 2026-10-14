'use client';
import type { ReactNode } from 'react';
import { folioStudio } from '../../../../content/folio';
import { Room, Shell } from './kit';
import './auth.css';

// 登录与账号页共用：左边一间小小的白盒子，墙上写着「A space for your curiosity.」，右边一块展签似的白牌放表单。
// 像美术馆的会员入口：安静、只有一件事。前缀 g-auth-

export function AuthPage({ children }: { children: ReactNode }) {
  const [line, emphasis] = folioStudio.auth.line;
  return (
    <Shell current="account" rooms compact mainClassName="g-auth">
      <div className="g-auth-scene" aria-hidden="true">
        <Room>
          <div className="g-auth-wall">
            <p lang="en">
              {line}
              <br />
              <em>{emphasis}</em>
            </p>
          </div>
        </Room>
      </div>
      <p className="g-auth-note">{folioStudio.auth.note}</p>
      <div className="g-auth-panel">{children}</div>
    </Shell>
  );
}
