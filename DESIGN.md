---
name: Molis AI
description: 暖纸、柔和墨蓝与灰蓝手绘背景构成的独立 AI 创作工作室。
colors:
  paper: "#f5f1eb"
  ink: "#24324b"
  muted: "#706d69"
  line: "#dcd6ce"
  accent: "#ded8cd"
  input-border: "#aaa79f"
  focus: "#4c6073"
  primary-hover: "#38485b"
  error: "#9e3353"
  success: "#315a67"
typography:
  body:
    fontFamily: "Geist, sans-serif"
    fontSize: "15px"
    lineHeight: 1.7
  editorial:
    fontFamily: "Newsreader, Georgia, serif"
    fontWeight: 400
  heading:
    fontFamily: "Geist, sans-serif"
    fontWeight: 500
  action:
    fontFamily: "Geist, sans-serif"
    fontSize: "13px"
rounded:
  square: "0px"
spacing:
  section-desktop: "115px 6%"
  section-mobile: "70px 6%"
  button: "13px 24px"
  field: "12px 14px"
components:
  button-primary:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.paper}"
    typography: "{typography.action}"
    rounded: "{rounded.square}"
    padding: "{spacing.button}"
  button-primary-hover:
    backgroundColor: "{colors.primary-hover}"
  button-light:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    typography: "{typography.action}"
    rounded: "{rounded.square}"
    padding: "{spacing.button}"
  field:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    rounded: "{rounded.square}"
    padding: "{spacing.field}"
---

# Design System: Molis AI

## Overview

**Creative North Star: "好奇心与人的温度"**

暖纸留白、柔和墨蓝文字、无衬线与衬线斜体相接的大标题，构成当前工作室语言。首页恢复“A curious mind. / A human touch.”及底部双入口和中文介绍；用户指定的四人围桌手绘图作为其背景，保留原来的页面构图与浏览路径。

当前背景为 `community/public/images/molis-makers-studio.png`：低饱和灰蓝、柔和墨色、少量柔杏橙与暖纸，协调原 Logo 而不要求所有元素同色。它是共同创作的想象，不代表真实团队合影。原 Logo 使用 `community/public/images/molis-logo.png`，海军蓝和橙色原样保留，不滤色、不混合着色。

**Key Characteristics:**

- 大标题浮于柔和背景，人物场景承担氛围，文字和行动保持可辨认。
- 开放产品索引、深蓝 Solutions、工作室叙述、文章与问答形成阅读节奏。
- 产品实际成熟度、可用入口和账号状态清楚可见。

唯一视觉需求书为 `specs/studio-auth-rebuild/visual-redesign.md`。本文件依据当前 `community/app/globals.css` 最终级联、页面与字体配置记录，不追加已撤销方向。独立 `restored_studio_review` 的 ship 结论仅覆盖桌面首页首屏、390px 首页首屏与登录三图证据，无 material fixes；不代表全站或完整手机长页已全面验收。交付范围仍为私有预览。

## Colors

### Primary

柔和墨蓝 `ink` 承担标题、正文和主要按钮；Solutions 与页脚使用同色深底、暖纸文字反转。主按钮 hover 使用 `primary-hover`。

### Secondary

背景图以灰蓝和柔和墨色为主，少量柔杏橙呼应原 Logo。`accent` 是浅暖灰选区色；`focus` 是较深灰蓝，用于键盘焦点、输入光标与复选框。图像中的橙色不扩展为大片页面装饰。

### Neutral

`paper` 是页面底色，`muted` 用于辅助说明和 placeholder，`line` 划分内容行，`input-border` 明确输入边界。工作室介绍区采用浅暖灰（`#ece7e0`）。错误与成功使用语义色和文字共同提示。

**The Original Mark Rule.** 原 Logo 及其橙色段完整保留；背景可以与之协调，但不能通过改色、滤色或混合模式重塑标识。

## Typography

Geist 承担信息和无衬线标题；Newsreader 承担英文斜体强调，回退 Georgia。两者通过 `next/font/google` 加载拉丁字集，中文由浏览器可用字体回退。字体配置不代表完整中文覆盖。

- 首页大标题：桌面 `clamp(65px, 6.9vw, 96px)`，行高 1.03、字距 −0.04em；≤1000px 为 80px；≤640px 最终为 `clamp(40px, 10.4vw, 61px)`、行高 1.13。第二行使用 Newsreader 斜体。
- 目录主标题：桌面/中屏/手机 70/60/54px；衬线英文副标题依次 39/32/29px。
- 普通区段标题约 24–30px；目录、产品线、方案说明桌面 15px，手机 14px，行高 1.9。首页介绍桌面 15px，手机 14px。
- 长文正文桌面 16px/2.15，手机 15px/2.1；文章标题 46px，手机 33px。
- 表单输入 16px；标签、关键状态、说明和反馈为 13px/1.8；目录筛选链接 14px、最小高 44px。
- 页头字标桌面 29px、手机 20px；页脚字标为 `clamp(70px, 15vw, 205px)`，手机 18vw。

**The Two Voices Rule.** 无衬线承担信息，衬线斜体承担短句的情感强调；中文正文维持连续、平实的阅读。

## Layout

桌面页头高 104px、左右留白 4.5%；普通内容段采用 frontmatter 的 section 间距。≥1700px 时，内容段与页脚按 1500px 内容跨度约束两侧留白。首页高 `calc(100svh - 104px)`，受 660–850px 限制；标题从左上展开，底部双入口与中文介绍左右相对。插画覆盖首页背景，不是标题下方的独立画幅。

