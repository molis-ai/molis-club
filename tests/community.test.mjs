import { test } from 'node:test';
import assert from 'node:assert/strict';
import { DatabaseSync } from 'node:sqlite';
import { readFileSync, readdirSync } from 'node:fs';
import {
  listNotes,
  saveNote as saveAuthenticatedNote,
  saveApplication,
  listDesignVotes,
  saveDesignVote,
} from '../lib/community-api.mjs';
function dbFixture() {
  const sql = new DatabaseSync(':memory:');
  for (const file of readdirSync(new URL('../drizzle/', import.meta.url))
    .filter((f) => f.endsWith('.sql'))
    .sort())
    sql.exec(
      readFileSync(new URL('../drizzle/' + file, import.meta.url), 'utf8'),
    );
  sql.exec(
    "INSERT INTO user(id,name,email,email_verified,created_at,updated_at) VALUES ('tester','试用访客','tester@example.com',0,0,0),('other','另一位','other@example.com',0,0,0)",
  );
  return {
    sql,
    prepare(query) {
      return {
        bind(...values) {
          const stmt = sql.prepare(query);
          return {
            async run() {
              return stmt.run(...values);
            },
            async first() {
              return stmt.get(...values);
            },
            async all() {
              return { results: stmt.all(...values) };
            },
          };
        },
      };
    },
  };
}
const saveNote = (request, db, slugs) =>
  saveAuthenticatedNote(request, db, slugs, { id: 'tester', name: '试用访客' });
const req = (route, data, origin = 'http://localhost:3000') =>
  new Request(`http://localhost:3000/api/${route}`, {
    method: 'POST',
    headers: { 'content-type': 'application/json', origin },
    body: JSON.stringify(data),
  });
const note = () => ({
  id: crypto.randomUUID(),
  work: 'niulai',
  name: '试用访客',
  body: '我需要它提醒我哪个任务在等确认。',
});
test('留言通过生产处理器落库，读回同一内容，按作品隔离；重试无重复', async () => {
  const db = dbFixture(),
    d = note();
  let r = await saveNote(req('notes', d), db, ['niulai', 'astralo']);
  assert.equal(r.status, 201);
  assert.equal((await r.json()).note.body, d.body);
  await saveNote(req('notes', d), db, ['niulai']);
  assert.equal(db.sql.prepare('SELECT count(*) AS n FROM notes').get().n, 1);
  r = await listNotes(
    new Request('http://localhost:3000/api/notes?work=niulai'),
    db,
    ['niulai'],
  );
  assert.equal((await r.json()).notes[0].name, d.name);
  r = await listNotes(
    new Request('http://localhost:3000/api/notes?work=astralo'),
    db,
    ['astralo'],
  );
  assert.deepEqual((await r.json()).notes, []);
});
test('相同请求 id 不可替换已有内容', async () => {
  const db = dbFixture(),
    d = note();
  await saveNote(req('notes', d), db, ['niulai']);
  assert.equal(
    (
      await saveNote(
        req('notes', { ...d, body: '现在这是一条不同的内容。' }),
        db,
        ['niulai'],
      )
    ).status,
    409,
  );
  assert.equal(db.sql.prepare('SELECT body FROM notes').get().body, d.body);
});
test('外站请求、未知作品、空白和超长留言拒绝且不写库', async () => {
  const db = dbFixture();
  for (const d of [
    { ...note(), work: 'nope' },
    { ...note(), body: ' ' },
    { ...note(), body: 'x'.repeat(1201) },
    { ...note(), id: 'bad' },
  ])
    assert.equal((await saveNote(req('notes', d), db, ['niulai'])).status, 400);
  assert.equal(
    (
      await saveNote(req('notes', note(), 'https://untrusted.example'), db, [
        'niulai',
      ])
    ).status,
    400,
  );
  assert.equal(db.sql.prepare('SELECT count(*) AS n FROM notes').get().n, 0);
});
test('参数化保存输入，SQL 片段和 HTML 只是留言文字', async () => {
  const db = dbFixture(),
    d = {
      ...note(),
      body: "<script>alert(1)</script>'); DROP TABLE notes; --",
    };
  assert.equal((await saveNote(req('notes', d), db, ['niulai'])).status, 201);
  assert.equal(db.sql.prepare('SELECT body FROM notes').get().body, d.body);
});
test('申请邮箱归一化且重复不覆盖，不在返回值暴露私人资料', async () => {
  const db = dbFixture(),
    d = {
      name: '一位创作者',
      email: 'Maker@Example.com',
      role: '创造者',
      idea: '我想做一个观察街边树木的工具。',
      consent: true,
    };
  const r = await saveApplication(req('join', d), db);
  assert.equal(r.status, 201);
  assert.deepEqual(Object.keys(await r.json()).sort(), ['message', 'status']);
  await saveApplication(
    req('join', {
      ...d,
      email: 'maker@example.com',
      idea: '第二次提交另一个想法',
    }),
    db,
  );
  const rows = db.sql.prepare('SELECT * FROM applications').all();
  assert.equal(rows.length, 1);
  assert.equal(rows[0].email, 'maker@example.com');
  assert.equal(rows[0].idea, d.idea);
});
test('未同意使用资料、坏邮箱或无效角色不会创建申请', async () => {
  const db = dbFixture(),
    d = {
      name: '访客',
      email: 'hello@example.com',
      role: '创造者',
      idea: '这是一个认真想过的想法。',
      consent: true,
    };
  for (const next of [
    { ...d, consent: false },
    { ...d, email: 'oops' },
    { ...d, role: 'admin' },
  ])
    assert.equal((await saveApplication(req('join', next), db)).status, 400);
  assert.equal(
    db.sql.prepare('SELECT count(*) AS n FROM applications').get().n,
    0,
  );
});
test('数据库失败返回可重试错误，不把失败说成保存成功', async () => {
  const db = {
    prepare() {
      throw new Error('offline');
    },
  };
  assert.equal(
    (await saveNote(req('notes', note()), db, ['niulai'])).status,
    503,
  );
  assert.equal(
    (
      await listNotes(
        new Request('http://localhost:3000/api/notes?work=niulai'),
        db,
        ['niulai'],
      )
    ).status,
    503,
  );
});

