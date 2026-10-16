// 404 的英文（对应 content/site/not-found.ts，形状一致）。
// 第一条去处换成已经有英文的 Molis Work：英文访客从这里出去，先落在英文页上。
import type * as zh from '../not-found';

export const notFound: typeof zh.notFound = {
  meta: 'Still somewhere along the way',
  title: 'This page is still somewhere along the way.',
  lead: 'Maybe the address has a typo. Maybe we just haven’t made it yet. We make things work first and make them pretty second, and this page hasn’t had a turn at either.',
  home: 'Back to the home page',
  links: [
    { label: 'See Molis Work', href: '/work' },
    { label: 'Tell us what you were looking for', href: '/contact' },
  ],
};
