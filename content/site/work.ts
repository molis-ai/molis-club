// Molis Work 页（2026-10-24 重做，目标与取舍见 specs/work-product-page/spec.md）。
// 开场取自 Molis Work 产品运营文档《产品介绍》第 1 节：负责人 10-19 定的口号，和「工具和 AI 围着你转，你还是你。」。
// 整页只有一个例子：一个周末，把一个想法做上线（「划线卡片」）；首屏是做完以后的周一早上。
// 画面照 Molis Work 最新桌面端画（2026-10-24 main），只删不加；画面里的名字、数字、时间都是示意。
// 功能一律按做好的样子画，走到哪一步只在结尾写一次（已发布 / 开发中两种）。
// workQuoted 是 docs/studio-intro.md 的原句（测试逐句核对），其余是新写的界面文字。

export const workHero = {
  form: '工作台',
  stage: '开发中',
  title: '工具和 AI 围着你转，你还是你。',
  slogan: 'Work, People, AI, Tool, get connected better than ever.',
  what: 'Molis Work 是装在你电脑上的 AI 工作台：工具按你的做法长出来，AI 照你的规矩做事，要紧的决定留给你。',
  go: '报名首批试用',
  label:
    '界面示意：周一早上的项目首页。周末上线的「划线卡片」夜里收到 41 条反馈，助理、Codex 和你做的发布前检查台各做了一件事，等你的只有两件。',
};

export type TourChapterId =
  | 'win'
  | 'dock'
  | 'rail'
  | 'float'
  | 'ask'
  | 'agents'
  | 'wait';

export const workTour = {
  kicker: '全景',
  title: '一个项目，一张工作台。',
  label: '产品全景：Molis Work 的窗口，七处依次点亮。',
  chapters: [
    {
      id: 'win',
      name: '一个窗口',
      title: '一个窗口，一个项目。',
      text: '中间是手上在做的；标签像浏览器，几件事同时开着。',
    },
    {
      id: 'dock',
      name: '插件',
      title: '插件按需装，缺的自己做。',
      text: '目标、文档、待办、信息流……常用的钉在底栏。',
    },
    {
      id: 'rail',
      name: '右栏',
      title: '参考放在右边。',
      text: 'Shelf、灵光、资料、浏览器、电脑、讨论，和左边并排着用。',
    },
    {
      id: 'float',
      name: '浮条',
      title: '选中什么，动作就递过来。',
      text: '记成待办、交给助理、拆成目标步骤，结果回到原处。',
    },
    {
      id: 'ask',
      name: '助理',
      title: '底下这一条是助理。',
      text: '它认得这个项目的资料和插件；按 ⌘K 是搜索。',
    },
    {
      id: 'agents',
      name: '外部 AI',
      title: '你用的 AI，都接进来。',
      text: 'Claude Code、Codex、OpenCode……读写的是同一份目标。',
    },
    {
      id: 'wait',
      name: '等你',
      title: '谁在等你，一眼看到。',
      text: '要你决定、要你验收的，收在输入框旁边和菜单栏里。',
    },
  ] as { id: TourChapterId; name: string; title: string; text: string }[],
  theme: { label: '窗口配色', light: '浅色', dark: '深色' },
};

export type MomentId = 'idea' | 'rules' | 'relay' | 'nod' | 'tool' | 'done';

