/*
 * riassunti.js — i riassunti di ogni capitolo, paragrafo per paragrafo.
 *
 * Chiave = percorso della pagina (lo stesso di site.js).
 *   breve:   una frase che dice di cosa parla il capitolo
 *   sezioni: un elemento per ogni paragrafo (<h2>) della pagina
 *     titolo: deve essere UGUALE al testo dell'<h2>, così il link porta al punto giusto
 *     punti:  le idee da ricordare (si può usare <strong>, <em>, <code>)
 *
 * Compaiono nella pagina Riassunti e nell'elenco capitoli della materia.
 */
SITE.riassunti = {
  /* ---------------- TPSIT ---------------- */
  "materie/tpsit/sistemi-distribuiti.html": {
    breve: "Tanti computer che collaborano scambiandosi messaggi e che all'utente sembrano uno solo.",
    sezioni: [
      {
        titolo: "Centralizzato o distribuito",
        punti: [
          "<strong>Centralizzato</strong>: tutto sta su un'unica macchina (server o mainframe). I terminali mostrano e raccolgono i dati, ma non elaborano niente.",
          "Difetti: c'è un <strong>singolo punto di guasto</strong> e con troppi utenti il nodo centrale va in <strong>congestione</strong>.",
          "<strong>Distribuito</strong>: tanti <strong>nodi</strong> che comunicano solo scambiandosi messaggi in rete, senza memoria in comune.",
          "<strong>Trasparenza</strong>: chi lo usa lo vede come un unico sistema.",
        ],
      },
      {
        titolo: "Client, server e actor",
        punti: [
          "Il <strong>client</strong> chiede, il <strong>server</strong> prepara e risponde.",
          "L'<strong>actor</strong> fa entrambi i ruoli, come il cameriere: server per il cliente, client per la cucina.",
          "Client e server sono <strong>ruoli di un programma</strong>, non tipi di computer.",
        ],
      },
      {
        titolo: "Come si classificano",
        punti: [
          "<strong>Per scopo</strong>: di calcolo (simulazioni, grafica 3D) o di dati (banche, e-commerce, social).",
          "<strong>Per architettura</strong>: client-server (siti web, posta) o peer-to-peer (BitTorrent, eMule).",
        ],
      },
      {
        titolo: "Benefici e svantaggi",
        punti: [
          "Benefici: <strong>affidabilità</strong> (nodi ridondanti), integrazione dei sistemi <strong>legacy</strong>, <strong>trasparenza</strong>, <strong>prestazioni e scalabilità</strong>.",
          "Scalabilità <strong>verticale</strong> = un computer più potente; <strong>orizzontale</strong> = più computer (la scelta tipica dei sistemi distribuiti).",
          "Svantaggi: <strong>complessità</strong>, <strong>sicurezza</strong> (più porte da chiudere) e software più difficile da scrivere.",
        ],
      },
      {
        titolo: "Le 8 false credenze",
        punti: [
          "Sono le <em>fallacies of distributed computing</em> (Peter Deutsch, Sun Microsystems): cose comode che si danno per scontate, ma sono false.",
          "La rete è affidabile · la latenza è zero · la banda è infinita · la rete è sicura.",
          "La topologia non cambia · c'è un solo amministratore · il trasporto non costa niente · la rete è omogenea.",
          "Per ricordarle: la rete è una strada con buche, traffico, ladri, deviazioni, più enti, pedaggi e veicoli diversi.",
        ],
      },
      {
        titolo: "Applicazioni web: client-side e server-side",
        punti: [
          "<strong>Client-side</strong>: il lavoro si fa nel browser e alleggerisce il server.",
          "<strong>Server-side</strong>: il lavoro si fa sul server. Solo qui si usano il <strong>database</strong> e i file del server, e i dati sono uguali per tutti.",
          "Il ciclo: il browser manda una <strong>HTTP Request</strong>, il server la elabora e risponde con una <strong>HTTP Response</strong>.",
          "Linguaggi di <strong>mark-up</strong> (HTML, XML: la struttura) e di <strong>programmazione</strong> (Java, PHP, JavaScript: le istruzioni).",
        ],
      },
      {
        titolo: "Il modello client-server",
        punti: [
          "Il server è il processo che gestisce le risorse, i client chiedono di usarle. Un server può diventare client di un altro server.",
          "Il <strong>middleware</strong> è il software di mezzo che permette l'<strong>invocazione remota</strong>.",
          "Servizi tipici: <strong>Telnet</strong>, <strong>HTTP</strong>, <strong>FTP</strong>, <strong>SMTP</strong> e <strong>IMAP</strong>.",
        ],
      },
      {
        titolo: "One-tier, two-tier, three-tier",
        punti: [
          "Un <strong>tier</strong> (livello) è un nodo o un gruppo di nodi con un compito preciso.",
          "<strong>Three-tier</strong>: presentazione (front-end), logica (back-end), dati (database).",
          "Regola d'oro: interfaccia e database comunicano <strong>sempre passando dal livello di mezzo</strong>.",
          "<strong>Two-tier</strong>: solo per piccole applicazioni. <strong>One-tier</strong>: terminali e mainframe degli anni '70.",
        ],
      },
      {
        titolo: "Applicazioni di rete, ISO/OSI e TCP/IP",
        punti: [
          "Un'<strong>applicazione di rete</strong> è fatta da più programmi su due o più computer: posta, chat, streaming, VoIP.",
          "I dati viaggiano in <strong>pacchetti</strong>, ognuno con un'intestazione che dice da dove arriva e dove va.",
          "<strong>ISO/OSI</strong>: modello astratto a 7 livelli. <strong>TCP/IP</strong>: quello usato davvero da Internet, a 4 strati.",
        ],
      },
      {
        titolo: "L'architettura P2P",
        punti: [
          "Ogni <strong>peer</strong> è sia client sia server e condivide dati, memoria e banda.",
          "<strong>Decentralizzato</strong>: si chiede ai vicini. Resiste ai guasti, ma le ricerche sono lente.",
          "<strong>Centralizzato</strong>: un directory server sa chi ha cosa (Napster). Ricerche veloci, ma è un singolo punto debole.",
          "<strong>Ibrido</strong>: i <strong>supernodi</strong>, scelti con un algoritmo di elezione, fanno da indice per i leaf peer.",
        ],
      },
    ],
  },

  "materie/tpsit/protocollo-http.html": {
    breve: "Il protocollo con cui il browser chiede risorse a un web server: richieste e risposte di testo.",
    sezioni: [
      {
        titolo: "Client attivo, server passivo",
        punti: [
          "Il <strong>client</strong> (il browser) prende l'iniziativa: apre la connessione e chiede una risorsa con un <strong>URL</strong>.",
          "Il <strong>server</strong> resta in ascolto su una porta TCP (di solito la <strong>80</strong>) e risponde solo quando riceve una richiesta.",
          "HTTP trasmette <strong>risorse</strong>: file, ma anche contenuti generati al momento, come il risultato di una ricerca.",
        ],
      },
      {
        titolo: "URI, URL e URN",
        punti: [
          "<strong>URI</strong> identifica una risorsa, l'<strong>URL</strong> dice dove si trova e come raggiungerla, l'<strong>URN</strong> le dà un nome stabile. URI = URL + URN.",
          "Esempio: il codice ISBN di un libro è un URN, \"scaffale 3, ripiano 2\" è un URL.",
          "Sintassi: <code>schema://utente:password@host:porta/path?query#fragment</code>.",
          "Porta predefinita <strong>80</strong> per http e <strong>443</strong> per https. Il <strong>fragment</strong> non viene mai spedito al server.",
        ],
      },
      {
        titolo: "Dove sta HTTP nella pila TCP/IP",
        punti: [
          "HTTP è un protocollo di <strong>livello applicazione</strong>: si appoggia su <strong>TCP</strong>, che a sua volta usa IP.",
          "È un protocollo <strong>testuale</strong>: i messaggi sono righe di testo leggibili.",
        ],
      },
      {
        titolo: "Come avviene una comunicazione",
        punti: [
          "Il client apre una connessione TCP sulla porta 80, manda la <strong>request</strong>, il server risponde con la <strong>response</strong> e chiude.",
          "Prima serve la stretta di mano TCP (<em>three-way handshake</em>): <strong>SYN</strong>, <strong>SYN-ACK</strong>, <strong>ACK</strong>.",
          "HTTP è <strong>stateless</strong>: ogni richiesta è indipendente. Per ricordarsi di te i siti usano i <strong>cookie</strong>.",
          "Una pagina con immagini richiede di ripetere tutto per ogni file, e questo è lento.",
        ],
      },
      {
        titolo: "HTTP/1.0 e HTTP/1.1: le connessioni",
        punti: [
          "<strong>HTTP/1.0</strong> (1996) è <strong>non persistente</strong>: una connessione TCP per ogni richiesta.",
          "<strong>HTTP/1.1</strong> (1999) è <strong>persistente</strong>: la stessa connessione serve più richieste e si chiude dopo un <strong>timeout</strong>.",
          "Non incanalata = una richiesta alla volta. <strong>Pipelining</strong> = più richieste di fila, le risposte tornano nello stesso ordine.",
          "Il pipelining soffre di <strong>head-of-line blocking</strong> e i browser moderni lo disattivano. La cifratura la dà <strong>HTTPS</strong>, non la versione.",
        ],
      },
      {
        titolo: "I messaggi HTTP",
        punti: [
          "Ogni messaggio ha quattro parti: <strong>riga iniziale</strong>, <strong>header</strong>, <strong>riga vuota</strong> e <strong>corpo</strong> (facoltativo).",
          "Ogni riga finisce con <strong>CRLF</strong> (<code>\\r\\n</code>). Ogni header si scrive <code>nome: valore</code>.",
        ],
      },
      {
        titolo: "La richiesta (request)",
        punti: [
          "La riga di richiesta ha <strong>metodo</strong>, <strong>URI</strong> e <strong>versione</strong>: <code>GET /file.html HTTP/1.1</code>.",
          "Metodi: <code>GET</code>, <code>HEAD</code>, <code>POST</code>, <code>PUT</code>, <code>DELETE</code>, <code>OPTIONS</code>, <code>TRACE</code>, <code>CONNECT</code>.",
          "<strong>GET</strong> mette i dati nell'URL e serve per leggere. <strong>POST</strong> li mette nel corpo e serve per inviare: le password non vanno mai nell'URL.",
          "Header principali: <code>Host</code> (obbligatorio in HTTP/1.1), <code>User-Agent</code>, <code>Accept</code> (tipi MIME), <code>Content-Type</code>, <code>Content-Length</code>, <code>Connection</code>.",
        ],
      },
      {
        titolo: "La risposta (response)",
        punti: [
          "La prima riga è la <strong>riga di stato</strong>: versione, codice e messaggio, ad esempio <code>HTTP/1.1 200 OK</code>.",
          "Codici: <strong>1xx</strong> informazione, <strong>2xx</strong> successo, <strong>3xx</strong> reindirizzamento, <strong>4xx</strong> errore del client, <strong>5xx</strong> errore del server.",
          "Header principali: <code>Date</code>, <code>Server</code>, <code>Last-Modified</code>, <code>Content-Type</code>, <code>Content-Length</code>, <code>Cache-Control</code>.",
          "Il corpo contiene di solito la pagina HTML, oppure dati <strong>JSON</strong> se il client chiede <code>Accept: application/json</code>.",
        ],
      },
    ],
  },

  /* ---------------- Informatica ---------------- */
  "materie/informatica/cicli-in-c.html": {
    breve: "I tre modi per ripetere delle istruzioni in C: for, while e do-while.",
    sezioni: [
      {
        titolo: "Il ciclo for",
        punti: [
          "Si usa quando sai <strong>quante volte</strong> ripetere.",
          "L'intestazione ha tre parti: <strong>inizializzazione</strong>, <strong>condizione</strong>, <strong>aggiornamento</strong>, come in <code>for (int i = 1; i &lt;= 5; i++)</code>.",
        ],
      },
      {
        titolo: "Il ciclo while",
        punti: [
          "Controlla la condizione <strong>prima</strong> di ogni giro: se è falsa subito, il corpo non viene mai eseguito.",
          "Si usa quando <strong>non sai</strong> quante volte ripetere.",
        ],
      },
      {
        titolo: "Il ciclo do-while",
        punti: [
          "Controlla la condizione <strong>dopo</strong> ogni giro, quindi il corpo viene eseguito <strong>almeno una volta</strong>. Ideale per menu e controllo dell'input.",
          "Un <strong>ciclo infinito</strong> non diventa mai falso, come <code>while (1)</code>.",
          "<code>break</code> esce subito dal ciclo, <code>continue</code> salta al giro successivo.",
        ],
      },
    ],
  },

  /* ---------------- Sistemi e Reti ---------------- */
  "materie/sistemi-e-reti/modello-iso-osi.html": {
    breve: "Il modello di riferimento che divide la comunicazione in rete in sette livelli.",
    sezioni: [
      {
        titolo: "I sette livelli",
        punti: [
          "Dal basso: <strong>F</strong>isico, <strong>C</strong>ollegamento, <strong>R</strong>ete, <strong>T</strong>rasporto, <strong>S</strong>essione, <strong>P</strong>resentazione, <strong>A</strong>pplicazione.",
          "Ogni livello offre servizi a quello sopra e usa quelli del livello sotto.",
          "Esempi: HTTP e DNS (7), TCP e UDP (4), IP (3), Ethernet e MAC (2), cavi e onde radio (1).",
        ],
      },
      {
        titolo: "Incapsulamento",
        punti: [
          "Scendendo, ogni livello aggiunge la sua <strong>intestazione</strong>. Chi riceve fa il percorso inverso e la toglie.",
          "L'unità di dati di ogni livello è la <strong>PDU</strong>: segmento (4), pacchetto (3), frame (2), bit (1).",
          "Indirizzi: <strong>porta</strong> (4), <strong>IP</strong> (3), <strong>MAC</strong> (2).",
        ],
      },
      {
        titolo: "Dispositivi e livelli",
        punti: [
          "<strong>Hub</strong> = livello 1, ripete i segnali. <strong>Switch</strong> = livello 2, usa il MAC. <strong>Router</strong> = livello 3, usa l'IP.",
          "Internet usa <strong>TCP/IP</strong>, che riunisce i livelli 5, 6 e 7 nel solo livello di applicazione.",
        ],
      },
    ],
  },

  /* ---------------- Storia ---------------- */
  "materie/storia/unita-d-italia.html": {
    breve: "Come la penisola, divisa in più Stati, diventò un solo regno tra il 1848 e il 1871.",
    sezioni: [
      {
        titolo: "Linea del tempo",
        punti: [
          "<strong>1848</strong>: prima guerra d'indipendenza, Carlo Alberto è sconfitto. Resta lo Statuto Albertino.",
          "<strong>1858-1859</strong>: accordi di Plombières con la Francia, poi la seconda guerra (Magenta, Solferino). La Lombardia passa al Piemonte.",
          "<strong>1860-1861</strong>: spedizione dei Mille. Il 17 marzo 1861 nasce il Regno d'Italia, con capitale Torino.",
          "<strong>1866-1871</strong>: terza guerra e Veneto, presa di Roma da Porta Pia (1870), Roma capitale (1871).",
        ],
      },
      {
        titolo: "I protagonisti",
        punti: [
          "<strong>Cavour</strong>: diplomazia e alleanza con la Francia. <strong>Garibaldi</strong>: i Mille e la conquista del Sud.",
          "<strong>Mazzini</strong>: repubblicano, fonda la Giovine Italia. <strong>Vittorio Emanuele II</strong>: primo re d'Italia.",
          "Senza la Francia (1859) e la Prussia (1866) il Piemonte non avrebbe battuto l'Austria.",
        ],
      },
    ],
  },

  /* ---------------- Inglese ---------------- */
  "materie/inglese/irregular-verbs.html": {
    breve: "I verbi che non formano il passato con -ed: le tre forme vanno imparate a memoria.",
    sezioni: [
      {
        titolo: "Le tre forme",
        punti: [
          "<strong>Base form</strong> (infinito senza <em>to</em>), <strong>past simple</strong> e <strong>past participle</strong>.",
          "Il past participle serve per i tempi composti (<em>I have written</em>) e per il passivo.",
          "Studiali a gruppi: <em>buy – bought – bought</em> (due forme uguali), <em>begin – began – begun</em> (vocale i → a → u).",
        ],
      },
    ],
  },
};
