$(document).ready(function () {
    var nodeTable = $('#nodes').dataTable({
        ajax: "../json/JSONNodes2.json",
        "scrollY": "200px",
        "scrollCollapse": true,
        "paging": false,
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

    /* Creo la seconda tabella dei nodi */
    var nodeTable2 = $('#nodes2').dataTable({
        ajax: "../json/JSONNodes.json",
        "scrollY": "200px",
        "scrollCollapse": true,
        "paging": false,
        columns: [
            {
                data: "name"
            },
            {
                data: "nodeType"
            },
        ]
    });

    $('#nodes2 tbody').on('click', 'tr', function () {
        var nodeName = nodeTable2.fnGetData(this).name;
        $('h2').text(nodeName);
        /* Estraggo le informazioni relative a questo nodo */
        buildNodeInfoTableAdvanced(nodeName);
        buildFlowTableAdvanced(nodeName);
    });

    $('#nodes2_wrapper').hide();


});