#!/usr/bin/env node
/**
 * Verification for seven Roast Pear sketch-direction homepages.
 * Gates: inventory, content, integration (anti hero-paste), distinctness, optional launch.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import http from "node:http";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const HOMEPAGES = __dirname;

const DIRECTIONS = [
  "living-anthology",
  "teletext-service",
  "pixel-maker-city",
  "riso-release-wall",
  "slow-fire-index",
  "homepage-overdrive",
  "canon",
];

/** Below-fold world-native markers (must appear in page source) */
const BELOW_FOLD_MARKERS = {
  "living-anthology": ["chapter", "toc-row|toc", "afterword|colophon|letter-list|作者页|连载目录"],
  "teletext-service": ["P110|P210|P310|P410|P510", "block-head", "page-code|ticker"],
  "pixel-maker-city": ["district|districts", "shop-grid|board", "CITY MAP|HTML DISTRICTS|d-cognia"],
  "riso-release-wall": ["poster-grid|ticket", "署名墙|SERIES|label pink|DEV TICKET"],
  "slow-fire-index": ["fire-layout|fire-spine|station-body", "station-kicker", "慢一点"],
  "homepage-overdrive": ["class=\"desk\"|class='desk'", "note laptop|note sticky|class=\"note\"", "正在发生|feed-grid"],
  "canon": ["product-grid", "categories|cat ", "开始浏览"],
};

const CONTENT = {
  brand: ["烤个梨呀"],
  flagship: ["Cognia"],
  maker: ["马哥", "馊主意", "Knowledge-Graphify", "众生卷", "Elsewhere", "果果", "俊仔"],
  tools: ["ForkLight", "Relay", "Adeptify SDK"],
  community: ["论坛", "活动", "讨论", "Build Log", "工作室"],
};

function readPage(dir) {
  const htmlPath = path.join(HOMEPAGES, dir, "index.html");
  const cssPath = path.join(HOMEPAGES, dir, "styles.css");
  if (!fs.existsSync(htmlPath)) throw new Error(`Missing ${htmlPath}`);
  const html = fs.readFileSync(htmlPath, "utf8");
  const css = fs.existsSync(cssPath) ? fs.readFileSync(cssPath, "utf8") : "";
  return { htmlPath, cssPath, html, css, blob: html + "\n" + css };
}

function anyMatch(blob, alts) {
  return alts.some((re) => new RegExp(re, "i").test(blob));
}

function sketchUsages(html) {
  const re = /\.impeccable\/sketches\/[^"'\s]+\.webp/gi;
  return [...html.matchAll(re)].map((m) => m[0]);
}

/** Structural sketch-as-stage: full-bleed map/desk/hero-art class + webp */
function structuralSketchPaste(html) {
  const sketches = sketchUsages(html);
  if (!sketches.length) return { bad: false, sketches };
  // If webp is used with city-map / desk-art / hero-art structural classes, fail
  const structural =
    /(?:city-map|desk-art|hero-art)[^>]*sketches\/|\.impeccable\/sketches\/[^"']+\.webp[^>]*(?:city-map|desk-art|hero-art)/i.test(
      html,
    ) ||
    /class="[^"]*(?:city-map|desk-art|hero-art)[^"]*"[^>]*src="[^"]*sketches\//i.test(html) ||
    /src="[^"]*sketches\/[^"]+\.webp"/i.test(html) &&
      /class="(?:city-map|desk-art|hero-art)"/i.test(html);
  // Any sketch webp at all is discouraged for this goal — flag if present
  return { bad: sketches.length > 0, sketches, structural };
}

function contentFail(blob) {
  const fail = [];
  if (!CONTENT.brand.every((s) => blob.includes(s))) fail.push("brand");
  if (!CONTENT.flagship.every((s) => blob.includes(s))) fail.push("Cognia");
  if (!CONTENT.maker.some((s) => blob.includes(s))) fail.push("maker/work");
  if (!CONTENT.tools.some((s) => blob.includes(s))) fail.push("tools");
  if (!CONTENT.community.some((s) => blob.includes(s))) fail.push("community");
  if (!/Cognia[\s\S]{0,800}Notebook[\s\S]{0,800}Nexus|Cognia/.test(blob)) {
    /* Cognia already required */
  }
  if (!blob.includes("Notebook") || !blob.includes("Nexus")) fail.push("mains trio");
  return fail;
}

function sharedChrome(css, html) {
  // CSS custom properties used, and nav + section classes both present
  const hasTokens = /:root\s*\{[^}]*--/.test(css);
  const hasNav = /masthead|topbar|topline|nav-links|nav-pages|\.nav\b/.test(html + css);
  const hasBelow =
    /chapter|block|board|station-body|poster-grid|product-grid|feed-grid|section-label|fire-layout/.test(
      html,
    );
  return { hasTokens, hasNav, hasBelow, ok: hasTokens && hasNav && hasBelow };
}

