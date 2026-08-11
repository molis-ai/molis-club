---
name: "烤个梨呀"
description: "一座以暖灰纸面、炭黑与梨黄火候线组织作品、作者和参与入口的公开社区前台。"
colors:
  paper: "#f4f1e9"
  paper-soft: "#ebe6dc"
  paper-deep: "#ddd5c6"
  surface: "#fbfaf6"
  ink: "#1d1c19"
  ink-secondary: "#4b4943"
  muted: "#716d64"
  line: "rgba(29, 28, 25, 0.14)"
  line-strong: "rgba(29, 28, 25, 0.28)"
  pear: "#d79a1e"
  pear-dark: "#9a6810"
  pear-soft: "#f0d694"
  pear-hover: "#e2a52b"
  ink-hover: "#34322d"
  leaf: "#58743c"
  alert: "#9a4d31"
typography:
  display:
    fontFamily: '"PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", ui-sans-serif, system-ui, sans-serif'
    fontSize: "clamp(48px, 6vw, 82px)"
    fontWeight: 520
    lineHeight: 1.12
    letterSpacing: "-0.035em"
  headline:
    fontFamily: '"Songti SC", "STSong", "Noto Serif CJK SC", serif'
    fontSize: "clamp(34px, 4vw, 54px)"
    fontWeight: 600
    lineHeight: 1.22
    letterSpacing: "-0.02em"
  title:
    fontFamily: '"PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", ui-sans-serif, system-ui, sans-serif'
    fontSize: "clamp(19px, 2vw, 26px)"
    fontWeight: 600
    lineHeight: 1.36
    letterSpacing: "normal"
  body:
    fontFamily: '"PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", ui-sans-serif, system-ui, sans-serif'
    fontSize: "16px"
    fontWeight: 400
    lineHeight: 1.6
    letterSpacing: "normal"
  label:
    fontFamily: '"PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", ui-sans-serif, system-ui, sans-serif'
    fontSize: "14px"
    fontWeight: 600
    lineHeight: 1.6
    letterSpacing: "normal"
rounded:
  small: "10px"
  surface: "14px"
  pill: "999px"
components:
  button-primary:
    backgroundColor: "{colors.pear}"
    textColor: "{colors.ink}"
    typography: "{typography.label}"
    rounded: "{rounded.small}"
    padding: "0 19px"
    height: "48px"
  button-primary-hover:
    backgroundColor: "{colors.pear-hover}"
    textColor: "{colors.ink}"
    typography: "{typography.label}"
    rounded: "{rounded.small}"
    padding: "0 19px"
    height: "48px"
  button-secondary:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    typography: "{typography.label}"
    rounded: "{rounded.small}"
    padding: "0 19px"
    height: "48px"
  button-dark:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.surface}"
    typography: "{typography.label}"
    rounded: "{rounded.small}"
    padding: "0 19px"
    height: "48px"
  button-dark-hover:
    backgroundColor: "{colors.ink-hover}"
    textColor: "{colors.surface}"
    typography: "{typography.label}"
    rounded: "{rounded.small}"
    padding: "0 19px"
    height: "48px"
  search-field:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    typography: "{typography.body}"
    rounded: "{rounded.surface}"
    padding: "8px"
    height: "66px"
  primary-navigation:
    backgroundColor: "transparent"
    textColor: "{colors.ink-secondary}"
    typography: "{typography.label}"
    padding: "0 13px"
    height: "44px"
  appearance-toggle:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    typography: "{typography.body}"
    rounded: "{rounded.small}"
    padding: "0 12px"
    height: "42px"
  category-filter:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    typography: "{typography.label}"
    padding: "10px 14px"
    height: "70px"
  category-filter-selected:
    backgroundColor: "{colors.pear-soft}"
    textColor: "{colors.ink}"
    typography: "{typography.label}"
    padding: "10px 14px"
    height: "70px"
  status-chip:
    backgroundColor: "transparent"
    textColor: "{colors.ink-secondary}"
    rounded: "{rounded.pill}"
    padding: "0 8px"
    height: "24px"
  live-feed-item:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    typography: "{typography.body}"
    padding: "24px 0"
    height: "150px"
  work-slip:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    typography: "{typography.body}"
    rounded: "0"
    padding: "16px 18px"
    height: "98px"
---

# Design System: 烤个梨呀

## Overview

**Creative North Star: "慢火社区前台 / The Slow-fire Commons"**

烤个梨呀不是商品陈列墙，而是一张在公共炉边摊开的社区前台：路人先用清楚的大标题、统一搜索、内容分类和两项行动理解这里有什么，再沿着火候线进入作品、作者、更新与讨论。气质是温暖、开放、克制但不冷；创作者必须可追溯，但 Hero 不用头像抢占路人的理解路径。

