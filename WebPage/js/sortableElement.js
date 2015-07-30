//DEBUG TODO=costruire il generale, lasciarne uno di default, assegnarlo al grafico.
var generalToMatchArray = defaultToMatchArray;

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
        "data-max-options": "1"
    }));

    //lo riempio delle opzioni di default
    generalToMatchArray.forEach(function (elem) {
        var stringToAppend = '<option>' + elem.description + '</option>'
        $('#selector').append(stringToAppend);
    });

    //introduco un bottone per il reset
    $('#sortableSelectorForm').append($('<button>reset selection</button>').attr({
        type: "button",
        id: "reset_button",
        class: "btn btn-info"
    }));
}