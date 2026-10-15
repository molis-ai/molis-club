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

// 新站文案以 docs/studio-intro.md 为事实来源（specs/site-rebuild/visual-storyboard.md 第 11 节）。
// 文案可以压缩重组，所以这里不再要求每一句都是原句，而是核对事实：
// 阶段与第 3 章一致；数字都出自底稿；沿途每件的去处、团队每人的来路、企业合作内部探索的阶段都对得上原文；
// 仍然以原句出现的部分（工作室、产品正文、各页收起的「展开看全文」）继续逐句核对；内部编辑备注不对外。
// 原句里用分号连着的两半分开放时，句末的分号写成句号——核对时把句末标点去掉再找。

const doc = readFileSync(
  new URL('../docs/studio-intro.md', import.meta.url),
  'utf8',
)
  // 底稿里加粗的句子：去掉 ** 再比
  .replaceAll('**', '');

/** 底稿里从 start 到下一个 end 之间的一段 */
const between = (start, end) => {
  const from = doc.indexOf(start);
  assert.ok(from >= 0, `底稿里找不到「${start}」`);
  const to = doc.indexOf(end, from + start.length);
  return doc.slice(from, to < 0 ? undefined : to);
};
const chapter3 = between('## 3. 产品总览', '## 4. 产品介绍');
const chapter5 = between('## 5. 企业合作', '## 6. 社区');
const appendixA = between('## 附录 A', '## 附录 B');

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

const trimEnd = (text) => text.replace(/[。；]$/, '');
const bare = (text) => text.replace(/（[^）]*）/g, '');

function assertVerbatim(text, where, scope = doc) {
  assert.ok(
    scope.includes(trimEnd(text)),
    `${where}：「${text}」不在 docs/studio-intro.md 里`,
  );
}

const { studio, story } = await import('../content/site/studio.ts');
const { access, productIds, products, relations } =
  await import('../content/site/products.ts');
const { workProgress } = await import('../content/site/work.ts');
const { toolProgress } = await import('../content/site/tool.ts');
const { lifeProgress } = await import('../content/site/life.ts');
const { storyProgress } = await import('../content/site/story.ts');
const { worldProgress } = await import('../content/site/world.ts');
const { progressBlocks } = await import('../content/site/progress.ts');
const { team, members, companies, origin, guess } =
  await import('../content/site/team.ts');
const { aboutName, aboutCare, aboutCareLead, aboutUi } =
  await import('../content/site/about.ts');
const { enterprise } = await import('../content/site/enterprise.ts');
const { form, contactPage } = await import('../content/site/contact.ts');
const { along, alongGroups, flowOf } = await import('../content/site/along.ts');
const { community, appendixTools } =
  await import('../content/site/community.ts');

// ---------------------------------------------------------------------
// 仍以原句出现的部分
// ---------------------------------------------------------------------

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

