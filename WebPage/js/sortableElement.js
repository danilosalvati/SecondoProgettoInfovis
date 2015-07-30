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
        multiple,
        "data-max-options": "5"
    }));
    //lo riempio delle opzioni di default
    generalToMatchArray.forEach(function (elem) {
        var stringToAppend = '<option>' + elem.description + '</option>'
        $('#selector').append(stringToAppend);
    });

    //gli assegno il comportamento
    $('#selector').selectpicker({
        style: 'btn-info',
        width: '50%'
    });

    //introduco un bottone per il reset
    $('#sortableSelectorForm').append($('<button></button>').attr({
    	type:"button",
    	id:"reset_button",
    	class:"btn btn-info"
    }));
    
    //aggiungo il comportamento del button
    $('#reset_button').click( function(){
    	$('#selectpicker').selectpicker('deselectAll');
    });
}