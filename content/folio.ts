// Folio's 2026-10-08 editorial pass. Other brand directions keep their own copy.
// Work: product-intro V1 (2026-10-05) + PRODUCT platform definition (2026-10-07).
export const folioStudio = {
  title: '我们做 AI 工作台和桌面工具，也探索生活助手与互动世界。',
  lead: 'Molis AI 是一个做产品的团队。让 AI 接住复杂的工作、眼前的小事，也给生活与想象留出空间。',
  products: [
    {
      id: 'work',
      category: '持续的工作',
      title: 'Molis Work',
      line: '目标、资料和工具在一处，让人和不同 Agent 接着做。',
      detail:
        '装在电脑上的 AI 工作台。用插件处理资料、推进目标、留下成果，助理就在当前工作旁。',
      status: '已有开源版本 · 新版开发中',
    },
    {
      id: 'tool',
      category: '眼前的动作',
      title: 'Molis Tool',
      line: '选中文字、拖入文件，合适的动作就在旁边。',
      detail:
        'Mac 菜单栏里的轻工具。内容留在原处，结果带着出处回来，做完就收起。',
      status: '开发中 · 暂无公开安装包',
    },
    {
      id: 'life',
      category: '日常生活',
      title: 'Molis Life',
      line: '帮你跟进琐事，也记住那些想做的事。',
      detail:
        '随口交代一句，或分享一张截图。把事情记下来，在合适的时候一起往前走。',
      status: '原型探索',
    },
    {
      id: 'story',
      category: '互动世界',
      title: 'Molis Story',
      line: '走进一个世界，参与其中，离开后还能回来。',
      detail:
        '每个世界有自己的画面、规则和时间。进去待一会儿，再带一样东西回来。',
      status: '开发中',
    },
  ] as const,
  enterprise:
    '从梳理业务流程、连接现有数据和工具，到用 Molis Work 试运行具体方案，我们可以和你一起找到值得做的一步。',
};

export const folioWork = {
  title: '让工作，在人、工具与 Agent 之间继续。',
  lead: '装在你电脑上的 AI 工作台。目标、资料和工具放在一处，内置助理与 Claude Code、Codex 接着做，成果留下来，做没做完可以核对。',
  platform: '一个工作台，工具按需长出来。',
  platformLead:
    'Goals 管目标，Pages 写文稿，Feed 接住资料，Coding 处理代码。每个插件做好自己的事，你和 AI 使用同一份内容、同一套能力与授权。',
  availability:
    '当前公开版本是 v0.2.0。下方演示包含尚未发布的新版能力，各段单独标明状态。',
  status: {
    released: '已发布',
    next: '开发版 · 未发布',
    preview: '预览 · 未发布',
    planned: '规划中',
  } as const,
};

export const folioSolutions = {
  title: '把 AI 用进一段具体业务。',
  lead: '从看清问题到跑通流程。围绕你的目标、现有系统和工作方式，用 Molis Work、插件与必要的连接，把一段值得改进的工作先做起来。',
  directions: [
    {
      id: 'content',
      name: '内容增长',
      title: '从资料与判断，到值得发布的内容。',
      headline: ['让研究变成', '有依据的内容。'],
      outcomes: ['带来源的研究材料', '能回查的选题依据', '供人审阅的内容草稿'],
      problem: '研究、选题、创作散在不同工具里，做过的判断留不下来。',
      process: ['整理研究资料', '比较选题依据', '形成内容草稿', '由人审阅发布'],
      output: '带来源的研究材料、选题依据与内容草稿。',
      status: '部分能力验证',
      boundary:
        '已有研究、机会判断与部分内容创作能力。发布表现与策略迭代仍在规划，发布由人授权。',
    },
    {
      id: 'software',
      name: '已有软件接入 Agent',
      title: '让现有系统的能力，接得住一个目标。',
      headline: ['让 Agent 用上', '已有业务能力。'],
      outcomes: [
        '选定场景中的业务能力',
        '沿用已有的权限与规则',
        '可核对的执行记录',
      ],
      problem: '业务规则已经在系统里，AI 却只能在外面给建议。',
      process: [
        '明确业务目标',
        '连接已有能力',
        '沿用权限与规则',
        '核对执行结果',
      ],
      output: '在选定场景中可调用的业务能力、权限边界与执行记录。',
      status: '内部技术验证',
      boundary:
        '已在两个固定真实服务上验证关键路径。尚不支持任意软件的一键转换。',
    },
    {
      id: 'data',
      name: '数据分析与判断',
      title: '让一份报告，找得到每个结论的来处。',
      headline: ['每一个结论，', '都能找到依据。'],
      outcomes: [
        '可追溯的数据出处',
        '清楚呈现的分析过程',
        '待人确认的报告草稿',
      ],
      problem: '取数、解释指标和写报告反复搬运，结论的依据难以追溯。',
      process: [
        '确认数据与口径',
        '结合业务知识',
        '形成分析草稿',
        '核对报告依据',
      ],
      output: '带数据出处、分析过程与待确认判断的报告方案。',
      status: '方案设计',
      boundary:
        '指标接入、分析与报告是当前方案方向，尚未作为完整 BI 产品交付。',
    },
  ],
  stages: [
    {
      title: '先把问题看清',
      text: '一起看现在怎么做、卡在哪里、哪些判断必须由人完成。',
      result: '一个具体场景与清晰边界',
    },
    {
      title: '跑通最小的一段',
      text: '选择必要的资料、工具和能力，在 Molis Work 中组织一次可核对的试运行。',
      result: '一个可以查看结果的验证流程',
    },
    {
      title: '按结果继续',
      text: '对照约定的验收条件调整。确认有用之后，再决定扩大到哪些环节。',
      result: '验证记录与下一步建议',
    },
  ],
};
