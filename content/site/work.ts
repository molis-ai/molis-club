// Molis Work 页：一份「行业观察报告」走三天。章节正文取自 docs/studio-intro.md 4.1（原句）；
// 每一步的一句话说明画面在演什么，画面与其中的名字、数据都是示意。
// 待负责人确认：标「新写」的三章（多插件接力、一起讨论、你不在的时候）不在底稿里，文案与阶段标注按 Work 仓库现状暂定：
// 讨论（群聊 + 话题）首版已实现、未公开部署、AI 暂不参与群聊；主动提醒在开发版；插件创作台为预览。

import { products } from './products';

const work = products.work;
const [arrange, together, record, grow] = work.sections;

export type WorkChapterId =
  | 'scatter'
  | 'arrange'
  | 'together'
  | 'relay'
  | 'grow'
  | 'talk'
  | 'goal'
  | 'away';

export type WorkChapter = {
  id: WorkChapterId;
  kicker: string;
  tag?: string;
  title: string;
  paragraphs: string[];
  steps: string[];
  /** 新写、待负责人确认 */
  draft?: boolean;
};

export const workChapters: WorkChapter[] = [
  {
    id: 'scatter',
    kicker: '第一天 · 早上',
    title: '一份方案，跨过许多天、几个工具和 AI 会话。',
    paragraphs: work.opening,
    steps: [
      '资料、聊天、文档和待办，散在不同的地方。',
      '它们属于同一件事：一份周四要交的报告。',
      '收进同一张工作台，下次从这里继续。',
    ],
    draft: true,
  },
  {
    id: 'arrange',
    kicker: '第一天 · 上午',
    title: arrange.title,
    paragraphs: arrange.paragraphs,
    steps: [
      '为这段工作选工具：资料、信息流、文档。',
      '日历、笔记、待办是你自己的，换项目也跟着你。',
      '搜一个词，各工具里的结果一起出来。',
    ],
  },
  {
    id: 'together',
    kicker: '第一天 · 下午',
    title: together.title,
    paragraphs: together.paragraphs,
    steps: [
      '写到一半的报告。',
      '助理按当前内容整理提纲，改动看得见。',
      '你点「接手」，助理的改动都留着。',
      '你改了一句，成了你的判断。',
    ],
  },
  {
    id: 'relay',
    kicker: '第二天 · 上午',
    title: '助理调用几个插件，把事情接着做完。',
    paragraphs: [
      '评审前要把三家对比做出来。助理从信息流取来资料，在数据表里做成对比，生成一页汇报，再在日历上约好评审、在待办里留下跟进。',
      '每一样成果都留在项目里，也都能点回来源。',
    ],
    steps: [
      '助理从信息流里取来三篇资料。',
      '做成对比表和一页汇报。',
      '在日历上约评审，在待办里留跟进。',
      '五样成果都在项目里，都有来源。',
    ],
    draft: true,
  },
  {
    id: 'grow',
    kicker: '第二天 · 中午',
    tag: '预览',
    title: grow.title,
    paragraphs: grow.paragraphs,
    steps: [
      '你说一句需要：一张评审记录表。',
      'Agent 给出方案，在沙箱里做出来。',
      '检查与验收通过。',
      '装进项目，助理和获授权的 Agent 也能调用。',
    ],
  },
  {
    id: 'talk',
    kicker: '第二天 · 下午',
    tag: '首版已实现 · 未公开部署',
    title: '一起讨论，上下文和成果都接得上。',
    paragraphs: [
      '同事在群聊里看到那页汇报，从一条消息开了个话题，引用文档里的段落和成果来讨论。结论带回项目，之后谁接着做，都看得到前因后果。',
      '群聊与话题的首版已经实现，还没有公开部署；AI 暂不参与群聊。',
    ],
    steps: [
      '同事引用那页汇报，问了一句。',
      '开成一个话题，你回了一句。',
      '话题有了结论。',
      '结论回到项目，谁接着做都看得到。',
    ],
    draft: true,
  },
  {
    id: 'goal',
    kicker: '第三天',
    title: record.title,
    paragraphs: record.paragraphs,
    steps: [
      'Goal 记着目标、进展、问题和待决定的事。',
      '换到 Claude Code，也读同一份记录，从第三节接着写。',
      '收尾时，把交付物和原来的要求放在一起核对。',
    ],
  },
  {
    id: 'away',
    kicker: '第三天 · 夜里',
    tag: '开发中',
    title: '你不在的时候，助理接着干。',
    paragraphs: [
      '你下线以后，助理按 Goal 跟进到期的事；遇到失败会提醒，勿扰时段不打扰，只把需要你判断的事留下来，并写明原因。',
      '主动跟进还在开发中。',
    ],
    steps: [
      '你下线了，勿扰时段不发提醒。',
      '到期的事接着跟进；失败了会重试，也留下记录。',
      '遇到需要判断的事，先记下来。',
      '第二天，只留一件需要你决定的事，写明原因。',
    ],
    draft: true,
  },
];

