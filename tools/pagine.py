"""Rigenera le pagine "struttura" del sito (home, cerca, ripasso, panoramiche materie).
Le pagine degli argomenti NON vengono toccate. Uso: python3 tools/pagine.py"""
import os
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

HEAD = '''<!doctype html>
<html lang="it"{attrs}>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
  <title>{title}</title>
  <meta name="description" content="{desc}">
  <meta name="theme-color" content="#fbfcfe" media="(prefers-color-scheme: light)">
  <meta name="theme-color" content="#1b2723" media="(prefers-color-scheme: dark)">
  <link rel="manifest" href="{r}manifest.webmanifest">
  <link rel="icon" href="{r}assets/img/icon.svg" type="image/svg+xml">
  <link rel="apple-touch-icon" href="{r}assets/img/icon-180.png">
  <link rel="stylesheet" href="{r}assets/css/style.css?v=3">
  <script src="{r}assets/js/site.js?v=3"></script>
</head>
<body>
<main id="content">
'''
FOOT = '''</main>
</body>
</html>
'''
SEARCH = '<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>'

def page(path, title, desc, body, attrs='', r=''):
    full = os.path.join(ROOT, path)
    os.makedirs(os.path.dirname(full), exist_ok=True)
    with open(full, 'w') as f:
        f.write(HEAD.format(attrs=attrs, title=title, desc=desc, r=r) + body + FOOT)

page('index.html', 'Scuola', 'Quaderno di studio diviso per materie, con ricerca, progressi e ripasso.', f'''
  <header class="home-head">
    <span class="home-date" data-today></span>
    <h1>Cosa studiamo oggi?</h1>
    <p>Appunti ed esercizi di tutte le materie. Cerca una parola e la trovi ovunque sia scritta.</p>
    <form class="field" action="cerca.html" method="get" role="search">
      {SEARCH}
      <input id="home-q" type="search" name="q" placeholder="Cavour, router, present perfect…" aria-label="Cerca negli appunti" autocomplete="off" enterkeyhint="search">
      <button class="btn" type="submit">Cerca</button>
    </form>
  </header>

  <div class="home-grid">
    <section>
      <div class="block-title"><h2>Materie</h2><span>argomenti studiati</span></div>
      <div class="subject-list" data-subject-grid></div>
    </section>

    <aside class="home-side">
      <section class="panel review-panel" data-review-summary data-feature="ripasso">
        <h2>Ripasso di oggi</h2>
        <p class="review-big"><strong data-due>–</strong><span data-due-label>carte da ripassare oggi</span></p>
        <p class="review-sub"><span data-quiz-n>–</span> domande di quiz disponibili</p>
        <a class="btn" href="ripasso.html">Apri il ripasso</a>
      </section>

      <section class="panel" data-recent hidden>
        <h2>Riprendi da qui</h2>
        <div class="recent-list" data-recent-list></div>
      </section>

      <section class="panel home-shortcuts">
        <h2>Scorciatoie</h2>
        <ul class="home-tips">
          <li><kbd>Ctrl</kbd> <kbd>K</kbd> o <kbd>/</kbd> apre la ricerca</li>
          <li><code>"frase esatta"</code> tra virgolette</li>
          <li><code>perche</code> trova anche <em>perché</em></li>
        </ul>
      </section>
    </aside>
  </div>
''', attrs=' data-toc="off"')

page('cerca.html', 'Cerca · Scuola', 'Cerca in tutte le materie.', f'''
  <div class="search-page" data-search-page>
    <h1>Cerca</h1>
    <form class="field" role="search">
      {SEARCH}
      <input id="search-q" class="search-page-input" type="search" name="q" placeholder="Cerca parole, argomenti, esercizi…" aria-label="Testo da cercare" autocomplete="off" spellcheck="false" enterkeyhint="search">
    </form>
    <div class="search-filters" aria-label="Filtra per materia"></div>
    <p class="search-page-info" aria-live="polite"></p>
    <div class="search-page-results"></div>
  </div>
''', attrs=' data-toc="off"')

