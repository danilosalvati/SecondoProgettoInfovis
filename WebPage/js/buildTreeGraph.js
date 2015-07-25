//funzione a modello per i flussi filtrati
//defaultFilterFunction ritorna un array di questo oggetto
var FilteredFlow = function (name) {
    this.commonValue = name;
    this.entries = [];
    this.size = 0;
    this.addFlow = function (newFlow) {
        this.entries.push(newFlow);
        this.size += 1;
    }
};

//suddivide le entries in liste di entries con un field in comune.
function clusterizedFlow(entries, actualMatch) {
    var flow, c, d, de, currentName;
    var res = [];
    var fieldName = actualMatch.fieldName;

    for (c = 0; c < entries.length; c++) {
        //prendo il valore del campo e lo modifico tramite la funzione di filtering
        currentName = actualMatch.filter(entries[c][fieldName]);

        //cerca in res un flow con quel nome
        //se ci sta  aggiungilo
        //se non ci sta crea il flow e aggiungilo
        if (currentName === undefined)
            currentName = "no_match";
        d = -1;
        res.forEach(function (elem, index) {
            if (elem.commonValue === currentName)
                d = index;
        });
        if (d === -1) {
            flow = new FilteredFlow(currentName);
            res.push(flow);
            d = 0;
        }
        res[d].addFlow(entries[c]);
    }
    return res;
}

/*  
    entries: porzione di dataset analizzata
    toMatchArray: lista di dettagli da filtrare
    matched:contatore del numero dei campi già matched.
*/
function matchingFilterHelper(filteredFlow, toMatchArray, matched) {
    var node = new Object();
    node.name = filteredFlow.commonValue;

    if (matched < toMatchArray.length) { //se non sono nodi foglia
        var actualMatch = toMatchArray[matched];
        var filtered = clusterizedFlow(filteredFlow.entries, actualMatch);
        node.children = [];
        for (var i = 0; i < filtered.length; i++) {
            node.children.push(matchingFilterHelper(filtered[i], toMatchArray, matched + 1));
        }
    } else {
        node.size = filteredFlow.size;
    }
    return node;
}

/** Estrapola un albero dai dati che ha come livelli dettagli di matching decisi da ToMatchArray
    come radice il nodeName
 **/
function matchingFilter(entries, toMatchArray, nodeName) {
    var actualMatch, filtered, root;
    root = new Object();

    if (nodeName === undefined)
        nodeName = "selected_node";
    actualMatch = toMatchArray[0];

    //le entries ripartite per children filtrate rispetto all'attributo attualmente
    //preso in considerazione
    //i filtered sono i famosi cluster filtrati
    filtered = clusterizedFlow(entries, actualMatch);
    root.name = nodeName;

    if (filtered.length !== 0)
        root.children = [];

    //espando gli envenutali cluster
    for (var i = 0; i < filtered.length; i++) {
        root.children.push(matchingFilterHelper(filtered[i], toMatchArray, 1));
    }
    return root;
}

/** Questa funzione crea l'albero **/
function buildTreeGraph(entries, nodeName, toMatchArray) {

    //se non specificato ne prende uno di default
    if (toMatchArray === undefined){
        toMatchArray = defaultToMatchArray;
        normalizeToMatchArray(defaultToMatchArray);
    }
    /*********************************
     * Per prima cosa converto le entries nel formato
     * di interesse
     *********************************/
    var json = matchingFilter(entries, toMatchArray, nodeName);

    json.children.forEach(function (elem) {
        console.log(elem);
    });


    /* Adesso che ho creato l'oggetto json con i giusti valori posso
     * costruire l'albero */
    buildTree(json);

}

/** Questa funzione aggiorna il grafico ad albero **/
function updateTreeGraph(filteredRows, entries, nameNode) {

    /* Estraggo solo le entries che mi servono */
    var i, j;
    var entriesFiltered = [];
    for (i = 0; i < filteredRows.length; i++) {
        var found = false;
        var id = $(filteredRows[i].children[1]).html();
        for (j = 0; j < entries.length && !found; j++) {
            if (entries[j].id === id) {
                found = true;
                entriesFiltered.push(entries[j]);
            }
        }
    }

    if (entriesFiltered.length > 0) {
        buildTreeGraph(entriesFiltered, nameNode);
    }
}