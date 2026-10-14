// 选图板的数据：每个方向几套「三张一组」（首屏 / 第二页 / 结尾），每套三张光线和色调一致；
// 每个位置另有几张可替换的。选定后，网页按这里的编号取图。
// 视频来自 Mixkit（免费授权），照片来自 Unsplash（免费授权，均已筛掉付费的 Unsplash+）。

export type Pick = {
  code: string;
  kind: 'video' | 'photo';
  src: string;
  credit: string;
  /** 画面里是什么 */
  what: string;
  /** 放进网页后怎么动 */
  motion: string;
  rate?: number;
  flip?: boolean;
  focus?: string;
};

export type PickSet = {
  code: string;
  mood: string;
  /** 三张为什么放在一起不跳 */
  why: string;
  /** 三张统一的调色（CSS filter），把来自不同摄影师的画面拉到同一个色调 */
  grade: string;
  gradeNote: string;
  hero: Pick;
  ware: Pick;
  close: Pick;
};

export type Direction = {
  id: string;
  name: string;
  sets: PickSet[];
  alts: { slot: '首屏' | '第二页' | '结尾'; picks: Pick[] }[];
};

// 选图板上用轻一点的预览（360p 视频、900 宽照片），同时播很多段也不卡；做进网页时换成高清。
// 预览已取回本地（public/images/r8/picks/，原样），分享出去的静态预览不依赖素材站。
const mixkit = (id: number) => `/images/r8/picks/mixkit-${id}.mp4`;
const unsplash = (id: string) => `/images/r8/picks/unsplash-${id}.jpg`;

const still = '照片：40 秒极慢地推近一点再退回，像呼吸';
const intoWare = '照片：读到那句话时从首屏画面溶进来，同时极慢推近';
const closeIn = '照片：滚到这里时镜头从近处缓缓退远，像看全景';

