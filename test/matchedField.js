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
    return this.netaddressDotQuad + '/' + netmask;
}

//oggetto dell'array toMatch
var ToMatch = function (name, clusterFun, expandFun) {
    this.fieldName = name;
    if (clusterFun === undefined) {
        this.filter = function (a) {
            return a;
        }
    } else {
        this.filter = clusterFun;
    }
    if (expandFun === undefined)
        this.expand = function () {
            return false;
        };
    else
        this.expand = expandFun;
}

function defualtExpandFunction(elem, index, array, fieldName){
     //queste funzioni avranno tutte questa forma
    var res = new ToMatch(fieldName);
    array.splice(index + 1, 0, res); //aggiungo il nuovo ToMatch dopo il precedente  
    return true;
}

//fa in modo tale che tutti i toMatch abbiano eseguito le loro funzioni di expand
function normalizeToMatchArray(toMatchArray) {
    var eseguito;
    do { //esegue fintanto esiste u campo con expand potrebbe non essere necessario
        //poco robusto può portare a loop
        eseguito = false;
        toMatchArray.forEach(function (elem, index, array) {
            eseguito = elem.expand(elem, index, array) || eseguito;
        });
    } while (eseguito);
}

//esempio di toMatchArray
var defaultToMatchArray = [];

var ipFieldName="ip_add"
var ipOutToMatch = new ToMatch(ipFieldName+"_out", findIpV4Netmask,
                                defualtExpandFunction(elem, index, array, ipFieldName+"_out"));
defaultToMatchArray.push(ipOutToMatch);

var typeFieldName="packetType"
var typeToMatch = new ToMatch(typeFieldName);
defaultToMatchArray.push(typeToMatch);

normalizeToMatchArray(defaultToMatchArray);