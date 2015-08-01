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

    this.description=name;

    this.refresh= function (){
        this.toExpand=true;
    }
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

/*******************definizione dell'oggetto ToMAtchArray******************/
function getToMatchArrayFrom(array){
    var res=[];
    array.forEach(function(elem){
        res.push(elem);
    });
    return res;
}

//fa in modo tale che tutti i toMatch abbiano eseguito le loro funzioni di expand
function normalizeToMatchArray(toMatchArray) {
    //esegue fintanto esiste un campo con expand non di default
    // potrebbe non essere necessario
    res = getToMatchArrayFrom(toMatchArray);
    do{
        redo=false;
        res.forEach(function (elem, index, array) {
            if(elem.toExpand){
                redo=elem.expand(elem, index, array) || redo;
            }
        });
    }while(redo);
    return res; 
}

function refreshAll(array){
    array.forEach(function(elem){
        elem.refresh();
    });
}

var ToMatchArray = function (){

    /**********genero l'universalToMatchArray****************/
    //array generico che contiene tutti i valori ToMatch

    this.universal = [];

    var ipFieldName="ip_add"
    var ipOutToMatch = new ToMatch(ipFieldName+"_out", findIpV4Netmask,defualtExpandFunction);
    ipOutToMatch.description="destination ip";
    this.universal.push(ipOutToMatch);

    var typeFieldName="packetType"
    var typeToMatch = new ToMatch(typeFieldName);
    this.universal.push(typeToMatch);


    /*************array di default per una prima generazione dell'albero*****************/
    //todo array generale che contiene tutte le nuove tipologie
    this.defaultToMatch = [];
    this.defaultToMatch.push(ipOutToMatch);
    this.defaultToMatch.push(typeToMatch);


    /***************array che verra modificato dall'interfaccia utente************/
    this.selected =getToMatchArrayFrom(this.defaultToMatch);
    this.normalized = normalizeToMatchArray(this.selected);
    this.changed = false;

    //richiamare solo per costruire l'albero
    //ritorna l'oggetto utile a costruire l'albero
    this.getSelected = function (){
        if(this.changed){
            refreshAll(this.selected);
            this.normalized=normalizeToMatchArray(this.selected);
            this.changed=false;
        }
        return this.normalized;
    }

    this.getDefault= function(){
        this.selected=getToMatchArrayFrom(this.defaultToMatch);
        refreshAll(this.selected);
        return this.selected;
    }

    this.clicked= function (descriptionSelected){
        this.changed=true;
        var daCercare=true;
        for(var i=0; daCercare && i<this.selected.length; i++){
            if(this.selected[i].description===descriptionSelected){
                this.selected.splice(i,1);//lo rimuovo
                daCercare=false;
            }
        }
        //se invece non c'è lo aggiungo e per farlo devo cercarlo tra l'universal
        for(var i=0;daCercare && i<this.universal.length; i++){
            if(this.universal[i].description===descriptionSelected){
                this.selected.push(this.universal[i]);//lo aggiungo
                daCercare=false;
            }
        }
    }

    this.empty=function (){
        this.changed=true;
        this.selected=[];
    }
}

//costruisco il toMatchArray object
var defaultToMatchArray = new ToMatchArray(); 