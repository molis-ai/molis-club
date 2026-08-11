# 烤个梨呀 · 最终主页与七向设计档案

最终高保真主页：[`../design/homepage/index.html`](../design/homepage/index.html)

浏览器 Gallery：[`index.html`](./index.html)

最终版默认使用「慢火清单」，同时可在同一内容与色彩系统内切换「开放工作室」和「当期封面」。以下七个方向保留为设计探索档案。

每个 sketch **方向** 是一套从导航到页脚的完整视觉系统，不是「Hero 贴一张生成图 + 下面通用货架」。

| 方向 | 入口 | 全页信息架构 |
|------|------|----------------|
| `living-anthology` | [living-anthology/](./living-anthology/) | 合志：封面展开 → 章节主菜 → 连载 TOC → 作者页 → 后记工具 → 读者来信 |
| `teletext-service` | [teletext-service/](./teletext-service/) | 图文台：P 码导航 → NOW → 四路索引 → P110–P510 详情页 |
| `pixel-maker-city` | [pixel-maker-city/](./pixel-maker-city/) | CSS 街区地图（非 sketch 底图）→ 店铺 board 列表 |
| `riso-release-wall` | [riso-release-wall/](./riso-release-wall/) | 海报墙：主海报 + 小海报 → 海报网格 → 署名墙 → 票根 → 回声 |
| `slow-fire-index` | [slow-fire-index/](./slow-fire-index/) | 一条火候线贯穿：主菜 / 人 / 小菜 / 围炉 / 工具 |
| `homepage-overdrive` | [homepage-overdrive/](./homepage-overdrive/) | CSS 工作台便签（实机图）→ 正在发生 feed → 同皮货架 |
| `canon` | [canon/](./canon/) | 市场网格：分类 → 产品卡 → 人 → 工具 → 论坛 |

## 原则

1. **禁止** 用 `.impeccable/sketches/*.webp` 当页面结构（city-map / desk-art / hero-art）。
2. 主菜 / 小菜 / 人 / 工具 / 论坛·活动 必须进入该世界的**原生组件**，不能只在 Hero 提一句。
3. 共享 token 与 chrome 贯穿 nav → footer。

## 打开

```bash
cd /path/to/roast-pear
python3 -m http.server 8765
# http://127.0.0.1:8765/homepages/<direction>/

node homepages/verify-homepages.mjs
# 含 launch 截图：
# SCRATCH=... node homepages/verify-homepages.mjs --launch
```

内容种子：`content.json`。验收脚本：`verify-homepages.mjs`（含 integration / anti-paste 门禁）。
