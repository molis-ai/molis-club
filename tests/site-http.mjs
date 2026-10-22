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
  for (const href of ['/work', '/tool'])
    assert(page.includes(`href="${href}"`), `${path}: product link ${href}`);
  // 「关于」是一整页：顶栏不下拉，不再链到退役的「认识我们」，也没有展厅名牌与「下一个展厅」。
  // 「关于」的《黑客与画家》把整张样式表当画面摆出来（里面有各种类名），查结构时先拿掉它和脚本
  const markup = page
    .replace(/<div class="hp-sheet"[\s\S]*?<p class="sr-only">/, '')
    .replace(/<script[\s\S]*?<\/script>/g, '');
  assert(!markup.includes('m-drop-about'), `${path}: no about dropdown`);
  assert(!markup.includes('href="/team'), `${path}: no link to /team`);
  assert(
    !exhibit.test(markup),
    `${path}: no exhibit plate, plan, wall or next room`,
  );
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
for (const stage of ['开源开发中', '开发中', '探索中，敬请期待'])
  assert(home.includes(stage), `home stage ${stage}`);
// 「我们相信」与「这些产品怎样联系」不放首页（负责人 2026-10-15）
assert(
  !home.includes('有自己的判断，也有把它做成的本事。'),
  'no beliefs on home',
);
assert(!home.includes('这些产品怎样联系'), 'no product relations on home');
assert(!home.includes('目前如何了解与体验'), 'home: removed access overview');
assert.match(home, /开源代码/);
// 产品舞台去产品页只留圆形箭头，读屏名写清是哪件（E3）；Life、Story、World 暂不开放，不放箭头
for (const name of ['Work', 'Tool'])
  assert(
    home.includes(`aria-label="了解 Molis ${name}"`),
    `home stage go ${name}`,
  );