test('匿名不能留言，客户端不能冒名，另一账户不能复用同一请求id', async () => {
  const db = dbFixture(),
    d = { ...note(), name: '被冒充的人' };
  assert.equal(
    (await saveAuthenticatedNote(req('notes', d), db, ['niulai'], null)).status,
    401,
  );
  assert.equal(db.sql.prepare('SELECT count(*) AS n FROM notes').get().n, 0);
  const saved = await saveNote(req('notes', d), db, ['niulai']);
  assert.equal((await saved.json()).note.name, '试用访客');
  assert.equal(
    db.sql.prepare('SELECT user_id FROM notes').get().user_id,
    'tester',
  );
  assert.equal(
    (
      await saveAuthenticatedNote(req('notes', d), db, ['niulai'], {
        id: 'other',
        name: '另一位',
      })
    ).status,
    409,
  );
  assert.equal(db.sql.prepare('SELECT count(*) AS n FROM notes').get().n, 1);
});

const choices = ['daylight', 'folio', 'nocturne', 'cosmos', 'edition-c'];
const ballot = (extra = {}) => ({
  id: crypto.randomUUID(),
  choice: 'folio',
  name: '阿言',
  reason: '刊头和拼贴让人一眼记住。',
  borrow: '深空的行星切换',
  ...extra,
});
const listVotes = (db, voter) =>
  listDesignVotes(
    new Request(
      `http://localhost:3000/api/design-votes${voter ? `?voter=${voter}` : ''}`,
    ),
    db,
    choices,
  );
test('投票落库后计入票数，同一设备改票只保留一票', async () => {
  const db = dbFixture(),
    v = ballot();
  let r = await saveDesignVote(req('design-votes', v), db, choices);
  assert.equal(r.status, 201);
  assert.equal((await r.json()).updated, false);
  r = await saveDesignVote(
    req('design-votes', {
      ...v,
      choice: 'nocturne',
      reason: '改主意了，夜曲更有电影感。',
    }),
    db,
    choices,
  );
  assert.equal(r.status, 200);
  assert.equal((await r.json()).updated, true);
  await saveDesignVote(
    req('design-votes', ballot({ borrow: undefined })),
    db,
    choices,
  );
  const data = await (await listVotes(db, v.id)).json();
  assert.equal(data.total, 2);
  assert.equal(data.tally.nocturne, 1);
  assert.equal(data.tally.folio, 1);
  assert.equal(data.tally.daylight, 0);
  assert.equal(data.mine.choice, 'nocturne');
  assert.equal(data.mine.reason, '改主意了，夜曲更有电影感。');
  assert.equal(data.votes.length, 2);
  assert(data.votes.every((vote) => !('id' in vote)));
  assert.equal(
    db.sql.prepare('SELECT count(*) AS n FROM design_votes').get().n,
    2,
  );
});
test('未知方向、空理由、缺称呼、坏 id 与外站投票拒绝且不写库', async () => {
  const db = dbFixture();
  for (const d of [
    ballot({ choice: 'playful' }),
    ballot({ choice: 'toString' }),
    ballot({ reason: '  ' }),
    ballot({ reason: 'x'.repeat(1201) }),
    ballot({ name: '' }),
    ballot({ name: 'x'.repeat(41) }),
    ballot({ borrow: 42 }),
    ballot({ borrow: 'x'.repeat(1201) }),
    ballot({ id: 'bad' }),
  ])
    assert.equal(
      (await saveDesignVote(req('design-votes', d), db, choices)).status,
      400,
    );
  assert.equal(
    (
      await saveDesignVote(
        req('design-votes', ballot(), 'https://untrusted.example'),
        db,
        choices,
      )
    ).status,
    400,
  );
  assert.equal(
    db.sql.prepare('SELECT count(*) AS n FROM design_votes').get().n,
    0,
  );
  const data = await (await listVotes(db, 'not-a-uuid')).json();
  assert.equal(data.total, 0);
  assert.equal(data.mine, null);
});
test('投票数据库失败返回可重试错误', async () => {
  const db = {
    prepare() {
      throw new Error('offline');
    },
  };
  assert.equal(
    (await saveDesignVote(req('design-votes', ballot()), db, choices)).status,
    503,
  );
  assert.equal((await listVotes(db)).status, 503);
});
