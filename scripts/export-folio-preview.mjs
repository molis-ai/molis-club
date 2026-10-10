import { build } from 'esbuild';
import { cp, mkdir, readdir, rm, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const root = process.cwd();
const output = resolve(root, 'outputs/folio-deploy');
const sources = resolve(root, 'outputs/folio-preview-source');
const originalOrigin =
  'https://claude-project-thread-tzu07o-molis-club-production.sparkling-silence-0a49.workers.dev';
const folio = '/demos/brand/folio';
await rm(output, { recursive: true, force: true });
await mkdir(output, { recursive: true });
await mkdir(sources, { recursive: true });
await mkdir(resolve(output, 'assets'), { recursive: true });

const routes = [
  ['home', '', 'Molis AI · AI 产品工作室'],
  ['tool', '/tool', 'Molis Tool · 光标在哪里，软件就在哪里'],
  ['work', '/work', 'Molis Work · 让工作，在人、工具与 Agent 之间继续'],
  ['solutions', '/solutions', 'Molis AI 解决方案 · 把 AI 用进具体业务'],
  ['life', '/life', 'Molis Life'],
  ['story', '/story', 'Molis Story'],
  ['about', '/about', '关于我们 · Molis AI'],
  ['essays', '/essays', '文章 · Molis AI'],
  [
    'essay-human-scale',
    '/essays/human-scale',
    '人的尺度：理想主义在 AI 时代的生与死 · Molis AI',
  ],
  [
    'essay-idealism',
    '/essays/idealism',
    '落地主义：一种不承认自己是哲学的哲学 · Molis AI',
  ],
  ['community', '/demos/community', 'Molis AI 社区 · 好奇心，值得做出来'],
];

// Keep contact, knowledge and other server-backed pages on the original application. This package
// contains only the existing presentation components, never credentials or D1.
try {
  const linkModule = resolve(sources, 'link.tsx');
  await writeFile(
    linkModule,
    `
import React from 'react';
export default function Link({href, prefetch, replace, scroll, locale, ...props}) {
  const value = typeof href === 'string' ? href : href.pathname;
  const pathname = value.split(/[?#]/, 1)[0].replace(/\\/+$/, '') || '/';
  const local = pathname === '/' || ${JSON.stringify(routes.map(([name, suffix]) => (name === 'community' ? suffix : folio + suffix)))}.includes(pathname);
  const destination = value.startsWith('/') && !local ? ${JSON.stringify(originalOrigin)} + value : value;
  return <a {...props} href={destination} />;
}
`,
  );

  const compiledCss = resolve(root, 'dist/client/_next/static/css');
  const globalFile = (await readdir(compiledCss)).find(
    (name) => name.startsWith('index.') && name.endsWith('.css'),
  );
  if (!globalFile)
    throw new Error('Run npm run build before exporting the preview.');
  await cp(
    resolve(compiledCss, globalFile),
    resolve(output, 'assets/base.css'),
  );
  await cp(resolve(root, 'public/images'), resolve(output, 'images'), {
    recursive: true,
  });
  await cp(resolve(root, 'public/downloads'), resolve(output, 'downloads'), {
    recursive: true,
  });

  for (const [name, suffix, title] of routes) {
    const route = name === 'community' ? suffix : folio + suffix;
    const entry = resolve(sources, `${name}.tsx`);
    const component = resolve(
      root,
      name === 'community'
        ? 'app/demos/community/page.tsx'
        : `app/demos/brand/folio${suffix}/page.tsx`,
    );
    await writeFile(
      entry,
      `
import React from 'react';
import { createRoot } from 'react-dom/client';
import ${JSON.stringify(resolve(root, 'app/demos/shared.css'))};
import Page from ${JSON.stringify(component)};
createRoot(document.getElementById('root')!).render(<div className="molis-demo"><Page /></div>);
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
    const html = `<!doctype html><html lang="zh-CN"><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex,nofollow"><title>${title}</title>
<link rel="icon" href="/images/molis-logo.png">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Newsreader:ital,wght@0,400;1,400&amp;family=Geist&amp;family=Noto+Serif+SC:wght@500;900&amp;display=swap">
<link rel="stylesheet" href="/assets/base.css"><link rel="stylesheet" href="/assets/${name}.css">
<style>:root{--font-editorial:'Newsreader';--font-geist:'Geist';--font-fo-serif:'Noto Serif SC'}</style>
</head><body><a class="skip-link" href="#main">跳到主要内容</a><div id="root"></div>
<script src="/assets/${name}.js" defer></script></body></html>`;
    const directory = resolve(output, '.' + route);
    await mkdir(directory, { recursive: true });
    await writeFile(resolve(directory, 'index.html'), html);
    if (name === 'home') await writeFile(resolve(output, 'index.html'), html);
  }
  await writeFile(
    resolve(output, 'robots.txt'),
    'User-agent: *\nDisallow: /\n',
  );
  await writeFile(
    resolve(output, 'README.txt'),
    'Molis AI Folio presentation preview\n\nEleven pages with original interactive animations. Community, shared navigation, images and Skill downloads are included. Contact and knowledge links use the original application. No backend, database, user data or credentials are included.\n',
  );
} finally {
  await rm(sources, { recursive: true, force: true });
}
console.log(
  JSON.stringify({
    output,
    routes: routes.map(([name, suffix]) =>
      name === 'community' ? suffix : folio + suffix,
    ),
  }),
);
