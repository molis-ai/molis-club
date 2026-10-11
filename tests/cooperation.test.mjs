import test from 'node:test';
import assert from 'node:assert/strict';
import { folioCooperation } from '../content/folio-cooperation.ts';
import { folioMembers } from '../content/folio-team.ts';

// 企业合作页「做这件事的人」只用团队页上已经写着的个人经历（A8）。

test('every evidence quote is taken verbatim from that member on the team page', () => {
  const { people, services } = folioCooperation;
  const serviceIds = services.map((service) => service.id);
  assert.deepEqual(
    people.steps.map((step) => step.service),
    serviceIds,
  );
  for (const step of people.steps)
    for (const item of step.evidence) {
      const member = folioMembers.find((person) => person.name === item.name);
      assert.ok(member?.experience, `${item.name} 不在团队页或没有经历`);
      for (const quote of item.quotes)
        assert.ok(
          member.experience.includes(quote),
          `${item.name}：「${quote}」不是团队页原文`,
        );
    }
});

test('evidence claims no client work, results or numbers beyond tenure', () => {
  const text = JSON.stringify(folioCooperation.people);
  for (const phrase of [
    '为客户',
    '案例显示',
    '提升',
    '%',
    '100+',
    '已在两个固定真实服务',
  ])
    assert.ok(!text.includes(phrase), `出现了「${phrase}」`);
  assert.match(folioCooperation.people.lead, /还没有可以公开的案例/);
});
