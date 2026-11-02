// Free directions: kite, constellation, bird. Helpers for tapered strokes.
import { rounded } from './geo.mjs';

const NAVY = '#1a294f', APR = '#ea9260', APR2 = '#d9774a', PEACH = '#f4b48f', CREAM = '#f4eee9';
const f = n => +n.toFixed(2);

const cubic = (p0, p1, p2, p3, t) => {
  const u = 1 - t;
  return [0, 1].map(k => u * u * u * p0[k] + 3 * u * u * t * p1[k] + 3 * u * t * t * p2[k] + t * t * t * p3[k]);
};
// chain: [p0, c1, c2, p1, c3, c4, p2, ...]
function sample(chain, per = 40) {
  const pts = [];
  for (let i = 0; i + 3 < chain.length; i += 3)
    for (let k = i ? 1 : 0; k <= per; k++) pts.push(cubic(chain[i], chain[i + 1], chain[i + 2], chain[i + 3], k / per));
  let acc = 0;
  const len = [0];
  for (let i = 1; i < pts.length; i++) len.push((acc += Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1])));
  return pts.map((p, i) => ({ x: p[0], y: p[1], u: len[i] / acc }));
}
// Filled outline of a stroke whose width follows w(u), u in 0..1, with round ends.
function taper(chain, w, per = 40) {
  const s = sample(chain, per);
  const L = [], Rr = [];
  for (let i = 0; i < s.length; i++) {
    const a = s[Math.max(0, i - 1)], b = s[Math.min(s.length - 1, i + 1)];
    let tx = b.x - a.x, ty = b.y - a.y; const l = Math.hypot(tx, ty) || 1; tx /= l; ty /= l;
    const h = w(s[i].u) / 2;
    L.push([s[i].x - ty * h, s[i].y + tx * h]);
    Rr.push([s[i].x + ty * h, s[i].y - tx * h]);
  }
  const cap = (c, from, to, h) => {
    const out = [];
    const a0 = Math.atan2(from[1] - c[1], from[0] - c[0]);
    for (let k = 1; k < 8; k++) { const a = a0 + Math.PI * k / 8; out.push([c[0] + h * Math.cos(a), c[1] + h * Math.sin(a)]); }
    return out;
  };
  const end = s[s.length - 1], st = s[0];
  const pts = [...L, ...cap([end.x, end.y], L[L.length - 1], Rr[Rr.length - 1], w(1) / 2), ...Rr.reverse(), ...cap([st.x, st.y], Rr[Rr.length - 1], L[0], w(0) / 2)];
  return pts.map((p, i) => `${i ? 'L' : 'M'}${f(p[0])} ${f(p[1])}`).join(' ') + 'Z';
}
const curve = chain => `M${chain[0].join(' ')} ` + chain.slice(1).reduce((s, p, i) => s + (i % 3 === 0 ? 'C' : '') + p.join(' ') + ' ', '');

const rotAbout = (p, deg, c) => {
  const a = deg * Math.PI / 180, x = p[0] - c[0], y = p[1] - c[1];
  return [c[0] + x * Math.cos(a) - y * Math.sin(a), c[1] + x * Math.sin(a) + y * Math.cos(a)];
};

export { NAVY, APR, APR2, PEACH, CREAM, f, cubic, sample, taper, curve, rotAbout, rounded };
