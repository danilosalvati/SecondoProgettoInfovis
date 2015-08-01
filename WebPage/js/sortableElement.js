//definisce i bottoni relativi al sort per il grafico e il comportamento di questi
function makeSelection(toAppend) {
    $(toAppend).append($('<form></form>').attr({
        id: 'sortableSelectorForm'
    }));

    //costruisco il selettore
    $('#sortableSelectorForm').append($('<select></select>').attr({
        id: 'selector',
        class: 'selectpicker',
        multiple: '',
        "data-max-options": "5"
    }));

    //lo riempio delle opzioni di default
    defaultToMatchArray.universal.forEach(function (elem) {
        var stringToAppend = '<option>' + elem.description + '</option>'
        $('#selector').append(stringToAppend);
    });

    //introduco un bottone per il reset
    $('#sortableSelectorForm').append($('<button>reimposta la selezione</button>').attr({
        type: "button",
        id: "reset_button",
        class: "btn btn-primary",
        style: "margin: 4;"
    }));

    //    $('#sortableSelectorForm').append($('<button>disegna</button>').attr({
    //        type: "button",
    //        id: "draw_button",
    //        class: "btn btn-primary pull-right"
    //    }));
    $('#sortableSelectorForm').append('<br><br>');
    $('#sortableSelectorForm').append('<div class="panel panel-default"></div>');
    $('div.panel').append('<div class="panel-body"></div>');
    $('div.panel-body').append('<ul id="sortable"></ul>');
    $('div.panel-body').append($('<button>disegna</button>').attr({
        type: "button",
        id: "draw_button",
        class: "btn btn-primary pull-right"
    }));

    $('#sortableSelectorForm').append('<br><br>');
}

//funzione di supporto che serve a inserire il nuovo grafico disegnato
function updateGraphcontainer() {
    $("#chart1").empty();
}

//questa funzione aggiorna gli elementi nei bottoni secondo l'array di input
function inizializeItemHelper(input) {
    var daSelezionare = [];
    input.forEach(function (elem) {
        var descrizione = elem.description;
        daSelezionare.push(descrizione);
        $('#sortable').append('<li class="ui-state-default">' + descrizione + '</li>');
    });
    $('.selectpicker').selectpicker('val', daSelezionare);
    $('#sortable').sortable("refresh");
}

function behavior() {
    //gli assegno il comportamento
    $('.selectpicker').selectpicker({
        style: 'btn-primary',
        width: '50%'
    });

    $('#sortable').sortable({
        placeholder: "sortable_placeholder",
    });

    //aggiungo il comportamento del button
    $('#reset_button').click(function () {
        $('#selector').selectpicker('deselectAll');
        defaultToMatchArray.empty();
    });

    $('.dropdown-menu li').click(function (e) {
        e.preventDefault();
        var selected = $(this).text();
        var rimosso = defaultToMatchArray.clicked(selected);
        if (rimosso) {
            $('#sortable li').each(function (index, elem) {
                if ($(elem).text() === selected) {
                    $(elem).remove();
                }
            });
        } else
            $('#sortable').append('<li class="ui-state-default">' + selected + '</li>');
        $('#sortable').sortable('refresh');
    });
}

//viene usata quando cambia il nodo
function startSelection(entries, nameNode) {
    behavior();

    inizializeItemHelper(defaultToMatchArray.getDefault());

    $("#sortable").on("sortstop", function (event, ui) {
        var itemSorted = [];
        $(this).children().each(function (index, elem) {
            itemSorted.push($(elem).text());
        });
        console.log(itemSorted);
        defaultToMatchArray.sort(itemSorted);
    });

    //aggiungo il comportamento del button
    $('#draw_button').click(function () {
        updateGraphcontainer();
        buildTreeGraph(entries, nameNode);
    });

}

//viene usata quando cambia il filtro sui dati
function updateSelection(filteredRows, entries, nameNode) {
    behavior();

    inizializeItemHelper(defaultToMatchArray.selected);

    //aggiungo il comportamento del button
    $('#draw_button').click(function () {
        updateGraphcontainer();
        updateTreeGraph(filteredRows, entries, nameNode);
    });
}