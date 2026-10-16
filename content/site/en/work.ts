// Molis Work 页的英文（对应 content/site/work.ts，形状一致）。章节正文取自英文版 products.work；
// 画面里的项目、资料、人名、时间都是示意数据。标「新写」的三章在中文里也待负责人确认，英文跟着中文走。
import type * as zh from '../work';
import { products } from './products';

const work = products.work;
const [arrange, together, record, grow] = work.sections;

export const workChapters: typeof zh.workChapters = [
  {
    id: 'scatter',
    kicker: 'Day 1 · Early morning',
    title: 'One proposal, across many days, several tools, and AI chats.',
    paragraphs: work.opening,
    steps: [
      'Sources, chats, docs, and to-dos, scattered all over.',
      'They all belong to one thing: a report due Thursday.',
      'Gather them into one workspace, and pick up from here next time.',
    ],
    draft: true,
  },
  {
    id: 'arrange',
    kicker: 'Day 1 · Morning',
    title: arrange.title,
    paragraphs: arrange.paragraphs,
    steps: [
      'Pick the tools for this job: sources, feeds, docs.',
      'Your calendar, notes, and to-dos are yours. They follow you to every project.',
      'Search for a word, and results from every tool come up together.',
    ],
  },
  {
    id: 'together',
    kicker: 'Day 1 · Afternoon',
    title: together.title,
    paragraphs: together.paragraphs,
    steps: [
      'A report, half written.',
      'The assistant outlines it from what’s there. Every change shows.',
      'You click “Take over.” The assistant’s changes stay put.',
      'You rewrite one line, and it becomes your call.',
    ],
  },
  {
    id: 'relay',
    kicker: 'Day 2 · Morning',
    title: 'The assistant calls on a few plugins to finish the job.',
    paragraphs: [
      'Before the review, you need a comparison of three companies. The assistant pulls sources from the feed, builds the comparison in a data table, makes a one-page slide, then books the review on the calendar and leaves a follow-up in to-dos.',
      'Everything it makes stays in the project, and each piece links back to its source.',
    ],
    steps: [
      'The assistant pulls three sources from the feed.',
      'It turns them into a comparison table and a one-page slide.',
      'It books the review on the calendar and adds a follow-up to-do.',
      'All five results are in the project, each with its source.',
    ],
    draft: true,
  },
  {
    id: 'grow',
    kicker: 'Day 2 · Noon',
    tag: 'Preview',
    title: grow.title,
    paragraphs: grow.paragraphs,
    steps: [
      'You say what you need: a review log.',
      'An agent proposes a plan and builds it in a sandbox.',
      'It passes checks and review.',
      'It goes into the project, where the assistant and authorized agents can use it too.',
    ],
  },
  {
    id: 'talk',
    kicker: 'Day 2 · Afternoon',
    tag: 'First version built · Not publicly deployed',
    title: 'Talk it through, with the context and results attached.',
    paragraphs: [
      'A colleague sees the slide in the group chat and starts a thread from a message, quoting a passage from the doc and the results. The conclusion goes back into the project, so whoever picks it up next can see how you got there.',
      'A first version of group chat and threads is built but not publicly deployed. AI doesn’t take part in group chats for now.',
    ],
    steps: [
      'A colleague quotes the slide and asks a question.',
      'It becomes a thread, and you reply.',
      'The thread reaches a conclusion.',
      'The conclusion goes back to the project, where anyone picking it up can see it.',
    ],
    draft: true,
  },
  {
    id: 'goal',
    kicker: 'Day 3',
    title: record.title,
    paragraphs: record.paragraphs,
    steps: [
      'The Goal keeps the aim, the progress, the problems, and the open decisions.',
      'Switch to Claude Code: it reads the same record and keeps writing from section 3.',
      'At the end, check the deliverable against the original brief.',
    ],
  },
  {
    id: 'away',
    kicker: 'Day 3 · Night',
    tag: 'In development',
    title: 'While you’re away, the assistant keeps going.',
    paragraphs: [
      'After you log off, the assistant follows up on what’s due, going by the Goal. It flags failures, stays quiet during Do Not Disturb hours, and leaves you only what needs your judgment, with the reasons written down.',
      'Proactive follow-up is still in development.',
    ],
    steps: [
      'You’ve logged off. No notifications during quiet hours.',
      'Due items get followed up. Failures are retried and logged.',
      'Anything that needs a decision gets set aside for you.',
      'Next morning, there’s one thing for you to decide, with the reason.',
    ],
    draft: true,
  },
];

