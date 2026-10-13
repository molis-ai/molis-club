import { redirect } from 'next/navigation';
import { METHODS } from '../../routes';

// 方法的列表就是 E2 社区页的「方法」段，这一级地址直接跳过去。
export default function E2CommunityMethodsRedirect() {
  redirect(METHODS);
}
