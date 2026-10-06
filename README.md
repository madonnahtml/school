# Scuola

Sito statico per lo studio, diviso per materie: Informatica, Sistemi e Reti, TPSIT, GPOI, Storia, Italiano, Inglese.
Solo HTML, CSS e JavaScript: non c'è niente da compilare né da installare.

## Struttura

```
index.html              home con la griglia delle materie
cerca.html              pagina dei risultati di ricerca
componenti.html         catalogo dei blocchi grafici (box, esercizi, codice, tabelle…)
materie/<materia>/      una cartella per materia, index.html = panoramica
assets/css/style.css    stile (tema chiaro/scuro automatico)
assets/js/site.js       ELENCO DI MATERIE E PAGINE: menu e ricerca partono da qui
assets/js/layout.js     barra superiore, menu laterale, indice della pagina
assets/js/search.js     ricerca full-text
```

## Aggiungere una pagina

1. Crea il file, ad esempio `materie/informatica/cicli.html`, partendo dal modello in fondo a `componenti.html`.
2. Registralo in `assets/js/site.js` nell'array `pages` della materia:
   ```js
   { title: "Cicli", path: "materie/informatica/cicli.html", type: "esercizi" },
   ```
   Tipi disponibili: `teoria`, `esercizi`, `laboratorio`, `riassunto`, `verifica`.

Menu laterale, elenco argomenti della materia e ricerca si aggiornano da soli.

## Ricerca

- `Ctrl K` / `⌘ K` o `/` aprono la ricerca rapida da qualsiasi pagina.
- Non distingue maiuscole e accenti (`perche` trova *perché*).
- Più parole devono comparire tutte; `"tra virgolette"` cerca la frase esatta.
- Ogni risultato porta alla sezione giusta (titoli `h2`/`h3`) e le parole vengono evidenziate nella pagina.
- Per escludere una parte di pagina dalla ricerca: `data-search-ignore`.

## Vederlo in locale

La ricerca legge le pagine via HTTP, quindi aprire i file con doppio clic non basta:

```sh
python3 -m http.server 8000
# poi apri http://localhost:8000
```

## Pubblicazione

GitHub → **Settings → Pages** → *Deploy from a branch* → `main` / `(root)`.
