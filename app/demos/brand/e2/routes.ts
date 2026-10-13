import {
  folioHomeCopy,
  folioProductTags,
  folioProducts,
  type FolioProductId,
} from '../../../../content/folio';
import { folioWorld } from '../../../../content/folio-world';
import { lineNames } from '../../../../content/studio';

// E2 整站的地址与产品清单。页面结构跟 Folio 最新版一一对应，只是都放在 /demos/brand/e2 下面；
// 社区也收进来（/demos/brand/e2/community），免得从 E2 跳回 Folio 的样子。

export const HOME = '/demos/brand/e2';
export const WORK = `${HOME}/work`;
export const TOOL = `${HOME}/tool`;
export const LIFE = `${HOME}/life`;
export const STORY = `${HOME}/story`;
export const WORLD = `${HOME}/world`;
export const SOLUTIONS = `${HOME}/solutions`;
export const ESSAYS = `${HOME}/essays`;
export const ABOUT = `${HOME}/about`;
export const CONTACT = `${HOME}/contact`;
export const LOGIN = `${HOME}/login`;
export const ACCOUNT = `${HOME}/account`;
export const PRIVACY = `${CONTACT}#privacy`;
export const COMMUNITY = `${HOME}/community`;
/** 方法（原百科）是社区页里的一段，详情是社区下的子页 */
export const METHODS = `${COMMUNITY}#methods`;

export const essayHref = (slug: string) => `${ESSAYS}/${slug}`;
export const methodHref = (slug: string) => `${COMMUNITY}/methods/${slug}`;
export const artistHref = (slug: string) =>
  `${COMMUNITY}/methods/artists/${slug}`;

/** 联系页；topic 预选「企业合作」或预填关注哪条产品线，提交后按它回到来处 */
export const contactHref = (topic?: string) =>
  topic ? `${CONTACT}?topic=${topic}` : CONTACT;

export type ProductId = FolioProductId;
/** Work → Tool → Life → Story → World：顶栏下拉、页尾和「接着看」都按这一个顺序 */
export const productIds: ProductId[] = folioProducts;
export const productHref: Record<ProductId, string> = {
  work: WORK,
  tool: TOOL,
  life: LIFE,
  story: STORY,
  world: WORLD,
};
export const productName: Record<ProductId, string> = {
  ...lineNames,
  world: folioWorld.name,
};
export const productLine: Record<ProductId, string> = folioHomeCopy.products;
/** 还是概念的产品带一枚状态签（目前只有 World） */
export const productTag = folioProductTags;

export const pad = (index: number) => String(index + 1).padStart(2, '0');
