/**funzioni ausiliare per il parsing del nome del campo della flowEntries**/
/**aggiungere qua eventuali funzioni ausiliare**/
//funzione di ausilio che trova la netmask made by Danilo
function findIpV4Netmask(value) {
    var netmask = '24'; // Di default ho una /24
    /* Estraggo l'eventuale netmask dall'indirizzo ip */
    var netmaskPosition = value.indexOf('/');
    if (netmaskPosition !== -1) {
        netmask = value.substring(netmaskPosition + 1, value.length);
    }
    /* Calcolo il prefisso utilizzando un'apposita libreria */
    IPv4_Address(value, netmask);
    //this.netaddressDotQuad è il prefisso ricavato.
    return netaddressDotQuad + '/' + netmask;
}

/*****************funzioni di espanzione dei livelli*************************/
/**************queste funzioni sono argomento di un array.forEach()**********/

//queste funzioni avranno probabilmente tutte questa forma
function defualtExpandFunction(index, array) {
    var oldFieldName = this.fieldName;
    var res = new ToMatch(oldFieldName);
    array.splice(index + 1, 0, res); //aggiungo il nuovo ToMatch dopo il precedente  
    this.toExpand = false;
    return this.toExpand;
}
   
/**l'implementazione del ToMatchArray si trova in matchedField.js**/
/**Aggiungo inoltre di seguito una breve documentazione del costruttore**/
/**
l'oggetto ToMatch è l'elemento corrispondente al contenuto di un livello nell'albero di matching
ToMatch(name, clusterFun, expandFun);
name: il campo che nel json delle flow corrisponde al field di interesse
clusterFun(fieldValue):funzione che parsa il valore del field, utile per aggregare alcune flow Entries
    Per esempio quelle che corrispondono alla stessa netmask
expandFun(index, array): Questa funzione consente di aggiungere un nuovo livello all'albero, in qualsiasi posizione.
    index: altezza del field nell'albero
    array: lista che contiene tutti i campi ordinati per altezza nell'albero
    Per esempio expand fun aggiunge un nuovo nodo dipendente dal primo
    Restituisce true se il nuovo livello introdotto contiene a sua volta un expandFun
**/
/*********************************definizione dell'oggetto ToMatch**********************************/
//oggetto dell'array toMatch
var ToMatch = function (name, clusterFun, expandFun) {
    //attributo json che identifica il campo di interesse
    this.fieldName = name;
    this.toExpand = true;
    //funzione che modifica il valore del campo per confrontarlo
    if (clusterFun === undefined) {
        this.filter = function (a) {
            return a;
        }
    } else {
        this.filter = clusterFun;
    }

    //funzione che permette di introdurre un nuovo livello di filtering
    if (expandFun === undefined)
        this.expand = function () {
            this.toExpand = false;
            return this.toExpand;
        };
    else
        this.expand = expandFun;

    this.description = name;

    this.refresh = function () {
        this.toExpand = true;
    }
}

/**Un elenco di tutti i campi che il programma distingue**/
/**aggiungere qua eventuali nuovi campi come nuovi oggetti ToMatch**/
//questo array mantiene l'elenco
var universalDefaultArray = [];

var ipFieldName = "ip_add"
var ipOutToMatch = new ToMatch(ipFieldName + "_out", findIpV4Netmask, defualtExpandFunction);
ipOutToMatch.description = "destination ip";
universalDefaultArray.push(ipOutToMatch);

var ipInFieldName = "ip_add"
var ipInToMatch = new ToMatch(ipInFieldName + "_in", findIpV4Netmask, defualtExpandFunction);
ipInToMatch.description = "source ip";
universalDefaultArray.push(ipInToMatch);

var typeFieldName = "packetType"
var typeToMatch = new ToMatch(typeFieldName);
universalDefaultArray.push(typeToMatch);

var actionFieldName = "actions"
var actionToMatch = new ToMatch(actionFieldName);
universalDefaultArray.push(actionToMatch);

var inPortFieldName = "in_port"
var inPortToMatch = new ToMatch(inPortFieldName);
universalDefaultArray.push(inPortToMatch);