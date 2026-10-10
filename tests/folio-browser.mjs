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
    .locator('.fo-essay')
    .evaluateAll((links) => links.map((link) => link.getAttribute('href')));
  assert.deepEqual(essays, [
    '/demos/brand/folio/essays/human-scale',
    '/demos/brand/folio/essays/idealism',
  ]);
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
  console.log('PASS: essay reader with contents, references and next essay.');

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
    '/story': 'work',
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

  // 百科：三张艺术家试样加构建入口，六个可以动手的示例，24 个组件来源；搜索会收窄目录
  await visit('/wiki');
  assert.equal(await page.locator('.fw-gallery li').count(), 3);
  assert.equal(await page.locator('.fw-builder').count(), 1);
  assert.equal(await page.locator('.fw-entry .fw-demo').count(), 6);
  assert.equal(await page.locator('.fw-row').count(), 24);
  await page.locator('.fw-search input').fill('toast');
  const found = Number(
    (await page.locator('.fw-count').innerText()).match(/^\d+/)[0],
  );
  assert.ok(found > 0 && found < 24, `toast matched ${found}`);
  assert.equal(
    (await page.locator('.fw-row').count()) +
      (await page.locator('.fw-entry').count()),
    found,
  );
  await page.locator('.fw-search input').fill('');
  await page.locator('.fw-filters button', { hasText: '网页词典' }).click();
  assert.equal(await page.locator('.fw-entry').count(), 3);
  assert.equal(await page.locator('.fw-row').count(), 0);
  await visit('/wiki/stagger');
  assert.match(await page.locator('h1').innerText(), /错落入场/);
  const promptBefore = await page.locator('#fw-prompt').inputValue();
  await page.locator('.fw-duration input').fill('1000');
  assert.notEqual(await page.locator('#fw-prompt').inputValue(), promptBefore);
  assert.match(await page.locator('#fw-prompt').inputValue(), /1000ms/);
  await visit('/wiki/artists/monet-impressionism');
  assert.equal(
    await page.locator('a[download]').getAttribute('href'),
    '/downloads/artists/monet-impressionism.zip',
  );
  assert.equal(await page.locator('.fw-related li').count(), 3);
  const legacy = await page.goto(folio + '/wiki/no-such-entry', {
    waitUntil: 'networkidle',
  });
  assert.equal(legacy.status(), 404);
  console.log(
    'PASS: Folio wiki with artists, six live examples, searchable resources, entry lab and artist downloads.',
  );

  const running = (selector) =>
    page.locator(selector).getAttribute('data-running');
  await visit('/tool');
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
    .locator('#cooperation, #directions, #fs-closing-title')
    .evaluateAll((nodes) => nodes.map((node) => node.id));
  assert.deepEqual(sectionOrder, [
    'cooperation',
    'directions',
    'fs-closing-title',
  ]);
  console.log(
    'PASS: Work hero, workflow strip, three scene demos and feature groups; business cooperation services, outcomes and section order.',
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
      '/about',
      '/essays',
      '/essays/human-scale',
      '/essays/idealism',
      '/login',
      '/account',
      '/wiki',
      '/wiki/sticky',
      '/wiki/animata',
      '/wiki/artists/art-style-skill-builder',
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
  await page.goto(origin + '/demos/community/', { waitUntil: 'networkidle' });
  assert.equal(await page.locator('h1').count(), 1);
  assert.deepEqual(
    await page
      .locator('.fcm-essay')
      .evaluateAll((links) => links.map((link) => link.getAttribute('href'))),
    [
      '/demos/brand/folio/essays/human-scale',
      '/demos/brand/folio/essays/idealism',
    ],
  );
  assert.equal(await page.locator('a[href^="/wiki"]').count(), 0);
  assert.equal(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
    true,
  );
  assert.equal(errors.length, 0, errors.join('\n'));
  console.log(
    'PASS: Folio pages at five viewport widths, visible page titles, community links, images and no browser runtime errors.',
  );
} finally {
  await browser.close();
}
