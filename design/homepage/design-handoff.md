# 烤个梨呀首页 · Design Handoff

状态：`HIFI_DONE_WITH_CONCERNS`（方向探索稿，可作 V1 视觉基线）  
原型：[`prototype.html`](./prototype.html)  
简报：[`design-brief.md`](./design-brief.md)

---

## 1. 输入来源

- 产品与技术计划：首页结构 §5.1、视觉系统 §8、漫画头像 §7
- 商业计划：Studio World、人是节点、默认独立按需接入
- Skill：`design-taste-frontend`（反模板、三旋钮、preflight）

## 2. 设计决策

| 决策 | 选择 | 拒绝 |
|---|---|---|
| 品牌强调色 | **梨黄** `#D4A12A` | 梨绿作主强调；AI 紫；beige+brass 默认 |
| 页面气质 | 漫画识别 + 杂志策展 + 开放工作室 | SaaS 三列卡、Steam 商店排行、玻璃墙 |
| Hero | 左文案 + 右工作室静物 + 浮层漫画肖像 | 居中大字 + 渐变 blob；div 假截图 |
| Cognia | 独立大版面旗舰 | 与小项目等权网格 |
| 论坛区 | 清晰列表 + 板块侧栏 | 热榜、等级、勋章 |
| 动效 | 进入 rise、section reveal、人物-作品 hover 关联 | 滚动劫持、marquee 堆叠、自定义光标 |

## 3. Token 映射（工程落地建议）

```css
--color-paper / --color-surface / --color-ink / --color-ink-soft / --color-muted
--color-line / --color-accent / --color-accent-ink / --color-leaf
--radius-card: 14px; --radius-control: 10px; --radius-avatar: 16px;
--font-sans: PingFang SC + Outfit;
--font-mono: IBM Plex Mono;
```

Next.js + Tailwind v4 时：用 CSS variables + `@theme`，不要散落硬编码 hex。

## 4. 组件映射

| UI | 归属建议 |
|---|---|
| Nav / Brand mark | app shell |
| Hero stage + float portraits | 首页模块专用 |
| Flagship panel | 首页 + 可复用于作品编辑位 |
| Event strip cards | Feed 投影组件 |
| Maker portrait rail | people 发现 |
| Work bento cards | works 目录共享 |
| Thread list | forum 共享 |
| Tool shelf | developers 入口 |
| Join band | marketing shell |

## 5. 状态矩阵（首页级）

| 状态 | 表现 |
|---|---|
| 默认 | 当前原型 |
| 加载 | 人物轨 / 作品 bento / 动态条使用同形 skeleton（工程实现） |
| 空 | 「正在烤」空态：邀请查看论坛或关注创作者 |
| 错误 | 区块级 inline 错误 + 重试，不用整页崩 |
| 未登录 | CTA 为注册/登录；Library 隐藏 |
| Dark | `data-theme` tokens 已提供 |

## 6. 动效目的

1. Hero rise：建立第一印象层级  
2. Section reveal：叙事分段进入  
3. Portrait hover → work chip：建立「人-作品」关系  
4. Button active scale：点击反馈  
5. `prefers-reduced-motion`：全部降级为静态

## 7. a11y / i18n

- 焦点环使用 accent outline
- 图标按钮有 `aria-label`
- 头像 alt 标明「风格参考」，上线后换真实 Maker 描述
- 中文为主；拉丁品牌名保留 Cognia / ForkLight / Relay / Adeptify SDK
- CTA 桌面不换行；主按钮 2-6 字

## 8. 已知缺口（Concerns）

1. Maker 一句话介绍与真实漫画头像待素材  
2. Cognia / 作品应用真实产品截图替换生成静物  
3. Relay / SDK 封面仍为 CSS 几何占位，需补真实视觉  
4. 未做窄宽度系统截图矩阵与 Lighthouse  
5. 搜索 / 登录为锚点占位，无真实流  
6. 梨黄 vs 梨绿仍待团队最终锁定（本稿梨黄）

## 9. 实现复验锚点

工程实现后至少截图复验：

- [ ] Hero 首屏 CTA 可见，无 scroll cue  
- [ ] Cognia 独占大版面  
- [ ] 创作者不是统一圆形三列简历卡  
- [ ] 作品卡仅一个主动作  
- [ ] 论坛不是热榜样式  
- [ ] 工具架与作品区视觉语言可区分  
- [ ] Light / Dark 均可读  
- [ ] reduced-motion 无持续动画  
- [ ] 无 em-dash、无 AI 紫、无三等分功能推销卡  

## 10. 如何预览

```bash
open design/homepage/prototype.html
# 或
npx --yes serve design/homepage
```
