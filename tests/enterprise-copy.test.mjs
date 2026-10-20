import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

// 企业合作的主线（D1）：每站「业务团队 / 一起 / Molis」做的事和产出，都是 docs/studio-intro.md 第 5 章的原句片段，
// 一个字都没改；满幅那一屏的引子与三拍连起来是开场第三段原句；「为什么我们可以」用 5.5 导语原文与小标题原文。
// 旧版（?study=current）的建议起点仍要五个问题都落在四站上（主线不再显示这层对应）。

const { enterprise } = await import('../content/site/enterprise.ts');
const doc = readFileSync(
  new URL('../docs/studio-intro.md', import.meta.url),
  'utf8',
).replaceAll('**', '');
const chapter = doc.slice(doc.indexOf('## 5. 企业合作'), doc.indexOf('## 6.'));

const verbatim = (text, where) =>
  assert.ok(
    chapter.includes(text.replace(/[。；]$/, '')),
    `${where}：「${text}」不在第 5 章里`,
  );

void test('合作路线每站的事与产出都是第 5 章原句片段', () => {
  const { line, path } = enterprise;
  const ids = Object.keys(path.stations);
  assert.deepEqual(Object.keys(line.rows), ids);
  for (const id of ids) {
    // 每项服务三个角色各一件事，不留空格（负责人 2026-10-19）
    for (const who of ['you', 'both', 'we']) {
      assert.ok(
        line.rows[id][who]?.length,
        `${id}：${line.who[who]} 那一格是空的`,
      );
      verbatim(line.rows[id][who].join(''), id);
    }
    for (const leaf of path.stations[id].leaves) verbatim(leaf, `${id} 产出`);
  }
  for (const form of path.forms) verbatim(form, '产品形态');
  // 列名是 5.2 开头那句里的四个词，按原文顺序
  const words = ids.map((id) => path.stations[id].word);
  const at = words.map((word) => path.lead.indexOf(word));
  assert.ok(
    at.every((i) => i >= 0),
    `列名要是「${path.lead}」里的词`,
  );
  assert.deepEqual(
    at,
    [...at].sort((a, b) => a - b),
  );
  verbatim(path.lead, '路线开头');
  for (const text of enterprise.people.abilities.map((item) => item.title))
    verbatim(text, '5.5 小标题');
});

void test('满幅那一屏：引子与三拍连起来是开场第三段原句', () => {
  const { vista, intro } = enterprise;
  assert.equal(vista.lead + vista.beats.flat().join(''), intro[2]);
  assert.ok(Object.keys(vista.plates).includes('a'), '默认的那张图要在候选里');
});

void test('为什么我们可以：导语两头、四个位置与小标题都照 5.5 原文，位置按原文顺序', () => {
  const { why, people } = enterprise;
  assert.equal(why.need + why.close, people.lead);
  verbatim(why.center, '5.5 导语');
  const order = why.views.map((view) => why.need.indexOf(view.label));
  assert.ok(
    order.every((at) => at >= 0),
    '四个位置都要是导语原词',
  );
  assert.deepEqual(
    order,
    [...order].sort((a, b) => a - b),
  );
  assert.deepEqual(
    why.views.map((view) => view.title),
    people.abilities.map((item) => item.title),
  );
  for (const view of why.views) {
    verbatim(view.title, '5.5 小标题');
    for (const org of view.orgs)
      assert.ok(doc.includes(org), `${view.id}：「${org}」不在成员经历里`);
  }
  assert.match(why.note, /不是 Molis 已完成的客户项目/);
});

void test('为什么我们可以：每项能力都落到有经历的成员身上，成员和经历里的公司都在第 7 章里', () => {
  const { why } = enterprise;
  const team = doc.slice(doc.indexOf('## 7. 团队'));
  for (const [id, member] of Object.entries(why.members)) {
    assert.ok(
      team.includes(member.name),
      `${id}：「${member.name}」不在第 7 章`,
    );
    for (const org of [
      '美团',
      '字节',
      '快手',
      '小红书',
      '滴滴',
      'LinkedIn',
      '英语流利说',
      'Teambition',
    ])
      if (member.brief.includes(org))
        assert.ok(
          team.slice(team.indexOf(member.name)).split('\n')[0].includes(org),
          `${member.name}的经历里没有「${org}」`,
        );
  }
  for (const view of why.views) {
    assert.ok(view.skills.length >= 3, `${view.id} 至少要有三项能力`);
    for (const skill of view.skills) {
      assert.ok(skill.who.length > 0, `${view.id}「${skill.name}」没有人`);
      for (const who of skill.who)
        assert.ok(who in why.members, `${who} 不是成员`);
    }
  }
});

void test('五个问题都对应到四站上，每一站至少亮起一个问题', () => {
  const { advice, stations } = enterprise.path;
  const lit = new Set();
  for (const item of enterprise.questions.items) {
    const { start, next } = advice[item.id];
    assert.ok(start in stations, `${item.id} 对应的站不在路线上`);
    if (next) assert.ok(next in stations, `${item.id} 的下一站不在路线上`);
    lit.add(start);
    if (next) lit.add(next);
  }
  for (const id of Object.keys(stations))
    assert.ok(lit.has(id), `${id} 没有对应的问题`);
});
