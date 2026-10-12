import { redirect } from 'next/navigation';

// 百科并入社区（A6）：原百科首页跳到社区的「方法」段。
// 这是服务端页面，不能从 'use client' 的 shared.tsx 取路由常量，所以直接写路径。
export default function FolioWikiRedirect() {
  redirect('/demos/community#methods');
}
