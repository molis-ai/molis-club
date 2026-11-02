// Molis Work 标志页: 墨里星河, three marks written with one brush -> ../index.html (node src/gen.mjs)
import fs from 'node:fs';
import { yibi, moon, seed, PAPER, NIGHT } from './brush.mjs';

const OUT = new URL('../index.html', import.meta.url);
const NAVY = '#1a294f';

const dirs = [
  {
    name: '一笔星河',
    draw: yibi,
    meaning: '人落下一笔，AI 让这一笔里的光走得更远。墨是人的墨，星河是从这一笔里流出来的。',
    mark: '一笔从左下斜压下去，往右上提。写到后半段墨不够了，透出一道道飞白，笔尖散开。正中一线杏色是墨里的星河，从散开的笔尖流出去，成了三颗星。第一眼是一笔字，再看是一条河。',
    motion: '笔从左下落下，顺势往右上走，墨一路变淡，飞白一道道显出来。星河最后亮起，沿笔尖流出去，三颗星依次亮起，字标淡入。',
  },
  {
    name: '墨月',
    draw: moon,
    meaning: '把理想写成一轮月亮。月亮是人自己一笔写的，星河从月里流出来，往更高处爬：AI 让人够到原来够不着的地方。',
    mark: '一笔写成的月牙：从下面的月尖轻轻落笔，压过月背，写到顶上笔锋走干，散成几缕往右上扬，像浪头，也像火苗。一线杏色贴着月背走，从散开的笔锋里出来，变成往上爬的星。',
    motion: '笔尖从下方月尖落下，沿月背画出整弯月牙。写到顶上，几缕笔锋扬起来，星河跟着亮起，星一颗颗往右上爬，最后一颗闪一下，字标淡入。',
  },
  {
    name: '墨蒲公英',
    draw: seed,
    meaning: '一个想法散出去，落到很多人那里，再长出新的东西。AI 是那阵风，把种子吹得更远，吹到的地方都亮起来。',
    mark: '落笔一顿是种子，细笔是种柄，散开的干笔是冠毛。每根冠毛根上是墨，越往外越淡，像笔慢慢提起来；笔离开的地方留下一颗星。最远的几颗已经顺风飞走。',
    motion: '先落笔写出种子和种柄，冠毛从中心一根根散开，墨一路变淡。尖上的星依次亮起，一阵风过，三颗星顺风飘远，字标淡入。',
  },
];

const mk = (body, cls = 'fit') => `<svg class="${cls}" viewBox="0 0 120 120" aria-hidden="true">${body}</svg>`;
const sections = dirs.map(d => `
  <section>
    <div class="pair">
      <div class="tile">${mk(d.draw({ pal: PAPER }), 'fit hero')}</div>
      <div class="tile is-dark">${mk(d.draw({ pal: NIGHT }), 'fit hero')}</div>
    </div>
    <div class="about">
      <h2>${d.name}</h2>
      <dl>
        <dt>寓意</dt><dd>${d.meaning}</dd>
        <dt>标志</dt><dd>${d.mark}</dd>
        <dt>动效</dt><dd>${d.motion}</dd>
      </dl>
      <div class="use">
        <div class="lockup">${mk(d.draw({ pal: PAPER }))}<span>Molis Work</span></div>
        <div class="lockup is-dark">${mk(d.draw({ pal: NIGHT }))}<span>Molis Work</span></div>
        <div class="sizes">
          <i class="app">${mk(d.draw({ pal: PAPER, small: true }))}</i>
          <i class="app is-dark">${mk(d.draw({ pal: NIGHT, small: true }))}</i>
          <i class="f32">${mk(d.draw({ pal: PAPER, small: true }))}</i>
          <i class="f16">${mk(d.draw({ pal: PAPER, small: true }))}</i>
        </div>
      </div>
    </div>
  </section>`).join('');

