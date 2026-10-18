import { desk, relay } from '../../../content/folio-work';
import { demo } from '../../../content/molis-tool';
import { folioLife } from '../../../content/folio-life';
import { worlds } from '../../../content/molis-story';
import { folioWorld } from '../../../content/folio-world';
import { homeProducts } from '../../../content/site/home';
import {
  isSoon,
  productIds,
  products,
  soon,
  stageOf,
  WORK_GITHUB,
  type ProductId,
} from '../../../content/site/products';
import { productHref } from '../routes';

// 首页产品列表（第八轮「美术馆的午后」那一版，负责人 2026-10-15 定为首页用）：
// 标题、一句话、适合的时刻、当前阶段与各段小标题，都读 content/site/products.ts（studio-intro 第 3、4 章 2026-10-15 版），
// 不在这里另写一份；只有列表里那行小字和画面说明是界面文字。
// 画面里的项目名、记录与世界取自 content/ 的示意数据，统一标「示意」，不当作已经能用的功能。
// 第 3 章的「这些产品怎样联系」按负责人的意见不放首页，留给各产品页。
// 先不开放的产品（Life、Story、World，负责人 2026-10-18）：列表和画面照旧，不给去处，阶段写「探索中，敬请期待」。

export type Chapter = {
  /** 第 4 章里这一段的小标题，原句 */
  title: string;
  /** 例如「预览」：这一段说的能力还在预览 */
  tag?: string;
  /** 这一段演示的长度（秒），默认 3.3：一件产品一轮不超过 10 秒 */
  time?: number;
};

export type IntroProduct = {
  id: ProductId;
  name: string;
  /** 详情页；先不开放的产品没有 */
  href?: string;
  /** 先不开放：列表这一行只用来选中，不是链接 */
  soon?: boolean;
  /** 去处按钮 */
  more: string;
  /** 第二个去处（Work 的开源代码） */
  extra?: { label: string; href: string };
  /** 还是概念 */
  concept?: boolean;
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

export const intro = {
  title: '产品',
  /** 第 3 章开头那句 */
  lead: '我们围绕工作、生活与体验展开五个产品方向。它们各自回应不同的需要，也处于不同的开发阶段。',
  fitLabel: '适合',
  stageLabel: '现在',
};

/** 第 4 章各节小标题：画面分几段，就取哪几节 */
const titles = (id: ProductId, from: number, count: number) =>
  products[id].sections
    .slice(from, from + count)
    .map((section) => section.title);

/** 每件产品与画面相关的部分（其余读 content/site/products.ts） */
const local: Record<
  ProductId,
  Pick<IntroProduct, 'rowNote' | 'sceneNote' | 'sceneLabel' | 'extra'> & {
    chapters: Chapter[];
  }
> = {
  work: {
    rowNote: '重点推进 · 开源开发中',
    extra: { label: homeProducts.work.github ?? '', href: WORK_GITHUB },
    chapters: titles('work', 0, 3).map((title) => ({ title })),
    sceneNote: desk.note,
    sceneLabel:
      'Molis Work 界面示意，三段：给项目按需要添加工具，个人工具每个项目都在；在文档里，助理接着当前内容整理，改动看得见；Goal 记录进展、等你决定的事，收尾时对照要求核对。',
  },
  tool: {
    rowNote: 'Mac · 开发中',
    chapters: titles('tool', 0, 3).map((title) => ({ title })),
    sceneNote: demo.note,
    sceneLabel:
      'Molis Tool 界面示意，三段：选中网页上的一句英文，光标旁出现动作，翻译带着来源贴在旁边；一份 PDF 提取出文字，再整理成表格，接着比较或导出；工具收进菜单栏，回来时在「接续」里找到结果和它们的来源。',
  },
  life: {
    rowNote: `生活 · ${soon.stage}`,
    chapters: titles('life', 0, 3).map((title) => ({ title })),
    sceneNote: '示意 · 服务未接入',
    sceneLabel:
      'Molis Life 示意，三段：一件退换货，申请已提交、对方已受理、钱是否到账分开记着；「想陪妈妈去看海」先留着，有了空闲再给出近一点和多走一段两种准备；散步时看见的植物、想读的书、一段音乐都可以留下，选择替我处理、一起想想或先留着。',
  },
  story: {
    rowNote: `体验 · ${soon.stage}`,
    // 第 4.4 节里四个世界各一节（第 2 到第 5 节）
    chapters: titles('story', 1, 4).map((title) => ({ title, time: 2.5 })),
    sceneNote: '概念画面；袖珍博物馆为示例照片（Unsplash）',
    sceneLabel:
      'Molis Story 示意：从「此处」选一扇窗，依次走进云海来客、彼处、袖珍博物馆和雾港失物招领处，每次归来都带回一样东西：一段未译的信号、补完的一句、一本离线纪念册、第十三号钥匙牌。',
  },
  world: {
    rowNote: soon.stage,
    chapters: titles('world', 0, 3).map((title) => ({ title })),
    sceneNote: '概念示意',
    sceneLabel:
      'Molis World 概念示意，三段：把常去的面馆放进自己的世界，取个名字、放进回忆；面馆后厨的门通向一个故事，带回的纪念物放在面馆旁边，又冒出周末真的去吃一次的念头；Life、Story 与 World 各有用途，连接仍是未来方向。',
  },
};

export const introProducts: IntroProduct[] = productIds.map((id) => {
  const product = products[id];
  return {
    id,
    name: product.name,
    href: isSoon(id) ? undefined : productHref[id],
    soon: isSoon(id) || undefined,
    more: homeProducts[id].more,
    concept: id === 'world' || undefined,
    headline: product.headline,
    what: product.what,
    fit: product.fit,
    stage: stageOf(id),
    stageNote: isSoon(id) ? '' : product.stageNote,
    ...local[id],
  };
});

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
