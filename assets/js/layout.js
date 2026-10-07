/*
 * layout.js — struttura comune a tutte le pagine.
 * Barra superiore, menu delle materie (laterale su computer, a scomparsa su telefono),
 * barra di navigazione in basso su telefono, percorso, indice della pagina,
 * progressi ("studiato"), copertine delle materie in home, capitoli della materia,
 * pagina Riassunti e piccole animazioni.
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
  var motion = !(window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches);

  var I = SITE.icons = {
    menu: '<path d="M4 7h16M4 12h16M4 17h10"/>',
    search: '<circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>',
    home: '<path d="m3 10 9-7 9 7v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><path d="M9 22V12h6v10"/>',
    book: '<path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20V3H6.5A2.5 2.5 0 0 0 4 5.5z"/><path d="M4 19.5A2.5 2.5 0 0 0 6.5 22H20v-5"/>',
    notes: '<path d="M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"/><path d="M14 3v6h6"/><path d="M8 13h8M8 17h5"/>',
    cards: '<rect x="3" y="6" width="14" height="14" rx="2"/><path d="M7 2h12a2 2 0 0 1 2 2v12"/>',
    chevron: '<path d="m9 18 6-6-6-6"/>',
    arrow: '<path d="M5 12h14M13 6l6 6-6 6"/>',
    check: '<path d="M20 6 9 17l-5-5"/>',
    close: '<path d="M18 6 6 18M6 6l12 12"/>',
    copy: '<rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>',
    list: '<path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01"/>',
  };
  var isMac = /Mac|iPhone|iPad/.test(navigator.platform || navigator.userAgent);

  /* ---------- Riassunti: utilità ---------- */
  function summaryOf(path) { return (SITE.riassunti || {})[path] || null; }
  function summaryId(path) { return SITE.slug(path.replace(/^materie\//, "").replace(/\.html$/, "")); }
  function summaryUrl(path) { return SITE.url("riassunti.html") + "#" + summaryId(path); }
  function plural(n, one, many) { return n + " " + (n === 1 ? one : many); }

  /* ---------- Barra superiore ---------- */
  var onHome = SITE.isHere("index.html"), onSum = SITE.isHere("riassunti.html");
  var topbar = document.createElement("header");
  topbar.className = "topbar";
  topbar.innerHTML =
    '<a class="brand" href="' + SITE.url("index.html") + '"><span class="brand-mark" aria-hidden="true"></span>' +
      '<span class="brand-name">' + SITE.escape(SITE.title) + "</span></a>" +
    '<nav class="top-nav" aria-label="Sezioni">' +
      '<a class="top-link' + (onHome || subject ? " is-active" : "") + '" href="' + SITE.url("index.html") + '">Materie</a>' +
      '<a class="top-link' + (onSum ? " is-active" : "") + '" href="' + SITE.url("riassunti.html") + '">Riassunti</a>' +
      (SITE.features.ripasso ? '<a class="top-link' + (SITE.isHere("ripasso.html") ? " is-active" : "") + '" href="' + SITE.url("ripasso.html") + '">Ripasso</a>' : "") +
    "</nav>" +
    '<button class="search-trigger" type="button" data-search-open>' + SITE.icon(I.search) +
      '<span class="search-trigger-label">Cerca negli appunti</span><kbd>' + (isMac ? "⌘" : "Ctrl") + " K</kbd></button>" +
    '<button class="icon-btn search-icon" type="button" data-search-open aria-label="Cerca">' + SITE.icon(I.search) + "</button>";

  /* ---------- Menu materie ---------- */
  var sidebar = document.createElement("aside");
  sidebar.className = "sidebar";
  sidebar.id = "sidebar";

  function renderSidebar() {
    var done = SITE.progress.all();
    var out = '<div class="sheet-head"><span>Materie</span><button class="icon-btn" type="button" data-close-menu aria-label="Chiudi">' +
      SITE.icon(I.close) + "</button></div><nav aria-label=\"Materie\"><ul class=\"side-list\">";
    SITE.subjects.forEach(function (s, i) {
      var open = subject && s.id === subject.id;
      var c = SITE.progress.count(s);
      out += '<li class="side-subject' + (open ? " is-open" : "") + '" style="--c:' + s.color + ";--i:" + i + '">' +
        '<a class="side-link' + (SITE.isHere(s.pages[0].path) ? " is-active" : "") + '" href="' + SITE.url(s.pages[0].path) + '">' +
        '<span class="tab" aria-hidden="true"></span><span class="side-name">' + SITE.escape(s.name) + "</span>" +
        (c.total ? '<span class="side-count" title="Capitoli studiati">' + c.done + "/" + c.total + "</span>" : "") + "</a>";
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
  function tab(tag, attrs, active, icon, label) {
    return "<" + tag + " " + attrs + (active ? ' class="is-active"' : "") + ">" + SITE.icon(icon) + "<span>" + label + "</span></" + tag + ">";
  }
  tabbar.innerHTML =
    tab("a", 'href="' + SITE.url("index.html") + '"', onHome, I.home, "Home") +
    tab("button", 'type="button" data-open-menu', !!subject, I.book, "Materie") +
    tab("a", 'href="' + SITE.url("riassunti.html") + '"', onSum, I.notes, "Riassunti") +
    tab("button", 'type="button" data-search-open', SITE.isHere("cerca.html"), I.search, "Cerca") +
    (SITE.features.ripasso ? tab("a", 'href="' + SITE.url("ripasso.html") + '"', SITE.isHere("ripasso.html"), I.cards, "Ripasso") : "");

  // Blocchi legati a funzioni disattivate
  document.querySelectorAll("[data-feature]").forEach(function (el) {
    if (!SITE.features[el.getAttribute("data-feature")]) el.remove();
  });

  /* ---------- Contenitore ---------- */
  var shell = document.createElement("div");
  shell.className = "shell";
  var pageWrap = document.createElement("div");
  pageWrap.className = "page";
  var grid = document.createElement("div");
  grid.className = "page-grid";

  if (subject) {
    var crumbs = '<nav class="breadcrumb" aria-label="Percorso"><a href="' + SITE.url("index.html") + '">Materie</a><span aria-hidden="true">›</span>' +
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

  /* ---------- Pagina argomento: tipo, stato, "studiato" e capitolo successivo ---------- */
  if (page && !page.isIndex) {
    SITE.recent.add(page);
    var sum = summaryOf(page.path);
    var topics = SITE.topics(page.subject);
    var pos = topics.map(function (t) { return t.path; }).indexOf(page.path);
    var next = topics[pos + 1];

    var h1 = main.querySelector("h1");
    var meta = document.createElement("div");
    meta.className = "page-meta";
    meta.innerHTML = (pos >= 0 ? '<span class="chapter-tag">Capitolo ' + (pos + 1) + "</span>" : "") +
      (page.type ? '<span class="badge badge-' + page.type + '">' + SITE.escape(SITE.pageTypes[page.type] || page.type) + "</span>" : "") +
      '<button type="button" class="status-pill" data-toggle-done></button>' +
      (sum ? '<a class="meta-link" href="' + summaryUrl(page.path) + '">' + SITE.icon(I.notes) + "Riassunto</a>" : "");
    if (h1) h1.parentNode.insertBefore(meta, h1);

    var end = document.createElement("section");
    end.className = "page-end";
    end.setAttribute("data-search-ignore", "");
    end.innerHTML = '<div class="page-end-done"><p class="hand">Finito di studiare?</p><button type="button" class="btn btn-done" data-toggle-done></button></div>' +
      '<div class="page-end-links">' +
        (sum ? '<a class="end-link" href="' + summaryUrl(page.path) + '"><span>Ripassa</span><strong>Riassunto del capitolo</strong>' + SITE.icon(I.arrow) + "</a>" : "") +
        (next ? '<a class="end-link end-next" href="' + SITE.url(next.path) + '"><span>Capitolo successivo</span><strong>' + SITE.escape(next.title) + "</strong>" + SITE.icon(I.arrow) + "</a>"
              : '<a class="end-link end-next" href="' + SITE.url(page.subject.pages[0].path) + '"><span>Hai finito i capitoli</span><strong>Torna a ' + SITE.escape(page.subject.name) + "</strong>" + SITE.icon(I.arrow) + "</a>") +
      "</div>";
    main.appendChild(end);

    var paint = function () {
      var done = SITE.progress.isDone(page.path);
      main.querySelectorAll("[data-toggle-done]").forEach(function (b) {
        b.classList.toggle("is-done", done);
        b.setAttribute("aria-pressed", String(done));
        b.innerHTML = b.classList.contains("status-pill")
          ? (done ? SITE.icon(I.check) + "Studiato" : "Da studiare")
          : (done ? SITE.icon(I.check) + "Studiato" : "Segna come studiato");
      });
    };
    paint();
    main.addEventListener("click", function (e) {
      var btn = e.target.closest("[data-toggle-done]");
      if (!btn) return;
      var now = !SITE.progress.isDone(page.path);
      SITE.progress.set(page.path, now);
      paint();
      renderSidebar();
      if (now && motion) {
        main.querySelectorAll("[data-toggle-done]").forEach(function (b) {
          b.classList.remove("just-done");
          void b.offsetWidth; // riparte l'animazione
          b.classList.add("just-done");
        });
      }
    });
  }

  /* ---------- Panoramica materia: progresso + capitoli ---------- */
  var list = main.querySelector("[data-subject-pages]");
  function renderTopics() {
    if (!list || !subject) return;
    var topics = SITE.topics(subject);
    var done = SITE.progress.all();
    if (!topics.length) {
      list.innerHTML = '<div class="empty"><p class="hand">Quaderno ancora bianco.</p><p>I capitoli di ' +
        SITE.escape(subject.name) + " compariranno qui appena verranno aggiunti.</p></div>";
      return;
    }
    list.innerHTML = '<ol class="chapters">' + topics.map(function (p, i) {
      var s = summaryOf(p.path);
      var parts = s ? s.sezioni : [];
      var info = [SITE.pageTypes[p.type] || p.type, parts.length ? plural(parts.length, "paragrafo", "paragrafi") : ""].filter(Boolean).join(" · ");
      return '<li class="chapter' + (done[p.path] ? " is-done" : "") + '" style="--i:' + i + '">' +
        '<a class="chapter-main" href="' + SITE.url(p.path) + '">' +
          '<span class="chapter-num" aria-hidden="true">' + (i + 1) + "</span>" +
          '<span class="chapter-text"><span class="chapter-title">' + SITE.escape(p.title) + "</span>" +
            (s ? '<span class="chapter-desc">' + SITE.escape(s.breve) + "</span>" : "") +
            '<span class="chapter-info">' + SITE.escape(info) + (done[p.path] ? ' · <span class="chapter-ok">' + SITE.icon(I.check) + "studiato</span>" : "") + "</span></span>" +
          '<span class="chapter-go" aria-hidden="true">' + SITE.icon(I.chevron) + "</span>" +
        "</a>" +
        (parts.length ? '<div class="chapter-foot">' +
          '<details class="chapter-parts"><summary>Paragrafi</summary><ol>' + parts.map(function (x) {
            return '<li><a href="' + SITE.url(p.path) + "#" + SITE.slug(x.titolo) + '">' + SITE.escape(x.titolo) + "</a></li>";
          }).join("") + "</ol></details>" +
          '<a class="chapter-sum" href="' + summaryUrl(p.path) + '">' + SITE.icon(I.notes) + "Riassunto</a>" +
        "</div>" : "") +
        "</li>";
    }).join("") + "</ol>";
  }
  renderTopics();

  var prog = main.querySelector("[data-subject-progress]");
  function renderProgress() {
    if (!prog || !subject) return;
    var c = SITE.progress.count(subject);
    prog.innerHTML = c.total ? progressBar(c, true) : "";
  }
  renderProgress();

  function progressBar(c, withText) {
    var pct = c.total ? Math.round((c.done / c.total) * 100) : 0;
    return '<div class="progress" role="img" aria-label="' + c.done + " capitoli studiati su " + c.total + '">' +
      '<span class="progress-track"><span class="progress-fill" style="width:' + pct + '%"></span></span>' +
      (withText ? '<span class="progress-text">' + c.done + " di " + c.total + " studiati</span>" : "") + "</div>";
  }

  /* ---------- Home: copertine delle materie e "Riprendi" ---------- */
  var covers = main.querySelector("[data-subject-grid]");
  if (covers) {
    covers.innerHTML = SITE.subjects.map(function (s, i) {
      var c = SITE.progress.count(s);
      return '<a class="cover" href="' + SITE.url(s.pages[0].path) + '" style="--c:' + s.color + ";--i:" + i + '">' +
        '<span class="cover-label">' +
          '<span class="cover-name">' + SITE.escape(s.name) + "</span>" +
          '<span class="cover-desc">' + SITE.escape(s.description) + "</span>" +
          '<span class="cover-meta">' + (c.total ? plural(c.total, "capitolo", "capitoli") + (c.done ? " · " + c.done + " studiat" + (c.done === 1 ? "o" : "i") : "") : "ancora vuoto") + "</span>" +
          (c.total ? progressBar(c, false) : "") +
        "</span></a>";
    }).join("");
  }

  var recentBox = main.querySelector("[data-recent]");
  if (recentBox) {
    var byPath = {};
    SITE.allPages().forEach(function (p) { byPath[p.path] = p; });
    var last = SITE.recent.list().filter(function (r) { return byPath[r.path] && !byPath[r.path].isIndex; })[0];
    if (last) {
      var lp = byPath[last.path];
      recentBox.hidden = false;
      recentBox.innerHTML = '<a class="continue" href="' + SITE.url(lp.path) + '" style="--c:' + lp.subject.color + '">' +
        '<span class="continue-label">Riprendi da qui</span>' +
        '<span class="continue-title"><span class="continue-subject">' + SITE.escape(lp.subject.name) + "</span>" + SITE.escape(lp.title) + "</span>" +
        SITE.icon(I.arrow) + "</a>";
    }
  }

  /* ---------- Pagina Riassunti ---------- */
  var sumRoot = main.querySelector("[data-riassunti]");
  if (sumRoot) {
    var sumList = sumRoot.querySelector("[data-sum-list]");
    var sumFilters = sumRoot.querySelector("[data-sum-filters]");
    var groups = SITE.subjects.map(function (s) {
      return { subject: s, chapters: SITE.topics(s).filter(function (p) { return summaryOf(p.path); }) };
    }).filter(function (g) { return g.chapters.length; });

    sumFilters.innerHTML = '<button type="button" class="chip" data-m="" aria-pressed="true">Tutte</button>' +
      groups.map(function (g) {
        return '<button type="button" class="chip" data-m="' + g.subject.id + '" style="--c:' + g.subject.color + '" aria-pressed="false">' +
          SITE.escape(g.subject.name) + ' <span class="chip-n">' + g.chapters.length + "</span></button>";
      }).join("");

    sumList.innerHTML = groups.length ? groups.map(function (g) {
      return '<section class="sum-subject" data-m="' + g.subject.id + '" style="--c:' + g.subject.color + '">' +
        '<h2 class="sum-subject-title" data-search-ignore><span class="tab" aria-hidden="true"></span>' + SITE.escape(g.subject.name) + "</h2>" +
        g.chapters.map(function (p) {
          var s = summaryOf(p.path);
          var n = SITE.topics(g.subject).map(function (t) { return t.path; }).indexOf(p.path) + 1;
          return '<details class="sum-chapter" id="' + summaryId(p.path) + '">' +
            '<summary><span class="sum-num" aria-hidden="true">' + n + "</span>" +
              '<span class="sum-head"><span class="sum-title">' + SITE.escape(p.title) + "</span>" +
              '<span class="sum-breve">' + SITE.escape(s.breve) + "</span>" +
              '<span class="sum-info">' + plural(s.sezioni.length, "paragrafo", "paragrafi") + "</span></span>" +
              '<span class="sum-toggle" aria-hidden="true">' + SITE.icon(I.chevron) + "</span></summary>" +
            '<div class="sum-body"><ol class="sum-cards">' + s.sezioni.map(function (x, k) {
              return '<li class="sum-card" style="--i:' + k + '">' +
                '<p class="sum-card-title"><span>' + (k + 1) + "</span>" + SITE.escape(x.titolo) + "</p>" +
                "<ul>" + x.punti.map(function (t) { return "<li>" + t + "</li>"; }).join("") + "</ul>" +
                '<a class="sum-card-link" href="' + SITE.url(p.path) + "#" + SITE.slug(x.titolo) + '">Rileggi il paragrafo' + SITE.icon(I.arrow) + "</a>" +
                "</li>";
            }).join("") + "</ol>" +
            '<a class="btn btn-ghost" href="' + SITE.url(p.path) + '">Apri il capitolo' + SITE.icon(I.arrow) + "</a></div>" +
            "</details>";
        }).join("") + "</section>";
    }).join("") : '<div class="empty"><p class="hand">Ancora nessun riassunto.</p><p>Si aggiungono in <code>assets/js/riassunti.js</code>.</p></div>';

    var setFilter = function (m) {
      sumFilters.querySelectorAll(".chip").forEach(function (c) { c.setAttribute("aria-pressed", String(c.getAttribute("data-m") === m)); });
      sumList.querySelectorAll(".sum-subject").forEach(function (sec) { sec.hidden = !!m && sec.getAttribute("data-m") !== m; });
    };
    sumFilters.addEventListener("click", function (e) {
      var c = e.target.closest(".chip");
      if (c) setFilter(c.getAttribute("data-m"));
    });
    var openFromHash = function () {
      var target = location.hash && document.getElementById(decodeURIComponent(location.hash.slice(1)));
      if (!target || !target.classList.contains("sum-chapter")) return;
      setFilter("");
      target.open = true;
      setTimeout(function () { target.scrollIntoView({ block: "start", behavior: motion ? "smooth" : "auto" }); }, 60);
    };
    openFromHash();
    window.addEventListener("hashchange", openFromHash);
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
  // Gli id dei titoli nascono adesso: se l'indirizzo punta a un paragrafo, ci si va qui.
  var hashTarget = !sumRoot && location.hash && document.getElementById(decodeURIComponent(location.hash.slice(1)));
  if (hashTarget) {
    hashTarget.scrollIntoView();
    // font e schemi cambiano l'altezza della pagina: si riallinea, se nel frattempo non hai scrollato
    var settled = window.scrollY;
    var realign = function () {
      if (Math.abs(window.scrollY - settled) > 2) return;
      hashTarget.scrollIntoView();
      settled = window.scrollY;
    };
    window.addEventListener("load", realign);
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(realign);
  }
  var tocItems = Array.prototype.filter.call(heads, function (h) { return !h.closest("[data-search-ignore]"); });
  if (html.getAttribute("data-toc") !== "off" && tocItems.length >= 2) {
    var tocList = "<ul>" + tocItems.map(function (h) {
      return '<li class="toc-' + h.tagName.toLowerCase() + '"><a href="#' + h.id + '">' + SITE.escape(h.textContent) + "</a></li>";
    }).join("") + "</ul>";

    var toc = document.createElement("aside");
    toc.className = "toc";
    toc.innerHTML = '<p class="toc-title">In questa pagina</p><div class="toc-track">' + tocList + '<span class="toc-marker" aria-hidden="true"></span></div>';
    grid.appendChild(toc);
    grid.classList.add("has-toc");

    // Su telefono: indice richiudibile sotto il titolo
    var mToc = document.createElement("details");
    mToc.className = "toc-mobile";
    mToc.setAttribute("data-search-ignore", "");
    mToc.innerHTML = "<summary>" + SITE.icon(I.list) + "Indice del capitolo</summary>" + tocList;
    var anchor = main.querySelector("h1");
    var after = anchor && anchor.nextElementSibling && anchor.nextElementSibling.classList.contains("lead") ? anchor.nextElementSibling : anchor;
    if (after) after.parentNode.insertBefore(mToc, after.nextSibling);
    mToc.addEventListener("click", function (e) { if (e.target.closest("a")) mToc.open = false; });

    if ("IntersectionObserver" in window) {
      var links = toc.querySelectorAll("a");
      var marker = toc.querySelector(".toc-marker");
      var obs = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (!e.isIntersecting) return;
          links.forEach(function (a) {
            var on = a.getAttribute("href") === "#" + e.target.id;
            a.classList.toggle("is-active", on);
            if (on) {
              marker.style.transform = "translateY(" + a.offsetTop + "px)";
              marker.style.height = a.offsetHeight + "px";
              marker.classList.add("is-on");
            }
          });
        });
      }, { rootMargin: "-80px 0px -70% 0px" });
      tocItems.forEach(function (h) { obs.observe(h); });
    }
  }

  /* ---------- Menu a scomparsa ---------- */
  function setMenu(open) {
    document.body.classList.toggle("menu-open", open);
    tabbar.querySelectorAll("[data-open-menu]").forEach(function (b) { b.setAttribute("aria-expanded", String(open)); });
  }
  document.addEventListener("click", function (e) {
    if (e.target.closest("[data-open-menu]")) setMenu(!document.body.classList.contains("menu-open"));
    else if (e.target.closest("[data-close-menu]") || e.target === scrim) setMenu(false);
  });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape") setMenu(false); });

  document.addEventListener("progress-change", function () { renderTopics(); renderProgress(); });
  document.body.classList.add("is-ready");

  /* ---------- Blocchi che compaiono scorrendo ---------- */
  // Solo quelli fuori dallo schermo all'apertura, così niente "lampeggia".
  if (motion && "IntersectionObserver" in window) {
    var reveal = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        e.target.classList.add("in");
        reveal.unobserve(e.target);
      });
    }, { rootMargin: "0px 0px -6% 0px" });
    var sel = "h2, .callout, .compare, figure, .table-wrap, pre, .cards, .stack, .timeline, .esercizio, .anatomy, .page-end";
    var fold = window.innerHeight;
    main.querySelectorAll(sel).forEach(function (el) {
      if (el.closest(".rv, details:not([open]), .toc-mobile, [data-riassunti]")) return;
      if (el.getBoundingClientRect().top < fold) return;
      el.classList.add("rv");
      reveal.observe(el);
    });
  }
});
