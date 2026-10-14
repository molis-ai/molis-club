import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { registerHooks } from 'node:module';

// 内容模块之间用不带扩展名的相对路径互相引用（给打包器用）；在 Node 里补上 .ts 再找
registerHooks({
  resolve(specifier, context, next) {
    try {
      return next(specifier, context);
    } catch (error) {
      if (specifier.startsWith('.') && !/\.[a-z]+$/.test(specifier))
        return next(`${specifier}.ts`, context);
      throw error;
    }
  },
});

const { studio, story } = await import('../content/site/studio.ts');
const { access, productIds, products, relations } =
  await import('../content/site/products.ts');
const { workProgress } = await import('../content/site/work.ts');
const { toolProgress } = await import('../content/site/tool.ts');
const { lifeProgress } = await import('../content/site/life.ts');
const { storyProgress } = await import('../content/site/story.ts');
const { worldProgress } = await import('../content/site/world.ts');

// 新站文案取自 docs/studio-intro.md 的原句（specs/site-rebuild/spec.md 第 9 节）。
// 这里逐句核对：收进 content/site 的「原句」都还在底稿里，一个字都没改。
// 原句里用分号连着的两半分开放时，句末的分号写成句号——核对时把句末标点去掉再找。

const doc = readFileSync(
  new URL('../docs/studio-intro.md', import.meta.url),
  'utf8',
)
  // 底稿里加粗的句子：去掉 ** 再比
  .replaceAll('**', '');

/** 一个对象里的所有字符串 */
function strings(value, skip = new Set(), out = []) {
  if (typeof value === 'string') out.push(value);
  else if (Array.isArray(value))
    value.forEach((item) => strings(item, skip, out));
  else if (value && typeof value === 'object')
    for (const [key, item] of Object.entries(value))
      if (!skip.has(key)) strings(item, skip, out);
  return out;
}

function assertVerbatim(text, where) {
  const plain = text.replace(/[。；]$/, '');
  assert.ok(
    doc.includes(plain),
    `${where}：「${text}」不在 docs/studio-intro.md 里`,
  );
}

void test('工作室与故事的句子都是底稿原句', () => {
  for (const text of strings(studio))
    assertVerbatim(text, 'content/site/studio.ts');
  for (const text of strings(story))
    assertVerbatim(text, 'content/site/studio.ts story');
});

void test('五件产品的标题、一句话、适合的时刻、阶段与正文都是底稿原句', () => {
  // form（作品标签里的形态）是展签式写法，不是原句
  const skip = new Set(['id', 'form']);
  for (const id of productIds)
    for (const text of strings(products[id], skip))
      assertVerbatim(text, `content/site/products.ts ${id}`);
  for (const text of strings(relations)) assertVerbatim(text, 'relations');
  for (const text of strings(access)) assertVerbatim(text, 'access');
});

void test('阶段按第 3 章：Work 开源开发中；Tool 开发中；Life 原型探索中；Story 开发中；World 概念设计', () => {
  assert.deepEqual(
    productIds.map((id) => products[id].stage),
    ['开源开发中', '开发中', '原型探索中', '开发中', '概念设计'],
  );
});

void test('各产品页「当前进展」里标为原句的部分都在底稿里', () => {
  const quoted = [
    ...workProgress.have,
    ...workProgress.notYet,
    ...workProgress.now,
    ...toolProgress.have,
    ...toolProgress.notYet,
    // toolProgress.now、storyProgress.now、worldProgress.have 是新写的引导句
    ...lifeProgress.have,
    ...lifeProgress.notYet,
    ...lifeProgress.now,
    ...storyProgress.have,
    ...storyProgress.notYet,
    ...worldProgress.notYet,
    ...worldProgress.now,
  ];
  for (const text of quoted) assertVerbatim(text, '当前进展');
});

void test('内部编辑备注不对外', () => {
  const note = doc.slice(
    doc.indexOf('## 内部编辑备注'),
    doc.indexOf('## 附录 A'),
  );
  const site = JSON.stringify([studio, story, products]);
  for (const phrase of [
    '等待负责人补充',
    '发布前可以直接核对',
    '本轮已确认的编辑决定',
  ])
    assert.ok(note.includes(phrase));
  for (const phrase of ['月百万+', '待本人补充', '资料待补'])
    assert.ok(
      !site.includes(phrase),
      `新站文案里出现了内部备注的「${phrase}」`,
    );
});

const { team, members } = await import('../content/site/team.ts');
const { aboutName, aboutCare } = await import('../content/site/about.ts');
const { enterprise } = await import('../content/site/enterprise.ts');
const { form } = await import('../content/site/contact.ts');
const { along, alongGroups } = await import('../content/site/along.ts');

void test('团队、关于、企业合作、联系、沿途页里取自底稿的句子都是原句', () => {
  // 团队：第 7 章（id、头像是页面用的，不是文案）
  for (const text of strings(team)) assertVerbatim(text, 'team');
  for (const member of members)
    for (const text of strings(member, new Set(['id', 'photo'])))
      assertVerbatim(text, `team ${member.name}`);
  // 关于：1.3 的第一句与第二句
  assertVerbatim(aboutName, 'about');
  assertVerbatim(aboutCare, 'about');
  // 企业合作：标题、开场三段、5.1 五个问题、5.2 开头一句
  assertVerbatim(enterprise.title, 'enterprise');
  for (const text of enterprise.intro) assertVerbatim(text, 'enterprise intro');
  for (const item of enterprise.questions.items)
    for (const text of [item.title, ...item.paragraphs])
      assertVerbatim(text, `enterprise ${item.id}`);
  assertVerbatim(enterprise.path.lead, 'enterprise path');
  // 联系：处理方式照第 5 章末尾原句
  assertVerbatim(form.handling, 'contact');
  // 沿途：附录 A 的开头、结尾、组名，以及每件「它关心的问题」「现在在哪」的原句片段
  for (const text of [...along.intro, along.outro])
    assertVerbatim(text, 'along');
  for (const group of alongGroups) {
    assertVerbatim(group.title, `along ${group.no}`);
    for (const item of group.items)
      for (const text of [item.ask, ...item.now])
        assertVerbatim(text, `along ${item.name}`);
  }
});

const { community, appendixTools } =
  await import('../content/site/community.ts');

void test('社区页取自第 6 章与附录 A.1 的句子都是原句', () => {
  for (const text of strings(community)) assertVerbatim(text, 'community');
  for (const text of strings(appendixTools))
    assertVerbatim(text, 'community appendix');
});