视觉以暖灰纸面承载炭黑文字，用梨黄记录火候、连接关系和标记可行动之处。列表、索引、细线和纸张切片比悬浮卡墙更重要。慢火清单、开放工作室、当期封面共享同一套颜色、字型、状态与组件，只改变「正在发生」区域的拓扑；默认外观是慢火清单。当前实现只有 light 色彩系统，三外观不是明暗主题。

**Key Characteristics:**

- 暖灰纸面与近白内容面交替，保持公开社区的呼吸感。
- 炭黑负责信息，梨黄只标火候、关系、行动和少量强调。
- 大标题先解释价值，真实作者在后续关系区可追溯。
- 一维清单是默认阅读方式，另两种外观只改变内容组织。
- 细边线、低饱和图片和少量纸张位移构成克制的手作感。

## Colors

这是一套低跳跃的纸面调色板：梨黄是唯一主强调，绿与陶红只承担语义状态，绝不扩张成彩色货架。

### Primary

- **梨黄火候**：用于主行动、当前节点、关系线、选中筛选和链接下划线；它表达「正在烤」与「可以参与」。
- **深烤梨黄**：用于梨黄组件的边界、可见焦点、关系标签和细线，保证浅纸面上的结构清楚。
- **梨黄余温**：用于选中分类、讨论符号和媒体卡的大面积柔和底色，不承担正文。

### Secondary

- **松叶绿**：用于可试用、文档就绪或草稿保存成功等正向状态，只作为小面积语义信号。

### Tertiary

- **烤痕陶红**：用于开放参与、提醒或需要回应的状态；保持低饱和，不转化为高警报红。

### Neutral

- **暖灰纸面**：全局背景，是视觉材料的基底。
- **柔纸与深纸**：用于分区、轨道和层级分隔，使内容靠色调而不是浮层建立秩序。
- **近白内容面**：用于搜索、菜单、表单和「正在发生」等需要更清晰可读性的区域。
- **炭黑与次级炭黑**：分别承担正文主信息与说明性信息；静音灰只用于辅助文案和元信息。
- **墨线与强调墨线**：分别承担常规分隔和可交互组件边界，保留纸张的通透感。

### Named Rules

**The 火候稀缺 Rule.** 梨黄只出现在火候、关系、状态和行动上；任何屏幕都不把它铺成高饱和彩色墙。

## Typography

**Display Font:** PingFang SC（回退至 Hiragino Sans GB、Microsoft YaHei、系统无衬线）  
**Body Font:** PingFang SC（同一无衬线回退栈）  
**Editorial Font:** Songti SC（回退至 STSong、Noto Serif CJK SC、serif）

**Character:** 无衬线负责让路人快速理解和操作，宋体系只在章节标题、品牌名与少量编辑性标记中制造纸本温度。两者分工清楚，不用装饰性字体制造「文艺感」。

### Hierarchy

- **Display**（520，流体大字号，1.12）：只用于 Hero 主张；桌面居中，窄屏左对齐并收至更紧凑的 36–44px 区间。
- **Headline**（600，流体章节字号，1.22）：用于页面分区标题和结尾号召，以宋体系建立编辑性节奏。
- **Title**（600，流体内容标题，1.36）：用于实时条目等可扫描内容标题，保持比营销标题更克制。
- **Body**（400，16px，1.6）：用于正文和说明；长内容摘要通常限制在 40–65ch，避免宽屏散开。
- **Label**（600，14px）：用于按钮、导航和动作标签；更小的 10–13px 字级只服务元信息、状态与署名。

### Named Rules

**The 双声部 Rule.** 操作和正文坚持清楚的无衬线，宋体系只负责品牌与章节气口；不要让两套字体在同一层级争抢主次。

## Layout

页面使用 1240px 最大内容宽度，桌面两侧至少留 24px；Hero 的阅读与搜索核心收在 1080px。固定导航高 72px，章节上下留白采用 78–128px 的流体区间，靠细边线而不是独立卡片分割长页面。

默认「慢火清单」用 150px 火候索引加一列实时内容；「开放工作室」把同一批条目放入 12 栏关系画布；「当期封面」用一块主作品配右侧实时索引。三者只改变拓扑，不改变色彩、组件层级与内容事实。

在 1050px 以下，主导航折叠，双栏作品与媒体布局开始收束；在 760px 以下，页边距缩为 15px、导航高 62px，Hero 左对齐，三种外观都归一为同一条单列动态流，分类与媒体改为横向滚动；390px 以下再压缩外观切换器、头像关系区与结尾行动。

## Elevation & Depth

系统以色调分层和细边线为主、柔和阴影为辅。常规列表、论坛、工具架和大部分纸片保持平面；菜单、搜索、主视觉图和工作室视图中的可移动纸片才使用低对比环境阴影。悬停通过 2–6px 的轻位移和阴影响应，不制造玻璃悬浮感。

