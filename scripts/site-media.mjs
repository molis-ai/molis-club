// 新站配图的本地压缩：按显示尺寸出几档宽度的 WebP，记下宽高与平均色（载入前铺底），写进 app/_site/media.json。
// 素材清单按 specs/site-rebuild/spec.md 第 8 节；原图留在 public/images/r8/ 与 public/r8-candidates-v2/images/，
// 只读不改。需要本机能载入 sharp（npm 依赖链里已有，不新增依赖）：node scripts/site-media.mjs
// 视频不在这里处理：用 macOS 自带的 avconvert 重新编码，见 DESIGN.md「配图与视频」。

import { createRequire } from 'node:module';
import { mkdir, writeFile, stat } from 'node:fs/promises';
import path from 'node:path';

const require = createRequire(import.meta.url);
const sharp = require('sharp');

const root = path.resolve(import.meta.dirname, '..');
const out = path.join(root, 'public/site');

/** key：页面里引用的名字；widths：按版面最大显示宽度的 1x / 2x 取档 */
const images = [
  // 首页前两屏（满幅背景，已定）
  { key: 'seaside-hero', src: 'public/images/r8/seaside-hero.jpg', widths: [1280, 1920, 2200], quality: 74 },
  { key: 'seaside-ware', src: 'public/images/r8/seaside-ware.jpg', widths: [1280, 1920, 2200], quality: 74 },
  // 首页结尾：从窄缝开到满幅
  { key: 'home-garden', src: 'public/r8-candidates-v2/images/home-v2-a.png', widths: [960, 1672], quality: 76 },
  // 产品页的窗
  { key: 'work-studio', src: 'public/r8-candidates-v2/images/work-v2-c.png', widths: [800, 1672], quality: 76 },
  { key: 'tool-light', src: 'public/r8-candidates-v2/images/tool-v2-a.png', widths: [800, 1672], quality: 78 },
  { key: 'life-shore', src: 'public/r8-candidates-v2/images/life-v2-b.png', widths: [800, 1672], quality: 76 },
  { key: 'world-woods', src: 'public/images/r8/park-hero.jpg', widths: [900, 1800], quality: 74 },
  // 其余各页
  { key: 'enterprise-colonnade', src: 'public/r8-candidates-v2/images/work-v2-a.png', widths: [960, 1672], quality: 76 },
  { key: 'community-line', src: 'public/r8-candidates-v2/images/community-v2-c.png', widths: [800, 1672], quality: 76 },
  { key: 'community-sketch', src: 'public/images/r8/park-ware.jpg', widths: [900, 1800], quality: 74 },
  { key: 'about-window', src: 'public/r8-candidates-v2/images/about-v2-b.png', widths: [960, 1672], quality: 76 },
  { key: 'contact-door', src: 'public/images/r8/afternoon-hero-girl-b.png', widths: [600, 1024], quality: 78 },
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

await writeFile(
  path.join(root, 'app/_site/media.json'),
  `${JSON.stringify(manifest, null, 2)}\n`,
);
