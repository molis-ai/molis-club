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
  '/work/download',
  '/tool',
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
  for (const href of ['/work', '/tool'])
    assert(page.includes(`href="${href}"`), `${path}: product link ${href}`);
  // Life、Story、World 先不开放（负责人 2026-10-18）：哪里都不链过去，阶段写「探索中，敬请期待」
  for (const href of ['/life', '/story', '/world'])
    assert(!page.includes(`href="${href}"`), `${path}: no link to ${href}`);
  // 页尾：本页最近修改
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
// Work 从 2026-10-18 起写「开发中」、源码公开，不写「开源」（main 已不是 MIT）
for (const stage of ['重点推进 · 开发中', '开发中', '探索中，敬请期待'])
  assert(home.includes(stage), `home stage ${stage}`);
assert(!/开源开发中|开源代码|开源（MIT）/.test(home), 'home: no open-source claim');
// 「我们相信」与「这些产品怎样联系」不放首页（负责人 2026-10-15）
assert(
  !home.includes('有自己的判断，也有把它做成的本事。'),
  'no beliefs on home',
);
assert(!home.includes('这些产品怎样联系'), 'no product relations on home');
assert(!home.includes('目前如何了解与体验'), 'home: removed access overview');
assert.match(home, /查看源码/);
// 产品舞台去产品页只留圆形箭头，读屏名写清是哪件（E3）；Life、Story、World 暂不开放，不放箭头
for (const name of ['Work', 'Tool'])
  assert(home.includes(`aria-label="了解 Molis ${name}"`), `home stage go ${name}`);
for (const name of ['Life', 'Story', 'World'])
  assert(!home.includes(`aria-label="了解 Molis ${name}"`), `home stage no go ${name}`);
// 结尾：过渡句与企业合作、社区、关于我们三个去处
assert.match(home, /让口味相近的人/);
for (const path of ['/enterprise', '/community', '/about'])
  assert(home.includes(`href="${path}"`), `home closing links ${path}`);
assert.match(home, /技术，回到人的尺度。/);
assert(!home.includes('安装 Molis Work 开源版'), 'no install promise on home');
assert.match(home, new RegExp(`rel="canonical" href="${canonicalOrigin}/?"`));

// 产品页：阶段、诚实标注；没有伪装可用的下载入口
const work = await html('/work');
assert.match(work, /开发中/);
assert.match(work, /界面示意 · 示例数据/);
// Work 分三条路（写代码 / 写文档、做研究 / 管事情、跟进度）；状态三档：已发布 · v0.2.0 / 开发中 / 规划中；
// 许可不写「开源」（Work 的 main 从 2026-10-17 起不是 MIT）；Issue 插件是内部工具，不上官网
assert.match(work, /你主要做什么/);
for (const route of ['写代码', '写文档、做研究', '管事情、跟进度'])
  assert(work.includes(route), `work: route ${route}`);
assert.match(work, /已发布 · v0\.2\.0/);
assert.match(work, /规划中/);
assert.match(work, /源码公开/);
assert.match(work, /许可以仓库 LICENSE 为准/);
assert(!/开源开发中|开源（MIT）|MIT 许可|开源版/.test(work), 'work: no open-source claim');
assert(!work.includes('Issue'), 'work: no internal Issue plugin');
assert(!/下载 Molis|安装包下载|立即下载/.test(work), 'work: no download entry');
// 主按钮报名首批试用，去联系页
assert.match(work, /报名首批试用/);
assert(work.includes('href="/contact?topic=work-trial"'), 'work: trial goes to contact');
assert(work.includes('href="https://github.com/molis-ai/molis-work"'));
// 没有 JS 时舞台下面列出每段的标题和字幕
assert.match(work, /Agent 说做完了，Work 说还差你。/);

// 下载页：还没到给人下载的时候，只留一个口子：新版标「开发中」、按钮「报名首批试用」；不列任何安装包，不写「免费」
const download = await html('/work/download');
assert.match(download, /开发中/);
assert.match(download, /报名首批试用/);
assert(download.includes('href="/contact?topic=work-trial"'), 'download: trial goes to contact');
assert(!/开源开发中|开源（MIT）|MIT 许可|开源版/.test(download), 'download: no open-source claim');
assert(!/免费|\.dmg|\.zip|0\.1\.1\d/i.test(download), 'download: no free claim, no package links');
assert(!download.includes('Issue'), 'download: no internal Issue plugin');
assert(work.includes('href="/work/download"'), 'work: links to download page');
const tool = await html('/tool');
assert.match(tool, /示意/, '/tool: honest label');
assert(
  !/下载 Molis|安装包下载|立即下载/.test(tool),
  '/tool: no download entry',
);
assert(
  tool.includes('href="/contact?topic='),
  '/tool: follow progress via contact',
);
assert.match(tool, /计划成为 Molis Work 的基础能力/);
// 产品页标签行不再写产品名（下面就是大字产品名）
for (const page of [work, tool])
  assert(!/<p class="m-tagline[^"]*"><b/.test(page), 'tagline without name');

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
  // 先不开放的产品详情页
  ['/life', '/#products'],
  ['/story', '/#products'],
  ['/world', '/#products'],
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

// 常驻约束：不放引导与过渡句；负责人要求删掉的整段不再回来（评审 2026-10-16、负责人 2026-10-18）
for (const [path, text] of [
  ['/community', '往下：四件作品，各自连着做法'],
  ['/enterprise', '先说说，你们卡在哪'],
  ['/team', '认识每一个人'],
  ['/essays/human-scale', '接着读'],
  ['/about', '我们怎样要求自己'],
  ['/about', '这些信念怎样落到产品里'],
])
  assert(!(await html(path)).includes(text), `${path}: no「${text}」`);

// 联系页：只有验收过的一版，不带评审控件，旧版对照已删（E1，负责人 2026-10-18）
for (const path of ['/contact', '/contact?study=current']) {
  const contact = await html(path);
  assert(!contact.includes('m-review-bar'), `${path}: no review switch`);
  assert(!contact.includes('选一个来意，写几句就好'), `${path}: old lead removed`);
}

// 行动入口不用下划线文字：卡片里只留圆形箭头，读屏名写清去处（E3）
assert.match(
  await html('/community/methods'),
  /class="m-go"[^>]*aria-label="看方法：/,
);

console.log(
  'PASS: every page of the rebuilt site, one h1 each, header/footer, honest stages and labels, legacy redirects, 404 and private indexing.',
);
