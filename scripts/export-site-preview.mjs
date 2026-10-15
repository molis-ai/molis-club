// 把新站导出成一个不依赖服务器的静态预览包，放到只含静态文件的 Cloudflare Worker 上给别人看
// （现在的地址 https://molis-ai-preview.molis-club.workers.dev）。
// 用法：npm run build:site-preview（先 npm run build，再运行本脚本）。
// 脚本自己在空闲端口起 vinext start，从首页顺着站内链接找出全部页面（跳过 /api、/_next、/account、/demos），
// 抓下每页 HTML，整目录带上 dist/client/_next，图片与下载包按引用逐个复制，再写 404.html、robots.txt、_headers；
// 结束时关掉服务。输出到 outputs/site-preview/，上传方法写在 deploy/site-preview/wrangler.jsonc。
// 预览里没有服务器：联系表单和登录 / 注册拦下不发，并在表单上方写明；站内 /api/ 请求不出浏览器；
// 站内跳转取不到 RSC 数据，会回落为整页打开。
// 只含页面、脚本样式、图片与下载包，不含后端、数据库、用户数据或凭据。

import { spawn } from 'node:child_process';
import {
  cp,
  mkdir,
  readFile,
  readdir,
  rm,
  stat,
  writeFile,
} from 'node:fs/promises';
import { createServer } from 'node:net';
import { homedir } from 'node:os';
import { dirname, join, resolve } from 'node:path';

const root = process.cwd();
const client = resolve(root, 'dist/client');
const output = resolve(root, 'outputs/site-preview');

// 有的页面不一定能从首页一路点到，一起当作起点
const seeds = ['/', '/login', '/privacy', '/contact'];
// 后端接口、构建产物、要登录的账号页和评审页不进预览
const skip = (path) => /^\/(api|_next|account|demos)(\/|$)/.test(path);

// 每页 <head> 末尾加上预览版的说明样式与脚本
const previewHead = `<style id="m-preview">
/* 静态预览版：要服务器的表单不发出，明说 */
form.m-form::before,
form.m-auth-form::before {
  content: '这是网站的预览版：表单暂时不会发出。';
  grid-column: 1 / -1;
  display: block;
  padding: 10px 14px;
  border: 1px dashed var(--accent-ink, #a85a32);
  border-radius: 10px;
  color: var(--accent-ink, #a85a32);
  font-size: 13px;
  line-height: 1.6;
  letter-spacing: 0.02em;
}
form.m-auth-form::before {
  content: '这是网站的预览版：登录和注册暂不可用。';
}
.m-auth-note,
.m-auth-foot {
  display: none;
}
form.m-form button[type='submit'],
form.m-auth-form > button {
  opacity: 0.45;
  cursor: not-allowed;
}
</style>
<script id="m-preview-js">
(() => {
  // 预览没有后端：站内 /api/ 请求就地答 404、不走网络，页面照常按「接口不可用」处理，控制台也不留报错
  const send = window.fetch;
  window.fetch = (input, init) => {
    const url = new URL(input instanceof Request ? input.url : String(input), location.href);
    if (url.origin === location.origin && url.pathname.startsWith('/api/'))
      return Promise.resolve(new Response(null, { status: 404 }));
    return send.call(window, input, init);
  };
  // 联系表单与登录表单：拦在 React 之前，不发出去
  window.addEventListener('submit', (event) => {
    const form = event.target;
    if (form instanceof HTMLFormElement && form.matches('form.m-form, form.m-auth-form')) {
      event.preventDefault();
      event.stopImmediatePropagation();
    }
  }, true);
  // 方法目录：静态页读不到地址栏里的搜索词，等页面接管后替它填上
  if (location.pathname.replace(/\\/$/, '') !== '/community/methods') return;
  const params = new URLSearchParams(location.search);
  const q = (params.getAll('q').at(-1) || '').slice(0, 60);
  const type = params.getAll('type').at(-1);
  if (!q && (!type || type === 'all')) return;
  let tries = 0;
  const apply = () => {
    const input = document.querySelector('.m-mth-search input[name="q"]');
    const ready = input && Object.keys(input).some((key) => key.startsWith('__reactProps'));
    if (!ready) { if (tries++ < 150) setTimeout(apply, 100); return; }
    if (q) {
      Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set.call(input, q);
      input.dispatchEvent(new Event('input', { bubbles: true }));
    }
    if (type && type !== 'all') document.querySelector('.m-mth-filters button[value="' + CSS.escape(type) + '"]')?.click();
  };
  apply();
})();
</script>
`;
// 预览脚本拦下的表单；页面里出现别的 POST 表单就停下，免得它在预览里真的往外发
const blockedForm = /\bclass="[^"]*\b(?:m-form|m-auth-form)\b/;

