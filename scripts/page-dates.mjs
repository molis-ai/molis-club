// 「本页最近修改」的日期：按 Git 记录取每个页面相关文件最近一次提交的日期，写进 content/site/page-dates.json。
// 还没提交的改动算今天。改了页面以后运行：npm run dates
// 键是路由；以 /* 结尾的键覆盖它下面的所有子页（例如文章、方法详情）；'*' 是兜底。

import { execFileSync } from 'node:child_process';
import { writeFileSync } from 'node:fs';
import path from 'node:path';

const root = path.resolve(import.meta.dirname, '..');
const site = 'app/(site)';
const pages = {
  '/': [
    `${site}/page.tsx`,
    'app/_site/home',
    'content/site/home.ts',
    'content/site/studio.ts',
  ],
  '/work': [
    `${site}/work`,
    'content/site/work.ts',
    'app/_site/scenes/work.tsx',
    'app/_site/scenes/work.css',
  ],
  '/work/download': [`${site}/work/download`, 'content/site/work.ts'],
  '/tool': [
    `${site}/tool`,
    'content/site/tool.ts',
    'app/_site/scenes/tool.tsx',
    'app/_site/scenes/tool.css',
  ],
  '/life': [
    `${site}/life`,
    'content/site/life.ts',
    'app/_site/scenes/life.tsx',
    'app/_site/scenes/life.css',
  ],
  '/story': [
    `${site}/story`,
    'content/site/story.ts',
    'app/_site/scenes/story.tsx',
    'app/_site/scenes/story.css',
  ],
  '/world': [
    `${site}/world`,
    'content/site/world.ts',
    'app/_site/scenes/world.tsx',
    'app/_site/scenes/world.css',
  ],
  '/enterprise': [`${site}/enterprise`, 'content/site/enterprise.ts'],
  '/community': [
    `${site}/community/page.tsx`,
    `${site}/community/community.css`,
    'content/site/community.ts',
  ],
  '/community/methods': [
    `${site}/community/methods/page.tsx`,
    'content/knowledge.ts',
    'content/artists.ts',
  ],
  '/community/methods/*': [
    `${site}/community/methods`,
    'content/knowledge.ts',
    'content/artists.ts',
  ],
  '/about': [
    `${site}/about`,
    'content/site/about.ts',
    'content/site/studio.ts',
  ],
  '/team': [`${site}/team`, 'content/site/team.ts'],
  '/essays': [`${site}/essays/page.tsx`, 'content/stories.json'],
  '/essays/*': [`${site}/essays`, 'content/stories.json'],
  '/along-the-way': [`${site}/along-the-way`, 'content/site/along.ts'],
  '/contact': [
    `${site}/contact`,
    'content/site/contact.ts',
    'app/_site/contact-form.tsx',
  ],
  '/privacy': [`${site}/privacy`],
  '/login': [`${site}/login`, 'content/site/auth.ts'],
  '/account': [`${site}/account`, 'content/site/auth.ts'],
  '*': ['app/_site/site.css', 'app/_site/chrome.tsx'],
};

const git = (...args) =>
  execFileSync('git', args, { cwd: root, encoding: 'utf8' }).trim();
// 按北京时间算「今天」（Git 的提交日期也是本地时区）
const today = new Intl.DateTimeFormat('sv-SE', {
  timeZone: 'Asia/Shanghai',
}).format(new Date());

const dates = {};
for (const [route, files] of Object.entries(pages)) {
  const dirty = git('status', '--porcelain', '--', ...files);
  dates[route] = dirty
    ? today
    : git('log', '-1', '--format=%cs', '--', ...files) || today;
}
writeFileSync(
  path.join(root, 'content/site/page-dates.json'),
  `${JSON.stringify(dates, null, 2)}\n`,
);
console.log(dates);
