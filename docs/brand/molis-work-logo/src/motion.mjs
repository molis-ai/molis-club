// 一笔星河 in motion -> ../motion.html (node src/motion.mjs)
// 落笔 the ink blooms where the brush presses, 行笔 the stroke sweeps up and runs dry,
// a light runs through the river inside the ink, leaves the split tip, drops three stars and comes to rest as the spark.
// Everything is a pure function of t, so the page can be scrubbed and frames can be checked one by one (?t=1.2, ?strip).
import fs from 'node:fs';
import { yibi, PAPER, NIGHT } from './brush.mjs';

const OUT = new URL('../motion.html', import.meta.url);
const P = { paper: yibi({ pal: PAPER, parts: true }), night: yibi({ pal: NIGHT, parts: true }) };
const A = P.paper;

// crop to what the finished mark draws
const pts = [...A.ink.matchAll(/[ML](-?[\d.]+) (-?[\d.]+)/g)].map(m => [+m[1], +m[2]]);
const sp = A.spark;
pts.push([sp.x - sp.r, sp.y - sp.r], [sp.x + sp.r, sp.y + sp.r]);
const xs = pts.map(p => p[0]), ys = pts.map(p => p[1]), pad = 0.6;
const vb = [Math.min(...xs) - pad, Math.min(...ys) - pad, Math.max(...xs) - Math.min(...xs) + 2 * pad, Math.max(...ys) - Math.min(...ys) + 2 * pad].map(n => +n.toFixed(2)).join(' ');

const LIGHT = {
  paper: { bg: '#f4eee9', text: '#16224a', hot: '#fff3e8', core: '#fffaf5', halo: '#f4b48f', glow: [0.75, 0.3], ctl: 'rgb(22 34 74 / .5)' },
  night: { bg: '#1a294f', text: '#f4eee9', hot: '#ff8a4c', core: '#e8692e', halo: '#f4b48f', glow: [0.7, 0.6], ctl: 'rgb(244 238 233 / .55)' },
};
const DATA = {
  vb,
  geo: { S: A.S, L: A.L, start: A.start, river: { u0: A.river.u0, u1: A.river.u1, s: A.river.s, d: A.river.d }, trail: A.trail.map(({ u, x, y, r, op, dust }) => ({ u, x, y, r, op, dust })), spark: { u: sp.u, x: sp.x, y: sp.y, r: sp.r } },
  look: Object.fromEntries(Object.entries(P).map(([th, p]) => [th, { defs: p.defs + p.river.def, ink: p.ink, river: p.river.fill, trail: p.trail.map(s => s.fill), spark: p.spark.svg, star: p.spark.fill, ...LIGHT[th] }])),
};

