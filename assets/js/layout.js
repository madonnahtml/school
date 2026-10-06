/*
 * layout.js — struttura comune a tutte le pagine.
 * Barra superiore, menu delle materie (laterale su computer, a scomparsa su telefono),
 * barra di navigazione in basso su telefono, percorso, indice della pagina,
 * progressi ("studiato"), "Riprendi da qui" e griglia materie della home.
 *
 * Ogni pagina contiene solo il proprio <main id="content">.
 */
SITE.ready(function () {
  "use strict";
  var html = document.documentElement;
  var subject = SITE.subject(html.getAttribute("data-subject"));
  var page = SITE.currentPage();
  var main = document.getElementById("content");
  if (!main) return;

  var I = SITE.icons = {
    menu: '<path d="M4 7h16M4 12h16M4 17h10"/>',
    search: '<circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>',
    sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>',
    moon: '<path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/>',
    home: '<path d="m3 10 9-7 9 7v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><path d="M9 22V12h6v10"/>',
    book: '<path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20V3H6.5A2.5 2.5 0 0 0 4 5.5z"/><path d="M4 19.5A2.5 2.5 0 0 0 6.5 22H20v-5"/>',
    cards: '<rect x="3" y="6" width="14" height="14" rx="2"/><path d="M7 2h12a2 2 0 0 1 2 2v12"/>',
    chevron: '<path d="m9 18 6-6-6-6"/>',
    check: '<path d="M20 6 9 17l-5-5"/>',
    close: '<path d="M18 6 6 18M6 6l12 12"/>',
    copy: '<rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>',
    list: '<path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01"/>',
  };
  var isMac = /Mac|iPhone|iPad/.test(navigator.platform || navigator.userAgent);

  /* ---------- Barra superiore ---------- */
  var topbar = document.createElement("header");
  topbar.className = "topbar";
  topbar.innerHTML =
    '<button class="icon-btn menu-btn" type="button" aria-label="Materie" aria-expanded="false" aria-controls="sidebar">' + SITE.icon(I.menu) + "</button>" +
    '<a class="brand" href="' + SITE.url("index.html") + '"><span class="brand-mark" aria-hidden="true">S</span>' +
      '<span class="brand-name">' + SITE.escape(SITE.title) + "</span></a>" +
    '<button class="search-trigger" type="button" data-search-open>' + SITE.icon(I.search) +
      '<span class="search-trigger-label">Cerca negli appunti</span><kbd>' + (isMac ? "⌘" : "Ctrl") + " K</kbd></button>" +
    '<a class="top-link' + (SITE.isHere("ripasso.html") ? " is-active" : "") + '" href="' + SITE.url("ripasso.html") + '">' + SITE.icon(I.cards) + "<span>Ripasso</span></a>" +
    '<button class="icon-btn theme-btn" type="button" aria-label="Tema chiaro o scuro">' +
      SITE.icon(I.sun, "icon icon-sun") + SITE.icon(I.moon, "icon icon-moon") + "</button>";

  /* ---------- Menu materie ---------- */
  var sidebar = document.createElement("aside");
  sidebar.className = "sidebar";
  sidebar.id = "sidebar";

  function renderSidebar() {
    var done = SITE.progress.all();
    var out = '<div class="sheet-head"><span>Materie</span><button class="icon-btn" type="button" data-close-menu aria-label="Chiudi">' +
      SITE.icon(I.close) + "</button></div><nav aria-label=\"Materie\"><ul class=\"side-list\">";
    SITE.subjects.forEach(function (s) {
      var open = subject && s.id === subject.id;
      var c = SITE.progress.count(s);
      out += '<li class="side-subject' + (open ? " is-open" : "") + '" style="--c:' + s.color + '">' +
        '<a class="side-link' + (SITE.isHere(s.pages[0].path) ? " is-active" : "") + '" href="' + SITE.url(s.pages[0].path) + '">' +
        '<span class="tab" aria-hidden="true"></span><span class="side-name">' + SITE.escape(s.name) + "</span>" +
        (c.total ? '<span class="side-count" title="Argomenti studiati">' + c.done + "/" + c.total + "</span>" : "") + "</a>";
      if (open && s.pages.length > 1) {
        out += '<ul class="side-pages">';
        s.pages.slice(1).forEach(function (p) {
          out += '<li><a class="' + (SITE.isHere(p.path) ? "is-active" : "") + (done[p.path] ? " is-done" : "") + '" href="' + SITE.url(p.path) + '">' +
            '<span class="dot" aria-hidden="true"></span>' + SITE.escape(p.title) + "</a></li>";
        });
        out += "</ul>";
      }
      out += "</li>";
    });
    out += "</ul></nav>";
    sidebar.innerHTML = out;
  }
  renderSidebar();

  var scrim = document.createElement("div");
  scrim.className = "scrim";

  /* ---------- Barra in basso (telefono) ---------- */
  var tabbar = document.createElement("nav");
  tabbar.className = "tabbar";
  tabbar.setAttribute("aria-label", "Navigazione principale");
  tabbar.innerHTML =
    '<a href="' + SITE.url("index.html") + '"' + (SITE.isHere("index.html") ? ' class="is-active"' : "") + ">" + SITE.icon(I.home) + "<span>Home</span></a>" +
    '<button type="button" data-open-menu' + (subject ? ' class="is-active"' : "") + ">" + SITE.icon(I.book) + "<span>Materie</span></button>" +
    '<button type="button" data-search-open' + (SITE.isHere("cerca.html") ? ' class="is-active"' : "") + ">" + SITE.icon(I.search) + "<span>Cerca</span></button>" +
    '<a href="' + SITE.url("ripasso.html") + '"' + (SITE.isHere("ripasso.html") ? ' class="is-active"' : "") + ">" + SITE.icon(I.cards) + "<span>Ripasso</span></a>";

  /* ---------- Contenitore ---------- */
  var shell = document.createElement("div");
  shell.className = "shell";
  var pageWrap = document.createElement("div");
  pageWrap.className = "page";
  var grid = document.createElement("div");
  grid.className = "page-grid";

  if (subject) {
    var crumbs = '<nav class="breadcrumb" aria-label="Percorso"><a href="' + SITE.url("index.html") + '">Home</a><span aria-hidden="true">/</span>' +
      (page && !page.isIndex
        ? '<a href="' + SITE.url(subject.pages[0].path) + '">' + SITE.escape(subject.name) + "</a>"
        : "<span>" + SITE.escape(subject.name) + "</span>") +
      "</nav>";
    pageWrap.insertAdjacentHTML("beforeend", crumbs);
  }

  main.parentNode.insertBefore(topbar, main);
  main.parentNode.insertBefore(shell, main);
  shell.appendChild(sidebar);
  shell.appendChild(scrim);
  shell.appendChild(pageWrap);
  pageWrap.appendChild(grid);
  grid.appendChild(main);
  document.body.appendChild(tabbar);

  var footer = document.createElement("footer");
  footer.className = "site-footer";
  footer.innerHTML = "<span>" + SITE.escape(SITE.title) + " — " + SITE.escape(SITE.tagline) + "</span>" +
    '<a href="' + SITE.url("componenti.html") + '">Componenti per le pagine</a>';
  pageWrap.appendChild(footer);

  /* ---------- Pagina argomento: tipo, stato e pulsante "studiato" ---------- */
  if (page && !page.isIndex) {
    SITE.recent.add(page);
    var h1 = main.querySelector("h1");
    var meta = document.createElement("div");
    meta.className = "page-meta";
    meta.innerHTML = (page.type ? '<span class="badge badge-' + page.type + '">' + SITE.escape(SITE.pageTypes[page.type] || page.type) + "</span>" : "") +
      '<button type="button" class="status-pill" data-toggle-done></button>';
    if (h1) h1.parentNode.insertBefore(meta, h1);

    var end = document.createElement("section");
    end.className = "page-end";
    end.setAttribute("data-search-ignore", "");
    end.innerHTML = '<p class="hand">Finito di studiare?</p><button type="button" class="btn btn-done" data-toggle-done></button>';
    main.appendChild(end);

    var paint = function () {
      var done = SITE.progress.isDone(page.path);
      main.querySelectorAll("[data-toggle-done]").forEach(function (b) {
        b.classList.toggle("is-done", done);
        b.setAttribute("aria-pressed", String(done));
        b.innerHTML = b.classList.contains("status-pill")
          ? (done ? SITE.icon(I.check) + "Studiato" : "Da studiare")
          : (done ? SITE.icon(I.check) + "Studiato — tocca per annullare" : "Segna come studiato");
      });
    };
    paint();
    main.addEventListener("click", function (e) {
      if (!e.target.closest("[data-toggle-done]")) return;
      SITE.progress.set(page.path, !SITE.progress.isDone(page.path));
      paint();
      renderSidebar();
    });
  }

  /* ---------- Panoramica materia: progresso + elenco argomenti ---------- */
  var list = main.querySelector("[data-subject-pages]");
  function renderTopics() {
    if (!list || !subject) return;
    var topics = SITE.topics(subject);
    var done = SITE.progress.all();
    if (!topics.length) {
      list.innerHTML = '<div class="empty"><p class="hand">Pagina ancora bianca.</p><p>Gli argomenti di ' +
        SITE.escape(subject.name) + " compariranno qui appena verranno aggiunti.</p></div>";
      return;
    }
    list.innerHTML = '<ol class="topic-list">' + topics.map(function (p) {
      return '<li><a class="topic' + (done[p.path] ? " is-done" : "") + '" href="' + SITE.url(p.path) + '">' +
        '<span class="check" aria-hidden="true">' + (done[p.path] ? SITE.icon(I.check) : "") + "</span>" +
        '<span class="topic-title">' + SITE.escape(p.title) + "</span>" +
        (p.type ? '<span class="badge badge-' + p.type + '">' + SITE.escape(SITE.pageTypes[p.type] || p.type) + "</span>" : "") +
        "</a></li>";
    }).join("") + "</ol>";
  }
  renderTopics();

  var prog = main.querySelector("[data-subject-progress]");
  function renderProgress() {
    if (!prog || !subject) return;
    var c = SITE.progress.count(subject);
    prog.innerHTML = c.total ? progressBar(c) : "";
  }
  renderProgress();

  function progressBar(c) {
    var pct = c.total ? Math.round((c.done / c.total) * 100) : 0;
    return '<div class="progress" role="img" aria-label="' + c.done + " argomenti studiati su " + c.total + '">' +
      '<span class="progress-track"><span class="progress-fill" style="width:' + pct + '%"></span></span>' +
      '<span class="progress-text">' + c.done + "/" + c.total + "</span></div>";
  }

  /* ---------- Home: materie e "Riprendi da qui" ---------- */
  var cards = main.querySelector("[data-subject-grid]");
  if (cards) {
    cards.innerHTML = SITE.subjects.map(function (s) {
      var c = SITE.progress.count(s);
      return '<a class="subject-row" href="' + SITE.url(s.pages[0].path) + '" style="--c:' + s.color + '">' +
        '<span class="subject-tab" aria-hidden="true">' + SITE.escape(s.short) + "</span>" +
        '<span class="subject-text"><span class="subject-name">' + SITE.escape(s.name) + "</span>" +
        '<span class="subject-desc">' + SITE.escape(s.description) + "</span></span>" +
        '<span class="subject-side">' + (c.total ? progressBar(c) : '<span class="muted-small">nessun argomento</span>') + "</span>" +
        "</a>";
    }).join("");
  }

  var recentBox = main.querySelector("[data-recent]");
  if (recentBox) {
    var byPath = {};
    SITE.allPages().forEach(function (p) { byPath[p.path] = p; });
    var rec = SITE.recent.list().filter(function (r) { return byPath[r.path]; }).slice(0, 4);
    if (rec.length) {
      recentBox.hidden = false;
      recentBox.querySelector("[data-recent-list]").innerHTML = rec.map(function (r) {
        var p = byPath[r.path];
        return '<a class="recent-item" href="' + SITE.url(p.path) + '" style="--c:' + p.subject.color + '">' +
          '<span class="recent-subject">' + SITE.escape(p.subject.name) + "</span>" +
          '<span class="recent-title">' + SITE.escape(p.title) + "</span>" +
          (SITE.progress.isDone(p.path) ? '<span class="recent-done">' + SITE.icon(I.check) + "studiato</span>" : "") + "</a>";
      }).join("");
    }
  }

  var dateEl = main.querySelector("[data-today]");
  if (dateEl) {
    try {
      dateEl.textContent = new Date().toLocaleDateString("it-IT", { weekday: "long", day: "numeric", month: "long" });
    } catch (e) { dateEl.remove(); }
  }

  /* ---------- Titoli con id + indice della pagina ---------- */
  var used = {};
  var heads = main.querySelectorAll("h2, h3");
  heads.forEach(function (h) {
    if (!h.id) {
      var id = SITE.slug(h.textContent), base = id, k = 2;
      while (used[id] || document.getElementById(id)) id = base + "-" + k++;
      h.id = id;
    }
    used[h.id] = true;
  });
  var tocItems = Array.prototype.filter.call(heads, function (h) { return !h.closest("[data-search-ignore]"); });
  if (html.getAttribute("data-toc") !== "off" && tocItems.length >= 2) {
    var tocList = "<ul>" + tocItems.map(function (h) {
      return '<li class="toc-' + h.tagName.toLowerCase() + '"><a href="#' + h.id + '">' + SITE.escape(h.textContent) + "</a></li>";
    }).join("") + "</ul>";

    var toc = document.createElement("aside");
    toc.className = "toc";
    toc.innerHTML = '<p class="toc-title">In questa pagina</p>' + tocList;
    grid.appendChild(toc);
    grid.classList.add("has-toc");

    // Su telefono: indice richiudibile sotto il titolo
    var mToc = document.createElement("details");
    mToc.className = "toc-mobile";
    mToc.setAttribute("data-search-ignore", "");
    mToc.innerHTML = "<summary>" + SITE.icon(I.list) + "Indice della pagina</summary>" + tocList;
    var anchor = main.querySelector("h1");
    var after = anchor && anchor.nextElementSibling && anchor.nextElementSibling.classList.contains("lead") ? anchor.nextElementSibling : anchor;
    if (after) after.parentNode.insertBefore(mToc, after.nextSibling);
    mToc.addEventListener("click", function (e) { if (e.target.closest("a")) mToc.open = false; });

    if ("IntersectionObserver" in window) {
      var links = toc.querySelectorAll("a");
      var obs = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (!e.isIntersecting) return;
          links.forEach(function (a) { a.classList.toggle("is-active", a.getAttribute("href") === "#" + e.target.id); });
        });
      }, { rootMargin: "-80px 0px -70% 0px" });
      tocItems.forEach(function (h) { obs.observe(h); });
    }
  }

  /* ---------- Menu a scomparsa ---------- */
  var menuBtn = topbar.querySelector(".menu-btn");
  function setMenu(open) {
    document.body.classList.toggle("menu-open", open);
    menuBtn.setAttribute("aria-expanded", String(open));
  }
  document.addEventListener("click", function (e) {
    if (e.target.closest(".menu-btn, [data-open-menu]")) setMenu(!document.body.classList.contains("menu-open"));
    else if (e.target.closest("[data-close-menu]") || e.target === scrim) setMenu(false);
  });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape") setMenu(false); });

  /* ---------- Tema: quaderno (chiaro) / lavagna (scuro) ---------- */
  topbar.querySelector(".theme-btn").addEventListener("click", function () {
    var cur = html.getAttribute("data-theme") || (matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
    var next = cur === "dark" ? "light" : "dark";
    html.setAttribute("data-theme", next);
    SITE.store.set("theme", next);
  });

  document.addEventListener("progress-change", function () { renderTopics(); renderProgress(); });
  document.body.classList.add("is-ready");
});
