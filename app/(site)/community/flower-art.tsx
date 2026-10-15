import type { CSSProperties } from 'react';

// 「一朵好奇」的几何：一个椭圆，绕画面中心旋转、重复 count 次；
// bloom（0…100）同时改变椭圆的短轴和旋转的总角度——花苞一样收着，或者整朵摊开。
// 服务端（三步规则的小图）和客户端（首屏可以玩的那朵）共用；下载的 SVG 也从这里生成。

export type Flower = { count: number; bloom: number; color: number };

export const FLOWER_DEFAULT: Flower = { count: 24, bloom: 62, color: 0 };
export const COUNT_RANGE = [1, 36] as const;

/** 新写：线的颜色。界面只有一种强调色；这是作品自己的颜色 */
export const flowerColors = [
  { name: '墨色', value: '#1b1a18' },
  { name: '杏橙', value: '#c4673a' },
  { name: '海蓝', value: '#2f5f86' },
  { name: '松绿', value: '#4f6e48' },
];

const SIZE = 480;
const RX = 200;
const TILT = -21;
const PAPER = '#fbfaf7';

const round = (n: number) => Math.round(n * 100) / 100;

/** 每一片的短轴和角度 */
export function petals({ count, bloom }: Pick<Flower, 'count' | 'bloom'>) {
  const ry = round(12 + bloom * 0.88);
  const sweep = 70 + bloom * 1.1;
  const step = count > 1 ? sweep / count : 0;
  return Array.from({ length: count }, (_, i) => ({
    ry,
    angle: round(i * step),
  }));
}

export function flowerTitle(flower: Flower) {
  return `一朵好奇：${flower.count} 个椭圆，展开 ${flower.bloom}%，${flowerColors[flower.color].name}`;
}

/** 下载用的完整 SVG 文件（带一层纸色底，放进别处也看得清） */
export function flowerSvg(flower: Flower) {
  const color = flowerColors[flower.color].value;
  const lines = petals(flower)
    .map(
      ({ ry, angle }) =>
        `<ellipse rx="${RX}" ry="${ry}" transform="rotate(${angle})"/>`,
    )
    .join('');
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${SIZE} ${SIZE}" width="${SIZE * 2}" height="${SIZE * 2}"><title>${flowerTitle(flower)} · Molis AI</title><rect width="${SIZE}" height="${SIZE}" fill="${PAPER}"/><g transform="translate(${SIZE / 2} ${SIZE / 2}) rotate(${TILT})" fill="none" stroke="${color}" stroke-width="1.1">${lines}</g></svg>`;
}

/**
 * 画出来的那朵花。live 时每一片的角度写在 style 里（首屏一进来时，一片片从 0° 转到位）；
 * 小图与服务端渲染用属性，和下载的文件一样。
 */
export function FlowerArt({
  flower,
  live = false,
  label,
  className,
  size,
}: {
  flower: Flower;
  live?: boolean;
  /** 给读屏的一句；不给就当装饰 */
  label?: string;
  className?: string;
  /** 放进另一张 SVG 里（例如小家伙手里）时，要写明宽高 */
  size?: number;
}) {
  const color = flowerColors[flower.color].value;
  return (
    <svg
      viewBox={`0 0 ${SIZE} ${SIZE}`}
      width={size}
      height={size}
      className={className}
      role={label ? 'img' : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      focusable="false"
    >
      <g
        transform={`translate(${SIZE / 2} ${SIZE / 2}) rotate(${TILT})`}
        fill="none"
        stroke={color}
        strokeWidth="1.1"
      >
        {petals(flower).map(({ ry, angle }, i) =>
          live ? (
            <ellipse
              key={i}
              className="m-com-petal"
              vectorEffect="non-scaling-stroke"
              rx={RX}
              ry={ry}
              style={
                {
                  transform: `rotate(${angle}deg)`,
                  '--i': i,
                } as CSSProperties
              }
            />
          ) : (
            <ellipse
              key={i}
              vectorEffect="non-scaling-stroke"
              rx={RX}
              ry={ry}
              transform={`rotate(${angle})`}
            />
          ),
        )}
      </g>
    </svg>
  );
}