const withPreview = (html) => {
  if (!html.includes('</head>')) throw new Error('页面没有 </head>');
  return html.replace('</head>', previewHead + '</head>');
};
const htmlPath = (path) =>
  path === '/' ? 'index.html' : path.slice(1) + '.html';

const walk = async (dir) => {
  const list = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) list.push(...(await walk(path)));
    else list.push(path);
  }
  return list;
};

try {
  await stat(join(client, '_next'));
  await stat(resolve(root, 'dist/server'));
} catch {
  throw new Error('先运行 npm run build，再导出预览。');
}

// .vinext/ 是 next/font 的本地缓存，样式里写的是绝对路径；从别的目录复制来的缓存会让页面引用本机路径
for (const file of await walk(resolve(root, '.vinext/fonts')).catch(() => [])) {
  if (!file.endsWith('.css')) continue;
  for (const [, url] of (await readFile(file, 'utf8')).matchAll(
    /url\((\/[^)]+)\)/g,
  ))
    if (!url.startsWith(resolve(root, '.vinext') + '/'))
      throw new Error(
        `.vinext/ 里的字体缓存指向别的目录（${url}）。删掉 .vinext/ 后重新 npm run build。`,
      );
}

const port = await new Promise((done, fail) => {
  const probe = createServer();
  probe.once('error', fail);
  probe.listen(0, '127.0.0.1', () => {
    const { port } = probe.address();
    probe.close(() => done(port));
  });
});
const origin = `http://127.0.0.1:${port}`;
let log = '';
const server = spawn(
  process.execPath,
  [
    resolve(root, 'node_modules/.bin/vinext'),
    'start',
    '-p',
    String(port),
    '-H',
    '127.0.0.1',
  ],
  { cwd: root, stdio: ['ignore', 'pipe', 'pipe'] },
);
server.stdout.on('data', (chunk) => (log += chunk));
server.stderr.on('data', (chunk) => (log += chunk));
const running = () => server.exitCode === null && server.signalCode === null;
const stopServer = () => {
  if (running()) server.kill('SIGTERM');
};
process.once('SIGINT', () => {
  stopServer();
  process.exit(130);
});

