//sfrutta massicciamente jquery()

function makeSelection (toMatchArray){
	$('#chartcontainer').append($('<div></div>')).attr({
        id: 'sortableSelector'
    }));
	
	$('#sortableSelector').append($('<select></select>')).attr({
		id:'selector',
		class: 'selectpicker',
		multiple,
		data-max-options:"5"
	});

	toMatchArray.forEach( function (elem){
		var stringToAppend = '<option>'+elem.description+'</option>'
		$('#selector').append(stringToAppend);
	});

	
}