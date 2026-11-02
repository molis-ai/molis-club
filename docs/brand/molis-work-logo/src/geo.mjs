// Shared geometry for the Molis Work mark explorations (120-unit grid, centre 60,60).
const INK = '#1a294f', APR = '#ea9260', BG = '#f4eee9';
const W = 12.2;            // stroke, ~10% of the canvas like the parent ring
const A = 28.1, R = 16.4;  // parent centreline: half side, corner radius (axis frame, rotated 45°)

const f = n => +n.toFixed(2);

// Polyline with rounded corners. radii[i] applies to pts[i] (ignored at the ends of an open line).
function rounded(pts, radii, closed = false) {
  const n = pts.length, out = [];
  const corner = i => {
    const p = pts[i], a = pts[(i - 1 + n) % n], b = pts[(i + 1) % n];
    const v1 = [p[0] - a[0], p[1] - a[1]], v2 = [b[0] - p[0], b[1] - p[1]];
    const l1 = Math.hypot(...v1), l2 = Math.hypot(...v2);
    const u1 = [v1[0] / l1, v1[1] / l1], u2 = [v2[0] / l2, v2[1] / l2];
    const turn = Math.acos(Math.max(-1, Math.min(1, u1[0] * u2[0] + u1[1] * u2[1])));
    const r = radii[i] ?? 0, t = r * Math.tan(turn / 2);
    const cross = u1[0] * u2[1] - u1[1] * u2[0];
    return { p1: [p[0] - u1[0] * t, p[1] - u1[1] * t], p2: [p[0] + u2[0] * t, p[1] + u2[1] * t], r, sweep: cross > 0 ? 1 : 0 };
  };
  if (closed) {
    const cs = pts.map((_, i) => corner(i));
    out.push(`M${f(cs[0].p2[0])} ${f(cs[0].p2[1])}`);
    for (let k = 1; k <= n; k++) {
      const c = cs[k % n];
      out.push(`L${f(c.p1[0])} ${f(c.p1[1])}`);
      if (c.r) out.push(`A${f(c.r)} ${f(c.r)} 0 0 ${c.sweep} ${f(c.p2[0])} ${f(c.p2[1])}`);
    }
    out.push('Z');
  } else {
    out.push(`M${f(pts[0][0])} ${f(pts[0][1])}`);
    for (let i = 1; i < n - 1; i++) {
      const c = corner(i);
      out.push(`L${f(c.p1[0])} ${f(c.p1[1])}`);
      if (c.r) out.push(`A${f(c.r)} ${f(c.r)} 0 0 ${c.sweep} ${f(c.p2[0])} ${f(c.p2[1])}`);
    }
    out.push(`L${f(pts[n - 1][0])} ${f(pts[n - 1][1])}`);
  }
  return out.join(' ');
}

// Sample the parent centreline (axis frame, clockwise from the start of the top edge) by arc length.
function ringSampler(a = A, r = R) {
  const e = 2 * (a - r), q = Math.PI / 2 * r, L = 4 * (e + q);
  const segs = [];
  const corners = [[a - r, -a + r], [a - r, a - r], [-a + r, a - r], [-a + r, -a + r]];
  const starts = [[-a + r, -a], [a, -a + r], [a - r, a], [-a, a - r]];
  const dirs = [[1, 0], [0, 1], [-1, 0], [0, -1]];
  for (let k = 0; k < 4; k++) {
    segs.push({ type: 'line', len: e, p: starts[k], d: dirs[k] });
    segs.push({ type: 'arc', len: q, c: corners[k], a0: -Math.PI / 2 + k * Math.PI / 2 });
  }
  return {
    L,
    at(s) {
      s = ((s % L) + L) % L;
      for (const g of segs) {
        if (s <= g.len) {
          if (g.type === 'line') return { x: g.p[0] + g.d[0] * s, y: g.p[1] + g.d[1] * s, tx: g.d[0], ty: g.d[1] };
          const ang = g.a0 + s / r;
          return { x: g.c[0] + r * Math.cos(ang), y: g.c[1] + r * Math.sin(ang), tx: -Math.sin(ang), ty: Math.cos(ang) };
        }
        s -= g.len;
      }
    },
  };
}

const smooth = t => t <= 0 ? 0 : t >= 1 ? 1 : t * t * (3 - 2 * t);

// Rotate an axis-frame point by 45° about the origin and move to the canvas centre.
const rot = ([x, y], cx = 60, cy = 60) => [cx + (x - y) * Math.SQRT1_2, cy + (x + y) * Math.SQRT1_2];

function pathFrom(points) {
  return points.map((p, i) => `${i ? 'L' : 'M'}${f(p[0])} ${f(p[1])}`).join(' ');
}

// Rounded rect with per-corner radii [tl, tr, br, bl] in the axis frame, returned as points+radii.
function rectPts(x0, y0, x1, y1) {
  return [[x0, y0], [x1, y0], [x1, y1], [x0, y1]];
}

export { INK, APR, BG, W, A, R, rounded, ringSampler, smooth, rot, pathFrom, rectPts, f };
