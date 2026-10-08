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
const sceneStep = (player) => player.getAttribute('data-step');
const choose = (player, n) =>
  player.getByRole('button', { name: new RegExp(`^查看步骤 ${n}：`) });

try {
  await visit();
  const members = page.locator('.fo-person');
  assert.equal(await members.count(), 4);
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
  await photo.focus();
  await page.waitForTimeout(650);
  assert.equal(
    await note.evaluate((el) => getComputedStyle(el).visibility),
    'visible',
  );
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
  console.log(
    'PASS: restored member hover, click, keyboard note; original cover animation and three product sheets.',
  );

  await visit('/tool');
  assert.equal(await page.locator('.ft-hero .fd-player').count(), 0);
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
  assert.equal(await page.locator('.ft-layers > li').count(), 3);
  assert.equal(await page.locator('.ft-moment-grid > li').count(), 6);
  assert.equal(
    await page.locator('.fd-steps, .fd-window-bar, .fd-count').count(),
    0,
  );
  const layer = page.locator('.ft-layers .fd-player').first();
  await layer.scrollIntoViewIfNeeded();
  await layer.getByRole('button', { name: '暂停演示', exact: true }).click();
  const stopped = await sceneStep(layer);
  await page.waitForTimeout(3200);
  assert.equal(await sceneStep(layer), stopped);
  await choose(layer, 1).click();
  await layer.getByRole('button', { name: '播放演示', exact: true }).click();
  await page.waitForFunction(
    () => document.querySelector('.ft-layers .fd-player')?.dataset.step !== '0',
    undefined,
    { timeout: 7000 },
  );
  await page.waitForFunction(
    () => document.querySelector('.ft-layers .fd-player')?.dataset.step === '2',
    undefined,
    { timeout: 7000 },
  );
  await page.waitForFunction(
    () => document.querySelector('.ft-layers .fd-player')?.dataset.step === '0',
    undefined,
    { timeout: 5000 },
  );
  await page.locator('footer').scrollIntoViewIfNeeded();
  await page.waitForTimeout(200);
  const offscreen = await sceneStep(layer);
  await page.waitForTimeout(3200);
  assert.equal(await sceneStep(layer), offscreen);
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await visit('/tool');
  const plugin = page.locator('.ft-plugin-live');
  await plugin.scrollIntoViewIfNeeded();
  for (const entrance of ['光标旁', '右键', '拖放', '命令条']) {
    const button = plugin.getByRole('button', { name: entrance, exact: true });
    await button.click();
    assert.equal(await button.getAttribute('aria-pressed'), 'true');
    assert.match(
      await plugin.locator('.ft-plugin-result').innerText(),
      /把好奇心，做成作品/,
    );
  }
  const toggle = plugin.getByRole('switch');
  await toggle.click();
  assert.equal(await toggle.getAttribute('aria-checked'), 'false');
  assert.match(await plugin.innerText(), /上次的结果仍然保留/);
  await toggle.focus();
  await page.keyboard.press('Space');
  assert.equal(await toggle.getAttribute('aria-checked'), 'true');
  const staticLayer = page.locator('.ft-layers .fd-player').first();
  assert.equal(await sceneStep(staticLayer), '2');
  await choose(staticLayer, 1).click();
  await page.waitForTimeout(3200);
  assert.equal(await sceneStep(staticLayer), '0');
  console.log(
    'PASS: original Tool hero CSS motion, automatic scene playback, pause, offscreen suspension, reduced motion, plugin entrances and keyboard switch.',
  );

  await visit('/work');
  assert.equal(
    await page.locator('.wd-dock, .wd-surface, .fd-window-bar').count(),
    0,
  );
  for (const scene of ['信息', '新项目', '插件创作台', 'Coding']) {
    await page.getByRole('button', { name: scene, exact: true }).click();
    assert.equal(await page.locator('.fw-more .fd-player').count(), 1);
    assert.equal(
      await page.locator('.fw-more .fd-player').getAttribute('data-step'),
      '3',
    );
  }
  await page.locator('.fw-feature-groups summary').nth(1).click();
  assert.equal(
    await page
      .locator('.fw-feature-groups details')
      .nth(1)
      .getAttribute('open'),
    '',
  );
  await visit('/solutions');
  assert.equal(await page.locator('.fd-player').count(), 0);
  assert.equal(await page.locator('.fs-scenario').count(), 3);
  const sectionOrder = await page
    .locator('#cooperation, #directions, #fs-closing-title')
    .evaluateAll((nodes) => nodes.map((node) => node.id));
  assert.deepEqual(sectionOrder, [
    'cooperation',
    'directions',
    'fs-closing-title',
  ]);
  console.log(
    'PASS: Work scenarios and ability disclosure; requested solution cards and section order.',
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
    ]) {
      await visit(route);
      assert.equal(await page.locator('h1').count(), 1, `${route} @ ${width}`);
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
  assert.equal(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
    true,
  );
  assert.equal(errors.length, 0, errors.join('\n'));
  console.log(
    'PASS: all seven pages, five viewport widths, community links, images and no browser runtime errors.',
  );
} finally {
  await browser.close();
}
