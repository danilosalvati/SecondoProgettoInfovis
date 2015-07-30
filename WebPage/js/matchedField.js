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


/*********************************definizione dell'oggetto**********************************/

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

    this.description=name;
}

//fa in modo tale che tutti i toMatch abbiano eseguito le loro funzioni di expand
function normalizeToMatchArray(toMatchArray) {
    //esegue fintanto esiste un campo con expand non di default
    // potrebbe non essere necessario
    //poco robusto può portare a loop
    do{
        redo=false;
        toMatchArray.forEach(function (elem, index, array) {
            if(elem.toExpand){
                redo=elem.expand(elem, index, array) || redo;
            }
        });
    }while(redo);
}

/*****************funzioni di espanzione dei livelli*************************/
//queste funzioni sono argomento di un array.forEach()

function defualtExpandFunction(elem, index, array){
    //queste funzioni avranno tutte questa forma
    var oldFieldName=this.fieldName;
    var res = new ToMatch(oldFieldName);
    array.splice(index + 1, 0, res); //aggiungo il nuovo ToMatch dopo il precedente  
    this.toExpand=false;
    return this.toExpand;
}


/*************array di default per una prima generazione dell'albero*****************/
//todo array generale che contiene tutte le nuove tipologie
var defaultToMatchArray = [];

var ipFieldName="ip_add"
var ipOutToMatch = new ToMatch(ipFieldName+"_out", findIpV4Netmask,defualtExpandFunction);
ipOutToMatch.description="destination ip";
defaultToMatchArray.push(ipOutToMatch);

var typeFieldName="packetType"
var typeToMatch = new ToMatch(typeFieldName);
defaultToMatchArray.push(typeToMatch);