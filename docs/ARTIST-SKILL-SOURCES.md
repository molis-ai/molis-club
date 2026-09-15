# 艺术家 Skill 系列来源与更新

2026-09-16 从本机相邻的 `artist-skill` 仓库接入。原仓库只读，本站保存可独立下载的快照；不会自动同步。源仓库不是已确认的公开入口，所以页面提供本站 ZIP 下载。

## Skill 包

`public/downloads/artists/` 中的四个 ZIP 对应源仓库 `skills/` 下的同名目录：`monet-impressionism`、`dali-surrealism`、`wes-anderson-poster`、`art-style-skill-builder`。每个 ZIP 保留 Skill 目录层级、`SKILL.md`、已有 `agents/`、`references/` 和许可证文件。未打包 outputs、研究产物或私人参考素材。

更新时从最新工作源码重新打包，保留内部相对路径，并检查所有 Skill 直接引用的本地文件都已包含。不要只替换 SKILL.md，或把旧 dist 当成最新版本。下载包依赖用户本地 Agent 和图像工具；网页自身不生成图像。

本轮通过真实 HTTP 下载四个 ZIP，逐文件比对源码，并检查已存在的 Markdown 本地链接目标随包分发。

## 展示图像

以下都是源仓库已有的 AI 创作试样，并非艺术家原作。只做等比例缩放与 JPEG 压缩，来源已写入 JPEG 元数据；没有重绘。

| 网站文件（public/images/artists/） | 源仓库相对路径 | 展示尺寸 |
| --- | --- | --- |
| monet-pond.jpg | skills/monet-impressionism/outputs/pond-after-rain/pond-after-rain-refined.png | 1440 × 960 |
| dali-forest.jpg | skills/dali-surrealism/outputs/lake-forest/poster.png | 1280 × 720 |
| wes-lake.jpg | skills/wes-anderson-poster/outputs/lin-zhong-bo/film-layers.png | 960 × 1440 |

`content/artists.ts` 的方法摘要来自各 Skill 源文。页面上的“示例调用”是为本次网站编写的可修改使用示例，不声称它是上述图像的原始生成提示词。
