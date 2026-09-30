export type Direction = {
  slug: string;
  name: string;
  en: string;
  thesis: string;
  traits: string[];
  palette: string[];
};

export const directions: Direction[] = [
  {
    slug: 'daylight',
    name: '日光',
    en: 'Daylight',
    thesis:
      '以“一天的光”编排整页：清晨的首屏、正午的产品、黄昏的邀请。自然光摄影配宋体标题。',
    traits: ['自然光摄影', '宋体标题', '滚动叙事'],
    palette: ['#f7f1ea', '#19284f', '#e98f5c'],
  },
  {
    slug: 'folio',
    name: 'Folio',
    en: 'Folio',
    thesis:
      '明亮的杂志感：巨型刊头压在剪纸拼贴上，三个产品像整页色块一张张叠上来。配图全部由矢量与 CSS 绘制。',
    traits: ['剪纸拼贴', '高饱和色', '杂志刊头'],
    palette: ['#f5f0e6', '#ee4e2b', '#2d53e3', '#f6c445'],
  },
  {
    slug: 'nocturne',
    name: '夜曲',
    en: 'Nocturne',
    thesis:
      '深色、电影感，分五幕展开：WebGL 光场随鼠标流动，片头式标题逐字显影，结尾一道地平线的光。',
    traits: ['深色', '实时光场', '电影分幕'],
    palette: ['#05060a', '#f3ede4', '#ffb46b'],
  },
  {
    slug: 'cosmos',
    name: '深空',
    en: 'Cosmos',
    thesis:
      '深空观测站：首屏是三万多颗粒子组成的螺旋星系，产品化作三颗行星，滚到哪一颗，哪一颗亮起。',
    traits: ['深色', '粒子星系', '轨道切换'],
    palette: ['#04050a', '#e9c48c', '#8fb1ff'],
  },
  {
    slug: 'edition-c',
    name: 'Edition C',
    en: 'Edition C',
    thesis:
      '近白平面配满幅工作室照片，A/I 打字标题循环切换，下面用 8px 窄缝和 4px 圆角排出紧凑图组。',
    traits: ['近白平面', '满幅照片', '打字标题'],
    palette: ['#f6f6f3', '#eae9e5', '#252522'],
  },
];

export const directionSlugs = directions.map((d) => d.slug);

export const pageKinds = [
  { id: 'home', label: '首页', suffix: '' },
  { id: 'work', label: 'Molis Work', suffix: '/work' },
] as const;
export type PageKind = (typeof pageKinds)[number]['id'];

export const routeOf = (slug: string, page: PageKind) =>
  `/demos/brand/${slug}${page === 'work' ? '/work' : ''}`;

const shotSuffix = {
  large: '',
  small: '-480',
  mobile: '-mobile',
  mobileSmall: '-mobile-280',
} as const;
type ShotKind = keyof typeof shotSuffix;

export const shotOf = (slug: string, page: PageKind, size: ShotKind) =>
  `/images/demos/directions/${slug}-${page}${shotSuffix[size]}.jpg`;

export const shotSize = {
  large: { width: 1200, height: 750 },
  small: { width: 480, height: 300 },
  mobile: { width: 599, height: 1298 },
  mobileSmall: { width: 280, height: 607 },
} as const;

export const shotSet = (slug: string, page: PageKind, mobile: boolean) =>
  mobile
    ? `${shotOf(slug, page, 'mobileSmall')} 280w, ${shotOf(slug, page, 'mobile')} 599w`
    : `${shotOf(slug, page, 'small')} 480w, ${shotOf(slug, page, 'large')} 1200w`;

export const findDirection = (slug: string | null | undefined) =>
  directions.find((d) => d.slug === slug);
