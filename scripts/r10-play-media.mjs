// 第十轮视觉稿「play」（可以亲手玩的说明书）的配图压缩：品牌概念图（雾感版）与 Molis Work 真实界面截图
// → public/r10/play/ 的 WebP，宽高与平均色写进 app/(site)/r10/play/media.json。只压缩，不调色、不改内容。需要本机能载入 sharp（npm 依赖链里已有）：node scripts/r10-play-media.mjs

import { createRequire } from 'node:module';
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';

const require = createRequire(import.meta.url);
const sharp = require('sharp');

const root = path.resolve(import.meta.dirname, '..');
const out = path.join(root, 'public/r10/play');
const shots = '/Users/creamiex/molis-ai/molis-work/docs/screenshots/soft-workbench';

/** 照片：负责人 2026-10-15 的十二组品牌概念图，取雾感版（public/r8-materials-mist-v1，已调好色，这里不再调）。 */
const mist = 'public/r8-materials-mist-v1/images';
const photos = [
  // 首页的照片屏：风的手稿（崖上被风推着作画的装置）
  { key: 'home-b', src: `${mist}/home-b.png`, widths: [960, 1672] },
  // 首页「一天」的五个时刻 = 五件产品各自的画面
  { key: 'work-a', src: `${mist}/work-a.png`, widths: [960, 1672] },
  { key: 'tool-a', src: `${mist}/tool-a.png`, widths: [960, 1672] },
  { key: 'life-a', src: `${mist}/life-a.png`, widths: [960, 1672] },
  { key: 'story-a', src: `${mist}/story-a.png`, widths: [960, 1536] },
  { key: 'world-a', src: `${mist}/world-a.png`, widths: [960, 1672] },
  // Work 页的照片屏：一毫米的判断
  { key: 'work-b', src: `${mist}/work-b.png`, widths: [960, 1536] },
];

/** Molis Work 真实界面截图（soft-workbench，2026-09-29 版）：原尺寸，不调色 */
const screens = [
  'onboarding-zh',
  'feed-zh',
  'goals-zh',
  'home-zh',
  'home-dark-zh',
  'phone-zh',
].map((key) => ({ key, src: `${shots}/${key}.jpg` }));

const media = {};
await mkdir(out, { recursive: true });

const hex = ({ r, g, b }) =>
  '#' + [r, g, b].map((v) => Math.round(v).toString(16).padStart(2, '0')).join('');

for (const photo of photos) {
  const base = () =>
    sharp(path.join(root, photo.src))
      .rotate();
  const meta = await sharp(path.join(root, photo.src)).metadata();
  const ratio = meta.height / meta.width;
  const srcset = [];
  for (const width of photo.widths) {
    const file = `${photo.key}-${width}.webp`;
    await base().resize({ width, withoutEnlargement: true }).webp({ quality: 76 }).toFile(path.join(out, file));
    srcset.push([`/r10/play/${file}`, width]);
  }
  const { channels } = await base().resize(32).stats();
  const [r, g, b] = channels.map((c) => c.mean);
  const last = photo.widths.at(-1);
  media[photo.key] = {
    src: srcset.at(-1)[0],
    srcset,
    width: last,
    height: Math.round(last * ratio),
    color: hex({ r, g, b }),
  };
}

for (const screen of screens) {
  const file = `${screen.key}.webp`;
  const image = sharp(screen.src);
  const meta = await image.metadata();
  await image.webp({ quality: 86 }).toFile(path.join(out, file));
  media[screen.key] = { src: `/r10/play/${file}`, width: meta.width, height: meta.height };
}

await writeFile(
  path.join(root, 'app/(site)/r10/play/media.json'),
  JSON.stringify(media, null, 2) + '\n',
);
console.log(Object.keys(media).join(' '));