### Shadow Vocabulary

- **环境浮层**：用于外观菜单、话题编辑器、主视觉图和媒体卡悬停。
- **紧凑浮层**：用于搜索框、头像纸片和工作室条目。
- **焦点暖影**：仅在搜索聚焦时加强边界，并把注意力收回输入任务。
- **行动暖影**：只用于梨黄主按钮，强调可行动性而非装饰。
- **纸片错版影**：工作条目使用向右下偏移的硬边淡影，形成轻微手工装订感。

### Named Rules

**The 纸面先行 Rule.** 默认表面保持平整；只有菜单、聚焦输入、主视觉或交互响应获得阴影，深度必须解释状态或层级。

## Shapes

主要交互面使用轻柔圆角：普通按钮、外观切换和缩略图使用小圆角，搜索、菜单与浮层使用更大的内容面圆角。状态胶囊和关系节点使用完全圆形；作品纸条、论坛行与工具索引保持直角，以维持清单和纸张切片的骨架。图片可轻微旋转或裁切，但容器轮廓始终清楚，边界以 1px 墨线为准。

## Components

### Buttons

- **Shape:** 48px 最小高度的小圆角行动面，内部横向留白 19px。
- **Primary:** 梨黄底、深烤梨黄边、炭黑字，并带克制暖影；用于当前页面的主要参与动作。
- **Hover / Focus:** 悬停上移 2px并把梨黄稍微提亮；按下回到原位；所有键盘焦点统一使用 3px 深烤梨黄外轮廓和 3px 偏移。
- **Secondary / Dark:** 次行动使用透明纸面与强调墨线；深色按钮用于嵌在作品叙事中的单一强入口。

### Inputs / Fields

- **Style:** 搜索是 66px 高的近白内容面，含左侧搜索图标、输入、快捷键提示和炭黑提交按钮；编辑器字段用暖灰纸底和更紧的 8px 圆角。
- **Focus:** 搜索整体边界切为深烤梨黄并出现焦点暖影；内部输入不额外套第二圈轮廓。
- **Error / Disabled:** 当前实现没有独立错误或禁用视觉 token；不要凭空扩展，后续应从可见焦点和语义色体系继续建立。

### Navigation

桌面导航是 44px 最小高度的无衬线文本链接，当前项与悬停项只展开一条梨黄细下划线。1050px 以下切换为菜单按钮和纸面网格导航；移动链接保持 48px 可点高度。外观切换器是带火候点的描边按钮，菜单以单选语义展示三种共享系统的拓扑。

### Chips

- **Category Filters:** 六类入口组成连续分段条，未选中透明，悬停或选中后填入梨黄余温；移动端保持原宽并横向滚动。
- **Status Chips:** 24px 高胶囊，用松叶绿、梨黄或陶红的低透明底与描边表达成熟度和参与状态；文案必须是事实标签。

### Cards / Containers

- **Corner Style:** 内容图、浮层和工作室卡使用柔和圆角；默认实时清单、论坛条目、工具架和作品纸条保持直角。
- **Background:** 在暖灰纸面、柔纸和近白内容面之间交替，不创建额外彩色卡片族。
- **Shadow Strategy:** 平面清单无阴影；只有浮层、主图、工作室纸片和悬停媒体卡使用既有阴影词汇。
- **Border:** 1px 墨线是主要结构手段；强调墨线只用于搜索、切换器和明确可交互边界。
- **Internal Padding:** 实时条目使用 24px 垂直节奏，工作纸条使用 16px × 18px，媒体卡使用 22px。

### Fireline Live Item

默认动态条目把 168px 预览或符号放在左侧，右侧按「状态与类型 → 标题 → 摘要 → 内联行动」排序。悬停只向右移动 6px 并露出暖灰底；窄屏把预览压至 72px、条目归一为单列索引节奏。工作室和封面视图复用同一信息结构，不复制第二套组件。

## Do's and Don'ts

### Do:

- **Do** 先让路人通过标题、搜索、分类和明确行动理解社区，再在关系区展示可追溯的创作者。
- **Do** 用暖灰纸面、炭黑信息和稀缺梨黄维持低跳跃节奏。
- **Do** 让三种外观共享同一套颜色、状态、组件和内容事实，并以慢火清单为默认。
- **Do** 用细线、列表、索引、诚实状态和轻微纸片位移表达「正在长大」。

### Don't:

- **Don't** 使用 AI 紫渐变、玻璃拟态墙或高饱和色块连续跳跃。
- **Don't** 把首页变成排行榜、Logo 墙或三等分功能推销卡。
- **Don't** 在 Hero 堆创作者头像；作者要可追溯，但不能挡住路人的第一步理解与行动。
- **Don't** 为三种外观复制三套 token，或把它们误写成 light / dark 主题。