export const directions: Direction[] = [
  {
    id: 'afternoon',
    name: '美术馆',
    sets: [
      {
        code: '美术馆 A',
        mood: '明亮的白',
        why: '三张都是白墙、大窗、天光：高调、柔和，几乎没有硬阴影；人都很小，空间很大。',
        grade: 'sepia(0.08) saturate(0.95) brightness(1.03)',
        gradeNote: '统一调色：微暖、略提亮',
        hero: {
          code: '美术馆 A1',
          kind: 'photo',
          src: unsplash('photo-1565742319477-fd961565e476'),
          credit: 'Unsplash @guilhermestecanella',
          what: '一个人坐在空旷的白色展厅里，长凳、整面亮墙。',
          motion: `${still}；画面很亮，字用深色。`,
        },
        ware: {
          code: '美术馆 A2',
          kind: 'photo',
          src: unsplash('photo-1752649935250-cd5df3384bcc'),
          credit: 'Unsplash @silverkblack',
          what: '明亮通透的画室，大窗透进白光，画家站在右边画一幅海景。',
          motion: `${intoWare}；人在右边，左边留给字。`,
        },
        close: {
          code: '美术馆 A3',
          kind: 'photo',
          src: unsplash('photo-1784471379380-8426702fd533'),
          credit: 'Unsplash @ianiks',
          what: '白色建筑里，阳光斜着切出大块的光，两个小小的人走过。',
          motion: `${closeIn}；光斑那块很轻地亮一下再回落。`,
        },
      },
      {
        code: '美术馆 B',
        mood: '午后的暖',
        why: '三张都是暖白墙和午后斜光，木色地面或木框，色温一致偏暖。',
        grade: 'sepia(0.18) saturate(1.05) contrast(0.95)',
        gradeNote: '统一调色：暖一档、对比略低',
        hero: {
          code: '美术馆 B1',
          kind: 'photo',
          src: unsplash('photo-1766128867459-064fcbfa8781'),
          credit: 'Unsplash @leovamexican',
          what: '挂满小画的长廊，尽头一扇亮窗，有人慢慢走过。',
          motion: `${still}。`,
        },
        ware: {
          code: '美术馆 B2',
          kind: 'photo',
          src: unsplash('photo-1752649935477-70bf4243ee23'),
          credit: 'Unsplash @silverkblack',
          what: '洒满阳光的画室，有人站在画布前作画。',
          motion: `${intoWare}。`,
        },
        close: {
          code: '美术馆 B3',
          kind: 'photo',
          src: unsplash('photo-1666185761474-5713fc7a65f8'),
          credit: 'Unsplash @kimsuzi08',
          what: '暖木长廊的尽头敞开，外面是阳光下的庭园。',
          motion: `${closeIn}。`,
        },
      },
    ],
    alts: [
      {
        slot: '首屏',
        picks: [
          {
            code: '美术馆 首屏-1',
            kind: 'photo',
            src: unsplash('photo-1778327826042-aa6ef81d897d'),
            credit: 'Unsplash @bright202310',
            what: '一个人站在整面大窗前，满屋白光。',
            motion: still,
          },
          {
            code: '美术馆 首屏-2',
            kind: 'photo',
            src: unsplash('photo-1748787007524-d4bc8c7621da'),
            credit: 'Unsplash',
            what: '现在用的这张：天光从顶上洒进白墙展厅，有人走过门洞（竖构图）。',
            motion: still,
          },
        ],
      },
      {
        slot: '第二页',
        picks: [
          {
            code: '美术馆 第二页-1',
            kind: 'photo',
            src: unsplash('photo-1752649935095-ac8f23ec446b'),
            credit: 'Unsplash @silverkblack',
            what: '同一间画室，另一个角度：有人在明亮的窗前画画。',
            motion: intoWare,
          },
        ],
      },
      {
        slot: '结尾',
        picks: [
          {
            code: '美术馆 结尾-1',
            kind: 'photo',
            src: unsplash('photo-1667992417866-33d862180421'),
            credit: 'Unsplash @kimsuzi08',
            what: '从玻璃展厅望出去的庭园和晴空（上一稿用的，与 B3 同一位摄影师）。',
            motion: closeIn,
          },
          {
            code: '美术馆 结尾-2',
            kind: 'photo',
            src: unsplash('photo-1786548989540-380315f0f97f'),
            credit: 'Unsplash @eliwest',
            what: '玻璃顶的中庭，阳光投下几何形的影子。',
            motion: closeIn,
          },
        ],
      },
    ],
  },
  {
    id: 'park',
    name: '公园',
    sets: [
      {
        code: '公园 A',
        mood: '午后的金光',
        why: '三张都是逆光：太阳在树后，草是金绿色，影子拉得很长。',
        grade: 'sepia(0.15) saturate(1.05) contrast(0.94)',
        gradeNote: '统一调色：暖、低对比',
        hero: {
          code: '公园 A1',
          kind: 'video',
          src: mixkit(40647),
          rate: 0.5,
          credit: 'Mixkit #40647',
          what: '午后的阳光穿过树林落在草坪上，镜头慢慢往前走。',
          motion: '视频：放慢到 0.5 倍，循环；首屏的字从它上面滚过去。',
        },
        ware: {
          code: '公园 A2',
          kind: 'photo',
          src: unsplash('photo-1722511735214-2fd86ca5a416'),
          credit: 'Unsplash @anamnesis33',
          what: '野餐垫上，两个人在画水彩，颜料盘和画纸铺了一地（近景）。',
          motion: `${intoWare}。`,
        },
        close: {
          code: '公园 A3',
          kind: 'photo',
          src: unsplash('photo-1787080116801-c832d6e0e486'),
          credit: 'Unsplash @fez_wee',
          what: '清早的公园，雾气从草地上升起，阳光一道道照进来，有人在雾里散步。',
          motion: `${closeIn}；雾那一层极慢地往右飘。`,
        },
      },
      {
        code: '公园 B',
        mood: '晴朗的白天',
        why: '三张都是正午的顺光：青草、蓝天、通透，颜色干净。',
        grade: 'saturate(0.95) brightness(1.03)',
        gradeNote: '统一调色：自然、略提亮',
        hero: {
          code: '公园 B1',
          kind: 'photo',
          src: unsplash('photo-1698281634195-1f18e3279de2'),
          credit: 'Unsplash @marsupialpudding',
          what: '安静的大草坪，一排树，光很均匀。',
          motion: `${still}。`,
        },
        ware: {
          code: '公园 B2',
          kind: 'photo',
          src: unsplash('photo-1770739879041-22f0dfc37301'),
          credit: 'Unsplash @julia_assis',
          what: '阳光下，一群人坐在毯子上画画，像一堂户外的画画课。',
          motion: `${intoWare}。`,
        },
        close: {
          code: '公园 B3',
          kind: 'photo',
          src: unsplash('photo-1746267497054-bd718f49fc0c'),
          credit: 'Unsplash @juliezixi0519',
          what: '蓝天下的草坡，几棵高高的柏树，人们躺在草地上晒太阳。',
          motion: `${closeIn}。`,
        },
      },
    ],
    alts: [
      {
        slot: '首屏',
        picks: [
          {
            code: '公园 首屏-1',
            kind: 'photo',
            src: unsplash('photo-1769476406578-05618cfcf6ca'),
            credit: 'Unsplash @ninjagos_pants',
            what: '阳光穿过树干落在草坪上，满地光斑。',
            motion: still,
          },
          {
            code: '公园 首屏-2',
            kind: 'photo',
            src: unsplash('photo-1779841845504-e4369d51bd71'),
            credit: 'Unsplash @gerad',
            what: '大树下的草坪，傍晚的暖光。',
            motion: still,
          },
        ],
      },
      {
        slot: '第二页',
        picks: [
          {
            code: '公园 第二页-1',
            kind: 'photo',
            src: unsplash('photo-1755187338391-91b31b053d91'),
            credit: 'Unsplash',
            what: '上一稿用的：几个人围着桌子写生，脚边趴着一只狗。',
            motion: intoWare,
          },
        ],
      },
      {
        slot: '结尾',
        picks: [
          {
            code: '公园 结尾-1',
            kind: 'photo',
            src: unsplash('photo-1776955348841-334e5d58689e'),
            credit: 'Unsplash @alphanum3ric',
            what: '低低的太阳穿过树，在草地上拉出长长的影子。',
            motion: closeIn,
          },
          {
            code: '公园 结尾-2',
            kind: 'video',
            src: mixkit(51110),
            rate: 0.5,
            credit: 'Mixkit #51110',
            what: '上一稿用的：抬头看，太阳穿过树梢，蓝天。',
            motion: '视频：放慢到 0.5 倍。',
          },
        ],
      },
    ],
  },
  {
    id: 'sky',
    name: '天空',
    sets: [
      {
        code: '天空 A',
        mood: '暖金',
        why: '三张都是被低角度阳光染暖的天：云的亮面是金色，暗面是柔和的蓝灰。',
        grade: 'sepia(0.12) contrast(0.95)',
        gradeNote: '统一调色：暖、柔',
        hero: {
          code: '天空 A1',
          kind: 'video',
          src: mixkit(12273),
          rate: 0.35,
          credit: 'Mixkit #12273',
          what: '被暖光照着的积云慢慢走（上一稿的首屏）。',
          motion: '视频：延时素材，放慢到 0.35 倍，云几乎是在呼吸。',
        },
        ware: {
          code: '天空 A2',
          kind: 'photo',
          src: unsplash('photo-1627887440505-63783eddca90'),
          credit: 'Unsplash @raspopovamarisha',
          what: '黄昏的山坡上，一个人对着画架写生，天空占了半个画面。',
          motion: `${intoWare}。`,
        },
        close: {
          code: '天空 A3',
          kind: 'video',
          src: mixkit(50160),
          rate: 0.35,
          credit: 'Mixkit #50160',
          what: '明亮的太阳和高处的薄云（上一稿的结尾）。',
          motion: '视频：放慢到 0.35 倍；进入时镜头缓缓退远。',
        },
      },
      {
        code: '天空 B',
        mood: '清晨的淡蓝',
        why: '三张都是清早：淡蓝、带一点雾气，光是散的，没有强烈的金色。',
        grade: 'brightness(1.04) saturate(0.92)',
        gradeNote: '统一调色：提亮、略降饱和，避免发灰',
        hero: {
          code: '天空 B1',
          kind: 'video',
          src: mixkit(31459),
          rate: 0.4,
          credit: 'Mixkit #31459',
          what: '柔和的蓝天，一团团白云慢慢飘过。',
          motion: '视频：放慢到 0.4 倍，循环。',
        },
        ware: {
          code: '天空 B2',
          kind: 'photo',
          src: unsplash('photo-1696416749433-f0abf2e0c524'),
          credit: 'Unsplash @styvop',
          what: '起雾的山坡上，一个女孩对着画架作画，远处是山和天。',
          motion: `${intoWare}。`,
        },
        close: {
          code: '天空 B3',
          kind: 'photo',
          src: unsplash('photo-1514454529242-9e4677563e7b'),
          credit: 'Unsplash @imclyde',
          what: '明亮的淡青色天空里，几团柔软的积云。',
          motion: `${closeIn}；云极慢地横向漂一点。`,
        },
      },
    ],
    alts: [
      {
        slot: '第二页',
        picks: [
          {
            code: '天空 第二页-1',
            kind: 'photo',
            src: unsplash('photo-1660092626225-f291ab2970b9'),
            credit: 'Unsplash @carolineveronez',
            what: '上一稿用的：夕阳下的草地上，有人对着画架写生（镜像后人在右边）。',
            motion: intoWare,
            flip: true,
          },
          {
            code: '天空 第二页-2',
            kind: 'photo',
            src: unsplash('photo-1696416750029-a1bfb7e88411'),
            credit: 'Unsplash @styvop',
            what: '与 B2 同一组：女孩拿着调色盘，侧身对着画架。',
            motion: intoWare,
          },
        ],
      },
      {
        slot: '结尾',
        picks: [
          {
            code: '天空 结尾-1',
            kind: 'photo',
            src: unsplash('photo-1567304441104-d7a7d3e4bc1b'),
            credit: 'Unsplash @cbpsc1',
            what: '淡蓝天上一缕缕粉橙色的云，清早的样子。',
            motion: closeIn,
          },
        ],
      },
    ],
  },
  {
    id: 'seaside',
    name: '海边',
    sets: [
      {
        code: '海边 A',
        mood: '清晨的柔光',
        why: '三张都是清早的海边：粉金色的天、浅浪、细沙，光很软，没有强对比。',
        grade: 'sepia(0.12) contrast(0.92) brightness(1.04)',
        gradeNote: '统一调色：柔、暖、低对比',
        hero: {
          code: '海边 A1',
          kind: 'photo',
          src: unsplash('photo-1473116763249-2faaef81ccda'),
          credit: 'Unsplash @caminouflet',
          what: '清早的海岸，天是粉金色，浪一层层轻轻铺上沙滩。',
          motion: `${still}；也可以换成同色调的视频（Mixkit #7503 海边日出）。`,
        },
        ware: {
          code: '海边 A2',
          kind: 'photo',
          src: unsplash('photo-1774959264677-a77066d641b7'),
          credit: 'Unsplash @christoph_68',
          what: '沙滩上，有人支着画架对着大海作画，远景，人很小。',
          motion: `${intoWare}。`,
        },
        close: {
          code: '海边 A3',
          kind: 'photo',
          src: unsplash('photo-1554759111-8692719ccecc'),
          credit: 'Unsplash @lianamikah',
          what: '柔和的晨光里，两个人沿着海边慢慢走。',
          motion: `${closeIn}。`,
        },
      },
      {
        code: '海边 B',
        mood: '晴朗的蓝白',
        why: '三张都是晴天正午：蓝海、白沙、通透的光，颜色干净。',
        grade: 'saturate(0.95) brightness(1.03)',
        gradeNote: '统一调色：自然、略提亮',
        hero: {
          code: '海边 B1',
          kind: 'video',
          src: mixkit(5016),
          rate: 0.6,
          credit: 'Mixkit #5016',
          what: '晴天，蓝色的浪一层层涌上白沙滩（沙上有一道随手画的线）。',
          motion: '视频：放慢到 0.6 倍，循环。',
        },
        ware: {
          code: '海边 B2',
          kind: 'photo',
          src: unsplash('photo-1772909496862-d0c371088b06'),
          credit: 'Unsplash @timoun',
          what: '俯拍：沙滩上，一个人用耙子画出一张巨大的笑脸。',
          motion: `${intoWare}。`,
        },
        close: {
          code: '海边 B3',
          kind: 'photo',
          src: unsplash('photo-1476937673710-8174834aa065'),
          credit: 'Unsplash @sxth',
          what: '晴空下宽阔的沙滩，两个人站在水边。',
          motion: `${closeIn}。`,
        },
      },
      {
        code: '海边 C',
        mood: '暖沙的金',
        why: '三张都是金色的低角度阳光：海面碎金、暖沙、长影子。',
        grade: 'sepia(0.14) contrast(0.95)',
        gradeNote: '统一调色：暖、略降对比',
        hero: {
          code: '海边 C1',
          kind: 'video',
          src: mixkit(19437),
          rate: 0.6,
          credit: 'Mixkit #19437',
          what: '清早平静的海面，阳光在浪上碎成金色（上一稿的首屏）。',
          motion: '视频：放慢到 0.6 倍，循环。',
        },
        ware: {
          code: '海边 C2',
          kind: 'photo',
          src: unsplash('photo-1762280409407-05ab194a7e14'),
          credit: 'Unsplash @tojo_09',
          what: '金色的沙滩上，两个男孩在堆沙堡。',
          motion: `${intoWare}。`,
        },
        close: {
          code: '海边 C3',
          kind: 'video',
          src: mixkit(26978),
          rate: 0.6,
          credit: 'Mixkit #26978',
          what: '日出时的海岸线，镜头沿着沙滩慢慢往前飞。',
          motion: '视频：放慢到 0.6 倍；进入时镜头缓缓退远。',
        },
      },
    ],
    alts: [
      {
        slot: '第二页',
        picks: [
          {
            code: '海边 第二页-1',
            kind: 'photo',
            src: unsplash('photo-1762280408823-704803fae082'),
            credit: 'Unsplash @tojo_09',
            what: '与 C2 同一组：一个男孩趴在沙滩上堆沙堡。',
            motion: intoWare,
          },
          {
            code: '海边 第二页-2',
            kind: 'photo',
            src: unsplash('photo-1741762055094-1304f0ebccd9'),
            credit: 'Unsplash',
            what: '上一稿用的：礁石边戴草帽的人对着大海作画（阴天，偏灰）。',
            motion: intoWare,
            flip: true,
          },
        ],
      },
      {
        slot: '结尾',
        picks: [
          {
            code: '海边 结尾-1',
            kind: 'video',
            src: mixkit(1564),
            rate: 0.6,
            credit: 'Mixkit #1564',
            what: '上一稿用的：白沙滩、蓝天、棕榈（偏热带明信片）。',
            motion: '视频：放慢到 0.6 倍。',
          },
        ],
      },
    ],
  },
];
