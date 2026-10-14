import { lineNames, type LineId } from '../../../../content/studio';
import {
  folioHomeCopy,
  folioProductTags,
  folioProducts,
  type FolioProductId,
} from '../../../../content/folio';
import { folioWorld } from '../../../../content/folio-world';

// 白盒子美术馆官网的全部站内地址。页面结构与 Folio 最新版相同，只是都住在 /demos/brand/gallery 下：
// 社区（含「方法」详情与艺术家）也搬进来，整站不跳回 Folio 或旧站。

export const HOME = '/demos/brand/gallery';
export const WORK = `${HOME}/work`;
export const TOOL = `${HOME}/tool`;
export const LIFE = `${HOME}/life`;
export const STORY = `${HOME}/story`;
export const WORLD = `${HOME}/world`;
export const SOLUTIONS = `${HOME}/solutions`;
export const ESSAYS = `${HOME}/essays`;
export const ABOUT = `${HOME}/about`;
export const CONTACT = `${HOME}/contact`;
export const COMMUNITY = `${HOME}/community`;
export const LOGIN = `${HOME}/login`;
export const ACCOUNT = `${HOME}/account`;
export const PRIVACY = `${CONTACT}#privacy`;

export const essayHref = (slug: string) => `${ESSAYS}/${slug}`;
/** 社区里的「方法」段与它的详情页（原百科） */
export const METHODS = `${COMMUNITY}#methods`;
export const methodHref = (slug: string) => `${COMMUNITY}/methods/${slug}`;
export const artistHref = (slug: string) =>
  `${COMMUNITY}/methods/artists/${slug}`;

/** 联系页；topic 预选方向（enterprise、work、tool、life、story、world、feedback、creator、share-*） */
export const contactHref = (topic?: string) =>
  topic ? `${CONTACT}?topic=${topic}` : CONTACT;

/** 五件产品：Work、Tool、Life、Story 是 Room 1–4，World 是还在筹备的 Room 5 */
export const productIds: FolioProductId[] = folioProducts;
export const productHref: Record<FolioProductId, string> = {
  work: WORK,
  tool: TOOL,
  life: LIFE,
  story: STORY,
  world: WORLD,
};
export const productName: Record<FolioProductId, string> = {
  ...lineNames,
  world: folioWorld.name,
};
export const productLine: Record<FolioProductId, string> =
  folioHomeCopy.products;
export const productTag = folioProductTags;
export const roomNumber = (id: FolioProductId) => productIds.indexOf(id) + 1;

/** 首页四间展厅只放已经在做的四条产品线 */
export const lineIds: LineId[] = ['work', 'tool', 'life', 'story'];
export const lineHref: Record<LineId, string> = {
  work: WORK,
  tool: TOOL,
  life: LIFE,
  story: STORY,
};