function belowFoldNative(dir, blob) {
  const specs = BELOW_FOLD_MARKERS[dir] || [];
  const miss = [];
  for (const spec of specs) {
    if (!anyMatch(blob, spec.split("|"))) miss.push(spec);
  }
  return miss;
}

function main() {
  const map = ["# Homepage inventory map", ""];
  const content = ["# Content checklist", ""];
  const integration = ["# Integration (anti hero-paste)", ""];
  const markers = ["# Direction markers beyond hero", ""];
  let failed = false;

  for (const dir of DIRECTIONS) {
    const entry = path.join(HOMEPAGES, dir, "index.html");
    if (!fs.existsSync(entry)) {
      failed = true;
      map.push(`FAIL missing ${dir}`);
      continue;
    }
    map.push(`${dir} -> homepages/${dir}/index.html`);
    const page = readPage(dir);

    const cFail = contentFail(page.blob);
    content.push(`## ${dir}`);
    if (cFail.length) {
      failed = true;
      content.push(`FAIL: ${cFail.join(", ")}`);
    } else {
      content.push("OK: brand, Cognia, maker/work, tools, community, mains");
    }
    if (page.html.length < 3000) {
      failed = true;
      content.push(`FAIL: HTML too small (${page.html.length})`);
    }

    const sketch = structuralSketchPaste(page.html);
    const chrome = sharedChrome(page.css, page.html);
    const nativeMiss = belowFoldNative(dir, page.blob);

    integration.push(`## ${dir}`);
    integration.push(
      `tokens=${chrome.hasTokens} nav=${chrome.hasNav} below=${chrome.hasBelow} sketchWebps=${sketch.sketches.length}`,
    );
    if (sketch.bad) {
      failed = true;
      integration.push(`FAIL: sketch webp still used as page material: ${sketch.sketches.join(", ")}`);
    } else {
      integration.push("OK: no .impeccable/sketches/*.webp in HTML (UI is CSS-built)");
    }
    if (!chrome.ok) {
      failed = true;
      integration.push("FAIL: shared chrome incomplete (need :root tokens + nav + below-fold sections)");
    } else {
      integration.push("OK: shared tokens/chrome across page");
    }
    if (nativeMiss.length) {
      failed = true;
      integration.push(`FAIL: missing world-native below-fold markers: ${nativeMiss.join(" || ")}`);
    } else {
      integration.push("OK: world-native components below first viewport");
    }

    markers.push(`## ${dir}`);
    if (nativeMiss.length) {
      markers.push(`FAIL: ${nativeMiss.join(" || ")}`);
    } else {
      markers.push(`OK beyond-hero: ${(BELOW_FOLD_MARKERS[dir] || []).join(" · ")}`);
    }
  }

  // Distinctness fingerprints of below-fold systems
  const fps = DIRECTIONS.map((d) => {
    const { blob } = readPage(d);
    return {
      d,
      fp: [
        /chapter|toc-row|colophon/.test(blob),
        /P110|block-head|scanlines/.test(blob),
        /districts|shop-grid|CITY MAP/.test(blob),
        /poster-grid|ticket|RISO/.test(blob),
        /fire-spine|station-body|慢一点/.test(blob),
        /class="desk"|note laptop|OPEN STUDIO/.test(blob),
        /product-grid|btn-primary|开始浏览/.test(blob),
      ],
    };
  });
  markers.push("");
  for (let i = 0; i < fps.length; i++) {
    for (let j = i + 1; j < fps.length; j++) {
      if (fps[i].fp.join("") === fps[j].fp.join("")) {
        failed = true;
        markers.push(`FAIL identical fingerprint: ${fps[i].d} == ${fps[j].d}`);
      }
    }
  }
  for (const f of fps) markers.push(`${f.d}: ${f.fp.map((x) => (x ? "1" : "0")).join("")}`);

  return {
    failed,
    mapText: map.join("\n") + "\n",
    contentText: content.join("\n") + "\n",
    integrationText: integration.join("\n") + "\n",
    markerText: markers.join("\n") + "\n",
  };
}

