/** Qui vengono raccolte le funzioni di utilità per costruire i grafici **/


/* Questa funzione crea il grafico relativo alla frequenza di utilizzo delle flow entry
 * entries contiene tutti i dati estratti dal json
 */
function buildFrequentEntryChart(entries) {

    /* Costruisco lo scheletro dell'oggetto risultato */
    var chartData = {
        labels: ['flow id'],
        series: []
    };

    chartData.series[0] = {
        label: 'numero di pacchetti',
        values: [0]
    }

    // Per prima cosa estraggo le informazioni di interesse dalle righe

    var i;
    var data = [];
    for (i = 0; i < entries.length; i++) {
        data.push({
            id: entries[i].id,
            packets: entries[i].n_packets
        });
    }

    data.sort(function (a, b) {
        return b.packets - a.packets
    });


    // Estraggo solo i primi 10 valori (altrimenti la rappresentazione perde di valore)
    data = data.slice(0, 10);

    for (i = 0; i < data.length; i++) {

        chartData.labels.push(data[i].id); // Estraggo l'id
        chartData.series[0].values.push(data[i].packets); // Estraggo il numero di pacchetti

    }


    // Adesso disegno il grafico
    drawChart(chartData, 3);

    /* Aggiungo i tip alle barre */
    $('#chart3 rect').tipsy({
        gravity: 'w',
        html: true,
        title: function () {

            /* Estraggo l'entry corretta */
            var i, entry;
            var found = false;
            for (i = 0; i < entries.length && !found; i++) {
                if (entries[i].id === this.id) {
                    entry = entries[i];
                    found = true;
                }
            }

            var description = "type: " + entry.packetType + "<br>";
            description += "ip in: " + entry.ip_add_in + "<br>";
            description += "ip out: " + entry.ip_add_out + "<br>";
            return description;

        }
    });

    /* Aggiungo l'effetto hover per tutte le barre con i tip */
    $('#chart3 rect').hover(function () {
        $(this).css({
            fill: 'brown'
        });
    }, function (d, i) {
        var color = d3.scale.category20();
        $(this).css({
            fill: color(i % chartData.series.length)
        })
    });
}

/* Questa funzione aggiorna il grafico relativo alla frequenza delle flow entry
 * filteredRows contiene le righe che sono state filtrate dalla dataTable
 * entries contiene tutti i dati json
 */
function updateFrequentEntryChart(filteredRows, entries) {

    var i, j;
    var entriesFiltered = [];
    for (i = 0; i < filteredRows.length; i++) {
        var found = false;
        var id = $(filteredRows[i].children[1]).html();
        for (j = 0; j < entries.length && !found; j++) {
            if (entries[j].id === id) {
                found = true;
                entriesFiltered.push(entries[j]);
            }
        }
    }
    if (entriesFiltered.length > 0) {
        buildFrequentEntryChart(entriesFiltered);
    }

}


/* Questa funzione crea il grafico relativo all'utilizzo delle porte
 * entries contiene tutti i dati estratti dal json
 */
