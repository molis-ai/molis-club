// Edition C 用到的 Molis Work v0.2.0 界面截图：本机按 v0.2.0 源码跑演示项目截取，
// 裁掉了左侧项目栏（那里还写着旧名和本机用户名），已压缩。
// 首页核心产品区和 Work 页共用；录屏做好后，「看它怎么用」再换成视频。

export type Shot = { src: string; w: number; h: number; label: string };

export const workShots = {
  goal: {
    src: '/images/edition-c/work/goal.jpg',
    w: 1600,
    h: 1302,
    label: 'Molis Work',
  },
  create: {
    src: '/images/edition-c/work/create.jpg',
    w: 1600,
    h: 1302,
    label: '目标与完成要求',
  },
  runtime: {
    src: '/images/edition-c/work/runtime.jpg',
    w: 1600,
    h: 1274,
    label: '接入 Agent',
  },
  check: {
    src: '/images/edition-c/work/check.jpg',
    w: 1600,
    h: 1302,
    label: '收尾核对',
  },
} satisfies Record<string, Shot>;