try {
  // 等服务能答话
  for (let tries = 0; ; tries++) {
    if (!running()) throw new Error(`vinext start 没起来：\n${log}`);
    if (tries > 200) throw new Error(`vinext start 一分钟内没有答话：\n${log}`);
    if (
      await fetch(origin + '/').then(
        (res) => res.ok,
        () => false,
      )
    )
      break;
    await new Promise((done) => setTimeout(done, 300));
  }

  // 从起点顺着站内链接把页面找全；重定向和坏链接只提示，不进预览
  const pages = [];
  const redirected = [];
  const broken = [];
  const seen = new Set();
  const queue = [...seeds];
  const htmlOf = new Map();
  while (queue.length) {
    const path = queue.shift();
    if (seen.has(path)) continue;
    seen.add(path);
    const res = await fetch(origin + path, { redirect: 'manual' });
    if (res.status >= 300 && res.status < 400) {
      redirected.push(`${path} → ${res.headers.get('location')}`);
      continue;
    }
    if (res.status === 404) {
      broken.push(path);
      continue;
    }
    if (res.status !== 200) throw new Error(`${path} 返回 ${res.status}`);
    const html = await res.text();
    pages.push(path);
    htmlOf.set(path, html);
    for (const [, href] of html.matchAll(/href="(\/[^"#?]*)/g)) {
      let next = href.replace(/&amp;/g, '&');
      if (next.startsWith('//') || /\.[a-z0-9]{2,5}$/i.test(next)) continue;
      if (next.length > 1) next = next.replace(/\/$/, '');
      if (!skip(next) && !seen.has(next)) queue.push(next);
    }
  }

  await rm(output, { recursive: true, force: true });
  await mkdir(output, { recursive: true });
  const texts = [];
  for (const path of pages) {
    const html = htmlOf.get(path);
    for (const [form] of html.matchAll(/<form\b[^>]*>/g))
      if (/\bmethod="post"/i.test(form) && !blockedForm.test(form))
        throw new Error(`${path} 有预览脚本没拦的 POST 表单：${form}`);
    const file = join(output, htmlPath(path));
    await mkdir(dirname(file), { recursive: true });
    await writeFile(file, withPreview(html));
    texts.push(html);
  }
  // 找不到的页：用站点自己的 404
  {
    const res = await fetch(origin + '/__preview-missing__');
    if (res.status !== 404) throw new Error(`404 页返回 ${res.status}`);
    const html = await res.text();
    await writeFile(join(output, '404.html'), withPreview(html));
    texts.push(html);
  }

  // 脚本、样式、字体整目录带上；public 下各目录里的图片、视频和下载包按引用逐个复制
  await cp(join(client, '_next'), join(output, '_next'), { recursive: true });
  for (const file of await walk(join(output, '_next')))
    if (/\.(js|css)$/.test(file)) texts.push(await readFile(file, 'utf8'));
  const folders = (await readdir(client, { withFileTypes: true }))
    .filter((entry) => entry.isDirectory() && entry.name !== '_next')
    .map((entry) => entry.name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
  const asset = new RegExp(
    `/(?:${folders.join('|')})/[\\w\\-./%@]+?\\.(?:jpe?g|png|webp|avif|svg|gif|ico|mp4|webm|mov|mp3|m4a|zip|pdf|txt|json)\\b`,
    'g',
  );
  const used = new Set();
  for (const text of texts)
    for (const [path] of text.matchAll(asset))
      used.add(decodeURIComponent(path));
  const missing = [];
  for (const path of used) {
    const from = join(client, path);
    if (!(await stat(from).catch(() => null))?.isFile()) {
      missing.push(path);
      continue;
    }
    await mkdir(dirname(join(output, path)), { recursive: true });
    await cp(from, join(output, path));
  }

  // 不让搜索引擎收录；带哈希的脚本样式长缓存（沿用 vinext 生成的规则）
  await writeFile(join(output, 'robots.txt'), 'User-agent: *\nDisallow: /\n');
  const builtHeaders = await readFile(join(client, '_headers'), 'utf8').catch(
    () => '',
  );
  await writeFile(
    join(output, '_headers'),
    `${builtHeaders.trim()}\n\n/*\n  X-Robots-Tag: noindex, nofollow\n`.trimStart(),
  );

  // 不把本机路径带出去
  for (const file of await walk(output)) {
    if (!/\.(html|js|css|json)$/.test(file)) continue;
    if ((await readFile(file, 'utf8')).includes(homedir()))
      throw new Error(
        `${file} 里有本机路径；删掉 .vinext/ 后重新 npm run build。`,
      );
  }

  if (redirected.length)
    console.warn(
      `站内链接里有重定向，预览里会落到 404 页：\n  ${redirected.join('\n  ')}`,
    );
  if (broken.length)
    console.warn(`站内链接指向不存在的页：\n  ${broken.join('\n  ')}`);
  if (missing.length)
    console.warn(`引用了但 dist/client 里没有：\n  ${missing.join('\n  ')}`);
  console.log(
    JSON.stringify({
      output,
      pages: pages.length,
      assets: used.size - missing.length,
    }),
  );
} finally {
  stopServer();
}
