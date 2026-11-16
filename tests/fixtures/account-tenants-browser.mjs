// CLUB-05: independent browser contexts use the production account components and BFF.
import assert from 'node:assert/strict';
import { join } from 'node:path';
import { createClubSessionManager } from '../../lib/account/sessions.ts';
export async function exerciseTenantAccountUi({
  page,
  browser,
  db,
  client,
  key,
  origin,
  evidence,
  getCode,
}) {
  const click = async (p, text) => {
    await p.command('Page.bringToFront');
    await p.evaluate(
      `{const b=[...document.querySelectorAll('button')].find(b=>b.textContent===${JSON.stringify(text)});if(!b||b.disabled)throw Error('Unavailable '+${JSON.stringify(text)});document.querySelectorAll('[data-tenant-click]').forEach(e=>e.removeAttribute('data-tenant-click'));b.dataset.tenantClick='';}`,
    );
    await p.click('[data-tenant-click]');
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
  const request = new Request(origin + '/api/account/session', {
    headers: {
      Cookie: cookies.cookies.map((c) => c.name + '=' + c.value).join('; '),
    },
  });
  const binding = await owner.sessions.read(request);
  // Synthetic platform permission in this disposable database, never a product grant.
  for (const permission of ['TENANT_CREATE', 'TENANT_READ', 'TENANT_STATUS'])
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
  const alpha = await central('createTenant', {
      name: 'Browser Alpha',
      ownerUserId: me.user.userId,
      reason: 'CLUB-05 fixture',
    }),
    beta = await central('createTenant', {
      name: 'Browser Beta',
      ownerUserId: me.user.userId,
      reason: 'CLUB-05 fixture',
    });
  const refresh = async (p) => {
    await p.wait(
      "!document.querySelector('select[aria-label=当前空间]')?.disabled",
    );
    await click(p, '刷新租户状态');
    await p.wait(
      "!document.querySelector('select[aria-label=当前空间]').disabled",
    );
  };
  const select = async (p, id) => {
    await p.evaluate(
      `{const s=document.querySelector('select[aria-label=当前空间]');s.value=${JSON.stringify(id)};s.dispatchEvent(new Event('change',{bubbles:true}));}`,
    );
    if (id)
      await p.wait("Boolean(document.querySelector('[aria-label=租户管理]'))");
  };
  await refresh(page);
  await select(page, alpha.tenantId);
  await page.fill('input[name=tenantName]', 'Browser Alpha renamed');
  await click(page, '保存租户资料');
  await page.wait("document.body.textContent.includes('租户资料已保存。')");
  await page.wait(
    "Boolean(document.querySelector('input[name=inviteTarget]'))",
  );
  const phone = '+8613800000555';
  await page.evaluate(
    "{const s=document.querySelector('select[name=inviteKind]');s.value='PHONE';s.dispatchEvent(new Event('change',{bubbles:true}));}",
  );
  await page.fill('input[name=inviteTarget]', phone);
  await click(page, '发送邀请');
  await page.wait("document.body.textContent.includes('邀请已创建')");
  const context = await browser.command('Target.createBrowserContext');
  const target = await browser.command('Target.createTarget', {
    url: origin + '/login',
    browserContextId: context.browserContextId,
  });
  const member = await browser.page(target.targetId);
  try {
    await member.command('Page.enable');
    await member.viewport(1024, 900);
    await member.wait(
      "Boolean(document.querySelector('.m-auth-submit'))&&!document.querySelector('.m-auth-submit').disabled",
    );
    await click(member, '手机验证');
    await member.fill('input[name=address]', phone.slice(3));
    await member.click('input[type=checkbox]');
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
    // CLUB-LOGIN-05: verified phone accounts register and sign in directly.
    await member.wait("document.body.textContent.includes('已登录 Molis 账号')");
    assert.equal(await member.evaluate("Boolean(document.querySelector('input[name=confirm]'))"), false);
    await member.command('Page.navigate', { url: origin + '/account' });
    await member.wait("document.body.textContent.includes('确认加入')");
    assert.equal(
      await member.evaluate(
        "fetch('/api/account/tenants').then(r=>r.json()).then(v=>v.data.items.length)",
      ),
      0,
    );
    await click(member, '确认加入');
    await member.wait("document.body.textContent.includes('已加入租户。')");
    await member.wait(
      "!document.querySelector('select[aria-label=当前空间]').disabled",
    );
    await select(member, alpha.tenantId);
    assert.ok(
      !(await member.evaluate(
        "document.body.textContent.includes('邀请成员')",
      )),
    );
    await refresh(page);
    await page.wait("document.body.textContent.includes('设为管理员')");
    await click(page, '设为管理员');
    await page.wait("document.body.textContent.includes('成员角色已更新。')");
    await page.wait(
      "Boolean(document.querySelector('select[name=nextOwner]'))",
    );
    await refresh(member);
    await member.wait("document.body.textContent.includes('邀请成员')");
    assert.ok(
      !(await member.evaluate(
        "document.body.textContent.includes('发起交接')",
      )),
    );
    const confirmed = async (p, text) => {
      const opened = browser.event('Page.javascriptDialogOpening');
      const clicked = click(p, text);
      await opened;
      await p.command('Page.handleJavaScriptDialog', { accept: true });
      await clicked;
    };
    await page.evaluate(
      "{const s=document.querySelector('select[name=nextOwner]');s.value=s.options[1].value;s.dispatchEvent(new Event('change',{bubbles:true}));}",
    );
    await confirmed(page, '发起交接');
    await page.wait("document.body.textContent.includes('交接已发起')");
    await refresh(member);
    await member.wait("document.body.textContent.includes('确认接收所有权')");
    await confirmed(member, '确认接收所有权');
    await member.wait(
      "document.body.textContent.includes('已完成所有权交接。')",
    );
    await refresh(page);
    await page.wait("document.body.textContent.includes('退出租户')");
    assert.ok(
      !(await page.evaluate("document.body.textContent.includes('发起交接')")),
    );
    for (const width of [1440, 1024, 390]) {
      await member.viewport(width, 900);
      await member.screenshot(join(evidence, 'tenant-' + width + '.png'));
      assert.ok(
        await member.evaluate(
          'document.documentElement.scrollWidth<=innerWidth',
        ),
      );
    }
    const active = await central('getPlatformTenant', undefined, {
      tenantId: alpha.tenantId,
    });
    await central(
      'disableTenant',
      { expectedVersion: active.version, reason: 'Fixture disabled' },
      { tenantId: alpha.tenantId },
    );
    await refresh(page);
    await page.wait(
      "document.body.textContent.includes('租户已停用，请联系平台管理人员')",
    );
    assert.ok(
      !(await page.evaluate(
        "Boolean(document.querySelector('[aria-label=租户管理]'))",
      )),
    );
    await select(page, beta.tenantId);
    assert.ok(
      await page.evaluate(
        "document.querySelector('[aria-label=租户管理]').textContent.includes('Browser Beta')",
      ),
    );
    await select(page, '');
    await page.wait("Boolean(document.querySelector('input[name=name]'))");
    process.stdout.write(
      'PASS CLUB-05 Chrome: tenant switch/edit, phone-directed invitation and recipient confirmation, role permissions, two-party ownership handoff, disabled tenant isolation and responsive pages\n',
    );
  } finally {
    await browser.command('Target.disposeBrowserContext', {
      browserContextId: context.browserContextId,
    });
  }
}
