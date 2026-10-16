// Molis Work 页（2026-10-16 起按第三版草稿：specs/work-scenarios/v3/，目标与完成要求见 specs/work-product-page/spec.md）。
// 两种读者各看各的例子：「写代码」（默认）与「写文档、管事情」。画面与其中的名字、数据都是示意。
// 文字尽量少：能用画面演的不写；每幕一个标题、一句不超过 40 字的导语，每步一句不超过 18 字。
// 状态只分两种：已发布（v0.2.0，发布时叫 GoalBoard）与开发中。workProgress 里是 docs/studio-intro.md 4.1 的原句（测试逐句核对）。

export type Persona = 'dev' | 'doc';

export const personas: Persona[] = ['dev', 'doc'];

/** 按身份变的一段字 */
export type ByPersona<T = string> = Record<Persona, T>;

export const personaUi = {
  ask: '你主要做什么？',
  group: '按你的工作看例子',
  label: { dev: '写代码', doc: '写文档、管事情' } as ByPersona,
};

/** 页内顶栏的去处 */
export const workNav = [
  { id: 'tour', label: '全景' },
  { id: 'give', label: '递' },
  { id: 'relay', label: '接' },
  { id: 'grow', label: '长' },
  { id: 'team', label: '一起干' },
  { id: 'now', label: '现状' },
];

/* ---------- 产品全景：照 Molis Work 的窗口画，一段讲一处 ---------- */

export type TourStatus = 'rel' | 'dev';

export type TourChapter = {
  name: string | ByPersona;
  title: string | ByPersona;
  text: string | ByPersona;
  status: TourStatus | ByPersona<TourStatus>;
};

export const workTour = {
  kicker: '产品全景',
  title: '先看看它长什么样。',
  chapters: [
    {
      name: '一个窗口',
      title: '一个窗口，一个项目。',
      text: '左边是在做的，右边放参考，底下是插件和助理。',
      status: 'dev',
    },
    {
      name: '项目与标签',
      title: '开着几件事，都在。',
      text: '标签像浏览器；右下角切项目，各有各的插件和资料。',
      status: 'dev',
    },
    {
      name: '插件',
      title: '一组插件，各管一摊。',
      text: '项目里只加要用的，常用的钉在底栏；缺的，自己做。',
      status: 'dev',
    },
    {
      name: '右栏',
      title: '参考放右边。',
      text: '网页、文件、讨论、灵光，和左边并排着用。',
      status: 'dev',
    },
    {
      name: '浮条',
      title: '选中什么，能力就递来。',
      text: '只递两三个此刻用得上的动作，来自哪个插件都行。',
      status: 'dev',
    },
    {
      name: '助理',
      title: '底下这一条，是助理。',
      text: '它认得这个项目的资料和插件；按 ⌘K 是搜索。',
      status: 'dev',
    },
    {
      name: { dev: 'Agent 接进来', doc: '助理接着写' },
      title: { dev: 'Agent 在终端里干活。', doc: '让助理接着写。' },
      text: {
        dev: '终端绑着目标；做成了什么、凭什么，写回目标页。',
        doc: '写进来的每一段，都标着用了哪些资料。',
      },
      status: { dev: 'rel', doc: 'dev' },
    },
    {
      name: '⌘K 和后台',
      title: '找得到，也知道什么在跑。',
      text: '搜所有插件里的东西；在跑的、等你的，一眼看到。',
      status: 'dev',
    },
  ] as TourChapter[],
  theme: { light: '浅色', dark: '深色' },
  play: { on: '自动播放', off: '已暂停' },
  note: '界面示意 · 示例数据',
};

/* ---------- 三件事 ---------- */

export const workIdeas = [
  { id: 'give', mark: '递', line: '下一步，递到手边' },
  { id: 'relay', mark: '接', line: '换谁来做，都接得上' },
  { id: 'grow', mark: '长', line: '缺的工具，自己长' },
] as const;

/* ---------- 四幕：滚到哪一步演到哪一步 ---------- */

export type WorkActId = 'give' | 'relay' | 'grow' | 'team';

export type WorkAct = {
  id: WorkActId;
  kicker: string;
  tag: string;
  title: string;
  lead: string;
  /** 每一步画面在演什么，条数等于画面的步数 */
  steps: string[];
};

