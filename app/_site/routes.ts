import type { ProductId } from '../../content/site/products';

// 新站的全部站内地址。顶栏、页尾、各页去处都读这里；旧地址的重定向在 next.config.ts。

export const HOME = '/';
export const PRODUCTS = '/#products';
export const ENTERPRISE = '/enterprise';
export const COMMUNITY = '/community';
export const METHODS = '/community/methods';
export const ABOUT = '/about';
export const TEAM = '/team';
export const ESSAYS = '/essays';
export const ALONG = '/along-the-way';
export const CONTACT = '/contact';
export const LOGIN = '/login';
export const ACCOUNT = '/account';
export const PRIVACY = '/privacy';
export const GITHUB = 'https://github.com/molis-ai';

export const productHref: Record<ProductId, string> = {
  work: '/work',
  tool: '/tool',
  life: '/life',
  story: '/story',
  world: '/world',
};

export const essayHref = (slug: string) => `${ESSAYS}/${slug}`;
export const methodHref = (slug: string) => `${METHODS}/${slug}`;
export const artistHref = (slug: string) => `${METHODS}/artists/${slug}`;

/** 联系页按 ?topic= 预选来意；topic 见 content/site/contact.ts */
export const contactHref = (topic?: string) =>
  topic ? `${CONTACT}?topic=${topic}` : CONTACT;
