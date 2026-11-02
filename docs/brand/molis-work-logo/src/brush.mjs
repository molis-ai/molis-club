// Round 23: the brush, done properly. One engine for the three marks:
// head (slanted entry), fingers where the brush splits, 飞白 streaks / hairlines / broken edges (holes),
// a warm river through the ink with a few stars in and around it, and the stars it becomes past the ink.
import { add, sub, mul, polar, chain, cub, lin, ribbon } from './kit.mjs';
import { f } from './free.mjs';
import { frame, at as at1, star4, rng } from './frame.mjs';
// like bd17's at(), but carries on straight past either end of the spine
const at = (fr, u, s) => {
  if (u >= 0 && u <= 1) return at1(fr, u, s);
  const P = fr.P, [i, j] = u < 0 ? [0, 1] : [P.length - 1, P.length - 2], t = sub(P[i], P[j]), l = Math.hypot(...t);
  return add(at1(fr, u < 0 ? 0 : 1, s), mul(t, ((u < 0 ? -u : u - 1) * fr.L) / l));
};

let uid = 0;
const D = pts => pts.map((p, i) => `${i ? 'L' : 'M'}${f(p[0])} ${f(p[1])}`).join('') + 'Z';
const clamp = (x, a = 0, b = 1) => Math.max(a, Math.min(b, x));
const sup = (t, p) => (t <= 0 ? 0 : t >= 1 ? 1 : Math.pow(1 - Math.pow(1 - t, p), 1 / p));

const PAPER = { ink: ['#16224a', '#2b437c'], river: ['#d9774a', '#f4b48f', '#ea9260'], star: '#ea9260', speck: '#f4eee9', dust: '#f4b48f' };
const NIGHT = { ink: ['#f4eee9', '#fbe3d2'], river: ['#e27a48', '#f4b48f', '#f4b48f'], star: '#f4b48f', speck: '#1a294f', dust: '#f4b48f' };

