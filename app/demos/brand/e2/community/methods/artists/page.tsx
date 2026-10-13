import { redirect } from 'next/navigation';
import { METHODS } from '../../../routes';

// 艺术家 Skill 的列表也在 E2 社区「方法」段里。
export default function E2CommunityArtistsRedirect() {
  redirect(METHODS);
}
