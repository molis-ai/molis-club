import type { Metadata } from 'next';
import { Suspense } from 'react';
import { LoginForm } from './login-form';
import '../../_site/auth.css';

export const metadata: Metadata = {
  title: '登录 / 注册',
  robots: { index: false, follow: false },
};

// 登录 / 注册：白纸中间一张卡片。
export default function LoginPage() {
  return (
    <div className="m-auth m-top">
      <div className="m-auth-card">
        <p className="m-kicker" lang="en">
          Molis AI
        </p>
        <Suspense>
          <LoginForm />
        </Suspense>
      </div>
    </div>
  );
}
