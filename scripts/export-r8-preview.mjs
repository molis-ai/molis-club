// 把第八轮首页方向（入口、五个版本与选图板）导出成一个不依赖服务器的静态预览包，用来分享给别人看。
// 用法：先 npm run build（取编译好的全站基础样式），再 node scripts/export-r8-preview.mjs。
// 输出到 outputs/r8-share/：所有页面平铺在同一层，资源一律用相对路径，放到任何静态托管下都能打开。
// 第八轮以外的站内链接（产品页、文章、联系等）在预览里不可点，提示「预览里没有这一页」。
// 只含展示组件与图片视频，不含后端、数据库、用户数据或凭据。

import { build } from 'esbuild';
import { cp, mkdir, readFile, readdir, rm, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';

const root = process.cwd();
const output = resolve(root, 'outputs/r8-share');
const sources = resolve(root, 'outputs/r8-share-source');
const R8 = '/demos/brand/r8';

const pages = [
  ['index', '', 'Molis AI 第八轮'],
  ['afternoon', '/afternoon', 'Molis AI · 美术馆的午后'],
  ['park', '/park', 'Molis AI · 日光公园'],
  ['sky', '/sky', 'Molis AI · 天空'],
  ['seaside', '/seaside', 'Molis AI · 海边'],
  ['mix', '/mix', 'Molis AI · Mix'],
  ['picks', '/picks', 'Molis AI · 第八轮选图板'],
];

// Jost 与 Fraunces 柔边斜体，原站用 next/font 加载，这里改用 Google Fonts
const fonts =
  'https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght,SOFT,WONK@1,9..144,300..500,100,1&family=Jost:ital,wght@0,300;0,400;0,500;1,300;1,400&display=swap';

const toRelative = (text) =>
  text
    .replaceAll('"/images/', '"images/')
    .replaceAll("'/images/", "'images/")
    .replaceAll('`/images/', '`images/')
    .replaceAll('url(/images/', 'url(images/');

await rm(output, { recursive: true, force: true });
await mkdir(resolve(output, 'assets'), { recursive: true });
await mkdir(sources, { recursive: true });

try {
  const linkModule = resolve(sources, 'link.tsx');
  await writeFile(
    linkModule,
    `
import React from 'react';
const pages = ${JSON.stringify(pages.map(([name, suffix]) => [R8 + suffix, name]))};
export default function Link({ href, prefetch, replace, scroll, locale, ...props }) {
  const value = typeof href === 'string' ? href : href.pathname;
  const [path, hash] = value.split('#');
  const tail = hash === undefined ? '' : '#' + hash;
  if (!path) return <a {...props} href={tail} />;
  if (/^https?:/.test(value)) return <a {...props} href={value} />;
  const page = pages.find(([route]) => route === path.replace(/\\/+$/, ''));
  if (page) return <a {...props} href={page[1] + '.html' + tail} />;
  return (
    <a
      {...props}
      href="#"
      aria-disabled="true"
      title="预览里没有这一页"
      onClick={(event) => event.preventDefault()}
    />
  );
}
`,
  );

  const css = resolve(root, 'dist/client/_next/static/css');
  const base = (await readdir(css)).find(
    (name) => name.startsWith('index.') && name.endsWith('.css'),
  );
  if (!base) throw new Error('先运行 npm run build，再导出预览。');
  await writeFile(
    resolve(output, 'assets/base.css'),
    toRelative(await readFile(resolve(css, base), 'utf8')),
  );

  const used = new Set();
  for (const [name, suffix, title] of pages) {
    const entry = resolve(sources, `${name}.tsx`);
    const component = resolve(root, `app/demos/brand/r8${suffix}/page.tsx`);
    await writeFile(
      entry,
      `
import React from 'react';
import { createRoot } from 'react-dom/client';
import Page from ${JSON.stringify(component)};
createRoot(document.getElementById('root')).render(<Page />);
`,
    );
    await build({
      entryPoints: [entry],
      bundle: true,
      outfile: resolve(output, `assets/${name}.js`),
      alias: { 'next/link': linkModule },
      platform: 'browser',
      target: ['es2022'],
      jsx: 'automatic',
      format: 'iife',
      define: { 'process.env.NODE_ENV': '"production"' },
      minify: true,
      logLevel: 'warning',
    });
    for (const file of [`assets/${name}.js`, `assets/${name}.css`]) {
      const path = resolve(output, file);
      const text = await readFile(path, 'utf8').catch(() => null);
      if (text === null) continue;
      const fixed = toRelative(text);
      await writeFile(path, fixed);
      for (const match of fixed.matchAll(
        /images\/[\w\-./%]+?\.(?:jpe?g|png|webp|svg|gif|mp4)/g,
      ))
        used.add(match[0]);
    }

    const head = `<title>${title}</title>
<meta name="robots" content="noindex,nofollow">
<link rel="stylesheet" href="${fonts.replaceAll('&', '&amp;')}">
<link rel="stylesheet" href="assets/base.css">
<link rel="stylesheet" href="assets/${name}.css">
<style>:root{--font-r8-jost:'Jost';--font-r8-soft:'Fraunces'}body{margin:0;background:#f6f2ec}</style>`;
    const body = `<div id="root"></div>
<script src="assets/${name}.js" defer></script>`;
    // 入口页由托管方包上文档骨架；其余页面是完整的独立文档
    const html =
      name === 'index'
        ? `${head}\n${body}\n`
        : `<!doctype html><html lang="zh-CN"><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
${head}
</head><body>
${body}
</body></html>
`;
    await writeFile(resolve(output, `${name}.html`), html);
  }

  // 第八轮自己的影像整目录带上（选图板的路径是运行时拼出来的），其余按引用到的逐个复制
  await cp(resolve(root, 'public/images/r8'), resolve(output, 'images/r8'), {
    recursive: true,
  });
  for (const file of used) {
    if (file.startsWith('images/r8/')) continue;
    const from = resolve(root, 'public', file);
    const to = resolve(output, file);
    await mkdir(dirname(to), { recursive: true });
    await cp(from, to).catch(() => console.warn(`没找到 ${file}`));
  }
} finally {
  await rm(sources, { recursive: true, force: true });
}

const listing = [];
const walk = async (dir, prefix = '') => {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const path = prefix + entry.name;
    if (entry.isDirectory()) await walk(resolve(dir, entry.name), path + '/');
    else listing.push(path);
  }
};
await walk(output);
console.log(JSON.stringify({ output, files: listing.length }));
