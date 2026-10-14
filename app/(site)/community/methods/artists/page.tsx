import { redirect } from 'next/navigation';
import { METHODS } from '../../../../_site/routes';

// 艺术家 Skill 没有单独的列表页：这一级地址直接去方法目录，筛好「艺术家 Skill」。
export default function ArtistsIndex() {
  redirect(`${METHODS}?type=artists`);
}
