import { redirect } from 'next/navigation';

// 艺术家 Skill 不单独成页，收在社区「方法」段里（A6）。服务端页面，直接写路径。
export default function FolioWikiArtistsRedirect() {
  redirect('/demos/community#methods');
}
