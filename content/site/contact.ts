// 联系表单（企业合作页、联系页共用）与联系页的文字。
// 原句：handling 取自 docs/studio-intro.md 第 5 章末尾「联系」一条，不改字。
// 其余都是界面文字：标「沿用」的出自旧联系页（content/studio.ts、content/folio.ts 的 contact / folioContact），
// 标「新写」的是这次写的；都不新增产品事实。
//
// 后端（/api/join → lib/community-api.mjs 的 saveApplication）只认四种 role：企业合作 | 早期体验者 | 创造者 | 开发者。
// 规格的五种来意在这里映射过去：企业合作→企业合作；关注某件产品、反馈、其他→早期体验者；社区分享→创造者。
// topic 只记从哪个入口来：地址栏 ?topic= 优先，没有时用来意的 slug（enterprise / follow-<产品> / share / feedback / other）。

import type { ProductId } from './products';

export type Intent = 'enterprise' | 'follow' | 'share' | 'feedback' | 'other';
type Role = '企业合作' | '早期体验者' | '创造者';

export type IntentOption = {
  id: Intent;
  /** 新写：规格第 6 节的五种来意 */
  label: string;
  role: Role;
  /** 新写：想说的事一栏的提示 */
  placeholder: string;
};

export const intents: IntentOption[] = [
  {
    id: 'enterprise',
    label: '企业合作',
    role: '企业合作',
    placeholder: '眼前的一个业务问题：现在怎么做，希望发生什么变化。',
  },
  {
    id: 'follow',
    label: '关注某件产品',
    role: '早期体验者',
    placeholder: '想关注哪一件，或者想先知道什么。',
  },
  {
    id: 'share',
    label: '社区分享',
    role: '创造者',
    placeholder: '贴上作品链接，说说用了什么、怎么做的。',
  },
  {
    id: 'feedback',
    label: '反馈',
    role: '早期体验者',
    placeholder: '哪里顺手，哪里卡住，都可以说。',
  },
  {
    id: 'other',
    label: '其他',
    role: '早期体验者',
    placeholder: '一个没想完的念头也可以。',
  },
];

/**
 * 地址栏 ?topic= → 预选的来意（关注产品时连同是哪一件）和预填的一句。
 * 键与旧联系页 content/studio.ts 的 contact.topics 一致，旧链接照样能用。
 */
export const topics: Record<
  string,
  { intent: Intent; product?: ProductId; idea?: string }
> = {
  enterprise: { intent: 'enterprise' },
  work: { intent: 'follow', product: 'work' },
  tool: { intent: 'follow', product: 'tool' },
  life: { intent: 'follow', product: 'life' },
  story: { intent: 'follow', product: 'story' },
  world: { intent: 'follow', product: 'world' },
  feedback: { intent: 'feedback' },
  creator: { intent: 'share' },
  // 沿用：社区「做了一个？分享给我们」预填用了什么，接着写做了什么、贴链接
  'share-flower': { intent: 'share', idea: '我用「一朵好奇」小实验做了：' },
  'share-artist': { intent: 'share', idea: '我用艺术家 Skill 做了：' },
  'share-method': { intent: 'share', idea: '我用社区里的方法做了：' },
};

/** 新写：选了「关注某件产品」和是哪一件之后，预填的一句 */
export const followIdea = (name: string) => `想关注 ${name} 的进展。`;

export const form = {
  intentLegend: '来意',
  productLegend: '哪一件',
  /** 企业合作页：来意固定，不给选；别的事指去联系页（新写） */
  fixedLabel: '来意',
  elsewhere: '别的事，走联系页',
  name: '怎么称呼你',
  email: '联系邮箱',
  emailPlaceholder: 'you@example.com',
  idea: '想说的事',
  consent: '同意 Molis AI 用这些信息联系我。',
  /** 沿用：分享类才出现，和「同意联系」分开存（applications.allow_display） */
  allowDisplay:
    '同意在社区「大家做的」里展示这次投稿和我的称呼（可选，不勾也会收到）。',
  /** 新写：分享类的投稿可能被展示，处理方式要照实补一句 */
  shareHandling: '勾了「同意展示」的投稿，可能被选进社区。',
  /** 原句：docs/studio-intro.md 第 5 章末尾 */
  handling: '表单内容存入团队私密收件箱，不公开展示，目前不会自动回信。',
  submit: '发给我们',
  sending: '正在发送…',
  /** 新写：没有 JS 时表单发不出去，照实说 */
  noScript:
    '这张表需要开启 JavaScript 才能发送；没开也不要紧，上面的字都能读。',
  /** 新写：没选来意或产品就点了发送（一般会先被浏览器拦下） */
  pickIntent: '先选一个来意。',
  pickProduct: '先选想关注哪一件。',
  errorFallback: '这次没能发出去，请稍后再试。',
  success: {
    title: '收到了。',
    /** 新写 */
    text: '已经存进团队的私密收件箱，不公开展示。目前不会自动回信，不用去翻垃圾邮件。',
  },
  back: {
    enterprise: '回到企业合作',
    community: '回到社区',
    product: (name: string) => `回到 ${name}`,
    home: '回到首页',
  },
};

/** 联系页（新写）：左边门洞，右边表单 */
export const contactPage = {
  title: '联系',
  description:
    '企业合作、关注某件产品、社区分享、反馈或别的事，都可以在这里留几句话给 Molis AI 团队。表单内容存入团队私密收件箱，不公开展示，目前不会自动回信。',
  heading: '门开着，进来说。',
  alt: '白色展厅的天光下，一个人正走过门洞。',
  caption: 'Through the doorway',
  handlingTitle: '这张表怎样处理',
  handling: [
    '只收你填写的称呼、邮箱、来意和内容，以及你从哪个入口过来。',
    '只用来了解你的想法、联系你；不出售，也不用于广告。',
  ],
  privacy: '隐私说明',
};
