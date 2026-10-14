// 新站的 HTTP 检查（本地服务运行时：npm run test:http）。
// 覆盖 specs/site-rebuild/spec.md 第 3 节的全部页面、旧地址重定向、私有收录边界、诚实标注与 404。
import assert from 'node:assert/strict';

const origin = process.env.TEST_ORIGIN || 'http://localhost:3000';
const canonicalOrigin = 'https://molis-club.yijunw0212.chatgpt.site';

async function html(path) {
  const response = await fetch(`${origin}${path}`);
  assert.equal(response.status, 200, path);
  return response.text();
}
const count = (text, pattern) => (text.match(pattern) || []).length;

const pages = [
  '/',
  '/work',
  '/tool',
  '/life',
  '/story',
  '/world',
  '/enterprise',
  '/community',
  '/community/methods',
  '/community/methods/stagger',
  '/community/methods/artists/monet-impressionism',
  '/about',
  '/team',
  '/essays',
  '/essays/human-scale',
  '/essays/idealism',
  '/along-the-way',
  '/contact',
  '/login',
  '/account',
  '/privacy',
];

for (const path of pages) {
  const page = await html(path);
  assert.equal(count(page, /<h1[\s>]/g), 1, `${path}: exactly one h1`);
  assert.match(page, /<meta name="robots" content="noindex, nofollow"/, path);
  assert.match(page, /<html lang="zh-CN"/, path);
  // 顶栏：产品 ▾ · 企业合作 · 社区 · 关于 ▾ ｜ 登录 · 聊一聊
  for (const href of [
    '/enterprise',
    '/community',
    '/about',
    '/team',
    '/essays',
    '/along-the-way',
    '/login',
    '/contact',
  ])
    assert(
      page.includes(`href="${href}"`),
      `${path}: header/footer link ${href}`,
    );
  for (const href of ['/work', '/tool', '/life', '/story', '/world'])
    assert(page.includes(`href="${href}"`), `${path}: product link ${href}`);
  // 页尾：版权说明与本页最近修改
  assert.match(page, /部分配图由 AI 生成/, `${path}: image credit`);
  assert.match(
    page,
    /本页最近修改(<!-- -->)?：<time dateTime="\d{4}-\d{2}-\d{2}">/,
    `${path}: last modified`,
  );
  // 品牌始终是 Molis AI：看得见的文字里不出现仓库名（脚本与站点地址除外）
  const visible = page
    .replace(/<script[\s\S]*?<\/script>/g, '')
    .replace(/<style[\s\S]*?<\/style>/g, '')
    .replace(/<[^>]+>/g, ' ');
  assert(!/molis-club/i.test(visible), `${path}: no repo name as brand`);
  assert(!page.includes('仅作评审样张'), `${path}: no review-only credit`);
}

const home = await html('/');
assert.match(home, /<h1[^>]*>Molis AI<\/h1>/);
assert.match(home, /We build/);
assert.match(home, /Beyond/);
for (const stage of ['开源开发中', '开发中', '原型探索中', '概念设计'])
  assert(home.includes(stage), `home stage ${stage}`);
assert.match(home, /有自己的判断，也有把它做成的本事。/);
assert.match(home, /技术，回到人的尺度。/);
assert.match(home, /查看 Molis Work 开源代码/);
assert(!home.includes('安装 Molis Work 开源版'), 'no install promise on home');
assert.match(home, new RegExp(`rel="canonical" href="${canonicalOrigin}/?"`));

// 产品页：阶段、诚实标注；没有伪装可用的下载入口
const work = await html('/work');
assert.match(work, /开源开发中/);
assert.match(work, /界面示意/);
assert.match(work, /把这件工作交给谁/);
assert(work.includes('href="https://github.com/molis-ai/molis-work"'));
assert(work.includes('https://github.com/molis-ai/molis-work#run-from-source'));
for (const path of ['/tool', '/life', '/story', '/world']) {
  const page = await html(path);
  assert.match(page, /示意/, `${path}: honest label`);
  assert(
    !/下载 Molis|安装包下载|立即下载/.test(page),
    `${path}: no download entry`,
  );
  assert(
    page.includes('href="/contact?topic='),
    `${path}: follow progress via contact`,
  );
}
assert.match(await html('/tool'), /计划成为 Molis Work 的基础能力/);
assert.match(await html('/life'), /尚未打通/);
assert.match(await html('/story'), /尚未开放/);
const world = await html('/world');
assert.match(world, /概念设计/);
assert.match(world, /概念示意/);

// 旧地址：全部转到新页面里对应的位置
for (const [from, to] of [
  ['/products', '/#products'],
  ['/solutions', '/enterprise'],
  ['/wiki', '/community/methods'],
  ['/wiki/stagger', '/community/methods/stagger'],
  [
    '/wiki/artists/monet-impressionism',
    '/community/methods/artists/monet-impressionism',
  ],
  ['/perspectives', '/essays'],
  ['/journal', '/essays'],
  ['/story/human-scale', '/essays/human-scale'],
  ['/studio', '/about'],
  ['/creators', '/team'],
  ['/community/yijun', '/team'],
  ['/join', '/contact'],
  ['/works/niulai', '/along-the-way'],
  ['/atelier', '/'],
  ['/atelier/studio/work', '/'],
  ['/edition-c', '/'],
  ['/edition-c/products', '/'],
  ['/compare', '/'],
]) {
  const response = await fetch(`${origin}${from}`, { redirect: 'manual' });
  assert.equal(response.status, 307, from);
  assert.equal(
    new URL(response.headers.get('location'), origin).pathname +
      new URL(response.headers.get('location'), origin).hash,
    to,
    from,
  );
}

// 评审页还在原处，不受新站影响
assert.equal((await fetch(`${origin}/demos/brand/r8/seaside`)).status, 200);

// 404：一句干幽默和回去的路
for (const path of [
  '/not-a-page',
  '/essays/not-an-essay',
  '/community/methods/not-a-method',
  '/community/methods/artists/not-an-artist',
]) {
  const response = await fetch(`${origin}${path}`);
  assert.equal(response.status, 404, path);
}
assert.match(
  await (await fetch(`${origin}/not-a-page`)).text(),
  /这一页还在沿途上/,
);

// 私有试用：不公开收录
assert.equal(await html('/robots.txt'), 'User-agent: *\nDisallow: /\n');
assert(!(await html('/sitemap.xml')).includes('<loc>'));

console.log(
  'PASS: every page of the rebuilt site, one h1 each, header/footer, honest stages and labels, legacy redirects, 404 and private indexing.',
);
