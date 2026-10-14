import type { Metadata } from 'next';
import { Account } from './account';
import '../../_site/auth.css';

export const metadata: Metadata = {
  title: '我的账号',
  robots: { index: false, follow: false },
};

// 账号：白纸中间一张卡片。预留的几块能力上线前不显示。
export default function AccountPage() {
  return (
    <div className="m-auth m-top">
      <div className="m-auth-card">
        <p className="m-kicker" lang="en">
          Molis AI
        </p>
        <Account />
      </div>
    </div>
  );
}
