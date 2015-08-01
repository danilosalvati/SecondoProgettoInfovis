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
        class: "btn btn-info"
    }));

    $('#sortableSelectorForm').append($('<button>disegna</button>').attr({
        type: "button",
        id: "draw_button",
        class: "btn btn-info"
    }));
}

//funzione di supporto che serve a inserire il nuovo grafico disegnato
function updateGraphcontainer(){
    $('chart1').remove();
    $('#chart1div').append($('<svg></svg>').attr({
        id: 'chart1',
        class: 'chart',
    }));
}

function behavior(){
    //gli assegno il comportamento
    $('.selectpicker').selectpicker({
        style: 'btn-info',
        width: '50%'
    });

    //aggiungo il comportamento del button
    $('#reset_button').click(function () {
        $('#selector').selectpicker('deselectAll');
        defaultToMatchArray.empty();
    });

    $('.dropdown-menu li').click(function(e){
        e.preventDefault();
        var selected = $(this).text();
        defaultToMatchArray.clicked(selected);      
    });    
}

//viene usata quando cambia il nodo
function startSelection (entries, nameNode){
    behavior();

    var daSelezionare=[];
    defaultToMatchArray.getDefault().forEach(function (elem){
        daSelezionare.push(elem.description);
    });
    $('.selectpicker').selectpicker('val',daSelezionare);

    //aggiungo il comportamento del button
    $('#draw_button').click(function () {
        updateGraphcontainer();
        buildTreeGraph(entries, nameNode);
    });   

}

//viene usata quando cambia il filtro sui dati
function updateSelection (filteredRows, entries, nameNode){
    behavior();

    var daSelezionare=[];    
    defaultToMatchArray.selected.forEach(function (elem){
        daSelezionare.push(elem.description);
    });
    $('.selectpicker').selectpicker('val',daSelezionare);

    //aggiungo il comportamento del button
    $('#draw_button').click(function () {
        updateGraphcontainer();
        updateTreeGraph(filteredRows, entries, nameNode);
    });   
}