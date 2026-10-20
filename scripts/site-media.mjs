// 新站配图的本地压缩：按显示尺寸出几档宽度的 WebP，记下宽高与平均色（载入前铺底），写进 app/_site/media.json。
// 素材清单按 specs/site-rebuild/spec.md 第 8 节；原图留在 public/images/r8/ 与 public/r8-candidates-v2/images/，
// 只读不改。需要本机能载入 sharp（npm 依赖链里已有，不新增依赖）：node scripts/site-media.mjs
// 视频先用 scripts/encode-video.swift 重新编码（输出 public/site/<名字>.mp4 与 <名字>-poster.jpg），
// 这里把封面帧压成 WebP、记下平均色，并删掉中间的 JPEG。

import { createRequire } from 'node:module';
import { mkdir, writeFile, stat, unlink } from 'node:fs/promises';
import path from 'node:path';

const require = createRequire(import.meta.url);
const sharp = require('sharp');

const root = path.resolve(import.meta.dirname, '..');
const out = path.join(root, 'public/site');

/** key：页面里引用的名字；widths：按版面最大显示宽度的 1x / 2x 取档 */
const images = [
  // 首页前两屏（满幅背景，已定）
  {
    key: 'seaside-hero',
    src: 'public/images/r8/seaside-hero.jpg',
    widths: [1280, 1920, 2200],
    quality: 74,
  },
  {
    key: 'seaside-ware',
    src: 'public/images/r8/seaside-ware.jpg',
    widths: [1280, 1920, 2200],
    quality: 74,
  },
  // 首页结尾：从窄缝开到满幅
  {
    key: 'home-garden',
    src: 'public/r8-candidates-v2/images/home-v2-a.png',
    widths: [960, 1672],
    quality: 76,
  },
  // 产品页的窗
  {
    key: 'work-studio',
    src: 'public/r8-candidates-v2/images/work-v2-c.png',
    widths: [800, 1672],
    quality: 76,
  },
  {
    key: 'tool-light',
    src: 'public/r8-candidates-v2/images/tool-v2-a.png',
    widths: [800, 1672],
    quality: 78,
  },
  {
    key: 'life-shore',
    src: 'public/r8-candidates-v2/images/life-v2-b.png',
    widths: [800, 1672],
    quality: 76,
  },
  {
    key: 'world-woods',
    src: 'public/images/r8/park-hero.jpg',
    widths: [900, 1800],
    quality: 68,
  },
  // 企业合作（负责人 2026-10-15 选的三张）：
  // 首屏满幅：挂满小画的白色长廊，尽头一扇亮窗（第八轮选图板 B1，Unsplash @leovamexican；
  // 选图板那张只有 900 宽，负责人同意后从 Unsplash 另取 2400 宽的同一张，免费授权）；
  // 结尾配表单：窗边摊着手稿的木桌（品牌图库雾感调色版）。路线之后原有一屏白柱廊，负责人 2026-10-15 删去；
  // 合作路线开头：一双手在木桌上组装一件小木工具（品牌图库 M11 雾感调色版，负责人 2026-10-15 要求给这一屏配图）
  {
    key: 'enterprise-gallery',
    src: 'public/images/r8/picks/unsplash-photo-1766128867459-064fcbfa8781-2400.jpg',
    widths: [1280, 1920, 2400],
    quality: 76,
  },
  {
    key: 'enterprise-desk',
    src: 'public/r8-materials-mist-v1/images/work-a.png',
    widths: [800, 1672],
    quality: 78,
  },
  {
    key: 'enterprise-hands',
    src: 'public/r8-materials-mist-v1/images/work-b.png',
    widths: [800, 1536],
    quality: 78,
  },
  // 企业合作第三屏（负责人 2026-10-19：换图、满幅、沉浸地过渡）：Molis 官方图库（molis-ai/molis-image-library）的四张候选，
  // 原图是 3072–3344 宽的 PNG（6–7 MB），这里放缩到 2400 宽的 JPEG（public/images/library/）。
  // 默认是「人-03 长桌尽头还有山」；其余三张在 /enterprise?plate=b|c|d 对照，选定后删掉另外三张
  ...[
    { key: 'enterprise-vista-a', file: 'human-03' },
    { key: 'enterprise-vista-b', file: 'community-02' },
    { key: 'enterprise-vista-c', file: 'community-06' },
    { key: 'enterprise-vista-d', file: 'human-01' },
  ].map(({ key, file }) => ({
    key,
    src: `public/images/library/${file}.jpg`,
    widths: [1280, 1920, 2400],
    quality: 76,
  })),
  // 其余各页
  // 社区（负责人 2026-10-15 定的方向）：结尾沙上那道线改成画出来的，不再用照片；「带点什么走」满幅是比稿 D1 那张围桌的人
  // （桌上有小牛摆件和带触角的小玩偶）；「再带点什么回来」满幅是品牌图库社区 A 雾感版（树下挂着各自的颜色）；
  // 方法目录配比稿 E1 的铅笔插画（两只手沿虚线摆小房子）。原来孩子写生那张不再用
  {
    key: 'community-table',
    src: 'public/images/atelier/makers-studio.jpg',
    widths: [1280, 1672],
    quality: 74,
  },
  {
    key: 'community-colors',
    src: 'public/r8-materials-mist-v1/images/community-a.png',
    widths: [1280, 1672],
    quality: 76,
  },
  {
    key: 'community-blocks',
    src: 'public/images/line-engineering.jpg',
    widths: [800, 1536],
    quality: 80,
  },
  {
    key: 'about-window',
    src: 'public/r8-candidates-v2/images/about-v2-b.png',
    widths: [960, 1672],
    quality: 76,
  },
  // 团队「认识我们」（负责人 2026-10-15 定的六屏）：品牌图库原图，不用雾感版。
  // 首屏长桌（椅子各不相同）、来时路的速写本、黑客与画家「风的手稿」、想做的事的手作小岛；
  // 结尾海边的孩子沿用 life-shore，不另出一份
  {
    key: 'team-table',
    src: 'public/r8-materials-v1/images/business-a.png',
    widths: [960, 1672],
    quality: 76,
  },
  {
    key: 'team-sketchbook',
    src: 'public/r8-materials-v1/images/story-a.png',
    widths: [800, 1536],
    quality: 76,
  },
  {
    key: 'team-wind',
    src: 'public/r8-materials-v1/images/home-b.png',
    widths: [960, 1672],
    quality: 76,
  },
  {
    key: 'team-island',
    src: 'public/r8-materials-v1/images/world-a.png',
    widths: [800, 1672],
    quality: 76,
  },
  // 关于「黑客与画家」（负责人 2026-10-18 定）：达·芬奇《吉内薇拉·德·班琪》，华盛顿国家美术馆藏，公有领域。
  // 原图是维基共享资源上 10483×11110 的扫描（Google Art Project），太大不进仓库；这里放三层：
  // 整幅缩到 2600 高；杜松与天空交界一带 4200×4200 缩一半；终点附近 1600×1600 原样。
  // 三层在原图里的位置写在 app/(site)/about/painters.tsx，推近时叠在一起。
  {
    key: 'ginevra-whole',
    src: 'public/images/ginevra/whole.jpg',
    widths: [2000],
    quality: 78,
  },
  {
    key: 'ginevra-near',
    src: 'public/images/ginevra/near.jpg',
    widths: [1800],
    quality: 72,
  },
  {
    key: 'ginevra-edge',
    src: 'public/images/ginevra/edge.jpg',
    widths: [1600],
    quality: 78,
  },
  // 关于的三个展厅（负责人 2026-10-15 从 Unsplash 第三轮候选里挑的 21 张，免费授权，取 2400 宽；
  // 摄影者署名与展签写在 content/site/exhibit.ts）。展厅三的开场图是横幅，多出一档宽的
  ...[
    { key: 'ex-painter-water', id: '1780007193348-bd21e473dbf7' },
    { key: 'ex-painter-blossom', id: '1557178908-438a334af016' },
    { key: 'ex-young-artist', id: '1752649937079-91226d0b5084' },
    { key: 'ex-room-plants', id: '1768076954980-e387a18d0b2a' },
    { key: 'ex-desk-forest', id: '1758383965264-b871a14bfff5' },
    { key: 'ex-car-sea', id: '1488204900407-c88697235ac5' },
    { key: 'ex-shore-person', id: '1700748881202-3c6e94c3b1ce' },
    { key: 'ex-window-sun', id: '1714153760214-5e86aa688fc3' },
    { key: 'ex-dancer', id: '1529229504105-4ea795dcbf59' },
    { key: 'ex-window-blinds', id: '1775129341637-ba2163ddd944' },
    { key: 'ex-field-flowers', id: '1761745806972-9fba05b07b2a' },
    { key: 'ex-viewer', id: '1578730186202-89a8d433e519' },
    { key: 'ex-field-arms', id: '1762515303947-cef3ea72386d' },
    { key: 'ex-paper-plane', id: '1630218891212-fa9fbaf4c218' },
    { key: 'ex-skylight', id: '1774021793820-40681dd5ef4c' },
    {
      key: 'ex-dawn-field',
      id: '1764900318742-029074f3bbf5',
      widths: [1280, 2000],
    },
    { key: 'ex-handlebar', id: '1475666675596-cca2035b3d79' },
    { key: 'ex-balloon', id: '1778236262726-452ab6686b0f' },
    { key: 'ex-cyclist', id: '1519583272095-6433daf26b6e' },
    { key: 'ex-dawn-bird', id: '1772868609645-cb249538601e' },
    { key: 'ex-field-grass', id: '1632061046569-e38a8b90ee0d' },
    // 沿途目录的八组各挂一张（负责人 2026-10-16 从第四轮候选里挑的），竖幅、只占四栏宽
    { key: 'ex-writer', id: '1685661241913-84a6468c8ff2', widths: [640, 1200] },
    {
      key: 'ex-cloud-watch',
      id: '1712260101910-f046c92195ef',
      widths: [640, 1200],
    },
    {
      key: 'ex-wax-seal',
      id: '1774891937648-68c7bfd6d035',
      widths: [640, 1200],
    },
    {
      key: 'ex-eggshell',
      id: '1789516154634-2ee2350bc9e5',
      widths: [640, 1200],
    },
    {
      key: 'ex-white-door',
      id: '1547304206-e2e68bae3729',
      widths: [640, 1200],
    },
    {
      key: 'ex-night-desk',
      id: '1634021086770-12b626224f7a',
      widths: [640, 1200],
    },
    {
      key: 'ex-seed-hands',
      id: '1689601256066-7d31d73dbe46',
      widths: [640, 1200],
    },
    {
      key: 'ex-plan-sketch',
      id: '1599420186985-5c3d1a038e84',
      widths: [640, 1200],
    },
    // 展厅 03「文章」（负责人 2026-10-16 让我从第四轮候选里挑的）
    { key: 'ex-library-window', id: '1782530707382-fdb15bf93789' },
    { key: 'ex-sun-table', id: '1776090188043-402fc41c4f5d' },
    { key: 'ex-hand-book', id: '1589793241881-37eef79add7d' },
    { key: 'ex-workbench', id: '1724182507700-bccac8d02859' },
  ].map(({ key, id, widths = [800, 1600] }) => ({
    key,
    src: `public/images/r8/picks/unsplash-photo-${id}-2400.jpg`,
    widths,
    quality: 76,
  })),
  {
    key: 'contact-door',
    src: 'public/images/r8/afternoon-hero-girl-b.png',
    widths: [600, 1024],
    quality: 78,
  },
  // 社区里艺术家 Skill 的 AI 创作试样（原图留给评审页，这里另出压缩版）
  {
    key: 'artist-monet-impressionism',
    src: 'public/images/artists/monet-pond.jpg',
    widths: [720, 1440],
    quality: 76,
  },
  {
    key: 'artist-dali-surrealism',
    src: 'public/images/artists/dali-forest.jpg',
    widths: [720, 1440],
    quality: 76,
  },
  {
    key: 'artist-wes-anderson-poster',
    src: 'public/images/artists/wes-lake.jpg',
    widths: [720, 1440],
    quality: 76,
  },
];

