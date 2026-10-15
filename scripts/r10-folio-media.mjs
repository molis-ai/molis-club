// 第十轮视觉稿「作品集」（/r10/folio）的配图压缩：Molis Work 真实界面截图与负责人的雾感品牌图，按显示尺寸出 WebP，
// 记下宽高与平均色，写进 app/(site)/r10/folio/media.json。截图只缩放、不改内容。
// 截图来自 molis-work 仓库的 docs/screenshots/soft-workbench（README 里「现在的工作台」那一组），
// 默认读 /Users/creamiex/molis-ai/molis-work，可用 MOLIS_WORK_DIR 指定。需要本机能载入 sharp（依赖链里已有）：
// node scripts/r10-folio-media.mjs

import { createRequire } from 'node:module';
import { mkdir, writeFile, stat } from 'node:fs/promises';
import path from 'node:path';

const require = createRequire(import.meta.url);
const sharp = require('sharp');

const root = path.resolve(import.meta.dirname, '..');
const shots = path.join(
  process.env.MOLIS_WORK_DIR ?? '/Users/creamiex/molis-ai/molis-work',
  'docs/screenshots/soft-workbench',
);
const out = path.join(root, 'public/r10/folio');

const images = [
  // Molis Work 开发中版本的截图（演示数据）
  { key: 'shot-home', src: path.join(shots, 'home-zh.jpg'), widths: [960, 1440], quality: 86 },
  { key: 'shot-goals', src: path.join(shots, 'goals-zh.jpg'), widths: [960, 1440], quality: 86 },
  { key: 'shot-feed', src: path.join(shots, 'feed-zh.jpg'), widths: [960, 1440], quality: 86 },
  { key: 'shot-onboarding', src: path.join(shots, 'onboarding-zh.jpg'), widths: [960, 1440], quality: 86 },
  { key: 'shot-dark', src: path.join(shots, 'home-dark-zh.jpg'), widths: [960, 1440], quality: 86 },
  { key: 'shot-phone', src: path.join(shots, 'phone-zh.jpg'), widths: [390], quality: 88 },
  // 负责人的品牌概念图（雾感版，public/r8-materials-mist-v1，说明见 docs/r8-materials-assets.md）
  ...['home-a', 'home-b', 'work-a', 'work-b', 'tool-a', 'life-a', 'story-a', 'world-a'].map(
    (name) => ({
      key: `mist-${name}`,
      src: `public/r8-materials-mist-v1/images/${name}.png`,
      widths: [960, 1672],
      quality: 76,
    }),
  ),
];

const manifest = {};
await mkdir(out, { recursive: true });
for (const image of images) {
  const input = path.isAbsolute(image.src) ? image.src : path.join(root, image.src);
  const meta = await sharp(input).metadata();
  const srcset = [];
  for (const width of image.widths) {
    const file = `${image.key}-${width}.webp`;
    await sharp(input)
      .resize({ width: Math.min(width, meta.width), withoutEnlargement: true })
      .webp({ quality: image.quality, effort: 6 })
      .toFile(path.join(out, file));
    const { size } = await stat(path.join(out, file));
    srcset.push([`/r10/folio/${file}`, Math.min(width, meta.width)]);
    console.log(file, `${Math.round(size / 1024)} KB`);
  }
  const { channels } = await sharp(input).stats();
  const [r, g, b] = channels.map((c) => Math.round(c.mean));
  const largest = srcset[srcset.length - 1];
  manifest[image.key] = {
    src: largest[0],
    srcset,
    width: meta.width,
    height: meta.height,
    color: `rgb(${r} ${g} ${b})`,
  };
}
await writeFile(
  path.join(root, 'app/(site)/r10/folio/media.json'),
  `${JSON.stringify(manifest, null, 2)}\n`,
);
