import test from 'node:test';
import assert from 'node:assert/strict';
import { knowledge, knowledgePrompt } from '../content/knowledge.ts';

test('motion prompt carries the selected duration, local context placeholders and reduced-motion requirement', () => {
  const entry = knowledge.find((item) => item.slug === 'stagger');
  const prompt = knowledgePrompt(entry, 1100);
  assert.match(prompt, /单次动效时长：1100ms/);
  assert.doesNotMatch(prompt, /700ms/);
  assert.match(prompt, /相邻项错开 90ms/);
  assert.match(prompt, /prefers-reduced-motion/);
  assert.match(prompt, /应用位置：\[补充页面或组件\]/);
});
test('layout prompts preserve their specific behavior without exposing irrelevant animation timing', () => {
  const entry = knowledge.find((item) => item.slug === 'scroll-snap');
  const prompt = knowledgePrompt(entry, 1100);
  assert.match(prompt, /overflow-x: auto/);
  assert.match(prompt, /不自动播放/);
  assert.doesNotMatch(prompt, /单次动效时长/);
  assert.match(prompt, /前后按钮/);
});
