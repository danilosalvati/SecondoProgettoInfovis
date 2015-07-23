/** Questa funzione crea l'albero **/
function buildTreeGraph(entries) {

    /*********************************
     * Per prima cosa converto le entries nel formato
     * di interesse
     *********************************/

    //DEBUG!!
    var json = entries;

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