// Read-only checks for the brand review pages; no votes are written.
import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
const origin = process.env.TEST_ORIGIN || 'http://localhost:3000';
const slugs = ['daylight', 'folio', 'nocturne', 'cosmos', 'edition-c'];
async function html(path) {
  const response = await fetch(`${origin}${path}`);
  assert.equal(response.status, 200, path);
  const page = await response.text();
  assert.match(page, /<meta name="robots" content="noindex, nofollow"/, path);
  return page;
}
const compare = await html('/demos/brand/compare');
assert.match(compare, /五个方向，放在一起看/);
const vote = await html('/demos/brand/vote');
assert.match(vote, /你更喜欢哪一个/);
for (const slug of slugs)
  for (const suffix of ['', '/work']) {
    const route = `/demos/brand/${slug}${suffix}`;
    assert(compare.includes(`href="${route}"`), `预览台缺少 ${route}`);
    assert(vote.includes(`href="${route}"`), `投票页缺少 ${route}`);
    assert.equal((await fetch(origin + route)).status, 200, route);
    const shot = `public/images/demos/directions/${slug}-${suffix ? 'work' : 'home'}`;
    for (const size of ['', '-480', '-mobile', '-mobile-280'])
      assert(existsSync(`${shot}${size}.jpg`), `${shot}${size}.jpg`);
  }
// 工作室版的产品页与联系页：五个方向都有，内容来自 content/
for (const slug of slugs)
  for (const suffix of ['/life', '/tool', '/story', '/contact']) {
    const page = await html(`/demos/brand/${slug}${suffix}`);
    assert(
      !page.includes('href="/demos/brand/edition-c') || slug === 'edition-c',
      `${slug}${suffix} 链到了 Edition C`,
    );
  }
const results = await fetch(`${origin}/api/design-votes`);
assert.equal(results.status, 200);
assert.equal(results.headers.get('cache-control'), 'no-store');
const data = await results.json();
assert.deepEqual(Object.keys(data.tally), slugs);
assert.equal(data.mine, null);
assert(data.votes.every((v) => !('id' in v)));
const foreign = await fetch(`${origin}/api/design-votes`, {
  method: 'POST',
  headers: {
    'content-type': 'application/json',
    origin: 'https://untrusted.example',
  },
  body: JSON.stringify({
    id: crypto.randomUUID(),
    choice: 'folio',
    name: '外站',
    reason: '外站来的一票不该保存。',
  }),
});
assert(
  foreign.status === 400 || foreign.status === 403,
  `外站投票 ${foreign.status}`,
);
console.log('brand review pages ok');
