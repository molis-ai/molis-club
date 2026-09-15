# Molis AI studio illustrations

## Purpose and provenance

这三张编辑插画用于百科、观点和解决方案页面的少量配图。它们是使用内置 `image_gen` 生成的 AI 插画，不是实拍团队、客户案例或产品功能截图。

- 生成日期：2026-09-16（Asia/Shanghai）。
- 共同风格参考：`public/images/molis-makers-studio.png`，本地既有原图，已先目视检查。每次生成均以其作为 style reference。原图未修改；这些图片不用于替换首页原图。
- 生成方式：每张独立调用内置 `image_gen`，未使用 CLI/API fallback。以下为发送给工具的完整原始提示词。
- 制作：仅用 macOS `sips` 进行等比例缩小、JPEG 转换和 82 质量压缩，无裁切、重绘或程序化合成。用 Impeccable `embed-prompt.mjs` 将对应完整提示词嵌入每张 JPEG 的 COM 元数据。
- 透明度：三张均为不透明 JPEG，暖象牙纸背景是画作本身。
- 实现方式：页面以声明宽高的原生 `img` 使用，保持原比例；边距、布局和交互由页面实现。不要在图上叠正文，不把图当软件截图或数据证明。

## Produced asset manifest

| ID | Output | Dimensions | File size | Use | QA |
| --- | --- | --- | --- | --- | --- |
| encyclopedia-atelier | `public/images/studio-series/encyclopedia-atelier.jpg` | 1200 × 800 | 220621 bytes | 百科区：整理知识、理解参考材料。 | accepted |
| perspectives-atelier | `public/images/studio-series/perspectives-atelier.jpg` | 1000 × 1000 | 240727 bytes | 观点区：阅读与独立思考。 | accepted |
| solutions-atelier | `public/images/studio-series/solutions-atelier.jpg` | 1200 × 800 | 236479 bytes | 解决方案区：人做判断、协同制作。 | accepted |

Strategy for all: new illustration generated faithfully from the original style reference, followed by format conversion and proportional resize. `direct` assets: none. `semantic` assets: none.

## Visual QA

逐张打开最终 JPEG 与原图比较：细石墨/墨线、轻排线、低饱和蓝灰和鼠尾草色、浅杏色、纸纹与暖纸底一致；无文字、标志、软件界面、图表、边框或光泽 3D。人物和手部姿态可信，人物未裁断，最终尺寸保持生成比例，压缩后线条仍清楚。

Minor deviations retained after visual review: encyclopedia book occupies part of the upper third, while the top still contains blank paper; perspectives includes one small vase with a leafy sprig, solutions includes one potted plant on the left. These additions remain secondary and do not change the requested subject or visual role. The perspectives generator returned 1254 × 1254 rather than the prompt's intended 1024 × 1024; the shipping image is the requested 1000 × 1000.

## Exact generation prompts and source originals

### encyclopedia-atelier

- Source/style reference: `/Users/yijunwang/code/molis-club/public/images/molis-makers-studio.png`
- Generated original: `/Users/yijunwang/.codex/generated_images/01a0a65c-c094-7120-88fe-e3e22ae411b0/exec-0646c7b5-661d-4a2c-b2a1-6c466367f3a2.png`
- Original dimensions: 1536 × 1024 PNG.
- Final output: `/Users/yijunwang/code/molis-club/public/images/studio-series/encyclopedia-atelier.jpg`
- Final dimensions: 1200 × 800 JPEG.

```text
Use case: illustration-story.
Asset type: restrained editorial raster illustration for the Molis AI website.
Input image: the supplied molis-makers-studio.png is a STYLE REFERENCE ONLY, not an edit target. Create a new separate illustration; do not reproduce its group scene or modify the original.
Style/medium: closely match the reference's fine graphite and ink hand-drawn contours, delicate crosshatching, understated facial drawing, light desaturated watercolor blue-grey and sage washes with very small warm apricot accents. Warm ivory paper ground, subtle real paper fibers and texture throughout, sophisticated quiet editorial illustration. Preserve the reference's material, line density, sparse color, soft natural light, and handmade character.
Primary request: a calm desk holding one open reference book, a small tidy fan of blank index cards, one hand naturally arranging a single card, one pencil and one single pressed leaf.
Composition/framing: horizontal landscape, exactly 3:2 aspect ratio, high-resolution 1536 by 1024 intended. Slightly elevated intimate desk view, objects and the hand mainly in the lower two-thirds, with generous unmarked warm ivory paper above. The hand enters naturally from one lower side; only this hand and forearm are visible. The book, cards and pressed leaf feel quietly studied rather than staged. Restrained flat paper still-life perspective, no whole room.
Constraints: believable human anatomy and hands where visible; sparse carefully drawn objects, generous warm ivory negative space; all paper pages and cards blank. No typography, writing, text, labels, logos, watermarks, fake UI, software screens, charts, 3D, glossy rendering, photorealism, frames, borders, rounded corners, caption bands, or baked shadows. Do not add extra objects or people.
```