function brush({ spine, W, head = null, gaps = [], ends, tl = 0.14, tipP = 0.6, bias = [0.4, 0.5, 0.5, 0.55, 0.5], veins = [], river = null, specks = [], trail = [], spark = null, band = null, pal = PAPER, n = 600, parts = false }) {
  const fr = frame(spine, n), us = Array.from({ length: fr.P.length }, (_, i) => i / (fr.P.length - 1));
  const hl = u => W(u) / 2;
  const pos = (u, s) => at(fr, u, s * hl(u));
  const gw = (g, u) => (u <= g.u0 ? 0 : g.w * Math.pow(clamp((u - g.u0) / (g.full ?? 0.2)), 1.3));
  const m = gaps.length + 1;
  const lo = (j, u) => (j === 0 ? -1 : gaps[j - 1].b + gw(gaps[j - 1], u) / 2), hi = (j, u) => (j === m - 1 ? 1 : gaps[j].b - gw(gaps[j], u) / 2);
  const edge = (j, u, side) => { const a = lo(j, u), b = hi(j, u), c = a + (b - a) * bias[j], t = Math.pow(clamp((ends[j] - u) / tl), tipP); return side < 0 ? c - (c - a) * t : c + (b - c) * t; };
  const span = (a, b) => [a, ...us.filter(u => u > a && u < b), b];
  const start = head ? head.u / fr.L : 0;
  const poly = [];
  for (let j = 0; j < m; j++) {
    poly.push(...span(j === 0 ? start : gaps[j - 1].u0, ends[j]).map(u => pos(u, edge(j, u, -1))));
    poly.push(...span(j === m - 1 ? start : gaps[j].u0, ends[j]).reverse().map(u => pos(u, edge(j, u, 1))));
  }
  const sliver = v => { const L = [], R = []; for (const u of span(v.u0, v.u1)) { const t = (u - v.u0) / (v.u1 - v.u0), h = (v.w / 2) * Math.pow(Math.sin(Math.PI * Math.pow(t, v.skew ?? 0.7)), v.round ?? 0.85); L.push(pos(u, v.s - h)); R.push(pos(u, v.s + h)); } return [...L, ...R.reverse()]; };
  const endU = Math.max(...ends), id = 'k' + uid++;
  const g = lin(pal.ink.map((c, i) => [i / (pal.ink.length - 1), c]), fr.P[0], at(fr, endU, 0));
  let defs = g.def + `<mask id="${id}" maskUnits="userSpaceOnUse" x="-60" y="-60" width="240" height="240"><rect x="-60" y="-60" width="240" height="240" fill="#fff"/><path d="${veins.map(v => D(sliver(v))).join('')}" fill="#000"/></mask>`;
  if (head) { // the pressed head: one cubic from the lower edge round to the upper edge
    const u = start, B = pos(u, 1), T = pos(u, -1), t0 = sub(fr.P[0], fr.P[6]), tl0 = Math.hypot(...t0), bk = mul(t0, 1 / tl0), nn = sub(T, B), nl = Math.hypot(...nn), up = mul(nn, 1 / nl);
    poly.push(...cub([B, add(add(B, mul(bk, head.kb)), mul(up, head.lb ?? 0)), add(add(T, mul(bk, head.kt)), mul(up, -(head.lt ?? 0))), T], 40).slice(1, -1));
  }
  const blob = '';
  let out = `<path d="${D(poly)}${blob}" fill="${g.url}" mask="url(#${id})" fill-rule="nonzero"/>`;
  if (river) {
    const q = lin([[0, pal.river[0]], [0.6, pal.river[1]], [1, pal.river[2]]], pos(river.u0, river.s), pos(river.u1, river.s));
    defs += q.def; out += `<path d="${D(sliver(river))}" fill="${q.url}"/>`;
  }
  if (band) { const R = rng(band.seed ?? 3); for (let k = 0; k < band.n; k++) { const u = band.u0 + (band.u1 - band.u0) * Math.pow(R(), 0.9), g = (R() + R() + R() - 1.5) / 1.5, s = band.s + g * band.spread; if (Math.abs(s) > 0.85) continue; const p = pos(u, s), r = band.r[0] + (band.r[1] - band.r[0]) * Math.pow(R(), 2.2) * (1 - Math.abs(g)); out += `<circle cx="${f(p[0])}" cy="${f(p[1])}" r="${f(r)}" fill="${pal.speck}" fill-opacity="${f(0.55 + 0.45 * R())}"/>`; } }
  out += specks.map(([u, s, r, c]) => { const p = pos(u, s); return `<circle cx="${f(p[0])}" cy="${f(p[1])}" r="${f(r)}" fill="${c === 'warm' ? pal.dust : pal.speck}"/>`; }).join('');
  out += trail.map(([u, s, r, op = 1, c]) => { const p = at(fr, u, s); return `<circle cx="${f(p[0])}" cy="${f(p[1])}" r="${f(r)}" fill="${c === 'dust' ? pal.dust : pal.star}"${op < 1 ? ` fill-opacity="${op}"` : ''}/>`; }).join('');
  if (spark) out += star4(at(fr, spark[0], spark[1]), spark[2], pal.star, spark[3] ?? 0);
  if (parts) { // the same mark taken apart for motion: ink, river, stars, and the spine sampled past both ends
    const S = Array.from({ length: 301 }, (_, k) => { const u = -0.25 + (1.3 * k) / 300, c = at(fr, u, 0), nn = sub(at(fr, u, 1), c); return [+u.toFixed(5), f(c[0]), f(c[1]), +nn[0].toFixed(4), +nn[1].toFixed(4), f(hl(clamp(u)))]; });
    const q = river && lin([[0, pal.river[0]], [0.6, pal.river[1]], [1, pal.river[2]]], pos(river.u0, river.s), pos(river.u1, river.s));
    return {
      defs, L: fr.L, S, start, endU,
      ink: `<path d="${D(poly)}" fill="${g.url}" mask="url(#${id})"/>`,
      river: river && { def: q.def, fill: q.url, d: D(sliver(river)), ...river },
      trail: trail.map(([u, s, r, op = 1, c]) => { const p = at(fr, u, s); return { u, x: f(p[0]), y: f(p[1]), r, op, fill: c === 'dust' ? pal.dust : pal.star, dust: c === 'dust' }; }),
      spark: spark && (() => { const p = at(fr, spark[0], spark[1]); return { u: spark[0], x: f(p[0]), y: f(p[1]), r: spark[2], fill: pal.star, svg: star4([0, 0], spark[2], pal.star, 0) }; })(),
    };
  }
  return `<defs>${defs}</defs>` + out;
}

