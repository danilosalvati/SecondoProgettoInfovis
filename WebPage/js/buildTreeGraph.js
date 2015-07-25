//funzione a modello per i flussi filtrati
//defaultFilterFunction ritorna un array di questo oggetto
var FilteredFlow = function (name) {
    this.name = name;
    this.entries = [];
    this.count = 0;
    this.addFlow = function (newFlow) {
        this.entries.push(newFlow);
        this.count++;
    }
};

//suddivide le entries in liste di entries con un field in comune.
function clusterizedFlow(entries, actualMatch) {
    var flow, c, d, currentName;
    var res = [];
    var fieldName = actualMatch.matchValue.fieldName;

    for (c; c < entries.length; c++) {
        currentName = actualMatch.filter(entries[c][fieldName]);
        //cerca in res un flow con quel nome
        //se ci sta aumenta il contatore e aggiungilo
        //se non ci sta crea il flow e aggiungilo
        if (currentName === undefined)
            currentName = "no_match";
        d = res.findIndex(function (elem) {
            return elem[name] === currentName;
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

/** Estrapola un albero dai dati che ha come livelli dettagli di matching decisi da ToMatchArray
    come radice il nodeName
 **/
function matchingFilter(entries, toMatchArray, nodeName, size) {
    var actualMatch, filtered, root;

    if (size === undefined)
        size = 1;
    if(nodeName===undefined) 
        nodeName="selected_node";
    actualMatch = toMatchArray[0];

    //le entries ripartite per children filtrate rispetto all'attributo attualmente
    //preso in considerazione
    //i filtered sono i famosi cluster filtrati
    filtered = clusterizedFlow(entries, actualMatch);

    root.name = nodeName;

    if (filtered.length !== 0)
        root.children = [];

    //espando gli envenutali cluster
    for (var i; i < filtered.length; i++) {
        root.children.push(matchingFilterHelper(filtered[i], toMatchArray, 1));
    }
    return root;
}

/*  
    entries: porzione di dataset analizzata
    toMatchArray: lista di dettagli da filtrare
    matched:contatore del numero dei campi già matched.
*/
function matchingFilterHelper(entries, toMatchArray, matched) {
    var node = {};
    node.name = entries.name;
    node.size = entries.size;

    var actualMatch = toMatchArray[matched];
    var filtered = clusterizedFlow(entries, actualMatch.filter);

    if (matched !== toMatchArray.length) {
        node.children = [];
        for (var i; i < filtered.length; i++) {
            node.children.push(matchingFilterHelper(filtered[i], toMatchArray, matched + 1));
        }
    }
    return node;
}

/** Questa funzione crea l'albero **/
function buildTreeGraph(entries, toMatchArray, nodeName, size) {

    /*********************************
     * Per prima cosa converto le entries nel formato
     * di interesse
     *********************************/
    var json = matchingFilter(entries,toMatchArray, nodeName, size);

    /* Adesso che ho creato l'oggetto json con i giusti valori posso
     * costruire l'albero */

    buildTree(json);

}

/** Questa funzione aggiorna il grafico ad albero **/
function updateTreeGraph(filteredRows, entries) {

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
        buildTreeGraph(entriesFiltered);
    }
}