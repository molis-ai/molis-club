import type { Metadata } from 'next';
import { Suspense } from 'react';
import { LoginScene } from '../../_site/login-scene';
import '../../_site/home/r8.css';
import '../../_site/home/home.css';
import { LoginForm } from './login-form';
import '../../_site/auth.css';

export const metadata: Metadata = {
  title: '登录 / 注册',
  robots: { index: false, follow: false },
};

// 登录表单与首页首屏共用天空；沿用站点 template 的换页动画。
export default function LoginPage() {
  return (
    <LoginScene>
        <p className="m-kicker" lang="en">
          Molis AI
        </p>
        <Suspense>
          <LoginForm />
        </Suspense>
    </LoginScene>
  );
}
