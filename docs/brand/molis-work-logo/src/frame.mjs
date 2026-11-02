// Round 17: 墨里星河 as 飞白. One brush stroke of ink; where the brush runs dry, the white streaks are a river of light,
// and the river flows on past the ink as stars.
import { add, sub, mul, lerp, polar, chain, even, lin } from './kit.mjs';
import { f } from './free.mjs';

let uid = 0;
const D = pts => pts.map((p, i) => `${i ? 'L' : 'M'}${f(p[0])} ${f(p[1])}`).join('') + 'Z';
const clamp = (x, a = 0, b = 1) => Math.max(a, Math.min(b, x));
const rng = s => () => { s = (s + 0x6d2b79f5) | 0; let t = Math.imul(s ^ (s >>> 15), 1 | s); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };

function frame(pts, n = 500) {
  const P = even(pts, n), N = P.map((p, i) => { const t = sub(P[Math.min(P.length - 1, i + 1)], P[Math.max(0, i - 1)]), l = Math.hypot(...t) || 1; return [-t[1] / l, t[0] / l]; });
  let L = 0; for (let i = 1; i < P.length; i++) L += Math.hypot(...sub(P[i], P[i - 1]));
  return { P, N, L };
}
const at = ({ P, N }, u, s) => { const x = clamp(u) * (P.length - 1), i = Math.min(P.length - 2, Math.floor(x)), k = x - i; return add(lerp(P[i], P[i + 1], k), mul(lerp(N[i], N[i + 1], k), s)); };
const star4 = (p, r, col, rot = 0) => { const k = r * 0.2, q = [[0, -r], [k, -k], [r, 0], [k, k], [0, r], [-k, k], [-r, 0], [-k, -k]].map(([x, y]) => { const a = rot * Math.PI / 180; return [p[0] + x * Math.cos(a) - y * Math.sin(a), p[1] + x * Math.sin(a) + y * Math.cos(a)]; }); return `<path d="M${f(q[0][0])} ${f(q[0][1])}Q${f(q[1][0])} ${f(q[1][1])} ${f(q[2][0])} ${f(q[2][1])}Q${f(q[3][0])} ${f(q[3][1])} ${f(q[4][0])} ${f(q[4][1])}Q${f(q[5][0])} ${f(q[5][1])} ${f(q[6][0])} ${f(q[6][1])}Q${f(q[7][0])} ${f(q[7][1])} ${f(q[0][0])} ${f(q[0][1])}Z" fill="${col}"/>`; };
const circ = (p, r, n = 18) => Array.from({ length: n }, (_, i) => polar(p, r, (i * 360) / n));

