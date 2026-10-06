/*
 * components.js — rende interattivi i blocchi del contenuto:
 * codice (colori + copia), flashcard, quiz, schemi di rete, "mostra tutte le soluzioni".
 * Esempi d'uso di ogni blocco in componenti.html.
 */
SITE.ready(function () {
  "use strict";
  var main = document.getElementById("content");
  if (!main) return;
  var I = SITE.icons;
  var esc = SITE.escape;

  /* =================================================================
   * Evidenziazione del codice: <pre data-lang="c"><code>…</code></pre>
   * Linguaggi: c, cpp, java, python, js, sql, bash, html
   * ================================================================= */
  var STR = /"(?:\\.|[^"\\\n])*"|'(?:\\.|[^'\\\n])*'/;
  var NUM = /\b(?:0x[\da-fA-F]+|\d+(?:\.\d+)?)\b/;
  var CLIKE = "auto break case char const continue default do double else enum extern float for goto if int long register return short signed sizeof static struct switch typedef union unsigned void volatile while bool true false NULL";
  var LANGS = {
    c: { comment: /\/\/.*|\/\*[\s\S]*?\*\//, pre: /^[ \t]*#\s*\w+(?:[ \t]*<[^>\n]*>)?/m, kw: CLIKE + " printf scanf main" },
    cpp: { comment: /\/\/.*|\/\*[\s\S]*?\*\//, pre: /^[ \t]*#\s*\w+(?:[ \t]*<[^>\n]*>)?/m, kw: CLIKE + " class public private protected new delete namespace using std cout cin endl string vector template this virtual nullptr" },
    java: { comment: /\/\/.*|\/\*[\s\S]*?\*\//, kw: "abstract boolean break byte case catch char class continue default do double else extends final finally float for if implements import int interface long new null package private protected public return short static super switch synchronized this throw throws try void while true false var String" },
    python: { comment: /#.*/, str3: /"""[\s\S]*?"""|'''[\s\S]*?'''/, kw: "and as assert break class continue def del elif else except False finally for from global if import in is lambda None nonlocal not or pass raise return True try while with yield print input range len int float str list dict" },
    js: { comment: /\/\/.*|\/\*[\s\S]*?\*\//, str3: /`(?:\\.|[^`\\])*`/, kw: "async await break case catch class const continue default delete do else export extends false finally for function if import in instanceof let new null return super switch this throw true try typeof undefined var void while yield console" },
    sql: { comment: /--.*/, ci: true, kw: "select from where and or not insert into values update set delete create table primary key foreign references join inner left right on group by order having as distinct count sum avg min max null is like in between int varchar char date drop alter add constraint unique default auto_increment asc desc limit" },
    bash: { comment: /#.*/, kw: "if then else elif fi for while do done case esac function in echo cd ls sudo export return exit grep cat chmod mkdir rm cp mv ping ip ifconfig ssh" },
  };
  LANGS.javascript = LANGS.js; LANGS.py = LANGS.python; LANGS.sh = LANGS.bash; LANGS["c++"] = LANGS.cpp;

  function tokenize(code, rules) {
    var re = new RegExp(rules.map(function (r) { return "(" + r[1].source + ")"; }).join("|"), "gm");
    var out = "", last = 0, m;
    while ((m = re.exec(code))) {
      if (m[0] === "") { re.lastIndex++; continue; }
      out += esc(code.slice(last, m.index));
      for (var i = 1; i < m.length; i++) {
        if (m[i] !== undefined) {
          var cls = rules[i - 1][0];
          if (typeof cls === "function") cls = cls(m[0], code, re.lastIndex);
          out += cls ? '<span class="tok-' + cls + '">' + esc(m[0]) + "</span>" : esc(m[0]);
          break;
        }
      }
      last = re.lastIndex;
    }
    return out + esc(code.slice(last));
  }

  function highlight(code, lang) {
    if (lang === "http") {
      return tokenize(code, [
        ["keyword", /^(?:GET|POST|PUT|DELETE|HEAD|OPTIONS|PATCH|CONNECT|TRACE)\b/],
        ["pre", /HTTP\/\d(?:\.\d)?/],
        ["number", /\b[1-5]\d\d\b(?= [A-Za-z])/],
        ["attr", /^[\w-]+(?=:)/],
      ]);
    }
    if (lang === "json") {
      return tokenize(code, [["attr", /"(?:\\.|[^"\\])*"(?=\s*:)/], ["string", STR], ["number", NUM], ["keyword", /\b(?:true|false|null)\b/]]);
    }
    if (lang === "html" || lang === "xml") {
      return tokenize(code, [["comment", /<!--[\s\S]*?-->/], ["tag", /<\/?[\w-]+|\/?>/], ["attr", /[\w-]+(?==)/], ["string", STR]]);
    }
    var L = LANGS[lang];
    if (!L) return esc(code);
    var kw = {};
    L.kw.split(" ").forEach(function (w) { kw[L.ci ? w.toLowerCase() : w] = true; });
    var rules = [["comment", L.comment]];
    if (L.pre) rules.push(["pre", L.pre]);
    if (L.str3) rules.push(["string", L.str3]);
    rules.push(["string", STR], ["number", NUM], [function (w, src, end) {
      if (kw[L.ci ? w.toLowerCase() : w]) return "keyword";
      return /^\s*\(/.test(src.slice(end, end + 4)) ? "function" : "";
    }, /[A-Za-z_]\w*/]);
    return tokenize(code, rules);
  }

  main.querySelectorAll("pre").forEach(function (pre) {
    var lang = (pre.getAttribute("data-lang") || "").toLowerCase();
    var code = pre.querySelector("code") || pre;
    if (lang) code.innerHTML = highlight(code.textContent, lang);

    var wrap = document.createElement("div");
    wrap.className = "code-block";
    pre.parentNode.insertBefore(wrap, pre);
    var bar = document.createElement("div");
    bar.className = "code-bar";
    bar.innerHTML = "<span>" + esc(lang || "testo") + '</span><button type="button" class="copy-btn">' + SITE.icon(I.copy) + "<span>Copia</span></button>";
    wrap.appendChild(bar);
    wrap.appendChild(pre);
    var btn = bar.querySelector("button");
    btn.addEventListener("click", function () {
      var ok = function () {
        btn.innerHTML = SITE.icon(I.check) + "<span>Copiato</span>";
        setTimeout(function () { btn.innerHTML = SITE.icon(I.copy) + "<span>Copia</span>"; }, 1600);
      };
      var fallback = function () {
        var r = document.createRange();
        r.selectNodeContents(code);
        var s = getSelection(); s.removeAllRanges(); s.addRange(r);
        btn.innerHTML = "<span>Selezionato: premi Copia</span>";
      };
      try {
        navigator.clipboard.writeText(code.textContent).then(ok, fallback);
      } catch (e) { fallback(); }
    });
  });

  /* =================================================================
   * Flashcard: <div class="flashcards"><div class="flashcard">
   *              <div class="fc-front">…</div><div class="fc-back">…</div></div></div>
   * ================================================================= */
  main.querySelectorAll(".flashcards").forEach(function (deck) {
    var cards = deck.querySelectorAll(".flashcard");
    cards.forEach(function (card) {
      card.setAttribute("tabindex", "0");
      card.setAttribute("role", "button");
      card.setAttribute("aria-pressed", "false");
      var inner = document.createElement("div");
      inner.className = "fc-inner";
      while (card.firstChild) inner.appendChild(card.firstChild);
      card.appendChild(inner);
      var flip = function () {
        var on = !card.classList.contains("is-flipped");
        card.classList.toggle("is-flipped", on);
        card.setAttribute("aria-pressed", String(on));
      };
      card.addEventListener("click", function (e) { if (!e.target.closest("a")) flip(); });
      card.addEventListener("keydown", function (e) { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); flip(); } });
    });
    var subject = document.documentElement.getAttribute("data-subject");
    var head = document.createElement("div");
    head.className = "deck-head";
    head.setAttribute("data-search-ignore", "");
    head.innerHTML = '<span class="hand">Tocca una carta per girarla</span>' +
      '<a href="' + SITE.url("ripasso.html") + (subject ? "#" + subject : "") + '">Ripassa con le carte ' + SITE.icon(I.chevron) + "</a>";
    deck.parentNode.insertBefore(head, deck);
  });

  /* =================================================================
   * Quiz: <div class="quiz"><div class="quiz-q" data-answer="2">
   *         <p>Domanda</p><ul><li>…</li>…</ul><p class="quiz-why">Spiegazione</p></div></div>
   * data-answer = numero della risposta giusta, contando da 1.
   * ================================================================= */
  main.querySelectorAll(".quiz").forEach(function (quiz) {
    var qs = quiz.querySelectorAll(".quiz-q");
    var score = document.createElement("div");
    score.className = "quiz-score";
    score.setAttribute("data-search-ignore", "");
    score.setAttribute("aria-live", "polite");
    quiz.appendChild(score);

    function update() {
      var answered = quiz.querySelectorAll(".quiz-q.is-answered").length;
      var right = quiz.querySelectorAll(".quiz-q.is-right").length;
      if (answered < qs.length) {
        score.innerHTML = "<span>" + answered + " di " + qs.length + " risposte date</span>";
      } else {
        var verdict = right === qs.length ? "Perfetto!" : right >= qs.length * 0.6 ? "Bene, ripassa le sbagliate." : "Da ripassare.";
        score.innerHTML = '<strong class="quiz-total">' + right + "/" + qs.length + '</strong><span class="hand">' + verdict +
          '</span><button type="button" class="btn btn-ghost" data-quiz-reset>Riprova</button>';
      }
    }

    qs.forEach(function (q, qi) {
      var answer = parseInt(q.getAttribute("data-answer"), 10) - 1;
      var why = q.querySelector(".quiz-why");
      var opts = q.querySelector("ul, ol");
      if (!opts) return;
      var num = document.createElement("span");
      num.className = "quiz-num";
      num.textContent = "Domanda " + (qi + 1);
      q.insertBefore(num, q.firstChild);
      var box = document.createElement("div");
      box.className = "quiz-options";
      Array.prototype.forEach.call(opts.children, function (li, i) {
        var b = document.createElement("button");
        b.type = "button";
        b.className = "quiz-opt";
        b.innerHTML = '<span class="quiz-letter">' + "ABCDEFG"[i] + "</span><span>" + li.innerHTML + "</span>";
        b.addEventListener("click", function () {
          if (q.classList.contains("is-answered")) return;
          q.classList.add("is-answered", i === answer ? "is-right" : "is-wrong");
          box.querySelectorAll(".quiz-opt").forEach(function (o, j) {
            o.disabled = true;
            if (j === answer) o.classList.add("is-correct");
          });
          if (i !== answer) b.classList.add("is-chosen-wrong");
          if (why) why.hidden = false;
          update();
        });
        box.appendChild(b);
      });
      opts.replaceWith(box);
      if (why) why.hidden = true;
    });

    quiz.addEventListener("click", function (e) {
      if (!e.target.closest("[data-quiz-reset]")) return;
      qs.forEach(function (q) {
        q.classList.remove("is-answered", "is-right", "is-wrong");
        q.querySelectorAll(".quiz-opt").forEach(function (o) { o.disabled = false; o.classList.remove("is-correct", "is-chosen-wrong"); });
        var why = q.querySelector(".quiz-why");
        if (why) why.hidden = true;
      });
      update();
      quiz.scrollIntoView({ block: "start", behavior: "smooth" });
    });
    update();
  });

  /* =================================================================
   * Schema di rete:
   * <figure class="rete" data-nodi="Internet:cloud; R1:router:192.168.1.1; SW1:switch; PC1:pc:.10"
   *         data-collegamenti="Internet-R1; R1-SW1; SW1-PC1"><figcaption>…</figcaption></figure>
   * Tipi: pc, laptop, server, db, router, switch, hub, firewall, cloud, ap
   * ================================================================= */
  var GLYPH = {
    pc: '<rect x="4" y="6" width="32" height="21" rx="2"/><path d="M20 27v6M12 34h16"/>',
    laptop: '<rect x="8" y="8" width="24" height="17" rx="2"/><path d="M3 31h34l-3-6H6z"/>',
    server: '<rect x="9" y="3" width="22" height="34" rx="2"/><path d="M9 14h22M9 25h22"/><circle cx="14" cy="8.5" r="1" class="dotfill"/><circle cx="14" cy="19.5" r="1" class="dotfill"/><circle cx="14" cy="30.5" r="1" class="dotfill"/>',
    router: '<circle cx="20" cy="20" r="16"/><path d="M11 16h15M22 12l4 4-4 4M29 24H14M18 20l-4 4 4 4"/>',
    switch: '<rect x="3" y="11" width="34" height="18" rx="3"/><path d="M9 17h20M25 14l4 3-4 3M31 23H11M15 20l-4 3 4 3"/>',
    hub: '<rect x="3" y="13" width="34" height="14" rx="3"/><circle cx="11" cy="20" r="1.5" class="dotfill"/><circle cx="20" cy="20" r="1.5" class="dotfill"/><circle cx="29" cy="20" r="1.5" class="dotfill"/>',
    firewall: '<rect x="4" y="6" width="32" height="28" rx="2"/><path d="M4 15h32M4 25h32M14 6v9M26 6v9M20 15v10M10 25v9M30 25v9"/>',
    cloud: '<path d="M11 31a7 7 0 0 1-.6-14A10 10 0 0 1 29.5 15 8 8 0 0 1 29 31z"/>',
    db: '<ellipse cx="20" cy="9" rx="13" ry="5"/><path d="M7 9v22c0 2.8 5.8 5 13 5s13-2.2 13-5V9M7 20c0 2.8 5.8 5 13 5s13-2.2 13-5"/>',
    ap: '<rect x="8" y="24" width="24" height="9" rx="2"/><path d="M20 24v-6M12 12a11 11 0 0 1 16 0M15 16a6 6 0 0 1 10 0"/>',
  };

  main.querySelectorAll("figure.rete[data-nodi]").forEach(function (fig) {
    var nodes = [], byName = {};
    fig.getAttribute("data-nodi").split(";").forEach(function (part) {
      var bits = part.split(":").map(function (s) { return s.trim(); });
      if (!bits[0]) return;
      var n = { name: bits[0], type: (bits[1] || "pc").toLowerCase(), label: bits.slice(2).join(":"), kids: [], depth: 0 };
      nodes.push(n); byName[n.name] = n;
    });
    var links = [];
    (fig.getAttribute("data-collegamenti") || "").split(";").forEach(function (part) {
      var ab = part.split("-").map(function (s) { return s.trim(); });
      if (byName[ab[0]] && byName[ab[1]]) links.push([byName[ab[0]], byName[ab[1]]]);
    });
    if (!nodes.length) return;

    // Albero a partire dal primo nodo (visita in ampiezza)
    var seen = {}, roots = [];
    nodes.forEach(function (start) {
      if (seen[start.name]) return;
      roots.push(start); seen[start.name] = true;
      var queue = [start];
      while (queue.length) {
        var n = queue.shift();
        links.forEach(function (l) {
          var other = l[0] === n ? l[1] : l[1] === n ? l[0] : null;
          if (other && !seen[other.name]) { seen[other.name] = true; other.depth = n.depth + 1; n.kids.push(other); queue.push(other); }
        });
      }
    });
    var slot = 0, maxDepth = 0;
    function place(n) {
      maxDepth = Math.max(maxDepth, n.depth);
      if (!n.kids.length) { n.x = slot++; return; }
      n.kids.forEach(place);
      n.x = (n.kids[0].x + n.kids[n.kids.length - 1].x) / 2;
    }
    roots.forEach(place);

    var SW = 112, SH = 112, PADX = 24, PADY = 18;
    var W = Math.max(slot, 1) * SW + PADX * 2, H = (maxDepth + 1) * SH + PADY * 2;
    function cx(n) { return PADX + n.x * SW + SW / 2; }
    function cy(n) { return PADY + n.depth * SH + 26; }

    var svg = '<svg class="rete-svg" viewBox="0 0 ' + W + " " + H + '" style="max-width:' + W + "px;min-width:" + Math.min(W, 420) + 'px" role="img" aria-label="' +
      esc(fig.querySelector("figcaption") ? fig.querySelector("figcaption").textContent : "Schema di rete") + '">';
    // le linee partono sotto il nome del nodo più in alto e arrivano sopra l'icona dell'altro,
    // così non attraversano mai le scritte
    links.forEach(function (l) {
      var a = l[0], c = l[1], x1, y1, x2, y2;
      if (a.depth === c.depth) {
        var dir = cx(c) > cx(a) ? 1 : -1;
        x1 = cx(a) + 26 * dir; y1 = cy(a); x2 = cx(c) - 26 * dir; y2 = cy(c);
      } else {
        if (a.depth > c.depth) { var t = a; a = c; c = t; }
        x1 = cx(a); y1 = cy(a) + (a.label ? 62 : 46); x2 = cx(c); y2 = cy(c) - 24;
      }
      svg += '<line class="rete-link" x1="' + x1 + '" y1="' + y1 + '" x2="' + x2 + '" y2="' + y2 + '"/>';
    });
    nodes.forEach(function (n) {
      var g = GLYPH[n.type] || GLYPH.pc;
      svg += '<g class="rete-node rete-' + esc(n.type) + '" transform="translate(' + (cx(n) - 20) + "," + (cy(n) - 20) + ')">' +
        '<rect class="rete-halo" x="-4" y="-4" width="48" height="48" rx="10"/>' + g + "</g>" +
        '<text class="rete-name" x="' + cx(n) + '" y="' + (cy(n) + 40) + '" text-anchor="middle">' + esc(n.name) + "</text>" +
        (n.label ? '<text class="rete-label" x="' + cx(n) + '" y="' + (cy(n) + 56) + '" text-anchor="middle">' + esc(n.label) + "</text>" : "");
    });
    svg += "</svg>";
    var holder = document.createElement("div");
    holder.className = "rete-scroll";
    holder.innerHTML = svg;
    fig.insertBefore(holder, fig.firstChild);
  });

  /* =================================================================
   * Schema di sequenza (chi manda cosa a chi, dall'alto in basso):
   * <figure class="seq" data-attori="Client | Server"
   *         data-passi="Client > Server : SYN; Server > Client : SYN, ACK; = connessione aperta">
   * "A > B : testo" = freccia da A a B · "= testo" = linea di separazione con nota
   * ================================================================= */
  var seqN = 0;
  main.querySelectorAll("figure.seq[data-passi]").forEach(function (fig) {
    var actors = (fig.getAttribute("data-attori") || "Client | Server").split("|").map(function (x) { return x.trim(); });
    var steps = fig.getAttribute("data-passi").split(";").map(function (x) { return x.trim(); }).filter(Boolean);
    var W = 400, X = [70, 330], TOP = 46, ROW = 40;
    var H = TOP + steps.length * ROW + 16;
    var id = "seqh" + (seqN++);
    var out = '<svg class="seq-svg" viewBox="0 0 ' + W + " " + H + '" role="img" aria-label="' +
      esc(fig.querySelector("figcaption") ? fig.querySelector("figcaption").textContent : "Schema di sequenza") + '">' +
      '<defs><marker id="' + id + '" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">' +
      '<path class="seq-head" d="M0 0L10 5L0 10z"/></marker></defs>';
    actors.slice(0, 2).forEach(function (name, i) {
      out += '<rect class="seq-actor" x="' + (X[i] - 56) + '" y="4" width="112" height="28" rx="6"/>' +
        '<text class="seq-actor-name" x="' + X[i] + '" y="23" text-anchor="middle">' + esc(name) + "</text>" +
        '<line class="seq-life" x1="' + X[i] + '" y1="32" x2="' + X[i] + '" y2="' + (H - 6) + '"/>';
    });
    steps.forEach(function (st, i) {
      var y = TOP + i * ROW + 16;
      if (st[0] === "=") {
        out += '<line class="seq-sep" x1="12" y1="' + (y + 4) + '" x2="' + (W - 12) + '" y2="' + (y + 4) + '"/>' +
          '<text class="seq-note" x="' + W / 2 + '" y="' + y + '" text-anchor="middle">' + esc(st.slice(1).trim()) + "</text>";
        return;
      }
      var m = st.match(/^(.+?)\s*>\s*(.+?)\s*:\s*(.*)$/);
      if (!m) return;
      var from = actors.indexOf(m[1].trim()), to = actors.indexOf(m[2].trim());
      if (from < 0 || to < 0) return;
      var x1 = X[from] + (to > from ? 4 : -4), x2 = X[to] + (to > from ? -6 : 6);
      out += '<line class="seq-msg ' + (from === 0 ? "seq-req" : "seq-res") + '" x1="' + x1 + '" y1="' + y + '" x2="' + x2 + '" y2="' + (y + 12) +
        '" marker-end="url(#' + id + ')"/>' +
        '<text class="seq-label" x="' + W / 2 + '" y="' + (y + 1) + '" text-anchor="middle">' + esc(m[3]) + "</text>";
    });
    out += "</svg>";
    var holder = document.createElement("div");
    holder.className = "seq-box";
    holder.innerHTML = out;
    fig.insertBefore(holder, fig.firstChild);
  });

  /* ---------- Esercizi: mostra/nascondi tutte le soluzioni ---------- */
  main.querySelectorAll("[data-toggle-solutions]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var sols = main.querySelectorAll("details.soluzione");
      var anyClosed = Array.prototype.some.call(sols, function (d) { return !d.open; });
      sols.forEach(function (d) { d.open = anyClosed; });
      btn.textContent = anyClosed ? "Nascondi le soluzioni" : "Mostra tutte le soluzioni";
    });
  });

  SITE.highlight = highlight;
});