fs.writeFileSync(OUT, `<!doctype html>
<html lang="zh-CN">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Molis Work 标志</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Jost:wght@400&display=swap" rel="stylesheet">
<style>
  :root { --paper: #fbfaf7; --ink: #1b1a18; --mute: #69665f; --navy: ${NAVY}; --cream: #f4eee9; --hair: rgb(27 26 24 / .12); }
  * { box-sizing: border-box; }
  body { margin: 0; background: var(--paper); color: var(--ink); font: 400 15px/1.85 'PingFang SC', 'Hiragino Sans GB', sans-serif; }
  main { max-width: 1200px; margin: 0 auto; padding: clamp(56px, 10vh, 120px) clamp(16px, 4vw, 56px) clamp(64px, 12vh, 140px); }
  header { max-width: 640px; margin-bottom: clamp(64px, 12vh, 128px); }
  h1 { margin: 0 0 24px; font: 400 clamp(36px, 5vw, 56px)/1.05 Jost, sans-serif; letter-spacing: .01em; }
  header p { margin: 0; color: var(--mute); }
  section { display: grid; grid-template-columns: minmax(0, 1.15fr) minmax(0, 1fr); gap: clamp(28px, 4vw, 64px); align-items: start;
    padding: clamp(48px, 8vh, 88px) 0; border-top: 1px solid var(--hair); }
  .pair { display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px; }
  .tile { aspect-ratio: 1; border-radius: 22.5%; display: grid; place-items: center; background: var(--cream); }
  .tile.is-dark { background: var(--navy); }
  .tile svg { width: 100%; height: 100%; }
  h2 { margin: 0 0 20px; font: 500 22px/1.2 'PingFang SC', sans-serif; letter-spacing: .08em; }
  dl { margin: 0; display: grid; grid-template-columns: 3em 1fr; gap: 10px 16px; }
  dt { color: var(--mute); font-size: 13px; line-height: 2.2; }
  dd { margin: 0; }
  .use { margin-top: 36px; display: flex; flex-wrap: wrap; align-items: center; gap: 14px 18px; }
  .lockup { display: flex; align-items: center; gap: 10px; height: 52px; padding: 0 18px; border-radius: 999px; box-shadow: 0 0 0 1px var(--hair); }
  .lockup svg { height: 28px; width: auto; }
  .lockup span { font: 400 19px/1 Jost, sans-serif; letter-spacing: .01em; white-space: nowrap; }
  .lockup.is-dark { background: var(--navy); color: var(--cream); box-shadow: none; }
  .sizes { display: flex; align-items: end; gap: 12px; }
  .sizes i { display: grid; place-items: center; }
  .app { width: 48px; height: 48px; border-radius: 11px; background: var(--cream); padding: 7px; }
  .app.is-dark { background: var(--navy); }
  .app svg { width: 100%; height: 100%; }
  .f32 svg { width: 32px; height: 32px; } .f16 svg { width: 16px; height: 16px; }
  @media (max-width: 860px) { section { grid-template-columns: 1fr; } }
</style>
</head>
<body>
<main>
  <header>
    <h1>Molis Work</h1>
    <p>墨里星河。墨是夜色，也是人落下的那一笔；星河藏在墨里，笔锋走干的地方透出光来，一路流出去成了星。三个标志用同一支笔写成，颜色沿用 Molis AI 的藏蓝和杏色：藏蓝是墨，杏色只给那条星河。</p>
  </header>${sections}
</main>
<script>
  // Crop every mark to what it draws: heroes and icons square with air around them, lockups tight.
  for (const s of document.querySelectorAll('svg.fit')) {
    const b = s.getBBox(), sq = s.matches('.hero') || s.closest('.sizes'), m = Math.max(b.width, b.height);
    const pad = s.matches('.hero') ? m * 0.24 : m * 0.04, w = sq ? m : b.width, h = sq ? m : b.height;
    s.setAttribute('viewBox', [b.x + (b.width - w) / 2 - pad, b.y + (b.height - h) / 2 - pad, w + 2 * pad, h + 2 * pad].map(n => n.toFixed(2)).join(' '));
  }
</script>
</body>
</html>
`);
console.log('wrote', OUT.pathname);
