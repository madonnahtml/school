/*
 * site.js — configurazione centrale del sito + utility condivise.
 *
 * Per aggiungere una pagina basta aggiungere { title, path, type } all'array
 * `pages` della materia: menu, elenco argomenti, progressi, ricerca e ripasso
 * si aggiornano da soli.
 * Le pagine di tipo "esercizi" finiscono nell'area Esercizi (esercizi.html) e hanno
 * in più: of (il capitolo di teoria a cui si riferiscono, se c'è), n (quanti
 * esercizi contiene) e desc (una riga di descrizione).
 * Le pagine di tipo "classroom" sono le esercitazioni assegnate su Classroom: finiscono
 * nella loro area (classroom.html) e hanno gli stessi campi of, n e desc.
 *
 * Va caricato in modo sincrono nell'<head>: applica subito il colore della
 * materia (niente "lampeggio") e poi carica gli altri script nell'ordine giusto.
 */
(function () {
  "use strict";

  var SITE = {
    title: "Scuola",
    tagline: "Quaderno di appunti, esercizi e riassunti",
    version: "10",

    // Funzioni attivabili. ripasso: pagina Ripasso con flashcard e quiz
    // (false = nascosta dal menu e dalla home; le pagine non hanno ancora flashcard o quiz).
    features: { ripasso: false },

    // Tipi di pagina: etichetta mostrata accanto al titolo.
    pageTypes: {
      panoramica: "Panoramica",
      teoria: "Teoria",
      esercizi: "Esercizi",
      classroom: "Classroom",
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
          { title: "Java: eccezioni", path: "materie/informatica/java-eccezioni.html", type: "teoria" },
          { title: "Java: Collections, ArrayList, Vector e LinkedList", path: "materie/informatica/java-collections-liste.html", type: "teoria" },
          { title: "Java: HashMap", path: "materie/informatica/java-hashmap.html", type: "teoria" },
          { title: "Esercizi: array, wrapper, metodi e overload", path: "materie/informatica/esercizi-java-array-metodi.html", type: "esercizi", of: "materie/informatica/java-array-wrapper-metodi-overload.html", n: 15, desc: "Array e cicli, parseInt, metodi void e con return, metodi sugli array, overload." },
          { title: "Esercizi: programmazione a oggetti", path: "materie/informatica/esercizi-java-oggetti.html", type: "esercizi", of: "materie/informatica/java-programmazione-a-oggetti.html", n: 16, desc: "Classi e attributi, metodi, costruttore e this, overload dei costruttori, scope, array di oggetti." },
          { title: "Esercizi: gestione dei file", path: "materie/informatica/esercizi-java-file.html", type: "esercizi", of: "materie/informatica/java-gestione-dei-file.html", n: 17, desc: "La classe File e i percorsi, exists, FileWriter e append, FileReader carattere per carattere, delete, try-catch." },
          { title: "Esercizi: eccezioni", path: "materie/informatica/esercizi-java-eccezioni.html", type: "esercizi", of: "materie/informatica/java-eccezioni.html", n: 16, desc: "try, catch e finally, più catch e getMessage, checked e unchecked, throw e throws." },
          { title: "Esercizi: Collections, ArrayList, Vector e LinkedList", path: "materie/informatica/esercizi-java-liste.html", type: "esercizi", of: "materie/informatica/java-collections-liste.html", n: 19, desc: "Generics, metodi di ArrayList, for, foreach e Iterator, Vector, LinkedList come pila e coda, prestazioni." },
          { title: "Esercizi: HashMap", path: "materie/informatica/esercizi-java-hashmap.html", type: "esercizi", of: "materie/informatica/java-hashmap.html", n: 17, desc: "put, get, containsKey, getOrDefault, remove, scorrere con keySet, values ed entrySet, hash e cassetti." },
          { title: "Esercizi completi: tutto Java insieme", path: "materie/informatica/esercizi-java-progetti.html", type: "esercizi", n: 7, desc: "Tre progetti grandi come una verifica (biblioteca, negozio, torneo) che usano tutti i capitoli insieme, con le tappe per arrivarci." },
          { title: "Classroom: condizioni e cicli", path: "materie/informatica/classroom-condizioni-cicli.html", type: "classroom", n: 34, desc: "if, else if, if annidati, operatori logici, ternario, switch, Math, Scanner, for, while, do-while, foreach, break e continue, cicli annidati, debug e sfida finale con menu." },
          { title: "Classroom: array, wrapper, metodi e overload", path: "materie/informatica/classroom-gestione-voti.html", type: "classroom", of: "materie/informatica/java-array-wrapper-metodi-overload.html", n: 22, desc: "Array di voti, indici e length, for e foreach, somma, media con cast, massimo e minimo, metodi void e con return, Integer, autoboxing e unboxing, parseInt e parseDouble, overload per numero e per tipo." },
          { title: "Classroom: la classe Automobile", path: "materie/informatica/classroom-automobile.html", type: "classroom", of: "materie/informatica/java-programmazione-a-oggetti.html", n: 8, desc: "L'esercitazione dell'ultima slide OOP a tappe: attributi, costruttori in overload con this, accelera, frena e stampaInfo, array di oggetti e for-each." },
          { title: "Classroom: eccezioni e gestione dei file", path: "materie/informatica/classroom-eccezioni-file.html", type: "classroom", of: "materie/informatica/java-eccezioni.html", n: 11, desc: "RegistroStudenti a menu: try-catch, finally, NumberFormatException, throw, throws, più catch, Path e Files (writeString con APPEND, readAllLines, exists, deleteIfExists)." },
          { title: "Classroom: ArrayList, Vector e LinkedList", path: "materie/informatica/classroom-liste.html", type: "classroom", of: "materie/informatica/java-collections-liste.html", n: 11, desc: "GestioneStudenti, confronto ArrayList e Vector, coda con LinkedList, registro con la classe Studente, menu con Scanner e switch, test delle prestazioni con nanoTime." },
          { title: "Classroom: HashMap", path: "materie/informatica/classroom-hashmap.html", type: "classroom", of: "materie/informatica/java-hashmap.html", n: 4, desc: "Rubrica, inventario, registro voti e biblioteca a menu con put, get, containsKey, containsValue, remove, size e clear." },
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
          { title: "Il linguaggio XML", path: "materie/tpsit/xml.html", type: "teoria" },
          { title: "Lo schema DTD", path: "materie/tpsit/dtd.html", type: "teoria" },
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
          { title: "Azienda e funzioni aziendali", path: "materie/gpoi/azienda-funzioni-aziendali.html", type: "teoria" },
          { title: "Il modello microeconomico", path: "materie/gpoi/modello-microeconomico.html", type: "teoria" },
          { title: "I costi aziendali", path: "materie/gpoi/costi-aziendali.html", type: "teoria" },
          { title: "Il punto di pareggio (BEP)", path: "materie/gpoi/break-even-point.html", type: "teoria" },
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
        out.push({ subject: s, title: p.title, path: p.path, type: p.type, of: p.of, n: p.n, desc: p.desc, isIndex: i === 0 });
      });
    });
    return out;
  };
  // Solo gli argomenti (esclusa la panoramica della materia).
  SITE.topics = function (subject) {
    return SITE.allPages().filter(function (p) { return !p.isIndex && (!subject || p.subject.id === subject.id); });
  };
  // I capitoli (tutto tranne esercizi ed esercitazioni Classroom), le pagine di esercizi
  // e quelle delle esercitazioni Classroom, separati.
  SITE.chapters = function (subject) {
    return SITE.topics(subject).filter(function (p) { return p.type !== "esercizi" && p.type !== "classroom"; });
  };
  SITE.exercises = function (subject) {
    return SITE.topics(subject).filter(function (p) { return p.type === "esercizi"; });
  };
  SITE.classroom = function (subject) {
    return SITE.topics(subject).filter(function (p) { return p.type === "classroom"; });
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
      var topics = SITE.chapters(subject);
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
