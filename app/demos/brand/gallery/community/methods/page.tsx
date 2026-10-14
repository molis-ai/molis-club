import { redirect } from 'next/navigation';

// 方法的列表就是社区页的「方法」段，这一级地址直接跳过去。服务端页面，直接写路径。
export default function CommunityMethodsRedirect() {
  redirect('/demos/brand/gallery/community#methods');
}
