import { Suspense } from 'react';
import type { Metadata } from 'next';
import { CentralAccount } from './central-account';
import '../../_site/auth.css';

export const metadata: Metadata = {
  title: '我的账号',
  robots: { index: false, follow: false },
};

// 账号：白纸中间一张卡片。预留的几块能力上线前不显示。
export default function AccountPage() {
  return (
    <div className="m-auth m-top">
      <div className="m-auth-card m-account-card">
        <h1 className="m-kicker">我的账号</h1>
        <Suspense><CentralAccount /></Suspense>
      </div>
    </div>
  );
}
