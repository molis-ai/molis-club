// 只测自动播放：停在舞台上不动、点一下、滚一下、离开视口、减少动态效果
import { spawn } from 'node:child_process';
import { mkdirSync, writeFileSync, readFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
const here = dirname(fileURLToPath(import.meta.url));
const scratch = join(tmpdir(), 'work-nav-demo-check');
mkdirSync(scratch, { recursive: true });
const page = join(scratch, 'demo-auto.html');
writeFileSync(page, `<!doctype html><html lang="zh"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><style>body{margin:0}[hidden]{display:none!important}</style></head><body><div id="above" style="height:900px;background:#f4f4f2"></div>${readFileSync(join(here, 'work-nav-demo.html'), 'utf8')}<div style="height:900px"></div></body></html>`);
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const port = 9477;
const chrome = spawn('/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', ['--headless=new', `--remote-debugging-port=${port}`, `--user-data-dir=${join(scratch, 'profile-auto')}`, '--window-size=1440,900', '--hide-scrollbars', '--no-first-run', 'about:blank'], { stdio: 'ignore' });
let t;
for (let i = 0; i < 50 && !t; i++) { await sleep(200); try { t = (await (await fetch(`http://127.0.0.1:${port}/json/list`)).json()).find((x) => x.type === 'page'); } catch {} }
const ws = new WebSocket(t.webSocketDebuggerUrl);
await new Promise((r) => ws.addEventListener('open', r, { once: true }));
let seq = 0; const wait = new Map(); const errors = [];
ws.addEventListener('message', (e) => { const m = JSON.parse(e.data); if (m.id && wait.has(m.id)) { wait.get(m.id)(m); wait.delete(m.id); } if (m.method === 'Runtime.exceptionThrown') errors.push(m.params.exceptionDetails.exception?.description || m.params.exceptionDetails.text); });
const send = (method, params = {}) => new Promise((res) => { const id = ++seq; wait.set(id, res); ws.send(JSON.stringify({ id, method, params })); });
const ev = async (expression) => (await send('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true })).result?.result?.value;
const shot = async (name) => { const s = await send('Page.captureScreenshot', { format: 'jpeg', quality: 85 }); writeFileSync(join(scratch, `auto-${name}.jpg`), Buffer.from(s.result.data, 'base64')); };
const state = () => ev(`({cur,playing,ghost:!auto.hidden,y:Math.round(scrollY),pinned:canAuto()})`);
await send('Emulation.setDeviceMetricsOverride', { width: 1440, height: 900, deviceScaleFactor: 1, mobile: false });
await send('Runtime.enable'); await send('Page.enable');
await send('Page.navigate', { url: 'file://' + page });
await sleep(800);
const out = {};
// 1. 还在上方：停 6 秒不该动
await sleep(6000);
out.above = await state();
// 2. 滚到舞台，4 秒内不动，5 秒后开始走
await send('Input.dispatchMouseEvent', { type: 'mouseWheel', x: 700, y: 400, deltaX: 0, deltaY: 900 });
await sleep(600);
out.arrived = await state();
await sleep(3500);
out.at4s = await state();
await sleep(1700);
out.at6s = await state();
await shot('moving');
await sleep(800);
out.at7s = await state();
await sleep(6000);
out.at13s = await state();
await shot('later');
// 3. 真实点一下空白处：停，鬼影消失
const r = await ev(`(()=>{const w=win.getBoundingClientRect();return [Math.round(w.left+120),Math.round(w.bottom-120)]})()`);
await send('Input.dispatchMouseEvent', { type: 'mousePressed', x: r[0], y: r[1], button: 'left', clickCount: 1 });
await send('Input.dispatchMouseEvent', { type: 'mouseReleased', x: r[0], y: r[1], button: 'left', clickCount: 1 });
await sleep(150);
out.afterClick = await state();
const c1 = out.afterClick.cur;
await sleep(4000);
out.click4s = await state();
await sleep(2200);
out.click6s = await state();
out.resumed = (await state()).cur !== c1 || (await state()).playing;
// 4. 滚轮：停
await send('Input.dispatchMouseEvent', { type: 'mouseWheel', x: 700, y: 400, deltaX: 0, deltaY: 400 });
await sleep(400);
out.afterWheel = await state();
const c2 = out.afterWheel.cur;
await sleep(4000);
out.wheel4s = await state();
out.wheelHeld = out.wheel4s.cur === c2 && !out.wheel4s.playing;
// 5. 滚出舞台：不再走
await ev(`scrollTo(0,0)`);
await sleep(6500);
const c3 = await state();
await sleep(3000);
out.outOfView = { a: c3, b: await state() };
// 6. 走到最后一帧后停下，不循环
await ev(`scrollTo(0, trackTop()+(FRAMES.length-2)*step)`);
await sleep(300);
await ev(`flush()`);
await sleep(9000);
out.last = await ev(`({cur,playing,ghost:!auto.hidden,total:FRAMES.length})`);
await sleep(4000);
out.lastHeld = await ev(`({cur,playing,ghost:!auto.hidden})`);
// 7. 减少动态效果
await send('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-motion', value: 'reduce' }] });
await send('Page.reload');
await sleep(800);
await ev(`scrollTo(0,0)`);
await sleep(200);
await send('Input.dispatchMouseEvent', { type: 'mouseWheel', x: 700, y: 400, deltaX: 0, deltaY: 900 });
await sleep(700);
const rm0 = await state();
await sleep(7500);
out.reduced = { a: rm0, b: await state() };
out.errors = errors;
console.log(JSON.stringify(out, null, 0).replace(/},"/g, '},\n"'));
ws.close(); chrome.kill();
