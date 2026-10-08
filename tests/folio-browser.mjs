// Run against npm run dev. Requires Playwright and a Chromium installation.
// PLAYWRIGHT_MODULE / CHROMIUM_PATH can point to an existing tooling installation.
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
const count = (player) => player.locator('.fd-count').innerText();
const step = (player, number) =>
  player.getByRole('button', { name: new RegExp(`^查看步骤 ${number}：`) });

try {
  await visit('/tool');
  const hero = page.locator('.ft-cursor-player').first();
  await hero.scrollIntoViewIfNeeded();
  await hero.getByRole('button', { name: '暂停演示', exact: true }).click();
  const pausedAt = await count(hero);
  await page.waitForTimeout(3300);
  assert.equal(await count(hero), pausedAt, 'Pause keeps the current step');
  await hero.getByRole('button', { name: '重播演示', exact: true }).click();
  assert.match(await count(hero), /01 \/ 03/);
  await page.waitForTimeout(3200);
  assert.match(await count(hero), /02 \/ 03/, 'Visible demonstration advances');
  await step(hero, 3).click();
  await page.waitForTimeout(850);
  assert.equal(
    await hero
      .locator('.ft-card')
      .evaluate((el) => getComputedStyle(el).opacity),
    '1',
  );
  await hero.getByRole('button', { name: '重播演示', exact: true }).click();
  await page.locator('footer').scrollIntoViewIfNeeded();
  await page.waitForTimeout(150);
  const offscreenAt = await count(hero);
  await page.waitForTimeout(3300);
  assert.equal(
    await count(hero),
    offscreenAt,
    'Offscreen demonstration pauses',
  );

  await page.emulateMedia({ reducedMotion: 'reduce' });
  await visit('/tool');
  const plugin = page.locator('.ft-plugin-live');
  await plugin.scrollIntoViewIfNeeded();
  for (const entrance of ['光标旁', '右键', '拖放', '命令条']) {
    await plugin.getByRole('button', { name: entrance, exact: true }).click();
    assert.equal(
      await plugin.locator('.fd-window-bar > span:nth-child(2)').innerText(),
      entrance,
    );
    assert.match(
      await plugin.locator('.ft-plugin-result').innerText(),
      /把好奇心，做成作品/,
    );
  }
  const toggle = plugin.getByRole('switch');
  await toggle.click();
  assert.equal(await toggle.getAttribute('aria-checked'), 'false');
  assert.match(await plugin.innerText(), /各入口已撤下这项能力/);
  assert.match(
    await plugin.locator('.ft-plugin-result').innerText(),
    /上次的结果仍然保留/,
  );
  assert.equal(
    await plugin.locator('.ft-plugin-action').getAttribute('aria-hidden'),
    'true',
  );
  await toggle.focus();
  await page.keyboard.press('Space');
  assert.equal(
    await toggle.getAttribute('aria-checked'),
    'true',
    'Switch works from keyboard',
  );
  const moments = page.locator('.ft-moment-live');
  for (let i = 0; i < 6; i++) {
    await moments.locator('.fd-tabs button').nth(i).click();
    assert.equal(
      await moments.locator('.fd-tabs button[aria-pressed="true"]').count(),
      1,
    );
    assert.equal(await moments.locator('.fd-player').count(), 1);
    assert.match(await count(moments), /03 \/ 03/);
  }
  await hero.scrollIntoViewIfNeeded();
  assert.equal(
    await hero.getByRole('button', { name: '暂停演示', exact: true }).count(),
    0,
  );
  await step(hero, 1).click();
  await page.locator('footer').scrollIntoViewIfNeeded();
  await hero.scrollIntoViewIfNeeded();
  await page.waitForTimeout(3200);
  assert.match(
    await count(hero),
    /01 \/ 03/,
    'Reduced motion preserves manual steps across scrolling',
  );
  console.log(
    'PASS: playback, pause, replay, offscreen suspension, reduced motion, six Tool scenes, plugin entrances and keyboard switch.',
  );

  await visit('/work');
  for (let i = 0; i < 4; i++) {
    const more = page.locator('.fw-more');
    await more.locator('.fd-tabs button').nth(i).click();
    assert.match(await count(more), /04 \/ 04/);
    assert.match(await more.locator('.fd-caption').innerText(), /未发布/);
    await step(more, 1).click();
    assert.match(await count(more), /01 \/ 04/);
  }
  const group = page.locator('.fw-feature-groups details').nth(1);
  await group.locator('summary').click();
  assert.equal(await group.getAttribute('open'), '');
  assert.match(await page.locator('.fw-release-note').innerText(), /v0.2.0/);

  await visit();
  for (const [name, slug] of [
    ['Tool', 'tool'],
    ['Life', 'life'],
    ['Story', 'story'],
    ['Work', 'work'],
  ]) {
    await page
      .locator('.fh-product-selector')
      .getByRole('button', { name: new RegExp(`^${name}`) })
      .click();
    assert.equal(
      await page.locator('.fh-stage-link').getAttribute('href'),
      `/demos/brand/folio/${slug}`,
    );
  }
  await page
    .getByRole('navigation', { name: '主导航' })
    .getByRole('link', { name: '解决方案', exact: true })
    .click();
  await page.waitForURL(`${folio}/solutions`);
  assert.match(await page.locator('h1').innerText(), /把 AI 用进\s*一段具体业务/);
  assert.equal(await page.locator('.fs-direction').count(), 3);
  console.log(
    'PASS: four secondary Work scenes, feature disclosure, product links and dedicated solutions route.',
  );

  for (const width of [1440, 1024, 768, 390, 360]) {
    await page.setViewportSize({ width, height: width > 800 ? 1000 : 844 });
    for (const route of [
      '',
      '/tool',
      '/work',
      '/solutions',
      ...(width === 390 ? ['/life', '/story'] : []),
    ]) {
      await visit(route);
      const layout = await page.evaluate(() => ({
        viewport: innerWidth,
        page: document.documentElement.scrollWidth,
        heading: document.querySelectorAll('h1').length,
        noindex: document
          .querySelector('meta[name="robots"]')
          ?.content.includes('noindex'),
      }));
      assert(
        layout.page <= layout.viewport + 1,
        `${route} overflows at ${width}px`,
      );
      assert.equal(layout.heading, 1, route);
      assert(layout.noindex, `${route} stays a private design preview`);
    }
  }
  assert.deepEqual(errors, [], 'No client rendering errors');
  console.log(
    'PASS: all four routes at five widths, Life/Story mobile smoke checks, private indexing, no browser errors.',
  );
} finally {
  await browser.close();
}
