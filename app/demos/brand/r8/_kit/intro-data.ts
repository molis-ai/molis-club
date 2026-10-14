import type { FolioProductId } from '../../../../../content/folio';
import { desk, relay } from '../../../../../content/folio-work';
import { GITHUB_URL } from '../../../../../content/molis-work';
import { demo } from '../../../../../content/molis-tool';
import { folioLife } from '../../../../../content/folio-life';
import { worlds } from '../../../../../content/molis-story';
import { folioWorld } from '../../../../../content/folio-world';
import { products as base } from './data';

// 产品列表（美术馆的午后这一版）：照《Molis AI：工作室介绍、故事与产品介绍》第 3 章「产品总览」
// 与第 4 章「产品介绍」（2026-10-14 版）重写。标题、一句话、适合的时刻、当前阶段与各段小标题都用原句；
// 画面里的项目名、记录与世界取自 content/ 的示意数据，统一标「示意」，不当作已经能用的功能。

export type Chapter = {
  /** 第 4 章里这一段的小标题，原句 */
  title: string;
  /** 例如「预览」：这一段说的能力还在预览 */
  tag?: string;
  /** 这一段演示的长度（秒），默认 3.3：一件产品一轮不超过 10 秒 */
  time?: number;
};

export type IntroProduct = (typeof base)[number] & {
  /** 第 4 章标题 */
  headline: string;
  /** 第 4 章加粗的一句：它是什么 */
  what: string;
  /** 第 3 章：适合这样的时刻 */
  fit: string;
  /** 第 3 章：当前阶段（加粗的那几个字）与说明 */
  stage: string;
  stageNote: string;
  /** 列表里的一行小字 */
  rowNote: string;
  chapters: Chapter[];
  /** 画面的诚实标注 */
  sceneNote: string;
  /** 读屏用的画面说明 */
  sceneLabel: string;
};

const byId = Object.fromEntries(base.map((p) => [p.id, p])) as Record<
  FolioProductId,
  (typeof base)[number]
>;

export const intro = {
  title: '产品',
  lead: '我们围绕工作、生活与体验展开五个产品方向。它们各自回应不同的需要，也处于不同的开发阶段。',
  fitLabel: '适合',
  stageLabel: '现在',
};

