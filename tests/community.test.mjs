import { test } from 'node:test';
import assert from 'node:assert/strict';
import { DatabaseSync } from 'node:sqlite';
import { readFileSync, readdirSync } from 'node:fs';
import {
  listNotes,
  saveNote as saveAuthenticatedNote,
  saveApplication,
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
void test('留言通过生产处理器落库，读回同一内容，按作品隔离；重试无重复', async () => {
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
void test('相同请求 id 不可替换已有内容', async () => {
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
void test('外站请求、未知作品、空白和超长留言拒绝且不写库', async () => {
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
void test('参数化保存输入，SQL 片段和 HTML 只是留言文字', async () => {
  const db = dbFixture(),
    d = {
      ...note(),
      body: "<script>alert(1)</script>'); DROP TABLE notes; --",
    };
  assert.equal((await saveNote(req('notes', d), db, ['niulai'])).status, 201);
  assert.equal(db.sql.prepare('SELECT body FROM notes').get().body, d.body);
});
void test('同一邮箱的两次不同留言各存一行，邮箱归一化，不在返回值暴露私人资料', async () => {
  const db = dbFixture(),
    d = {
      id: crypto.randomUUID(),
      name: '一位创作者',
      email: 'Maker@Example.com',
      role: '创造者',
      idea: '我想做一个观察街边树木的工具。',
      consent: true,
    };
  const r = await saveApplication(req('join', d), db);
  assert.equal(r.status, 201);
  assert.deepEqual(Object.keys(await r.json()).sort(), ['message', 'status']);
  const second = await saveApplication(
    req('join', {
      ...d,
      id: crypto.randomUUID(),
      email: 'maker@example.com',
      role: '企业合作',
      idea: '第二次提交另一个想法：想聊企业合作。',
    }),
    db,
  );
  assert.equal(second.status, 201);
  const rows = db.sql
    .prepare('SELECT email, role, idea FROM applications ORDER BY role')
    .all();
  assert.equal(rows.length, 2);
  assert.ok(rows.every((row) => row.email === 'maker@example.com'));
  assert.deepEqual(
    rows.map((row) => row.idea),
    ['第二次提交另一个想法：想聊企业合作。', d.idea],
  );
});
void test('同一次提交重试只存一次；不带 id 的旧请求仍然成功；坏 id 被拒', async () => {
  const db = dbFixture(),
    d = {
      id: crypto.randomUUID(),
      name: '访客',
      email: 'retry@example.com',
      role: '早期体验者',
      idea: '网络断了一下，我又点了一次。',
      consent: true,
    };
  assert.equal((await saveApplication(req('join', d), db)).status, 201);
  assert.equal((await saveApplication(req('join', d), db)).status, 201);
  const count = () =>
    db.sql.prepare('SELECT count(*) AS n FROM applications').get().n;
  assert.equal(count(), 1);
  const { id: _id, ...legacy } = d;
  assert.equal((await saveApplication(req('join', legacy), db)).status, 201);
  assert.equal(count(), 2);
  const generated = db.sql
    .prepare('SELECT id FROM applications WHERE id != ?')
    .get(d.id).id;
  assert.match(generated, /^[0-9a-f-]{36}$/);
  for (const id of ['not-a-uuid', 42, ''])
    assert.equal(
      (await saveApplication(req('join', { ...d, id }), db)).status,
      400,
    );
  assert.equal(count(), 2);
});
void test('记录来源入口和展示同意；不规范的来源不记，也不拦下提交', async () => {
  const db = dbFixture(),
    d = {
      name: '投稿的人',
      email: 'share@example.com',
      role: '创造者',
      idea: '我用莫奈的光与色 Skill 做了一组街景。',
      consent: true,
    };
  await saveApplication(
    req('join', {
      ...d,
      id: crypto.randomUUID(),
      topic: 'share-artist',
      allowDisplay: true,
    }),
    db,
  );
  await saveApplication(
    req('join', {
      ...d,
      id: crypto.randomUUID(),
      topic: '<script>',
      allowDisplay: 'yes',
    }),
    db,
  );
  const rows = db.sql
    .prepare('SELECT topic, allow_display FROM applications ORDER BY topic')
    .all();
  assert.deepEqual(
    rows.map((row) => [row.topic, row.allow_display]),
    [
      [null, 0],
      ['share-artist', 1],
    ],
  );
});
void test('联系页的「企业合作」也收进同一个申请收件箱', async () => {
  const db = dbFixture(),
    d = {
      name: '一位业务负责人',
      email: 'lead@example.com',
      role: '企业合作',
      idea: '想聊聊怎么把 AI 用进内容团队的周报流程。',
      consent: true,
    };
  assert.equal((await saveApplication(req('join', d), db)).status, 201);
  assert.equal(
    db.sql.prepare('SELECT role FROM applications').get().role,
    '企业合作',
  );
});
void test('未同意使用资料、坏邮箱或无效角色不会创建申请', async () => {
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
void test('数据库失败返回可重试错误，不把失败说成保存成功', async () => {
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

void test('匿名不能留言，客户端不能冒名，另一账户不能复用同一请求id', async () => {
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