// 一笔星河: pressed in at the lower left, lifted to the upper right; the brush runs dry, the river runs out as stars.
function yibi({ pal = PAPER, small = false, stars = false, ...o } = {}) {
  return brush({
    pal,
    spine: chain([[14, 90], [40, 98], [70, 74], [88, 50], [96, 40], [103, 30], [110, 20]], 120),
    W: u => 24 + 3 * Math.sin(Math.PI * clamp(u / 0.4)) - 8.5 * Math.pow(clamp((u - 0.35) / 0.42), 1.2),
    head: { u: 8, kb: 5, kt: 13, lb: 1, lt: 2 },
    gaps: small ? [{ b: 0.02, u0: 0.42, w: 0.16 }] : [{ b: -0.5, u0: 0.52, w: 0.09, full: 0.16 }, { b: 0.02, u0: 0.42, w: 0.13, full: 0.3 }, { b: 0.5, u0: 0.56, w: 0.08, full: 0.14 }],
    ends: small ? [0.76, 0.72] : [0.74, 0.8, 0.77, 0.75], tl: 0.16,
    veins: small ? [] : [
      { s: -0.3, u0: 0.3, u1: 0.62, w: 0.045 }, { s: 0.3, u0: 0.36, u1: 0.66, w: 0.045 }, { s: 0.72, u0: 0.44, u1: 0.62, w: 0.035 }, { s: -0.72, u0: 0.48, u1: 0.64, w: 0.03 },
      { s: -0.14, u0: 0.5, u1: 0.71, w: 0.02 }, { s: 0.17, u0: 0.55, u1: 0.73, w: 0.018 }, { s: 0.63, u0: 0.62, u1: 0.72, w: 0.02 },
      { s: -0.98, u0: 0.56, u1: 0.69, w: 0.08, skew: 0.5 }, { s: 0.97, u0: 0.63, u1: 0.71, w: 0.07 },
    ],
    river: { s: 0.02, u0: 0.14, u1: 0.83, w: small ? 0.16 : 0.12, skew: 0.62 },
    band: !stars ? null : { s: 0.02, u0: 0.2, u1: 0.62, n: 26, spread: 0.32, r: [0.16, 0.42], seed: 5 },
    trail: small ? [[0.87, 0, 1.6], [0.92, 0, 1.2]] : [[0.865, 0, 1.3], [0.905, 0.3, 1.0], [0.94, -0.2, 0.7], [0.92, 3, 0.36, 0.75, 'dust'], [0.955, 2.4, 0.3, 0.6, 'dust']],
    spark: [0.985, 0, small ? 4.4 : 3.6, 0],
    ...o,
  });
}

// 墨月: the moon in one stroke, entered with the tip at its lower horn, pressed round its back, running dry at the top
// where it flicks up; the river inside leaves through the strands and climbs on as stars.
function moon({ pal = PAPER, small = false, C = [57, 66], R = 32, a0 = 74, sweep = 196, flick = [32, -34], k = 0.83, Wm = 27, ...o } = {}) {
  const arcPts = Array.from({ length: 200 }, (_, i) => polar(C, R, a0 + (sweep * i) / 199));
  const e = arcPts[arcPts.length - 1], tan = polar([0, 0], 1, a0 + sweep + 90);
  const spine = [...arcPts, ...cub([e, add(e, mul(tan, 12)), add(e, [flick[0] * 0.55, flick[1] * 0.3]), add(e, flick)], 80).slice(1)];
  return brush({
    pal, spine,
    W: u => Wm * Math.pow(Math.sin((Math.PI / 2) * clamp(u / 0.44)), 1.15) * (1 - 0.56 * Math.pow(clamp((u - 0.46) / 0.4), 1.15)) + 0.2,
    gaps: small ? [{ b: 0.06, u0: 0.5, w: 0.18 }] : [{ b: -0.48, u0: 0.56, w: 0.1, full: 0.14 }, { b: 0.06, u0: 0.46, w: 0.14, full: 0.22 }, { b: 0.52, u0: 0.6, w: 0.08, full: 0.12 }],
    ends: small ? [k - 0.01, k - 0.05] : [k - 0.02, k + 0.03, k - 0.04, k - 0.07], tl: 0.15,
    veins: small ? [] : [
      { s: -0.36, u0: 0.34, u1: 0.62, w: 0.045 }, { s: 0.34, u0: 0.4, u1: 0.66, w: 0.045 }, { s: 0.74, u0: 0.48, u1: 0.64, w: 0.035 }, { s: -0.74, u0: 0.5, u1: 0.68, w: 0.03 },
      { s: -0.16, u0: 0.54, u1: 0.72, w: 0.02 }, { s: 0.22, u0: 0.58, u1: 0.74, w: 0.018 },
      { s: -0.98, u0: 0.6, u1: 0.72, w: 0.08, skew: 0.5 }, { s: 0.97, u0: 0.64, u1: 0.73, w: 0.07 },
    ],
    river: { s: 0.06, u0: 0.1, u1: k + 0.06, w: small ? 0.16 : 0.12, skew: 0.6 },
    trail: small ? [[0.9, 0, 1.6], [0.95, 0, 1.2]] : [[0.875, 0, 1.3], [0.91, 0.3, 1.0], [0.945, -0.2, 0.7], [0.925, 3, 0.36, 0.75, 'dust'], [0.96, 2.4, 0.3, 0.6, 'dust']],
    spark: [0.995, 0, small ? 4.4 : 3.6, 0],
    ...o,
  });
}

