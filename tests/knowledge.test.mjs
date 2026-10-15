import test from 'node:test';
import assert from 'node:assert/strict';
import {
  filterKnowledge,
  isResourceEntry,
  knowledge,
  knowledgePrompt,
  relatedKnowledge,
} from '../content/knowledge.ts';

void test('motion prompt carries the selected duration, local context placeholders and reduced-motion requirement', () => {
  const entry = knowledge.find((item) => item.slug === 'stagger');
  const prompt = knowledgePrompt(entry, 1100);
  assert.match(prompt, /单次动效时长：1100ms/);
  assert.doesNotMatch(prompt, /700ms/);
  assert.match(prompt, /相邻项错开 90ms/);
  assert.match(prompt, /prefers-reduced-motion/);
  assert.match(prompt, /应用位置：\[补充页面或组件\]/);
});
void test('layout prompts preserve their specific behavior without exposing irrelevant animation timing', () => {
  const entry = knowledge.find((item) => item.slug === 'scroll-snap');
  const prompt = knowledgePrompt(entry, 1100);
  assert.match(prompt, /overflow-x: auto/);
  assert.match(prompt, /不自动播放/);
  assert.doesNotMatch(prompt, /单次动效时长/);
  assert.match(prompt, /前后按钮/);
});
void test('component resources are 24 unique catalog entries with official sources', () => {
  const seen = new Set();
  for (const entry of knowledge) {
    assert.equal(seen.has(entry.slug), false, `duplicate slug ${entry.slug}`);
    seen.add(entry.slug);
    assert.match(entry.source.url, /^https:\/\//);
    assert.ok(entry.description.length > 12);
    assert.ok(entry.use.length > 8);
    assert.ok(entry.recipe.length > 8);
  }
  const resources = knowledge.filter(isResourceEntry);
  assert.equal(resources.length, 24);
  assert.equal(resources.filter((entry) => entry.group === 'micro').length, 12);
  assert.equal(resources.filter((entry) => entry.group === 'polish').length, 6);
  assert.equal(
    resources.filter((entry) => entry.group === 'inspiration').length,
    6,
  );
  assert.ok(!isResourceEntry(knowledge[0]));
});
void test('search finds resources by natural terms and the component category lists all 24', () => {
  const toast = filterKnowledge(knowledge, 'toast', '全部');
  assert.ok(toast.some((entry) => entry.slug === 'sonner'));
  const fluid = filterKnowledge(knowledge, '流体', '全部');
  assert.ok(fluid.some((entry) => entry.slug === 'animata'));
  const numbers = filterKnowledge(knowledge, '倒计时', '组件资源');
  assert.ok(numbers.some((entry) => entry.slug === 'numberflow'));
  assert.equal(filterKnowledge(knowledge, '', '组件资源').length, 24);
  assert.equal(filterKnowledge(knowledge, '', '动效百科').length, 3);
});
void test('resource prompts ask for selective adoption without fake motion timing', () => {
  const entry = knowledge.find((item) => item.slug === 'animata');
  const prompt = knowledgePrompt(entry, 1100);
  assert.doesNotMatch(prompt, /单次动效时长/);
  assert.match(prompt, /Fluid Tabs/);
  assert.match(prompt, /MIT/);
  assert.match(prompt, /只引入真正需要的单个交互/);
  assert.match(prompt, /prefers-reduced-motion/);
  assert.match(prompt, /https:\/\/animata\.design\//);
  assert.match(prompt, /实际需求：\[说明要改进的控件或反馈\]/);
});
void test('related entries stay in the same family and do not dump the whole catalog', () => {
  const sonner = knowledge.find((item) => item.slug === 'sonner');
  const related = relatedKnowledge(sonner);
  assert.ok(related.length <= 4);
  assert.ok(
    related.every((item) => isResourceEntry(item) && item.group === 'polish'),
  );
  assert.ok(!related.some((item) => item.slug === 'sonner'));
});