void test('各产品页「展开看原文」里的当前进展原句都在底稿里', () => {
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

// ---------------------------------------------------------------------
// 阶段
// ---------------------------------------------------------------------

void test('阶段按第 3 章：Work 开源开发中；Tool 开发中；Life 原型探索中；Story 开发中；World 概念设计', () => {
  assert.deepEqual(
    productIds.map((id) => products[id].stage),
    ['开源开发中', '开发中', '原型探索中', '开发中', '概念设计'],
  );
  for (const id of productIds)
    assert.ok(
      chapter3.includes(`${products[id].name} |`) &&
        chapter3.includes(`${products[id].stage}。`),
      `${id} 的阶段在第 3 章里对不上`,
    );
});

void test('「当前进展」的块：去掉括号里的注，都能在这件产品的小节或第 3 章里找到；已有与还没有不重叠', () => {
  const sections = {
    work: between('### 4.1', '### 4.2'),
    tool: between('### 4.2', '### 4.3'),
    life: between('### 4.3', '### 4.4'),
    story: between('### 4.4', '### 4.5'),
    world: between('### 4.5', '## 5.'),
  };
  for (const id of productIds) {
    const scope = sections[id] + chapter3;
    const { have, notYet } = progressBlocks[id];
    for (const text of [...have, ...notYet]) {
      // World「已经有的」是新写的一块：这一页上的构想与概念示意
      if (id === 'world' && have.includes(text)) continue;
      assert.ok(
        scope.includes(bare(text)),
        `${id}：块「${text}」在第 4 章小节与第 3 章里找不到出处`,
      );
    }
    assert.equal(
      have.filter((text) => notYet.includes(text)).length,
      0,
      `${id}：同一块既在「已有」又在「还没有」`,
    );
  }
  // 还没有原型的 World，「已有」里不能出现原型、版本、实现
  for (const text of progressBlocks.world.have)
    assert.ok(!/原型|版本|实现|下载/.test(text), `World 已有：「${text}」`);
});

// ---------------------------------------------------------------------
// 数字：页面文案里的每个数字都能在底稿里找到
// ---------------------------------------------------------------------

void test('页面文案里出现的数字都出自底稿，不凭空出现数字', () => {
  const site = [
    ...strings(team),
    ...strings(members, new Set(['id', 'photo'])),
    ...strings(origin),
    ...strings(guess),
    ...strings(enterprise),
    ...strings(along),
    ...strings(alongGroups, new Set(['href', 'no'])),
    ...strings(aboutUi),
    ...strings(progressBlocks),
    ...strings(community),
    ...strings(contactPage),
  ];
  for (const text of site)
    for (const number of text.match(/\d+(?:\.\d+)?\+?/g) ?? [])
      assert.ok(
        doc.includes(number),
        `「${text}」里的数字 ${number} 在底稿里找不到`,
      );
});

// ---------------------------------------------------------------------
// 企业合作
// ---------------------------------------------------------------------

void test('企业合作：标题、问题、三步、四项服务的原文都在；压缩的句子与图示里的词出自对应原文', () => {
  assertVerbatim(enterprise.title, 'enterprise');
  for (const text of enterprise.intro) assertVerbatim(text, 'enterprise intro');
  for (const step of enterprise.steps)
    assert.ok(enterprise.intro[2].includes(step), `一行三步：「${step}」`);
  for (const item of enterprise.questions.items) {
    for (const text of [item.title, ...item.paragraphs])
      assertVerbatim(text, `enterprise ${item.id}`, chapter5);
    const source = item.title + item.paragraphs.join('');
    assert.ok(source.includes(trimEnd(item.line)), `${item.id} 的一句`);
    for (const word of item.words)
      assert.ok(source.includes(word), `${item.id} 小图示里的「${word}」`);
  }
  assertVerbatim(enterprise.path.lead, 'enterprise path', chapter5);
  for (const stage of enterprise.path.stages)
    for (const text of [stage.title, ...stage.paragraphs])
      assertVerbatim(text, 'enterprise stage', chapter5);
  for (const station of Object.values(enterprise.path.stations)) {
    assertVerbatim(station.name, station.id, chapter5);
    for (const text of station.paragraphs)
      assertVerbatim(text, station.id, chapter5);
    const source = station.paragraphs.join('');
    for (const thing of station.leaves)
      assert.ok(source.includes(thing), `${station.id} 留下的「${thing}」`);
  }
  for (const form of enterprise.path.forms)
    assert.ok(
      enterprise.path.stations.build.paragraphs[0].includes(form),
      `产品形态「${form}」`,
    );
});

void test('企业合作：内部探索三项的阶段与 5.4 一致，都盖「不是客户案例」；做这件事的人只摘 5.5', () => {
  assert.ok(enterprise.explore.tag.includes('不是客户案例'));
  for (const row of enterprise.explore.rows) {
    assert.ok(chapter5.includes(`${row.name}：`), `${row.name} 不在 5.4`);
    assertVerbatim(row.question, row.name, chapter5);
    for (const text of row.paragraphs) assertVerbatim(text, row.name, chapter5);
    assert.ok(
      chapter5.includes(`${row.stage}。`),
      `${row.name} 的阶段「${row.stage}」与 5.4 对不上`,
    );
    for (const block of [...row.have, ...row.notYet])
      assert.ok(row.paragraphs[1].includes(block), `${row.name}：「${block}」`);
  }
  for (const group of enterprise.people.groups) {
    assertVerbatim(group.title, 'enterprise people', chapter5);
    for (const member of group.members)
      assert.ok(
        chapter5.includes(member.name + trimEnd(member.text)),
        `5.5 里找不到「${member.name}${member.text}」`,
      );
  }
});

// ---------------------------------------------------------------------
// 团队
// ---------------------------------------------------------------------

void test('团队：八人顺序与身份按第 7 章；经历与自述是原句；来路点阵与猜自述只用本人写明的内容', () => {
  assert.deepEqual(
    members.map((member) => `${member.name}·${member.role}`),
    [
      '王一骏·发起人',
      '徐晶·联合创始人',
      '赵壮实·联合创始人',
      '谢俊·联合创始人',
      '杨鹏飞·联合创始人',
      '庄昊哲·联合创始人',
      '隋欣怡·联合创始人',
      '靳曲·联合创始人',
    ],
  );
  for (const text of strings(team)) assertVerbatim(text, 'team');
  for (const member of members) {
    for (const text of strings(member, new Set(['id', 'photo', 'past'])))
      assertVerbatim(text, `team ${member.name}`);
    for (const company of member.past ?? []) {
      assert.ok(companies.includes(company), `${company} 不在点阵的列里`);
      assert.ok(
        member.experience?.includes(company),
        `${member.name} 的经历里没有写「${company}」`,
      );
    }
  }
  assertVerbatim(origin.before, 'team origin');
  assertVerbatim(origin.after, 'team origin');
  for (const quote of guess.quotes) {
    const member = members.find((item) => item.id === quote.who);
    assert.ok(member, `猜自述：没有 ${quote.who}`);
    const own = `${member.tags ?? ''}${member.motto ?? ''}`;
    assert.ok(own.includes(quote.text), `「${quote.text}」不是${member.name}的自述`);
    assert.ok(!quote.text.includes(member.name), `「${quote.text}」带着答案`);
  }
});

// ---------------------------------------------------------------------
// 沿途
// ---------------------------------------------------------------------

void test('沿途：开头、结尾、组名与每件的原文片段都在附录 A；去处严格按原文', () => {
  for (const text of [...along.intro, along.outro, along.hook])
    assertVerbatim(text, 'along', appendixA);
  let total = 0;
  for (const group of alongGroups) {
    assertVerbatim(group.title, `along ${group.no}`, appendixA);
    for (const item of group.items) {
      total += 1;
      assert.ok(appendixA.includes(item.name), `${item.name} 不在附录 A`);
      for (const text of [item.ask, ...item.now])
        assertVerbatim(text, `along ${item.name}`, appendixA);
      const now = item.now.join('');
      const flow = flowOf(item);
      const where = `${item.name} → ${flow}`;
      if (flow === 'work' || flow === 'tool' || flow === 'story')
        assert.ok(now.includes(`Molis ${item.into}`), where);
      else if (flow === 'lab') assert.ok(now.includes('Lab'), where);
      else if (flow === 'design') assert.equal(group.no, 'A.8', where);
      else if (flow === 'archived') assert.ok(now.includes('归档'), where);
      else
        assert.ok(
          !/Molis (Work|Tool|Story)|归档|Lab/.test(now),
          `${item.name} 原文写了去处，却落进了「各自留着」`,
        );
      if (item.where.includes('app'))
        assert.ok(now.includes('独立'), `${item.name} 标了独立应用`);
    }
  }
  assert.equal(total, 54);
});

// ---------------------------------------------------------------------
// 关于、联系、社区
// ---------------------------------------------------------------------

void test('关于、联系、社区：原句与压缩后的词都对得上底稿', () => {
  assertVerbatim(aboutName, 'about');
  assertVerbatim(aboutCare, 'about');
  assert.ok(aboutCare.startsWith(aboutCareLead));
  for (const word of aboutUi.fromWords)
    assert.ok(story.origin.paragraphs[0].includes(word), `从哪来：「${word}」`);
  aboutUi.practiceTags.forEach((tags, index) => {
    for (const tag of tags)
      assert.ok(
        studio.practice.rows[index].how.includes(tag),
        `落到产品里：「${tag}」`,
      );
  });
  assertVerbatim(form.handling, 'contact');
  for (const step of contactPage.flow.slice(1))
    assert.ok(form.handling.includes(step), `联系的三步：「${step}」`);
  for (const text of strings(community)) assertVerbatim(text, 'community');
  for (const text of strings(appendixTools))
    assertVerbatim(text, 'community appendix');
});

// ---------------------------------------------------------------------
// 不对外的
// ---------------------------------------------------------------------

void test('内部编辑备注、待补占位与未定口径不出现在任何页面文案里', () => {
  const note = doc.slice(
    doc.indexOf('## 内部编辑备注'),
    doc.indexOf('## 附录 A'),
  );
  for (const phrase of [
    '等待负责人补充',
    '发布前可以直接核对',
    '本轮已确认的编辑决定',
  ])
    assert.ok(note.includes(phrase));
  const site = JSON.stringify([
    studio,
    story,
    products,
    team,
    members,
    origin,
    guess,
    enterprise,
    along,
    alongGroups,
    aboutUi,
    progressBlocks,
    community,
    contactPage,
  ]);
  for (const phrase of ['月百万+', '待本人补充', '资料待补', '待补'])
    assert.ok(
      !site.includes(phrase),
      `新站文案里出现了内部备注的「${phrase}」`,
    );
});
