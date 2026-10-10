import { redirect } from 'next/navigation';

// 艺术家 Skill 不单独成页，收在百科首页的第一段。
// 这是服务端页面，不能从 'use client' 的 shared.tsx 取路由常量，所以直接写路径。
export default function FolioWikiArtists() {
  redirect('/demos/brand/folio/wiki#artists');
}
