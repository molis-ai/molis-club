// node clickshot.mjs <url> <out.jpg> <w> <h> <js-before-shot>
import { spawn } from 'node:child_process';
import { mkdtempSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
const [url, out, w = '1440', h = '900', js = ''] = process.argv.slice(2);
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
const evaluate = async (expression) => { const r = await send('Runtime.evaluate', { expression, awaitPromise: true, returnByValue: true }); if (r.result?.exceptionDetails) console.log('ERR', JSON.stringify(r.result.exceptionDetails).slice(0, 400)); return r?.result?.result?.value; };
await send('Page.enable');
await send('Emulation.setDeviceMetricsOverride', { width, height, deviceScaleFactor: 1, mobile: width < 600 });
if (process.env.REDUCED) await send('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-motion', value: 'reduce' }] });
if (process.env.NOJS) await send('Emulation.setScriptExecutionDisabled', { value: true });
await send('Page.navigate', { url });
for (let i = 0; i < 150; i++) { if ((await evaluate('document.readyState')) === 'complete') break; await sleep(200); }
await sleep(Number(process.env.WAIT || 2500));
if (js) { const v = await evaluate(`(async () => { ${js} })()`); if (v !== undefined) console.log(JSON.stringify(v)); }
await sleep(Number(process.env.SETTLE || 1500));
const shot = await send('Page.captureScreenshot', { format: 'jpeg', quality: 75 });
writeFileSync(out, Buffer.from(shot.result.data, 'base64'));
ws.close(); chrome.kill(); process.exit(0);
