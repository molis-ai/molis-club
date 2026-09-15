'use client';
import Link from './edition-link';
import { authClient } from '../lib/auth-client';
export function AccountLink() {
  const { data } = authClient.useSession();
  return (
    <Link className="header-account" href={data ? '/account' : '/login'}>
      {data ? '我的账号' : '登录'}
    </Link>
  );
}
