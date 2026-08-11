#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const html = fs.readFileSync(path.join(here, "index.html"), "utf8");
const css = fs.readFileSync(path.join(here, "styles.css"), "utf8");
const js = fs.readFileSync(path.join(here, "app.js"), "utf8");
const failures = [];

function requireText(label, pattern, source = html) {
  if (!pattern.test(source)) failures.push(`missing ${label}`);
}

requireText("hero search", /role="search"/);
requireText("category navigation", /data-category="app"[\s\S]*data-category="sdk"/);
requireText("wander action", /随便撕一张/);
requireText("topic composer", /id="topic-composer"/);
requireText("happening immediately after hero", /<\/section>\s*<section class="section happening" id="happening"/);
requireText("Riso wall is default", /<html[^>]+data-view="wall"/);
requireText("three browsing modes", /data-view-option="wall"[\s\S]*data-view-option="slow"[\s\S]*data-view-option="cover"/);
requireText("cross-media types", /应用[\s\S]*工具[\s\S]*视频[\s\S]*小说 \/ 漫画[\s\S]*文章[\s\S]*SDK/);
requireText("Riso material tokens", /--paper:[\s\S]*--yellow:[\s\S]*--blue:[\s\S]*--pink:/, css);
requireText("developer products", /ForkLight[\s\S]*Relay[\s\S]*Adeptify SDK/);
requireText("reduced motion", /prefers-reduced-motion/, css);
requireText("keyboard search", /event\.metaKey[\s\S]*event\.ctrlKey[\s\S]*key\.toLowerCase\(\) === "k"/, js);

const hero = html.match(/<section class="hero"[\s\S]*?<\/section>/)?.[0] || "";
if (/头像|creator|马哥|果果|俊仔|哲子|飞哥/.test(hero)) failures.push("hero contains creator material");
if (/gradient\(/.test(css)) failures.push("gradient detected in final visual system");
if (/AI 应用|排行榜|下载量|在线人数|评分/.test(hero)) failures.push("misleading or catalog-first hero language");
if (/可体验|开始体验|内测|招募中|可离线试|新章节更新/.test(html)) failures.push("unverified maturity or live-state claim");

for (const asset of [...html.matchAll(/(?:src|href)="(assets\/[^"]+)"/g)].map((m) => m[1])) {
  if (!fs.existsSync(path.join(here, asset))) failures.push(`missing asset ${asset}`);
}
for (const sample of ["content/video.html", "content/story.html", "content/article.html", "content/content.css"]) {
  if (!fs.existsSync(path.join(here, sample))) failures.push(`missing content path ${sample}`);
}

if (failures.length) {
  console.error(`FINAL HOMEPAGE CHECK FAILED\n- ${failures.join("\n- ")}`);
  process.exit(1);
}

console.log("FINAL HOMEPAGE CHECK PASSED");
console.log("hero=Riso orientation/search/tickets/actions; first-followup=happening; views=wall/slow/cover");
