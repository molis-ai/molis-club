'use client';
import { LoginForm } from '../../../../login/form';
import { AuthPage } from '../auth';
import { ACCOUNT, CONTACT, LOGIN } from '../shared';

export default function FolioLogin() {
  return (
    <AuthPage account>
      <LoginForm
        compactProviders
        paths={{
          account: ACCOUNT,
          login: LOGIN,
          privacy: `${CONTACT}#privacy`,
        }}
      />
    </AuthPage>
  );
}
