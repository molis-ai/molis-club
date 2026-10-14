'use client';
import { useBaked } from './bake';

// 树影婆娑：墙外像有一棵树，枝叶的影子落在白墙上，随风轻轻晃。
// 影子是一段程序生成的 SVG（几根弯枝，沿枝长出杏仁形的叶子，再整体模糊），打开页面时画成两张位图：
// 远的一层大而虚、近的一层小而清楚。墙上只挂位图，晃动用 transform，推镜和滚动时不必重算滤镜。

type Layer = {
  seed: number;
  width: number;
  height: number;
  branches: number;
  leaves: number;
  size: [number, number];
  blur: number;
};

/** 可复现的伪随机数：同一个 seed 每次长出同一棵树 */
function random(seed: number) {
  let state = seed;
  return () => {
    state = (state * 16807) % 2147483647;
    return state / 2147483647;
  };
}

function leavesSvg({
  seed,
  width,
  height,
  branches,
  leaves,
  size,
  blur,
}: Layer) {
  const rnd = random(seed);
  const parts: string[] = [];
  for (let b = 0; b < branches; b += 1) {
    // 枝从右上角一带伸进来，往左下垂
    const x0 = width * (0.55 + rnd() * 0.5);
    const y0 = -height * 0.05 + rnd() * height * 0.15;
    const x2 = width * (0.05 + rnd() * 0.55);
    const y2 = height * (0.35 + rnd() * 0.55);
    const x1 = (x0 + x2) / 2 + (rnd() - 0.3) * width * 0.25;
    const y1 = (y0 + y2) / 2 - rnd() * height * 0.25;
    const stroke = 2 + rnd() * 3;
    parts.push(
      `<path d="M${x0.toFixed(0)} ${y0.toFixed(0)} Q${x1.toFixed(0)} ${y1.toFixed(0)} ${x2.toFixed(0)} ${y2.toFixed(0)}" fill="none" stroke-width="${stroke.toFixed(1)}"/>`,
    );
    for (let l = 0; l < leaves; l += 1) {
      const t = 0.08 + (l / leaves) * 0.92 + (rnd() - 0.5) * 0.04;
      const u = 1 - t;
      const x = u * u * x0 + 2 * u * t * x1 + t * t * x2;
      const y = u * u * y0 + 2 * u * t * y1 + t * t * y2;
      const dx = 2 * u * (x1 - x0) + 2 * t * (x2 - x1);
      const dy = 2 * u * (y1 - y0) + 2 * t * (y2 - y1);
      const along = (Math.atan2(dy, dx) * 180) / Math.PI;
      const side = l % 2 ? 1 : -1;
      const angle = along + side * (35 + rnd() * 40);
      const length = size[0] + rnd() * (size[1] - size[0]);
      const half = length * (0.22 + rnd() * 0.12);
      // 杏仁形的叶子：从叶柄长出去，两边各一道弧
      parts.push(
        `<path transform="translate(${x.toFixed(0)} ${y.toFixed(0)}) rotate(${angle.toFixed(0)})" d="M0 0 Q${(length * 0.5).toFixed(0)} ${(-half).toFixed(0)} ${length.toFixed(0)} 0 Q${(length * 0.5).toFixed(0)} ${half.toFixed(0)} 0 0Z"/>`,
      );
    }
  }
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}"><defs><filter id="b" x="-10%" y="-10%" width="120%" height="120%"><feGaussianBlur stdDeviation="${blur}"/></filter></defs><g filter="url(#b)" fill="#3a352c" stroke="#3a352c">${parts.join('')}</g></svg>`;
}

const far: Layer = {
  seed: 7,
  width: 1200,
  height: 900,
  branches: 4,
  leaves: 22,
  size: [70, 130],
  blur: 16,
};
const near: Layer = {
  seed: 31,
  width: 1200,
  height: 900,
  branches: 3,
  leaves: 26,
  size: [40, 78],
  blur: 6,
};
const farSvg = leavesSvg(far);
const nearSvg = leavesSvg(near);

/** 根节点上挂的两层树影位图（--g-leaves-far、--g-leaves-near）；没画好之前墙上没有树影 */
export function useLeaves(enabled: boolean) {
  const farSrc = useBaked(farSvg, far.width, far.height, {
    scale: 0.5,
    fallback: 'none',
    enabled,
  });
  const nearSrc = useBaked(nearSvg, near.width, near.height, {
    scale: 0.8,
    fallback: 'none',
    enabled,
  });
  const vars: Record<string, string> = {};
  if (farSrc) vars['--g-leaves-far'] = `url("${farSrc}")`;
  if (nearSrc) vars['--g-leaves-near'] = `url("${nearSrc}")`;
  return vars;
}