// spine: points through the whole gesture (ink + the stars' flight). W(u): full width.
// gaps: open streaks that split the tail into fingers [{b, u0, w}] sorted by b; ends: where each finger stops; tl: tip length.
// veins: closed streaks inside the ink [{s, u0, u1, w, dots}] — slivers that dissolve into a line of dots.
function brushStroke({ spine, W, cap = true, capP = 2, riverVein = null, gaps = [], ends, tl = 0.1, veins = [], flight = 1, ink = ['#1a294f', '#2b437c'], river = ['#f4b48f', '#fde6d4'], glow = true, stars = '#ea9260', spark = '#ea9260', seed = 7, dust = 14, sparkAt = null } = {}) {
  const fr = frame(spine), n = fr.P.length, us = Array.from({ length: n }, (_, i) => i / (n - 1));
  const w0 = W(0) / 2;
  const Wc = u => { const x = u * fr.L; return cap && x < w0 ? W(u) * Math.pow(1 - ((w0 - x) / w0) ** capP, 1 / capP) : W(u); };
  const pos = (u, s) => at(fr, u, (s * Wc(u)) / 2);
  const gw = (g, u) => (u <= g.u0 ? 0 : g.w * Math.pow(clamp((u - g.u0) / ((g.full ?? 0.3))), 1.3));
  const m = gaps.length + 1;
  const tip = (j, u) => { const k = clamp((ends[j] - u) / tl); return Math.pow(k, 0.55); };
  const bias = Array.from({ length: m }, (_, j) => [0.3, 0.6, 0.45, 0.55, 0.4, 0.5][j % 6]);
  const lo = (j, u) => (j === 0 ? -1 : gaps[j - 1].b + gw(gaps[j - 1], u) / 2);
  const hi = (j, u) => (j === m - 1 ? 1 : gaps[j].b - gw(gaps[j], u) / 2);
  const edge = (j, u, side) => { const a = lo(j, u), b = hi(j, u), c = a + (b - a) * bias[j], t = tip(j, u); return side < 0 ? c - (c - a) * t : c + (b - c) * t; };
  const span = (a, b) => { const r = us.filter(u => u > a && u < b); return [a, ...r, b]; };
  const poly = [];
  for (let j = 0; j < m; j++) {
    const start = j === 0 ? 0 : gaps[j - 1].u0, stop = j === m - 1 ? 0 : gaps[j].u0;
    poly.push(...span(start, ends[j]).map(u => pos(u, edge(j, u, -1))));
    poly.push(...span(stop, ends[j]).reverse().map(u => pos(u, edge(j, u, 1))));
  }
  const id = 'b' + uid++, endU = Math.max(...ends);
  const g = lin(ink.map((c, i) => [i / (ink.length - 1), c]), fr.P[0], at(fr, endU, 0));
  let holes = '', glowing = '', out = '';
  const R = rng(seed);
  for (const v of veins) {
    const L = [], Rr = [];
    for (const u of span(v.u0, v.u1)) { const t = (u - v.u0) / (v.u1 - v.u0), h = (v.w / 2) * Math.pow(Math.sin(Math.PI * Math.pow(t, v.skew ?? 0.8)), 0.9); L.push(pos(u, v.s - h)); Rr.push(pos(u, v.s + h)); }
    const sliver = [...L, ...Rr.reverse()];
    const dots = [];
    if (v.dots) for (let k = 0; k < v.dots.n; k++) { const u = v.u1 + ((k + 0.6) / v.dots.n) * (v.dots.to - v.u1), r = v.dots.r * (1 - 0.55 * (k / v.dots.n)); dots.push([pos(u, v.s + (R() - 0.5) * 0.08), r]); }
    holes += `<path d="${D(sliver)}${dots.map(([p, r]) => D(circ(p, r))).join('')}"/>`;
    if (glow) glowing += `<path d="${D(sliver)}" fill="${lin([[0, river[0]], [1, river[1]]], pos(v.u0, v.s), pos(v.u1, v.s)).def ? '' : ''}"/>`;
  }
  // stars carry on past the ink along each open streak
  const flightStars = [];
  for (const [i, gp] of gaps.entries()) {
    const from = Math.max(ends[i], ends[i + 1]) + 0.02, k = gp.stars ?? 4;
    for (let q = 0; q < k; q++) { const t = (q + 0.5) / k, u = from + t * (flight - from); flightStars.push([at(fr, u, gp.b * (Wc(Math.min(u, endU)) / 2) * (1 + 1.8 * t) + (R() - 0.5) * 2), (gp.r ?? 1.3) * (1 - 0.5 * t), t]); }
  }
  for (let q = 0; q < dust; q++) { const t = Math.pow(R(), 0.8), u = endU - 0.05 + t * (flight - endU + 0.05), s = (R() - 0.5) * 2; flightStars.push([at(fr, u, s * (Wc(Math.min(u, endU)) / 2) * (1 + 2 * t)), 0.35 + 0.45 * R(), t]); }
  out += `<defs>${g.def}<mask id="${id}" maskUnits="userSpaceOnUse" x="-60" y="-60" width="240" height="240"><rect x="-60" y="-60" width="240" height="240" fill="#fff"/><g fill="#000">${holes}</g></mask></defs>`;
  out += `<path d="${D(poly)}" fill="${g.url}" mask="url(#${id})"/>`;
  if (riverVein) {
    const v = riverVein, L = [], Rr = [];
    for (const u of span(v.u0, v.u1)) { const t = (u - v.u0) / (v.u1 - v.u0), h = (v.w / 2) * Math.pow(Math.sin(Math.PI * Math.pow(t, v.skew ?? 0.7)), 0.8); L.push(pos(u, v.s - h)); Rr.push(pos(u, v.s + h)); }
    const q = lin([[0, river[0]], [0.6, river[1]], [1, stars]], pos(v.u0, v.s), pos(v.u1, v.s));
    out = out.replace('</defs>', q.def + '</defs>') + `<path d="${D([...L, ...Rr.reverse()])}" fill="${q.url}"/>`;
  }
  out += flightStars.map(([p, r, t]) => `<circle cx="${f(p[0])}" cy="${f(p[1])}" r="${f(r)}" fill="${stars}" fill-opacity="${f(1 - 0.5 * t)}"/>`).join('');
  if (sparkAt) out += star4(at(fr, sparkAt[0], sparkAt[1]), sparkAt[2], spark, sparkAt[3] ?? 0);
  return out;
}

