// 工作室首页视觉方向比稿：九版方案的编号、地址与说明。比稿页、各版底部的比稿条共用这一份。
// 除 Folio 原版外，八版都以 Folio 首页的内容为基线（content/），差别只在视觉与动效。

export const PITCH = '/demos/brand/pitch';

export type PitchId =
  | 'folio'
  | 'a1'
  | 'a2'
  | 'd1'
  | 'd2'
  | 'e1'
  | 'e2'
  | 'night'
  | 'white';

export type PitchGroup = {
  id: 'base' | 'a' | 'd' | 'e' | 'show';
  name: string;
  text: string;
  refs: string;
};

export type Pitch = {
  id: PitchId;
  no: string;
  group: PitchGroup['id'];
  name: string;
  href: string;
  summary: string;
  traits: string[];
};

export const pitchGroups: PitchGroup[] = [
  {
    id: 'base',
    name: '基准',
    text: '现在线上的 Folio 首页。其余八版读的是同一份文案，Folio 改了文案，八版跟着变；差别只在视觉与动效。',
    refs: '',
  },
  {
    id: 'a',
    name: 'A 暖纸与画框',
    text: '暖色的纸、衬线字和画框，像翻一本认真装帧的画册。',
    refs: '参考 Dia、Cursor、Claude、YouMind、humans&、Altina',
  },
  {
    id: 'd',
    name: 'D 日光与生活',
    text: '跟着真实的光和生活的尺度走，明亮、安静、留白多。',
    refs: '参考 Daylight、Light Phone、Sunday、Mercury、Everyday、Sesame',
  },
  {
    id: 'e',
    name: 'E 玩心造物',
    text: '线描、手作和一点玩心，由物件和小角色带路。',
    refs: '参考小宇宙、Tolans、AUWA、Playdate、Hundred Rabbits、teenage engineering',
  },
  {
    id: 'show',
    name: '展览',
    text: '把首页做成一场展览，往下滚就是在逛展。',
    refs: '参考 teamLab、Refik Anadol、Gagosian、21_21 DESIGN SIGHT',
  },
];

export const pitches: Pitch[] = [
  {
    id: 'folio',
    no: '01',
    group: 'base',
    name: 'Folio 原版',
    href: '/demos/brand/folio',
    summary:
      '明亮的杂志感：巨型刊头压在剪纸拼贴上，产品像一张张整页色纸叠上来。',
    traits: ['剪纸拼贴', '高饱和色', '杂志刊头'],
  },
  {
    id: 'a1',
    no: '02',
    group: 'a',
    name: 'A · 一稿',
    href: `${PITCH}/a1`,
    summary:
      '暖纸上的树影随鼠标轻移，油画笔触的衬线字标从模糊里对焦；四幅油画图版配展签，简介写成一封信。',
    traits: ['树影', '油画图版', '信'],
  },
  {
    id: 'a2',
    no: '03',
    group: 'a',
    name: 'A · 二稿',
    href: `${PITCH}/a2`,
    summary:
      '首屏是浏览器里一笔笔画出来的金色田野；产品是一叠刊物——周报、阅读页、明信片、船票，滚上来一张压一张。',
    traits: ['现场作画', '一叠刊物', '常驻按钮'],
  },
  {
    id: 'd1',
    no: '04',
    group: 'd',
    name: 'D · 一稿',
    href: `${PITCH}/d1`,
    summary:
      '白墙读字，围桌的人从画框里扩成满屏；百叶窗影里简介逐字亮起；午后、傍晚、夜里随文字切换，最后只剩一扇暖光的窗。',
    traits: ['满屏照片', '百叶窗影', '一天的光'],
  },
  {
    id: 'd2',
    no: '05',
    group: 'd',
    name: 'D · 二稿',
    href: `${PITCH}/d2`,
    summary:
      '页面的光跟着你打开时的时刻走，首屏可以拖动「一天」；白墙上有随太阳倾斜的植物影子，产品是阳光下的纸面屏幕。',
    traits: ['实时天色', '植物影子', '纸面屏幕'],
  },
  {
    id: 'e1',
    no: '06',
    group: 'e',
    name: 'E · 一稿',
    href: `${PITCH}/e1`,
    summary:
      '墨线小角色从字标后面探头，眼睛跟着鼠标；全页只用 Logo 的杏橙；Work 是一扇带摇柄的窗，摇一格走一步。',
    traits: ['小角色', '摇柄演示', '一种颜色'],
  },
  {
    id: 'e2',
    no: '07',
    group: 'e',
    name: 'E · 二稿',
    href: `${PITCH}/e2`,
    summary:
      '一间逐笔描出来的等轴测工作室，书桌、光标、扶手椅和门通往四个产品；产品是一摞牌，往下滚时摊开。',
    traits: ['等轴测线描', '一摞牌', '四格漫画'],
  },
  {
    id: 'night',
    no: '08',
    group: 'show',
    name: '夜间展馆',
    href: `${PITCH}/night`,
    summary:
      '暗场里的展览：前厅、四个展厅、出口；鼠标是一束手电光，每个展厅随滚动开灯、看展、熄灯。',
    traits: ['暗场', '光影装置', '展厅平面图'],
  },
  {
    id: 'white',
    no: '09',
    group: 'show',
    name: '白盒子美术馆',
    href: `${PITCH}/white`,
    summary:
      '近白的墙和精确的展签；镜头随滚动走进一间间白盒子展厅，三联画、墙面文字、格线画、色域画各讲一个产品。',
    traits: ['三维展厅', '展签', '极少的颜色'],
  },
];

export const findPitch = (id: PitchId) =>
  pitches.find((pitch) => pitch.id === id) ?? pitches[0];

/** 比稿条上的完整名字，例如「A 暖纸与画框 · 一稿」「夜间展馆」 */
export const pitchLabel = (pitch: Pitch) => {
  const group = pitchGroups.find((item) => item.id === pitch.group);
  return group &&
    (pitch.group === 'a' || pitch.group === 'd' || pitch.group === 'e')
    ? `${group.name} · ${pitch.name.split(' · ')[1]}`
    : pitch.name;
};
