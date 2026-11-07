// 用无头 Chrome 打开 demo：按指定视口把整条路径点一遍，截关键帧，并报告溢出、错误和跳转是否正确
import { spawn } from 'node:child_process';
import { mkdirSync, writeFileSync, readFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const src = join(here, 'work-nav-demo.html');
const scratch = join(tmpdir(), 'work-nav-demo-check');
mkdirSync(scratch, { recursive: true });
const page = join(scratch, 'demo-wrapped.html');
writeFileSync(page, `<!doctype html><html lang="zh"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><style>body{margin:0}[hidden]{display:none!important}img{max-width:100%}</style></head><body>${readFileSync(src, 'utf8')}</body></html>`);

const sizes = process.argv.slice(2).map((s) => s.split('x').map(Number));
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

for (const [width, height] of sizes) {
  const out = join(scratch, `${width}x${height}`);
  mkdirSync(out, { recursive: true });
  const port = 9400 + (width % 97);
  const chrome = spawn('/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', ['--headless=new', `--remote-debugging-port=${port}`, `--user-data-dir=${join(scratch, 'profile' + width)}`, `--window-size=${width},${height}`, '--hide-scrollbars', '--no-first-run', 'about:blank'], { stdio: 'ignore' });
  let t;
  for (let i = 0; i < 50 && !t; i++) {
    await sleep(200);
    try { t = (await (await fetch(`http://127.0.0.1:${port}/json/list`)).json()).find((x) => x.type === 'page'); } catch {}
  }
  const ws = new WebSocket(t.webSocketDebuggerUrl);
  await new Promise((r) => ws.addEventListener('open', r, { once: true }));
  let seq = 0;
  const wait = new Map();
  const errors = [];
  ws.addEventListener('message', (e) => {
    const m = JSON.parse(e.data);
    if (m.id && wait.has(m.id)) { wait.get(m.id)(m); wait.delete(m.id); }
    if (m.method === 'Runtime.exceptionThrown') errors.push(m.params.exceptionDetails.exception?.description || m.params.exceptionDetails.text);
    if (m.method === 'Runtime.consoleAPICalled' && m.params.type === 'error') errors.push(JSON.stringify(m.params.args.map((a) => a.value)));
  });
  const send = (method, params = {}) => new Promise((res) => { const id = ++seq; wait.set(id, res); ws.send(JSON.stringify({ id, method, params })); });
  const ev = async (expression) => { const r = await send('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true }); if (r.result?.exceptionDetails) errors.push(r.result.exceptionDetails.exception?.description); return r.result?.result?.value; };
  const shot = async (name) => { const s = await send('Page.captureScreenshot', { format: 'jpeg', quality: 80 }); writeFileSync(join(out, `${name}.jpg`), Buffer.from(s.result.data, 'base64')); };

  await send('Emulation.setDeviceMetricsOverride', { width, height, deviceScaleFactor: 1, mobile: false });
  await send('Runtime.enable');
  await send('Page.enable');
  await send('Page.navigate', { url: 'file://' + page });
  await sleep(1500);

  const report = { size: `${width}x${height}`, layout: await ev(`stage.dataset.l`), zoom: await ev(`win.style.zoom`), hScroll: await ev(`document.documentElement.scrollWidth > innerWidth`), winRect: await ev(`(()=>{const r=win.getBoundingClientRect();return [r.left,r.top,r.right,r.bottom].map(Math.round)})()`), bodyFont: await ev(`(()=>{const e=document.querySelector('.row');return e?parseFloat(getComputedStyle(e).fontSize)*parseFloat(win.style.zoom||1):null})()`) };
  const trail = [];
  const overflow = `(()=>{const out=[];win.querySelectorAll('.view,.feed').forEach(e=>{if(e.scrollHeight>e.clientHeight+1&&e.classList.contains('view'))out.push('view+'+(e.scrollHeight-e.clientHeight))});const g=win.querySelector('.ring');const t=target();if(t&&!t.closest('.chips')){const r=t.getBoundingClientRect(),w=win.getBoundingClientRect(),fd=t.closest('.feed');if(r.top<w.top||r.bottom>w.bottom)out.push('target-outside');if(fd){const q=fd.getBoundingClientRect();if(r.top<q.top||r.bottom>q.bottom)out.push('target-clipped')}}return out})()`;

  const N = await ev(`FRAMES.length`);
  for (let i = 0; i < N; i++) {
    await ev(`noteInput();flush()`);
    await sleep(120);
    const state = await ev(`({cur,goes:win.querySelectorAll('[data-go]').length,ring:!!document.querySelector('.ring'),over:${overflow},pressed:chipEls.findIndex(c=>c.getAttribute('aria-pressed')==='true'),who:tagb.textContent,scrollOk:Math.abs(scrollY-(trackTop()+cur*step))<2||stage.dataset.l==='narrow'})`);
    trail.push(state);
    await sleep(250);
    await shot(String(i).padStart(2, '0'));
    const next = await ev(`(()=>{noteInput();const t=target();if(!t)return false;t.click();return true})()`);
    if (!next) break;
    await sleep(60);
  }
  report.frames = trail.length;
  report.bad = await ev(`FRAMES.map((f,i)=>f.t.includes(f.on)?null:i).filter(x=>x!==null)`);
  report.problems = trail.filter((s) => s.over.length || !s.scrollOk || s.goes > 1 || (!s.ring && s.cur !== N - 1)).map((s) => ({ cur: s.cur, over: s.over, ring: s.ring, goes: s.goes, scrollOk: s.scrollOk }));
  // 跳段
  report.jump = await ev(`(()=>{noteInput();chipEls[2].click();return {cur,pressed:chipEls[2].getAttribute('aria-pressed'),scrollOk:Math.abs(scrollY-(trackTop()+cur*step))<2}})()`);
  await sleep(300);
  await ev(`flush()`);
  await sleep(350);
  await shot('jump-定方案');
  // 滚动同一条轨道
  if (report.layout !== 'narrow') {
    report.scroll = await ev(`new Promise(res=>{scrollTo(0,trackTop()+3*step);setTimeout(()=>res({cur,ring:!!document.querySelector('.ring')}),200)})`);
    // 点错
    await ev(`flush()`);
    report.wrong = await ev(`new Promise(res=>{const before=cur;main.querySelector('.view').click();const t=target();const nudged=t.classList.contains('nudge');setTimeout(()=>res({stayed:before===cur,nudged}),30)})`);
    // 连点不排队
    report.rapid = await ev(`new Promise(res=>{chipEls[0].click();const a=cur;win.click();const stillPending=pending;win.click();setTimeout(()=>res({a,afterTwo:cur,stillPending}),30)})`);
  }
  await send('Input.dispatchMouseEvent', { type: 'mouseMoved', x: Math.round(width * 0.62), y: Math.round(height * 0.5) });
  await sleep(250);
  report.tag = await ev(`({hidden:tag.hidden,text:tagb.textContent})`);
  await shot('hover');
  report.errors = errors;
  console.log(JSON.stringify(report));
  ws.close();
  chrome.kill();
  await sleep(300);
}
