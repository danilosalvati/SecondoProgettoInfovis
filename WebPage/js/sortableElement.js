//definisce i bottoni relativi al sort per il grafico e il comportamento di questi
function makeSelection() {
    $('#chartcontainer').append($('<form></form>').attr({
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
    universalToMatchArray.forEach(function (elem) {
        var stringToAppend = '<option>' + elem.description + '</option>'
        $('#selector').append(stringToAppend);
    });

    //introduco un bottone per il reset
    $('#sortableSelectorForm').append($('<button>reimposta la selezione</button>').attr({
        type: "button",
        id: "reset_button",
        class: "btn btn-info"
    }));
}

function startSelection (){
    //gli assegno il comportamento
    $('.selectpicker').selectpicker({
        style: 'btn-info',
        width: '50%'
    });

    //aggiungo il comportamento del button
    $('#reset_button').click(function () {
        $('#selector').selectpicker('deselectAll');
    });

    $('#selector').change(function (){
        this.text
    });
}