export const workActs: ByPersona<WorkAct[]> = {
  dev: [
    {
      id: 'give',
      kicker: '递',
      tag: '开发中',
      title: '不用开口，下一步就在手边。',
      lead: '选中报错就能交出去，背景跟着走。',
      steps: [
        'Inbox 递来一条报错',
        '选中报错，「交给 Codex」',
        '目标、约束、进度一起带上',
        'Codex 改完，结果回到这页',
        '再交给 Claude Code 复核',
      ],
    },
    {
      id: 'relay',
      kicker: '接',
      tag: '已发布 · v0.2.0',
      title: '几个 Agent，读写同一组目标。',
      lead: '谁在等谁、凭什么算完成，都记在目标上。',
      steps: [
        '前端 Claude Code，后端 Codex',
        '结算页在等支付接口',
        '改约定之前，先问你',
        '接口交了依据，前端接上',
        '说做完了？还差一条依据',
      ],
    },
    {
      id: 'grow',
      kicker: '长',
      tag: '开发中',
      title: '缺的工具，让 AI 做一个。',
      lead: '做出来的工具，递得到手边，Agent 也调得到。',
      steps: [
        '说一句：做个发版清单',
        '出方案、写代码、过检查',
        'Claude Code 问：能发吗？',
        '浮条递来「放进发版清单」',
        '每周五，自己跑一遍',
      ],
    },
    {
      id: 'team',
      kicker: '接下来 · 一起干',
      tag: '开发中',
      title: '从一句抱怨，到修好。',
      lead: '反馈进来，助理分轻重，叫上该看的人。',
      steps: [
        '用户反馈进 Feed',
        '助理判断：高优先',
        '发到群里，@ 你和产品',
        '讨论成目标，你点同意',
        '你的 Codex 接手，产品验收',
      ],
    },
  ],
  doc: [
    {
      id: 'give',
      kicker: '递',
      tag: '开发中',
      title: '不用开口，下一步就在手边。',
      lead: '选中一句就放进稿子，出处跟着。',
      steps: [
        'Inbox：和你在写的稿子有关',
        '灵光读出了视频字幕',
        '选中一句，放进第 2 节',
        '带着 12:40 的出处落进来',
        '你的观点，旧笔记里有依据',
      ],
    },
    {
      id: 'relay',
      kicker: '接',
      tag: '开发中',
      title: '换个 AI，接着同一页写。',
      lead: '写到哪、谁写的、用了什么，都在同一页。',
      steps: [
        '周一，Claude 桌面版建好目标',
        '写完前两部分，记在目标上',
        '周三，换个模型接着写',
        '周四，菜单栏一眼看进度',
        '周五，谁写了什么一页看清',
      ],
    },
    {
      id: 'grow',
      kicker: '长',
      tag: '开发中',
      title: '缺的工具，让 AI 做一个。',
      lead: '做出来的工具，随手放得进，别的 AI 也问得到。',
      steps: [
        '说一句：做个选题库',
        '出方案、写代码、过检查',
        '看到什么，一点就放进去',
        '每周日，排好下周五个',
        'Claude 桌面版也问得到',
      ],
    },
    {
      id: 'team',
      kicker: '接下来 · 一起干',
      tag: '开发中',
      title: '一个决定，牵动的事都跟上。',
      lead: '待你决定的事带着代价来；点了，相关的都跟上。',
      steps: [
        '开发的 Agent 停下来问你',
        '助理发到群里，@ 你和运营',
        '你点了 B',
        '受影响的事，都跟着改',
      ],
    },
  ],
};

/* ---------- 想怎么干 ---------- */

export const workWays = {
  kicker: '想怎么干',
  title: '同一套插件，换一种工作就换一种拼法。',
  label: '比如',
  all: '官方插件',
  allNote: '持续建设中',
  yours: '你自己的干法',
  note: '示意',
  /** 插件与拼法整体都还在开发中 */
  status: '开发中',
  /** 每种干法的顺序跟着身份走；最后一种都是「你自己的」 */
  order: {
    dev: ['indie', 'oss', 'techwrite', 'yours'],
    doc: ['media', 'startup', 'research', 'yours'],
  } as ByPersona<string[]>,
};

/* ---------- 和现在的用法比（页面上不点竞品名） ---------- */

export type CompareRow = { way: string; note: string; cells: string[] };

export const workCompare = {
  kicker: '和现在的用法比',
  title: '不用把工作搬进 AI，AI 来你手边。',
  head: ['现在的做法', '你要做的', '结果在哪', '下次接着做'],
  us: '在 Molis Work 里',
  rows: {
    dev: [
      {
        way: '问 AI',
        note: '对话助手',
        cells: ['交代背景，贴报错和代码', '在对话里，自己搬回去', '新开对话，再讲一遍'],
      },
      {
        way: '把 issue 指派给 Agent',
        note: '云端编码 Agent',
        cells: ['先把 issue 写清楚', '在一个 PR 里', '没写进 issue 的，它不知道'],
      },
      {
        way: '自己拼一套',
        note: '规则文件、脚本',
        cells: ['每个 Agent 各写一份规矩', '散在仓库和对话里', '看进度文件写得好不好'],
      },
    ],
    doc: [
      {
        way: '问 AI',
        note: '对话助手',
        cells: ['传资料，开口交代', '在对话里，自己复制回去', '换个 AI，再传一遍'],
      },
      {
        way: '文档工具里的 AI',
        note: '笔记软件自带',
        cells: ['在文档里叫它', '在那份文档里', '视频、邮件、笔记得先搬进来'],
      },
      {
        way: '自动化工具',
        note: '连应用、画流程',
        cells: ['先画流程、连账号', '送到各个应用', '流程不看你在写什么'],
      },
      {
        way: '一句话做应用',
        note: '生成小应用',
        cells: ['说一句，得到一个小应用', '在那个应用里', '它不认识你的文档'],
      },
    ],
  } as ByPersona<CompareRow[]>,
  usCells: {
    dev: ['选中，点一下', '回到同一页，带着依据', '谁来做，都读同一组目标'],
    doc: ['接着写，下一步递来', '落进该在的地方，带出处', '换个 AI，读的还是同一页'],
  } as ByPersona<string[]>,
  gap: {
    dev: '不如它们的：写代码，编码 Agent 更强；团队、多设备还没有；只支持 macOS。',
    doc: '不如它们的：要从源码安装；多人编辑、多设备还没有；只支持 macOS。',
  } as ByPersona,
};

