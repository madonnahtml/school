# Scuola

Quaderno di studio diviso per materie: Informatica, Sistemi e Reti, TPSIT, GPOI, Storia, Italiano, Inglese.
Solo HTML, CSS e JavaScript: niente da compilare o installare. Funziona da computer e da telefono, anche offline.

## Cosa c'è

- **Ricerca** in tutte le pagine (`Ctrl K`, `/` o il tasto *Cerca* in basso sul telefono), senza distinzione di maiuscole e accenti; `"tra virgolette"` per una frase esatta. Ogni risultato porta alla sezione giusta e le parole vengono evidenziate.
- **Progressi**: ogni argomento si può segnare come *studiato*; menu, panoramiche e home mostrano quanti ne hai fatti per materia.
- **Ripasso** (`ripasso.html`): raccoglie da solo tutte le flashcard e i quiz delle pagine.
  - Flashcard con il metodo a scatole (Leitner): le carte che sai tornano dopo 1, 2, 4, 8, 16 giorni.
  - Quiz di 10 domande a caso con punteggio e miglior risultato.
- **Codice colorato** (c, cpp, java, python, js, sql, bash, html) con pulsante Copia.
- **Schemi di rete** disegnati da un elenco di nodi e collegamenti.
- **Offline / app**: dal telefono, *Aggiungi a schermata Home* per usarlo come un'app; le pagine già aperte restano disponibili senza connessione.
- Tema chiaro "quaderno" e scuro "lavagna", automatico o dal pulsante in alto.

Progressi e ripasso sono salvati nel browser del dispositivo che usi.

## Struttura

```
index.html · cerca.html · ripasso.html · componenti.html
materie/<materia>/index.html     panoramica della materia
materie/<materia>/<pagina>.html  argomenti
assets/js/site.js                ELENCO DI MATERIE E PAGINE (si parte da qui)
assets/js/layout.js              menu, barra in basso, progressi, indice pagina
assets/js/components.js          codice, flashcard, quiz, schemi di rete
assets/js/search.js              ricerca
assets/js/ripasso.js             pagina Ripasso
assets/css/style.css             grafica
sw.js · manifest.webmanifest     offline e installazione come app
tools/pagine.py                  rigenera home, cerca, ripasso e panoramiche
```

## Aggiungere una pagina

1. Copia il modello in fondo a `componenti.html` in `materie/<materia>/nome.html`.
2. Aggiungi una riga in `assets/js/site.js`, nell'array `pages` della materia:
   ```js
   { title: "Subnetting", path: "materie/sistemi-e-reti/subnetting.html", type: "esercizi" },
   ```
   Tipi: `teoria`, `esercizi`, `laboratorio`, `riassunto`, `verifica`, `vocabolario`.

`componenti.html` contiene tutti i blocchi (box, esercizi, codice, flashcard, quiz, schemi di rete, linee del tempo…) con l'HTML da copiare.

Le pagine *I cicli in C*, *Il modello ISO/OSI*, *L'Unità d'Italia* e *Irregular verbs* sono esempi: si possono tenere, modificare o eliminare (togliendo anche la riga in `site.js`).

## Vederlo in locale

```sh
python3 -m http.server 8000   # poi apri http://localhost:8000
```

## Pubblicarlo con GitHub Pages

GitHub Pages gratuito richiede che il repository sia **pubblico**:
Settings → General → Change visibility → Public, poi Settings → Pages → *Deploy from a branch* → `main` / `(root)`.
Il sito sarà su `https://madonnahtml.github.io/school/`.
