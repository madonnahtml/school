/*
 * layout.js — costruisce la struttura comune a tutte le pagine:
 * barra superiore, menu laterale delle materie, breadcrumb, indice "In questa pagina",
 * pulsante copia per i blocchi di codice, elenco argomenti della materia.
 *
 * Ogni pagina contiene solo il proprio <main id="content">: il resto lo genera questo file.
 */
(function () {
  "use strict";
  var SITE = window.SITE;
  var html = document.documentElement;
  var subjectId = html.getAttribute("data-subject");
  var subject = SITE.subject(subjectId);
  var here = location.href.split(/[?#]/)[0].replace(/index\.html$/, "");

  function samePage(path) {
    return SITE.url(path).replace(/index\.html$/, "") === here;
  }

  var I = {
    menu: '<path d="M4 6h16M4 12h16M4 18h16"/>',
    search: '<circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/>',
    sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>',
    moon: '<path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/>',
    home: '<path d="m3 10 9-7 9 7v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><path d="M9 22V12h6v10"/>',
    chevron: '<path d="m9 18 6-6-6-6"/>',
    copy: '<rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>',
    check: '<path d="M20 6 9 17l-5-5"/>',
    logo: '<path d="M22 10 12 5 2 10l10 5 10-5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/>',
  };
  SITE.icons = I;

  var main = document.getElementById("content");
  if (!main) return;

  /* ---------- Barra superiore ---------- */
  var isMac = /Mac|iPhone|iPad/.test(navigator.platform || navigator.userAgent);
  var topbar = document.createElement("header");
  topbar.className = "topbar";
  topbar.innerHTML =
    '<button class="icon-btn menu-btn" type="button" aria-label="Apri menu" aria-expanded="false">' + SITE.icon(I.menu) + "</button>" +
    '<a class="brand" href="' + SITE.url("index.html") + '">' +
      '<span class="brand-mark">' + SITE.icon(I.logo) + "</span>" +
      '<span class="brand-name">' + SITE.escape(SITE.title) + "</span>" +
    "</a>" +
    '<button class="search-trigger" type="button" data-search-open aria-label="Cerca nel sito">' +
      SITE.icon(I.search) + '<span class="search-trigger-label">Cerca negli appunti…</span>' +
      '<kbd>' + (isMac ? "⌘" : "Ctrl") + " K</kbd>" +
    "</button>" +
    '<button class="icon-btn theme-btn" type="button" aria-label="Cambia tema">' +
      SITE.icon(I.sun, "icon icon-sun") + SITE.icon(I.moon, "icon icon-moon") +
    "</button>";

  /* ---------- Menu laterale ---------- */
  var sidebar = document.createElement("aside");
  sidebar.className = "sidebar";
  sidebar.id = "sidebar";
  var nav = '<nav aria-label="Materie"><a class="side-link side-home' + (samePage("index.html") ? " is-active" : "") +
    '" href="' + SITE.url("index.html") + '">' + SITE.icon(I.home) + "<span>Home</span></a>" +
    '<p class="side-heading">Materie</p><ul class="side-list">';
  SITE.subjects.forEach(function (s) {
    var open = s.id === subjectId;
    nav += '<li class="side-subject' + (open ? " is-open" : "") + '" style="--c:' + s.color + '">' +
      '<a class="side-link' + (samePage(s.pages[0].path) ? " is-active" : "") + '" href="' + SITE.url(s.pages[0].path) + '">' +
      '<span class="side-icon">' + SITE.icon(s.icon) + "</span><span>" + SITE.escape(s.name) + "</span>" +
      '<span class="side-count">' + (s.pages.length - 1 || "") + "</span></a>";
    if (open && s.pages.length > 1) {
      nav += '<ul class="side-pages">';
      s.pages.slice(1).forEach(function (p) {
        nav += '<li><a class="' + (samePage(p.path) ? "is-active" : "") + '" href="' + SITE.url(p.path) + '">' +
          SITE.escape(p.title) + "</a></li>";
      });
      nav += "</ul>";
    }
    nav += "</li>";
  });
  nav += "</ul></nav>";
  sidebar.innerHTML = nav;

  var scrim = document.createElement("div");
  scrim.className = "scrim";

  /* ---------- Contenitore pagina ---------- */
  var shell = document.createElement("div");
  shell.className = "shell";
  var pageWrap = document.createElement("div");
  pageWrap.className = "page";
  var grid = document.createElement("div");
  grid.className = "page-grid";

  // Breadcrumb
  if (subject) {
    var crumbs = '<nav class="breadcrumb" aria-label="Percorso"><a href="' + SITE.url("index.html") + '">Home</a>' +
      SITE.icon(I.chevron) + '<a href="' + SITE.url(subject.pages[0].path) + '">' + SITE.escape(subject.name) + "</a>";
    subject.pages.slice(1).forEach(function (p) {
      if (samePage(p.path)) crumbs += SITE.icon(I.chevron) + "<span>" + SITE.escape(p.title) + "</span>";
    });
    crumbs += "</nav>";
    pageWrap.insertAdjacentHTML("beforeend", crumbs);
  }

  main.parentNode.insertBefore(topbar, main);
  main.parentNode.insertBefore(shell, main);
  shell.appendChild(sidebar);
  shell.appendChild(scrim);
  shell.appendChild(pageWrap);
  pageWrap.appendChild(grid);
  grid.appendChild(main);

  var footer = document.createElement("footer");
  footer.className = "site-footer";
  footer.innerHTML = "<span>" + SITE.escape(SITE.title) + " · " + SITE.escape(SITE.tagline) + '</span><a href="' +
    SITE.url("componenti.html") + '">Componenti</a>';
  pageWrap.appendChild(footer);

  /* ---------- Icona nell'intestazione della materia ---------- */
  var headIcon = main.querySelector(".subject-header .subject-icon");
  if (headIcon && subject && !headIcon.innerHTML.trim()) headIcon.innerHTML = SITE.icon(subject.icon);

  /* ---------- Elenco argomenti della materia (pagine panoramica) ---------- */
  var list = main.querySelector("[data-subject-pages]");
  if (list && subject) {
    var pages = subject.pages.slice(1);
    if (!pages.length) {
      list.innerHTML = '<div class="empty">' + SITE.icon(subject.icon) +
        "<p><strong>Ancora nessun argomento.</strong><br>Le pagine di " + SITE.escape(subject.name) +
        " compariranno qui appena verranno aggiunte.</p></div>";
    } else {
      list.innerHTML = '<div class="topic-list">' + pages.map(function (p, i) {
        return '<a class="topic" href="' + SITE.url(p.path) + '"><span class="topic-num">' + String(i + 1).padStart(2, "0") +
          '</span><span class="topic-title">' + SITE.escape(p.title) + "</span>" +
          (p.type ? '<span class="badge badge-' + p.type + '">' + SITE.escape(SITE.pageTypes[p.type] || p.type) + "</span>" : "") +
          SITE.icon(I.chevron) + "</a>";
      }).join("") + "</div>";
    }
  }

  /* ---------- Griglia materie (home) ---------- */
  var cards = main.querySelector("[data-subject-grid]");
  if (cards) {
    cards.innerHTML = SITE.subjects.map(function (s) {
      var n = s.pages.length - 1;
      return '<a class="subject-card" href="' + SITE.url(s.pages[0].path) + '" style="--c:' + s.color + '">' +
        '<span class="subject-icon">' + SITE.icon(s.icon) + "</span>" +
        "<h3>" + SITE.escape(s.name) + "</h3><p>" + SITE.escape(s.description) + "</p>" +
        '<div class="subject-meta"><span>' + (n === 1 ? "1 argomento" : n + " argomenti") + "</span>" +
        '<span class="chips">' + s.focus.map(function (f) { return "<span>" + SITE.escape(f) + "</span>"; }).join("") + "</span></div></a>";
    }).join("");
  }

  /* ---------- Id ai titoli + indice "In questa pagina" ---------- */
  var used = {};
  var heads = main.querySelectorAll("h2, h3");
  heads.forEach(function (h) {
    if (!h.id) {
      var id = SITE.slug(h.textContent);
      var base = id, k = 2;
      while (used[id] || document.getElementById(id)) id = base + "-" + k++;
      h.id = id;
    }
    used[h.id] = true;
  });
  if (html.getAttribute("data-toc") !== "off" && heads.length >= 2) {
    var toc = document.createElement("aside");
    toc.className = "toc";
    toc.innerHTML = '<p class="toc-title">In questa pagina</p><ul>' + Array.prototype.map.call(heads, function (h) {
      return '<li class="toc-' + h.tagName.toLowerCase() + '"><a href="#' + h.id + '">' + SITE.escape(h.textContent) + "</a></li>";
    }).join("") + "</ul>";
    grid.appendChild(toc);
    grid.classList.add("has-toc");

    if ("IntersectionObserver" in window) {
      var links = toc.querySelectorAll("a");
      var obs = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (!e.isIntersecting) return;
          links.forEach(function (a) { a.classList.toggle("is-active", a.getAttribute("href") === "#" + e.target.id); });
        });
      }, { rootMargin: "-70px 0px -70% 0px" });
      heads.forEach(function (h) { obs.observe(h); });
    }
  }

  /* ---------- Pulsante "copia" sui blocchi di codice ---------- */
  main.querySelectorAll("pre").forEach(function (pre) {
    var wrap = document.createElement("div");
    wrap.className = "code-block";
    var lang = pre.getAttribute("data-lang");
    pre.parentNode.insertBefore(wrap, pre);
    wrap.appendChild(pre);
    var bar = document.createElement("div");
    bar.className = "code-bar";
    bar.innerHTML = "<span>" + SITE.escape(lang || "codice") + '</span><button type="button" class="copy-btn">' +
      SITE.icon(I.copy) + "<span>Copia</span></button>";
    wrap.insertBefore(bar, pre);
    bar.querySelector("button").addEventListener("click", function () {
      var btn = this;
      var done = function () {
        btn.innerHTML = SITE.icon(I.check) + "<span>Copiato</span>";
        setTimeout(function () { btn.innerHTML = SITE.icon(I.copy) + "<span>Copia</span>"; }, 1500);
      };
      if (navigator.clipboard) navigator.clipboard.writeText(pre.innerText).then(done, function () {});
    });
  });

  /* ---------- Menu mobile ---------- */
  var menuBtn = topbar.querySelector(".menu-btn");
  function setMenu(open) {
    document.body.classList.toggle("menu-open", open);
    menuBtn.setAttribute("aria-expanded", String(open));
  }
  menuBtn.addEventListener("click", function () { setMenu(!document.body.classList.contains("menu-open")); });
  scrim.addEventListener("click", function () { setMenu(false); });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape") setMenu(false); });

  /* ---------- Tema chiaro / scuro ---------- */
  topbar.querySelector(".theme-btn").addEventListener("click", function () {
    var cur = html.getAttribute("data-theme") ||
      (matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
    var next = cur === "dark" ? "light" : "dark";
    html.setAttribute("data-theme", next);
    SITE.store.set("theme", next);
  });

  /* ---------- Esercizi: "mostra/nascondi tutte le soluzioni" ---------- */
  main.querySelectorAll("[data-toggle-solutions]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var sols = main.querySelectorAll("details.soluzione");
      var anyClosed = Array.prototype.some.call(sols, function (d) { return !d.open; });
      sols.forEach(function (d) { d.open = anyClosed; });
      btn.textContent = anyClosed ? "Nascondi tutte le soluzioni" : "Mostra tutte le soluzioni";
    });
  });

  document.body.classList.add("is-ready");
})();
