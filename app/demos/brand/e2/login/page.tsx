'use client';
import { LoginForm } from '../../../../login/form';
import { AuthPage } from '../auth';
import { ACCOUNT, LOGIN, PRIVACY } from '../routes';

// E2 登录：表单逻辑与旧版共用（LoginForm），这里只给 E2 的地址与外框。
// 第三方登录按接口返回的开放状态显示，未开放时不出现可点的按钮（compactProviders）。

export default function E2Login() {
  return (
    <AuthPage>
      <LoginForm
        compactProviders
        paths={{ account: ACCOUNT, login: LOGIN, privacy: PRIVACY }}
      />
    </AuthPage>
  );
}
