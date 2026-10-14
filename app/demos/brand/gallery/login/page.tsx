'use client';
import { LoginForm } from '../../../../login/form';
import { AuthPage } from '../auth';
import { ACCOUNT, LOGIN, PRIVACY } from '../routes';

export default function GalleryLogin() {
  return (
    <AuthPage>
      <LoginForm
        compactProviders
        paths={{ account: ACCOUNT, login: LOGIN, privacy: PRIVACY }}
      />
    </AuthPage>
  );
}
