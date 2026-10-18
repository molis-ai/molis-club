import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

// 企业合作样张（D1）：每站适合谁、「业务团队 / Molis / 一起」做的事和留下的东西，都是 docs/studio-intro.md 第 5 章的原句片段，
// 一个字都没改；五个问题的建议起点仍落在四站上。

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
    verbatim(line.fit[id], `${id} 适合`);
    assert.ok(
      line.fit[id].startsWith('适合'),
      `${id}：适合谁那句要以「适合」开头`,
    );
    if (line.after[id]) verbatim(line.after[id], `${id} 留下`);
    for (const leaf of path.stations[id].leaves) verbatim(leaf, `${id} 留下`);
  }
  for (const form of path.forms) verbatim(form, '产品形态');
  verbatim(path.lead, '怎么继续');
  for (const text of enterprise.people.abilities.map((item) => item.title))
    verbatim(text, '5.5 小标题');
});

void test('五个问题的建议起点都落在样张的四站上', () => {
  const { advice, stations } = enterprise.path;
  for (const item of enterprise.questions.items) {
    const { start, next } = advice[item.id];
    assert.ok(start in stations, `${item.id} 的起点不在路线上`);
    if (next) assert.ok(next in stations, `${item.id} 的下一站不在路线上`);
  }
});
