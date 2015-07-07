/** Costruisco la tabella con il dettaglio delle informazioni sui nodi **/
function buildNodeInfoTable(nodeName) {
    /* Rimuovo la tabella con le informazioni sul nodo */
    $('#nodeInfo').remove();
    $('#nodeInfoSeparator').remove();
    $.getJSON("../json/JSONNodes.json", function (json) {

        /* estraggo solo le informazioni relative al nodo di interesse */
        for (var node of json.data) {
            if (node.name === nodeName) {
                /* Costruisco la tabella con le informazioni */
                var table = $('<table></table>').addClass('table table-hover').attr({
                    id: 'nodeInfo'
                }).css("width", "30%");

                var row = $('<tr></tr>');
                row.append($('<td></td>').text("Name:").css("font-weight", "Bold"));
                row.append($('<td></td>').text(node.name));
                table.append(row);

                row = $('<tr></tr>');
                row.append($('<td></td>').text("Node type:").css("font-weight", "Bold"));
                row.append($('<td></td>').text(node.nodeType));
                table.append(row);

                row = $('<tr></tr>');
                row.append($('<td></td>').text("Interfaces:").css("font-weight", "Bold"));

                var interfaceString = ""
                for (var prop in node.interfaces) {
                    if (node.interfaces.hasOwnProperty(prop)) {
                        interfaceString += prop + ": " + node.interfaces[prop] + "<br>";
                    }
                }
                row.append($('<td></td>').html(interfaceString));
                table.append(row);
                $('#content').append(table);
                $('#content').append($('<hr>').attr({
                    id: 'nodeInfoSeparator'
                }));
            }
        }
    });
}

function format(d) {
    // `d` is the original data object for the row
    return '<table cellpadding="5" cellspacing="0" border="0" style="padding-left:50px;" class = "table table-striped table-hover table-condensed">' +
        '<tr>' +
        '<td>Numero di pacchetti: </td>' +
        '<td>' + d.n_packets + '</td>' +
        '</tr>' +

        '<tr>' +
        '<td>Idle Timeout: </td>' +
        '<td>' + d.idle_timeout + '</td>' +
        '</tr>' +

        '<tr>' +
        '<td>vlan: </td>' +
        '<td>' + d.vlan_tci + '</td>' +
        '</tr>' +

        '<tr>' +
        '<td>Bytes: </td>' +
        '<td>' + d.n_bytes + '</td>' +
        '</tr>' +

        '<tr>' +
        '<td>Ip in: </td>' +
        '<td>' + d.ip_add_in + '</td>' +
        '</tr>' +

        '<tr>' +
        '<td>Ip out: </td>' +
        '<td>' + d.ip_add_out + '</td>' +
        '</tr>' +

        '<tr>' +
        '<td>Cookie: </td>' +
        '<td>' + d.cookie + '</td>' +
        '</tr>' +
        '</table>';
}

/** Costruisce la tabella delle flow entry per un particolare switch **/
function buildFlowTable(nameNode) {
    $('#flows').DataTable().destroy();
    $('#flows').remove();

    $.getJSON("../json/JSONFlows.json", function (json) {
        /* Prendo le flow entry dello switch che mi interessa */
        entries = json[nameNode];
        if (entries != undefined) {


            /* Aggiungo la tabella dei flussi alla pagina */
            $('#content').append($('<table></table>').attr({
                id: 'flows',
                class: 'table table-striped table-bordered table-condensed table-hover',
                cellspacing: '0',
                width: '100%'
            }));

            /* Aggiungo il footer alla tabella (necessario per i filtri) */
            $('#flows').append('<tfoot><tr><th></th><th></th><th>Table</th><th>Type</th><th>In port</th>' +
                '<th>Duration</th><th>Priority</th><th>mac in</th><th>mac out</th><th>actions</th></tr></tfoot>')


            var table = $('#flows').DataTable({
                /* Aggiungo i dati veri e propri */
                "data": entries,
                //                "responsive": true,
                "scrollX": true,
                "columns": [
                    {
                        "className": 'details-control',
                        "orderable": false,
                        "data": null,
                        "defaultContent": ''
},
                    {
                        "title": "Id",
                        "data": "id",
                        orderable: false

                    },
                    {
                        "title": "Table",
                        "data": "table"

                    },
                    {
                        "title": "Type",
                        "data": "packetType"

                    },
                    {
                        "title": "In port",
                        "data": "in_port"

                    },
                    {
                        "title": "Duration",
                        "data": "duration"
                    },
                    {
                        "title": "Priority",
                        "data": "priority",
                    },
                    {
                        "title": "mac in",
                        "data": "dl_src",
                    },
                    {
                        "title": "mac out",
                        "data": "dl_dst",
                    },
                    {
                        "title": "actions",
                        "data": "actions",
                    }
        ],
                "order": [[2, 'asc']],
                /* Aggiungo le select per i filtri */
                "initComplete": function () {
                    var columnIndex = 0;
                    this.api().columns().every(function () {
                        var column = this;
                        columnIndex++;
                        if (columnIndex > 1) {
                            var select = $('<select><option value=""></option></select>')
                                .appendTo($(column.footer()).empty())
                                .on('change', function () {
                                    var val = $.fn.dataTable.util.escapeRegex(
                                        $(this).val()
                                    );

                                    column
                                        .search(val ? '^' + val + '$' : '', true, false)
                                        .draw();
                                });

                            column.data().unique().sort().each(function (d, j) {
                                select.append('<option value="' + d + '">' + d + '</option>')
                            });
                        }
                    });
                },
            });

            // Add event listener for opening and closing details
            $('#flows tbody').on('click', 'td.details-control', function () {
                var tr = $(this).closest('tr');
                var row = table.row(tr);

                if (row.child.isShown()) {
                    // This row is already open - close it
                    row.child.hide();
                    tr.removeClass('shown');
                } else {
                    // Open this row
                    row.child(format(row.data())).show();
                    tr.addClass('shown');
                }
            });

        }

    });
}