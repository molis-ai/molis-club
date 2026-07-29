(function () {
  const root = document.documentElement;

  /* Page veil */
  const veil = document.querySelector(".page-veil");
  if (veil) {
    veil.addEventListener("animationend", () => veil.remove());
  }

  /* Mobile nav */
  const toggle = document.querySelector("[data-menu-toggle]");
  const drawer = document.querySelector("[data-nav-drawer]");
  if (toggle && drawer) {
    toggle.addEventListener("click", () => {
      const open = drawer.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
      document.body.style.overflow = open ? "hidden" : "";
    });
    drawer.querySelectorAll("a").forEach((a) => {
      a.addEventListener("click", () => {
        drawer.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
        document.body.style.overflow = "";
      });
    });
  }

  /* Reveal on scroll */
  const reveals = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && reveals.length) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("is-in");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -6% 0px" }
    );
    reveals.forEach((el) => io.observe(el));
  } else {
    reveals.forEach((el) => el.classList.add("is-in"));
  }

  /* Subtle parallax on cover */
  const cover = document.querySelector("[data-parallax]");
  if (cover && !matchMedia("(prefers-reduced-motion: reduce)").matches) {
    const img = cover.querySelector("img");
    window.addEventListener(
      "scroll",
      () => {
        const rect = cover.getBoundingClientRect();
        if (rect.bottom < 0 || rect.top > innerHeight) return;
        const p = (innerHeight / 2 - rect.top) / innerHeight;
        if (img) img.style.transform = `scale(1.06) translateY(${p * 12}px)`;
      },
      { passive: true }
    );
  }

  /* Explore filters (local page) */
  const filterBar = document.querySelector("[data-filters]");
  if (filterBar) {
    const buttons = filterBar.querySelectorAll("button[data-filter]");
    const cards = document.querySelectorAll("[data-kind]");
    buttons.forEach((btn) => {
      btn.addEventListener("click", () => {
        buttons.forEach((b) => b.setAttribute("aria-pressed", "false"));
        btn.setAttribute("aria-pressed", "true");
        const f = btn.dataset.filter;
        cards.forEach((card) => {
          const show = f === "all" || card.dataset.kind === f;
          card.hidden = !show;
        });
      });
    });
  }

  /* Join form demo */
  const form = document.querySelector("[data-join-form]");
  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const note = form.querySelector("[data-form-note]");
      if (note) {
        note.hidden = false;
        note.textContent = "示意提交成功。正式环境将进入 Builder 审核队列。";
      }
    });
  }
})();