for (const name of ['Life', 'Story', 'World'])
  assert(
    !home.includes(`aria-label="了解 Molis ${name}"`),
    `home stage no go ${name}`,
  );
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
  // 负责人 2026-10-19：「都看看」、5.4 收尾那句与它下面的「聊聊企业合作」那一屏删去（旧版 ?study=current 里还有）
  ['/enterprise', '都看看'],
  ['/enterprise', '具体合作从团队眼前的问题出发'],
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
  // 第二版（负责人 2026-10-19）：上一版留在 ?study=previous 对照，?study=next 是带比较条的第二版
  {
    const previous = await html('/about?study=previous');
    assert(previous.includes('m-review-bar'), 'about previous: review bar');
    assert(
      previous.includes('class="hp-sheet"'),
      'about previous: the zoom pair of the previous version',
    );
    assert((await html('/about?study=next')).includes('m-review-bar'));
  }
  const text = one
    .replace(/<script[\s\S]*?<\/script>/g, '')
    .replace(/<style[\s\S]*?<\/style>/g, '')
    .replace(/<[^>]+>/g, '');
  assert.equal(count(one, /<h1[\s>]/g), 1, 'about one: one h1');
  // 首屏（负责人 2026-10-19）：正中是 Molis AI，右下角两行画外音
  assert.match(
    one,
    /<h1[^>]*>[\s\S]*?Molis AI[\s\S]*?<\/h1>/,
    'about one: Molis AI is the h1',
  );
  assert.match(one, /<title>关于 · Molis AI<\/title>/, 'about one: title');
  // 首屏是满幅大图（图库「光-03」），顶栏压在图上（data-tone="light"），主线用打字机打出来；叶影那层画布
  assert(one.includes('/site/about-light-'), 'about one: the hero image');
  assert(
    one.includes('class="an-hero-leaves"'),
    'about one: the moving leaf shadows',
  );
  assert(one.includes('class="tw"'), 'about one: typewriter');
  // 顺序（负责人 2026-10-20 选了「方案二 · 读一个故事」，2026-10-22 第四版删去「我们相信什么」）：
  // 首屏 → 当想法更容易变成现实（摊开）→ 一扇窗，一天 → 绘图桌 → 联创团队 → 来路 → 《黑客与画家》→ 一句邀请，四个去处
  let at = 0;
  for (const line of [
    'Molis AI',
    // 大字 Molis AI 下面接底稿 1.1 的后半句
    '是一间围绕工作、生活与体验研发 AI 产品的工作室。',
    '愿每个人，都有余地。',
    '把事情做好之后，还能去生活、去体验、去创造。',
    '当想法更容易变成现实',
    '在整理 Molis 的介绍时，一骏曾打算把仓库摊开，让作品自己说话。',
    '对于一个小团队，这意味着可以走进更多以前难以涉足的地方。',
    '当越来越多想法能够被做出来，选择做什么、为什么做，反而变得更重要。',
    '我们想在产品里寻找这些答案。',
    '从怎样工作，走向怎样生活',
    '我们希望，技术带来的能力，能变成人手里的选择',
    '工作是其中一条清晰的线索。',
    '另一条线索伸向工作之外。',
    '从这些探索，看向更远的构想',
    'Molis World 是沿着这个问题生出的构想。',
    '它们共同构成 Molis 正在发生的故事',
    '联创团队',
    // 旧版团队页的导语，把产品接到人
    '做这些产品的，是下面这群人。',
    '王一骏',
    '发起人',
    '前美团 · 字节 · 滴滴 · LinkedIn',
    '靳曲',
    '从同事，到共同创造的伙伴',
    '我们曾是美团的同事。',
    'Molis 则给了我们一个共同探索的空间',
    // 《黑客与画家》一屏的开头是负责人写的一句过渡（2026-10-22）；底稿 1.3 那句跟着四张手稿，书名在过渡句里说过了
    '我们希望带着《黑客与画家》里说的那种匠人精神去创造。',
    '没人细看的地方，也一样认真。',
    '达·芬奇《吉内薇拉·德·班琪》',
    // 典故：书里写到的就是这一幅（上面那句已有书名，这里只说「书里」）
    'Paul Graham 在书里写到这幅画',
    '1991 年修复时，人们在杜松和天空交界的地方，发现了达·芬奇的指纹。',
    '写代码、做设计、讲故事，都是同一种创造：先起稿，再一遍遍修改，直到经得起真实使用。',
    '产品设计',
    '写代码',
    '拍视频',
    '写故事',
    // 结尾一屏：两行邀请，「树下，总有空位」，一句话，四个横排的去处
    '我们做自己用着舒服的产品，',
    '也想遇见和我们口味相投的你。',
    '树下，总有空位',
    '我们的产品',
    '企业合作',
    '聊一聊',
    '社区',
  ]) {
    const next = text.indexOf(line, at);
    assert(next >= 0, `about one: 「${line}」 in order`);
    at = next;
  }
  // 只有王一骏写身份，其余人不写「联合创始人」
  assert.equal(count(one, /class="cr-founder"/g), 1, 'about one: one founder');
  assert(!text.includes('联合创始人'), 'about one: no co-founder labels');
  // 原句只出现一次
  for (const line of [
    '这些经历构成了我们的来路。',
    '我们想在产品里寻找这些答案。',
    '工作是其中一条清晰的线索。',
    '我们曾是美团的同事。',
  ])
    assert.equal(text.split(line).length - 1, 1, `about one: 「${line}」 once`);
  // 去处：沿途、两篇文章、正文里的 Work 与 Tool，最后四个：产品、企业合作、聊一聊、社区
  for (const href of [
    '/along-the-way',
    '/essays/human-scale',
    '/essays/idealism',
    '/work',
    '/tool',
    '/#products',
    '/enterprise',
    '/community',
    '/contact',
  ])
    assert(one.includes(`href="${href}"`), `about one: link ${href}`);
  // 文章与沿途是有标题和说明的卡片：只留圆形箭头，读屏名写清去处（E3）
  for (const label of ['读《人的尺度》', '看沿途'])
    assert(
      new RegExp(`class="m-go"[^>]*aria-label="${label}"`).test(one),
      `about one: card arrow ${label}`,
    );
  // Life、Story、World 先不开放（负责人 2026-10-18）：正文里不链，第一次说到的那段下面写「探索中，敬请期待」
  assert(
    !/class="m-inline" href="\/(life|story|world)"/.test(one),
    'about one: no inline links to products that are not open yet',
  );
  for (const name of ['Molis Life', 'Molis Story', 'Molis World'])
    assert(
      new RegExp(
        `${name}</span><span class="m-status"[^>]*>探索中，敬请期待`,
      ).test(one),
      `about one: ${name} is marked 探索中，敬请期待`,
    );
  // 不再是展厅：没有名牌、平面图、墙色与「下一个展厅」
  assert(!text.includes('展厅'), 'about one: no room names');
  // 《黑客与画家》：那句话就是这一屏的标题，书名在画面上只出现一次；画可以点着推近，右边四格
  assert.match(
    one,
    /<h2 class="mk-title" id="makers-title">/,
    'about one: the sentence is the heading',
  );
  assert.equal(
    text.split('《黑客与画家》').length - 1,
    1,
    'about one: book title once',
  );
  assert(
    /class="mk-paint"[^>]*aria-pressed="false"/.test(one),
    'about one: the painting zooms on click',
  );
  assert.equal(count(one, /class="mk-sheet"/g), 4, 'about one: four crafts');
  for (const layer of ['whole', 'near', 'edge'])
    assert(
      one.includes(`/site/ginevra-${layer}-`),
      `about one: painting layer ${layer}`,
    );
  // 上一版里《黑客与画家》两版对照照旧：?makers=trio 是原版三种媒介，带比较条
  {
    const trioPage = await html('/about?makers=trio');
    assert(
      trioPage.includes('ab-say-step'),
      'about makers=trio: the sentence drives the three windows',
    );
    assert(
      !trioPage.includes('class="hp-sheet"'),
      'about makers=trio: no zoom pair',
    );
    assert(!one.includes('ab-trio'), '/about: no old trio');
    for (const name of ['trio', 'painters'])
      assert(
        trioPage.includes(`href="/about?makers=${name}#makers"`),
        `about makers=trio: review link ${name}`,
      );
    assert(trioPage.includes('m-review-bar'), 'about makers: review bar');
  }
  // 「我们相信什么」一屏负责人 2026-10-22 删去（原句仍在 content/site/studio.ts）
  assert(
    !text.includes('有自己的判断，也有把它做成的本事。'),
    'about one: no beliefs screen',
  );
  // 第四版（负责人 2026-10-22）：摊开、一扇窗、绘图桌；人的那一厅（群像、一排肖像、来路）；结尾一张画
  for (const cls of [
    'class="sp"',
    'class="dy"',
    'class="wd"',
    'class="an-hall"',
    'class="cr-row"',
  ])
    assert(one.includes(cls), `about one: ${cls}`);
  assert.equal(count(one, /class="cr-pc"/g), 8, 'about one: eight portraits');
  // 摊开的就是沿途那些真实的尝试，留下的是并进 Work、Tool、Story 的那几件
  assert.equal(
    count(one, /class="sp-it"/g),
    count(await html('/along-the-way'), /class="al-row"/g),
    'about one: every try along the way is spread out',
  );
  assert(count(one, /data-keep="(work|tool|story)"/g) > 0, 'about one: kept');
  for (const name of ['boat', 'sun', 'house', 'seat'])
    assert(one.includes(`/site/art-${name}-`), `about one: team art ${name}`);
  assert(
    !one.includes('/site/film-s') && !one.includes('/site/lib-'),
    'about one: no film stills or library images',
  );
  // 八个人带锚点（旧地址 /team 跳到 #people，/community/yijun 跳到 #yijun）；故事三章的锚点照旧
  for (const id of [
    'people',
    'yijun',
    'jinqu',
    'makers',
    'origin',
    'change',
    'products',
    'further',
  ])
    assert(one.includes(`id="${id}"`), `about one: anchor #${id}`);
}

// 联系页：只有验收过的一版，不带评审控件，旧版对照已删（E1，负责人 2026-10-18）
for (const path of ['/contact', '/contact?study=current']) {
  const contact = await html(path);
  assert(!contact.includes('m-review-bar'), `${path}: no review switch`);
  assert(
    !contact.includes('选一个来意，写几句就好'),
    `${path}: old lead removed`,
  );
}

// 行动入口不用下划线文字：卡片里只留圆形箭头，读屏名写清去处（E3）
assert.match(
  await html('/community/methods'),
  /class="m-go"[^>]*aria-label="看方法：/,
);

console.log(
  'PASS: every page of the rebuilt site, one h1 each, header/footer, honest stages and labels, legacy redirects, 404 and private indexing.',
);
