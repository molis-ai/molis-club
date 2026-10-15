// 「关于」做成同一位作者的一场展（负责人 2026-10-15 定）：顶栏「关于」下的四个页面是四间主题不同的展厅——
// 01 认识我们（人）· 02 我们相信什么（光）· 03 文章（问，2026-10-16 加）· 04 沿途（路）。参考 noguchi.org 与 normcph.com：
// 大图、小字、展签式的说明，每间展厅一种墙色；四间用同一套展签、同一张平面图，走到头有「下一个展厅」。
// 这里只放新写的界面文字：展厅名牌、展品标题、媒介与署名、替代文字。
// 展品旁边「诉说」的那一句一律取自底稿原句（各页从 studio.ts、team.ts、along.ts 读，不在这里重写）。
// 摄影来自 Unsplash（免费授权；署名 2026-10-15 在各张照片页核对），展签上只写摄影者的名字，来源写在全站页尾；
// 画面里的人不是团队成员，不作产品事实；
// 标「AI 生成影像」的是 Molis 品牌图库里的图。

import { nav } from './nav';

export type RoomId = 'people' | 'light' | 'read' | 'road';

export type Room = {
  id: RoomId;
  no: string;
  /** 展厅名就是顶栏「关于」下拉里的名字 */
  name: string;
  /** 这间展厅的主题：一个字 */
  theme: string;
  en: string;
};

export const rooms: Room[] = [
  {
    id: 'people',
    no: '01',
    name: nav.aboutItems.team,
    theme: '人',
    en: 'People',
  },
  {
    id: 'light',
    no: '02',
    name: nav.aboutItems.about,
    theme: '光',
    en: 'Light',
  },
  {
    id: 'read',
    no: '03',
    name: nav.aboutItems.essays,
    theme: '问',
    en: 'Questions',
  },
  { id: 'road', no: '04', name: nav.aboutItems.along, theme: '路', en: 'Road' },
];

type Medium = 'photo' | 'ai' | 'drawing' | 'interactive';

export type Piece = {
  /** 展签上的标题（新写） */
  title: string;
  medium: Medium;
  /** 摄影者（Unsplash 上的署名） */
  by?: string;
  alt?: string;
};