### perspectives-atelier

- Source/style reference: `/Users/yijunwang/code/molis-club/public/images/molis-makers-studio.png`
- Generated original: `/Users/yijunwang/.codex/generated_images/01a0a65c-c094-7120-88fe-e3e22ae411b0/exec-adb62a93-b55d-4fa3-a254-67cabced2652.png`
- Original dimensions: 1254 × 1254 PNG.
- Final output: `/Users/yijunwang/code/molis-club/public/images/studio-series/perspectives-atelier.jpg`
- Final dimensions: 1000 × 1000 JPEG.

```text
Use case: illustration-story.
Asset type: restrained editorial raster illustration for the Molis AI website.
Input image: the supplied molis-makers-studio.png is a STYLE REFERENCE ONLY, not an edit target. Create a new separate illustration; do not reproduce its group scene or modify the original.
Style/medium: closely match the reference's fine graphite and ink hand-drawn contours, delicate crosshatching, understated facial drawing, light desaturated watercolor blue-grey and sage washes with very small warm apricot accents. Warm ivory paper ground, subtle real paper fibers and texture throughout, sophisticated quiet editorial illustration. Preserve the reference's material, line density, sparse color, soft natural light, and handmade character.
Primary request: one seated adult creator viewed thoughtfully from the side and rear, reading a small blank-page manuscript beside a quiet simply suggested window. One pencil and one cup rest near the person.
Composition/framing: exactly square 1:1 aspect ratio, high-resolution 1024 by 1024 intended. Show the whole seated person, both feet, simple chair and naturally posed believable hands holding the manuscript. Give the figure generous warm ivory paper around and above; the window is only a few delicate lines and pale daylight, with no busy scenery or exterior view. Calm introspective posture, spare objects.
Constraints: believable human anatomy and hands where visible; sparse carefully drawn objects, generous warm ivory negative space; all paper pages and cards blank. No typography, writing, text, labels, logos, watermarks, fake UI, software screens, charts, 3D, glossy rendering, photorealism, frames, borders, rounded corners, caption bands, or baked shadows. Do not add extra objects or people.
```

### solutions-atelier

- Source/style reference: `/Users/yijunwang/code/molis-club/public/images/molis-makers-studio.png`
- Generated original: `/Users/yijunwang/.codex/generated_images/01a0a65c-c094-7120-88fe-e3e22ae411b0/exec-4447a342-ef51-4293-ab72-9779e40017e3.png`
- Original dimensions: 1536 × 1024 PNG.
- Final output: `/Users/yijunwang/code/molis-club/public/images/studio-series/solutions-atelier.jpg`
- Final dimensions: 1200 × 800 JPEG.

```text
Use case: illustration-story.
Asset type: restrained editorial raster illustration for the Molis AI website.
Input image: the supplied molis-makers-studio.png is a STYLE REFERENCE ONLY, not an edit target. Create a new separate illustration; do not reproduce its group scene or modify the original.
Style/medium: closely match the reference's fine graphite and ink hand-drawn contours, delicate crosshatching, understated facial drawing, light desaturated watercolor blue-grey and sage washes with very small warm apricot accents. Warm ivory paper ground, subtle real paper fibers and texture throughout, sophisticated quiet editorial illustration. Preserve the reference's material, line density, sparse color, soft natural light, and handmade character.
Primary request: two adult makers around one small table, collaborating as they arrange a simple folded paper architectural model. Include one blank sketchbook and a few small wooden pieces on the table. Show the people thinking and using their hands to make an understandable small model together.
Composition/framing: horizontal landscape, exactly 3:2 aspect ratio, high-resolution 1536 by 1024 intended. Both makers visible as complete natural figures sitting or leaning at the small table, with believable anatomy and hands; a sparse intimate atelier scene composed mainly in the lower two-thirds with ample warm ivory paper above and around. Keep the paper model simple and modest, with clearly folded planes. The scene conveys human judgment and collaboration.
Constraints: believable human anatomy and hands where visible; sparse carefully drawn objects, generous warm ivory negative space; all paper pages and cards blank. No typography, writing, text, labels, logos, watermarks, fake UI, software screens, charts, 3D, glossy rendering, photorealism, frames, borders, rounded corners, caption bands, or baked shadows. Do not add extra objects or people.
```

## Execution order, blockers, assumptions

- Execution order: encyclopedia → perspectives → solutions briefs, one generation call per asset; then proportional JPEG conversion, prompt embedding, and visual review.
- Blockers: none.
- Assumptions: these are atmosphere and editorial context, with facts and functional claims supplied separately by HTML content. Existing homepage artwork remains unchanged.