export const workWeekend = {
  kicker: '一个周末',
  title: '周五晚上的一个想法，周日上线。',
  label: '一个周末里的六个时刻',
  moments: [
    {
      id: 'idea',
      day: '周五',
      time: '22:10',
      title: '想法丢进来，就是一个项目。',
      text: '帖子截图、两年的读书划线、几页旧笔记，读完就有目标、要求和待办。',
      label:
        '界面示意：帖子截图、划线导出和旧笔记拖进新项目，助理读完写出项目建议，采用以后有了目标、要求和待办。',
    },
    {
      id: 'rules',
      day: '周六',
      time: '10:00',
      title: '你的规矩写一次，每个 AI 都照着做。',
      text: 'CLAUDE.md 和 Skills 从 Claude Code 带进来，原配置不会被修改。',
      label:
        '界面示意：从本机导入角色，勾选两份 Skill；三条规矩分别落进助理、Codex、Claude Code 的活里。',
    },
    {
      id: 'relay',
      day: '周六',
      time: '15:20',
      title: '额度用完了，换谁接着做都行。',
      text: 'Codex、OpenCode、Pi Agent、Grok Build，或者用你自己的 Key 在 Coding 里接着写。做到哪、你定过什么，都读得到。',
      label:
        '界面示意：Claude Code 额度用完，在目标页选择接着做的一方，用自己的 DeepSeek Key 在 Coding 里继续；它读到了做到哪和上午定下的事。',
    },
    {
      id: 'nod',
      day: '周六',
      time: '23:40',
      title: '说好的事，改了要你点头。',
      text: 'Codex 想把「导出到 Anki」挪到下一版。它只能提，定的是你。',
      label:
        '界面示意：Codex 在目标页发来决定请求，选项里写着各自的影响；可以亲手选同意或不同意。',
    },
    {
      id: 'tool',
      day: '周日',
      time: '11:00',
      title: '缺个工具，说一句就有。',
      text: '做出来的检查台，你在界面里用，Claude Code 提交前也会用。',
      label:
        '界面示意：在底栏说一句「做个发布前检查台」，方案、写代码、过检查、试跑，底栏多出一个图标；Claude Code 提交前用的是同一个检查台。',
    },
    {
      id: 'done',
      day: '周日',
      time: '17:30',
      title: 'AI 说做完了，Work 说还差你。',
      text: '手机上的登录，要你亲手点一遍。没验过，就不算完。',
      label:
        '界面示意：Claude Code 报告全部做完并请求收尾，收尾没有生效，手机上的登录等你验收；可以亲手点「验收通过」。',
    },
  ] as {
    id: MomentId;
    day: string;
    time: string;
    title: string;
    text: string;
    label: string;
  }[],
};

export const workKeep = {
  kicker: '留在你这儿',
  title: '你的工作，留在你这儿。',
  rows: [
    {
      id: 'local',
      title: '存在你的电脑上',
      text: '工作数据保存在本机，使用 AI 时会调用你配置的模型服务。',
    },
    {
      id: 'models',
      title: '模型你来挑，Key 是你的',
      text: '填上自己的 API Key 就能用，费用直接付给模型商。',
    },
    {
      id: 'grants',
      title: 'AI 能动什么，你说了算',
      text: '每个 AI 一项一项授权；写文件、跑命令、推送，先问你。',
    },
  ],
  models: [
    'Anthropic',
    'OpenAI',
    'DeepSeek',
    '通义千问',
    'Kimi',
    'GLM',
    'MiniMax',
    'OpenRouter',
    '本机模型',
  ],
  picked: 'DeepSeek',
  grants: [
    ['Claude Code · 读写目标', '允许', 'yes'],
    ['Claude Code · 推送代码', '每次问我', 'ask'],
    ['助理 · 网银与密码管理器', '碰不了', 'no'],
  ] as [string, string, 'yes' | 'ask' | 'no'][],
};

export const workEnd = {
  origin: ['一开始，我们只是想做一个', '让自己团队用得更顺的工具。'],
  belief: '判断归人，执行可以托付。',
  beliefText: '想要什么、为什么做、什么结果值得接受，这些重要判断留在人手里。',
  released: {
    label: '已发布 · v0.2.0',
    text: '目标、完成要求和你的验收，几家 AI 记在同一份上。那时叫 GoalBoard，只有源码。',
    go: '看源码',
  },
  dev: {
    label: '开发中',
    text: '这一页里的新版工作台，正在一件件做出来。想先试，可以按仓库说明从源码构建。',
    go: '报名首批试用',
    build: '从源码构建',
  },
  foot: 'macOS · 许可以仓库 LICENSE 为准',
};

/** 页面上用到的 docs/studio-intro.md 原句（tests/site-copy.test.mjs 逐句核对） */
export const workQuoted = [workKeep.rows[0].text, workEnd.belief, workEnd.beliefText];

/**
 * 首屏舞台上、窗口外面的两样（2026-10-30 样稿 B）：菜单栏里的「等你」胶囊，和你自己的终端里的 Codex——
 * 它经 MCP 读同一份目标，修好 #12 交回 Molis Work，窗口里那条「Codex 修好了 #12」就是它交回来的。都是示意。
 */
export const workHeroStage = {
  wait: '划线卡片 · 2 件等你',
  term: {
    title: 'Codex',
    lines: [
      { dim: 'Molis Work · 经 MCP', text: '读目标「划线卡片 v1.1」' },
      { text: '› 修 #12：长划线在手机上被截断' },
      { dim: '改了 2 个文件', text: '测试 3 / 3 通过' },
      { text: '交回 Molis Work，等你验收', ok: true },
    ] as { text: string; dim?: string; ok?: boolean }[],
  },
  label:
    '窗口外面：菜单栏里写着划线卡片有 2 件等你；你自己的终端里，Codex 经 MCP 读了同一份目标，修好 #12 后交回 Molis Work 等你验收。',
};
