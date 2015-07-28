/** Costruisco la tabella con il dettaglio delle informazioni sui nodi **/
function buildNodeInfoTable(nodeName) {
    /* Rimuovo la tabella con le informazioni sul nodo */
    $('#nodeInfo').remove();
    $('#nodeInfoSeparator').remove();
    $.getJSON("json/JSONNodes2.json", function (json) {

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
        '<td>Priority: </td>' +
        '<td>' + d.priority + '</td>' +
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
        '<td>Mac in: </td>' +
        '<td>' + d.dl_src + '</td>' +
        '</tr>' +

        '<tr>' +
        '<td>Mac out: </td>' +
        '<td>' + d.dl_dst + '</td>' +
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
    $('#chartcontainer').remove();
    $('#flowButton').remove();
    $('br.toRemove').remove();

    $.getJSON("json/JSONFlows2.json", function (json) {
        /* Prendo le flow entry dello switch che mi interessa */
        entries = json[nameNode];
        if (entries != undefined) {
            $('#content').append($('<button></button>').attr({
                class: 'btn',
                id: 'flowButton',
                'data-toggle': "collapse",
                'data-target': "#flows_wrapper",
                'aria-expanded': "true",
                'aria-controls': "collapseExample",
            }));

            $('#flowButton').text("Mostra/Nascondi la tabella dei flussi");

            $('#content').append('<br class="toRemove"><br class="toRemove">');


            /* Aggiungo la tabella dei flussi alla pagina */
            $('#content').append($('<table></table>').attr({
                id: 'flows',
                class: 'table table-striped table-bordered table-condensed table-hover',
                cellspacing: '0',
                width: '100%'
            }));

            /* Aggiungo i grafici sotto alla tabella */
            addGraphContent();

            // Costruisco i grafici 
            //            d3.json("json/flare1.json", function (json) {
            //                buildTreeGraph(entries, nameNode);
            //            });

            setTimeout(function () {
                buildTreeGraph(entries, nameNode);
            }, 0);

            buildPortUseChart(entries);
            buildFrequentEntryChart(entries);
            buildFocusContextChart(entries);

            /* Aggiungo il footer alla tabella (necessario per i filtri) */
            $('#flows').append('<tfoot><tr><th></th><th></th><th>Table</th><th>Type</th><th>In port</th>' +
                '<th>Duration</th><th>Priority</th><th>mac in</th><th>mac out</th><th>actions</th></tr></tfoot>')


            var table = $('#flows').DataTable({
                /* Aggiungo i dati veri e propri */
                "data": entries,
                //"responsive": true,
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
                        "orderDataType": "numeric",
                        orderable: false

                    },
                    {
                        "title": "Table",
                        "orderDataType": "numeric",
                        "data": "table"

                    },
                    {
                        "title": "Type",
                        "data": "packetType"

                    },
                    {
                        "title": "In port",
                        "orderDataType": "numeric",
                        "data": "in_port"

                    },
                    {
                        "title": "Duration",
                        "data": "duration"
                    },
                    {
                        "title": "Numero di pacchetti",
                        "orderDataType": "numeric",
                        "data": "n_packets",
                    },
                    {
                        "title": "ip in",
                        "data": "ip_add_in",
                    },
                    {
                        "title": "ip out",
                        "data": "ip_add_out",
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
                            // Se sto prendendo l'id allora ordino gli elementi della select in modo diverso
                            if (columnIndex === 2) {
                                var i;
                                for (i = 0; i < column.data().length; i++) {
                                    select.append('<option value="' + parseInt(column.data()[i]) + '">' + parseInt(column.data()[i]) +
                                        '</option>')
                                }
                            } else if (columnIndex === 7) {
                                // Se sto prendendo il numero di pacchetti ordino gli elementi della select in modo diverso
                                var tmp = [];
                                var i;
                                var uniqueValues = column.data().unique();
                                for (i = 0; i < uniqueValues.length; i++) {
                                    tmp.push(parseInt(uniqueValues[i]));
                                }
                                tmp.sort(function (a, b) {
                                    return a - b;
                                });
                                tmp.forEach(function (d) {
                                    select.append('<option value="' + d + '">' + d + '</option>');
                                });
                            } else {
                                column.data().unique().sort().each(function (d, j) {
                                    select.append('<option value="' + d + '">' + d + '</option>')
                                });
                            }
                        }
                    });
                },
            });

            /* Aggiungo la tabella dei flussi alla pagina */
            $('#flows_wrapper').attr({
                class: 'dataTables_wrapper form-inline dt-bootstrap collapse in',
                'aria-expanded': 'true',
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

            /* Prendo i dati per ogni ricerca */
            $('#flows').on('search.dt', function () {
                var filteredRows = table.$('tr', {
                    "filter": "applied"
                });

                var i;
                for (i = 0; i < filteredRows.length; i++) {
                    var child = filteredRows[i].children[1];
                }

                /* Rifaccio il grafico con i dati aggiornati */
                $('#chartcontainer').remove();
                addGraphContent();
                updatePortUseChart(filteredRows, entries);
                updateFrequentEntryChart(filteredRows, entries);

                // //DEBUG!!
                // d3.json("json/flare1.json", function (json) {
                //     buildTree(json);
                // });

                updateTreeGraph(filteredRows, entries, nameNode);
                updateFocusContextChart(filteredRows, entries);

            });

        }

    });
}

/** Questa funzione aggiunge gli elementi che si occupano del disegno dei grafici **/
function addGraphContent() {
    $('#content').append($('<div></div>').attr({
        id: 'chartcontainer',
    }));

    $('#chartcontainer').append($('<hr>'));

    $('#chartcontainer').append($('<h3></h3>').attr({
        id: 'chart1title',
    }));

    $('#chart1title').html("Albero di matching");


    $('#chartcontainer').append($('<svg></svg>').attr({
        id: 'chart1',
        class: 'chart',
    }));

    $('#chartcontainer').append($('<hr>'));

    $('#chartcontainer').append($('<h3></h3>').attr({
        id: 'chart2title',
    }));

    $('#chart2title').html("Pacchetti inoltrati per ogni porta di uscita<br><br>");


    $('#chartcontainer').append($('<svg></svg>').attr({
        id: 'chart2',
        class: 'chart',
    }));

    $('#chartcontainer').append($('<hr>'));

    $('#chartcontainer').append($('<h3></h3>').attr({
        id: 'chart3title',
    }));

    $('#chart3title').html("Numero di pacchetti per le prime dieci flow entry<br><br>");

    $('#chartcontainer').append($('<svg></svg>').attr({
        id: 'chart3',
        class: 'chart',
    }));

    $('#chartcontainer').append($('<hr>'));

    $('#chartcontainer').append($('<h3></h3>').attr({
        id: 'chart4title',
    }));

    $('#chart4title').html("Andamento del numero di pacchetti per flows<br><br>");

    $('#chartcontainer').append($('<svg></svg>').attr({
        id: 'chart4',
        class: 'chart',
    }));



}