/** 视频：src 是重新编码后的文件；rate 是播放速度（延时素材放慢到让人静下来的速度） */
const videos = [
  // 首页首屏的天空：只留前 7.6 秒（再往后积云底部转暗、乌云压上来），比 Story 页再放慢一档；
  // 第四屏的画室：美术馆午后那段原样 1280 宽。这两段用系统自带的 avconvert 直接截取
  // （PresetPassthrough，不重新编码），封面帧沿用 story-sky / about-painting 的同一帧。
  // 同一段天空按原慢速节奏插帧，生成方法见 prepare-home-sky.mjs；封面仍用原帧。
  { key: 'home-sky', file: 'home-sky-smooth', rate: 1, posterTime: 0.5 / 0.24 },
  // 第一条试片先以 0.55 倍节奏补到 30 fps，浏览器正常速度播放；循环位移仍待处理。
  { key: 'home-seaside', file: 'home-seaside-calm', rate: 1, posterTime: 0 },
  // B 独立使用 2x 重采样版本；封面沿用原尺寸，视频元数据以导出尺寸为准。
  {
    key: 'home-seaside-detail',
    file: 'home-seaside-calm-detail',
    posterKey: 'home-seaside',
    width: 2352,
    height: 1568,
    rate: 1,
    posterTime: 0,
  },
  { key: 'home-painting', rate: 0.8 },
  { key: 'story-sky', rate: 0.35 },
  { key: 'about-painting', rate: 0.8 },
  { key: 'about-coast', rate: 0.6 },
];

