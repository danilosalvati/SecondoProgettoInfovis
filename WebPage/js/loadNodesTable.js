$(document).ready(function () {
    var nodeTable = $('#nodes').dataTable({
        ajax: "../json/JSONNodes.json",
        columns: [
            {
                data: "name"
            },
            {
                data: "nodeType"
            },
        ]
    });

    $('#nodes tbody').on('click', 'tr', function () {
        var nodeName = nodeTable.fnGetData(this).name;
        $('h2').text(nodeName);
        /* Estraggo le informazioni relative a questo nodo */
        buildNodeInfoTable(nodeName);
        buildFlowTable(nodeName);
    });

});