//sfrutta massicciamente jquery()

function makeSelection (toMatchArray){
	$('#chartcontainer').append($('<div></div>').attr({
        id: 'sortableSelectorDiv'
    }));
	
	$('#sortableSelectorDiv').append($('<select></select>').attr({
		id:'selector',
		class: 'selectpicker',
		multiple,
		data-max-options:"5"
	}));

	toMatchArray.forEach( function (elem){
		var stringToAppend = '<option>'+elem.description+'</option>'
		$('#selector').append(stringToAppend);
	});

	$('#sortableSelectorDiv').append($('<ul></ul>').attr({
		id: 'sortable',
	}));
	
	$('#sortable').sortable();
	$("#sortable").disableSelection();

	$( "#selector" ).change(function () {
		var selectedValue;
    	$( "#selector option:selected" ).each(function() {
			selectedValue.push($( this ).text());	
    	});
    	$('#sortable:option').remove();
    	selectedValue.forEach(function (elem){
    		var stringToAppend = '<li>'+elem+'</li>'
    		$('#sortable').append(stringToAppend);
    	});
	});
}