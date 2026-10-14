import { redirect } from 'next/navigation';

// 艺术家 Skill 的列表也在社区「方法」段里。服务端页面，直接写路径。
export default function CommunityArtistsRedirect() {
  redirect('/demos/brand/gallery/community#methods');
}
