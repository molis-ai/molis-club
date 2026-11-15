import { exercisePlatformAccountUi } from '../tests/fixtures/account-platform-browser.mjs';
import { exerciseBillingAccountUi } from '../tests/fixtures/account-billing-browser.mjs';
import { exerciseTenantAccountUi } from '../tests/fixtures/account-tenants-browser.mjs';
// CLUB-LIVE-03 / CLUB-03: exact production LoginForm and BFF, real Auth/temporary D1, isolated React browser harness.
// The harness substitutes only Next navigation wrappers; Vinext route mounting is checked by the full build.
import assert from 'node:assert/strict';
import http from 'node:http';
import { readFileSync } from 'node:fs';
import { mkdtemp, writeFile, mkdir, rm } from 'node:fs/promises';
import { resolve, join, isAbsolute } from 'node:path';
import { tmpdir } from 'node:os';
import { pathToFileURL } from 'node:url';
import { randomBytes } from 'node:crypto';
import { build } from 'esbuild';
import { createRequire } from 'node:module';
import { retiredAccountEntry } from '../lib/account/retired-entry.ts';
import { createCentralAccountClient } from '../lib/account/client.ts';
import { createClubSessionManager } from '../lib/account/sessions.ts';
import { createAuthenticationHandler } from '../lib/account/auth-http.ts';
import { createAccountBff } from '../lib/account/bff.ts';
import { readClubAccountConfig } from '../lib/account/config.ts';
import { configuration } from '../tests/fixtures/account-sessions.mjs';
const source = process.env.MOLIS_AUTH_SOURCE,
  work = process.env.MOLIS_WORK_SOURCE;
assert.ok(source && isAbsolute(source) && work && isAbsolute(work));
const { getRustProxy, initializeLocalRuntime } = await import(
  pathToFileURL(resolve(source, 'worker/scripts/local-runtime.mjs')).href
);
const { ChromeHarness } = await import(
  pathToFileURL(resolve(work, 'packages/test-kit/dist/browser/index.js')).href
);
const directory = await mkdtemp(join(tmpdir(), 'club03-browser-')),
  evidence = resolve('/private/tmp/club03-ui-evidence');
await mkdir(evidence, { recursive: true });
const key = randomBytes(32).toString('base64url');
const responses = [];
let proxy,
  browser,
  page,
  client,
  origin,
  authOrigin,
  js = '',
  failEntitlements = false;
