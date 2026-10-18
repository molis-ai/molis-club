# 官网实际素材来源核验

> 本次交付说明（2026-10-18）：本次仅迁移核验证据；不修改来源图、压缩图、视频、媒体脚本、manifest 或图库 brief。素材使用位置区分仓库交付基线与 3002，不以文档迁移视为许可核验完成。 本次已获选择性提交至 main 的授权，是否提交／推送成功以 Git 与交付回报为准。下文“本地／未提交”等表述保留其原日期的历史范围；当前交付边界见[主清单](site-optimization-2026-10-16.md)。

最近核验：**2026-10-17**；首次盘点：2026-10-16。对应[优化清单第 19 项](./site-optimization-2026-10-16.md#19-核验图片与视频的来源和使用条件)。本轮仅更新本附表，未改 brief、页面或媒体文件；没有替换、生成、上传、付费、提交或推送。下文保留首次盘点证据，新增结论标明日期与适用范围。

## 结论与统计口径

2026-10-17 补证后，有三项明确进展和一项仍未闭合的映射：

- **天空原视频有具体许可缺口。** 已找到 Mixkit #12273 精确作品页，仓库原片与其 720p 文件哈希一致；当前下载面板明确仅限个人用途。首页与 Story 的同源派生不能按“免费素材”直接记为商业许可通过。仍需原取得时有效的商业许可凭据，或另行决定补许可／换素材；本轮不执行购买或替换。
- **画室原视频的具体许可已核对。** Mixkit #100457 原作品页明确 Stock Video Free License；仓库原片与页面所指 720p 文件字节数、SHA-256 完全一致。首页与关于的同源派生可沿用该来源记录，不能把这一项推广为全部素材已通过。
- **海边照片原页和摄影版权许可已核对。** 找到 Liana Mikah 的 `m_TTQHOMutM`；原页图像链接的 CDN 标识与现有来源记录一致。海边视频的 LibTV 输出条款、下载原片归档及可能涉及的第三方权利仍是独立缺口。
- **企业画廊找到高度匹配的原作品页，但未完成文件对应核验。** Leonardo Vargas 的 `2XRwTFOp0Nc` 原页标题、作者与旧记录相符，并明确免费许可；本轮未取得该页图像链接与仓库文件的独立比对结果，不标为已闭合。画面内画作与场所的使用范围也未因摄影许可而自动通过。

2026-10-17 复核 `app/_site/media.json` 仍有 **62 个素材 key：55 张图片、7 个视频**。首次正式页面调用链盘点（含动态艺术家 slug、CSS 背景和下个展厅缩略图）记录 **51 张图片与 6 个视频有页面引用**；4 张图片和 1 个视频仅留在清单中。本轮只复核优先素材及首页 A/B 默认引用变化，没有重新逐页运行整站。视频封面、同图不同尺寸、A/B 派生不是新的独立原作。另有 manifest 外的 4 张 Story 概念图与品牌 Logo，下文保留。

`IMAGE-LIBRARY-BRIEF.md` 的 53 个编号全部映射到下表，但不能直接当“当前在用总数”：其中 01 `seaside-hero` 已作为生成视频的参考源，当前不直接渲染其 WebP；03 `home-garden`、05 `work-studio` 暂无正式页面调用；02、04 是视频封面，不是独立图片原作。艺术家试样及新增 A/B 视频也不在那 53 个编号里。新的官方图库仍在另一会话挑选，未接入不算替换完成。

首次盘点已纠正两项来源分类：此前 brief 把 `seaside-hero` 与 `world-woods` 标成 Molis 图库，但旧选图数据和对应页面记录分别指向 Unsplash `@lianamikah` 与 `@fez_wee` 的照片。2026-10-16 已目视本地文件与记录描述对应，主会话据此更正 brief；这不是 AI 原创证据。2026-10-17 进一步补到海边原页，World 原页仍待补。海边视频以外部照片为参考生成，不能把“视频由 AI 生成”当作全部上游条件已解决。

## 许可核验与状态含义

以下 Unsplash 许可、第三方权利说明及 Mixkit 许可分类、Free License、用户条款于 **2026-10-17** 重读；首次记录为 2026-10-16。下面仅概括本次官网使用有关的范围，不把通用条款替代单件作品证据。

- **U：Unsplash。** 免费许可允许商业使用和修改，通常不强制署名；禁止未作实质修改直接出售图片及用图汇编复制竞争图库。单件照片还须确认来自适用该许可的作品页，不能以 CDN 可下载、文件名或“免费”代码注释代替。[官方许可](https://unsplash.com/license)
- **M：Mixkit。** Stock Video Free License 允许商业项目及修改且不强制署名；Restricted License 的免费视频只适用于个人/非商业项目。必须核对该条视频下载版本的具体许可。[Free License](https://mixkit.co/license/modal/videoFree/)、[官方视频许可问答](https://mixkit.co/free-stock-video/)、[许可分类](https://mixkit.co/license/)
- 图片里可识别的人、画作、品牌或场所可能需要另行核对使用范围，不能由摄影版权许可一并推定。当前只记录已观察到的具体线索，不据此断言所有素材禁止商用。[Unsplash 相关说明](https://help.unsplash.com/en/articles/2646379-what-if-there-s-a-brand-or-identifiable-person-depicted-in-an-image-that-i-download)、[Mixkit 第 13 条](https://mixkit.co/terms/)
- **A1：已有 AI 生成提示词、生成文件名与 SHA-256 记录，本轮原图哈希一致。** 证明仓库素材可追溯，不是所有权或全部第三方权利自动通过。
- **A2：有生成/接入记录，但缺少完整原始文件、对应 hash、原始生成参数或参考素材权利链中的一部分。** 具体缺口逐件列出。
- **A3：仅被旧说明归类为 AI 图，未找到足够的逐件生成证据。** 不擅自填补作者、提示词或权利。
- “保留／待补证”表示本轮保持文件与页面不变并列明缺口；不表示已获发布验收。没有找到证据也不等于不存在授权。

“具体许可已核”仅指原作品页、当前适用的摄影／视频版权许可和实际文件的对应已确认；不代替人物、画作、场所等独立权利的判断。普通 Unsplash License 与 Unsplash+ 的条款不能混用；已核海边页标注的是普通 Unsplash License，本轮不将 Unsplash+ 的 AI 限制套到该照片，也不据普通修改许可代替 LibTV 输出条款核验。

## 图片逐件映射

以下表格首次核验为 2026-10-16；海边与企业画廊两行于 **2026-10-17** 更新，其余沿用首次盘点，不表示已全部逐件重验。路径相对仓库根目录，页面均为正式站；`/demos` 仅用于追溯。链接标为 **CDN 文件** 时，不是原作品页或逐件许可证据。未注明本轮复核的作者仍取自现有展签／选图记录。

| key / 图库 brief 编号 | 当前使用页面 | source 本地路径 | 原来源 URL / 作者与证据 | 许可状态与处理 |
| --- | --- | --- | --- | --- |
| `seaside-hero` / 01 | 当前不直接展示；首页海边视频参考源 | `public/images/r8/seaside-hero.jpg` | [原作品页](https://unsplash.com/photos/a-couple-of-people-walking-along-a-beach-next-to-the-ocean-m_TTQHOMutM)；Liana Mikah / @lianamikah；原页图像链接为 `photo-1554759111-8692719ccecc`，与[现有 CDN 来源](https://images.unsplash.com/photo-1554759111-8692719ccecc)一致 | 2026-10-17：原页、作者与普通 Unsplash 摄影许可已核；人物／生成输出相关边界见补证记录，未标为全部权利闭合 |
| `seaside-ware` / brief 未列 | 仅清单留存；未发现正式页面调用 | `public/images/r8/seaside-ware.jpg` | [CDN 文件](https://images.unsplash.com/photo-1741762055094-1304f0ebccd9)；未记录作者；原作品页未保存 | U 通用许可已核；单件作品页/许可截图待补；保留／待补证 |
| `home-garden` / 03 | 仅清单留存；未发现正式页面调用 | `public/r8-candidates-v2/images/home-v2-a.png` | brief 称 Molis 图库；本轮未找到逐件 prompt、生成任务或原作品 URL；作者/生成器未独立确认 | A3；保留／待补证 |
| `work-studio` / 05 | 仅清单留存；未发现正式页面调用 | `public/r8-candidates-v2/images/work-v2-c.png` | brief 称 Molis 图库；本轮未找到逐件 prompt、生成任务或原作品 URL；作者/生成器未独立确认 | A3；保留／待补证 |
| `tool-light` / 06 | /enterprise；/tool；/ 首页 Tool 示意背景 | `public/r8-candidates-v2/images/tool-v2-a.png` | brief 称 Molis 图库；本轮未找到逐件 prompt、生成任务或原作品 URL；作者/生成器未独立确认 | A3；保留／待补证 |
| `life-shore` / 07 | /life；/team | `public/r8-candidates-v2/images/life-v2-b.png` | brief 称 Molis 图库；本轮未找到逐件 prompt、生成任务或原作品 URL；作者/生成器未独立确认 | A3；保留／待补证 |
| `world-woods` / 08 | /world | `public/images/r8/park-hero.jpg` | [CDN 文件](https://images.unsplash.com/photo-1787080116801-c832d6e0e486)；@fez_wee；原作品页未保存 | U 通用许可已核；单件作品页/许可截图待补；保留／待补证 |
| `enterprise-gallery` / 09 | /enterprise | `public/images/r8/picks/unsplash-photo-1766128867459-064fcbfa8781-2400.jpg` | [原作品页候选](https://unsplash.com/photos/person-walking-through-a-minimalist-art-gallery-2XRwTFOp0Nc)；Leonardo Vargas / @leovamexican；与旧记录的作者、画廊描述相符；[本地来源 CDN](https://images.unsplash.com/photo-1766128867459-064fcbfa8781) | 2026-10-17：候选原页明确普通 Unsplash License；该页图像与本地文件的一一对应尚未取得，画作／场所范围亦待补证；不标通过 |
| `enterprise-desk` / 11 | /enterprise | `public/r8-materials-mist-v1/images/work-a.png` | Molis AI / 内置 image_gen；`r8-materials-assets.json` 的 work-a / mist；prompt、源文件名、SHA-256 一致 | A1；保留生成概念标识；使用条款/参考材料范围仍需归档 |
| `enterprise-hands` / 10 | /enterprise | `public/r8-materials-mist-v1/images/work-b.png` | Molis AI / 内置 image_gen；`r8-materials-assets.json` 的 work-b / mist；prompt、源文件名、SHA-256 一致 | A1；保留生成概念标识；使用条款/参考材料范围仍需归档 |
| `community-table` / 12 | /community | `public/images/atelier/makers-studio.jpg` | Molis AI / 内置 image_gen；`ATELIER-ASSETS.md` makers-studio 段有完整 prompt、生成原文件与两张参考图；无公开作品 URL | A2；虚构创作者；保留／补原文件及参考图记录 |
| `community-colors` / 13 | /community | `public/r8-materials-mist-v1/images/community-a.png` | Molis AI / 内置 image_gen；`r8-materials-assets.json` 的 community-a / mist；prompt、源文件名、SHA-256 一致 | A1；保留生成概念标识；使用条款/参考材料范围仍需归档 |
| `community-blocks` / 14 | /community | `public/images/line-engineering.jpg` | JPEG COM 内含 impeccable:prompt 完整生成提示词及风格参考说明；无原生成文件名与公开 URL | A2；保留／补生成记录与参考图来源 |
| `about-window` / 27 | /about；/team 下个展厅入口 | `public/r8-candidates-v2/images/about-v2-b.png` | brief 称 Molis 图库；本轮未找到逐件 prompt、生成任务或原作品 URL；作者/生成器未独立确认 | A3；保留／待补证 |
| `team-table` / 16 | /team；/along-the-way 下个展厅入口 | `public/r8-materials-v1/images/business-a.png` | Molis AI / 内置 image_gen；`r8-materials-assets.json` 的 business-a / original；prompt、源文件名、SHA-256 一致 | A1；保留生成概念标识；使用条款/参考材料范围仍需归档 |
| `team-sketchbook` / 17 | /team | `public/r8-materials-v1/images/story-a.png` | Molis AI / 内置 image_gen；`r8-materials-assets.json` 的 story-a / original；prompt、源文件名、SHA-256 一致 | A1；保留生成概念标识；使用条款/参考材料范围仍需归档 |
| `team-wind` / 19 | /team | `public/r8-materials-v1/images/home-b.png` | Molis AI / 内置 image_gen；`r8-materials-assets.json` 的 home-b / original；prompt、源文件名、SHA-256 一致 | A1；保留生成概念标识；使用条款/参考材料范围仍需归档 |
| `team-island` / 25 | /team | `public/r8-materials-v1/images/world-a.png` | Molis AI / 内置 image_gen；`r8-materials-assets.json` 的 world-a / original；prompt、源文件名、SHA-256 一致 | A1；保留生成概念标识；使用条款/参考材料范围仍需归档 |
| `ex-painter-water` / 20 | /team | `public/images/r8/picks/unsplash-photo-1780007193348-bd21e473dbf7-2400.jpg` | [CDN 文件](https://images.unsplash.com/photo-1780007193348-bd21e473dbf7)；Gennady Zakharin；原作品页未保存 | U 通用许可已核；单件作品页/许可截图待补；保留／待补证 |
| `ex-painter-blossom` / 21 | /team | `public/images/r8/picks/unsplash-photo-1557178908-438a334af016-2400.jpg` | [CDN 文件](https://images.unsplash.com/photo-1557178908-438a334af016)；Anastasiia Pyvovarova；原作品页未保存 | U 通用许可已核；单件作品页/许可截图待补；保留／待补证 |
| `ex-young-artist` / 22 | /team | `public/images/r8/picks/unsplash-photo-1752649937079-91226d0b5084-2400.jpg` | [CDN 文件](https://images.unsplash.com/photo-1752649937079-91226d0b5084)；Vitaly Gariev；原作品页未保存 | U 通用许可已核；单件作品页/许可截图待补；保留／待补证 |
| `ex-room-plants` / 23 | /team | `public/images/r8/picks/unsplash-photo-1768076954980-e387a18d0b2a-2400.jpg` | [CDN 文件](https://images.unsplash.com/photo-1768076954980-e387a18d0b2a)；Bianca Maria；原作品页未保存 | U 通用许可已核；单件作品页/许可截图待补；保留／待补证 |
| `ex-desk-forest` / 24 | /team | `public/images/r8/picks/unsplash-photo-1758383965264-b871a14bfff5-2400.jpg` | [CDN 文件](https://images.unsplash.com/photo-1758383965264-b871a14bfff5)；Bundo Kim；原作品页未保存 | U 通用许可已核；单件作品页/许可截图待补；保留／待补证 |
| `ex-car-sea` / 18 | /team | `public/images/r8/picks/unsplash-photo-1488204900407-c88697235ac5-2400.jpg` | [CDN 文件](https://images.unsplash.com/photo-1488204900407-c88697235ac5)；Joshua Newton；原作品页未保存 | U 通用许可已核；单件作品页/许可截图待补；保留／待补证 |
| `ex-shore-person` / 26 | /team；/work | `public/images/r8/picks/unsplash-photo-1700748881202-3c6e94c3b1ce-2400.jpg` | [CDN 文件](https://images.unsplash.com/photo-1700748881202-3c6e94c3b1ce)；zero take；原作品页未保存 | U 通用许可已核；单件作品页/许可截图待补；保留／待补证 |
| `ex-window-sun` / 28 | /about | `public/images/r8/picks/unsplash-photo-1714153760214-5e86aa688fc3-2400.jpg` | [CDN 文件](https://images.unsplash.com/photo-1714153760214-5e86aa688fc3)；Frolicsome Fairy；原作品页未保存 | U 通用许可已核；单件作品页/许可截图待补；保留／待补证 |
| `ex-dancer` / 29 | /about | `public/images/r8/picks/unsplash-photo-1529229504105-4ea795dcbf59-2400.jpg` | [CDN 文件](https://images.unsplash.com/photo-1529229504105-4ea795dcbf59)；Ahmad Odeh；原作品页未保存 | U 通用许可已核；单件作品页/许可截图待补；保留／待补证 |
| `ex-window-blinds` / 30 | /about | `public/images/r8/picks/unsplash-photo-1775129341637-ba2163ddd944-2400.jpg` | [CDN 文件](https://images.unsplash.com/photo-1775129341637-ba2163ddd944)；MIROV；原作品页未保存 | U 通用许可已核；单件作品页/许可截图待补；保留／待补证 |
| `ex-field-flowers` / 31 | /about | `public/images/r8/picks/unsplash-photo-1761745806972-9fba05b07b2a-2400.jpg` | [CDN 文件](https://images.unsplash.com/photo-1761745806972-9fba05b07b2a)；Céline Cao；原作品页未保存 | U 通用许可已核；单件作品页/许可截图待补；保留／待补证 |
| `ex-viewer` / 32 | /about | `public/images/r8/picks/unsplash-photo-1578730186202-89a8d433e519-2400.jpg` | [CDN 文件](https://images.unsplash.com/photo-1578730186202-89a8d433e519)；Fallon Michael；原作品页未保存 | U 通用许可已核；单件作品页/许可截图待补；保留／待补证 |
| `ex-field-arms` / 33 | /about | `public/images/r8/picks/unsplash-photo-1762515303947-cef3ea72386d-2400.jpg` | [CDN 文件](https://images.unsplash.com/photo-1762515303947-cef3ea72386d)；Céline Cao；原作品页未保存 | U 通用许可已核；单件作品页/许可截图待补；保留／待补证 |
| `ex-paper-plane` / 34 | /about | `public/images/r8/picks/unsplash-photo-1630218891212-fa9fbaf4c218-2400.jpg` | [CDN 文件](https://images.unsplash.com/photo-1630218891212-fa9fbaf4c218)；Abolfazl Ranjbar；原作品页未保存 | U 通用许可已核；单件作品页/许可截图待补；保留／待补证 |
| `ex-skylight` / 35 | 仓库交付基线仍用于 /about；仅 3002 于 2026-10-18 随产品实践段删除而撤下，素材留存 | `public/images/r8/picks/unsplash-photo-1774021793820-40681dd5ef4c-2400.jpg` | [CDN 文件](https://images.unsplash.com/photo-1774021793820-40681dd5ef4c)；Julia Taubitz；原作品页未保存 | U 通用许可已核；单件作品页/许可截图待补；保留／待补证 |
| `ex-dawn-field` / 40 | /along-the-way；/essays 下个展厅入口 | `public/images/r8/picks/unsplash-photo-1764900318742-029074f3bbf5-2400.jpg` | [CDN 文件](https://images.unsplash.com/photo-1764900318742-029074f3bbf5)；Damian Kravchuk；原作品页未保存 | U 通用许可已核；单件作品页/许可截图待补；保留／待补证 |
| `ex-handlebar` / 41 | /along-the-way | `public/images/r8/picks/unsplash-photo-1475666675596-cca2035b3d79-2400.jpg` | [CDN 文件](https://images.unsplash.com/photo-1475666675596-cca2035b3d79)；Florian Kurrasch；原作品页未保存 | U 通用许可已核；单件作品页/许可截图待补；保留／待补证 |
| `ex-balloon` / 42 | /along-the-way | `public/images/r8/picks/unsplash-photo-1778236262726-452ab6686b0f-2400.jpg` | [CDN 文件](https://images.unsplash.com/photo-1778236262726-452ab6686b0f)；Pascal Debrunner；原作品页未保存 | U 通用许可已核；单件作品页/许可截图待补；保留／待补证 |
| `ex-cyclist` / 43 | /along-the-way | `public/images/r8/picks/unsplash-photo-1519583272095-6433daf26b6e-2400.jpg` | [CDN 文件](https://images.unsplash.com/photo-1519583272095-6433daf26b6e)；Jay Kudva；原作品页未保存 | U 通用许可已核；单件作品页/许可截图待补；保留／待补证 |
| `ex-dawn-bird` / 44 | /along-the-way | `public/images/r8/picks/unsplash-photo-1772868609645-cb249538601e-2400.jpg` | [CDN 文件](https://images.unsplash.com/photo-1772868609645-cb249538601e)；Phước Sang；原作品页未保存 | U 通用许可已核；单件作品页/许可截图待补；保留／待补证 |
| `ex-field-grass` / 53 | /along-the-way | `public/images/r8/picks/unsplash-photo-1632061046569-e38a8b90ee0d-2400.jpg` | [CDN 文件](https://images.unsplash.com/photo-1632061046569-e38a8b90ee0d)；Joana Abreu；原作品页未保存 | U 通用许可已核；单件作品页/许可截图待补；保留／待补证 |
| `ex-writer` / 45 | /along-the-way | `public/images/r8/picks/unsplash-photo-1685661241913-84a6468c8ff2-2400.jpg` | [CDN 文件](https://images.unsplash.com/photo-1685661241913-84a6468c8ff2)；Alexandre Pascal；原作品页未保存 | U 通用许可已核；单件作品页/许可截图待补；保留／待补证 |
| `ex-cloud-watch` / 46 | /along-the-way | `public/images/r8/picks/unsplash-photo-1712260101910-f046c92195ef-2400.jpg` | [CDN 文件](https://images.unsplash.com/photo-1712260101910-f046c92195ef)；Kamil Klyta；原作品页未保存 | U 通用许可已核；单件作品页/许可截图待补；保留／待补证 |
| `ex-wax-seal` / 47 | /along-the-way | `public/images/r8/picks/unsplash-photo-1774891937648-68c7bfd6d035-2400.jpg` | [CDN 文件](https://images.unsplash.com/photo-1774891937648-68c7bfd6d035)；Raymond Petrik；原作品页未保存 | U 通用许可已核；单件作品页/许可截图待补；保留／待补证 |
| `ex-eggshell` / 48 | /along-the-way | `public/images/r8/picks/unsplash-photo-1789516154634-2ee2350bc9e5-2400.jpg` | [CDN 文件](https://images.unsplash.com/photo-1789516154634-2ee2350bc9e5)；Sebastian Schuster；原作品页未保存 | U 通用许可已核；单件作品页/许可截图待补；保留／待补证 |
| `ex-white-door` / 49 | /along-the-way | `public/images/r8/picks/unsplash-photo-1547304206-e2e68bae3729-2400.jpg` | [CDN 文件](https://images.unsplash.com/photo-1547304206-e2e68bae3729)；Joe Green；原作品页未保存 | U 通用许可已核；单件作品页/许可截图待补；保留／待补证 |
| `ex-night-desk` / 50 | /along-the-way | `public/images/r8/picks/unsplash-photo-1634021086770-12b626224f7a-2400.jpg` | [CDN 文件](https://images.unsplash.com/photo-1634021086770-12b626224f7a)；Javier Haro；原作品页未保存 | U 通用许可已核；单件作品页/许可截图待补；保留／待补证 |
| `ex-seed-hands` / 51 | /along-the-way | `public/images/r8/picks/unsplash-photo-1689601256066-7d31d73dbe46-2400.jpg` | [CDN 文件](https://images.unsplash.com/photo-1689601256066-7d31d73dbe46)；Timothé Durand；原作品页未保存 | U 通用许可已核；单件作品页/许可截图待补；保留／待补证 |
| `ex-plan-sketch` / 52 | /along-the-way | `public/images/r8/picks/unsplash-photo-1599420186985-5c3d1a038e84-2400.jpg` | [CDN 文件](https://images.unsplash.com/photo-1599420186985-5c3d1a038e84)；Ryan Ancill；原作品页未保存 | U 通用许可已核；单件作品页/许可截图待补；保留／待补证 |
| `ex-library-window` / 36 | /essays；/about 下个展厅入口 | `public/images/r8/picks/unsplash-photo-1782530707382-fdb15bf93789-2400.jpg` | [CDN 文件](https://images.unsplash.com/photo-1782530707382-fdb15bf93789)；Jameson Berrios；原作品页未保存 | U 通用许可已核；单件作品页/许可截图待补；保留／待补证 |
| `ex-sun-table` / 37 | /essays | `public/images/r8/picks/unsplash-photo-1776090188043-402fc41c4f5d-2400.jpg` | [CDN 文件](https://images.unsplash.com/photo-1776090188043-402fc41c4f5d)；LISK OBE；原作品页未保存 | U 通用许可已核；单件作品页/许可截图待补；保留／待补证 |
| `ex-hand-book` / 38 | /essays | `public/images/r8/picks/unsplash-photo-1589793241881-37eef79add7d-2400.jpg` | [CDN 文件](https://images.unsplash.com/photo-1589793241881-37eef79add7d)；Kira Porotikova；原作品页未保存 | U 通用许可已核；单件作品页/许可截图待补；保留／待补证 |
| `ex-workbench` / 39 | /essays | `public/images/r8/picks/unsplash-photo-1724182507700-bccac8d02859-2400.jpg` | [CDN 文件](https://images.unsplash.com/photo-1724182507700-bccac8d02859)；Nacho Gimeno Guerrero；原作品页未保存 | U 通用许可已核；单件作品页/许可截图待补；保留／待补证 |
| `contact-door` / 15 | /contact | `public/images/r8/afternoon-hero-girl-b.png` | brief 称 Molis 图库；本轮未找到逐件 prompt、生成任务或原作品 URL；作者/生成器未独立确认 | A3；保留／待补证 |
| `artist-monet-impressionism` / brief 未列 | /community；/community/methods；/community/methods/artists/monet-impressionism | `public/images/artists/monet-pond.jpg` | Molis AI 艺术家 Skill 的 AI 试样；`ARTIST-SKILL-SOURCES.md` 对应源仓库 outputs 路径；不是艺术家原作 | A2；保留 AI 试样标识；补原始生成/参考材料记录 |
| `artist-dali-surrealism` / brief 未列 | /community；/community/methods；/community/methods/artists/dali-surrealism | `public/images/artists/dali-forest.jpg` | Molis AI 艺术家 Skill 的 AI 试样；`ARTIST-SKILL-SOURCES.md` 对应源仓库 outputs 路径；不是艺术家原作 | A2；保留 AI 试样标识；补原始生成/参考材料记录 |
| `artist-wes-anderson-poster` / brief 未列 | /community；/community/methods；/community/methods/artists/wes-anderson-poster | `public/images/artists/wes-lake.jpg` | Molis AI 艺术家 Skill 的 AI 试样；`ARTIST-SKILL-SOURCES.md` 对应源仓库 outputs 路径；不是艺术家原作 | A2；保留 AI 试样标识；补原始生成/参考材料记录 |

## 视频与封面逐件映射

2026-10-17 更新在用天空、画室的具体作品许可，以及首页已默认采用 B 的引用。视频由另一会话负责，本轮不覆盖其文件。海边 A/B 是同一条已生成原片的本地派生，不算两次新生成。封面的许可跟随来源视频核验，不独立计作新的原作。

| key / brief 编号 | 当前页面 | 本地播放文件 / 上游来源 | 原来源 URL / 作者 | 许可状态与处理 |
| --- | --- | --- | --- | --- |
| `home-sky` / 封面 02 | `/` 首屏 | `public/site/home-sky-smooth.mp4`；由 `home-sky.mp4` 慢速插帧，原素材 `public/images/r8/sky-hero.mp4`；封面 `home-sky-poster.webp` | Mixkit #12273，[原作品页](https://mixkit.co/free-stock-video/clouds-in-blue-sky-time-lapse-12273/)；页面元数据作者 urzine；[720p 原文件](https://assets.mixkit.co/videos/12273/12273-720.mp4)与仓库原片 SHA-256 一致 | 2026-10-17：页面明确免费 720p 为 Restricted、仅个人用途；商业版另走 Envato。**商业许可未通过**，需既有有效授权凭据或另行处理；不自行换片 |
| `home-seaside` / brief 未列 | `?seaside=a` 二屏对照；普通首页已采用 B | `public/site/home-seaside-calm.mp4`；第一条 LibTV 原片的 0.55 倍慢放版，参考 `public/images/r8/seaside-hero.jpg`；封面 `home-seaside-poster.webp` | [现有画布](https://www.liblib.tv/canvas?projectId=6f8cc7007f44409fa5f6296b570b403f)；任务 `20261016171303618528266`，Kling 3.0 标准、10 秒；既有生成任务记录保留 | 上游照片原页与普通 Unsplash 许可已补；原片下载 URL/哈希、当时账户与模型的输出使用条款仍未归档；保留／待补证 |
| `home-seaside-detail` / brief 未列 | `/` 普通首页、`/?seaside=b` 二屏与空镜 | `public/site/home-seaside-calm-detail.mp4`；同上原片经慢放、插帧、2x 重采样；共用海边封面 | 同一 LibTV 任务与同一参考照片；本地处理脚本 `scripts/prepare-home-seaside.mjs --detail` | 与 A 相同的生成输出证据要求；清晰度处理不改变许可来源；保留／待补证 |
| `home-painting` / 封面 04 | `/` 末屏 | `public/site/home-painting.mp4`；同画室原素材 `public/images/r8/afternoon-ware.mp4`；封面 `home-painting-poster.webp` | Mixkit #100457，[原作品页](https://mixkit.co/free-stock-video/artist-painting-a-still-life-in-sunlit-room-100457/)；未显示独立作者名，不补造；[页面指向的 720p 文件](https://assets.mixkit.co/active_storage/video_items/100457/1724284479/100457-video-720.mp4)与仓库原片 SHA-256 一致 | 2026-10-17：**具体视频版权许可已核**，页面明确 Free License、可用于商业项目并修改；继续保留，第三方权利边界仍遵守官方条款 |
| `story-sky` / brief 未列 | `/story` | `public/site/story-sky.mp4`；原素材 `public/images/r8/sky-hero.mp4`；封面 `story-sky-poster.webp` | 同 Mixkit #12273 | 同 `home-sky`：720p 当前 Restricted，商业许可待补；派生转码不改变上游条件 |
| `about-painting` / brief 未列 | `/about` 起稿/修改/完成区 | `public/site/about-painting.mp4`；原素材 `public/images/r8/afternoon-ware.mp4`；封面 `about-painting-poster.webp` | 同 Mixkit #100457 | 同 `home-painting`：原视频来源与 Free License 已核；继续保留 |
| `about-coast` / brief 未列 | 仅 manifest 和 VideoKey 类型留存；未发现正式页面调用 | `public/site/about-coast.mp4`；旧海岸原素材 `public/images/r8/seaside-close.mp4`；封面 `about-coast-poster.webp` | 旧选图对应 Mixkit #26978；[CDN 文件](https://assets.mixkit.co/videos/26978/26978-720.mp4)；作品页、作者未保存 | M；当前未用，若重新启用先核该下载版本的 Free/Restricted；本轮不删除 |

首次核验未找到三个 Mixkit ID 的精确作品页；2026-10-17 已补齐在用 #12273 与 #100457，结果不同，不能互相沿用许可。未引用的 #26978 本轮未继续检索，仍保留待核状态。

## 2026-10-17 优先素材补证

### 天空：精确对应已确认，当前 720p 许可不满足商业用途

旧选图 `app/demos/brand/r8/picks/data.ts` 保存 #12273，当前脚本把 `public/images/r8/sky-hero.mp4` 派生为首页和 Story 视频。只读取得官方 CDN 文件时，响应 `Content-Disposition` 给出 `mixkit-clouds-in-blue-sky-time-lapse-12273-hd-ready.mp4`，据此定位到[精确作品页](https://mixkit.co/free-stock-video/clouds-in-blue-sky-time-lapse-12273/)。该页嵌入的文件地址就是现有 CDN 来源；本地原片和在线文件均为 **5,065,251 bytes**，SHA-256 均为：

`df23dd18d21887b1676e4c358f75919b5c7d81b212ca9bff3d0d9b123ec3f2e3`

原页下载区域明确区分商业 1080p 与仅供个人使用的免费 720p，HTML 的具体下载项为 `data-license="videoRestricted"`。商业入口指向 [Envato Clouds / T982EXU](https://elements.envato.com/clouds-T982EXU)，本轮没有购买、登录或取得该项许可。

**页面自身存在元数据冲突。** 同页 JSON-LD 的 `copyrightNotice` 写 Restricted，但 `license` URL 仍指向 `#videoFree`，描述还残留可商用字样。不能挑其中一句当授权；本记录以用户实际面对的具体下载条件为依据，保留冲突，要求商业凭据补证。当前页面不能证明历史下载时的条款，更不能证明已有授权不存在；缺的是该网站用途对应的有效商业许可／原下载时许可记录。首页及 Story、封面需要一并处理，慢放与转码不会消除该缺口。

### 画室：精确文件与 Free License 已确认

由 Mixkit 的 still-life 目录定位到[原作品页 #100457](https://mixkit.co/free-stock-video/artist-painting-a-still-life-in-sunlit-room-100457/)，其下载区明确适用 Stock Video Free License，并提供 720p、1080p、4K。页面 JSON-LD 的 `contentUrl` 与实际播放地址均指向上表中的 `active_storage` 文件，许可元数据与可见面板一致。该在线文件与 `public/images/r8/afternoon-ware.mp4` 均为 **2,687,991 bytes**，SHA-256 均为：

`6c13f1c96bfc73e86b3dc0396b953ec951278bb0b903d840e17974bbbf4d87e5`

因此 #100457 的原视频身份和具体摄影／视频版权许可已闭合；[Free License](https://mixkit.co/license/modal/videoFree/)允许商业项目与修改，署名非强制。原页本轮未显示独立作者名，继续署名来源 Mixkit，不杜撰摄影者。页面中人物、画作等使用仍受[用户条款](https://mixkit.co/terms/)约束，本项不是对所有第三方权利的额外保证。

### 海边与企业画廊：已找到的证据与精确剩余

海边[原页 m_TTQHOMutM](https://unsplash.com/photos/a-couple-of-people-walking-along-a-beach-next-to-the-ocean-m_TTQHOMutM)署名 Liana Mikah，标题为两人沿海边行走，描述为 California Surfers，发布日 2019-04-08；图像链接明确使用 `photo-1554759111-8692719ccecc`。与旧选图的 CDN 标识、作者及 2026-10-16 本地目视记录相符，普通 Unsplash License 标识已核。摄影版权允许商业使用和修改的证据已补到单件原页；后续不再以“找不到海边照片原页”作为阻塞。

企业画廊[候选原页 2XRwTFOp0Nc](https://unsplash.com/photos/person-walking-through-a-minimalist-art-gallery-2XRwTFOp0Nc)署名 Leonardo Vargas / @leovamexican，描述一人走过极简画廊，发布日 2025-12-19，并明确普通 Unsplash License。作者与场景和旧记录相符，但本轮公开页面图像／下载读取失败，普通 HTML 请求返回 401，下载入口返回 429；没有独立取得与 `photo-1766128867459-064fcbfa8781` 的一一对应。此处只记原页候选，停止重复请求，不写成文件已匹配。

两张照片均不因此获得对所有用途的保证。[Unsplash 的具体权利说明](https://help.unsplash.com/en/articles/2646379-what-if-there-s-a-brand-or-identifiable-person-depicted-in-an-image-that-i-download)及[作品／场所说明](https://help.unsplash.com/en/articles/2612329-releases-and-trademarks)要求按实际用途核对必要权利。企业图已实际观察到墙面画作、展签和室内空间，因此仍缺该件画作／场所适用范围证据；海边人物较远，本轮没有认定其可识别。海边生成视频还缺当时 LibTV 账户与模型输出的适用条款、下载原片 URL／哈希归档，不能用照片许可代替这些记录。本轮没有联系作者或平台。

### 33 张展签照片的批量恢复检查

现有表格共有 **37 条 Unsplash CDN 来源**：33 张 `ex-*` 展签照片，加上海边参考图、仅留存的 `seaside-ware`、World 树林与企业画廊。已检查 `app/_site/media.json`、`scripts/site-media.mjs`、`content/site/exhibit.ts`、旧选图 `app/demos/brand/r8/picks/data.ts`、仓库现有 JSON／来源文件与 `public/images/r8/picks` 图片元数据。可取得本地路径、CDN 标识和作者记录，但未找到可批量恢复这 33 张原作品页 URL 的 JSON／manifest；本地 JPG 扫描也未发现 Unsplash 原页链接。

因此保留上表逐件作者与 CDN 记录，不根据文件名拼造 Unsplash 作品 ID，不把作者主页或相似搜索结果记作原作品页。后续需要原选图导出／下载记录中“作品页 ID ↔ CDN 标识”的映射；若记录确已丢失，再逐件查原页和图像对应即可。此次没有把重复关键词搜索扩展成无期限检索，也没有将“未找到”写成“没有授权”。

## manifest 外的真实引用

不把原有 53 项或 manifest 当成全站媒体的完整集合。以下来自正式代码的原生 `src`，不包含评审页专用素材，也不把代码绘制的 SVG/CSS 示意当摄影原作。

| 文件 / 逻辑素材 | 当前页面与调用 | 原始来源 / 作者 | 证据与处理（2026-10-16） |
| --- | --- | --- | --- |
| `public/images/edition-c/story/astralo.jpg` | `/` Story 产品示意，`app/_site/home/stages-data.ts` | 未找到逐件作品 URL、作者或生成任务 | `EDITION-C-ASSETS.md` 只记录 studio-light 与 making-study，不能覆盖本图；保留概念示意边界，待补证 |
| `public/images/edition-c/story/departure.jpg` | 同上 | 未找到逐件作品 URL、作者或生成任务 | 同上；未发现 JPEG COM 来源记录；保留／待补证 |
| `public/images/edition-c/story/museum-lake.jpg` | 同上 | 未找到逐件作品 URL、作者或生成任务 | 同上；保留／待补证 |
| `public/images/edition-c/story/fog-harbor.jpg` | 同上 | 未找到逐件作品 URL、作者或生成任务 | 同上；保留／待补证 |
| `public/images/molis-logo.png` → `public/site/molis-logo-64.png`、`-96.png` | 全站顶栏/页尾；Tool 示意；品牌图标 | 仓库既有品牌原图；未查到外部作者、原始委托或设计授权文件 | 压缩派生关系明确，两个尺寸按一个逻辑品牌素材计；保留品牌原图，来源/授权归档待补，不重画 |

## 已验证的 AI 图库追溯

实际引用的 7 张 `r8-materials-*` 原文件都与 `docs/r8-materials-assets.json` 已保存的 SHA-256 一致；该 JSON 逐件保存 prompt、生成返回文件名、尺寸和原图/雾感版本关系。以下列完整 hash，方便后续替换时比对。此结论只证明文件未发生偏离和生成记录可追溯。

| key | source SHA-256 |
| --- | --- |
| `enterprise-desk` | `0048ff73553a283c9f0111e1d4a23f38a8dc001bcfbd1743874413442a2c7784` |
| `enterprise-hands` | `7f193baad42dbed5b2b668b2ac2ebe1834f7ae010bef3b3cea0a299074ae932c` |
| `community-colors` | `a85b6171f3b8b7dc10397a255060f5b0228050eef360cac61bc7acad1960c755` |
| `team-table` | `63b8dc37eb515a0b78d344561a5c1e965db8b295a2b652494f6309e756cba4f0` |
| `team-sketchbook` | `babf30d2279b308f224e249104cd8d6eb306ffc57eeed7f1f0d91d57dbb9d77f` |
| `team-wind` | `5118edec44fc4b27f3ca121b491e127129d94617ec8dc8c51681b775821cb272` |
| `team-island` | `b471831558d0ad2d41949cc9a544cc2b2fafa13c8d1d87eeef41d78255ddc0ca` |

`community-blocks` 的 JPEG COM 实际存在完整 prompt，描述以既有工作室插画为风格参考创建新插画；`community-table` 有文档中的生成源文件与参考图；艺术家三图有原仓库 outputs 路径。它们比“免费图”注释有更多追溯信息，但均不等于参考材料、输出使用条款已经逐项归档。

## 有具体画面依据的补证优先级

1. **天空 #12273：补商业凭据或另行决定处理。** 原片身份已确认，当前 720p 下载条件明确为 Restricted。优先查已有 Envato／其他有效商业许可及当时下载许可记录；若没有，再由用户决定购买合适许可或采用其他素材。本轮不自动充值、购买或换片。首页、Story 与封面按同一来源一起记录。
2. **企业画廊：补图像对应与具体画作／场所范围。** 原页候选已找到，下一步是将该页图片与仓库文件一一对应；再针对已观察到的画作和场所查已有使用范围记录。人物运动模糊，未认定可识别；不能仅凭摄影者署名将画作的权利一并视为已清楚。
3. **海边生成视频：补生成输出证据。** 上游照片原页与普通 Unsplash 许可已核；下一步是下载原片 URL／哈希、当时 LibTV 账户及所用模型的输出使用条件。仅在实际用法需要时再核具体人物权利，不把画面中有人直接等同于不可使用。
4. **World 树林与其余 Unsplash。** 来源误分类已在首次盘点纠正；仍须补原作品页与 CDN 标识的一一对应。先找既有下载／选图导出记录，缺失时逐件查，不凭来源注释全部放行。
5. **其他未闭合记录。** A2/A3、清单外 Story 图片与 Logo 继续按对应行补原始记录；#26978 未引用，若重启用先核许可。画室 #100457 本轮已核具体 Free License，无须继续把“找不到它的原作品页”列为阻塞。替换仍须获得相应授权，实际接入后才记为已替换。

## 可复核方法与未覆盖部分

- 首次读取 `scripts/site-media.mjs` 的 images/videos 定义与 `app/_site/media.json`，55 张图／7 视频一一对应；2026-10-17 复核 key 数未变。两轮均未运行媒体脚本或写素材。
- 首次搜索 `app/(site)`、`app/_site`、`content` 的实际引用，补充 `artistImage` 动态 key、Tool CSS 背景、`NextRoom` 封面及 Story 数据引用；类型声明和 manifest 留存不算使用。本轮同步首页普通入口改为 B 的事实，不扩大为整站重验。
- 两轮均只读旧 `app/demos/brand/r8/picks/data.ts` 与设计记录溯源，不改旧页或引入其代码。首次检查 prompt／哈希并目视海边、树林、企业画廊；本轮扫描 JPG 元数据、现有 manifest 与 JSON 中的原页映射。
- 2026-10-17 用公开作品页核对标题、作者、许可和媒体地址，公开 Mixkit 视频仅读入内存计算 SHA-256，与仓库原文件比对；没有另存、覆盖或重新编码视频。最初关键词搜索未命中天空，随后通过 CDN 响应文件名获得精确原页，未将相似结果充作证据。
- Unsplash 企业图的原页图像读取与 HTML／下载尝试未取得完整映射；返回 401／429 后停止重复请求。33 张展签缺原作品页映射、LibTV 历史输出条款等保持明确待补，不绕过登录或访问限制。
- 官方条款已读，不把 CDN 链接当作品页。本轮未登录第三方账号、未联络摄影者、未逐件获取所有授权文件、未重建丢失下载记录，也未核验所有人物身份。仅画室具体视频许可与海边具体摄影许可取得上述范围内的新增证据，没有“全部授权完成”的结论。
- 本文件是第 19 项的证据附表；主清单继续记录其状态。后续源码或素材变动后，要重新核使用页与来源，不凭此次统计宣称最新。