export const introProducts: IntroProduct[] = [
  {
    ...byId.work,
    extra: { label: '查看开源代码', href: GITHUB_URL },
    headline: '让工作，在人、工具与 AI 之间继续',
    what: '一张可以按需要组合工具、让人与 AI 共同工作的工作台。',
    fit: '需要围绕一段持续的工作整理资料、写文档、处理数据或代码，让后续步骤接着已有内容与进展继续。',
    stage: '开源开发中',
    stageNote: '已有工作台与多种工具的开发实现，持续打磨人与 AI 的协作体验。',
    rowNote: '重点推进 · 开源开发中',
    chapters: [
      { title: '按这段工作的需要，布置工作台。' },
      { title: '你和 AI，接着同一份内容工作。' },
      { title: '工作做到哪里，有记录，也有依据。' },
    ],
    sceneNote: desk.note,
    sceneLabel:
      'Molis Work 界面示意，四段：给项目按需要添加工具；在文档里，助理接着当前内容整理，改动看得见；Goal 记录进展、等你决定的事，收尾时对照要求核对；在预览中的插件创作台里做出一张记录表，装进工作台。',
  },
  {
    ...byId.tool,
    headline: '光标在哪里，软件就在哪里',
    what: '围绕眼前的文字、文件和网页，随手完成下一步的 Mac 工具。',
    fit: '眼前已经有一段文字、一份文件或一个页面，想直接完成下一步，少一些打开应用、搬运材料的折腾。',
    stage: '开发中',
    stageNote:
      '已有桌面开发版本，本机工具、跨应用交互与 AI 能力仍在整合和验证。',
    rowNote: 'Mac · 开发中',
    chapters: [
      { title: '眼前的小事，就在手边处理。' },
      { title: '结果还能成为下一步的材料。' },
      { title: '收起以后，还能回来接着做。' },
    ],
    sceneNote: demo.note,
    sceneLabel:
      'Molis Tool 界面示意，三段：选中网页上的一句英文，光标旁出现动作，翻译带着来源贴在旁边；一份 PDF 提取出文字，再整理成表格，接着比较或导出；工具收进菜单栏，回来时在「接续」里找到结果和它们的来源。',
  },
  {
    ...byId.life,
    headline: '把琐事安顿好，让喜欢的生活发生',
    what: '一个围绕个人心愿与琐事展开的生活助理。',
    fit: '想让一件挂念的事有下文，也想在合适的时候，为一直想做的事找到机会、做好准备。',
    stage: '原型探索中',
    stageNote: '已有可交互的生活事项与建议流程，真实模型和外部服务尚未接入。',
    rowNote: '生活 · 原型探索中',
    chapters: [
      { title: '让挂念的事情，有清楚的下文。' },
      { title: '让一直想做的事，慢慢找到机会。' },
      { title: '给好奇心留一个位置。' },
    ],
    sceneNote: '示意 · 服务未接入',
    sceneLabel:
      'Molis Life 示意，三段：一件退换货，申请已提交、对方已受理、钱是否到账分开记着；「想陪妈妈去看海」先留着，有了空闲再给出近一点和多走一段两种准备；散步时看见的植物、想读的书、一段音乐都可以留下，选择替我处理、一起想想或先留着。',
  },
  {
    ...byId.story,
    headline: '走进另一个世界，经历另一种生活，然后回来',
    what: '把阅读、对话、探索和创作，做成可以进入的世界。',
    fit: '想遇见一个陌生生命，走一遍心里的“如果”，或把自己的一段时光布置成展览，再带着经历回来。',
    stage: '开发中',
    stageNote:
      '已有四个世界的开发实现，正在打磨进入、经历、归来与再次继续的体验。',
    rowNote: '体验 · 开发中',
    chapters: [
      { title: '云海来客 · 遇见另一个生命', time: 2.5 },
      { title: '彼处 · 活一次另一个你', time: 2.5 },
      { title: '袖珍博物馆 · 回到自己的一段时光', time: 2.5 },
      { title: '雾港失物招领处 · 成为另一个人', time: 2.5 },
    ],
    sceneNote: '概念画面；袖珍博物馆为示例照片（Unsplash）',
    sceneLabel:
      'Molis Story 示意：从「此处」选一扇窗，依次走进云海来客、彼处、袖珍博物馆和雾港失物招领处，每次归来都带回一样东西：一段未译的信号、补完的一句、一本离线纪念册、第十三号钥匙牌。',
  },
  {
    ...byId.world,
    headline: '现实和故事，都住进你慢慢长大的世界',
    what: '一个可以亲自搭建、布置和持续改变的个人世界。',
    fit: '想把现实里在意的地方、故事中的伙伴与经历，以及自己和 AI 一起完成的作品放在一起，慢慢构成属于自己的世界。',
    stage: '概念设计',
    stageNote: '正在明确产品形态与连接方式，尚无可用原型。',
    rowNote: '概念设计',
    chapters: [
      { title: '从一个在意的地方开始。' },
      { title: '让经历之间，长出新的联系。' },
      { title: 'Life + Story = World' },
    ],
    sceneNote: '概念示意',
    sceneLabel:
      'Molis World 概念示意，三段：把常去的面馆放进自己的世界，取个名字、放进回忆；面馆后厨的门通向一个故事，带回的纪念物放在面馆旁边，又冒出周末真的去吃一次的念头；Life、Story 与 World 各有用途，连接仍是未来方向。',
  },
];

/** 第 3 章：这些产品怎样联系、目前如何了解与体验 */
export const links = {
  title: '这些产品怎样联系',
  work: {
    from: 'Tool',
    to: 'Work',
    verb: '计划成为基础能力',
    text: 'Work 是目前重点推进的核心产品，关注一段工作怎样持续进行；Tool 关注眼前这一步怎样更顺手。Tool 按独立产品推进，也计划成为 Work 的基础能力。',
    tag: '接入范围与时间尚未确定',
  },
  world: {
    text: 'Life 关注真实生活中的心愿、准备与行动；Story 提供可以进入和经历的世界；World 探索让这些地方、伙伴、经历与作品有一个持续生长的空间。',
    tag: '彼此连接仍是未来方向，目前尚未打通',
  },
};

export const access = {
  title: '目前如何了解与体验',
  rows: [
    {
      who: 'Molis Work',
      text: '可以查看开源代码，并按仓库说明从源码构建；正在开发的新版工作台尚未提供正式安装包。',
      link: { label: 'GitHub', href: GITHUB_URL },
    },
    {
      who: 'Molis Tool · Life · Story',
      text: '尚未开放公开下载。',
    },
    { who: 'Molis World', text: '仍处于概念阶段。' },
  ] as { who: string; text: string; link?: { label: string; href: string } }[],
  note: '各产品的详情页会说明当前进展与实际开放的入口。',
};

/* ---------- 画面里的示意数据 ---------- */

/** Work：两个项目各配一组工具（第 4.1 节的例子），个人工具每个项目都在；最后一块是预览中的「你自己的工具」 */
export const workScene = {
  boards: [
    { project: '研究报告', tools: ['资料', '信息流', '文档'] },
    { project: '软件项目', tools: ['目标', '会话', '代码'] },
  ],
  personal: ['日历', '笔记', '待办'],
  personalNote: '个人工具 · 每个项目都在',
  yours: '你自己的工具',
  yoursTag: '预览',
  desk,
  you: '你',
  assistant: '助理',
  agents: ['Codex', 'Claude Code'],
  agentsNote: '也能接着做',
  changed: '助理改了 3 处',
  relay,
  relayLabels: { want: '想要的结果', decide: '等你决定' },
};

