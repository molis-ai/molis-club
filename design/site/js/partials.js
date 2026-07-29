/**
 * Shared chrome. Set before load:
 * window.RP = { inPages: false, page: 'home' }
 * page: home | explore | forum | developers | join | people | work
 */
(function () {
  const cfg = window.RP || {};
  const inPages = !!cfg.inPages;
  const home = inPages ? "../index.html" : "index.html";
  const page = (p) => (inPages ? p : `pages/${p}`);
  const cur = (id) => (cfg.page === id ? ' aria-current="page"' : "");

  const nav = `
  <div class="page-veil" aria-hidden="true"></div>
  <a class="skip" href="#main">跳到内容</a>
  <header class="nav">
    <div class="nav-inner">
      <a class="brand" href="${home}" aria-label="烤个梨呀首页">
        <span class="brand-mark" aria-hidden="true"></span>
        <span class="brand-text">烤个梨呀<span class="brand-sub">由 Adeptify 发起</span></span>
      </a>
      <nav class="nav-links" aria-label="主导航">
        <a href="${home}#mains">主菜</a>
        <a href="${page("explore.html")}"${cur("explore")}>发现</a>
        <a href="${page("forum.html")}"${cur("forum")}>论坛</a>
        <a href="${page("developers.html")}"${cur("developers")}>开发者</a>
        <a href="${page("join.html")}"${cur("join")}>加入</a>
      </nav>
      <div class="nav-spacer"></div>
      <div class="nav-actions">
        <button class="icon-btn menu-toggle" type="button" data-menu-toggle aria-label="打开菜单" aria-expanded="false">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h16"/></svg>
        </button>
        <a class="btn btn-ghost" href="${page("join.html")}">登录</a>
        <a class="btn btn-primary" href="${page("join.html")}">注册</a>
      </div>
    </div>
  </header>
  <div class="nav-drawer" data-nav-drawer>
    <a href="${home}">首页</a>
    <a href="${home}#mains">主菜</a>
    <a href="${page("explore.html")}">发现</a>
    <a href="${page("forum.html")}">论坛</a>
    <a href="${page("developers.html")}">开发者</a>
    <a href="${page("people-mago.html")}">创作者示例</a>
    <a href="${page("join.html")}">注册 / Builder</a>
  </div>`;

  const footer = `
  <footer class="site-footer">
    <div class="wrap">
      <div class="footer-grid">
        <div>
          <div class="footer-brand">烤个梨呀
            <span>由 Adeptify 发起。慢火，不赶场。示意原型，数据待事实替换。</span>
          </div>
        </div>
        <div class="footer-col">
          <h3>逛逛</h3>
          <a href="${home}#mains">炉上主菜</a>
          <a href="${page("explore.html")}">发现</a>
          <a href="${page("people-mago.html")}">创作者</a>
          <a href="${page("forum.html")}">论坛</a>
        </div>
        <div class="footer-col">
          <h3>开发者</h3>
          <a href="${page("developers.html")}">开发者中心</a>
          <a href="${page("developers.html")}#forklight">ForkLight</a>
          <a href="${page("developers.html")}#relay">Relay</a>
          <a href="${page("developers.html")}#sdk">Adeptify SDK</a>
        </div>
        <div class="footer-col">
          <h3>加入</h3>
          <a href="${page("join.html")}">注册</a>
          <a href="${page("join.html")}#builder">成为 Builder</a>
          <a href="${home}#hearth">活动</a>
        </div>
      </div>
      <div class="footer-bottom">
        <span>漆梨 × 月刊 · design/site</span>
        <span>© Adeptify · 烤个梨呀</span>
      </div>
    </div>
  </footer>
  <div class="demo-chip" data-mock="true">示意原型 · 非生产数据</div>`;

  const navEl = document.querySelector("[data-rp-nav]");
  const footEl = document.querySelector("[data-rp-footer]");
  if (navEl) navEl.outerHTML = nav;
  if (footEl) footEl.outerHTML = footer;
})();
