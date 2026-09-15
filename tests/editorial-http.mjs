import assert from 'node:assert/strict';
const origin = process.env.TEST_ORIGIN || 'http://localhost:3000';
const canonicalOrigin = 'https://molis-club.yijunw0212.chatgpt.site';
async function page(path) {
  const response = await fetch(`${origin}${path}`);
  assert.equal(response.status, 200, path);
  return response.text();
}
function schemas(html) {
  return [
    ...html.matchAll(
      /<script type="application\/ld\+json">([\s\S]*?)<\/script>/g,
    ),
  ].map((match) => JSON.parse(match[1]));
}
for (const path of [
  '/community',
  '/wiki',
  '/products',
  '/solutions',
  '/perspectives',
  '/wiki/artists',
]) {
  const html = await page(path);
  assert.match(html, /<meta name="robots" content="noindex, nofollow"/);
  assert(
    html.includes(`rel="canonical" href="${canonicalOrigin}${path}"`),
    path,
  );
  for (const target of [
    '/community',
    '/wiki',
    '/products',
    '/solutions',
    '/perspectives',
  ])
    assert(html.includes(`href="${target}"`), `${path}: navigation ${target}`);
}
for (const slug of [
  'stagger',
  'underline',
  'accordion',
  'scroll-snap',
  'sticky',
  'asymmetric-grid',
]) {
  const html = await page(`/wiki/${slug}`);
  const term = schemas(html).find(
    (schema) => schema['@type'] === 'DefinedTerm',
  );
  assert.equal(term.url, `${canonicalOrigin}/wiki/${slug}`);
  assert(
    html.includes(term.description),
    `${slug} definition is present in HTML`,
  );
  assert.match(html, /什么时候使用/);
  assert.match(html, /留意这些细节/);
  assert.match(html, /实现 Prompt/);
  assert.match(html, /developer.mozilla.org/);
}
for (const slug of [
  'monet-impressionism',
  'dali-surrealism',
  'wes-anderson-poster',
  'art-style-skill-builder',
]) {
  const html = await page(`/wiki/artists/${slug}`);
  assert.match(html, /下载完整 Skill/);
  assert(html.includes(`href="/downloads/artists/${slug}.zip"`));
  assert(
    html.includes(`$${slug}`),
    'specific invocation present in server HTML',
  );
  const response = await fetch(`${origin}/downloads/artists/${slug}.zip`);
  assert.equal(response.status, 200);
  assert.equal(response.headers.get('content-type'), 'application/zip');
}
for (const [oldPath, newPath] of [
  ['/journal', '/perspectives'],
  ['/creators', '/community'],
  ['/studio', '/community/adeptify'],
]) {
  const response = await fetch(`${origin}${oldPath}`, { redirect: 'manual' });
  assert.equal(response.status, 308, oldPath);
  assert.equal(response.headers.get('location'), newPath);
}
const member = await page('/community/adeptify');
assert(member.includes('href="/works/jelly"'));
assert((await page('/works/jelly')).includes('href="/community/adeptify"'));
const author = await page('/community/yijun');
assert(author.includes('href="/story/human-scale"'));
const story = await page('/story/human-scale');
assert(story.includes('href="/community/yijun"'));
assert(story.includes('href="/perspectives"'));
assert(story.includes('href="/story/idealism"'));
for (const match of story.matchAll(/href="#(section-\d+)"/g))
  assert(story.includes(`id="${match[1]}"`), 'TOC resolves to real heading');
for (const path of [
  '/wiki/not-a-term',
  '/wiki/artists/not-a-skill',
  '/community/not-a-member',
])
  assert.equal((await fetch(`${origin}${path}`)).status, 404, path);
console.log(
  'PASS: editorial navigation, private indexing, encyclopedia definitions/prompts, artist downloads, legacy redirects, authorship links and TOC anchors.',
);
