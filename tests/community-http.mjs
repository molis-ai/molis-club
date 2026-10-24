// 社区与方法目录的 HTTP 检查（本地服务运行时：npm run test:http）。
// 方法详情都有定义与官方来源；艺术家 Skill 可下载、写明是 AI 创作试样；文章可读、文章之间互相链接。
import assert from 'node:assert/strict';
import { isResourceEntry, knowledge } from '../content/knowledge.ts';
import { artistSkills } from '../content/artists.ts';

const origin = process.env.TEST_ORIGIN || 'http://localhost:3000';
const decode = (text) =>
  text
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#x27;|&#39;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>');
async function page(path) {
  const response = await fetch(`${origin}${path}`);
  assert.equal(response.status, 200, path);
  return decode(await response.text());
}

/** 只看文字：中文长句会被拆进几个 <span>，比对前去掉标签 */
const words = (html) => html.replace(/<!-- -->/g, '').replace(/<[^>]+>/g, '');

const community = await page('/community');
assert.match(words(community), /带着好奇来，带点什么走，再带点什么回来。/);
assert.match(community, /一朵好奇/);
assert.match(community, /Artist Skill/);
assert.match(community, /niul\.ai/);
assert.match(community, /DropAgent/);
assert.match(community, /AI 创作试样/);
// 一朵好奇可以存成 SVG；艺术家 Skill 可以下载
assert(community.includes('download="一朵好奇-Molis-AI.svg"'), 'flower SVG');
assert(community.includes('href="/downloads/artists/'), 'artist skill zip');
// 方法目录：搜索交给目录页，三个去处各带一个分类
assert(community.includes('action="/community/methods"'), 'methods search');
for (const type of ['artists', 'web', 'sources'])
  assert(
    community.includes(`href="/community/methods?type=${type}"`),
    `methods door ${type}`,
  );
// 「再带点什么回来」：分享作品、说说试得怎么样预选联系主题；按作品的 share-* 入口在访客动过手之后才出现
assert(
  /href="\/contact\?topic=(creator|share-[a-z]+)"/.test(community),
  'share entry preselects the contact topic',
);
assert(community.includes('href="/contact?topic=feedback"'), 'feedback');
// 白房子（负责人 2026-10-22，D2）：三张团队插画，结尾是首页挪来的那段画室；拖动提示之类的引导字不再回来
for (const art of ['art-window', 'art-book', 'art-greenhouse'])
  assert(community.includes(`/site/${art}-`), `illustration ${art}`);
assert(community.includes('/site/home-painting-poster'), 'painting ending');
for (const text of ['拖一拖', '左右拖'])
  assert(!words(community).includes(text), `no「${text}」`);
// 首屏大幅插画、作品区新画廊定稿（负责人 2026-10-24，D2）：样张参数和旧画廊都已删掉
assert(community.includes('class="m-com-hero"'), 'hero');
assert(!community.includes('data-hero'), 'no hero samples');
assert(community.includes('class="m-com-shows-head"'), 'gallery opening');
assert(community.includes('class="m-com-rail'), 'five-name rail');
assert(!community.includes('m-com-steps'), 'no numbered how-to list');
for (const note of ['示意', 'AI 创作试样 · 非艺术家原作'])
  assert(words(community).includes(note), `disclosure ${note}`);
const old = await page('/community?hero=a&works=current');
assert(old.includes('class="m-com-shows-head"'), 'no old gallery');
assert(!old.includes('m-com-steps'), 'no old gallery steps');

const methods = await page('/community/methods');
for (const entry of knowledge)
  assert(methods.includes(entry.name), `methods list includes ${entry.name}`);
for (const skill of artistSkills)
  assert(methods.includes(skill.name), `methods list includes ${skill.name}`);

for (const entry of knowledge) {
  const html = await page(`/community/methods/${entry.slug}`);
  assert(words(html).includes(entry.description), `${entry.slug}: description`);
  assert(html.includes(entry.source.url), `${entry.slug}: official source`);
  if (!isResourceEntry(entry))
    assert.match(
      html,
      /prefers-reduced-motion|减少动态/,
      `${entry.slug}: reduced motion`,
    );
}

for (const skill of artistSkills) {
  const html = await page(`/community/methods/artists/${skill.slug}`);
  assert(
    html.includes(`href="/downloads/artists/${skill.slug}.zip"`),
    `${skill.slug}: download`,
  );
  assert(html.includes(`$${skill.slug}`), `${skill.slug}: invocation`);
  if (skill.image)
    assert.match(html, /AI 创作试样/, `${skill.slug}: AI sample disclosure`);
  const zip = await fetch(`${origin}/downloads/artists/${skill.slug}.zip`);
  assert.equal(zip.status, 200);
  assert.equal(zip.headers.get('content-type'), 'application/zip');
}

const essay = await page('/essays/human-scale');
assert.match(essay, /一骏/);
assert(
  essay.includes('href="/essays/idealism"') || essay.includes('href="/essays"'),
);
for (const match of essay.matchAll(/href="#([^"]+)"/g))
  if (match[1] !== 'main')
    assert(essay.includes(`id="${match[1]}"`), `TOC anchor ${match[1]}`);

console.log(
  'PASS: community works, the methods catalog, method and artist detail pages, downloads and essays.',
);