const hex = (n) => n.toString(16).padStart(2, '0');

await mkdir(out, { recursive: true });
const manifest = {};
for (const image of images) {
  const input = path.join(root, image.src);
  const meta = await sharp(input).metadata();
  // 平均色：缩到 1×1 再读那一个像素
  const { data } = await sharp(input)
    .resize(1, 1, { fit: 'fill' })
    .removeAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  const avg = `#${hex(data[0])}${hex(data[1])}${hex(data[2])}`;
  const srcset = [];
  for (const width of image.widths) {
    const w = Math.min(width, meta.width);
    const file = `${image.key}-${w}.webp`;
    await sharp(input)
      .resize({ width: w, withoutEnlargement: true })
      .webp({ quality: image.quality, effort: 6, smartSubsample: true })
      .toFile(path.join(out, file));
    const { size } = await stat(path.join(out, file));
    srcset.push({ src: `/site/${file}`, w, kb: Math.round(size / 1024) });
  }
  manifest[image.key] = {
    width: meta.width,
    height: meta.height,
    avg,
    src: srcset[srcset.length - 1].src,
    srcset: srcset.map(({ src, w }) => [src, w]),
  };
  console.log(
    image.key.padEnd(22),
    `${meta.width}×${meta.height}`.padEnd(11),
    avg,
    srcset.map(({ w, kb }) => `${w}w ${kb}KB`).join(' · '),
  );
}

