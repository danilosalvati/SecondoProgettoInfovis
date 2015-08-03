/*******************definizione dell'oggetto ToMAtchArray******************/
//ritorna una copia dell'array precedente
function copyFrom(array) {
    return array.filter(function () {
        return true;
    });
}

//fa in modo tale che tutti i toMatch abbiano eseguito le loro funzioni di expand
//predispone l'array per l'elaborazione del parser delle flow
function normalizeToMatchArray(toMatchArray) {
    //esegue fintanto esiste un campo con expand non di default
    // potrebbe non essere necessario
    var maxExpansion = 5;//è comunque proibitivo disegnare un grafo di altezza pari  4
    var i=0;
    res = copyFrom(toMatchArray);
    do {
        redo = false;
        i++;
        res.forEach(function (elem, index, array) {
            if (elem.toExpand) {
                redo = elem.expand(index, array) || redo;
            }
        });
    } while (redo && i<maxExpansion);
    return res;
}

function refreshAll(array) {
    array.forEach(function (elem) {
        elem.refresh();
    });
}

var ToMatchArray = function () {

    /**********genero l'universal****************/
    //array generico che contiene tutti i valori ToMatch
    this.universal = universalDefaultArray;

    /*************array di default per una prima generazione dell'albero*****************/
    //todo array generale che contiene tutte le nuove tipologie
    this.defaultToMatch = [];
    this.defaultToMatch.push(ipOutToMatch);
    this.defaultToMatch.push(typeToMatch);


    /***************array che verra modificato dall'interfaccia utente************/
    this.selected = copyFrom(this.defaultToMatch);
    this.normalized = normalizeToMatchArray(this.selected);
    this.changed = false;

    //richiamare solo per costruire l'albero
    //ritorna l'oggetto utile a costruire l'albero
    this.getSelected = function () {
        if (this.changed) {
            refreshAll(this.selected);
            this.normalized = normalizeToMatchArray(this.selected);
            this.changed = false;
        }
        return this.normalized;
    }

    this.getDefault = function () {
        this.selected = copyFrom(this.defaultToMatch);
        refreshAll(this.selected);
        return this.selected;
    }

    this.clicked = function (descriptionSelected, reachmaxLength) {
        var daCercare = true;
        var rimosso = false;
        for (var i = 0; daCercare && i < this.selected.length; i++) {
            if (this.selected[i].description === descriptionSelected) {
                this.selected.splice(i, 1); //lo rimuovo
                daCercare = false;
                rimosso = true;
                this.changed=true;
            }
        }

        var daCercare = daCercare && reachmaxLength;
        
        //se invece non c'è lo aggiungo e per farlo devo cercarlo tra l'universal
        for (var i = 0; daCercare && i < this.universal.length; i++) {
            if (this.universal[i].description === descriptionSelected) {
                this.selected.push(this.universal[i]); //lo aggiungo
                daCercare = false;
                this.changed=true;
            }
        }
        return rimosso;
    }

    this.empty = function () {
        this.changed = true;
        this.selected = [];
    }

    this.sort = function (itemSorted) {
        var descriptionSelected;
        var nuovoSelected = [];
        for (var i = 0; i < itemSorted.length; i++) {
            descriptionSelected = itemSorted[i];
            for (var j = 0; j < this.selected.length; j++) {
                if (this.selected[j].description === descriptionSelected) {
                    nuovoSelected.push(this.selected[j]);
                }
            }
        }
        this.selected = nuovoSelected;
        this.changed = true;
    }
}

//costruisco il toMatchArray object
var defaultToMatchArray = new ToMatchArray();