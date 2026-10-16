// 首页界面文字的英文（对应 content/site/home.ts，形状一致）。
// 站内地址照写中文地址，组件用 localize() 换成当前语言的地址。
import type * as zh from '../home';

export const homeProducts: typeof zh.homeProducts = {
  work: {
    more: 'More about Molis Work',
    github: 'See the source code',
    caseTitle: '',
    view: '16 / 9.4',
  },
  tool: {
    more: 'More about Molis Tool',
    caseTitle: 'Select an event listing, and turn it into a draft event.',
    view: '16 / 9.4',
  },
  life: {
    more: 'More about Molis Life',
    caseTitle: 'A wish you’ve had for ages finally meets a free afternoon.',
    view: '16 / 9.4',
  },
  story: {
    more: 'More about Molis Story',
    caseTitle: 'Step from a “what if” into a book, and come back with one line.',
    view: '16 / 9.4',
  },
  world: {
    more: 'See the concept',
    caseTitle: 'Your usual noodle shop, placed in a world that grows with you.',
    view: '16 / 9.4',
  },
};

export const homeBeliefs: typeof zh.homeBeliefs = {
  kicker: 'Six beliefs',
  title: 'What we believe',
  more: 'Read them in full',
};

export const homeClosing: typeof zh.homeClosing = {
  lead: 'Technology, back to human scale.',
  signature: 'Always curious, always making.',
  caption: 'A white room, a skylight, a garden',
  alt: 'A white gallery. Light falls through a skylight, and a wide opening at the far end leads out to a garden. Tree shadows lie on the floor.',
  paths: [
    {
      label: 'For business',
      text: 'Put AI to work in your business, and keep the know-how in your team.',
      link: 'How we work with teams',
      href: '/enterprise',
    },
    {
      label: 'Community',
      text: 'Try things people made, and see how they made them. Take a method with you, and leave a new idea behind.',
      link: 'Visit the community',
      href: '/community',
    },
    {
      label: 'Team',
      text: 'Kindred people, making things together.',
      link: 'Meet us',
      href: '/team',
    },
  ],
  also: {
    label: 'Or',
    github: 'See the Molis Work source code',
    essays: 'Read the essays',
    along: 'Browse Along the way',
  },
};

export const homeUi: typeof zh.homeUi = {
  wareKicker: ['What we make'],
  warePause: 'Pause the words before “ware”',
  wareResume: 'Resume the words before “ware”',
  aiPause: 'Pause the headline animation',
  aiPlay: 'Play the headline animation',
  filmPause: 'Pause the background',
  filmResume: 'Resume the background',
  products: { title: 'Products', small: '' },
  lines: { en: 'Five lines', local: 'Work · Life · Experiences' },
};
