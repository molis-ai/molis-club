// Molis Work 页（2026-10-24 重做；2026-11-02 第三轮：一扇窗从头到尾不离场，提案见「Molis Work 页第三轮提案」）。
// 四屏按读者的问题排：是什么（首屏）→ 怎么用（镜头在窗里走三拍）→ 为什么不用我现在的（换个 AI，不用从头讲）→ 怎么开始（一封信）。
// 开场三句是负责人 10-30 改定的：「工作，不止于 AI 对话。」、英文口号和一句「是什么」，讲的是对话之后工作接得上。
// 画面照 Molis Work 最新桌面端（浅色 Soft Workbench）画；画面里的名字、数字、时间都是示意。
// workQuoted 是 docs/studio-intro.md 的原句（测试逐句核对），其余是新写的界面文字。

export const workHero = {
  form: '工作台',
  stage: '开发中',
  title: '工作，不止于 AI 对话。',
  slogan: 'Work, people, AI and tools — better connected than ever.',
  what: 'Molis Work 是装在你电脑上的 AI 工作台，让对话里的决定、资料和成果，接得上下一步工作。',
  go: '报名内测',
  label:
    '界面示意：Molis Work 的窗口里打开一个目标「划线卡片 v1.1：导出到 Anki」——一件定过的事、三条完成要求，右边是这件事的记录。',
};

/** 每一拍贴在亮处旁边的一句话（不超过 18 个字），键是画面里的那一拍 */
export type WorkBeatId = 'u1' | 'u2' | 'u3' | 'c1' | 'c2' | 'c3';

/** 二屏：一件事从开头接到做完，镜头在同一扇窗里走三拍 */
export const workCases = {
  kicker: '用起来',
  title: '一件事，从开头接到做完。',
  notes: {
    u1: '和 AI 说定的事，落成一页',
    u2: '换一家 AI，读的还是这一页',
    u3: '在评论里叫 AI，它不动正文',
  } as Partial<Record<WorkBeatId, string>>,
};

/**
 * 三屏：为什么不用我现在的。只立一个王炸——接得上：先和新开的对话对照（这些都要再讲一遍），
 * 再看换一家 AI 怎么接着做，读者能自己换。取材于 10-29 的用户调研；不点名别家，不说无缝。
 */
export const workWhy = {
  kicker: '为什么是 Molis',
  title: '换个 AI，不用从头讲。',
  chat: '新开一个对话，这些都要再讲一遍',
  notes: {
    c1: '约好的事、做到哪、谁验过，都在这一页',
    c2: '改过哪些、你验过哪条，下一家也看得到',
    c3: '隔几天回来，也从这一页接着做',
  } as Partial<Record<WorkBeatId, string>>,
  /** 收尾两句：前一句浅，后一句亮 */
  coda: ['问一句就走的事，聊天就够了。', '要接着做下去的，交给 Molis。'],
  /** 「是你的」不当卖点，挪到结尾一行（原句） */
  own: '工作数据保存在本机，使用 AI 时会调用你配置的模型服务。',
};

/**
 * 怎么开始（2026-11-02 第三轮）：去掉台面，一封信——缘起、信念和它的解释；下面是一张「来自 Molis 团队」的小卡，
 * 只留内测报名。源码入口先拿掉，开源的新说法等底稿定了再改。photoAlt 是改版前那张照片的替代文字，现在页面不用，删不删等负责人定。
 */
export const workEnd = {
  origin: '一开始，我们只是想做一个让自己团队用得更顺的工具。',
  photoAlt: '午后的屋子里，一个人坐在窗边的扶手椅上读书，叶影落在墙上。',
  belief: '判断归人，执行可以托付。',
  beliefText: '想要什么、为什么做、什么结果值得接受，这些重要判断留在人手里。',
  ask: {
    from: '来自 Molis 团队',
    question: '要不要一起试新版？',
  },
};

/** 页面上用到的 docs/studio-intro.md 原句（tests/site-copy.test.mjs 逐句核对） */
export const workQuoted = [workWhy.own, workEnd.belief, workEnd.beliefText];

