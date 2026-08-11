# 烤个梨呀最终主页 · Engineering Handoff

状态：`FINAL_HIFI_STATIC`

Finish review：`PASS`

Canonical：[`index.html`](./index.html)

设计简报：[`design-brief.md`](./design-brief.md)

## 文件

| 文件 | 作用 |
|---|---|
| `index.html` | 语义结构、真实原型链接、示意内容标注 |
| `styles.css` | Tokens、三种外观、桌面/移动响应式 |
| `app.js` | 搜索、分类筛选、外观选择、话题草稿、移动导航 |
| `content/` | 视频、互动故事、文章的类型化消费路径示例 |
| `prototype.html` | 旧版探索稿，只作历史参考 |
| `assets/` | Cognia 示意视觉和漫画头像参考 |

## 关键交互

### 搜索

- 数据源目前是 `app.js` 内的示意索引；正式实现替换为统一搜索 API。
- 结果按作品 / 开发者 / 作者 / 话题分组。
- 空查询给出解释性入口；无结果提供恢复文案。
- 正式实现需保留 combobox/listbox 键盘行为。

### 分类

- `data-category` 与动态条目的 `data-kind` 对应。
- V1 目标类型：`app`、`tool`、`video`、`story`、`article`、`sdk`。
- 类型只影响浏览与动作，不参与质量排名。

### 话题草稿

- 触发后在 Hero 内展开，焦点进入标题。
- 草稿键：`roast-pear-topic-draft-v2`，保存标题、类型和关联内容。
- 静态稿不真正发布；正式环境在提交点要求登录并恢复草稿。
- 可关联作品或工具，也允许不关联的普通话题。

### 外观

- 根节点：`html[data-view="slow|studio|cover"]`。
- 选择键：`roast-pear-home-view`。
- 外观只改变内容拓扑，不改变色板、内容和路由。
- 小于 760px 时统一为单列，避免桌面构图机械缩放。

## 组件边界

| 组件 | 生产 | 消费 / 跳转 |
|---|---|---|
| DiscoverySearch | 查询词、结果组、空态 | 作品页 / 作者页 / 论坛 / 开发者中心 |
| CategoryNav | 当前类型筛选 | `正在发生`内容流 |
| LiveFeed | 更新、内容发布、招募、讨论 | 作品详情 / 内容详情 / 关联讨论 |
| FlagshipPanel | Adeptify 拳头产品投影 | 作品详情和体验入口 |
| CreatorRelation | 作者、作品、讨论关系 | 作者作品集 / 作品 / 论坛 |
| MediaShelf | 不同作品类型与主动作 | 使用 / 观看 / 阅读 / 文档 |
| ContentSample | 视频画面、章节阅读、文章正文 | 内容消费 / 关联讨论 |
| TopicComposer | 标题、类型、可选关联 | 登录后论坛发布流程 |
| DeveloperShelf | 工具用途和支持动作 | Quick Start / 文档 / 支持帖 |

## 后端接入顺序

1. 用 API 替换搜索索引与正在发生的示意数据；
2. 接作品类型、成熟度和主动作投影；
3. 接作者 Profile 与作品集；
4. 接登录后话题草稿恢复与发布；
5. 接外观偏好到账号设置（本地存储仍作未登录回退）；
6. 接论坛、活动和开发者文档的真实路由。

## 上线前必须替换

- 每一条「内容位示意」「示意讨论」「活动位示意」；
- Cognia / Notebook / Nexus 的成熟度事实；最终首页在确认前只展示中性「作品介绍」；
- 团队漫画头像与个人介绍；
- SDK 正式命名、License、文档 URL；
- 所有静态多页原型的占位链接。

## 预览和检查

```bash
cd /Users/yijunwang/code/roast-pear
python3 -m http.server 8765
# http://127.0.0.1:8765/design/homepage/

node design/homepage/verify-final-homepage.mjs
SCRATCH="$(mktemp -d)" node homepages/verify-homepages.mjs
```
