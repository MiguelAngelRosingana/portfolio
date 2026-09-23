(function () {
  "use strict";

  const data = window.__BRAND__ || {};
  const dict = (data.i18n && data.i18n.en) || {};
  const root = document.documentElement;

  const $ = (sel, scope) => (scope || document).querySelector(sel);
  const $$ = (sel, scope) => Array.from((scope || document).querySelectorAll(sel));
  function safe(fn, name) { try { fn(); } catch (e) { console.warn("[" + name + "] failed:", e); } }

  const ES_SUBJECT = "Contacto desde tu portfolio";
  let lang = "es";

  /* ---------------------------------------------------------------
     i18n — Spanish lives in the HTML; English comes from manifest.js
     --------------------------------------------------------------- */
  function parseAttrs(el) {
    return (el.getAttribute("data-i18n-attr") || "").split(";").map(function (p) {
      const i = p.indexOf(":");
      return i > 0 ? { attr: p.slice(0, i).trim(), key: p.slice(i + 1).trim() } : null;
    }).filter(Boolean);
  }

  function initI18n() {
    // Remember the Spanish originals once, so switching back is exact.
    $$("[data-i18n]").forEach(function (el) { el.dataset.es = el.textContent; });
    $$("[data-i18n-html]").forEach(function (el) { el.dataset.esHtml = el.innerHTML; });
    $$("[data-i18n-attr]").forEach(function (el) {
      const orig = {};
      parseAttrs(el).forEach(function (p) { orig[p.attr] = el.getAttribute(p.attr); });
      el.dataset.esAttrs = JSON.stringify(orig);
    });
    const descMeta = $('meta[name="description"]');
    root.dataset.esTitle = document.title;
    root.dataset.esDesc = descMeta ? descMeta.getAttribute("content") : "";

    $$("[data-lang]").forEach(function (btn) {
      btn.addEventListener("click", function () { setLang(btn.dataset.lang, true); });
    });

    let saved = null;
    try { saved = localStorage.getItem("lang"); } catch (_) {}
    const wanted = saved === "es" || saved === "en"
      ? saved
      : ((navigator.language || "es").toLowerCase().indexOf("es") === 0 ? "es" : "en");
    if (wanted === "en") apply("en");
  }

  function apply(next) {
    lang = next;
    const en = next === "en";
    root.lang = next;

    $$("[data-i18n]").forEach(function (el) {
      const t = en ? dict[el.dataset.i18n] : null;
      el.textContent = t != null ? t : el.dataset.es;
    });
    $$("[data-i18n-html]").forEach(function (el) {
      const t = en ? dict[el.dataset.i18nHtml] : null;
      el.innerHTML = t != null ? t : el.dataset.esHtml;
    });
    $$("[data-i18n-attr]").forEach(function (el) {
      let orig = {};
      try { orig = JSON.parse(el.dataset.esAttrs || "{}"); } catch (_) {}
      parseAttrs(el).forEach(function (p) {
        const t = en ? dict[p.key] : null;
        el.setAttribute(p.attr, t != null ? t : orig[p.attr]);
      });
    });

    document.title = en ? (dict["meta.title"] || root.dataset.esTitle) : root.dataset.esTitle;
    const descMeta = $('meta[name="description"]');
    if (descMeta) descMeta.setAttribute("content", en ? (dict["meta.desc"] || root.dataset.esDesc) : root.dataset.esDesc);

    const subject = en ? (dict["mail.subject"] || ES_SUBJECT) : ES_SUBJECT;
    $$("a[data-mail]").forEach(function (a) {
      a.setAttribute("href", "mailto:" + (data.email || "miguel.rosin@gmail.com") + "?subject=" + encodeURIComponent(subject));
    });

    $$("[data-lang]").forEach(function (btn) {
      btn.setAttribute("aria-pressed", String(btn.dataset.lang === next));
    });
    document.dispatchEvent(new CustomEvent("langchange"));
  }

  function setLang(next, animate) {
    if (next === lang) return;
    try { localStorage.setItem("lang", next); } catch (_) {}
    const main = $("main");
    if (!animate || !main) { apply(next); return; }
    main.style.transition = "opacity .16s ease";
    main.style.opacity = "0";
    setTimeout(function () {
      apply(next);
      main.style.opacity = "1";
      setTimeout(function () { main.style.transition = ""; main.style.opacity = ""; }, 200);
    }, 160);
  }

  /* ---------------------------------------------------------------
     Theme — paper by default, ink on request; circular reveal
     --------------------------------------------------------------- */
  function initTheme() {
    const btn = $("[data-theme-toggle]");
    if (!btn) return;
    const meta = $('meta[name="theme-color"]');
    const sync = function () {
      if (meta) meta.setAttribute("content", root.dataset.theme === "dark" ? "#0e1311" : "#f5f2ea");
    };
    sync();

    btn.addEventListener("click", function () {
      const next = root.dataset.theme === "dark" ? "light" : "dark";
      const apply = function () {
        root.dataset.theme = next;
        try { localStorage.setItem("theme", next); } catch (_) {}
        sync();
      };
      if (!document.startViewTransition) { apply(); return; }

      const r = btn.getBoundingClientRect();
      const x = r.left + r.width / 2, y = r.top + r.height / 2;
      const radius = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));
      const vt = document.startViewTransition(apply);
      vt.ready.then(function () {
        root.animate(
          { clipPath: ["circle(0px at " + x + "px " + y + "px)", "circle(" + radius + "px at " + x + "px " + y + "px)"] },
          { duration: 700, easing: "cubic-bezier(0.16, 1, 0.3, 1)", pseudoElement: "::view-transition-new(root)" }
        );
      }).catch(function () {});
    });
  }

  /* ---------------------------------------------------------------
     Header — hairline on scroll, progress, mobile sheet, active link
     --------------------------------------------------------------- */
  function initNav() {
    const header = $("[data-header]");
    if (!header) return;

    const portrait = $(".portrait");
    let ticking = false;
    const onScroll = function () {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(function () {
        ticking = false;
        const y = window.scrollY;
        header.classList.toggle("is-scrolled", y > 8);
        const max = root.scrollHeight - innerHeight;
        header.style.setProperty("--p", max > 0 ? Math.min(1, y / max).toFixed(4) : 0);
        if (portrait) portrait.style.setProperty("--py", (-Math.min(y, 720) * 0.07).toFixed(1));
      });
    };
    addEventListener("scroll", onScroll, { passive: true });
    addEventListener("resize", onScroll);
    onScroll();

    const btn = $("[data-menu-toggle]");
    const nav = $("#nav");
    const setOpen = function (open) {
      header.classList.toggle("is-open", open);
      if (btn) btn.setAttribute("aria-expanded", String(open));
    };
    if (btn) btn.addEventListener("click", function () { setOpen(!header.classList.contains("is-open")); });
    if (nav) nav.addEventListener("click", function (e) { if (e.target.closest("a")) setOpen(false); });
    addEventListener("keydown", function (e) { if (e.key === "Escape") setOpen(false); });
    addEventListener("resize", function () { if (innerWidth >= 960) setOpen(false); });

    if (!("IntersectionObserver" in window)) return;
    const links = $$('.nav a[href^="#"], [data-rail] a[href^="#"]');
    const rail = $("[data-rail]");
    const byId = {};
    links.forEach(function (a) { const id = a.getAttribute("href").slice(1); (byId[id] = byId[id] || []).push(a); });
    const clear = function () { links.forEach(function (a) { a.removeAttribute("aria-current"); }); };
    const io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        clear();
        (byId[e.target.id] || []).forEach(function (a) { a.setAttribute("aria-current", "true"); });
        if (rail) rail.classList.toggle("is-hidden", e.target.id === "contacto");
      });
    }, { rootMargin: "-42% 0px -52% 0px" });
    Object.keys(byId).forEach(function (id) { const s = document.getElementById(id); if (s) io.observe(s); });
    const top = document.getElementById("top");
    if (top) io.observe(top);
  }

  /* ---------------------------------------------------------------
     Reveals — content is in the HTML; this only eases it in.
     --------------------------------------------------------------- */
  function initDiagrams() {
    $$(".diagram .draw").forEach(function (el, i) {
      try {
        el.style.setProperty("--len", (el.getTotalLength() + 1).toFixed(1));
        el.style.setProperty("--k", String(i % 7));
      } catch (_) {}
    });
  }

  function initViewers() {
    $$(".shots[data-viewer]").forEach(function (box) {
      const figs = $$(".shot-fig", box);
      if (figs.length < 2) return;
      box.classList.add("is-viewer");
      // the whole viewer reveals as one piece
      figs.forEach(function (f) { f.removeAttribute("data-reveal"); });
      box.setAttribute("data-reveal", "");

      const bar = document.createElement("div");
      bar.className = "viewer-bar";
      bar.innerHTML = '<span class="viewer-dots" aria-hidden="true"><i></i><i></i><i></i></span><div class="viewer-tabs" role="group"></div>';
      box.insertBefore(bar, box.firstChild);
      const tabs = $(".viewer-tabs", bar);
      const btns = figs.map(function (f, i) {
        const b = document.createElement("button");
        b.type = "button";
        b.className = "viewer-tab";
        b.addEventListener("click", function () { select(i); });
        tabs.appendChild(b);
        return b;
      });
      function label() {
        figs.forEach(function (f, i) {
          const c = $("figcaption", f);
          btns[i].textContent = (c ? c.textContent : "").split(" · ")[0];
        });
      }
      function select(n) {
        figs.forEach(function (f, i) {
          f.classList.toggle("is-active", i === n);
          btns[i].setAttribute("aria-pressed", String(i === n));
        });
      }
      label();
      select(0);
      document.addEventListener("langchange", label);
    });
  }

  function initReveals() {
    const els = $$("[data-reveal]");
    if (!els.length) return;
    const show = function (el) { el.classList.add("is-in"); };
    if (!("IntersectionObserver" in window)) { els.forEach(show); return; }

    const io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        // also reveal what an anchor jump scrolled past
        if (e.isIntersecting || e.boundingClientRect.top < 0) { show(e.target); io.unobserve(e.target); }
      });
    }, { threshold: 0.05, rootMargin: "0px 0px -4% 0px" });
    els.forEach(function (el) { io.observe(el); });

    setTimeout(function () {
      els.forEach(function (el) {
        if (!el.classList.contains("is-in") && el.getBoundingClientRect().top < innerHeight) show(el);
      });
    }, 6000);
  }

  /* ---------------------------------------------------------------
     Timeline — the accent line draws as you read
     --------------------------------------------------------------- */
  function initTimeline() {
    // one or more independent lists (e.g. Experiencia / Formación side by side)
    const groups = $$("[data-timeline]").map(function (tl) {
      return { tl: tl, items: $$(".tl-item", tl) };
    });
    if (!groups.length) return;
    let queued = false;
    const update = function () {
      queued = false;
      const mark = innerHeight * 0.62;
      groups.forEach(function (g) {
        const r = g.tl.getBoundingClientRect();
        const p = Math.max(0, Math.min(1, (mark - r.top) / Math.max(1, r.height - 40)));
        g.tl.style.setProperty("--tl-p", p.toFixed(4));
        g.items.forEach(function (li) { li.classList.toggle("is-on", li.getBoundingClientRect().top + 8 < mark); });
      });
    };
    const request = function () { if (!queued) { queued = true; requestAnimationFrame(update); } };
    addEventListener("scroll", request, { passive: true });
    addEventListener("resize", request);
    update();
  }

  /* ---------------------------------------------------------------
     Lightbox — native <dialog>, arrows, swipe, Esc
     --------------------------------------------------------------- */
  function initLightbox() {
    const dlg = $("#lightbox");
    if (!dlg || typeof dlg.showModal !== "function") return;
    const img = $(".lb-img", dlg), cap = $(".lb-cap", dlg), count = $(".lb-count", dlg);
    const prev = $(".lb-prev", dlg), next = $(".lb-next", dlg), closeBtn = $(".lb-close", dlg);
    let group = [], idx = 0;

    function render() {
      const a = group[idx];
      if (!a) return;
      const im = $("img", a), fig = a.closest("figure"), c = fig && $("figcaption", fig);
      img.src = a.getAttribute("href");
      img.alt = im ? im.alt : "";
      cap.textContent = c ? c.textContent : "";
      count.textContent = (idx + 1) + " / " + group.length;
      prev.hidden = next.hidden = group.length < 2;
    }
    function step(d) { if (group.length < 2) return; idx = (idx + d + group.length) % group.length; render(); }

    document.addEventListener("click", function (e) {
      const a = e.target.closest("a[data-lightbox]");
      if (!a || e.metaKey || e.ctrlKey || e.shiftKey || e.button === 1) return;
      e.preventDefault();
      group = $$('a[data-lightbox="' + a.dataset.lightbox + '"]');
      idx = group.indexOf(a);
      render();
      dlg.showModal();
    });
    prev.addEventListener("click", function () { step(-1); });
    next.addEventListener("click", function () { step(1); });
    closeBtn.addEventListener("click", function () { dlg.close(); });
    dlg.addEventListener("click", function (e) {
      if (e.target === dlg || e.target.classList.contains("lb-fig")) dlg.close();
    });
    dlg.addEventListener("keydown", function (e) {
      if (e.key === "ArrowLeft") step(-1);
      if (e.key === "ArrowRight") step(1);
    });
    let sx = null;
    dlg.addEventListener("touchstart", function (e) { sx = e.touches[0].clientX; }, { passive: true });
    dlg.addEventListener("touchend", function (e) {
      if (sx == null) return;
      const dx = e.changedTouches[0].clientX - sx;
      sx = null;
      if (Math.abs(dx) > 50) step(dx < 0 ? 1 : -1);
    }, { passive: true });
    document.addEventListener("langchange", function () { if (dlg.open) render(); });
  }

  /* --------------------------------------------------------------- */
  function boot() {
    safe(initI18n, "initI18n");
    safe(initTheme, "initTheme");
    safe(initNav, "initNav");
    safe(initDiagrams, "initDiagrams");
    safe(initViewers, "initViewers");
    safe(initReveals, "initReveals");
    safe(initTimeline, "initTimeline");
    safe(initLightbox, "initLightbox");
    root.classList.add("is-ready");
    window.__READY__ = true;
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})();
