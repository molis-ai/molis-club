// Real browser navigation and resource downloads. Form responses are intercepted
// only in the failure/retry cases below; they do not prove backend persistence.
// TEST_ORIGIN and PLAYWRIGHT_MODULE follow tests/folio-browser.mjs.
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const { chromium } = await import(
  process.env.PLAYWRIGHT_MODULE || 'playwright'
);
const origin = process.env.TEST_ORIGIN || 'http://localhost:3000';
const home = '/demos/brand/folio';
const browser = await chromium.launch(
  process.env.CHROMIUM_PATH
    ? { executablePath: process.env.CHROMIUM_PATH }
    : {},
);
const context = await browser.newContext({
  viewport: { width: 390, height: 844 },
  permissions: ['clipboard-read', 'clipboard-write'],
});
const page = await context.newPage();
const errors = [];
page.on('pageerror', (error) => errors.push(String(error)));
const visit = (path) => page.goto(origin + path, { waitUntil: 'networkidle' });
const clickTo = async (link, path) => {
  await link.click();
  await page.waitForURL(origin + path);
};

try {
  for (const width of [1440, 390]) {
    await page.setViewportSize({ width, height: 900 });
    await visit(home);
    // The homepage ending no longer offers login; the header entry stays.
    assert.equal(
      await page.locator(`.fo-ending a[href="${home}/login"]`).count(),
      0,
    );
    assert.equal(
      await page.locator(`.fo-header a[href="${home}/login"]`).count(),
      1,
    );
    // Confirm hydration before testing Link, so a plain document navigation
    // cannot hide a client-router failure.
    await page.locator('.fo-menu > button').click();
    assert.equal(
      await page.locator('.fo-menu > button').getAttribute('aria-expanded'),
      'true',
    );
    await page.keyboard.press('Escape');
    const documentStart = await page.evaluate(() => performance.timeOrigin);
    await clickTo(page.locator('.fo-nav-login'), home + '/login');
    await page
      .getByRole('heading', { name: '欢迎回来。', exact: true })
      .waitFor();
    assert.equal(
      await page.evaluate(() => performance.timeOrigin),
      documentStart,
    );
    await page.getByRole('button', { name: '注册一个', exact: true }).click();
    await page
      .getByRole('heading', { name: '很高兴认识你。', exact: true })
      .waitFor();
    await page.getByRole('button', { name: '去登录', exact: true }).click();
    await page
      .getByRole('heading', { name: '欢迎回来。', exact: true })
      .waitFor();
    await clickTo(page.locator('.fo-logo'), home);
    assert.equal(
      await page.evaluate(() => performance.timeOrigin),
      documentStart,
    );
    await page.goBack();
    await page.waitForURL(origin + home + '/login');
    await page
      .getByRole('heading', { name: '欢迎回来。', exact: true })
      .waitFor();
    await page.goForward();
    await page.waitForURL(origin + home);
  }
  console.log(
    'PASS: hydrated desktop/mobile login navigation, form mode changes and back/forward without document reloads.',
  );

  await visit(home);
  const menu = page.locator('.fo-menu > button');
  await menu.click();
  assert.equal(await menu.getAttribute('aria-expanded'), 'true');
  await page.keyboard.press('Escape');
  assert.equal(await menu.getAttribute('aria-expanded'), 'false');
  assert.equal(
    await menu.evaluate((el) => document.activeElement === el),
    true,
  );
  await menu.click();
  await clickTo(
    page.locator(`.fo-menu-panel a[href="${home}/work"]`),
    home + '/work',
  );
  await clickTo(
    page.locator('.fo-nav a', { hasText: '文章' }),
    home + '/essays',
  );
  await page.waitForFunction(() => {
    const section = document
      .querySelector('#fo-essays-title')
      .getBoundingClientRect();
    const header = document.querySelector('.fo-header').getBoundingClientRect();
    return section.top >= header.bottom - 1 && section.top < innerHeight;
  });
  await clickTo(
    page.locator('.fo-essay').first(),
    home + '/essays/human-scale',
  );
  const chapter = page.locator('.fo-read-toc a').nth(1);
  const chapterId = (await chapter.getAttribute('href')).slice(1);
  await chapter.click();
  await page.waitForFunction((id) => {
    const title = document.getElementById(id).getBoundingClientRect();
    const header = document.querySelector('.fo-header').getBoundingClientRect();
    return title.top >= header.bottom - 1 && title.top < innerHeight;
  }, chapterId);
  await page.goBack(); // chapter anchor
  await page.goBack(); // essay
  await page.waitForURL(origin + home + '/essays');
  await clickTo(page.locator(`footer a[href="${home}/wiki"]`), home + '/wiki');
  await page.locator('.fw-search input').fill('no-such-method-s02');
  await page.locator('.fw-empty').waitFor({ state: 'visible' });
  await page.locator('.fw-empty button').click();
  assert.equal(await page.locator('.fw-search input').inputValue(), '');
  await clickTo(
    page.locator(`a[href="${home}/wiki/stagger"]`).first(),
    home + '/wiki/stagger',
  );
  await page.locator('.fw-duration input').fill('1000');
  const prompt = await page.locator('#fw-prompt').inputValue();
  assert.match(prompt, /1000ms/);
  await page.getByRole('button', { name: /复制/ }).click();
  assert.equal(
    await page.evaluate(() => navigator.clipboard.readText()),
    prompt,
  );
  await clickTo(
    page.locator('.fo-nav a', { hasText: '社区' }),
    '/demos/community',
  );
  await page.locator('.fcm-hero-actions .fo-btn').click();
  await page.waitForURL(origin + '/demos/community#works');
  await page.locator('#fcm-bloom').fill('25');
  assert.match(await page.locator('#fcm-flower-title').textContent(), /25%/);
  await page.getByRole('button', { name: '朱红', exact: true }).click();
  assert.match(await page.locator('#fcm-flower-title').textContent(), /朱红/);
  const svgDownload = page.waitForEvent('download');
  await page.getByRole('button', { name: '下载这朵花', exact: true }).click();
  const svg = await readFile(await (await svgDownload).path(), 'utf8');
  assert.equal((svg.match(/<ellipse\b/g) || []).length, 24);
  assert.match(svg, /25%/);
  assert.match(svg, /#bd432b/);
  const copy = page
    .locator('.fcm-method-card')
    .first()
    .getByRole('button', { name: '复制提示词' });
  await copy.click();
  await page.waitForFunction(() =>
    document
      .querySelector('#stagger-prompt-status')
      .textContent.includes('已复制'),
  );
  assert.match(
    await page.locator('#stagger-prompt-status').textContent(),
    /已复制/,
  );
  assert.match(
    await page.evaluate(() => navigator.clipboard.readText()),
    /错落|stagger/,
  );
  const skillDownload = page.waitForEvent('download');
  await page.locator('.fcm-method-card a[download]').click();
  const zip = await readFile(await (await skillDownload).path());
  assert.equal(zip.subarray(0, 2).toString(), 'PK');
  assert.ok(zip.length > 500);
  console.log(
    'PASS: mobile home → Work → essays/back → wiki/search/copy → community/SVG and Skill downloads.',
  );

  await clickTo(
    page.locator(`.fcm-join-grid a[href="${home}/contact?topic=feedback"]`),
    home + '/contact?topic=feedback',
  );
  assert.equal(
    await page.locator('input[name="role"]:checked').inputValue(),
    '早期体验者',
  );
  assert.equal(await page.locator('textarea[name="idea"]').inputValue(), '');
  let submissions = 0;
  await page.route('**/api/join', (route) => {
    submissions++;
    return route.fulfill({
      status: submissions === 1 ? 503 : submissions === 2 ? 200 : 201,
      contentType: submissions === 1 ? 'text/html' : 'application/json',
      body:
        submissions === 1
          ? '<h1>Unavailable</h1>'
          : submissions === 2
            ? '{}'
            : '{"status":"received"}',
    });
  });
  await page.locator('.fc-submit').click();
  assert.equal(submissions, 0, 'native required fields block empty submission');
  await page.locator('input[name="name"]').fill('S02 浏览器检查');
  await page.locator('input[name="email"]').fill('folio-ui@example.test');
  await page
    .locator('textarea[name="idea"]')
    .fill('检查失败后填写内容仍在，随后可以重试。');
  await page.locator('input[name="consent"]').check();
  for (let attempt = 0; attempt < 2; attempt++) {
    await page.locator('.fc-submit').click();
    await page.waitForFunction(() =>
      document
        .querySelector('.fc-error')
        .textContent.includes('这次没能发出去'),
    );
    assert.equal(await page.locator('.fc-success').count(), 0);
    assert.match(
      await page.locator('textarea[name="idea"]').inputValue(),
      /填写内容仍在/,
    );
    assert.equal(await page.locator('.fc-submit').isEnabled(), true);
  }
  await page.locator('.fc-submit').click();
  await page.locator('.fc-success').waitFor({ state: 'visible' });
  assert.equal(submissions, 3);
  await clickTo(page.locator('.fc-success a').first(), home);
  console.log(
    'PASS: contact validation, HTML 503 and invalid 200 preserve input; explicit received receipt shows success (responses simulated, no database writes).',
  );

  await clickTo(page.locator('.fo-nav-login'), home + '/login');
  let status = 500;
  await page.route('**/api/auth/sign-in/email', (route) =>
    route.fulfill({
      status,
      contentType: 'application/json',
      body: JSON.stringify({ code: 'TEST_RESPONSE', message: 'Test response' }),
    }),
  );
  await page.locator('input[name="email"]').fill('folio-ui@example.test');
  await page.locator('input[name="password"]').fill('local-browser-check-123');
  for (const [code, message] of [
    [500, '账号服务暂时没有响应'],
    [401, '邮箱或密码不正确'],
    [429, '尝试太频繁'],
  ]) {
    status = code;
    await page.locator('.fa-panel form button').click();
    await page.waitForFunction(
      (text) =>
        document
          .querySelector('.fa-panel [role="alert"]')
          .textContent.includes(text),
      message,
    );
    assert.equal(await page.locator('.fa-panel form button').isEnabled(), true);
    assert.equal(
      await page.locator('input[name="email"]').inputValue(),
      'folio-ui@example.test',
    );
  }
  await clickTo(page.locator('.fo-logo'), home);
  console.log(
    'PASS: login distinguishes service failure, rejected credentials and throttling (responses simulated; real login still requires configured backend).',
  );

  for (const width of [1440, 1024, 768, 390, 360]) {
    await page.setViewportSize({ width, height: 900 });
    for (const path of [home + '/contact', '/demos/community']) {
      await visit(path);
      assert.equal(await page.locator('h1').count(), 1);
      assert.ok(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
        `${path} @ ${width}`,
      );
      if (path.endsWith('/contact')) {
        assert.equal(await page.locator('.fc-art').isVisible(), width > 900);
        if (width <= 900)
          assert.ok(
            (await page.locator('input[name="name"]').boundingBox()).y < 900,
          );
      } else {
        await page.locator('.fcm-method-detail summary').first().click();
        assert.equal(
          await page.locator('.fcm-method-detail').first().getAttribute('open'),
          '',
        );
        await page.locator('.fcm-join-grid').scrollIntoViewIfNeeded();
        assert.ok(await page.locator('.fcm-join-grid a').last().isVisible());
      }
    }
  }
  assert.equal(errors.length, 0, errors.join('\n'));
  console.log(
    'PASS: contact and community at five widths; mobile form in first screen, disclosures and cards reachable, no page runtime errors.',
  );
} finally {
  await browser.close();
}
