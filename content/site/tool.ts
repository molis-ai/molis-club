// Molis Tool 页：一个下午手边冒出的几件小事。章节正文取自 docs/studio-intro.md 4.2（原句）；
// 每一步的一句话说明画面在演什么，画面与其中的材料都是示意。

import { products } from './products';

const tool = products.tool;
const [small, chain, later] = tool.sections;

export type ToolChapterId = 'oldWay' | 'small' | 'chain' | 'later';

export const toolChapters: {
  id: ToolChapterId;
  kicker: string;
  title: string;
  paragraphs: string[];
  steps: string[];
}[] = [
  {
    id: 'oldWay',
    kicker: '下午 2:10',
    title: tool.opening[1],
    paragraphs: [tool.opening[0], tool.opening[2]],
    steps: [
      '老路要走四步：打开应用、搬运材料、找功能、再带回来。',
      '在 Tool 里，选中它，动作就在光标旁边。',
      '一步做完，结果留在原处。',
    ],
  },
  {
    id: 'small',
    kicker: '下午 2:40',
    title: small.title,
    paragraphs: small.paragraphs,
    steps: [
      '清理一段文字，本机完成。',
      '从 PDF 里取三页：副本处理，原件保留。',
      '给一张图片写一句说明：要理解内容时，才用 AI。',
    ],
  },
  {
    id: 'chain',
    kicker: '下午 3:15',
    title: chain.title,
    paragraphs: chain.paragraphs,
    steps: [
      '一份报价 PDF。',
      '提取出文字。',
      '整理成表格。',
      '接着比较，或者导出。',
    ],
  },
  {
    id: 'later',
    kicker: '下午 4:30',
    title: later.title,
    paragraphs: later.paragraphs,
    steps: [
      '先去做别的事，工具收进菜单栏。',
      '回来时，材料、草稿和结果都在「接续」里。',
      '还能回看它们来自哪里。',
    ],
  },
];

/** 标志性交互：整页任意选中一句话，动作条出现在光标旁（结果为示意）。新写 */
export const selectTry = {
  kicker: '亲手试一次',
  title: '在这一页，选中任意一句话。',
  lead: '用鼠标拖过一句话，或者用键盘选中它，动作条会出现在光标旁边。这里是网页里的示意：字数和纯文本是真的，需要 AI 的动作只演示会出现在哪里。',
  note: '交互示意',
  sample: '读到一段文字，想清理一下格式；拿到一份 PDF，只需要其中几页；看到活动信息，想顺手整理成日程。',
  actions: {
    count: '数一数',
    plain: '复制纯文本',
    explain: '解释',
    todo: '整理成待办',
  },
  results: {
    count: (n: number) => `这句话有 ${n} 个字。`,
    plain: '已复制为纯文本，格式都去掉了。',
    plainFailed: '浏览器没让复制，选中的文字还在。',
    explain: '示意：在 Molis Tool 里，这里会用你配置的 AI 服务解释这句话，结果留在原处。',
    todo: '示意：在 Molis Tool 里，这里会把这句话整理成一条待办草稿，加入前由你确认。',
  },
  local: '本机',
  ai: 'AI',
  close: '收起',
};

/** 当前进展：摘自 4.2「当前进展」原句 */
export const toolProgress = {
  have: ['Molis Tool 已有 Mac 开发版本，以及文字、文件、PDF、表格等本机处理能力。'],
  notYet: [
    '跨应用交互、真实 AI 和系统服务仍在整合与验证，尚未公开提供安装包。',
    '它按独立产品推进，也计划成为 Molis Work 的基础能力，具体接入范围与时间尚未确定。',
  ],
  /** 新写 */
  now: ['现在还不能下载试用。想知道它什么时候能用，可以留个联系方式。'],
};

export const toolGo = {
  follow: '关注 Molis Tool 的进展',
  work: '看看 Molis Work',
};