// A: one stroke rising to the upper right.
function rise(o = {}) {
  return brushStroke(Object.assign({
    spine: chain([[14, 90], [30, 100], [54, 94], [68, 74], [78, 60], [84, 50], [92, 38], [99, 28], [105, 20], [112, 12]], 80),
    W: u => (u < 0.22 ? 23 : 23 - 9 * ((u - 0.22) / 0.5)) + (u > 0.6 ? (u - 0.6) * 30 : 0),
    gaps: [{ b: -0.55, u0: 0.42, w: 0.16 }, { b: -0.08, u0: 0.5, w: 0.1 }, { b: 0.3, u0: 0.36, w: 0.15 }, { b: 0.68, u0: 0.54, w: 0.1 }],
    ends: [0.7, 0.77, 0.66, 0.74, 0.69], tl: 0.11,
    veins: [{ s: -0.3, u0: 0.16, u1: 0.38, w: 0.1, dots: { n: 3, to: 0.47, r: 0.75 } }, { s: 0.52, u0: 0.2, u1: 0.3, w: 0.07, dots: { n: 2, to: 0.35, r: 0.6 } }, { s: 0.08, u0: 0.27, u1: 0.44, w: 0.07, dots: { n: 2, to: 0.49, r: 0.55 } }],
    sparkAt: [0.97, 0, 3.4, 8],
  }, o));
}

// B: the moon written in one stroke; it rises from the lower tip and runs dry at the top, where its stars fly on.
function moon(o = {}) {
  const C = [56, 62], R = 38, pts = Array.from({ length: 160 }, (_, i) => { const t = i / 159, a = 70 + 205 * t + (t > 0.78 ? (t - 0.78) * 60 : 0); return polar(C, R + (t > 0.78 ? (t - 0.78) * 30 : 0), a); });
  return brushStroke(Object.assign({
    spine: pts, cap: false,
    W: u => 24 * Math.pow(Math.sin(Math.PI * clamp(u * 0.92 + 0.04)), 0.75) * (u < 0.5 ? 0.7 + 0.6 * u : 1) + (u > 0.72 ? (u - 0.72) * 30 : 0),
    gaps: [{ b: -0.5, u0: 0.5, w: 0.16 }, { b: 0.0, u0: 0.56, w: 0.12 }, { b: 0.45, u0: 0.46, w: 0.14 }],
    ends: [0.76, 0.8, 0.72, 0.74], tl: 0.1,
    veins: [{ s: -0.15, u0: 0.24, u1: 0.44, w: 0.1, dots: { n: 3, to: 0.52, r: 0.75 } }, { s: 0.4, u0: 0.3, u1: 0.4, w: 0.07 }],
    sparkAt: [0.99, 0, 3.2, 10],
  }, o));
}

export { brushStroke, rise, moon, frame, at, star4, rng };
