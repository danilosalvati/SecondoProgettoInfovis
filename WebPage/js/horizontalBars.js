/** Questa funzione disegna un horizontal bar chart **/
function drawChart(chartData, chartNumber, gapBetweenGroups) {

    var chartWidth = 600,
        barHeight = 20,
        groupHeight = barHeight * chartData.series.length,
        spaceForLabels = 100,
        spaceForLegend = 170;

    if (gapBetweenGroups === undefined) {
        gapBetweenGroups = 10;
    }

    // Zip the series data together (first values, second values, etc.)
    var zippedData = [];
    for (var i = 0; i < chartData.labels.length; i++) {
        for (var j = 0; j < chartData.series.length; j++) {
            zippedData.push(chartData.series[j].values[i]);
        }
    }

    // Color scale
    var color = d3.scale.category20();
    var chartHeight = barHeight * zippedData.length + gapBetweenGroups * chartData.labels.length;

    var x = d3.scale.linear()
        .domain([0, d3.max(zippedData)])
        .range([10, chartWidth]);

    var y = d3.scale.linear()
        .range([chartHeight + gapBetweenGroups, 0]);

    var yAxis = d3.svg.axis()
        .scale(y)
        .tickFormat('')
        .tickSize(0)
        .orient("left");

    // Specify the chart area and dimensions
    var chart = d3.select("#chart" + chartNumber)
        //.attr("width", spaceForLabels + chartWidth + spaceForLegend)
        .attr("width", 1000)
        .attr("height", chartHeight);

    //        var chart = d3.select(".chart")
    //         .attr("width", spaceForLabels + chartWidth + spaceForLegend)
    //         .attr("height", chartHeight);

    // Create bars
    var bar = chart.selectAll("g")
        .data(zippedData)
        .enter().append("g")
        .attr("transform", function (d, i) {
            return "translate(" + spaceForLabels + "," + (i * barHeight + gapBetweenGroups * (0.5 + Math.floor(i / chartData.series.length))) + ")";
        });

    // Create rectangles of the correct width
    bar.append("rect")
        .attr("fill", function (d, i) {
            return color(i % chartData.series.length);
        })
        .attr("class", "bar")
        .attr("id", function (d, i) {
            if (chartData.labels !== undefined) {
                return chartData.labels[i];
            }
            return "";
        })
        //.attr("width", x)
        .attr("width", function (d, i) {
            if (i < chartData.series.length) {
                //Escludo l'etichetta dell'asse
                return 0;
            }
            return x(d);
        })
        .attr("height", barHeight - 1)

    // Add text label in bar
    bar.append("text")
        .attr("x", function (d) {
            return x(d) - 3;
        })
        .attr("y", barHeight / 2)
        .attr("class", "chart")
        .attr("fill", "red")
        .attr("dy", ".35em")
        .text(function (d, i) {
            if (i < chartData.series.length) {
                return "";
            }
            return d;
        });

    // Draw labels
    bar.append("text")
        .attr("class", "label")
        .attr("x", function (d) {
            return -10;
        })
        .attr("y", groupHeight / 2)
        .attr("dy", ".35em")
        .text(function (d, i) {
            if (i % chartData.series.length === 0)
                return chartData.labels[Math.floor(i / chartData.series.length)];
            else
                return ""
        });

    chart.append("g")
        .attr("class", "y axis")
        .attr("transform", "translate(" + spaceForLabels + ", " + -gapBetweenGroups / 2 + ")")
        .call(yAxis);

    // Draw legend
    var legendRectSize = 18,
        legendSpacing = 4;

    var legend = chart.selectAll('.legend')
        .data(chartData.series)
        .enter()
        .append('g')
        .attr('transform', function (d, i) {
            var height = legendRectSize + legendSpacing;
            var offset = -gapBetweenGroups / 2;
            var horz = spaceForLabels + chartWidth + 40 - legendRectSize;
            var vert = i * height - offset;
            return 'translate(' + horz + ',' + vert + ')';
        });

    legend.append('rect')
        .attr('width', legendRectSize)
        .attr('height', legendRectSize)
        .style('fill', function (d, i) {
            return color(i);
        })
        .style('stroke', function (d, i) {
            return color(i);
        });

    legend.append('text')
        .attr('class', 'legend')
        .attr('x', legendRectSize + legendSpacing)
        .attr('y', legendRectSize - legendSpacing)
        .text(function (d) {
            return d.label;
        });

    // Fondamentale per risolvere un bug di juery che non aggiunge gli svg
    // http://stackoverflow.com/a/13654655
    $("#chartcontainer").html($("#chartcontainer").html());
}