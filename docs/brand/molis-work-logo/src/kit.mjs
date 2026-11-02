// Curved-plane toolkit: planes from cubic edges with filleted corners, overlap tints via clipPath, userSpace gradients.
import { f } from './free.mjs';

const add = (a, b) => [a[0] + b[0], a[1] + b[1]], sub = (a, b) => [a[0] - b[0], a[1] - b[1]];
const mul = (a, s) => [a[0] * s, a[1] * s], lerp = (a, b, t) => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t];
const len = a => Math.hypot(a[0], a[1]);
const rot = (p, deg, c = [0, 0]) => { const a = deg * Math.PI / 180, x = p[0] - c[0], y = p[1] - c[1]; return [c[0] + x * Math.cos(a) - y * Math.sin(a), c[1] + x * Math.sin(a) + y * Math.cos(a)]; };
const polar = (c, r, deg) => [c[0] + r * Math.cos(deg * Math.PI / 180), c[1] + r * Math.sin(deg * Math.PI / 180)];

const cub = ([p0, p1, p2, p3], n = 48) => Array.from({ length: n + 1 }, (_, i) => {
  const t = i / n, u = 1 - t;
  return [0, 1].map(k => u * u * u * p0[k] + 3 * u * u * t * p1[k] + 3 * u * t * t * p2[k] + t * t * t * p3[k]);
});
// Edge a->b bowed sideways by k (fraction of its length; + is outward on a clockwise-on-screen outline). k may be [k1, k2].
const bow = (a, b, k = 0) => {
  const d = sub(b, a), L = len(d), n = [d[1] / L, -d[0] / L], [k1, k2] = Array.isArray(k) ? k : [k, k];
  return [a, add(lerp(a, b, 1 / 3), mul(n, k1 * L)), add(lerp(a, b, 2 / 3), mul(n, k2 * L)), b];
};
const arcLen = pts => pts.slice(1).reduce((s, p, i) => s + len(sub(p, pts[i])), 0);
// Drop the first d of arc length from pts.
function trimHead(pts, d) {
  if (d <= 0) return pts;
  for (let i = 1, acc = 0; i < pts.length; i++) {
    const s = len(sub(pts[i], pts[i - 1]));
    if (acc + s >= d) return [lerp(pts[i - 1], pts[i], (d - acc) / s), ...pts.slice(i)];
    acc += s;
  }
  return [pts[pts.length - 1]];
}
const trimTail = (pts, d) => trimHead([...pts].reverse(), d).reverse();
// Closed plane from edges (each a cubic [a,c1,c2,b] or a point list), corner i sits at the start of edge i, radius r[i].
function plane(edges, r = 0) {
  const E = edges.map(e => (e.length === 4 && !e.pts ? cub(e) : e.pts || e));
  const R = edges.map((_, i) => (Array.isArray(r) ? r[i] ?? 0 : r));
  const T = E.map((pts, i) => trimTail(trimHead(pts, R[i]), R[(i + 1) % E.length]));
  const out = [];
  T.forEach((pts, i) => {
    const prev = T[(i - 1 + T.length) % T.length], corner = E[i][0];
    if (R[i]) { const a = prev[prev.length - 1], b = pts[0]; for (let s = 1; s < 12; s++) { const t = s / 12, u = 1 - t; out.push([u * u * a[0] + 2 * u * t * corner[0] + t * t * b[0], u * u * a[1] + 2 * u * t * corner[1] + t * t * b[1]]); } }
    out.push(...pts.slice(R[i] ? 0 : 0, -1));
  });
  return out;
}
const d = pts => pts.map((p, i) => `${i ? 'L' : 'M'}${f(p[0])} ${f(p[1])}`).join('') + 'Z';