产品线与方案行使用 `1fr 1.3fr 30px`，依次为标题、说明、箭头。产品目录使用左侧简介与右侧产品行双栏，桌面比例 `1fr 2.3fr`；详情最大宽 1250px，文章 810px，账号 740px。首页沿产品索引、Solutions、工作室、文章与问答展开。

断点为 1000px 与 640px。≤1000px 隐藏 Studio/Journal 次级导航；Products、Solutions 和账号入口保留。手机页头高 82px、左右留白 6%，Logo 40px；正文段落、目录和详情转单列，箭头保留标题右侧。首页移动顶部内边距最终为 64px，底部介绍与入口纵向排列，二者间距 22px。

登录桌面采用 `1.05fr 1fr` 双栏，左侧手绘背景与品牌短句，右侧真实表单；手机纵排，插画区最小高 240px，表单最大宽 440px。联系页沿原双栏表单结构，手机转单栏，并使用同系列插画。

## Elevation & Depth

当前界面不使用盒阴影。深度来自淡化插画、暖纸留白、深蓝区段与细线。首页背景图使用空 alt，作为装饰氛围，不作为团队身份信息。

桌面背景图 cover 铺满，透明度 0.58、定位 `center 20%`，叠加暖纸渐变保证标题和底部操作可读。≤640px 背景从容器顶部 28% 开始，使用图片自身比例的高度，透明度 0.62；上下边缘通过 mask 淡出（25%–76% 保持不透明），避免硬边并衔接暖纸。登录图透明度 0.33、居中；联系图 cover，定位 `center 68%`。

首页图片执行一次 1.5 秒轻微显现，缓动为 `cubic-bezier(0.16, 1, 0.3, 1)`，从 1.025 倍与 brightness(1.08) 回落到原值；入口箭头 hover 以 0.25 秒移动 3px。减少动态偏好关闭动画、过渡与平滑滚动。

## Shapes

按钮、输入和作品色面采用直角。1px 细线定义内容关系，文本入口以下划线提示行动，筛选用底线表示选择。Logo 圆润闭环属于标识，不扩展成胶囊按钮或全站圆角卡片。人物插画留在背景角色，不复制成界面各处的装饰部件。

## Components

### Navigation and actions

页头显示原 Logo 和 Molis AI 字标，Logo 桌面 59px，使用 normal 混合模式；导航 hover 下划线，账号入口在右侧。首页用“发现产品”和“为业务寻找 AI 方案”两条入口；页脚以深蓝背景、放大文字字标和联系入口收尾。

基础主按钮最小高 48px；次级按钮透明底和细边框。普通禁用态透明度 0.65、光标 `not-allowed`。全局键盘焦点为 2px `focus` 描边、外偏移 5px；页首提供跳过导航入口。

### Products and solutions

Products 三线、10 个产品：情绪与体验（Elsewhere、Seentoo、ASTRALO），轻量工具（niul.ai、DropAgent、Jelly），AI 与工程效率（Prologue、Flyleaf、ForkLight、GoalBoard）。Solutions 为 Content Growth、Evrik、Aether。名称、场景、成熟度与下一步来自真实内容，不补假下载状态或热度。

分类使用服务端按 URL 输出的链接，`aria-current="page"` 与底线标记选中，无 JavaScript 仍可浏览。全部产品目录保留 Jelly/niul.ai 的已有入口提示；详情说明适用场景、当前边界与下一步，并返回所属目录。

### Forms and account states

字段使用可见标签、透明底、细边框和 16px 输入字号，最小高 49px；textarea 最小高 145px，可纵向缩放。placeholder 保留已修正的 `muted` 对比度；聚焦边框和 1px 轮廓使用 `focus`；错误文字包含 `role="alert"`。

邮箱注册、登录、会话、退出与改密是真实行为。提交中禁用按钮并显示“请稍候…”。Google/GitHub 缺凭据时禁用且显示“待开放”；真实账户不等于邮箱已验证，邮件验证和找回缺口继续明确呈现。

### Reading and discovery

文章用窄栏、充足行高和段距，保留原文；留言以细线划分身份、时间和正文。FAQ 使用原生 details/summary，桌面两栏、手机单列，摘要 16px、正文 15px/1.95、最大 60ch。

首页、目录、作品和文章保留独立标题、摘要、规范地址、分享信息与匹配可见事实的结构化数据。私有预览继续 noindex，robots 禁抓、sitemap 不列公开 URL；这些实现不代表已公开、已收录或获得 AI 引用。

## Do's and Don'ts

- **Do** 保留已恢复的大标题、Newsreader 斜体、底部双入口和中文说明；以最终源码级联为准。
- **Do** 将四人手绘图作为首页背景，采用灰蓝、少量柔杏橙与暖纸的协调关系，优先保证文字和行动可辨认。
- **Do** 原样使用 Logo，保留实际产品状态、表单反馈和键盘焦点。
- **Don't** 把首页重新拆成上方文字、下方独立插画，或增加新的“小事入口”首页区段。
- **Don't** 把插画视为真实团队合影，或要求页面每种颜色都复制 Logo。
- **Don't** 将微小装饰字、字符箭头或过往方案残留固化为复用标准。
- **Don't** 把有限三图的 ship 结论扩大为全站或完整手机长页验收通过。
