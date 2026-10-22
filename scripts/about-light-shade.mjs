// 「关于」首屏的树影图（负责人 2026-10-19：「这个树影可以动起来吗，缓缓动起来」）。
// 首屏是图库「光-03 · 天光落下的地方」：天窗外一棵橄榄树，叶影印在地上那块天光里。
// 要让叶影动、地面不动，先把叶影从照片里分出来：在天光那块里，估出「没有叶影时这一处该有多亮」，
// 叶影 = 实际亮度 ÷ 该有的亮度（0.3–1，1 是没有影子）。页面上用 WebGL 把这张叶影图慢慢挪动，
// 再按「原图 ÷ 原来的叶影 × 挪过的叶影」画出来：静止时和原图一模一样，地上的石纹与砖缝不跟着晃。
// 光斑的边本来是软的：按四条边各自量出边缘衰减再除掉，边上不会被当成影子；碰到边的影子往外顺延一圈，挪动时不断开。
// 范围、外框都在 app/(site)/about/light-plan.json（页面也读它）。输出 public/site/about-light-shade.png。
// node scripts/about-light-shade.mjs（npm run media 会顺带跑）

import { createRequire } from 'node:module';
import { readFileSync } from 'node:fs';
import path from 'node:path';

const require = createRequire(import.meta.url);
const sharp = require('sharp');
const root = path.resolve(import.meta.dirname, '..');
const plan = JSON.parse(
  readFileSync(path.join(root, 'app/(site)/about/light-plan.json'), 'utf8'),
);

const [W, H] = plan.frame;
const [bx, by, bw, bh] = plan.box;
const { data } = await sharp(
  path.join(root, 'public/images/library/light-03.jpg'),
)
  .resize(W, H)
  .greyscale()
  .raw()
  .toBuffer({ resolveWithObject: true });

/** 点到四边形里面的距离（像素，里面为正）：顶点按顺时针（y 向下） */
function inside(x, y, poly) {
  let best = Infinity;
  for (let i = 0; i < poly.length; i++) {
    const [ax, ay] = poly[i];
    const [cx, cy] = poly[(i + 1) % poly.length];
    const ex = cx - ax;
    const ey = cy - ay;
    const len = Math.hypot(ex, ey);
    best = Math.min(best, ((x - ax) * -ey + (y - ay) * ex) / len);
  }
  return best;
}
const smooth = (a, b, x) => {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)));
  return t * t * (3 - 2 * t);
};

// 亮度：外框里一份
const L = new Float32Array(bw * bh);
for (let y = 0; y < bh; y++)
  for (let x = 0; x < bw; x++) L[y * bw + x] = data[(by + y) * W + bx + x];

// 「该有的亮度」：只在天光块里取最大值（邻域 49×49），再抹平（31×31 均值），叶影的暗处被周围亮处填起来
const inPatch = new Uint8Array(bw * bh);
for (let y = 0; y < bh; y++)
  for (let x = 0; x < bw; x++)
    inPatch[y * bw + x] = inside(bx + x, by + y, plan.patch) > 2 ? 1 : 0;

function slide(src, radius, pick, horizontal) {
  const out = new Float32Array(src.length);
  for (let y = 0; y < bh; y++)
    for (let x = 0; x < bw; x++) {
      let acc = pick === 'max' ? 0 : 0;
      let n = 0;
      for (let k = -radius; k <= radius; k++) {
        const xx = horizontal ? x + k : x;
        const yy = horizontal ? y : y + k;
        if (xx < 0 || yy < 0 || xx >= bw || yy >= bh) continue;
        const i = yy * bw + xx;
        if (pick === 'max') {
          if (inPatch[i]) acc = Math.max(acc, src[i]);
        } else {
          acc += src[i];
          n += 1;
        }
      }
      out[y * bw + x] = pick === 'max' ? acc : acc / n;
    }
  return out;
}
let lit = slide(L, 24, 'max', true);
lit = slide(lit, 24, 'max', false);
lit = slide(lit, 15, 'mean', true);
lit = slide(lit, 15, 'mean', false);

