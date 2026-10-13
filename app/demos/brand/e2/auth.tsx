'use client';
import type { ReactNode } from 'react';
import { folioStudio } from '../../../../content/folio';
import { Box, Face, Line } from './axo';
import { E2Page } from './shell';
import './auth.css';

// 登录与账号页共用：极简、功能为先。一边是表单，另一边是一块安静的灰面，
// 放一张小轴测图（一张小桌、两只凳子，其中一只是给你的）和沿用原登录页的一句英文、一句中文。
// 宽屏灰面在左、表单在右；窄屏先给表单，灰面收到下面。前缀 eu-。

/** 一张小桌、两只凳子：「有意思的相遇，从这里开始」。杏橙只给空着等你的那只凳子 */
function Meeting() {
  return (
    <svg
      className="eu-meeting"
      viewBox="-12.9 -1.8 29.3 18.6"
      aria-hidden="true"
      data-draw
    >
      {/* 地台：两侧切面涂实，台面上淡淡的模数线 */}
      <Box
        at={[0, 0, 0]}
        size={[18, 14, 1]}
        top="floor"
        left="cut"
        right="cut"
      />
      {[6, 12].map((x) => (
        <Line key={x} a={[x, 0, 1]} b={[x, 14, 1]} className="e2-faint" />
      ))}
      <Line a={[0, 7, 1]} b={[18, 7, 1]} className="e2-faint" />
      {/* 小桌：一根立柱、一块台面，台上一只杯子和一张纸 */}
      <Box at={[8.6, 6.6, 1]} size={[0.8, 0.8, 4]} />
      <Box at={[6.6, 4.6, 5]} size={[4.8, 4.8, 0.5]} />
      <Face
        tone="light"
        p={[
          [7.4, 5.4, 5.5],
          [9.6, 5.2, 5.5],
          [9.9, 7.6, 5.5],
          [7.7, 7.8, 5.5],
        ]}
      />
      <Box at={[9.7, 7.9, 5.5]} size={[0.9, 0.9, 1]} />
      {/* 两只凳子，离你最近的那只用杏橙 */}
      <Box at={[13.2, 5.8, 1]} size={[2.4, 2.4, 2.6]} />
      <Box at={[7.8, 10.8, 1]} size={[2.4, 2.4, 2.6]} top="accent" />
    </svg>
  );
}

export function AuthPage({ children }: { children: ReactNode }) {
  const [line, emphasis] = folioStudio.auth.line;
  return (
    <E2Page current="account" className="eu" compactFooter>
      <div className="eu-auth">
        <div className="eu-panel">{children}</div>
        <div className="eu-side">
          <div className="eu-art" data-reveal>
            <Meeting />
          </div>
          <div className="eu-words">
            <p className="eu-line" lang="en">
              <span>{line}</span> <span>{emphasis}</span>
            </p>
            <p className="eu-note">{folioStudio.auth.note}</p>
          </div>
        </div>
      </div>
    </E2Page>
  );
}
