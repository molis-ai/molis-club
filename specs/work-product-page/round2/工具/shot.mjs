// node shot.mjs <url> <outdir> <prefix> <w> <h> <tops: comma list | "screens" | "sel:<css>,<css>">
import { spawn } from 'node:child_process';
import { mkdtempSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
const [url, outdir, prefix, w = '1440', h = '900', tops = 'screens'] = process.argv.slice(2);
const width = Number(w), height = Number(h);
const port = 9300 + Math.floor(Math.random() * 500);
const profile = mkdtempSync(join(tmpdir(), 'shot-'));
const chrome = spawn('/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  ['--headless=new','--disable-gpu','--hide-scrollbars','--no-first-run','--no-default-browser-check',
   `--remote-debugging-port=${port}`,`--user-data-dir=${profile}`,`--window-size=${width},${height}`,'about:blank'], { stdio: 'ignore' });
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
let target;
for (let i = 0; i < 50; i++) { try { const l = await (await fetch(`http://127.0.0.1:${port}/json`)).json(); target = l.find(t => t.type === 'page'); if (target) break; } catch {} await sleep(200); }
const ws = new WebSocket(target.webSocketDebuggerUrl);
await new Promise((r) => ws.addEventListener('open', r, { once: true }));
let id = 0; const pending = new Map();
ws.addEventListener('message', (e) => { const m = JSON.parse(e.data); if (m.id && pending.has(m.id)) { pending.get(m.id)(m); pending.delete(m.id); } });
const send = (method, params = {}) => new Promise((res) => { id++; pending.set(id, res); ws.send(JSON.stringify({ id, method, params })); });
const evaluate = async (expression) => (await send('Runtime.evaluate', { expression, awaitPromise: true, returnByValue: true }))?.result?.result?.value;
await send('Page.enable');
await send('Emulation.setDeviceMetricsOverride', { width, height, deviceScaleFactor: Number(process.env.DPR || 1), mobile: width < 600 });
if (process.env.REDUCED) await send('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-motion', value: 'reduce' }] });
if (process.env.NOJS) await send('Emulation.setScriptExecutionDisabled', { value: true });
await send('Page.navigate', { url });
for (let i = 0; i < 150; i++) { if ((await evaluate('document.readyState')) === 'complete') break; await sleep(200); }
await sleep(Number(process.env.WAIT || 2500));
await evaluate(`document.documentElement.style.scrollBehavior = 'auto'`);
const total = await evaluate('document.documentElement.scrollHeight');
let list;
if (tops === 'screens') { list = []; for (let t = 0; t < total; t += Math.round(height * 0.9)) list.push(t); }
else if (tops.startsWith('sel:')) { list = []; for (const s of tops.slice(4).split('|')) { const y = await evaluate(`(()=>{const e=document.querySelector(${JSON.stringify(s)}); return e? e.getBoundingClientRect().top+scrollY - ${Number(process.env.OFF||120)} : -1})()`); if (y >= 0) list.push(Math.round(y)); } }
else list = tops.split(',').map(Number);
console.log('total', total, 'shots', list.join(','));
let cur = 0;
for (const [i, top] of list.entries()) {
  const steps = 8;
  for (let s = 1; s <= steps; s++) { await evaluate(`window.scrollTo({ top: ${cur + ((top - cur) * s) / steps}, behavior: 'instant' })`); await sleep(60); }
  cur = top;
  await sleep(Number(process.env.SETTLE || 1600));
  const shot = await send('Page.captureScreenshot', { format: 'jpeg', quality: 72 });
  const f = join(outdir, `${prefix}-${String(i).padStart(2, '0')}.jpg`);
  writeFileSync(f, Buffer.from(shot.result.data, 'base64'));
}
if (process.env.EVAL) console.log(JSON.stringify(await evaluate(process.env.EVAL), null, 1));
ws.close(); chrome.kill();
process.exit(0);