/** 展品：键名与 app/_site/media.json 一致（线描与互动装置不是图，没有对应的图） */
export const pieces = {
  // 展厅 01 · 人
  'team-table': {
    title: '一张长桌，椅子各不相同',
    medium: 'ai',
    alt: '阳光里的一张长木桌，几把样式各不相同的椅子围着它，桌上摊着几张纸；一面是砖墙，一面是开向花园的大窗。',
  },
  'team-sketchbook': {
    title: '翻过去的每一页',
    medium: 'ai',
    alt: '窗台上摊开一本速写本，蓝墨画着海岸；一页半透明的纸正被翻起，书签带垂在外面，旁边一杯水投下光斑。',
  },
  'ex-car-sea': {
    title: '车窗外的海',
    medium: 'photo',
    by: 'Joshua Newton',
    alt: '车里的人侧着脸望向窗外，窗外是灰白的海，远处几只小帆船。',
  },
  'team-wind': {
    title: '借风作画的小机器',
    medium: 'ai',
    alt: '海边的石台上，一台小装置借风转动，握着铅笔在木框里的纸上画出细线；远处是海和两块礁石。',
  },
  'ex-painter-water': {
    title: '水边写生',
    medium: 'photo',
    by: 'Gennady Zakharin',
    alt: '戴草帽、穿白色针织衫的人站在湖边栏杆旁，画架上是一幅小小的风景画，颜料盒摊在木板上。',
  },
  'ex-painter-blossom': {
    title: '一棵开花的树',
    medium: 'photo',
    by: 'Anastasiia Pyvovarova',
    alt: '一个人坐在林间空地上，用粉彩画一棵开满粉花的树，旁边的小凳上摆着一盒用短了的粉彩。',
  },
  'ex-young-artist': {
    title: '午后画室',
    medium: 'photo',
    by: 'Vitaly Gariev',
    alt: '阳光照进画室，一个女孩站在大窗前端详手里的画，墙上挂着几幅小油画，前景是一排画架。',
  },
  'ex-room-plants': {
    title: '窗边的灯架与植物',
    medium: 'photo',
    by: 'Bianca Maria',
    alt: '黑白照片：一间靠窗的工作室，纸灯笼、灯架、几盆龟背竹，角落露出钢琴的一角。',
  },
  'ex-desk-forest': {
    title: '林子边上的书桌',
    medium: 'photo',
    by: 'Bundo Kim',
    alt: '一张堆满小物件的书桌，台灯、书和小画框挨在一起，窗外是一片绿树林。',
  },
  'team-island': {
    title: '一座尚未命名的小岛',
    medium: 'ai',
    alt: '木桌上一座手作的小岛模型：两间白墙小屋、一座小木桥、一棵开花的树和一汪浅水。',
  },
  'life-shore': {
    title: '海边的孩子',
    medium: 'ai',
    alt: '海边，一个孩子站在水边。',
  },
  'ex-shore-person': {
    title: '站在水边的人',
    medium: 'photo',
    by: 'zero take',
    alt: '雪白的沙滩尽头，一个穿深色大衣的人站在蓝绿色的海边。',
  },

  // 展厅 02 · 光
  'about-window': {
    title: '窗前的人',
    medium: 'ai',
    alt: '白色的展厅里，一整面落地窗，一个人站在窗前，远远看着窗外的树和天。',
  },
  'ex-window-sun': {
    title: '光照进来',
    medium: 'photo',
    by: 'Frolicsome Fairy',
    alt: '阳光从老式木窗斜照进屋，在窗边的桌子上拉出一道光。',
  },
  trio: { title: '起稿、修改、完成', medium: 'interactive' },
  'ex-dancer': {
    title: '一支跳到一半的舞',
    medium: 'photo',
    by: 'Ahmad Odeh',
    alt: '暗场的舞台上，一位舞者转身扬手，长曝光把她的动作拉成一圈圈光。',
  },
  'ex-window-blinds': {
    title: '百叶窗下的小苗',
    medium: 'photo',
    by: 'MIROV',
    alt: '昏暗的屋里，一扇旧木窗半拉着百叶，窗台上一个小花盆，几根细苗朝着光。',
  },
  'ex-field-flowers': {
    title: '抱着花跑过去',
    medium: 'photo',
    by: 'Céline Cao',
    alt: '戴草帽的人抱着一大束野花跑过开满白花的草地，身影被拍得有些虚。',
  },
  'ex-viewer': {
    title: '海边的望远镜',
    medium: 'photo',
    by: 'Fallon Michael',
    alt: '黑白照片：海边栏杆旁，一个人凑近观景望远镜往远处看。',
  },
  'ex-field-arms': {
    title: '张开手臂',
    medium: 'photo',
    by: 'Céline Cao',
    alt: '阴天的绿坡上，一个穿黑裙的人背对镜头张开双臂，草里开着几朵蒲公英。',
  },
  'ex-paper-plane': {
    title: '放出去的纸飞机',
    medium: 'photo',
    by: 'Abolfazl Ranjbar',
    alt: '白墙前，一只红色纸飞机刚离手，墙上留着一只手模糊的影子。',
  },
  'ex-skylight': {
    title: '天窗的格子',
    medium: 'photo',
    by: 'Julia Taubitz',
    alt: '白墙高处一扇玻璃天窗，阳光把窗格的影子斜斜印在墙上。',
  },

  // 展厅 03 · 路
  'ex-dawn-field': {
    title: '雾里的黎明',
    medium: 'photo',
    by: 'Damian Kravchuk',
    alt: '黎明时分，粉色的云下一片田野，远处一排树浮在薄雾里。',
  },
  'ex-handlebar': {
    title: '出发',
    medium: 'photo',
    by: 'Florian Kurrasch',
    alt: '骑车的人握着橙色的车把，沿着傍晚的路往太阳的方向骑。',
  },
  'ex-balloon': {
    title: '麦田上空的热气球',
    medium: 'photo',
    by: 'Pascal Debrunner',
    alt: '清晨的麦田一直铺到树林，远处天上飘着一只小小的热气球。',
  },
  'ex-cyclist': {
    title: '地平线上骑车的人',
    medium: 'photo',
    by: 'Jay Kudva',
    alt: '夕阳里，一个人骑着自行车经过草地的地平线，只剩一个剪影。',
  },
  'ex-dawn-bird': {
    title: '雾里的太阳和一只鸟',
    medium: 'photo',
    by: 'Phước Sang',
    alt: '浓雾里太阳只是一个亮圈，田边的树影影绰绰，一只鸟飞过。',
  },
  river: { title: '一条河', medium: 'drawing' },
  'ex-field-grass': {
    title: '风吹过草',
    medium: 'photo',
    by: 'Joana Abreu',
    alt: '阴天下的一片草地，长长的草穗被风吹弯，草里开着细碎的白花。',
  },
  // 展厅 03 目录里的八组，一组一件，编号随组号（负责人 2026-10-16 挑的）
  'ex-writer': {
    title: '在桌前写下来',
    medium: 'photo',
    by: 'Alexandre Pascal',
    alt: '一个人伏在靠墙的木桌前往本子上写字，旁边立着一本摊开的书和一盆植物。',
  },
  'ex-cloud-watch': {
    title: '等云散开',
    medium: 'photo',
    by: 'Kamil Klyta',
    alt: '一个人站在山上的栏杆边，背对镜头望着翻涌的云，云后露出一座雪山的尖。',
  },
  'ex-wax-seal': {
    title: '封好，再寄出去',
    medium: 'photo',
    by: 'Raymond Petrik',
    alt: '木桌上摆着几封写好名字的信，一只手按住信封，另一只手把印章压进红色的火漆。',
  },
  'ex-eggshell': {
    title: '厨房里的一点光',
    medium: 'photo',
    by: 'Sebastian Schuster',
    alt: '阳光斜照进厨房，白毛巾上放着一把切下的青菜梗和两片蛋壳。',
  },
  'ex-white-door': {
    title: '一扇开着的门',
    medium: 'photo',
    by: 'Joe Green',
    alt: '纯白的房间里，墙上开着一扇门，门里是黑的，光亮的地面映出门的倒影。',
  },
  'ex-night-desk': {
    title: '深夜还亮着的灯',
    medium: 'photo',
    by: 'Javier Haro',
    alt: '夜里，一个戴宽檐帽的人伏在木桌前画画，一盏小灯照亮纸面。',
  },
  'ex-seed-hands': {
    title: '把种子放到手心',
    medium: 'photo',
    by: 'Timothé Durand',
    alt: '几个人围在一起，一个人摊开手掌，掌心是一小撮种子，旁边的人伸手来取。',
  },
  'ex-plan-sketch': {
    title: '还在纸上的房子',
    medium: 'photo',
    by: 'Ryan Ancill',
    alt: '工作台上摊着一张手绘的房屋草图，旁边是马克笔、胶带和打印出来的图纸。',
  },
  // 展厅 03 · 问（文章）：阅览室的窗、摊开的长桌，两篇各一件
  'ex-library-window': {
    title: '书架之间的窗',
    medium: 'photo',
    by: 'Jameson Berrios',
    alt: '老图书馆里，一扇高高的窗夹在两排顶到天花板的深色书架之间，窗外的光是白的。',
  },
  'ex-sun-table': {
    title: '摊开的长桌',
    medium: 'photo',
    by: 'LISK OBE',
    alt: '昏暗的阅览室里，一张长木桌从近处伸向窗边，桌面上落着几块阳光。',
  },
  'ex-hand-book': {
    title: '按住正在读的那一页',
    medium: 'photo',
    by: 'Kira Porotikova',
    alt: '一只戴着红黑手绳的手按在摊开的书页上，斜进来的阳光照亮了半页字。',
  },
  'ex-workbench': {
    title: '窗边的工作台',
    medium: 'photo',
    by: 'Nacho Gimeno Guerrero',
    alt: '木工房里靠窗的工作台，台面上摆满锯、刨子和各种工具，窗外的光照进来。',
  },
} satisfies Record<string, Piece>;

export type PieceKey = keyof typeof pieces;

/** 展厅里的界面文字（新写） */
export const exUi = {
  show: '关于 Molis AI',
  room: '展厅',
  theme: '主题',
  plan: '展厅平面图',
  here: '你在这里',
  next: '下一个展厅',
  first: '回到第一个展厅',
  medium: {
    photo: '摄影',
    ai: 'AI 生成影像',
    drawing: '线描',
    interactive: '互动装置',
  } satisfies Record<Medium, string>,
  source: { ai: 'Molis 图库' },
};
