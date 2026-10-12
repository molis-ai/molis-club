// Visual-interaction regression for the Folio review. Run against dev or the static preview.
// Use PLAYWRIGHT_MODULE / CHROMIUM_PATH for an existing browser installation.
import assert from 'node:assert/strict';
const { chromium } = await import(
  process.env.PLAYWRIGHT_MODULE || 'playwright'
);
const origin = process.env.TEST_ORIGIN || 'http://localhost:3000';
const folio = `${origin}/demos/brand/folio`;
const browser = await chromium.launch({
  ...(process.env.CHROMIUM_PATH
    ? { executablePath: process.env.CHROMIUM_PATH }
    : {}),
  args: ['--no-sandbox'],
});
const errors = [];
const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
page.on('pageerror', (error) => errors.push(String(error)));
const visit = async (suffix = '') => {
  const response = await page.goto(folio + suffix, {
    waitUntil: 'networkidle',
  });
  assert.equal(response.status(), 200, suffix);
};

try {
  await visit();
  assert.equal(
    await page
      .locator('.fh-showcase, .fh-product-selector, .fh-person-image')
      .count(),
    0,
  );
  assert.equal(await page.locator('.fo-sheet').count(), 3);
  // 首屏之后、Work 之前有一句工作室身份说明；Story 之后是 World 入口（概念设计，不是第四张色纸）；
  // 结尾从产品走到企业合作与社区，不再问「你正在好奇什么？」，没有登录和团队模块
  const homeOrder = await page
    .locator('.fo-studio, #fo-products-title, #story, #world, .fo-ending')
    .evaluateAll((nodes) =>
      nodes.map((node) => node.id || node.className.split(' ')[0]),
    );
  assert.deepEqual(homeOrder, [
    'fo-studio',
    'fo-products-title',
    'story',
    'world',
    'fo-ending',
  ]);
  assert.match(
    await page.locator('.fo-studio').innerText(),
    /Molis AI 是一个做 AI 产品的小团队/,
  );
  assert.match(await page.locator('#world').innerText(), /概念设计/);
  assert.equal(
    await page.locator('#world a[href="/demos/brand/folio/world"]').count(),
    1,
  );
  const endingText = await page.locator('.fo-ending').innerText();
  assert.doesNotMatch(endingText, /你正在好奇什么/);
  assert.match(endingText, /了解企业合作/);
  assert.match(endingText, /去社区看看/);
  assert.equal(
    await page
      .locator(
        '.fo-ending a[href="/demos/brand/folio/contact?topic=enterprise"]',
      )
      .count(),
    1,
  );
  assert.equal(await page.locator('.fo-ending a[href$="/login"]').count(), 0);
  assert.equal(await page.locator('.fo-person, .fo-people').count(), 0);
  const originalArt = page.locator('.fo-cover-art .fo-cut').first();
  assert.match(
    await originalArt.evaluate((el) => getComputedStyle(el).animationName),
    /fo-sway/,
  );
  // 首屏：刊头就是 h1，下面是一骏的 A/I 词组和一行关键词；不再有目录便笺和「一天」纸带
  assert.equal(
    await page.locator('h1.fo-masthead').getAttribute('aria-label'),
    'Molis AI',
  );
  assert.equal(await page.locator('.fo-cover-index, .fo-day').count(), 0);
  const rows = page.locator('.fo-cover .fo-ai-row');
  assert.equal(await rows.count(), 2);
  assert.match(await rows.first().innerText(), /^A/);
  assert.match(await rows.nth(1).innerText(), /^I/);
  assert.equal(
    (await page.locator('.fo-cover-keys').innerText()).replace(/\s/g, ''),
    '好奇创造人的尺度',
  );
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForFunction(() =>
    Array.from(document.querySelectorAll('.fo-ai-letter')).some(
      (el) => getComputedStyle(el).opacity === '1',
    ),
  );
  const words = page.locator('.fo-ai-words');
  await words.click();
  assert.equal(await words.getAttribute('aria-pressed'), 'true');
  await words.click();
  assert.equal(await words.getAttribute('aria-pressed'), 'false');
  // 首页只保留产品，团队与文章通过导航进入独立页面。
  const order = await page
    .locator('#products, #about, #essays')
    .evaluateAll((nodes) => nodes.map((node) => node.id));
  assert.deepEqual(order, ['products']);
  assert.equal(await page.locator('.fo-person, .fo-essay').count(), 0);
  assert.equal(
    await page
      .locator('.fo-label h2 [lang="en"]')
      .allInnerTexts()
      .then((t) => t.join(' ')),
    'Products',
  );
  assert.equal(
    await page.locator('.fo-header-end a').first().getAttribute('href'),
    '/demos/brand/folio/login',
  );
  console.log(
    'PASS: original cover animation, A/I phrase cycle, three product sheets; team and essays no longer appear on the home page.',
  );

  await page.locator('.fo-nav a', { hasText: '团队' }).click();
  await page.waitForURL(folio + '/about');
  assert.match(await page.locator('h1').innerText(), /Team/);
  const members = page.locator('.fo-person');
  assert.equal(await members.count(), 9);
  assert.deepEqual(await members.locator('.ftm-person-name').allInnerTexts(), [
    '王一骏',
    '赵壮实',
    '尹凯',
    '杨鹏飞',
    '庄昊哲',
    '徐晶',
    '谢俊',
    '隋欣怡',
    '靳曲',
  ]);
  for (const name of ['尹凯', '杨鹏飞', '徐晶']) {
    const member = members.filter({
      has: page.getByRole('heading', { name, exact: true }),
    });
    assert.equal(await member.locator('.ftm-bio-placeholder').count(), 1);
    assert.equal(await member.locator('.fo-person-note').count(), 0);
  }
  assert.match(await members.first().innerText(), /系统架构、产品与技术管理/);
  assert.match(await members.nth(1).innerText(), /AI 数据产品与复杂业务设计/);
  await members.first().scrollIntoViewIfNeeded();
  const photo = members.first().locator('.fo-person-photo');
  const note = members.first().locator('.fo-person-note');
  await photo.hover();
  await page.waitForTimeout(650);
  assert.equal(await note.evaluate((el) => getComputedStyle(el).opacity), '1');
  assert.equal(
    await photo
      .locator('img')
      .evaluate((el) => getComputedStyle(el).borderRadius),
    '50%',
  );
  await photo.click();
  await page.mouse.move(10, 100);
  assert.equal(await photo.getAttribute('aria-expanded'), 'true');
  await page.keyboard.press('Escape');
  assert.equal(await photo.getAttribute('aria-expanded'), 'false');
  await page.waitForTimeout(650);
  assert.equal(
    await note.evaluate((el) => getComputedStyle(el).visibility),
    'hidden',
  );
  await page.locator('.fo-nav a').first().focus();
  await photo.focus();
  await page.waitForTimeout(650);
  assert.equal(
    await note.evaluate((el) => getComputedStyle(el).visibility),
    'visible',
  );
  await page.locator('.fo-nav a', { hasText: '文章' }).click();
  await page.waitForURL(folio + '/essays');
  assert.match(await page.locator('h1').innerText(), /Essays/);
  const essays = await page
    .locator('.fo-essay-link')
    .evaluateAll((links) => links.map((link) => link.getAttribute('href')));
  assert.deepEqual(essays, [
    '/demos/brand/folio/essays/human-scale',
    '/demos/brand/folio/essays/idealism',
  ]);
  // 作者名单独链到公众号，新窗口打开；整行仍由标题链接铺满，不嵌套链接
  const wechat = /^https:\/\/mp\.weixin\.qq\.com\/mp\/profile_ext\?/;
  const authors = page.locator('.fo-essay-author');
  assert.equal(await authors.count(), 2);
  for (const author of await authors.all()) {
    assert.match(await author.getAttribute('href'), wechat);
    assert.equal(await author.getAttribute('target'), '_blank');
    assert.equal(await author.getAttribute('rel'), 'noreferrer');
  }
  assert.equal(await page.locator('a a').count(), 0);
  console.log(
    'PASS: independent team and essays pages preserve content, member interactions and article links.',
  );

  await visit('/essays/idealism');
  assert.match(await page.locator('h1').innerText(), /落地主义/);
  assert.equal(await page.locator('.fo-read-toc a').count(), 7);
  assert.equal(await page.locator('.fo-read-body ol li').count(), 8);
  assert.equal(await page.locator('.fo-read-body em').count(), 2);
  assert.match(
    await page.locator('.fo-read-next-link').getAttribute('href'),
    /\/essays\/human-scale$/,
  );
  assert.match(
    await page.locator('.fo-read-author').getAttribute('href'),
    wechat,
  );
  assert.equal(
    await page.locator('.fo-read-author').getAttribute('target'),
    '_blank',
  );
  const more = page.locator('.fo-read-links a', { hasText: '去公众号读更多' });
  assert.match(await more.getAttribute('href'), wechat);
  assert.equal(await more.getAttribute('target'), '_blank');
  // 读完能去看产品、认识团队（P7 可先做：只加链接）
  assert.deepEqual(
    await page
      .locator('.fo-read-links a')
      .evaluateAll((links) => links.map((link) => link.getAttribute('href'))),
    [
      '/demos/brand/folio#products',
      '/demos/brand/folio/about',
      await more.getAttribute('href'),
      '/demos/brand/folio',
    ],
  );
  console.log(
    'PASS: essay reader with contents, references, next essay, product and team links, and the author account link.',
  );

  // 登录留在 Folio 里：同一个顶栏，Logo 回到 Folio 首页，表单换成 Folio 的样子
  await visit('/login');
  assert.equal(
    await page.locator('.fo-logo').getAttribute('href'),
    '/demos/brand/folio',
  );
  assert.equal(await page.locator('.fa-panel form').count(), 1);
  assert.equal(
    await page
      .locator('.fa-panel .field input')
      .first()
      .evaluate((el) => getComputedStyle(el).borderBottomWidth),
    '2px',
  );
  await page.locator('.auth-switch button').click();
  assert.equal(
    await page.locator('.fa-panel .consent a').getAttribute('href'),
    '/demos/brand/folio/contact#privacy',
  );
  console.log(
    'PASS: Folio login keeps the Folio header, home link and form style.',
  );

  // 产品页读到底可以接着看下一件；不存在的地址留在 Folio 自己的 404
  const nextOf = {
    '/work': 'tool',
    '/tool': 'life',
    '/life': 'story',
    '/story': 'world',
    '/world': 'work',
  };
  for (const [route, next] of Object.entries(nextOf)) {
    await visit(route);
    assert.equal(
      await page.locator('.fo-next').getAttribute('href'),
      `/demos/brand/folio/${next}`,
      route,
    );
  }
  const missing = await page.goto(folio + '/no-such-page', {
    waitUntil: 'networkidle',
  });
  assert.equal(missing.status(), 404);
  assert.equal(await page.locator('.fo-site .fm-missing').count(), 1);
  assert.equal(
    await page.locator('.fo-logo').getAttribute('href'),
    '/demos/brand/folio',
  );
  console.log(
    'PASS: product pages lead to the next product; unknown addresses stay on the Folio 404.',
  );

  // Molis World 是概念：状态签写「概念设计」，示例旅程标示意，没有下载、试用、注册入口；
  // 「关注进展」预选早期体验者并预填内容；下拉、页尾都能到达
  await visit('/world');
  assert.match(await page.locator('h1').innerText(), /慢慢长大的世界/);
  assert.match(
    await page.locator('.fo-hero .fo-status').innerText(),
    /概念设计/,
  );
  assert.equal(await page.locator('.fwd-steps > li').count(), 6);
  assert.match(await page.locator('#journey').innerText(), /概念示意/);
  assert.doesNotMatch(
    await page.locator('main').innerText(),
    /立即下载|下载 Molis World|试用|注册|立即体验|已经打通|已打通/,
  );
  assert.equal(
    await page.locator('main a[download], main a[href*="login"]').count(),
    0,
  );
  assert.equal(
    await page
      .locator('.fo-menu-panel a[href="/demos/brand/folio/world"]')
      .count(),
    1,
  );
  assert.equal(
    await page.locator('footer a[href="/demos/brand/folio/world"]').count(),
    1,
  );
  await page.locator('.fo-hero .fo-btn', { hasText: '关注进展' }).click();
  await page.waitForURL(folio + '/contact?topic=world');
  assert.equal(
    await page.locator('input[name="role"]:checked').inputValue(),
    '早期体验者',
  );
  assert.equal(
    await page.locator('textarea[name="idea"]').inputValue(),
    '想关注 Molis World 的进展。',
  );
  console.log(
    'PASS: Molis World concept page with status, sample journey, no product entry points, and the follow-up preselect.',
  );

  // Molis Life（A3）：首屏讲懂你、陪你的 Agent，状态签不变；三件事切换着看，每步标示意；
  // 超出原型的能力标规划中；能到 Story 与 World；路线图各一行
  await visit('/life');
  assert.match(await page.locator('h1').innerText(), /懂你.*陪你/s);
  assert.deepEqual(
    await page.locator('.fo-hero .fo-status li').allInnerTexts(),
    ['原型探索', '还不能下载', '页面里的例子都是示意'],
  );
  const lifeTabs = page.locator('.fl-tabs [role="tab"]');
  assert.equal(await lifeTabs.count(), 3);
  assert.match(await page.locator('.fl-story blockquote').innerText(), /退/);
  await lifeTabs.nth(1).click();
  assert.match(await page.locator('.fl-story blockquote').innerText(), /看海/);
  await page.keyboard.press('ArrowRight');
  assert.equal(await lifeTabs.nth(2).getAttribute('aria-selected'), 'true');
  assert.equal(
    await page.locator('.fl-steps li .fo-tag').count(),
    await page.locator('.fl-steps li').count(),
  );
  assert.match(await page.locator('.fl-now').innerText(), /规划中/);
  assert.equal(
    await page.locator('main a[href="/demos/brand/folio/story"]').count(),
    1,
  );
  assert.equal(
    await page.locator('main a[href="/demos/brand/folio/world"]').count(),
    1,
  );
  assert.equal(await page.locator('.fl-roadmap li').count(), 4);
  assert.doesNotMatch(
    await page.locator('main').innerText(),
    /同一套插件思路|硬件与个人 Agent/,
  );
  console.log(
    'PASS: Molis Life as a caring personal Agent with sample walkthroughs, planned capabilities marked, and links to Story and World.',
  );

  // Molis Story（A4）：不再出现「不是游戏」；导语带上 Agent；四个世界卡片原样，各自说明怎么玩；
  // 「和谁一起去」「自己做一个世界」标规划中；归来可以去 World
  await visit('/story');
  const storyText = await page.locator('main').innerText();
  assert.doesNotMatch(storyText, /不是游戏/);
  assert.match(await page.locator('.fo-hero').innerText(), /带上你的 Agent/);
  assert.deepEqual(
    await page.locator('.fo-hero .fo-status li').allInnerTexts(),
    ['开发中', 'macOS', '还不能下载'],
  );
  assert.equal(await page.locator('.fs-world').count(), 4);
  assert.equal(await page.locator('.fs-world-play').count(), 4);
  assert.deepEqual(await page.locator('.fs-world blockquote').allInnerTexts(), [
    '另一端，也有谁在试着理解你。',
    '把一个一直留在心里的如果，认真走完一次，然后回到这里。',
    '把一段经历里的照片与文字，变成可以走近、探索和重访的私人展览。',
    '有些东西，在被弄丢之前，就先送到了这里。',
  ]);
  assert.match(
    await page.locator('#fs-company-title').locator('..').innerText(),
    /规划中/,
  );
  assert.match(
    await page.locator('#fs-create-title').locator('..').innerText(),
    /规划中/,
  );
  assert.equal(
    await page
      .locator('.fs-after-return a[href="/demos/brand/folio/world"]')
      .count(),
    1,
  );
  assert.equal(
    await page.locator('.fs-create a[href="/demos/community#share"]').count(),
    1,
  );
  console.log(
    'PASS: Molis Story keeps its four worlds, says how each is played, marks Agent company and world-making as planned, and returns to World.',
  );

  // 方法（原百科）并进社区：默认六张精选（三位艺术家 + 三个示例），「查看全部」原处展开，
  // 24 个组件来源默认收起；搜索与分类会收窄；详情在社区下，旧的百科地址都跳过去。
  const community = `${origin}/demos/community`;
  await page.goto(community, { waitUntil: 'networkidle' });
  const methods = page.locator('#methods');
  assert.equal(await methods.locator('.fcm-m-card').count(), 6);
  assert.equal(
    await methods.locator('.fcm-m-card[data-kind="artist"]').count(),
    3,
  );
  assert.equal(await methods.locator('.fcm-m-card .fw-demo').count(), 3);
  assert.equal(await methods.locator('.fw-row').count(), 24);
  assert.equal(
    await methods.locator('.fcm-m-resources').getAttribute('open'),
    null,
  );
  await methods.getByRole('button', { name: '查看全部方法' }).click();
  assert.equal(await methods.locator('.fcm-m-card').count(), 10);
  await methods.locator('.fw-search input').fill('toast');
  const found = Number(
    (await methods.locator('.fw-count').innerText()).match(/^\d+/)[0],
  );
  assert.ok(found > 0 && found < 24, `toast matched ${found}`);
  assert.equal(
    (await methods.locator('.fw-row').count()) +
      (await methods.locator('.fcm-m-card').count()),
    found,
  );
  await methods.locator('.fw-search input').fill('');
  await methods
    .locator('.fw-filters button', { hasText: '网页与动效' })
    .click();
  assert.equal(await methods.locator('.fcm-m-card').count(), 6);
  assert.equal(await methods.locator('.fw-row').count(), 0);
  await methods
    .locator('.fw-filters button', { hasText: '艺术家 Skill' })
    .click();
  assert.equal(await methods.locator('.fcm-m-card').count(), 4);
  assert.equal(
    await methods
      .locator('.fcm-m-card a[download]')
      .first()
      .getAttribute('href'),
    '/downloads/artists/monet-impressionism.zip',
  );
  await page.goto(`${community}/methods/stagger`, { waitUntil: 'networkidle' });
  assert.match(await page.locator('h1').innerText(), /错落入场/);
  assert.match(await page.locator('.fw-trail').innerText(), /社区\s*\/\s*方法/);
  assert.equal(await page.locator('.fcm-header').count(), 1);
  const promptBefore = await page.locator('#fw-prompt').inputValue();
  await page.locator('.fw-duration input').fill('1000');
  assert.notEqual(await page.locator('#fw-prompt').inputValue(), promptBefore);
  assert.match(await page.locator('#fw-prompt').inputValue(), /1000ms/);
  await page.goto(`${community}/methods/artists/monet-impressionism`, {
    waitUntil: 'networkidle',
  });
  assert.equal(
    await page.locator('a[download]').getAttribute('href'),
    '/downloads/artists/monet-impressionism.zip',
  );
  assert.equal(await page.locator('.fw-related li').count(), 3);
  for (const [from, to] of [
    ['/wiki', '/demos/community#methods'],
    ['/wiki/artists', '/demos/community#methods'],
    ['/wiki/stagger', '/demos/community/methods/stagger'],
    [
      '/wiki/artists/monet-impressionism',
      '/demos/community/methods/artists/monet-impressionism',
    ],
  ]) {
    await page.goto(folio + from, { waitUntil: 'networkidle' });
    assert.equal(page.url(), origin + to, from);
  }
  for (const missing of [
    '/wiki/no-such-entry',
    '/wiki/artists/no-such-artist',
  ]) {
    const response = await page.goto(folio + missing, {
      waitUntil: 'networkidle',
    });
    assert.equal(response.status(), 404, missing);
  }
  console.log(
    'PASS: community methods with six picks, expand in place, folded sources, search and filters; method details under the community; old wiki addresses redirect.',
  );

  const running = (selector) =>
    page.locator(selector).getAttribute('data-running');
  await visit('/tool');
  // DropAgent、niul.ai 的入口先去社区试一试（P4 可先做），独立版的 GitHub 链接保留
  assert.equal(
    await page
      .locator('.fo-hero a', { hasText: '先在社区试试' })
      .getAttribute('href'),
    '/demos/community#try',
  );
  assert.equal(
    await page
      .locator('.fo-closing a', { hasText: '先在社区试试' })
      .getAttribute('href'),
    '/demos/community#try',
  );
  assert.deepEqual(
    await page
      .locator('.ft-available a')
      .evaluateAll((links) => links.map((link) => link.getAttribute('href'))),
    [
      'https://github.com/molis-ai/DropAgent',
      'https://github.com/molis-ai/niul.ai',
      '/demos/community#try',
    ],
  );
  const mark = page.locator('.ft-hero .ft-page mark');
  assert.match(
    await mark.evaluate((el) => getComputedStyle(el).animationName),
    /ft-select/,
  );
  assert.match(
    await page
      .locator('.ft-hero .ft-cursor-click')
      .evaluate((el) => getComputedStyle(el).animationName),
    /ft-cursor-click/,
  );
  assert.equal(await page.locator('.ftl-panel').count(), 3);
  assert.equal(await page.locator('.ft-moment-grid > li').count(), 6);
  assert.equal(await page.locator('.ftp-surface').count(), 4);
  assert.equal(await page.locator('.fd-player, .fd-steps').count(), 0);
  const layers = page.locator('.ftl');
  await layers.scrollIntoViewIfNeeded();
  await page.waitForTimeout(300);
  assert.equal(await running('.ftl'), 'true');
  await layers.getByRole('button', { name: '暂停演示', exact: true }).click();
  assert.equal(await running('.ftl'), 'false');
  await layers
    .getByRole('button', { name: '继续播放演示', exact: true })
    .click();
  assert.equal(await running('.ftl'), 'true');
  await page.locator('footer').scrollIntoViewIfNeeded();
  await page.waitForTimeout(300);
  assert.equal(await running('.ftl'), 'false');
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await visit('/tool');
  for (const selector of [
    '.ftl-near-result',
    '.ftl-card',
    '.ftl-back',
    '.ftp-surface .ftp-new',
    '.ftp-out-b',
  ]) {
    assert.equal(
      await page
        .locator(selector)
        .first()
        .evaluate((el) => getComputedStyle(el).opacity),
      '1',
      selector,
    );
  }
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  console.log(
    'PASS: original Tool hero motion; layer relay, six moments and plugin stage play in view, pause, stop offscreen and rest on results with reduced motion.',
  );

  await visit('/work');
  assert.equal(await page.locator('.fw-hero .fw-desk').count(), 1);
  assert.equal(await page.locator('.fw-flow li').count(), 5);
  assert.equal(
    await page.locator('.fws-compose, .fws-relay, .fws-control').count(),
    3,
  );
  // 功能全景收进「现在能用什么」的三栏；更多场景只标已发布和预览两种例外
  assert.equal(
    await page.locator('.fw-features, .fw-feature-groups').count(),
    0,
  );
  assert.equal(await page.locator('.fw-access-cards article').count(), 3);
  assert.equal(
    await page.locator('.fw-more-cards .fw-phase[data-phase="next"]').count(),
    0,
  );
  assert.equal(
    await page.locator('.wd-dock, .wd-surface, .fd-window-bar').count(),
    0,
  );
  assert.match(await page.locator('main').innerText(), /到处有 AI/);
  await visit('/solutions');
  assert.equal(await page.locator('.fd-player').count(), 0);
  assert.equal(await page.locator('.fs-service').count(), 4);
  assert.equal(await page.locator('.fs-service-result').count(), 4);
  const sectionOrder = await page
    .locator('#cooperation, #directions, #people, #fs-closing-title')
    .evaluateAll((nodes) => nodes.map((node) => node.id));
  assert.deepEqual(sectionOrder, [
    'cooperation',
    'directions',
    'people',
    'fs-closing-title',
  ]);
  // 做这件事的人：四步各对应成员经历，只写姓名与过去的经历，末尾去团队页；结尾不再放「认识团队」
  assert.equal(await page.locator('.fs-evidence > li').count(), 4);
  assert.deepEqual(
    new Set(await page.locator('.fs-evidence ul strong').allInnerTexts()),
    new Set(['王一骏', '谢俊', '赵壮实', '隋欣怡']),
  );
  assert.match(
    await page.locator('#people').innerText(),
    /还没有可以公开的案例/,
  );
  assert.equal(
    await page.locator('#people a[href="/demos/brand/folio/about"]').count(),
    1,
  );
  assert.equal(
    await page
      .locator('.fo-closing a[href="/demos/brand/folio/about"]')
      .count(),
    0,
  );
  assert.doesNotMatch(
    await page.locator('main').innerText(),
    /已在两个固定真实服务|客户 logo|100\+/,
  );
  console.log(
    'PASS: Work hero, workflow strip, three scene demos and feature groups; business cooperation services, member evidence, outcomes and section order.',
  );

  for (const width of [1440, 1024, 768, 390, 360]) {
    await page.setViewportSize({ width, height: 900 });
    for (const route of [
      '',
      '/tool',
      '/work',
      '/solutions',
      '/life',
      '/story',
      '/world',
      '/about',
      '/essays',
      '/essays/human-scale',
      '/essays/idealism',
      '/login',
      '/account',
    ]) {
      await visit(route);
      assert.equal(await page.locator('h1').count(), 1, `${route} @ ${width}`);
      if (route === '/about' || route === '/essays') {
        const heading = await page.locator('h1').boundingBox();
        const header = await page.locator('.fo-header').boundingBox();
        assert.ok(
          heading.y >= header.y + header.height - 1,
          `${route} title hidden by navigation @ ${width}`,
        );
      }
      assert.equal(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
        true,
        `${route} horizontal overflow @ ${width}`,
      );
      const community = page.locator('.fo-nav a').filter({ hasText: '社区' });
      assert.equal(
        new URL(await community.getAttribute('href'), origin).origin,
        origin,
      );
      assert.match(await community.getAttribute('href'), /\/demos\/community/);
      assert.equal(
        await page
          .locator('img')
          .evaluateAll(
            (imgs) =>
              imgs.filter((img) => img.complete && !img.naturalWidth).length,
          ),
        0,
      );
    }
  }
  // 社区与方法详情：五种宽度下一个 h1、无横向溢出、图片都加载；社区页五段，团队只留一行入口
  for (const width of [1440, 1024, 768, 390, 360]) {
    await page.setViewportSize({ width, height: 900 });
    for (const route of [
      '/demos/community/',
      '/demos/community/methods/sticky',
      '/demos/community/methods/animata',
      '/demos/community/methods/artists/art-style-skill-builder',
    ]) {
      const response = await page.goto(origin + route, {
        waitUntil: 'networkidle',
      });
      assert.equal(response.status(), 200, route);
      assert.equal(await page.locator('h1').count(), 1, `${route} @ ${width}`);
      assert.equal(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
        true,
        `${route} horizontal overflow @ ${width}`,
      );
      assert.equal(
        await page
          .locator('img')
          .evaluateAll(
            (imgs) =>
              imgs.filter((img) => img.complete && !img.naturalWidth).length,
          ),
        0,
      );
      assert.equal(
        await page.locator('a[href^="/wiki"], a[href*="/folio/wiki"]').count(),
        0,
      );
    }
  }
  await page.goto(origin + '/demos/community/', { waitUntil: 'networkidle' });
  assert.deepEqual(
    await page
      .locator('main > section[id]')
      .evaluateAll((nodes) => nodes.map((node) => node.id)),
    ['try', 'methods', 'share', 'improve'],
  );
  assert.equal(
    await page.locator('.fcm-people-line a').getAttribute('href'),
    '/demos/brand/folio/about',
  );
  assert.equal(await page.locator('.fcm-showcase-empty').count(), 1);
  assert.equal(errors.length, 0, errors.join('\n'));
  console.log(
    'PASS: Folio pages at five viewport widths, visible page titles, community links, images and no browser runtime errors.',
  );
} finally {
  await browser.close();
}
