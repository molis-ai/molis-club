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
  // 其余各页
  {
    key: 'enterprise-colonnade',
    src: 'public/r8-candidates-v2/images/work-v2-a.png',
    widths: [960, 1672],
    quality: 76,
  },
  {
    key: 'community-line',
    src: 'public/r8-candidates-v2/images/community-v2-c.png',
    widths: [800, 1672],
    quality: 70,
  },
  {
    key: 'community-sketch',
    src: 'public/images/r8/park-ware.jpg',
    widths: [900, 1800],
    quality: 66,
  },
  {
    key: 'about-window',
    src: 'public/r8-candidates-v2/images/about-v2-b.png',
    widths: [960, 1672],
    quality: 76,
  },
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
  const jpeg = path.join(out, `${video.key}-poster.jpg`);
  const webp = path.join(out, `${video.key}-poster.webp`);
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
  const { size } = await stat(path.join(out, `${video.key}.mp4`));
  manifest[video.key] = {
    width: meta.width,
    height: meta.height,
    avg: `#${hex(data[0])}${hex(data[1])}${hex(data[2])}`,
    src: `/site/${video.key}.mp4`,
    poster: `/site/${video.key}-poster.webp`,
    rate: video.rate,
    srcset: [],
  };
  console.log(
    video.key.padEnd(22),
    `${meta.width}×${meta.height}`.padEnd(11),
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
