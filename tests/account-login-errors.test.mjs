import test from 'node:test';
import assert from 'node:assert/strict';
import { build } from 'esbuild';
const bundle = await build({
  entryPoints: ['app/_site/central-account-client.ts'],
  bundle: true,
  write: false,
  format: 'esm',
  platform: 'node',
});
const { AccountRequestError, accountErrorText } = await import(
  'data:text/javascript;base64,' +
    Buffer.from(bundle.outputFiles[0].text).toString('base64')
);

await test('CLUB-LIVE-02: verification refusal stays distinct from provider outage', () => {
  assert.equal(
    accountErrorText(new AccountRequestError('INVALID_CREDENTIALS')),
    '邮箱、密码或验证码不正确，请重试。',
  );
  assert.equal(
    accountErrorText(new AccountRequestError('UPSTREAM_UNAVAILABLE')),
    '验证码或第三方登录服务暂时无法连接，请稍后再试。',
  );
  assert.equal(
    accountErrorText(new AccountRequestError('PROVIDER_CANCELLED')),
    '已取消第三方登录。',
  );
  assert.equal(
    accountErrorText(new Error('private upstream response')),
    '暂时无法完成，请重试或重新开始。',
  );
});
