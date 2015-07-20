/** Qui vengono raccolte le funzioni di utilità per costruire i grafici **/


/* Questa funzione crea il grafico relativo alla frequenza di utilizzo delle flow entry
 * entries contiene tutti i dati estratti dal json
 */
function buildFrequentEntryChart(entries) {

    /* Costruisco lo scheletro dell'oggetto risultato */
    var chartData = {
        labels: [],
        series: []
    };

    chartData.series[0] = {
        label: 'numero di pacchetti',
        values: []
    }

    // Per prima cosa estraggo le informazioni di interesse dalle righe
    var i;
    for (i = 0; i < entries.length; i++) {

        chartData.labels.push(entries[i].id); // Estraggo l'id
        chartData.series[0].values.push(entries[i].n_packets); // Estraggo il numero di pacchetti

    }

    // Adesso disegno il grafico

    drawChart(chartData, 3);

}

/* Questa funzione aggiorna il grafico relativo alla frequenza delle flow entry
 * filteredRows contiene le righe che sono state filtrate dalla dataTable
 * entries contiene tutti i dati json
 */
function updateFrequentEntryChart(filteredRows, entries) {

    /* Costruisco lo scheletro dell'oggetto risultato */
    var chartData = {
        labels: [],
        series: []
    };

    chartData.series[0] = {
        label: 'numero di pacchetti',
        values: []
    }

    // Per prima cosa estraggo le informazioni di interesse dalle righe
    var i;
    for (i = 0; i < filteredRows.length; i++) {

        var id = $(filteredRows[i].children[1]).html();
        chartData.labels.push(id); // Estraggo l'id

        /* Adesso estraggo il numero di pacchetti  */
        var j;
        var found = false;
        for (j = 0; j < entries.length && !found; j++) {
            if (entries[j].id === id) {
                chartData.series[0].values.push(entries[j].n_packets);
                found = true;
            }
        }

    }

    // Adesso disegno il grafico

    console.log(chartData);
    drawChart(chartData, 3);

}