page('ripasso.html', 'Ripasso · Scuola', 'Flashcard e quiz raccolti da tutte le materie.', '''
  <div data-ripasso>
    <h1>Ripasso</h1>
    <p class="lead">Flashcard e quiz raccolti in automatico da tutte le pagine.</p>
    <div class="rip-modes" role="tablist" aria-label="Modalità">
      <button type="button" role="tab" data-mode="carte" aria-selected="true">Flashcard</button>
      <button type="button" role="tab" data-mode="quiz" aria-selected="false">Quiz</button>
    </div>
    <div class="rip-filters" aria-label="Materia"></div>
    <section class="rip-stage" aria-live="polite"></section>
  </div>
''', attrs=' data-toc="off" data-scripts="ripasso"')

SUBJECTS = [
 ("informatica", "INF", "Informatica", "Programmazione, algoritmi, strutture dati e basi di dati.",
  "Teoria spiegata passo passo e tanti esercizi di programmazione, ognuno con la soluzione commentata.",
  ["Leggi la teoria e prova subito gli esempi di codice.", "Risolvi gli esercizi <strong>prima</strong> di aprire la soluzione.", "Prima della verifica rifai gli esercizi senza guardare."]),
 ("sistemi-e-reti", "SIS", "Sistemi e Reti", "Architetture di rete, protocolli, indirizzamento IP e sicurezza.",
  "Modelli ISO/OSI e TCP/IP, protocolli, subnetting e configurazione dei dispositivi di rete.",
  ["Studia livelli e protocolli aiutandoti con gli schemi.", "Allenati con gli esercizi di indirizzamento e subnetting.", "Ripassa sigle e protocolli con le tabelle."]),
 ("tpsit", "TPS", "TPSIT", "Tecnologie e progettazione di sistemi informatici e di telecomunicazioni.",
  "Processi, thread, programmazione concorrente e di rete, applicazioni distribuite.",
  ["Capisci il concetto con la teoria.", "Leggi gli esempi di codice commentati.", "Rifai le attività di laboratorio."]),
 ("gpoi", "GPO", "GPOI", "Gestione progetto e organizzazione d'impresa.",
  "Project management, pianificazione, costi, organizzazione aziendale e casi pratici.",
  ["Impara le definizioni chiave.", "Applica i metodi ai casi pratici (WBS, Gantt, PERT).", "Ripassa con le schede riassuntive."]),
 ("storia", "STO", "Storia", "Eventi, periodi e collegamenti tra i fatti storici.",
  "Riassunti per periodo, linee del tempo e collegamenti tra cause e conseguenze.",
  ["Leggi il riassunto del periodo.", "Fissa le date con la linea del tempo.", "Collega cause e conseguenze."]),
 ("italiano", "ITA", "Italiano", "Autori, correnti letterarie, analisi del testo e produzione scritta.",
  "Autori e correnti letterarie, analisi dei testi e indicazioni per la scrittura.",
  ["Inquadra l'autore nel suo periodo.", "Analizza i testi principali.", "Esercitati con le tracce di scrittura."]),
 ("inglese", "ING", "Inglese", "Grammar, vocabulary, reading e technical English.",
  "Regole di grammatica, vocabolario (anche tecnico) ed esercizi con soluzioni.",
  ["Studia la regola con gli esempi.", "Memorizza il vocabolario con le tabelle.", "Fai gli esercizi e controlla le soluzioni."]),
]
for sid, short, name, desc, intro, steps in SUBJECTS:
    li = "\n".join(f"      <li>{s}</li>" for s in steps)
    page(f'materie/{sid}/index.html', f'{name} · Scuola', desc, f'''
  <header class="subject-header">
    <span class="subject-tab" aria-hidden="true">{short}</span>
    <div>
      <h1>{name}</h1>
      <p class="lead">{desc}</p>
      <div data-subject-progress></div>
    </div>
  </header>

  <p>{intro}</p>

  <h2>Argomenti</h2>
  <div data-subject-pages></div>

  <h2>Come studiare</h2>
  <ol>
{li}
  </ol>
''', attrs=f' data-subject="{sid}"', r='../../')
