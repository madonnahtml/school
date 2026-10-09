/*
 * site.js — configurazione centrale del sito + utility condivise.
 *
 * Per aggiungere una pagina basta aggiungere { title, path, type } all'array
 * `pages` della materia: menu, elenco argomenti, progressi, ricerca e ripasso
 * si aggiornano da soli.
 *
 * Va caricato in modo sincrono nell'<head>: applica subito il colore della
 * materia (niente "lampeggio") e poi carica gli altri script nell'ordine giusto.
 */
(function () {
  "use strict";

  var SITE = {
    title: "Scuola",
    tagline: "Quaderno di appunti, esercizi e riassunti",
    version: "7",

    // Funzioni attivabili. ripasso: pagina Ripasso con flashcard e quiz
    // (false = nascosta dal menu e dalla home; le pagine non hanno ancora flashcard o quiz).
    features: { ripasso: false },

    // Tipi di pagina: etichetta mostrata accanto al titolo.
    pageTypes: {
      panoramica: "Panoramica",
      teoria: "Teoria",
      esercizi: "Esercizi",
      laboratorio: "Laboratorio",
      riassunto: "Riassunto",
      verifica: "Verifica",
      vocabolario: "Vocabolario",
    },

    subjects: [
      {
        id: "informatica",
        name: "Informatica",
        short: "INF",
        color: "#2f6fdb",
        description: "Programmazione, algoritmi, strutture dati e basi di dati.",
        icon: '<polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/>',
        pages: [
          { title: "Panoramica", path: "materie/informatica/index.html", type: "panoramica" },
          { title: "Java: array, wrapper, metodi e overload", path: "materie/informatica/java-array-wrapper-metodi-overload.html", type: "teoria" },
          { title: "Java: programmazione a oggetti", path: "materie/informatica/java-programmazione-a-oggetti.html", type: "teoria" },
          { title: "Java: gestione dei file", path: "materie/informatica/java-gestione-dei-file.html", type: "teoria" },
        ],
      },
      {
        id: "sistemi-e-reti",
        name: "Sistemi e Reti",
        short: "SIS",
        color: "#0f8b8d",
        description: "Architetture di rete, protocolli, indirizzamento IP e sicurezza.",
        icon: '<rect x="16" y="16" width="6" height="6" rx="1"/><rect x="2" y="16" width="6" height="6" rx="1"/><rect x="9" y="2" width="6" height="6" rx="1"/><path d="M5 16v-3a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v3"/><path d="M12 12V8"/>',
        pages: [
          { title: "Panoramica", path: "materie/sistemi-e-reti/index.html", type: "panoramica" },
          { title: "Il modello ISO/OSI", path: "materie/sistemi-e-reti/modello-iso-osi.html", type: "teoria" },
        ],
      },
      {
        id: "tpsit",
        name: "TPSIT",
        short: "TPS",
        color: "#7a4fd0",
        description: "Tecnologie e progettazione di sistemi informatici e di telecomunicazioni.",
        icon: '<rect x="4" y="4" width="16" height="16" rx="2"/><rect x="9" y="9" width="6" height="6"/><path d="M15 2v2M15 20v2M2 15h2M2 9h2M20 15h2M20 9h2M9 2v2M9 20v2"/>',
        pages: [
          { title: "Panoramica", path: "materie/tpsit/index.html", type: "panoramica" },
          { title: "Sistemi distribuiti", path: "materie/tpsit/sistemi-distribuiti.html", type: "teoria" },
          { title: "Il protocollo HTTP", path: "materie/tpsit/protocollo-http.html", type: "teoria" },
          { title: "Il linguaggio JSON", path: "materie/tpsit/json.html", type: "teoria" },
        ],
      },
      {
        id: "gpoi",
        name: "GPOI",
        short: "GPO",
        color: "#c9711c",
        description: "Gestione progetto e organizzazione d'impresa.",
        icon: '<rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>',
        pages: [
          { title: "Panoramica", path: "materie/gpoi/index.html", type: "panoramica" },
        ],
      },
      {
        id: "storia",
        name: "Storia",
        short: "STO",
        color: "#a0522d",
        description: "Eventi, periodi e collegamenti tra i fatti storici.",
        icon: '<path d="M3 22h18"/><path d="M6 18v-7M10 18v-7M14 18v-7M18 18v-7"/><path d="M12 2l8 5H4z"/>',
        pages: [
          { title: "Panoramica", path: "materie/storia/index.html", type: "panoramica" },
          { title: "L'Unità d'Italia", path: "materie/storia/unita-d-italia.html", type: "riassunto" },
        ],
      },
      {
        id: "italiano",
        name: "Italiano",
        short: "ITA",
        color: "#c8364b",
        description: "Autori, correnti letterarie, analisi del testo e produzione scritta.",
        icon: '<path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>',
        pages: [
          { title: "Panoramica", path: "materie/italiano/index.html", type: "panoramica" },
        ],
      },
      {
        id: "inglese",
        name: "Inglese",
        short: "ING",
        color: "#3a8f4a",
        description: "Grammar, vocabulary, reading e technical English.",
        icon: '<circle cx="12" cy="12" r="10"/><path d="M2 12h20"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>',
        pages: [
          { title: "Panoramica", path: "materie/inglese/index.html", type: "panoramica" },
          { title: "Irregular verbs", path: "materie/inglese/irregular-verbs.html", type: "vocabolario" },
        ],
      },
    ],
  };

  /* ---------- Percorsi ---------- */

  // Radice del sito, ricavata dalla posizione di questo script (assets/js/site.js).
  var script = document.currentScript;
  SITE.root = script ? new URL("../../", script.src).href : new URL("./", location.href).href;
  // La home è la radice del sito ("./"), così funziona anche dove "index.html" non è un percorso valido.
  SITE.url = function (path) { return new URL(path === "index.html" ? "./" : path, SITE.root).href; };

  function clean(u) { return u.split(/[?#]/)[0].replace(/index\.html$/, ""); }
  SITE.isHere = function (path) { return clean(SITE.url(path)) === clean(location.href); };

  SITE.subject = function (id) {
    for (var i = 0; i < SITE.subjects.length; i++) if (SITE.subjects[i].id === id) return SITE.subjects[i];
    return null;
  };

  // Tutte le pagine, con riferimento alla materia.
  SITE.allPages = function () {
    var out = [];
    SITE.subjects.forEach(function (s) {
      s.pages.forEach(function (p, i) {
        out.push({ subject: s, title: p.title, path: p.path, type: p.type, isIndex: i === 0 });
      });
    });
    return out;
  };
  // Solo gli argomenti (esclusa la panoramica della materia).
  SITE.topics = function (subject) {
    return SITE.allPages().filter(function (p) { return !p.isIndex && (!subject || p.subject.id === subject.id); });
  };
  SITE.currentPage = function () {
    var all = SITE.allPages();
    for (var i = 0; i < all.length; i++) if (SITE.isHere(all[i].path)) return all[i];
    return null;
  };

  /* ---------- Testo ---------- */

  // Minuscolo e senza accenti, con la stessa lunghezza dell'originale
  // (così le posizioni trovate valgono anche sul testo originale).
  SITE.norm = function (str) {
    var out = "";
    for (var i = 0; i < str.length; i++) {
      var c = str[i];
      var n = c.normalize ? c.normalize("NFD")[0] : c;
      out += n.toLowerCase()[0] || c;
    }
    return out;
  };
  SITE.slug = function (str) {
    return str.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase()
      .replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "") || "sezione";
  };
  SITE.escape = function (str) {
    return String(str).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  };
  SITE.hash = function (str) {
    var h = 5381;
    for (var i = 0; i < str.length; i++) h = ((h << 5) + h + str.charCodeAt(i)) | 0;
    return (h >>> 0).toString(36);
  };
  SITE.icon = function (paths, cls) {
    return '<svg class="' + (cls || "icon") + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" ' +
      'stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + paths + "</svg>";
  };

  /* ---------- Memoria locale (solo su questo dispositivo) ---------- */

  SITE.store = {
    get: function (k) { try { return localStorage.getItem(k); } catch (e) { return null; } },
    set: function (k, v) { try { localStorage.setItem(k, v); } catch (e) { /* non disponibile */ } },
    json: function (k, fallback) {
      try { var v = JSON.parse(localStorage.getItem(k)); return v == null ? fallback : v; } catch (e) { return fallback; }
    },
    setJson: function (k, v) { SITE.store.set(k, JSON.stringify(v)); },
  };

  // Argomenti segnati come "studiato": { path: timestamp }
  SITE.progress = {
    all: function () { return SITE.store.json("studiati", {}); },
    isDone: function (path) { return !!SITE.progress.all()[path]; },
    set: function (path, done) {
      var all = SITE.progress.all();
      if (done) all[path] = Date.now(); else delete all[path];
      SITE.store.setJson("studiati", all);
      document.dispatchEvent(new CustomEvent("progress-change", { detail: { path: path, done: done } }));
    },
    count: function (subject) {
      var all = SITE.progress.all();
      var topics = SITE.topics(subject);
      return { done: topics.filter(function (p) { return all[p.path]; }).length, total: topics.length };
    },
  };

  // Ultime pagine aperte (per "Riprendi da qui")
  SITE.recent = {
    list: function () { return SITE.store.json("recenti", []); },
    add: function (page) {
      var list = SITE.recent.list().filter(function (r) { return r.path !== page.path; });
      list.unshift({ path: page.path, t: Date.now() });
      SITE.store.setJson("recenti", list.slice(0, 8));
    },
  };

  // Ripasso a "scatole" (metodo Leitner): ogni carta sale di scatola quando la sai
  // e torna alla prima quando la sbagli. Più alta è la scatola, più tardi ritorna.
  SITE.review = {
    DAYS: [0, 1, 2, 4, 8, 16],
    state: function () { return SITE.store.json("leitner", {}); },
    save: function (st) { SITE.store.setJson("leitner", st); },
    isDue: function (id, st) { var c = (st || SITE.review.state())[id]; return !c || c.due <= Date.now(); },
    box: function (id, st) { var c = (st || SITE.review.state())[id]; return c ? c.b : 0; },
    answer: function (id, knew) {
      var st = SITE.review.state();
      var c = st[id] || { b: 0 };
      c.b = knew ? Math.min(c.b + 1, 5) : 1;
      c.due = knew ? Date.now() + SITE.review.DAYS[c.b] * 864e5 - 36e5 : Date.now() + 6e5;
      st[id] = c;
      SITE.review.save(st);
    },
  };

  /* ---------- Avvio ---------- */

  SITE.ready = function (fn) {
    if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", fn);
    else fn();
  };

  var html = document.documentElement;
  var current = SITE.subject(html.getAttribute("data-subject"));
  if (current) html.style.setProperty("--accent-subject", current.color);

  // Font
  var fonts = document.createElement("link");
  fonts.rel = "stylesheet";
  fonts.href = "https://fonts.googleapis.com/css2?family=Atkinson+Hyperlegible+Next:ital,wght@0,400;0,600;0,700;0,800;1,400" +
    "&family=Atkinson+Hyperlegible+Mono:wght@400;600&family=Kalam:wght@400;700&display=swap";
  document.head.appendChild(fonts);

  // Script del sito, eseguiti nell'ordine indicato
  var scripts = ["riassunti", "layout", "components", "search"].concat((html.getAttribute("data-scripts") || "").split(/\s+/).filter(Boolean));
  scripts.forEach(function (name) {
    var s = document.createElement("script");
    s.src = SITE.url("assets/js/" + name + ".js?v=" + SITE.version);
    s.async = false;
    document.head.appendChild(s);
  });

  // Funzionamento offline (solo se il sito è servito via http/https)
  if ("serviceWorker" in navigator && /^https?:$/.test(location.protocol)) {
    window.addEventListener("load", function () {
      try {
        navigator.serviceWorker.register(SITE.url("sw.js")).then(function (reg) {
          var send = function (w) {
            if (w) w.postMessage({ type: "precache", urls: SITE.allPages().map(function (p) { return SITE.url(p.path); }) });
          };
          send(reg.active);
          navigator.serviceWorker.ready.then(function (r) { send(r.active); });
        }).catch(function () { /* service worker non disponibile qui */ });
      } catch (e) { /* idem */ }
    });
  }

  window.SITE = SITE;
})();
