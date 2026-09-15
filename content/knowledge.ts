export type KnowledgeEntry = {
  slug: string;
  name: string;
  english: string;
  category: '动效百科' | '网页词典';
  description: string;
  searchTerms: string;
  use: string;
  caution: string;
  recipe: string;
  source: { name: string; url: string };
};
export const knowledge: KnowledgeEntry[] = [
  {
    slug: 'stagger',
    name: '错落入场',
    english: 'Staggered reveal',
    category: '动效百科',
    description: '让一组内容按顺序进入视野，用短暂的时间差表达阅读顺序。',
    searchTerms: '文字一个个出现 逐段浮现 依次 淡入 渐入 卡片 reveal stagger',
    use: '适合短标题、少量功能介绍和首次出现的选项。先让最重要的内容出现，再引出补充信息。',
    caution:
      '不要把整篇长文拆成逐字动画；不要让用户等待动画结束才能阅读或操作。',
    recipe:
      '让同组内容从下方 12px 处轻轻归位，透明度从 0.35 到 1。相邻项错开 90ms，使用 cubic-bezier(0.16, 1, 0.3, 1)。内容默认可见，只在首次进入视口时播放一次；提供静态回退。',
    source: {
      name: 'MDN · CSS animation',
      url: 'https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/animation',
    },
  },
  {
    slug: 'underline',
    name: '下划线展开',
    english: 'Drawn underline',
    category: '动效百科',
    description: '用一条从左到右展开的细线，回应用户对链接的悬停或键盘聚焦。',
    searchTerms: '链接 鼠标经过 线条 划线 hover underline 焦点',
    use: '适合正文链接、轻量导航和阅读入口。细线标明可操作性，不改变文字本身的位置。',
    caution: '触屏没有悬停。基础样式仍需表明它是链接，键盘焦点不能只依靠动画。',
    recipe:
      '保留链接的基础下划线。用伪元素做一条 1px 强调线，transform-origin 设为 left，通过 scaleX 从 0 到 1 展开；在 hover 与 focus-visible 时都触发。不要改变文字宽度或造成布局偏移。',
    source: {
      name: 'MDN · CSS transform',
      url: 'https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/transform',
    },
  },
  {
    slug: 'accordion',
    name: '折叠展开',
    english: 'Accordion',
    category: '动效百科',
    description:
      '由用户打开需要的补充信息，让问题列表保持简洁，让答案仍然触手可及。',
    searchTerms: '点击展开 收起 问答 FAQ 折叠 details accordion',
    use: '适合常见问题、方案补充与可选说明。标题应足以让用户判断里面有没有自己需要的内容。',
    caution:
      '核心结论不要全部藏进折叠区。关闭后，内部链接也应离开键盘焦点顺序。',
    recipe:
      '优先使用原生 details / summary，支持鼠标和键盘。展开时内容用轻微入场表达状态变化；关闭后内容和内部链接不可聚焦。避免用固定 max-height 裁切长内容，保留明确的开合图标。',
    source: {
      name: 'MDN · details element',
      url: 'https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/details',
    },
  },
  {
    slug: 'scroll-snap',
    name: '滚动吸附',
    english: 'Scroll snap',
    category: '网页词典',
    description:
      '在原生滚动结束时，让内容停在合适的阅读位置，像把书页轻轻对齐。',
    searchTerms: '横向 滑动 轮播 卡片 左右 吸附 scroll snap carousel',
    use: '适合横向作品集、图片浏览和短内容分组。露出下一项，告诉用户这里还可以继续滑动。',
    caution:
      '不要劫持整个页面滚动。过强的吸附会让长内容难以阅读；同时提供按钮和键盘操作。',
    recipe:
      '用原生 overflow-x: auto 构建横向轨道，scroll-snap-type: x proximity，各项 scroll-snap-align: start。露出下一项；提供前后按钮、可见焦点和边界禁用状态，不自动播放。小屏保持页面自身不横向溢出。',
    source: {
      name: 'MDN · scroll-snap-type',
      url: 'https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/scroll-snap-type',
    },
  },
  {
    slug: 'sticky',
    name: '粘性定位',
    english: 'Sticky positioning',
    category: '网页词典',
    description: '元素滚到指定位置后暂时停留，在所属容器结束时一起离开。',
    searchTerms: '目录 吸顶 固定 跟随 滚动 sticky position',
    use: '适合长文目录、章节标题和需要随时参考的简短信息。用户滚动正文时，仍能知道自己在哪里。',
    caution:
      '固定区域不能挡住正文或占满小屏。检查父容器的 overflow 与高度，并在窄屏恢复普通文档流。',
    recipe:
      '使用 position: sticky 和明确的 top 偏移，使辅助目录在其正文容器内停留。正文始终沿原生文档流滚动；小屏取消粘性布局。锚点设置 scroll-margin-top，避免标题被遮挡。',
    source: {
      name: 'MDN · CSS position',
      url: 'https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/position',
    },
  },
  {
    slug: 'asymmetric-grid',
    name: '不对称分栏',
    english: 'Asymmetric grid',
    category: '网页词典',
    description: '给主次内容分配不同宽度，用空间比例表达信息的重要程度。',
    searchTerms: '排版 布局 两栏 主次 留白 grid columns 不等宽',
    use: '适合作品介绍、正文与旁注、产品与使用说明。主内容占据更多空间，辅助内容紧邻但不争夺注意力。',
    caution:
      '视觉顺序应与阅读顺序一致。小屏按内容先后转为单列，不要用 CSS 排序改变键盘顺序。',
    recipe:
      '使用 CSS Grid，桌面主栏与辅助栏比例 2:1，列宽使用 minmax(0, 2fr) minmax(0, 1fr)。内容先后顺序由 HTML 决定；窄屏改为单列。合理控制行长，避免用固定高度裁切正文。',
    source: {
      name: 'MDN · CSS grid layout',
      url: 'https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Grid_layout',
    },
  },
];
export function knowledgePrompt(entry: KnowledgeEntry, duration = 700) {
  const timing =
    entry.category === '动效百科'
      ? `\n本次选择的单次动效时长：${duration}ms。`
      : '';
  return `请在我的现有项目中实现「${entry.name} / ${entry.english}」。\n\n目标：${entry.description}\n实现要求：${entry.recipe}${timing}\n\n请先查看目标页面与现有技术栈，沿用项目的字体、配色和组件规范。不要修改无关页面。尊重 prefers-reduced-motion：减少动态时直接显示最终状态。验证移动布局、键盘操作和内容完整性。\n\n应用位置：[补充页面或组件]\n实际内容：[粘贴需要展示的内容]\n\n参考：${entry.source.url}\n条目由 Molis AI 整理。`;
}
