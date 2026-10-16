// 顶栏与页尾的文字。栏目按 specs/site-rebuild/spec.md 第 3 节：
// Logo ｜ 产品 ▾ · 企业合作 · 社区 · 关于 ▾ ｜ 登录 · 聊一聊。

export const nav = {
  home: 'Molis AI 首页',
  products: '产品',
  enterprise: '企业合作',
  community: '社区',
  about: '关于',
  aboutItems: {
    about: '关于我们',
    team: '团队',
    essays: '文章',
    along: '沿途',
  },
  /** 下拉里关于各项的一行说明 */
  aboutLines: {
    about: '我们是谁、相信什么',
    team: '一群同类，一起创造',
    essays: '《人的尺度》《落地主义》',
    along: '那些具体的尝试',
  },
  login: '登录',
  account: '我的账号',
  chat: '聊一聊',
  menu: '菜单',
  close: '收起',
  skip: '跳到正文',
  /** 读屏用：两处导航的名字 */
  mainNav: '主导航',
  footerNav: '页尾导航',
};

/** 顶栏右上角的语言切换「中 / EN」 */
export const lang = {
  label: '语言',
  zh: '中',
  en: 'EN',
  /** 读屏与悬停提示用的全称 */
  zhName: '中文',
  enName: 'English',
};

export const footer = {
  columns: {
    products: '产品',
    studio: '工作室',
    elsewhere: '其他',
  },
  methods: '方法目录',
  privacy: '隐私说明',
  github: 'GitHub',
  copyright: '© 2026 Molis AI',
  /** 版权与字体说明之间的标点 */
  stop: '。',
  /** 版权说明：字体、配图来源与 AI 生成说明 */
  fonts: '字体：Jost 与 Fraunces（SIL Open Font License），中文用系统苹方。',
  images:
    '配图：Mixkit、Unsplash 的免费授权素材；部分配图由 AI 生成。画面里的人不是团队成员或用户。',
  updated: '本页最近修改',
  /** 「本页最近修改」后面的冒号 */
  colon: '：',
};