function buildPortUseChart(entries) {

    /* Costruisco lo scheletro dell'oggetto risultato */
    var chartData = {
        labels: [],
        series: []
    };

    // Per prima cosa estraggo le informazioni di interesse dalle righe
    var i;

    // Aggiungo tutte le porte di output presenti alle labels
    for (i = 0; i < entries.length; i++) {

        var outputPosition = entries[i].actions.indexOf('output:');
        if (outputPosition !== -1) {
            /* Se entro qui la flow entry reindirizza un pacchetto verso un'uscita */
            var firstSpace = entries[i].actions.indexOf(' ', outputPosition);
            if (firstSpace === -1) {
                firstSpace = entries[i].actions.length;
            }
            var outPort = entries[i].actions.substring(outputPosition + 7, firstSpace);
            if ($.inArray(outPort, chartData.labels) === -1) {

                chartData.labels.push(outPort);
            }
        }
    }

    chartData.labels.sort();
    chartData.labels.unshift('Porta');


    for (i = 0; i < entries.length; i++) {

        // Calcolo la porta di uscita se è stata definita
        var outputPosition = entries[i].actions.indexOf('output:');
        if (outputPosition !== -1) {

            var firstSpace = entries[i].actions.indexOf(' ', outputPosition);
            if (firstSpace === -1) {
                firstSpace = entries[i].actions.length;
            }
            var outPort = entries[i].actions.substring(outputPosition + 7, firstSpace);

            // Voglio estrarre il prefisso dell'indirizzo del pacchetto

            var netmask = '24'; // Di default ho una /24

            /* Estraggo l'eventuale netmask dall'indirizzo ip */
            var netmaskPosition = entries[i].ip_add_in.indexOf('/');

            if (netmaskPosition !== -1) {
                netmask = entries[i].ip_add_in.substring(netmaskPosition + 1, entries[i].ip_add_in.length);
            }


            /* Calcolo il prefisso utilizzando un'apposita libreria */
            IPv4_Address(entries[i].ip_add_in, netmask);
            var network = this.netaddressDotQuad + '/' + netmask;

            var j;
            var found = false;
            /* Riempio i dati del grafico */
            for (j = 0; j < chartData.series.length && !found; j++) {
                if (chartData.series[j].label === network) { // Cerco i dati relativi alla netmask appena trovata
                    found = true;
                    var portIndex = $.inArray(outPort, chartData.labels); // Prendo l'indice della porta
                    chartData.series[j].values[portIndex] += parseInt(entries[i].n_packets);
                }
            }

            /* Se l'entry non era presente la aggiungo adesso */
            if (!found) {
                var data = {
                    label: network,
                    values: []
                };
                var z;
                for (z = 0; z < chartData.labels.length; z++) {
                    if (chartData.labels[z] === outPort) {
                        data.values[z] = parseInt(entries[i].n_packets);
                    } else {
                        data.values[z] = 0;
                    }
                }

                chartData.series.push(data);
            }
        }
    }

    if (chartData.series.length > 1) {
        // Aggiungo le somme dei valori trovati
        var data = {
            label: 'Somma',
            values: []
        }

        for (z = 0; z < chartData.labels.length; z++) {
            data.values[z] = 0;
        }

        for (z = 0; z < chartData.series.length; z++) {
            for (j = 0; j < chartData.series[z].values.length; j++) {
                data.values[j] += chartData.series[z].values[j];
            }
        }
        chartData.series.push(data);
    }


    // Adesso disegno il grafico
    drawChart(chartData, 2, 40);

}

/* Questa funzione aggiorna il grafico relativo alla frequenza delle flow entry
 * filteredRows contiene le righe che sono state filtrate dalla dataTable
 * entries contiene tutti i dati json
 */
function updatePortUseChart(filteredRows, entries) {
    var i, j;
    var entriesFiltered = [];
    for (i = 0; i < filteredRows.length; i++) {
        var found = false;
        var id = $(filteredRows[i].children[1]).html();
        for (j = 0; j < entries.length && !found; j++) {
            if (entries[j].id === id) {
                found = true;
                entriesFiltered.push(entries[j]);
            }
        }
    }

    if (entriesFiltered.length > 0) {
        buildPortUseChart(entriesFiltered);
    }
}

/** Questa funzione disegna il quarto grafico, relativo all'andamento del numero di pacchetti sulle varie flow entry **/
function buildFocusContextChart(entries) {

    d3.csv("/json/data.csv", type, function (error, data) {
        //console.log(type);
        console.log(data);
        console.log(error);
        drawFocusContextChart(data)
    });


}

/** Questa funzione aggiorna il quarto grafico, relativo all'andamento del numero di pacchetti sulle varie flow entry **/
function updateFocusContextChart(filteredRows, entries) {
    var i, j;
    var entriesFiltered = [];
    for (i = 0; i < filteredRows.length; i++) {
        var found = false;
        var id = $(filteredRows[i].children[1]).html();
        for (j = 0; j < entries.length && !found; j++) {
            if (entries[j].id === id) {
                found = true;
                entriesFiltered.push(entries[j]);
            }
        }
    }

    if (entriesFiltered.length > 0) {
        buildFocusContextChart(entriesFiltered);
    }
}

var parseDate = d3.time.format("%b %Y").parse;

function type(d) {
    d.date = parseDate(d.date);
    d.price = +d.price;
    return d;
}