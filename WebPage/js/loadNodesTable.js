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
        ],
        "order": [[1, 'desc']],
    });

    $('#nodes tbody').on('click', 'tr', function () {
        var nodeName = nodeTable.fnGetData(this).name;
        $('h2').text(nodeName);
        /* Estraggo le informazioni relative a questo nodo */
        buildNodeInfoTable(nodeName);
        buildFlowTable(nodeName);
    });

    //Ricalcolo la larghezza delle colonne (così sistemo un bug sullo scrollX)
    var table = $('#nodes').DataTable();
    table.columns.adjust().draw();
});