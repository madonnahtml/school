"""Rigenera le pagine "struttura" del sito (home, cerca, riassunti, esercizi, classroom, ripasso, panoramiche materie).
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
  <meta name="theme-color" content="#faf8f3">
  <link rel="manifest" href="{r}manifest.webmanifest">
  <link rel="icon" href="{r}assets/img/icon.svg" type="image/svg+xml">
  <link rel="apple-touch-icon" href="{r}assets/img/icon-180.png">
  <link rel="stylesheet" href="{r}assets/css/style.css?v=11">
  <script src="{r}assets/js/site.js?v=11"></script>
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

page('index.html', 'Scuola', 'Quaderno di studio diviso per materie, con ricerca, riassunti e progressi.', '''
  <header class="home-head">
    <h1>Materie</h1>
    <p class="lead">Scegli il quaderno da aprire.</p>
  </header>

  <div data-recent hidden></div>

  <div class="covers" data-subject-grid></div>

  <div class="home-links">
    <a class="home-sum" href="riassunti.html">
      <span class="home-sum-text"><strong>Riassunti</strong><span>Tutti i capitoli in breve, paragrafo per paragrafo.</span></span>
      <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
    </a>
    <a class="home-sum" href="esercizi.html">
      <span class="home-sum-text"><strong>Esercizi</strong><span>Consegne ed esercizi per ogni argomento, con le soluzioni spiegate.</span></span>
      <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
    </a>
    <a class="home-sum" href="classroom.html">
      <span class="home-sum-text"><strong>Esercitazioni Classroom</strong><span>Le esercitazioni assegnate su Classroom: consegne, risposte e spiegazioni.</span></span>
      <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
    </a>
  </div>

  <section class="panel review-panel" data-review-summary data-feature="ripasso">
    <h2>Ripasso di oggi</h2>
    <p class="review-big"><strong data-due>–</strong><span data-due-label>carte da ripassare oggi</span></p>
    <p class="review-sub"><span data-quiz-n>–</span> domande di quiz disponibili</p>
    <a class="btn" href="ripasso.html">Apri il ripasso</a>
  </section>
''', attrs=' data-toc="off"')

page('riassunti.html', 'Riassunti · Scuola', 'I riassunti di tutti i capitoli, paragrafo per paragrafo.', '''
  <div class="riassunti" data-riassunti>
    <h1>Riassunti</h1>
    <p class="lead">Le idee da ricordare di ogni capitolo, divise per paragrafo. Tocca un capitolo per aprirlo.</p>
    <div class="search-filters" data-sum-filters aria-label="Filtra per materia"></div>
    <div data-sum-list></div>
  </div>
''', attrs=' data-toc="off"')

page('esercizi.html', 'Esercizi · Scuola', 'Consegne ed esercizi per ogni argomento, con le soluzioni spiegate passo passo.', '''
  <div class="esercizi-area" data-esercizi>
    <h1>Esercizi</h1>
    <p class="lead">Consegne ed esercizi per ogni argomento spiegato, dal più facile al più difficile, con le <strong>soluzioni spiegate passo passo</strong>. In fondo a ogni pagina c'è un esercizio completo che mette insieme tutto il capitolo.</p>
    <p class="ex-count" data-ex-count></p>
    <div class="callout tip"><span class="callout-title">Come allenarsi</span>Leggi la consegna e prova da solo, su carta o al computer. Apri la soluzione solo dopo: anche un tentativo sbagliato ti fa capire molto di più che leggere subito la risposta.</div>
    <div data-ex-list></div>
  </div>
''', attrs=' data-toc="off"')

page('classroom.html', 'Esercitazioni Classroom · Scuola', 'Le esercitazioni assegnate su Classroom: consegne riportate fedelmente, risposte e spiegazioni delle risposte.', '''
  <div class="esercizi-area" data-classroom>
    <h1>Esercitazioni Classroom</h1>
    <p class="lead">Le esercitazioni che il professore ha assegnato su <strong>Classroom</strong>, una pagina per ognuna: la <strong>consegna</strong> riportata fedelmente, la <strong>risposta</strong> (programmi compilati ed eseguiti davvero, con il loro output) e la <strong>spiegazione</strong> di ogni risposta.</p>
    <p class="ex-count" data-ex-count></p>
    <div class="callout tip"><span class="callout-title">Come usarle</span>Prima prova a svolgere l'esercitazione da solo, come faresti per consegnarla. Poi apri la risposta e confronta: la spiegazione ti dice <strong>perché</strong> si fa così e quali errori evitare.</div>
    <div data-ex-list></div>
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
    <div class="subject-label">
      <h1>{name}</h1>
      <p class="lead">{desc}</p>
      <div data-subject-progress></div>
    </div>
  </header>

  <p>{intro}</p>

  <h2>Capitoli</h2>
  <div data-subject-pages></div>

  <section data-subject-exercises hidden>
    <h2>Esercizi</h2>
    <p>Consegne ed esercizi per ogni capitolo, con le soluzioni spiegate passo passo.</p>
    <div data-list></div>
  </section>

  <section data-subject-classroom hidden>
    <h2>Esercitazioni Classroom</h2>
    <p>Le esercitazioni assegnate su Classroom, con consegna, risposta e spiegazione.</p>
    <div data-list></div>
  </section>

  <h2>Come studiare</h2>
  <ol>
{li}
  </ol>
''', attrs=f' data-subject="{sid}" data-toc="off"', r='../../')