export { moon, brush, yibi, PAPER, NIGHT, clamp, sup };

// 墨蒲公英: the press of the brush is the seed, the thin stroke its beak, the bristles its pappus;
// each bristle is ink at the root and light at the tip, and the seed's light drifts on as stars.
function seed({ pal = PAPER, small = false, base = [28, 98], dir = -50, beak = 38, N = small ? 5 : 9, fan = small ? 112 : 128, L = small ? 31 : 30, curl = 16, w0 = small ? 3.6 : 2.5, ...o } = {}) {
  const u = polar([0, 0], 1, dir), nrm = [-u[1], u[0]], top = add(base, mul(u, beak));
  let defs = '', out = '';
  // seed and beak in one stroke, bowed a little by the wind
  const stem = cub([base, add(add(base, mul(u, beak * 0.35)), mul(nrm, 3)), add(add(base, mul(u, beak * 0.72)), mul(nrm, 2)), top], 140);
  const aL = (o.achene ?? 15) / beak, aw = o.acheneW ?? (small ? 8 : 6.8), bw = small ? 2.4 : 1.7;
  // a spindle for the seed, flowing into the thin beak (smooth max of the two)
  const ach = t => (t < aL ? aw * Math.pow(Math.sin(Math.PI * Math.pow(t / aL, 0.8)), 0.8) : 0), bk = t => bw * clamp((t - aL * 0.5) / (aL * 0.4)) * (1 - 0.4 * clamp((t - aL) / (1 - aL)));
  const W = t => { const a = ach(t), b = bk(t), k = 1.2; return k * Math.log(Math.exp(a / k) + Math.exp(b / k)) - k * Math.log(2) * Math.exp(-Math.abs(a - b)); };
  const sg = lin([[0, pal.ink[0]], [1, pal.ink[1]]], base, top); defs += sg.def;
  // one dry streak down the seed, the same 飞白 as the other marks
  const mid = stem.slice(Math.round(stem.length * aL * 0.18), Math.round(stem.length * aL * 0.78)).map(p => add(p, mul(nrm, -aw * 0.12)));
  const mk = 'sd' + uid++;
  defs += `<mask id="${mk}" maskUnits="userSpaceOnUse" x="-60" y="-60" width="240" height="240"><rect x="-60" y="-60" width="240" height="240" fill="#fff"/><path d="${small ? '' : D(ribbon(mid, t => 0.75 * Math.pow(Math.sin(Math.PI * Math.pow(t, 0.7)), 0.9)))}" fill="#000"/></mask>`;
  out += `<path d="${D(ribbon(stem, W))}" fill="${sg.url}" mask="url(#${mk})"/>`;
  // pappus
  for (let i = 0; i < N; i++) {
    const k = i / (N - 1) - 0.5, a = dir + fan * k, len = L * (1 - 0.3 * (2 * k) ** 2), d0 = polar([0, 0], 1, a), d1 = polar([0, 0], 1, a + curl * Math.sign(k) * Math.abs(2 * k) ** 0.8);
    const e = add(top, mul(d1, len)), pts = cub([top, add(top, mul(d0, len * 0.5)), sub(e, mul(d1, len * 0.28)), e], 50);
    const g = lin([[0, pal.ink[1]], [0.35, pal.ink[1]], [1, pal.ink[1], 0.12]], top, e); defs += g.def; // the brush lifts off
    out += `<path d="${D(ribbon(pts, t => w0 * Math.pow(1 - 0.86 * t, 1.1)))}" fill="${g.url}"/>`;
    const tip = add(e, mul(d1, small ? 2.4 : 1.9));
    out += `<circle cx="${f(tip[0])}" cy="${f(tip[1])}" r="${f((small ? 2 : 1.35) * (1 - 0.25 * Math.abs(2 * k)))}" fill="${pal.river[1]}"/>`;
  }
  // the light drifts on with the wind
  const fl = polar([0, 0], 1, dir + 22), drift = small ? [[L + 9, 0, 1.7]] : [[L + 7, 0.5, 1.25], [L + 13, -1.5, 0.95], [L + 19, 0.5, 0.7]];
  for (const [r, lat, rr] of drift) { const p = add(add(top, mul(fl, r)), mul(nrm, lat)); out += `<circle cx="${f(p[0])}" cy="${f(p[1])}" r="${f(rr)}" fill="${pal.star}"/>`; }
  out += star4(add(top, mul(fl, L + (small ? 18 : 28))), small ? 4.4 : 3.6, pal.star);
  return `<defs>${defs}</defs>` + out;
}
export { seed };
