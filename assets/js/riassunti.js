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
  "materie/tpsit/xml.html": {
    breve: "Un insieme di regole per scrivere dati in un file di testo, con tag scelti da chi lo crea.",
    sezioni: [
      {
        titolo: "Perché serve XML",
        punti: [
          "<strong>XML</strong> (<em>eXtensible Markup Language</em>) è un insieme di regole per creare formati di <strong>testo</strong> facili da generare e da elaborare.",
          "Sistemi e database hanno formati incompatibili: convertire in XML <strong>semplifica lo scambio</strong> di dati.",
          "È <strong>senza ambiguità</strong>, <strong>estendibile</strong> (i tag li sceglie il programmatore) e <strong>indipendente dalla piattaforma</strong>.",
        ],
      },
      {
        titolo: "Un metalinguaggio di markup",
        punti: [
          "Un <strong>linguaggio di markup</strong> inserisce dei <strong>tag</strong> nel testo per distinguere le parti di un documento.",
          "XML è un <strong>metalinguaggio</strong>: serve a definire altri linguaggi di markup. Non ha tag predefiniti.",
          "Lo standard è del <strong>W3C</strong>; un documento XML è un file di testo con estensione <code>.xml</code>.",
          "<strong>Non è</strong> un linguaggio di presentazione, di programmazione, un protocollo di trasporto né un DBMS.",
        ],
      },
      {
        titolo: "XML e HTML a confronto",
        punti: [
          "XML <strong>descrive</strong> i dati, HTML li <strong>presenta</strong>.",
          "In XML i tag sono <strong>definiti dall'autore</strong>, in HTML sono <strong>standard</strong>.",
          "I dati restano <strong>separati dalla rappresentazione grafica</strong>.",
        ],
      },
      {
        titolo: "I file XML: vantaggi e svantaggi",
        punti: [
          "Vantaggi: linguaggi <strong>ad hoc</strong>, formato testuale leggibile e modificabile, indipendente dalla piattaforma, trasportabile con <strong>HTTP</strong>.",
          "Svantaggi: file <strong>più ingombranti</strong> dei formati binari e più costosi in risorse (trasmissione, memoria, CPU).",
        ],
      },
      {
        titolo: "La sintassi: prologo e corpo",
        punti: [
          "Un documento ha un <strong>prologo</strong> (dichiarazione XML con versione e codifica) e un <strong>corpo</strong>.",
          "Esempio di prologo: <code>&lt;?xml version=\"1.0\" encoding=\"UTF-8\"?&gt;</code>.",
          "Il corpo è una <strong>gerarchia di tag non sovrapposti</strong> con <strong>un solo elemento radice</strong> (root).",
        ],
      },
      {
        titolo: "I tag e gli elementi",
        punti: [
          "Un <strong>elemento</strong> = tag di apertura + contenuto + tag di chiusura: <code>&lt;nome&gt;Paolo&lt;/nome&gt;</code>.",
          "I tag sono <strong>case sensitive</strong>: <code>&lt;Nome&gt;</code> e <code>&lt;nome&gt;</code> sono diversi.",
          "Un elemento vuoto si può scrivere in forma abbreviata: <code>&lt;nometag/&gt;</code>.",
        ],
      },
      {
        titolo: "Gli attributi",
        punti: [
          "Danno <strong>informazioni aggiuntive</strong> sul tag: <code>nome=\"valore\"</code>, nel <strong>tag di apertura</strong>.",
          "Il valore va sempre tra <strong>apici</strong>. Si usano per identificativi e metadati.",
        ],
      },
      {
        titolo: "Commenti e caratteri speciali",
        punti: [
          "I commenti si scrivono <code>&lt;!-- così --&gt;</code>.",
          "I caratteri <code>&lt;</code> e <code>&amp;</code> si scrivono con le entità <code>&amp;lt;</code> e <code>&amp;amp;</code>.",
        ],
      },
      {
        titolo: "Documento ben formato e documento valido",
        punti: [
          "<strong>Ben formato</strong> = rispetta le regole <strong>sintattiche</strong> (obbligatorie). <strong>Valido</strong> = rispetta anche le regole <strong>semantiche</strong> (DTD o XSD).",
          "Un documento valido è sempre ben formato; un documento ben formato può non essere valido.",
          "Nomi dei tag: non iniziano con numero o underscore e non hanno spazi. Apertura e chiusura coincidono e sono ben nidificate.",
        ],
      },
      {
        titolo: "La gerarchia degli elementi",
        punti: [
          "Gli elementi sono <strong>nodi di un albero</strong>: una <strong>radice</strong>, che ha figli, che possono avere altri figli.",
        ],
      },
      {
        titolo: "Un esempio completo",
        punti: [
          "Nella rubrica la radice è <code>rubrica</code>, che contiene più elementi <code>persona</code>, ognuno con <code>nome</code>, <code>cognome</code>, telefoni ed email.",
          "Per scrivere un XML: trova la <strong>radice</strong>, gli elementi che si <strong>ripetono</strong> (le righe) e i <strong>campi</strong> di ognuno (le colonne).",
        ],
      },
    ],
  },
  "materie/tpsit/json.html": {
    breve: "Un formato di testo semplice e leggero per scrivere dati e scambiarli tra programmi.",
    sezioni: [
      {
        titolo: "Perché serve un formato per i dati",
        punti: [
          "<strong>JSON</strong> (<em>JavaScript Object Notation</em>) è un formato di <strong>testo</strong>, standard e aperto, per rappresentare e scambiare <strong>dati strutturati</strong>.",
          "È leggero e si legge facilmente sia da una persona sia da un programma.",
          "È <strong>indipendente dal linguaggio</strong>: qualsiasi linguaggio che sa analizzare una stringa può leggerlo.",
        ],
      },
      {
        titolo: "Dove si usa",
        punti: [
          "Risposte delle <strong>API</strong>, <strong>file di configurazione</strong>, comunicazione tra <strong>microservizi</strong>.",
          "<strong>Dati in tempo reale</strong> (chat, dashboard, risultati in diretta) e <strong>preferenze utente</strong> (lingua, tema, notifiche).",
        ],
      },
      {
        titolo: "XML e JSON a confronto",
        punti: [
          "Entrambi rappresentano dati strutturati.",
          "JSON è <strong>più piccolo</strong>, <strong>più semplice</strong> e <strong>più leggibile</strong>: il nome del campo si scrive una volta sola, in XML due (tag di apertura e chiusura).",
        ],
      },
      {
        titolo: "Le due strutture di JSON",
        punti: [
          "<strong>Oggetto</strong> <code>{ }</code>: un insieme di coppie <code>\"chiave\": valore</code>.",
          "<strong>Array</strong> <code>[ ]</code>: una lista <strong>ordinata</strong> di valori.",
          "Quasi tutti i linguaggi hanno già strutture simili (record, dizionari, array): per questo JSON si usa ovunque.",
        ],
      },
      {
        titolo: "Com'è fatto un oggetto",
        punti: [
          "Graffe <code>{ }</code> per aprire e chiudere, <strong>due punti</strong> tra chiave e valore, <strong>virgola</strong> tra le proprietà.",
          "Chiavi e stringhe sempre tra <strong>doppi apici</strong>. Niente virgola dopo l'ultimo elemento, niente commenti.",
        ],
      },
      {
        titolo: "I tipi di dato",
        punti: [
          "Sei tipi: <strong>stringa</strong>, <strong>numero</strong>, <strong>booleano</strong> (<code>true</code>/<code>false</code>), <strong>null</strong>, <strong>oggetto</strong>, <strong>array</strong>.",
          "<code>\"18\"</code> è una stringa, <code>18</code> un numero: non sono la stessa cosa.",
        ],
      },
      {
        titolo: "Gli array",
        punti: [
          "Tra parentesi quadre, valori separati da virgole; possono contenere qualunque tipo.",
          "L'ordine conta; il primo elemento ha indice <strong>0</strong>.",
        ],
      },
      {
        titolo: "Oggetti annidati",
        punti: [
          "Un oggetto può contenere altri oggetti: si ottiene una <strong>struttura gerarchica</strong>, ad albero.",
          "Ogni livello deve rispettare la sintassi: parentesi, doppi apici, due punti e virgole.",
        ],
      },
      {
        titolo: "Array di oggetti",
        punti: [
          "Un elenco di oggetti con le stesse proprietà, come le righe di una tabella.",
          "È la forma tipica con cui un server restituisce un <strong>elenco di record</strong>.",
        ],
      },
      {
        titolo: "JSON nelle applicazioni web",
        punti: [
          "Il client fa una richiesta, il server elabora e risponde con i dati in <strong>JSON</strong>, JavaScript li legge e <strong>aggiorna la pagina</strong>.",
        ],
      },
      {
        titolo: "JSON e JavaScript",
        punti: [
          "<code>JSON.stringify()</code>: da oggetto JavaScript a <strong>stringa</strong> JSON (per spedire o salvare).",
          "<code>JSON.parse()</code>: da stringa JSON a <strong>oggetto</strong> JavaScript (per usare i dati ricevuti).",
          "JSON è un <strong>formato di dati</strong>, JavaScript un <strong>linguaggio</strong>: non sono la stessa cosa.",
        ],
      },
    ],
  },

  /* ---------------- Informatica ---------------- */
  "materie/informatica/java-array-wrapper-metodi-overload.html": {
    breve: "Array per tenere tanti valori insieme, wrapper per trattare i numeri come oggetti, metodi per dividere il programma, overload per riusare lo stesso nome.",
    sezioni: [
      {
        titolo: "Che cos'è un array",
        punti: [
          "Un <strong>array</strong> contiene più valori dello <strong>stesso tipo</strong> in una sola variabile: <code>int[] voti = {7, 8, 6, 9};</code>",
          "La dimensione è <strong>fissa</strong>: si decide alla creazione e non cambia più.",
        ],
      },
      {
        titolo: "Creare un array e usare gli indici",
        punti: [
          "Due modi: con i valori <code>{10, 20, 30}</code> oppure vuoto con <code>new int[5]</code> (ogni elemento parte da <code>0</code>, <code>false</code> o <code>null</code>).",
          "Gli indici vanno da <strong>0</strong> a <strong>length − 1</strong>: <code>numeri[0]</code> è il primo.",
          "Un indice fuori dai limiti ferma il programma con <code>ArrayIndexOutOfBoundsException</code>.",
        ],
      },
      {
        titolo: "length, for e foreach",
        punti: [
          "<code>numeri.length</code> dà il numero di elementi, <strong>senza parentesi</strong> (per le stringhe invece è <code>length()</code>).",
          "<code>for (int i = 0; i &lt; numeri.length; i++)</code>: serve l'indice, per <strong>modificare</strong> o per posizioni precise.",
          "<code>for (int x : numeri)</code> (foreach): più compatto, per <strong>leggere</strong> tutti gli elementi; non modifica l'array.",
        ],
      },
      {
        titolo: "Esempio guidato: somma, media e massimo",
        punti: [
          "La somma parte da 0; il massimo parte dal <strong>primo elemento</strong>.",
          "Media: <code>(double) somma / numeri.length</code>. Senza cast, intero diviso intero perde i decimali.",
        ],
      },
      {
        titolo: "Wrapper classes",
        punti: [
          "Le <strong>wrapper</strong> sono oggetti che avvolgono i primitivi: <code>int</code>→<code>Integer</code>, <code>double</code>→<code>Double</code>, <code>boolean</code>→<code>Boolean</code>, <code>char</code>→<code>Character</code>.",
          "Servono nelle collezioni (<code>ArrayList&lt;Integer&gt;</code>) e per i loro metodi.",
          "<strong>Autoboxing</strong> (primitivo → wrapper) e <strong>unboxing</strong> (wrapper → primitivo) sono automatici.",
          "<code>Integer.parseInt(\"25\")</code>, <code>Double.parseDouble(\"12.5\")</code>, <code>Integer.toString(100)</code>.",
        ],
      },
      {
        titolo: "I metodi",
        punti: [
          "Un <strong>metodo</strong> è un blocco di codice con un nome e un compito: evita ripetizioni e rende il programma leggibile.",
          "<code>void</code>: fa un'azione e non restituisce nulla. Con un tipo di ritorno: consegna un valore con <code>return</code>.",
          "<strong>Parametro</strong> = variabile nell'intestazione; <strong>argomento</strong> = valore concreto passato nella chiamata.",
        ],
      },
      {
        titolo: "Metodi e array: un programma strutturato",
        punti: [
          "Un metodo può ricevere un array: <code>static int calcolaSomma(int[] n)</code>, chiamato con <code>calcolaSomma(numeri)</code>.",
          "<strong>Ogni metodo fa una sola cosa</strong>; i metodi possono riusarsi a vicenda.",
          "Se il metodo modifica un elemento dell'array ricevuto, cambia anche l'array originale.",
        ],
      },
      {
        titolo: "Overload dei metodi",
        punti: [
          "<strong>Overload</strong>: più metodi con lo <strong>stesso nome</strong> e <strong>parametri diversi</strong> (tipo, numero o ordine).",
          "Java sceglie la versione giusta in base agli argomenti passati.",
          "Cambiare <strong>solo il tipo di ritorno</strong> non è overload: è un errore di compilazione.",
        ],
      },
    ],
  },
  "materie/informatica/java-programmazione-a-oggetti.html": {
    breve: "Si raggruppano dati e azioni in oggetti: la classe è il modello, gli oggetti sono le copie concrete.",
    sezioni: [
      {
        titolo: "Che cos'è la programmazione a oggetti",
        punti: [
          "<strong>OOP</strong>: il codice è organizzato in <strong>oggetti</strong> che hanno <strong>attributi</strong> (cosa sono) e <strong>metodi</strong> (cosa fanno).",
          "Trucco: i <strong>sostantivi</strong> diventano attributi, i <strong>verbi</strong> diventano metodi.",
        ],
      },
      {
        titolo: "Classe e oggetto",
        punti: [
          "La <strong>classe</strong> è il modello (lo stampino); l'<strong>oggetto</strong> è un'istanza concreta con valori propri.",
          "Da una classe si creano infiniti oggetti, <strong>indipendenti</strong> tra loro.",
        ],
      },
      {
        titolo: "Creare una classe e gli attributi",
        punti: [
          "Gli attributi si dichiarano nel corpo della classe, <strong>fuori dai metodi</strong>: <code>String nome; int eta;</code>",
          "Classi con la maiuscola (<code>Studente</code>), attributi e metodi con la minuscola.",
        ],
      },
      {
        titolo: "Creare oggetti e accedere agli attributi",
        punti: [
          "<code>new</code> crea l'oggetto: <code>Studente s = new Studente();</code>",
          "L'<strong>operatore punto</strong> raggiunge attributi e metodi: <code>s.nome</code>, <code>s.studia()</code>.",
          "Senza assegnazione gli attributi valgono <code>0</code>, <code>false</code> o <code>null</code>.",
          "<code>b = a</code> non copia l'oggetto: crea un secondo nome per lo <strong>stesso</strong> oggetto.",
        ],
      },
      {
        titolo: "I metodi: cosa può fare un oggetto",
        punti: [
          "Tre forme: <code>void</code> (non restituisce nulla), con <strong>parametri</strong>, con <code>return</code> (restituisce un valore).",
          "Il metodo lavora sugli attributi dell'oggetto su cui viene chiamato.",
        ],
      },
      {
        titolo: "Il costruttore e la parola chiave this",
        punti: [
          "Il <strong>costruttore</strong> ha lo stesso nome della classe, <strong>nessun tipo di ritorno</strong>, ed è eseguito da <code>new</code> per inizializzare l'oggetto.",
          "<code>this.nome</code> è l'<strong>attributo</strong>, <code>nome</code> è il <strong>parametro</strong>: <code>this.nome = nome;</code>",
          "Senza <code>this</code>, <code>nome = nome;</code> assegna il parametro a se stesso e l'attributo resta <code>null</code>.",
        ],
      },
      {
        titolo: "Overload dei costruttori",
        punti: [
          "Più costruttori con parametri diversi (<strong>constructor overloading</strong>): Java sceglie in base agli argomenti di <code>new</code>.",
          "Se scrivi almeno un costruttore, Java <strong>non fornisce più</strong> quello vuoto: va dichiarato esplicitamente.",
          "<code>this(...)</code> come prima riga richiama un altro costruttore (approfondimento).",
        ],
      },
      {
        titolo: "Scope delle variabili",
        punti: [
          "<strong>Attributi</strong>: visibili in tutta la classe. <strong>Parametri</strong>: solo nel metodo. <strong>Variabili locali</strong>: solo nel blocco <code>{ }</code> in cui sono dichiarate.",
        ],
      },
      {
        titolo: "Array di oggetti",
        punti: [
          "<code>new Studente[5]</code> crea solo <strong>5 riferimenti <code>null</code></strong>, non 5 studenti: ogni elemento va creato con <code>new</code>.",
          "Usare un elemento <code>null</code> provoca la <strong>NullPointerException</strong>: si riempie tutto prima di scorrere, o si controlla <code>s != null</code>.",
        ],
      },
    ],
  },

  "materie/informatica/java-gestione-dei-file.html": {
    breve: "Con Java si controlla, si scrive, si legge e si elimina un file sul disco; ogni operazione rischiosa va in un try-catch.",
    sezioni: [
      {
        titolo: "Perché servono i file",
        punti: [
          "Le variabili stanno nella memoria e spariscono a fine programma; un <strong>file</strong> resta sul disco.",
          "Cinque operazioni: <strong>verificare</strong>, <strong>esplorare il percorso</strong>, <strong>scrivere</strong>, <strong>leggere</strong>, <strong>eliminare</strong>.",
        ],
      },
      {
        titolo: "La classe File",
        punti: [
          "<code>java.io.File</code> rappresenta un file o una cartella, ma <strong>non ne legge il contenuto</strong>: è il \"ponte\" con il file system.",
          "<code>new File(\"prova.txt\")</code> <strong>non crea</strong> il file sul disco: indica soltanto un percorso.",
          "Percorso <strong>relativo</strong> (rispetto alla cartella del progetto) o <strong>assoluto</strong> (completo, dalla radice). Su Windows la <code>\\</code> va raddoppiata.",
        ],
      },
      {
        titolo: "Verificare se un file esiste",
        punti: [
          "<code>exists()</code> restituisce <code>true</code> se il file c'è: evita la <code>FileNotFoundException</code>.",
          "Non sostituisce il <code>try-catch</code>: il file potrebbe sparire subito dopo il controllo.",
        ],
      },
      {
        titolo: "Informazioni sul file: getPath, getAbsolutePath, isFile",
        punti: [
          "<code>getPath()</code> = percorso <strong>relativo</strong> (come scritto nel costruttore); <code>getAbsolutePath()</code> = percorso <strong>assoluto</strong> completo.",
          "<code>isFile()</code> è <code>true</code> se è un file regolare, non una cartella.",
        ],
      },
      {
        titolo: "Scrivere in un file con FileWriter",
        punti: [
          "<code>new FileWriter(\"prova.txt\")</code> apre il file (lo crea se manca) e ne <strong>svuota</strong> il contenuto.",
          "<code>write(s)</code> scrive la stringa, <code>append(s)</code> aggiunge in coda; <code>\\n</code> va a capo.",
          "Per <strong>non perdere</strong> il contenuto esistente: <code>new FileWriter(nome, true)</code> (modalità append).",
          "<code>close()</code> è <strong>obbligatorio</strong>: svuota il buffer e libera il file. Alternativa: <code>try-with-resources</code>.",
        ],
      },
      {
        titolo: "Leggere un file con FileReader",
        punti: [
          "<code>read()</code> legge <strong>un carattere</strong> alla volta e lo restituisce come <code>int</code> (codice ASCII): si converte con <code>(char)</code>.",
          "A fine file <code>read()</code> restituisce <strong><code>-1</code></strong> (EOF): <code>while (data != -1)</code>.",
          "Si legge una volta prima del ciclo e una volta alla fine di ogni giro; senza, il ciclo è infinito.",
          "Se il file non esiste, <code>new FileReader</code> lancia <code>FileNotFoundException</code>.",
        ],
      },
      {
        titolo: "Eliminare un file con delete",
        punti: [
          "<code>delete()</code> restituisce <code>true</code> se ha eliminato il file, <code>false</code> altrimenti: si controlla il risultato.",
          "L'eliminazione è <strong>permanente</strong> (niente cestino). Un file ancora aperto non si elimina; una cartella solo se è vuota.",
        ],
      },
      {
        titolo: "Gestione delle eccezioni: try-catch",
        punti: [
          "Nel <code>try</code> il codice rischioso; nel <code>catch</code> si gestisce l'errore senza far crashare il programma. Java <strong>obbliga</strong> a farlo.",
          "<code>printStackTrace()</code> stampa il percorso completo dell'errore.",
          "Con più <code>catch</code>: <strong>prima il caso specifico</strong> (<code>FileNotFoundException</code>), poi il generale (<code>IOException</code>), altrimenti non compila.",
        ],
      },
    ],
  },

  "materie/informatica/java-eccezioni.html": {
    breve: "Le eccezioni permettono di reagire agli errori senza fermare il programma: try, catch, finally, checked e unchecked, throw e throws.",
    sezioni: [
      {
        titolo: "Cosa sono le eccezioni",
        punti: [
          "Un'<strong>eccezione</strong> è un evento imprevisto che interrompe il normale flusso del programma; è un <strong>oggetto</strong> \"lanciato\" (<em>thrown</em>).",
          "Ogni errore ha la sua classe: <code>ArithmeticException</code>, <code>NullPointerException</code>, <code>IOException</code>…",
          "Senza gestione, il programma si ferma nel punto dell'errore.",
        ],
      },
      {
        titolo: "try, catch e finally",
        punti: [
          "<code>try</code>: codice rischioso. <code>catch</code>: gestione dell'errore. <code>finally</code>: operazioni finali.",
          "Dopo l'errore il <code>try</code> si interrompe e si passa al <code>catch</code>; poi il programma prosegue.",
          "<code>finally</code> viene eseguito <strong>sempre</strong> (salvo <code>System.exit</code>): serve a chiudere file e risorse.",
        ],
      },
      {
        titolo: "L'oggetto Exception e più catch",
        punti: [
          "Nel <code>catch</code>: <code>e</code> (tipo + messaggio), <code>e.getMessage()</code> (solo messaggio), <code>e.printStackTrace()</code> (percorso completo, per il debug).",
          "Più <code>catch</code>: <strong>dal più specifico al più generico</strong>; <code>Exception</code> prende tutto e va per ultimo, altrimenti non compila.",
        ],
      },
      {
        titolo: "Checked e unchecked exceptions",
        punti: [
          "<strong>Unchecked</strong> (derivano da <code>RuntimeException</code>): il compilatore non obbliga a gestirle. Sono errori di programmazione: <code>ArithmeticException</code>, <code>NullPointerException</code>, <code>NumberFormatException</code>…",
          "<strong>Checked</strong> (<code>IOException</code>, <code>FileNotFoundException</code>, <code>SQLException</code>): obbligo di <code>try-catch</code> o <code>throws</code>. Dipendono dal mondo esterno.",
        ],
      },
      {
        titolo: "throw e throws",
        punti: [
          "<code>throw new IllegalArgumentException(\"...\")</code> <strong>lancia</strong> un'eccezione adesso: il metodo si interrompe.",
          "<code>throws IOException</code> nella firma <strong>dichiara</strong> che il metodo può lanciarla: chi lo chiama la gestisce o la dichiara a sua volta.",
        ],
      },
    ],
  },

  "materie/informatica/java-collections-liste.html": {
    breve: "Le liste di Java crescono da sole: ArrayList (array dinamico), Vector (sincronizzato, legacy) e LinkedList (nodi collegati, anche pila e coda). Quale scegliere e perché.",
    sezioni: [
      {
        titolo: "Il Java Collections Framework",
        punti: [
          "Il <strong>JCF</strong> (Java 1.2, <code>java.util</code>) è l'insieme di <strong>interfacce</strong>, <strong>classi</strong> e <strong>algoritmi</strong> per gestire gruppi di oggetti.",
          "Con i <strong>generics</strong> si indica il tipo: <code>List&lt;String&gt;</code>. Solo classi: <code>List&lt;Integer&gt;</code>, mai <code>&lt;int&gt;</code>.",
        ],
      },
      {
        titolo: "L'interfaccia List",
        punti: [
          "<strong>List</strong> = sequenza <strong>ordinata</strong> con indice da 0; <strong>ammette duplicati</strong> e mantiene l'ordine di inserimento (un Set no).",
          "Tre implementazioni con gli stessi metodi: <code>ArrayList</code>, <code>Vector</code>, <code>LinkedList</code>. Cambia la velocità delle operazioni.",
        ],
      },
      {
        titolo: "ArrayList: l'array dinamico",
        punti: [
          "Dentro c'è un <strong>array</strong>: quando è pieno se ne crea uno più grande e si copia tutto.",
          "<code>get(i)</code> O(1) e scorrimento veloce; inserire o togliere <strong>in mezzo</strong> O(n) perché si spostano gli elementi.",
          "Non thread-safe. <strong>size</strong> = elementi presenti, <strong>capacità</strong> = posti nell'array interno.",
        ],
      },
      {
        titolo: "Usare ArrayList: la sintassi",
        punti: [
          "<code>List&lt;String&gt; lista = new ArrayList&lt;&gt;();</code> (interfaccia a sinistra, classe a destra).",
          "<code>add(e)</code>, <code>add(i, e)</code>, <code>get(i)</code>, <code>set(i, e)</code>, <code>remove(i)</code> / <code>remove(oggetto)</code>, <code>size()</code>, <code>contains(e)</code>.",
          "Per togliere mentre scorri usa un <code>Iterator</code> (<code>hasNext</code>, <code>next</code>, <code>remove</code>), non un for-each.",
        ],
      },
      {
        titolo: "Vector: l'antenato thread-safe",
        punti: [
          "Come ArrayList (array dinamico) ma ogni metodo è <code>synchronized</code>: <strong>thread-safe</strong> e più lento. Java 1.0, <strong>legacy</strong>.",
          "Ha il <code>capacityIncrement</code>. Oggi si usa <code>Collections.synchronizedList(new ArrayList&lt;&gt;())</code> o <code>CopyOnWriteArrayList</code>.",
        ],
      },
      {
        titolo: "LinkedList: la lista concatenata",
        punti: [
          "Lista <strong>doppiamente collegata</strong>: ogni nodo ha <code>prev</code>, valore e <code>next</code>.",
          "Inserire/togliere O(1) <em>una volta arrivati</em>; <code>get(i)</code> O(n); più memoria; nessun ingrandimento; non thread-safe.",
        ],
      },
      {
        titolo: "LinkedList come pila e come coda",
        punti: [
          "Implementa <code>Deque</code>: <code>addFirst</code>/<code>addLast</code>, <code>removeFirst</code>/<code>removeLast</code>; <code>offer</code>, <code>poll</code>, <code>peek</code> danno <code>null</code> invece dell'eccezione.",
          "<strong>Pila</strong> (LIFO): <code>push</code>, <code>pop</code>, <code>peek</code>. <strong>Coda</strong> (FIFO): <code>offer</code>, <code>poll</code>, <code>peek</code>.",
        ],
      },
      {
        titolo: "Prestazioni: O(1) e O(n)",
        punti: [
          "<strong>O(1)</strong>: tempo costante. <strong>O(n)</strong>: cresce con il numero di elementi.",
          "ArrayList/Vector: <code>get</code> O(1), inserimento in mezzo O(n). LinkedList: <code>get</code> O(n), inserimento O(1) solo dopo aver raggiunto la posizione (es. con <code>ListIterator</code>).",
        ],
      },
      {
        titolo: "Come scegliere: la regola d'oro",
        punti: [
          "<strong>ArrayList</strong> quasi sempre; <strong>LinkedList</strong> per code, pile e modifiche in testa; <strong>Vector</strong> da evitare.",
          "Parti da ArrayList e cambia solo se misuri un problema reale.",
        ],
      },
      {
        titolo: "Buone abitudini",
        punti: [
          "Programma per interfaccia: <code>List&lt;T&gt; x = new ArrayList&lt;&gt;();</code>",
          "Usa sempre i generics: le collezioni <strong>raw</strong> portano a <code>ClassCastException</code> a runtime.",
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