for (const video of videos) {
  const posterKey = video.posterKey ?? video.key;
  const jpeg = path.join(out, `${posterKey}-poster.jpg`);
  const webp = path.join(out, `${posterKey}-poster.webp`);
  const exists = await stat(jpeg).catch(() => null);
  if (exists) {
    await sharp(jpeg).webp({ quality: 74, effort: 6 }).toFile(webp);
    await unlink(jpeg);
  }
  const meta = await sharp(webp).metadata();
  const { data } = await sharp(webp)
    .resize(1, 1, { fit: 'fill' })
    .removeAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  const { size } = await stat(path.join(out, `${video.file ?? video.key}.mp4`));
  manifest[video.key] = {
    width: video.width ?? meta.width,
    height: video.height ?? meta.height,
    avg: `#${hex(data[0])}${hex(data[1])}${hex(data[2])}`,
    src: `/site/${video.file ?? video.key}.mp4`,
    poster: `/site/${posterKey}-poster.webp`,
    rate: video.rate,
    ...(video.posterTime === undefined ? {} : { posterTime: video.posterTime }),
    srcset: [],
  };
  console.log(
    video.key.padEnd(22),
    `${manifest[video.key].width}×${manifest[video.key].height}`.padEnd(11),
    `${Math.round(size / 1024)}KB mp4`,
  );
}

// Logo：原图 1254px、800 多 KB；顶栏只显示 30px。按原图等比缩小出 2x / 3x 两档 PNG（不改图形、不调色）
for (const size of [64, 96]) {
  await sharp(path.join(root, 'public/images/molis-logo.png'))
    .resize(size, size)
    .png({ compressionLevel: 9 })
    .toFile(path.join(out, `molis-logo-${size}.png`));
}

await writeFile(
  path.join(root, 'app/_site/media.json'),
  `${JSON.stringify(manifest, null, 2)}\n`,
);
