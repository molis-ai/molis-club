# B 版图像资产

2026-09-16。使用内置 imagegen，参考用户明确授权的 Elsewhere 图片。三张新增图是 AI 生成的工作室氛围摄影，不是团队/客户实拍。输出压缩为 1440×960 JPEG，quality 86。原文件保留于本地生成目录。

## 用户授权原图

`/Users/yijunwang/code/elsewhere/public/assets/reading-threshold-v2.jpg` → `public/images/atelier/threshold.jpg`，1440×900。只做输出压缩，不改变构图。

## studio-desk

站点输出：`public/images/atelier/studio-desk.jpg`

生成原文件：`/Users/yijunwang/.codex/generated_images/01a0a61f-216c-7e61-af8f-08747069eef8/exec-6ef13d53-26b9-4d72-80c6-8d6bc90b4843.png`

参考图：`/Users/yijunwang/code/elsewhere/public/assets/reading-threshold-v2.jpg`

实际传给 imagegen 的完整 prompt：

```text
Use case: photorealistic-natural. Asset type: Molis AI studio website B edition editorial photograph. Recompose this quiet room into an editorial photograph of a designer's work table beside the same soft linen-curtained window. Wide 3:2 landscape. A pale oak table, one closed slim graphite laptop, an open sketchbook with faint unlettered pencil studies, a simple ceramic cup, and one small folded paper shape. The objects sit in the right two thirds; generous uncluttered gray plaster and window shadows on the left. No people. Natural late afternoon side light, muted sage gray, warm stone, linen and pale oak. Photographic tactile materials, subtle fine film grain, quiet high-end architecture magazine, gentle real shadows. Match the reference's restraint, light and palette. No letters, logos, legible UI, watermarks, neon, glossy CGI, or decoration clutter. New composition, not a collage.
```

## reading-room

站点输出：`public/images/atelier/reading-room.jpg`

生成原文件：`/Users/yijunwang/.codex/generated_images/01a0a61f-216c-7e61-af8f-08747069eef8/exec-b176f4ba-fb02-4f8b-bbba-8f8a0978cb23.png`

参考图：`/Users/yijunwang/code/elsewhere/public/assets/reading-threshold-v2.jpg`

实际传给 imagegen 的完整 prompt：

```text
Use case: photorealistic-natural. Asset type: Molis AI studio website B edition editorial photograph. Recompose the reference into a new editorial photograph of a solitary person reading beside a tall linen-curtained window in a quiet creative studio. Wide 3:2 landscape, medium-wide architecture view. Adult reader seated in an oak chair at right, seen from behind and three-quarter side, face not identifiable, holding an open book with no legible writing. Large muted gray plaster wall at left, subtle shadow of leaves, low bookcase, modest ceramic object. Natural late afternoon window light. Preserve the reference's muted sage gray, linen, warm pale oak, natural tactile surfaces and contemplative stillness. Authentic photography with fine grain, not illustration or glossy CGI. No text, logos, watermark, dramatic staging. Treat the supplied image as material/light reference; create a distinct scene.
```

## shared-studio

站点输出：`public/images/atelier/shared-studio.jpg`

生成原文件：`/Users/yijunwang/.codex/generated_images/01a0a61f-216c-7e61-af8f-08747069eef8/exec-968cbd7f-4ad7-43eb-98cb-487691163dce.png`

参考图：`/Users/yijunwang/code/elsewhere/public/assets/reading-threshold-v2.jpg`

实际传给 imagegen 的完整 prompt：

```text
Use case: photorealistic-natural. Asset type: Molis AI studio website B edition editorial photograph. Recompose the reference into a new wide 3:2 editorial photograph of a small quiet design studio with a long communal pale oak table, three mismatched refined wooden chairs, soft linen curtains, muted sage-gray plaster walls and a large side window. On the table: a few open notebooks, loose paper studies with no legible text, and two simple ceramic cups. No people, no screens, no logos. Asymmetric framing, table extends from lower left toward the softly lit right side, abundant breathing space and gentle realistic diagonal shadows. Match the reference's poetic natural light, matte tactile surfaces, pale oak, linen and warm stone palette. Premium architecture photography with subtle film grain and ordinary believable details, not showroom CGI, not symmetrical, no clutter, no watermark.
```

## makers-conversation · 首页围桌插画

2026-09-16。内置 imagegen 基于 A 原插画重新构图，四位人物为虚构创作者；没有改写 A 原图。原窗边照片继续放在 B 首页下方 Elsewhere 入口。

参考图：`/Users/yijunwang/code/molis-club/public/images/molis-makers-studio.png`

生成原文件：`/Users/yijunwang/.codex/generated_images/01a0a61f-216c-7e61-af8f-08747069eef8/exec-519f26e1-9234-409e-a715-428c6504d603.png`（1672×941）

站点输出：`public/images/atelier/makers-conversation.jpg`（1920×1080，JPEG quality 87，约556KB）。生成提示词已嵌入 JPEG COM，页面 HTML 字标不在图像像素内。

实际传给 imagegen 的完整 prompt：

```text
Use case: illustration-story / recompose an existing illustration.
Asset type: full-width homepage background for the Molis AI designer studio.
Input image: the supplied Molis makers illustration is the reference for the same four fictional adult characters, their rapport, clothing, small handmade objects, graphite line quality and restrained watercolor palette. Create a NEW landscape composition based on that scene; preserve the original file unchanged.
Primary request: four creative people having a relaxed, thoughtful conversation around a long studio worktable, a warm human presence for a quiet high-end design studio website.
Style: refined editorial illustration, fine observational pencil and ink hatching, soft translucent watercolor, subtle warm ivory paper. Same understated blue-gray, charcoal, pale sage and small peach accents as the reference. Not photorealistic, not 3D, not cartoon icons.
Composition: wide 16:9 landscape, 2048x1152. The whole group sits in a horizontal band across the middle, roughly x=14–88%, y=38–72%. People remain clearly drawn and expressive at website scale: hair-bun woman in blue-gray at left, curly-haired man in cream, bob-haired woman in overalls, glasses and peach beanie at right. Keep eyes, gestures and hands natural, with small asymmetries of a real discussion. Simple table with a sketchbook, pencils, a small friendly cow figurine and peach robot, no clutter. Suggest a creative studio with only faint window light and a quiet plant at the far edge. Top third is mostly empty pale paper, with absolutely clean space near upper-center for small website copy. Bottom 24% is exceptionally quiet pale paper, only faint warm shadow; no faces or important objects there, as a giant live wordmark will be placed over that area by the webpage. Do not paint the wordmark or any other text into the image.
Mood: calm, thoughtful, human, generous negative space. Art-directed balance; large coherent illustration, not a collection of spot drawings. No logos on the laptop, no letters, captions, speech bubbles, UI, arrows, frames or watermark. Keep central two people visible in a narrow center crop for mobile.
```
