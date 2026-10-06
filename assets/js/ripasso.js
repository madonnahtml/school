/*
 * ripasso.js — pagina Ripasso.
 * Raccoglie in automatico tutte le flashcard e le domande dei quiz presenti nelle pagine.
 *  - Carte: ripasso a scatole (metodo Leitner), le carte che sai tornano sempre più tardi.
 *  - Quiz: 10 domande a caso, con punteggio e miglior risultato salvato.
 * Link diretti: ripasso.html#inglese (carte di Inglese), ripasso.html#quiz-storia (quiz di Storia).
 */
SITE.ready(function () {
  "use strict";
  var root = document.querySelector("[data-ripasso]");
  if (!root) return;
  var esc = SITE.escape, I = SITE.icons;
  var stage = root.querySelector(".rip-stage");
  var filtersEl = root.querySelector(".rip-filters");
  var modeBtns = root.querySelectorAll("[data-mode]");
  var DATA = null;

  var mode = "carte", filter = "";
  (function readHash() {
    var h = decodeURIComponent(location.hash.slice(1));
    if (h.indexOf("quiz") === 0) { mode = "quiz"; h = h.slice(5); }
    if (SITE.subject(h)) filter = h;
  })();

  function shuffle(a) {
    a = a.slice();
    for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)); var t = a[i]; a[i] = a[j]; a[j] = t; }
    return a;
  }
  function pool() {
    var list = mode === "carte" ? DATA.cards : DATA.questions;
    return filter ? list.filter(function (x) { return x.subject === filter; }) : list;
  }
  function setHash() {
    var h = (mode === "quiz" ? "quiz" + (filter ? "-" : "") : "") + filter;
    try { history.replaceState(null, "", location.pathname + location.search + (h ? "#" + h : "")); } catch (e) { /* */ }
  }
  function sourceLink(item) {
    var s = SITE.subject(item.subject);
    return '<a class="rip-source" style="--c:' + s.color + '" href="' + SITE.url(item.path) + '">' +
      '<span class="tab" aria-hidden="true"></span>' + esc(s.name) + " · " + esc(item.page) + "</a>";
  }

  /* ---------- Filtri e modalità ---------- */
  function renderFilters() {
    var list = mode === "carte" ? DATA.cards : DATA.questions;
    var st = SITE.review.state();
    var count = function (id) {
      return list.filter(function (x) { return (!id || x.subject === id) && (mode === "quiz" || SITE.review.isDue(x.id, st)); }).length;
    };
    var withContent = SITE.subjects.filter(function (s) { return list.some(function (x) { return x.subject === s.id; }); });
    if (filter && !withContent.some(function (s) { return s.id === filter; })) filter = "";
    filtersEl.innerHTML = '<button type="button" class="chip" data-f="" aria-pressed="' + (!filter) + '">Tutte <span class="chip-n">' + count("") + "</span></button>" +
      withContent.map(function (s) {
        return '<button type="button" class="chip" data-f="' + s.id + '" style="--c:' + s.color + '" aria-pressed="' + (filter === s.id) + '">' +
          esc(s.name) + ' <span class="chip-n">' + count(s.id) + "</span></button>";
      }).join("");
    modeBtns.forEach(function (b) { b.setAttribute("aria-selected", String(b.getAttribute("data-mode") === mode)); });
  }

  filtersEl.addEventListener("click", function (e) {
    var c = e.target.closest(".chip");
    if (!c) return;
    filter = c.getAttribute("data-f");
    setHash(); renderFilters(); start();
  });
  modeBtns.forEach(function (b) {
    b.addEventListener("click", function () {
      mode = b.getAttribute("data-mode");
      setHash(); renderFilters(); start();
    });
  });

  function start() { if (mode === "carte") cardsIntro(); else quizIntro(); }

  /* =================================================================
   * Carte
   * ================================================================= */
  function cardsIntro() {
    var cards = pool();
    var st = SITE.review.state();
    if (!cards.length) { stage.innerHTML = emptyMsg("flashcard"); return; }
    var due = cards.filter(function (c) { return SITE.review.isDue(c.id, st); });
    var boxes = [0, 0, 0, 0, 0, 0];
    cards.forEach(function (c) { boxes[SITE.review.box(c.id, st)]++; });

    stage.innerHTML =
      '<div class="rip-intro">' +
        '<p class="rip-big"><strong>' + due.length + "</strong> " + (due.length === 1 ? "carta da ripassare" : "carte da ripassare") + "</p>" +
        (due.length ? "" : '<p class="hand">Per oggi hai finito. Le carte torneranno nei prossimi giorni.</p>') +
        '<div class="boxes" aria-label="Carte per scatola">' + boxes.map(function (n, i) {
          return '<div class="box-col"><span class="box-bar" style="--h:' + (cards.length ? n / cards.length : 0) + '"></span>' +
            '<span class="box-n">' + n + '</span><span class="box-l">' + (i === 0 ? "nuove" : "scatola " + i) + "</span></div>";
        }).join("") + "</div>" +
        '<p class="rip-help">Le carte che sai salgono di scatola e tornano più tardi (1, 2, 4, 8, 16 giorni). Quelle che sbagli ripartono dalla prima.</p>' +
        '<div class="rip-actions">' +
          (due.length ? '<button type="button" class="btn" data-go="due">Inizia il ripasso</button>' : "") +
          '<button type="button" class="btn ' + (due.length ? "btn-ghost" : "") + '" data-go="all">Ripassa tutte (' + cards.length + ")</button>" +
        "</div>" +
      "</div>";
    stage.querySelectorAll("[data-go]").forEach(function (b) {
      b.addEventListener("click", function () { cardsSession(b.getAttribute("data-go") === "due" ? due : cards); });
    });
  }

  function cardsSession(list) {
    var queue = shuffle(list), total = list.length, knew = 0, again = 0, retried = {};
    var card, flipped;

    function show() {
      if (!queue.length) return finish();
      card = queue[0]; flipped = false;
      var doneCount = total - queue.filter(function (c) { return !retried[c.id]; }).length;
      stage.innerHTML =
        '<div class="session">' +
          '<div class="session-top"><span>' + Math.min(doneCount + 1, total) + " / " + total + '</span><span class="session-bar"><span style="width:' + (doneCount / total * 100) + '%"></span></span>' +
          '<button type="button" class="link-btn" data-stop>Termina</button></div>' +
          '<div class="big-card" tabindex="0" role="button" aria-label="Gira la carta"><div class="fc-inner">' +
            '<div class="fc-front">' + card.front + "</div>" +
            '<div class="fc-back">' + card.back + "</div>" +
          "</div></div>" +
          '<p class="session-src">' + sourceLink(card) + "</p>" +
          '<div class="session-actions" hidden>' +
            '<button type="button" class="btn btn-again" data-ans="0">Da rivedere</button>' +
            '<button type="button" class="btn btn-knew" data-ans="1">La sapevo</button>' +
          "</div>" +
          '<p class="session-hint hand">Tocca la carta per vedere la risposta</p>' +
        "</div>";
      var big = stage.querySelector(".big-card");
      big.addEventListener("click", flip);
      big.focus({ preventScroll: true });
      stage.querySelectorAll("[data-ans]").forEach(function (b) {
        b.addEventListener("click", function () { answer(b.getAttribute("data-ans") === "1"); });
      });
      stage.querySelector("[data-stop]").addEventListener("click", finish);
    }
    function flip() {
      flipped = !flipped;
      stage.querySelector(".big-card").classList.toggle("is-flipped", flipped);
      if (flipped) {
        stage.querySelector(".session-actions").hidden = false;
        stage.querySelector(".session-hint").hidden = true;
      }
    }
    function answer(ok) {
      if (!flipped) return;
      SITE.review.answer(card.id, ok);
      queue.shift();
      if (ok) { if (!retried[card.id]) knew++; }
      else {
        if (!retried[card.id]) again++;
        if (!retried[card.id]) { retried[card.id] = true; queue.push(card); }
      }
      show();
    }
    function finish() {
      document.removeEventListener("keydown", keys);
      stage.innerHTML = '<div class="rip-intro rip-end">' +
        '<p class="hand rip-hand-big">' + (again === 0 && knew ? "Tutte giuste!" : "Sessione finita") + "</p>" +
        '<div class="end-stats"><div><strong>' + knew + "</strong><span>sapute</span></div><div><strong>" + again + "</strong><span>da rivedere</span></div></div>" +
        '<div class="rip-actions"><button type="button" class="btn" data-back>Torna al riepilogo</button></div></div>';
      stage.querySelector("[data-back]").addEventListener("click", function () { renderFilters(); cardsIntro(); });
      renderFilters();
    }
    function keys(e) {
      if (!stage.querySelector(".big-card")) return;
      if (e.key === " " || e.key === "Enter") { e.preventDefault(); flip(); }
      else if (flipped && (e.key === "1" || e.key === "ArrowLeft")) answer(false);
      else if (flipped && (e.key === "2" || e.key === "ArrowRight")) answer(true);
    }
    document.addEventListener("keydown", keys);
    show();
    stage.scrollIntoView({ block: "start" });
  }

  /* =================================================================
   * Quiz
   * ================================================================= */
  function bestKey() { return filter || "tutte"; }
  function quizIntro() {
    var qs = pool();
    if (!qs.length) { stage.innerHTML = emptyMsg("domanda"); return; }
    var best = SITE.store.json("quiz-best", {})[bestKey()];
    var n = Math.min(10, qs.length);
    stage.innerHTML = '<div class="rip-intro">' +
      '<p class="rip-big"><strong>' + n + "</strong> domande a caso su " + qs.length + "</p>" +
      (best ? '<p class="rip-help">Miglior risultato: <strong>' + best.best + "/" + best.n + "</strong> · ultimo: " + best.last + "/" + best.n + "</p>" : '<p class="rip-help">Le risposte sono in ordine casuale ogni volta.</p>') +
      '<div class="rip-actions"><button type="button" class="btn" data-go>Inizia il quiz</button></div></div>';
    stage.querySelector("[data-go]").addEventListener("click", function () { quizSession(shuffle(qs).slice(0, n)); });
  }

  function quizSession(list) {
    var i = 0, right = 0, wrong = [];
    function show() {
      if (i >= list.length) return finish();
      var q = list[i];
      var order = shuffle(q.options.map(function (_, k) { return k; }));
      stage.innerHTML = '<div class="session">' +
        '<div class="session-top"><span>' + (i + 1) + " / " + list.length + '</span><span class="session-bar"><span style="width:' + (i / list.length * 100) + '%"></span></span>' +
        '<button type="button" class="link-btn" data-stop>Termina</button></div>' +
        '<div class="quiz-q quiz-solo">' + q.question +
          '<div class="quiz-options">' + order.map(function (k, pos) {
            return '<button type="button" class="quiz-opt" data-k="' + k + '"><span class="quiz-letter">' + "ABCDEFG"[pos] + "</span><span>" + q.options[k] + "</span></button>";
          }).join("") + "</div>" +
          (q.why ? '<div class="quiz-why" hidden>' + q.why + "</div>" : "") +
        "</div>" +
        '<p class="session-src">' + sourceLink(q) + "</p>" +
        '<div class="session-actions" hidden><button type="button" class="btn" data-next>' + (i + 1 < list.length ? "Avanti" : "Vedi il risultato") + "</button></div>" +
        "</div>";
      stage.querySelectorAll(".quiz-opt").forEach(function (b) {
        b.addEventListener("click", function () {
          var k = +b.getAttribute("data-k");
          var box = stage.querySelector(".quiz-q");
          if (box.classList.contains("is-answered")) return;
          box.classList.add("is-answered", k === q.answer ? "is-right" : "is-wrong");
          stage.querySelectorAll(".quiz-opt").forEach(function (o) {
            o.disabled = true;
            if (+o.getAttribute("data-k") === q.answer) o.classList.add("is-correct");
          });
          if (k === q.answer) right++; else { b.classList.add("is-chosen-wrong"); wrong.push(q); }
          var why = stage.querySelector(".quiz-why");
          if (why) why.hidden = false;
          stage.querySelector(".session-actions").hidden = false;
          stage.querySelector("[data-next]").focus({ preventScroll: true });
        });
      });
      stage.querySelector("[data-next]").addEventListener("click", function () { i++; show(); stage.scrollIntoView({ block: "start" }); });
      stage.querySelector("[data-stop]").addEventListener("click", function () { list = list.slice(0, i); finish(); });
    }
    function finish() {
      var n = list.length;
      if (n) {
        var all = SITE.store.json("quiz-best", {});
        var prev = all[bestKey()];
        all[bestKey()] = { best: Math.max(prev && prev.n === n ? prev.best : 0, right), last: right, n: n, t: Date.now() };
        SITE.store.setJson("quiz-best", all);
      }
      stage.innerHTML = '<div class="rip-intro rip-end">' +
        '<p class="rip-score"><strong>' + right + "</strong>/" + n + "</p>" +
        '<p class="hand rip-hand-big">' + (n && right === n ? "Perfetto!" : right >= n * 0.6 ? "Bene!" : "Ancora un giro di ripasso") + "</p>" +
        (wrong.length ? '<div class="wrong-list"><p class="rip-help">Da ripassare:</p>' + wrong.map(function (q) {
          return '<div class="wrong-item"><div class="wrong-q">' + q.question + '</div><p class="wrong-a">' + SITE.icon(I.check) + "<span>" + q.options[q.answer] + "</span></p>" + sourceLink(q) + "</div>";
        }).join("") + "</div>" : "") +
        '<div class="rip-actions"><button type="button" class="btn" data-again>Nuovo quiz</button></div></div>';
      stage.querySelector("[data-again]").addEventListener("click", quizIntro);
    }
    show();
    stage.scrollIntoView({ block: "start" });
  }

  function emptyMsg(what) {
    return '<div class="empty"><p class="hand">Niente da ripassare qui.</p><p>Aggiungi ' + (what === "flashcard" ? "delle flashcard" : "un quiz") +
      ' a una pagina (vedi <a href="' + SITE.url("componenti.html") + '">Componenti</a>) e comparirà qui in automatico.</p></div>';
  }

  stage.innerHTML = '<div class="search-msg">Raccolgo carte e domande da tutte le pagine…</div>';
  SITE.loadIndex().then(function (data) {
    DATA = data;
    renderFilters();
    start();
  }, function () {
    stage.innerHTML = '<div class="search-msg">Il ripasso funziona solo con il sito online o con un server locale (<code>python3 -m http.server</code>).</div>';
  });
});
