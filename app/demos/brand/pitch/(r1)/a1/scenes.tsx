'use client';
// A 的画面零件：纸上的树影。远近两层各自摇曳，鼠标让光影轻微偏移。

/** 确定的伪随机，保证服务端和浏览器画出同一片叶子 */
function seeded(seed: number) {
  let value = seed;
  return () => {
    value = (value * 16807) % 2147483647;
    return value / 2147483647;
  };
}

type Leaf = { x: number; y: number; rx: number; ry: number; r: number };
type Branch = { d: string; leaves: Leaf[] };

/** 从画面边缘伸进来的几根枝条，叶子沿枝条长出 */
function grow(seed: number, starts: [number, number, number, number][]) {
  const rand = seeded(seed);
  return starts.map(([x0, y0, angle, length]): Branch => {
    const leaves: Leaf[] = [];
    const bend = (rand() - 0.5) * 0.9;
    const points: [number, number][] = [];
    for (let t = 0; t <= 1.001; t += 0.05) {
      const a = angle + bend * t;
      const x = x0 + Math.cos(a) * length * t;
      const y = y0 + Math.sin(a) * length * t + Math.sin(t * 3) * 26;
      points.push([x, y]);
      for (let k = 0; k < 2; k++) {
        if (t < 0.1 || rand() < 0.22) continue;
        const side = rand() > 0.5 ? 1 : -1;
        const size = 15 + rand() * 22;
        leaves.push({
          x: x + side * (8 + rand() * 30),
          y: y + (rand() - 0.5) * 34,
          rx: size,
          ry: size * (0.32 + rand() * 0.16),
          r: ((a * 180) / Math.PI + side * (35 + rand() * 40)) % 360,
        });
      }
    }
    const d = points
      .map(
        ([x, y], index) =>
          `${index ? 'L' : 'M'}${x.toFixed(1)} ${y.toFixed(1)}`,
      )
      .join(' ');
    return { d, leaves };
  });
}

const far = grow(7, [
  [-60, 40, 0.35, 620],
  [-40, 300, -0.1, 420],
  [1680, -20, 2.5, 640],
  [1700, 420, 3.05, 380],
  [760, -80, 1.75, 260],
]);
const near = grow(23, [
  [-80, -30, 0.55, 520],
  [1690, 120, 2.75, 520],
  [1640, 760, 3.5, 300],
]);

function Branches({ branches, blur }: { branches: Branch[]; blur: number }) {
  return (
    <>
      <defs>
        <filter
          id={`ra-soft-${blur}`}
          x="-20%"
          y="-20%"
          width="140%"
          height="140%"
        >
          <feGaussianBlur stdDeviation={blur} />
        </filter>
      </defs>
      <g
        filter={`url(#ra-soft-${blur})`}
        fill="currentColor"
        stroke="currentColor"
      >
        {branches.map((branch, index) => (
          <g key={index}>
            <path
              d={branch.d}
              fill="none"
              strokeWidth="5"
              strokeLinecap="round"
            />
            {branch.leaves.map((leaf, leafIndex) => (
              <ellipse
                key={leafIndex}
                cx={leaf.x}
                cy={leaf.y}
                rx={leaf.rx}
                ry={leaf.ry}
                transform={`rotate(${leaf.r.toFixed(1)} ${leaf.x.toFixed(1)} ${leaf.y.toFixed(1)})`}
                stroke="none"
              />
            ))}
          </g>
        ))}
      </g>
    </>
  );
}

/** 纸上的树影：远近两层各自摇曳，鼠标让光影轻微偏移。quiet 用于页尾，更淡。 */
export function LeafLight({ quiet = false }: { quiet?: boolean }) {
  return (
    <div className="ra-light" data-quiet={quiet} aria-hidden="true">
      <svg
        className="ra-leaf ra-leaf-far"
        viewBox="0 0 1600 1000"
        preserveAspectRatio="xMidYMid slice"
      >
        <Branches branches={far} blur={9} />
      </svg>
      <svg
        className="ra-leaf ra-leaf-near"
        viewBox="0 0 1600 1000"
        preserveAspectRatio="xMidYMid slice"
      >
        <Branches branches={near} blur={4} />
      </svg>
    </div>
  );
}