/** Tool：第 4.2 节的例子 */
export const toolScene = {
  chain: [
    {
      kind: 'PDF',
      name: '调研材料.pdf',
      meta: '12 页 · 原件保留',
      action: '提取文字',
    },
    {
      kind: '文字',
      name: '提取的文字',
      meta: '第 3–5 页',
      action: '整理成表格',
    },
    {
      kind: '表格',
      name: '整理好的表格',
      meta: '3 行 · 4 列',
      action: '比较或导出',
    },
  ],
  copy: '在副本上处理',
  saved: '已另存一份',
  shelf: '接续',
  working: '海报 → 日程草稿',
  workingNote: '处理中，可以先去做别的事',
  items: [
    { title: '日程草稿', from: '来自 海报.png', state: '刚刚完成' },
    { title: '决定和待办', from: '来自 一段群聊', state: '草稿' },
    { title: '第 3–5 页的文字', from: '来自 调研材料.pdf', state: '可继续' },
  ],
  back: '回看来源',
  tail: '工具出现多久，由你当下的需要决定。',
};

const returnStory =
  folioLife.example.stories.find((story) => story.id === 'return') ??
  folioLife.example.stories[0];

/** Life：第 4.3 节的例子 */
export const lifeScene = {
  trivia: {
    quote: returnStory.quote,
    title: '退一件衣服',
    states: [
      { text: '申请已经提交', done: true },
      { text: '对方已经受理', done: true },
      { text: '钱已经到账', done: false, wait: '等待结果' },
    ],
    note: '没有依据之前，不写「已到账」',
  },
  wish: {
    quote: '「想陪妈妈去看海。」',
    kept: '先留着',
    why: '这周六下午空出来了，天气也好',
    plans: [
      { time: '只有两个小时', text: '可以近一点' },
      { time: '能留出半天', text: '就多走一段' },
    ],
    actions: ['替我准备', '以后再说'],
    note: '是否继续、准备到什么程度，由你决定',
  },
  curious: {
    items: [
      { kind: 'leaf', text: '散步时看见的植物' },
      { kind: 'book', text: '一本想读的书' },
      { kind: 'note', text: '一段让人停下来的音乐' },
    ],
    intents: ['替我处理', '一起想想', '先留着'],
    pick: 2,
    note: '愿望可以延后，兴趣可以慢慢变化，一段空闲也可以留给休息。',
  },
};

/** Story：四个世界的画面（概念画面与示例照片），引句用第 4.4 节的原句 */
export const storyScene = {
  here: '此处',
  hereLine: '出发和回来的地方',
  back: '归来',
  backLine: '留下进展和这一趟的收获',
  shelf: '带回来的',
  worlds: [
    {
      id: 'astralo',
      line: '另一端，也有谁在试着理解你。',
      image: { src: '/images/edition-c/story/astralo.jpg', w: 1600, h: 900 },
    },
    {
      id: 'elsewhere',
      line: '有些岔路，已经走过去很久，仍会偶尔想起。',
      image: { src: '/images/edition-c/story/departure.jpg', w: 1600, h: 900 },
    },
    {
      id: 'museum',
      line: '一次旅行，一段相处，或者一段普通却值得留下的日常，都可以成为一场私人展览。',
      image: {
        src: '/images/edition-c/story/museum-lake.jpg',
        w: 1200,
        h: 800,
      },
    },
    {
      id: 'fog-harbor',
      line: '有些东西，在被弄丢之前，就先送到了这里。',
      image: {
        src: '/images/edition-c/story/fog-harbor.jpg',
        w: 1050,
        h: 900,
        position: '50% 40%',
      },
    },
  ].map((world) => {
    const source = worlds.find((item) => item.id === world.id) ?? worlds[0];
    return {
      ...world,
      name: source.name,
      relation: source.relation,
      souvenir: source.souvenir,
    };
  }),
};

/** World：第 4.5 节的例子 */
export const worldScene = {
  place: folioWorld.map.places[0],
  steps: ['取一个名字', '放进一段回忆', '按自己的方式布置'],
  door: '后厨的门，通向另一座城',
  partner: '和伙伴走过那段经历',
  souvenir: '带回来的纪念物',
  thought: '这个周末，真的去吃一次吧。',
  handoff: '交给 Life 准备',
  family: folioWorld.family.items.map((item) => ({
    ...item,
    text:
      item.id === 'life'
        ? '关心真实生活中的信息、心愿和行动'
        : item.id === 'story'
          ? '提供可以进入的体验'
          : '让你选择留下的地方、伙伴、经历和作品，持续生长',
    status:
      item.id === 'life'
        ? '原型探索中'
        : item.id === 'story'
          ? '开发中'
          : '概念设计',
  })),
  familyNote:
    '三个产品各有自己的用途。连接哪些内容、留下哪些经历、向谁分享，都应由你选择。',
};
