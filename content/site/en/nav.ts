// 顶栏与页尾的英文（对应 content/site/nav.ts，形状一致）。文风见 docs/i18n.md。
import type * as zh from '../nav';

export const nav: typeof zh.nav = {
  home: 'Molis AI home',
  products: 'Products',
  enterprise: 'For business',
  community: 'Community',
  about: 'About',
  aboutItems: {
    about: 'About us',
    team: 'Team',
    essays: 'Essays',
    along: 'Along the way',
  },
  aboutLines: {
    about: 'Who we are, what we believe',
    team: 'Kindred people, making things together',
    essays: 'Two essays, in Chinese for now',
    along: 'The things we’ve actually tried',
  },
  login: 'Log in',
  account: 'My account',
  chat: 'Say hello',
  menu: 'Menu',
  close: 'Close',
  skip: 'Skip to content',
  mainNav: 'Main',
  footerNav: 'Footer',
};

export const lang: typeof zh.lang = {
  label: 'Language',
  zh: '中',
  en: 'EN',
  zhName: '中文',
  enName: 'English',
};

export const footer: typeof zh.footer = {
  columns: {
    products: 'Products',
    studio: 'Studio',
    elsewhere: 'More',
  },
  methods: 'Methods',
  privacy: 'Privacy',
  github: 'GitHub',
  copyright: '© 2026 Molis AI',
  stop: '. ',
  fonts:
    'Type: Jost and Fraunces (SIL Open Font License), with the system’s PingFang for Chinese. ',
  images:
    'Photos: free-license images from Mixkit and Unsplash; some are AI-generated. The people in them aren’t our team or our users.',
  updated: 'Last updated',
  colon: ': ',
};

/**
 * 只有英文：访客想看英文、这一页还没有英文时，顶栏右上角说一声（中文页上显示，所以写在英文里）。
 * 不用机器翻译凑数，就直说。
 */
export const untranslated = {
  title: 'This page isn’t in English yet.',
  text: 'You’re reading the Chinese original. We translate by hand, one page at a time, and we’d rather wait than machine-translate.',
  home: 'English home',
  close: 'Close',
};