export type HandoffTarget = {
  id: 'assistant' | 'codex' | 'colleague' | 'me';
  name: string;
  who: string;
  /** 接手方从断点继续做什么 */
  resume: string;
  /** 需要你判断的那件事；交给自己时没有 */
  ask: string;
};

/** 标志性交互：把这件工作交给谁 */
export const handoff = {
  kicker: '亲手试一次',
  title: '把这件工作交给谁？',
  lead: '选一个接手的人。资料、进展、成果和讨论都会原样跟过去，接手方从断点继续；需要判断的时候，卡片会回到你手里。',
  note: '交互示意',
  card: {
    name: '行业观察报告',
    part: '第三节 · 我们的判断',
    attachments: [
      { key: 'files', label: '资料', value: '3 篇' },
      { key: 'progress', label: '进展', value: '写到第 2 段' },
      { key: 'results', label: '成果', value: '对比表、汇报' },
      { key: 'talk', label: '讨论', value: '价格进结论' },
    ],
  },
  targets: [
    {
      id: 'assistant',
      name: '助理',
      who: 'Molis Work 里的助理',
      resume: '从第三节第 2 段接着写，改动都标出来。',
      ask: 'C 公司的数据口径和另两家不同：按哪一家算？',
    },
    {
      id: 'codex',
      name: 'Codex',
      who: '获授权的外部 Agent',
      resume: '读同一份 Goal 记录，把对比表的数据补齐。',
      ask: '补数据时发现两个来源冲突：用哪一个？',
    },
    {
      id: 'colleague',
      name: '群里的同事',
      who: '项目里的小周',
      resume: '在话题里接着讨论，引用的那一页跟着过去。',
      ask: '结论要不要写进摘要？等你点头。',
    },
    {
      id: 'me',
      name: '自己',
      who: '你',
      resume: '回到第三节第 2 段，助理的提纲和改动都在。',
      ask: '',
    },
  ] as HandoffTarget[],
  labels: {
    from: '在你手里',
    carry: '跟着过去的',
    resume: '从断点继续',
    back: '需要你判断，卡片回到你手里',
    reset: '重新选',
    choose: '交给',
  },
};

/**
 * 当前进展：摘自 4.1「当前进展」原句，按「已经有的 / 还没有的 / 现在怎么体验」分开放。
 * 原句里用分号连着的两半分开放时，句末的分号写成句号，字句不改。
 */
export const workProgress = {
  have: [
    'Molis Work 正在开源开发中，目前以个人在本机使用为主。',
    '工作台、内置工具与 AI 协作能力已有开发实现，正在持续打磨。',
    '工作数据保存在本机，使用 AI 时会调用你配置的模型服务。',
  ],
  notYet: [
    '插件创作仍处于预览阶段，团队空间、多设备同步和插件分享属于后续方向。',
    '正在开发的新版尚未提供正式安装包。',
  ],
  now: [
    '可以按仓库说明从源码构建；公开历史版本与当前开发中的工作台需要分别查看。',
  ],
};

export const workGo = {
  github: '查看开源代码',
  build: '从源码构建说明',
  follow: '关注新版进展',
};
