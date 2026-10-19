import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

// 企业合作样张（D1）：每站「业务团队 / Molis / 一起」做的事和留下的东西，都是 docs/studio-intro.md 第 5 章的原句片段，
// 一个字都没改；路线收尾是 5.4 原句。现版的建议起点仍要五个问题都落在四站上（样张不再显示这层对应）。

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

void test('样张里每站的事与留下的东西都是第 5 章原句片段', () => {
  const { line, path } = enterprise;
  const ids = Object.keys(path.stations);
  assert.deepEqual(Object.keys(line.rows), ids);
  for (const id of ids) {
    assert.ok(line.rows[id].length > 0, `${id} 没有写双方的事`);
    for (const row of line.rows[id]) {
      assert.ok(
        row.both ? !row.you && !row.we : row.you || row.we,
        `${id}：一行要么一起做，要么分给业务团队 / Molis`,
      );
      for (const act of [row.you, row.we, row.both].filter(Boolean)) {
        verbatim(act.text, id);
        if (act.detail) verbatim(act.detail, id);
      }
    }
    if (line.after[id]) verbatim(line.after[id], `${id} 留下`);
    for (const leaf of path.stations[id].leaves) verbatim(leaf, `${id} 留下`);
  }
  for (const form of path.forms) verbatim(form, '产品形态');
  verbatim(path.lead, '路线开头');
  verbatim(line.from, '路线收尾');
  for (const text of enterprise.people.abilities.map((item) => item.title))
    verbatim(text, '5.5 小标题');
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
