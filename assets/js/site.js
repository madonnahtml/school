/*
 * site.js — configurazione centrale del sito.
 *
 * Questo è l'UNICO file da aggiornare quando si aggiunge una pagina:
 * aggiungi un oggetto { title, path, type } all'array `pages` della materia.
 * Menu laterale, elenco argomenti della materia e ricerca si aggiornano da soli.
 *
 * Caricato in modo sincrono nell'<head> (senza defer) per applicare
 * tema e colore della materia prima che la pagina venga disegnata.
 */
(function () {
  "use strict";

  var SITE = {
    title: "Scuola",
    tagline: "Appunti, teoria ed esercizi per studiare",

    // Tipi di pagina: etichetta mostrata come badge accanto al titolo.
    pageTypes: {
      panoramica: "Panoramica",
      teoria: "Teoria",
      esercizi: "Esercizi",
      laboratorio: "Laboratorio",
      riassunto: "Riassunto",
      verifica: "Verifica",
    },

    subjects: [
      {
        id: "informatica",
        name: "Informatica",
        color: "#3b82f6",
        focus: ["Teoria", "Esercizi", "Codice"],
        description: "Programmazione, algoritmi, strutture dati e basi di dati.",
        icon: '<polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/>',
        pages: [
          { title: "Panoramica", path: "materie/informatica/index.html", type: "panoramica" },
        ],
      },
      {
        id: "sistemi-e-reti",
        name: "Sistemi e Reti",
        color: "#06b6d4",
        focus: ["Teoria", "Esercizi", "Laboratorio"],
        description: "Architetture di rete, protocolli, indirizzamento IP e sicurezza.",
        icon: '<rect x="16" y="16" width="6" height="6" rx="1"/><rect x="2" y="16" width="6" height="6" rx="1"/><rect x="9" y="2" width="6" height="6" rx="1"/><path d="M5 16v-3a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v3"/><path d="M12 12V8"/>',
        pages: [
          { title: "Panoramica", path: "materie/sistemi-e-reti/index.html", type: "panoramica" },
        ],
      },
      {
        id: "tpsit",
        name: "TPSIT",
        color: "#8b5cf6",
        focus: ["Teoria", "Laboratorio", "Codice"],
        description: "Tecnologie e progettazione di sistemi informatici e di telecomunicazioni.",
        icon: '<rect x="4" y="4" width="16" height="16" rx="2"/><rect x="9" y="9" width="6" height="6"/><path d="M15 2v2M15 20v2M2 15h2M2 9h2M20 15h2M20 9h2M9 2v2M9 20v2"/>',
        pages: [
          { title: "Panoramica", path: "materie/tpsit/index.html", type: "panoramica" },
        ],
      },
      {
        id: "gpoi",
        name: "GPOI",
        color: "#f59e0b",
        focus: ["Teoria", "Casi pratici"],
        description: "Gestione progetto e organizzazione d'impresa.",
        icon: '<rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>',
        pages: [
          { title: "Panoramica", path: "materie/gpoi/index.html", type: "panoramica" },
        ],
      },
      {
        id: "storia",
        name: "Storia",
        color: "#b45309",
        focus: ["Riassunti", "Linee del tempo"],
        description: "Eventi, periodi e collegamenti tra i fatti storici.",
        icon: '<path d="M3 22h18"/><path d="M6 18v-7M10 18v-7M14 18v-7M18 18v-7"/><path d="M12 2l8 5H4z"/>',
        pages: [
          { title: "Panoramica", path: "materie/storia/index.html", type: "panoramica" },
        ],
      },
      {
        id: "italiano",
        name: "Italiano",
        color: "#e11d48",
        focus: ["Letteratura", "Analisi testi", "Scrittura"],
        description: "Autori, correnti letterarie, analisi del testo e produzione scritta.",
        icon: '<path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>',
        pages: [
          { title: "Panoramica", path: "materie/italiano/index.html", type: "panoramica" },
        ],
      },
      {
        id: "inglese",
        name: "Inglese",
        color: "#10b981",
        focus: ["Grammatica", "Vocabolario", "Esercizi"],
        description: "Grammar, vocabulary, reading e technical English.",
        icon: '<circle cx="12" cy="12" r="10"/><path d="M2 12h20"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>',
        pages: [
          { title: "Panoramica", path: "materie/inglese/index.html", type: "panoramica" },
        ],
      },
    ],
  };

  /* ---------- Utility condivise da layout.js e search.js ---------- */

  // Radice del sito, ricavata dalla posizione di questo script (assets/js/site.js).
  var script = document.currentScript;
  SITE.root = script ? new URL("../../", script.src).href : new URL("./", location.href).href;

  SITE.url = function (path) {
    return new URL(path, SITE.root).href;
  };

  SITE.subject = function (id) {
    for (var i = 0; i < SITE.subjects.length; i++) {
      if (SITE.subjects[i].id === id) return SITE.subjects[i];
    }
    return null;
  };

  // Tutte le pagine indicizzabili, con riferimento alla materia.
  SITE.allPages = function () {
    var out = [];
    SITE.subjects.forEach(function (s) {
      s.pages.forEach(function (p) {
        out.push({ subject: s, title: p.title, path: p.path, type: p.type });
      });
    });
    return out;
  };

  // Normalizzazione per la ricerca: minuscolo e senza accenti.
  // Mantiene la stessa lunghezza della stringa originale (carattere per carattere),
  // così le posizioni trovate valgono anche sul testo originale.
  SITE.norm = function (str) {
    var out = "";
    for (var i = 0; i < str.length; i++) {
      var c = str[i];
      var n = c.normalize ? c.normalize("NFD")[0] : c;
      n = n.toLowerCase()[0] || c;
      out += n;
    }
    return out;
  };

  SITE.slug = function (str) {
    return (
      str
        .normalize("NFD")
        .replace(/[̀-ͯ]/g, "")
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "") || "sezione"
    );
  };

  SITE.escape = function (str) {
    return String(str).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  };

  SITE.icon = function (paths, cls) {
    return (
      '<svg class="' + (cls || "icon") + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" ' +
      'stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + paths + "</svg>"
    );
  };

  SITE.store = {
    get: function (k) {
      try { return localStorage.getItem(k); } catch (e) { return null; }
    },
    set: function (k, v) {
      try { localStorage.setItem(k, v); } catch (e) { /* storage non disponibile */ }
    },
  };

  /* ---------- Tema e colore materia, applicati subito ---------- */

  var html = document.documentElement;
  var theme = SITE.store.get("theme");
  if (theme === "light" || theme === "dark") html.setAttribute("data-theme", theme);

  var current = SITE.subject(html.getAttribute("data-subject"));
  if (current) html.style.setProperty("--accent", current.color);

  window.SITE = SITE;
})();
