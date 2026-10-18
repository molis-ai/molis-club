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
/** 展厅的名牌、平面图、「下一个展厅」与墙色（「关于」收成一整页后不再出现） */
const exhibit = /class="ex-(meta|plan|next)[\s"]|data-room=/;

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
  // 顶栏：产品 ▾ · 企业合作 · 社区 · 关于 ｜ 登录 · 聊一聊；页尾目录里有文章、沿途
  for (const href of [
    '/enterprise',
    '/community',
    '/about',
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
  // 「关于」是一整页：顶栏不下拉，不再链到退役的「认识我们」，也没有展厅名牌与「下一个展厅」
  assert(!page.includes('m-drop-about'), `${path}: no about dropdown`);
  assert(!page.includes('href="/team'), `${path}: no link to /team`);
  assert(
    !exhibit.test(page),
    `${path}: no exhibit plate, plan, wall or next room`,
  );
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
for (const stage of ['开源开发中', '开发中', '原型探索中', '概念设计'])
  assert(home.includes(stage), `home stage ${stage}`);
// 「我们相信」与「这些产品怎样联系」不放首页（负责人 2026-10-15）
assert(
  !home.includes('有自己的判断，也有把它做成的本事。'),
  'no beliefs on home',
);
assert(!home.includes('这些产品怎样联系'), 'no product relations on home');
assert(!home.includes('目前如何了解与体验'), 'home: removed access overview');
assert.match(home, /查看开源代码/);
// 结尾：过渡句与企业合作、社区、关于我们三个去处
assert.match(home, /让口味相近的人/);
for (const path of ['/enterprise', '/community', '/about'])
  assert(home.includes(`href="${path}"`), `home closing links ${path}`);
assert.match(home, /技术，回到人的尺度。/);
assert(!home.includes('安装 Molis Work 开源版'), 'no install promise on home');
assert.match(home, new RegExp(`rel="canonical" href="${canonicalOrigin}/?"`));

// 产品页：阶段、诚实标注；没有伪装可用的下载入口
const work = await html('/work');
assert.match(work, /开源开发中/);
assert.match(work, /界面示意/);
// Work 按读者分两版（写代码 / 写文档、管事情）；状态只分「已发布」「开发中」；Issue 插件是内部工具，不上官网
assert.match(work, /你主要做什么/);
assert.match(work, /已发布 · v0\.2\.0/);
assert.match(work, /开发中/);
assert(!work.includes('Issue'), 'work: no internal Issue plugin');
assert(!/下载 Molis|安装包下载|立即下载/.test(work), 'work: no download entry');
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
  ['/team', '/about#people'],
  ['/creators', '/about#people'],
  ['/community/adeptify', '/about#people'],
  ['/community/yijun', '/about#yijun'],
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

// 常驻约束：不放引导与过渡句；负责人要求删掉的整段不再回来（评审 2026-10-16、负责人 2026-10-18）
for (const [path, text] of [
  ['/community', '往下：四件作品，各自连着做法'],
  ['/enterprise', '先说说，你们卡在哪'],
  ['/about', '认识每一个人'],
  ['/essays/human-scale', '接着读'],
  ['/about', '我们怎样要求自己'],
  ['/about', '这些信念怎样落到产品里'],
])
  assert(!(await html(path)).includes(text), `${path}: no「${text}」`);

// 「关于」是一整页（C1，负责人 2026-10-18 看过样张后切成默认）。旧的展厅版暂留 /about?study=current 对照，
// 只有带参数时出现比较条
{
  const old = await html('/about?study=current');
  assert.match(
    old,
    /<title>我们相信什么 · Molis AI<\/title>/,
    'about: old version',
  );
  assert(old.includes('m-review-bar'), 'about current: review bar');
  assert((await html('/about?study=one')).includes('m-review-bar'));
  const one = await html('/about');
  assert(!one.includes('m-review-bar'), '/about: no review bar by default');
  const text = one
    .replace(/<script[\s\S]*?<\/script>/g, '')
    .replace(/<style[\s\S]*?<\/style>/g, '')
    .replace(/<[^>]+>/g, '');
  assert.equal(count(one, /<h1[\s>]/g), 1, 'about one: one h1');
  assert.match(
    one,
    /<h1[^>]*>[\s\S]*?技术，[\s\S]*?回到人的尺度。[\s\S]*?<\/h1>/,
    'about one: the main line is the h1',
  );
  assert.match(one, /<title>关于 · Molis AI<\/title>/, 'about one: title');
  // 读起来是一篇故事（负责人 2026-10-18）：愿景与黑客与画家在前，成员在最后
  let at = 0;
  for (const line of [
    '技术，回到人的尺度。',
    '三种媒介，同一个动作。',
    '我们向往《黑客与画家》里那种创造者的样子',
    '当想法更容易变成现实',
    '我们相信什么',
    '有自己的判断，也有把它做成的本事。',
    '让更多人成为创造者，让作品找到最早的相信者。',
    '从怎样工作，走向怎样生活',
    '我们希望，技术带来的能力，能变成人手里的选择',
    '工作是其中一条清晰的线索。',
    '从这些探索，看向更远的构想',
    '从同事，到共同创造的伙伴',
    '我们曾是美团的同事。',
    '一群同类，一起创造。',
    '找同类，不抢货架。',
    '我们做自己用着舒服的产品',
  ]) {
    const next = text.indexOf(line, at);
    assert(next >= 0, `about one: 「${line}」 in order`);
    at = next;
  }
  // 原句只出现一次（「找同类，不抢货架。」只在结尾回扣标题，正文只在信念里）
  for (const line of [
    '这些经历构成了我们的来路。',
    '我们想在产品里寻找这些答案。',
    '工作是其中一条清晰的线索。',
    '我们曾是美团的同事。',
    '让口味相近的人认出彼此。',
    '决定什么值得做，本身就是创造的一部分。',
  ])
    assert.equal(text.split(line).length - 1, 1, `about one: 「${line}」 once`);
  // 去处：沿途、两篇文章、正文里的五件产品、企业合作、社区、聊一聊
  for (const href of [
    '/along-the-way',
    '/essays/human-scale',
    '/essays/idealism',
    '/work',
    '/tool',
    '/life',
    '/story',
    '/world',
    '/enterprise',
    '/community',
    '/contact',
  ])
    assert(one.includes(`href="${href}"`), `about one: link ${href}`);
  // 不再是展厅：没有名牌、平面图、墙色与「下一个展厅」
  assert(!text.includes('展厅'), 'about one: no room names');
  // 八个人的名牌带锚点（旧地址 /community/yijun 跳到 #yijun）
  for (const id of ['people', 'yijun', 'jinqu'])
    assert(one.includes(`id="${id}"`), `about one: anchor #${id}`);
}

console.log(
  'PASS: every page of the rebuilt site, one h1 each, header/footer, honest stages and labels, legacy redirects, 404 and private indexing.',
);
