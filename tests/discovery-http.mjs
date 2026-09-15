import assert from 'node:assert/strict';
const origin = process.env.TEST_ORIGIN || 'http://localhost:3000';
const canonicalOrigin = 'https://molis-club.yijunw0212.chatgpt.site';
async function html(path) {
  const response = await fetch(`${origin}${path}`);
  assert.equal(response.status, 200, path);
  return response.text();
}
function schemas(page) {
  return [
    ...page.matchAll(
      /<script type="application\/ld\+json">([\s\S]*?)<\/script>/g,
    ),
  ].map((m) => JSON.parse(m[1]));
}
const home = await html('/');
assert.match(home, /一间与 AI 一起创作的工作室/);
assert.match(home, /href="\/products"[^>]*>[\s\S]*?探索作品/);
assert.match(home, /href="\/community\/adeptify"/);
assert.match(home, /href="\/join"/);
assert.match(home, /class="entrance-fallback"/);
assert(!home.includes('class="product-lines '));
assert(!home.includes('class="solutions-preview '));
assert(!home.includes('class="studio-questions '));
assert.match(schemas(home)[0]['@graph'][0].description, /工作室/);
const engineering = await html('/products?line=engineering');
assert.deepEqual(
  schemas(engineering)[0].itemListElement.map((e) => e.item.name),
  ['Prologue', 'Flyleaf', 'ForkLight', 'GoalBoard'],
);
assert.equal((engineering.match(/class="edition-work"/g) || []).length, 4);
assert(!engineering.includes('data-work="jelly"'));
assert(
  engineering.includes(`rel="canonical" href="${canonicalOrigin}/products"`),
);
const tools = await html('/products?line=tools');
assert.deepEqual(
  schemas(tools)[0].itemListElement.map((e) => e.item.name),
  ['niul.ai', 'DropAgent', 'Jelly'],
);
const all = await html('/products?line=unknown');
assert.equal((all.match(/class="edition-work"/g) || []).length, 10);
const aether = await html('/works/aether');
const fact = schemas(aether)[0];
assert.equal(fact.creativeWorkStatus, '方案设计');
assert.equal(fact['@type'], 'CreativeWork');
assert(!('offers' in fact));
assert(aether.includes('业务代码未启动'));
assert(
  aether.includes(`rel="canonical" href="${canonicalOrigin}/works/aether"`),
);
const article = await html('/story/human-scale');
assert.equal(schemas(article)[0].author.name, '一骏');
assert(
  article.includes(
    `rel="canonical" href="${canonicalOrigin}/story/human-scale"`,
  ),
);
for (const path of ['/', '/products', '/account', '/login', '/join']) {
  assert.match(
    await html(path),
    /<meta name="robots" content="noindex, nofollow"/,
  );
}
const robots = await html('/robots.txt');
assert.equal(robots, 'User-agent: *\nDisallow: /\n');
const sitemap = await html('/sitemap.xml');
assert(!sitemap.includes('<loc>'));
console.log(
  'PASS: server-rendered category navigation, canonical identity, truthful structured content, and private indexing boundaries.',
);