let uid = 0;
const mkid = p => p + (uid++).toString(36);
// Linear gradient in user space, stops [offset, colour, opacity?].
function lin(stops, a, b) {
  const id = mkid('l');
  return { url: `url(#${id})`, def: `<linearGradient id="${id}" gradientUnits="userSpaceOnUse" x1="${f(a[0])}" y1="${f(a[1])}" x2="${f(b[0])}" y2="${f(b[1])}">${stops.map(([o, c, op = 1]) => `<stop offset="${o}" stop-color="${c}"${op < 1 ? ` stop-opacity="${op}"` : ''}/>`).join('')}</linearGradient>` };
}
// Canvas: collects defs and paths.
function canvas() {
  let defs = '', body = '';
  const fill = c => (typeof c === 'string' ? c : (defs += c.def, c.url));
  return {
    g: (stops, a, b) => lin(stops, a, b),
    path(pts, c, extra = '') { body += `<path d="${d(pts)}" fill="${fill(c)}"${extra}/>`; return this; },
    raw(s) { body += s; return this; },
    // Paint `pts` only where it overlaps `within`.
    over(pts, within, c) { const id = mkid('c'); defs += `<clipPath id="${id}"><path d="${d(within)}"/></clipPath>`; body += `<path d="${d(pts)}" fill="${fill(c)}" clip-path="url(#${id})"/>`; return this; },
    svg() { return (defs ? `<defs>${defs}</defs>` : '') + body; },
  };
}
const mix = (a, b, u) => { const pa = parseInt(a.slice(1), 16), pb = parseInt(b.slice(1), 16); return '#' + [16, 8, 0].map(s => Math.round(((pa >> s) & 255) * (1 - u) + ((pb >> s) & 255) * u).toString(16).padStart(2, '0')).join(''); };

export { add, sub, mul, lerp, len, rot, polar, cub, bow, arcLen, trimHead, trimTail, plane, d, lin, canvas, mix };

// Open polyline with filleted corners, as points.
function fillet(pts, r) {
  const out = [pts[0]];
  for (let i = 1; i < pts.length - 1; i++) {
    const a = pts[i - 1], p = pts[i], b = pts[i + 1], u1 = mul(sub(p, a), 1 / len(sub(p, a))), u2 = mul(sub(b, p), 1 / len(sub(b, p)));
    const turn = Math.acos(Math.max(-1, Math.min(1, u1[0] * u2[0] + u1[1] * u2[1]))), ri = Array.isArray(r) ? r[i] : r;
    const t = Math.min(ri * Math.tan(turn / 2), len(sub(p, a)) / 2, len(sub(b, p)) / 2), p1 = sub(p, mul(u1, t)), p2 = add(p, mul(u2, t));
    for (let s = 0; s <= 12; s++) { const k = s / 12, v = 1 - k; out.push([v * v * p1[0] + 2 * v * k * p[0] + k * k * p2[0], v * v * p1[1] + 2 * v * k * p[1] + k * k * p2[1]]); }
  }
  out.push(pts[pts.length - 1]);
  return out;
}
// Resample a polyline evenly by arc length.
function even(pts, n = 200) {
  const L = arcLen(pts), out = [pts[0]];
  for (let i = 1, acc = 0, k = 1; i < pts.length && k < n; i++) {
    const s = len(sub(pts[i], pts[i - 1]));
    while (k < n && acc + s >= (k * L) / n) { out.push(lerp(pts[i - 1], pts[i], ((k * L) / n - acc) / s)); k++; }
    acc += s;
  }
  out.push(pts[pts.length - 1]);
  return out;
}
// Closed outline of a ribbon along pts whose width is w(u); w may be [left(u), right(u)] for an off-centre ribbon.
function ribbon(pts, w) {
  const P = even(pts, 240), Lft = [], Rgt = [];
  const [wl, wr] = Array.isArray(w) ? w : [u => w(u) / 2, u => w(u) / 2];
  P.forEach((p, i) => {
    const a = P[Math.max(0, i - 1)], b = P[Math.min(P.length - 1, i + 1)], t = sub(b, a), l = len(t) || 1, n = [-t[1] / l, t[0] / l], u = i / (P.length - 1);
    Lft.push(add(p, mul(n, wl(u)))); Rgt.push(sub(p, mul(n, wr(u))));
  });
  return [...Lft, ...Rgt.reverse()];
}
const chain = (c, n = 48) => { const out = []; for (let i = 0; i + 3 < c.length; i += 3) out.push(...cub(c.slice(i, i + 4), n).slice(i ? 1 : 0)); return out; };
const arc = (c, r, a0, a1, n = 96) => Array.from({ length: n + 1 }, (_, i) => polar(c, r, a0 + (a1 - a0) * i / n));
export { fillet, even, ribbon, chain, arc };
