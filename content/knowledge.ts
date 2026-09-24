export type KnowledgeCategory = '动效百科' | '网页词典' | '组件资源';
export type ResourceGroup = 'micro' | 'polish' | 'inspiration';
export const knowledgeCategoryFilters = [
  '全部',
  '动效百科',
  '网页词典',
  '组件资源',
] as const;
type KnowledgeBase = {
  slug: string;
  name: string;
  english: string;
  description: string;
  searchTerms: string;
  use: string;
  caution: string;
  recipe: string;
  source: { name: string; url: string };
};
export type TechniqueEntry = KnowledgeBase & {
  category: '动效百科' | '网页词典';
};
export type ResourceEntry = KnowledgeBase & {
  category: '组件资源';
  group: ResourceGroup;
};
export type KnowledgeEntry = TechniqueEntry | ResourceEntry;
export function isResourceEntry(
  entry: KnowledgeEntry,
): entry is ResourceEntry {
  return entry.category === '组件资源';
}
export function filterKnowledge(
  entries: KnowledgeEntry[],
  query: string,
  category: (typeof knowledgeCategoryFilters)[number],
) {
  const needle = query.trim().toLowerCase();
  return entries.filter(
    (entry) =>
      (category === '全部' || entry.category === category) &&
      `${entry.name} ${entry.english} ${entry.description} ${entry.searchTerms} ${entry.use} ${entry.recipe}`
        .toLowerCase()
        .includes(needle),
  );
}
export function relatedKnowledge(entry: KnowledgeEntry, limit = 4) {
  return knowledge
    .filter((item) => item.slug !== entry.slug)
    .filter((item) =>
      isResourceEntry(entry)
        ? isResourceEntry(item) && item.group === entry.group
        : item.category === entry.category,
    )
    .slice(0, limit);
}
const techniques: TechniqueEntry[] = [
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
export const resourceGroupLabels: Record<
  ResourceGroup,
  { title: string; short: string }
> = {
  micro: { title: '微交互组件与代码案例', short: '微交互' },
  polish: { title: '更容易用进真实产品的小库', short: '小库' },
  inspiration: { title: 'CSS 小效果与交互灵感', short: '灵感' },
};

export const resourceGuide = {
  playful:
    '想要一个小控件就能玩一会儿：先看 Animata、SmoothUI、Skiper UI、Hover.dev、Spell UI。重点看流体 Tabs、可展开卡片、吸附按钮、滑动操作和多状态输入，而不是背景特效。',
  quiet:
    '工作台更安静时：用 Animate UI 或 Motion Primitives 处理基础交互，NumberFlow 处理数字，AutoAnimate 处理列表，Sonner 处理操作反馈。平时不动，状态改变时才解释发生了什么。',
  caveat:
    '这些是编辑整理的外部来源，不是本站内置组件，也还没有逐一做项目集成测试。真正落地时，把键盘操作、触屏行为和减少动态效果当作验收项。',
};

export const componentResources: ResourceEntry[] = [
  {
    slug: 'animata',
    name: 'Animata',
    english: 'Animated React components',
    category: '组件资源',
    group: 'micro',
    description:
      '一套可复制的 React 动效组件，偏实际产品里的小交互，而不只是背景特效。',
    searchTerms:
      '流体 tabs gooey 悬浮菜单 卡片堆叠 头像列表 进度反馈 微交互 animata 优先看',
    use: 'Fluid Tabs、Gooey Tabs、悬浮操作菜单、卡片堆叠、头像列表、进度反馈。适合找可以放进真实界面的小控件。',
    caution:
      '优先挑单个交互，不要整页替换现有产品。落地时检查键盘、触屏和减少动态效果。',
    recipe: 'React 组件，复制源码到现有项目。MIT 开源。沿用项目字体和颜色，不要连带搬来整套视觉。',
    source: { name: 'Animata', url: 'https://animata.design/' },
  },
  {
    slug: 'smoothui',
    name: 'SmoothUI',
    english: 'Elastic, stateful micro UI',
    category: '组件资源',
    group: 'micro',
    description: '弹性、连续变形和状态变化很明显的小控件，接近“一个控件就能玩一会儿”的感觉。',
    searchTerms:
      'dynamic island 动态标签 社交切换 头像 滑动 卡片堆叠 弹性 smoothui micro',
    use: 'Dynamic Island、动态标签、社交选项切换、头像交互、滑动操作、卡片堆叠。适合研究有弹性的状态切换。',
    caution: '动效连续不等于每个入口都要变形。工具型界面只保留能解释状态变化的部分。',
    recipe: 'React、Tailwind；兼容 shadcn 的安装方式。免费开源。按需接入单个组件。',
    source: { name: 'SmoothUI', url: 'https://smoothui.dev/' },
  },
  {
    slug: 'skiper-ui',
    name: 'Skiper UI',
    english: 'Memorable small interactions',
    category: '组件资源',
    group: 'micro',
    description: '记忆点比较强的交互合集，适合筛选其中的小控件，而不是整页效果。',
    searchTerms:
      '卡片展开 拖拽 吸附按钮 弹性手风琴 数字输入 展开导航 主题切换 skiper',
    use: '卡片展开、可拖拽吸附按钮、弹性手风琴、动态数字输入、展开式导航、主题切换。',
    caution: '包含免费与 Pro 内容，接入前核对对应授权。整页演示不要直接当成产品界面。',
    recipe: '可通过 CLI 获取组件。先确认该组件是免费还是 Pro，再复制到项目里改成自己的样式。',
    source: { name: 'Skiper UI', url: 'https://skiper-ui.com/' },
  },
  {
    slug: 'hover-dev',
    name: 'Hover.dev',
    english: 'Motion recipes for common controls',
    category: '组件资源',
    group: 'micro',
    description: '同一类按钮、菜单、Tabs 能看到不同动效写法，适合横向比较，而不只看悬停。',
    searchTerms:
      '按钮 下拉 tabs 开关 通知 输入框 进度条 弹窗 hover.dev motion 横向比较',
    use: '按钮、下拉菜单、Tabs、开关、通知、输入框、进度条、弹窗的不同动效实现。',
    caution: '基础内容免费，另有 Pro。比较写法时记下触发条件、结束态和失败回退，不要只抄第一眼效果。',
    recipe: 'React、Tailwind，部分使用 Motion。从组件目录复制需要的示例，按项目规范改颜色和字号。',
    source: { name: 'Hover.dev Components', url: 'https://www.hover.dev/components' },
  },
  {
    slug: 'spell-ui',
    name: 'Spell UI',
    english: 'Precise experimental micro-interactions',
    category: '组件资源',
    group: 'micro',
    description: '偏精致的小实验，适合给核心控件加一点个性，而不是铺满所有按钮。',
    searchTerms:
      'pop button exploding input 图表提示 spinner 签名 书写 spell ui 精致',
    use: 'Pop Button、Exploding Input、图表悬浮提示、Spinner、签名书写效果。',
    caution: '实验感强，局部使用。确认动画结束还能否清楚操作；减少动态时应直接显示完成态。',
    recipe: 'React、Tailwind，复制组件源码。组件采用 MIT 许可。只引入真正需要个性的那一个控件。',
    source: { name: 'Spell UI', url: 'https://spell.sh/' },
  },
  {
    slug: 'animate-ui',
    name: 'Animate UI',
    english: 'Animated primitives for product UI',
    category: '组件资源',
    group: 'micro',
    description: '面向正式产品的动画基础控件，更适合研究工具型界面的状态切换。',
    searchTerms:
      'tabs switch checkbox tooltip popover dialog 下拉 通知列表 radix animate ui 无障碍',
    use: 'Tabs 选中态、Switch、Checkbox、Tooltip、Popover、Dialog、下拉菜单、通知列表。',
    caution:
      '优先用它处理状态切换，不要拿来做装饰性循环动画。它的无障碍文档专门说明了减少动态效果的配置。',
    recipe:
      'React、Tailwind、Motion；提供 Radix、Base UI 等体系的动画组件，通过 registry 复制到项目。',
    source: {
      name: 'Animate UI Components',
      url: 'https://animate-ui.com/docs/components',
    },
  },
  {
    slug: 'motion-primitives',
    name: 'Motion Primitives',
    english: 'Composable motion building blocks',
    category: '组件资源',
    group: 'micro',
    description: '可组合的动效零件，用来建立自己的交互语言，而不是只收藏一个炫酷 Demo。',
    searchTerms:
      '可组合 动效 原语 motion primitives tailwind 交互语言 复用 ibelick',
    use: '需要在现有产品里持续复用同一套进入、切换、反馈节奏时。适合先定语言，再落到具体控件。',
    caution: '不要把每个零件都用上。先规定何时动、动多少，再挑选原语。',
    recipe: 'React 动效组件，基于 Motion、Tailwind。MIT 开源。从仓库或文档复制需要的原语。',
    source: {
      name: 'Motion Primitives on GitHub',
      url: 'https://github.com/ibelick/motion-primitives',
    },
  },
  {
    slug: 'fancy-components',
    name: 'Fancy Components',
    english: 'Playful physics-like interactions',
    category: '组件资源',
    group: 'micro',
    description: '带一点物理感和玩具感的交互，适合找趣味性，但建议局部使用。',
    searchTerms:
      '拖拽 卡片堆叠 弹性线条 文字 hover 下划线 数字滚动 fancy 物理感 玩具',
    use: '可拖拽元素、卡片堆叠、弹性线条、文字 hover、下划线变化、数字滚动。',
    caution: '趣味容易抢注意力。工作台和阅读界面只放在真正需要被记住的动作上。',
    recipe: 'React、TypeScript、Tailwind、Motion。免费开源，可复制修改。改成项目颜色后再考虑是否保留物理感。',
    source: {
      name: 'Fancy Components',
      url: 'https://www.fancycomponents.dev/docs/introduction',
    },
  },
  {
    slug: 'indie-ui',
    name: 'Indie UI',
    english: 'Stateful buttons and feedback',
    category: '组件资源',
    group: 'micro',
    description: '小而直接，很适合看“点击之后发生什么”，而不是只看静态外观。',
    searchTerms:
      'stateful button 多状态按钮 展开卡片 点状加载 文字加载 indie ui 点击反馈',
    use: 'Stateful Button、多状态按钮、可展开卡片、点状与文字加载反馈。',
    caution: '按钮状态要能对应真实任务：提交中、成功、失败、可重试。不要只有好看的 loading。',
    recipe: 'React、shadcn、Framer Motion。页面提供源码，按需复制。把示例状态接到真实请求结果。',
    source: { name: 'Indie UI', url: 'https://ui.indie-starter.dev/' },
  },
  {
    slug: 'build-ui-recipes',
    name: 'Build UI Recipes',
    english: 'Explained interaction examples',
    category: '组件资源',
    group: 'micro',
    description: '交互案例带着代码和讲解，不只是拿组件，还能看清一个细节为什么这样实现。',
    searchTerms:
      'elastic slider 可调面板 toast 选择器 动态列表 ios 开关 多步骤表单 build ui recipes',
    use: 'Elastic Slider、可调整尺寸面板、Animated Toast、选择器、动态列表、iOS 开关、多步骤表单。',
    caution: '另有课程。案例是教学材料，迁到产品前要改成自己的内容和可访问实现。',
    recipe: '打开 Recipes 阅读实现说明并对照代码。把其中一条路径接到现有组件，而不是整页移植。',
    source: { name: 'Build UI Recipes', url: 'https://buildui.com/recipes' },
  },
  {
    slug: 'motion-examples',
    name: 'Motion 示例',
    english: 'Official examples and Motion+',
    category: '组件资源',
    group: 'micro',
    description: 'Motion 官方示例，容易被忽略，但很对微交互这件题。',
    searchTerms:
      '长按确认 滑动 复制按钮 多状态徽章 平滑 tabs 堆叠通知 径向菜单 motion+ examples',
    use: '长按确认、滑动操作、复制按钮、多状态徽章、平滑 Tabs、堆叠通知、径向菜单。优先看 Buttons、Interactions、Forms、Navigation。',
    caution: '有免费示例与 Motion+ 付费源码。免费示例足够研究思路；付费源码按官方授权使用。',
    recipe: '提供 React、JavaScript、Vue 示例。从 Examples 筛选对应控件，按现有技术栈复制最小片段。',
    source: { name: 'Motion Examples', url: 'https://motion.dev/examples' },
  },
  {
    slug: 'kokonut-ui',
    name: 'Kokonut UI',
    english: 'AI action and input feedback',
    category: '组件资源',
    group: 'micro',
    description: '对输入框、提交按钮和 AI 操作入口更有参考价值，适合 AI 工具界面。',
    searchTerms:
      '按钮反馈 ai prompt 输入框 卡片 文字状态 kokonut shadcn 提交',
    use: '按钮反馈、AI Prompt 输入、输入区域动效、卡片与文字状态效果。',
    caution: '公共组件之外有 Pro。AI 输入区的动画不能妨碍粘贴、换行和键盘操作。',
    recipe: 'React、Tailwind；支持 shadcn CLI 或复制源码。先接入输入和提交这两个最常用的反馈。',
    source: { name: 'Kokonut UI', url: 'https://kokonutui.com/' },
  },
  {
    slug: 'numberflow',
    name: 'NumberFlow',
    english: 'Animated numbers',
    category: '组件资源',
    group: 'polish',
    description: '数值变化时做连续过渡，比给整张卡片加动画更容易保持克制。',
    searchTerms:
      '数字 滚动 价格 倒计时 统计 任务数量 numberflow 格式化 减少动态',
    use: '任务数量、价格、倒计时、统计数字。只包住真正会变化的数字。',
    caution: '不要装饰静态数字。它支持减少动态效果的系统偏好，落地时应保留这条路径。',
    recipe: '提供 React 组件，支持数字格式化。安装后包住变化中的数值，沿用项目字体。',
    source: { name: 'NumberFlow for React', url: 'https://number-flow.barvian.me/' },
  },
  {
    slug: 'auto-animate',
    name: 'AutoAnimate',
    english: 'Automatic list transitions',
    category: '组件资源',
    group: 'polish',
    description: '子元素新增、删除、移动时自动补上过渡，减轻列表突然跳动的感觉。',
    searchTerms:
      '列表 新增 删除 移动 自动动画 autoanimate 标签 筛选 动态表单 formkit',
    use: '任务列表、标签列表、筛选结果、动态表单。适合改善内容变化时的突兀感。',
    caution: '长列表或频繁刷新时动画会吵。减少动态时应关闭过渡。不要用它掩盖错误的列表更新。',
    recipe: '支持 React、Vue、Svelte 和原生 JavaScript。给会变化的列表容器加上一行接入即可。',
    source: { name: 'AutoAnimate', url: 'https://auto-animate.formkit.com/' },
  },
  {
    slug: 'sonner',
    name: 'Sonner',
    english: 'Toast notifications',
    category: '组件资源',
    group: 'polish',
    description: '处理操作之后的反馈：保存成功、复制完成、后台处理和撤销。',
    searchTerms:
      'toast 通知 堆叠 展开 滑动关闭 异步 撤销 保存成功 复制完成 sonner',
    use: '保存成功、复制完成、后台处理、撤销操作。需要告诉用户“刚才那一步结果如何”的时候。',
    caution: '不要用通知代替页面里的错误位置。重要失败仍要写在表单旁边。注意与减少动态偏好共存。',
    recipe: 'React Toast。包含堆叠、展开、滑动关闭、异步任务状态和操作按钮。按现有项目安装后只用于操作反馈。',
    source: { name: 'Sonner', url: 'https://sonner.emilkowal.ski/' },
  },
  {
    slug: 'lucide-animated',
    name: 'lucide-animated',
    english: 'Animated line icons',
    category: '组件资源',
    group: 'polish',
    description: '基于 Lucide 和 Motion 的动画图标，适合已经使用线性图标的简洁界面。',
    searchTerms:
      'lucide 动画图标 工具栏 按钮 状态入口 shadcn 线性图标 lucide-animated',
    use: '工具栏、按钮、状态入口。图标本身需要表明“已收藏、已复制、正在进行”时。',
    caution: '图标动画要短。循环播放会变成噪音。本站若已用 Lucide，保持同一套线条粗细。',
    recipe: 'MIT 开源，支持 shadcn CLI 接入。只替换真正有状态变化的那几个图标。',
    source: { name: 'lucide-animated', url: 'https://lucide-animated.com/' },
  },
  {
    slug: 'useanimations',
    name: 'useAnimations',
    english: 'Micro-animated icon assets',
    category: '组件资源',
    group: 'polish',
    description: '收藏、锁定、复制、播放这类微动画图标素材。它是动画素材，不是完整业务控件。',
    searchTerms:
      '收藏 书签 菜单 锁 显示隐藏 复制 下载 播放 checkbox toggle lottie svg useanimations',
    use: '图标本身需要表达状态变化的场景：收藏、书签、菜单、锁、显示与隐藏、复制、下载、播放、Checkbox、Toggle。',
    caution: '提供 Lottie、SVG 等素材，不是表单或导航组件。接入后仍要自己处理可点击区域和键盘操作。',
    recipe: '从目录选择对应动作的图标，按项目需要导出 Lottie 或 SVG，接到现有按钮的状态上。',
    source: { name: 'useAnimations', url: 'https://useanimations.com/' },
  },
  {
    slug: 'lordicon',
    name: 'Lordicon',
    english: 'Editable animated icons',
    category: '组件资源',
    group: 'polish',
    description: '可编辑的动态图标，有 hover、形态变化和循环等播放形式，含免费与付费内容。',
    searchTerms:
      '动态图标 hover 形态变化 循环 空状态 功能入口 lordicon system 免费 付费',
    use: '功能入口、状态提示、空状态。工具型界面可以优先看它偏简洁的 System 图标系列。',
    caution: '有免费与付费内容。循环动画适合等待，不适合所有入口。注意授权和使用方式。',
    recipe: '在站点里挑选并编辑图标，按官方提供的嵌入或下载方式放到按钮、空状态或提示里。',
    source: { name: 'Lordicon', url: 'https://lordicon.com/' },
  },
  {
    slug: 'uiverse',
    name: 'Uiverse',
    english: 'Community UI elements',
    category: '组件资源',
    group: 'inspiration',
    description: '社区贡献的大量小控件，适合浏览单个交互，再统一进自己的样式，不要整套混搭。',
    searchTerms:
      '社区 按钮 开关 checkbox 输入框 tooltip loading 进度条 uiverse mit 复制',
    use: '按钮、开关、Checkbox、输入框、Tooltip、Loading、进度条。适合大量浏览后只挑一个细节。',
    caution:
      '质量参差。平台说明其 UI 元素采用 MIT 许可，仍要逐个看实现是否可访问，不要直接拼成一套界面。',
    recipe: '复制单个元素的代码，改成项目的颜色、字号和焦点样式后再用。',
    source: { name: 'Uiverse', url: 'https://uiverse.io/' },
  },
  {
    slug: 'cssfx',
    name: 'CSSFX',
    english: 'Click-to-copy CSS effects',
    category: '组件资源',
    group: 'inspiration',
    description: '点击复制的纯 CSS 效果，适合轻量补细节，不必为了简单反馈引入完整 React 动效方案。',
    searchTerms:
      '纯 css 按钮反馈 输入框线条 下划线 loading cssfx 轻量 复制',
    use: '按钮反馈、输入框线条、下划线和 Loading。现有界面只缺一点按压或焦点回应时。',
    caution: '效果词典不是设计系统。选一个与现有线条和节奏相近的，避免每个按钮一种动画。',
    recipe: 'MIT 开源。打开站点复制对应 CSS，接到现有 class 上，确认 hover 不是唯一可发现方式。',
    source: { name: 'CSSFX', url: 'https://cssfx.netlify.app/' },
  },
  {
    slug: 'hover-css',
    name: 'Hover.css',
    english: 'Hover and press effect dictionary',
    category: '组件资源',
    group: 'inspiration',
    description: '按压、缩放、边框、下划线、图标 hover 的基础效果词典，不能替代完整状态交互。',
    searchTerms:
      'hover.css 按压 缩放 边框 下划线 图标 sass less css 悬停 词典',
    use: '需要查找一种克制的 hover 或按压反馈时。适合对照现有链接和下划线条目，补一点手感。',
    caution: '触屏没有悬停。它不能表达提交中、成功或失败。基础可点击样式仍要先成立。',
    recipe: '提供 CSS、Sass、LESS。复制单个效果，接到已有链接或按钮，不要引入整份效果清单。',
    source: { name: 'Hover.css', url: 'https://ianlunn.github.io/Hover/' },
  },
  {
    slug: 'shadcn-io',
    name: 'shadcn.io Components',
    english: 'Extra shadcn interaction components',
    category: '组件资源',
    group: 'inspiration',
    description: '给已有 shadcn 项目补控件。建议按具体交互搜索，而不是一次加一整页。',
    searchTerms:
      'shadcn motion highlight tooltip counter dock image zoom pin list tags shadcn.io',
    use: 'Motion Highlight、Animated Tooltip、Counter、Dock、Image Zoom、Pin List、Tags。',
    caution: '这是扩展目录，不是 shadcn/ui 本体。加入前确认依赖、授权和是否与现有组件重复。',
    recipe: '打开组件目录，按要补的交互搜索并复制。保持与项目已有 shadcn 组件同一套 token。',
    source: { name: 'shadcn.io Components', url: 'https://www.shadcn.io/components' },
  },
  {
    slug: 'ui-layouts',
    name: 'UI Layouts',
    english: 'Workbench and input components',
    category: '组件资源',
    group: 'inspiration',
    description: '更偏完整控件，对文件工具、工作台、输入区域这些场景有参考价值。',
    searchTerms:
      '按钮 标签输入 拖拽上传 日期 时间 dock 手风琴 ui layouts 工作台 文件',
    use: '按钮、标签输入、拖拽上传、日期时间输入、Dock、手风琴。适合对照文件工具和工作台。',
    caution: '另有 Pro 内容。完整控件迁入前，先核对键盘、触屏、错误提示和现有表单语言是否一致。',
    recipe: '从站点选择对应组件，按文档复制或安装。只拿当前页面缺的那一个输入或布局。',
    source: { name: 'UI Layouts', url: 'https://www.ui-layouts.com/' },
  },
  {
    slug: 'codrops',
    name: 'Codrops',
    english: 'Creative interaction experiments',
    category: '组件资源',
    group: 'inspiration',
    description: '交互实验、动效教程和带代码的创意案例。适合找差异化思路，需要自己提炼和产品化。',
    searchTerms:
      'codrops 实验 教程 创意 motion highlights 差异化 灵感 tympanus',
    use: '需要打破常规组件库同质化、寻找一个可被产品化的交互想法时。也包含 Motion Highlights 等栏目。',
    caution: '不是标准组件库。实验代码常为演示完整创意，直接进生产容易过重或不可访问。',
    recipe: '阅读案例与源码，抽出触发、过程和结束态，再在现有技术栈里用更小的实现重做。',
    source: { name: 'Codrops', url: 'https://tympanus.net/codrops/' },
  },
];

export const knowledge: KnowledgeEntry[] = [
  ...techniques,
  ...componentResources,
];
export function knowledgePrompt(entry: KnowledgeEntry, duration = 700) {
  if (isResourceEntry(entry)) {
    return `请参考「${entry.name} / ${entry.english}」，有选择地改进我现有项目中的交互。\n\n这份资源适合看：${entry.use}\n获取与接入：${entry.recipe}\n使用判断：${entry.caution}\n\n请先查看目标页面与现有技术栈，沿用项目的字体、配色和组件规范。只引入真正需要的单个交互，不要整页替换或混搭整套视觉。核对授权与 Pro 边界。尊重 prefers-reduced-motion：减少动态时直接显示最终状态。验证移动布局、键盘操作、触屏行为和内容完整性。\n\n应用位置：[补充页面或组件]\n实际需求：[说明要改进的控件或反馈]\n\n参考：${entry.source.url}\n条目由 Molis AI 整理。`;
  }
  const timing =
    entry.category === '动效百科'
      ? `\n本次选择的单次动效时长：${duration}ms。`
      : '';
  return `请在我的现有项目中实现「${entry.name} / ${entry.english}」。\n\n目标：${entry.description}\n实现要求：${entry.recipe}${timing}\n\n请先查看目标页面与现有技术栈，沿用项目的字体、配色和组件规范。不要修改无关页面。尊重 prefers-reduced-motion：减少动态时直接显示最终状态。验证移动布局、键盘操作和内容完整性。\n\n应用位置：[补充页面或组件]\n实际内容：[粘贴需要展示的内容]\n\n参考：${entry.source.url}\n条目由 Molis AI 整理。`;
}
