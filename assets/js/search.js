/*
 * search.js — ricerca full‑text su tutte le pagine elencate in site.js.
 *
 * - Indice costruito nel browser: ogni pagina viene scaricata e divisa in sezioni (h2/h3),
 *   così i risultati portano direttamente al paragrafo giusto.
 * - Ricerca senza distinzione di maiuscole e accenti ("perche" trova "perché").
 *   Più parole = devono esserci tutte; "frase tra virgolette" = frase esatta.
 * - Finestra rapida con Ctrl/⌘ + K o "/", pagina completa in cerca.html.
 * - Aprendo un risultato, le parole cercate vengono evidenziate nella pagina.
 */
SITE.ready(function () {
  "use strict";
  var SITE = window.SITE;
  var I = SITE.icons || {};
  var CACHE_KEY = "site-index-v" + SITE.version;
  var CACHE_TTL = 5 * 60 * 1000;
  var BLOCK = /^(P|DIV|LI|UL|OL|TD|TH|TR|TABLE|BR|H[1-6]|PRE|BLOCKQUOTE|DT|DD|DL|SECTION|ARTICLE|DETAILS|SUMMARY|FIGURE|FIGCAPTION|HEADER|FOOTER|ASIDE)$/;

  /* =================================================================
   * Indice
   * ================================================================= */

  function textOf(node) {
    var out = "";
    node.childNodes.forEach(function (c) {
      if (c.nodeType === 3) out += c.data;
      else if (c.nodeType === 1) out += BLOCK.test(c.tagName) ? " " + textOf(c) + " " : textOf(c);
    });
    return out;
  }
  function clean(s) { return s.replace(/\s+/g, " ").trim(); }

  // Divide il contenuto di una pagina in sezioni (una per titolo h2/h3)
  // e raccoglie flashcard e domande dei quiz per la pagina Ripasso.
  function parsePage(doc, page) {
    var main = doc.getElementById("content") || doc.body;
    var base = { subject: page.subject.id, path: page.path, page: page.title };

    var cards = Array.prototype.map.call(main.querySelectorAll(".flashcard"), function (c) {
      var f = c.querySelector(".fc-front"), b = c.querySelector(".fc-back");
      if (!f || !b) return null;
      return Object.assign({ id: SITE.hash(page.path + "|" + clean(f.textContent)), front: f.innerHTML.trim(), back: b.innerHTML.trim() }, base);
    }).filter(Boolean);

    var questions = Array.prototype.map.call(main.querySelectorAll(".quiz-q"), function (q) {
      var list = q.querySelector("ul, ol"), why = q.querySelector(".quiz-why");
      if (!list) return null;
      var text = Array.prototype.filter.call(q.children, function (el) { return el !== list && el !== why; })
        .map(function (el) { return el.outerHTML; }).join("");
      return Object.assign({
        id: SITE.hash(page.path + "|" + clean(q.textContent)),
        question: text,
        options: Array.prototype.map.call(list.children, function (li) { return li.innerHTML.trim(); }),
        answer: parseInt(q.getAttribute("data-answer"), 10) - 1,
        why: why ? why.innerHTML.trim() : "",
      }, base);
    }).filter(Boolean);

    main.querySelectorAll("script, style, template, [data-search-ignore], [data-subject-pages], [data-subject-grid]")
      .forEach(function (n) { n.remove(); });

    var used = { sidebar: true, content: true };
    var h1 = main.querySelector("h1");
    var sections = [{ title: "", anchor: "", text: "" }];
    var cur = sections[0];

    function walk(node) {
      node.childNodes.forEach(function (c) {
        if (c.nodeType === 3) { cur.text += c.data; return; }
        if (c.nodeType !== 1) return;
        if (c.tagName === "H2" || c.tagName === "H3") {
          var id = c.id;
          if (!id) {
            var b = SITE.slug(c.textContent), k = 2;
            id = b;
            while (used[id] || doc.getElementById(id)) id = b + "-" + k++;
          }
          used[id] = true;
          cur = { title: clean(c.textContent), anchor: id, text: "" };
          sections.push(cur);
        } else if (c.tagName === "H1") {
          // il titolo è già in page.title
        } else if (c.querySelector("h2, h3")) {
          walk(c);
        } else {
          cur.text += BLOCK.test(c.tagName) ? " " + textOf(c) + " " : textOf(c);
        }
      });
    }
    walk(main);

    sections = sections.map(function (s) {
      return Object.assign({}, base, {
        page: page.isIndex && h1 ? clean(h1.textContent) : page.title,
        type: page.type || "",
        title: s.title,
        anchor: s.anchor,
        text: clean(s.text),
      });
    }).filter(function (r) { return r.text || r.title; });

    return { sections: sections, cards: cards, questions: questions };
  }

  var indexPromise = null;
  function loadIndex() {
    if (indexPromise) return indexPromise;
    try {
      var cached = JSON.parse(sessionStorage.getItem(CACHE_KEY) || "null");
      if (cached && Date.now() - cached.t < CACHE_TTL && cached.root === SITE.root) {
        indexPromise = Promise.resolve(cached.data);
        return indexPromise;
      }
    } catch (e) { /* storage non disponibile */ }

    if (location.protocol === "file:") {
      indexPromise = Promise.reject(new Error("file"));
      return indexPromise;
    }

    var parser = new DOMParser();
    indexPromise = Promise.all(SITE.allPages().map(function (p) {
      return fetch(SITE.url(p.path))
        .then(function (r) { if (!r.ok) throw new Error(r.status); return r.text(); })
        .then(function (htmlText) { return parsePage(parser.parseFromString(htmlText, "text/html"), p); })
        .catch(function () { return { sections: [], cards: [], questions: [] }; });
    })).then(function (parts) {
      var data = { sections: [], cards: [], questions: [] };
      parts.forEach(function (x) {
        data.sections = data.sections.concat(x.sections);
        data.cards = data.cards.concat(x.cards);
        data.questions = data.questions.concat(x.questions);
      });
      try { sessionStorage.setItem(CACHE_KEY, JSON.stringify({ t: Date.now(), root: SITE.root, data: data })); } catch (e) { /* */ }
      return data;
    });
    indexPromise.catch(function () { indexPromise = null; });
    return indexPromise;
  }

  /* =================================================================
   * Ricerca
   * ================================================================= */

  // "rete locale" -> ["rete","locale"]; "\"rete locale\" ip" -> ["rete locale","ip"]
  function parseQuery(q) {
    var terms = [];
    String(q || "").replace(/"([^"]+)"|(\S+)/g, function (_, phrase, word) {
      var t = SITE.norm(clean(phrase || word).replace(/^"+|"+$/g, ""));
      if (t && terms.indexOf(t) < 0) terms.push(t);
    });
    return terms;
  }

  function count(hay, term) {
    var n = 0, i = hay.indexOf(term);
    while (i >= 0 && n < 20) { n++; i = hay.indexOf(term, i + term.length); }
    return n;
  }

  function isWord(hay, i, len) {
    var re = /[a-z0-9]/;
    return !re.test(hay[i - 1] || " ") && !re.test(hay[i + len] || " ");
  }

  function search(data, query, subjectFilter) {
    var terms = parseQuery(query);
    if (!terms.length) return [];
    var results = [];
    data.sections.forEach(function (r) {
      if (subjectFilter && r.subject !== subjectFilter) return;
      var text = SITE.norm(r.text);
      var title = SITE.norm(r.title);
      var page = SITE.norm(r.page);
      var subj = SITE.norm((SITE.subject(r.subject) || {}).name || "");
      var score = 0;
      for (var i = 0; i < terms.length; i++) {
        var t = terms[i];
        var inText = count(text, t);
        var inTitle = title.indexOf(t) >= 0, inPage = page.indexOf(t) >= 0, inSubj = subj.indexOf(t) >= 0;
        if (!inText && !inTitle && !inPage && !inSubj) return;
        score += Math.min(inText, 10) + (inTitle ? 15 : 0) + (inPage ? 8 : 0) + (inSubj ? 2 : 0);
        var at = text.indexOf(t);
        if (at >= 0 && isWord(text, at, t.length)) score += 3;
      }
      results.push({ r: r, score: score, terms: terms });
    });
    results.sort(function (a, b) { return b.score - a.score; });
    return results;
  }

  // Evidenzia i termini in un testo (restituisce HTML sicuro).
  function highlight(str, terms) {
    var n = SITE.norm(str);
    var marks = [];
    terms.forEach(function (t) {
      var i = n.indexOf(t);
      while (i >= 0) { marks.push([i, i + t.length]); i = n.indexOf(t, i + t.length); }
    });
    if (!marks.length) return SITE.escape(str);
    marks.sort(function (a, b) { return a[0] - b[0]; });
    var out = "", pos = 0;
    marks.forEach(function (m) {
      if (m[0] < pos) return;
      out += SITE.escape(str.slice(pos, m[0])) + "<mark>" + SITE.escape(str.slice(m[0], m[1])) + "</mark>";
      pos = m[1];
    });
    return out + SITE.escape(str.slice(pos));
  }

  function snippet(text, terms, size) {
    size = size || 180;
    var n = SITE.norm(text), at = -1;
    for (var i = 0; i < terms.length && at < 0; i++) at = n.indexOf(terms[i]);
    if (at < 0) return highlight(text.slice(0, size) + (text.length > size ? "…" : ""), terms);
    var start = Math.max(0, at - Math.floor(size / 3));
    if (start > 0) { var sp = text.indexOf(" ", start); if (sp > 0 && sp < at) start = sp + 1; }
    var end = Math.min(text.length, start + size);
    if (end < text.length) { var sp2 = text.lastIndexOf(" ", end); if (sp2 > at) end = sp2; }
    return (start > 0 ? "…" : "") + highlight(text.slice(start, end), terms) + (end < text.length ? "…" : "");
  }

  function resultUrl(r, query) {
    return SITE.url(r.path) + "?q=" + encodeURIComponent(query) + (r.anchor ? "#" + r.anchor : "");
  }

  function crumbHTML(r) {
    var s = SITE.subject(r.subject);
    return '<span class="res-subject" style="--c:' + s.color + '">' + SITE.escape(s.name) + "</span>" +
      (r.page && r.page !== s.name ? '<span class="res-sep">›</span><span>' + SITE.escape(r.page) + "</span>" : "");
  }

  function resultHTML(item, query, extraClass) {
    var r = item.r;
    var heading = r.title || r.page;
    return '<a class="result ' + (extraClass || "") + '" href="' + resultUrl(r, query) + '" role="option">' +
      '<span class="res-crumb">' + crumbHTML(r) + "</span>" +
      '<span class="res-title">' + highlight(heading, item.terms) + "</span>" +
      (r.text ? '<span class="res-snippet">' + snippet(r.text, item.terms) + "</span>" : "") +
      "</a>";
  }

  function errorHTML(err) {
    if (err && err.message === "file") {
      return '<div class="search-msg"><strong>La ricerca non funziona aprendo i file direttamente.</strong>' +
        "<br>Apri il sito da GitHub Pages oppure avvia un server locale: <code>python3 -m http.server</code></div>";
    }
    return '<div class="search-msg">Impossibile caricare l\'indice di ricerca.</div>';
  }

  /* ---------- Ricerche recenti ---------- */
  function recents() {
    try { return JSON.parse(SITE.store.get("recent-searches") || "[]"); } catch (e) { return []; }
  }
  function remember(q) {
    q = clean(q);
    if (q.length < 2) return;
    var list = recents().filter(function (x) { return x !== q; });
    list.unshift(q);
    SITE.store.set("recent-searches", JSON.stringify(list.slice(0, 6)));
  }

  /* =================================================================
   * Finestra di ricerca rapida (Ctrl/⌘ + K)
   * ================================================================= */

  var modal, input, box, scopeBtn, allLink, active = -1, scoped = false;
  var currentSubject = SITE.subject(document.documentElement.getAttribute("data-subject"));

  function buildModal() {
    modal = document.createElement("div");
    modal.className = "search-modal";
    modal.hidden = true;
    modal.innerHTML =
      '<div class="search-backdrop" data-close></div>' +
      '<div class="search-dialog" role="dialog" aria-modal="true" aria-label="Cerca nel sito">' +
        '<div class="search-field">' + SITE.icon(I.search) +
          '<input type="search" placeholder="Cerca parole, argomenti, esercizi…" autocomplete="off" spellcheck="false" aria-label="Testo da cercare">' +
          '<kbd data-close>Esc</kbd><button type="button" class="icon-btn search-close" data-close aria-label="Chiudi la ricerca">' + SITE.icon(I.close) + '</button>' +
        "</div>" +
        (currentSubject ? '<div class="search-scope"><button type="button" class="chip" aria-pressed="false">Solo ' +
          SITE.escape(currentSubject.name) + "</button></div>" : "") +
        '<div class="search-results" role="listbox"></div>' +
        '<div class="search-foot"><span><kbd>↑</kbd><kbd>↓</kbd> naviga <kbd>↵</kbd> apri</span>' +
          '<a class="search-all" href="' + SITE.url("cerca.html") + '">Tutti i risultati →</a></div>' +
      "</div>";
    document.body.appendChild(modal);
    input = modal.querySelector("input");
    box = modal.querySelector(".search-results");
    allLink = modal.querySelector(".search-all");
    scopeBtn = modal.querySelector(".search-scope .chip");

    modal.addEventListener("click", function (e) { if (e.target.closest("[data-close]")) closeModal(); });
    input.addEventListener("input", renderModal);
    if (scopeBtn) scopeBtn.addEventListener("click", function () {
      scoped = !scoped;
      scopeBtn.setAttribute("aria-pressed", String(scoped));
      renderModal();
      input.focus();
    });
    box.addEventListener("click", function (e) {
      var rec = e.target.closest("[data-recent]");
      if (rec) { e.preventDefault(); input.value = rec.getAttribute("data-recent"); renderModal(); input.focus(); return; }
      if (e.target.closest("a.result")) remember(input.value);
    });
    input.addEventListener("keydown", function (e) {
      var items = box.querySelectorAll(".result");
      if (e.key === "ArrowDown" || e.key === "ArrowUp") {
        e.preventDefault();
        if (!items.length) return;
        active = (active + (e.key === "ArrowDown" ? 1 : -1) + items.length) % items.length;
        items.forEach(function (el, i) { el.classList.toggle("is-active", i === active); });
        items[active].scrollIntoView({ block: "nearest" });
      } else if (e.key === "Enter") {
        e.preventDefault();
        remember(input.value);
        var target = items[active >= 0 ? active : 0];
        location.href = target && target.href ? target.href : allLink.href;
      } else if (e.key === "Escape") {
        closeModal();
      }
    });
  }

  function renderModal() {
    var q = input.value;
    active = -1;
    allLink.href = SITE.url("cerca.html") + (q ? "?q=" + encodeURIComponent(q) + (scoped ? "&m=" + currentSubject.id : "") : "");
    if (!clean(q)) {
      var rec = recents();
      box.innerHTML = rec.length
        ? '<p class="search-label">Ricerche recenti</p>' + rec.map(function (r) {
            return '<a class="result result-recent" href="#" data-recent="' + SITE.escape(r) + '">' + SITE.icon(I.search) +
              "<span>" + SITE.escape(r) + "</span></a>";
          }).join("")
        : '<div class="search-msg">Cerca una parola in tutte le materie.<br><small>Usa le "virgolette" per una frase esatta.</small></div>';
      return;
    }
    box.innerHTML = '<div class="search-msg">Caricamento indice…</div>';
    loadIndex().then(function (index) {
      if (input.value !== q) return;
      var res = search(index, q, scoped ? currentSubject.id : null);
      if (!res.length) {
        box.innerHTML = '<div class="search-msg">Nessun risultato per <strong>' + SITE.escape(q) + "</strong></div>";
        return;
      }
      box.innerHTML = res.slice(0, 8).map(function (it) { return resultHTML(it, q); }).join("") +
        (res.length > 8 ? '<p class="search-more">' + (res.length - 8) + " altri risultati</p>" : "");
      active = 0;
      box.querySelector(".result").classList.add("is-active");
    }, function (err) { box.innerHTML = errorHTML(err); });
  }

  function openModal(prefill) {
    if (!modal) buildModal();
    modal.hidden = false;
    document.body.classList.add("search-open");
    if (typeof prefill === "string") input.value = prefill;
    renderModal();
    input.focus();
    input.select();
    loadIndex().catch(function () {});
  }
  function closeModal() {
    if (!modal) return;
    modal.hidden = true;
    document.body.classList.remove("search-open");
  }

  document.addEventListener("click", function (e) {
    if (e.target.closest("[data-search-open]")) { e.preventDefault(); openModal(); }
  });
  document.addEventListener("keydown", function (e) {
    var typing = /^(INPUT|TEXTAREA|SELECT)$/.test(e.target.tagName) || e.target.isContentEditable;
    if ((e.key === "k" || e.key === "K") && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      if (modal && !modal.hidden) closeModal(); else openModal();
    } else if (e.key === "/" && !typing) {
      e.preventDefault();
      openModal();
    }
  });

  /* =================================================================
   * Pagina dei risultati (cerca.html)
   * ================================================================= */

  var page = document.querySelector("[data-search-page]");
  if (page) {
    var params = new URLSearchParams(location.search);
    var pInput = page.querySelector(".search-page-input");
    var pFilters = page.querySelector(".search-filters");
    var pOut = page.querySelector(".search-page-results");
    var pInfo = page.querySelector(".search-page-info");
    var filter = params.get("m") || "";
    pInput.value = params.get("q") || "";

    pFilters.innerHTML = '<button type="button" class="chip" data-m="">Tutte</button>' +
      SITE.subjects.map(function (s) {
        return '<button type="button" class="chip" data-m="' + s.id + '" style="--c:' + s.color + '">' + SITE.escape(s.name) + "</button>";
      }).join("");

    var renderPage = function () {
      var q = pInput.value;
      pFilters.querySelectorAll(".chip").forEach(function (c) {
        c.setAttribute("aria-pressed", String(c.getAttribute("data-m") === filter));
      });
      var url = SITE.url("cerca.html") + (q ? "?q=" + encodeURIComponent(q) + (filter ? "&m=" + filter : "") : "");
      history.replaceState(null, "", url);
      document.title = (q ? q + " · " : "") + "Cerca · " + SITE.title;

      if (!clean(q)) {
        pInfo.textContent = "";
        pOut.innerHTML = '<div class="search-msg">Scrivi una o più parole per cercare in tutte le materie.</div>';
        return;
      }
      loadIndex().then(function (index) {
        if (pInput.value !== q) return;
        var res = search(index, q, filter || null);
        pInfo.textContent = res.length === 1 ? "1 risultato" : res.length + " risultati";
        if (!res.length) {
          pOut.innerHTML = '<div class="search-msg">Nessun risultato per <strong>' + SITE.escape(q) + "</strong>" +
            (filter ? " in " + SITE.escape(SITE.subject(filter).name) : "") + ".</div>";
          return;
        }
        // raggruppa per materia mantenendo l'ordine di rilevanza
        var groups = {}, order = [];
        res.forEach(function (it) {
          if (!groups[it.r.subject]) { groups[it.r.subject] = []; order.push(it.r.subject); }
          groups[it.r.subject].push(it);
        });
        pOut.innerHTML = order.map(function (id) {
          var s = SITE.subject(id);
          return '<section class="result-group" style="--c:' + s.color + '"><h2 class="result-group-title">' +
            SITE.escape(s.name) + '<span class="count">' + groups[id].length + "</span></h2>" +
            groups[id].map(function (it) { return resultHTML(it, q, "result-card"); }).join("") + "</section>";
        }).join("");
      }, function (err) { pOut.innerHTML = errorHTML(err); });
    };

    var timer;
    pInput.addEventListener("input", function () { clearTimeout(timer); timer = setTimeout(renderPage, 120); });
    pInput.form && pInput.form.addEventListener("submit", function (e) { e.preventDefault(); remember(pInput.value); renderPage(); });
    pFilters.addEventListener("click", function (e) {
      var c = e.target.closest(".chip");
      if (!c) return;
      filter = c.getAttribute("data-m");
      renderPage();
    });
    pOut.addEventListener("click", function (e) { if (e.target.closest("a.result")) remember(pInput.value); });
    renderPage();
    if (!pInput.value) pInput.focus();
  }

  /* =================================================================
   * Evidenziazione nella pagina aperta da un risultato (?q=...)
   * ================================================================= */

  var q = new URLSearchParams(location.search).get("q");
  var content = document.getElementById("content");
  if (q && content && !page) {
    var terms = parseQuery(q);
    var walker = document.createTreeWalker(content, NodeFilter.SHOW_TEXT, {
      acceptNode: function (n) {
        return n.parentNode.closest("script, style, mark.hit, .code-bar") ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT;
      },
    });
    var nodes = [];
    while (walker.nextNode()) nodes.push(walker.currentNode);

    nodes.forEach(function (node) {
      var n = SITE.norm(node.data), ranges = [];
      terms.forEach(function (t) {
        var i = n.indexOf(t);
        while (i >= 0) { ranges.push([i, i + t.length]); i = n.indexOf(t, i + t.length); }
      });
      if (!ranges.length) return;
      ranges.sort(function (a, b) { return b[0] - a[0]; }); // dal fondo per non spostare gli indici
      var last = Infinity;
      ranges.forEach(function (r) {
        if (r[1] > last) return;
        var after = node.splitText(r[0]);
        after.splitText(r[1] - r[0]);
        var mark = document.createElement("mark");
        mark.className = "hit";
        after.parentNode.replaceChild(mark, after);
        mark.appendChild(after);
        last = r[0];
      });
    });

    var hits = Array.prototype.slice.call(content.querySelectorAll("mark.hit"));
    var bar = document.createElement("div");
    bar.className = "hit-bar";
    bar.innerHTML = SITE.icon(I.search) + '<span class="hit-count"></span>' +
      '<button type="button" class="icon-btn" data-dir="-1" aria-label="Precedente">↑</button>' +
      '<button type="button" class="icon-btn" data-dir="1" aria-label="Successivo">↓</button>' +
      '<button type="button" class="icon-btn" data-clear aria-label="Rimuovi evidenziazione">✕</button>';
    document.body.appendChild(bar);
    var countEl = bar.querySelector(".hit-count");
    var idx = 0;

    var go = function (i, smooth) {
      if (!hits.length) return;
      idx = (i + hits.length) % hits.length;
      hits.forEach(function (h) { h.classList.remove("is-current"); });
      var h = hits[idx];
      for (var d = h.closest("details"); d; d = d.parentElement && d.parentElement.closest("details")) d.open = true;
      h.classList.add("is-current");
      h.scrollIntoView({ block: "center", behavior: smooth ? "smooth" : "auto" });
      countEl.innerHTML = "<strong>" + SITE.escape(q) + "</strong> " + (idx + 1) + "/" + hits.length;
    };
    var clear = function () {
      hits.forEach(function (h) { h.replaceWith(document.createTextNode(h.textContent)); });
      content.normalize();
      bar.remove();
      history.replaceState(null, "", location.pathname + location.hash);
    };

    if (!hits.length) {
      countEl.innerHTML = "Nessuna occorrenza di <strong>" + SITE.escape(q) + "</strong>";
      bar.querySelectorAll("[data-dir]").forEach(function (b) { b.hidden = true; });
    } else {
      // parte dalla prima occorrenza dopo la sezione indicata nell'URL
      var start = 0;
      var anchor = location.hash && document.getElementById(decodeURIComponent(location.hash.slice(1)));
      if (anchor) {
        for (var i = 0; i < hits.length; i++) {
          if (anchor.compareDocumentPosition(hits[i]) & Node.DOCUMENT_POSITION_FOLLOWING) { start = i; break; }
        }
      }
      requestAnimationFrame(function () { go(start, false); });
    }

    bar.addEventListener("click", function (e) {
      var b = e.target.closest("button");
      if (!b) return;
      if (b.hasAttribute("data-clear")) clear();
      else go(idx + Number(b.getAttribute("data-dir")), true);
    });
    document.addEventListener("keydown", function (e) {
      if (!document.body.contains(bar) || /^(INPUT|TEXTAREA)$/.test(e.target.tagName)) return;
      if ((e.key === "Enter" && e.target === document.body) || e.key === "F3") { e.preventDefault(); go(idx + (e.shiftKey ? -1 : 1), true); }
      if (e.key === "Escape" && !document.body.classList.contains("search-open")) clear();
    });
  }

  /* ---------- Home: riquadro "Ripasso di oggi" ---------- */
  var reviewBox = document.querySelector("[data-review-summary]");
  if (reviewBox) {
    loadIndex().then(function (data) {
      var st = SITE.review.state();
      var due = data.cards.filter(function (c) { return SITE.review.isDue(c.id, st); }).length;
      reviewBox.querySelector("[data-due]").textContent = due;
      reviewBox.querySelector("[data-due-label]").textContent = due === 1 ? "carta da ripassare oggi" : "carte da ripassare oggi";
      reviewBox.querySelector("[data-quiz-n]").textContent = data.questions.length;
    }, function () { /* lascia i trattini */ });
  }

  SITE.search = { open: openModal, load: loadIndex, query: search };
  SITE.loadIndex = loadIndex;
});