fs.writeFileSync(OUT, `<!doctype html>
<html lang="zh-CN">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Molis Work 动效</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Jost:wght@400&display=swap" rel="stylesheet">
<style>
  :root { --bg: ${LIGHT.paper.bg}; --text: ${LIGHT.paper.text}; --ctl: ${LIGHT.paper.ctl}; }
  [data-theme="night"] { --bg: ${LIGHT.night.bg}; --text: ${LIGHT.night.text}; --ctl: ${LIGHT.night.ctl}; }
  * { box-sizing: border-box; }
  html, body { height: 100%; }
  body { margin: 0; background: var(--bg); color: var(--text); transition: background .5s, color .5s; overflow: hidden; }
  .stage { position: fixed; inset: 0; display: grid; place-items: center; cursor: pointer; --m: clamp(112px, 15vw, 220px); }
  .lockup { display: flex; align-items: center; gap: calc(var(--m) * .2); will-change: transform; }
  .mark { height: var(--m); width: auto; overflow: visible; display: block; }
  .word { font: 400 calc(var(--m) * .44)/1 Jost, sans-serif; letter-spacing: .005em; white-space: nowrap; padding-top: calc(var(--m) * .04); }
  .word span { display: inline-block; opacity: 0; }
  .ctl { position: fixed; left: 50%; bottom: 28px; transform: translateX(-50%); display: flex; align-items: center; gap: 18px; width: min(420px, calc(100vw - 32px)); color: var(--ctl); }
  .ctl button { all: unset; cursor: pointer; display: grid; place-items: center; }
  .replay svg { width: 18px; height: 18px; display: block; }
  .scrub { flex: 1; appearance: none; height: 18px; background: transparent; color: inherit; cursor: pointer; }
  .scrub::-webkit-slider-runnable-track { height: 1px; background: currentColor; }
  .scrub::-webkit-slider-thumb { appearance: none; width: 9px; height: 9px; border-radius: 50%; background: currentColor; margin-top: -4px; }
  .ctl .sw { width: 14px; height: 14px; border-radius: 50%; box-shadow: 0 0 0 1px var(--ctl); }
  .sw[data-th="paper"] { background: ${LIGHT.paper.bg}; } .sw[data-th="night"] { background: ${LIGHT.night.bg}; }
  .sw[aria-pressed="true"] { box-shadow: 0 0 0 1px var(--bg), 0 0 0 2.5px var(--ctl); }
  .strip { display: grid; grid-template-columns: repeat(4, 1fr); }
  .strip { --m: 72px; } .strip .stage { position: relative; inset: auto; aspect-ratio: 16 / 9; --m: inherit; overflow: hidden; }
  .strip .stage i { position: absolute; left: 8px; top: 6px; font: 10px/1 ui-monospace, monospace; opacity: .5; }
</style>
</head>
<body>
<script>
const DATA = ${JSON.stringify(DATA)};
const G = DATA.geo, R = G.river;
const clamp = (x, a = 0, b = 1) => Math.max(a, Math.min(b, x));
const oC = x => 1 - (1 - clamp(x)) ** 3, ioC = x => (x = clamp(x), x < .5 ? 4 * x ** 3 : 1 - (-2 * x + 2) ** 3 / 2);
const oB = (x, s = 1.6) => (x = clamp(x), 1 + (s + 1) * (x - 1) ** 3 + s * (x - 1) ** 2);
// position through keys [t, u, velocity], smooth in both
const hermite = keys => t => {
  if (t <= keys[0][0]) return keys[0][1];
  for (let i = 0; i < keys.length - 1; i++) {
    const [t0, u0, v0] = keys[i], [t1, u1, v1] = keys[i + 1];
    if (t > t1) continue;
    const h = t1 - t0, s = (t - t0) / h, s2 = s * s, s3 = s2 * s;
    return (2 * s3 - 3 * s2 + 1) * u0 + (s3 - 2 * s2 + s) * h * v0 + (3 * s2 - 2 * s3) * u1 + (s3 - s2) * h * v1;
  }
  const [tl, ul, vl] = keys[keys.length - 1];
  return ul + (t - tl) * vl;
};

// the timeline, in seconds
const T = {
  blot: [0, 0.24, 22],                                            // the brush presses: ink blooms out from the head
  ink: [[0.13, 0.08, 0], [0.62, 0.44, 1.05], [1.02, 0.95, 1.5]],  // then sweeps up, gathering speed, and flicks off
  light: [[0.5, R.u0 - 0.03, 0.55], [1.1, 0.83, 1.0]],           // the light runs the river behind it and leaves the tip
  slide: [1.72, 0.85], word: [1.9, 0.036, 0.7],                  // the mark makes room, the name settles in
  end: 3, idle: 6,
};
const inkU = hermite(T.ink), lightIn = hermite(T.light);
const [tx, ux, vx] = T.light[T.light.length - 1], uEnd = G.spark.u, k = vx / (uEnd - ux);
// past the tip the light keeps its speed and coasts to rest at the spark
const lightU = t => (t <= tx ? lightIn(t) : uEnd - (uEnd - ux) * Math.exp(-(t - tx) * k));
const passT = u => tx - Math.log((uEnd - u) / (uEnd - ux)) / k;
const tArrive = passT(uEnd - 0.02);

const S = G.S, du = S[1][0] - S[0][0];
const samp = u => { const x = clamp((u - S[0][0]) / du, 0, S.length - 1.0001), i = Math.floor(x), f = x - i; return S[i].map((v, j) => v + (S[i + 1][j] - v) * f); };
const fmt = p => p[0].toFixed(2) + ' ' + p[1].toFixed(2);
// the part of the spine between uA and uB, H(halfWidth) wide; a rounded brush-tip front when tip > 0
function region(uA, uB, H, tip = 0) {
  if (uB <= uA) return '';
  const n = Math.max(2, Math.ceil((uB - uA) / 0.005)), L = [], Rt = [];
  for (let j = 0; j <= n; j++) { const [, x, y, nx, ny, h] = samp(uA + ((uB - uA) * j) / n), w = H(h); L.push([x + nx * w, y + ny * w]); Rt.push([x - nx * w, y - ny * w]); }
  const cap = [];
  if (tip) {
    const [, x, y, nx, ny, h] = samp(uB), w = H(h), tx = ny, ty = -nx;
    for (let j = 1; j < 16; j++) { const l = w * (1 - (2 * j) / 16), fw = Math.abs(l) < h ? tip * h * Math.sqrt(1 - (l / h) ** 2) : 0; cap.push([x + nx * l + tx * fw, y + ny * l + ty * fw]); }
  }
  return 'M' + [...L, ...cap, ...Rt.reverse()].map(fmt).join('L') + 'Z';
}

let uid = 0;
function Stage(el, theme) {
  const id = uid++, L = DATA.look[theme], mask = (n, body) => '<mask id="' + n + id + '" maskUnits="userSpaceOnUse" x="-60" y="-60" width="240" height="240">' + body + '</mask>';
  el.innerHTML = '<div class="lockup"><svg class="mark" viewBox="' + DATA.vb + '" aria-label="Molis Work"><defs>' + L.defs +
    '<filter id="sf' + id + '" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="0.45"/></filter>' +
    '<filter id="hb' + id + '" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="2.2"/></filter>' +
    '<radialGradient id="gl' + id + '"><stop offset="0" stop-color="' + L.halo + '" stop-opacity=".95"/><stop offset=".35" stop-color="' + L.halo + '" stop-opacity=".4"/><stop offset="1" stop-color="' + L.halo + '" stop-opacity="0"/></radialGradient>' +
    mask('mi', '<g fill="#fff" filter="url(#sf' + id + ')"><path class="sweep"/><circle class="blot" r="0"/></g>') +
    mask('mr', '<path class="rr" fill="#fff" filter="url(#sf' + id + ')"/>') +
    mask('mh', '<path class="hw" fill="#fff" filter="url(#hb' + id + ')"/>') +
    '</defs><g class="ink" mask="url(#mi' + id + ')">' + L.ink + '</g>' +
    '<path d="' + R.d + '" fill="' + L.river + '" mask="url(#mr' + id + ')"/>' +
    '<path class="hot" d="' + R.d + '" fill="' + L.hot + '" mask="url(#mh' + id + ')"/>' +
    '<circle class="bloom" r="0" fill="url(#gl' + id + ')" opacity="0"/>' +
    '<g class="light" opacity="0"><circle class="halo" r="5.5" fill="url(#gl' + id + ')"/><circle class="core" r="1.15" fill="' + L.core + '"/><circle class="core out" r="1.15" fill="' + L.star + '" opacity="0"/></g>' +
    G.trail.map((s, i) => '<g class="st" opacity="0"><circle r="' + s.r + '" fill="' + L.trail[i] + '"/></g>').join('') +
    '<g class="spark" opacity="0">' + L.spark + '</g></svg>' +
    '<div class="word">' + [...'Molis Work'].map(c => '<span>' + (c === ' ' ? '&nbsp;' : c) + '</span>').join('') + '</div></div>';
  const q = s => el.querySelector(s), lockup = q('.lockup'), word = q('.word'), letters = [...word.children];
  const ink = q('.ink'), sweep = q('.sweep'), blot = q('.blot'), rr = q('.rr'), hw = q('.hw'), bloom = q('.bloom'), light = q('.light'), halo = q('.halo'), cores = el.querySelectorAll('.core'), spark = q('.spark'), stars = [...el.querySelectorAll('.st')];
  const [, hx, hy, hnx, hny] = samp(G.start), bc = [hx - hny * 4, hy + hnx * 4]; // a little behind where the head meets the spine
  const at = (u, s = 0) => { const [, x, y, nx, ny, h] = samp(u); return [x + nx * s * h, y + ny * s * h]; };
  blot.setAttribute('cx', bc[0].toFixed(2)); blot.setAttribute('cy', bc[1].toFixed(2));
  bloom.setAttribute('cx', G.spark.x); bloom.setAttribute('cy', G.spark.y);
  const set = (n, a, v) => n.setAttribute(a, typeof v === 'number' ? +v.toFixed(3) : v);

  return {
    set(t) {
      // ink; once it is all down the reveal mask goes, so the finished edges stay crisp
      if (t > T.ink[T.ink.length - 1][0] + 0.1) ink.removeAttribute('mask'); else ink.setAttribute('mask', 'url(#mi' + id + ')');
      set(blot, 'r', T.blot[2] * oC((t - T.blot[0]) / (T.blot[1] - T.blot[0])));
      set(sweep, 'd', t < T.ink[0][0] ? '' : region(G.start - 0.005, inkU(t), h => h * 1.45 + 2, 0.8));
      // the light and the river it reveals
      const uL = lightU(t), on = t >= T.light[0][0], idle = t > T.end ? (t - T.end) % T.idle : -1;
      set(rr, 'd', on ? region(R.u0 - 0.01, Math.min(uL, R.u1 + 0.02), h => h * 0.6) : '');
      const glint = idle >= 0 && idle < 1.6 ? R.u0 + (R.u1 + 0.06 - R.u0) * ioC(idle / 1.6) : uL, gAmp = idle >= 0 ? 0.55 * Math.sin(Math.PI * clamp(idle / 1.6)) : on ? clamp((t - T.light[0][0]) / 0.15) * (1 - clamp((t - tx) / 0.35)) : 0;
      set(hw, 'd', gAmp > 0.01 ? region(glint - 0.1, Math.min(glint, R.u1 + 0.02), h => h * 0.6) : '');
      q('.hot').setAttribute('opacity', gAmp.toFixed(3));
      const p = at(uL, R.s), fade = clamp((t - T.light[0][0]) / 0.12) * (1 - clamp((t - tArrive + 0.04) / 0.22));
      set(light, 'transform', 'translate(' + fmt(p) + ')'); set(light, 'opacity', on ? fade : 0);
      const out = clamp((uL - 0.8) / 0.06); // once out of the ink the light takes the stars' colour
      cores.forEach(c => set(c, 'r', 1.15 - 0.3 * clamp((uL - 0.83) / 0.15))); set(cores[1], 'opacity', out);
      set(halo, 'opacity', L.glow[0] + (L.glow[1] - L.glow[0]) * out);
      // stars dropped where the light passes
      G.trail.forEach((s, i) => {
        const dt = t - passT(s.u) - (s.dust ? 0.14 : 0), sc = s.dust ? 0.5 + 0.5 * oC(dt / 0.7) : oB(dt / 0.45);
        set(stars[i], 'transform', 'translate(' + s.x + ' ' + s.y + ') scale(' + Math.max(0, sc).toFixed(3) + ')');
        set(stars[i], 'opacity', dt > 0 ? s.op * clamp(dt / (s.dust ? 0.7 : 0.1)) : 0);
      });
      // the spark: the light comes to rest, turns into a star, and twinkles now and then
      const ds = t - tArrive + 0.06, tw = idle >= 1.4 && idle < 2.4 ? (idle - 1.4) : -1;
      const sc = oB(ds / 0.6, 1.4) * (tw >= 0 ? 1 + 0.22 * Math.sin(Math.PI * tw) : 1), rot = -70 * (1 - oC(ds / 0.8));
      set(spark, 'transform', 'translate(' + G.spark.x + ' ' + G.spark.y + ') rotate(' + rot.toFixed(2) + ') scale(' + Math.max(0, sc).toFixed(3) + ')');
      set(spark, 'opacity', clamp(ds / 0.1));
      const bl = tw >= 0 ? 0.5 * Math.sin(Math.PI * tw) : ds > 0 ? 0.85 * (1 - oC(ds / 0.8)) : 0;
      set(bloom, 'r', tw >= 0 ? 7 : 3 + 10 * oC(ds / 0.8)); set(bloom, 'opacity', bl);
      // the name
      const gap = parseFloat(getComputedStyle(lockup).columnGap) || 0, shift = (word.offsetWidth + gap) / 2;
      lockup.style.transform = 'translateX(' + (shift * (1 - ioC((t - T.slide[0]) / T.slide[1]))).toFixed(2) + 'px)';
      letters.forEach((s, i) => {
        const e = oC((t - T.word[0] - i * T.word[1]) / T.word[2]);
        s.style.opacity = e.toFixed(3);
        s.style.transform = 'translateX(' + (-0.14 * (1 - e)).toFixed(3) + 'em)';
        s.style.filter = e < 1 ? 'blur(' + (5 * (1 - e)).toFixed(2) + 'px)' : '';
      });
    },
  };
}

const qs = new URLSearchParams(location.search), theme = qs.get('theme') || 'paper';
document.documentElement.dataset.theme = theme;
if (qs.has('strip')) {
  // contact sheet for checking the timing frame by frame
  const ts = (qs.get('strip') || '0.08,0.16,0.26,0.4,0.55,0.7,0.85,1,1.12,1.22,1.35,1.5,1.65,1.8,2,2.2,2.5,4.2').split(',').map(Number);
  const grid = document.createElement('div'); grid.className = 'strip'; document.body.append(grid);
  grid.style.gridTemplateColumns = 'repeat(' + (qs.get('cols') || 4) + ', 1fr)'; if (qs.has('m')) grid.style.setProperty('--m', qs.get('m') + 'px');
  for (const t of ts) { const c = document.createElement('div'); c.className = 'stage'; grid.append(c); Stage(c, theme).set(t); c.insertAdjacentHTML('beforeend', '<i>' + t + '</i>'); }
} else {
  const el = document.createElement('div'); el.className = 'stage'; document.body.append(el);
  document.body.insertAdjacentHTML('beforeend', '<nav class="ctl"><button class="replay" aria-label="重播"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M4 12a8 8 0 1 0 2.4-5.7"/><path d="M4 4v4.5h4.5"/></svg></button><input class="scrub" type="range" min="0" max="' + T.end + '" step="0.001" value="0" aria-label="时间"><button class="sw" data-th="paper" aria-label="浅色"></button><button class="sw" data-th="night" aria-label="深色"></button></nav>');
  let stage = Stage(el, theme), t0 = performance.now(), held = null;
  const scrub = document.querySelector('.scrub'), still = qs.has('t') ? +qs.get('t') : matchMedia('(prefers-reduced-motion: reduce)').matches ? T.end : null;
  const now = () => (held ?? still ?? (performance.now() - t0) / 1000);
  const replay = () => { held = null; t0 = performance.now(); };
  const paint = () => document.querySelectorAll('.sw').forEach(b => b.setAttribute('aria-pressed', b.dataset.th === document.documentElement.dataset.theme));
  (function tick() { const t = now(); stage.set(t); scrub.value = Math.min(t, T.end); requestAnimationFrame(tick); })();
  paint();
  el.addEventListener('click', replay);
  document.querySelector('.replay').addEventListener('click', replay);
  addEventListener('keydown', e => { if (e.key === ' ' || e.key === 'r') { e.preventDefault(); replay(); } });
  scrub.addEventListener('input', () => { held = +scrub.value; });
  scrub.addEventListener('change', () => { t0 = performance.now() - held * 1000; held = null; });
  document.querySelectorAll('.sw').forEach(b => b.addEventListener('click', () => {
    document.documentElement.dataset.theme = b.dataset.th; stage = Stage(el, b.dataset.th); paint(); replay();
  }));
}
</script>
</body>
</html>
`);
console.log('wrote', OUT.pathname, vb);