export const handoff: typeof zh.handoff = {
  kicker: 'Try it yourself',
  title: 'Who should pick this up?',
  lead: 'Choose who takes it over. The sources, progress, results, and discussion go along as they are, and they carry on from where it stopped. When a decision is needed, the card comes back to you.',
  note: 'Interactive mockup',
  card: {
    name: 'Industry watch report',
    part: 'Section 3 · Our take',
    attachments: [
      { key: 'files', label: 'Sources', value: '3' },
      { key: 'progress', label: 'Progress', value: 'Up to paragraph 2' },
      { key: 'results', label: 'Results', value: 'Table, slide' },
      { key: 'talk', label: 'Discussion', value: 'Price goes in' },
    ],
  },
  targets: [
    {
      id: 'assistant',
      name: 'Assistant',
      who: 'The assistant in Molis Work',
      resume: 'Keeps writing from section 3, paragraph 2, with every change marked.',
      ask: 'Company C counts its numbers differently from the other two. Whose method should we use?',
    },
    {
      id: 'codex',
      name: 'Codex',
      who: 'An authorized outside agent',
      resume: 'Reads the same Goal record and fills in the comparison table.',
      ask: 'Two sources disagree on a number. Which one should it use?',
    },
    {
      id: 'colleague',
      name: 'A colleague',
      who: 'Zhou, from the project chat',
      resume: 'Keeps the thread going, with the quoted slide attached.',
      ask: 'Should the conclusion go in the summary? Waiting on your OK.',
    },
    {
      id: 'me',
      name: 'Yourself',
      who: 'You',
      resume: 'Back to section 3, paragraph 2. The assistant’s outline and changes are all there.',
      ask: '',
    },
  ],
  labels: {
    from: 'With you',
    carry: 'Goes with it',
    resume: 'Picks up from',
    back: 'Needs your call, so the card is back with you',
    reset: 'Start over',
    choose: 'Hand over',
  },
};

/** 当前进展：英文版 products.work.progress 拆开放，和中文的拆法一致 */
export const workProgress: typeof zh.workProgress = {
  have: [
    'Molis Work is open source and in development, and for now it’s mainly for individuals on their own machines.',
    'The workspace, built-in tools, and AI collaboration are working in development and being refined.',
    'Your work data stays on your machine; when you use AI, it calls the model service you’ve configured.',
  ],
  notYet: [
    'Plugin creation is still in preview. Team spaces, multi-device sync, and plugin sharing are later directions.',
    'The new version in development doesn’t have an official installer yet.',
  ],
  now: [
    'You can build it from source by following the repository’s instructions. The older public releases and the workspace now in development are separate, so look at each on its own.',
  ],
};

export const workGo: typeof zh.workGo = {
  github: 'See the source code',
  build: 'How to build from source',
  follow: 'Follow the new version',
};

export const workPage: typeof zh.workPage = {
  window: {
    alt: 'In a white studio, someone works at a desk by the window, with plants on the bookshelf.',
    caption: 'A studio by the window',
  },
  chaptersLabel:
    'Every Molis Work demo here is an interface mockup. The projects, sources, names, and times in them are sample data.',
  relation: {
    title: 'Work and Tool',
    tag: 'Planned · Scope and timing TBD',
  },
};
