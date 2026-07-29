# 烤个梨呀 · 漆梨 × 月刊 多页原型

完整可点击站点（静态 HTML）。视觉融合：

- **漆梨**：黑漆底、琥珀镶线、漆面扫光 hover、旗舰货架  
- **月刊**：封面故事 Hero、VOL 印戳、象牙纸「内页」作品区、目录轨  

## 预览

```bash
open design/site/index.html
# 或
npx --yes serve design/site
```

## 页面

| 路径 | 内容 |
|---|---|
| `index.html` | 首页：封面 + 主菜 + 作品 + 工具 + 人/IP + 炉边 + 加入 |
| `pages/explore.html` | 发现（筛选：产品 / 作品 / 人 / 工具） |
| `pages/people-mago.html` | 创作者主页示例（马哥） |
| `pages/work-cognia.html` | 拳头作品：Cognia |
| `pages/work-ideas.html` | Maker 作品：马哥的馊主意 |
| `pages/forum.html` | 论坛 |
| `pages/developers.html` | 开发者中心 |
| `pages/join.html` | 注册 + Builder 申请 |

## 动效

- 首屏 veil 揭幕  
- Hero rise + 封面轻微视差  
- section `reveal` 入场（blur → 清晰）  
- 漆面卡片 sheen / 抬升 hover  
- 加入区琥珀 band 流光  
- `prefers-reduced-motion` 全部降级  

## 技术

- `css/site.css` 设计系统  
- `js/partials.js` 共享导航页脚  
- `js/site.js` 交互  
- `assets` → 链到 `design/homepage/assets`  

产品范围以仓库根目录 `ROAST-PEAR.md` 为准。示意数据已标注。
