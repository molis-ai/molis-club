# 百科收录微交互组件资源

## 背景目标
把 24 个外部微交互/组件来源写进 Molis Wikipedia，让百科除了本站可演示的网页与动效条目外，也能检索和阅读这些库：看什么、怎么获取、编辑判断、官方出处。

完成等级：功能可用。内容真实可浏览、可搜索、可复制参考 Prompt；不把这些库装进本站，不做对方组件的假演示。

## 当前行为与问题
百科只有 6 条本站可操作条目（动效百科 / 网页词典），每条带演示和实现 Prompt。这 24 个来源目前不在 content/，百科搜索找不到 Animata、Sonner 等名字。

## 范围与非目标
范围：
- 新增分类「组件资源」，24 条独立 `/wiki/{slug}` 条目。
- 百科目录可按分类筛选、搜索；组件资源按三组陈列。
- 详情写清重点、获取方式、判断、授权边界和官方链接；提供参考 Prompt。
- A/B/C 百科目录共用同一内容源。

非目标：
- 不安装、不复制这些库的组件源码到本站。
- 不伪造对方 Demo、不宣称已做项目集成测试。
- 不改 Artist Skill、6 条既有演示条目的交互。
- 不新增大而全的组件市场或付费授权流程。

## 使用场景
- 在百科搜「toast」「tabs」「数字」，找到对应来源。
- 打开 Animata 详情，看重点控件、MIT/复制方式和判断，复制 Prompt 带到本地项目。
- 筛选「组件资源」，按微交互库、小库、灵感三组浏览。
- 打开「错落入场」等原条目，演示和实现 Prompt 与原来一致。

## 方案与关键决策
- 组件资源是百科条目，不是产品功能。目录用文字卡，不用空演示框。
- 字段复用现有 use / recipe / caution / source：分别承担「看什么」「怎么获取」「判断与边界」「官方出处」。
- 三组沿用整理结构：微交互组件与代码案例、更容易用进真实产品的小库、CSS 小效果与交互灵感。
- 参考 Prompt 要求有选择地引入单个交互，核对授权、键盘、触屏和减少动态效果；不含动效时长滑杆。
- 接着探索只给同组最多 4 条，避免 23 条平铺。

## 输入输出与依赖
输入：已整理的 24 个来源、官方 URL、授权与获取方式。
输出：content 目录、百科目录/详情、sitemap 随 knowledge 自动增补、产品事实文档中的条目数量。
依赖：现有 `/wiki/[slug]`、KnowledgeDirectory、HTTP 契约测试。无新依赖、无数据库变更。

## 文件 / 模块边界
- `content/knowledge.ts`：类型、6 条原条目、24 条组件资源、Prompt/搜索/相关条目。
- `app/knowledge-lab.tsx`、`app/wiki/page.tsx`、`app/wiki/[slug]/page.tsx`：目录与详情呈现。
- `app/edition-c/pages.tsx`、`app/atelier/pages.tsx`：栏目标题随内容扩展。
- `app/editorial.css`：资源卡与分组。
- `PRODUCT.md` / `DESIGN.md` / `README.md`：当前条目事实。
- `tests/knowledge.test.mjs`、`tests/editorial-http.mjs`、`tests/atelier-http.mjs`、`tests/edition-c-http.mjs`。

## 验收标准
- 24 条组件资源均可打开；正文含描述、重点、获取方式、判断和官方链接。
- 分类含「组件资源」；搜索「toast」得到 Sonner，「流体」或 Animata 可被找到；空结果仍可恢复。
- 原 6 条演示、重播/参数、实现 Prompt 与 MDN 来源保持。
- 组件资源详情无假 Demo，有参考 Prompt 和复制反馈；减少动态链接仍在。
- 不把外部组件源码拷进仓库；不宣称这些库已接入 Molis 产品。
- A/B/C 百科都能列出并进入新条目。

## 验证命令
- `npm run check`、`npm run lint`、`npm test`
- 本地服务下 `npm run test:http`（含 editorial / atelier / edition-c 百科路径）
- 浏览器：百科目录筛选与搜索、Animata 与 Sonner 详情、错落入场回归、手机分类条

## 假设与开放问题
- 条目依据官网与目录整理，未做集成测试；页面明确这一点。
- Pro / 付费边界以各站当时说明为准，本站只作提醒。
- 历史规格里「6 条百科」指当时验收，不回写旧 sprint 记录。
