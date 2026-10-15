// 第十轮视觉稿「一卷手卷」（/r10/scroll）的配图：负责人的品牌概念图（雾感版）压成几档宽度的 WebP；
// Molis Work 的界面截图原样压缩、不调色。fog 只给没有雾感版的照片用（压缩时一并调成雾色）。输出到 public/r10/scroll/，清单写进 app/(site)/r10/scroll/media.json。
// 截图从 Molis Work 仓库的 docs/screenshots/soft-workbench/ 读（README 里「现在的工作台」那一组）：
//   MOLIS_WORK=/path/to/molis-work node scripts/r10-scroll-media.mjs
// 不写 MOLIS_WORK 时按主目录旁边的 ../molis-work 找。

import { createRequire } from 'node:module';
import { mkdir, writeFile, stat } from 'node:fs/promises';
import path from 'node:path';

const require = createRequire(import.meta.url);
const sharp = require('sharp');

const root = path.resolve(import.meta.dirname, '..');
const work = process.env.MOLIS_WORK ?? path.resolve(root, '../molis-work');
const out = path.join(root, 'public/r10/scroll');
const manifestFile = path.join(root, 'app/(site)/r10/scroll/media.json');

const mist = (name) => `public/r8-materials-mist-v1/images/${name}.png`;
const shot = (name) =>
  path.join(work, 'docs/screenshots/soft-workbench', `${name}.jpg`);

/** fog：调成雾色时保留的饱和度（越绿的照片压得越多）；widths：按版面最大显示宽度取档 */
const images = [
  // 长卷五段风景与卷后一屏：负责人 2026-10-15 的品牌概念图，用雾感版（public/r8-materials-mist-v1，已调好色，这里不再调）
  { key: 'work-a', src: mist('work-a'), widths: [960, 1672] },
  { key: 'tool-a', src: mist('tool-a'), widths: [960, 1672] },
  { key: 'life-a', src: mist('life-a'), widths: [960, 1672] },
  { key: 'story-a', src: mist('story-a'), widths: [960, 1536] },
  { key: 'world-a', src: mist('world-a'), widths: [960, 1672] },
  { key: 'home-a', src: mist('home-a'), widths: [1200, 1672] },
  // Work 页的第二屏照片
  { key: 'work-b', src: mist('work-b'), widths: [1200, 1536] },
  // Molis Work 开发中版本截图（不调色）
  {
    key: 'work-onboarding',
    src: shot('onboarding-zh'),
    widths: [960, 1440],
    quality: 86,
  },
  { key: 'work-home', src: shot('home-zh'), widths: [960, 1440], quality: 86 },
  { key: 'work-feed', src: shot('feed-zh'), widths: [960, 1440], quality: 86 },
  {
    key: 'work-goals',
    src: shot('goals-zh'),
    widths: [960, 1440],
    quality: 86,
  },
  {
    key: 'work-dark',
    src: shot('home-dark-zh'),
    widths: [960, 1440],
    quality: 86,
  },
];

const hex = (n) => n.toString(16).padStart(2, '0');

/** 雾：先降饱和，再把明暗压进奶油色的区间（暗部抬到暖灰，亮部落到纸色） */
const fog = (pipeline, saturation) =>
  pipeline
    .modulate({ saturation, brightness: 1.02 })
    .linear([0.78, 0.78, 0.76], [40, 37, 31]);

await mkdir(out, { recursive: true });
const manifest = {};
for (const image of images) {
  const input = path.isAbsolute(image.src)
    ? image.src
    : path.join(root, image.src);
  const meta = await sharp(input).metadata();
  const base = () => (image.fog ? fog(sharp(input), image.fog) : sharp(input));
  const { data } = await base()
    .resize(1, 1, { fit: 'fill' })
    .removeAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  const avg = `#${hex(data[0])}${hex(data[1])}${hex(data[2])}`;
  const srcset = [];
  for (const width of image.widths) {
    const w = Math.min(width, meta.width);
    const file = `${image.key}-${w}.webp`;
    await base()
      .resize({ width: w, withoutEnlargement: true })
      .webp({ quality: image.quality ?? 72, effort: 6, smartSubsample: true })
      .toFile(path.join(out, file));
    const { size } = await stat(path.join(out, file));
    srcset.push({ src: `/r10/scroll/${file}`, w, kb: Math.round(size / 1024) });
  }
  manifest[image.key] = {
    width: meta.width,
    height: meta.height,
    avg,
    src: srcset[srcset.length - 1].src,
    srcset: srcset.map(({ src, w }) => [src, w]),
  };
  console.log(
    image.key.padEnd(18),
    `${meta.width}×${meta.height}`.padEnd(11),
    avg,
    srcset.map(({ w, kb }) => `${w}w ${kb}KB`).join(' · '),
  );
}
await writeFile(manifestFile, `${JSON.stringify(manifest, null, 2)}\n`);
