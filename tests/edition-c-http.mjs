import { isResourceEntry, knowledge } from '../content/knowledge.ts';
import assert from 'node:assert/strict';
const origin = process.env.TEST_ORIGIN || 'http://localhost:3000';
const site = 'https://molis-club.yijunw0212.chatgpt.site';
const main = [
  '',
  'community',
  'wiki',
  'products',
  'solutions',
  'perspectives',
  'wiki/artists',
  'login',
  'join',
  'account',
  'privacy',
];
const works = [
  'niulai',
  'astralo',
  'seentoo',
  'elsewhere',
  'forklight',
  'goalboard',
  'dropagent',
  'jelly',
  'prologue',
  'flyleaf',
  'content-growth',
  'evrik',
  'aether',
];
const terms = knowledge.map((entry) => entry.slug);
const artists = [
  'monet-impressionism',
  'dali-surrealism',
  'wes-anderson-poster',
  'art-style-skill-builder',
];
const paths = [
  ...main,
  ...works.map((s) => `works/${s}`),
  ...terms.map((s) => `wiki/${s}`),
  ...artists.map((s) => `wiki/artists/${s}`),
  'community/adeptify',
  'community/yijun',
  'story/idealism',
  'story/human-scale',
];
for (const path of paths) {
  const res = await fetch(`${origin}/edition-c${path ? '/' + path : ''}`);
  assert.equal(res.status, 200, path);
  const html = await res.text();
  assert.match(html, /<meta name="robots" content="noindex, nofollow"/);
  assert(
    html.includes(`rel="canonical" href="${site}${path ? '/' + path : ''}"`),
    `Canonical: ${path}`,
  );
  for (const target of [
    'community',
    'wiki',
    'products',
    'solutions',
    'perspectives',
  ])
    assert(
      html.includes(`href="/edition-c/${target}"`),
      `${path}: C navigation ${target}`,
    );
  for (const match of html.matchAll(/<a\b[^>]*href="([^"]+)"/g)) {
    assert(!match[1].startsWith('/atelier'), `${path} leaks to B: ${match[1]}`);
    assert(
      !/^\/(?:$|(?:community|wiki|products|solutions|perspectives|works|story|login|join|account|privacy)(?:[/?#]|$))/.test(
        match[1],
      ),
      `${path} leaks to A: ${match[1]}`,
    );
  }
  if (path.startsWith('wiki/artists/'))
    assert(
      html.includes(`href="/downloads/artists/${path.split('/').at(-1)}.zip"`),
      'Download URL must stay unprefixed',
    );
  if (terms.includes(path.split('/')[1])) {
    const entry = knowledge.find((item) => item.slug === path.split('/')[1]);
    assert.match(
      html,
      isResourceEntry(entry) ? /参考 Prompt/ : /实现 Prompt/,
    );
  }
}
const filtered = await (
  await fetch(`${origin}/edition-c/products?line=experience`)
).text();
assert(
  !filtered.includes('class="c-product-feature"'),
  'Filtered index excludes featured spread',
);
const compare = await (await fetch(`${origin}/compare`)).text();
for (const p of [
  '/',
  '/edition-c',
  '/community',
  '/edition-c/community',
  '/wiki/artists/monet-impressionism',
  '/edition-c/wiki/artists/monet-impressionism',
])
  assert(compare.includes(`href="${p}"`), `Compare ${p}`);
for (const p of [
  'missing',
  'wiki/missing',
  'works/missing',
  'wiki/artists/missing',
])
  assert.equal((await fetch(`${origin}/edition-c/${p}`)).status, 404, p);
console.log(
  `PASS: ${paths.length} C routes, A/B/C containment, canonical and private indexing, direct downloads, filtering, comparison links and missing pages.`,
);
