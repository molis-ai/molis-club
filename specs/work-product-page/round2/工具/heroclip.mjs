// node heroclip.mjs <url> <w> <h> : with reduced motion, report clipped content inside the visible hero reel
import { spawn } from 'node:child_process';
import { mkdtempSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
const [url, w = '1440', h = '900'] = process.argv.slice(2);
const width = Number(w), height = Number(h);
const port = 9800 + Math.floor(Math.random() * 150);
const profile = mkdtempSync(join(tmpdir(), 'clip-'));
const chrome = spawn('/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  ['--headless=new','--disable-gpu','--hide-scrollbars','--no-first-run',`--remote-debugging-port=${port}`,`--user-data-dir=${profile}`,`--window-size=${width},${height}`,'about:blank'], { stdio: 'ignore' });
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
await send('Emulation.setDeviceMetricsOverride', { width, height, deviceScaleFactor: 1, mobile: width < 600 });
await send('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-motion', value: 'reduce' }] });
await send('Page.navigate', { url });
for (let i = 0; i < 150; i++) { if ((await evaluate('document.readyState')) === 'complete') break; await sleep(200); }
await sleep(2500);
const out = await evaluate(`(() => {
  const reel = [...document.querySelectorAll('.wp-hero-reel')].find(e => e.offsetParent);
  if (!reel) return 'no reel';
  const res = [];
  for (const el of reel.querySelectorAll('*')) {
    const cs = getComputedStyle(el);
    if (!/hidden|clip/.test(cs.overflow + cs.overflowY)) continue;
    if (el.scrollHeight > el.clientHeight + 2 && el.clientHeight > 40) res.push((el.className||el.tagName) + ' ' + el.scrollHeight + '>' + el.clientHeight);
  }
  const fs = getComputedStyle(reel.querySelector('.m-sc') || reel).fontSize;
  return 'font ' + fs + ' | ' + (res.join(' ; ') || 'ok');
})()`);
console.log(`${w} ${url.split('#')[1]}: ${out}`);
ws.close(); chrome.kill();
process.exit(0);