async function forward(req, res, handler, base) {
  try {
    const chunks = [];
    for await (const chunk of req) chunks.push(chunk);
    const request = new Request(base + req.url, {
      method: req.method,
      headers: req.headers,
      ...(req.method === 'GET' || req.method === 'HEAD'
        ? {}
        : { body: Buffer.concat(chunks) }),
    });
    const response = await handler(request);
    responses.push({
      path: new URL(request.url).pathname,
      status: response.status,
      origin: request.headers.get('origin'),
      referrerPolicy: response.headers.get('referrer-policy'),
      location: response.headers.get('location')?.split('?')[0],
    });
    const headers = Object.fromEntries(response.headers);
    const cookies = response.headers.getSetCookie();
    if (cookies.length) headers['set-cookie'] = cookies;
    res.writeHead(response.status, headers);
    res.end(Buffer.from(await response.arrayBuffer()));
  } catch {
    res.writeHead(500);
    res.end('Isolated request failed');
  }
}
const authServer = http.createServer((req, res) => {
  void forward(req, res, (r) => proxy.fetch(r), authOrigin);
});
const product = http.createServer((req, res) => {
  if (
    req.url.startsWith('/api/auth/') ||
    req.url === '/api/auth-options' ||
    req.url === '/api/auth'
  ) {
    void forward(req, res, retiredAccountEntry, origin);
    return;
  }
  if (/^\/site\/molis-logo-clear-(64|96)\.png$/.test(req.url)) {
    res.writeHead(200, { 'Content-Type': 'image/png' });
    res.end(readFileSync('public' + req.url));
    return;
  }
  if (req.url === '/ui.js') {
    res.writeHead(200, {
      'Content-Type': 'application/javascript',
      'Cache-Control': 'no-store',
    });
    res.end(js);
    return;
  }
  if (req.url === '/ui.css') {
    res.writeHead(200, { 'Content-Type': 'text/css' });
    res.end(
      readFileSync('app/_site/site.css', 'utf8') +
        '\n' +
        readFileSync('app/_site/auth.css', 'utf8'),
    );
    return;
  }
  if (
    req.url.startsWith('/api/account/') ||
    req.url.startsWith('/account/callback')
  ) {
    void forward(
      req,
      res,
      async (request) => {
        const owner = await createClubSessionManager({
          db: proxy.env.DB,
          client,
          encryptionKey: key,
        });
        const path = new URL(request.url).pathname;
        if (failEntitlements && path === '/api/account/entitlements/check')
          return Response.json(
            { error: { code: 'AUTH_UNAVAILABLE' } },
            { status: 503 },
          );
        return path.includes('/auth/') ||
          path.endsWith('/password/reset') ||
          /\/(reauthentications|password\/change|login-methods\/(?:bind|[^/]+\/(?:replace|unlink)))$/.test(
            path,
          ) ||
          path === '/account/callback'
          ? createAuthenticationHandler(
              proxy.env.DB,
              client,
              owner,
              key,
            )(request, path === '/account/callback')
          : owner.decorate(
              request,
              await createAccountBff(client, owner.sessions)(request),
            );
      },
      origin,
    );
    return;
  }
  res.writeHead(200, {
    'Content-Type': 'text/html',
    'Cache-Control': 'no-store',
  });
  res.end(
    '<!doctype html><html lang="zh"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><link rel="stylesheet" href="/ui.css"><title>Molis AI 登录</title><body><div id="root"></div><script src="/ui.js"></script></body></html>',
  );
});
const listen = async (s) => {
  await new Promise((r) => s.listen(0, '127.0.0.1', r));
  return 'http://127.0.0.1:' + s.address().port;
};
const stop = async (s) => {
  s.closeAllConnections();
  await new Promise((r) => s.close(r));
};
try {
  authOrigin = await listen(authServer);
  origin = await listen(product);
  proxy = await getRustProxy({
    AUTH_ORIGIN: authOrigin,
    PROVIDER_STATE_KEY: randomBytes(32).toString('base64url'),
    UNIFIED_ACCOUNT_CONFIG: JSON.stringify({
      environmentId: 'unified-local',
      kind: 'LOCAL',
      authOrigin,
      providerMode: 'MOCK',
      deliveryMode: 'MOCK',
    }),
  });
  // Seed only the explicit origins below; the default seed registers fixed port 8787.
  await initializeLocalRuntime(proxy, false);
  for (const file of [
    resolve(source, 'worker/unified-account-local-seed.sql'),
    resolve(source, 'worker/mock-provider-local-seed.sql'),
    resolve('drizzle/0004_central_account_sessions.sql'),
    resolve('drizzle/0005_central_account_transactions.sql'),
  ])
    for (const sql of readFileSync(file, 'utf8')
      .replaceAll('http://127.0.0.1:3000', origin)
      .replaceAll('http://127.0.0.1:8787', authOrigin)
      .replace(/--[^\n]*/g, '')
      .split(';')
      .map((s) => s.trim())
      .filter(Boolean))
      await proxy.env.DB.prepare(sql).run();
  const config = structuredClone(configuration());
  config.client.productOrigin = origin;
  config.client.authOrigin = authOrigin;
  config.client.redirectAllowlist = [origin + '/account/callback'];
  config.redirectUri = origin + '/account/callback';
  client = createCentralAccountClient(
    readClubAccountConfig(JSON.stringify(config)),
    (request) => proxy.fetch(request),
  );
  const shim = join(directory, 'navigation.tsx');
  await writeFile(
    shim,
    "import React from 'react';export const useRouter=()=>({replace:(url)=>{if(location.pathname!==url)location.replace(url)}});export const useSearchParams=()=>new URLSearchParams(location.search);export const usePathname=()=>location.pathname;export default function Link(props){return React.createElement('a',props);}",
  );
  const bundled = await build({
    stdin: {
      contents:
        "import React from 'react';import {createRoot} from 'react-dom/client';import {LoginForm} from './app/(site)/login/login-form';import {CentralAccount} from './app/(site)/account/central-account';import {Header,Footer} from './app/_site/chrome';import './app/_site/auth.css';createRoot(document.getElementById('root')).render(<div className='m'><Header/><main><div className='m-auth m-top'><div className={location.pathname==='/account'?'m-auth-card m-account-card':'m-auth-card'}><p className='m-kicker'>Molis AI</p>{location.pathname==='/account'?<CentralAccount/>:<LoginForm/>}</div></div></main><Footer/></div>);",
      resolveDir: process.cwd(),
      loader: 'tsx',
    },
    bundle: true,
    write: false,
    outdir: directory,
    platform: 'browser',
    format: 'iife',
    jsx: 'automatic',
    define: { 'process.env.NODE_ENV': '"production"' },
    alias: { 'next/link': shim, 'next/navigation': shim },
    nodePaths: [resolve('node_modules')],
  });
  js = bundled.outputFiles.find((f) => f.path.endsWith('.js')).text;
  browser = await ChromeHarness.start(join(directory, 'chrome'));
  assert.ok(browser);
  page = await browser.page();
  await page.command('Page.enable');
  const navigate = (action) =>
    Promise.all([browser.event('Page.domContentEventFired'), action()]);
  await page.viewport(1440, 900);
  await navigate(() =>
    page.command('Page.navigate', { url: origin + '/login' }),
  );
  await page.wait(
    "document.querySelector('.m-auth-submit')&&!document.querySelector('.m-auth-submit').disabled",
  );
  const clickText = async (text) => {
    await page.command('Page.bringToFront');
    await page.wait(`[...document.querySelectorAll('button')].some(b=>b.textContent===${JSON.stringify(text)}&&!b.disabled&&b.getClientRects().length>0&&!b.closest('details:not([open])'))`);
    await page.evaluate(
      `{const b=[...document.querySelectorAll('button')].find(b=>b.textContent===${JSON.stringify(text)}&&!b.disabled&&b.getClientRects().length>0&&!b.closest('details:not([open])'));if(!b)throw Error('Button missing');document.querySelectorAll('[data-test-click]').forEach(e=>e.removeAttribute('data-test-click'));b.dataset.testClick='';}`,
    );
    await page.click('[data-test-click]');
  };
  // K03-02: login and account pages no longer include the recovery-help entry.
  const assertNoAccessHelp = async () => {
    assert.equal(
      await page.evaluate(
        'document.querySelector("[data-account-help]") === null',
      ),
      true,
    );
    assert.equal(
      await page.evaluate(
        'document.body.textContent.includes("无法使用登录方式？")',
      ),
      false,
    );
  };
  await page.fill('input[name=address]', 'help-draft@example.test');
  await assertNoAccessHelp();
  for (const width of [1440, 1024, 390]) {
    await page.viewport(width, 900);
    await page.screenshot(join(evidence, `login-${width}.png`));
    assert.ok(
      await page.evaluate('document.documentElement.scrollWidth<=innerWidth'),
    );
  }
  assert.equal(
    await page.evaluate('document.querySelector("input[name=address]").value'),
    'help-draft@example.test',
  );
  // CLUB09-02: all production navigation entries lead to the same central account page.
  assert.equal(
    await page.evaluate(
      'document.querySelectorAll(\'header a[href="/account"],footer a[href="/account"]\').length',
    ),
    3,
  );
  await page.command('Network.setCookie', {
    name: 'better-auth.session_token',
    value: 'synthetic-retired-cookie',
    url: origin,
  });
  assert.equal(
    await page.evaluate("fetch('/api/auth/get-session').then(r=>r.status)"),
    410,
  );
  await page.viewport(1440, 900);
  await navigate(() => page.click('.m-login'));
  await page.wait(
    "document.querySelector('.m-auth-head h2')?.textContent==='尚未登录'",
  );
  await navigate(() => page.click('.m-auth-card a[href="/login"]'));
  await page.wait(
    "document.querySelector('.m-auth-submit')&&!document.querySelector('.m-auth-submit').disabled",
  );
  await clickText('邮箱验证');
  await page.fill('input[name=address]', 'club-browser@example.test');
  await page.click('input[type=checkbox]');
  await page.click('.m-auth-submit');
  await page.wait("Boolean(document.querySelector('input[name=code]'))");
  const row = await proxy.env.DB.prepare(
    "SELECT m.credential FROM auth_mock_delivery m JOIN auth_verification_challenge c ON c.delivery_id=m.delivery_id WHERE c.canonical_target='club-browser@example.test' ORDER BY c.created_at DESC LIMIT 1",
  ).first();
  await page.fill('input[name=code]', row.credential);
  await page.click('.m-auth-submit');
  await page.wait("document.body.textContent.includes('已登录 Molis 账号')");
  await navigate(() => page.click('.m-login'));
  await page.wait("[...document.querySelectorAll('button')].some(b=>b.textContent==='退出登录')");
  await clickText('退出登录');
  await page.wait("document.body.textContent.includes('已退出登录。')");
  await navigate(() => page.command('Page.navigate', {url: origin + '/login'}));
  await page.wait("document.querySelector('.m-auth-submit')&&!document.querySelector('.m-auth-submit').disabled");
  // Advance only this synthetic address's resend cooldown before the reset flow.
  await proxy.env.DB.prepare('UPDATE auth_rate_bucket SET expires_at=0 WHERE bucket_hash=?').bind((await import('node:crypto')).createHash('sha256').update('v2-delivery-resend:EMAIL:club-browser@example.test').digest('hex')).run();
  await clickText('找回密码');
  await page.fill('input[name=address]', 'club-browser@example.test');
  await page.click('.m-auth-submit');
  await page.wait("Boolean(document.querySelector('input[name=code]'))");
  const resetCode = await proxy.env.DB.prepare("SELECT m.credential FROM auth_mock_delivery m JOIN auth_verification_challenge c ON c.delivery_id=m.delivery_id WHERE c.canonical_target='club-browser@example.test' ORDER BY c.created_at DESC LIMIT 1").first();
  await page.fill('input[name=code]', resetCode.credential);
  await page.click('.m-auth-submit');
  await page.wait("Boolean(document.querySelector('input[name=confirm]'))");
  const password = randomBytes(20).toString('base64url');
  await page.fill('input[name=password]', password);
  await page.fill('input[name=confirm]', password);
  await page.click('.m-auth-submit');
  await page.wait("document.body.textContent.includes('密码已重设')");
  await page.fill('input[name=address]', 'club-browser@example.test');
  await page.fill('input[name=password]', password);
  await page.click('.m-auth-submit');
  await page.wait("document.body.textContent.includes('已登录 Molis 账号')");
  await navigate(() => page.click('.m-login'));
  await page.wait(
    "[...document.querySelectorAll('button')].some(b=>b.textContent==='退出登录')",
  );
  // CLUB-04: the production management UI, real BFF/Auth and a real provider popup.
  await page.wait(
    "Boolean(document.querySelector('input[name=name]'))&&document.body.textContent.includes('绑定手机')",
  );
  const beforeHelp = await page.evaluate(
    'document.querySelector("input[name=name]").value',
  );
  for (const width of [1440, 1024, 390]) {
    await page.viewport(width, 900);
    await page.screenshot(join(evidence, `security-${width}.png`));
    assert.ok(
      await page.evaluate('document.documentElement.scrollWidth<=innerWidth'),
    );
  }
  assert.equal(
    await page.evaluate('document.querySelector("input[name=name]").value'),
    beforeHelp,
  );
  process.stdout.write(
    'PASS K03-02 Club: recovery-help entry absent from login, forms retained\n',
  );
  const { PNG } = createRequire(resolve(source, 'worker/package.json'))(
    'pngjs',
  );
  const avatar = new PNG({ width: 1, height: 1 });
  avatar.data.fill(127);
  const avatarFile = join(directory, 'avatar.png');
  await writeFile(avatarFile, PNG.sync.write(avatar));
  const documentNode = await page.command('DOM.getDocument');
  const fileNode = await page.command('DOM.querySelector', {
    nodeId: documentNode.root.nodeId,
    selector: 'input[name=avatar]',
  });
  await page.command('DOM.setFileInputFiles', {
    nodeId: fileNode.nodeId,
    files: [avatarFile],
  });
  await page.fill('input[name=name]', '浏览器账号资料');
  await clickText('保存资料');
  await page.wait("document.body.textContent.includes('资料已保存。')");
  for (const width of [1440, 1024, 390]) {
    await page.viewport(width, 1000);
    await page.screenshot(join(evidence, `account-${width}.png`));
    assert.ok(
      await page.evaluate('document.documentElement.scrollWidth<=innerWidth'),
    );
  }
  await page.wait("Boolean(document.querySelector('img[alt=当前头像]'))");
  await page.click('input[name=remove]');
  await clickText('保存资料');
  await page.wait(
    "!document.querySelector('img[alt=当前头像]')&&[...document.querySelectorAll('button')].some(b=>b.textContent==='保存资料'&&!b.disabled)",
  );
  process.stdout.write('CLUB-04 Chrome: profile and avatar saved/removed\n');
  await clickText('绑定手机');
  await clickText('开始验证');
  await page.wait("Boolean(document.querySelector('input[name=password]'))");
  await page.fill('input[name=address]', 'club-browser@example.test');
  await page.fill('input[name=password]', password);
  await clickText('确认身份');
  await page.wait(
    "Boolean(document.querySelector('input[name=address][type=tel]'))",
  );
  await page.fill('input[name=address]', '13800000646');
  await clickText('发送验证码');
  await page.wait("Boolean(document.querySelector('input[name=code]'))");
  const getCode = async (target) =>
    (
      await proxy.env.DB.prepare(
        'SELECT m.credential FROM auth_mock_delivery m JOIN auth_verification_challenge c ON c.delivery_id=m.delivery_id WHERE c.canonical_target=? ORDER BY c.created_at DESC LIMIT 1',
      )
        .bind(target)
        .first()
    ).credential;
  await page.fill('input[name=code]', await getCode('+8613800000646'));
  await clickText('验证');
  await page.wait("document.body.textContent.includes('验证已完成')");
  await clickText('确认绑定');
  await page.wait(
    "document.body.textContent.includes('0646')&&document.body.textContent.includes('登录方式已更新')",
  );
  process.stdout.write('CLUB-04 Chrome: phone bound\n');
  await clickText('绑定Google');
  await clickText('开始验证');
  await page.wait("Boolean(document.querySelector('input[name=password]'))");
  await page.fill('input[name=address]', 'club-browser@example.test');
  await page.fill('input[name=password]', password);
  await clickText('确认身份');
  await page.wait("document.body.textContent.includes('准备 Google 验证')");
  await clickText('准备 Google 验证');
  await page.wait("document.body.textContent.includes('打开授权窗口')");
  const beforeTargets = new Set(
    (await browser.command('Target.getTargets')).targetInfos.map(
      (t) => t.targetId,
    ),
  );
  await clickText('打开授权窗口');
  await page.wait("document.body.textContent.includes('等待浏览器验证结果')");
  const targets = (await browser.command('Target.getTargets')).targetInfos;
  const target = targets.find(
    (t) => t.type === 'page' && !beforeTargets.has(t.targetId),
  );
  assert.ok(target);
  const popup = await browser.page(target.targetId);
  for (let attempt = 0; ; attempt++) {
    try {
      await popup.wait(
        'location.origin===' +
          JSON.stringify(authOrigin) +
          "&&Boolean(document.querySelector('button[name=outcome]'))",
      );
      break;
    } catch (error) {
      if (
        attempt >= 3 ||
        !error.message.includes('Execution context was destroyed')
      )
        throw error;
    }
  }
  await popup.click('button[name=outcome][value=SUCCESS]');
  await page.wait("document.body.textContent.includes('验证已完成')");
  await clickText('确认绑定');
  await page.wait(
    "document.body.textContent.includes('Google 账号')&&document.body.textContent.includes('登录方式已更新')",
  );
  process.stdout.write('CLUB-04 Chrome: Google bound\n');
  await clickText('设置或修改密码');
  await page.evaluate(
    "document.querySelector('select[name=method]').value='PHONE_OTP'",
  );
  await clickText('开始验证');
  await page.wait(
    "Boolean(document.querySelector('input[name=address][type=tel]'))",
  );
  // Only advance this fixture's mock resend clock.
  await proxy.env.DB.prepare(
    'UPDATE auth_rate_bucket SET expires_at=0 WHERE bucket_hash=?',
  )
    .bind(
      (await import('node:crypto'))
        .createHash('sha256')
        .update('v2-delivery-resend:SMS:+8613800000646')
        .digest('hex'),
    )
    .run();
  await page.fill('input[name=address]', '13800000646');
  await clickText('发送验证码');
  await page.wait("Boolean(document.querySelector('input[name=code]'))");
  await page.fill('input[name=code]', await getCode('+8613800000646'));
  await clickText('验证');
  await page.wait("Boolean(document.querySelector('input[name=confirm]'))");
  const newPassword = randomBytes(20).toString('base64url');
  await page.fill('input[name=password]', newPassword);
  await page.fill('input[name=confirm]', newPassword);
  await clickText('确认设置或修改密码');
  await page.wait("document.body.textContent.includes('密码已更新')");
  process.stdout.write(
    'PASS CLUB-04 Chrome: profile edit, phone/Google binding, provider popup callback, phone reauthentication and password change, responsive account UI\n',
  );
  await exerciseTenantAccountUi({
    page,
    browser,
    db: proxy.env.DB,
    client,
    key,
    origin,
    evidence,
    getCode,
  });
  await exerciseBillingAccountUi({
    page,
    browser,
    db: proxy.env.DB,
    client,
    key,
    origin,
    evidence,
    getCode,
    setUnavailable: (value) => {
      failEntitlements = value;
    },
  });
  await exercisePlatformAccountUi({
    page,
    browser,
    db: proxy.env.DB,
    client,
    key,
    origin,
    evidence,
  });
  await clickText('退出登录');
  await page.wait("document.body.textContent.includes('已退出登录。')");
  for (const name of ['Google', 'GitHub']) {
    await navigate(() =>
      page.command('Page.navigate', { url: origin + '/login' }),
    );
    await page.wait(
      "document.querySelector('.m-auth-submit')&&!document.querySelector('.m-auth-submit').disabled",
    );
    const originalUrl = await page.evaluate('location.href');
    const before = new Set((await browser.command('Target.getTargets')).targetInfos.map(t => t.targetId));
    await clickText('使用 ' + name + ' 登录');
    await page.wait("document.body.textContent.includes('正在等待授权')");
    assert.equal(await page.evaluate('location.href'), originalUrl);
    const target = (await browser.command('Target.getTargets')).targetInfos.find(t => t.type === 'page' && !before.has(t.targetId));
    assert.ok(target, 'third-party login opens its own authorization window');
    const providerPage = await browser.page(target.targetId);
    for (let attempt = 0; ; attempt++) {
      try {
        await providerPage.wait("location.pathname.includes('/mock/')&&Boolean(document.querySelector('button[name=outcome]'))");
        break;
      } catch (error) {
        if (attempt >= 3 || !/context was destroyed|target navigated/i.test(error.message)) throw error;
      }
    }
    await providerPage.screenshot(join(evidence, name.toLowerCase() + '-mock.png'));
    await providerPage.click('button[name=outcome][value=SUCCESS]');
    try {
      for (let attempt = 0; ; attempt++) {
        try {
          await page.wait(
            'location.origin===' + JSON.stringify(origin) +
            "&&(document.body.textContent.includes('已登录 Molis 账号'))",
          );
          break;
        } catch (error) {
          if (attempt >= 3 || !/context was destroyed|target navigated/i.test(error.message)) throw error;
        }
      }
    } catch (error) {
      process.stderr.write(JSON.stringify(responses.slice(-12)) + '\n');
      process.stderr.write(
        (await page.evaluate('document.body.innerText')) + '\n',
      );
      await page.screenshot(join(evidence, 'callback-failure.png'));
      throw error;
    }
    await navigate(() =>
      page.command('Page.navigate', { url: origin + '/account' }),
    );
    await page.wait(
      "[...document.querySelectorAll('button')].some(b=>b.textContent==='退出登录'&&!b.disabled&&!b.closest('details:not([open])'))",
    );
    await clickText('退出登录');
    await page.wait("document.body.textContent.includes('已退出登录。')");
  }
  process.stdout.write(
    'PASS CLUB-03 Chrome: exact production email registration and Google/GitHub mock pages through real BFF/Auth, responsive screenshots\n',
  );
} catch (error) {
  if (page) {
    process.stderr.write(
      JSON.stringify({
        body: await page
          .evaluate('document.body.innerText')
          .catch(() => 'unavailable'),
        responses: responses.slice(-15),
      }) + '\n',
    );
    await page.screenshot(join(evidence, 'failure.png')).catch(() => {});
  }
  throw error;
} finally {
  await browser?.close();
  await stop(product);
  await stop(authServer);
  await proxy?.dispose();
  await rm(directory, { recursive: true, force: true });
}