/* ---------- 现状 ---------- */

export const workStatus = {
  kicker: '现在能用什么',
  title: { dev: '今天就能接上，下一版在路上。', doc: '下一版在路上。' } as ByPersona,
  released: {
    label: '已发布 · v0.2.0',
    items: [
      '目标、依赖、提议与影响',
      '绑在目标上的终端，菜单栏看进度',
      'Sessions、Feed、基础版成果',
      'Codex、Claude Code 等内置接入，其他经 MCP',
    ],
    note: 'MIT 开源，从源码构建；发布时叫 GoalBoard。',
  },
  developing: {
    label: '开发中',
    items: [
      '浮条和助理',
      'Inbox、⌘K 搜索',
      '工作流程、插件创作工作台',
      'Pages、PPT、Dataset 等插件',
      '团队协作、多设备',
    ],
  },
  start: {
    title: '三分钟接上',
    steps: [
      {
        title: '装上',
        hint: 'macOS · Node.js 24+ · pnpm',
        code: [
          'git clone --branch v0.2.0 https://github.com/molis-ai/molis-work.git',
          'cd molis-work',
          'pnpm install --frozen-lockfile && pnpm install:local',
          '~/.goalboard/bin/goalboard service install --home ~/.goalboard --confirm',
          '~/.goalboard/bin/goalboard demo create --confirm',
        ].join('\n'),
      },
      {
        title: '接上 Agent',
        hint: '打开 127.0.0.1:4173，在「设置 → Runtime」接入 Claude Code 或 Codex',
      },
      {
        title: '新开会话，说一句',
        say: '使用 GoalBoard 连接示例项目，打开一条 Goal，告诉我当前判断、已经做成了什么、下一步和完成要求。',
      },
    ],
    note: '装依赖的时间另算。',
    copy: { idle: '复制', done: '已复制', failed: '请手动选中' },
  },
  follow: {
    title: '关注下一版',
    text: '浮条、助理、Pages 和插件创作工作台都在下一版里，日期未定。',
    friend: '身边有写代码的朋友？把这页切到「写代码」发给他。',
  },
  bounds: [
    '工作数据保存在本机，使用 AI 时会调用你配置的模型服务。',
    '外部内容只当资料，不会变成给 AI 的指令。',
    '改约定、算完成，要你点头；Agent 只能提。',
    '关掉应用，定时任务和提醒不跑。',
  ],
};

/* ---------- 最后：事情都顺了，那人做什么？ ---------- */

export const workEnding = {
  kicker: '最后',
  title: '事情都顺了，那人做什么？',
  day: {
    chores: {
      dev: ['贴背景给 AI', '写交接', '追 Agent 进度', '整理发布说明'],
      doc: ['整理周报', '追进度', '找资料出处', '贴背景给 AI'],
    } as ByPersona<string[]>,
    work: '手上的活',
    uses: {
      dev: ['啃架构问题', '做个新东西', '早点下班'],
      doc: ['想透一个难题', '写那篇长文', '早点下班'],
    } as ByPersona<string[]>,
    before: '现在',
    after: '交给工作台以后',
    label: '示意：一天从 9 点到 18 点，杂事变薄，空出来的时间留给更难的问题、新东西和生活。',
  },
  uses: [
    {
      title: '去够更难的问题',
      eg: {
        dev: '啃下一直不敢动的架构。',
        doc: '想透用户为什么留不住。',
      } as ByPersona,
    },
    {
      title: '去创造',
      eg: {
        dev: '做一个只有你想得到的工具。',
        doc: '决定下一个系列写什么。',
      } as ByPersona,
    },
    {
      title: '留给生活',
      eg: {
        dev: '周五准点走。',
        doc: '写那篇不为交差的长文。',
      } as ByPersona,
    },
  ],
  why: '我们为什么做它',
  essay: '读《人的尺度》',
  about: '认识我们',
  closing: '工具可以不断长出来，工作不必一次次重来。',
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
