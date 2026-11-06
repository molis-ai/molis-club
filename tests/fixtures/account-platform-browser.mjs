// CLUB07-01 CLUB07-02 CLUB07-03: production platform UI, real BFF/Auth, isolated mock identities.
import assert from 'node:assert/strict';
import { join } from 'node:path';
import { createClubSessionManager } from '../../lib/account/sessions.ts';
export async function exercisePlatformAccountUi({
  page,
  browser,
  db,
  client,
  key,
  origin,
  evidence,
}) {
  const click = async (text, selector = 'document') => {
    await page.command('Page.bringToFront');
    await page.wait(
      `Boolean(${selector}) && [...(${selector}).querySelectorAll('button')].some(b => b.textContent===${JSON.stringify(text)} && !b.disabled)`,
    );
    await page.evaluate(
      `{const root=${selector},b=[...root.querySelectorAll('button')].find(b=>b.textContent===${JSON.stringify(text)});if(!b||b.disabled)throw Error('Unavailable '+${JSON.stringify(text)});document.querySelectorAll('[data-platform-click]').forEach(b=>b.removeAttribute('data-platform-click'));b.dataset.platformClick='';}`,
    );
    await page.click('[data-platform-click]');
  };
  const confirmed = async (text) => {
    const opened = browser.event('Page.javascriptDialogOpening'),
      clicked = click(text);
    await opened;
    await page.command('Page.handleJavaScriptDialog', { accept: true });
    await clicked;
  };
  const choose = async (name, value) =>
    page.evaluate(
      `{const s=document.querySelector('select[name="${name}"]');s.value=${JSON.stringify(value)};s.dispatchEvent(new Event('change',{bubbles:true}));}`,
    );
  const me = await page.evaluate(
      "fetch('/api/account/session').then(r=>r.json()).then(v=>v.data)",
    ),
    cookies = await page.command('Network.getCookies', { urls: [origin] });
  const manager = await createClubSessionManager({
      db,
      client,
      encryptionKey: key,
    }),
    binding = await manager.sessions.read(
      new Request(origin + '/api/account/session', {
        headers: {
          Cookie: cookies.cookies.map((c) => c.name + '=' + c.value).join('; '),
        },
      }),
    );
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
  await db
    .prepare(
      "INSERT INTO auth_platform_permission(user_id,permission,status,granted_by,granted_at) VALUES (?,'AUDIT_READ','ACTIVE',?,?)",
    )
    .bind(me.user.userId, me.user.userId, Date.now())
    .run();
  const foreignOwner = (
    await db
      .prepare('SELECT id AS user_id FROM auth_user WHERE id<>? LIMIT 1')
      .bind(me.user.userId)
      .first()
  ).user_id;
  await Promise.all([
    browser.event('Page.domContentEventFired'),
    page.command('Page.navigate', { url: origin + '/account' }),
  ]);
  await page.wait(
    "[...document.querySelectorAll('button')].some(b=>b.textContent==='平台管理')",
  );
  await click('平台管理');
  await page.wait(
    "[...document.querySelectorAll('button')].some(b=>b.textContent==='创建并分配租户')",
  );
  await click('创建并分配租户');
  await page.fill('input[name=name]', 'Platform managed team');
  await page.fill('input[name=ownerUserId]', foreignOwner);
  await page.fill('input[name=reason]', 'CLUB-07 browser');
  await confirmed('确认租户操作');
  const done = async (text) =>
    page.wait(
      '!document.querySelector("form.m-auth-form")&&document.querySelector("[aria-label=平台管理]")?.textContent.includes(' +
        JSON.stringify(text) +
        ')',
    );
  await done('Platform managed team');
  let tenant = (await central('listPlatformTenants')).items.find(
    (t) => t.name === 'Platform managed team',
  );
  assert.equal(tenant.ownerUserId, foreignOwner);
  assert.ok(
    !(await central('listMyTenants')).items.some(
      (t) => t.tenantId === tenant.tenantId,
    ),
  );
  const tenantRow =
    '[...document.querySelectorAll("[aria-label=平台管理] li")].find(e=>e.textContent.includes("Platform managed team"))';
  await click('停用租户', tenantRow);
  await page.fill('input[name=reason]', 'CLUB-07 disable');
  await confirmed('确认租户操作');
  await done('Platform managed team');
  assert.equal(
    (
      await central('getPlatformTenant', undefined, {
        tenantId: tenant.tenantId,
      })
    ).status,
    'DISABLED',
  );
  await click('恢复租户', tenantRow);
  await page.fill('input[name=reason]', 'CLUB-07 restore');
  await confirmed('确认租户操作');
  await done('Platform managed team');
  assert.equal(
    (
      await central('getPlatformTenant', undefined, {
        tenantId: tenant.tenantId,
      })
    ).status,
    'ACTIVE',
  );
  await click('订阅管理');
  await page.wait(
    "[...document.querySelectorAll('button')].some(b=>b.textContent==='开通订阅'&&!b.disabled)",
  );
  await click('开通订阅');
  await page.wait("Boolean(document.querySelector('input[name=ownerId]'))");
  await choose('ownerKind', 'TENANT');
  await page.fill('input[name=ownerId]', tenant.tenantId);
  const plan = (await central('listPlans')).items.find(
    (p) => p.planId === 'club06-ui-plan',
  );
  assert.ok(plan);
  await page.evaluate(
    `{const s=document.querySelector('select[name=planVersion]');s.value=[...s.options].find(o=>o.textContent.includes(${JSON.stringify(plan.planId)})).value;s.dispatchEvent(new Event('change',{bubbles:true}));}`,
  );
  const type = plan.seatTypes[0].seatTypeId;
  await page.fill('input[name="quantity:' + type + '"]', '2');
  await page.fill('input[name=reason]', 'CLUB-07 create');
  await confirmed('确认订阅操作');
  await done('订阅已更新。');
  let sub = (await central('listPlatformSubscriptions')).items.find(
    (s) => s.owner.id === tenant.tenantId,
  );
  assert.ok(sub);
  const subRow =
    'document.querySelector(' +
    JSON.stringify('[data-subscription="' + sub.subscriptionId + '"]') +
    ')';
  const read = () =>
    central('getPlatformSubscription', undefined, {
      subscriptionId: sub.subscriptionId,
    });
  const edit = async (label) => {
    await page.wait('Boolean(' + subRow + ')');
    await click(label, subRow);
    await page.wait("Boolean(document.querySelector('input[name=reason]'))");
    await page.fill('input[name=reason]', 'CLUB-07 ' + label);
  };
  await edit('变更套餐与数量');
  await page.wait("document.body.textContent.includes('当前数量 2')");
  await page.fill('input[name="quantity:' + type + '"]', '3');
  await confirmed('确认订阅操作');
  await done('订阅已更新。');
  assert.equal(
    (
      await central('listPlatformSeatPools', undefined, {
        subscriptionId: sub.subscriptionId,
      })
    ).items[0].quantity,
    3,
  );
  const adjustDate = async (name, days) =>
    page.evaluate(
      `{const input=document.querySelector('input[name=${name}]');const d=new Date(input.value);d.setDate(d.getDate()+${days});const value=new Date(d.getTime()-d.getTimezoneOffset()*60000).toISOString().slice(0,16);Object.getOwnPropertyDescriptor(HTMLInputElement.prototype,'value').set.call(input,value);input.dispatchEvent(new Event('input',{bubbles:true}));}`,
    );
  await edit('续期订阅');
  await adjustDate('endsAt', 30);
  await confirmed('确认订阅操作');
  await done('订阅已更新。');
  assert.ok(Date.parse((await read()).endsAt) > Date.parse(sub.endsAt));
  sub = await read();
  await edit('调整有效期');
  await adjustDate('startsAt', -1);
  await confirmed('确认订阅操作');
  await done('订阅已更新。');
  assert.equal((await read()).endsAt, sub.endsAt);
  sub = await read();
  await edit('停用订阅');
  await confirmed('确认订阅操作');
  await done('订阅已更新。');
  assert.equal((await read()).enabled, false);
  await edit('恢复订阅');
  await confirmed('确认订阅操作');
  await done('订阅已更新。');
  assert.equal((await read()).endsAt, sub.endsAt);
  // An occupied seat prevents a platform reduction; the UI reloads after the conflict.
  let owned = (await central('listPlatformSubscriptions')).items.find(
    (v) =>
      v.owner.kind === 'TENANT' &&
      v.owner.id !== tenant.tenantId &&
      v.planId === plan.planId,
  );
  assert.ok(owned);
  owned = await central(
    'updateSubscription',
    {
      expectedVersion: owned.version,
      startsAt: new Date(Date.now() - 86400000).toISOString(),
      endsAt: new Date(Date.now() + 86400000).toISOString(),
      enabled: true,
      seatQuantities: { [type]: 1 },
      reason: 'CLUB-07 occupied capacity',
    },
    { subscriptionId: owned.subscriptionId },
  );
  const membership = (
      await central('listMembers', undefined, { tenantId: owned.owner.id })
    ).items.find((m) => m.userId === me.user.userId),
    pool = (
      await central('listSeatPools', undefined, { tenantId: owned.owner.id })
    ).items.find((p) => p.subscriptionId === owned.subscriptionId);
  const assignment = (
    await central(
      'assignSeat',
      {
        subscriptionId: owned.subscriptionId,
        seatTypeId: type,
        membershipId: membership.membershipId,
        expectedVersion: pool.version,
      },
      { tenantId: owned.owner.id },
    )
  ).assignment;
  await click('刷新平台状态');
  const ownRow =
    'document.querySelector(' +
    JSON.stringify('[data-subscription="' + owned.subscriptionId + '"]') +
    ')';
  await page.wait('Boolean(' + ownRow + ')');
  await click('变更套餐与数量', ownRow);
  await page.wait("Boolean(document.querySelector('input[name=reason]'))");
  await page.fill('input[name="quantity:' + type + '"]', '0');
  await page.fill('input[name=reason]', 'CLUB-07 conflict');
  await confirmed('确认订阅操作');
  await done('席位容量或分配已变化');
  assert.equal(
    (
      await central('listPlatformSeatPools', undefined, {
        subscriptionId: owned.subscriptionId,
      })
    ).items[0].quantity,
    1,
  );
  await central(
    'releaseSeat',
    { expectedVersion: assignment.version },
    { tenantId: owned.owner.id, assignmentId: assignment.assignmentId },
  );
  await click('变更套餐与数量', ownRow);
  await page.wait("Boolean(document.querySelector('input[name=reason]'))");
  await page.fill('input[name="quantity:' + type + '"]', '0');
  await page.fill('input[name=reason]', 'CLUB-07 reclaimed');
  await confirmed('确认订阅操作');
  await done('订阅已更新。');
  assert.equal(
    (
      await central('listPlatformSeatPools', undefined, {
        subscriptionId: owned.subscriptionId,
      })
    ).items[0].quantity,
    0,
  );
  // Personal creation never sends seat quantities.
  await click('开通订阅');
  await page.wait("Boolean(document.querySelector('input[name=ownerId]'))");
  await page.fill('input[name=ownerId]', me.user.userId);
  await choose('planVersion', '0');
  await page.fill('input[name=reason]', 'CLUB-07 personal');
  assert.equal(
    await page.evaluate(
      "document.querySelectorAll('input[name^=quantity]').length",
    ),
    0,
  );
  await confirmed('确认订阅操作');
  await done('订阅已更新。');
  assert.ok((await central('listPersonalSubscriptions')).items.length >= 2);
  // Read-only inventory is available to a nonmember operator even while the tenant is disabled.
  tenant = await central('getPlatformTenant', undefined, {
    tenantId: tenant.tenantId,
  });
  await central(
    'disableTenant',
    { expectedVersion: tenant.version, reason: 'CLUB-07 disabled inventory' },
    { tenantId: tenant.tenantId },
  );
  await edit('变更套餐与数量');
  await page.wait("document.body.textContent.includes('当前数量 3')");
  for (const width of [1440, 1024, 390]) {
    await page.viewport(width, 900);
    await page.screenshot(
      join(evidence, 'platform-subscription-' + width + '.png'),
    );
    assert.ok(
      await page.evaluate('document.documentElement.scrollWidth<=innerWidth'),
    );
  }
  await click('取消');
  await click('订阅与席位操作记录');
  await page.wait("document.body.textContent.includes('subscription.update')");
  await page.screenshot(join(evidence, 'platform-audit.png'));
  // Revoking central permissions immediately denies BFF reads despite a stale visible entry.
  await db
    .prepare(
      "UPDATE auth_platform_permission SET status='REVOKED',revoked_at=1,version=version+1 WHERE user_id=? AND permission='SUBSCRIPTION_READ'",
    )
    .bind(me.user.userId)
    .run();
  assert.equal(
    await page.evaluate(
      "fetch('/api/account/platform/subscriptions').then(r=>r.status)",
    ),
    403,
  );
  await click('刷新平台状态');
  await page.wait("!document.body.textContent.includes('正在读取平台状态')");
  await click('订阅管理');
  await page.wait("document.body.textContent.includes('没有订阅查看权限。')");
  await click('返回账号');
  await page.wait(
    "Boolean(document.querySelector('select[aria-label=当前空间]'))",
  );
  process.stdout.write(
    'PASS CLUB-07 Chrome: platform create/assign/disable/restore, nonmember inventory, subscription create/capacity/term/renew/status, audit, permission revocation, responsive UI\n',
  );
}
