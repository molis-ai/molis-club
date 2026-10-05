// Folio 版 Molis Work 页只用到的东西：截图路径与替代文字。
// 文案、开关和标签一律在 content/molis-work.ts，五个方向共用。

export type Shot = {
  src: string;
  alt: string;
  width: number;
  height: number;
};

const base = '/images/demos/folio-work';

export const shots = {
  home: {
    src: `${base}/home-zh.jpg`,
    alt: 'Molis Work 项目首页：正在推进的目标、当天的事件和回到手边的内容',
    width: 1440,
    height: 1000,
  },
  phone: {
    src: `${base}/phone-zh.jpg`,
    alt: 'Molis Work 在手机宽度下的界面',
    width: 390,
    height: 844,
  },
  goals: {
    src: `${base}/goals-zh.jpg`,
    alt: 'Goals 界面：目标树、完成要求和时间线',
    width: 1440,
    height: 1000,
  },
  feed: {
    src: `${base}/feed-zh.jpg`,
    alt: 'Feed 界面：左侧是 GitHub、Gmail、RSS 等来源的消息，右侧是选中的一条和它的去向',
    width: 1440,
    height: 1000,
  },
  onboarding: {
    src: `${base}/onboarding-zh.jpg`,
    alt: '首次使用：勾选要带入的来源，旁边预览将要生成的新项目',
    width: 1440,
    height: 1000,
  },
} satisfies Record<string, Shot>;