// 光斑的四条边本来就是软的（越靠边越暗），不能当成叶影，不然一挪，边上那道暗就滑进来了。
// 按「离哪条边最近、离它多远」分组，取每组里偏亮的那一档（第 85 百分位）当这一处本来的边缘衰减，再除掉它。
/** 点离四边各有多远，返回最近的那条边和距离 */
function nearest(x, y) {
  let edgeAt = 0;
  let best = Infinity;
  const poly = plan.patch;
  for (let k = 0; k < poly.length; k++) {
    const [ax, ay] = poly[k];
    const [cx, cy] = poly[(k + 1) % poly.length];
    const ex = cx - ax;
    const ey = cy - ay;
    const dist = ((x - ax) * -ey + (y - ay) * ex) / Math.hypot(ex, ey);
    if (dist < best) {
      best = dist;
      edgeAt = k;
    }
  }
  return [edgeAt, best];
}
const EDGE = 40;
const buckets = Array.from({ length: 4 }, () =>
  Array.from({ length: EDGE }, () => []),
);
const ratioAt = new Float32Array(bw * bh);
for (let y = 0; y < bh; y++)
  for (let x = 0; x < bw; x++) {
    const i = y * bw + x;
    ratioAt[i] = lit[i] > 0 ? Math.min(1, L[i] / lit[i]) : 1;
    const [k, d] = nearest(bx + x, by + y);
    if (d >= 0 && d < EDGE) buckets[k][Math.floor(d)].push(ratioAt[i]);
  }
const falloff = buckets.map((rows) => {
  const raw = rows.map((values) => {
    if (values.length < 8) return 1;
    values.sort((a, b) => a - b);
    return values[Math.floor(values.length * 0.85)];
  });
  // 往里越深越接近 1；平滑一下，并保证不比更深处更亮
  return raw.map((_, d) => {
    let acc = 0;
    let n = 0;
    for (let k = Math.max(0, d - 2); k <= Math.min(EDGE - 1, d + 2); k++) {
      acc += raw[k];
      n += 1;
    }
    const deep = raw.slice(EDGE - 8).reduce((a, b) => a + b, 0) / 8;
    return Math.min(1, acc / n / deep);
  });
});

// 叶影 = 实际 ÷ 该有的 ÷ 边缘衰减。天光块里每一处都按实际算，一直算到边上，不在边上淡成 1：
// 淡掉会在图里留下一道和边平行的直线，影子一挪，这道线就滑进光斑里（负责人看第二版时的那道斜线）。
const inner = new Float32Array(bw * bh).fill(1);
for (let y = 0; y < bh; y++)
  for (let x = 0; x < bw; x++) {
    const i = y * bw + x;
    const [k, d] = nearest(bx + x, by + y);
    if (d < 0) continue;
    const edge = d < EDGE ? falloff[k][Math.floor(d)] : 1;
    // 只比「该有的」暗 5% 以内的，是石面本身的纹理，不当影子
    const ratio = Math.min(1, Math.max(0.3, ratioAt[i] / Math.max(edge, 0.2)));
    inner[i] = ratio + (1 - ratio) * smooth(0.88, 0.95, ratio);
  }
// 天光块外面一圈：把边上的影子顺着垂直于边的方向往外延长（取往里 2px 那一点的值），
// 这样一块碰到边的影子挪动时是连着的；页面上只在挪动时会取到这里，外面的地面本身不动
const shade = Buffer.alloc(bw * bh);
let sum = 0;
let count = 0;
for (let y = 0; y < bh; y++)
  for (let x = 0; x < bw; x++) {
    const i = y * bw + x;
    let px = bx + x;
    let py = by + y;
    let [k, d] = nearest(px, py);
    for (let step = 0; d < 0 && step < 3; step++) {
      const [ax, ay] = plan.patch[k];
      const [cx, cy] = plan.patch[(k + 1) % plan.patch.length];
      const len = Math.hypot(cx - ax, cy - ay);
      // 往里的法线
      px += (-(cy - ay) / len) * (-d + 2);
      py += ((cx - ax) / len) * (-d + 2);
      [k, d] = nearest(px, py);
    }
    const qx = Math.min(bw - 1, Math.max(0, Math.round(px - bx)));
    const qy = Math.min(bh - 1, Math.max(0, Math.round(py - by)));
    const s = inner[qy * bw + qx];
    shade[i] = Math.round(s * 255);
    if (nearest(bx + x, by + y)[1] > 6) {
      sum += s;
      count += 1;
    }
  }
console.log(
  '边缘衰减（四条边，0 / 4 / 8 / 16px）',
  falloff
    .map((row) => [0, 4, 8, 16].map((d) => row[d].toFixed(2)).join(' '))
    .join(' ｜ '),
);

await sharp(shade, { raw: { width: bw, height: bh, channels: 1 } })
  .png({ compressionLevel: 9 })
  .toFile(path.join(root, 'public/site/about-light-shade.png'));
console.log(
  'about-light-shade',
  `${bw}×${bh}`,
  `平均 ${(sum / count).toFixed(3)}（1 是没有叶影）`,
);