async function launchPlaywright(outDir) {
  let playwright;
  try {
    playwright = await import("playwright");
  } catch {
    try {
      const { createRequire } = await import("node:module");
      const require = createRequire("/tmp/pw-roast/package.json");
      playwright = require("playwright");
    } catch (e) {
      return { ok: false, reason: String(e) };
    }
  }

  const shots = path.join(outDir, "shots");
  fs.mkdirSync(shots, { recursive: true });

  const server = await new Promise((resolve) => {
    const s = http.createServer((req, res) => {
      const urlPath = decodeURIComponent(req.url.split("?")[0]);
      const filePath = path.join(ROOT, urlPath.replace(/^\//, ""));
      if (!filePath.startsWith(ROOT) || !fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
        res.writeHead(404);
        res.end("not found");
        return;
      }
      const ext = path.extname(filePath);
      const types = {
        ".html": "text/html; charset=utf-8",
        ".css": "text/css; charset=utf-8",
        ".jpg": "image/jpeg",
        ".jpeg": "image/jpeg",
        ".png": "image/png",
        ".webp": "image/webp",
        ".js": "text/javascript; charset=utf-8",
      };
      res.writeHead(200, { "Content-Type": types[ext] || "application/octet-stream" });
      fs.createReadStream(filePath).pipe(res);
    });
    s.listen(0, "127.0.0.1", () => resolve(s));
  });
  const { port } = server.address();
  const browser = await playwright.chromium.launch({ headless: true });
  const results = [];
  try {
    for (const dir of DIRECTIONS) {
      for (let pass = 1; pass <= 2; pass++) {
        const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
        const errors = [];
        page.on("pageerror", (e) => errors.push(String(e)));
        const resp = await page.goto(`http://127.0.0.1:${port}/homepages/${dir}/index.html`, {
          waitUntil: "domcontentloaded",
          timeout: 60000,
        });
        await page.waitForTimeout(500);
        const status = resp ? resp.status() : 0;
        const text = await page.locator("body").innerText();
        const hasBrand = text.includes("烤个梨呀");
        const box = await page.locator("body").boundingBox();
        const painted = !!(box && box.height > 200);
        if (pass === 1) {
          await page.screenshot({ path: path.join(shots, `${dir}.png`), fullPage: true });
        }
        await page.close();
        const ok = status === 200 && hasBrand && painted && errors.length === 0;
        results.push({ dir, pass, status, hasBrand, painted, errors, ok, textLen: text.length });
      }
    }
  } finally {
    await browser.close();
    server.close();
  }
  return { ok: results.every((r) => r.ok), results, shots };
}

const wantLaunch = process.argv.includes("--launch");
const scratch =
  process.env.SCRATCH ||
  process.env.GROK_SCRATCH ||
  path.join(HOMEPAGES, ".verify-out");
fs.mkdirSync(scratch, { recursive: true });

const structural = main();
fs.writeFileSync(path.join(scratch, "homepage-map.txt"), structural.mapText);
fs.writeFileSync(path.join(scratch, "content-check.txt"), structural.contentText);
fs.writeFileSync(path.join(scratch, "integration-check.txt"), structural.integrationText);
fs.writeFileSync(path.join(scratch, "direction-markers.txt"), structural.markerText);

console.log(structural.mapText);
console.log(structural.contentText);
console.log(structural.integrationText);
console.log(structural.markerText);

if (structural.failed) {
  console.error("STRUCTURAL/INTEGRATION CHECKS FAILED");
  process.exit(1);
}

if (wantLaunch) {
  const launch = await launchPlaywright(scratch);
  fs.writeFileSync(path.join(scratch, "launch-results.json"), JSON.stringify(launch, null, 2));
  if (!launch.ok) {
    fs.writeFileSync(
      path.join(scratch, "launch-env.txt"),
      `Launch failed:\n${JSON.stringify(launch, null, 2)}\n`,
    );
    console.error("LAUNCH FAILED", launch.reason || "");
    process.exit(1);
  }
  console.log("LAUNCH OK", launch.results.length, "passes");
}

// integration notes
fs.writeFileSync(
  path.join(scratch, "integration-notes.md"),
  `# Integration notes

| Direction | How pillars weave into the world |
|-----------|----------------------------------|
| living-anthology | Full 合志: masthead issue meta → open spread cover (Cognia + product photo plate) → chapter blocks for 主菜/连载TOC/作者/后记/来信/colophon. No sketch webp. |
| teletext-service | Entire page is P-coded blocks: NOW, MAKERS/BUILDS/TALK/SDK, ticker, then P110–P510 detail pages in same cyan/black chrome. |
| pixel-maker-city | CSS district map (西/中央Cognia/东/市集/工区/广场) replaces sketch; shop boards continue thick pixel borders for mains/works/people/tools/hearth. |
| riso-release-wall | Poster primitive for hero + poster-grid mains/sides + 署名墙 + dashed tickets + forum posters. |
| slow-fire-index | Single fire-spine through hero, 主菜, 人, 小菜, 围炉, 工具 — each a station-body. |
| homepage-overdrive | CSS desk of notes/laptop (real Cognia jpg) + pear feed/cards/tiles — same surface language, no desk sketch. |
| canon | Market chrome end-to-end: search, category chips, product-grid, people, tools, community panels. |
`,
);

console.log("ALL CHECKS PASSED");
process.exit(0);
