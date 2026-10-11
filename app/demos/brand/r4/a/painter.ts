// A 的画：不用图片，在浏览器里一笔一笔画出来。
// 先用分层噪声描述一片风景（天空、太阳、山脊、水面、树、花），再按四遍笔触沿着场景的方向上色：
// 大笔铺底 → 中笔塑形 → 小笔细节 → 点彩。每一笔都带两道细的明暗笔毛，看起来像干水粉或油彩。

type RGB = [number, number, number];

const hex = (value: string): RGB => {
  const n = parseInt(value.slice(1), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
};
const mix = (a: RGB, b: RGB, t: number): RGB => [
  a[0] + (b[0] - a[0]) * t,
  a[1] + (b[1] - a[1]) * t,
  a[2] + (b[2] - a[2]) * t,
];
const clamp = (v: number, lo = 0, hi = 1) => Math.min(hi, Math.max(lo, v));
const smooth = (t: number) => t * t * (3 - 2 * t);

/** 确定的随机数：同一幅画每次画出来一样 */
export function rng(seed: number) {
  let s = seed >>> 0 || 1;
  return () => {
    s ^= s << 13;
    s ^= s >>> 17;
    s ^= s << 5;
    return (s >>> 0) / 4294967296;
  };
}

/** 二维值噪声与分形叠加 */
function hash(x: number, y: number, seed: number) {
  const s = Math.sin(x * 127.1 + y * 311.7 + seed * 74.7) * 43758.5453;
  return s - Math.floor(s);
}
function noise(x: number, y: number, seed: number) {
  const xi = Math.floor(x);
  const yi = Math.floor(y);
  const xf = smooth(x - xi);
  const yf = smooth(y - yi);
  const a = hash(xi, yi, seed);
  const b = hash(xi + 1, yi, seed);
  const c = hash(xi, yi + 1, seed);
  const d = hash(xi + 1, yi + 1, seed);
  return a + (b - a) * xf + (c - a) * yf + (a - b - c + d) * xf * yf;
}
function fbm(x: number, y: number, seed: number, octaves = 4) {
  let sum = 0;
  let amp = 0.5;
  let freq = 1;
  for (let i = 0; i < octaves; i++) {
    sum += amp * noise(x * freq, y * freq, seed + i * 13);
    amp *= 0.5;
    freq *= 2.03;
  }
  return sum;
}

type Layer = {
  /** 山脊的平均高度（0 顶 1 底）、起伏、频率 */
  base: number;
  amp: number;
  freq: number;
  color: string;
  /** 这一层下缘的颜色，做出由上到下的明暗 */
  low?: string;
  /** 远处蒙上天色的程度 */
  haze?: number;
  /** 笔触方向：沿山势 / 竖向的草 */
  grass?: boolean;
  seed: number;
};

type Tree = { u: number; v: number; r: number; color: string; light: string };

export type SceneSpec = {
  sky: [string, string, string];
  horizon: number;
  sun?: { u: number; v: number; r: number; color: string; core?: string };
  layers: Layer[];
  water?: { from: number; tint: string; amount: number };
  trees?: Tree[];
  /** 点彩：花、星、灯 */
  dabs?: {
    colors: string[];
    from: number;
    to: number;
    count: number;
    size: number;
  }[];
  /** 水面上的一道月光或日光 */
  glint?: { u: number; width: number; color: string };
  seed: number;
};

type Sample = { color: RGB; angle: number };

/** 场景：给定画面上的一点，回答这里是什么颜色、笔触朝哪个方向 */
export function compile(spec: SceneSpec, aspect: number) {
  const sky = spec.sky.map(hex) as [RGB, RGB, RGB];
  const sun = spec.sun
    ? {
        ...spec.sun,
        rgb: hex(spec.sun.color),
        core: hex(spec.sun.core ?? spec.sun.color),
      }
    : null;
  const layers = spec.layers.map((layer) => ({
    ...layer,
    rgb: hex(layer.color),
    lowRgb: hex(layer.low ?? layer.color),
  }));
  const trees = (spec.trees ?? []).map((tree) => ({
    ...tree,
    rgb: hex(tree.color),
    lightRgb: hex(tree.light),
  }));
  const water = spec.water
    ? { ...spec.water, rgb: hex(spec.water.tint) }
    : null;

  const ridge = (layer: (typeof layers)[number], u: number) =>
    layer.base +
    layer.amp *
      (fbm(u * layer.freq * aspect, layer.seed * 0.37, layer.seed, 3) - 0.5) *
      2;

  const skyAt = (u: number, v: number): RGB => {
    const t = clamp(v / spec.horizon);
    let color =
      t < 0.55
        ? mix(sky[0], sky[1], t / 0.55)
        : mix(sky[1], sky[2], (t - 0.55) / 0.45);
    // 天上成团的云：亮面朝上，底部带一点天色的暗
    const field = fbm(u * 2.2 * aspect, v * 5.5, spec.seed + 5);
    const cloud = smooth(clamp((field - 0.52) / 0.16));
    if (cloud > 0) {
      const under = clamp(
        (fbm(u * 2.2 * aspect, (v + 0.03) * 5.5, spec.seed + 5) - 0.52) / 0.16,
      );
      const dark = sky[0][0] + sky[0][1] + sky[0][2] < 180;
      const lit = dark
        ? mix(sky[2], sky[1], 0.45)
        : mix(sky[2], [255, 252, 244], 0.45);
      color = mix(
        color,
        mix(lit, mix(sky[1], sky[0], 0.35), clamp(under - cloud + 0.3) * 0.5),
        cloud * 0.85 * clamp(1.2 - v / spec.horizon),
      );
    }
    if (sun) {
      const dx = (u - sun.u) * aspect;
      const dy = v - sun.v;
      const d = Math.sqrt(dx * dx + dy * dy);
      color = mix(color, sun.rgb, clamp(Math.exp(-d / sun.r) * 0.85));
      if (d < sun.r * 0.18) color = mix(color, sun.core, 0.9);
    }
    return color;
  };

  /** 树：三团叠在一起的树冠，下面一根树干 */
  const treeAt = (u: number, v: number): Sample | null => {
    for (const tree of trees) {
      const lobes: [number, number, number][] = [
        [0, 0, 1],
        [-0.55, 0.28, 0.72],
        [0.55, 0.22, 0.75],
        [0.1, -0.45, 0.62],
      ];
      for (const [ox, oy, k] of lobes) {
        const dx = (u - tree.u) * aspect - ox * tree.r;
        const dy = v - tree.v - oy * tree.r;
        const r = tree.r * k * (0.82 + fbm(u * 14 * aspect, v * 14, 21) * 0.4);
        if (dx * dx + dy * dy < r * r) {
          const lit = clamp(
            0.55 -
              (((u - tree.u) * aspect) / tree.r) * 0.45 -
              ((v - tree.v) / tree.r) * 0.55,
          );
          const grain = fbm(u * 30 * aspect, v * 30, 33);
          return {
            color: mix(
              mix(tree.rgb, tree.lightRgb, lit),
              [24, 28, 14],
              clamp(0.35 - grain) * 0.6,
            ),
            angle: (fbm(u * 20, v * 20, 44) - 0.5) * 2.4,
          };
        }
      }
      const tx = Math.abs((u - tree.u) * aspect);
      if (tx < tree.r * 0.09 && v > tree.v && v < tree.v + tree.r * 1.5)
        return { color: mix(tree.rgb, [40, 32, 20], 0.5), angle: -Math.PI / 2 };
    }
    return null;
  };

  const sample = (u: number, v: number): Sample => {
    // 近处的层先挡住远处
    for (let i = layers.length - 1; i >= 0; i--) {
      const layer = layers[i];
      const top = ridge(layer, u);
      if (v < top) continue;
      const depth = clamp((v - top) / 0.25);
      let color = mix(layer.rgb, layer.lowRgb, depth);
      const grain = fbm(u * 18 * aspect, v * 18, layer.seed + 3) - 0.5;
      color = mix(
        color,
        grain > 0 ? [255, 246, 222] : [30, 34, 22],
        Math.abs(grain) * 0.35,
      );
      if (layer.haze) color = mix(color, skyAt(u, spec.horizon), layer.haze);
      // 落在水面上就倒映天色
      if (water && i === 0 && v > water.from) {
        const mirror = water.from - (v - water.from) * 0.9;
        const ripple =
          (fbm(u * 2 * aspect, v * 40, spec.seed + 9) - 0.5) * 0.04;
        color = mix(
          skyAt(u + ripple, Math.max(0, mirror)),
          water.rgb,
          water.amount,
        );
      }
      let angle: number;
      if (layer.grass)
        angle = -Math.PI / 2 + (fbm(u * 6, v * 6, layer.seed) - 0.5) * 1.1;
      else {
        const slope = (ridge(layer, u + 0.004) - top) / (0.004 * aspect);
        angle =
          Math.atan(slope) * 0.8 +
          (fbm(u * 5, v * 5, layer.seed + 1) - 0.5) * 0.5;
      }
      if (water && i === 0 && v > water.from)
        angle = (fbm(u * 4, v * 9, 3) - 0.5) * 0.18;
      const hit = treeAt(u, v);
      if (hit) return hit;
      return { color, angle };
    }
    const hit = treeAt(u, v);
    if (hit) return hit;
    const angle = (fbm(u * 3, v * 8, spec.seed) - 0.5) * 0.5;
    return { color: skyAt(u, v), angle };
  };

  return { sample, spec };
}

type Pass = {
  cover: number;
  width: [number, number];
  length: [number, number];
  alpha: number;
  jitter: number;
};

/** cover：这一遍笔触面积合计是画面的几倍 */
const passes: Pass[] = [
  { cover: 1.6, width: [22, 40], length: [34, 72], alpha: 0.92, jitter: 0.09 },
  { cover: 1.7, width: [9, 16], length: [16, 34], alpha: 0.88, jitter: 0.1 },
  { cover: 1.1, width: [3.5, 7], length: [7, 16], alpha: 0.86, jitter: 0.11 },
];

export type Job = {
  /** 画一笔；返回还剩多少笔 */
  step(budget: number): number;
  total: number;
};

/**
 * 准备一幅画的全部笔触。scale 是画布像素比，笔触尺寸跟着放大。
 * 返回一个可以分帧推进的任务：每帧画一部分，画完为止。
 */
export function prepare(
  ctx: CanvasRenderingContext2D,
  spec: SceneSpec,
  width: number,
  height: number,
  scale: number,
): Job {
  const aspect = width / height;
  const scene = compile(spec, aspect);
  const random = rng(spec.seed * 9973 + Math.round(width));
  type Stroke = {
    x: number;
    y: number;
    w: number;
    l: number;
    a: number;
    c: RGB;
    alpha: number;
    bend: number;
  };
  const strokes: Stroke[] = [];
  const area = width * height;
  const size = Math.min(1.6, Math.max(0.55, Math.sqrt(area) / (1100 * scale)));
  for (const pass of passes) {
    const avgW = ((pass.width[0] + pass.width[1]) / 2) * scale * size;
    const avgL = ((pass.length[0] + pass.length[1]) / 2) * scale * size;
    const count = Math.round(
      (pass.cover * area) / (avgW * (avgL + avgW * 0.6)),
    );
    for (let i = 0; i < count; i++) {
      const u = random();
      const v = random();
      const { color, angle } = scene.sample(u, v);
      const j = (random() - 0.5) * pass.jitter * 255;
      const k = (random() - 0.5) * pass.jitter * 160;
      strokes.push({
        x: u * width,
        y: v * height,
        w:
          (pass.width[0] + random() * (pass.width[1] - pass.width[0])) *
          scale *
          size,
        l:
          (pass.length[0] + random() * (pass.length[1] - pass.length[0])) *
          scale *
          size,
        a: angle + (random() - 0.5) * 0.35,
        c: [
          clamp(color[0] + j + k, 0, 255),
          clamp(color[1] + j, 0, 255),
          clamp(color[2] + j - k, 0, 255),
        ],
        alpha: pass.alpha,
        bend: (random() - 0.5) * 0.5,
      });
    }
  }
  // 点彩：花、星星、灯火
  for (const group of spec.dabs ?? []) {
    const colors = group.colors.map(hex);
    for (
      let i = 0;
      i < group.count * (area / (1200 * 700 * scale * scale));
      i++
    ) {
      const u = random();
      const v = group.from + random() * (group.to - group.from);
      const c = colors[Math.floor(random() * colors.length)];
      const s = group.size * (0.6 + random() * 0.8) * scale * size;
      strokes.push({
        x: u * width,
        y: v * height,
        w: s,
        l: s * 0.35,
        a: random() * Math.PI,
        c,
        alpha: 0.92,
        bend: 0,
      });
    }
  }
  // 水面上的一道光：横向短笔叠成一列
  if (spec.glint) {
    const c = hex(spec.glint.color);
    const from = (spec.water?.from ?? 0.6) * height;
    for (let i = 0; i < 160 * (area / (1200 * 700 * scale * scale)); i++) {
      const y = from + random() * (height - from);
      const spread =
        spec.glint.width * width * (0.4 + (y - from) / (height - from));
      strokes.push({
        x: spec.glint.u * width + (random() - 0.5) * spread,
        y,
        w: (2 + random() * 3) * scale * size,
        l: (10 + random() * 26) * scale * size,
        a: (random() - 0.5) * 0.1,
        c,
        alpha: 0.5 + random() * 0.4,
        bend: 0,
      });
    }
  }

  // 打底：按场景颜色铺一层小色块，笔触之间的缝隙露出来的是底色而不是空白
  const cell = Math.max(6, Math.round(7 * scale));
  for (let y = 0; y < height; y += cell) {
    for (let x = 0; x < width; x += cell) {
      const [r, g, b] = scene.sample(
        (x + cell / 2) / width,
        (y + cell / 2) / height,
      ).color;
      ctx.fillStyle = `rgb(${r | 0} ${g | 0} ${b | 0})`;
      ctx.fillRect(x, y, cell + 1, cell + 1);
    }
  }
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  let index = 0;
  const draw = (s: Stroke) => {
    const dx = Math.cos(s.a) * s.l * 0.5;
    const dy = Math.sin(s.a) * s.l * 0.5;
    const nx = -Math.sin(s.a);
    const ny = Math.cos(s.a);
    const bx = nx * s.l * s.bend * 0.3;
    const by = ny * s.l * s.bend * 0.3;
    const [r, g, b] = s.c;
    ctx.globalAlpha = s.alpha;
    ctx.strokeStyle = `rgb(${r | 0} ${g | 0} ${b | 0})`;
    ctx.lineWidth = s.w;
    ctx.beginPath();
    ctx.moveTo(s.x - dx, s.y - dy);
    ctx.quadraticCurveTo(s.x + bx, s.y + by, s.x + dx, s.y + dy);
    ctx.stroke();
    if (s.w > 3 * scale) {
      // 两道笔毛：一明一暗，沿笔触方向偏开
      const off = s.w * 0.28;
      ctx.lineWidth = s.w * 0.22;
      ctx.globalAlpha = s.alpha * 0.32;
      ctx.strokeStyle = `rgb(${Math.min(255, r + 26) | 0} ${Math.min(255, g + 24) | 0} ${Math.min(255, b + 18) | 0})`;
      ctx.beginPath();
      ctx.moveTo(s.x - dx + nx * off, s.y - dy + ny * off);
      ctx.quadraticCurveTo(
        s.x + bx + nx * off,
        s.y + by + ny * off,
        s.x + dx * 0.8 + nx * off,
        s.y + dy * 0.8 + ny * off,
      );
      ctx.stroke();
      ctx.strokeStyle = `rgb(${Math.max(0, r - 30) | 0} ${Math.max(0, g - 30) | 0} ${Math.max(0, b - 26) | 0})`;
      ctx.beginPath();
      ctx.moveTo(s.x - dx * 0.7 - nx * off, s.y - dy * 0.7 - ny * off);
      ctx.quadraticCurveTo(
        s.x + bx - nx * off,
        s.y + by - ny * off,
        s.x + dx - nx * off,
        s.y + dy - ny * off,
      );
      ctx.stroke();
    }
  };
  return {
    total: strokes.length,
    step(budget: number) {
      const end = Math.min(strokes.length, index + budget);
      for (; index < end; index++) draw(strokes[index]);
      ctx.globalAlpha = 1;
      return strokes.length - index;
    },
  };
}
