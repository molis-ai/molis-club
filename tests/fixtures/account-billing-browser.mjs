// CLUB06-01/02/03/04: production UI against actual BFF/Auth, mock identity providers.
import assert from 'node:assert/strict';
import { join } from 'node:path';
import { createClubSessionManager } from '../../lib/account/sessions.ts';
import { makeBillingFixture } from './billing-catalog.mjs';
export async function exerciseBillingAccountUi({
  page,
  browser,
  db,
  client,
  key,
  origin,
  evidence,
  getCode,
  setUnavailable,
}) {
  const click = async (p, text) => {
    await p.command('Page.bringToFront');
    await p.evaluate(
      `{const b=[...document.querySelectorAll('button')].find(b=>b.textContent===${JSON.stringify(text)});if(!b||b.disabled)throw Error('Unavailable '+${JSON.stringify(text)});document.querySelectorAll('[data-billing-click]').forEach(e=>e.removeAttribute('data-billing-click'));b.dataset.billingClick='';}`,
    );
    await p.click('[data-billing-click]');
  };
  const confirmed = async (p, text) => {
    const opened = browser.event('Page.javascriptDialogOpening');
    const clicked = click(p, text);
    await opened;
    await p.command('Page.handleJavaScriptDialog', { accept: true });
    await clicked;
  };
  const select = async (p, name, value) => {
    await p.evaluate(
      `{const s=document.querySelector('select[name=${name}]');s.value=${JSON.stringify(value)};s.dispatchEvent(new Event('change',{bubbles:true}));}`,
    );
  };
  const session = async (p) =>
    p.evaluate(
      "fetch('/api/account/session').then(r=>r.json()).then(v=>v.data)",
    );
  const me = await session(page),
    cookies = await page.command('Network.getCookies', { urls: [origin] });
  const owner = await createClubSessionManager({
    db,
    client,
    encryptionKey: key,
  });
  const binding = await owner.sessions.read(
    new Request(origin + '/api/account/session', {
      headers: {
        Cookie: cookies.cookies.map((c) => c.name + '=' + c.value).join('; '),
      },
    }),
  );
  for (const permission of [
    'CATALOG_WRITE',
    'SUBSCRIPTION_READ',
    'SUBSCRIPTION_WRITE',
  ])
    await db
      .prepare(
        "INSERT INTO auth_platform_permission(user_id,permission,status,granted_by,granted_at) VALUES (?,?,'ACTIVE',?,?)",
      )
      .bind(me.user.userId, permission, me.user.userId, Date.now())
      .run();
  const central = async (id, body, path) =>
    (
      await client.call(
        id,
        {
          ...(body ? { body, idempotencyKey: crypto.randomUUID() } : {}),
          path,
        },
        { session: binding },
      )
    ).data;
  const tenant = await central('createTenant', {
      name: 'Billing Browser',
      ownerUserId: me.user.userId,
      reason: 'CLUB-06 UI fixture',
    }),
    f = await makeBillingFixture(
      central,
      me.user.userId,
      tenant.tenantId,
      'club06-ui',
    );
  let sub = f.tenant;
  const refresh = async (p) => {
    await p.wait(
      "!document.querySelector('select[aria-label=当前空间]')?.disabled",
    );
    await click(p, '刷新订阅与席位');
    await p.wait(
      "!document.querySelector('select[aria-label=当前空间]').disabled",
    );
    await p.wait(
      "document.querySelector('[aria-label=当前权益]')?.textContent.includes('席位功能')",
    );
  };
  const scope = async (p, id) => {
    await p.wait(
      "!document.querySelector('select[aria-label=当前空间]').disabled",
    );
    await p.evaluate(
      `{const s=document.querySelector('select[aria-label=当前空间]');s.value=${JSON.stringify(id)};s.dispatchEvent(new Event('change',{bubbles:true}));}`,
    );
    await p.wait(
      "document.querySelector('[aria-label=当前权益]')?.textContent.includes('席位功能')",
    );
  };
  await refresh(page);
  assert.ok(
    !(await page.evaluate(
      "document.querySelector('[aria-label=当前权益]').textContent.includes('Work 专属功能')",
    )),
  );
  assert.ok(
    await page.evaluate(
      "[...document.querySelectorAll('[aria-label=当前权益]>ul>li')].find(e=>e.textContent.includes('席位功能')).textContent.includes('未开通')",
    ),
  );
  await scope(page, tenant.tenantId);
  const phone = '+8613800000666';
  await central(
    'createInvitation',
    { target: { kind: 'PHONE', value: phone } },
    { tenantId: tenant.tenantId },
  );
  const context = await browser.command('Target.createBrowserContext'),
    target = await browser.command('Target.createTarget', {
      url: origin + '/login',
      browserContextId: context.browserContextId,
    }),
    member = await browser.page(target.targetId);
  try {
    await member.command('Page.enable');
    await member.viewport(1024, 900);
    await member.wait(
      "Boolean(document.querySelector('.m-auth-submit'))&&!document.querySelector('.m-auth-submit').disabled",
    );
    await click(member, '手机验证码');
    await member.fill('input[name=address]', phone.slice(3));
    await member.click('.m-auth-submit');
    await member.wait("Boolean(document.querySelector('input[name=code]'))");
    await member.fill('input[name=code]', await getCode(phone));
    if (
      await member.evaluate(
        "Boolean(document.querySelector('input[type=checkbox]'))",
      )
    )
      await member.click('input[type=checkbox]');
    await member.click('.m-auth-submit');
    await member.wait("Boolean(document.querySelector('.m-auth-done'))");
    await member.command('Page.navigate', { url: origin + '/account' });
    await member.wait("document.body.textContent.includes('确认加入')");
    await click(member, '确认加入');
    await member.wait("document.body.textContent.includes('已加入租户。')");
    const memberId = (await session(member)).user.userId;
    await scope(member, tenant.tenantId);
    assert.ok(
      !(await member.evaluate(
        "document.querySelector('[aria-label=席位管理]').textContent.includes('分配席位')",
      )),
    );
    await refresh(page);
    const members = (
        await central('listMembers', undefined, { tenantId: tenant.tenantId })
      ).items,
      mine = members.find((m) => m.userId === me.user.userId),
      other = members.find((m) => m.userId === memberId);
    await click(page, '分配席位');
    await select(page, 'seatPool', '0');
    await select(page, 'seatMember', mine.membershipId);
    // Concurrent platform capacity change invalidates the UI's pool version; it must refresh, never retry silently.
    sub = await central(
      'updateSubscription',
      {
        expectedVersion: sub.version,
        seatQuantities: { [f.seatType]: 2 },
        reason: 'Concurrent UI fixture',
      },
      { subscriptionId: sub.subscriptionId },
    );
    await confirmed(page, '确认席位操作');
    await page.wait("document.body.textContent.includes('账号状态已变化')");
    await page.wait("Boolean(document.querySelector('[aria-label=席位管理]'))");
    await click(page, '分配席位');
    await select(page, 'seatPool', '0');
    await select(page, 'seatMember', mine.membershipId);
    await confirmed(page, '确认席位操作');
    await page.wait("document.body.textContent.includes('席位已更新。')");
    await page.wait(
      "document.querySelector('[aria-label=当前权益]')?.textContent.includes('租户席位')",
    );
    assert.ok(
      await page.evaluate(
        "[...document.querySelectorAll('[aria-label=当前权益]>ul>li')].find(e=>e.textContent.includes('共同功能')).textContent.includes('个人订阅')",
      ),
    );
    // Expired evidence and an unavailable authority must not retain an apparent grant.
    await page.evaluate(
      "{window.billingClock=Date.now;Date.now=()=>window.billingClock()+86400000;window.dispatchEvent(new Event('focus'));}",
    );
    await page.wait(
      "document.querySelector('[aria-label=当前权益]').textContent.includes('待重新校验')",
    );
    assert.ok(
      !(await page.evaluate(
        "document.querySelector('[aria-label=当前权益]').textContent.includes('已开放')",
      )),
    );
    await page.evaluate(
      'Date.now=window.billingClock;delete window.billingClock',
    );
    setUnavailable(true);
    await click(page, '刷新权益');
    await page.wait(
      "document.querySelector('[aria-label=当前权益]').textContent.includes('权益暂不可确认')",
    );
    assert.ok(
      !(await page.evaluate(
        "document.querySelector('[aria-label=当前权益]').textContent.includes('已开放')",
      )),
    );
    setUnavailable(false);
    await click(page, '刷新权益');
    await page.wait(
      "document.querySelector('[aria-label=当前权益]').textContent.includes('租户席位')",
    );
    await click(page, '换绑席位');
    await select(page, 'seatMember', other.membershipId);
    await confirmed(page, '确认席位操作');
    await page.wait(
      "!document.querySelector('form[aria-label=席位操作]')&&document.querySelector('[aria-label=当前权益]')?.textContent.includes('席位功能')",
    );
    assert.ok(
      await page.evaluate(
        "[...document.querySelectorAll('[aria-label=当前权益]>ul>li')].find(e=>e.textContent.includes('席位功能')).textContent.includes('未开通')",
      ),
    );
    await refresh(member);
    await member.wait(
      "document.querySelector('[aria-label=当前权益]')?.textContent.includes('租户席位')",
    );
    assert.ok(
      !(await member.evaluate(
        "document.body.textContent.includes('回收席位')",
      )),
    );
    for (const width of [1440, 1024, 390]) {
      await page.viewport(width, 900);
      await page.screenshot(join(evidence, 'billing-' + width + '.png'));
      assert.ok(
        await page.evaluate('document.documentElement.scrollWidth<=innerWidth'),
      );
    }
    await page.viewport(1024, 900);
    await click(page, '查看分配历史');
    await page.wait(
      "document.querySelector('[aria-label=席位管理]')?.textContent.includes('换绑')",
    );
    await click(page, '查看当前分配');
    sub = await central(
      'updateSubscription',
      {
        expectedVersion: sub.version,
        endsAt: new Date(Date.now() - 1000).toISOString(),
        reason: 'Expired UI fixture',
      },
      { subscriptionId: sub.subscriptionId },
    );
    await refresh(page);
    await page.wait(
      "document.querySelector('[aria-label=租户订阅]')?.textContent.includes('已到期')",
    );
    assert.ok(
      await page.evaluate(
        "[...document.querySelectorAll('button')].find(b=>b.textContent==='换绑席位').disabled",
      ),
    );
    await refresh(member);
    assert.ok(
      !(await member.evaluate(
        "document.querySelector('[aria-label=当前权益]').textContent.includes('租户席位')",
      )),
    );
    await click(page, '回收席位');
    await page.fill('input[name=seatReason]', 'Expired capacity released');
    await confirmed(page, '确认席位操作');
    await page.wait(
      "document.querySelector('[aria-label=席位管理]')?.textContent.includes('暂无当前分配')",
    );
    await click(page, '查看分配历史');
    await page.wait(
      "document.querySelector('[aria-label=席位管理]')?.textContent.includes('已回收')",
    );
    sub = await central(
      'updateSubscription',
      {
        expectedVersion: sub.version,
        seatQuantities: { [f.seatType]: 0 },
        reason: 'Reclaim before reduce',
      },
      { subscriptionId: sub.subscriptionId },
    );
    await refresh(page);
    await page.wait(
      "document.querySelector('[aria-label=席位管理]')?.textContent.includes('总数 0')",
    );
    await scope(page, '');
    assert.ok(
      await page.evaluate(
        "document.querySelector('[aria-label=个人订阅]').textContent.includes('生效中')",
      ),
    );
    process.stdout.write(
      'PASS CLUB-06 Chrome: personal/tenant subscriptions, real entitlement sources/product filter, role-restricted inventory, stale-version refusal, assign/reassign/release/history, expired retention and post-reclaim capacity reduction, 1440/1024/390 layouts\n',
    );
  } finally {
    await browser.command('Target.disposeBrowserContext', {
      browserContextId: context.browserContextId,
    });
  }
}
