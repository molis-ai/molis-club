(function () {
  "use strict";

  const root = document.documentElement;
  const query = document.querySelector("#discovery-query");
  const searchForm = document.querySelector("#discovery-search");
  const searchResults = document.querySelector("#search-results");
  const liveItems = [...document.querySelectorAll(".live-item")];
  const categoryButtons = [...document.querySelectorAll("[data-category]")];
  const clearFilter = document.querySelector("#clear-filter");
  const filterEmpty = document.querySelector("#filter-empty");
  const appearanceToggle = document.querySelector("#appearance-toggle");
  const appearanceMenu = document.querySelector("#appearance-menu");
  const appearanceLabel = document.querySelector("#appearance-label");
  const viewOptions = [...document.querySelectorAll("[data-view-option]")];
  const topicToggle = document.querySelector("#topic-toggle");
  const topicComposer = document.querySelector("#topic-composer");
  const topicTitle = document.querySelector("#topic-title");
  const topicForm = document.querySelector("#topic-form");
  const topicStatus = document.querySelector("#composer-status");
  const topicLogin = document.querySelector("#composer-login");
  const topicClose = document.querySelector(".composer-close");
  const menuToggle = document.querySelector("#menu-toggle");
  const mobileNav = document.querySelector("#mobile-nav");
  const wanderButton = document.querySelector("#wander-button");

  const names = { wall: "发布墙", slow: "慢火清单", cover: "当期封面" };
  const searchData = [
    { group: "作品", kind: "应用", title: "Cognia", detail: "Adeptify 拳头产品 · 查看介绍", href: "../site/pages/work-cognia.html", terms: "cognia 应用 工作台 作品介绍" },
    { group: "作品", kind: "工具", title: "马哥的馊主意", detail: "查看作品与 Build Log", href: "../site/pages/work-ideas.html", terms: "马哥 馊主意 工具 build log" },
    { group: "作品", kind: "小说", title: "众生卷", detail: "互动故事 · 阅读示例", href: "content/story.html", terms: "众生卷 小说 互动故事 漫画 章节" },
    { group: "作品", kind: "视频", title: "开放工作室", detail: "团队创作过程 · 观看示例", href: "content/video.html", terms: "开放工作室 视频 幕后 团队" },
    { group: "作品", kind: "文章", title: "野外观察", detail: "作品成长记录 · 阅读示例", href: "content/article.html", terms: "文章 研究 野外观察 阅读" },
    { group: "开发者", kind: "文档", title: "ForkLight", detail: "长任务 Worker · Quick Start", href: "../site/pages/developers.html", terms: "forklight 开发者 工具 sdk 文档 长任务" },
    { group: "开发者", kind: "文档", title: "Relay", detail: "连接与转发 · 能力介绍", href: "../site/pages/developers.html", terms: "relay 连接 转发 开发者 sdk" },
    { group: "开发者", kind: "SDK", title: "Adeptify SDK", detail: "开发者支持入口", href: "../site/pages/developers.html", terms: "adeptify sdk 开发者 文档" },
    { group: "作者", kind: "Maker", title: "马哥", detail: "查看作品集与关联讨论", href: "../site/pages/people-mago.html", terms: "马哥 maker 作者 创作者" },
    { group: "作者", kind: "示例 Builder", title: "林间电台", detail: "虚构结构示例 · 视频与文章作品集", href: "#people", terms: "林间电台 builder 外部创作者 示例" },
    { group: "话题", kind: "反馈", title: "Cognia 试用反馈", detail: "关联 Cognia · 示意讨论", href: "../site/pages/forum.html", terms: "cognia 反馈 论坛 话题 试用" },
  ];

  let activeResult = -1;

  function escapeHtml(value) {
    return value.replace(/[&<>'"]/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" })[char]);
  }

  function openSearchResults() {
    searchResults.hidden = false;
    query.setAttribute("aria-expanded", "true");
  }

  function closeSearchResults() {
    searchResults.hidden = true;
    query.setAttribute("aria-expanded", "false");
    query.setAttribute("aria-activedescendant", "");
    activeResult = -1;
  }

  function renderSearch(term) {
    activeResult = -1;
    query.setAttribute("aria-activedescendant", "");
    const needle = term.trim().toLowerCase();
    if (!needle) {
      searchResults.innerHTML = '<div class="result-group"><p>可以从这里开始</p>' + searchData.slice(0, 4).map(resultMarkup).join("") + "</div>";
      openSearchResults();
      return;
    }
    const matches = searchData.filter((item) => `${item.title} ${item.detail} ${item.terms}`.toLowerCase().includes(needle));
    if (!matches.length) {
      searchResults.innerHTML = `<div class="result-empty"><strong>没有找到“${escapeHtml(term.trim())}”</strong><span>换个词试试，或起草一个相关话题。</span></div>`;
      openSearchResults();
      return;
    }
    const groups = matches.reduce((acc, item) => {
      (acc[item.group] ||= []).push(item);
      return acc;
    }, {});
    searchResults.innerHTML = Object.entries(groups).map(([group, items]) => `<div class="result-group"><p>${group}</p>${items.map(resultMarkup).join("")}</div>`).join("");
    openSearchResults();
  }

  function resultMarkup(item) {
    const id = `search-option-${item.title.toLowerCase().replace(/[^a-z0-9\u4e00-\u9fff]+/g, "-")}`;
    return `<a class="result-option" id="${id}" role="option" aria-selected="false" href="${item.href}"><span>${item.kind}</span><div><strong>${item.title}</strong><small>${item.detail}</small></div></a>`;
  }

  function moveResult(delta) {
    const options = [...searchResults.querySelectorAll(".result-option")];
    if (!options.length) return;
    activeResult = (activeResult + delta + options.length) % options.length;
    options.forEach((option, index) => option.setAttribute("aria-selected", index === activeResult ? "true" : "false"));
    query.setAttribute("aria-activedescendant", options[activeResult].id);
    options[activeResult].scrollIntoView({ block: "nearest" });
  }

  query.addEventListener("focus", () => renderSearch(query.value));
  query.addEventListener("input", () => renderSearch(query.value));
  query.addEventListener("keydown", (event) => {
    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      if (searchResults.hidden) renderSearch(query.value);
      moveResult(event.key === "ArrowDown" ? 1 : -1);
    }
    if (event.key === "Enter" && activeResult >= 0) {
      const option = searchResults.querySelectorAll(".result-option")[activeResult];
      if (option) { event.preventDefault(); option.click(); }
    }
    if (event.key === "Escape") { closeSearchResults(); query.blur(); }
  });
  searchForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const first = searchResults.querySelector(".result-option");
    if (first && query.value.trim()) first.click();
    else renderSearch(query.value);
  });
  document.addEventListener("pointerdown", (event) => {
    if (!searchForm.contains(event.target)) closeSearchResults();
  });
  document.addEventListener("keydown", (event) => {
    if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") { event.preventDefault(); query.focus(); }
  });

  function applyFilter(kind) {
    let visible = 0;
    liveItems.forEach((item) => {
      const show = !kind || item.dataset.kind.split(" ").includes(kind);
      item.hidden = !show;
      if (show) visible += 1;
    });
    categoryButtons.forEach((button) => button.setAttribute("aria-pressed", button.dataset.category === kind ? "true" : "false"));
    clearFilter.hidden = !kind;
    filterEmpty.hidden = visible !== 0;
    document.querySelector("#happening").scrollIntoView({ behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
  }
  categoryButtons.forEach((button) => button.addEventListener("click", () => applyFilter(button.dataset.category)));
  clearFilter.addEventListener("click", () => applyFilter(""));

  wanderButton.addEventListener("click", (event) => {
    event.preventDefault();
    const available = liveItems.filter((item) => !item.hidden);
    const target = available[Math.floor(Math.random() * available.length)] || liveItems[0];
    target?.scrollIntoView({ block: "center", behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
    target?.querySelector("a")?.focus({ preventScroll: true });
  });

  function setView(view, persist = true) {
    const next = names[view] ? view : "wall";
    root.dataset.view = next;
    appearanceLabel.textContent = `外观 · ${names[next]}`;
    viewOptions.forEach((option) => option.setAttribute("aria-checked", option.dataset.viewOption === next ? "true" : "false"));
    if (persist) {
      try { localStorage.setItem("roast-pear-home-view-v3", next); } catch (_) { /* storage can be disabled */ }
    }
  }
  try { setView(localStorage.getItem("roast-pear-home-view-v3") || "wall", false); } catch (_) { setView("wall", false); }

  appearanceToggle.addEventListener("click", () => {
    const open = appearanceMenu.hidden;
    appearanceMenu.hidden = !open;
    appearanceToggle.setAttribute("aria-expanded", open ? "true" : "false");
    if (open) viewOptions.find((item) => item.getAttribute("aria-checked") === "true")?.focus();
  });
  viewOptions.forEach((option) => option.addEventListener("click", () => {
    setView(option.dataset.viewOption);
    appearanceMenu.hidden = true;
    appearanceToggle.setAttribute("aria-expanded", "false");
    appearanceToggle.focus();
  }));
  appearanceMenu.addEventListener("keydown", (event) => {
    const current = viewOptions.indexOf(document.activeElement);
    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      viewOptions[(current + (event.key === "ArrowDown" ? 1 : -1) + viewOptions.length) % viewOptions.length].focus();
    }
    if (event.key === "Escape") { appearanceMenu.hidden = true; appearanceToggle.setAttribute("aria-expanded", "false"); appearanceToggle.focus(); }
  });
  document.addEventListener("pointerdown", (event) => {
    if (!event.target.closest(".appearance")) { appearanceMenu.hidden = true; appearanceToggle.setAttribute("aria-expanded", "false"); }
  });

  function openTopic() {
    topicComposer.hidden = false;
    topicToggle.setAttribute("aria-expanded", "true");
    topicTitle.focus();
    topicComposer.scrollIntoView({ block: "center", behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
  }
  function closeTopic() {
    topicComposer.hidden = true;
    topicToggle.setAttribute("aria-expanded", "false");
    topicToggle.focus();
  }
  topicToggle.addEventListener("click", () => topicComposer.hidden ? openTopic() : closeTopic());
  topicClose.addEventListener("click", closeTopic);
  document.querySelectorAll("[data-open-topic]").forEach((button) => button.addEventListener("click", openTopic));
  const draftKey = "roast-pear-topic-draft-v2";
  function readTopicDraft() {
    try { return JSON.parse(localStorage.getItem(draftKey) || "{}"); } catch (_) { return {}; }
  }
  function saveTopicDraft() {
    const draft = {
      title: topicTitle.value,
      type: topicForm.elements.type.value,
      related: topicForm.elements.related.value,
    };
    try { localStorage.setItem(draftKey, JSON.stringify(draft)); } catch (_) { /* storage can be disabled */ }
  }
  const savedDraft = readTopicDraft();
  topicTitle.value = savedDraft.title || "";
  if (savedDraft.type) topicForm.elements.type.value = savedDraft.type;
  if (savedDraft.related) topicForm.elements.related.value = savedDraft.related;
  topicForm.addEventListener("input", saveTopicDraft);
  topicForm.addEventListener("change", saveTopicDraft);
  topicForm.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!topicTitle.value.trim()) { topicStatus.textContent = "先写一个标题，再继续。"; topicTitle.focus(); return; }
    saveTopicDraft();
    topicStatus.textContent = "草稿已保存在本机。";
    topicLogin.hidden = false;
  });

  menuToggle.addEventListener("click", () => {
    const open = mobileNav.hidden;
    mobileNav.hidden = !open;
    menuToggle.setAttribute("aria-expanded", open ? "true" : "false");
    menuToggle.setAttribute("aria-label", open ? "关闭导航" : "打开导航");
  });
  mobileNav.querySelectorAll("a").forEach((link) => link.addEventListener("click", () => {
    mobileNav.hidden = true;
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "打开导航");
  }));
})();
