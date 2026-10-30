# Scuola

Quaderno di studio diviso per materie: Informatica, Sistemi e Reti, TPSIT, GPOI, Storia, Italiano, Inglese.
Solo HTML, CSS e JavaScript: niente da compilare o installare. Funziona da computer e da telefono, anche offline.

## Cosa c'è

- **Ricerca** in tutte le pagine (`Ctrl K`, `/` o il tasto *Cerca* in basso sul telefono), senza distinzione di maiuscole e accenti; `"tra virgolette"` per una frase esatta. Ogni risultato porta alla sezione giusta e le parole vengono evidenziate.
- **Materie come quaderni**: in home ogni materia è una copertina colorata; aprendola si sceglie il capitolo, con l'elenco dei paragrafi.
- **Riassunti** (`riassunti.html`): le idee da ricordare di ogni capitolo, paragrafo per paragrafo, divise per materia. Ogni scheda porta al paragrafo nel capitolo.
- **Esercizi** (`esercizi.html`): l'area con consegne ed esercizi per ogni argomento, con le soluzioni spiegate passo passo e un esercizio completo alla fine di ogni pagina. Raccoglie da sola tutte le pagine di tipo `esercizi`; ogni capitolo di teoria ha il link ai suoi esercizi e viceversa.
- **Esercitazioni Classroom** (`classroom.html`): le esercitazioni assegnate dal professore su Classroom, una pagina per ognuna, con la consegna riportata fedelmente, la risposta (programmi compilati ed eseguiti con Java 21, con l'output vero) e la spiegazione di ogni risposta. Raccoglie da sola tutte le pagine di tipo `classroom`; ogni capitolo di teoria ha il link alla sua esercitazione.
- **Progressi**: ogni capitolo si può segnare come *studiato*; menu, copertine e panoramiche mostrano quanti ne hai fatti. In fondo a ogni capitolo c'è il link al successivo.
- **Ripasso** (`ripasso.html`, ora **disattivato**): raccoglie da solo flashcard e quiz delle pagine, con metodo a scatole (Leitner) e quiz a punteggio. Per ora le pagine non hanno flashcard né quiz; si riattiva in `assets/js/site.js` con `features: { ripasso: true }`.
- **Codice colorato** (c, cpp, java, python, js, sql, bash, html) con pulsante Copia.
- **Schemi di rete** disegnati da un elenco di nodi e collegamenti.
- **Offline / app**: dal telefono, *Aggiungi a schermata Home* per usarlo come un'app; le pagine già aperte restano disponibili senza connessione.
- Grafica a quaderno (carta a righe, margine rosso, evidenziatore) con animazioni brevi, che si spengono se sul dispositivo è attivo "riduci movimento".

Progressi e ripasso sono salvati nel browser del dispositivo che usi.

## Struttura

```
index.html · cerca.html · riassunti.html · esercizi.html · classroom.html · ripasso.html · componenti.html
materie/<materia>/index.html     panoramica della materia
materie/<materia>/<pagina>.html  argomenti
assets/js/site.js                ELENCO DI MATERIE E PAGINE (si parte da qui)
assets/js/riassunti.js           TESTI DEI RIASSUNTI (uno per capitolo, diviso per paragrafo)
assets/js/layout.js              menu, barra in basso, home, capitoli, riassunti, esercizi, classroom, progressi, indice
assets/js/components.js          codice, flashcard, quiz, schemi di rete
assets/js/search.js              ricerca
assets/js/ripasso.js             pagina Ripasso
assets/css/style.css             grafica
sw.js · manifest.webmanifest     offline e installazione come app
tools/pagine.py                  rigenera home, cerca, riassunti, esercizi, classroom, ripasso e panoramiche
```

## Aggiungere una pagina

1. Copia il modello in fondo a `componenti.html` in `materie/<materia>/nome.html`.
2. Aggiungi una riga in `assets/js/site.js`, nell'array `pages` della materia:
   ```js
   { title: "Subnetting", path: "materie/sistemi-e-reti/subnetting.html", type: "esercizi" },
   ```
   Tipi: `teoria`, `esercizi`, `classroom`, `laboratorio`, `riassunto`, `verifica`, `vocabolario`.
   Le pagine `esercizi` vanno nell'area Esercizi e le pagine `classroom` nell'area Esercitazioni Classroom; per entrambe si possono aggiungere `of` (il capitolo di teoria collegato), `n` (quanti esercizi) e `desc` (una riga di descrizione).

3. (Facoltativo) aggiungi il suo riassunto in `assets/js/riassunti.js`: una voce per ogni `<h2>` della pagina, con lo stesso titolo.

`componenti.html` contiene tutti i blocchi (box, esercizi, codice, flashcard, quiz, schemi di rete, linee del tempo…) con l'HTML da copiare.

Pagine di appunti: Informatica → *Java: array, wrapper, metodi e overload*, *Java: programmazione a oggetti*, *Java: gestione dei file*, *Java: eccezioni*, *Java: Collections, ArrayList, Vector e LinkedList*, *Java: HashMap*; Esercizi di Informatica → una pagina per ognuno dei sei capitoli di Java più *Esercizi completi: tutto Java insieme* (107 esercizi, ogni programma compilato ed eseguito con Java 21); Sistemi e Reti → *Il livello delle applicazioni*, *Posta elettronica, DNS e Telnet*, *HTTP: la comunicazione nel Web*, *HTTP: i metodi (verbi)*, *HTTP: codici di stato e HTTPS*, *L'autenticazione con HTTP*; TPSIT → *Sistemi distribuiti*, *Il protocollo HTTP*, *Il linguaggio XML*, *Lo schema DTD*, *Il linguaggio JSON*, *I metodi HTTP e le API REST*, *I codici di stato e HTTPS*; Classroom di TPSIT → *HTTP e Postman (Parte 1)* (9 esercizi con richieste vere su JSONPlaceholder e httpbin). GPOI → *Azienda e funzioni aziendali*, *Il modello microeconomico*, *I costi aziendali*, *Il punto di pareggio (BEP)*; Esercizi di GPOI → *Domanda, ricavo e tassa sul venditore*, *Costi fissi, variabili e semivariabili*, *Il BEP con Excel*, più quattro pagine di *Allenamento* (una per capitolo, 41 esercizi dal facile al difficile). Le pagine *L'Unità d'Italia* e *Irregular verbs* sono esempi: si possono tenere, modificare o eliminare (togliendo anche la riga in `site.js`).

## Vederlo in locale

```sh
python3 -m http.server 8000   # poi apri http://localhost:8000
```

## Pubblicarlo con GitHub Pages

Il repository è pubblico e GitHub Pages è attivo: Settings → Pages → *Deploy from a branch* → `main` / `(root)`.
Il sito è su `https://madonnahtml.github.io/school/` e si aggiorna da solo a ogni modifica caricata su quel branch
(dopo una modifica il nuovo sito arriva in 1-2 minuti; se non cambia, ricarica la pagina).
